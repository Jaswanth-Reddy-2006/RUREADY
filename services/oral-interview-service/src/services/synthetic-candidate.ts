// ═══════════════════════════════════════════════════════════════
// RU READY Synthetic Candidate Test Engine
// Automated development simulation runner for FSM & Adaptive Controller validation
// ═══════════════════════════════════════════════════════════════

import {
  SyntheticCandidateProfile,
  StructuredEvaluation,
  InterviewEventLog,
} from '@ru-ready/shared';
import { classifyCandidateIntent } from './oral.service.js';
import { AdaptiveInterviewController, AdaptiveContext } from './adaptive-interview.service.js';
import { InterviewStateMachine } from './interview-fsm.js';

export interface SimulationResult {
  profile: SyntheticCandidateProfile;
  steps: Array<{
    turn: number;
    candidateInput: string;
    detectedIntent: string;
    decisionNextAction: string;
    resultingDifficulty: string;
    spokenResponse: string;
    passedValidation: boolean;
  }>;
  overallPassed: boolean;
}

export class SyntheticCandidateEngine {
  /**
   * Runs a complete synthetic candidate simulation for a given profile
   */
  public static simulateSession(profile: SyntheticCandidateProfile): SimulationResult {
    const context: AdaptiveContext = {
      sessionId: `synth_${profile.toLowerCase()}_${Date.now()}`,
      currentQuestionIndex: 1,
      totalQuestionsPlanned: 5,
      remainingTimeSecs: 900,
      currentDifficulty: 'MEDIUM',
      consecutiveStrongAnswers: 0,
      consecutiveWeakAnswers: 0,
      recordedGaps: [],
      topicsCovered: ['General Technical'],
      hintsUsed: 0,
    };

    const inputs = this.getInputsForProfile(profile);
    const steps: SimulationResult['steps'] = [];
    let overallPassed = true;

    inputs.forEach((candidateInput, index) => {
      const turn = index + 1;

      // 1. Intent Detection
      const detectedIntent = classifyCandidateIntent(candidateInput);

      // 2. Synthesize Evaluation matching intent/profile
      const evalData = this.synthesizeEvaluation(detectedIntent, profile, candidateInput);

      // 3. Adaptive Decision
      const decision = AdaptiveInterviewController.evaluateDecision(context, evalData);

      // 4. FSM State Transition
      const fsmResult = InterviewStateMachine.handleIntent(
        {
          sessionId: context.sessionId,
          currentState: 'ASKING',
          currentQuestionIndex: context.currentQuestionIndex,
          totalQuestionsPlanned: context.totalQuestionsPlanned,
          currentDifficulty: context.currentDifficulty,
          consecutiveStrongAnswers: context.consecutiveStrongAnswers,
          consecutiveWeakAnswers: context.consecutiveWeakAnswers,
          sessionMemory: [],
        },
        evalData
      );

      // Update context state based on decision
      context.currentDifficulty = decision.updatedDifficulty;
      if (decision.shouldAdvanceQuestion) {
        context.currentQuestionIndex += 1;
      }
      if (evalData.quality === 'STRONG') {
        context.consecutiveStrongAnswers += 1;
        context.consecutiveWeakAnswers = 0;
      } else if (evalData.quality === 'MISSING_DEPTH' || evalData.quality === 'INCORRECT') {
        context.consecutiveWeakAnswers += 1;
        context.consecutiveStrongAnswers = 0;
      }

      // Validate expected scenario rules
      const passedValidation = this.validateStepRules(profile, detectedIntent, decision.nextAction, fsmResult);
      if (!passedValidation) {
        overallPassed = false;
      }

      steps.push({
        turn,
        candidateInput,
        detectedIntent,
        decisionNextAction: decision.nextAction,
        resultingDifficulty: context.currentDifficulty,
        spokenResponse: fsmResult.spokenResponse,
        passedValidation,
      });
    });

    return {
      profile,
      steps,
      overallPassed,
    };
  }

