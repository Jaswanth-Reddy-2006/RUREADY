import { Request, Response, NextFunction } from 'express';
import { adminService } from '../services/admin.service.js';

export const adminController = {
  async getMetrics(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const metrics = await adminService.getMetrics();
      res.status(200).json(metrics);
    } catch (err) {
      next(err);
    }
  },

  async getAnalytics(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const analytics = await adminService.getAnalytics();
      res.status(200).json(analytics);
    } catch (err) {
      next(err);
    }
  },

  async getUsers(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await adminService.getUsers();
      res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  },

  async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const user = await adminService.getUserById(id);
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  },

  async updateUserPlan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const { plan } = req.body;
      const updated = await adminService.updateUserPlan(id, plan);
      res.status(200).json(updated);
    } catch (err) {
      next(err);
    }
  },

  async getLogs(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const logs = await adminService.getLogs();
      res.status(200).json(logs);
    } catch (err) {
      next(err);
    }
  },

  async getSessionDetail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const detail = await adminService.getSessionDetail(id);
      res.status(200).json(detail);
    } catch (err) {
      next(err);
    }
  },

  async getHealthMatrix(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const matrix = await adminService.getMicroservicesHealthMatrix();
      res.status(200).json(matrix);
    } catch (err) {
      next(err);
    }
  },

  async getSystemLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const service = req.query.service as string | undefined;
      const level = req.query.level as string | undefined;
      const search = req.query.search as string | undefined;
      const logs = await adminService.getSystemLogs(service, level, search);
      res.status(200).json(logs);
    } catch (err) {
      next(err);
    }
  },
};
