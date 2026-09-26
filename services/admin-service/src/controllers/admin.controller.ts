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

  // ─── System Controls & Cache Management ───
  async getSystemControls(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const controls = await adminService.getSystemControls();
      res.status(200).json(controls);
    } catch (err) {
      next(err);
    }
  },

  async toggleMaintenance(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { enabled, message } = req.body;
      const updated = await adminService.toggleMaintenance(Boolean(enabled), message);
      res.status(200).json(updated);
    } catch (err) {
      next(err);
    }
  },

  async updateLlmEngines(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { activeEngine, fallbackEngine, temperature, maxTokens } = req.body;
      const updated = await adminService.updateLlmEngines(activeEngine, fallbackEngine, temperature, maxTokens);
      res.status(200).json(updated);
    } catch (err) {
      next(err);
    }
  },

  async flushCache(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { target } = req.body;
      const result = await adminService.flushCache(target || 'ALL');
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },

  async restartService(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const serviceName = req.params.serviceName as string;
      const result = await adminService.restartMicroservice(serviceName);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },

  // ─── Broadcasts & In-App Announcements ───
  async getBroadcasts(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const broadcasts = await adminService.getBroadcasts();
      res.status(200).json(broadcasts);
    } catch (err) {
      next(err);
    }
  },

  async createBroadcast(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const created = await adminService.createBroadcast(req.body);
      res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  },

  async toggleBroadcast(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const updated = await adminService.toggleBroadcast(id);
      res.status(200).json(updated);
    } catch (err) {
      next(err);
    }
  },

  async deleteBroadcast(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const result = await adminService.deleteBroadcast(id);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },

  // ─── Live Anti-Cheat & Integrity Hub ───
  async getIntegrityMetrics(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const metrics = await adminService.getIntegrityMetrics();
      res.status(200).json(metrics);
    } catch (err) {
      next(err);
    }
  },
};
