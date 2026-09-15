import { Request, Response, NextFunction } from 'express';
import { codingService } from '../services/coding.service.js';

export const codingController = {
  async createSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.userId || (req.headers['x-user-id'] as string);
      const { targetRole, difficulty, selectedLanguage, problemId } = req.body;
      const session = await codingService.createSession(
        userId,
        targetRole || 'Software Engineer',
        difficulty,
        selectedLanguage,
        problemId
      );
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
      const { code, language, problemId, customTestCase } = req.body;
      const result = await codingService.runTestCases(
        sessionId,
        userId,
        code,
        language,
        problemId,
        customTestCase
      );
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },

  async getIdealSolution(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const problemId = (req.params.problemId || req.query.problemId || 'two-sum') as string;
      const language = (req.query.language || 'javascript') as string;
      const ideal = await codingService.getIdealSolution(problemId, language);
      res.status(200).json(ideal);
    } catch (err) {
      next(err);
    }
  },

  async getProgressiveHint(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { problemId, hintLevel, code } = req.body;
      const hint = await codingService.getProgressiveHint(problemId || 'two-sum', hintLevel || 1, code);
      res.status(200).json(hint);
    } catch (err) {
      next(err);
    }
  },

  async getSocraticDialogue(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { problemId, message, code } = req.body;
      const dialogue = await codingService.getSocraticDialogue(problemId || 'two-sum', message || '', code);
      res.status(200).json(dialogue);
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
