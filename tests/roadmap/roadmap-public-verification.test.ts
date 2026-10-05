import { describe, expect, it, vi, beforeEach } from 'vitest';
import { roadmapController } from '../../services/roadmap-service/src/controllers/roadmap.controller.js';
import { verifiedProfileService } from '../../services/roadmap-service/src/services/verified-profile.service.js';
import { prisma } from '../../services/roadmap-service/src/lib/prisma.js';

describe('Stage 5.8: Public Verification Landing Page & Verification Contract', () => {
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
    id: 'ur-58-recruiter',
    userId: 'user-candidate-1',
    sourceRoadmapId: 'rm-58-faang',
    personalization: {
      candidateName: 'Jane Doe',
      targetRole: 'FULLSTACK',
      hoursPerDay: 2,
      daysPerWeek: 5,
      sprintDurationDays: 7,
    },
    sourceRoadmap: {
      id: 'rm-58-faang',
      rolePath: 'FULLSTACK',
      targetCompanyTier: 'FAANG',
      overallReadiness: 30,
      nodes: [
        {
          id: 'node-node-1',
          title: 'Node.js Microservices',
          orderIndex: 1,
          category: 'Backend',
          skills: [
            {
              skillId: 'sk-node',
              targetProficiency: 85,
              skill: { id: 'sk-node', slug: 'nodejs', name: 'Node.js', category: 'Backend' },
            },
          ],
        },
      ],
    },
    sprints: [
      {
        id: 'sprint-58-1',
        sprintNumber: 1,
        status: 'COMPLETED',
        tasks: [{ id: 'task-1', status: 'COMPLETED', skillId: 'nodejs', roadmapNodeId: 'node-node-1' }],
      },
    ],
    skillEvidence: [
      {
        id: 'ev-58-1',
        skillId: 'nodejs',
        source: 'PROJECT',
        demonstratedScore: 92,
        metadata: { practicalDrill: true },
        skill: { id: 'sk-node', slug: 'nodejs', name: 'Node.js' },
      },
    ],
  };

  const mockAssessmentAttempts = [
    {
      id: 'att-58-1',
      userId: 'user-candidate-1',
      skillId: 'sk-node',
      score: 88,
      passed: true,
      skill: { id: 'sk-node', slug: 'nodejs', name: 'Node.js' },
    },
  ];

  it('1. Returns valid PublicVerifiedProfileDTO for authentic verification ID', async () => {
    vi.spyOn(prisma.userRoadmap, 'findUnique').mockResolvedValue(mockUserRoadmapData as any);
    vi.spyOn(prisma.microAssessmentAttempt, 'findMany').mockResolvedValue(mockAssessmentAttempts as any);

    const verifiedProfile = await verifiedProfileService.getVerifiedProfile('user-candidate-1', 'ur-58-recruiter');
    const publicProfile = await verifiedProfileService.verifyPublicProfile(verifiedProfile.verificationId);

    expect(publicProfile.isValid).toBe(true);
    expect(publicProfile.verificationId).toBe(verifiedProfile.verificationId);
    expect(publicProfile.candidateName).toBe('Jane Doe');
    expect(publicProfile.targetRole).toBe(verifiedProfile.targetRole);
    expect(publicProfile.targetCompanyTier).toBe('FAANG');
    expect(publicProfile.overallReadiness).toBe(verifiedProfile.overallReadiness);
  });

  it('2. Public profile includes only sanitized recruiter-facing fields', async () => {
    vi.spyOn(prisma.userRoadmap, 'findUnique').mockResolvedValue(mockUserRoadmapData as any);
    vi.spyOn(prisma.microAssessmentAttempt, 'findMany').mockResolvedValue(mockAssessmentAttempts as any);

    const verifiedProfile = await verifiedProfileService.getVerifiedProfile('user-candidate-1', 'ur-58-recruiter');
    const publicProfile = await verifiedProfileService.verifyPublicProfile(verifiedProfile.verificationId);

    const expectedKeys = [
      'verificationId',
      'candidateName',
      'targetRole',
      'targetCompanyTier',
      'overallReadiness',
      'masteredSkills',
      'demonstratedSkills',
      'completedSprintCount',
      'verifiedEvidenceCount',
      'assessmentSummary',
      'practicalSummary',
      'issuedAt',
      'isValid',
      'sprintArchives',
      'evidence',
      'assessments',
      'timeline',
    ];

    expect(Object.keys(publicProfile).sort()).toEqual(expectedKeys.sort());
  });

  it('3. Invalid or tampered verification ID returns isValid: false', async () => {
    vi.spyOn(prisma.userRoadmap, 'findUnique').mockResolvedValue(mockUserRoadmapData as any);
    vi.spyOn(prisma.microAssessmentAttempt, 'findMany').mockResolvedValue(mockAssessmentAttempts as any);

    const tamperedId = 'VRF-ur-58-recruiter-0000000000000000';
    const result = await verifiedProfileService.verifyPublicProfile(tamperedId);

    expect(result.isValid).toBe(false);
    expect(result.verificationId).toBe(tamperedId);
  });

  it('4. Non-existent roadmap ID returns isValid: false without crashing', async () => {
    vi.spyOn(prisma.userRoadmap, 'findUnique').mockResolvedValue(null);

    const nonExistentId = 'VRF-unknown-roadmap-1234567890ABCDEF';
    const result = await verifiedProfileService.verifyPublicProfile(nonExistentId);

    expect(result.isValid).toBe(false);
  });

  it('5. Malformed verification ID string returns isValid: false', async () => {
    const malformed = 'INVALID_FORMAT_123';
    const result = await verifiedProfileService.verifyPublicProfile(malformed);

    expect(result.isValid).toBe(false);
  });

  it('6. Public endpoint does not require authentication header', async () => {
    vi.spyOn(prisma.userRoadmap, 'findUnique').mockResolvedValue(mockUserRoadmapData as any);
    vi.spyOn(prisma.microAssessmentAttempt, 'findMany').mockResolvedValue(mockAssessmentAttempts as any);

    const verifiedProfile = await verifiedProfileService.getVerifiedProfile('user-candidate-1', 'ur-58-recruiter');

    // No x-user-id header passed (unauthenticated public recruiter request)
    const { req, res, next, getStatusCode, getJsonResponse } = createMockReqRes({
      params: { verificationId: verifiedProfile.verificationId },
    });

    await roadmapController.verifyPublicProfile(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(getStatusCode()).toBe(200);
    expect(getJsonResponse().success).toBe(true);
    expect(getJsonResponse().data.isValid).toBe(true);
  });

  it('7. Private assessment answers and questions are never present in public profile', async () => {
    vi.spyOn(prisma.userRoadmap, 'findUnique').mockResolvedValue(mockUserRoadmapData as any);
    vi.spyOn(prisma.microAssessmentAttempt, 'findMany').mockResolvedValue(mockAssessmentAttempts as any);

    const verifiedProfile = await verifiedProfileService.getVerifiedProfile('user-candidate-1', 'ur-58-recruiter');
    const publicProfile = await verifiedProfileService.verifyPublicProfile(verifiedProfile.verificationId);
    const json = JSON.stringify(publicProfile);

    expect(json).not.toContain('questionResults');
    expect(json).not.toContain('correctOptionIndex');
    expect(json).not.toContain('selectedOptionIndex');
    expect(json).not.toContain('password');
    expect(json).not.toContain('jwt');
  });

  it('8. Hidden coding tests and internal DB secrets are never exposed', async () => {
    vi.spyOn(prisma.userRoadmap, 'findUnique').mockResolvedValue(mockUserRoadmapData as any);
    vi.spyOn(prisma.microAssessmentAttempt, 'findMany').mockResolvedValue(mockAssessmentAttempts as any);

    const verifiedProfile = await verifiedProfileService.getVerifiedProfile('user-candidate-1', 'ur-58-recruiter');
    const publicProfile = await verifiedProfileService.verifyPublicProfile(verifiedProfile.verificationId);
    const json = JSON.stringify(publicProfile);

    expect(json).not.toContain('hiddenTestCases');
    expect(json).not.toContain('expectedOutput');
  });

  it('9. Stage 7.3: Includes verified sprint history and skills addressed', async () => {
    vi.spyOn(prisma.userRoadmap, 'findUnique').mockResolvedValue(mockUserRoadmapData as any);
    vi.spyOn(prisma.microAssessmentAttempt, 'findMany').mockResolvedValue(mockAssessmentAttempts as any);

    const verifiedProfile = await verifiedProfileService.getVerifiedProfile('user-candidate-1', 'ur-58-recruiter');
    const publicProfile = await verifiedProfileService.verifyPublicProfile(verifiedProfile.verificationId);

    expect(publicProfile.sprintArchives).toBeDefined();
    expect(publicProfile.sprintArchives.length).toBe(1);
    expect(publicProfile.sprintArchives[0].sprintNumber).toBe(1);
    expect(publicProfile.sprintArchives[0].status).toBe('COMPLETED');
    expect(publicProfile.sprintArchives[0].completionPercentage).toBe(100);
    expect(publicProfile.sprintArchives[0].skillsAddressed).toContain('nodejs');
  });

  it('10. Stage 7.3: Evidence distinguishes PLATFORM_VERIFIED vs LEARNER_PROVIDED', async () => {
    const multiEvidenceRoadmap = {
      ...mockUserRoadmapData,
      skillEvidence: [
        {
          id: 'ev-1',
          skillId: 'nodejs',
          source: 'PROJECT',
          demonstratedScore: 92,
          metadata: { practicalDrill: true },
          skill: { id: 'sk-node', slug: 'nodejs', name: 'Node.js' },
        },
        {
          id: 'ev-2',
          skillId: 'react',
          source: 'SELF_REPORTED',
          demonstratedScore: 75,
          metadata: { externalUrl: 'https://github.com/candidate/repo' },
          skill: { id: 'sk-react', slug: 'react', name: 'React' },
        },
      ],
    };

    vi.spyOn(prisma.userRoadmap, 'findUnique').mockResolvedValue(multiEvidenceRoadmap as any);
    vi.spyOn(prisma.microAssessmentAttempt, 'findMany').mockResolvedValue(mockAssessmentAttempts as any);

    const verifiedProfile = await verifiedProfileService.getVerifiedProfile('user-candidate-1', 'ur-58-recruiter');
    const publicProfile = await verifiedProfileService.verifyPublicProfile(verifiedProfile.verificationId);

    expect(publicProfile.evidence.length).toBe(2);
    const platformEv = publicProfile.evidence.find((e) => e.source === 'PROJECT');
    const learnerEv = publicProfile.evidence.find((e) => e.source === 'SELF_REPORTED');

    expect(platformEv?.verificationSource).toBe('PLATFORM_VERIFIED');
    expect(learnerEv?.verificationSource).toBe('LEARNER_PROVIDED');
    expect(learnerEv?.externalUrl).toBe('https://github.com/candidate/repo');
  });

  it('11. Stage 7.3: Verified assessments expose score & pass status without question payloads', async () => {
    vi.spyOn(prisma.userRoadmap, 'findUnique').mockResolvedValue(mockUserRoadmapData as any);
    vi.spyOn(prisma.microAssessmentAttempt, 'findMany').mockResolvedValue(mockAssessmentAttempts as any);

    const verifiedProfile = await verifiedProfileService.getVerifiedProfile('user-candidate-1', 'ur-58-recruiter');
    const publicProfile = await verifiedProfileService.verifyPublicProfile(verifiedProfile.verificationId);

    expect(publicProfile.assessments.length).toBe(1);
    expect(publicProfile.assessments[0].score).toBe(88);
    expect(publicProfile.assessments[0].passed).toBe(true);
    expect(publicProfile.assessments[0].skillName).toBe('Node.js');
    expect((publicProfile.assessments[0] as any).answers).toBeUndefined();
    expect((publicProfile.assessments[0] as any).questions).toBeUndefined();
  });

  it('12. Stage 7.3: Timeline presents public milestone events deterministically', async () => {
    vi.spyOn(prisma.userRoadmap, 'findUnique').mockResolvedValue(mockUserRoadmapData as any);
    vi.spyOn(prisma.microAssessmentAttempt, 'findMany').mockResolvedValue(mockAssessmentAttempts as any);

    const verifiedProfile = await verifiedProfileService.getVerifiedProfile('user-candidate-1', 'ur-58-recruiter');
    const publicProfile = await verifiedProfileService.verifyPublicProfile(verifiedProfile.verificationId);

    expect(publicProfile.timeline).toBeDefined();
    expect(Array.isArray(publicProfile.timeline)).toBe(true);
    // Timeline should only contain public milestone types (e.g. SPRINT_COMPLETED, ASSESSMENT_PASSED, etc.)
    const types = publicProfile.timeline.map((t) => t.type);
    expect(types).not.toContain('ROADMAP_ADAPTATION');
  });
});
