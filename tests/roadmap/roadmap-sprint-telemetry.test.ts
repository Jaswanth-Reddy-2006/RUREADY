import { describe, expect, it, vi, beforeEach } from 'vitest';
import { roadmapController } from '../../services/roadmap-service/src/controllers/roadmap.controller.js';
import { sprintTelemetryService } from '../../services/roadmap-service/src/services/sprint-telemetry.service.js';
import { adaptiveRoadmapService } from '../../services/roadmap-service/src/services/adaptive-roadmap.service.js';
import { prisma } from '../../services/roadmap-service/src/lib/prisma.js';
import { ForbiddenError, UnauthorizedError, NotFoundError } from '../../services/roadmap-service/src/lib/errors.js';

describe('Stage 5.5: Unified Skill Performance & Sprint Telemetry', () => {
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

  const mockAttempts = [
    {
      id: 'att-1',
      assessmentId: 'asm-1',
      score: 90,
      passed: true,
      sprintTaskId: 't-1',
      sprintId: 'sprint-55-1',
      completedAt: new Date('2026-03-22T10:00:00Z'),
      skill: {
        id: 'javascript',
        name: 'JavaScript',
        category: 'Frontend',
      },
    },
  ];

  const mockSprintData = {
    id: 'sprint-55-1',
    userRoadmapId: 'ur-55-1',
    sprintNumber: 1,
    status: 'ACTIVE',
    startDate: new Date('2026-03-20T00:00:00Z'),
    endDate: new Date('2026-03-27T23:59:59Z'),
    userRoadmap: {
      id: 'ur-55-1',
      userId: 'user-telemetry-1',
      sourceRoadmapId: 'rm-55-1',
      roadmapId: 'rm-55-1',
      personalization: {
        targetRole: 'Full Stack Engineer',
        hoursPerDay: 2,
        daysPerWeek: 5,
        targetOutcome: 'JOB_READINESS',
      },
      skillEvidence: [
        {
          id: 'ev-1',
          skillId: 'javascript',
          source: 'ASSESSMENT',
          demonstratedScore: 90,
          confidence: 85,
          assessedAt: new Date('2026-03-22T10:00:00Z'),
          metadata: null,
          skill: { id: 'javascript', name: 'JavaScript' },
        },
        {
          id: 'ev-2',
          skillId: 'javascript',
          source: 'PROJECT',
          demonstratedScore: 95,
          confidence: 90,
          assessedAt: new Date('2026-03-23T10:00:00Z'),
          metadata: { practicalDrill: true, sprintTaskId: 't-2' },
          skill: { id: 'javascript', name: 'JavaScript' },
        },
        {
          id: 'ev-3',
          skillId: 'react',
          source: 'SELF_REPORTED',
          demonstratedScore: 80,
          confidence: 70,
          assessedAt: new Date('2026-03-24T10:00:00Z'),
          metadata: null,
          skill: { id: 'react', name: 'React' },
        },
      ],
    },
    tasks: [
      {
        id: 't-1',
        title: 'Master Closures and Scope',
        nodeId: 'node-js-1',
        roadmapNodeId: 'node-js-1',
        taskType: 'CORE_PRACTICE',
        status: 'COMPLETED',
        estimatedMinutes: 60,
        requiresAssessment: true,
        requiresEvidence: false,
        roadmapNode: {
          id: 'node-js-1',
          title: 'JavaScript Core',
          skills: [{ skill: { id: 'javascript', name: 'JavaScript', category: 'Frontend' } }],
        },
      },
      {
        id: 't-2',
        title: 'Implement Event Emitter Drill',
        nodeId: 'node-js-1',
        roadmapNodeId: 'node-js-1',
        taskType: 'CORE_PRACTICE',
        status: 'COMPLETED',
        estimatedMinutes: 60,
        requiresAssessment: false,
        requiresEvidence: true,
        roadmapNode: {
          id: 'node-js-1',
          title: 'JavaScript Core',
          skills: [{ skill: { id: 'javascript', name: 'JavaScript', category: 'Frontend' } }],
        },
      },
      {
        id: 't-3',
        title: 'Component Lifecycle Study',
        nodeId: 'node-react-1',
        roadmapNodeId: 'node-react-1',
        taskType: 'FOUNDATION_STUDY',
        status: 'TODO',
        estimatedMinutes: 45,
        requiresAssessment: false,
        requiresEvidence: false,
        roadmapNode: {
          id: 'node-react-1',
          title: 'React Core',
          skills: [{ skill: { id: 'react', name: 'React', category: 'Frontend' } }],
        },
      },
    ],
  };

  describe('1. Task Completion Metric', () => {
    it('calculates task completion rate accurately from persisted tasks', async () => {
      vi.spyOn(prisma.roadmapSprint, 'findUnique').mockResolvedValue(mockSprintData as any);
      vi.spyOn(prisma.microAssessmentAttempt, 'findMany').mockResolvedValue(mockAttempts as any);

      const telemetry = await sprintTelemetryService.calculateSprintTelemetry('user-telemetry-1', 'sprint-55-1');

      expect(telemetry.totalTasks).toBe(3);
      expect(telemetry.completedTasks).toBe(2);
      expect(telemetry.taskCompletionRate).toBe(67); // 2/3 = 66.67 -> 67%
      expect(telemetry.evidenceCount).toBe(3);
    });
  });

  describe('2. Assessment Score Metric', () => {
    it('computes assessment performance and status from user assessment attempts', async () => {
      vi.spyOn(prisma.roadmapSprint, 'findUnique').mockResolvedValue(mockSprintData as any);
      vi.spyOn(prisma.microAssessmentAttempt, 'findMany').mockResolvedValue(mockAttempts as any);

      const telemetry = await sprintTelemetryService.calculateSprintTelemetry('user-telemetry-1', 'sprint-55-1');

      expect(telemetry.assessmentScore).toBe(90);
      expect(telemetry.assessmentPassed).toBe(true);
      expect(telemetry.requiredAssessmentsTotal).toBe(1);
      expect(telemetry.requiredAssessmentsPassed).toBe(1);
    });
  });

  describe('3. Practical Drill Score Metric', () => {
    it('computes practical drill score and status from practical skill evidence', async () => {
      vi.spyOn(prisma.roadmapSprint, 'findUnique').mockResolvedValue(mockSprintData as any);
      vi.spyOn(prisma.microAssessmentAttempt, 'findMany').mockResolvedValue(mockAttempts as any);

      const telemetry = await sprintTelemetryService.calculateSprintTelemetry('user-telemetry-1', 'sprint-55-1');

      expect(telemetry.practicalScore).toBe(95);
      expect(telemetry.practicalPassed).toBe(true);
      expect(telemetry.requiredPracticalsTotal).toBe(1);
      expect(telemetry.requiredPracticalsPassed).toBe(1);
    });
  });

  describe('4. Missing Assessment = NOT_APPLICABLE (null)', () => {
    it('returns assessmentScore: null and assessmentPassed: null when no assessment tasks or attempts exist', async () => {
      const sprintNoAssessment = {
        ...mockSprintData,
        userRoadmap: {
          ...mockSprintData.userRoadmap,
        },
        tasks: [
          {
            id: 't-only-reading',
            title: 'Read System Design Primer',
            nodeId: 'node-sd-1',
            taskType: 'FOUNDATION_STUDY',
            status: 'COMPLETED',
            requiresAssessment: false,
            requiresEvidence: false,
            roadmapNode: {
              id: 'node-sd-1',
              title: 'System Design',
              skills: [{ skill: { id: 'system-design', name: 'System Design' } }],
            },
          },
        ],
      };

      vi.spyOn(prisma.roadmapSprint, 'findUnique').mockResolvedValue(sprintNoAssessment as any);
      vi.spyOn(prisma.microAssessmentAttempt, 'findMany').mockResolvedValue([]);

      const telemetry = await sprintTelemetryService.calculateSprintTelemetry('user-telemetry-1', 'sprint-55-1');

      expect(telemetry.assessmentScore).toBeNull();
      expect(telemetry.assessmentPassed).toBeNull();
      expect(telemetry.requiredAssessmentsTotal).toBe(0);
      expect(telemetry.requiredAssessmentsPassed).toBe(0);
    });
  });

  describe('5. Missing Practical Drill = NOT_APPLICABLE (null)', () => {
    it('returns practicalScore: null and practicalPassed: null when no practical drill evidence exists', async () => {
      const sprintNoPractical = {
        ...mockSprintData,
        userRoadmap: {
          ...mockSprintData.userRoadmap,
          skillEvidence: [mockSprintData.userRoadmap.skillEvidence[0]], // only assessment evidence
        },
        tasks: [
          {
            id: 't-only-mcq',
            title: 'MCQ Concept Check',
            nodeId: 'node-js-1',
            taskType: 'CORE_PRACTICE',
            status: 'COMPLETED',
            requiresAssessment: true,
            requiresEvidence: false,
            roadmapNode: {
              id: 'node-js-1',
              title: 'JS Core',
              skills: [{ skill: { id: 'javascript', name: 'JavaScript' } }],
            },
          },
        ],
      };

      vi.spyOn(prisma.roadmapSprint, 'findUnique').mockResolvedValue(sprintNoPractical as any);
      vi.spyOn(prisma.microAssessmentAttempt, 'findMany').mockResolvedValue(mockAttempts as any);

      const telemetry = await sprintTelemetryService.calculateSprintTelemetry('user-telemetry-1', 'sprint-55-1');

      expect(telemetry.practicalScore).toBeNull();
      expect(telemetry.practicalPassed).toBeNull();
      expect(telemetry.requiredPracticalsTotal).toBe(0);
      expect(telemetry.requiredPracticalsPassed).toBe(0);
    });
  });

  describe('6. Skill-Level Performance Breakdown', () => {
    it('aggregates performance correctly by canonical skill without inventing skills', async () => {
      vi.spyOn(prisma.roadmapSprint, 'findUnique').mockResolvedValue(mockSprintData as any);
      vi.spyOn(prisma.microAssessmentAttempt, 'findMany').mockResolvedValue(mockAttempts as any);

      const telemetry = await sprintTelemetryService.calculateSprintTelemetry('user-telemetry-1', 'sprint-55-1');

      expect(telemetry.skillsDemonstrated).toEqual(['JavaScript', 'React']);
      expect(telemetry.skillBreakdown).toHaveLength(2);

      const jsSkill = telemetry.skillBreakdown.find((s) => s.skillId === 'javascript');
      expect(jsSkill).toBeDefined();
      expect(jsSkill?.mcqScore).toBe(90);
      expect(jsSkill?.practicalScore).toBe(95);
      expect(jsSkill?.evidenceCount).toBe(2);
      expect(jsSkill?.demonstrated).toBe(true);

      const reactSkill = telemetry.skillBreakdown.find((s) => s.skillId === 'react');
      expect(reactSkill).toBeDefined();
      expect(reactSkill?.mcqScore).toBeNull();
      expect(reactSkill?.practicalScore).toBeNull();
      expect(reactSkill?.evidenceCount).toBe(1);
      expect(reactSkill?.demonstrated).toBe(true);
    });
  });

  describe('7. Server-Authoritative Calculation', () => {
    it('derives values strictly from persisted records and ignores client fakes during completeSprint', async () => {
      const mockFullSprint = {
        ...mockSprintData,
        userRoadmap: {
          ...mockSprintData.userRoadmap,
          personalization: {
            targetRole: 'Full Stack Engineer',
            hoursPerDay: 2,
            daysPerWeek: 5,
            targetOutcome: 'JOB_READINESS',
          },
        },
      };

      vi.spyOn(prisma.roadmapSprint, 'findFirst').mockResolvedValue(mockFullSprint as any);
      vi.spyOn(prisma, '$transaction').mockResolvedValue([
        {
          ...mockSprintData,
          status: 'COMPLETED',
          decision: 'CONTINUE',
        },
        {},
      ] as any);
      vi.spyOn(prisma.careerRoadmap, 'findUnique').mockResolvedValue({
        id: 'rm-55-1',
        title: 'Roadmap',
        nodesData: [],
        nodes: [],
      } as any);
      vi.spyOn(prisma.microAssessmentAttempt, 'findMany').mockResolvedValue(mockAttempts as any);
      vi.spyOn(prisma.roadmapSprint, 'findUnique').mockResolvedValue({
        ...mockSprintData,
        status: 'COMPLETED',
        decision: 'CONTINUE',
        tasks: mockSprintData.tasks,
        performance: {
          taskCompletion: 67,
          assessmentScore: 90,
          practicalScore: 95,
        },
      } as any);

      // Client submits forged 100s for everything, but server derives true 67% task completion
      const clientInput = {
        consistencyScore: 100, // fake
        assessmentScore: 100, // fake
        practicalScore: 100, // fake
      };

      const result = await adaptiveRoadmapService.completeSprint('user-telemetry-1', 'sprint-55-1', clientInput);

      expect(result.telemetry).toBeDefined();
      expect(result.telemetry?.taskCompletionRate).toBe(67);
      expect(result.telemetry?.totalTasks).toBe(3);
      expect(result.telemetry?.completedTasks).toBe(2);
      expect(result.telemetry?.assessmentScore).toBe(90); // true DB attempt score
      expect(result.telemetry?.practicalScore).toBe(95); // true DB drill score
    });
  });

  describe('8. Cross-User Isolation Controls', () => {
    it('throws ForbiddenError when accessing telemetry of another user sprint', async () => {
      vi.spyOn(prisma.roadmapSprint, 'findUnique').mockResolvedValue(mockSprintData as any);

      await expect(
        sprintTelemetryService.calculateSprintTelemetry('unauthorized-user-999', 'sprint-55-1')
      ).rejects.toThrow(ForbiddenError);
    });

    it('returns 403 Forbidden in controller when user requests another user sprint telemetry', async () => {
      vi.spyOn(prisma.roadmapSprint, 'findUnique').mockResolvedValue(mockSprintData as any);

      const { req, res, next } = createMockReqRes({
        headers: { 'x-user-id': 'unauthorized-user-999' },
        params: { sprintId: 'sprint-55-1' },
      });

      await roadmapController.getSprintTelemetry(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError));
    });
  });

  describe('9. Required Assessment Status Verification', () => {
    it('identifies uncompleted required assessment correctly', async () => {
      const sprintUnfinishedAssessment = {
        ...mockSprintData,
        tasks: [
          {
            id: 't-req-1',
            title: 'Mandatory Assessment Task',
            nodeId: 'node-js-1',
            roadmapNodeId: 'node-js-1',
            status: 'TODO',
            requiresAssessment: true,
            requiresEvidence: false,
            roadmapNode: {
              id: 'node-js-1',
              title: 'JS Core',
              skills: [{ skill: { id: 'javascript', name: 'JavaScript' } }],
            },
          },
        ],
      };

      vi.spyOn(prisma.roadmapSprint, 'findUnique').mockResolvedValue(sprintUnfinishedAssessment as any);
      vi.spyOn(prisma.microAssessmentAttempt, 'findMany').mockResolvedValue([]); // No attempts

      const telemetry = await sprintTelemetryService.calculateSprintTelemetry('user-telemetry-1', 'sprint-55-1');

      expect(telemetry.requiredAssessmentsTotal).toBe(1);
      expect(telemetry.requiredAssessmentsPassed).toBe(0);
    });
  });

  describe('10. Required Practical Status Verification', () => {
    it('identifies uncompleted required practical drill correctly', async () => {
      const sprintUnfinishedPractical = {
        ...mockSprintData,
        userRoadmap: {
          ...mockSprintData.userRoadmap,
          skillEvidence: [], // No practical evidence
        },
        tasks: [
          {
            id: 't-req-prac',
            title: 'Mandatory Practical Sandbox Drill',
            nodeId: 'node-js-1',
            roadmapNodeId: 'node-js-1',
            status: 'TODO',
            requiresAssessment: false,
            requiresEvidence: true,
            roadmapNode: {
              id: 'node-js-1',
              title: 'JS Core',
              skills: [{ skill: { id: 'javascript', name: 'JavaScript' } }],
            },
          },
        ],
      };

      vi.spyOn(prisma.roadmapSprint, 'findUnique').mockResolvedValue(sprintUnfinishedPractical as any);
      vi.spyOn(prisma.microAssessmentAttempt, 'findMany').mockResolvedValue([]);

      const telemetry = await sprintTelemetryService.calculateSprintTelemetry('user-telemetry-1', 'sprint-55-1');

      expect(telemetry.requiredPracticalsTotal).toBe(1);
      expect(telemetry.requiredPracticalsPassed).toBe(0);
    });
  });

  describe('11. Complete Sprint API Endpoint Returns Telemetry', () => {
    it('returns GET /sprints/:sprintId/telemetry with 200 and telemetry data', async () => {
      vi.spyOn(prisma.roadmapSprint, 'findUnique').mockResolvedValue(mockSprintData as any);
      vi.spyOn(prisma.microAssessmentAttempt, 'findMany').mockResolvedValue(mockAttempts as any);

      const { req, res, next, getStatusCode, getJsonResponse } = createMockReqRes({
        headers: { 'x-user-id': 'user-telemetry-1' },
        params: { sprintId: 'sprint-55-1' },
      });

      await roadmapController.getSprintTelemetry(req, res, next);

      expect(getStatusCode()).toBe(200);
      const json = getJsonResponse();
      expect(json.success).toBe(true);
      expect(json.data.taskCompletionRate).toBe(67);
      expect(json.data.skillsDemonstrated).toEqual(['JavaScript', 'React']);
    });
  });
});
