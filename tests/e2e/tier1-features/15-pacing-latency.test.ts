import { describe, it, expect } from 'vitest';

/**
 * Feature 15: Live Vocal Pacing & Latency Gauges
 * Specifications:
 * - WPM formula: wordsPerMinute = (wordCount / (elapsedSeconds / 60))
 * - Pacing brackets:
 *   - Slow: < 110 WPM
 *   - Optimal: 110 – 160 WPM
 *   - Fast: > 160 WPM
 * - Latency gauge: tracks roundtrip AI response initiation (ms)
 * - Color-coded status indicators
 */

type PacingStatus = 'SLOW' | 'OPTIMAL' | 'FAST';

function calculateWpm(wordCount: number, elapsedSeconds: number): number {
  if (elapsedSeconds <= 0 || wordCount <= 0) return 0;
  const minutes = elapsedSeconds / 60;
  return Math.round(wordCount / minutes);
}

function evaluatePacingStatus(wpm: number): PacingStatus {
  if (wpm < 110) return 'SLOW';
  if (wpm <= 160) return 'OPTIMAL';
  return 'FAST';
}

function evaluateLatencyBracket(latencyMs: number): 'EXCELLENT' | 'GOOD' | 'HIGH' {
  if (latencyMs < 1200) return 'EXCELLENT';
  if (latencyMs <= 2500) return 'GOOD';
  return 'HIGH';
}

describe('Feature 15: Live Vocal Pacing & Latency Gauges', () => {
  it('should calculate words per minute accurately according to the contract formula', () => {
    // 130 words in 60 seconds = 130 WPM
    expect(calculateWpm(130, 60)).toBe(130);
    // 70 words in 30 seconds = 140 WPM
    expect(calculateWpm(70, 30)).toBe(140);
  });

  it('should classify pacing into Slow (<110), Optimal (110-160), and Fast (>160)', () => {
    expect(evaluatePacingStatus(95)).toBe('SLOW');
    expect(evaluatePacingStatus(110)).toBe('OPTIMAL');
    expect(evaluatePacingStatus(145)).toBe('OPTIMAL');
    expect(evaluatePacingStatus(160)).toBe('OPTIMAL');
    expect(evaluatePacingStatus(175)).toBe('FAST');
  });

  it('should handle zero words or zero elapsed time gracefully without division by zero', () => {
    expect(calculateWpm(0, 30)).toBe(0);
    expect(calculateWpm(50, 0)).toBe(0);
    expect(evaluatePacingStatus(0)).toBe('SLOW');
  });

  it('should evaluate AI response latency brackets correctly', () => {
    expect(evaluateLatencyBracket(850)).toBe('EXCELLENT');
    expect(evaluateLatencyBracket(1600)).toBe('GOOD');
    expect(evaluateLatencyBracket(3200)).toBe('HIGH');
  });

  it('should provide appropriate semantic color classes for pacing statuses', () => {
    const getPacingColor = (status: PacingStatus) => {
      switch (status) {
        case 'OPTIMAL':
          return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
        case 'SLOW':
          return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
        case 'FAST':
          return 'text-solar-orange-400 border-solar-orange-500/30 bg-solar-orange-500/10';
      }
    };

    expect(getPacingColor('OPTIMAL')).toContain('text-emerald-400');
    expect(getPacingColor('SLOW')).toContain('text-amber-400');
    expect(getPacingColor('FAST')).toContain('text-solar-orange-400');
  });
});
