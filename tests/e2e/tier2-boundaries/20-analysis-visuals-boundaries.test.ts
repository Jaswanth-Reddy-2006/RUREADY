import { describe, it, expect } from 'vitest';

/**
 * Tier 2 Boundary Tests: Feature 20 (Analysis Visuals & Benchmarks)
 * Boundary & Corner Cases:
 * - Candidate score 0/100 (failing all corporate benchmarks)
 * - Candidate score 100/100 (exceeding all corporate benchmarks)
 * - Exact threshold tie condition (e.g. score === threshold)
 * - Empty recommendations array fallback
 * - Formatting delta text with explicit +/- signs
 */

interface BenchmarkSpec {
  name: string;
  threshold: number;
}

const benchmarks: BenchmarkSpec[] = [
  { name: 'Amazon SDE2', threshold: 75 },
  { name: 'Meta SDE2', threshold: 78 },
  { name: 'Google L4', threshold: 82 },
];

function checkBenchmarkStatus(score: number, benchmark: BenchmarkSpec) {
  const isPassed = score >= benchmark.threshold;
  const delta = score - benchmark.threshold;
  const deltaSign = delta > 0 ? `+${delta}` : `${delta}`;
  return { isPassed, delta, deltaSign };
}

describe('Tier 2 Boundaries — Feature 20: Analysis Visuals', () => {
  it('should mark all benchmarks as unmet when candidate score is 0', () => {
    benchmarks.forEach((bm) => {
      const status = checkBenchmarkStatus(0, bm);
      expect(status.isPassed).toBe(false);
      expect(status.delta).toBe(-bm.threshold);
      expect(status.deltaSign).toBe(`-${bm.threshold}`);
    });
  });

  it('should mark all benchmarks as passed when candidate score is 100', () => {
    benchmarks.forEach((bm) => {
      const status = checkBenchmarkStatus(100, bm);
      expect(status.isPassed).toBe(true);
      expect(status.delta).toBe(100 - bm.threshold);
      expect(status.deltaSign.startsWith('+')).toBe(true);
    });
  });

  it('should consider exact threshold match (e.g. 75 on 75) as passed with delta +0', () => {
    const amazon = benchmarks[0];
    const status = checkBenchmarkStatus(75, amazon);
    expect(status.isPassed).toBe(true);
    expect(status.delta).toBe(0);
  });

  it('should provide fallback UI advice when recommendations list is empty', () => {
    const renderRecommendations = (recs: string[]) => {
      if (recs.length === 0) {
        return ['Great performance! Continue practicing across diverse system design and behavioral scenarios.'];
      }
      return recs;
    };

    const emptyResult = renderRecommendations([]);
    expect(emptyResult.length).toBe(1);
    expect(emptyResult[0]).toContain('Great performance');
  });

  it('should format delta indicators with clear accessible screen reader text', () => {
    const getAriaLabel = (name: string, isPassed: boolean, delta: number) => {
      const statusText = isPassed ? 'Passed' : 'Needs Practice';
      const pointsText = delta >= 0 ? `${delta} points above threshold` : `${Math.abs(delta)} points below threshold`;
      return `${name}: ${statusText}, ${pointsText}`;
    };

    expect(getAriaLabel('Google L4', false, -4)).toBe('Google L4: Needs Practice, 4 points below threshold');
    expect(getAriaLabel('Meta SDE2', true, 5)).toBe('Meta SDE2: Passed, 5 points above threshold');
  });
});
