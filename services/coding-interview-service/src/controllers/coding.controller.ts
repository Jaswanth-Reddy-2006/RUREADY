import { Request, Response, NextFunction } from 'express';
import { codingService } from '../services/coding.service.js';

export const codingController = {
  async createSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.userId || (req.headers['x-user-id'] as string);
      const { targetRole, difficulty, selectedLanguage } = req.body;
      const session = await codingService.createSession(userId, targetRole || 'Software Engineer', difficulty, selectedLanguage);
      res.status(201).json(session);
    } catch (err) {
      next(err);
    }
  },

  async getProblems(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const problems = await codingService.getProblems();
      res.status(200).json(problems);
    } catch (err) {
      next(err);
    }
  },

  async getProblemById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const problem = await codingService.getProblemById(id);
      res.status(200).json(problem);
    } catch (err) {
      next(err);
    }
  },

  async runTestCases(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.userId || (req.headers['x-user-id'] as string);
      const sessionId = req.params.id as string;
      const { code, language } = req.body;
      const result = await codingService.runTestCases(sessionId, userId, code, language);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },

  async getSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.userId || (req.headers['x-user-id'] as string);
      const sessionId = req.params.id as string;
      const session = await codingService.getSession(sessionId, userId);
      res.status(200).json(session);
    } catch (err) {
      next(err);
    }
  },
};
