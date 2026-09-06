// ═══════════════════════════════════════════════════════════════
// R U Ready? — Interview Controller
// Maps API routes to the Interview Service with Zod validation guards
// ═══════════════════════════════════════════════════════════════

import { Request, Response, NextFunction } from 'express';
import { interviewService } from '../services/interview.service.js';
import { z } from 'zod';
import { InterviewType, ExperienceLevel } from '@ru-ready/shared';
import { prisma } from '../lib/prisma.js';
import { codingService } from '../services/coding.service.js';
import fs from 'node:fs';
import path from 'node:path';

// Setup Form Validation Schema
export const createSessionSchema = z.object({
  interviewType: z.nativeEnum(InterviewType),
  targetRole: z.string().min(1, 'Target role is required'),
  targetCompany: z.string().optional(),
  industry: z.string().min(1, 'Industry is required'),
  experienceLevel: z.nativeEnum(ExperienceLevel),
  focusAreas: z.array(z.string()).min(1, 'Select at least one focus area'),
  interviewGoal: z.string().max(10000).optional(),
  durationMins: z.number().min(10).max(90).default(20),
  resumeId: z.string().optional(),
  mode: z.enum(['ORAL', 'CODING']).optional(),
});

// Answer Submission Schema
export const submitAnswerSchema = z.object({
  questionId: z.string().min(1, 'Question ID is required'),
  answerText: z.string().min(1, 'Answer text is required'),
  timeTaken: z.number().min(1, 'Time taken is required'),
});

const completeSessionSchema = z.object({
  confidenceMetrics: z
    .object({
      score: z.number().min(0).max(100),
      signals: z.object({
        avgWpm: z.number().min(0),
        avgPauseCount: z.number().min(0),
        avgAnswerLength: z.number().min(0),
      }),
    })
    .optional(),
  proctoring: z
    .object({
      eyeContactScore: z.number().min(0).max(100),
      presenceScore: z.number().min(0).max(100),
      tabBlurCount: z.number().min(0),
    })
    .optional(),
});

