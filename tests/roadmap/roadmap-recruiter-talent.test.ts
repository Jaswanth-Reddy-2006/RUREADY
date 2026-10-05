// ═══════════════════════════════════════════════════════════════
// Stage 10.1: Recruiter Talent Search & Skill Filtering Tests
// Comprehensive Unit, Integration, Security, & Privacy Test Suite
// ═══════════════════════════════════════════════════════════════

import { describe, expect, it, vi, beforeEach } from 'vitest';
import { recruiterTalentService } from '../../services/roadmap-service/src/services/recruiter-talent.service.js';
import { validateRecruiterTalentQuery } from '../../services/roadmap-service/src/validators/recruiter-talent.validator.js';
import { roadmapController } from '../../services/roadmap-service/src/controllers/roadmap.controller.js';
import { prisma } from '../../services/roadmap-service/src/lib/prisma.js';
import { BadRequestError, UnauthorizedError } from '../../services/roadmap-service/src/lib/errors.js';

describe('Stage 10.1: Recruiter Talent Search & Skill Filtering', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  function createMockReqRes(options: {
    headers?: Record<string, string | string[] | undefined>;
    params?: Record<string, string>;
    query?: Record<string, any>;
    body?: any;
    protocol?: string;
  }) {
    const req: any = {
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

  const mockCandidates = [
    {
      id: 'ur-cand-1',
      userId: 'user-alice',
      sourceRoadmapId: 'rm-backend',
      status: 'ACTIVE',
      personalization: { candidateName: 'Alice Johnson' },
      sourceRoadmap: {
        id: 'rm-backend',
        rolePath: 'Backend Engineer',
        targetCompanyTier: 'FAANG',
        visibility: 'PUBLIC',
        overallReadiness: 90,
        goal: { targetRole: 'Backend Engineer', targetCompanyTier: 'FAANG' },
      },
      sprints: [
        {
          id: 'sprint-1',
          sprintNumber: 1,
          status: 'COMPLETED',
          tasks: [{ id: 't1', status: 'COMPLETED', requiresEvidence: false, requiresAssessment: false }],
          performance: { id: 'perf-1', taskCompletion: 100 },
        },
      ],
      skillEvidence: [
        {
          id: 'ev-1',
          source: 'CODING_INTERVIEW',
          demonstratedScore: 95,
          skill: { name: 'Node.js', category: 'Backend' },
        },
        {
          id: 'ev-2',
          source: 'PROJECT',
          demonstratedScore: 90,
          skill: { name: 'PostgreSQL', category: 'Database' },
        },
      ],
      assessmentAttempts: [
        {
          id: 'att-1',
          score: 95,
          passed: true,
          assessment: { title: 'Node.js Concurrency' },
          skill: { name: 'Node.js' },
        },
      ],
      updatedAt: new Date('2026-03-01T10:00:00Z'),
    },
    {
      id: 'ur-cand-2',
      userId: 'user-bob',
      sourceRoadmapId: 'rm-frontend',
      status: 'ACTIVE',
      personalization: { candidateName: 'Bob Smith' },
      sourceRoadmap: {
        id: 'rm-frontend',
        rolePath: 'Frontend Engineer',
        targetCompanyTier: 'TIER_1',
        visibility: 'PUBLIC',
        overallReadiness: 75,
        goal: { targetRole: 'Frontend Engineer', targetCompanyTier: 'TIER_1' },
      },
      sprints: [
        {
          id: 'sprint-2',
          sprintNumber: 1,
          status: 'COMPLETED',
          tasks: [{ id: 't2', status: 'COMPLETED', requiresEvidence: false, requiresAssessment: false }],
          performance: { id: 'perf-2', taskCompletion: 90 },
        },
      ],
      skillEvidence: [
        {
          id: 'ev-3',
          source: 'SELF_REPORTED',
          demonstratedScore: 70,
          skill: { name: 'React', category: 'Frontend' },
        },
        {
          id: 'ev-4',
          source: 'ASSESSMENT',
          demonstratedScore: 80,
          skill: { name: 'TypeScript', category: 'Frontend' },
        },
      ],
      assessmentAttempts: [
        {
          id: 'att-2',
          score: 80,
          passed: true,
          assessment: { title: 'React Hooks' },
          skill: { name: 'React' },
        },
      ],
      updatedAt: new Date('2026-03-02T12:00:00Z'),
    },
    {
      id: 'ur-cand-3',
      userId: 'user-carol',
      sourceRoadmapId: 'rm-fullstack',
      status: 'ACTIVE',
      personalization: { candidateName: 'Carol White' },
      sourceRoadmap: {
        id: 'rm-fullstack',
        rolePath: 'Full Stack Engineer',
        targetCompanyTier: 'STARTUP',
        visibility: 'PUBLIC',
        overallReadiness: 50,
        goal: { targetRole: 'Full Stack Engineer', targetCompanyTier: 'STARTUP' },
      },
      sprints: [],
      skillEvidence: [
        {
          id: 'ev-5',
          source: 'SELF_REPORTED',
          demonstratedScore: 50,
          skill: { name: 'JavaScript', category: 'Frontend' },
        },
      ],
      assessmentAttempts: [],
      updatedAt: new Date('2026-03-03T14:00:00Z'),
    },
  ];

  // ─── 1. Validation & Schema Tests ──────────────────────────────

  describe('1. Query Validator & Schema Parsing', () => {
    it('validates default empty query cleanly with sensible defaults', () => {
      const validated = validateRecruiterTalentQuery({});
      expect(validated.targetCompanyTier).toBe('ALL');
      expect(validated.minReadiness).toBe(0);
      expect(validated.maxReadiness).toBe(100);
      expect(validated.page).toBe(1);
      expect(validated.limit).toBe(10);
      expect(validated.sortBy).toBe('readiness');
      expect(validated.sortOrder).toBe('desc');
      expect(validated.skills).toEqual([]);
    });

    it('parses comma-separated skills string into array', () => {
      const validated = validateRecruiterTalentQuery({ skills: 'React, Node.js, TypeScript' });
      expect(validated.skills).toEqual(['React', 'Node.js', 'TypeScript']);
    });

    it('rejects when minReadiness > maxReadiness', () => {
      expect(() => {
        validateRecruiterTalentQuery({ minReadiness: 90, maxReadiness: 70 });
      }).toThrowError(BadRequestError);
    });

    it('rejects invalid score range (< 0 or > 100)', () => {
      expect(() => {
        validateRecruiterTalentQuery({ minReadiness: -10 });
      }).toThrowError(BadRequestError);

      expect(() => {
        validateRecruiterTalentQuery({ maxReadiness: 150 });
      }).toThrowError(BadRequestError);
    });

    it('rejects invalid target company tier', () => {
      expect(() => {
        validateRecruiterTalentQuery({ targetCompanyTier: 'FORTUNE_500' });
      }).toThrowError(BadRequestError);
    });
  });

  // ─── 2. Recruiter Talent Query Engine ──────────────────────────

  describe('2. Deterministic Filtering & Search Logic', () => {
    it('returns all eligible public candidates when no filters are applied', async () => {
      vi.spyOn(prisma.userRoadmap, 'findMany').mockResolvedValue(mockCandidates as any);

      const result = await recruiterTalentService.searchCandidates({});
      expect(result.total).toBe(3);
      expect(result.candidates.length).toBe(3);
      expect(result.candidates[0].candidateId).toBe('user-alice');
      expect(result.candidates[0].overallReadiness).toBe(90);
    });

    it('filters candidates by target role (case-insensitive substring match)', async () => {
      vi.spyOn(prisma.userRoadmap, 'findMany').mockResolvedValue(mockCandidates as any);

      const result = await recruiterTalentService.searchCandidates({ role: 'Backend' });
      expect(result.total).toBe(1);
      expect(result.candidates[0].candidateId).toBe('user-alice');
      expect(result.candidates[0].targetRole).toBe('Backend Engineer');
    });

    it('filters candidates by target company tier', async () => {
      vi.spyOn(prisma.userRoadmap, 'findMany').mockResolvedValue(mockCandidates as any);

      const result = await recruiterTalentService.searchCandidates({ targetCompanyTier: 'TIER_1' });
      expect(result.total).toBe(1);
      expect(result.candidates[0].candidateId).toBe('user-bob');
      expect(result.candidates[0].targetCompanyTier).toBe('TIER_1');
    });

    it('filters candidates by readiness score range', async () => {
      vi.spyOn(prisma.userRoadmap, 'findMany').mockResolvedValue(mockCandidates as any);

      const result = await recruiterTalentService.searchCandidates({ minReadiness: 70, maxReadiness: 85 });
      expect(result.total).toBe(1);
      expect(result.candidates[0].candidateId).toBe('user-bob');
      expect(result.candidates[0].overallReadiness).toBe(75);
    });

    it('filters candidates by verified skills (AND intersection)', async () => {
      vi.spyOn(prisma.userRoadmap, 'findMany').mockResolvedValue(mockCandidates as any);

      const result = await recruiterTalentService.searchCandidates({ skills: ['Node.js', 'PostgreSQL'] });
      expect(result.total).toBe(1);
      expect(result.candidates[0].candidateId).toBe('user-alice');

      const noMatch = await recruiterTalentService.searchCandidates({ skills: ['React', 'Node.js'] });
      expect(noMatch.total).toBe(0);
      expect(noMatch.candidates).toEqual([]);
    });

    it('filters candidates by evidence source', async () => {
      vi.spyOn(prisma.userRoadmap, 'findMany').mockResolvedValue(mockCandidates as any);

      const result = await recruiterTalentService.searchCandidates({ evidenceSource: 'CODING_INTERVIEW' });
      expect(result.total).toBe(1);
      expect(result.candidates[0].candidateId).toBe('user-alice');
      expect(result.candidates[0].evidenceSources).toContain('CODING_INTERVIEW');
    });

    it('filters candidates requiring verified assessment proof', async () => {
      vi.spyOn(prisma.userRoadmap, 'findMany').mockResolvedValue(mockCandidates as any);

      const result = await recruiterTalentService.searchCandidates({ hasAssessmentProof: true });
      expect(result.total).toBe(2);
      expect(result.candidates.map((c) => c.candidateId)).toEqual(['user-alice', 'user-bob']);
    });

    it('filters candidates by search keyword matching candidate name, role, or skills', async () => {
      vi.spyOn(prisma.userRoadmap, 'findMany').mockResolvedValue(mockCandidates as any);

      const resultByName = await recruiterTalentService.searchCandidates({ search: 'Carol' });
      expect(resultByName.total).toBe(1);
      expect(resultByName.candidates[0].candidateId).toBe('user-carol');

      const resultBySkill = await recruiterTalentService.searchCandidates({ search: 'typescript' });
      expect(resultBySkill.total).toBe(1);
      expect(resultBySkill.candidates[0].candidateId).toBe('user-bob');
    });
  });

  // ─── 3. Deterministic Sorting & Pagination ─────────────────────

  describe('3. Sorting & Pagination Controls', () => {
    it('sorts by readiness DESC with userRoadmapId tiebreaker by default', async () => {
      vi.spyOn(prisma.userRoadmap, 'findMany').mockResolvedValue(mockCandidates as any);

      const result = await recruiterTalentService.searchCandidates({ sortBy: 'readiness', sortOrder: 'desc' });
      expect(result.candidates.map((c) => c.overallReadiness)).toEqual([90, 75, 50]);
    });

    it('sorts by readiness ASC when requested', async () => {
      vi.spyOn(prisma.userRoadmap, 'findMany').mockResolvedValue(mockCandidates as any);

      const result = await recruiterTalentService.searchCandidates({ sortBy: 'readiness', sortOrder: 'asc' });
      expect(result.candidates.map((c) => c.overallReadiness)).toEqual([50, 75, 90]);
    });

    it('handles pagination slices and totalPages correctly', async () => {
      vi.spyOn(prisma.userRoadmap, 'findMany').mockResolvedValue(mockCandidates as any);

      const page1 = await recruiterTalentService.searchCandidates({ page: 1, limit: 2 });
      expect(page1.total).toBe(3);
      expect(page1.totalPages).toBe(2);
      expect(page1.candidates.length).toBe(2);
      expect(page1.candidates[0].candidateId).toBe('user-alice');
      expect(page1.candidates[1].candidateId).toBe('user-bob');

      const page2 = await recruiterTalentService.searchCandidates({ page: 2, limit: 2 });
      expect(page2.total).toBe(3);
      expect(page2.totalPages).toBe(2);
      expect(page2.candidates.length).toBe(1);
      expect(page2.candidates[0].candidateId).toBe('user-carol');
    });

    it('returns empty array when page is beyond total result count', async () => {
      vi.spyOn(prisma.userRoadmap, 'findMany').mockResolvedValue(mockCandidates as any);

      const page99 = await recruiterTalentService.searchCandidates({ page: 99, limit: 10 });
      expect(page99.total).toBe(3);
      expect(page99.candidates).toEqual([]);
    });
  });

  // ─── 4. Privacy & Recruiter-Safe Result DTO ────────────────────

  describe('4. Privacy Guarantees & Contract Integrity', () => {
    it('does not leak private transcripts, internal tasks, or sensitive db internals', async () => {
      vi.spyOn(prisma.userRoadmap, 'findMany').mockResolvedValue(mockCandidates as any);

      const result = await recruiterTalentService.searchCandidates({});
      const first = result.candidates[0];

      // Verifies public-safe fields exist
      expect(first.candidateId).toBe('user-alice');
      expect(first.candidateName).toBe('Alice Johnson');
      expect(first.verificationId).toBeDefined();
      expect(first.verificationUrl).toContain('/verify/');
      expect(first.assessmentSummary).toBeDefined();

      // Verifies sensitive internal fields are NOT present on the candidate card
      expect((first as any).password).toBeUndefined();
      expect((first as any).interviewTranscripts).toBeUndefined();
      expect((first as any).assessmentAnswers).toBeUndefined();
      expect((first as any).rawTelemetry).toBeUndefined();
    });

    it('only queries roadmaps that have PUBLIC visibility', async () => {
      const findManySpy = vi.spyOn(prisma.userRoadmap, 'findMany').mockResolvedValue([] as any);

      await recruiterTalentService.searchCandidates({});
      expect(findManySpy).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            sourceRoadmap: { visibility: 'PUBLIC' },
          }),
        })
      );
    });
  });

  // ─── 5. Controller & HTTP Endpoint Integration ────────────────

  describe('5. HTTP Controller & Route Integration', () => {
    it('rejects unauthenticated request without x-user-id with 401 Unauthorized', async () => {
      const { req, res, next } = createMockReqRes({
        headers: {}, // No x-user-id header
      });

      await roadmapController.searchRecruiterTalent(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });

    it('successfully processes authenticated search and returns HTTP 200 with result DTO', async () => {
      vi.spyOn(prisma.userRoadmap, 'findMany').mockResolvedValue(mockCandidates as any);

      const { req, res, next, getStatusCode, getJsonResponse } = createMockReqRes({
        headers: { 'x-user-id': 'recruiter-rec-1' },
        query: {
          role: 'Backend',
          targetCompanyTier: 'FAANG',
          minReadiness: '80',
        },
      });

      await roadmapController.searchRecruiterTalent(req, res, next);
      expect(next).not.toHaveBeenCalled();
      expect(getStatusCode()).toBe(200);

      const response = getJsonResponse();
      expect(response.success).toBe(true);
      expect(response.data.total).toBe(1);
      expect(response.data.candidates[0].candidateId).toBe('user-alice');
      expect(response.data.filtersApplied.role).toBe('Backend');
      expect(response.data.filtersApplied.minReadiness).toBe(80);
    });

    it('surfaces validation error with HTTP 400 when query contains invalid parameters', async () => {
      const { req, res, next } = createMockReqRes({
        headers: { 'x-user-id': 'recruiter-rec-1' },
        query: {
          minReadiness: '100',
          maxReadiness: '50', // min > max
        },
      });

      await roadmapController.searchRecruiterTalent(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
    });
  });
});
