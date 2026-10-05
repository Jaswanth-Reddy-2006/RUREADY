import { describe, it, expect } from 'vitest';
import {
  deriveDailyLearningPlan,
  resolveResumeTask,
  getSafeSessionDuration,
  createInitialTaskSession,
  startTaskSession,
  pauseTaskSession,
  resumeTaskSession,
  resetTaskSession,
  tickTaskSession,
  formatTimerSeconds,
  deriveDailyLearningActivity,
  RoadmapSprintDTO,
  SprintTaskDTO,
  UserRoadmapDTO,
  SkillEvidenceDTO,
} from '../../packages/shared/src/types/index.js';

describe('Stage 6.1: Daily Learning Plan Engine (deriveDailyLearningPlan)', () => {
  const baseTasks: SprintTaskDTO[] = [
    {
      id: 'task-1',
      sprintId: 'sprint-1',
      title: 'Milestone 1: Core React Reconciliation',
      description: 'Understand Virtual DOM and Fiber Architecture',
      orderIndex: 1,
      estimatedMinutes: 60,
      requiresEvidence: false,
      requiresAssessment: false,
      status: 'TODO',
    },
    {
      id: 'task-2',
      sprintId: 'sprint-1',
      title: 'Milestone 2: State Machines and Reducers',
      description: 'Implement complex state with useReducer',
      orderIndex: 2,
      estimatedMinutes: 60,
      requiresEvidence: true,
      requiresAssessment: false,
      status: 'TODO',
    },
    {
      id: 'task-3',
      sprintId: 'sprint-1',
      title: 'Milestone 3: Server Actions & Concurrent Transitions',
      description: 'Master React 19 concurrent transitions',
      orderIndex: 3,
      estimatedMinutes: 90,
      requiresEvidence: false,
      requiresAssessment: true,
      status: 'TODO',
    },
    {
      id: 'task-4',
      sprintId: 'sprint-1',
      title: 'Milestone 4: Performance Profiling & Optimization',
      description: 'Analyze commit phase bottlenecks and render cascades',
      orderIndex: 4,
      estimatedMinutes: 90,
      requiresEvidence: true,
      requiresAssessment: true,
      status: 'TODO',
    },
  ];

  const createMockSprint = (overrides?: Partial<RoadmapSprintDTO>): RoadmapSprintDTO => ({
    id: 'sprint-101',
    userRoadmapId: 'ur-101',
    sprintNumber: 1,
    startDate: '2026-10-01T00:00:00.000Z',
    endDate: '2026-10-07T23:59:59.999Z',
    objective: 'Master High-Performance React 19 Architecture',
    expectedMinutes: 300,
    status: 'ACTIVE',
    tasks: [...baseTasks],
    ...overrides,
  });

  // ── 1. 7-Day Sprint Pacing & Distribution ──
  it('1. correctly schedules tasks across a 7-day sprint', () => {
    const sprint = createMockSprint();
    const plan = deriveDailyLearningPlan(sprint, {
      hoursPerDay: 1.5,
      daysPerWeek: 5,
      sprintDurationDays: 7,
    }, '2026-10-01T12:00:00.000Z');

    expect(plan.sprintDurationDays).toBe(7);
    expect(plan.totalSprintDays).toBe(7);
    expect(plan.sprintDayNumber).toBe(1);
    expect(plan.learningDaysCount).toBe(5);
    expect(plan.dailyCapacityMinutes).toBe(90);
    expect(plan.isLearningDay).toBe(true);
    expect(plan.scheduledTasks.length).toBe(4);
  });

  // 2. 10-Day Sprint Pacing & Distribution
  it('2. correctly derives learning days for a 10-day sprint', () => {
    const sprint = createMockSprint({
      startDate: '2026-10-01T00:00:00.000Z',
      endDate: '2026-10-10T23:59:59.999Z',
    });
    const plan = deriveDailyLearningPlan(sprint, {
      hoursPerDay: 1,
      daysPerWeek: 5,
      sprintDurationDays: 10,
    }, '2026-10-03T12:00:00.000Z');

    expect(plan.sprintDurationDays).toBe(10);
    expect(plan.totalSprintDays).toBe(10);
    expect(plan.sprintDayNumber).toBe(3);
    expect(plan.learningDaysCount).toBe(7); // round(5/7 * 10) = 7
    expect(plan.isLearningDay).toBe(true);
  });

  // 3. hoursPerDay = 1 (60 minutes capacity)
  it('3. schedules each 60m task onto separate days when hoursPerDay = 1', () => {
    const sprint = createMockSprint();
    const plan = deriveDailyLearningPlan(sprint, {
      hoursPerDay: 1, // 60 mins/day
      daysPerWeek: 5,
      sprintDurationDays: 7,
    }, '2026-10-01T12:00:00.000Z');

    expect(plan.dailyCapacityMinutes).toBe(60);
    // Task 1 (60m) on Day 1, Task 2 (60m) on Day 2, Task 3 (90m) on Day 3, Task 4 (90m) on Day 4
    expect(plan.scheduledTasks[0].scheduledDayNumber).toBe(1);
    expect(plan.scheduledTasks[1].scheduledDayNumber).toBe(2);
    expect(plan.scheduledTasks[2].scheduledDayNumber).toBe(3);
    expect(plan.scheduledTasks[3].scheduledDayNumber).toBe(4);
  });

  // 4. hoursPerDay = 2 (120 minutes capacity)
  it('4. packs multiple smaller tasks into the same day when capacity allows', () => {
    const sprint = createMockSprint();
    const plan = deriveDailyLearningPlan(sprint, {
      hoursPerDay: 2, // 120 mins/day
      daysPerWeek: 5,
      sprintDurationDays: 7,
    }, '2026-10-01T12:00:00.000Z');

    expect(plan.dailyCapacityMinutes).toBe(120);
    // Task 1 (60m) + Task 2 (60m) = 120m -> both on Day 1
    expect(plan.scheduledTasks[0].scheduledDayNumber).toBe(1);
    expect(plan.scheduledTasks[1].scheduledDayNumber).toBe(1);
    // Task 3 (90m) on Day 2, Task 4 (90m) on Day 3
    expect(plan.scheduledTasks[2].scheduledDayNumber).toBe(2);
    expect(plan.scheduledTasks[3].scheduledDayNumber).toBe(3);
  });

  // 5. Different daysPerWeek values (e.g. 7 days/wk vs 3 days/wk)
  it('5. respects different daysPerWeek availability', () => {
    const sprint = createMockSprint();
    // 7 days per week
    const plan7 = deriveDailyLearningPlan(sprint, {
      hoursPerDay: 1.5,
      daysPerWeek: 7,
      sprintDurationDays: 7,
    }, '2026-10-07T12:00:00.000Z');
    expect(plan7.learningDaysCount).toBe(7);
    expect(plan7.isLearningDay).toBe(true);

    // 3 days per week with completed previous tasks -> rest day
    const sprintCompleted = createMockSprint({
      tasks: baseTasks.map((t) => ({ ...t, status: 'COMPLETED' as const })),
    });
    const planRest = deriveDailyLearningPlan(sprintCompleted, {
      hoursPerDay: 1.5,
      daysPerWeek: 3,
      sprintDurationDays: 7,
    }, '2026-10-05T12:00:00.000Z'); // Day 5
    expect(planRest.learningDaysCount).toBe(3);
    expect(planRest.isLearningDay).toBe(false);

    // 3 days per week with unfinished previous tasks on Day 5 -> BEHIND
    const plan3 = deriveDailyLearningPlan(sprint, {
      hoursPerDay: 1.5,
      daysPerWeek: 3,
      sprintDurationDays: 7,
    }, '2026-10-05T12:00:00.000Z'); // Day 5
    expect(plan3.learningDaysCount).toBe(3);
    expect(plan3.isLearningDay).toBe(false);
    expect(plan3.statusSummary).toBe('BEHIND');
  });

  // 6. Completed tasks excluded from today's unfinished work
  it('6. excludes completed tasks from todayTasks and tracks completed counts', () => {
    const sprint = createMockSprint({
      tasks: [
        { ...baseTasks[0], status: 'COMPLETED', completedAt: '2026-10-01T14:00:00.000Z' },
        { ...baseTasks[1], status: 'TODO' },
        { ...baseTasks[2], status: 'TODO' },
      ],
    });

    const plan = deriveDailyLearningPlan(sprint, {
      hoursPerDay: 2,
      daysPerWeek: 5,
      sprintDurationDays: 7,
    }, '2026-10-01T12:00:00.000Z');

    expect(plan.completedTasks.length).toBe(1);
    expect(plan.completedTasks[0].id).toBe('task-1');
    // Task 2 is also scheduled on Day 1 (capacity=120) and is TODO -> should be in todayTasks
    expect(plan.todayTasks.map((t) => t.id)).toEqual(['task-2']);
    expect(plan.todayCompletionPercentage).toBe(50); // 1 of 2 tasks for Day 1 completed
  });

  // 7. IN_PROGRESS task remains prioritized
  it('7. prioritizes IN_PROGRESS task in todayTasks even if scheduled for a different day', () => {
    const sprint = createMockSprint({
      tasks: [
        { ...baseTasks[0], status: 'COMPLETED' },
        { ...baseTasks[1], status: 'IN_PROGRESS' }, // scheduled for Day 2
        { ...baseTasks[2], status: 'TODO' },
      ],
    });

    // Reference Day 3
    const plan = deriveDailyLearningPlan(sprint, {
      hoursPerDay: 1, // 1 task per day
      daysPerWeek: 5,
      sprintDurationDays: 7,
    }, '2026-10-03T12:00:00.000Z'); // Day 3

    expect(plan.sprintDayNumber).toBe(3);
    // Task 2 is IN_PROGRESS -> should be prioritized first in todayTasks
    expect(plan.todayTasks[0].id).toBe('task-2');
    expect(plan.todayTasks[0].status).toBe('IN_PROGRESS');
  });

  // 8. Overdue tasks detected correctly
  it('8. flags unfinished tasks from previous days as overdue', () => {
    const sprint = createMockSprint({
      tasks: [
        { ...baseTasks[0], status: 'TODO' }, // scheduled for Day 1, still TODO
        { ...baseTasks[1], status: 'TODO' }, // scheduled for Day 2, still TODO
        { ...baseTasks[2], status: 'TODO' }, // scheduled for Day 3
      ],
    });

    // Viewed on Day 3
    const plan = deriveDailyLearningPlan(sprint, {
      hoursPerDay: 1,
      daysPerWeek: 5,
      sprintDurationDays: 7,
    }, '2026-10-03T12:00:00.000Z'); // Day 3

    expect(plan.sprintDayNumber).toBe(3);
    expect(plan.overdueTasks.map((t) => t.id)).toEqual(['task-1', 'task-2']);
    expect(plan.isOnPace).toBe(false);
    expect(plan.statusSummary).toBe('BEHIND');
  });

  // 9. Upcoming tasks detected correctly
  it('9. categorizes future scheduled tasks as upcoming', () => {
    const sprint = createMockSprint();
    // Viewed on Day 1
    const plan = deriveDailyLearningPlan(sprint, {
      hoursPerDay: 1,
      daysPerWeek: 5,
      sprintDurationDays: 7,
    }, '2026-10-01T12:00:00.000Z'); // Day 1

    expect(plan.todayTasks.map((t) => t.id)).toEqual(['task-1']);
    expect(plan.upcomingTasks.map((t) => t.id)).toEqual(['task-2', 'task-3', 'task-4']);
    expect(plan.overdueTasks.length).toBe(0);
    expect(plan.isOnPace).toBe(true);
    expect(plan.statusSummary).toBe('ON_TRACK');
  });

  // 10. Sprint first day
  it('10. handles Day 1 correctly', () => {
    const sprint = createMockSprint();
    const plan = deriveDailyLearningPlan(sprint, {
      hoursPerDay: 1.5,
      daysPerWeek: 5,
      sprintDurationDays: 7,
    }, '2026-10-01T01:00:00.000Z');

    expect(plan.sprintDayNumber).toBe(1);
    expect(plan.isBeforeSprint).toBe(false);
    expect(plan.isAfterSprint).toBe(false);
    expect(plan.todayTasks.length).toBeGreaterThan(0);
  });

  // 11. Sprint middle day
  it('11. handles middle day (Day 4) correctly', () => {
    const sprint = createMockSprint();
    const plan = deriveDailyLearningPlan(sprint, {
      hoursPerDay: 1.5,
      daysPerWeek: 5,
      sprintDurationDays: 7,
    }, '2026-10-04T12:00:00.000Z');

    expect(plan.sprintDayNumber).toBe(4);
    expect(plan.isBeforeSprint).toBe(false);
    expect(plan.isAfterSprint).toBe(false);
  });

  // 12. Sprint final day
  it('12. handles final sprint day (Day 7) correctly', () => {
    const sprint = createMockSprint();
    const plan = deriveDailyLearningPlan(sprint, {
      hoursPerDay: 1.5,
      daysPerWeek: 5,
      sprintDurationDays: 7,
    }, '2026-10-07T12:00:00.000Z');

    expect(plan.sprintDayNumber).toBe(7);
    expect(plan.isAfterSprint).toBe(false);
  });

  // 13. Before sprint starts
  it('13. detects before sprint start and marks as NOT_STARTED', () => {
    const sprint = createMockSprint();
    const plan = deriveDailyLearningPlan(sprint, {
      hoursPerDay: 1.5,
      daysPerWeek: 5,
      sprintDurationDays: 7,
    }, '2026-09-28T12:00:00.000Z'); // 3 days before start

    expect(plan.isBeforeSprint).toBe(true);
    expect(plan.sprintDayNumber).toBe(0);
    expect(plan.statusSummary).toBe('NOT_STARTED');
    expect(plan.todayTasks.length).toBe(0);
    expect(plan.upcomingTasks.length).toBe(4);
  });

  // 14. After sprint ends
  it('14. detects after sprint end and marks unfinished tasks as overdue / BEHIND', () => {
    const sprint = createMockSprint();
    const plan = deriveDailyLearningPlan(sprint, {
      hoursPerDay: 1.5,
      daysPerWeek: 5,
      sprintDurationDays: 7,
    }, '2026-10-15T12:00:00.000Z'); // after sprint end

    expect(plan.isAfterSprint).toBe(true);
    expect(plan.statusSummary).toBe('BEHIND');
    expect(plan.overdueTasks.length).toBe(4);
  });

  // 15. Deterministic output for identical inputs
  it('15. produces identical output for identical inputs', () => {
    const sprint = createMockSprint();
    const personalization = { hoursPerDay: 1.5, daysPerWeek: 5, sprintDurationDays: 7 as const };
    const date = '2026-10-03T12:00:00.000Z';

    const planA = deriveDailyLearningPlan(sprint, personalization, date);
    const planB = deriveDailyLearningPlan(sprint, personalization, date);

    expect(planA).toEqual(planB);
  });

  // 16. Task estimatedMinutes exceeding daily capacity
  it('16. safely schedules single task longer than daily capacity without overflow loops', () => {
    const longTask: SprintTaskDTO = {
      id: 'task-long',
      sprintId: 'sprint-1',
      title: 'Heavy System Design Drill',
      orderIndex: 1,
      estimatedMinutes: 240, // 4 hours
      requiresEvidence: true,
      status: 'TODO',
    };
    const sprint = createMockSprint({ tasks: [longTask] });

    const plan = deriveDailyLearningPlan(sprint, {
      hoursPerDay: 1, // 60 mins/day
      daysPerWeek: 5,
      sprintDurationDays: 7,
    }, '2026-10-01T12:00:00.000Z');

    expect(plan.scheduledTasks[0].scheduledDayNumber).toBe(1);
    expect(plan.todayEstimatedMinutes).toBe(240);
  });

  // 17. Fewer tasks than daily capacity
  it('17. cleanly handles sprint with fewer tasks than available capacity', () => {
    const singleTask: SprintTaskDTO = {
      id: 'task-short',
      sprintId: 'sprint-1',
      title: 'Quick Diagnostic Review',
      orderIndex: 1,
      estimatedMinutes: 30,
      requiresEvidence: false,
      status: 'TODO',
    };
    const sprint = createMockSprint({ tasks: [singleTask] });

    const plan = deriveDailyLearningPlan(sprint, {
      hoursPerDay: 2, // 120 mins/day
      daysPerWeek: 5,
      sprintDurationDays: 7,
    }, '2026-10-01T12:00:00.000Z');

    expect(plan.scheduledTasks[0].scheduledDayNumber).toBe(1);
    expect(plan.todayTasks.length).toBe(1);
    expect(plan.upcomingTasks.length).toBe(0);
  });

  // 18. Uneven task distribution
  it('18. handles uneven task lengths (30m, 45m, 90m, 60m) deterministically', () => {
    const unevenTasks: SprintTaskDTO[] = [
      { id: 't1', sprintId: 's1', title: 'Task 1', orderIndex: 1, estimatedMinutes: 30, requiresEvidence: false, status: 'TODO' },
      { id: 't2', sprintId: 's1', title: 'Task 2', orderIndex: 2, estimatedMinutes: 45, requiresEvidence: false, status: 'TODO' },
      { id: 't3', sprintId: 's1', title: 'Task 3', orderIndex: 3, estimatedMinutes: 90, requiresEvidence: false, status: 'TODO' },
      { id: 't4', sprintId: 's1', title: 'Task 4', orderIndex: 4, estimatedMinutes: 60, requiresEvidence: false, status: 'TODO' },
    ];
    const sprint = createMockSprint({ tasks: unevenTasks });

    const plan = deriveDailyLearningPlan(sprint, {
      hoursPerDay: 1.5, // 90 mins/day
      daysPerWeek: 5,
      sprintDurationDays: 7,
    }, '2026-10-01T12:00:00.000Z');

    // Day 1: t1 (30m) + t2 (45m) = 75m <= 90m -> Day 1
    // Day 2: t3 (90m) = 90m <= 90m -> Day 2
    // Day 3: t4 (60m) = 60m <= 90m -> Day 3
    expect(plan.scheduledTasks.find((s) => s.task.id === 't1')?.scheduledDayNumber).toBe(1);
    expect(plan.scheduledTasks.find((s) => s.task.id === 't2')?.scheduledDayNumber).toBe(1);
    expect(plan.scheduledTasks.find((s) => s.task.id === 't3')?.scheduledDayNumber).toBe(2);
    expect(plan.scheduledTasks.find((s) => s.task.id === 't4')?.scheduledDayNumber).toBe(3);
  });

  // 19. All tasks completed -> SPRINT_COMPLETED status
  it('19. marks statusSummary as SPRINT_COMPLETED when all tasks are complete', () => {
    const sprint = createMockSprint({
      tasks: baseTasks.map((t) => ({ ...t, status: 'COMPLETED' as const })),
    });
    const plan = deriveDailyLearningPlan(sprint, {
      hoursPerDay: 1.5,
      daysPerWeek: 5,
      sprintDurationDays: 7,
    }, '2026-10-04T12:00:00.000Z');

    expect(plan.statusSummary).toBe('SPRINT_COMPLETED');
    expect(plan.sprintCompletionPercentage).toBe(100);
    expect(plan.todayTasks.length).toBe(0);
    expect(plan.completedTasks.length).toBe(4);
  });
});

