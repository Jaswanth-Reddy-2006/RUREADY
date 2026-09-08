import { Request, Response, NextFunction } from 'express';
import { paymentService } from '../services/payment.service.js';

export const paymentController = {
  async getPlans(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const plans = await paymentService.getPlans();
      res.status(200).json(plans);
    } catch (err) {
      next(err);
    }
  },

  async createPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.userId || (req.headers['x-user-id'] as string);
      const { planId } = req.body;
      const result = await paymentService.createPayment(userId, planId);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  },

  async verifyPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.userId || (req.headers['x-user-id'] as string);
      const { orderId, paymentId } = req.body;
      const result = await paymentService.verifyPayment(userId, orderId, paymentId);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },

  async getHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.userId || (req.headers['x-user-id'] as string);
      const history = await paymentService.getHistory(userId);
      res.status(200).json(history);
    } catch (err) {
      next(err);
    }
  },

  async handleWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await paymentService.handleWebhook(req.body);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },
};
