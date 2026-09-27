import { describe, expect, it } from 'vitest';
import {
  determineSprintAdaptation,
  getSprintWindow,
  personalizationSchema,
  sprintPerformanceSchema,
} from '../../services/roadmap-service/src/domain/roadmap.domain.js';

describe('adaptive roadmap domain', () => {
  it('accepts a bounded seven-day personalization profile', () => {
    const profile = personalizationSchema.parse({
      targetRole: 'Backend Engineer',
      targetOutcome: 'Internship readiness',
      hoursPerDay: 2,
      daysPerWeek: 6,
    });

    expect(profile.sprintDurationDays).toBe(7);
    expect(profile.freeOnly).toBe(false);
  });

  it('rejects unsupported sprint durations and impossible time allocations', () => {
    expect(() => personalizationSchema.parse({
      targetRole: 'Backend Engineer',
      targetOutcome: 'Internship readiness',
      hoursPerDay: 24,
      daysPerWeek: 6,
      sprintDurationDays: 14,
    })).toThrow();
  });

  it('creates an inclusive seven-day sprint window', () => {
    const { startDate, endDate } = getSprintWindow(new Date('2026-09-26T14:00:00.000Z'), 7);

    expect(startDate.toISOString()).toBe('2026-09-26T00:00:00.000Z');
    expect(endDate.toISOString()).toBe('2026-10-02T23:59:59.999Z');
  });

  it('adds remediation when demonstrated performance is weak', () => {
    expect(determineSprintAdaptation({ taskCompletion: 95, assessmentScore: 48 })).toMatchObject({
      decision: 'REMEDIATE',
      action: 'INSERT_REINFORCEMENT',
    });
  });

  it('extends a sprint when execution is incomplete', () => {
    expect(determineSprintAdaptation({ taskCompletion: 45, assessmentScore: 85 })).toMatchObject({
      decision: 'EXTEND',
      action: 'EXTEND_SPRINT',
    });
  });

  it('accelerates only when completion and available evidence are strong', () => {
    expect(determineSprintAdaptation({
      taskCompletion: 90,
      assessmentScore: 90,
      practicalScore: 88,
      codingScore: 91,
    })).toMatchObject({
      decision: 'ACCELERATE',
      action: 'ACCELERATE_TASK',
    });
  });

  it('bounds performance evidence to an interpretable percentage range', () => {
    expect(() => sprintPerformanceSchema.parse({ assessmentScore: 101 })).toThrow();
    expect(sprintPerformanceSchema.parse({ assessmentScore: 78 })).toEqual({ assessmentScore: 78 });
  });
});