describe('Stage 6.2: Smart Task Resolution Engine (resolveResumeTask)', () => {
  const baseTasks: SprintTaskDTO[] = [
    {
      id: 'task-1',
      sprintId: 'sprint-1',
      title: 'Milestone 1: Core React Reconciliation',
      description: 'Understand Virtual DOM and Fiber Architecture',
      orderIndex: 1,
      estimatedMinutes: 60,
      requiresEvidence: false,
      requiresAssessment: false,
      status: 'TODO',
    },
    {
      id: 'task-2',
      sprintId: 'sprint-1',
      title: 'Milestone 2: State Machines and Reducers',
      description: 'Implement complex state with useReducer',
      orderIndex: 2,
      estimatedMinutes: 60,
      requiresEvidence: true,
      requiresAssessment: false,
      status: 'TODO',
    },
    {
      id: 'task-3',
      sprintId: 'sprint-1',
      title: 'Milestone 3: Server Actions & Concurrent Transitions',
      description: 'Master React 19 concurrent transitions',
      orderIndex: 3,
      estimatedMinutes: 90,
      requiresEvidence: false,
      requiresAssessment: true,
      status: 'TODO',
    },
    {
      id: 'task-4',
      sprintId: 'sprint-1',
      title: 'Milestone 4: Performance Profiling & Optimization',
      description: 'Analyze commit phase bottlenecks and render cascades',
      orderIndex: 4,
      estimatedMinutes: 90,
      requiresEvidence: true,
      requiresAssessment: true,
      status: 'TODO',
    },
  ];

  const createMockSprint = (tasks: SprintTaskDTO[] = baseTasks): RoadmapSprintDTO => ({
    id: 'sprint-101',
    userRoadmapId: 'ur-101',
    sprintNumber: 1,
    startDate: '2026-10-01T00:00:00.000Z',
    endDate: '2026-10-07T23:59:59.999Z',
    objective: 'Master High-Performance React 19 Architecture',
    expectedMinutes: 300,
    status: 'ACTIVE',
    tasks: tasks.map((t) => ({ ...t })),
  });

  const mockPersonalization = {
    hoursPerDay: 1.5,
    daysPerWeek: 5,
    sprintDurationDays: 7,
  };

  // Rule 1: IN_PROGRESS task is selected first
  it('1. selects IN_PROGRESS task with highest priority', () => {
    const sprint = createMockSprint([
      { ...baseTasks[0], status: 'TODO' },
      { ...baseTasks[1], status: 'IN_PROGRESS' },
      { ...baseTasks[2], status: 'TODO' },
      { ...baseTasks[3], status: 'TODO' },
    ]);

    const result = resolveResumeTask(sprint, mockPersonalization, '2026-10-01T12:00:00.000Z');
    expect(result).not.toBeNull();
    expect(result?.id).toBe('task-2');
    expect(result?.status).toBe('IN_PROGRESS');
  });

  // Rule 2: Multiple IN_PROGRESS tasks -> lowest orderIndex selected
  it('2. selects lowest orderIndex when multiple tasks are IN_PROGRESS', () => {
    const sprint = createMockSprint([
      { ...baseTasks[0], status: 'TODO' },
      { ...baseTasks[1], status: 'IN_PROGRESS', orderIndex: 5 },
      { ...baseTasks[2], status: 'IN_PROGRESS', orderIndex: 2 },
      { ...baseTasks[3], status: 'IN_PROGRESS', orderIndex: 8 },
    ]);

    const result = resolveResumeTask(sprint, mockPersonalization, '2026-10-01T12:00:00.000Z');
    expect(result).not.toBeNull();
    expect(result?.id).toBe('task-3'); // orderIndex: 2
  });

  // Rule 3: Today's first unfinished task selected when no IN_PROGRESS exists
  it('3. selects Today first unfinished task when no IN_PROGRESS task exists', () => {
    // On Day 2 (2026-10-02), with 90min/day capacity:
    // task-1 (60m) is Day 1 -> completed
    // task-2 (60m) is Day 1 (60+60=120 > 90 -> Day 2) -> TODO
    const sprint = createMockSprint([
      { ...baseTasks[0], status: 'COMPLETED' },
      { ...baseTasks[1], status: 'TODO' },
      { ...baseTasks[2], status: 'TODO' },
      { ...baseTasks[3], status: 'TODO' },
    ]);

    const result = resolveResumeTask(sprint, mockPersonalization, '2026-10-02T12:00:00.000Z');
    expect(result).not.toBeNull();
    expect(result?.id).toBe('task-2');
  });

  // Rule 4: First TODO task selected when there are no unfinished TODAY tasks
  it('4. selects first TODO task in sprint when no unfinished TODAY tasks exist (e.g. today complete or rest day)', () => {
    const sprint = createMockSprint([
      { ...baseTasks[0], status: 'COMPLETED' },
      { ...baseTasks[1], status: 'COMPLETED' },
      { ...baseTasks[2], status: 'TODO' },
      { ...baseTasks[3], status: 'TODO' },
    ]);

    // On Day 1, tasks 1 & 2 are completed. Upcoming tasks are TODO.
    const result = resolveResumeTask(sprint, mockPersonalization, '2026-10-01T12:00:00.000Z');
    expect(result).not.toBeNull();
    expect(result?.id).toBe('task-3');
  });

  // Rule 5: COMPLETED tasks are NEVER selected
  it('5. never selects a COMPLETED task', () => {
    const sprint = createMockSprint([
      { ...baseTasks[0], status: 'COMPLETED', orderIndex: 1 },
      { ...baseTasks[1], status: 'COMPLETED', orderIndex: 2 },
      { ...baseTasks[2], status: 'COMPLETED', orderIndex: 3 },
      { ...baseTasks[3], status: 'TODO', orderIndex: 4 },
    ]);

    const result = resolveResumeTask(sprint, mockPersonalization, '2026-10-01T12:00:00.000Z');
    expect(result).not.toBeNull();
    expect(result?.id).toBe('task-4');
    expect(result?.status).not.toBe('COMPLETED');
  });

  // Rule 6: All tasks completed -> null
  it('6. returns null when all sprint tasks are COMPLETED', () => {
    const sprint = createMockSprint([
      { ...baseTasks[0], status: 'COMPLETED' },
      { ...baseTasks[1], status: 'COMPLETED' },
      { ...baseTasks[2], status: 'COMPLETED' },
      { ...baseTasks[3], status: 'COMPLETED' },
    ]);

    const result = resolveResumeTask(sprint, mockPersonalization, '2026-10-04T12:00:00.000Z');
    expect(result).toBeNull();
  });

  // Rule 7: Overdue IN_PROGRESS task still wins over today's TODO tasks
  it('7. ensures overdue IN_PROGRESS task wins over scheduled today TODO tasks', () => {
    // Task 1 was scheduled for Day 1 and left IN_PROGRESS. We are now on Day 3.
    const sprint = createMockSprint([
      { ...baseTasks[0], status: 'IN_PROGRESS' }, // scheduled for Day 1
      { ...baseTasks[1], status: 'TODO' },        // scheduled for Day 2
      { ...baseTasks[2], status: 'TODO' },        // scheduled for Day 3
      { ...baseTasks[3], status: 'TODO' },        // scheduled for Day 4
    ]);

    const result = resolveResumeTask(sprint, mockPersonalization, '2026-10-03T12:00:00.000Z');
    expect(result).not.toBeNull();
    expect(result?.id).toBe('task-1');
  });

  // Rule 8: Deterministic result for identical inputs
  it('8. produces deterministic identical outputs across repeated calls', () => {
    const sprint = createMockSprint([
      { ...baseTasks[0], status: 'COMPLETED' },
      { ...baseTasks[1], status: 'TODO' },
      { ...baseTasks[2], status: 'TODO' },
      { ...baseTasks[3], status: 'TODO' },
    ]);

    const res1 = resolveResumeTask(sprint, mockPersonalization, '2026-10-02T12:00:00.000Z');
    const res2 = resolveResumeTask(sprint, mockPersonalization, '2026-10-02T12:00:00.000Z');
    const res3 = resolveResumeTask(sprint, mockPersonalization, '2026-10-02T12:00:00.000Z');

    expect(res1?.id).toBe('task-2');
    expect(res2?.id).toBe('task-2');
    expect(res3?.id).toBe('task-2');
  });

  // Rule 9: Handles null sprint or empty tasks gracefully
  it('9. returns null when sprint or sprint.tasks is null/empty', () => {
    expect(resolveResumeTask(null)).toBeNull();
    expect(resolveResumeTask(createMockSprint([]))).toBeNull();
  });
});

