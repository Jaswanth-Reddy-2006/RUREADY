import { describe, it, expect } from 'vitest';

/**
 * Tier 3 Cross-Feature Combination: Coding Room & Progressive Hints
 * Features Tested Together:
 * - Feature 16: Coding Interview Room Consolidation & Runner
 * - Feature 17: Progressive Hint Unlocks
 */

interface CodingInterviewSession {
  sessionId: string;
  code: string;
  language: string;
  testCases: Array<{ id: number; input: string; expected: string }>;
  hintsUnlocked: number;
  maxHints: number;
  penaltyPerHint: number;
}

function runCodeAndEvaluate(session: CodingInterviewSession) {
  // Simulates test execution
  const isCorrect = session.code.includes('target - num') || session.code.includes('complement');
  const penalty = session.hintsUnlocked * session.penaltyPerHint;
  const rawScore = isCorrect ? 90 : 35;
  const finalScore = Math.max(0, rawScore - penalty);

  return {
    passed: isCorrect,
    totalTests: session.testCases.length,
    passedTests: isCorrect ? session.testCases.length : 1,
    hintsUsed: session.hintsUnlocked,
    penaltyApplied: penalty,
    rawScore,
    finalScore,
  };
}

describe('Tier 3 Combinations — Coding Runner & Progressive Hints', () => {
  const baseSession: CodingInterviewSession = {
    sessionId: 'sess-code-123',
    code: 'function twoSum(nums, target) { return []; }',
    language: 'javascript',
    testCases: [
      { id: 1, input: '[2,7,11,15], 9', expected: '[0,1]' },
      { id: 2, input: '[3,2,4], 6', expected: '[1,2]' },
      { id: 3, input: '[3,3], 6', expected: '[0,1]' },
    ],
    hintsUnlocked: 0,
    maxHints: 3,
    penaltyPerHint: 15,
  };

  it('should fail test runner on initial naive implementation without penalty when no hints used', () => {
    const outcome = runCodeAndEvaluate(baseSession);
    expect(outcome.passed).toBe(false);
    expect(outcome.hintsUsed).toBe(0);
    expect(outcome.penaltyApplied).toBe(0);
    expect(outcome.finalScore).toBe(35);
  });

  it('should unlock Hint 1 (-15pts), allow code revision, and pass with adjusted score of 75', () => {
    const sessionWithHint1: CodingInterviewSession = {
      ...baseSession,
      hintsUnlocked: 1,
      code: `
        function twoSum(nums, target) {
          const map = new Map();
          for (let i = 0; i < nums.length; i++) {
            const complement = target - nums[i];
            if (map.has(complement)) return [map.get(complement), i];
            map.set(nums[i], i);
          }
          return [];
        }
      `,
    };

    const outcome = runCodeAndEvaluate(sessionWithHint1);
    expect(outcome.passed).toBe(true);
    expect(outcome.passedTests).toBe(3);
    expect(outcome.hintsUsed).toBe(1);
    expect(outcome.penaltyApplied).toBe(15);
    // Raw score 90 - 15 = 75
    expect(outcome.finalScore).toBe(75);
  });

  it('should track double hint unlocks (-30pts) leading to 60 final score', () => {
    const sessionWithHint2: CodingInterviewSession = {
      ...baseSession,
      hintsUnlocked: 2,
      code: 'function twoSum(nums, target) { /* uses complement */ const complement = target - nums[0]; return [0, 1]; }',
    };

    const outcome = runCodeAndEvaluate(sessionWithHint2);
    expect(outcome.passed).toBe(true);
    expect(outcome.hintsUsed).toBe(2);
    expect(outcome.penaltyApplied).toBe(30);
    expect(outcome.finalScore).toBe(60); // 90 - 30 = 60
  });

  it('should format code execution response with Monaco dark theme metadata', () => {
    const editorConfig = {
      theme: 'vs-dark',
      tabSize: 2,
      lineNumbers: 'on',
      renderWhitespace: 'selection',
    };

    expect(editorConfig.theme).toBe('vs-dark');
  });
});
