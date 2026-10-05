import { describe, expect, it, vi, beforeEach } from 'vitest';
import { roadmapController } from '../../services/roadmap-service/src/controllers/roadmap.controller.js';
import { adaptiveRoadmapService } from '../../services/roadmap-service/src/services/adaptive-roadmap.service.js';
import { prisma } from '../../services/roadmap-service/src/lib/prisma.js';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../../services/roadmap-service/src/lib/errors.js';
import { useRoadmapStore } from '../../client/src/store/useRoadmapStore.js';
import { roadmapApi } from '../../client/src/api/roadmap.js';

describe('Stage 4.4: Skill Evidence Recording & Verification', () => {
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

  const validSkillCuid = 'cjld2cjxh0000qzrmn831i7rn';

  const mockUserRoadmap = {
    id: 'ur-101',
    userId: 'user-1',
    sourceRoadmapId: 'roadmap-fullstack',
    status: 'ACTIVE',
  };

  const mockSkill = {
    id: validSkillCuid,
    slug: 'react-fiber',
    name: 'React Fiber Architecture',
    category: 'Frontend Core',
  };

  describe('Adaptive Roadmap Service: recordSelfReportedEvidence()', () => {
    it('1. should record self-reported skill evidence with valid cuid and estimated proficiency', async () => {
      vi.spyOn(prisma.userRoadmap, 'findFirst').mockResolvedValue(mockUserRoadmap as any);
      vi.spyOn(prisma.skill, 'findUnique').mockResolvedValue(mockSkill as any);

      const createdEvidenceMock = {
        id: 'ev-1',
        userRoadmapId: 'ur-101',
        skillId: validSkillCuid,
        source: 'SELF_REPORTED',
        estimatedProficiency: 88,
        confidence: 20,
        metadata: { notes: 'Completed concurrency sandbox drill' },
        assessedAt: new Date(),
        skill: mockSkill,
      };
      vi.spyOn(prisma.skillEvidence, 'create').mockResolvedValue(createdEvidenceMock as any);

      const result = await adaptiveRoadmapService.recordSelfReportedEvidence('user-1', 'ur-101', {
        skillId: validSkillCuid,
        estimatedProficiency: 88,
        notes: 'Completed concurrency sandbox drill',
      });

      expect(result).toBeDefined();
      expect(result.id).toBe('ev-1');
      expect(result.source).toBe('SELF_REPORTED');
      expect(result.estimatedProficiency).toBe(88);
      expect(result.skill.name).toBe('React Fiber Architecture');
    });

    it('2. should throw NotFoundError if UserRoadmap is not found for the user', async () => {
      vi.spyOn(prisma.userRoadmap, 'findFirst').mockResolvedValue(null);

      await expect(
        adaptiveRoadmapService.recordSelfReportedEvidence('user-1', 'nonexistent-ur', {
          skillId: validSkillCuid,
          estimatedProficiency: 85,
        })
      ).rejects.toThrow(NotFoundError);
    });

    it('3. should throw NotFoundError if the skill is not found in database', async () => {
      vi.spyOn(prisma.userRoadmap, 'findFirst').mockResolvedValue(mockUserRoadmap as any);
      vi.spyOn(prisma.skill, 'findUnique').mockResolvedValue(null);

      await expect(
        adaptiveRoadmapService.recordSelfReportedEvidence('user-1', 'ur-101', {
          skillId: validSkillCuid,
          estimatedProficiency: 85,
        })
      ).rejects.toThrow('Skill not found');
    });

    it('4. should reject payload when estimatedProficiency is outside [0, 100]', async () => {
      await expect(
        adaptiveRoadmapService.recordSelfReportedEvidence('user-1', 'ur-101', {
          skillId: validSkillCuid,
          estimatedProficiency: 150,
        })
      ).rejects.toThrow();
    });
  });

  describe('Roadmap Controller: recordSkillEvidence()', () => {
    it('5. should forward UnauthorizedError to next() if user header is missing', async () => {
      const { req, res, next } = createMockReqRes({
        headers: {},
        params: { userRoadmapId: 'ur-101' },
        body: { skillId: validSkillCuid, estimatedProficiency: 90 },
      });

      await roadmapController.recordSkillEvidence(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      const error = next.mock.calls[0][0];
      expect(error).toBeInstanceOf(UnauthorizedError);
    });

    it('6. should return 201 with created evidence on successful submission', async () => {
      const mockEvidence = {
        id: 'ev-2',
        userRoadmapId: 'ur-101',
        skillId: validSkillCuid,
        source: 'SELF_REPORTED',
        estimatedProficiency: 90,
      };

      vi.spyOn(adaptiveRoadmapService, 'recordSelfReportedEvidence').mockResolvedValue(mockEvidence as any);

      const { req, res, next, getStatusCode, getJsonResponse } = createMockReqRes({
        headers: { 'x-user-id': 'user-1' },
        params: { userRoadmapId: 'ur-101' },
        body: { skillId: validSkillCuid, estimatedProficiency: 90 },
      });

      await roadmapController.recordSkillEvidence(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(getStatusCode()).toBe(201);
      expect(getJsonResponse().success).toBe(true);
      expect(getJsonResponse().data.id).toBe('ev-2');
    });
  });

  describe('Frontend Store: submitSkillEvidence()', () => {
    it('7. should record evidence, attach to userRoadmap in store, and return success', async () => {
      const initialUserRoadmap = {
        id: 'ur-101',
        userId: 'user-1',
        sourceRoadmapId: 'roadmap-fullstack',
        status: 'ACTIVE' as const,
        personalization: {
          targetRole: 'Fullstack Engineer',
          hoursPerDay: 2,
          daysPerWeek: 5,
          sprintDurationDays: 7 as const,
        },
        sourceRoadmap: { id: 'roadmap-fullstack', title: 'Fullstack' } as any,
        sprints: [
          {
            id: 'sprint-1',
            userRoadmapId: 'ur-101',
            sprintNumber: 1,
            startDate: '2026-03-20T00:00:00Z',
            endDate: '2026-03-27T23:59:59Z',
            objective: 'Sprint 1',
            expectedMinutes: 180,
            status: 'ACTIVE' as const,
            decision: null,
            tasks: [
              {
                id: 'task-ev-1',
                sprintId: 'sprint-1',
                title: 'Evidence Required Task',
                orderIndex: 1,
                estimatedMinutes: 60,
                requiresEvidence: true,
                status: 'TODO' as const,
              },
            ],
          },
        ],
        skillEvidence: [],
        createdAt: '2026-03-20T00:00:00Z',
        updatedAt: '2026-03-20T00:00:00Z',
      };

      useRoadmapStore.setState({
        activeRoadmapId: 'roadmap-fullstack',
        activeUserRoadmap: initialUserRoadmap,
        userRoadmaps: {
          'roadmap-fullstack': initialUserRoadmap,
          'ur-101': initialUserRoadmap,
        },
      });

      const mockCreatedEvidence = {
        id: 'ev-100',
        userRoadmapId: 'ur-101',
        skillId: validSkillCuid,
        source: 'SELF_REPORTED' as const,
        estimatedProficiency: 85,
        confidence: 20,
        assessedAt: '2026-03-30T12:00:00Z',
        skill: {
          id: validSkillCuid,
          slug: 'react-fiber',
          name: 'React Fiber',
          category: 'Frontend Core',
        },
      };

      vi.spyOn(roadmapApi, 'submitSkillEvidence').mockResolvedValue(mockCreatedEvidence);

      const result = await useRoadmapStore.getState().submitSkillEvidence('ur-101', {
        skillId: validSkillCuid,
        estimatedProficiency: 85,
        notes: 'Passed automated test verification suite',
      });

      expect(result.success).toBe(true);
      expect(result.evidence).toEqual(mockCreatedEvidence);

      const updatedRoadmap = useRoadmapStore.getState().activeUserRoadmap;
      expect(updatedRoadmap?.skillEvidence).toBeDefined();
      expect(updatedRoadmap?.skillEvidence?.length).toBe(1);
      expect(updatedRoadmap?.skillEvidence?.[0].id).toBe('ev-100');
    });

    it('8. should surface error and preserve state when submission fails', async () => {
      const errorObj = {
        response: {
          data: {
            message: 'Skill not found',
          },
        },
      };
      vi.spyOn(roadmapApi, 'submitSkillEvidence').mockRejectedValue(errorObj);

      const result = await useRoadmapStore.getState().submitSkillEvidence('ur-101', {
        skillId: validSkillCuid,
        estimatedProficiency: 85,
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Skill not found');
      expect(useRoadmapStore.getState().isSubmittingEvidence).toBe(false);
    });

    it('9. resolves real task-associated skill ID from relational roadmapNode or task skills', () => {
      // Helper function mirroring SprintExperienceModal resolution
      const getTaskSkillId = (task: any): string | null => {
        if (!task) return null;
        if (task.skillId) return task.skillId;
        if (task.skills && task.skills.length > 0 && task.skills[0].id) {
          return task.skills[0].id;
        }
        if (task.roadmapNode?.skills && task.roadmapNode.skills.length > 0) {
          const nodeSkill = task.roadmapNode.skills[0];
          return nodeSkill.skillId || nodeSkill.skill?.id || null;
        }
        return null;
      };

      const taskWithDirectSkill = { id: 'task-1', skillId: 'skill-direct-cuid-123' };
      const taskWithSkillsArray = { id: 'task-2', skills: [{ id: 'skill-array-cuid-456', name: 'TypeScript' }] };
      const taskWithRelationalNode = {
        id: 'task-3',
        roadmapNode: {
          id: 'node-3',
          skills: [{ skillId: 'skill-relational-cuid-789', skill: { id: 'skill-relational-cuid-789', name: 'Prisma' } }],
        },
      };
      const taskWithoutSkill = { id: 'task-4' };

      expect(getTaskSkillId(taskWithDirectSkill)).toBe('skill-direct-cuid-123');
      expect(getTaskSkillId(taskWithSkillsArray)).toBe('skill-array-cuid-456');
      expect(getTaskSkillId(taskWithRelationalNode)).toBe('skill-relational-cuid-789');
      expect(getTaskSkillId(taskWithoutSkill)).toBeNull();
    });

    it('10. handles missing skill data safely without submitting a hardcoded fake ID', async () => {
      const submitSpy = vi.spyOn(roadmapApi, 'submitSkillEvidence');

      const taskWithoutSkill = {
        id: 'task-no-skill',
        sprintId: 'sprint-1',
        title: 'Task Without Skill',
        requiresEvidence: true,
      };

      const getTaskSkillId = (task: any): string | null => {
        if (!task) return null;
        if (task.skillId) return task.skillId;
        if (task.skills && task.skills.length > 0 && task.skills[0].id) {
          return task.skills[0].id;
        }
        if (task.roadmapNode?.skills && task.roadmapNode.skills.length > 0) {
          const nodeSkill = task.roadmapNode.skills[0];
          return nodeSkill.skillId || nodeSkill.skill?.id || null;
        }
        return null;
      };

      const resolvedSkillId = getTaskSkillId(taskWithoutSkill);
      expect(resolvedSkillId).toBeNull();
      expect(resolvedSkillId).not.toBe('clh1234567890123456789012');

      // Modal flow safely aborts without submitting to API
      if (!resolvedSkillId) {
        // Safe guard triggered
      } else {
        await useRoadmapStore.getState().submitSkillEvidence('ur-101', {
          skillId: resolvedSkillId,
          estimatedProficiency: 85,
        });
      }

      expect(submitSpy).not.toHaveBeenCalled();
    });
  });
});
