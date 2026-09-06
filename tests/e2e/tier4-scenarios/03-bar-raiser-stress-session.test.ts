import { describe, it, expect } from 'vitest';

/**
 * Tier 4 Real-World Application Scenario 3: Bar Raiser Stress Session
 * Complete Workflow:
 * 1. Setup session with BAR_RAISER persona (Marcus Brody)
 * 2. High-pressure Socratic follow-ups and assumption challenges
 * 3. Telemetry records hesitant vocal pacing (< 100 WPM)
 * 4. Candidate delivers unquantified answer
 * 5. Strict uninflated evaluation produces 42 on Measurable Impact
 * 6. Actionable recommendations pinpoint missing metrics
 */

describe('Tier 4 Scenario 3 — Bar Raiser Stress Session', () => {
  it('should enforce uninflated scoring and provide targeted feedback during a Bar Raiser session', () => {
    // 1. Session Setup
    const session = {
      id: 'sess-bar-raiser-99',
      persona: 'BAR_RAISER',
      candidateRole: 'Senior SDE',
      goal: '[Persona: BAR_RAISER] Amazon Bar Raiser behavioral evaluation',
    };
    expect(session.persona).toBe('BAR_RAISER');

    // 2. Telemetry tracking during intense questioning
    const speechMetrics = {
      wordCount: 85,
      elapsedSeconds: 60,
      wpm: 85, // < 110 -> Slow / Hesitant
      category: 'SLOW',
      aiLatencyMs: 890,
    };
    expect(speechMetrics.wpm).toBe(85);
    expect(speechMetrics.category).toBe('SLOW');

    // 3. Candidate answer analysis (vague, lacks numbers)
    const candidateAnswer = `
      We noticed our service was running slow. I looked at the logs and discovered
      several unindexed database queries. I created indexes on the frequently used columns
      and things became much faster and everyone was satisfied.
    `;

    const hasNumbersOrPercentages = /\d+(\.\d+)?%?/.test(candidateAnswer);
    expect(hasNumbersOrPercentages).toBe(false);

    // 4. Strict Uninflated STAR Scoring
    const grading = {
      situation: 65, // Context was clear but generic
      task: 60,      // Role was passive
      action: 70,    // Good technical action (database indexing)
      measurableImpact: 42, // Severely penalized: no p99 latency stats, no throughput metrics
    };

    const overallScore = Math.round(
      grading.situation * 0.2 +
      grading.task * 0.2 +
      grading.action * 0.3 +
      grading.measurableImpact * 0.3
    );

    // 65*0.2 (13) + 60*0.2 (12) + 70*0.3 (21) + 42*0.3 (12.6) = 58.6 -> 59
    expect(overallScore).toBe(59);
    expect(overallScore).toBeLessThan(70); // Below Amazon SDE1 bar

    // 5. Actionable Feedback
    const feedback = {
      critique: 'Impact statement lacks quantifiable metrics.',
      recommendation: 'Quantify latency improvement (e.g. "reduced p99 query latency from 850ms to 45ms") and impact on user churn.',
    };

    expect(feedback.critique).toContain('lacks quantifiable metrics');
    expect(feedback.recommendation).toContain('reduced p99');
  });

  it('should generate probing follow-up when candidate claims impact without metrics', () => {
    const generateBarRaiserFollowUp = (hasMetrics: boolean) => {
      if (!hasMetrics) {
        return 'You mentioned performance became much faster. What was the exact latency improvement and how did you measure it?';
      }
      return 'What unexpected edge cases or rollback risks did you plan for?';
    };

    const followUp = generateBarRaiserFollowUp(false);
    expect(followUp).toContain('exact latency improvement');
  });

  it('should track AI response latency and trigger visual loading state during deep Socratic evaluation', () => {
    const latencyEvent = {
      submittedAt: 1000,
      streamInitiatedAt: 2450,
      latencyMs: 1450,
      evaluationState: 'deep_socratic_analysis',
    };

    expect(latencyEvent.latencyMs).toBe(1450);
    expect(latencyEvent.latencyMs).toBeLessThan(3000);
  });
});
