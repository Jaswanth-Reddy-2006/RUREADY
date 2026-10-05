import { describe, expect, it, vi, beforeEach } from 'vitest';
import { adaptiveRoadmapService } from '../../services/roadmap-service/src/services/adaptive-roadmap.service.js';
import { microAssessmentService } from '../../services/roadmap-service/src/services/micro-assessment.service.js';
import { prisma } from '../../services/roadmap-service/src/lib/prisma.js';
import { BadRequestError, NotFoundError } from '../../services/roadmap-service/src/lib/errors.js';
import { getAssessmentAdaptationSignal } from '../../services/roadmap-service/src/domain/roadmap.domain.js';

describe('Stage 5.2: Adaptive Assessment Integration & Milestone Gating', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    microAssessmentService.clearMemory();
  });

  const mockActiveSprint = {
    id: 'sprint-201',
    userRoadmapId: 'ur-301',
    sprintNumber: 1,
    startDate: new Date('2026-04-01T00:00:00Z'),
    endDate: new Date('2026-04-08T23:59:59Z'),
    objective: 'Core Distributed Systems Competency',
    expectedMinutes: 180,
    status: 'ACTIVE',
    decision: null,
    tasks: [
      {
        id: 'task-1',
        sprintId: 'sprint-201',
        roadmapNodeId: 'node-dist-1',
        title: 'Raft Consensus Protocol Internals',
        orderIndex: 1,
        estimatedMinutes: 60,
        requiresEvidence: false,
        requiresAssessment: true,
        status: 'TODO',
      },
      {
        id: 'task-2',
        sprintId: 'sprint-201',
        roadmapNodeId: 'node-dist-2',
        title: 'Write Ahead Log Implementation',
        orderIndex: 2,
        estimatedMinutes: 60,
        requiresEvidence: false,
        requiresAssessment: false,
        status: 'COMPLETED',
      },
    ],
    userRoadmap: {
      id: 'ur-301',
      userId: 'user-adapt-1',
      sourceRoadmapId: 'roadmap-backend',
      personalization: {
        targetRole: 'Senior Backend Engineer',
        targetOutcome: 'FAANG Placement',
        hoursPerDay: 2,
        daysPerWeek: 5,
        sprintDurationDays: 7,
      },
    },
  };

  const mockSourceRoadmap = {
    id: 'roadmap-backend',
    title: 'Senior Backend Engineer',
    nodes: [
      {
        id: 'node-dist-1',
        title: 'Raft Consensus Protocol Internals',
        description: 'Consensus',
        orderIndex: 1,
        estimatedMinutes: 60,
        requiresEvidence: false,
        requiresAssessment: true,
      },
      {
        id: 'node-dist-2',
        title: 'Write Ahead Log Implementation',
        description: 'WAL storage',
        orderIndex: 2,
        estimatedMinutes: 60,
        requiresEvidence: false,
        requiresAssessment: false,
      },
      {
        id: 'node-dist-3',
        title: 'Distributed Transaction Locks',
        description: '2PC & MVCC',
        orderIndex: 3,
        estimatedMinutes: 90,
        requiresEvidence: false,
        requiresAssessment: false,
      },
    ],
    nodesData: [],
  };

  describe('1. Assessment Performance Signal & Domain Signals', () => {
    it('1a. generates REMEDIATE signal with INSERT_REINFORCEMENT action when assessment score is low (< 55%)', () => {
      const signal = getAssessmentAdaptationSignal(45);
      expect(signal.decision).toBe('REMEDIATE');
      expect(signal.action).toBe('INSERT_REINFORCEMENT');
      expect(signal.reason).toContain('below the proficiency threshold');
    });

    it('1b. generates ACCELERATE signal with ACCELERATE_TASK action when assessment score is strong (>= 85%)', () => {
      const signal = getAssessmentAdaptationSignal(90);
      expect(signal.decision).toBe('ACCELERATE');
      expect(signal.action).toBe('ACCELERATE_TASK');
      expect(signal.reason).toContain('exceeds target proficiency');
    });

    it('1c. generates CONTINUE signal when assessment score is satisfactory (55% - 84%)', () => {
      const signal = getAssessmentAdaptationSignal(75);
      expect(signal.decision).toBe('CONTINUE');
      expect(signal.action).toBeNull();
      expect(signal.reason).toContain('satisfies current milestone');
    });
  });

  describe('2. MicroAssessmentService Submission & Adaptation Signal Return', () => {
    it('2a. returns adaptation signal in submitAssessment attempt result', async () => {
      const seeded = {
        id: 'assess-raft-101',
        title: 'Raft Protocol Verification',
        roadmapNodeId: 'node-dist-1',
        questions: [
          {
            id: 'q1',
            questionText: 'What constitutes a quorum in Raft with 5 nodes?',
            options: ['2 nodes', '3 nodes', '4 nodes', '5 nodes'],
            correctOptionIndex: 1,
            explanation: 'A majority quorum is floor(N/2) + 1 = 3 nodes.',
          },
        ],
        createdAt: new Date(),
      };
      microAssessmentService.seedAssessment(seeded);

      const result = await microAssessmentService.submitAssessment('user-adapt-1', {
        assessmentId: 'assess-raft-101',
        answers: [{ questionId: 'q1', selectedOptionIndex: 1 }],
      });

      expect(result.score).toBe(100);
      expect(result.passed).toBe(true);
      expect(result.adaptationRecommendation).toBeDefined();
      expect(result.adaptationRecommendation?.decision).toBe('ACCELERATE');
    });

    it('2b. returns REMEDIATE adaptation signal in submitAssessment when score is failing', async () => {
      const seeded = {
        id: 'assess-wal-101',
        title: 'WAL Verification',
        roadmapNodeId: 'node-dist-2',
        questions: [
          {
            id: 'q1',
            questionText: 'When is an fsync required in WAL?',
            options: ['Never', 'Before committing state to disk', 'Only on system shutdown', 'Every 10 hours'],
            correctOptionIndex: 1,
            explanation: 'Fsync ensures durability before acknowledging commit.',
          },
        ],
        createdAt: new Date(),
      };
      microAssessmentService.seedAssessment(seeded);

      const result = await microAssessmentService.submitAssessment('user-adapt-1', {
        assessmentId: 'assess-wal-101',
        answers: [{ questionId: 'q1', selectedOptionIndex: 0 }],
      });

      expect(result.score).toBe(0);
      expect(result.passed).toBe(false);
      expect(result.adaptationRecommendation?.decision).toBe('REMEDIATE');
      expect(result.adaptationRecommendation?.action).toBe('INSERT_REINFORCEMENT');
    });
  });

  describe('3. Security & Ownership Validation', () => {
    it('3a. rejects assessment submission with NotFoundError if userRoadmapId belongs to another user', async () => {
      const seeded = {
        id: 'assess-sec-1',
        title: 'Security Assessment',
        questions: [{ id: 'q1', questionText: 'Q1', options: ['A', 'B'], correctOptionIndex: 0 }],
        createdAt: new Date(),
      };
      microAssessmentService.seedAssessment(seeded);

      vi.spyOn(prisma.userRoadmap, 'findFirst').mockResolvedValue(null);

      await expect(
        microAssessmentService.submitAssessment('user-attacker', {
          assessmentId: 'assess-sec-1',
          userRoadmapId: 'ur-victim-999',
          answers: [{ questionId: 'q1', selectedOptionIndex: 0 }],
        })
      ).rejects.toThrow('Your roadmap was not found or belongs to another user');
    });

    it('3b. rejects assessment submission with NotFoundError if sprintId belongs to another user', async () => {
      const seeded = {
        id: 'assess-sec-2',
        title: 'Security Assessment',
        questions: [{ id: 'q1', questionText: 'Q1', options: ['A', 'B'], correctOptionIndex: 0 }],
        createdAt: new Date(),
      };
      microAssessmentService.seedAssessment(seeded);

      vi.spyOn(prisma.roadmapSprint, 'findFirst').mockResolvedValue(null);

      await expect(
        microAssessmentService.submitAssessment('user-attacker', {
          assessmentId: 'assess-sec-2',
          sprintId: 'sprint-victim-999',
          answers: [{ questionId: 'q1', selectedOptionIndex: 0 }],
        })
      ).rejects.toThrow('Sprint not found or belongs to another user');
    });

    it('3c. rejects assessment submission with NotFoundError if sprintTaskId belongs to another user', async () => {
      const seeded = {
        id: 'assess-sec-3',
        title: 'Security Assessment',
        questions: [{ id: 'q1', questionText: 'Q1', options: ['A', 'B'], correctOptionIndex: 0 }],
        createdAt: new Date(),
      };
      microAssessmentService.seedAssessment(seeded);

      vi.spyOn(prisma.roadmapSprintTask, 'findFirst').mockResolvedValue(null);

      await expect(
        microAssessmentService.submitAssessment('user-attacker', {
          assessmentId: 'assess-sec-3',
          sprintTaskId: 'task-victim-999',
          answers: [{ questionId: 'q1', selectedOptionIndex: 0 }],
        })
      ).rejects.toThrow('Sprint task not found or belongs to another user');
    });
  });

  describe('4. Milestone & Task Gating on Required Assessments', () => {
    it('4a. blocks task completion with BadRequestError if task.requiresAssessment is true and no passed attempt exists', async () => {
      const requiredTask = {
        ...mockActiveSprint.tasks[0],
        requiresAssessment: true,
        sprint: { userRoadmapId: 'ur-301' },
      };

      vi.spyOn(prisma.roadmapSprintTask, 'findFirst').mockResolvedValue(requiredTask as any);
      vi.spyOn(prisma.microAssessmentAttempt, 'count').mockResolvedValue(0); // 0 passed attempts

      await expect(
        adaptiveRoadmapService.updateSprintTask('user-adapt-1', 'sprint-201', 'task-1', {
          status: 'COMPLETED',
        })
      ).rejects.toThrow('This task requires passing the associated micro-assessment (score >= 70%) before it can be completed');
    });

    it('4b. allows task completion when task.requiresAssessment is true and a passed attempt exists', async () => {
      const requiredTask = {
        ...mockActiveSprint.tasks[0],
        requiresAssessment: true,
        sprint: { userRoadmapId: 'ur-301' },
      };

      vi.spyOn(prisma.roadmapSprintTask, 'findFirst').mockResolvedValue(requiredTask as any);
      vi.spyOn(prisma.microAssessmentAttempt, 'count').mockResolvedValue(1); // 1 passed attempt
      vi.spyOn(prisma.roadmapSprintTask, 'update').mockResolvedValue({
        ...requiredTask,
        status: 'COMPLETED',
        completedAt: new Date(),
      } as any);

      const updated = await adaptiveRoadmapService.updateSprintTask('user-adapt-1', 'sprint-201', 'task-1', {
        status: 'COMPLETED',
      });

      expect(updated.status).toBe('COMPLETED');
    });

    it('4c. allows non-required assessment tasks to complete normally without assessment gating', async () => {
      const nonRequiredTask = {
        ...mockActiveSprint.tasks[1],
        requiresAssessment: false,
        requiresEvidence: false,
        sprint: { userRoadmapId: 'ur-301' },
      };

      vi.spyOn(prisma.roadmapSprintTask, 'findFirst').mockResolvedValue(nonRequiredTask as any);
      vi.spyOn(prisma.roadmapSprintTask, 'update').mockResolvedValue({
        ...nonRequiredTask,
        status: 'COMPLETED',
        completedAt: new Date(),
      } as any);

      const updated = await adaptiveRoadmapService.updateSprintTask('user-adapt-1', 'sprint-201', 'task-2', {
        status: 'COMPLETED',
      });

      expect(updated.status).toBe('COMPLETED');
    });
  });

  describe('5. Sprint Completion with Assessment Gating & Derived Scores', () => {
    it('5a. blocks sprint completion if sprint contains an incomplete task with requiresAssessment === true', async () => {
      const sprintWithIncompleteRequiredTask = {
        ...mockActiveSprint,
        tasks: [
          {
            id: 'task-1',
            title: 'Raft Consensus',
            status: 'TODO',
            requiresAssessment: true,
          },
          {
            id: 'task-2',
            title: 'WAL',
            status: 'COMPLETED',
            requiresAssessment: false,
          },
        ],
      };

      vi.spyOn(prisma.roadmapSprint, 'findFirst').mockResolvedValue(sprintWithIncompleteRequiredTask as any);

      await expect(
        adaptiveRoadmapService.completeSprint('user-adapt-1', 'sprint-201', {
          practicalScore: 80,
        })
      ).rejects.toThrow('Sprint contains required assessments that must be passed before completion');
    });

    it('5b. derives assessmentScore automatically from recorded MicroAssessmentAttempt records when not explicitly provided', async () => {
      const completedSprint = {
        ...mockActiveSprint,
        tasks: [
          { id: 'task-1', title: 'Task 1', status: 'COMPLETED', requiresAssessment: true },
          { id: 'task-2', title: 'Task 2', status: 'COMPLETED', requiresAssessment: false },
        ],
      };

      vi.spyOn(prisma.roadmapSprint, 'findFirst').mockResolvedValue(completedSprint as any);
      vi.spyOn(prisma.microAssessmentAttempt, 'findMany').mockResolvedValue([
        { id: 'att-1', score: 40, passed: false } as any,
        { id: 'att-2', score: 50, passed: false } as any,
      ]);
      vi.spyOn(prisma, '$transaction').mockResolvedValue([{}, {}]);
      vi.spyOn(prisma.careerRoadmap, 'findUnique').mockResolvedValue(mockSourceRoadmap as any);
      vi.spyOn(prisma.roadmapAdaptation, 'create').mockResolvedValue({ id: 'adapt-rem-1' } as any);
      vi.spyOn(adaptiveRoadmapService, 'createNextSprint').mockResolvedValue({
        id: 'sprint-202-reinforce',
        sprintNumber: 2,
        objective: 'Strengthen the weakest demonstrated skill for Senior Backend Engineer',
        status: 'ACTIVE',
        tasks: [],
      } as any);
      vi.spyOn(prisma.roadmapSprint, 'findUnique').mockResolvedValue({
        ...completedSprint,
        status: 'COMPLETED',
        decision: 'REMEDIATE',
        performance: { taskCompletion: 100, assessmentScore: 45, decision: 'REMEDIATE' },
      } as any);

      // We do NOT pass assessmentScore in the input; it should be derived from attempts (avg of 40 and 50 = 45 -> REMEDIATE)
      const review = await adaptiveRoadmapService.completeSprint('user-adapt-1', 'sprint-201', {
        practicalScore: 80,
      });

      expect(review.recommendation.decision).toBe('REMEDIATE');
      expect(review.recommendation.action).toBe('INSERT_REINFORCEMENT');
      expect(review.nextSprint).toBeDefined();
    });

    it('5c. creates reinforcement task with requiresAssessment === true when action is INSERT_REINFORCEMENT', async () => {
      const createSprintSpy = vi.spyOn(prisma.roadmapSprint, 'create').mockResolvedValue({
        id: 'sprint-next-reinforce',
        userRoadmapId: 'ur-301',
        sprintNumber: 2,
        status: 'ACTIVE',
        tasks: [],
      } as any);

      vi.spyOn(prisma.roadmapSprint, 'findUnique').mockResolvedValue(null);

      await adaptiveRoadmapService.createNextSprint(
        'ur-301',
        mockSourceRoadmap as any,
        {
          currentLevel: 'INTERMEDIATE',
          targetRole: 'Senior Backend Engineer',
          targetOutcome: 'FAANG Placement',
          hoursPerDay: 2,
          daysPerWeek: 5,
          sprintDurationDays: 7,
          learningPreferences: [],
          freeOnly: false,
          preferredTechnologies: [],
        },
        2,
        new Date('2026-04-09T00:00:00Z'),
        'INSERT_REINFORCEMENT'
      );

      expect(createSprintSpy).toHaveBeenCalledTimes(1);
      const createCallData = createSprintSpy.mock.calls[0][0].data;
      const tasksCreated = createCallData.tasks.create;
      expect(tasksCreated[0].title).toContain('Reinforcement practice');
      expect(tasksCreated[0].requiresAssessment).toBe(true);
      expect(tasksCreated[0].requiresEvidence).toBe(true);
    });

    it('5d. preserves existing CONTINUE progression when assessments are passed without duplicate sprints', async () => {
      const completedSprint = {
        ...mockActiveSprint,
        tasks: [
          { id: 'task-1', title: 'Task 1', status: 'COMPLETED', requiresAssessment: true },
          { id: 'task-2', title: 'Task 2', status: 'COMPLETED', requiresAssessment: false },
        ],
      };

      vi.spyOn(prisma.roadmapSprint, 'findFirst').mockResolvedValue(completedSprint as any);
      vi.spyOn(prisma.microAssessmentAttempt, 'findMany').mockResolvedValue([
        { id: 'att-1', score: 80, passed: true } as any,
      ]);
      vi.spyOn(prisma, '$transaction').mockResolvedValue([{}, {}]);
      vi.spyOn(prisma.careerRoadmap, 'findUnique').mockResolvedValue(mockSourceRoadmap as any);

      const existingNextSprint = {
        id: 'sprint-202-existing',
        userRoadmapId: 'ur-301',
        sprintNumber: 2,
        status: 'ACTIVE',
        tasks: [],
      };
      vi.spyOn(prisma.roadmapSprint, 'findUnique')
        .mockResolvedValueOnce(existingNextSprint as any)
        .mockResolvedValueOnce({
          ...completedSprint,
          status: 'COMPLETED',
          decision: 'CONTINUE',
          performance: { taskCompletion: 100, assessmentScore: 80, decision: 'CONTINUE' },
        } as any);

      const createSprintSpy = vi.spyOn(prisma.roadmapSprint, 'create');

      const review = await adaptiveRoadmapService.completeSprint('user-adapt-1', 'sprint-201', {
        practicalScore: 80,
      });

      expect(review.recommendation.decision).toBe('CONTINUE');
      expect(review.recommendation.action).toBeNull();
      expect(review.nextSprint?.id).toBe('sprint-202-existing');
      expect(createSprintSpy).not.toHaveBeenCalled();
    });
  });
});
