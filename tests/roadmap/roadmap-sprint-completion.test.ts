import { describe, expect, it, vi, beforeEach } from 'vitest';
import { roadmapController } from '../../services/roadmap-service/src/controllers/roadmap.controller.js';
import { adaptiveRoadmapService } from '../../services/roadmap-service/src/services/adaptive-roadmap.service.js';
import { prisma } from '../../services/roadmap-service/src/lib/prisma.js';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../../services/roadmap-service/src/lib/errors.js';
import { useRoadmapStore } from '../../client/src/store/useRoadmapStore.js';
import { roadmapApi } from '../../client/src/api/roadmap.js';

describe('Stage 4.3: Sprint Review, Completion & Adaptive Next Sprint', () => {
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

  const mockActiveSprint = {
    id: 'sprint-101',
    userRoadmapId: 'ur-202',
    sprintNumber: 1,
    startDate: new Date('2026-03-20T00:00:00Z'),
    endDate: new Date('2026-03-27T23:59:59Z'),
    objective: 'Master Foundations & Core React Architecture',
    expectedMinutes: 180,
    status: 'ACTIVE',
    decision: null,
    tasks: [
      {
        id: 'task-1',
        sprintId: 'sprint-101',
        title: 'React Fiber Internals',
        orderIndex: 1,
        estimatedMinutes: 60,
        requiresEvidence: false,
        status: 'COMPLETED',
      },
      {
        id: 'task-2',
        sprintId: 'sprint-101',
        title: 'Concurrent Transitions Drill',
        orderIndex: 2,
        estimatedMinutes: 60,
        requiresEvidence: false,
        status: 'COMPLETED',
      },
    ],
    userRoadmap: {
      id: 'ur-202',
      userId: 'user-1',
      sourceRoadmapId: 'roadmap-fullstack',
      personalization: {
        targetRole: 'Senior Fullstack Engineer',
        targetOutcome: 'FAANG Placement',
        hoursPerDay: 2,
        daysPerWeek: 5,
        sprintDurationDays: 7,
      },
    },
  };

  const mockSourceRoadmap = {
    id: 'roadmap-fullstack',
    title: 'Senior Fullstack Engineer',
    nodes: [
      {
        id: 'node-1',
        title: 'React Fiber Internals',
        description: 'React Fiber',
        orderIndex: 1,
        estimatedMinutes: 60,
        requiresEvidence: false,
      },
      {
        id: 'node-2',
        title: 'Concurrent Transitions Drill',
        description: 'Transitions',
        orderIndex: 2,
        estimatedMinutes: 60,
        requiresEvidence: false,
      },
      {
        id: 'node-3',
        title: 'Node.js Event Loop & Concurrency',
        description: 'libuv Event Loop',
        orderIndex: 3,
        estimatedMinutes: 90,
        requiresEvidence: false,
      },
    ],
    nodesData: [],
  };

  describe('Adaptive Roadmap Service: completeSprint()', () => {
    it('1. completes active sprint, determines adaptation recommendation, and creates next sprint', async () => {
      vi.spyOn(prisma.roadmapSprint, 'findFirst').mockResolvedValue(mockActiveSprint as any);
      vi.spyOn(prisma, '$transaction').mockResolvedValue([{ ...mockActiveSprint, status: 'COMPLETED' }, {}] as any);
      vi.spyOn(prisma.careerRoadmap, 'findUnique').mockResolvedValue(mockSourceRoadmap as any);
      vi.spyOn(prisma.roadmapAdaptation, 'create').mockResolvedValue({ id: 'adapt-1' } as any);

      const nextSprintMock = {
        id: 'sprint-102',
        userRoadmapId: 'ur-202',
        sprintNumber: 2,
        startDate: new Date('2026-03-28T00:00:00Z'),
        endDate: new Date('2026-04-04T23:59:59Z'),
        objective: 'Advance through core milestones for Senior Fullstack Engineer',
        expectedMinutes: 90,
        status: 'ACTIVE',
        decision: null,
        tasks: [],
      };
      vi.spyOn(adaptiveRoadmapService, 'createNextSprint').mockResolvedValue(nextSprintMock as any);
      vi.spyOn(prisma.roadmapSprint, 'findUnique').mockResolvedValue({
        ...mockActiveSprint,
        status: 'COMPLETED',
        decision: 'ACCELERATE',
        performance: { taskCompletion: 100, assessmentScore: 90, practicalScore: 90, codingScore: 90 },
      } as any);

      const result = await adaptiveRoadmapService.completeSprint('user-1', 'sprint-101', {
        assessmentScore: 90,
        practicalScore: 90,
        codingScore: 90,
        consistencyScore: 95,
        notes: 'Great mastery of React 19 concurrent concepts',
      });

      expect(result.sprint).toBeDefined();
      expect(result.sprint?.status).toBe('COMPLETED');
      expect(result.recommendation.decision).toBe('ACCELERATE');
      expect(result.recommendation.action).toBe('ACCELERATE_TASK');
      expect(result.nextSprint).toBeDefined();
      expect(result.nextSprint?.sprintNumber).toBe(2);
    });

    it('2. throws NotFoundError if sprint does not exist for the user', async () => {
      vi.spyOn(prisma.roadmapSprint, 'findFirst').mockResolvedValue(null);

      await expect(
        adaptiveRoadmapService.completeSprint('user-1', 'nonexistent-sprint', {
          assessmentScore: 80,
        })
      ).rejects.toThrow(NotFoundError);
    });

    it('3. throws BadRequestError if sprint is already completed', async () => {
      vi.spyOn(prisma.roadmapSprint, 'findFirst').mockResolvedValue({
        ...mockActiveSprint,
        status: 'COMPLETED',
      } as any);

      await expect(
        adaptiveRoadmapService.completeSprint('user-1', 'sprint-101', {
          assessmentScore: 80,
        })
      ).rejects.toThrow('Sprint is already completed');
    });

    it('4. applies remediation adaptation if assessment performance is low', async () => {
      vi.spyOn(prisma.roadmapSprint, 'findFirst').mockResolvedValue(mockActiveSprint as any);
      vi.spyOn(prisma, '$transaction').mockResolvedValue([{ ...mockActiveSprint, status: 'COMPLETED' }, {}] as any);
      vi.spyOn(prisma.careerRoadmap, 'findUnique').mockResolvedValue(mockSourceRoadmap as any);
      vi.spyOn(prisma.roadmapAdaptation, 'create').mockResolvedValue({ id: 'adapt-2' } as any);
      vi.spyOn(adaptiveRoadmapService, 'createNextSprint').mockResolvedValue({
        id: 'sprint-102-remediate',
        sprintNumber: 2,
        objective: 'Reinforce foundational concepts before advancing',
        status: 'ACTIVE',
      } as any);
      vi.spyOn(prisma.roadmapSprint, 'findUnique').mockResolvedValue({
        ...mockActiveSprint,
        status: 'COMPLETED',
        decision: 'REMEDIATE',
      } as any);

      const result = await adaptiveRoadmapService.completeSprint('user-1', 'sprint-101', {
        assessmentScore: 40,
        practicalScore: 50,
      });

      expect(result.recommendation.decision).toBe('REMEDIATE');
      expect(result.recommendation.action).toBe('INSERT_REINFORCEMENT');
    });

    it('4b. completes sprint and creates valid next active sprint when adaptation decision is CONTINUE', async () => {
      vi.spyOn(prisma.roadmapSprint, 'findFirst').mockResolvedValue(mockActiveSprint as any);
      vi.spyOn(prisma, '$transaction').mockResolvedValue([{ ...mockActiveSprint, status: 'COMPLETED' }, {}] as any);
      vi.spyOn(prisma.careerRoadmap, 'findUnique').mockResolvedValue(mockSourceRoadmap as any);
      const createAdaptationSpy = vi.spyOn(prisma.roadmapAdaptation, 'create');

      const nextSprintMock = {
        id: 'sprint-102-continue',
        userRoadmapId: 'ur-202',
        sprintNumber: 2,
        startDate: new Date('2026-03-28T00:00:00Z'),
        endDate: new Date('2026-04-04T23:59:59Z'),
        objective: 'Continue planned milestones for Senior Fullstack Engineer',
        expectedMinutes: 120,
        status: 'ACTIVE',
        decision: null,
        tasks: [],
      };
      const createNextSprintSpy = vi.spyOn(adaptiveRoadmapService, 'createNextSprint').mockResolvedValue(nextSprintMock as any);
      vi.spyOn(prisma.roadmapSprint, 'findUnique').mockResolvedValue({
        ...mockActiveSprint,
        status: 'COMPLETED',
        decision: 'CONTINUE',
        performance: { taskCompletion: 100, assessmentScore: 75, practicalScore: 75 },
      } as any);

      // Normal performance (70-80%) results in CONTINUE with action === null
      const result = await adaptiveRoadmapService.completeSprint('user-1', 'sprint-101', {
        assessmentScore: 75,
        practicalScore: 75,
        codingScore: 75,
      });

      expect(result.sprint).toBeDefined();
      expect(result.sprint?.status).toBe('COMPLETED');
      expect(result.recommendation.decision).toBe('CONTINUE');
      expect(result.recommendation.action).toBeNull();
      expect(result.nextSprint).toBeDefined();
      expect(result.nextSprint?.id).toBe('sprint-102-continue');
      expect(result.nextSprint?.status).toBe('ACTIVE');
      expect(createNextSprintSpy).toHaveBeenCalledTimes(1);
      // No adaptation intervention record created for normal CONTINUE
      expect(createAdaptationSpy).not.toHaveBeenCalled();
    });

    it('4c. does not create duplicate next sprint if next sprint already exists in database', async () => {
      vi.spyOn(prisma.roadmapSprint, 'findFirst').mockResolvedValue(mockActiveSprint as any);
      vi.spyOn(prisma, '$transaction').mockResolvedValue([{ ...mockActiveSprint, status: 'COMPLETED' }, {}] as any);
      vi.spyOn(prisma.careerRoadmap, 'findUnique').mockResolvedValue(mockSourceRoadmap as any);

      const existingNextSprint = {
        id: 'sprint-102-already-exists',
        userRoadmapId: 'ur-202',
        sprintNumber: 2,
        status: 'ACTIVE',
        tasks: [],
      };
      vi.spyOn(prisma.roadmapSprint, 'findUnique')
        .mockResolvedValueOnce(existingNextSprint as any) // in createNextSprint existing check
        .mockResolvedValueOnce({ ...mockActiveSprint, status: 'COMPLETED', decision: 'CONTINUE' } as any); // in completeSprint final query

      const createSprintSpy = vi.spyOn(prisma.roadmapSprint, 'create');

      const result = await adaptiveRoadmapService.completeSprint('user-1', 'sprint-101', {
        assessmentScore: 75,
      });

      expect(result.nextSprint?.id).toBe('sprint-102-already-exists');
      expect(createSprintSpy).not.toHaveBeenCalled();
    });

    it('4d. preserves EXTEND sprint adaptation and carries forward incomplete tasks', async () => {
      const incompleteActiveSprint = {
        ...mockActiveSprint,
        tasks: [
          { id: 'task-1', title: 'Task 1', status: 'COMPLETED', requiresEvidence: false, estimatedMinutes: 60, roadmapNodeId: 'node-1' },
          { id: 'task-2', title: 'Task 2', status: 'IN_PROGRESS', requiresEvidence: true, estimatedMinutes: 60, roadmapNodeId: 'node-2' },
        ],
      };
      vi.spyOn(prisma.roadmapSprint, 'findFirst').mockResolvedValue(incompleteActiveSprint as any);
      vi.spyOn(prisma, '$transaction').mockResolvedValue([{ ...incompleteActiveSprint, status: 'COMPLETED' }, {}] as any);
      vi.spyOn(prisma.careerRoadmap, 'findUnique').mockResolvedValue(mockSourceRoadmap as any);
      vi.spyOn(prisma.roadmapAdaptation, 'create').mockResolvedValue({ id: 'adapt-extend' } as any);

      const createNextSprintSpy = vi.spyOn(adaptiveRoadmapService, 'createNextSprint').mockResolvedValue({
        id: 'sprint-102-extended',
        sprintNumber: 2,
        status: 'ACTIVE',
        tasks: [],
      } as any);

      vi.spyOn(prisma.roadmapSprint, 'findUnique').mockResolvedValue({
        ...incompleteActiveSprint,
        status: 'COMPLETED',
        decision: 'EXTEND',
      } as any);

      const result = await adaptiveRoadmapService.completeSprint('user-1', 'sprint-101', {
        assessmentScore: 70,
        consistencyScore: 40, // triggers EXTEND
      });

      expect(result.recommendation.decision).toBe('EXTEND');
      expect(result.recommendation.action).toBe('EXTEND_SPRINT');
      expect(createNextSprintSpy).toHaveBeenCalledWith(
        'ur-202',
        expect.anything(),
        expect.anything(),
        2,
        expect.any(Date),
        'EXTEND_SPRINT',
        expect.arrayContaining([expect.objectContaining({ id: 'task-2', status: 'IN_PROGRESS' })])
      );
    });
  });

  describe('Roadmap Controller: completeSprint()', () => {
    it('5. forwards to next(err) with UnauthorizedError when user header is missing', async () => {
      const { req, res, next } = createMockReqRes({
        headers: {},
        params: { sprintId: 'sprint-101' },
        body: { assessmentScore: 85 },
      });

      await roadmapController.completeSprint(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      const error = next.mock.calls[0][0];
      expect(error).toBeInstanceOf(UnauthorizedError);
    });

    it('6. returns 200 with review and next sprint upon valid completion', async () => {
      const { req, res, next, getStatusCode, getJsonResponse } = createMockReqRes({
        headers: { 'x-user-id': 'user-1' },
        params: { sprintId: 'sprint-101' },
        body: {
          assessmentScore: 88,
          practicalScore: 85,
          codingScore: 82,
        },
      });

      const mockReviewResponse = {
        sprint: { id: 'sprint-101', status: 'COMPLETED' },
        recommendation: { decision: 'CONTINUE', action: null, reason: 'Good progress' },
        nextSprint: { id: 'sprint-102', sprintNumber: 2, status: 'ACTIVE' },
      };

      vi.spyOn(adaptiveRoadmapService, 'completeSprint').mockResolvedValue(mockReviewResponse as any);

      await roadmapController.completeSprint(req, res, next);

      expect(getStatusCode()).toBe(200);
      expect(getJsonResponse().success).toBe(true);
      expect(getJsonResponse().data).toEqual(mockReviewResponse);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('Frontend Store: completeSprint()', () => {
    it('7. updates completed sprint, sets next sprint as active in store, and returns review', async () => {
      const initialUserRoadmap = {
        id: 'ur-202',
        userId: 'user-1',
        sourceRoadmapId: 'official-fullstack-faang',
        status: 'ACTIVE' as const,
        personalization: {
          targetRole: 'Fullstack Engineer',
          hoursPerDay: 2,
          daysPerWeek: 5,
          sprintDurationDays: 7 as const,
        },
        sourceRoadmap: { id: 'official-fullstack-faang', title: 'Fullstack' } as any,
        sprints: [
          {
            id: 'sprint-101',
            userRoadmapId: 'ur-202',
            sprintNumber: 1,
            startDate: '2026-03-20T00:00:00Z',
            endDate: '2026-03-27T23:59:59Z',
            objective: 'Sprint 1 Objectives',
            expectedMinutes: 180,
            status: 'ACTIVE' as const,
            decision: null,
            tasks: [],
          },
        ],
        createdAt: '2026-03-20T00:00:00Z',
        updatedAt: '2026-03-20T00:00:00Z',
      };

      useRoadmapStore.setState({
        activeRoadmapId: 'official-fullstack-faang',
        activeUserRoadmap: initialUserRoadmap,
        userRoadmaps: {
          'official-fullstack-faang': initialUserRoadmap,
          'ur-202': initialUserRoadmap,
        },
      });

      const nextSprintData = {
        id: 'sprint-102',
        userRoadmapId: 'ur-202',
        sprintNumber: 2,
        startDate: '2026-03-28T00:00:00Z',
        endDate: '2026-04-04T23:59:59Z',
        objective: 'Sprint 2 Advanced Scaling',
        expectedMinutes: 240,
        status: 'ACTIVE' as const,
        decision: null,
        tasks: [
          {
            id: 'task-201',
            sprintId: 'sprint-102',
            title: 'Redis Caching & Sharding',
            orderIndex: 1,
            estimatedMinutes: 60,
            requiresEvidence: false,
            status: 'TODO' as const,
          },
        ],
      };

      const mockReviewResult = {
        sprint: {
          ...initialUserRoadmap.sprints[0],
          status: 'COMPLETED' as const,
          decision: 'CONTINUE' as const,
          performance: { assessmentScore: 85 },
        },
        recommendation: {
          decision: 'CONTINUE' as const,
          action: null,
          reason: 'Advancing to sprint 2',
        },
        nextSprint: nextSprintData,
      };

      vi.spyOn(roadmapApi, 'completeSprint').mockResolvedValue(mockReviewResult);

      const result = await useRoadmapStore.getState().completeSprint('sprint-101', {
        assessmentScore: 85,
        practicalScore: 80,
      });

      expect(result.success).toBe(true);
      expect(result.review).toEqual(mockReviewResult);

      const updatedActiveRoadmap = useRoadmapStore.getState().activeUserRoadmap;
      expect(updatedActiveRoadmap).toBeDefined();

      const completedSprint = updatedActiveRoadmap?.sprints.find((s) => s.id === 'sprint-101');
      expect(completedSprint?.status).toBe('COMPLETED');
      expect(completedSprint?.decision).toBe('CONTINUE');

      const nextSprint = updatedActiveRoadmap?.sprints.find((s) => s.id === 'sprint-102');
      expect(nextSprint).toBeDefined();
      expect(nextSprint?.status).toBe('ACTIVE');
      expect(nextSprint?.sprintNumber).toBe(2);

      // Verify the active sprint in userRoadmap is now the next sprint
      const activeSprint = updatedActiveRoadmap?.sprints.find((s) => s.status === 'ACTIVE');
      expect(activeSprint?.id).toBe('sprint-102');
      expect(activeSprint?.sprintNumber).toBe(2);
    });

    it('8. gracefully surfaces backend errors without modifying state', async () => {
      const errorObj = {
        response: {
          data: {
            message: 'Sprint is already completed',
          },
        },
      };
      vi.spyOn(roadmapApi, 'completeSprint').mockRejectedValue(errorObj);

      const result = await useRoadmapStore.getState().completeSprint('sprint-already-done', {
        assessmentScore: 90,
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Sprint is already completed');
      expect(useRoadmapStore.getState().isCompletingSprint).toBe(false);
    });
  });
});
