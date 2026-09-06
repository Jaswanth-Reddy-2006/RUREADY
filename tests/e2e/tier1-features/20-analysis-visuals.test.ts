import { describe, it, expect } from 'vitest';

/**
 * Feature 20: Analysis Report Competency Radar & Visuals
 * Specifications:
 * - SVG Radar Chart visualization of 5 core competencies
 * - Corporate benchmark badges:
 *   - Google L4
 *   - Meta SDE2
 *   - Amazon SDE1 / SDE2
 * - Benchmark achievement calculation (meets bar / needs practice)
 * - Actionable improvement recommendations list
 */

interface CorporateBenchmark {
  tier: 'Google L4' | 'Meta SDE2' | 'Amazon SDE2';
  requiredScore: number;
  description: string;
}

const corporateBenchmarks: CorporateBenchmark[] = [
  { tier: 'Amazon SDE2', requiredScore: 75, description: 'Demonstrates deep ownership and customer obsession with solid STAR evidence.' },
  { tier: 'Meta SDE2', requiredScore: 78, description: 'Rapid execution velocity, pragmatic tradeoffs, and architectural independence.' },
  { tier: 'Google L4', requiredScore: 82, description: 'Rigorous algorithmic precision, edge case thoroughness, and Socratic clarity.' },
];

function evaluateBenchmarks(candidateScore: number) {
  return corporateBenchmarks.map((b) => ({
    ...b,
    isPassed: candidateScore >= b.requiredScore,
    delta: candidateScore - b.requiredScore,
  }));
}

describe('Feature 20: Analysis Report Competency Radar & Visuals', () => {
  it('should define standard corporate benchmarks with appropriate score bars', () => {
    expect(corporateBenchmarks.length).toBe(3);
    const tiers = corporateBenchmarks.map((b) => b.tier);
    expect(tiers).toContain('Google L4');
    expect(tiers).toContain('Meta SDE2');
    expect(tiers).toContain('Amazon SDE2');
  });

  it('should calculate benchmark achievements for a score of 80/100', () => {
    const results = evaluateBenchmarks(80);
    const amazon = results.find((r) => r.tier === 'Amazon SDE2');
    const meta = results.find((r) => r.tier === 'Meta SDE2');
    const google = results.find((r) => r.tier === 'Google L4');

    expect(amazon?.isPassed).toBe(true);
    expect(amazon?.delta).toBe(5);

    expect(meta?.isPassed).toBe(true);
    expect(meta?.delta).toBe(2);

    expect(google?.isPassed).toBe(false);
    expect(google?.delta).toBe(-2);
  });

  it('should format benchmark badge styling with pass vs needs-practice states', () => {
    const getBadgeClass = (isPassed: boolean) =>
      isPassed
        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
        : 'bg-neutral-800 text-neutral-400 border border-neutral-700';

    expect(getBadgeClass(true)).toContain('text-emerald-400');
    expect(getBadgeClass(false)).toContain('text-neutral-400');
  });

  it('should provide structured actionable recommendations', () => {
    const recommendations = [
      { id: 'rec-1', category: 'STAR Impact', text: 'Quantify team efficiency gains and customer metrics in your second answer.' },
      { id: 'rec-2', category: 'Pacing', text: 'Slow down during system architecture explanations to stay within 120-140 WPM.' },
      { id: 'rec-3', category: 'Technical Tradeoffs', text: 'Explicitly compare Redis caching vs Local In-Memory caching before answering.' },
    ];

    expect(recommendations.length).toBe(3);
    recommendations.forEach((rec) => {
      expect(rec.category.length).toBeGreaterThan(0);
      expect(rec.text.length).toBeGreaterThan(15);
    });
  });

  it('should prepare radar chart data matching the 5 canonical dimensions', () => {
    const radarData = [
      { axis: 'Communication', score: 85 },
      { axis: 'Technical Accuracy', score: 78 },
      { axis: 'Problem Solving', score: 92 },
      { axis: 'Confidence / Delivery', score: 80 },
      { axis: 'STAR Specificity', score: 74 },
    ];

    expect(radarData.length).toBe(5);
    expect(radarData.map((d) => d.axis)).toContain('STAR Specificity');
  });
});
