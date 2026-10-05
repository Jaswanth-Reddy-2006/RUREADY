import { describe, expect, it, vi, beforeEach } from 'vitest';
import {
  deriveRoadmapProfileSummary,
  RoadmapProfileSummaryDTO,
  UserRoadmapDTO,
} from '../../packages/shared/src/types/index.js';
import { verifiedProfileService } from '../../services/roadmap-service/src/services/verified-profile.service.js';
import { roadmapController } from '../../services/roadmap-service/src/controllers/roadmap.controller.js';
import { prisma } from '../../services/roadmap-service/src/lib/prisma.js';

describe('Stage 7.4: Profile Integration & Verified Roadmap Summary', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  function createMockReqRes(options: {
    headers?: Record<string, string | string[] | undefined>;
    params?: Record<string, string>;
    query?: Record<string, string>;
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

  const mockUserRoadmapData = {
    id: 'ur-74-candidate',
    userId: 'user-74-1',
    sourceRoadmapId: 'rm-74-fullstack',
    candidateName: 'Alex Mercer',
    overallReadiness: 75,
    personalization: {
      candidateName: 'Alex Mercer',
      targetRole: 'FULLSTACK',
      hoursPerDay: 2,
      daysPerWeek: 5,
    },
    sourceRoadmap: {
      id: 'rm-74-fullstack',
      rolePath: 'FULLSTACK',
      targetCompanyTier: 'FAANG',
      overallReadiness: 75,
      nodes: [
        {
          id: 'node-1',
          title: 'Advanced React Internals',
          skills: [
            {
              skillId: 'sk-react',
              targetProficiency: 85,
              skill: { id: 'sk-react', slug: 'react', name: 'React', category: 'Frontend' },
            },
          ],
        },
      ],
    },
    sprints: [
      {
        id: 'sprint-1',
        sprintNumber: 1,
        status: 'COMPLETED',
        objective: 'React Reconciliation and Fiber Trees',
        startDate: '2026-09-01T00:00:00.000Z',
        endDate: '2026-09-07T23:59:59.999Z',
        tasks: [
          {
            id: 'task-1',
            status: 'COMPLETED',
            skillId: 'react',
            completedAt: '2026-09-03T10:00:00.000Z',
            skills: [{ id: 'sk-react', name: 'React' }],
          },
        ],
      },
      {
        id: 'sprint-2',
        sprintNumber: 2,
        status: 'IN_PROGRESS',
        objective: 'Node.js Microservices and Caching',
        startDate: '2026-09-08T00:00:00.000Z',
        endDate: '2026-09-15T23:59:59.999Z',
        tasks: [
          {
            id: 'task-2',
            status: 'IN_PROGRESS',
            skillId: 'nodejs',
            skills: [{ id: 'sk-node', name: 'Node.js' }],
          },
        ],
      },
    ],
    skillEvidence: [
      {
        id: 'ev-1',
        skillId: 'react',
        source: 'PROJECT',
        demonstratedScore: 90,
        assessedAt: '2026-09-04T12:00:00.000Z',
        metadata: { practicalDrill: true },
        skill: { id: 'sk-react', slug: 'react', name: 'React', category: 'Frontend' },
      },
      {
        id: 'ev-2',
        skillId: 'typescript',
        source: 'SELF_REPORTED',
        demonstratedScore: 80,
        assessedAt: '2026-09-05T14:00:00.000Z',
        metadata: { externalUrl: 'https://github.com/alex/ts-system' },
        skill: { id: 'sk-ts', slug: 'typescript', name: 'TypeScript', category: 'Language' },
      },
    ],
    assessmentAttempts: [
      {
        id: 'att-1',
        userId: 'user-74-1',
        skillId: 'sk-react',
        score: 95,
        passed: true,
        completedAt: '2026-09-04T15:00:00.000Z',
        skill: { id: 'sk-react', slug: 'react', name: 'React' },
      },
    ],
  };

  it('1. deriveRoadmapProfileSummary produces a complete, valid RoadmapProfileSummaryDTO', () => {
    const summary = deriveRoadmapProfileSummary(mockUserRoadmapData as any);

    expect(summary.userRoadmapId).toBe('ur-74-candidate');
    expect(summary.roadmapId).toBe('rm-74-fullstack');
    expect(summary.targetRole).toBe('FULLSTACK');
    expect(summary.targetCompanyTier).toBe('FAANG');
    expect(summary.candidateName).toBe('Alex Mercer');
    expect(summary.completedSprintCount).toBe(1);
    expect(summary.totalSprintCount).toBe(2);
    expect(summary.overallReadiness).toBe(75);
    expect(summary.verificationId).toContain('VRF-ur-74-candidate');
    expect(summary.verificationUrl).toContain('/verify/');
  });

  it('2. Selected proof-of-work is bounded (top 3-5 items) and sorted chronologically', () => {
    const summary = deriveRoadmapProfileSummary(mockUserRoadmapData as any);

    expect(summary.selectedProof.length).toBeGreaterThan(0);
    expect(summary.selectedProof.length).toBeLessThanOrEqual(5);

    // Verify chronological descending sort
    for (let i = 0; i < summary.selectedProof.length - 1; i++) {
      const dateA = new Date(summary.selectedProof[i].date).getTime();
      const dateB = new Date(summary.selectedProof[i + 1].date).getTime();
      expect(dateA).toBeGreaterThanOrEqual(dateB);
    }
  });

  it('3. Distinguishes PLATFORM_VERIFIED vs LEARNER_PROVIDED proof', () => {
    const summary = deriveRoadmapProfileSummary(mockUserRoadmapData as any);

    const practicalDrill = summary.selectedProof.find((p) => p.type === 'PRACTICAL_DRILL');
    const assessment = summary.selectedProof.find((p) => p.type === 'ASSESSMENT');
    const selfReported = summary.selectedProof.find((p) => p.verificationSource === 'LEARNER_PROVIDED');

    expect(practicalDrill?.verificationSource).toBe('PLATFORM_VERIFIED');
    expect(assessment?.verificationSource).toBe('PLATFORM_VERIFIED');
    if (selfReported) {
      expect(selfReported.verificationSource).toBe('LEARNER_PROVIDED');
      expect(selfReported.externalUrl).toBe('https://github.com/alex/ts-system');
    }
  });

  it('4. Verified skills are deduplicated with aggregated evidence counts', () => {
    const summary = deriveRoadmapProfileSummary(mockUserRoadmapData as any);

    const reactSkill = summary.verifiedSkills.find((s) => s.name === 'React');
    expect(reactSkill).toBeDefined();
    // React has both project evidence and passed assessment
    expect(reactSkill?.evidenceCount).toBeGreaterThanOrEqual(2);
    expect(reactSkill?.status).toBe('MASTERED');
  });

  it('5. Excludes private assessment answers, questions, and internal telemetry', () => {
    const summary = deriveRoadmapProfileSummary(mockUserRoadmapData as any);
    const json = JSON.stringify(summary);

    expect(json).not.toContain('questionResults');
    expect(json).not.toContain('selectedOptionIndex');
    expect(json).not.toContain('ROADMAP_ADAPTATION');
    expect(json).not.toContain('hiddenTestCases');
  });

  it('6. Handles null or empty userRoadmap gracefully without throwing', () => {
    const emptySummary = deriveRoadmapProfileSummary(null);

    expect(emptySummary.userRoadmapId).toBe('');
    expect(emptySummary.completedSprintCount).toBe(0);
    expect(emptySummary.verifiedSkillCount).toBe(0);
    expect(emptySummary.selectedProof).toEqual([]);
    expect(emptySummary.verifiedSkills).toEqual([]);
  });

  it('7. Backend service getProfileSummary returns verified summary for authenticated user', async () => {
    vi.spyOn(prisma.userRoadmap, 'findUnique').mockResolvedValue(mockUserRoadmapData as any);
    vi.spyOn(prisma.microAssessmentAttempt, 'findMany').mockResolvedValue(mockUserRoadmapData.assessmentAttempts as any);

    const summary = await verifiedProfileService.getProfileSummary('user-74-1', 'ur-74-candidate');

    expect(summary).not.toBeNull();
    expect(summary?.userRoadmapId).toBe('ur-74-candidate');
    expect(summary?.completedSprintCount).toBe(1);
    expect(summary?.verifiedSkills.length).toBeGreaterThan(0);
  });

  it('8. Backend service getProfileSummary throws ForbiddenError for cross-user roadmap access', async () => {
    vi.spyOn(prisma.userRoadmap, 'findUnique').mockResolvedValue(mockUserRoadmapData as any);

    await expect(
      verifiedProfileService.getProfileSummary('unauthorized-user-99', 'ur-74-candidate')
    ).rejects.toThrow('You are not authorized');
  });

  it('9. Backend service getProfileSummary returns null when user has no enrolled roadmaps', async () => {
    vi.spyOn(prisma.userRoadmap, 'findFirst').mockResolvedValue(null);

    const summary = await verifiedProfileService.getProfileSummary('user-with-no-roadmap');
    expect(summary).toBeNull();
  });

  it('10. Controller getProfileSummary returns 200 with profile summary data', async () => {
    vi.spyOn(prisma.userRoadmap, 'findUnique').mockResolvedValue(mockUserRoadmapData as any);
    vi.spyOn(prisma.microAssessmentAttempt, 'findMany').mockResolvedValue(mockUserRoadmapData.assessmentAttempts as any);

    const { req, res, next, getStatusCode, getJsonResponse } = createMockReqRes({
      headers: { 'x-user-id': 'user-74-1' },
      params: { userRoadmapId: 'ur-74-candidate' },
    });

    await roadmapController.getProfileSummary(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(getStatusCode()).toBe(200);
    expect(getJsonResponse().success).toBe(true);
    expect(getJsonResponse().data.userRoadmapId).toBe('ur-74-candidate');
  });
});
