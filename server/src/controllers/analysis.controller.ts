// ═══════════════════════════════════════════════════════════════
// R U Ready? — Analysis Controller
// Maps API routes to the Analysis Service
// ═══════════════════════════════════════════════════════════════

import { Request, Response, NextFunction } from 'express';
import { analysisService } from '../services/analysis.service.js';

export const analysisController = {
  /**
   * GET /api/analysis/session/:id
   */
  async getSessionAnalysis(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const sessionId = req.params.id as string;
      const analysis = await analysisService.getSessionAnalysis(sessionId, userId);
      res.status(200).json(analysis);
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/analysis/history
   */
  async getAnalysisHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const historyStats = await analysisService.getAnalysisHistory(userId);
      res.status(200).json(historyStats);
    } catch (error) {
      next(error);
    }
  },
};
