import { z } from 'zod';

export const personalizationSchema = z.object({
  currentLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).default('INTERMEDIATE'),
  targetRole: z.string().trim().min(2).max(120),
  targetCompany: z.string().trim().min(2).max(120).optional(),
  targetOutcome: z.string().trim().min(2).max(160),
  deadline: z.coerce.date().optional(),
  hoursPerDay: z.number().min(0.25).max(16),
  daysPerWeek: z.number().int().min(1).max(7),
  sprintDurationDays: z.union([z.literal(7), z.literal(10)]).default(7),
  learningPreferences: z.array(z.string().trim().min(1).max(60)).max(8).default([]),
  freeOnly: z.boolean().default(false),
  budgetCents: z.number().int().min(0).max(10_000_000).optional(),
  preferredTechnologies: z.array(z.string().trim().min(1).max(60)).max(20).default([]),
});

export const sprintPerformanceSchema = z.object({
  assessmentScore: z.number().int().min(0).max(100).optional(),
  practicalScore: z.number().int().min(0).max(100).optional(),
  codingScore: z.number().int().min(0).max(100).optional(),
  interviewScore: z.number().int().min(0).max(100).optional(),
  consistencyScore: z.number().int().min(0).max(100).optional(),
  notes: z.string().trim().max(2_000).optional(),
});

export const taskProgressSchema = z.object({
  status: z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED', 'SKIPPED']),
});

export const selfReportedEvidenceSchema = z.object({
  skillId: z.string().cuid(),
  estimatedProficiency: z.number().int().min(0).max(100).optional(),
  notes: z.string().trim().max(1_000).optional(),
});

export type SprintMetrics = {
  taskCompletion: number;
  assessmentScore?: number | null;
  practicalScore?: number | null;
  codingScore?: number | null;
  interviewScore?: number | null;
  consistencyScore?: number | null;
};

export type AdaptationRecommendation = {
  decision: 'CONTINUE' | 'ACCELERATE' | 'EXTEND' | 'REMEDIATE';
  action: 'ACCELERATE_TASK' | 'INSERT_REINFORCEMENT' | 'EXTEND_SPRINT' | 'REDUCE_WORKLOAD' | 'INCREASE_PRACTICE' | null;
  reason: string;
};

function scoreBelow(value: number | null | undefined, threshold: number): boolean {
  return value !== null && value !== undefined && value < threshold;
}

export function determineSprintAdaptation(metrics: SprintMetrics): AdaptationRecommendation {
  const weakAssessment = scoreBelow(metrics.assessmentScore, 55);
  const weakPractical = scoreBelow(metrics.practicalScore, 55);
  const weakCoding = scoreBelow(metrics.codingScore, 55);

  if (weakAssessment || weakPractical || weakCoding) {
    return {
      decision: 'REMEDIATE',
      action: 'INSERT_REINFORCEMENT',
      reason: 'Demonstrated performance is below the current sprint threshold, so the next sprint adds targeted reinforcement before advancing.',
    };
  }

  if (metrics.taskCompletion < 60 || scoreBelow(metrics.consistencyScore, 55)) {
    return {
      decision: 'EXTEND',
      action: 'EXTEND_SPRINT',
      reason: 'The sprint needs more execution time before the plan advances; incomplete work will be carried forward.',
    };
  }

  const strongEvidence = [metrics.assessmentScore, metrics.practicalScore, metrics.codingScore]
    .filter((value): value is number => value !== null && value !== undefined)
    .every((value) => value >= 85);

  if (metrics.taskCompletion >= 80 && strongEvidence) {
    return {
      decision: 'ACCELERATE',
      action: 'ACCELERATE_TASK',
      reason: 'Completed work and demonstrated performance exceed the current target, so redundant repetition can be reduced in the next sprint.',
    };
  }

  return {
    decision: 'CONTINUE',
    action: null,
    reason: 'Current completion and performance support continuing with the planned next sprint.',
  };
}

export function getSprintWindow(startDate: Date, durationDays: 7 | 10): { startDate: Date; endDate: Date } {
  const start = new Date(startDate);
  start.setUTCHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + durationDays - 1);
  end.setUTCHours(23, 59, 59, 999);
  return { startDate: start, endDate: end };
}
