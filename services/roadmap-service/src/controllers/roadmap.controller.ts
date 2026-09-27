import { Request, Response, NextFunction } from 'express';
import { roadmapService } from '../services/roadmap.service.js';
import { adaptiveRoadmapService } from '../services/adaptive-roadmap.service.js';
import { UnauthorizedError } from '../lib/errors.js';

function getUserId(req: Request): string {
  const header = req.headers['x-user-id'];
  const userId = Array.isArray(header) ? header[0] : header;
  if (!userId) throw new UnauthorizedError();
  return userId;
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

  async getCatalog(req: Request, res: Response, next: NextFunction) {
    try {
      const roadmaps = await roadmapService.getPublicCatalog();
      res.status(200).json({
        success: true,
        data: roadmaps,
      });
    } catch (err) {
      next(err);
    }
  },

  async createManualRoadmap(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = getUserId(req);
      const roadmap = await roadmapService.createManualRoadmap(userId, req.body);
      res.status(201).json({
        success: true,
        data: roadmap,
      });
    } catch (err) {
      next(err);
    }
  },

  async getUserRoadmapsByCreator(req: Request, res: Response, next: NextFunction) {
    try {
      const targetUserId = req.params.userId as string;
      const roadmaps = await roadmapService.getUserCreatedRoadmaps(targetUserId);
      res.status(200).json({
        success: true,
        data: roadmaps,
      });
    } catch (err) {
      next(err);
    }
  },

  async createStructuredRoadmap(req: Request, res: Response, next: NextFunction) {
    try {
      const roadmap = await adaptiveRoadmapService.createStructuredRoadmap(getUserId(req), req.body);
      res.status(201).json({ success: true, data: roadmap });
    } catch (err) {
      next(err);
    }
  },

  async followRoadmap(req: Request, res: Response, next: NextFunction) {
    try {
      const roadmap = await adaptiveRoadmapService.followRoadmap(getUserId(req), req.params.id as string, req.body);
      res.status(201).json({ success: true, data: roadmap });
    } catch (err) {
      next(err);
    }
  },

  async getMyAdaptiveRoadmaps(req: Request, res: Response, next: NextFunction) {
    try {
      const roadmaps = await adaptiveRoadmapService.getUserRoadmaps(getUserId(req));
      res.status(200).json({ success: true, data: roadmaps });
    } catch (err) {
      next(err);
    }
  },

  async getAdaptiveRoadmap(req: Request, res: Response, next: NextFunction) {
    try {
      const roadmap = await adaptiveRoadmapService.getUserRoadmap(getUserId(req), req.params.userRoadmapId as string);
      res.status(200).json({ success: true, data: roadmap });
    } catch (err) {
      next(err);
    }
  },

  async updateSprintTask(req: Request, res: Response, next: NextFunction) {
    try {
      const task = await adaptiveRoadmapService.updateSprintTask(
        getUserId(req),
        req.params.sprintId as string,
        req.params.taskId as string,
        req.body,
      );
      res.status(200).json({ success: true, data: task });
    } catch (err) {
      next(err);
    }
  },

  async completeSprint(req: Request, res: Response, next: NextFunction) {
    try {
      const review = await adaptiveRoadmapService.completeSprint(getUserId(req), req.params.sprintId as string, req.body);
      res.status(200).json({ success: true, data: review });
    } catch (err) {
      next(err);
    }
  },

  async recordSkillEvidence(req: Request, res: Response, next: NextFunction) {
    try {
      const evidence = await adaptiveRoadmapService.recordSelfReportedEvidence(
        getUserId(req),
        req.params.userRoadmapId as string,
        req.body,
      );
      res.status(201).json({ success: true, data: evidence });
    } catch (err) {
      next(err);
    }
  },
};
