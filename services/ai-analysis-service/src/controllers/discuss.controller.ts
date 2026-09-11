// ═══════════════════════════════════════════════════════════════
// AI & Analysis Microservice — Discussion Controller
// ═══════════════════════════════════════════════════════════════

import { Request, Response, NextFunction } from 'express';
import { discussService } from '../services/discuss.service.js';

function getUserId(req: Request): string {
  const header = req.headers['x-user-id'];
  if (Array.isArray(header)) return header[0] || 'demo-user-id';
  return header || 'demo-user-id';
}

export const discussController = {
  async getPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const category = (req.query.category as string) || 'ALL';
      const posts = await discussService.getPostsByCategory(category);

      res.status(200).json({
        success: true,
        data: posts,
      });
    } catch (err) {
      next(err);
    }
  },

  async createPost(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = getUserId(req);
      const { userName, roleCategory, title, content, tags } = req.body;

      const post = await discussService.createPost(
        userId,
        userName || 'Candidate',
        roleCategory || 'FULLSTACK',
        title,
        content,
        tags
      );

      res.status(201).json({
        success: true,
        data: post,
      });
    } catch (err) {
      next(err);
    }
  },

  async upvotePost(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const post = await discussService.upvotePost(id);

      res.status(200).json({
        success: true,
        data: post,
      });
    } catch (err) {
      next(err);
    }
  },
};
