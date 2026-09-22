// ═══════════════════════════════════════════════════════════════
// RU READY Advanced Oral Interview Engine — State Machine Controller
// ═══════════════════════════════════════════════════════════════

import {
  EngineState,
  CandidateIntent,
  NextAction,
  StructuredEvaluation,
  EvaluationQuality,
} from '@ru-ready/shared';

export interface StateMachineContext {
  sessionId: string;
  currentState: EngineState;
  currentQuestionIndex: number;
  totalQuestionsPlanned: number;
  currentDifficulty: 'EASY' | 'MEDIUM' | 'HARD';
  consecutiveStrongAnswers: number;
  consecutiveWeakAnswers: number;
  currentQuestionId?: string;
  projectLevel?: number;
  sessionMemory: Array<{
    questionId: string;
    questionText: string;
    answerText: string;
    evaluation?: StructuredEvaluation;
  }>;
}

export interface StateTransitionResult {
  nextState: EngineState;
  spokenResponse: string;
  emotion: 'neutral' | 'curious' | 'encouraging' | 'thoughtful' | 'serious';
  gesture: 'nod' | 'tilt' | 'thinking_hand' | 'subtle_smile' | 'neutral';
  nextAction: NextAction;
  updatedDifficulty: 'EASY' | 'MEDIUM' | 'HARD';
  shouldAdvanceQuestion: boolean;
  scorePenalty: number;
}

export class InterviewStateMachine {
  /**
   * Evaluates the candidate input/intent and current engine state,
   * returning the next state, spoken avatar response, and controller action.
   */
  public static handleIntent(
    context: StateMachineContext,
    evaluation: StructuredEvaluation
  ): StateTransitionResult {
    const { intent, quality, spokenResponse, emotion, gesture, recommendedAction } = evaluation;

    let nextState: EngineState = 'EVALUATING';
    let nextAction: NextAction = recommendedAction || 'NEXT_QUESTION';
    let updatedDifficulty = context.currentDifficulty;
    let shouldAdvanceQuestion = false;
    let scorePenalty = 0;
    let responseText = spokenResponse;

    // ─── Intent Dispatch ─────────────────────────────────────
    switch (intent) {
      case 'REPEAT_QUESTION':
        nextState = 'REPEAT';
        nextAction = 'REPEAT';
        shouldAdvanceQuestion = false;
        scorePenalty = 0;
        responseText = responseText || "Of course. Take your time, let me repeat that question for you.";
        break;

      case 'CLARIFICATION':
        nextState = 'CLARIFICATION';
        nextAction = 'REPHRASE';
        shouldAdvanceQuestion = false;
        scorePenalty = 0;
        responseText = responseText || "No problem at all. Let me rephrase the question to make it clearer.";
        break;

      case 'DON_T_KNOW':
        nextState = 'DON_T_KNOW';
        // If candidate struggles twice or says don't know, move on or ask simpler angle
        if (context.consecutiveWeakAnswers >= 1) {
          nextAction = 'MOVE_ON';
          shouldAdvanceQuestion = true;
          responseText = responseText || "No worries at all. Let me transition us to another core topic.";
        } else {
          nextAction = 'SIMPLER_QUESTION';
          shouldAdvanceQuestion = false;
          responseText = responseText || "That's completely fine. Let's approach this concept from another angle.";
        }
        updatedDifficulty = context.currentDifficulty === 'HARD' ? 'MEDIUM' : 'EASY';
        break;

      case 'THINKING':
        nextState = 'THINKING';
        nextAction = 'REPEAT';
        shouldAdvanceQuestion = false;
        responseText = responseText || "Take your time. Whenever you're ready, share your thoughts.";
        break;

      case 'OFF_TOPIC':
        nextState = 'OFF_TOPIC';
        nextAction = 'REPHRASE';
        shouldAdvanceQuestion = false;
        responseText = responseText || "Let's focus back on the core question.";
        break;

      case 'SKIP_QUESTION':
        nextState = 'MOVE_NEXT';
        nextAction = 'MOVE_ON';
        shouldAdvanceQuestion = true;
        responseText = responseText || "Understood. Moving on to the next question.";
        break;

      case 'ANSWER':
      default:
        // Evaluated technical or behavioral answer
        if (quality === 'STRONG') {
          nextState = 'ASKING';
          updatedDifficulty = context.currentDifficulty === 'EASY' ? 'MEDIUM' : 'HARD';
          if (context.consecutiveStrongAnswers >= 1) {
            nextAction = 'HARDER_FOLLOW_UP';
          } else {
            nextAction = 'NEXT_QUESTION';
          }
          shouldAdvanceQuestion = true;
          responseText = responseText || "Good. That covers the key concepts nicely.";
        } else if (quality === 'PARTIAL' || quality === 'MISSING_DEPTH') {
          nextState = 'FOLLOW_UP';
          nextAction = 'PROBE_DEPTH';
          shouldAdvanceQuestion = false;
          responseText = responseText || "You're on the right track. Can you elaborate slightly further on that point?";
        } else {
          // Incorrect or low quality
          nextState = 'FOLLOW_UP';
          updatedDifficulty = context.currentDifficulty === 'HARD' ? 'MEDIUM' : 'EASY';
          nextAction = 'SIMPLER_QUESTION';
          shouldAdvanceQuestion = false;
          responseText = responseText || "I see what you're thinking. Let's reconsider one aspect of that approach.";
        }
        break;
    }

    // Check if total session limit reached
    if (shouldAdvanceQuestion && context.currentQuestionIndex >= context.totalQuestionsPlanned) {
      nextState = 'COMPLETED';
      nextAction = 'COMPLETE_INTERVIEW';
      responseText = "That completes all the questions for today's session! Excellent effort. Let's review your performance breakdown.";
    }

    return {
      nextState,
      spokenResponse: responseText,
      emotion: emotion || 'neutral',
      gesture: gesture || 'nod',
      nextAction,
      updatedDifficulty,
      shouldAdvanceQuestion,
      scorePenalty,
    };
  }

  /**
   * Structured response library for natural interviewer feedback
   * preventing repetitive "Correct!" or raw score leaks.
   */
  public static getNaturalResponseTemplate(quality: EvaluationQuality, topicName?: string): string {
    const responsePool: Record<EvaluationQuality, string[]> = {
      STRONG: [
        "Good. That's the key idea behind it.",
        "Excellent explanation. You hit all the critical concepts clearly.",
        "Spot on. That is precisely how it functions in real-world systems."
      ],
      PARTIAL: [
        "You're on the right track. Let me probe one level deeper.",
        "That touches on part of the answer. What else happens in this scenario?",
        "Good foundation. Can you expand on the underlying trade-offs?"
      ],
      MISSING_DEPTH: [
        "That's a reasonable start. How does that perform under high concurrency?",
        "Fair point. Can you explain the time or space complexity of that choice?",
        "I understand your approach. What happens if edge cases occur?"
      ],
      INCORRECT: [
        "I see your line of reasoning. There's one detail to reconsider here.",
        "Not quite, but let's break it down together.",
        "Let's step back and look at the fundamental assumption behind this."
      ],
      DON_T_KNOW: [
        "No worries at all. We will revisit this topic later in your prep.",
        "That's completely okay. Let's shift to another question.",
        "No problem. Interviews are for discovering areas to sharpen!"
      ],
      UNCLEAR: [
        "Could you clarify what you mean by that?",
        "I didn't quite capture your main point. Could you restate that?",
        "Let's break that down into a simpler explanation."
      ]
    };

    const choices = responsePool[quality] || responsePool.PARTIAL;
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
  }
}
