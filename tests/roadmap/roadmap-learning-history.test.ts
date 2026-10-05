import { describe, it, expect } from 'vitest';
import {
  deriveRoadmapLearningHistory,
  UserRoadmapDTO,
  RoadmapSprintDTO,
  SprintTaskDTO,
  SkillEvidenceDTO,
  RoadmapLearningHistoryDTO,
} from '../../packages/shared/src/types/index.js';

describe('Stage 7.1: Historical Sprint & Milestone Archive Engine (deriveRoadmapLearningHistory)', () => {
  const basePersonalization = {
    targetRole: 'Senior Full Stack Engineer',
    hoursPerDay: 1.5,
    daysPerWeek: 5,
    sprintDurationDays: 7 as const,
  };

  const createMockUserRoadmap = (overrides?: Partial<UserRoadmapDTO>): UserRoadmapDTO => ({
    id: 'ur-701',
    userId: 'user-701',
    sourceRoadmapId: 'crm-701',
    sourceRoadmap: {
      id: 'crm-701',
      userId: 'admin-1',
      title: 'Full Stack Engineering Track',
      rolePath: 'Senior Full Stack Engineer',
      targetCompanyTier: 'FAANG',
      difficulty: 'ADVANCED',
      overallReadiness: 45,
      estimatedWeeks: 12,
      isOfficial: true,
      isPublic: true,
      isAiGenerated: false,
      tags: ['React', 'Node.js', 'Distributed Systems'],
      phases: [],
      nodesData: [],
      createdAt: '2026-09-01T00:00:00.000Z',
      updatedAt: '2026-09-01T00:00:00.000Z',
    },
    status: 'ACTIVE',
    personalization: { ...basePersonalization },
    sprints: [],
    skillEvidence: [],
    createdAt: '2026-09-01T00:00:00.000Z',
    updatedAt: '2026-09-01T00:00:00.000Z',
    ...overrides,
  });

  // 1. Empty roadmap & null inputs
  it('1. safely handles null, undefined, and empty UserRoadmap without throwing', () => {
    const resNull = deriveRoadmapLearningHistory(null, '2026-10-01T12:00:00.000Z');
    expect(resNull.userRoadmapId).toBe('');
    expect(resNull.totalSprintsCount).toBe(0);
    expect(resNull.completedSprintsCount).toBe(0);
    expect(resNull.totalMilestonesCompleted).toBe(0);
    expect(resNull.sprintArchives).toEqual([]);
    expect(resNull.timeline).toEqual([]);
    expect(resNull.assessments).toEqual([]);
    expect(resNull.evidence).toEqual([]);
    expect(resNull.adaptations).toEqual([]);

    const resUndefined = deriveRoadmapLearningHistory(undefined, '2026-10-01T12:00:00.000Z');
    expect(resUndefined.totalSprintsCount).toBe(0);

    const emptyRoadmap = createMockUserRoadmap({ sprints: [], skillEvidence: [] });
    const resEmpty = deriveRoadmapLearningHistory(emptyRoadmap, '2026-10-01T12:00:00.000Z');
    expect(resEmpty.userRoadmapId).toBe('ur-701');
    expect(resEmpty.targetRole).toBe('Senior Full Stack Engineer');
    expect(resEmpty.targetCompanyTier).toBe('FAANG');
    expect(resEmpty.totalSprintsCount).toBe(0);
    expect(resEmpty.timeline).toEqual([]);
  });

  // 2. One completed sprint
  it('2. correctly derives archive and timeline for a single completed sprint', () => {
    const sprint1: RoadmapSprintDTO = {
      id: 'sprint-1',
      userRoadmapId: 'ur-701',
      sprintNumber: 1,
      startDate: '2026-09-01T00:00:00.000Z',
      endDate: '2026-09-07T23:59:59.999Z',
      objective: 'Core Architecture and Virtual DOM Internals',
      expectedMinutes: 180,
      status: 'COMPLETED',
      decision: 'CONTINUE',
      tasks: [
        {
          id: 'task-1',
          sprintId: 'sprint-1',
          title: 'Milestone 1: Virtual DOM Reconciliation',
          description: 'Analyze reconciliation algorithm',
          orderIndex: 1,
          estimatedMinutes: 60,
          requiresEvidence: false,
          status: 'COMPLETED',
          completedAt: '2026-09-02T14:30:00.000Z',
          skills: [{ id: 'sk-react', name: 'React' }],
        },
        {
          id: 'task-2',
          sprintId: 'sprint-1',
          title: 'Milestone 2: Fiber Tree Traversal',
          description: 'Deep dive into concurrent fiber scheduling',
          orderIndex: 2,
          estimatedMinutes: 60,
          requiresEvidence: true,
          status: 'COMPLETED',
          completedAt: '2026-09-04T16:00:00.000Z',
          skills: [{ id: 'sk-react', name: 'React' }],
        },
      ],
      performance: {
        taskCompletion: 100,
        assessmentScore: 90,
        practicalScore: 95,
        decision: 'CONTINUE',
      },
    };

    const ur = createMockUserRoadmap({ sprints: [sprint1] });
    const history = deriveRoadmapLearningHistory(ur, '2026-09-08T12:00:00.000Z');

    expect(history.totalSprintsCount).toBe(1);
    expect(history.completedSprintsCount).toBe(1);
    expect(history.totalMilestonesCompleted).toBe(2);

    expect(history.sprintArchives.length).toBe(1);
    const arch = history.sprintArchives[0];
    expect(arch.sprintId).toBe('sprint-1');
    expect(arch.sprintNumber).toBe(1);
    expect(arch.completionPercentage).toBe(100);
    expect(arch.decision).toBe('CONTINUE');
    expect(arch.skillsAddressed).toEqual(['React']);
    expect(arch.completedAt).toBe('2026-09-04T16:00:00.000Z'); // latest completed task

    // Timeline should have: SPRINT_COMPLETED (Sept 4) and 2 TASK_COMPLETED (Sept 4, Sept 2)
    expect(history.timeline.length).toBe(3);
    expect(history.timeline[0].type).toBe('SPRINT_COMPLETED');
    expect(history.timeline[1].type).toBe('TASK_COMPLETED');
    expect(history.timeline[1].sourceId).toBe('task-2');
    expect(history.timeline[2].type).toBe('TASK_COMPLETED');
    expect(history.timeline[2].sourceId).toBe('task-1');
  });

  // 3. Multiple completed sprints in sequence
  it('3. aggregates multiple historical sprints in correct chronological order', () => {
    const sprint1: RoadmapSprintDTO = {
      id: 'sprint-1',
      userRoadmapId: 'ur-701',
      sprintNumber: 1,
      startDate: '2026-09-01T00:00:00.000Z',
      endDate: '2026-09-07T23:59:59.999Z',
      objective: 'Frontend Architecture',
      expectedMinutes: 120,
      status: 'COMPLETED',
      decision: 'ACCELERATE',
      tasks: [
        { id: 't1', sprintId: 'sprint-1', title: 'T1', orderIndex: 1, estimatedMinutes: 60, requiresEvidence: false, status: 'COMPLETED', completedAt: '2026-09-03T10:00:00.000Z' },
      ],
      performance: { taskCompletion: 100, decision: 'ACCELERATE' },
    };

    const sprint2: RoadmapSprintDTO = {
      id: 'sprint-2',
      userRoadmapId: 'ur-701',
      sprintNumber: 2,
      startDate: '2026-09-08T00:00:00.000Z',
      endDate: '2026-09-14T23:59:59.999Z',
      objective: 'Backend Distributed Caching',
      expectedMinutes: 120,
      status: 'COMPLETED',
      decision: 'CONTINUE',
      tasks: [
        { id: 't2', sprintId: 'sprint-2', title: 'T2', orderIndex: 1, estimatedMinutes: 60, requiresEvidence: false, status: 'COMPLETED', completedAt: '2026-09-10T10:00:00.000Z' },
      ],
      performance: { taskCompletion: 100, decision: 'CONTINUE' },
    };

    const ur = createMockUserRoadmap({ sprints: [sprint2, sprint1] }); // intentionally unsorted
    const history = deriveRoadmapLearningHistory(ur, '2026-09-15T12:00:00.000Z');

    expect(history.totalSprintsCount).toBe(2);
    expect(history.completedSprintsCount).toBe(2);
    // sprintArchives are sorted sprintNumber ascending
    expect(history.sprintArchives[0].sprintNumber).toBe(1);
    expect(history.sprintArchives[1].sprintNumber).toBe(2);
    expect(history.sprintArchives[0].decision).toBe('ACCELERATE');
    expect(history.sprintArchives[1].decision).toBe('CONTINUE');
  });

  // 4. Completed task milestones with detailed skill attribution
  it('4. attributes skill names and categories accurately to completed milestone timeline items', () => {
    const sprint: RoadmapSprintDTO = {
      id: 'sprint-1',
      userRoadmapId: 'ur-701',
      sprintNumber: 1,
      startDate: '2026-09-01T00:00:00.000Z',
      endDate: '2026-09-07T23:59:59.999Z',
      objective: 'Systems Deep Dive',
      expectedMinutes: 60,
      status: 'ACTIVE',
      tasks: [
        {
          id: 'task-node-skill',
          sprintId: 'sprint-1',
          title: 'Database Index B-Tree Architecture',
          description: 'Analyze composite index scan performance',
          orderIndex: 1,
          estimatedMinutes: 60,
          requiresEvidence: false,
          status: 'COMPLETED',
          completedAt: '2026-09-03T11:00:00.000Z',
          roadmapNode: {
            id: 'node-db-1',
            skills: [
              {
                nodeId: 'node-db-1',
                skillId: 'sk-postgres',
                skill: {
                  id: 'sk-postgres',
                  name: 'PostgreSQL',
                  slug: 'postgresql',
                  category: 'Databases',
                },
              },
            ],
          },
        },
      ],
    };

    const ur = createMockUserRoadmap({ sprints: [sprint] });
    const history = deriveRoadmapLearningHistory(ur, '2026-09-04T12:00:00.000Z');

    const item = history.timeline.find((t) => t.sourceId === 'task-node-skill');
    expect(item).toBeDefined();
    expect(item?.type).toBe('TASK_COMPLETED');
    expect(item?.skillName).toBe('PostgreSQL');
    expect(item?.skillCategory).toBe('Databases');
  });

  // 5. Skill evidence history (self-reported vs practical drill)
  it('5. separates practical project drills from standard self-reported skill evidence', () => {
    const evidenceList: SkillEvidenceDTO[] = [
      {
        id: 'ev-self',
        userRoadmapId: 'ur-701',
        skillId: 'sk-docker',
        source: 'SELF_REPORTED',
        estimatedProficiency: 80,
        confidence: 60,
        assessedAt: '2026-09-05T10:00:00.000Z',
        externalReference: 'Docker compose orchestration verified',
        skill: { id: 'sk-docker', slug: 'docker', name: 'Docker', category: 'DevOps' },
      },
      {
        id: 'ev-drill',
        userRoadmapId: 'ur-701',
        skillId: 'sk-redis',
        source: 'PROJECT',
        demonstratedScore: 94,
        confidence: 90,
        assessedAt: '2026-09-06T15:00:00.000Z',
        metadata: { practicalDrill: true, notes: 'Implemented lock-free LRU cache eviction' },
        skill: { id: 'sk-redis', slug: 'redis', name: 'Redis', category: 'Databases' },
      },
    ];

    const ur = createMockUserRoadmap({ skillEvidence: evidenceList });
    const history = deriveRoadmapLearningHistory(ur, '2026-09-07T12:00:00.000Z');

    expect(history.totalEvidenceCount).toBe(2);
    expect(history.totalPracticalsCompleted).toBe(1);

    const practicalTimeline = history.timeline.find((t) => t.sourceId === 'ev-drill');
    expect(practicalTimeline?.type).toBe('PRACTICAL_DRILL');
    expect(practicalTimeline?.score).toBe(94);
    expect(practicalTimeline?.skillName).toBe('Redis');

    const selfTimeline = history.timeline.find((t) => t.sourceId === 'ev-self');
    expect(selfTimeline?.type).toBe('SKILL_EVIDENCE');
    expect(selfTimeline?.skillName).toBe('Docker');
  });

  // 6. Assessment attempt history
  it('6. correctly captures passed and failed assessment attempts and logs timeline entries for passes', () => {
    const attempts = [
      {
        id: 'att-1',
        assessmentId: 'ass-react-mcq',
        userId: 'user-701',
        score: 85,
        passed: true,
        totalQuestions: 10,
        correctAnswers: 8,
        completedAt: '2026-09-04T12:00:00.000Z',
        skill: { id: 'sk-react', name: 'React', category: 'Frontend' },
        assessment: { id: 'ass-react-mcq', title: 'React 19 Concurrent Diagnostics' },
      },
      {
        id: 'att-2',
        assessmentId: 'ass-db-mcq',
        userId: 'user-701',
        score: 50,
        passed: false,
        totalQuestions: 10,
        correctAnswers: 5,
        completedAt: '2026-09-05T12:00:00.000Z',
        skill: { id: 'sk-sql', name: 'SQL', category: 'Databases' },
        assessment: { id: 'ass-db-mcq', title: 'SQL Indexing Quiz' },
      },
    ];

    const ur = createMockUserRoadmap({ assessmentAttempts: attempts } as any);
    const history = deriveRoadmapLearningHistory(ur, '2026-09-06T12:00:00.000Z');

    expect(history.totalAssessmentsTaken).toBe(2);
    expect(history.assessments.length).toBe(2);

    // Passed attempt is in timeline
    const passedEvent = history.timeline.find((t) => t.sourceId === 'att-1');
    expect(passedEvent).toBeDefined();
    expect(passedEvent?.type).toBe('ASSESSMENT_PASSED');
    expect(passedEvent?.score).toBe(85);

    // Failed attempt is tracked in assessments list but omitted from celebration timeline
    const failedEvent = history.timeline.find((t) => t.sourceId === 'att-2');
    expect(failedEvent).toBeUndefined();
    expect(history.assessments.find((a) => a.id === 'att-2')?.passed).toBe(false);
  });

  // 7. Adaptation and sprint review history
  it('7. captures curriculum adaptations and links them to sprint milestones', () => {
    const adaptations = [
      {
        id: 'adapt-1',
        userRoadmapId: 'ur-701',
        sprintId: 'sprint-1',
        action: 'ACCELERATE_TASK' as const,
        reason: 'Learner demonstrated rapid mastery on concurrency drills (score > 90)',
        evidence: { testScore: 95 },
        createdAt: '2026-09-07T18:00:00.000Z',
      },
    ];

    const sprint1: RoadmapSprintDTO = {
      id: 'sprint-1',
      userRoadmapId: 'ur-701',
      sprintNumber: 1,
      startDate: '2026-09-01T00:00:00.000Z',
      endDate: '2026-09-07T23:59:59.999Z',
      objective: 'Sprint 1',
      expectedMinutes: 60,
      status: 'COMPLETED',
      decision: 'ACCELERATE',
      tasks: [],
    };

    const ur = createMockUserRoadmap({ sprints: [sprint1], adaptations } as any);
    const history = deriveRoadmapLearningHistory(ur, '2026-09-08T12:00:00.000Z');

    expect(history.adaptations.length).toBe(1);
    expect(history.adaptations[0].action).toBe('ACCELERATE_TASK');
    expect(history.adaptations[0].sprintNumber).toBe(1);
    expect(history.adaptations[0].decision).toBe('ACCELERATE');

    const timelineAdapt = history.timeline.find((t) => t.sourceId === 'adapt-1');
    expect(timelineAdapt).toBeDefined();
    expect(timelineAdapt?.type).toBe('ROADMAP_ADAPTATION');
  });

  // 8. Unified timeline strict ordering (Date DESC -> Type ASC -> ID ASC)
  it('8. sorts timeline strictly by date descending with secondary and tertiary tie-breakers', () => {
    const sprint: RoadmapSprintDTO = {
      id: 'sp-1',
      userRoadmapId: 'ur-701',
      sprintNumber: 1,
      startDate: '2026-09-01T00:00:00.000Z',
      endDate: '2026-09-07T23:59:59.999Z',
      objective: 'Sprint 1',
      expectedMinutes: 60,
      status: 'COMPLETED',
      tasks: [
        { id: 't-a', sprintId: 'sp-1', title: 'Task A', orderIndex: 1, estimatedMinutes: 60, requiresEvidence: false, status: 'COMPLETED', completedAt: '2026-09-03T10:00:00.000Z' },
        { id: 't-b', sprintId: 'sp-1', title: 'Task B', orderIndex: 2, estimatedMinutes: 60, requiresEvidence: false, status: 'COMPLETED', completedAt: '2026-09-05T10:00:00.000Z' },
      ],
    };

    const evidence: SkillEvidenceDTO[] = [
      {
        id: 'ev-c',
        userRoadmapId: 'ur-701',
        skillId: 'sk-1',
        source: 'SELF_REPORTED',
        confidence: 80,
        assessedAt: '2026-09-04T10:00:00.000Z',
      },
    ];

    const ur = createMockUserRoadmap({ sprints: [sprint], skillEvidence: evidence });
    const history = deriveRoadmapLearningHistory(ur, '2026-09-08T12:00:00.000Z');

    // Expected dates in timeline: Sept 5 (Task B), Sept 5 (Sprint Complete), Sept 4 (Evidence C), Sept 3 (Task A)
    const dates = history.timeline.map((item) => item.date);
    for (let i = 0; i < dates.length - 1; i++) {
      expect(new Date(dates[i]).getTime()).toBeGreaterThanOrEqual(new Date(dates[i + 1]).getTime());
    }
  });

  // 9. Duplicate timestamps tie-breaking
  it('9. deterministically breaks ties for events with identical timestamps', () => {
    const sprint: RoadmapSprintDTO = {
      id: 'sp-1',
      userRoadmapId: 'ur-701',
      sprintNumber: 1,
      startDate: '2026-09-01T00:00:00.000Z',
      endDate: '2026-09-07T23:59:59.999Z',
      objective: 'Sprint 1',
      expectedMinutes: 60,
      status: 'ACTIVE',
      tasks: [
        { id: 't-1', sprintId: 'sp-1', title: 'Task 1', orderIndex: 1, estimatedMinutes: 60, requiresEvidence: false, status: 'COMPLETED', completedAt: '2026-09-03T12:00:00.000Z' },
        { id: 't-2', sprintId: 'sp-1', title: 'Task 2', orderIndex: 2, estimatedMinutes: 60, requiresEvidence: false, status: 'COMPLETED', completedAt: '2026-09-03T12:00:00.000Z' },
      ],
    };

    const ur = createMockUserRoadmap({ sprints: [sprint] });
    const history1 = deriveRoadmapLearningHistory(ur, '2026-09-04T12:00:00.000Z');
    const history2 = deriveRoadmapLearningHistory(ur, '2026-09-04T12:00:00.000Z');

    expect(history1.timeline).toEqual(history2.timeline);
    expect(history1.timeline.map((t) => t.id)).toEqual(['tl-task-t-1', 'tl-task-t-2']);
  });

  // 10. Missing optional fields
  it('10. safely handles missing optional metadata, titles, descriptions, and scores', () => {
    const sprint: RoadmapSprintDTO = {
      id: 'sp-1',
      userRoadmapId: 'ur-701',
      sprintNumber: 1,
      startDate: '2026-09-01T00:00:00.000Z',
      endDate: '2026-09-07T23:59:59.999Z',
      objective: '',
      expectedMinutes: 0,
      status: 'COMPLETED',
      tasks: [
        { id: 't-min', sprintId: 'sp-1', title: 'Min Task', orderIndex: 1, estimatedMinutes: 0, requiresEvidence: false, status: 'COMPLETED', completedAt: '2026-09-02T10:00:00.000Z' },
      ],
    };

    const evidence: SkillEvidenceDTO[] = [
      {
        id: 'ev-min',
        userRoadmapId: 'ur-701',
        skillId: 'sk-min',
        source: 'SELF_REPORTED',
        confidence: 0,
        assessedAt: '2026-09-02T10:00:00.000Z',
      },
    ];

    const ur = createMockUserRoadmap({ sprints: [sprint], skillEvidence: evidence });
    const history = deriveRoadmapLearningHistory(ur, '2026-09-03T12:00:00.000Z');

    expect(history.sprintArchives[0].performance).toBeNull();
    expect(history.sprintArchives[0].decision).toBeNull();
    expect(history.evidence[0].demonstratedScore).toBeNull();
    expect(history.evidence[0].metadata).toBeNull();
  });

  // 11. Incomplete sprint handling
  it('11. includes incomplete (ACTIVE / UPCOMING) sprints in archives without marking completedAt', () => {
    const sprintActive: RoadmapSprintDTO = {
      id: 'sp-active',
      userRoadmapId: 'ur-701',
      sprintNumber: 2,
      startDate: '2026-09-08T00:00:00.000Z',
      endDate: '2026-09-14T23:59:59.999Z',
      objective: 'Ongoing Sprint',
      expectedMinutes: 120,
      status: 'ACTIVE',
      tasks: [
        { id: 't-done', sprintId: 'sp-active', title: 'Done Task', orderIndex: 1, estimatedMinutes: 60, requiresEvidence: false, status: 'COMPLETED', completedAt: '2026-09-09T10:00:00.000Z' },
        { id: 't-todo', sprintId: 'sp-active', title: 'Todo Task', orderIndex: 2, estimatedMinutes: 60, requiresEvidence: false, status: 'TODO' },
      ],
    };

    const ur = createMockUserRoadmap({ sprints: [sprintActive] });
    const history = deriveRoadmapLearningHistory(ur, '2026-09-10T12:00:00.000Z');

    expect(history.completedSprintsCount).toBe(0);
    expect(history.totalSprintsCount).toBe(1);
    expect(history.sprintArchives[0].completedAt).toBeNull();
    expect(history.sprintArchives[0].completionPercentage).toBe(50);

    // No SPRINT_COMPLETED event in timeline, but completed task is included
    expect(history.timeline.some((t) => t.type === 'SPRINT_COMPLETED')).toBe(false);
    expect(history.timeline.some((t) => t.sourceId === 't-done')).toBe(true);
  });

  // 12. Pure and side-effect free (no mutation of input)
  it('12. does not mutate input UserRoadmap or its nested arrays', () => {
    const tasks: SprintTaskDTO[] = [
      { id: 't-1', sprintId: 'sp-1', title: 'Task 1', orderIndex: 2, estimatedMinutes: 60, requiresEvidence: false, status: 'COMPLETED', completedAt: '2026-09-02T10:00:00.000Z' },
      { id: 't-2', sprintId: 'sp-1', title: 'Task 2', orderIndex: 1, estimatedMinutes: 60, requiresEvidence: false, status: 'COMPLETED', completedAt: '2026-09-01T10:00:00.000Z' },
    ];
    const sprint: RoadmapSprintDTO = {
      id: 'sp-1',
      userRoadmapId: 'ur-701',
      sprintNumber: 1,
      startDate: '2026-09-01T00:00:00.000Z',
      endDate: '2026-09-07T23:59:59.999Z',
      objective: 'Sprint 1',
      expectedMinutes: 120,
      status: 'COMPLETED',
      tasks,
    };
    const ur = createMockUserRoadmap({ sprints: [sprint] });

    const urClone = JSON.parse(JSON.stringify(ur));
    deriveRoadmapLearningHistory(ur, '2026-09-08T12:00:00.000Z');

    expect(ur).toEqual(urClone);
  });

  // 13. Mixed event types and timeline aggregation
  it('13. correctly aggregates all mixed event types into a rich composite timeline', () => {
    const sprint: RoadmapSprintDTO = {
      id: 'sp-1',
      userRoadmapId: 'ur-701',
      sprintNumber: 1,
      startDate: '2026-09-01T00:00:00.000Z',
      endDate: '2026-09-07T23:59:59.999Z',
      objective: 'Full Stack Sprint',
      expectedMinutes: 180,
      status: 'COMPLETED',
      tasks: [
        { id: 't1', sprintId: 'sp-1', title: 'Task 1', orderIndex: 1, estimatedMinutes: 60, requiresEvidence: false, status: 'COMPLETED', completedAt: '2026-09-02T10:00:00.000Z' },
      ],
    };

    const evidence: SkillEvidenceDTO[] = [
      {
        id: 'ev-1',
        userRoadmapId: 'ur-701',
        skillId: 'sk-1',
        source: 'PROJECT',
        demonstratedScore: 90,
        confidence: 85,
        assessedAt: '2026-09-03T10:00:00.000Z',
        metadata: { practicalDrill: true },
      },
    ];

    const assessments = [
      {
        id: 'att-1',
        assessmentId: 'ass-1',
        score: 80,
        passed: true,
        totalQuestions: 5,
        correctAnswers: 4,
        completedAt: '2026-09-04T10:00:00.000Z',
      },
    ];

    const adaptations = [
      {
        id: 'ad-1',
        userRoadmapId: 'ur-701',
        sprintId: 'sp-1',
        action: 'ACCELERATE_TASK' as const,
        reason: 'Pacing accelerated',
        createdAt: '2026-09-05T10:00:00.000Z',
      },
    ];

    const ur = createMockUserRoadmap({
      sprints: [sprint],
      skillEvidence: evidence,
      assessmentAttempts: assessments,
      adaptations,
    } as any);

    const history = deriveRoadmapLearningHistory(ur, '2026-09-08T12:00:00.000Z');

    expect(history.timeline.length).toBe(5);
    const types = history.timeline.map((t) => t.type);
    expect(types).toContain('ROADMAP_ADAPTATION');
    expect(types).toContain('ASSESSMENT_PASSED');
    expect(types).toContain('PRACTICAL_DRILL');
    expect(types).toContain('SPRINT_COMPLETED');
    expect(types).toContain('TASK_COMPLETED');
  });
});
