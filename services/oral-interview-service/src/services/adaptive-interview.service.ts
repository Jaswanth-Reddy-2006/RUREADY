// ═══════════════════════════════════════════════════════════════
// RU READY Adaptive Interview Controller
// Decouples deterministic decisions (remaining time, hints used, topic coverage) from LLM generation.
// ═══════════════════════════════════════════════════════════════

import {
  CandidateIntent,
  NextAction,
  AdaptiveDecision,
  StructuredEvaluation,
} from '@ru-ready/shared';

export interface AdaptiveContext {
  sessionId: string;
  currentQuestionIndex: number;
  totalQuestionsPlanned: number;
  remainingTimeSecs: number;
  currentDifficulty: 'EASY' | 'MEDIUM' | 'HARD';
  consecutiveStrongAnswers: number;
  consecutiveWeakAnswers: number;
  recordedGaps: Array<{ topic?: string; difficulty: string; timestamp: string }>;
  topicsCovered: string[];
  hintsUsed: number;
}

export class AdaptiveInterviewController {
  /**
   * Deterministically evaluates context + evaluation to produce an AdaptiveDecision
   */
  public static evaluateDecision(
    context: AdaptiveContext,
    evaluation: StructuredEvaluation
  ): AdaptiveDecision {
    const { intent, quality, score } = evaluation;
    let nextAction: NextAction = 'NEXT_QUESTION';
    let updatedDifficulty = context.currentDifficulty;
    let shouldAdvanceQuestion = false;
    let scorePenalty = 0;
    let reasoning = 'Standard adaptive progression.';

    // 1. Time or Session End checks
    if (context.remainingTimeSecs <= 60 || context.currentQuestionIndex >= context.totalQuestionsPlanned) {
      return {
        nextAction: 'COMPLETE_INTERVIEW',
        updatedDifficulty: context.currentDifficulty,
        shouldAdvanceQuestion: true,
        scorePenalty: 0,
        reasoning: 'Session duration limit or target question count reached.',
      };
    }

    // 2. Intent Dispatch
    switch (intent) {
      case 'END_INTERVIEW':
        return {
          nextAction: 'COMPLETE_INTERVIEW',
          updatedDifficulty: context.currentDifficulty,
          shouldAdvanceQuestion: true,
          scorePenalty: 0,
          reasoning: 'Candidate explicitly requested session termination.',
        };

      case 'TIME_QUERY':
        return {
          nextAction: 'REPHRASE',
          updatedDifficulty: context.currentDifficulty,
          shouldAdvanceQuestion: false,
          scorePenalty: 0,
          reasoning: 'Candidate queried remaining session time. Provide time status without penalty.',
        };

      case 'REPEAT_QUESTION':
      case 'HESITATION':
        return {
          nextAction: 'REPEAT',
          updatedDifficulty: context.currentDifficulty,
          shouldAdvanceQuestion: false,
          scorePenalty: 0,
          reasoning: 'Candidate requested question repetition or paused to think.',
        };

      case 'CLARIFICATION':
      case 'CONFIRMATION':
        return {
          nextAction: 'CLARIFY',
          updatedDifficulty: context.currentDifficulty,
          shouldAdvanceQuestion: false,
          scorePenalty: 0,
          reasoning: 'Candidate asked for scope clarification. Rephrase topic without penalty.',
        };

      case 'TECHNICAL_QUESTION':
        return {
          nextAction: 'ANSWER_TECHNICAL_QUERY',
          updatedDifficulty: context.currentDifficulty,
          shouldAdvanceQuestion: false,
          scorePenalty: 0,
          reasoning: 'Candidate asked a clarifying question regarding inputs or constraints.',
        };

      case 'DON_T_KNOW':
        // Record gap without immediately collapsing global difficulty to EASY
        context.recordedGaps.push({
          difficulty: context.currentDifficulty,
          timestamp: new Date().toISOString(),
        });

        if (context.consecutiveWeakAnswers >= 2) {
          updatedDifficulty = context.currentDifficulty === 'HARD' ? 'MEDIUM' : 'EASY';
          nextAction = 'CHANGE_TOPIC';
          shouldAdvanceQuestion = true;
          reasoning = 'Multiple topic gaps detected. Transitioning to new topic with adjusted difficulty.';
        } else {
          // Stay on current difficulty or probe simpler sub-angle first
          nextAction = 'SIMPLER_QUESTION';
          shouldAdvanceQuestion = false;
          reasoning = 'Single unknown topic noted. Observing performance on next question before adjusting difficulty.';
        }
        break;

      case 'SKIP_QUESTION':
        shouldAdvanceQuestion = true;
        nextAction = 'MOVE_ON';
        reasoning = 'Candidate chose to skip question.';
        break;

      case 'CORRECTION':
        // Candidate corrected their prior response
        nextAction = 'PROBE_DEPTH';
        shouldAdvanceQuestion = false;
        reasoning = 'Candidate self-corrected. Re-evaluating updated explanation.';
        break;

      case 'ANSWER':
      default:
        if (quality === 'STRONG' || score >= 80) {
          shouldAdvanceQuestion = true;
          if (context.consecutiveStrongAnswers >= 1) {
            updatedDifficulty = context.currentDifficulty === 'EASY' ? 'MEDIUM' : 'HARD';
            nextAction = 'HARDER_FOLLOW_UP';
            reasoning = 'Sustained strong answers. Increasing question difficulty.';
          } else {
            nextAction = 'NEXT_QUESTION';
            reasoning = 'Strong answer provided. Moving to next topic.';
          }
        } else if (quality === 'PARTIAL' || quality === 'MISSING_DEPTH') {
          shouldAdvanceQuestion = false;
          nextAction = 'PROBE_DEPTH';
          reasoning = 'Partial answer provided. Probing deeper into missing concepts.';
        } else {
          // Low quality or incorrect
          shouldAdvanceQuestion = false;
          nextAction = 'SIMPLER_QUESTION';
          reasoning = 'Answer lacks technical accuracy. Presenting rephrased sub-angle.';
        }
        break;
    }

    return {
      nextAction,
      updatedDifficulty,
      shouldAdvanceQuestion,
      scorePenalty,
      reasoning,
    };
  }
}