describe('Stage 6.3: Time-box Session Timer & Active Task Focus Mode', () => {
  // 1. Initial NOT_STARTED state
  it('1. initializes task session snapshot in NOT_STARTED state with correct duration', () => {
    const session = createInitialTaskSession('task-101', 30);
    expect(session.state).toBe('NOT_STARTED');
    expect(session.taskId).toBe('task-101');
    expect(session.initialSeconds).toBe(1800);
    expect(session.remainingSeconds).toBe(1800);
    expect(session.elapsedSeconds).toBe(0);
  });

  // 2. START -> RUNNING
  it('2. transitions from NOT_STARTED to RUNNING on startTaskSession', () => {
    const session = createInitialTaskSession('task-101', 45);
    const started = startTaskSession(session);
    expect(started.state).toBe('RUNNING');
    expect(started.remainingSeconds).toBe(2700);
  });

  // 3. PAUSE -> PAUSED
  it('3. transitions from RUNNING to PAUSED on pauseTaskSession', () => {
    let session = createInitialTaskSession('task-101', 30);
    session = startTaskSession(session);
    session = tickTaskSession(session, 100);
    expect(session.remainingSeconds).toBe(1700);

    const paused = pauseTaskSession(session);
    expect(paused.state).toBe('PAUSED');
    expect(paused.remainingSeconds).toBe(1700);
  });

  // 4. RESUME -> RUNNING
  it('4. transitions from PAUSED to RUNNING on resumeTaskSession', () => {
    let session = createInitialTaskSession('task-101', 30);
    session = startTaskSession(session);
    session = tickTaskSession(session, 200);
    session = pauseTaskSession(session);
    expect(session.state).toBe('PAUSED');

    const resumed = resumeTaskSession(session);
    expect(resumed.state).toBe('RUNNING');
    expect(resumed.remainingSeconds).toBe(1600);
  });

  // 5. Timer counts down while RUNNING
  it('5. counts down remainingSeconds and accumulates elapsedSeconds when ticked', () => {
    let session = createInitialTaskSession('task-101', 10); // 600s
    session = startTaskSession(session);
    session = tickTaskSession(session, 1);
    expect(session.remainingSeconds).toBe(599);
    expect(session.elapsedSeconds).toBe(1);

    session = tickTaskSession(session, 59);
    expect(session.remainingSeconds).toBe(540);
    expect(session.elapsedSeconds).toBe(60);
  });

  // 6. Timer never goes below zero
  it('6. prevents remainingSeconds from ever going below 0:00', () => {
    let session = createInitialTaskSession('task-101', 1); // 60s
    session = startTaskSession(session);
    session = tickTaskSession(session, 1000); // tick more than duration

    expect(session.remainingSeconds).toBe(0);
    expect(session.elapsedSeconds).toBe(60);
    expect(session.state).toBe('COMPLETED');
  });

  // 7. Timer reaches COMPLETED at zero
  it('7. transitions state to COMPLETED when remainingSeconds reaches 0', () => {
    let session = createInitialTaskSession('task-101', 1); // 60s
    session = startTaskSession(session);
    session = tickTaskSession(session, 60);

    expect(session.state).toBe('COMPLETED');
    expect(session.remainingSeconds).toBe(0);
  });

  // 8. Task is NOT automatically marked COMPLETED (remains purely session state)
  it('8. leaves sprint task status independent of session timer completion', () => {
    const task: SprintTaskDTO = {
      id: 'task-101',
      sprintId: 'sprint-1',
      title: 'Milestone 1',
      orderIndex: 1,
      estimatedMinutes: 30,
      requiresEvidence: true,
      status: 'TODO',
    };

    let session = createInitialTaskSession(task.id, task.estimatedMinutes);
    session = startTaskSession(session);
    session = tickTaskSession(session, 1800);

    expect(session.state).toBe('COMPLETED');
    // Task status remains TODO (not changed automatically)
    expect(task.status).toBe('TODO');
  });

  // 9. Pause preserves remaining time and stops ticks
  it('9. preserves remaining time while PAUSED and ignores ticks', () => {
    let session = createInitialTaskSession('task-101', 30);
    session = startTaskSession(session);
    session = tickTaskSession(session, 500);
    session = pauseTaskSession(session);

    const tickAttempt = tickTaskSession(session, 100);
    expect(tickAttempt.state).toBe('PAUSED');
    expect(tickAttempt.remainingSeconds).toBe(1300);
    expect(tickAttempt.elapsedSeconds).toBe(500);
  });

  // 10. Restart / reset restores initial state
  it('10. resets session timer back to NOT_STARTED and full duration', () => {
    let session = createInitialTaskSession('task-101', 45);
    session = startTaskSession(session);
    session = tickTaskSession(session, 600);

    const reset = resetTaskSession(session);
    expect(reset.state).toBe('NOT_STARTED');
    expect(reset.remainingSeconds).toBe(2700);
    expect(reset.elapsedSeconds).toBe(0);
  });

  // 11. Zero / invalid / negative duration edge cases handled safely
  it('11. safely handles <= 0, NaN, missing, or extreme estimatedMinutes values', () => {
    expect(getSafeSessionDuration(0)).toBe(45 * 60);
    expect(getSafeSessionDuration(-15)).toBe(45 * 60);
    expect(getSafeSessionDuration(null)).toBe(45 * 60);
    expect(getSafeSessionDuration(undefined)).toBe(45 * 60);
    expect(getSafeSessionDuration(NaN)).toBe(45 * 60);
    expect(getSafeSessionDuration(Infinity)).toBe(45 * 60);
    // Upper bound cap at 480 mins (8 hours)
    expect(getSafeSessionDuration(1000)).toBe(480 * 60);
    // Valid custom duration
    expect(getSafeSessionDuration(25)).toBe(25 * 60);
  });

  // 12. Formats mm:ss and hh:mm:ss nicely
  it('12. formats timer seconds into clean readable strings', () => {
    expect(formatTimerSeconds(2700)).toBe('45:00');
    expect(formatTimerSeconds(599)).toBe('09:59');
    expect(formatTimerSeconds(65)).toBe('01:05');
    expect(formatTimerSeconds(0)).toBe('00:00');
    expect(formatTimerSeconds(-5)).toBe('00:00');
    expect(formatTimerSeconds(3665)).toBe('01:01:05');
  });

  // 13. Restarting completed session resets countdown
  it('13. restarting from COMPLETED state resets remainingSeconds to initialSeconds and starts RUNNING', () => {
    let session = createInitialTaskSession('task-101', 15);
    session = startTaskSession(session);
    session = tickTaskSession(session, 900);
    expect(session.state).toBe('COMPLETED');

    const restarted = startTaskSession(session);
    expect(restarted.state).toBe('RUNNING');
    expect(restarted.remainingSeconds).toBe(900);
    expect(restarted.elapsedSeconds).toBe(0);
  });
});

