// ═══════════════════════════════════════════════════════════════
// RU READY Advanced Coding Interview Engine — State Machine Controller
// ═══════════════════════════════════════════════════════════════

import {
  CodingEnginePhase,
  CodingEventType,
  CodingTimelineEvent,
  CodingMultidimensionalScore,
} from '@ru-ready/shared';

export interface CodingSessionContext {
  sessionId: string;
  currentPhase: CodingEnginePhase;
  problemId: string;
  problemTitle: string;
  codeLanguage: string;
  codeValue: string;
  hintLevel: number;
  testPassedCount: number;
  totalTests: number;
  idleDurationSecs: number;
  timelineEvents: CodingTimelineEvent[];
}

export interface CodingInterventionResult {
  nextPhase: CodingEnginePhase;
  shouldSpeak: boolean;
  spokenText: string;
  avatarState: 'idle' | 'speaking' | 'listening' | 'thinking';
  hintText?: string;
  hintLevelUsed?: number;
  suggestedAction?: 'EXPLAIN_APPROACH' | 'TYPE_CODE' | 'DEBUG_TEST' | 'VERIFY_COMPLEXITY' | 'COMPLETE';
}

export class CodingStateMachine {
  /**
   * Processes a coding event from the Live IDE event stream and determines
   * whether the AI interviewer should intervene, speak, or remain silent.
   */
  public static handleCodingEvent(
    context: CodingSessionContext,
    event: CodingEventType,
    payload?: any
  ): CodingInterventionResult {
    let nextPhase = context.currentPhase;
    let shouldSpeak = false;
    let spokenText = '';
    let avatarState: 'idle' | 'speaking' | 'listening' | 'thinking' = 'idle';
    let hintText: string | undefined = undefined;
    let hintLevelUsed = context.hintLevel;
    let suggestedAction: any = 'TYPE_CODE';

    const timestampStr = new Date().toISOString();

    switch (event) {
      case 'PROBLEM_OPENED':
        nextPhase = 'PROBLEM_READING';
        shouldSpeak = true;
        spokenText = `Here's the problem: "${context.problemTitle}". Take a moment to read through the statement and constraints, and let me know when you're ready to explain your approach.`;
        avatarState = 'speaking';
        suggestedAction = 'EXPLAIN_APPROACH';
        break;

      case 'APPROACH_EXPLAINED':
        nextPhase = 'ACTIVE_CODING';
        shouldSpeak = true;
        spokenText = `Good approach logic. Go ahead and start implementing your solution in the editor. I'll observe your code as you write.`;
        avatarState = 'speaking';
        suggestedAction = 'TYPE_CODE';
        ariaRecordEvent(context, 'APPROACH_EXPLAINED', 'Candidate explained high-level algorithm approach.');
        break;

      case 'CODE_STARTED':
      case 'CODE_CHANGED':
        // Candidate is actively typing code — AI stays silent to maintain focus!
        if (context.currentPhase === 'PROBLEM_READING') {
          nextPhase = 'ACTIVE_CODING';
        }
        shouldSpeak = false;
        avatarState = 'listening';
        suggestedAction = 'TYPE_CODE';
        break;

      case 'CURSOR_IDLE':
        // Candidate is stuck (idle > 90 seconds)
        if (context.idleDurationSecs >= 90 && context.currentPhase === 'ACTIVE_CODING') {
          shouldSpeak = true;
          spokenText = `I noticed you've paused for a moment. How are you thinking about structuring your data loop or edge cases?`;
          avatarState = 'speaking';
          suggestedAction = 'TYPE_CODE';
        }
        break;

      case 'TEST_FAILED':
        nextPhase = 'DEBUGGING';
        shouldSpeak = true;
        spokenText = `Your solution passed ${payload?.passedCount || 0} of ${payload?.totalCount || context.totalTests} tests. Take a look at the failing test case in the console output. What boundary condition might be causing that discrepancy?`;
        avatarState = 'speaking';
        suggestedAction = 'DEBUG_TEST';
        ariaRecordEvent(context, 'TEST_FAILED', `Failed test case (${payload?.passedCount}/${payload?.totalCount}).`);
        break;

      case 'TEST_PASSED':
        if (payload?.passedCount === payload?.totalCount) {
          nextPhase = 'COMPLEXITY_CHECK';
          shouldSpeak = true;
          spokenText = `Excellent effort! All ${payload.totalCount} test cases passed. Can you walk me through the Time Complexity and Space Complexity of your implementation using Big-O notation?`;
          avatarState = 'speaking';
          suggestedAction = 'VERIFY_COMPLEXITY';
          ariaRecordEvent(context, 'TEST_PASSED', `Passed all ${payload.totalCount} test cases!`);
        } else {
          shouldSpeak = false;
          avatarState = 'listening';
        }
        break;

      case 'HINT_REQUESTED':
        hintLevelUsed = Math.min(3, context.hintLevel + 1);
        shouldSpeak = true;
        const hints = getProgressiveHints(context.problemId);
        hintText = hints[hintLevelUsed - 1] || "Consider tracking previously seen elements using a hash lookup map.";
        spokenText = `Here's a hint for you: ${hintText}`;
        avatarState = 'speaking';
        ariaRecordEvent(context, 'HINT_REQUESTED', `Requested Level ${hintLevelUsed} hint.`);
        break;

      case 'COMPLEXITY_EXPLAINED':
        nextPhase = 'COMPLETED';
        shouldSpeak = true;
        spokenText = `Great complexity breakdown! That completes your coding assessment for this problem. Let me compile your multi-dimensional performance report.`;
        avatarState = 'speaking';
        suggestedAction = 'COMPLETE';
        ariaRecordEvent(context, 'COMPLEXITY_EXPLAINED', 'Candidate justified Big-O complexity.');
        break;

      case 'SUBMITTED':
        nextPhase = 'COMPLETED';
        shouldSpeak = true;
        spokenText = `Solution submitted successfully! Let us review your overall coding performance and timing breakdown.`;
        avatarState = 'speaking';
        suggestedAction = 'COMPLETE';
        ariaRecordEvent(context, 'SUBMITTED', 'Candidate submitted solution code.');
        break;
    }

    return {
      nextPhase,
      shouldSpeak,
      spokenText,
      avatarState,
      hintText,
      hintLevelUsed,
      suggestedAction,
    };
  }
}

function ariaRecordEvent(context: CodingSessionContext, eventType: CodingEventType, desc: string) {
  context.timelineEvents.push({
    timestamp: new Date().toLocaleTimeString(),
    eventType,
    description: desc,
    codeSnapshot: context.codeValue.slice(0, 300),
    testPassedCount: context.testPassedCount,
    totalTests: context.totalTests,
  });
}

function getProgressiveHints(problemId: string): string[] {
  const hintMap: Record<string, string[]> = {
    'two-sum': [
      "Hint 1 (Conceptual): Think about whether you can check for the complement value (target - current_number) in constant time.",
      "Hint 2 (Structural): Consider using a Hash Map where the key is the array element and the value is its index.",
      "Hint 3 (Direct): Loop through the array once: for each number, check if (target - num) exists in your map. If so, return [map[target - num], i]; otherwise, add (num -> i) to the map."
    ]
  };

  return hintMap[problemId] || [
    "Hint 1 (Conceptual): Look for ways to eliminate nested loop overhead.",
    "Hint 2 (Structural): Consider trading space for time using an auxiliary hash table.",
    "Hint 3 (Direct): Store previously encountered values in a map during a single linear traversal."
  ];
}
