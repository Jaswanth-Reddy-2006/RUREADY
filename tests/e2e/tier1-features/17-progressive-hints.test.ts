import { describe, it, expect } from 'vitest';

/**
 * Feature 17: Progressive Hint Unlocks
 * Specifications:
 * - Up to 3 progressive hint tiers (Conceptual, Algorithmic, Structural/Implementation)
 * - -15 points penalty deduction per unlocked hint
 * - Progressive tracking of total score deductions
 * - Unlocking state disablement when maximum hints reached
 * - Presentation of hint content and rubric penalty disclaimer
 */

interface HintState {
  availableHints: string[];
  unlockedCount: number;
  maxHints: number;
  penaltyPerHint: number;
}

function unlockNextHint(state: HintState): { newState: HintState; unlockedHint: string | null } {
  if (state.unlockedCount >= state.maxHints || state.unlockedCount >= state.availableHints.length) {
    return { newState: state, unlockedHint: null };
  }
  const nextCount = state.unlockedCount + 1;
  const hintText = state.availableHints[state.unlockedCount];
  return {
    newState: { ...state, unlockedCount: nextCount },
    unlockedHint: hintText,
  };
}

function calculateTotalHintPenalty(unlockedCount: number, penaltyPerHint = 15): number {
  return unlockedCount * penaltyPerHint;
}

describe('Feature 17: Progressive Hint Unlocks', () => {
  const sampleHints = [
    'Hint 1 (Conceptual): Consider using a hash map to look up complements in O(1) time.',
    'Hint 2 (Algorithmic): Loop through the array once while storing target - num into the map.',
    'Hint 3 (Code Structure): Check map.has(complement) before map.set(num, index).',
  ];

  const initialState: HintState = {
    availableHints: sampleHints,
    unlockedCount: 0,
    maxHints: 3,
    penaltyPerHint: 15,
  };

  it('should initialize with zero hints unlocked and 0pts penalty', () => {
    expect(initialState.unlockedCount).toBe(0);
    expect(calculateTotalHintPenalty(0)).toBe(0);
  });

  it('should deduct exactly 15 points upon unlocking the first hint', () => {
    const { newState, unlockedHint } = unlockNextHint(initialState);
    expect(newState.unlockedCount).toBe(1);
    expect(unlockedHint).toBe(sampleHints[0]);
    expect(calculateTotalHintPenalty(newState.unlockedCount)).toBe(15);
  });

  it('should deduct cumulative 30 and 45 points for second and third hint unlocks', () => {
    let state = initialState;
    // Hint 1
    state = unlockNextHint(state).newState;
    expect(calculateTotalHintPenalty(state.unlockedCount)).toBe(15);
    // Hint 2
    state = unlockNextHint(state).newState;
    expect(state.unlockedCount).toBe(2);
    expect(calculateTotalHintPenalty(state.unlockedCount)).toBe(30);
    // Hint 3
    state = unlockNextHint(state).newState;
    expect(state.unlockedCount).toBe(3);
    expect(calculateTotalHintPenalty(state.unlockedCount)).toBe(45);
  });

  it('should prevent unlocking beyond max hints (max 3)', () => {
    let state: HintState = { ...initialState, unlockedCount: 3 };
    const { newState, unlockedHint } = unlockNextHint(state);
    expect(newState.unlockedCount).toBe(3);
    expect(unlockedHint).toBeNull();
  });

  it('should compute final adjusted interview score by applying hint penalty accurately', () => {
    const rawScore = 85;
    const hintsUsed = 2; // -30pts
    const penalty = calculateTotalHintPenalty(hintsUsed);
    const finalScore = Math.max(0, rawScore - penalty);
    expect(penalty).toBe(30);
    expect(finalScore).toBe(55);
  });
});
