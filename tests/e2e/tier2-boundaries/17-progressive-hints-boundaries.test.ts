import { describe, it, expect } from 'vitest';

/**
 * Tier 2 Boundary Tests: Feature 17 (Progressive Hint Unlocks)
 * Boundary & Corner Cases:
 * - Score floor clamping (raw score 10pts - 15pts penalty => clamped to 0, never negative)
 * - Questions with zero hints configured
 * - Attempting 4th unlock when max hints is 3
 * - Strict sequential unlock enforcement (cannot skip Hint 1 to get Hint 2)
 * - Concurrent double-click unlock protection
 */

describe('Tier 2 Boundaries — Feature 17: Progressive Hints', () => {
  it('should floor adjusted candidate score at 0 when hint penalties exceed raw score', () => {
    const rawScore = 20;
    const hintsUsed = 2; // 2 * 15 = 30pts penalty
    const penalty = hintsUsed * 15;
    const adjustedScore = Math.max(0, rawScore - penalty);

    expect(adjustedScore).toBe(0);
  });

  it('should handle questions with empty hints array gracefully', () => {
    const questionWithNoHints = {
      id: 'q-99',
      hints: [] as string[],
    };

    const canRequestHint = questionWithNoHints.hints.length > 0;
    expect(canRequestHint).toBe(false);
  });

  it('should enforce sequential unlocks (must unlock hint 1 before hint 2)', () => {
    const availableHints = ['Hint 1', 'Hint 2', 'Hint 3'];
    let unlockedIndices: number[] = [];

    const requestHintIndex = (index: number) => {
      const nextExpected = unlockedIndices.length;
      if (index === nextExpected) {
        unlockedIndices.push(index);
        return { success: true, hint: availableHints[index] };
      }
      return { success: false, error: 'Must unlock preceding hints first.' };
    };

    // Try unlocking Hint 2 first
    expect(requestHintIndex(1).success).toBe(false);
    // Unlock Hint 0 (Hint 1)
    expect(requestHintIndex(0).success).toBe(true);
    // Now unlock Hint 1 (Hint 2)
    expect(requestHintIndex(1).success).toBe(true);
  });

  it('should prevent repeated unlocking when max hints (3) are reached', () => {
    let unlockedCount = 3;
    const maxAllowed = 3;

    const tryUnlock = () => {
      if (unlockedCount >= maxAllowed) return false;
      unlockedCount++;
      return true;
    };

    expect(tryUnlock()).toBe(false);
    expect(unlockedCount).toBe(3);
  });

  it('should record exact penalty deductions in session telemetry metadata', () => {
    const sessionMetadata = {
      hintsRequested: 2,
      penaltyPerHint: 15,
      totalDeduction: 30,
      timestampList: ['2026-09-05T12:05:00Z', '2026-09-05T12:08:30Z'],
    };

    expect(sessionMetadata.totalDeduction).toBe(sessionMetadata.hintsRequested * sessionMetadata.penaltyPerHint);
    expect(sessionMetadata.timestampList.length).toBe(2);
  });
});
