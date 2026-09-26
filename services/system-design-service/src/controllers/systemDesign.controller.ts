// ═══════════════════════════════════════════════════════════════
// RU Ready? — System Design Controller
// HTTP Request Handlers for System Design Endpoints
// ═══════════════════════════════════════════════════════════════

import { Request, Response } from 'express';
import { SystemDesignService } from '../services/systemDesign.service.js';

function getHeader(val: string | string[] | undefined): string | undefined {
  if (Array.isArray(val)) return val[0];
  return val;
}

function getParamId(val: string | string[] | undefined): string {
  if (Array.isArray(val)) return val[0] || '';
  return val || '';
}

export class SystemDesignController {
  static async getProblems(req: Request, res: Response) {
    try {
      const { difficulty, category } = req.query;
      const problems = await SystemDesignService.getProblems({
        difficulty: difficulty as string,
        category: category as string,
      });
      res.status(200).json({ success: true, data: problems });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getProblemById(req: Request, res: Response) {
    try {
      const id = getParamId(req.params.id);
      const problem = await SystemDesignService.getProblemBySlugOrId(id);
      if (!problem) {
        return res.status(404).json({ success: false, message: 'Problem not found' });
      }
      res.status(200).json({ success: true, data: problem });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async createSession(req: Request, res: Response) {
    try {
      const userId = getHeader(req.headers['x-user-id']) || (req.body.userId as string) || 'guest_user';
      const userName = getHeader(req.headers['x-user-name']) || (req.body.userName as string) || 'Candidate';
      const { problemId } = req.body;

      if (!problemId) {
        return res.status(400).json({ success: false, message: 'problemId is required' });
      }

      const session = await SystemDesignService.createSession(userId, problemId, userName);
      res.status(201).json({ success: true, data: session });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getSession(req: Request, res: Response) {
    try {
      const id = getParamId(req.params.id);
      const userId = getHeader(req.headers['x-user-id']) || (req.query.userId as string) || 'guest_user';
      const session = await SystemDesignService.getSession(id, userId);
      if (!session) {
        return res.status(404).json({ success: false, message: 'Session not found' });
      }
      res.status(200).json({ success: true, data: session });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async saveGraph(req: Request, res: Response) {
    try {
      const id = getParamId(req.params.id);
      const userId = getHeader(req.headers['x-user-id']) || (req.body.userId as string) || 'guest_user';
      const { graph } = req.body;

      if (!graph) {
        return res.status(400).json({ success: false, message: 'graph is required' });
      }

      const validation = await SystemDesignService.saveGraph(id, userId, graph);
      res.status(200).json({ success: true, data: { validation } });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateCapacity(req: Request, res: Response) {
    try {
      const id = getParamId(req.params.id);
      const userId = getHeader(req.headers['x-user-id']) || (req.body.userId as string) || 'guest_user';
      const { inputs } = req.body;

      if (!inputs) {
        return res.status(400).json({ success: false, message: 'inputs object is required' });
      }

      const outputs = await SystemDesignService.updateCapacity(id, userId, inputs);
      res.status(200).json({ success: true, data: outputs });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async sendChatMessage(req: Request, res: Response) {
    try {
      const id = getParamId(req.params.id);
      const userId = getHeader(req.headers['x-user-id']) || (req.body.userId as string) || 'guest_user';
      const { message } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ success: false, message: 'message string is required' });
      }

      const aiReply = await SystemDesignService.sendChatMessage(id, userId, message);
      res.status(200).json({ success: true, data: aiReply });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async finishSession(req: Request, res: Response) {
    try {
      const id = getParamId(req.params.id);
      const userId = getHeader(req.headers['x-user-id']) || (req.body.userId as string) || 'guest_user';
      const { durationSeconds } = req.body;

      const evaluation = await SystemDesignService.finishSession(id, userId, durationSeconds || 0);
      res.status(200).json({ success: true, data: evaluation });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getUserHistory(req: Request, res: Response) {
    try {
      const userId = getHeader(req.headers['x-user-id']) || (req.query.userId as string) || 'guest_user';
      const history = await SystemDesignService.getUserHistory(userId);
      res.status(200).json({ success: true, data: history });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
