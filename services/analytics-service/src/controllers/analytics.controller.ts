import { Request, Response, NextFunction } from 'express';
import { analyticsService } from '../services/analytics.service.js';

export const analyticsController = {
  async getAnalysis(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessionId = req.params.sessionId as string;
      const analysis = await analyticsService.getAnalysisBySessionId(sessionId);
      res.status(200).json(analysis);
    } catch (err) {
      next(err);
    }
  },

  async submitTelemetry(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessionId = req.params.sessionId as string;
      const result = await analyticsService.submitTelemetry(sessionId, req.body);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },

  async getDashboardMetrics(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const metrics = await analyticsService.getDashboardMetrics();
      res.status(200).json(metrics);
    } catch (err) {
      next(err);
    }
  },
};
