import { describe, expect, it, vi, beforeEach } from 'vitest';
import { roadmapController } from '../../services/roadmap-service/src/controllers/roadmap.controller.js';
import { adaptiveRoadmapService } from '../../services/roadmap-service/src/services/adaptive-roadmap.service.js';
import { prisma } from '../../services/roadmap-service/src/lib/prisma.js';
import { UnauthorizedError, NotFoundError } from '../../services/roadmap-service/src/lib/errors.js';
import { RoadmapLearningHistoryDTO, deriveRoadmapLearningHistory } from '../../packages/shared/src/types/index.js';

describe('Stage 7.2: Roadmap Learning History & Proof of Work API', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  function createMockReqRes(options: {
    headers?: Record<string, string | string[] | undefined>;
    params?: Record<string, string>;
    query?: Record<string, string>;
    body?: any;
  }) {
    const req: any = {
      headers: options.headers || {},
      params: options.params || {},
      query: options.query || {},
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

  const mockUserRoadmapData = {
    id: 'ur-stage72-1',
    userId: 'user-stage72-alice',
    sourceRoadmapId: 'rm-stage72-1',
    status: 'ACTIVE',
    personalization: {
      targetRole: 'Fullstack Engineer',
      hoursPerDay: 2,
      daysPerWeek: 5,
      sprintDurationDays: 7,
    },
    sourceRoadmap: {
      id: 'rm-stage72-1',
      title: 'Senior Fullstack Mastery',
      rolePath: 'FULLSTACK',
      targetCompanyTier: 'FAANG',
      goal: {
        targetRole: 'Fullstack Engineer',
      },
    },
    sprints: [
      {
        id: 'sprint-72-1',
        userRoadmapId: 'ur-stage72-1',
        sprintNumber: 1,
        startDate: new Date('2026-03-01T00:00:00.000Z'),
        endDate: new Date('2026-03-08T00:00:00.000Z'),
        completedAt: new Date('2026-03-08T18:00:00.000Z'),
        objective: 'Master PostgreSQL Query Optimization',
        status: 'COMPLETED',
        expectedMinutes: 180,
        actualMinutes: 175,
        decision: 'CONTINUE',
        performance: {
          id: 'perf-72-1',
          sprintId: 'sprint-72-1',
          taskCompletion: 100,
          assessmentScore: 92,
          practicalScore: 95,
          decision: 'CONTINUE',
          notes: 'Flawless B-Tree execution',
        },
        tasks: [
          {
            id: 'task-72-1',
            sprintId: 'sprint-72-1',
            roadmapNodeId: 'node-72-1',
            title: 'Index Optimization & EXPLAIN ANALYZE',
            description: 'Tune composite index on millions of rows',
            orderIndex: 1,
            estimatedMinutes: 90,
            status: 'COMPLETED',
            completedAt: new Date('2026-03-05T14:30:00.000Z'),
            requiresEvidence: true,
            requiresAssessment: true,
            roadmapNode: {
              skills: [
                {
                  skill: {
                    id: 'skill-pg',
                    name: 'PostgreSQL Indexing',
                    category: 'Database Engineering',
                  },
                },
              ],
            },
          },
        ],
      },
    ],
    skillEvidence: [
      {
        id: 'ev-72-1',
        userRoadmapId: 'ur-stage72-1',
        skillId: 'skill-pg',
        source: 'PROJECT',
        estimatedProficiency: 90,
        demonstratedScore: 95,
        confidence: 90,
        externalReference: 'https://github.com/alice/postgres-perf-drill',
        metadata: {
          practicalDrill: true,
          notes: 'Executed 1M row benchmark query under 5ms',
        },
        assessedAt: new Date('2026-03-05T15:00:00.000Z'),
        skill: {
          id: 'skill-pg',
          name: 'PostgreSQL Indexing',
          category: 'Database Engineering',
        },
      },
    ],
    assessmentAttempts: [
      {
        id: 'att-72-1',
        assessmentId: 'ass-pg-1',
        userId: 'user-stage72-alice',
        skillId: 'skill-pg',
        sprintId: 'sprint-72-1',
        sprintTaskId: 'task-72-1',
        score: 92,
        passed: true,
        totalQuestions: 10,
        correctAnswers: 9,
        completedAt: new Date('2026-03-05T16:00:00.000Z'),
        assessment: {
          id: 'ass-pg-1',
          title: 'PostgreSQL Advanced Indexing Assessment',
        },
        skill: {
          id: 'skill-pg',
          name: 'PostgreSQL Indexing',
        },
      },
    ],
    adaptations: [
      {
        id: 'adapt-72-1',
        userRoadmapId: 'ur-stage72-1',
        sprintId: 'sprint-72-1',
        action: 'ACCELERATE_TASK',
        reason: 'Exceptional performance in sprint 1',
        evidence: 'Scored 92% on assessment and 95% on practical drill',
        createdAt: new Date('2026-03-08T18:05:00.000Z'),
      },
    ],
  };

  it('1. authenticated learner can retrieve their learning history DTO', async () => {
    vi.spyOn(prisma.userRoadmap, 'findFirst').mockResolvedValue(mockUserRoadmapData as any);

    const { req, res, next, getStatusCode, getJsonResponse } = createMockReqRes({
      headers: { 'x-user-id': 'user-stage72-alice' },
      params: { userRoadmapId: 'ur-stage72-1' },
    });

    await roadmapController.getRoadmapHistory(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(getStatusCode()).toBe(200);

    const response = getJsonResponse();
    expect(response.success).toBe(true);
    const data: RoadmapLearningHistoryDTO = response.data;

    expect(data.userRoadmapId).toBe('ur-stage72-1');
    expect(data.targetRole).toBe('Fullstack Engineer');
    expect(data.targetCompanyTier).toBe('FAANG');
    expect(data.completedSprintsCount).toBe(1);
    expect(data.totalMilestonesCompleted).toBe(1);
    expect(data.totalEvidenceCount).toBe(1);
    expect(data.totalAssessmentsTaken).toBe(1);
    expect(data.totalPracticalsCompleted).toBe(1);

    expect(data.sprintArchives).toHaveLength(1);
    expect(data.sprintArchives[0].sprintNumber).toBe(1);
    expect(data.sprintArchives[0].status).toBe('COMPLETED');
    expect(data.sprintArchives[0].totalTasks).toBe(1);
    expect(data.sprintArchives[0].completedTasks).toBe(1);
    expect(data.sprintArchives[0].completionPercentage).toBe(100);
    expect(data.sprintArchives[0].performance?.assessmentScore).toBe(92);
    expect(data.sprintArchives[0].performance?.practicalScore).toBe(95);

    expect(data.timeline).toHaveLength(5); // SPRINT_COMPLETED, TASK_COMPLETED, PRACTICAL_DRILL, ASSESSMENT_PASSED, ROADMAP_ADAPTATION
    expect(data.evidence).toHaveLength(1);
    expect(data.evidence[0].externalReference).toBe('https://github.com/alice/postgres-perf-drill');
    expect(data.assessments).toHaveLength(1);
    expect(data.assessments[0].passed).toBe(true);
    expect(data.adaptations).toHaveLength(1);
  });

  it('2. unauthenticated request throws UnauthorizedError', async () => {
    const { req, res, next } = createMockReqRes({
      headers: {}, // No x-user-id
      params: { userRoadmapId: 'ur-stage72-1' },
    });

    await roadmapController.getRoadmapHistory(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const error = next.mock.calls[0][0];
    expect(error).toBeInstanceOf(UnauthorizedError);
  });

  it('3. unauthorized learner cannot access another user roadmap', async () => {
    // When queried with different user ID, prisma findFirst with { id, userId } returns null
    vi.spyOn(prisma.userRoadmap, 'findFirst').mockResolvedValue(null);

    const { req, res, next } = createMockReqRes({
      headers: { 'x-user-id': 'attacker-user-bob' },
      params: { userRoadmapId: 'ur-stage72-1' },
    });

    await roadmapController.getRoadmapHistory(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const error = next.mock.calls[0][0];
    expect(error).toBeInstanceOf(NotFoundError);
    expect(error.message).toContain('Your roadmap was not found');
  });

  it('4. empty roadmap history returns valid empty collections and zero metrics', async () => {
    const emptyUserRoadmap = {
      id: 'ur-empty-1',
      userId: 'user-newbie',
      sourceRoadmapId: 'rm-empty-1',
      status: 'ACTIVE',
      personalization: { targetRole: 'Junior Dev' },
      sourceRoadmap: { rolePath: 'FRONTEND', targetCompanyTier: 'Startup' },
      sprints: [],
      skillEvidence: [],
      assessmentAttempts: [],
      adaptations: [],
    };

    vi.spyOn(prisma.userRoadmap, 'findFirst').mockResolvedValue(emptyUserRoadmap as any);

    const result = await adaptiveRoadmapService.getRoadmapLearningHistory('user-newbie', 'ur-empty-1');

    expect(result.userRoadmapId).toBe('ur-empty-1');
    expect(result.totalSprintsCount).toBe(0);
    expect(result.completedSprintsCount).toBe(0);
    expect(result.totalMilestonesCompleted).toBe(0);
    expect(result.totalEvidenceCount).toBe(0);
    expect(result.totalAssessmentsTaken).toBe(0);
    expect(result.totalPracticalsCompleted).toBe(0);
    expect(result.sprintArchives).toEqual([]);
    expect(result.timeline).toEqual([]);
    expect(result.evidence).toEqual([]);
    expect(result.assessments).toEqual([]);
    expect(result.adaptations).toEqual([]);
  });

  it('5. uses canonical deriveRoadmapLearningHistory without duplicate frontend aggregation', async () => {
    const directDerivation = deriveRoadmapLearningHistory(mockUserRoadmapData as any);

    vi.spyOn(prisma.userRoadmap, 'findFirst').mockResolvedValue(mockUserRoadmapData as any);
    const serviceResult = await adaptiveRoadmapService.getRoadmapLearningHistory('user-stage72-alice', 'ur-stage72-1');

    expect(serviceResult.userRoadmapId).toBe(directDerivation.userRoadmapId);
    expect(serviceResult.totalMilestonesCompleted).toBe(directDerivation.totalMilestonesCompleted);
    expect(serviceResult.timeline.length).toBe(directDerivation.timeline.length);
    expect(serviceResult.sprintArchives.length).toBe(directDerivation.sprintArchives.length);
  });

  describe('Frontend Store: fetchRoadmapHistory()', () => {
    it('6. store fetches and caches history DTO in roadmapHistories', async () => {
      const { useRoadmapStore } = await import('../../client/src/store/useRoadmapStore.js');
      const { roadmapApi } = await import('../../client/src/api/roadmap.js');

      const expectedHistory = deriveRoadmapLearningHistory(mockUserRoadmapData as any);
      vi.spyOn(roadmapApi, 'getRoadmapHistory').mockResolvedValue(expectedHistory);

      const result = await useRoadmapStore.getState().fetchRoadmapHistory('ur-stage72-1');

      expect(result).toBeDefined();
      expect(result?.userRoadmapId).toBe('ur-stage72-1');
      expect(useRoadmapStore.getState().roadmapHistories['ur-stage72-1']).toEqual(expectedHistory);
      expect(useRoadmapStore.getState().isHistoryLoading).toBe(false);
      expect(useRoadmapStore.getState().historyError).toBeNull();
    });

    it('7. store gracefully surfaces backend errors and sets historyError state', async () => {
      const { useRoadmapStore } = await import('../../client/src/store/useRoadmapStore.js');
      const { roadmapApi } = await import('../../client/src/api/roadmap.js');

      vi.spyOn(roadmapApi, 'getRoadmapHistory').mockRejectedValue(new Error('Network connection timeout'));

      const result = await useRoadmapStore.getState().fetchRoadmapHistory('ur-nonexistent-99');

      expect(result).toBeNull();
      expect(useRoadmapStore.getState().isHistoryLoading).toBe(false);
      expect(useRoadmapStore.getState().historyError).toBe('Network connection timeout');
    });
  });
});