describe('Stage 6.4: Daily Learning Activity & Streak System (deriveDailyLearningActivity)', () => {
  const createMockUserRoadmap = (
    tasks: SprintTaskDTO[] = [],
    evidence: SkillEvidenceDTO[] = []
  ): UserRoadmapDTO => ({
    id: 'ur-101',
    userId: 'user-1',
    sourceRoadmapId: 'crm-1',
    sourceRoadmap: {} as any,
    status: 'ACTIVE',
    personalization: {
      targetRole: 'Software Engineer',
      hoursPerDay: 1.5,
      daysPerWeek: 5,
      sprintDurationDays: 7,
    },
    sprints: [
      {
        id: 'sprint-101',
        userRoadmapId: 'ur-101',
        sprintNumber: 1,
        startDate: '2026-10-01T00:00:00.000Z',
        endDate: '2026-10-07T23:59:59.999Z',
        objective: 'Master System Fundamentals',
        expectedMinutes: 300,
        status: 'ACTIVE',
        tasks: tasks.map((t) => ({ ...t })),
      },
    ],
    skillEvidence: evidence.map((e) => ({ ...e })),
    createdAt: '2026-10-01T00:00:00.000Z',
    updatedAt: '2026-10-01T00:00:00.000Z',
  });

  // 1. No activity -> streak 0
  it('1. returns streak 0 and todayActive false when no activity exists', () => {
    const ur = createMockUserRoadmap([]);
    const res = deriveDailyLearningActivity(ur, '2026-10-05T12:00:00.000Z');

    expect(res.todayActive).toBe(false);
    expect(res.currentStreak).toBe(0);
    expect(res.activeDaysLast7).toBe(0);
    expect(res.activeDaysLast30).toBe(0);
    expect(res.totalActiveDays).toBe(0);
    expect(res.lastActiveDate).toBeNull();
  });

  // 2. Activity today -> streak 1
  it('2. returns streak 1 and todayActive true when activity occurs today', () => {
    const task: SprintTaskDTO = {
      id: 't-1',
      sprintId: 'sprint-101',
      title: 'Task 1',
      orderIndex: 1,
      estimatedMinutes: 60,
      requiresEvidence: false,
      status: 'COMPLETED',
      completedAt: '2026-10-05T10:30:00.000Z',
    };
    const ur = createMockUserRoadmap([task]);
    const res = deriveDailyLearningActivity(ur, '2026-10-05T12:00:00.000Z');

    expect(res.todayActive).toBe(true);
    expect(res.currentStreak).toBe(1);
    expect(res.activeDaysLast7).toBe(1);
    expect(res.activeDaysLast30).toBe(1);
    expect(res.totalActiveDays).toBe(1);
    expect(res.lastActiveDate).toBe('2026-10-05');
  });

  // 3. Activity today + yesterday -> streak 2
  it('3. returns streak 2 when activity occurs today and yesterday', () => {
    const tasks: SprintTaskDTO[] = [
      {
        id: 't-1',
        sprintId: 'sprint-101',
        title: 'Task 1',
        orderIndex: 1,
        estimatedMinutes: 60,
        requiresEvidence: false,
        status: 'COMPLETED',
        completedAt: '2026-10-04T15:00:00.000Z',
      },
      {
        id: 't-2',
        sprintId: 'sprint-101',
        title: 'Task 2',
        orderIndex: 2,
        estimatedMinutes: 60,
        requiresEvidence: false,
        status: 'COMPLETED',
        completedAt: '2026-10-05T09:00:00.000Z',
      },
    ];
    const ur = createMockUserRoadmap(tasks);
    const res = deriveDailyLearningActivity(ur, '2026-10-05T12:00:00.000Z');

    expect(res.todayActive).toBe(true);
    expect(res.currentStreak).toBe(2);
    expect(res.activeDaysLast7).toBe(2);
  });

  // 4. Three consecutive active days -> streak 3
  it('4. returns streak 3 when activity occurs across three consecutive days', () => {
    const tasks: SprintTaskDTO[] = [
      {
        id: 't-1',
        sprintId: 'sprint-101',
        title: 'Task 1',
        orderIndex: 1,
        estimatedMinutes: 60,
        requiresEvidence: false,
        status: 'COMPLETED',
        completedAt: '2026-10-03T10:00:00.000Z',
      },
      {
        id: 't-2',
        sprintId: 'sprint-101',
        title: 'Task 2',
        orderIndex: 2,
        estimatedMinutes: 60,
        requiresEvidence: false,
        status: 'COMPLETED',
        completedAt: '2026-10-04T11:00:00.000Z',
      },
      {
        id: 't-3',
        sprintId: 'sprint-101',
        title: 'Task 3',
        orderIndex: 3,
        estimatedMinutes: 60,
        requiresEvidence: false,
        status: 'COMPLETED',
        completedAt: '2026-10-05T12:00:00.000Z',
      },
    ];
    const ur = createMockUserRoadmap(tasks);
    const res = deriveDailyLearningActivity(ur, '2026-10-05T15:00:00.000Z');

    expect(res.todayActive).toBe(true);
    expect(res.currentStreak).toBe(3);
    expect(res.activeDaysLast7).toBe(3);
  });

  // 5. Gap breaks the streak
  it('5. breaks the streak when a calendar day gap exists', () => {
    // Activity on 2026-10-01, 2026-10-02, then GAP on 2026-10-03, then activity on 2026-10-04, 2026-10-05
    const tasks: SprintTaskDTO[] = [
      {
        id: 't-1',
        sprintId: 'sprint-101',
        title: 'Task 1',
        orderIndex: 1,
        estimatedMinutes: 60,
        requiresEvidence: false,
        status: 'COMPLETED',
        completedAt: '2026-10-01T10:00:00.000Z',
      },
      {
        id: 't-2',
        sprintId: 'sprint-101',
        title: 'Task 2',
        orderIndex: 2,
        estimatedMinutes: 60,
        requiresEvidence: false,
        status: 'COMPLETED',
        completedAt: '2026-10-02T10:00:00.000Z',
      },
      {
        id: 't-3',
        sprintId: 'sprint-101',
        title: 'Task 3',
        orderIndex: 3,
        estimatedMinutes: 60,
        requiresEvidence: false,
        status: 'COMPLETED',
        completedAt: '2026-10-04T10:00:00.000Z',
      },
      {
        id: 't-4',
        sprintId: 'sprint-101',
        title: 'Task 4',
        orderIndex: 4,
        estimatedMinutes: 60,
        requiresEvidence: false,
        status: 'COMPLETED',
        completedAt: '2026-10-05T10:00:00.000Z',
      },
    ];
    const ur = createMockUserRoadmap(tasks);
    const res = deriveDailyLearningActivity(ur, '2026-10-05T12:00:00.000Z');

    expect(res.todayActive).toBe(true);
    // Gap on Oct 3 limits current streak to 2 (Oct 4 + Oct 5)
    expect(res.currentStreak).toBe(2);
    expect(res.activeDaysLast7).toBe(4);
    expect(res.totalActiveDays).toBe(4);
  });

  // 6. Multiple tasks on one day count as one active day
  it('6. deduplicates multiple task completions on the same date to one active day', () => {
    const tasks: SprintTaskDTO[] = [
      {
        id: 't-1',
        sprintId: 'sprint-101',
        title: 'Task 1',
        orderIndex: 1,
        estimatedMinutes: 60,
        requiresEvidence: false,
        status: 'COMPLETED',
        completedAt: '2026-10-05T08:00:00.000Z',
      },
      {
        id: 't-2',
        sprintId: 'sprint-101',
        title: 'Task 2',
        orderIndex: 2,
        estimatedMinutes: 60,
        requiresEvidence: false,
        status: 'COMPLETED',
        completedAt: '2026-10-05T11:00:00.000Z',
      },
      {
        id: 't-3',
        sprintId: 'sprint-101',
        title: 'Task 3',
        orderIndex: 3,
        estimatedMinutes: 60,
        requiresEvidence: false,
        status: 'COMPLETED',
        completedAt: '2026-10-05T16:00:00.000Z',
      },
    ];
    const ur = createMockUserRoadmap(tasks);
    const res = deriveDailyLearningActivity(ur, '2026-10-05T18:00:00.000Z');

    expect(res.todayActive).toBe(true);
    expect(res.currentStreak).toBe(1);
    expect(res.activeDaysLast7).toBe(1);
    expect(res.totalActiveDays).toBe(1);
  });

  // 7. Yesterday active but today not yet active maintains ongoing streak
  it('7. maintains streak from yesterday if user has not yet completed a task today', () => {
    const tasks: SprintTaskDTO[] = [
      {
        id: 't-1',
        sprintId: 'sprint-101',
        title: 'Task 1',
        orderIndex: 1,
        estimatedMinutes: 60,
        requiresEvidence: false,
        status: 'COMPLETED',
        completedAt: '2026-10-03T10:00:00.000Z',
      },
      {
        id: 't-2',
        sprintId: 'sprint-101',
        title: 'Task 2',
        orderIndex: 2,
        estimatedMinutes: 60,
        requiresEvidence: false,
        status: 'COMPLETED',
        completedAt: '2026-10-04T10:00:00.000Z',
      },
    ];
    const ur = createMockUserRoadmap(tasks);
    // Reference date is 2026-10-05 (today), no activity yet today
    const res = deriveDailyLearningActivity(ur, '2026-10-05T09:00:00.000Z');

    expect(res.todayActive).toBe(false);
    expect(res.currentStreak).toBe(2); // ongoing 2-day streak from Oct 3 & 4
    expect(res.activeDaysLast7).toBe(2);
  });

  // 8. Skill evidence counts as learning activity
  it('8. recognizes skill evidence recordings as verified learning activity', () => {
    const evidence: SkillEvidenceDTO[] = [
      {
        id: 'ev-1',
        userRoadmapId: 'ur-101',
        skillId: 'sk-1',
        source: 'SELF_REPORTED',
        confidence: 80,
        assessedAt: '2026-10-05T14:00:00.000Z',
      },
    ];
    const ur = createMockUserRoadmap([], evidence);
    const res = deriveDailyLearningActivity(ur, '2026-10-05T16:00:00.000Z');

    expect(res.todayActive).toBe(true);
    expect(res.currentStreak).toBe(1);
    expect(res.totalActiveDays).toBe(1);
  });

  // 9. Future activity is strictly ignored
  it('9. ignores any future-dated activity records', () => {
    const tasks: SprintTaskDTO[] = [
      {
        id: 't-1',
        sprintId: 'sprint-101',
        title: 'Future Task',
        orderIndex: 1,
        estimatedMinutes: 60,
        requiresEvidence: false,
        status: 'COMPLETED',
        completedAt: '2026-10-10T10:00:00.000Z', // 5 days in future
      },
    ];
    const ur = createMockUserRoadmap(tasks);
    const res = deriveDailyLearningActivity(ur, '2026-10-05T12:00:00.000Z');

    expect(res.todayActive).toBe(false);
    expect(res.currentStreak).toBe(0);
    expect(res.totalActiveDays).toBe(0);
  });

  // 10. Month boundary handling
  it('10. correctly preserves streaks across month boundaries', () => {
    const tasks: SprintTaskDTO[] = [
      {
        id: 't-1',
        sprintId: 'sprint-101',
        title: 'Task 1',
        orderIndex: 1,
        estimatedMinutes: 60,
        requiresEvidence: false,
        status: 'COMPLETED',
        completedAt: '2026-09-30T20:00:00.000Z',
      },
      {
        id: 't-2',
        sprintId: 'sprint-101',
        title: 'Task 2',
        orderIndex: 2,
        estimatedMinutes: 60,
        requiresEvidence: false,
        status: 'COMPLETED',
        completedAt: '2026-10-01T10:00:00.000Z',
      },
    ];
    const ur = createMockUserRoadmap(tasks);
    const res = deriveDailyLearningActivity(ur, '2026-10-01T12:00:00.000Z');

    expect(res.todayActive).toBe(true);
    expect(res.currentStreak).toBe(2);
  });

  // 11. Year boundary handling
  it('11. correctly preserves streaks across year boundaries', () => {
    const tasks: SprintTaskDTO[] = [
      {
        id: 't-1',
        sprintId: 'sprint-101',
        title: 'Task 1',
        orderIndex: 1,
        estimatedMinutes: 60,
        requiresEvidence: false,
        status: 'COMPLETED',
        completedAt: '2025-12-31T22:00:00.000Z',
      },
      {
        id: 't-2',
        sprintId: 'sprint-101',
        title: 'Task 2',
        orderIndex: 2,
        estimatedMinutes: 60,
        requiresEvidence: false,
        status: 'COMPLETED',
        completedAt: '2026-01-01T10:00:00.000Z',
      },
    ];
    const ur = createMockUserRoadmap(tasks);
    const res = deriveDailyLearningActivity(ur, '2026-01-01T12:00:00.000Z');

    expect(res.todayActive).toBe(true);
    expect(res.currentStreak).toBe(2);
  });

  // 12. Safe handling of null UserRoadmap
  it('12. handles null and undefined UserRoadmap safely', () => {
    const resNull = deriveDailyLearningActivity(null, '2026-10-05T12:00:00.000Z');
    expect(resNull.currentStreak).toBe(0);
    expect(resNull.todayActive).toBe(false);

    const resUndefined = deriveDailyLearningActivity(undefined, '2026-10-05T12:00:00.000Z');
    expect(resUndefined.currentStreak).toBe(0);
  });
});

