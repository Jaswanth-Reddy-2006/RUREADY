// ═══════════════════════════════════════════════════════════════
// R U Ready? — Interview Service
// Handles session logic, adaptive question flows, and evaluation triggers
// ═══════════════════════════════════════════════════════════════

import { prisma } from '../lib/prisma.js';
import { aiService } from './ai.service.js';
import { analysisService } from './analysis.service.js';
import { BadRequestError, NotFoundError } from '../lib/errors.js';
import {
  CreateSessionRequest,
  SessionStatus,
  InterviewSession,
  Question,
  Analysis,
} from '@ru-ready/shared';

function parseEvalMeta(feedback: string | null | undefined) {
  if (!feedback) return {};
  const match = feedback.match(/<!--EVAL_META([\s\S]*?)EVAL_META-->/);
  if (!match) return {};
  try {
    return JSON.parse(match[1]) as {
      needsFollowUp?: boolean;
      followUpReason?: string;
      gaps?: string[];
    };
  } catch {
    return {};
  }
}

export const interviewService = {
  /**
   * Create a new interview session in SETUP status.
   */
  async createSession(userId: string, data: CreateSessionRequest): Promise<InterviewSession> {
    const session = await prisma.interviewSession.create({
      data: {
        userId,
        interviewType: data.interviewType,
        targetRole: data.targetRole,
        targetCompany: data.targetCompany || null,
        industry: data.industry,
        experienceLevel: data.experienceLevel,
        focusAreas: data.focusAreas,
        interviewGoal: data.interviewGoal || null,
        durationMins: data.durationMins || 20,
        resumeId: data.resumeId || null,
        status: SessionStatus.SETUP,
        mode: (data as any).mode || 'ORAL',
      },
      include: {
        resume: true,
      },
    });

    return session as unknown as InterviewSession;
  },

  /**
   * Start the session: transitions status and generates the first question.
   */
  async startSession(sessionId: string, userId: string): Promise<Question> {
    const session = await prisma.interviewSession.findFirst({
      where: { id: sessionId, userId },
      include: { resume: true, questions: true },
    });

    if (!session) {
      throw new NotFoundError('Interview session not found');
    }

    if (session.status !== SessionStatus.SETUP) {
      // If already in progress, return the first question if it exists, otherwise generate one
      if (session.questions.length > 0) {
        const firstQ = session.questions.find((q) => q.orderIndex === 0);
        if (firstQ) return firstQ as unknown as Question;
      }
    }

    // Dynamic first question generation
    const generated = await aiService.generateNextQuestion(
      session as unknown as InterviewSession,
      [],
      0
    );

    // Update session status and create the first question in one transaction
    const [_, firstQuestion] = await prisma.$transaction([
      prisma.interviewSession.update({
        where: { id: sessionId },
        data: {
          status: SessionStatus.IN_PROGRESS,
          startedAt: new Date(),
        },
      }),
      prisma.question.create({
        data: {
          sessionId,
          orderIndex: 0,
          questionText: generated.questionText,
          questionType: generated.questionType,
          difficulty: generated.difficulty,
        },
      }),
    ]);

    return firstQuestion as unknown as Question;
  },

  /**
   * Record candidate's answer to a question.
   */
  async submitAnswer(
    sessionId: string,
    userId: string,
    questionId: string,
    answerText: string,
    timeTakenSecs: number
  ): Promise<{ question: Question; evaluation: Awaited<ReturnType<typeof aiService.evaluateAnswer>> }> {
    const session = await prisma.interviewSession.findFirst({
      where: { id: sessionId, userId },
    });

    if (!session) {
      throw new NotFoundError('Interview session not found');
    }

    if (session.status !== SessionStatus.IN_PROGRESS) {
      throw new BadRequestError('Interview session is not active');
    }

    const question = await prisma.question.findFirst({
      where: { id: questionId, sessionId },
    });

    if (!question) {
      throw new NotFoundError('Question not found in this session');
    }

    const sessionWithResume = await prisma.interviewSession.findFirst({
      where: { id: sessionId, userId },
      include: { resume: true },
    });

    if (!sessionWithResume) {
      throw new NotFoundError('Interview session not found');
    }

    const sessionCtx = sessionWithResume as unknown as InterviewSession;

    let cleanedAnswer = '';
    let evalData;

    const normAnswer = answerText.toLowerCase().replace(/[^a-z0-9'\s]/g, '').trim();
    const skipPhrases = [
      "i don't know", "i dont know", "i do not know",
      "skip this question", "skip the question", "skip this",
      "go to the next question", "next question", "please skip",
      "pass this question", "pass on this", "i don't know the answer",
      "i dont know the answer", "i don't know this answer", "i dont know this answer",
      "dont know", "no idea", "i have no idea", "dont have any idea", "i do not have any idea"
    ];
    const isSkip = skipPhrases.some(phrase => normAnswer.includes(phrase)) || normAnswer === 'skip' || normAnswer === 'pass';

    if (isSkip) {
      cleanedAnswer = "Candidate skipped this question (I don't know).";
      evalData = {
        score: 0,
        feedback: "You chose to skip this question. In a real interview, if you don't know the answer, it is best to explain your initial thoughts, state what you *do* know about related concepts, or ask clarifying questions rather than skipping entirely.",
        strengths: [] as string[],
        weaknesses: ["Skipped the question"] as string[],
        betterAnswer: "A good way to handle this: 'I am not fully familiar with this specific technology, but based on my knowledge of related systems, I would expect it to work like...'",
        technicalDepth: 0,
        subjectCoverage: 0,
        communicationClarity: 0,
        completeness: 0,
        topicsCovered: [] as string[],
        gaps: ["Skipped question"] as string[],
        needsFollowUp: false,
        followUpReason: "",
      };
    } else {
      const wordCount = answerText.trim().split(/\s+/).filter(Boolean).length;
      if (wordCount < 10) {
        cleanedAnswer = answerText;
        evalData = await aiService.evaluateAnswer(
          question.questionText,
          question.questionType as Parameters<typeof aiService.evaluateAnswer>[1],
          answerText,
          sessionCtx,
        );
      } else {
        const [enhancedText, evaluationResult] = await Promise.all([
          aiService.enhanceTranscript(
            answerText,
            question.questionText,
            sessionCtx,
          ),
          aiService.evaluateAnswer(
            question.questionText,
            question.questionType as Parameters<typeof aiService.evaluateAnswer>[1],
            answerText,
            sessionCtx,
          )
        ]);
        cleanedAnswer = enhancedText;
        evalData = evaluationResult;
      }
    }

    const evalMeta = {
      technicalDepth: evalData.technicalDepth,
      subjectCoverage: evalData.subjectCoverage,
      communicationClarity: evalData.communicationClarity,
      completeness: evalData.completeness,
      topicsCovered: evalData.topicsCovered,
      gaps: evalData.gaps,
      needsFollowUp: evalData.needsFollowUp,
      followUpReason: evalData.followUpReason,
      starCompliance: evalData.starCompliance,
      tutorialCopierFlag: evalData.tutorialCopierFlag,
      technicalOriginality: evalData.technicalOriginality,
      algorithmicEfficiency: evalData.algorithmicEfficiency,
      codeQuality: evalData.codeQuality,
      complexityJustification: evalData.complexityJustification,
      phaseReached: evalData.phaseReached,
    };

    const updatedQuestion = await prisma.question.update({
      where: { id: questionId },
      data: {
        answerText: cleanedAnswer,
        answeredAt: new Date(),
        timeTakenSecs,
        evalScore: evalData.score,
        evalFeedback: `${evalData.feedback}\n<!--EVAL_META${JSON.stringify(evalMeta)}EVAL_META-->`,
        evalStrengths: evalData.strengths,
        evalWeaknesses: evalData.weaknesses,
        betterAnswer: evalData.betterAnswer,
      },
    });

    return {
      question: updatedQuestion as unknown as Question,
      evaluation: evalData,
    };
  },

  /**
   * Fetch or dynamically generate the next question.
   */
  async getNextQuestion(
    sessionId: string,
    userId: string
  ): Promise<{ question: Question | null; isComplete: boolean }> {
    const session = await prisma.interviewSession.findFirst({
      where: { id: sessionId, userId },
      include: {
        resume: true,
        questions: {
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    if (!session) {
      throw new NotFoundError('Interview session not found');
    }

    if (session.status !== SessionStatus.IN_PROGRESS) {
      throw new BadRequestError('Interview session is not active');
    }

    const questions = session.questions;
    const answeredQuestions = questions.filter((q) => q.answerText !== null);
    const answeredCount = answeredQuestions.length;

    const normalizeText = (text: string) => text.toLowerCase().replace(/\s+/g, ' ').trim();
    const isSignoff = (text: string) => {
      const normalized = normalizeText(text);
      return ["that's it", "that's all", 'thats it', 'thats all', 'done', 'no more', 'nothing else']
        .some((phrase) => normalized.includes(phrase));
    };
    const wordCount = (text: string) => normalizeText(text).split(' ').filter(Boolean).length;

    const lastAnswerText = answeredQuestions[answeredQuestions.length - 1]?.answerText || '';
    const lastWordCount = lastAnswerText ? wordCount(lastAnswerText) : 0;
    const lastSignoff = lastAnswerText ? isSignoff(lastAnswerText) : false;
    const shortAnswer = lastWordCount > 0 && lastWordCount < 25;

    // Dynamic question bounds based on session duration (Timer) and answer quality
    let minQuestions = 4;
    let baseMax = 6;

    if (session.durationMins <= 12) {
      minQuestions = 3;
      baseMax = 3;
    } else if (session.durationMins <= 22) {
      minQuestions = 5;
      baseMax = 5;
    } else if (session.durationMins <= 35) {
      minQuestions = 8;
      baseMax = 8;
    } else {
      minQuestions = session.durationMins <= 15 ? 3 : (session.durationMins <= 30 ? 4 : 6);
      baseMax = session.durationMins <= 15 ? 5 : (session.durationMins <= 30 ? 7 : 10);
    }

    const goalStr = session.interviewGoal || '';
    const qCountMatch = goalStr.match(/\[QuestionCount:\s*(\d+)\]/i);
    if (qCountMatch) {
      const qCount = parseInt(qCountMatch[1], 10);
      minQuestions = qCount;
      baseMax = qCount;
    }

    // Only allow extra follow-up questions if a specific hard count override was not set
    const extraQuestions = (shortAnswer || lastSignoff) && !qCountMatch && !['10', '20', '30'].includes(String(session.durationMins)) ? 2 : 0;
    const maxQuestions = baseMax + extraQuestions;

    if (answeredCount >= maxQuestions || (answeredCount >= minQuestions && !shortAnswer && !lastSignoff && answeredCount >= baseMax)) {
      return { question: null, isComplete: true };
    }

    // Check if the next question is already generated but not answered
    const nextQ = questions.find((q) => q.orderIndex === answeredCount);
    if (nextQ) {
      return { question: nextQ as unknown as Question, isComplete: false };
    }

    // Generate next adaptive question using AI service
    const previousQA = questions
      .filter((q) => q.answerText !== null)
      .map((q) => {
        const meta = parseEvalMeta(q.evalFeedback);
        return {
          questionText: q.questionText,
          answerText: q.answerText || '',
          score: q.evalScore ?? undefined,
          wordCount: q.answerText ? wordCount(q.answerText) : 0,
          signoff: q.answerText ? isSignoff(q.answerText) : false,
          needsFollowUp: meta.needsFollowUp,
          followUpReason: meta.followUpReason,
          gaps: meta.gaps,
        };
      });

    const generated = await aiService.generateNextQuestion(
      session as unknown as InterviewSession,
      previousQA,
      answeredCount
    );

    // Save and return new question
    const newQuestion = await prisma.question.create({
      data: {
        sessionId,
        orderIndex: answeredCount,
        questionText: generated.questionText,
        questionType: generated.questionType,
        difficulty: generated.difficulty,
      },
    });

    return { question: newQuestion as unknown as Question, isComplete: false };
  },

  /**
   * Complete session: evaluate all answers & compile aggregate report report.
   */
  async completeSession(
    sessionId: string,
    userId: string,
    confidenceMetrics?: {
      score: number;
      signals: {
        avgWpm: number;
        avgPauseCount: number;
        avgAnswerLength: number;
      };
    },
    proctoring?: {
      eyeContactScore: number;
      presenceScore: number;
      tabBlurCount: number;
    },
  ): Promise<Analysis> {
    const session = await prisma.interviewSession.findFirst({
      where: { id: sessionId, userId },
      include: {
        resume: true,
        questions: {
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    if (!session) {
      throw new NotFoundError('Interview session not found');
    }

    if (session.status === SessionStatus.ANALYSED) {
      const existingAnalysis = await prisma.analysis.findUnique({
        where: { sessionId },
      });
      if (existingAnalysis) return existingAnalysis as unknown as Analysis;
    }

    // 1. Evaluate individual questions that have answers in parallel
    const evaluationPromises = session.questions.map(async (q) => {
      if (q.answerText && !q.evalScore) {
        // Trigger AI evaluation per question
        const evalData = await aiService.evaluateAnswer(
          q.questionText,
          q.questionType as any,
          q.answerText,
          session as unknown as InterviewSession
        );

        const evalMeta = {
          technicalDepth: evalData.technicalDepth,
          subjectCoverage: evalData.subjectCoverage,
          communicationClarity: evalData.communicationClarity,
          completeness: evalData.completeness,
          topicsCovered: evalData.topicsCovered,
          gaps: evalData.gaps,
          needsFollowUp: evalData.needsFollowUp,
          followUpReason: evalData.followUpReason,
          starCompliance: evalData.starCompliance,
          tutorialCopierFlag: evalData.tutorialCopierFlag,
          technicalOriginality: evalData.technicalOriginality,
          algorithmicEfficiency: evalData.algorithmicEfficiency,
          codeQuality: evalData.codeQuality,
          complexityJustification: evalData.complexityJustification,
          phaseReached: evalData.phaseReached,
        };

        // Update question record
        await prisma.question.update({
          where: { id: q.id },
          data: {
            evalScore: evalData.score,
            evalFeedback: `${evalData.feedback}\n<!--EVAL_META${JSON.stringify(evalMeta)}EVAL_META-->`,
            evalStrengths: evalData.strengths,
            evalWeaknesses: evalData.weaknesses,
            betterAnswer: evalData.betterAnswer,
          },
        });

        return {
          questionText: q.questionText,
          questionType: q.questionType,
          answerText: q.answerText,
          score: evalData.score,
          feedback: evalData.feedback,
        };
      } else if (q.answerText && q.evalScore) {
        return {
          questionText: q.questionText,
          questionType: q.questionType,
          answerText: q.answerText,
          score: q.evalScore,
          feedback: q.evalFeedback || '',
        };
      }
      return null;
    });

    const evaluationResults = await Promise.all(evaluationPromises);
    const evaluatedQuestions = evaluationResults.filter(
      (item): item is NonNullable<typeof item> => item !== null
    );

    // 2. Generate aggregate performance analysis report using the holistic analysis service
    const analysis = await analysisService.compileHolisticSessionAnalysis(
      sessionId,
      confidenceMetrics,
      proctoring
    );

    // 3. Finalize session state
    await prisma.interviewSession.update({
      where: { id: sessionId },
      data: {
        status: SessionStatus.ANALYSED,
        completedAt: new Date(),
      },
    });

    return analysis as unknown as Analysis;
  },

  /**
   * List sessions of the logged in user.
   */
  async listSessions(userId: string): Promise<InterviewSession[]> {
    const sessions = await prisma.interviewSession.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        analysis: true,
        questions: true,
      },
    });

    return sessions as unknown as InterviewSession[];
  },

  async incrementHintCount(sessionId: string, userId: string): Promise<number> {
    const session = await prisma.interviewSession.findFirst({
      where: { id: sessionId, userId },
    });

    if (!session) {
      throw new NotFoundError('Interview session not found');
    }

    const updated = await prisma.interviewSession.update({
      where: { id: sessionId },
      data: {
        hintCount: {
          increment: 1,
        },
      },
    });

    return updated.hintCount;
  },

  /**
   * Get specific session details.
   */
  async getSession(sessionId: string, userId: string): Promise<InterviewSession> {
    const session = await prisma.interviewSession.findFirst({
      where: { id: sessionId, userId },
      include: {
        questions: {
          orderBy: { orderIndex: 'asc' },
        },
        analysis: true,
        resume: true,
        telemetryLogs: {
          select: {
            id: true,
            type: true,
            stressCoefficient: true,
            timestamp: true,
          },
        },
      },
    });

    if (!session) {
      throw new NotFoundError('Interview session not found');
    }

    return session as unknown as InterviewSession;
  },
};
