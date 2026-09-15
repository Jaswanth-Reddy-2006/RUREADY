import { Request, Response, NextFunction } from 'express';
import { oralService } from '../services/oral.service.js';
import { z } from 'zod';

const createSessionSchema = z.object({
  interviewType: z.string().min(1),
  targetRole: z.string().min(1),
  targetCompany: z.string().optional(),
  industry: z.string().min(1),
  experienceLevel: z.string().min(1),
  focusAreas: z.array(z.string()).optional().default(['General Technical']),
  interviewGoal: z.string().optional(),
  durationMins: z.number().default(20),
  resumeId: z.string().optional().nullable(),
});

const submitAnswerSchema = z.object({
  questionId: z.string().min(1),
  answerText: z.string().min(1),
  timeTaken: z.number().min(1),
  isSkip: z.boolean().optional().default(false),
});

export const oralController = {
  async createSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.userId || (req.headers['x-user-id'] as string) || 'demo-user-123';
      const validated = createSessionSchema.parse(req.body);
      if (!validated.focusAreas || validated.focusAreas.length === 0) {
        validated.focusAreas = ['General Technical'];
      }
      const session = await oralService.createSession(userId, validated);
      res.status(201).json(session);
    } catch (err) {
      next(err);
    }
  },

  async startSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.userId || (req.headers['x-user-id'] as string) || 'demo-user-123';
      const sessionId = req.params.id as string;
      const result = await oralService.startSession(sessionId, userId);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },

  async submitAnswer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.userId || (req.headers['x-user-id'] as string) || 'demo-user-123';
      const sessionId = req.params.id as string;
      const { questionId, answerText, timeTaken, isSkip } = submitAnswerSchema.parse(req.body);
      const updated = await oralService.submitAnswer(sessionId, userId, questionId, answerText, timeTaken, isSkip);
      res.status(200).json(updated);
    } catch (err) {
      next(err);
    }
  },

  async getSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.userId || (req.headers['x-user-id'] as string) || 'demo-user-123';
      const sessionId = req.params.id as string;
      const session = await oralService.getSession(sessionId, userId);
      res.status(200).json(session);
    } catch (err) {
      next(err);
    }
  },

  async getNextQuestion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.userId || (req.headers['x-user-id'] as string) || 'demo-user-123';
      const sessionId = req.params.id as string;
      const question = await oralService.getNextQuestion(sessionId, userId);
      res.status(200).json(question);
    } catch (err) {
      next(err);
    }
  },

  async completeSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.userId || (req.headers['x-user-id'] as string) || 'demo-user-123';
      const sessionId = req.params.id as string;
      const session = await oralService.completeSession(sessionId, userId);
      res.status(200).json(session);
    } catch (err) {
      next(err);
    }
  },

  async listSessions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.userId || (req.headers['x-user-id'] as string) || 'demo-user-123';
      const sessions = await oralService.listSessions(userId);
      res.status(200).json(sessions);
    } catch (err) {
      next(err);
    }
  },

  async submitTelemetry(req: Request, res: Response): Promise<void> {
    res.status(200).json({ success: true, message: 'Telemetry received' });
  },
};