describe('Stage 6.5: Capstone Cross-Feature Consistency & System Polish', () => {
  const personalization = {
    hoursPerDay: 1.5,
    daysPerWeek: 5,
    sprintDurationDays: 7 as const,
  };

  // 1. Cross-feature lifecycle: Plan -> Resume -> Focus Timer -> Task Completion -> Activity -> Streak
  it('1. maintains strict cross-feature consistency across the entire Stage 6 user workflow', () => {
    const initialTasks: SprintTaskDTO[] = [
      {
        id: 'task-1',
        sprintId: 'sprint-1',
        title: 'Milestone 1: Virtual DOM & Reconciler',
        orderIndex: 1,
        estimatedMinutes: 45,
        requiresEvidence: false,
        status: 'TODO',
      },
      {
        id: 'task-2',
        sprintId: 'sprint-1',
        title: 'Milestone 2: Concurrency & Transitions',
        orderIndex: 2,
        estimatedMinutes: 45,
        requiresEvidence: true,
        status: 'TODO',
      },
    ];

    const sprint: RoadmapSprintDTO = {
      id: 'sprint-1',
      userRoadmapId: 'ur-101',
      sprintNumber: 1,
      startDate: '2026-10-01T00:00:00.000Z',
      endDate: '2026-10-07T23:59:59.999Z',
      objective: 'Core Systems Mastery',
      expectedMinutes: 90,
      status: 'ACTIVE',
      tasks: initialTasks,
    };

    const userRoadmap: UserRoadmapDTO = {
      id: 'ur-101',
      userId: 'user-1',
      sourceRoadmapId: 'crm-1',
      sourceRoadmap: {} as any,
      status: 'ACTIVE',
      personalization,
      sprints: [sprint],
      skillEvidence: [],
      createdAt: '2026-10-01T00:00:00.000Z',
      updatedAt: '2026-10-01T00:00:00.000Z',
    };

    // Step A: Initial state on Day 1 (2026-10-01)
    const initialPlan = deriveDailyLearningPlan(sprint, personalization, '2026-10-01T09:00:00.000Z');
    expect(initialPlan.statusSummary).toBe('ON_TRACK');
    expect(initialPlan.todayTasks.map((t) => t.id)).toEqual(['task-1', 'task-2']);

    const initialResumeTask = resolveResumeTask(sprint, personalization, '2026-10-01T09:00:00.000Z');
    expect(initialResumeTask?.id).toBe('task-1');

    const initialActivity = deriveDailyLearningActivity(userRoadmap, '2026-10-01T09:00:00.000Z');
    expect(initialActivity.todayActive).toBe(false);
    expect(initialActivity.currentStreak).toBe(0);

    // Step B: Learner starts local focus session on task-1
    let session = createInitialTaskSession(initialResumeTask!.id, initialResumeTask!.estimatedMinutes);
    expect(session.state).toBe('NOT_STARTED');
    expect(session.remainingSeconds).toBe(45 * 60);

    session = startTaskSession(session);
    expect(session.state).toBe('RUNNING');

    session = tickTaskSession(session, 45 * 60);
    expect(session.state).toBe('COMPLETED');
    expect(session.remainingSeconds).toBe(0);

    // Step C: Task 1 completes on backend on 2026-10-01
    const completedTask1: SprintTaskDTO = {
      ...initialTasks[0],
      status: 'COMPLETED',
      completedAt: '2026-10-01T10:30:00.000Z',
    };
    sprint.tasks = [completedTask1, initialTasks[1]];
    userRoadmap.sprints = [sprint];

    // Step D: Verify post-completion state consistency
    const postTask1Plan = deriveDailyLearningPlan(sprint, personalization, '2026-10-01T11:00:00.000Z');
    expect(postTask1Plan.todayTasks.map((t) => t.id)).toEqual(['task-2']);
    expect(postTask1Plan.completedTasks.map((t) => t.id)).toEqual(['task-1']);
    expect(postTask1Plan.todayCompletionPercentage).toBe(50);

    const postTask1Resume = resolveResumeTask(sprint, personalization, '2026-10-01T11:00:00.000Z');
    expect(postTask1Resume?.id).toBe('task-2');

    const postTask1Activity = deriveDailyLearningActivity(userRoadmap, '2026-10-01T11:00:00.000Z');
    expect(postTask1Activity.todayActive).toBe(true);
    expect(postTask1Activity.currentStreak).toBe(1);
    expect(postTask1Activity.totalActiveDays).toBe(1);
  });

  // 2. Evidence submission recorded on rest day preserves streak and satisfies gates
  it('2. confirms skill evidence on rest day maintains streak and counts toward learning activity', () => {
    const sprint: RoadmapSprintDTO = {
      id: 'sprint-1',
      userRoadmapId: 'ur-101',
      sprintNumber: 1,
      startDate: '2026-10-01T00:00:00.000Z',
      endDate: '2026-10-07T23:59:59.999Z',
      objective: 'Core Systems Mastery',
      expectedMinutes: 90,
      status: 'ACTIVE',
      tasks: [
        {
          id: 't-1',
          sprintId: 'sprint-1',
          title: 'Milestone 1',
          orderIndex: 1,
          estimatedMinutes: 60,
          requiresEvidence: false,
          status: 'COMPLETED',
          completedAt: '2026-10-01T10:00:00.000Z', // Day 1
        },
        {
          id: 't-2',
          sprintId: 'sprint-1',
          title: 'Milestone 2',
          orderIndex: 2,
          estimatedMinutes: 60,
          requiresEvidence: true,
          status: 'COMPLETED',
          completedAt: '2026-10-02T10:00:00.000Z', // Day 2
        },
        {
          id: 't-3',
          sprintId: 'sprint-1',
          title: 'Milestone 3',
          orderIndex: 3,
          estimatedMinutes: 60,
          requiresEvidence: true,
          status: 'COMPLETED',
          completedAt: '2026-10-03T10:00:00.000Z', // Day 3
        },
      ],
    };

    // Day 6 (2026-10-06) is a rest day (3 days/wk schedule)
    const customPersonalization = { hoursPerDay: 1, daysPerWeek: 3, sprintDurationDays: 7 as const };
    const planDay6 = deriveDailyLearningPlan(sprint, customPersonalization, '2026-10-06T12:00:00.000Z');
    expect(planDay6.statusSummary).toBe('SPRINT_COMPLETED');

    // Add skill evidence submitted on Day 4 (2026-10-04) and Day 5 (2026-10-05)
    const userRoadmap: UserRoadmapDTO = {
      id: 'ur-101',
      userId: 'user-1',
      sourceRoadmapId: 'crm-1',
      sourceRoadmap: {} as any,
      status: 'ACTIVE',
      personalization: customPersonalization,
      sprints: [sprint],
      skillEvidence: [
        {
          id: 'ev-1',
          userRoadmapId: 'ur-101',
          skillId: 'sk-1',
          source: 'SELF_REPORTED',
          confidence: 90,
          assessedAt: '2026-10-04T15:00:00.000Z',
        },
        {
          id: 'ev-2',
          userRoadmapId: 'ur-101',
          skillId: 'sk-2',
          source: 'SELF_REPORTED',
          confidence: 85,
          assessedAt: '2026-10-05T16:00:00.000Z',
        },
      ],
      createdAt: '2026-10-01T00:00:00.000Z',
      updatedAt: '2026-10-01T00:00:00.000Z',
    };

    // On 2026-10-05, learner has unbroken 5-day streak (Oct 1, 2, 3 tasks + Oct 4, 5 evidence)
    const activity = deriveDailyLearningActivity(userRoadmap, '2026-10-05T18:00:00.000Z');
    expect(activity.todayActive).toBe(true);
    expect(activity.currentStreak).toBe(5);
    expect(activity.totalActiveDays).toBe(5);
    expect(activity.activeDaysLast7).toBe(5);
  });

  // 3. Multi-sprint historical retention across user career path
  it('3. aggregates active learning days and streaks across multiple historical sprints', () => {
    const sprint1: RoadmapSprintDTO = {
      id: 'sprint-1',
      userRoadmapId: 'ur-101',
      sprintNumber: 1,
      startDate: '2026-09-24T00:00:00.000Z',
      endDate: '2026-09-30T23:59:59.999Z',
      objective: 'Sprint 1',
      expectedMinutes: 120,
      status: 'COMPLETED',
      tasks: [
        { id: 's1-t1', sprintId: 'sprint-1', title: 'T1', orderIndex: 1, estimatedMinutes: 60, requiresEvidence: false, status: 'COMPLETED', completedAt: '2026-09-29T10:00:00.000Z' },
        { id: 's1-t2', sprintId: 'sprint-1', title: 'T2', orderIndex: 2, estimatedMinutes: 60, requiresEvidence: false, status: 'COMPLETED', completedAt: '2026-09-30T10:00:00.000Z' },
      ],
    };

    const sprint2: RoadmapSprintDTO = {
      id: 'sprint-2',
      userRoadmapId: 'ur-101',
      sprintNumber: 2,
      startDate: '2026-10-01T00:00:00.000Z',
      endDate: '2026-10-07T23:59:59.999Z',
      objective: 'Sprint 2',
      expectedMinutes: 120,
      status: 'ACTIVE',
      tasks: [
        { id: 's2-t1', sprintId: 'sprint-2', title: 'T3', orderIndex: 1, estimatedMinutes: 60, requiresEvidence: false, status: 'COMPLETED', completedAt: '2026-10-01T10:00:00.000Z' },
        { id: 's2-t2', sprintId: 'sprint-2', title: 'T4', orderIndex: 2, estimatedMinutes: 60, requiresEvidence: false, status: 'TODO' },
      ],
    };

    const userRoadmap: UserRoadmapDTO = {
      id: 'ur-101',
      userId: 'user-1',
      sourceRoadmapId: 'crm-1',
      sourceRoadmap: {} as any,
      status: 'ACTIVE',
      personalization,
      sprints: [sprint1, sprint2],
      skillEvidence: [],
      createdAt: '2026-09-24T00:00:00.000Z',
      updatedAt: '2026-10-01T00:00:00.000Z',
    };

    // On 2026-10-01: Activity on Sep 29, Sep 30, Oct 01 -> Streak 3 across sprint transition
    const activity = deriveDailyLearningActivity(userRoadmap, '2026-10-01T12:00:00.000Z');
    expect(activity.todayActive).toBe(true);
    expect(activity.currentStreak).toBe(3);
    expect(activity.totalActiveDays).toBe(3);
    expect(activity.activeDates).toEqual(['2026-09-29', '2026-09-30', '2026-10-01']);
  });
});

