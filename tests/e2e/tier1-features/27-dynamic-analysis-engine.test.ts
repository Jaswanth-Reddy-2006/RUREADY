import { describe, it, expect } from 'vitest';
import { synthesizeSessionAnalysis, getSuggestedStructureForCategory } from '../../../client/src/hooks/useAnalysis';

describe('Dynamic Interview Performance Analysis Engine', () => {
  it('correctly handles early session completion with 0 answers (no fake 30/38/88 scores)', () => {
    const zeroAnswerSession = {
      id: 'session-early-exit-123',
      targetRole: 'Full Stack Engineer',
      targetCompany: 'Google',
      focusAreas: ['System Design', 'React'],
      questions: [
        {
          id: 'q1',
          questionText: 'Describe how you scale a WebSocket notification service.',
          category: 'System Design',
          questionType: 'TECHNICAL',
          difficulty: 'HARD',
          answerText: null,
          timeTakenSecs: null,
          evalScore: null,
        },
      ],
      proctoring: {
        eyeContactScore: 85,
        tabBlurCount: 0,
      },
    };

    const analysis = synthesizeSessionAnalysis(zeroAnswerSession);

    // 1. Core scores must be honestly 0 (never artificially forced to 30 or 38)
    expect(analysis.overallScore).toBe(0);
    expect(analysis.technicalScore).toBe(0);
    expect(analysis.communicationScore).toBe(0);
    expect(analysis.problemSolvingScore).toBe(0);
    expect(analysis.depthScore).toBe(0);
    expect(analysis.relevanceScore).toBe(0);
    expect(analysis.structureScore).toBe(0);
    expect(analysis.readinessVerdict).toBe('NOT_READY');

    // 2. Summary must reflect real data: 0 answered, 1 skipped, 0 duration
    expect(analysis.interviewSummary.totalQuestionsAsked).toBe(1);
    expect(analysis.interviewSummary.questionsAnswered).toBe(0);
    expect(analysis.interviewSummary.questionsSkipped).toBe(1);
    expect(analysis.interviewSummary.averageAnswerLengthMinutes).toBe(0);
    expect(analysis.interviewSummary.longestAnswerMinutes).toBe(0);
    expect(analysis.interviewSummary.shortestAnswerMinutes).toBe(0);

    // 3. Dynamic stage breakdown must NOT contain 4 fake stages
    expect(analysis.stageBreakdown.length).toBe(1);
    expect(analysis.stageBreakdown[0].stageName).toBe('System Design');
    expect(analysis.stageBreakdown[0].score).toBe(0);

    // 4. Recommendations must be present and priority ranked
    expect(analysis.recommendations.length).toBe(3);
    expect(analysis.recommendations[0].priority).toBe(1);
  });

  it('computes authentic dynamic scores for a completed session with answers', () => {
    const answeredSession = {
      id: 'session-full-456',
      targetRole: 'Backend Engineer',
      targetCompany: 'Stripe',
      focusAreas: ['Databases', 'Distributed Systems'],
      questions: [
        {
          id: 'q1',
          questionText: 'Explain PostgreSQL B-tree indexing vs hash indexing and when to choose each.',
          category: 'Databases',
          questionType: 'TECHNICAL',
          difficulty: 'MEDIUM',
          answerText: 'PostgreSQL uses B-tree indexes as the default because they support equality and range queries with O(log N) lookup time. Hash indexes only support equality comparisons and historically had crash recovery drawbacks, though WAL-logging in PostgreSQL 10 made them viable. For range filters and sorted queries, B-tree is preferred.',
          timeTakenSecs: 22,
          evalScore: 88,
          evalStrengths: ['Accurate O(log N) range query comparison', 'Noted PostgreSQL WAL-logging history'],
          evalWeaknesses: ['Could mention write amplification trade-offs on high-throughput inserts'],
        },
        {
          id: 'q2',
          questionText: 'How would you handle cache stampede in a high-traffic microservices architecture?',
          category: 'System Design',
          questionType: 'TECHNICAL',
          difficulty: 'HARD',
          answerText: 'To mitigate cache stampede, I implement probabilistic early expiration like the XFetch algorithm, or mutex locks on key regeneration using Redis distributed locks with a short lease. This ensures only a single thread regenerates the cache while others read the stale value or wait briefly.',
          timeTakenSecs: 18,
          evalScore: 92,
          evalStrengths: ['Mentioned XFetch probabilistic early recomputation', 'Redis distributed lock pattern'],
          evalWeaknesses: ['Could elaborate on fallback when distributed lock fails'],
        },
      ],
      proctoring: {
        eyeContactScore: 88,
        tabBlurCount: 0,
      },
      confidenceMetrics: {
        postureStatus: 'Optimal',
        composureLevel: 'Calm',
      },
    };

    const analysis = synthesizeSessionAnalysis(answeredSession);

    // 1. Technical score must be exactly average of 88 and 92 = 90
    expect(analysis.technicalScore).toBe(90);

    // 2. Communication and Overall score should be dynamic and strong
    expect(analysis.communicationScore).toBeGreaterThanOrEqual(75);
    expect(analysis.overallScore).toBeGreaterThanOrEqual(80);
    expect(analysis.readinessVerdict).toBe('READY');

    // 3. Dynamic Summary Meta
    expect(analysis.interviewSummary.totalQuestionsAsked).toBe(2);
    expect(analysis.interviewSummary.questionsAnswered).toBe(2);
    expect(analysis.interviewSummary.questionsSkipped).toBe(0);
    expect(analysis.interviewSummary.averageAnswerLengthMinutes).toBeCloseTo(0.3, 0.1); // (22 + 18) / 2 / 60 = 0.33 min
    expect(analysis.interviewSummary.longestAnswerMinutes).toBe(0.4); // 22s = 0.37 -> 0.4 min
    expect(analysis.interviewSummary.shortestAnswerMinutes).toBe(0.3); // 18s = 0.3 min

    // 4. Dynamic Stages: must have EXACTLY 2 stages matching the 2 questions (not 4 dummy stages)
    expect(analysis.stageBreakdown.length).toBe(2);
    expect(analysis.stageBreakdown[0].stageName).toBe('Databases');
    expect(analysis.stageBreakdown[0].score).toBe(88);
    expect(analysis.stageBreakdown[1].stageName).toBe('System Design');
    expect(analysis.stageBreakdown[1].score).toBe(92);

    // 5. Strengths & Improvements must incorporate candidate actual evaluation concepts
    expect(analysis.strengths).toContain('Accurate O(log N) range query comparison');
    expect(analysis.strengths).toContain('Mentioned XFetch probabilistic early recomputation');
    expect(analysis.improvements).toContain('Could mention write amplification trade-offs on high-throughput inserts');
  });

  it('generates role-tailored model answer structures without generic defaults', () => {
    const sysDesignStructure = getSuggestedStructureForCategory('System Design');
    expect(sysDesignStructure.some((s) => s.toLowerCase().includes('requirements') || s.toLowerCase().includes('qps'))).toBe(true);
    expect(sysDesignStructure.some((s) => s.toLowerCase().includes('caching') || s.toLowerCase().includes('redis'))).toBe(true);

    const dbStructure = getSuggestedStructureForCategory('Databases');
    expect(dbStructure.some((s) => s.toLowerCase().includes('indexing') || s.toLowerCase().includes('acid'))).toBe(true);

    const dsaStructure = getSuggestedStructureForCategory('Data Structures & Algorithms');
    expect(dsaStructure.some((s) => s.toLowerCase().includes('complexity') || s.toLowerCase().includes('big-o'))).toBe(true);
  });
});
