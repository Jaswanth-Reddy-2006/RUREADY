// ═══════════════════════════════════════════════════════════════
// Stage 8.2: Cross-Service Interview Telemetry Ingress Tests
// Verified Telemetry Ingress, Skill Normalization, Idempotency,
// Authorization, Learning History, & Error Resilience
// ═══════════════════════════════════════════════════════════════

import { describe, expect, it, vi, beforeEach } from 'vitest';
import {
  InterviewTelemetryService,
  interviewTelemetryService,
} from '../../services/roadmap-service/src/services/interview-telemetry.service.js';
import { roadmapController } from '../../services/roadmap-service/src/controllers/roadmap.controller.js';
import {
  InterviewTelemetryIngressDTO,
  deriveRoadmapLearningHistory,
  normalizeSkillName,
} from '../../packages/shared/src/types/index.js';
import {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
} from '../../services/roadmap-service/src/lib/errors.js';

describe('Stage 8.2: Cross-Service Interview Telemetry Ingress', () => {
  let service: InterviewTelemetryService;

  const mockUserId = 'usr_learner_802';
  const mockOtherUserId = 'usr_intruder_999';
  const mockUserRoadmapId = 'ur_active_802';

  beforeEach(() => {
    vi.clearAllMocks();
    service = new InterviewTelemetryService();
    service.clearMemoryStore();

    // Seed mock active user roadmap for learner
    service.seedUserRoadmap({
      id: mockUserRoadmapId,
      userId: mockUserId,
      status: 'ACTIVE',
      updatedAt: new Date(),
    });

    // Seed default skills
    service.seedSkill({
      id: 'sk_python',
      name: 'Python',
      slug: 'python',
      category: 'Programming',
    });
    service.seedSkill({
      id: 'sk_react',
      name: 'React',
      slug: 'react',
      category: 'Frontend',
    });
    service.seedSkill({
      id: 'sk_k8s',
      name: 'Kubernetes',
      slug: 'kubernetes',
      category: 'DevOps',
    });
  });

  // ─── A. Mapping & Skill Normalization ─────────────────────────

  describe('A. Mapping & Canonical Skill Normalization', () => {
    it('1. completed oral interview creates valid roadmap skill evidence', async () => {
      const payload: InterviewTelemetryIngressDTO = {
        interviewId: 'oral_sess_101',
        userId: mockUserId,
        userRoadmapId: mockUserRoadmapId,
        interviewType: 'ORAL_INTERVIEW',
        targetRole: 'FULLSTACK',
        overallScore: 85,
        technicalScore: 88,
        communicationScore: 82,
        readinessVerdict: 'READY',
        evaluatedSkills: [
          { skillName: 'Python', score: 90, confidence: 85, notes: 'Solid data structure explanations' },
        ],
        completedAt: '2026-10-04T12:00:00.000Z',
      };

      const result = await service.ingestTelemetry(mockUserId, payload);

      expect(result.success).toBe(true);
      expect(result.interviewId).toBe('oral_sess_101');
      expect(result.evidenceCount).toBe(1);
      expect(result.recordedEvidenceIds.length).toBe(1);
      expect(result.skippedDuplicatesCount).toBe(0);
      expect(result.unmappedSkillsCount).toBe(0);
    });

    it('2. normalizes skill aliases to canonical roadmap taxonomy', async () => {
      const payload: InterviewTelemetryIngressDTO = {
        interviewId: 'coding_sess_202',
        userId: mockUserId,
        userRoadmapId: mockUserRoadmapId,
        interviewType: 'CODING_INTERVIEW',
        targetRole: 'BACKEND',
        overallScore: 92,
        technicalScore: 95,
        evaluatedSkills: [
          { skillName: 'React.js', score: 85 }, // Should normalize to 'React'
          { skillName: 'k8s', score: 80 },      // Should normalize to 'Kubernetes'
          { skillName: 'Postgres', score: 90 }, // Should normalize to 'PostgreSQL'
        ],
      };

      const result = await service.ingestTelemetry(mockUserId, payload);

      expect(result.success).toBe(true);
      expect(result.evidenceCount).toBe(3);
      expect(result.unmappedSkillsCount).toBe(0);
    });

    it('3. safely skips empty or unmapped skill entries without fabricating fake skills', async () => {
      const payload: InterviewTelemetryIngressDTO = {
        interviewId: 'oral_sess_303',
        userId: mockUserId,
        userRoadmapId: mockUserRoadmapId,
        interviewType: 'ORAL_INTERVIEW',
        overallScore: 78,
        evaluatedSkills: [
          { skillName: 'Python', score: 82 },
          { skillName: '   ', score: 50 }, // empty whitespace skill
          { skillName: '', score: 60 },    // empty string
        ],
      };

      const result = await service.ingestTelemetry(mockUserId, payload);

      expect(result.success).toBe(true);
      expect(result.evidenceCount).toBe(1);
      expect(result.unmappedSkillsCount).toBe(2);
    });

    it('4. automatically resolves user active roadmap when userRoadmapId is omitted', async () => {
      const payload: InterviewTelemetryIngressDTO = {
        interviewId: 'oral_sess_404',
        userId: mockUserId,
        interviewType: 'ORAL_INTERVIEW',
        overallScore: 88,
        evaluatedSkills: [{ skillName: 'Python', score: 88 }],
      };

      const result = await service.ingestTelemetry(mockUserId, payload);

      expect(result.success).toBe(true);
      expect(result.userRoadmapId).toBe(mockUserRoadmapId);
      expect(result.evidenceCount).toBe(1);
    });
  });

  // ─── B. Idempotency & Duplicate Prevention ────────────────────

  describe('B. Idempotency & Duplicate Ingestion Protection', () => {
    it('5. duplicate interview telemetry delivery does not create duplicate evidence records', async () => {
      const payload: InterviewTelemetryIngressDTO = {
        interviewId: 'idempotent_sess_505',
        userId: mockUserId,
        userRoadmapId: mockUserRoadmapId,
        interviewType: 'CODING_INTERVIEW',
        overallScore: 90,
        evaluatedSkills: [
          { skillName: 'Python', score: 90 },
          { skillName: 'React', score: 85 },
        ],
      };

      // First ingestion
      const result1 = await service.ingestTelemetry(mockUserId, payload);
      expect(result1.evidenceCount).toBe(2);
      expect(result1.skippedDuplicatesCount).toBe(0);

      // Second ingestion with identical payload
      const result2 = await service.ingestTelemetry(mockUserId, payload);
      expect(result2.success).toBe(true);
      expect(result2.evidenceCount).toBe(0);
      expect(result2.skippedDuplicatesCount).toBe(2);
      expect(result2.recordedEvidenceIds).toEqual(result1.recordedEvidenceIds);
    });
  });

  // ─── C. Security & Authorization ──────────────────────────────

  describe('C. Security & Authorization Enforcement', () => {
    it('6. throws UnauthorizedError if authenticatedUserId is missing', async () => {
      const payload: InterviewTelemetryIngressDTO = {
        interviewId: 'sess_sec_606',
        userId: mockUserId,
        interviewType: 'ORAL_INTERVIEW',
        overallScore: 80,
        evaluatedSkills: [{ skillName: 'Python' }],
      };

      await expect(service.ingestTelemetry('', payload)).rejects.toThrow(UnauthorizedError);
    });

    it('7. throws ForbiddenError if attempting cross-user telemetry injection', async () => {
      const payload: InterviewTelemetryIngressDTO = {
        interviewId: 'sess_sec_707',
        userId: mockOtherUserId, // Mismatched userId
        interviewType: 'ORAL_INTERVIEW',
        overallScore: 80,
        evaluatedSkills: [{ skillName: 'Python' }],
      };

      await expect(service.ingestTelemetry(mockUserId, payload)).rejects.toThrow(ForbiddenError);
    });

    it('8. throws NotFoundError if userRoadmap does not belong to user or does not exist', async () => {
      const payload: InterviewTelemetryIngressDTO = {
        interviewId: 'sess_sec_808',
        userId: mockUserId,
        userRoadmapId: 'ur_nonexistent_999',
        interviewType: 'ORAL_INTERVIEW',
        overallScore: 80,
        evaluatedSkills: [{ skillName: 'Python' }],
      };

      await expect(service.ingestTelemetry(mockUserId, payload)).rejects.toThrow(NotFoundError);
    });
  });

  // ─── D. Input Validation & Error Handling ─────────────────────

  describe('D. Input Validation & Error Handling', () => {
    it('9. throws BadRequestError when interviewId is missing', async () => {
      const payload = {
        userId: mockUserId,
        interviewType: 'ORAL_INTERVIEW',
        overallScore: 80,
        evaluatedSkills: [{ skillName: 'Python' }],
      } as any;

      await expect(service.ingestTelemetry(mockUserId, payload)).rejects.toThrow(BadRequestError);
    });

    it('10. throws BadRequestError when overallScore is out of 0-100 range', async () => {
      const payload: InterviewTelemetryIngressDTO = {
        interviewId: 'sess_val_1010',
        userId: mockUserId,
        interviewType: 'ORAL_INTERVIEW',
        overallScore: 150, // Invalid score
        evaluatedSkills: [{ skillName: 'Python' }],
      };

      await expect(service.ingestTelemetry(mockUserId, payload)).rejects.toThrow(BadRequestError);
    });

    it('11. throws BadRequestError when evaluatedSkills is empty', async () => {
      const payload: InterviewTelemetryIngressDTO = {
        interviewId: 'sess_val_1111',
        userId: mockUserId,
        interviewType: 'ORAL_INTERVIEW',
        overallScore: 80,
        evaluatedSkills: [], // Empty skills array
      };

      await expect(service.ingestTelemetry(mockUserId, payload)).rejects.toThrow(BadRequestError);
    });
  });

  // ─── E. Learning History & Timeline Integration ───────────────

  describe('E. Learning History & Milestone Timeline Integration', () => {
    it('12. seamlessly incorporates interview skill evidence into deriveRoadmapLearningHistory', () => {
      const userRoadmapWithInterviewEvidence = {
        id: 'ur_history_test_12',
        sourceRoadmapId: 'rdmp_hist_12',
        personalization: { targetRole: 'FULLSTACK' },
        sourceRoadmap: { rolePath: 'FULLSTACK', targetCompanyTier: 'FAANG' },
        sprints: [],
        skillEvidence: [
          {
            id: 'ev_oral_1',
            userRoadmapId: 'ur_history_test_12',
            skillId: 'sk_python',
            source: 'ORAL_INTERVIEW',
            demonstratedScore: 88,
            estimatedProficiency: 88,
            confidence: 85,
            externalReference: 'oral_sess_101',
            metadata: {
              interviewId: 'oral_sess_101',
              interviewType: 'ORAL_INTERVIEW',
              overallScore: 85,
              notes: 'Excellent architecture breakdown',
            },
            assessedAt: '2026-10-04T14:00:00.000Z',
            skill: { id: 'sk_python', name: 'Python', category: 'Programming' },
          },
          {
            id: 'ev_coding_2',
            userRoadmapId: 'ur_history_test_12',
            skillId: 'sk_react',
            source: 'CODING_INTERVIEW',
            demonstratedScore: 95,
            estimatedProficiency: 95,
            confidence: 90,
            externalReference: 'coding_sess_202',
            metadata: {
              interviewId: 'coding_sess_202',
              interviewType: 'CODING_INTERVIEW',
              overallScore: 92,
            },
            assessedAt: '2026-10-04T15:00:00.000Z',
            skill: { id: 'sk_react', name: 'React', category: 'Frontend' },
          },
        ],
      };

      const history = deriveRoadmapLearningHistory(userRoadmapWithInterviewEvidence);

      expect(history.totalEvidenceCount).toBe(2);
      expect(history.evidence.length).toBe(2);

      // Verify evidence list
      const oralEv = history.evidence.find((e) => e.source === 'ORAL_INTERVIEW');
      expect(oralEv).toBeDefined();
      expect(oralEv?.skillName).toBe('Python');
      expect(oralEv?.demonstratedScore).toBe(88);

      const codingEv = history.evidence.find((e) => e.source === 'CODING_INTERVIEW');
      expect(codingEv).toBeDefined();
      expect(codingEv?.skillName).toBe('React');
      expect(codingEv?.demonstratedScore).toBe(95);

      // Verify unified chronological timeline items
      expect(history.timeline.length).toBe(2);
      const oralTimeline = history.timeline.find((t) => t.source === 'ORAL_INTERVIEW');
      expect(oralTimeline).toBeDefined();
      expect(oralTimeline?.title).toContain('Oral Interview Evidence: Python');
      expect(oralTimeline?.score).toBe(88);

      const codingTimeline = history.timeline.find((t) => t.source === 'CODING_INTERVIEW');
      expect(codingTimeline).toBeDefined();
      expect(codingTimeline?.title).toContain('Coding Interview Evidence: React');
      expect(codingTimeline?.score).toBe(95);
    });
  });

  // ─── F. Controller Endpoint & Request/Response Integration ────

  describe('F. Controller Ingestion Endpoint', () => {
    function createMockReqRes(options: {
      headers?: Record<string, string | string[] | undefined>;
      params?: Record<string, string>;
      body?: any;
    }) {
      const req: any = {
        headers: options.headers || {},
        params: options.params || {},
        body: options.body || {},
      };

      let statusCode = 200;
      let jsonResponse: any = null;

      const res: any = {
        status: vi.fn((code: number) => {
          statusCode = code;
          return res;
        }),
        json: vi.fn((data: any) => {
          jsonResponse = data;
          return res;
        }),
      };

      const next = vi.fn();

      return {
        req,
        res,
        next,
        getStatusCode: () => statusCode,
        getJsonResponse: () => jsonResponse,
      };
    }

    it('13. controller successfully ingests interview telemetry and returns 200 OK', async () => {
      const mockResult = {
        success: true,
        interviewId: 'ctrl_sess_13',
        userRoadmapId: mockUserRoadmapId,
        evidenceCount: 1,
        recordedEvidenceIds: ['ev_ctrl_1'],
        skippedDuplicatesCount: 0,
        unmappedSkillsCount: 0,
        message: 'Successfully ingested interview telemetry.',
      };

      const spy = vi
        .spyOn(interviewTelemetryService, 'ingestTelemetry')
        .mockResolvedValue(mockResult);

      const { req, res, next, getStatusCode, getJsonResponse } = createMockReqRes({
        headers: { 'x-user-id': mockUserId },
        body: {
          interviewId: 'ctrl_sess_13',
          userId: mockUserId,
          interviewType: 'ORAL_INTERVIEW',
          overallScore: 88,
          evaluatedSkills: [{ skillName: 'Python', score: 88 }],
        },
      });

      await roadmapController.ingestInterviewTelemetry(req, res, next);

      expect(getStatusCode()).toBe(200);
      expect(getJsonResponse()).toEqual({
        success: true,
        data: mockResult,
      });

      spy.mockRestore();
    });

    it('14. controller passes errors to next middleware for unauthenticated requests', async () => {
      const { req, res, next } = createMockReqRes({
        headers: {}, // No x-user-id header
        body: {
          interviewId: 'ctrl_sess_14',
          userId: mockUserId,
          interviewType: 'ORAL_INTERVIEW',
          overallScore: 88,
          evaluatedSkills: [{ skillName: 'Python' }],
        },
      });

      await roadmapController.ingestInterviewTelemetry(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });
  });
});
