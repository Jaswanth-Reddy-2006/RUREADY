// ═══════════════════════════════════════════════════════════════
// Stage 10.4: Cohort & Campus Analytics Tests
// Comprehensive Unit, Integration, Aggregation, Filter & Privacy Suite
// ═══════════════════════════════════════════════════════════════

import { describe, expect, it, vi, beforeEach } from 'vitest';
import { cohortAnalyticsService } from '../../services/roadmap-service/src/services/cohort-analytics.service.js';
import { validateCohortAnalyticsQuery } from '../../services/roadmap-service/src/validators/cohort-analytics.validator.js';
import { roadmapController } from '../../services/roadmap-service/src/controllers/roadmap.controller.js';
import { prisma } from '../../services/roadmap-service/src/lib/prisma.js';
import { BadRequestError, UnauthorizedError } from '../../services/roadmap-service/src/lib/errors.js';

describe('Stage 10.4: Cohort & Campus Analytics', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  function createMockReqRes(options: {
    method?: string;
    headers?: Record<string, string | string[] | undefined>;
    params?: Record<string, string>;
    query?: Record<string, any>;
    body?: any;
    protocol?: string;
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

  const mockUserRoadmaps = [
    {
      id: 'urm_cand_1',
      userId: 'user_1',
      status: 'ACTIVE',
      personalization: {
        institution: 'Stanford University',
        college: 'Engineering',
        batch: '2026',
        graduationYear: 2026,
        branch: 'Computer Science',
        targetRole: 'Full Stack Engineer',
        targetCompanyTier: 'FAANG',
      },
      sourceRoadmap: {
        id: 'rm_fullstack',
        rolePath: 'Full Stack Engineer',
        targetCompanyTier: 'FAANG',
        visibility: 'PUBLIC',
        goal: { targetRole: 'Full Stack Engineer' },
      },
      sprints: [
        { id: 'sp_1', status: 'COMPLETED', performance: { taskCompletion: 100, assessmentScore: 90, practicalScore: 95 } },
        { id: 'sp_2', status: 'COMPLETED', performance: { taskCompletion: 100, assessmentScore: 85, practicalScore: 90 } },
      ],
      skillEvidence: [
        {
          id: 'ev_1',
          source: 'PRACTICAL_DRILL',
          demonstratedScore: 92,
          confidence: 90,
          skill: { id: 'sk_ts', name: 'TypeScript', category: 'Language' },
        },
        {
          id: 'ev_2',
          source: 'CODING_INTERVIEW',
          demonstratedScore: 88,
          confidence: 85,
          skill: { id: 'sk_react', name: 'React', category: 'Frontend' },
        },
      ],
      assessmentAttempts: [
        { id: 'att_1', score: 90, passed: true, skill: { id: 'sk_ts', name: 'TypeScript' } },
        { id: 'att_2', score: 85, passed: true, skill: { id: 'sk_react', name: 'React' } },
      ],
      updatedAt: new Date(),
    },
    {
      id: 'urm_cand_2',
      userId: 'user_2',
      status: 'COMPLETED',
      personalization: {
        institution: 'Stanford University',
        college: 'Engineering',
        batch: '2026',
        graduationYear: 2026,
        branch: 'Computer Science',
        targetRole: 'Full Stack Engineer',
        targetCompanyTier: 'FAANG',
      },
      sourceRoadmap: {
        id: 'rm_fullstack',
        rolePath: 'Full Stack Engineer',
        targetCompanyTier: 'FAANG',
        visibility: 'PUBLIC',
        goal: { targetRole: 'Full Stack Engineer' },
      },
      sprints: [
        { id: 'sp_3', status: 'COMPLETED', performance: { taskCompletion: 100, assessmentScore: 70, practicalScore: 75 } },
      ],
      skillEvidence: [
        {
          id: 'ev_3',
          source: 'PRACTICAL_DRILL',
          demonstratedScore: 75,
          confidence: 70,
          skill: { id: 'sk_ts', name: 'TypeScript', category: 'Language' },
        },
        {
          id: 'ev_4',
          source: 'ASSESSMENT',
          demonstratedScore: 45, // Skill gap trigger
          confidence: 40,
          skill: { id: 'sk_graphql', name: 'GraphQL', category: 'Backend' },
        },
      ],
      assessmentAttempts: [
        { id: 'att_3', score: 65, passed: false, skill: { id: 'sk_graphql', name: 'GraphQL' } },
      ],
      updatedAt: new Date(),
    },
    {
      id: 'urm_cand_3',
      userId: 'user_3',
      status: 'ACTIVE',
      personalization: {
        institution: 'MIT',
        college: 'Computing',
        batch: '2025',
        graduationYear: 2025,
        branch: 'Electrical Engineering',
        targetRole: 'Backend Engineer',
        targetCompanyTier: 'STARTUP',
      },
      sourceRoadmap: {
        id: 'rm_backend',
        rolePath: 'Backend Engineer',
        targetCompanyTier: 'STARTUP',
        visibility: 'PUBLIC',
        goal: { targetRole: 'Backend Engineer' },
      },
      sprints: [],
      skillEvidence: [],
      assessmentAttempts: [],
      updatedAt: new Date(),
    },
  ];

  describe('1. Zod Validation & Parameter Sanitization', () => {
    it('validates a comprehensive cohort query correctly', () => {
      const parsed = validateCohortAnalyticsQuery({
        institution: 'Stanford',
        batch: '2026',
        graduationYear: '2026',
        branch: 'Computer Science',
        targetRole: 'Full Stack Engineer',
        targetCompanyTier: 'FAANG',
        minReadiness: '40',
        maxReadiness: '95',
      });

      expect(parsed.institution).toBe('Stanford');
      expect(parsed.batch).toBe('2026');
      expect(parsed.graduationYear).toBe('2026');
      expect(parsed.minReadiness).toBe(40);
      expect(parsed.maxReadiness).toBe(95);
    });

    it('rejects invalid readiness ranges where minReadiness > maxReadiness', () => {
      expect(() =>
        validateCohortAnalyticsQuery({
          minReadiness: 80,
          maxReadiness: 50,
        })
      ).toThrow(BadRequestError);
    });

    it('rejects out of bounds readiness scores', () => {
      expect(() =>
        validateCohortAnalyticsQuery({
          minReadiness: -5,
        })
      ).toThrow(BadRequestError);

      expect(() =>
        validateCohortAnalyticsQuery({
          maxReadiness: 105,
        })
      ).toThrow(BadRequestError);
    });
  });

  describe('2. Empty Cohort & Graceful Edge Cases', () => {
    it('returns structured zero-values gracefully when no candidates match filters', async () => {
      vi.spyOn(prisma.userRoadmap, 'findMany').mockResolvedValue([]);

      const result = await cohortAnalyticsService.getCohortAnalytics({
        institution: 'Nonexistent University',
      });

      expect(result.summary.totalCandidates).toBe(0);
      expect(result.summary.verifiedCandidates).toBe(0);
      expect(result.summary.averageReadiness).toBe(0);
      expect(result.summary.medianReadiness).toBe(0);
      expect(result.readinessDistribution.bands.length).toBe(4);
      expect(result.skillsAnalysis.topDemonstratedSkills).toEqual([]);
      expect(result.assessmentPerformance.totalAttempts).toBe(0);
      expect(result.assessmentPerformance.overallPassRate).toBe(0);
      expect(result.practicalEvidence.candidatesWithPracticalEvidence).toBe(0);
      expect(result.distributions.roles).toEqual([]);
    });
  });

  describe('3. Candidate Counts, Readiness & Bands Aggregation', () => {
    it('aggregates candidate readiness, median, and canonical bands accurately', async () => {
      vi.spyOn(prisma.userRoadmap, 'findMany').mockResolvedValue(mockUserRoadmaps as any);

      const result = await cohortAnalyticsService.getCohortAnalytics();

      expect(result.summary.totalCandidates).toBe(3);
      expect(result.summary.verifiedCandidates).toBeGreaterThanOrEqual(2);
      expect(result.summary.activeCandidates).toBe(2);
      expect(result.summary.completedCandidates).toBe(1);

      // Verify Readiness statistical metrics
      expect(result.summary.averageReadiness).toBeGreaterThanOrEqual(0);
      expect(result.summary.medianReadiness).toBeGreaterThanOrEqual(0);

      // Verify 4 Canonical Readiness Bands
      expect(result.readinessDistribution.bands).toHaveLength(4);
      const bandKeys = result.readinessDistribution.bands.map((b) => b.band);
      expect(bandKeys).toContain('TIER_1_ADVANCED');
      expect(bandKeys).toContain('TIER_2_PROFICIENT');
      expect(bandKeys).toContain('TIER_3_DEVELOPING');
      expect(bandKeys).toContain('TIER_4_BEGINNER');

      const sumPercentages = result.readinessDistribution.bands.reduce((acc, b) => acc + b.percentage, 0);
      expect(Math.round(sumPercentages)).toBe(100);
    });
  });

  describe('4. Skills, Gaps, and Category Aggregations', () => {
    it('computes top demonstrated skills, skill gaps, and category distribution', async () => {
      vi.spyOn(prisma.userRoadmap, 'findMany').mockResolvedValue(mockUserRoadmaps as any);

      const result = await cohortAnalyticsService.getCohortAnalytics({
        institution: 'Stanford',
      });

      expect(result.summary.totalCandidates).toBe(2);

      // Top skills
      const topSkills = result.skillsAnalysis.topDemonstratedSkills;
      expect(topSkills.length).toBeGreaterThan(0);
      const tsSkill = topSkills.find((s) => s.skillName === 'TypeScript');
      expect(tsSkill).toBeDefined();
      expect(tsSkill?.candidateCount).toBe(2);
      expect(tsSkill?.coveragePercentage).toBe(100);

      // Common Skill Gaps
      const gaps = result.skillsAnalysis.commonSkillGaps;
      expect(gaps.length).toBeGreaterThan(0);
      const graphqlGap = gaps.find((g) => g.skillName === 'GraphQL');
      expect(graphqlGap).toBeDefined();
      expect(graphqlGap?.gapCount).toBe(1);

      // Category breakdown
      expect(result.skillsAnalysis.categoryBreakdown.length).toBeGreaterThan(0);
    });
  });

  describe('5. Assessment & Practical Evidence Aggregation', () => {
    it('aggregates micro-assessments, pass rates, and practical coding drill metrics', async () => {
      vi.spyOn(prisma.userRoadmap, 'findMany').mockResolvedValue(mockUserRoadmaps as any);

      const result = await cohortAnalyticsService.getCohortAnalytics({
        institution: 'Stanford',
      });

      // Assessments (3 total: 2 passed, 1 failed)
      expect(result.assessmentPerformance.totalAttempts).toBe(3);
      expect(result.assessmentPerformance.passedAttempts).toBe(2);
      expect(result.assessmentPerformance.overallPassRate).toBe(66.7);
      expect(result.assessmentPerformance.candidatesAssessed).toBe(2);

      // Practical Evidence
      expect(result.practicalEvidence.candidatesWithPracticalEvidence).toBe(2);
      expect(result.practicalEvidence.practicalCoveragePercentage).toBe(100);
      expect(result.practicalEvidence.totalPracticalDrills).toBeGreaterThanOrEqual(2);
      expect(result.practicalEvidence.evidenceSourceCounts.PRACTICAL_DRILL).toBe(2);
      expect(result.practicalEvidence.evidenceSourceCounts.CODING_INTERVIEW).toBe(1);
    });
  });

  describe('6. Multi-Dimensional Filtering', () => {
    it('filters accurately by institution, batch, targetRole, and company tier', async () => {
      vi.spyOn(prisma.userRoadmap, 'findMany').mockResolvedValue(mockUserRoadmaps as any);

      // Filter by Stanford
      const stanfordResult = await cohortAnalyticsService.getCohortAnalytics({
        institution: 'Stanford',
      });
      expect(stanfordResult.summary.totalCandidates).toBe(2);

      // Filter by MIT
      const mitResult = await cohortAnalyticsService.getCohortAnalytics({
        institution: 'MIT',
      });
      expect(mitResult.summary.totalCandidates).toBe(1);
      expect(mitResult.distributions.roles[0].key).toBe('Backend Engineer');

      // Filter by Role
      const roleResult = await cohortAnalyticsService.getCohortAnalytics({
        targetRole: 'Backend Engineer',
      });
      expect(roleResult.summary.totalCandidates).toBe(1);

      // Filter by Tier
      const tierResult = await cohortAnalyticsService.getCohortAnalytics({
        targetCompanyTier: 'STARTUP',
      });
      expect(tierResult.summary.totalCandidates).toBe(1);
    });
  });

  describe('7. Privacy & Data Protection', () => {
    it('ensures zero leakage of candidate personal notes, quiz answers, or raw telemetry', async () => {
      vi.spyOn(prisma.userRoadmap, 'findMany').mockResolvedValue(mockUserRoadmaps as any);

      const result = await cohortAnalyticsService.getCohortAnalytics();

      // Aggregate first: top level contains no raw user roadmap objects
      expect((result as any).userRoadmaps).toBeUndefined();
      expect((result as any).candidates).toBeUndefined();
      expect((result as any).answers).toBeUndefined();
      expect((result as any).notes).toBeUndefined();
      expect((result as any).transcripts).toBeUndefined();
    });
  });

  describe('8. Controller & HTTP Endpoints', () => {
    it('GET /recruiter/analytics/cohort returns cohort analytics (200)', async () => {
      vi.spyOn(prisma.userRoadmap, 'findMany').mockResolvedValue(mockUserRoadmaps as any);

      const { req, res, next, getStatusCode, getJsonResponse } = createMockReqRes({
        headers: { 'x-user-id': 'recruiter_auth_user' },
        query: { institution: 'Stanford' },
      });

      await roadmapController.getCohortAnalytics(req, res, next);

      expect(getStatusCode()).toBe(200);
      expect(getJsonResponse().success).toBe(true);
      expect(getJsonResponse().data.summary.totalCandidates).toBe(2);
    });

    it('POST /recruiter/analytics/cohort returns cohort analytics with body filters (200)', async () => {
      vi.spyOn(prisma.userRoadmap, 'findMany').mockResolvedValue(mockUserRoadmaps as any);

      const { req, res, next, getStatusCode, getJsonResponse } = createMockReqRes({
        method: 'POST',
        headers: { 'x-user-id': 'recruiter_auth_user' },
        body: { institution: 'Stanford', targetCompanyTier: 'FAANG' },
      });

      await roadmapController.getCohortAnalytics(req, res, next);

      expect(getStatusCode()).toBe(200);
      expect(getJsonResponse().success).toBe(true);
      expect(getJsonResponse().data.summary.totalCandidates).toBe(2);
    });

    it('enforces authentication header x-user-id on analytics endpoints', async () => {
      const { req, res, next } = createMockReqRes({
        headers: {}, // No x-user-id
      });

      await roadmapController.getCohortAnalytics(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });
  });
});
