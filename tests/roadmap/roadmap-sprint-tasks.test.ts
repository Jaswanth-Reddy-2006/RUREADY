import { describe, expect, it, vi, beforeEach } from 'vitest';
import { roadmapController } from '../../services/roadmap-service/src/controllers/roadmap.controller.js';
import { adaptiveRoadmapService } from '../../services/roadmap-service/src/services/adaptive-roadmap.service.js';
import { prisma } from '../../services/roadmap-service/src/lib/prisma.js';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../../services/roadmap-service/src/lib/errors.js';
import { useRoadmapStore } from '../../client/src/store/useRoadmapStore.js';
import { roadmapApi } from '../../client/src/api/roadmap.js';

describe('Stage 4.2: Live Sprint Task Binding & Evidence Gate', () => {
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

  describe('Adaptive Roadmap Service: updateSprintTask()', () => {
    const mockTask = {
      id: 'task-101',
      sprintId: 'sprint-202',
      title: 'Postgres B-Tree Index Optimization',
      orderIndex: 1,
      estimatedMinutes: 60,
      requiresEvidence: false,
      status: 'TODO',
      sprint: {
        userRoadmapId: 'ur-303',
      },
    };

    it('1. should update task status to COMPLETED and record completedAt timestamp', async () => {
      vi.spyOn(prisma.roadmapSprintTask, 'findFirst').mockResolvedValue(mockTask as any);
      vi.spyOn(prisma.roadmapSprintTask, 'update').mockResolvedValue({
        ...mockTask,
        status: 'COMPLETED',
        completedAt: new Date('2026-03-30T10:00:00Z'),
      } as any);

      const result = await adaptiveRoadmapService.updateSprintTask(
        'user-1',
        'sprint-202',
        'task-101',
        { status: 'COMPLETED' }
      );

      expect(result.status).toBe('COMPLETED');
      expect(result.completedAt).toBeDefined();
    });

    it('2. should reject completion with BadRequestError if task requiresEvidence and evidenceCount is 0', async () => {
      const taskWithEvidence = {
        ...mockTask,
        id: 'task-evidence-required',
        requiresEvidence: true,
      };

      vi.spyOn(prisma.roadmapSprintTask, 'findFirst').mockResolvedValue(taskWithEvidence as any);
      vi.spyOn(prisma.skillEvidence, 'count').mockResolvedValue(0);

      await expect(
        adaptiveRoadmapService.updateSprintTask(
          'user-1',
          'sprint-202',
          'task-evidence-required',
          { status: 'COMPLETED' }
        )
      ).rejects.toThrow('This task requires evidence before it can be completed');
    });

    it('3. should allow completion if task requiresEvidence and valid evidence exists', async () => {
      const taskWithEvidence = {
        ...mockTask,
        id: 'task-evidence-required',
        requiresEvidence: true,
      };

      vi.spyOn(prisma.roadmapSprintTask, 'findFirst').mockResolvedValue(taskWithEvidence as any);
      vi.spyOn(prisma.skillEvidence, 'count').mockResolvedValue(2);
      vi.spyOn(prisma.roadmapSprintTask, 'update').mockResolvedValue({
        ...taskWithEvidence,
        status: 'COMPLETED',
        completedAt: new Date(),
      } as any);

      const result = await adaptiveRoadmapService.updateSprintTask(
        'user-1',
        'sprint-202',
        'task-evidence-required',
        { status: 'COMPLETED' }
      );

      expect(result.status).toBe('COMPLETED');
    });

    it('4. should throw NotFoundError if sprint task is not found', async () => {
      vi.spyOn(prisma.roadmapSprintTask, 'findFirst').mockResolvedValue(null);

      await expect(
        adaptiveRoadmapService.updateSprintTask('user-1', 'sprint-202', 'non-existent-task', {
          status: 'COMPLETED',
        })
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('Roadmap Controller: updateSprintTask()', () => {
    it('5. should return 200 with updated task on valid authenticated PATCH request', async () => {
      const mockUpdated = {
        id: 'task-101',
        sprintId: 'sprint-202',
        status: 'COMPLETED',
      };

      vi.spyOn(adaptiveRoadmapService, 'updateSprintTask').mockResolvedValue(mockUpdated as any);

      const { req, res, next, getStatusCode, getJsonResponse } = createMockReqRes({
        headers: { 'x-user-id': 'usr-test-99' },
        params: { sprintId: 'sprint-202', taskId: 'task-101' },
        body: { status: 'COMPLETED' },
      });

      await roadmapController.updateSprintTask(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(getStatusCode()).toBe(200);
      expect(getJsonResponse().success).toBe(true);
      expect(getJsonResponse().data.status).toBe('COMPLETED');
    });

    it('6. should reject unauthenticated PATCH request with UnauthorizedError', async () => {
      const { req, res, next } = createMockReqRes({
        headers: {}, // missing x-user-id
        params: { sprintId: 'sprint-202', taskId: 'task-101' },
        body: { status: 'COMPLETED' },
      });

      await roadmapController.updateSprintTask(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next.mock.calls[0][0]).toBeInstanceOf(UnauthorizedError);
    });
  });

  describe('Zustand Store: updateSprintTaskStatus & Rollback on Error', () => {
    it('7. should roll back optimistic task completion if backend rejects due to evidence gate', async () => {
      const initialUserRoadmap = {
        id: 'ur-store-1',
        userId: 'usr-1',
        sourceRoadmapId: 'roadmap-1',
        status: 'ACTIVE' as const,
        personalization: {
          targetRole: 'Architect',
          hoursPerDay: 2,
          daysPerWeek: 5,
          sprintDurationDays: 7 as const,
        },
        sprints: [
          {
            id: 'sprint-store-1',
            userRoadmapId: 'ur-store-1',
            sprintNumber: 1,
            startDate: new Date().toISOString(),
            endDate: new Date().toISOString(),
            objective: 'Master Core Systems',
            expectedMinutes: 120,
            status: 'ACTIVE' as const,
            tasks: [
              {
                id: 'task-store-1',
                sprintId: 'sprint-store-1',
                title: 'Evidence Required Task',
                orderIndex: 1,
                estimatedMinutes: 60,
                requiresEvidence: true,
                status: 'TODO' as const,
                completedAt: null,
              },
            ],
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Set initial store state
      useRoadmapStore.setState({
        userRoadmaps: {
          'ur-store-1': initialUserRoadmap,
          'roadmap-1': initialUserRoadmap,
        },
        activeUserRoadmap: initialUserRoadmap,
        activeRoadmapId: 'roadmap-1',
      });

      // Mock backend rejection with evidence gate error
      vi.spyOn(roadmapApi, 'updateSprintTask').mockRejectedValue({
        response: {
          status: 400,
          data: {
            success: false,
            message: 'This task requires evidence before it can be completed',
          },
        },
      });

      const result = await useRoadmapStore
        .getState()
        .updateSprintTaskStatus('sprint-store-1', 'task-store-1', 'COMPLETED');

      expect(result.success).toBe(false);
      expect(result.error).toContain('evidence');

      // Verify that the task in the store rolled back to 'TODO' and is not 'COMPLETED'
      const storeState = useRoadmapStore.getState();
      const currentTask = storeState.activeUserRoadmap?.sprints[0].tasks[0];
      expect(currentTask?.status).toBe('TODO');
      expect(currentTask?.completedAt).toBeNull();
    });
  });
});
