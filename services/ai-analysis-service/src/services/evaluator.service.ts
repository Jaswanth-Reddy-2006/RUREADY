// ═══════════════════════════════════════════════════════════════
// RU READY Advanced Oral Interview Engine — Evaluator Service
// ═══════════════════════════════════════════════════════════════

import { StructuredEvaluation, CandidateIntent, NextAction } from '@ru-ready/shared';
import { aiProviderManager } from '../lib/ai-provider-manager.js';
import { MASTER_PROMPT_ENGINE_EVALUATOR } from '../prompts/master_prompt.js';

export interface EvaluationInput {
  questionText: string;
  questionType: string;
  answerText: string;
  requiredConcepts?: string[];
  optionalConcepts?: string[];
  sessionContext?: any;
}

export class EvaluatorService {
  /**
   * Deterministically classifies basic intent keywords before LLM execution for high accuracy & speed.
   */
  public static detectLocalIntent(text: string): CandidateIntent | null {
    const clean = text.toLowerCase().trim();

    if (/repeat|say that again|what was the question|pardon|can you repeat/i.test(clean)) {
      return 'REPEAT_QUESTION';
    }
    if (/clarify|don't understand|do you mean|what does that mean|rephrase/i.test(clean)) {
      return 'CLARIFICATION';
    }
    if (/don't know|do not know|no idea|not sure|haven't used|haven't worked with/i.test(clean)) {
      return 'DON_T_KNOW';
    }
    if (/thinking|give me a second|hold on|wait a moment|let me think/i.test(clean)) {
      return 'THINKING';
    }
    if (/skip|next question|pass/i.test(clean)) {
      return 'SKIP_QUESTION';
    }
    return null;
  }

  /**
   * Evaluates candidate response using LLM or structured rule fallback.
   */
  public static async evaluateAnswer(input: EvaluationInput): Promise<StructuredEvaluation> {
    const localIntent = this.detectLocalIntent(input.answerText);
    const required = input.requiredConcepts || [];
    const optional = input.optionalConcepts || [];

    // Local rule fallback for quick non-answer intents
    if (localIntent && localIntent !== 'ANSWER') {
      return this.buildIntentFallback(localIntent, input.answerText);
    }

    // Attempt LLM structured evaluation if AI Provider is active
    if (aiProviderManager.getConfig().provider !== 'mock') {
      try {
        const userPrompt = `Question: "${input.questionText}"
Required Concepts: ${JSON.stringify(required)}
Optional Concepts: ${JSON.stringify(optional)}

Candidate Input:
"""
${input.answerText}
"""`;

        const rawResult = await aiProviderManager.callChatCompletion(
          MASTER_PROMPT_ENGINE_EVALUATOR,
          userPrompt,
          15000
        );

        let parsed: any;
        try {
          let cleaned = rawResult.trim();
          if (cleaned.startsWith('```json')) cleaned = cleaned.slice(7);
          if (cleaned.startsWith('```')) cleaned = cleaned.slice(3);
          if (cleaned.endsWith('```')) cleaned = cleaned.slice(0, -3);
          parsed = JSON.parse(cleaned.trim());
        } catch {
          const match = rawResult.match(/\{[\s\S]*\}/);
          if (match) parsed = JSON.parse(match[0]);
        }

        if (parsed && parsed.intent) {
          return {
            intent: parsed.intent || 'ANSWER',
            correctness: parsed.correctness ?? 0.75,
            conceptCoverage: parsed.conceptCoverage ?? 0.70,
            depth: parsed.depth ?? 0.60,
            clarity: parsed.clarity ?? 0.80,
            relevance: parsed.relevance ?? 0.85,
            confidence: parsed.confidence ?? 0.75,
            coveredConcepts: Array.isArray(parsed.coveredConcepts) ? parsed.coveredConcepts : required.slice(0, 1),
            missingConcepts: Array.isArray(parsed.missingConcepts) ? parsed.missingConcepts : required.slice(1),
            misconceptions: Array.isArray(parsed.misconceptions) ? parsed.misconceptions : [],
            quality: parsed.quality || 'PARTIAL',
            score: parsed.score ?? 75,
            feedback: parsed.feedback || 'Candidate response evaluated.',
            recommendedAction: parsed.recommendedAction || 'NEXT_QUESTION',
            spokenResponse: parsed.spokenResponse || "Good. Let me ask you the next question.",
            emotion: parsed.emotion || 'neutral',
            gesture: parsed.gesture || 'nod',
          };
        }
      } catch (err) {
        console.warn('[EvaluatorService] Structured LLM evaluation failed, using semantic rule evaluator:', (err as Error).message);
      }
    }

    // Semantic Rule Fallback (if Ollama/LLM offline or mock mode)
    return this.evaluateSemanticFallback(input);
  }

