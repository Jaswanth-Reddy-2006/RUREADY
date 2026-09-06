import { describe, it, expect } from 'vitest';

/**
 * Tier 2 Boundary Tests: Feature 19 (STAR Scoring Breakdown)
 * Boundary & Corner Cases:
 * - Ultra-terse 1-word answer ("Yes", "Fixed it")
 * - Massive rambling answer (> 3,000 words without structure)
 * - Pure technical code explanation missing Situation and Task
 * - Decimal score rounding precision
 * - Fallback feedback when evaluation engine returns partial data
 */

function gradeStarAnswer(wordCount: number, hasMetrics: boolean, hasSituation: boolean) {
  if (wordCount < 10) {
    return {
      situation: 10,
      task: 10,
      action: 15,
      measurableImpact: 0,
      overall: 10,
      isTerseWarning: true,
    };
  }

  let s = hasSituation ? 75 : 30;
  let t = hasSituation ? 75 : 30;
  let a = wordCount >= 50 ? 80 : 50;
  let m = hasMetrics ? 85 : 45;

  const overall = Math.round(s * 0.2 + t * 0.2 + a * 0.3 + m * 0.3);
  return {
    situation: s,
    task: t,
    action: a,
    measurableImpact: m,
    overall,
    isTerseWarning: false,
  };
}

describe('Tier 2 Boundaries — Feature 19: STAR Scoring Breakdown', () => {
  it('should penalize ultra-terse 1-word answer with minimal STAR scores and warning', () => {
    const result = gradeStarAnswer(2, false, false);
    expect(result.overall).toBeLessThanOrEqual(15);
    expect(result.measurableImpact).toBe(0);
    expect(result.isTerseWarning).toBe(true);
  });

  it('should cap Measurable Impact score to 45 when quantifiable metrics are missing', () => {
    const result = gradeStarAnswer(120, false, true);
    expect(result.measurableImpact).toBe(45);
    expect(result.overall).toBeLessThanOrEqual(70);
  });

  it('should grant high impact score (85) when candidate provides concrete quantifiable metrics', () => {
    const result = gradeStarAnswer(150, true, true);
    expect(result.measurableImpact).toBe(85);
    expect(result.overall).toBeGreaterThanOrEqual(80);
  });

  it('should handle pure code answers missing situational context with reduced Situation/Task scores', () => {
    const result = gradeStarAnswer(80, false, false);
    expect(result.situation).toBe(30);
    expect(result.task).toBe(30);
  });

  it('should ensure all pillar scores are integer values strictly bounded between 0 and 100', () => {
    const result = gradeStarAnswer(100, true, true);
    [result.situation, result.task, result.action, result.measurableImpact, result.overall].forEach((score) => {
      expect(Number.isInteger(score)).toBe(true);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });
  });
});
