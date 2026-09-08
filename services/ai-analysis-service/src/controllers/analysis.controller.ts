// ═══════════════════════════════════════════════════════════════
// AI & Analysis Microservice — Analysis Controller
// ═══════════════════════════════════════════════════════════════

import { Request, Response, NextFunction } from 'express';
import { analysisService } from '../services/analysis.service.js';
import { aiService } from '../services/ai.service.js';

export const analysisController = {
  async getSessionAnalysis(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.userId || (req.headers['x-user-id'] as string);
      const sessionId = req.params.id as string;
      const analysis = await analysisService.getSessionAnalysis(sessionId, userId);
      res.status(200).json(analysis);
    } catch (error) {
      next(error);
    }
  },

  async getAnalysisHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.userId || (req.headers['x-user-id'] as string);
      const historyStats = await analysisService.getAnalysisHistory(userId);
      res.status(200).json(historyStats);
    } catch (error) {
      next(error);
    }
  },

  async evaluateSessionInternal(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sessionId, confidenceMetrics, proctoring } = req.body;
      const analysis = await analysisService.compileHolisticSessionAnalysis(sessionId, confidenceMetrics, proctoring);
      res.status(200).json(analysis);
    } catch (error) {
      next(error);
    }
  },

  async generateNextQuestionInternal(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { session, previousQA, orderIndex } = req.body;
      const question = await aiService.generateNextQuestion(session, previousQA, orderIndex);
      res.status(200).json(question);
    } catch (error) {
      next(error);
    }
  },

  async evaluateAnswerInternal(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { questionText, questionType, answerText, session } = req.body;
      const evalResult = await aiService.evaluateAnswer(questionText, questionType, answerText, session);
      res.status(200).json(evalResult);
    } catch (error) {
      next(error);
    }
  },
};
