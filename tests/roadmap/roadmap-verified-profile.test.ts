import { describe, expect, it, vi, beforeEach } from 'vitest';
import { roadmapController } from '../../services/roadmap-service/src/controllers/roadmap.controller.js';
import { verifiedProfileService } from '../../services/roadmap-service/src/services/verified-profile.service.js';
import { skillReadinessService } from '../../services/roadmap-service/src/services/skill-readiness.service.js';
import { prisma } from '../../services/roadmap-service/src/lib/prisma.js';
import { ForbiddenError, NotFoundError, BadRequestError } from '../../services/roadmap-service/src/lib/errors.js';

describe('Stage 5.7: Verified Career Readiness Profile', () => {
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
    id: 'ur-57-1',
    userId: 'user-verified-1',
    sourceRoadmapId: 'rm-57-1',
    personalization: {
      candidateName: 'Alice Developer',
      targetRole: 'FULLSTACK',
      hoursPerDay: 2,
      daysPerWeek: 5,
      sprintDurationDays: 7,
    },
    sourceRoadmap: {
      id: 'rm-57-1',
      rolePath: 'FULLSTACK',
      targetCompanyTier: 'FAANG',
      overallReadiness: 20,
      nodes: [
        {
          id: 'node-js-1',
          title: 'JavaScript Fundamentals',
          orderIndex: 1,
          category: 'Core Language',
          skills: [
            {
              skillId: 'sk-js',
              targetProficiency: 85,
              skill: { id: 'sk-js', slug: 'javascript', name: 'JavaScript', category: 'Core Language' },
            },
          ],
        },
        {
          id: 'node-react-1',
          title: 'React Components',
          orderIndex: 2,
          category: 'Frontend',
          skills: [
            {
              skillId: 'sk-react',
              targetProficiency: 80,
              skill: { id: 'sk-react', slug: 'react', name: 'React', category: 'Frontend' },
            },
          ],
        },
      ],
    },
    sprints: [
      {
        id: 'sprint-57-1',
        sprintNumber: 1,
        status: 'COMPLETED',
        tasks: [
          { id: 'task-1', status: 'COMPLETED', skillId: 'javascript', roadmapNodeId: 'node-js-1' },
          { id: 'task-2', status: 'COMPLETED', skillId: 'javascript', roadmapNodeId: 'node-js-1' },
        ],
      },
      {
        id: 'sprint-57-2',
        sprintNumber: 2,
        status: 'ACTIVE',
        tasks: [
          { id: 'task-3', status: 'IN_PROGRESS', skillId: 'react', roadmapNodeId: 'node-react-1' },
        ],
      },
    ],
    skillEvidence: [
      {
        id: 'ev-1',
        skillId: 'javascript',
        source: 'ASSESSMENT',
        demonstratedScore: 90,
        skill: { id: 'sk-js', slug: 'javascript', name: 'JavaScript' },
      },
      {
        id: 'ev-2',
        skillId: 'javascript',
        source: 'PROJECT',
        demonstratedScore: 95,
        metadata: { practicalDrill: true },
        skill: { id: 'sk-js', slug: 'javascript', name: 'JavaScript' },
      },
    ],
  };

  const mockAssessmentAttempts = [
    {
      id: 'att-1',
      userId: 'user-verified-1',
      skillId: 'sk-js',
      score: 90,
      passed: true,
      skill: { id: 'sk-js', slug: 'javascript', name: 'JavaScript' },
    },
    {
      id: 'att-2',
      userId: 'user-verified-1',
      skillId: 'sk-react',
      score: 80,
      passed: true,
      skill: { id: 'sk-react', slug: 'react', name: 'React' },
    },
  ];

  it('1. Generates verified career profile from real roadmap data', async () => {
    vi.spyOn(prisma.userRoadmap, 'findUnique').mockResolvedValue(mockUserRoadmapData as any);
    vi.spyOn(prisma.microAssessmentAttempt, 'findMany').mockResolvedValue(mockAssessmentAttempts as any);

    const profile = await verifiedProfileService.getVerifiedProfile('user-verified-1', 'ur-57-1');

    expect(profile).toBeDefined();
    expect(profile.userRoadmapId).toBe('ur-57-1');
    expect(profile.roadmapId).toBe('rm-57-1');
    expect(profile.candidateName).toBe('Alice Developer');
    expect(profile.verificationId).toMatch(/^VRF-ur-57-1-[A-F0-9]{16}$/);
    expect(profile.verificationUrl).toContain(profile.verificationId);
  });

  it('2. Readiness score strictly matches skill-readiness service', async () => {
    vi.spyOn(prisma.userRoadmap, 'findUnique').mockResolvedValue(mockUserRoadmapData as any);
    vi.spyOn(prisma.microAssessmentAttempt, 'findMany').mockResolvedValue(mockAssessmentAttempts as any);

    const readinessDirect = await skillReadinessService.calculateRoadmapReadiness('user-verified-1', 'ur-57-1');
    const profile = await verifiedProfileService.getVerifiedProfile('user-verified-1', 'ur-57-1');

    expect(profile.overallReadiness).toBe(readinessDirect.overallReadiness);
    expect(profile.baselineReadiness).toBe(readinessDirect.baselineReadiness);
    expect(profile.masteredSkillsCount).toBe(readinessDirect.masteredSkillsCount);
    expect(profile.totalRequiredSkills).toBe(readinessDirect.totalRequiredSkills);
  });

  it('3. Mastered skills and demonstrated skills match calibrated mastery', async () => {
    vi.spyOn(prisma.userRoadmap, 'findUnique').mockResolvedValue(mockUserRoadmapData as any);
    vi.spyOn(prisma.microAssessmentAttempt, 'findMany').mockResolvedValue(mockAssessmentAttempts as any);

    const profile = await verifiedProfileService.getVerifiedProfile('user-verified-1', 'ur-57-1');

    expect(profile.skills.length).toBeGreaterThan(0);
    const expectedMastered = profile.skills.filter((s) => s.status === 'MASTERED').map((s) => s.skillName);
    const expectedDemonstrated = profile.skills.filter((s) => s.status === 'DEMONSTRATED').map((s) => s.skillName);

    expect(profile.masteredSkills).toEqual(expectedMastered);
    expect(profile.demonstratedSkills).toEqual(expectedDemonstrated);
  });

  it('4. Evidence count is server-derived from persisted records', async () => {
    vi.spyOn(prisma.userRoadmap, 'findUnique').mockResolvedValue(mockUserRoadmapData as any);
    vi.spyOn(prisma.microAssessmentAttempt, 'findMany').mockResolvedValue(mockAssessmentAttempts as any);

    const profile = await verifiedProfileService.getVerifiedProfile('user-verified-1', 'ur-57-1');

    expect(profile.verifiedEvidenceCount).toBe(mockUserRoadmapData.skillEvidence.length);
    expect(profile.verifiedEvidenceCount).toBe(2);
  });

  it('5. Sprint count (completed vs total) is server-derived', async () => {
    vi.spyOn(prisma.userRoadmap, 'findUnique').mockResolvedValue(mockUserRoadmapData as any);
    vi.spyOn(prisma.microAssessmentAttempt, 'findMany').mockResolvedValue(mockAssessmentAttempts as any);

    const profile = await verifiedProfileService.getVerifiedProfile('user-verified-1', 'ur-57-1');

    expect(profile.totalSprintCount).toBe(2);
    expect(profile.completedSprintCount).toBe(1);
  });

  it('6. Assessment summary is server-derived from persisted attempts', async () => {
    vi.spyOn(prisma.userRoadmap, 'findUnique').mockResolvedValue(mockUserRoadmapData as any);
    vi.spyOn(prisma.microAssessmentAttempt, 'findMany').mockResolvedValue(mockAssessmentAttempts as any);

    const profile = await verifiedProfileService.getVerifiedProfile('user-verified-1', 'ur-57-1');

    expect(profile.assessmentSummary.totalAttempts).toBe(2);
    expect(profile.assessmentSummary.passedAttempts).toBe(2);
    expect(profile.assessmentSummary.averageScore).toBe(85); // (90+80)/2
  });

  it('7. Practical coding summary is server-derived from persisted drills', async () => {
    vi.spyOn(prisma.userRoadmap, 'findUnique').mockResolvedValue(mockUserRoadmapData as any);
    vi.spyOn(prisma.microAssessmentAttempt, 'findMany').mockResolvedValue(mockAssessmentAttempts as any);

    const profile = await verifiedProfileService.getVerifiedProfile('user-verified-1', 'ur-57-1');

    expect(profile.practicalSummary.totalDrills).toBe(1);
    expect(profile.practicalSummary.passedDrills).toBe(1);
    expect(profile.practicalSummary.averageScore).toBe(95);
  });

  it('8. Cross-user access is rejected with ForbiddenError', async () => {
    vi.spyOn(prisma.userRoadmap, 'findUnique').mockResolvedValue(mockUserRoadmapData as any);

    await expect(
      verifiedProfileService.getVerifiedProfile('another-user-99', 'ur-57-1')
    ).rejects.toThrow(ForbiddenError);
  });

  it('9. Client cannot forge readiness via controller parameters', async () => {
    vi.spyOn(prisma.userRoadmap, 'findUnique').mockResolvedValue(mockUserRoadmapData as any);
    vi.spyOn(prisma.microAssessmentAttempt, 'findMany').mockResolvedValue(mockAssessmentAttempts as any);

    const { req, res, next, getJsonResponse } = createMockReqRes({
      headers: { 'x-user-id': 'user-verified-1' },
      params: { userRoadmapId: 'ur-57-1' },
      body: { overallReadiness: 100, masteredSkillsCount: 99, verifiedEvidenceCount: 50 }, // Forged payload
    });

    await roadmapController.getVerifiedProfile(req, res, next);

    expect(next).not.toHaveBeenCalled();
    const data = getJsonResponse().data;
    // Readiness is computed server-side, not taken from request body
    expect(data.overallReadiness).not.toBe(100);
    expect(data.verifiedEvidenceCount).toBe(2);
  });

  it('10. Client cannot forge skill mastery status', async () => {
    vi.spyOn(prisma.userRoadmap, 'findUnique').mockResolvedValue(mockUserRoadmapData as any);
    vi.spyOn(prisma.microAssessmentAttempt, 'findMany').mockResolvedValue(mockAssessmentAttempts as any);

    const { req, res, next, getJsonResponse } = createMockReqRes({
      headers: { 'x-user-id': 'user-verified-1' },
      params: { userRoadmapId: 'ur-57-1' },
      body: { masteredSkills: ['Quantum Computing', 'Kernel Hacking'] },
    });

    await roadmapController.getVerifiedProfile(req, res, next);

    const data = getJsonResponse().data;
    expect(data.masteredSkills).not.toContain('Quantum Computing');
    expect(data.masteredSkills).not.toContain('Kernel Hacking');
  });

  it('11. Verification ID cannot access or forge another user roadmap', async () => {
    vi.spyOn(prisma.userRoadmap, 'findUnique').mockImplementation(async ({ where }: any) => {
      if (where.id === 'ur-57-1') return mockUserRoadmapData as any;
      return null;
    });
    vi.spyOn(prisma.microAssessmentAttempt, 'findMany').mockResolvedValue(mockAssessmentAttempts as any);

    // Valid verification lookup
    const validProfile = await verifiedProfileService.getVerifiedProfile('user-verified-1', 'ur-57-1');
    const validPublic = await verifiedProfileService.verifyPublicProfile(validProfile.verificationId);
    expect(validPublic.isValid).toBe(true);

    // Tampered verification hash for existing roadmap
    const tamperedId = `VRF-ur-57-1-FFFFFFFFFFFFFFFF`;
    const tamperedPublic = await verifiedProfileService.verifyPublicProfile(tamperedId);
    expect(tamperedPublic.isValid).toBe(false);

    // Non-existent roadmap ID
    const nonExistentId = `VRF-unknown-roadmap-1234567890ABCDEF`;
    const nonExistentPublic = await verifiedProfileService.verifyPublicProfile(nonExistentId);
    expect(nonExistentPublic.isValid).toBe(false);
  });

  it('12. Private assessment answers and questions are never exposed in profile', async () => {
    vi.spyOn(prisma.userRoadmap, 'findUnique').mockResolvedValue(mockUserRoadmapData as any);
    vi.spyOn(prisma.microAssessmentAttempt, 'findMany').mockResolvedValue(mockAssessmentAttempts as any);

    const profile = await verifiedProfileService.getVerifiedProfile('user-verified-1', 'ur-57-1');
    const profileJson = JSON.stringify(profile);

    expect(profileJson).not.toContain('questionResults');
    expect(profileJson).not.toContain('correctOptionIndex');
    expect(profileJson).not.toContain('selectedOptionIndex');
    expect(profileJson).not.toContain('password');
    expect(profileJson).not.toContain('secret');
  });

  it('13. Hidden coding test inputs/expected outputs are never exposed in profile', async () => {
    vi.spyOn(prisma.userRoadmap, 'findUnique').mockResolvedValue(mockUserRoadmapData as any);
    vi.spyOn(prisma.microAssessmentAttempt, 'findMany').mockResolvedValue(mockAssessmentAttempts as any);

    const profile = await verifiedProfileService.getVerifiedProfile('user-verified-1', 'ur-57-1');
    const profileJson = JSON.stringify(profile);

    expect(profileJson).not.toContain('testCases');
    expect(profileJson).not.toContain('expectedOutput');
    expect(profileJson).not.toContain('hiddenTests');
  });

  it('14. Export contains only approved server-verified fields', async () => {
    vi.spyOn(prisma.userRoadmap, 'findUnique').mockResolvedValue(mockUserRoadmapData as any);
    vi.spyOn(prisma.microAssessmentAttempt, 'findMany').mockResolvedValue(mockAssessmentAttempts as any);

    const profile = await verifiedProfileService.getVerifiedProfile('user-verified-1', 'ur-57-1');

    const expectedKeys = [
      'verificationId',
      'userRoadmapId',
      'roadmapId',
      'candidateName',
      'targetRole',
      'targetCompanyTier',
      'overallReadiness',
      'baselineReadiness',
      'masteredSkillsCount',
      'totalRequiredSkills',
      'inProgressSkillsCount',
      'skillsWithMissingPrerequisitesCount',
      'masteredSkills',
      'demonstratedSkills',
      'skillsInProgress',
      'missingPrerequisites',
      'completedSprintCount',
      'totalSprintCount',
      'verifiedEvidenceCount',
      'assessmentSummary',
      'practicalSummary',
      'skills',
      'domains',
      'estimatedWeeksRemaining',
      'issuedAt',
      'verificationUrl',
      'sprintArchives',
      'evidence',
      'assessments',
      'timeline',
    ];

    expect(Object.keys(profile).sort()).toEqual(expectedKeys.sort());
  });

  it('15. Controller returns 404 for non-existent roadmap in getVerifiedProfile', async () => {
    vi.spyOn(prisma.userRoadmap, 'findUnique').mockResolvedValue(null);

    const { req, res, next } = createMockReqRes({
      headers: { 'x-user-id': 'user-verified-1' },
      params: { userRoadmapId: 'non-existent' },
    });

    await roadmapController.getVerifiedProfile(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(NotFoundError));
  });

  it('16. Public verification endpoint controller handles requests', async () => {
    vi.spyOn(prisma.userRoadmap, 'findUnique').mockResolvedValue(mockUserRoadmapData as any);
    vi.spyOn(prisma.microAssessmentAttempt, 'findMany').mockResolvedValue(mockAssessmentAttempts as any);

    const profile = await verifiedProfileService.getVerifiedProfile('user-verified-1', 'ur-57-1');

    const { req, res, next, getStatusCode, getJsonResponse } = createMockReqRes({
      params: { verificationId: profile.verificationId },
    });

    await roadmapController.verifyPublicProfile(req, res, next);

    expect(getStatusCode()).toBe(200);
    const data = getJsonResponse().data;
    expect(data.isValid).toBe(true);
    expect(data.verificationId).toBe(profile.verificationId);
    expect(data.targetRole).toBe(profile.targetRole);
    expect(data.overallReadiness).toBe(profile.overallReadiness);
  });
});