  private static getInputsForProfile(profile: SyntheticCandidateProfile): string[] {
    switch (profile) {
      case 'STRONG':
        return [
          "I will use PostgreSQL for relational integrity with B-tree composite indexes for fast O(log N) lookup.",
          "We can optimize by adding a Redis cache layer for hot keys with LRU eviction and 5-minute TTL.",
          "For scalability, we partition writes across Kafka topics and use database read replicas.",
        ];

      case 'WEAK':
        return [
          "I think we just save it in a database table.",
          "Maybe we can loop through the array twice.",
          "I'm not really sure about indexing.",
        ];

      case 'REPEAT':
        return [
          "Sorry, could you repeat the question?",
          "Can you say that again?",
        ];

      case 'DON_T_KNOW':
        return [
          "I don't know much about Redis XFetch.",
          "I haven't worked with database normalization before.",
        ];

      case 'CLARIFICATION':
        return [
          "What do you mean by high availability?",
          "Are you asking about read performance or write latency?",
        ];

      case 'TECHNICAL_QUESTION':
        return [
          "Are duplicate keys allowed in the input array?",
          "What is the maximum integer limit?",
        ];

      case 'CORRECTION':
        return [
          "I would use MongoDB... wait, actually PostgreSQL would be better because of strict ACID transactions.",
        ];

      case 'TIME_QUERY':
        return [
          "How much time do I have left in this session?",
        ];

      case 'MIXED':
      default:
        return [
          "I would use a Hash Map for O(1) lookup.",
          "Can you repeat the second constraint?",
          "I'm not sure about that specific edge case.",
        ];
    }
  }

  private static synthesizeEvaluation(
    intent: string,
    profile: SyntheticCandidateProfile,
    input: string
  ): StructuredEvaluation {
    if (intent === 'REPEAT_QUESTION') {
      return {
        intent: 'REPEAT_QUESTION',
        correctness: 0,
        conceptCoverage: 0,
        depth: 0,
        clarity: 0.8,
        relevance: 1,
        confidence: 0.8,
        coveredConcepts: [],
        missingConcepts: [],
        misconceptions: [],
        quality: 'UNCLEAR',
        score: 0,
        feedback: 'Candidate requested question repetition.',
        recommendedAction: 'REPEAT',
        spokenResponse: 'Of course. Let me repeat that question for you.',
        emotion: 'encouraging',
        gesture: 'nod',
      };
    }

    if (intent === 'DON_T_KNOW') {
      return {
        intent: 'DON_T_KNOW',
        correctness: 0,
        conceptCoverage: 0,
        depth: 0,
        clarity: 0.8,
        relevance: 1,
        confidence: 0.5,
        coveredConcepts: [],
        missingConcepts: ['Topic knowledge'],
        misconceptions: [],
        quality: 'DON_T_KNOW',
        score: 0,
        feedback: 'Candidate indicated topic unfamiliarity.',
        recommendedAction: 'SIMPLER_QUESTION',
        spokenResponse: "That's completely fine. Let's approach this concept from another angle.",
        emotion: 'encouraging',
        gesture: 'nod',
      };
    }

    if (profile === 'STRONG') {
      return {
        intent: 'ANSWER',
        correctness: 0.9,
        conceptCoverage: 0.9,
        depth: 0.88,
        clarity: 0.9,
        relevance: 0.95,
        confidence: 0.9,
        coveredConcepts: ['PostgreSQL', 'Indexes', 'B-Tree'],
        missingConcepts: [],
        misconceptions: [],
        quality: 'STRONG',
        score: 90,
        feedback: 'Excellent technical depth and architectural reasoning.',
        recommendedAction: 'HARDER_FOLLOW_UP',
        spokenResponse: 'Good. Let us take that one level deeper.',
        emotion: 'thoughtful',
        gesture: 'nod',
      };
    }

    return {
      intent: 'ANSWER',
      correctness: 0.7,
      conceptCoverage: 0.65,
      depth: 0.6,
      clarity: 0.75,
      relevance: 0.8,
      confidence: 0.7,
      coveredConcepts: [],
      missingConcepts: [],
      misconceptions: [],
      quality: 'PARTIAL',
      score: 70,
      feedback: 'Good response.',
      recommendedAction: 'PROBE_DEPTH',
      spokenResponse: 'You are on the right track. Can you elaborate on that?',
      emotion: 'curious',
      gesture: 'nod',
    };
  }

  private static validateStepRules(
    profile: string,
    detectedIntent: string,
    nextAction: string,
    fsmResult: any
  ): boolean {
    if (profile === 'REPEAT' && detectedIntent !== 'REPEAT_QUESTION') return false;
    if (profile === 'DON_T_KNOW' && detectedIntent !== 'DON_T_KNOW') return false;
    if (profile === 'TIME_QUERY' && detectedIntent !== 'TIME_QUERY') return false;
    if (profile === 'CORRECTION' && detectedIntent !== 'CORRECTION') return false;
    return true;
  }
}
