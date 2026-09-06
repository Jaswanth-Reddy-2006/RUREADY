import { vi, describe, it, expect, beforeEach } from 'vitest';
import { analysisService } from '../analysis.service.js';
import { prisma } from '../../lib/prisma.js';

// Setup Mock for Prisma Client
vi.mock('../../lib/prisma.js', () => {
  const mockFindUnique = vi.fn();
  const mockUpsert = vi.fn((args) => Promise.resolve(args.create));
  const mockFindFirst = vi.fn(() => Promise.resolve(null));

  return {
    prisma: {
      interviewSession: {
        findUnique: mockFindUnique,
      },
      analysis: {
        upsert: mockUpsert,
      },
      preDefinedProblem: {
        findFirst: mockFindFirst,
      },
    },
    default: {
      interviewSession: {
        findUnique: mockFindUnique,
      },
      analysis: {
        upsert: mockUpsert,
      },
      preDefinedProblem: {
        findFirst: mockFindFirst,
      },
    },
  };
});

describe('compileCodingSessionAnalysis Secure Telemetry Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 1. Assert hint penalties: solved optimally (95 score) but consumed 3 hints -> heavily penalized
  it('Scenario 1: Should apply heavy hint deductions (15 pts per hint) to solved coding problem', async () => {
    const mockFindUnique = prisma.interviewSession.findUnique as any;

    const mockQuestions = [
      { id: 'q1', answerText: 'Optimal explanation.', evalScore: 95, evalStrengths: [], evalWeaknesses: [] },
    ];

    mockFindUnique.mockResolvedValue({
      id: 'session-optimal-dsa-hints',
      targetRole: 'Senior Staff Engineer',
      mode: 'CODING',
      hintCount: 3, // 3 hints = 45 points deduction
      questions: mockQuestions,
    });

    const analysis = await analysisService.compileHolisticSessionAnalysis(
      'session-optimal-dsa-hints',
      {
        score: 95,
        signals: { avgWpm: 125, avgPauseCount: 1, avgAnswerLength: 100 }
      },
      {
        eyeContactScore: 90,
        presenceScore: 100,
        tabBlurCount: 0,
      }
    );

    // Code Correctness is 95. Cadence Score is 100 - 3 * 15 = 55.
    // overallScore = Math.round(95 * 0.40 + 90 * 0.30 + 55 * 0.15 + 100 * 0.15) = 88.
    expect(analysis.technicalScore).toBe(95);
    expect(analysis.overallScore).toBe(88);
    expect(analysis.readinessVerdict).toBe('STRONG');
  });

  // 2. Verify platform integrity locks warning if tab shifts > 4
  it('Scenario 2: Should change platform integrity flag to SUSPICIOUS_ACTIVITY when tab blurs exceed 4', async () => {
    const mockFindUnique = prisma.interviewSession.findUnique as any;

    const mockQuestions = [
      { id: 'q1', answerText: 'Code progress snapshot.', evalScore: 85, evalStrengths: [], evalWeaknesses: [] },
    ];

    mockFindUnique.mockResolvedValue({
      id: 'session-cheating-blurs',
      targetRole: 'Frontend Engineer',
      mode: 'CODING',
      hintCount: 0,
      questions: mockQuestions,
    });

    const analysis = await analysisService.compileHolisticSessionAnalysis(
      'session-cheating-blurs',
      {
        score: 85,
        signals: { avgWpm: 120, avgPauseCount: 2, avgAnswerLength: 80 }
      },
      {
        eyeContactScore: 80,
        presenceScore: 25,
        tabBlurCount: 5, // > 4 blurs
      }
    );

    // Platform integrity flag must be forced to COMPROMISED
    expect((analysis as any).platformIntegrity).toBe('COMPROMISED');
    expect((analysis.confidenceSignals as any).platformIntegrity).toBe('COMPROMISED');
  });

  // 3. Assert optimal space/time complexity bounds triggers STRONG tier badge
  it('Scenario 3: Should commit STRONG or READY readinessVerdict when user hits optimal complexity parameters (high scores)', async () => {
    const mockFindUnique = prisma.interviewSession.findUnique as any;

    const mockQuestions = [
      { id: 'q1', answerText: 'Optimal solutions with O(1) space constraints and zero hints.', evalScore: 90, evalStrengths: [], evalWeaknesses: [] },
    ];

    mockFindUnique.mockResolvedValue({
      id: 'session-high-performance-optimal',
      targetRole: 'Systems Architect',
      mode: 'CODING',
      hintCount: 0, // 0 hints consumed
      questions: mockQuestions,
    });

    const analysis = await analysisService.compileHolisticSessionAnalysis(
      'session-high-performance-optimal',
      {
        score: 90,
        signals: { avgWpm: 130, avgPauseCount: 1, avgAnswerLength: 120 }
      },
      {
        eyeContactScore: 95,
        presenceScore: 100,
        tabBlurCount: 0,
      }
    );

    // High technical score (>= 80) must result in STRONG readiness verdict tier
    expect(analysis.technicalScore).toBe(90);
    expect(analysis.readinessVerdict).toBe('STRONG');
    expect((analysis as any).platformIntegrity).toBe('SECURED');
  });
});
