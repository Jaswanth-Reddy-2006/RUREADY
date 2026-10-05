import { describe, expect, it, vi, beforeEach } from 'vitest';
import {
  deriveRoadmapLearningHistory,
  deriveRoadmapProfileSummary,
  RoadmapLearningHistoryDTO,
  RoadmapProfileSummaryDTO,
  PublicVerifiedProfileDTO,
} from '../../packages/shared/src/types/index.js';
import { verifiedProfileService } from '../../services/roadmap-service/src/services/verified-profile.service.js';
import { adaptiveRoadmapService } from '../../services/roadmap-service/src/services/adaptive-roadmap.service.js';
import { roadmapController } from '../../services/roadmap-service/src/controllers/roadmap.controller.js';
import { prisma } from '../../services/roadmap-service/src/lib/prisma.js';

describe('Stage 7.5: Final Roadmap Integration & Production Hardening', () => {
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

  const canonicalUserRoadmap = {
    id: 'ur-75-canonical',
    userId: 'user-75-master',
    sourceRoadmapId: 'rm-75-dist',
    candidateName: 'Elena Rostova',
    overallReadiness: 82,
    personalization: {
      candidateName: 'Elena Rostova',
      targetRole: 'DISTRIBUTED_SYSTEMS',
      hoursPerDay: 2,
      daysPerWeek: 5,
    },
    sourceRoadmap: {
      id: 'rm-75-dist',
      rolePath: 'DISTRIBUTED_SYSTEMS',
      targetCompanyTier: 'FAANG',
      overallReadiness: 82,
      nodes: [
        {
          id: 'node-dist-1',
          title: 'Consensus & Raft Protocol',
          skills: [
            {
              skillId: 'sk-raft',
              targetProficiency: 90,
              skill: { id: 'sk-raft', slug: 'raft-consensus', name: 'Raft Consensus', category: 'Backend' },
            },
          ],
        },
      ],
    },
    sprints: [
      {
        id: 'sprint-75-1',
        sprintNumber: 1,
        status: 'COMPLETED',
        objective: 'Implement leader election and log replication',
        startDate: '2026-09-01T00:00:00.000Z',
        endDate: '2026-09-07T23:59:59.999Z',
        tasks: [
          {
            id: 'task-75-1',
            status: 'COMPLETED',
            skillId: 'raft-consensus',
            completedAt: '2026-09-04T12:00:00.000Z',
            skills: [{ id: 'sk-raft', name: 'Raft Consensus' }],
          },
        ],
      },
      {
        id: 'sprint-75-2',
        sprintNumber: 2,
        status: 'COMPLETED',
        objective: 'Dynamic cluster membership and log compaction',
        startDate: '2026-09-08T00:00:00.000Z',
        endDate: '2026-09-15T23:59:59.999Z',
        tasks: [
          {
            id: 'task-75-2',
            status: 'COMPLETED',
            skillId: 'raft-consensus',
            completedAt: '2026-09-12T16:00:00.000Z',
            skills: [{ id: 'sk-raft', name: 'Raft Consensus' }],
          },
        ],
      },
      {
        id: 'sprint-75-3',
        sprintNumber: 3,
        status: 'IN_PROGRESS',
        objective: 'Distributed transactions with 2PC',
        startDate: '2026-09-16T00:00:00.000Z',
        endDate: '2026-09-23T23:59:59.999Z',
        tasks: [
          {
            id: 'task-75-3',
            status: 'IN_PROGRESS',
            skillId: '2pc',
            skills: [{ id: 'sk-2pc', name: 'Two-Phase Commit' }],
          },
        ],
      },
    ],
    skillEvidence: [
      {
        id: 'ev-75-1',
        skillId: 'raft-consensus',
        source: 'PROJECT',
        demonstratedScore: 94,
        assessedAt: '2026-09-12T18:00:00.000Z',
        metadata: { practicalDrill: true },
        skill: { id: 'sk-raft', slug: 'raft-consensus', name: 'Raft Consensus', category: 'Backend' },
      },
      {
        id: 'ev-75-2',
        skillId: 'raft-consensus',
        source: 'SELF_REPORTED',
        demonstratedScore: 85,
        assessedAt: '2026-09-13T10:00:00.000Z',
        metadata: { externalUrl: 'https://github.com/elena/raft-cluster' },
        skill: { id: 'sk-raft', slug: 'raft-consensus', name: 'Raft Consensus', category: 'Backend' },
      },
    ],
    assessmentAttempts: [
      {
        id: 'att-75-1',
        userId: 'user-75-master',
        skillId: 'sk-raft',
        score: 92,
        passed: true,
        completedAt: '2026-09-12T17:00:00.000Z',
        skill: { id: 'sk-raft', slug: 'raft-consensus', name: 'Raft Consensus' },
      },
    ],
    adaptations: [
      {
        id: 'adp-75-1',
        userRoadmapId: 'ur-75-canonical',
        triggerReason: 'High assessment velocity',
        changesApplied: { accelerate: true },
        createdAt: '2026-09-12T17:30:00.000Z',
      },
    ],
  };

  // 1. Cross-Surface Consistency
  it('1. Learning History, Profile Summary, and Public Verification report consistent facts', async () => {
    vi.spyOn(prisma.userRoadmap, 'findUnique').mockResolvedValue(canonicalUserRoadmap as any);
    vi.spyOn(prisma.userRoadmap, 'findFirst').mockResolvedValue(canonicalUserRoadmap as any);
    vi.spyOn(prisma.microAssessmentAttempt, 'findMany').mockResolvedValue(canonicalUserRoadmap.assessmentAttempts as any);

    // Surface 1: Learning History (Stage 7.1 / 7.2)
    const history = await adaptiveRoadmapService.getRoadmapLearningHistory('user-75-master', 'ur-75-canonical');

    // Surface 2: Profile Summary (Stage 7.4)
    const profileSummary = await verifiedProfileService.getProfileSummary('user-75-master', 'ur-75-canonical');

    // Surface 3: Public Recruiter Verification (Stage 7.3)
    const verifiedProfile = await verifiedProfileService.getVerifiedProfile('user-75-master', 'ur-75-canonical');
    const publicVerification = await verifiedProfileService.verifyPublicProfile(verifiedProfile.verificationId);

    // Consistency Assertions:
    expect(history.completedSprintsCount).toBe(2);
    expect(profileSummary?.completedSprintCount).toBe(2);
    expect(publicVerification.completedSprintCount).toBe(2);

    expect(history.totalSprintsCount).toBe(3);
    expect(profileSummary?.totalSprintCount).toBe(3);

    expect(history.targetRole).toBe('DISTRIBUTED_SYSTEMS');
    expect(profileSummary?.targetRole).toBe('DISTRIBUTED_SYSTEMS');
    expect(publicVerification.targetRole).toBe('DISTRIBUTED_SYSTEMS');

    expect(history.targetCompanyTier).toBe('FAANG');
    expect(profileSummary?.targetCompanyTier).toBe('FAANG');
    expect(publicVerification.targetCompanyTier).toBe('FAANG');

    // Verification ID matches
    expect(profileSummary?.verificationId).toBe(verifiedProfile.verificationId);
    expect(publicVerification.verificationId).toBe(verifiedProfile.verificationId);
  });

  // 2. Strict Privacy Boundary Enforcement
  it('2. Public verification and profile summary strictly exclude private adaptation telemetry and assessment answers', async () => {
    vi.spyOn(prisma.userRoadmap, 'findUnique').mockResolvedValue(canonicalUserRoadmap as any);
    vi.spyOn(prisma.microAssessmentAttempt, 'findMany').mockResolvedValue(canonicalUserRoadmap.assessmentAttempts as any);

    const verifiedProfile = await verifiedProfileService.getVerifiedProfile('user-75-master', 'ur-75-canonical');
    const publicVerification = await verifiedProfileService.verifyPublicProfile(verifiedProfile.verificationId);
    const profileSummary = await verifiedProfileService.getProfileSummary('user-75-master', 'ur-75-canonical');

    const publicJson = JSON.stringify(publicVerification);
    const summaryJson = JSON.stringify(profileSummary);

    // Private telemetry must never be in public verification
    expect(publicJson).not.toContain('High assessment velocity');
    expect(publicJson).not.toContain('changesApplied');
    expect(publicJson).not.toContain('ROADMAP_ADAPTATION');

    // Private assessment internals must never be present
    expect(publicJson).not.toContain('correctOptionIndex');
    expect(publicJson).not.toContain('selectedOptionIndex');
    expect(publicJson).not.toContain('questionResults');
    expect(publicJson).not.toContain('hiddenTestCases');

    expect(summaryJson).not.toContain('High assessment velocity');
    expect(summaryJson).not.toContain('correctOptionIndex');
    expect(summaryJson).not.toContain('hiddenTestCases');
  });

  // 3. Verification Semantics
  it('3. Evidence distinguishes PLATFORM_VERIFIED from LEARNER_PROVIDED across all surfaces', async () => {
    vi.spyOn(prisma.userRoadmap, 'findUnique').mockResolvedValue(canonicalUserRoadmap as any);
    vi.spyOn(prisma.microAssessmentAttempt, 'findMany').mockResolvedValue(canonicalUserRoadmap.assessmentAttempts as any);

    const verifiedProfile = await verifiedProfileService.getVerifiedProfile('user-75-master', 'ur-75-canonical');
    const publicVerification = await verifiedProfileService.verifyPublicProfile(verifiedProfile.verificationId);
    const profileSummary = await verifiedProfileService.getProfileSummary('user-75-master', 'ur-75-canonical');

    const pubProj = publicVerification.evidence.find((e) => e.source === 'PROJECT');
    const pubSelf = publicVerification.evidence.find((e) => e.source === 'SELF_REPORTED');

    expect(pubProj?.verificationSource).toBe('PLATFORM_VERIFIED');
    expect(pubSelf?.verificationSource).toBe('LEARNER_PROVIDED');

    const sumProj = profileSummary?.selectedProof.find((p) => p.type === 'PRACTICAL_DRILL');
    expect(sumProj?.verificationSource).toBe('PLATFORM_VERIFIED');
  });

  // 4. Security: Cross-User Access Denial
  it('4. Cross-user access is denied for private history and profile summary endpoints', async () => {
    vi.spyOn(prisma.userRoadmap, 'findUnique').mockResolvedValue(canonicalUserRoadmap as any);
    vi.spyOn(prisma.userRoadmap, 'findFirst').mockResolvedValue(null);

    // Accessing another user's roadmap history
    await expect(
      adaptiveRoadmapService.getRoadmapLearningHistory('attacker-user-007', 'ur-75-canonical')
    ).rejects.toThrow();

    // Accessing another user's profile summary
    await expect(
      verifiedProfileService.getProfileSummary('attacker-user-007', 'ur-75-canonical')
    ).rejects.toThrow();

    // Accessing another user's verified profile
    await expect(
      verifiedProfileService.getVerifiedProfile('attacker-user-007', 'ur-75-canonical')
    ).rejects.toThrow();
  });

  // 5. Tampered or Invalid Verification Handling
  it('5. Tampered or malformed verification IDs are rejected safely without data leaks', async () => {
    vi.spyOn(prisma.userRoadmap, 'findUnique').mockResolvedValue(canonicalUserRoadmap as any);
    vi.spyOn(prisma.microAssessmentAttempt, 'findMany').mockResolvedValue(canonicalUserRoadmap.assessmentAttempts as any);

    const malformedResult = await verifiedProfileService.verifyPublicProfile('MALFORMED_STRING');
    expect(malformedResult.isValid).toBe(false);
    expect(malformedResult.completedSprintCount).toBe(0);
    expect(malformedResult.evidence).toEqual([]);
    expect(malformedResult.assessments).toEqual([]);

    const tamperedResult = await verifiedProfileService.verifyPublicProfile('VRF-ur-75-canonical-0000000000000000');
    expect(tamperedResult.isValid).toBe(false);
  });

  // 6. Graceful Empty States & Resilience
  it('6. All engines handle empty roadmaps gracefully with zero completed milestones', () => {
    const emptyHistory = deriveRoadmapLearningHistory({
      id: 'ur-empty',
      sprints: [],
      skillEvidence: [],
      assessmentAttempts: [],
    });

    const emptySummary = deriveRoadmapProfileSummary({
      id: 'ur-empty',
      sprints: [],
      skillEvidence: [],
      assessmentAttempts: [],
    });

    expect(emptyHistory.totalSprintsCount).toBe(0);
    expect(emptyHistory.completedSprintsCount).toBe(0);
    expect(emptyHistory.timeline).toEqual([]);

    expect(emptySummary.totalSprintCount).toBe(0);
    expect(emptySummary.completedSprintCount).toBe(0);
    expect(emptySummary.selectedProof).toEqual([]);
  });

  // 7. Active Sprints Are Never Counted as Completed
  it('7. Incomplete / in-progress sprints are never converted into completed archives or achievements', () => {
    const roadmapWithActiveSprintOnly = {
      id: 'ur-active-only',
      sprints: [
        {
          id: 'sprint-active',
          sprintNumber: 1,
          status: 'IN_PROGRESS',
          tasks: [{ id: 'task-1', status: 'IN_PROGRESS' }],
        },
      ],
    };

    const history = deriveRoadmapLearningHistory(roadmapWithActiveSprintOnly);
    const summary = deriveRoadmapProfileSummary(roadmapWithActiveSprintOnly);

    expect(history.completedSprintsCount).toBe(0);
    expect(summary.completedSprintCount).toBe(0);

    const sprintProof = summary.selectedProof.find((p) => p.type === 'SPRINT');
    expect(sprintProof).toBeUndefined();
  });
});
