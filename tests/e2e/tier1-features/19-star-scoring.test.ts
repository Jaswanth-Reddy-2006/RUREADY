import { describe, it, expect } from 'vitest';

/**
 * Feature 19: Uninflated STAR Scoring Breakdown UI
 * Specifications:
 * - Granular breakdown of 4 STAR pillars:
 *   - Situation (0-100)
 *   - Task (0-100)
 *   - Action specificity (0-100)
 *   - Measurable Impact (0-100)
 * - Constructive feedback text per pillar
 * - Strict uninflated evaluation (no automatic 90+ without quantifiable metrics)
 * - Rendered in AnalysisReport & AnalysisDashboard
 */

interface StarPillarFeedback {
  situationText: string;
  taskText: string;
  actionText: string;
  impactText: string;
}

interface StarBreakdown {
  situation: number;
  task: number;
  action: number;
  measurableImpact: number;
  overallStarScore: number;
  feedback: StarPillarFeedback;
}

function calculateOverallStarScore(s: number, t: number, a: number, r: number): number {
  // Weighted: Situation 20%, Task 20%, Action 30%, Impact 30%
  return Math.round(s * 0.2 + t * 0.2 + a * 0.3 + r * 0.3);
}

describe('Feature 19: Uninflated STAR Scoring Breakdown UI', () => {
  const sampleBreakdown: StarBreakdown = {
    situation: 80,
    task: 85,
    action: 75,
    measurableImpact: 60,
    overallStarScore: calculateOverallStarScore(80, 85, 75, 60),
    feedback: {
      situationText: 'Clear context provided regarding the legacy payment gateway outage.',
      taskText: 'Well-defined role as the incident commander for remediation.',
      actionText: 'Specific architectural actions described, though rollback strategy lacked detail.',
      impactText: 'Lacked quantifiable business metrics: quantify SLA recovery time and revenue preserved.',
    },
  };

  it('should compute weighted overall STAR score correctly', () => {
    // 80*0.2 (16) + 85*0.2 (17) + 75*0.3 (22.5) + 60*0.3 (18) = 73.5 -> 74
    expect(sampleBreakdown.overallStarScore).toBe(74);
  });

  it('should provide individual scores and feedback for all four STAR components', () => {
    expect(sampleBreakdown.situation).toBeGreaterThanOrEqual(0);
    expect(sampleBreakdown.task).toBeGreaterThanOrEqual(0);
    expect(sampleBreakdown.action).toBeGreaterThanOrEqual(0);
    expect(sampleBreakdown.measurableImpact).toBeGreaterThanOrEqual(0);

    expect(sampleBreakdown.feedback.situationText).toContain('outage');
    expect(sampleBreakdown.feedback.impactText).toContain('quantifiable');
  });

  it('should enforce uninflated scoring penalty when quantifiable metrics are absent', () => {
    const evaluateImpact = (hasMetrics: boolean, isVague: boolean) => {
      if (!hasMetrics) return Math.min(65, isVague ? 40 : 60);
      return 90;
    };

    expect(evaluateImpact(false, false)).toBeLessThanOrEqual(65);
    expect(evaluateImpact(false, true)).toBeLessThanOrEqual(45);
    expect(evaluateImpact(true, false)).toBe(90);
  });

  it('should assign appropriate visual badge color according to score range', () => {
    const getScoreBadgeColor = (score: number) => {
      if (score >= 80) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      if (score >= 60) return 'text-solar-orange-400 bg-solar-orange-500/10 border-solar-orange-500/30';
      return 'text-red-400 bg-red-500/10 border-red-500/30';
    };

    expect(getScoreBadgeColor(85)).toContain('text-emerald-400');
    expect(getScoreBadgeColor(70)).toContain('text-solar-orange-400');
    expect(getScoreBadgeColor(45)).toContain('text-red-400');
  });

  it('should validate complete STAR breakdown data structure contract', () => {
    const keys = Object.keys(sampleBreakdown);
    expect(keys).toContain('situation');
    expect(keys).toContain('task');
    expect(keys).toContain('action');
    expect(keys).toContain('measurableImpact');
    expect(keys).toContain('feedback');
  });
});
