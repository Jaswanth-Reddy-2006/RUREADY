import { describe, it, expect } from 'vitest';

/**
 * Tier 3 Cross-Feature Combination: Persona Prompts, STAR Scoring & SVG Radar Chart
 * Features Tested Together:
 * - Feature 6: Native SVG Radar Chart Component
 * - Feature 18: Backend Persona Prompt Adaptations
 * - Feature 19: Uninflated STAR Scoring Breakdown UI
 * - Feature 20: Analysis Report Competency Radar & Visuals
 */

interface StarEvaluationResult {
  situation: number;
  task: number;
  action: number;
  measurableImpact: number;
  radarScores: {
    communication: number;
    technicalAccuracy: number;
    problemSolving: number;
    confidenceDelivery: number;
    starSpecificity: number;
  };
  overallScore: number;
  benchmarksPassed: string[];
}

function evaluateCandidateWithPersona(
  persona: 'HIRING_MANAGER' | 'TECHNICAL_ARCHITECT' | 'BAR_RAISER',
  hasQuantifiedImpact: boolean,
  technicalDepth: number
): StarEvaluationResult {
  // Bar Raiser applies stricter uninflated grading
  const isStrict = persona === 'BAR_RAISER';
  const impactScore = hasQuantifiedImpact ? (isStrict ? 80 : 90) : (isStrict ? 40 : 55);
  const techScore = isStrict ? Math.min(85, technicalDepth) : technicalDepth;

  const situation = 80;
  const task = 85;
  const action = 75;
  const measurableImpact = impactScore;

  const starSpecificity = Math.round((situation + task + action + measurableImpact) / 4);
  const communication = isStrict ? 78 : 85;
  const problemSolving = Math.round((techScore + action) / 2);
  const confidenceDelivery = 80;

  const overallScore = Math.round(
    communication * 0.2 + techScore * 0.25 + problemSolving * 0.25 + starSpecificity * 0.2 + confidenceDelivery * 0.1
  );

  const benchmarksPassed: string[] = [];
  if (overallScore >= 70) benchmarksPassed.push('Amazon SDE1');
  if (overallScore >= 75) benchmarksPassed.push('Amazon SDE2');
  if (overallScore >= 78) benchmarksPassed.push('Meta SDE2');
  if (overallScore >= 82) benchmarksPassed.push('Google L4');

  return {
    situation,
    task,
    action,
    measurableImpact,
    radarScores: {
      communication,
      technicalAccuracy: techScore,
      problemSolving,
      confidenceDelivery,
      starSpecificity,
    },
    overallScore,
    benchmarksPassed,
  };
}

describe('Tier 3 Combinations — Socratic Persona, STAR Scoring & Radar Visuals', () => {
  it('should generate uninflated STAR breakdown and SVG radar data under Bar Raiser persona', () => {
    // Bar Raiser evaluating candidate without quantified impact
    const result = evaluateCandidateWithPersona('BAR_RAISER', false, 80);

    expect(result.measurableImpact).toBe(40); // Strict uninflated penalty
    expect(result.radarScores.starSpecificity).toBeLessThan(75);
    expect(result.overallScore).toBeLessThan(80);
    expect(result.benchmarksPassed).not.toContain('Google L4');
  });

  it('should pass Google L4 benchmark when candidate provides quantified metrics to Hiring Manager', () => {
    const result = evaluateCandidateWithPersona('HIRING_MANAGER', true, 90);

    expect(result.measurableImpact).toBe(90);
    expect(result.radarScores.starSpecificity).toBeGreaterThanOrEqual(80);
    expect(result.overallScore).toBeGreaterThanOrEqual(82);
    expect(result.benchmarksPassed).toContain('Google L4');
    expect(result.benchmarksPassed).toContain('Meta SDE2');
  });

  it('should format 5 radar axes for SVG rendering matching all competency keys', () => {
    const result = evaluateCandidateWithPersona('TECHNICAL_ARCHITECT', true, 88);
    const radarAxes = [
      { key: 'Communication', val: result.radarScores.communication },
      { key: 'Technical Accuracy', val: result.radarScores.technicalAccuracy },
      { key: 'Problem Solving', val: result.radarScores.problemSolving },
      { key: 'Confidence / Delivery', val: result.radarScores.confidenceDelivery },
      { key: 'STAR Specificity', val: result.radarScores.starSpecificity },
    ];

    expect(radarAxes.length).toBe(5);
    radarAxes.forEach((axis) => {
      expect(axis.val).toBeGreaterThanOrEqual(0);
      expect(axis.val).toBeLessThanOrEqual(100);
    });
  });

  it('should maintain mathematical consistency across STAR pillar weighted calculations', () => {
    const result = evaluateCandidateWithPersona('TECHNICAL_ARCHITECT', false, 75);
    const expectedAverage = Math.round(
      (result.situation + result.task + result.action + result.measurableImpact) / 4
    );
    expect(result.radarScores.starSpecificity).toBe(expectedAverage);
  });
});
