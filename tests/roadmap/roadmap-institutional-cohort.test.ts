// ═══════════════════════════════════════════════════════════════
// Stage 11.1: Institutional Cohort Management & Batch Tracking Tests
// Comprehensive Unit, Integration, Security, Privacy & Velocity Test Suite
// ═══════════════════════════════════════════════════════════════

import { describe, expect, it, vi, beforeEach } from 'vitest';
import { institutionalCohortService } from '../../services/roadmap-service/src/services/institutional-cohort.service.js';
import { validateInstitutionalCohortQuery } from '../../services/roadmap-service/src/validators/institutional-cohort.validator.js';
import { roadmapController } from '../../services/roadmap-service/src/controllers/roadmap.controller.js';
import { prisma } from '../../services/roadmap-service/src/lib/prisma.js';
import { UnauthorizedError, ForbiddenError, BadRequestError } from '../../services/roadmap-service/src/lib/errors.js';

describe('Stage 11.1: Institutional Cohort Management & Batch Tracking', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  function createMockReqRes(options: {
    headers?: Record<string, string | string[] | undefined>;
    params?: Record<string, string>;
    query?: Record<string, any>;
    body?: any;
    protocol?: string;
    method?: string;
  }) {
    const req: any = {
      method: options.method || 'GET',
      headers: options.headers || {},
      params: options.params || {},
      query: options.query || {},
      body: options.body || {},
      protocol: options.protocol || 'https',
      get: (headerName: string) => options.headers?.[headerName.toLowerCase()] || 'ruready.dev',
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

  const mockUniversityCandidates = [
    {
      id: 'ur-cand-mit-1',
      userId: 'user-mit-alex',
      sourceRoadmapId: 'rm-distributed-systems',
      status: 'ACTIVE',
      personalization: {
        candidateName: 'Alex Mercer',
        institution: 'MIT',
        college: 'EECS',
        batch: '2026-A',
        graduationYear: 2026,
        branch: 'Computer Science',
        targetRole: 'Distributed Systems Engineer',
        targetCompanyTier: 'FAANG',
      },
      sourceRoadmap: {
        id: 'rm-distributed-systems',
        rolePath: 'Distributed Systems Engineer',
        targetRole: 'Distributed Systems Engineer',
        targetCompanyTier: 'FAANG',
        visibility: 'PUBLIC',
        goal: { id: 'g1', targetRole: 'Distributed Systems Engineer' },
      },
      sprints: [
        {
          id: 'sp-1',
          sprintNumber: 1,
          status: 'COMPLETED',
          tasks: [
            { id: 't-1', status: 'COMPLETED', requiresEvidence: false, requiresAssessment: false },
            { id: 't-2', status: 'COMPLETED', requiresEvidence: true, requiresAssessment: true },
          ],
          performance: { id: 'p-1', taskCompletion: 100, assessmentScore: 90, practicalScore: 92 },
        },
        {
          id: 'sp-2',
          sprintNumber: 2,
          status: 'ACTIVE',
          tasks: [
            { id: 't-3', status: 'COMPLETED', requiresEvidence: false, requiresAssessment: false },
            { id: 't-4', status: 'IN_PROGRESS', requiresEvidence: false, requiresAssessment: false },
          ],
          performance: null,
        },
      ],
      skillEvidence: [
        {
          id: 'ev-1',
          source: 'PROJECT',
          demonstratedScore: 92,
          skill: { id: 'sk-rust', name: 'Rust', category: 'Language' },
        },
        {
          id: 'ev-2',
          source: 'CODING_INTERVIEW',
          demonstratedScore: 88,
          skill: { id: 'sk-raft', name: 'Raft Consensus', category: 'Distributed Systems' },
        },
      ],
      assessmentAttempts: [
        {
          id: 'att-1',
          score: 90,
          passed: true,
          assessment: { id: 'as-1', title: 'Raft Consensus Assessment' },
          skill: { id: 'sk-raft', name: 'Raft Consensus' },
        },
      ],
      updatedAt: new Date('2026-03-01T10:00:00Z'),
    },
    {
      id: 'ur-cand-mit-2',
      userId: 'user-mit-sarah',
      sourceRoadmapId: 'rm-cloud-architect',
      status: 'COMPLETED',
      personalization: {
        candidateName: 'Sarah Connor',
        institution: 'MIT',
        college: 'EECS',
        batch: '2026-A',
        graduationYear: 2026,
        branch: 'Computer Science',
        targetRole: 'Cloud Solutions Architect',
        targetCompanyTier: 'FAANG',
      },
      sourceRoadmap: {
        id: 'rm-cloud-architect',
        rolePath: 'Cloud Solutions Architect',
        targetRole: 'Cloud Solutions Architect',
        targetCompanyTier: 'FAANG',
        visibility: 'PUBLIC',
        goal: { id: 'g2', targetRole: 'Cloud Solutions Architect' },
      },
      sprints: [
        {
          id: 'sp-3',
          sprintNumber: 1,
          status: 'COMPLETED',
          tasks: [{ id: 't-5', status: 'COMPLETED', requiresEvidence: false, requiresAssessment: false }],
          performance: { id: 'p-2', taskCompletion: 100 },
        },
      ],
      skillEvidence: [
        {
          id: 'ev-3',
          source: 'PROJECT',
          demonstratedScore: 95,
          skill: { id: 'sk-k8s', name: 'Kubernetes', category: 'DevOps' },
        },
      ],
      assessmentAttempts: [
        {
          id: 'att-2',
          score: 95,
          passed: true,
          assessment: { id: 'as-2', title: 'Kubernetes Micro-Assessment' },
          skill: { id: 'sk-k8s', name: 'Kubernetes' },
        },
      ],
      updatedAt: new Date('2026-03-02T10:00:00Z'),
    },
    {
      id: 'ur-cand-stanford-1',
      userId: 'user-stanford-bob',
      sourceRoadmapId: 'rm-backend-eng',
      status: 'ACTIVE',
      personalization: {
        candidateName: 'Bob Vance',
        institution: 'Stanford University',
        college: 'Engineering',
        batch: '2025-B',
        graduationYear: 2025,
        branch: 'Software Engineering',
        targetRole: 'Backend Engineer',
        targetCompanyTier: 'Unicorn',
      },
      sourceRoadmap: {
        id: 'rm-backend-eng',
        rolePath: 'Backend Engineer',
        targetRole: 'Backend Engineer',
        targetCompanyTier: 'Unicorn',
        visibility: 'PUBLIC',
        goal: { id: 'g3', targetRole: 'Backend Engineer' },
      },
      sprints: [],
      skillEvidence: [],
      assessmentAttempts: [],
      updatedAt: new Date('2026-03-03T10:00:00Z'),
    },
  ];

  describe('1. Institutional Authorization & Boundaries', () => {
    it('throws UnauthorizedError when no institutional identity is provided in headers or query', async () => {
      await expect(
        institutionalCohortService.getInstitutionalBatchSummary({}, {})
      ).rejects.toThrow(UnauthorizedError);
    });

    it('throws ForbiddenError when caller tries to access another institution data', async () => {
      const authContext = { institutionName: 'Stanford University' };
      await expect(
        institutionalCohortService.getInstitutionalBatchSummary(authContext, {
          institution: 'MIT',
        })
      ).rejects.toThrow(ForbiddenError);
    });

    it('allows query when requested institution matches authenticated institution header', async () => {
      vi.spyOn(prisma.userRoadmap, 'findMany').mockResolvedValue(mockUniversityCandidates as any);

      const authContext = { institutionName: 'MIT' };
      const summary = await institutionalCohortService.getInstitutionalBatchSummary(authContext, {
        institution: 'MIT',
      });

      expect(summary.institution).toBe('MIT');
      expect(summary.summary.totalCandidates).toBe(2);
    });
  });

  describe('2. Batch Milestone Velocity & Aggregation', () => {
    it('calculates comprehensive batch metrics and milestone velocity accurately', async () => {
      vi.spyOn(prisma.userRoadmap, 'findMany').mockResolvedValue(mockUniversityCandidates as any);

      const summary = await institutionalCohortService.getInstitutionalBatchSummary(
        { institutionName: 'MIT' },
        { batch: '2026-A' }
      );

      expect(summary.summary.totalCandidates).toBe(2);
      expect(summary.summary.activeCandidates).toBe(1);
      expect(summary.summary.completedCandidates).toBe(1);

      // Milestone Velocity
      expect(summary.milestoneVelocity.totalSprintsEnrolled).toBe(3); // sp-1, sp-2, sp-3
      expect(summary.milestoneVelocity.completedSprintsCount).toBe(2); // sp-1, sp-3
      expect(summary.milestoneVelocity.sprintCompletionRate).toBe(67); // 2/3 = 67%
      expect(summary.milestoneVelocity.milestonesCompleted).toBe(4); // t-1, t-2, t-3, t-5

      // Readiness Distribution
      expect(summary.readinessDistribution.bands).toHaveLength(4);
      expect(summary.readinessDistribution.averageReadiness).toBeGreaterThan(0);

      // Skills & Assessments
      expect(summary.skillsAnalysis.topDemonstratedSkills.length).toBeGreaterThan(0);
      expect(summary.assessmentPerformance.totalAttempts).toBe(2);
      expect(summary.assessmentPerformance.overallPassRate).toBe(100);
      expect(summary.practicalPerformance.totalPracticalDrills).toBe(3);
    });
  });

  describe('3. Multi-Dimensional Filtering', () => {
    it('filters correctly by graduation year, branch, and target role', async () => {
      vi.spyOn(prisma.userRoadmap, 'findMany').mockResolvedValue(mockUniversityCandidates as any);

      const result = await institutionalCohortService.getInstitutionalBatchSummary(
        { institutionName: 'MIT' },
        {
          graduationYear: 2026,
          branch: 'Computer Science',
          targetRole: 'Distributed Systems',
        }
      );

      expect(result.summary.totalCandidates).toBe(1);
      expect(result.filtersApplied.targetRole).toBe('Distributed Systems');
    });

    it('filters correctly by readiness score range', async () => {
      vi.spyOn(prisma.userRoadmap, 'findMany').mockResolvedValue(mockUniversityCandidates as any);

      const result = await institutionalCohortService.getInstitutionalBatchSummary(
        { institutionName: 'MIT' },
        { minReadiness: 90, maxReadiness: 100 }
      );

      expect(result.filtersApplied.minReadiness).toBe(90);
    });
  });

  describe('4. Batch Overview Listing', () => {
    it('groups candidate counts, completion rates, and readiness across batches', async () => {
      vi.spyOn(prisma.userRoadmap, 'findMany').mockResolvedValue(mockUniversityCandidates as any);

      const batchList = await institutionalCohortService.getInstitutionalBatches({
        institutionName: 'MIT',
      });

      expect(batchList.institution).toBe('MIT');
      expect(batchList.totalBatches).toBe(1);
      expect(batchList.totalLearners).toBe(2);
      expect(batchList.batches[0].batch).toBe('2026-A');
      expect(batchList.batches[0].activeLearners).toBe(1);
      expect(batchList.batches[0].completedLearners).toBe(1);
    });
  });

  describe('5. Aggregate-First Privacy Protections', () => {
    it('guarantees response contains zero candidate PII, user IDs, private notes, or quiz transcripts', async () => {
      vi.spyOn(prisma.userRoadmap, 'findMany').mockResolvedValue(mockUniversityCandidates as any);

      const summary = await institutionalCohortService.getInstitutionalBatchSummary({
        institutionName: 'MIT',
      });

      const jsonStr = JSON.stringify(summary);
      expect(jsonStr).not.toContain('Alex Mercer');
      expect(jsonStr).not.toContain('Sarah Connor');
      expect(jsonStr).not.toContain('user-mit-alex');
      expect(jsonStr).not.toContain('user-mit-sarah');
      expect(jsonStr).not.toContain('candidateId');
      expect(jsonStr).not.toContain('recruiterNotes');
    });
  });

  describe('6. Empty Cohort Edge Case', () => {
    it('returns structured empty summary without errors when no candidates match', async () => {
      vi.spyOn(prisma.userRoadmap, 'findMany').mockResolvedValue([] as any);

      const empty = await institutionalCohortService.getInstitutionalBatchSummary({
        institutionName: 'NonExistent University',
      });

      expect(empty.summary.totalCandidates).toBe(0);
      expect(empty.summary.averageReadiness).toBe(0);
      expect(empty.milestoneVelocity.totalSprintsEnrolled).toBe(0);
      expect(empty.readinessDistribution.bands).toHaveLength(4);
    });
  });

  describe('7. Zod Validator & Malformed Query Handling', () => {
    it('validates query params and throws BadRequestError on invalid minReadiness/maxReadiness order', () => {
      expect(() => {
        validateInstitutionalCohortQuery({
          minReadiness: 90,
          maxReadiness: 40,
        });
      }).toThrow(BadRequestError);
    });

    it('coerces string numbers for readiness and graduationYear cleanly', () => {
      const parsed = validateInstitutionalCohortQuery({
        minReadiness: '20' as any,
        maxReadiness: '80' as any,
        graduationYear: '2026' as any,
      });

      expect(parsed.minReadiness).toBe(20);
      expect(parsed.maxReadiness).toBe(80);
      expect(parsed.graduationYear).toBe('2026');
    });
  });

  describe('8. Controller Endpoint Handlers', () => {
    it('handles GET /institution/cohorts controller request with headers', async () => {
      vi.spyOn(prisma.userRoadmap, 'findMany').mockResolvedValue(mockUniversityCandidates as any);

      const { req, res, next, getStatusCode, getJsonResponse } = createMockReqRes({
        headers: { 'x-institution-name': 'MIT' },
        query: { batch: '2026-A' },
      });

      await roadmapController.getInstitutionalCohortSummary(req, res, next);

      expect(getStatusCode()).toBe(200);
      expect(getJsonResponse().success).toBe(true);
      expect(getJsonResponse().data.institution).toBe('MIT');
      expect(getJsonResponse().data.summary.totalCandidates).toBe(2);
    });

    it('handles GET /institution/cohorts/batches controller request', async () => {
      vi.spyOn(prisma.userRoadmap, 'findMany').mockResolvedValue(mockUniversityCandidates as any);

      const { req, res, next, getStatusCode, getJsonResponse } = createMockReqRes({
        headers: { 'x-institution-name': 'MIT' },
      });

      await roadmapController.getInstitutionalBatches(req, res, next);

      expect(getStatusCode()).toBe(200);
      expect(getJsonResponse().success).toBe(true);
      expect(getJsonResponse().data.totalBatches).toBe(1);
    });
  });
});
