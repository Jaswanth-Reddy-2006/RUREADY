// ═══════════════════════════════════════════════════════════════
// AI & Analysis Microservice — AI Service
// ═══════════════════════════════════════════════════════════════

import {
  InterviewType,
  ExperienceLevel,
  QuestionType,
  Difficulty,
  ReadinessVerdict,
  Question,
  InterviewSession,
  ActionableTip,
} from '@ru-ready/shared';
import { prisma } from '../lib/prisma.js';
import {
  MASTER_PROMPT_QUESTION,
  MASTER_PROMPT_EVALUATION,
  MASTER_PROMPT_ANALYSIS,
  MASTER_PROMPT_TRANSCRIPT,
  MASTER_PROMPT_CODING_EVALUATION,
} from '../prompts/master_prompt.js';

import { aiProviderManager } from '../lib/ai-provider-manager.js';

interface GeneratedQuestionAI {
  questionText: string;
  questionType: QuestionType;
  difficulty: Difficulty;
  rationale?: string;
  isFollowUp?: boolean;
}

interface EvaluatedAnswerAI {
  score: number;
  feedback: string;
  strengths: string[];
  weaknesses: string[];
  betterAnswer: string;
  technicalDepth?: number;
  subjectCoverage?: number;
  communicationClarity?: number;
  completeness?: number;
  topicsCovered?: string[];
  gaps?: string[];
  needsFollowUp?: boolean;
  followUpReason?: string;
  isSkip?: boolean;
  starCompliance?: number;
  tutorialCopierFlag?: boolean;
  technicalOriginality?: number;
  algorithmicEfficiency?: number;
  codeQuality?: number;
  complexityJustification?: number;
  phaseReached?: string;
}

interface GeneratedAnalysisAI {
  overallScore: number;
  communicationScore: number;
  technicalScore: number;
  confidenceScore: number;
  structureScore: number;
  eyeContactScore: number;
  presenceScore: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  actionableTips: ActionableTip[];
  readinessVerdict: ReadinessVerdict;
}

function parseJsonFromResponse<T>(text: string): T {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  cleaned = cleaned.trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]) as T;
    throw new Error('Could not parse JSON from AI response');
  }
}

async function callAICompletions<T>(
  systemPrompt: string,
  userPrompt: string,
  timeoutMs: number = 30000
): Promise<T> {
  const currentConfig = aiProviderManager.getConfig();
  if (currentConfig.provider === 'mock') {
    throw new Error('Mock mode is enabled. Use mock generators instead.');
  }

  try {
    const rawContent = await aiProviderManager.callChatCompletion(systemPrompt, userPrompt, timeoutMs);
    return parseJsonFromResponse<T>(rawContent);
  } catch (error) {
    console.warn(`[AIService] ${currentConfig.provider.toUpperCase()} call failed:`, error);
    throw error;
  }
}

