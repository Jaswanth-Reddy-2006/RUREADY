import { describe, expect, it, vi, beforeEach } from 'vitest';
import { roadmapController } from '../../services/roadmap-service/src/controllers/roadmap.controller.js';
import { skillReadinessService } from '../../services/roadmap-service/src/services/skill-readiness.service.js';
import { prisma } from '../../services/roadmap-service/src/lib/prisma.js';
import { ForbiddenError, NotFoundError } from '../../services/roadmap-service/src/lib/errors.js';

describe('Stage 5.6: Readiness Score Synchronization & Skill Graph Calibration', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  function createMockReqRes(options: {
    headers?: Record<string, string | string[] | undefined>;
    params?: Record<string, string>;
    query?: Record<string, string>;
    body?: any;
  }) {
    const req: any = {
      headers: options.headers || {},
      params: options.params || {},
      query: options.query || {},
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

  const mockUserRoadmapData = {
    id: 'ur-56-1',
    userId: 'user-readiness-1',
    sourceRoadmapId: 'rm-56-1',
    personalization: {
      targetRole: 'FULLSTACK',
      hoursPerDay: 2,
      daysPerWeek: 5,
      sprintDurationDays: 7,
    },
    sourceRoadmap: {
      id: 'rm-56-1',
      rolePath: 'FULLSTACK',
      targetCompanyTier: 'FAANG',
      overallReadiness: 25,
      estimatedWeeks: 12,
      nodes: [
        {
          id: 'node-1',
          title: 'JavaScript Core',
          targetProficiency: 85,
          skills: [{ skill: { id: 'javascript', slug: 'javascript', name: 'JavaScript', category: 'Frontend Core' } }],
        },
        {
          id: 'node-2',
          title: 'React Architecture',
          targetProficiency: 85,
          skills: [{ skill: { id: 'react', slug: 'react', name: 'React', category: 'Frontend Core' } }],
        },
      ],
    },
    sprints: [
      {
        id: 'sprint-1',
        sprintNumber: 1,
        status: 'COMPLETED',
        tasks: [
          {
            id: 't-1',
            status: 'COMPLETED',
            skillId: 'javascript',
            roadmapNode: {
              skills: [{ skill: { id: 'javascript', slug: 'javascript', name: 'JavaScript' } }],
            },
          },
        ],
      },
    ],
    skillEvidence: [
      {
        id: 'ev-1',
        skillId: 'javascript',
        source: 'PROJECT',
        demonstratedScore: 90,
        metadata: { practicalDrill: true },
        skill: { id: 'javascript', slug: 'javascript', name: 'JavaScript', category: 'Frontend Core' },
      },
    ],
  };

  const mockAttempts = [
    {
      id: 'att-1',
      score: 85,
      passed: true,
      skillId: 'javascript',
      skill: { id: 'javascript', slug: 'javascript', name: 'JavaScript', category: 'Frontend Core' },
    },
  ];

  describe('1. Skill Performance Derived From Verified Telemetry', () => {
    it('calibrates skill proficiency from verified MCQ and practical drill evidence', async () => {
      vi.spyOn(prisma.userRoadmap, 'findUnique').mockResolvedValue(mockUserRoadmapData as any);
      vi.spyOn(prisma.microAssessmentAttempt, 'findMany').mockResolvedValue(mockAttempts as any);

      const report = await skillReadinessService.calculateRoadmapReadiness('user-readiness-1', 'ur-56-1');

      expect(report.userRoadmapId).toBe('ur-56-1');
      expect(report.targetRole).toBe('FULLSTACK');
      expect(report.overallReadiness).toBeGreaterThan(0);

      const jsSkill = report.skills.find((s) => s.skillId === 'javascript');
      expect(jsSkill).toBeDefined();
      expect(jsSkill?.mcqScore).toBe(85);
      expect(jsSkill?.practicalScore).toBe(90);
      expect(jsSkill?.status).toBe('MASTERED');
    });
  });

  describe('2. Missing Signals Remain NOT_APPLICABLE', () => {
    it('returns mcqScore: null and practicalScore: null when no tests exist', async () => {
      vi.spyOn(prisma.userRoadmap, 'findUnique').mockResolvedValue(mockUserRoadmapData as any);
      vi.spyOn(prisma.microAssessmentAttempt, 'findMany').mockResolvedValue(mockAttempts as any);

      const report = await skillReadinessService.calculateRoadmapReadiness('user-readiness-1', 'ur-56-1');

      // React has no assessment or practical drill yet
      const reactSkill = report.skills.find((s) => s.skillId === 'react');
      expect(reactSkill).toBeDefined();
      expect(reactSkill?.mcqScore).toBeNull();
      expect(reactSkill?.practicalScore).toBeNull();
      expect(reactSkill?.status).toBe('NO_EVIDENCE');
    });
  });

  describe('3. Verified Evidence Affects Skill Readiness', () => {
    it('elevates skill status to IN_PROGRESS or DEMONSTRATED with evidence', async () => {
      const roadmapWithEvidence = {
        ...mockUserRoadmapData,
        skillEvidence: [
          {
            id: 'ev-react',
            skillId: 'react',
            source: 'PROJECT',
            demonstratedScore: 75,
            metadata: { practicalDrill: true },
            skill: { id: 'react', slug: 'react', name: 'React', category: 'Frontend Core' },
          },
        ],
      };

      vi.spyOn(prisma.userRoadmap, 'findUnique').mockResolvedValue(roadmapWithEvidence as any);
      vi.spyOn(prisma.microAssessmentAttempt, 'findMany').mockResolvedValue([]);

      const report = await skillReadinessService.calculateRoadmapReadiness('user-readiness-1', 'ur-56-1');

      const reactSkill = report.skills.find((s) => s.skillId === 'react');
      expect(reactSkill).toBeDefined();
      expect(reactSkill?.practicalScore).toBe(75);
      expect(reactSkill?.evidenceCount).toBe(1);
      expect(reactSkill?.status).toBe('DEMONSTRATED');
    });
  });

  describe('4. Failed Assessment Does Not Falsely Mark Mastery', () => {
    it('sets status to IN_PROGRESS and does NOT mark MASTERED when assessment is failed (< 70)', async () => {
      const failedAttempts = [
        {
          id: 'att-fail',
          score: 45,
          passed: false,
          skillId: 'javascript',
          skill: { id: 'javascript', slug: 'javascript', name: 'JavaScript', category: 'Frontend Core' },
        },
      ];

      const roadmapNoPractical = {
        ...mockUserRoadmapData,
        skillEvidence: [],
      };

      vi.spyOn(prisma.userRoadmap, 'findUnique').mockResolvedValue(roadmapNoPractical as any);
      vi.spyOn(prisma.microAssessmentAttempt, 'findMany').mockResolvedValue(failedAttempts as any);

      const report = await skillReadinessService.calculateRoadmapReadiness('user-readiness-1', 'ur-56-1');

      const jsSkill = report.skills.find((s) => s.skillId === 'javascript');
      expect(jsSkill).toBeDefined();
      expect(jsSkill?.mcqScore).toBe(45);
      expect(jsSkill?.status).not.toBe('MASTERED');
      expect(jsSkill?.status).not.toBe('DEMONSTRATED');
    });
  });

  describe('5. Failed Practical Does Not Falsely Mark Mastery', () => {
    it('does NOT mark MASTERED when practical drill score is low (< 70)', async () => {
      const roadmapLowDrill = {
        ...mockUserRoadmapData,
        skillEvidence: [
          {
            id: 'ev-low',
            skillId: 'javascript',
            source: 'PROJECT',
            demonstratedScore: 50,
            metadata: { practicalDrill: true },
            skill: { id: 'javascript', slug: 'javascript', name: 'JavaScript', category: 'Frontend Core' },
          },
        ],
      };

      vi.spyOn(prisma.userRoadmap, 'findUnique').mockResolvedValue(roadmapLowDrill as any);
      vi.spyOn(prisma.microAssessmentAttempt, 'findMany').mockResolvedValue([]);

      const report = await skillReadinessService.calculateRoadmapReadiness('user-readiness-1', 'ur-56-1');

      const jsSkill = report.skills.find((s) => s.skillId === 'javascript');
      expect(jsSkill?.status).not.toBe('MASTERED');
    });
  });

  describe('6. Skill Graph DAG Prerequisite Gating', () => {
    it('gates advanced skill mastery when prerequisite skills have missing competencies', async () => {
      // In the Stage 2 taxonomy: react has prerequisite 'javascript'
      // If javascript has no evidence (score 0), react cannot be MASTERED even if user did a drill
      const roadmapWithOnlyAdvanced = {
        ...mockUserRoadmapData,
        skillEvidence: [
          {
            id: 'ev-react-adv',
            skillId: 'react',
            source: 'PROJECT',
            demonstratedScore: 95,
            metadata: { practicalDrill: true },
            skill: { id: 'react', slug: 'react', name: 'React', category: 'Frontend Core' },
          },
        ],
      };

      vi.spyOn(prisma.userRoadmap, 'findUnique').mockResolvedValue(roadmapWithOnlyAdvanced as any);
      vi.spyOn(prisma.microAssessmentAttempt, 'findMany').mockResolvedValue([]);

      const report = await skillReadinessService.calculateRoadmapReadiness('user-readiness-1', 'ur-56-1');

      const reactSkill = report.skills.find((s) => s.skillId === 'react');
      expect(reactSkill).toBeDefined();
      expect(reactSkill?.prerequisites).toContain('javascript');
      expect(reactSkill?.isGatedByPrerequisites).toBe(true);
      expect(reactSkill?.missingPrerequisites).toContain('JavaScript');
      // Gated proficiency is capped to <= 60 and not MASTERED
      expect(reactSkill?.currentProficiency).toBeLessThanOrEqual(60);
      expect(reactSkill?.status).not.toBe('MASTERED');
    });
  });

  describe('7. Server-Authoritative & Security Controls', () => {
    it('throws ForbiddenError when accessing another user roadmap readiness', async () => {
      vi.spyOn(prisma.userRoadmap, 'findUnique').mockResolvedValue(mockUserRoadmapData as any);

      await expect(
        skillReadinessService.calculateRoadmapReadiness('unauthorized-user-999', 'ur-56-1')
      ).rejects.toThrow(ForbiddenError);
    });

    it('returns 403 Forbidden in controller on cross-user request', async () => {
      vi.spyOn(prisma.userRoadmap, 'findUnique').mockResolvedValue(mockUserRoadmapData as any);

      const { req, res, next } = createMockReqRes({
        headers: { 'x-user-id': 'unauthorized-user-999' },
        params: { userRoadmapId: 'ur-56-1' },
      });

      await roadmapController.getRoadmapReadiness(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError));
    });
  });

  describe('8. API Endpoint Returns Complete Calibrated Analytics', () => {
    it('returns GET /adaptive/:userRoadmapId/readiness with 200 and analytics payload', async () => {
      vi.spyOn(prisma.userRoadmap, 'findUnique').mockResolvedValue(mockUserRoadmapData as any);
      vi.spyOn(prisma.microAssessmentAttempt, 'findMany').mockResolvedValue(mockAttempts as any);

      const { req, res, next, getStatusCode, getJsonResponse } = createMockReqRes({
        headers: { 'x-user-id': 'user-readiness-1' },
        params: { userRoadmapId: 'ur-56-1' },
      });

      await roadmapController.getRoadmapReadiness(req, res, next);

      expect(getStatusCode()).toBe(200);
      const json = getJsonResponse();
      expect(json.success).toBe(true);
      expect(json.data.userRoadmapId).toBe('ur-56-1');
      expect(json.data.domains).toBeDefined();
      expect(json.data.domains.length).toBeGreaterThan(0);
      expect(json.data.skills).toBeDefined();
    });
  });
});
