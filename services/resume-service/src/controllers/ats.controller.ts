import { Request, Response, NextFunction } from 'express';
import { atsService } from '../services/ats.service.js';

function getUserId(req: Request): string {
  const header = req.headers['x-user-id'];
  if (Array.isArray(header)) return header[0] || 'demo-user-id';
  return header || 'demo-user-id';
}

export const atsController = {
  async analyze(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = getUserId(req);
      let resumeText = req.body.resumeText || '';
      
      const file = (req as any).file;
      if (file && file.buffer) {
        resumeText = file.buffer.toString('utf-8');
      }

      const { jobDescription, jobTitle, companyName } = req.body;

      const result = await atsService.analyzeResumeAndJob(
        userId,
        resumeText,
        jobDescription,
        jobTitle,
        companyName
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  async getAtsMatch(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = getUserId(req);
      const id = req.params.id as string;
      const result = await atsService.getAtsMatch(id, userId);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  async launchTailoredSession(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = getUserId(req);
      const id = req.params.id as string;
      const mode = (req.body.mode as 'ORAL' | 'CODING') || 'ORAL';

      const session = await atsService.launchTailoredSession(userId, id, mode);

      res.status(201).json({
        success: true,
        data: session,
      });
    } catch (err) {
      next(err);
    }
  },
};
