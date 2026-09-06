import { vi, describe, it, expect, beforeEach } from 'vitest';
import { analysisService } from '../analysis.service.js';
import { prisma } from '../../lib/prisma.js';

// Setup Mock for Prisma Client
vi.mock('../../lib/prisma.js', () => {
  const mockFindUnique = vi.fn();
  const mockUpsert = vi.fn((args) => Promise.resolve(args.create));

  return {
    prisma: {
      interviewSession: {
        findUnique: mockFindUnique,
      },
      analysis: {
        upsert: mockUpsert,
      },
    },
    default: {
      interviewSession: {
        findUnique: mockFindUnique,
      },
      analysis: {
        upsert: mockUpsert,
      },
    },
  };
});

describe('compileHolisticSessionAnalysis Scoring Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 1. Assert high-quality answers but multiple tab blurs (>5) receives elite technical but penalized confidence
  it('Scenario 1: Should calculate elite technical score but penalized, low confidence score with multiple tab blurs (>5)', async () => {
    const mockFindUnique = prisma.interviewSession.findUnique as any;

    const mockQuestions = [
      { id: 'q1', answerText: 'Production-grade microservice architectural implementation.', evalScore: 90, evalStrengths: ['High depth'], evalWeaknesses: [] },
      { id: 'q2', answerText: 'STAR responses with strong technical capability and trade-offs.', evalScore: 90, evalStrengths: ['Great trade-off detail'], evalWeaknesses: [] },
    ];

    mockFindUnique.mockResolvedValueOnce({
      id: 'session-elite-tech-high-blurs',
      targetRole: 'Principal Cloud Architect',
      questions: mockQuestions,
    });

    const analysis = await analysisService.compileHolisticSessionAnalysis(
      'session-elite-tech-high-blurs',
      undefined,
      {
        eyeContactScore: 80, // eye contact deduction = Math.max(0, Math.round((80-80)/10)*5) = 0
        presenceScore: 90,
        tabBlurCount: 6, // >5 blurs
      }
    );

    // Technical score is pure average: (90 + 90) / 2 = 90
    expect(analysis.technicalScore).toBe(90);
    // Confidence score is 100 - (6 * 10) - 0 = 40 (low/penalized)
    expect(analysis.confidenceScore).toBe(40);
  });

  // 2. Verify speech rates outside the optimal window calculate correct point deductions on the Communication track
  it('Scenario 2: Should calculate correct point deductions for speech rates outside optimal pace (110-160 WPM)', async () => {
    const mockFindUnique = prisma.interviewSession.findUnique as any;

    const mockQuestions = [
      { id: 'q1', answerText: 'Perfect technical system design description.', evalScore: 80, evalStrengths: [], evalWeaknesses: [] },
    ];

    // High Speech Pace WPM = 200 (Out-of-bounds >160 WPM)
    // Deduction: (200 - 160) * 0.5 = 20 points
    mockFindUnique.mockResolvedValueOnce({
      id: 'session-high-wpm',
      targetRole: 'Software Engineer',
      questions: mockQuestions,
    });

    const analysisHigh = await analysisService.compileHolisticSessionAnalysis('session-high-wpm', {
      score: 80,
      signals: { avgWpm: 200, avgPauseCount: 2, avgAnswerLength: 40 }
    });

    expect(analysisHigh.communicationScore).toBe(80); // 100 - 20 = 80

    // Low Speech Pace WPM = 70 (Out-of-bounds <110 WPM)
    // Deduction: (110 - 70) * 0.5 = 20 points
    mockFindUnique.mockResolvedValueOnce({
      id: 'session-low-wpm',
      targetRole: 'Software Engineer',
      questions: mockQuestions,
    });

    const analysisLow = await analysisService.compileHolisticSessionAnalysis('session-low-wpm', {
      score: 80,
      signals: { avgWpm: 70, avgPauseCount: 3, avgAnswerLength: 40 }
    });

    expect(analysisLow.communicationScore).toBe(80); // 100 - 20 = 80
  });

  // 3. Validate that a session with textbook-average question scores returns an overall session average tightly restricted to the target 40-60 score window

  it('Scenario 3 (Accurate): Should verify textbook-average calculations result in overall score tightly within the 40-60 window', async () => {
    const mockFindUnique = prisma.interviewSession.findUnique as any;

    // 10 filler words: like, like, like, like, like, like, like, like, like, like
    const mockQuestions = [
      { id: 'q1', answerText: 'like like like like like like like like like like.', evalScore: 50, evalStrengths: [], evalWeaknesses: [] }
    ];

    mockFindUnique.mockResolvedValueOnce({
      id: 'session-avg-score-validated',
      targetRole: 'Junior Architect',
      questions: mockQuestions,
    });

    const analysis = await analysisService.compileHolisticSessionAnalysis(
      'session-avg-score-validated',
      {
        score: 50,
        signals: { avgWpm: 50, avgPauseCount: 5, avgAnswerLength: 20 } // avgWpm 50 gives 30 deduction
      },
      {
        eyeContactScore: 80,
        presenceScore: 50,
        tabBlurCount: 5, // gives 50 deduction
      }
    );

    // technicalScore = 50
    // communicationScore = 100 - (110 - 50)*0.5 - (10 * 2) = 100 - 30 - 20 = 50
    // confidenceScore = 100 - 5 * 10 - 0 = 50
    // overallScore = (50 + 50 + 50) / 3 = 50
    expect(analysis.technicalScore).toBe(50);
    expect(analysis.communicationScore).toBe(50);
    expect(analysis.confidenceScore).toBe(50);
    expect(analysis.overallScore).toBe(50);
    expect(analysis.overallScore).toBeGreaterThanOrEqual(40);
    expect(analysis.overallScore).toBeLessThanOrEqual(60);
  });

  // 4. Ensure the system properly maps boundary edge-case score aggregates to their exact corresponding terminal readiness enums

  it('Scenario 4 (Execution): Should properly map overallScore aggregates to terminal readiness verdicts', async () => {
    const mockFindUnique = prisma.interviewSession.findUnique as any;

    // Helper to calculate parameters for a target overall score
    const runVerdictTest = async (targetScore: number, expectedVerdict: string) => {
      let tabBlurs = 0;
      let eyeScore = 80;
      let wpm = 130;
      let fillers = '';

      if (targetScore === 44) {
        tabBlurs = 5; // deduction 50 -> conf = 50
        eyeScore = 80; // deduction 0
        wpm = 10; // deduction 50 -> comm = 50
        // overall = 0.4*35 + 0.3*50 + 0.3*50 = 14 + 15 + 15 = 44
      } else if (targetScore === 45) {
        tabBlurs = 5; // deduction 50
        eyeScore = 70; // deduction 5 -> total 55 -> conf = 45
        wpm = 0; // deduction 55 -> comm = 45
        // overall = 0.4*45 + 0.3*45 + 0.3*45 = 18 + 13.5 + 13.5 = 45
      } else if (targetScore === 65) {
        tabBlurs = 2; // deduction 20
        eyeScore = 70; // deduction 5 -> total 25 -> conf = 75
        wpm = 60; // deduction 25 -> comm = 75
        // overall = 0.4*50 + 0.3*75 + 0.3*75 = 20 + 22.5 + 22.5 = 65
      } else if (targetScore === 66) {
        tabBlurs = 3; // deduction 30 -> conf = 70
        eyeScore = 80; // deduction 0
        wpm = 50; // deduction 30 -> comm = 70
        // overall = 0.4*60 + 0.3*70 + 0.3*70 = 24 + 21 + 21 = 66
      } else if (targetScore === 84) {
        tabBlurs = 1; // deduction 10 -> conf = 90
        eyeScore = 80; // deduction 0
        wpm = 50; // deduction 30 -> comm = 70
        // overall = 0.4*90 + 0.3*70 + 0.3*90 = 36 + 21 + 27 = 84
      } else if (targetScore === 85) {
        tabBlurs = 1; // deduction 10 -> conf = 90
        eyeScore = 80; // deduction 0
        wpm = 70; // deduction 20 -> comm = 80
        // overall = 0.4*85 + 0.3*80 + 0.3*90 = 34 + 24 + 27 = 85
      }

      const evalScore = targetScore === 44 ? 35 : targetScore === 45 ? 45 : targetScore === 65 ? 50 : targetScore === 66 ? 60 : targetScore === 84 ? 90 : 85;

      mockFindUnique.mockResolvedValueOnce({
        id: `session-verdict-${targetScore}`,
        targetRole: 'Mock Engineer',
        questions: [{ id: 'q1', answerText: fillers || 'Standard answer.', evalScore, evalStrengths: [], evalWeaknesses: [] }],
      });

      const analysis = await analysisService.compileHolisticSessionAnalysis(
        `session-verdict-${targetScore}`,
        {
          score: 80,
          signals: { avgWpm: wpm, avgPauseCount: 0, avgAnswerLength: 10 }
        },
        {
          eyeContactScore: eyeScore,
          presenceScore: 80,
          tabBlurCount: tabBlurs,
        }
      );

      expect(analysis.overallScore).toBe(targetScore);
      expect(analysis.readinessVerdict).toBe(expectedVerdict);
    };

    await runVerdictTest(44, 'NOT_READY');
    await runVerdictTest(45, 'ALMOST_READY');
    await runVerdictTest(65, 'ALMOST_READY');
    await runVerdictTest(66, 'READY');
    await runVerdictTest(84, 'READY');
    await runVerdictTest(85, 'STRONG');
  });
});
