import { Request, Response, NextFunction } from 'express';
import { roadmapService } from '../services/roadmap.service.js';

function getUserId(req: Request): string {
  const header = req.headers['x-user-id'];
  if (Array.isArray(header)) return header[0] || 'demo-user-id';
  return header || 'demo-user-id';
}

export const roadmapController = {
  async getUserRoadmaps(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = getUserId(req);
      const roadmaps = await roadmapService.getUserRoadmaps(userId);

      res.status(200).json({
        success: true,
        data: roadmaps,
      });
    } catch (err) {
      next(err);
    }
  },

  async generateRoadmap(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = getUserId(req);
      const { rolePath, targetCompanyTier, customTechStack } = req.body;

      const roadmap = await roadmapService.generateRoadmap(
        userId,
        rolePath,
        targetCompanyTier,
        customTechStack
      );

      res.status(201).json({
        success: true,
        data: roadmap,
      });
    } catch (err) {
      next(err);
    }
  },

  async getRoadmapById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = getUserId(req);
      const id = req.params.id as string;
      const roadmap = await roadmapService.getRoadmapById(id, userId);

      res.status(200).json({
        success: true,
        data: roadmap,
      });
    } catch (err) {
      next(err);
    }
  },

  async submitNodeAttempt(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = getUserId(req);
      const id = req.params.id as string;
      const { nodeId, codeAnswer, verbalAnswer } = req.body;

      const result = await roadmapService.submitNodeAttempt(
        userId,
        id,
        nodeId,
        codeAnswer,
        verbalAnswer
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },
};