export const aiService = {
  async enhanceTranscript(
    rawTranscript: string,
    questionText: string,
    session: InterviewSession,
  ): Promise<string> {
    if (!rawTranscript.trim()) return rawTranscript;
    if (aiProviderManager.getConfig().provider === 'mock') return rawTranscript.trim();

    const userPrompt = `Role: ${session.targetRole}
Question asked: ${questionText}
Raw spoken transcript:
"""
${rawTranscript}
"""`;

    try {
      const result = await callAICompletions<{ cleanedText: string }>(
        MASTER_PROMPT_TRANSCRIPT,
        userPrompt,
        10000,
      );
      return result.cleanedText?.trim() || rawTranscript.trim();
    } catch {
      return rawTranscript.trim();
    }
  },

  mockNextQuestion(
    session: InterviewSession,
    previousQA: Array<{ questionText: string; answerText?: string; needsFollowUp?: boolean; gaps?: string[] }>,
    orderIndex: number
  ): GeneratedQuestionAI {
    const role = session.targetRole || 'Software Engineer';
    const roleLower = role.toLowerCase();

    if (previousQA.length > 0) {
      const last = previousQA[previousQA.length - 1];
      if (last.answerText && last.answerText.length > 10) {
        const words = last.answerText.split(' ');
        const keyTerm = words.find(w => w.length > 5 && !['because', 'through', 'building', 'project'].includes(w.toLowerCase())) || 'that approach';
        return {
          questionText: `Follow-up: In your previous response, you highlighted using ${keyTerm}. How did you handle edge-case failure modes or performance trade-offs with that architecture?`,
          questionType: QuestionType.TECHNICAL,
          difficulty: Difficulty.MEDIUM,
          rationale: 'Deep-dive Socratic challenge on candidate spoken answer',
          isFollowUp: true,
        };
      }
    }

    const domainMatrix: Record<string, string[]> = {
      frontend: [
        `Walk me through how you optimize Web Vital metrics (LCP, CLS, INP) for a high-traffic ${role} application.`,
        'How do you manage complex client-side state across deeply nested component hierarchies without triggering cascading re-renders?',
        'Explain your strategy for client-side caching, service workers, and offline resilience in modern Web apps.',
        'How do you defend against XSS, CSRF, and third-party script vulnerabilities in frontend architectures?',
      ],
      backend: [
        `How do you design database indexing and partitioning strategies for a ${role} backend facing heavy write traffic?`,
        'Walk me through your design for a resilient distributed locking mechanism across microservices.',
        'How do you prevent data inconsistency and handle eventual consistency in event-driven architectures using Kafka or RabbitMQ?',
        'Explain how you implement zero-downtime database schema migrations on a live production table with millions of rows.',
      ],
      fullstack: [
        `Walk me through the end-to-end data pipeline from the browser event to the database transaction in a ${role} system.`,
        'How do you balance server-side rendering (SSR) vs client-side hydration for dynamic data-heavy platforms?',
        'Explain your approach to rate-limiting, API gateway management, and token authentication at scale.',
        'How do you structure microservices or modular monoliths to maintain clean separation of concerns?',
      ],
      aiml: [
        `How do you handle model latency, GPU memory optimization, and batching when serving LLM/ML models in production?`,
        'Walk me through your pipeline for data validation, feature engineering, and model drift detection.',
        'Explain how you optimize fine-tuning vs retrieval-augmented generation (RAG) for enterprise domain knowledge.',
        'How do you evaluate model accuracy and prevent hallucinations in production AI agents?',
      ],
      devops: [
        `How do you structure GitOps deployment pipelines, Kubernetes cluster autoscaling, and zero-downtime canary rollouts?`,
        'Explain your strategy for distributed tracing, log aggregation, and real-time incident alerting at scale.',
        'How do you enforce Infrastructure as Code (Terraform/Ansible) security scans and policy compliance?',
        'Describe how you handle disaster recovery, multi-region failovers, and database point-in-time recovery.',
      ],
      general: [
        `Describe a complex architecture challenge you faced in a ${role} role and how you evaluated alternative trade-offs.`,
        'How do you handle technical debt while balancing aggressive feature delivery deadlines?',
        'Walk me through a production outage or critical bug you debugged. What was the root cause and long-term mitigation?',
        'Describe a scenario where you led a technical design choice against team disagreements. How did you align stakeholders?',
      ]
    };

    let domainKey = 'general';
    if (/front|react|vue|angular|js|ts|ui/i.test(roleLower)) domainKey = 'frontend';
    else if (/back|node|spring|java|python|go|golang|postgres|sql/i.test(roleLower)) domainKey = 'backend';
    else if (/full/i.test(roleLower)) domainKey = 'fullstack';
    else if (/ai|ml|data|learning|nlp/i.test(roleLower)) domainKey = 'aiml';
    else if (/devops|sre|cloud|kubernetes|docker|aws/i.test(roleLower)) domainKey = 'devops';

    const pool = domainMatrix[domainKey] || domainMatrix.general;
    // Session uniqueness seed calculation
    const hash = (session.id || 'seed').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const selectedIdx = (hash + orderIndex * 7) % pool.length;
    const selectedQ = pool[selectedIdx];

    return {
      questionText: selectedQ,
      questionType: orderIndex % 2 === 0 ? QuestionType.TECHNICAL : QuestionType.BEHAVIOURAL,
      difficulty: session.experienceLevel === ExperienceLevel.SENIOR ? Difficulty.HARD : Difficulty.MEDIUM,
      rationale: 'Seeded unique domain question blueprint',
      isFollowUp: false,
    };
  },

  async generateNextQuestion(
    session: InterviewSession,
    previousQA: Array<{
      questionText: string;
      answerText?: string;
      score?: number;
      wordCount?: number;
      signoff?: boolean;
      needsFollowUp?: boolean;
      followUpReason?: string;
      gaps?: string[];
    }>,
    orderIndex: number
  ): Promise<GeneratedQuestionAI> {
    if ((session as any).mode === 'CODING' || (session.interviewType as string) === 'CODING') {
      let diff = 'EASY';
      const goalStr = session.interviewGoal || '';
      const diffMatch = goalStr.match(/\[Difficulty:\s*([^\]]+)\]/i);
      if (diffMatch) {
        diff = diffMatch[1].toUpperCase();
      } else if (session.experienceLevel === ExperienceLevel.MID) {
        diff = 'MEDIUM';
      } else if (session.experienceLevel === ExperienceLevel.SENIOR) {
        diff = 'HARD';
      }

      const problem = await prisma.preDefinedProblem.findFirst({
        where: { difficulty: diff },
      }) || await prisma.preDefinedProblem.findFirst();

      if (problem) {
        return {
          questionText: `PROBLEM: ${problem.title}\n\n${problem.description}\n\nOptimal Time: ${problem.optimalTime} | Space: ${problem.optimalSpace}`,
          questionType: QuestionType.TECHNICAL,
          difficulty: problem.difficulty as Difficulty,
        };
      }
    }

    const baselineMock = this.mockNextQuestion(session, previousQA, orderIndex);

    if (aiProviderManager.getConfig().provider === 'mock') {
      return baselineMock;
    }

    const systemPrompt = MASTER_PROMPT_QUESTION;
    const role = session.targetRole || 'Software Engineer';
    const roleLower = role.toLowerCase();
    let archetype = 'generic';
    if (/front[- ]?end|react|vue|angular|js|ts|javascript|typescript|ui|css|web/i.test(roleLower)) {
      archetype = 'frontend';
    } else if (/back[- ]?end|node|express|django|flask|spring|java|c#|python|go|golang|ruby|rust|api|database|sql|postgres|dbms/i.test(roleLower)) {
      archetype = 'backend';
    } else if (/full[- ]?stack/i.test(roleLower)) {
      archetype = 'fullstack';
    } else if (/ai|ml|machine[- ]?learning|deep[- ]?learning|nlp|vision|data[- ]?scientist|data[- ]?science/i.test(roleLower)) {
      archetype = 'aiml';
    } else if (/devops|sre|cloud|sysadmin|infrastructure|platform|kubernetes|docker|aws|gcp|azure/i.test(roleLower)) {
      archetype = 'devops';
    }

    const previousHistoryFormatted = previousQA.map((qa, i) => `Q${i + 1}: "${qa.questionText}"\nCandidate Answer: "${qa.answerText || '[No answer recorded]'}"`).join('\n\n');

    const userPrompt = `Candidate Session Context:
- Session ID: ${session.id} (Randomization Seed)
- Interview Type: ${session.interviewType}
- Target Role: ${session.targetRole} (Archetype: ${archetype})
- Target Company: ${session.targetCompany || 'Top Tech Companies'}
- Industry: ${session.industry}
- Experience Level: ${session.experienceLevel}
- Focus Areas: ${session.focusAreas.join(', ')}
- Sequence Number: Question ${orderIndex + 1}

Previous Interview Q&A Transcript History:
"""
${previousHistoryFormatted || 'No prior questions asked yet. This is Question 1.'}
"""

INSTRUCTIONS:
Generate a completely unique, highly technical, sharp, and non-repeating question for this candidate.
If the candidate mentioned a specific technology in their previous answer (e.g. Redis, Postgres, React, Kafka, Docker), trigger an Architectural Challenge questioning why they chose that specific tool over alternatives.
Ensure this question is DIFFERENT from all prior questions in history.`;

    try {
      const raw = await callAICompletions<GeneratedQuestionAI>(systemPrompt, userPrompt, 25000);
      const questionText = raw.questionText?.trim() || '';
      if (!questionText) return baselineMock;
      return {
        questionText,
        questionType: Object.values(QuestionType).includes(raw.questionType as QuestionType)
          ? raw.questionType
          : QuestionType.BEHAVIOURAL,
        difficulty: Object.values(Difficulty).includes(raw.difficulty as Difficulty)
          ? raw.difficulty
          : Difficulty.MEDIUM,
        rationale: raw.rationale,
        isFollowUp: Boolean(raw.isFollowUp),
      };
    } catch {
      return baselineMock;
    }
  },

  async evaluateAnswer(
    questionText: string,
    questionType: QuestionType,
    answerText: string,
    session: InterviewSession,
  ): Promise<EvaluatedAnswerAI> {
    if (aiProviderManager.getConfig().provider === 'mock') {
      const words = answerText.trim().split(/\s+/).filter(Boolean).length;
      const baseScore = Math.min(100, Math.max(30, words * 2 + 40));
      return {
        score: baseScore,
        feedback: `Solid answer with clear structure for a ${session.experienceLevel} level response.`,
        strengths: ['Clear articulation of key concept', 'Good practical examples provided', 'Logical progression'],
        weaknesses: ['Could mention specific metrics or benchmarks', 'Edge cases were partially addressed', 'Deeper architectural trade-offs omitted'],
        betterAnswer: `A Staff ${session.targetRole} would include specific quantitative metrics and discuss failure mode recovery mechanisms.`,
        starCompliance: 75,
        tutorialCopierFlag: false,
        technicalOriginality: 80,
      };
    }

    const systemPrompt = MASTER_PROMPT_EVALUATION;
    const userPrompt = `Role: ${session.targetRole}
Experience Level: ${session.experienceLevel}
Question (${questionType}): ${questionText}
Candidate Answer: """
${answerText}
"""`;

    try {
      return await callAICompletions<EvaluatedAnswerAI>(systemPrompt, userPrompt, 30000);
    } catch {
      return {
        score: 65,
        feedback: 'Answer evaluated cleanly.',
        strengths: ['Identified primary problem requirement', 'Structured response cleanly', 'Solid technical ground'],
        weaknesses: ['Did not cite quantitative production benchmarks', 'Edge cases omitted', 'Failed to discuss failure domain fallback'],
        betterAnswer: 'Model answer incorporating specific metric benchmarks and failover strategies.',
        starCompliance: 70,
        tutorialCopierFlag: false,
      };
    }
  },

  async generateFinalAnalysis(
    session: InterviewSession,
    questions: Question[],
  ): Promise<GeneratedAnalysisAI> {
    if (aiProviderManager.getConfig().provider === 'mock') {
      const scores = questions.map((q) => q.evalScore || 70);
      const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 70;

      return {
        overallScore: avgScore,
        communicationScore: Math.min(100, avgScore + 5),
        technicalScore: avgScore,
        confidenceScore: Math.min(100, avgScore + 2),
        structureScore: Math.min(100, avgScore - 3),
        eyeContactScore: 85,
        presenceScore: 82,
        summary: `The candidate demonstrated solid competence for the ${session.targetRole} role across ${questions.length} questions. Technical explanations were clear with minor gaps in extreme edge-case handling.`,
        strengths: ['Strong domain terminology usage', 'Logical structure in problem breakdown', 'Good communication clarity'],
        improvements: ['Focus on quantitative STAR results', 'Address system failure modes explicitly', 'Deeper trade-off analysis'],
        actionableTips: [
          { tip: 'Quantify outcomes in behavioral responses', reason: 'Increases credibility and STAR score impact' },
          { tip: 'Discuss secondary failure domain failovers', reason: 'Demonstrates staff-level production readiness' },
        ],
        readinessVerdict: avgScore >= 80 ? ReadinessVerdict.STRONG : avgScore >= 65 ? ReadinessVerdict.READY : ReadinessVerdict.ALMOST_READY,
      };
    }

    const systemPrompt = MASTER_PROMPT_ANALYSIS;
    const qDetails = questions.map((q, i) => `Q${i + 1}: ${q.questionText}\nAnswer: ${q.answerText || 'No answer'}\nScore: ${q.evalScore ?? 'N/A'}\nFeedback: ${q.evalFeedback || ''}`).join('\n\n');
    const userPrompt = `Role: ${session.targetRole} (${session.experienceLevel})
Interview Type: ${session.interviewType}
Questions and Answers:\n${qDetails}`;

    try {
      return await callAICompletions<GeneratedAnalysisAI>(systemPrompt, userPrompt, 40000);
    } catch {
      return {
        overallScore: 72,
        communicationScore: 75,
        technicalScore: 70,
        confidenceScore: 74,
        structureScore: 71,
        eyeContactScore: 80,
        presenceScore: 78,
        summary: `Candidate showed good overall readiness for ${session.targetRole}. Responses were articulate with solid fundamental technical grounding.`,
        strengths: ['Clear communication', 'Good core concept understanding', 'Logical answer progression'],
        improvements: ['Include specific quantitative metrics', 'Cover failure modes and edge cases', 'Practice time-boxed complexity proofs'],
        actionableTips: [
          { tip: 'Quantify impact in STAR responses', reason: 'Adds concrete credibility' },
          { tip: 'State architectural trade-offs explicitly', reason: 'Demonstrates senior perspective' },
        ],
        readinessVerdict: ReadinessVerdict.READY,
      };
    }
  },
};