  private static buildIntentFallback(intent: CandidateIntent, rawText: string): StructuredEvaluation {
    const responses: Record<CandidateIntent, { spoken: string; action: NextAction }> = {
      REPEAT_QUESTION: {
        spoken: "Of course. Let me repeat the question for you clearly.",
        action: 'REPEAT',
      },
      CLARIFICATION: {
        spoken: "Sure thing! Let me rephrase that question in simpler terms.",
        action: 'REPHRASE',
      },
      DON_T_KNOW: {
        spoken: "No worries at all. Let's tackle a related concept or move forward.",
        action: 'SIMPLER_QUESTION',
      },
      THINKING: {
        spoken: "Take your time! Whenever you're ready, share your thoughts.",
        action: 'REPEAT',
      },
      OFF_TOPIC: {
        spoken: "Let's focus back on the primary technical question.",
        action: 'REPHRASE',
      },
      SKIP_QUESTION: {
        spoken: "Understood. Skipping to the next question.",
        action: 'MOVE_ON',
      },
      INTERRUPTION: {
        spoken: "Go ahead, I'm listening.",
        action: 'REPEAT',
      },
      ANSWER: {
        spoken: "Let's proceed.",
        action: 'NEXT_QUESTION',
      },
    };

    const target = responses[intent] || responses.ANSWER;

    return {
      intent,
      correctness: 0,
      conceptCoverage: 0,
      depth: 0,
      clarity: 0.8,
      relevance: 0,
      confidence: 0.5,
      coveredConcepts: [],
      missingConcepts: [],
      misconceptions: [],
      quality: intent === 'DON_T_KNOW' ? 'DON_T_KNOW' : 'UNCLEAR',
      score: intent === 'DON_T_KNOW' ? 0 : 70,
      feedback: `Candidate expressed ${intent.toLowerCase().replace('_', ' ')}.`,
      recommendedAction: target.action,
      spokenResponse: target.spoken,
      emotion: intent === 'DON_T_KNOW' ? 'encouraging' : 'thoughtful',
      gesture: 'nod',
    };
  }

  private static evaluateSemanticFallback(input: EvaluationInput): StructuredEvaluation {
    const text = input.answerText.toLowerCase();
    const required = input.requiredConcepts || [];
    const words = text.split(/\s+/).filter(Boolean).length;

    const covered = required.filter(c => text.includes(c.toLowerCase()));
    const missing = required.filter(c => !text.includes(c.toLowerCase()));

    const coverageRatio = required.length ? covered.length / required.length : (words > 15 ? 0.8 : 0.4);
    const score = Math.round(Math.min(100, Math.max(30, coverageRatio * 70 + (words > 20 ? 25 : 10))));

    let quality: any = 'PARTIAL';
    let action: NextAction = 'PROBE_DEPTH';
    let spoken = "You're on the right track. Can you go one level deeper into the architectural details?";

    if (coverageRatio >= 0.85 || score >= 85) {
      quality = 'STRONG';
      action = 'NEXT_QUESTION';
      spoken = "Good explanation. You covered the key technical concepts well.";
    } else if (coverageRatio < 0.4 && words < 12) {
      quality = 'MISSING_DEPTH';
      action = 'SIMPLER_QUESTION';
      spoken = "That's a basic start. Let's break down the underlying concept further.";
    }

    return {
      intent: 'ANSWER',
      correctness: coverageRatio,
      conceptCoverage: coverageRatio,
      depth: Math.min(1.0, words / 40),
      clarity: 0.8,
      relevance: 0.85,
      confidence: words > 15 ? 0.8 : 0.5,
      coveredConcepts: covered,
      missingConcepts: missing,
      misconceptions: [],
      quality,
      score,
      feedback: `Identified ${covered.length}/${required.length || 1} core concepts in response.`,
      recommendedAction: action,
      spokenResponse: spoken,
      emotion: quality === 'STRONG' ? 'thoughtful' : 'curious',
      gesture: 'nod',
    };
  }
}