export const interviewController = {
  /**
   * POST /api/interview/session
   */
  async createSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const validated = createSessionSchema.parse(req.body);
      const session = await interviewService.createSession(userId, validated as any);
      res.status(201).json(session);
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/interview/session/:id/start
   */
  async startSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const sessionId = req.params.id as string;
      const firstQuestion = await interviewService.startSession(sessionId, userId);
      res.status(200).json(firstQuestion);
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/interview/session/:id/answer
   */
  async submitAnswer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const sessionId = req.params.id as string;
      const { questionId, answerText, timeTaken } = submitAnswerSchema.parse(req.body);

      const result = await interviewService.submitAnswer(
        sessionId,
        userId,
        questionId,
        answerText,
        timeTaken
      );

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/interview/session/:id/next
   */
  async getNextQuestion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const sessionId = req.params.id as string;
      const result = await interviewService.getNextQuestion(sessionId, userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/interview/session/:id/complete
   */
  async completeSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const sessionId = req.params.id as string;
      const { confidenceMetrics, proctoring } = completeSessionSchema.parse(req.body || {});
      const analysis = await interviewService.completeSession(
        sessionId,
        userId,
        confidenceMetrics,
        proctoring,
      );
      res.status(200).json(analysis);
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/interview/sessions
   */
  async listSessions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const sessions = await interviewService.listSessions(userId);
      res.status(200).json(sessions);
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/interview/session/:id/hint
   */
  async incrementHintCount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const sessionId = req.params.id as string;
      const hintCount = await interviewService.incrementHintCount(sessionId, userId);
      res.status(200).json({ hintCount });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/interview/session/:id
   */
  async getSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const sessionId = req.params.id as string;
      const session = await interviewService.getSession(sessionId, userId);
      res.status(200).json(session);
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/interview/session/:id/run
   */
  async runTestCases(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const sessionId = req.params.id as string;
      const { code, language } = req.body;

      if (!code) {
        res.status(400).json({ error: 'Code submission is empty.' });
        return;
      }

      // Fetch active session and questions
      const session = await prisma.interviewSession.findFirst({
        where: { id: sessionId, userId },
        include: {
          questions: {
            orderBy: { orderIndex: 'asc' },
          },
        },
      });

      if (!session) {
        res.status(404).json({ error: 'Session not found.' });
        return;
      }

      // Identify the active question being solved
      const activeQuestion = session.questions.find((q) => q.answerText === null) || session.questions[session.questions.length - 1];
      
      if (!activeQuestion) {
        res.status(400).json({ error: 'No active question found to run test cases against.' });
        return;
      }

      // Extract problem title from the question text (e.g. "PROBLEM: Palindrome Detector")
      const titleMatch = activeQuestion.questionText.match(/^PROBLEM:\s*(.+)$/m);
      const problemTitle = titleMatch ? titleMatch[1].trim() : '';

      // Query predefined problem with that title
      let problem = await prisma.preDefinedProblem.findFirst({
        where: { title: { contains: problemTitle } },
      });

      // Fallback: If not found, fetch by difficulty
      if (!problem) {
        const diff = activeQuestion.difficulty;
        problem = await prisma.preDefinedProblem.findFirst({
          where: { difficulty: diff },
        }) || await prisma.preDefinedProblem.findFirst();
      }

      if (!problem) {
        res.status(404).json({ error: 'Predefined algorithmic problem not found in the database.' });
        return;
      }

      // Evaluate the candidate's code against the test case matrix
      const runResult = await codingService.evaluateCode(code, problem.testCases, language || 'javascript');

      // Save execution delta log to DB
      await prisma.codeExecutionDelta.create({
        data: {
          sessionId,
          code,
          language: language || 'javascript',
          output: runResult.errorDetails || `Successfully passed ${runResult.passedCount}/${runResult.totalCount} test cases.`,
          success: runResult.success,
        },
      });

      // If all test cases passed, update session summary passed counter if applicable
      if (runResult.success) {
        await prisma.interviewSession.update({
          where: { id: sessionId },
          data: {
            testCasesPassed: runResult.passedCount,
            selectedLanguage: language || 'javascript',
          },
        });
      }

      res.status(200).json(runResult);
    } catch (error: any) {
      console.error('[RunTestCases Boundary] Failed to execute code sandboxing:', error);
      res.status(500).json({
        success: false,
        error: 'Compilation sandbox failed to start or write execution history.',
        passedCount: 0,
        totalCount: 0,
        errorDetails: error?.message || 'Database connection error during execution history logging.'
      });
    }
  },

  /**
   * POST /api/interview/session/:id/telemetry
   */
  async submitTelemetry(req: Request, res: Response, _next: NextFunction): Promise<void> {
    const sessionId = req.params.id as string;
    try {
      const userId = (req as any).user.userId;
      const items = req.body;

      const session = await prisma.interviewSession.findFirst({
        where: { id: sessionId, userId },
      });

      if (!session) {
        res.status(404).json({ error: 'Interview session not found' });
        return;
      }

      if (Array.isArray(items)) {
        await prisma.telemetryLog.createMany({
          data: items.map((item: any) => ({
            sessionId,
            type: item.type || item.metric,
            wordsPerMinute: item.wordsPerMinute || null,
            fillerWordsCount: item.fillerWordsCount || null,
            stressCoefficient: item.stressCoefficient != null ? item.stressCoefficient : (item.type === 'STRESS_COEFFICIENT' && item.value != null ? Number(item.value) : null),
            timestamp: item.timestamp ? new Date(item.timestamp) : new Date(),
          })),
        });
      }

      res.status(200).json({ success: true });
    } catch (error: any) {
      try {
        const logPath = path.resolve(process.cwd(), 'telemetry-errors.log');
        const errLog = `[${new Date().toISOString()}] Session ID: ${sessionId} - Error: ${error?.stack || error?.message || error}\n`;
        fs.appendFileSync(logPath, errLog, 'utf8');
      } catch (logErr) {
        console.error('[Telemetry Fail-safe] Failed to write to telemetry-errors.log:', logErr);
      }

      // Return successful response to the client to ensure active UI is never disrupted
      res.status(200).json({ success: true, warning: 'Telemetry buffered in fail-safe boundary.' });
    }
  },
};
