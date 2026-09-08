import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service.js';

export const userController = {
  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.userId || (req.headers['x-user-id'] as string);
      const profile = await userService.getProfile(userId);
      res.status(200).json(profile);
    } catch (err) {
      next(err);
    }
  },

  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.userId || (req.headers['x-user-id'] as string);
      const updated = await userService.updateProfile(userId, req.body);
      res.status(200).json(updated);
    } catch (err) {
      next(err);
    }
  },

  async uploadResume(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.userId || (req.headers['x-user-id'] as string);
      const resume = await userService.addResume(userId, req.file || {});
      res.status(201).json(resume);
    } catch (err) {
      next(err);
    }
  },
};
