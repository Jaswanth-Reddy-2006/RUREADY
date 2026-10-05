import { describe, expect, it, vi, beforeEach } from 'vitest';
import { roadmapController } from '../../services/roadmap-service/src/controllers/roadmap.controller.js';
import { adaptiveRoadmapService } from '../../services/roadmap-service/src/services/adaptive-roadmap.service.js';
import { personalizationSchema } from '../../services/roadmap-service/src/domain/roadmap.domain.js';
import { prisma } from '../../services/roadmap-service/src/lib/prisma.js';
import { NotFoundError, UnauthorizedError } from '../../services/roadmap-service/src/lib/errors.js';
import { buildDefaultPersonalization } from '../../client/src/api/roadmap.js';

describe('Stage 4.1: Roadmap Enrollment Bridge & Personalization', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

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

  describe('Frontend Personalization Builder (buildDefaultPersonalization)', () => {
    it('1. should generate a schema-compliant payload from a Roadmap object', () => {
      const roadmap = {
        id: 'rdmp-test-1',
        title: 'Senior Frontend Architect',
        rolePath: 'FRONTEND',
        category: 'FRONTEND' as const,
        targetCompanyTier: 'FAANG' as const,
        difficulty: 'Advanced' as const,
        description: 'Comprehensive frontend roadmap',
        tags: ['React 19', 'TypeScript', 'Next.js'],
        estimatedWeeks: 10,
        isOfficial: true,
        isPublic: true,
        isAiGenerated: false,
        creatorId: 'ru-ready',
        creatorName: 'Curriculum Team',
        creatorUsername: 'ru_ready',
        overallReadiness: 0,
        enrolledCount: 100,
        upvotes: 50,
        nodesData: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const payload = buildDefaultPersonalization(roadmap);

      // Verify schema parsing passes with zero errors
      const validated = personalizationSchema.parse(payload);
      expect(validated.targetRole).toBe('FRONTEND');
      expect(validated.currentLevel).toBe('ADVANCED');
      expect(validated.targetCompany).toBe('FAANG');
      expect(validated.hoursPerDay).toBe(1.5);
      expect(validated.daysPerWeek).toBe(5);
      expect(validated.sprintDurationDays).toBe(7);
      expect(validated.preferredTechnologies).toEqual(['React 19', 'TypeScript', 'Next.js']);
    });

    it('2. should handle fallback values gracefully for partial roadmaps', () => {
      const payload = buildDefaultPersonalization({});

      const validated = personalizationSchema.parse(payload);
      expect(validated.targetRole).toBe('Software Engineer');
      expect(validated.currentLevel).toBe('INTERMEDIATE');
      expect(validated.hoursPerDay).toBeGreaterThanOrEqual(0.25);
      expect(validated.daysPerWeek).toBeGreaterThanOrEqual(1);
      expect(validated.sprintDurationDays).toBe(7);
    });
  });

  describe('Adaptive Roadmap Service: followRoadmap()', () => {
    const mockSourceRoadmap = {
      id: 'roadmap-cuid-123',
      userId: 'creator-1',
      title: 'Backend Engineering System',
      description: 'System design and backend',
      rolePath: 'BACKEND',
      visibility: 'PUBLIC',
      updatedAt: new Date('2026-03-01T00:00:00Z'),
      nodes: [
        {
          id: 'node-cuid-1',
          legacyNodeId: 'node-1',
          title: 'Database Indexing',
          category: 'Databases',
          orderIndex: 1,
          estimatedMinutes: 90,
          requiresEvidence: false,
        },
        {
          id: 'node-cuid-2',
          legacyNodeId: 'node-2',
          title: 'Redis Caching',
          category: 'Caching',
          orderIndex: 2,
          estimatedMinutes: 60,
          requiresEvidence: true,
        },
      ],
    };

    const mockPersonalizationPayload = {
      currentLevel: 'INTERMEDIATE',
      targetRole: 'Backend Engineer',
      targetOutcome: 'Master Backend Architecture',
      hoursPerDay: 2,
      daysPerWeek: 5,
      sprintDurationDays: 7,
      preferredTechnologies: ['Node.js', 'PostgreSQL'],
    };

    it('3. should create UserRoadmap with initial Sprint 1 when user follows for the first time', async () => {
      vi.spyOn(prisma.careerRoadmap, 'findFirst').mockResolvedValue(mockSourceRoadmap as any);
      vi.spyOn(prisma.userRoadmap, 'findUnique').mockResolvedValue(null);

      const createdUserRoadmap = {
        id: 'user-roadmap-cuid-456',
        userId: 'candidate-user-1',
        sourceRoadmapId: 'roadmap-cuid-123',
        status: 'ACTIVE',
        personalization: mockPersonalizationPayload,
      };

      vi.spyOn(prisma.userRoadmap, 'create').mockResolvedValue(createdUserRoadmap as any);
      vi.spyOn(prisma.roadmapSprint, 'findUnique').mockResolvedValue(null);
      vi.spyOn(prisma.roadmapSprint, 'create').mockResolvedValue({
        id: 'sprint-1',
        userRoadmapId: createdUserRoadmap.id,
        sprintNumber: 1,
        status: 'ACTIVE',
      } as any);
      vi.spyOn(prisma.roadmapSprintTask, 'createMany').mockResolvedValue({ count: 2 });

      const detailedUserRoadmap = {
        ...createdUserRoadmap,
        sourceRoadmap: mockSourceRoadmap,
        sprints: [
          {
            id: 'sprint-1',
            sprintNumber: 1,
            status: 'ACTIVE',
            tasks: [
              { id: 'task-1', title: 'Database Indexing', status: 'TODO', orderIndex: 1 },
              { id: 'task-2', title: 'Redis Caching', status: 'TODO', orderIndex: 2 },
            ],
          },
        ],
        adaptations: [],
        skillEvidence: [],
      };

      vi.spyOn(prisma.userRoadmap, 'findFirst').mockResolvedValue(detailedUserRoadmap as any);

      const result = await adaptiveRoadmapService.followRoadmap(
        'candidate-user-1',
        'roadmap-cuid-123',
        mockPersonalizationPayload
      );

      expect(result).toBeDefined();
      expect(result.id).toBe('user-roadmap-cuid-456');
      expect(result.sourceRoadmapId).toBe('roadmap-cuid-123');
      expect(result.sprints.length).toBe(1);
      expect(result.sprints[0].sprintNumber).toBe(1);
    });

    it('4. should idempotently return existing UserRoadmap without duplicating enrollment', async () => {
      vi.spyOn(prisma.careerRoadmap, 'findFirst').mockResolvedValue(mockSourceRoadmap as any);

      const existingEnrollment = {
        id: 'existing-ur-999',
        userId: 'candidate-user-1',
        sourceRoadmapId: 'roadmap-cuid-123',
      };
      vi.spyOn(prisma.userRoadmap, 'findUnique').mockResolvedValue(existingEnrollment as any);

      const existingDetailedUserRoadmap = {
        ...existingEnrollment,
        status: 'ACTIVE',
        sourceRoadmap: mockSourceRoadmap,
        sprints: [{ id: 'sprint-1', sprintNumber: 1, status: 'ACTIVE', tasks: [] }],
        adaptations: [],
        skillEvidence: [],
      };
      vi.spyOn(prisma.userRoadmap, 'findFirst').mockResolvedValue(existingDetailedUserRoadmap as any);

      const createSpy = vi.spyOn(prisma.userRoadmap, 'create');

      const result = await adaptiveRoadmapService.followRoadmap(
        'candidate-user-1',
        'roadmap-cuid-123',
        mockPersonalizationPayload
      );

      expect(createSpy).not.toHaveBeenCalled();
      expect(result.id).toBe('existing-ur-999');
    });

    it('5. should throw NotFoundError if source roadmap does not exist', async () => {
      vi.spyOn(prisma.careerRoadmap, 'findFirst').mockResolvedValue(null);

      await expect(
        adaptiveRoadmapService.followRoadmap('user-1', 'non-existent-roadmap', mockPersonalizationPayload)
      ).rejects.toThrow(NotFoundError);
    });

    it('6. should reject invalid personalization payload (hoursPerDay = 0)', async () => {
      await expect(
        adaptiveRoadmapService.followRoadmap('user-1', 'roadmap-cuid-123', {
          ...mockPersonalizationPayload,
          hoursPerDay: 0,
        })
      ).rejects.toThrow();
    });
  });

  describe('Roadmap Controller: followRoadmap()', () => {
    it('7. should successfully process follow request and return 201 with UserRoadmap', async () => {
      const mockResult = {
        id: 'user-roadmap-cuid-789',
        userId: 'usr_auth_client',
        sourceRoadmapId: 'roadmap-1',
        status: 'ACTIVE',
        sprints: [{ id: 'sprint-1', sprintNumber: 1, tasks: [] }],
      };

      vi.spyOn(adaptiveRoadmapService, 'followRoadmap').mockResolvedValue(mockResult as any);

      const { req, res, next, getStatusCode, getJsonResponse } = createMockReqRes({
        headers: { 'x-user-id': 'usr_auth_client' },
        params: { id: 'roadmap-1' },
        body: {
          currentLevel: 'ADVANCED',
          targetRole: 'Staff Architect',
          targetOutcome: 'Master FAANG Standards',
          hoursPerDay: 2,
          daysPerWeek: 5,
          sprintDurationDays: 7,
        },
      });

      await roadmapController.followRoadmap(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(getStatusCode()).toBe(201);
      expect(getJsonResponse().success).toBe(true);
      expect(getJsonResponse().data.id).toBe('user-roadmap-cuid-789');
    });

    it('8. should reject unauthenticated follow request with UnauthorizedError', async () => {
      const { req, res, next } = createMockReqRes({
        headers: {}, // missing x-user-id
        params: { id: 'roadmap-1' },
        body: {},
      });

      await roadmapController.followRoadmap(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      const err = next.mock.calls[0][0];
      expect(err).toBeInstanceOf(UnauthorizedError);
    });
  });
});
