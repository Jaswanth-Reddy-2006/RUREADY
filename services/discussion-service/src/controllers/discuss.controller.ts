import { Request, Response, NextFunction } from 'express';
import { discussService } from '../services/discuss.service.js';

function getUserId(req: Request): string {
  const header = req.headers['x-user-id'];
  if (Array.isArray(header)) return header[0] || 'demo-user-id';
  return header || 'demo-user-id';
}

function getUserName(req: Request): string {
  const header = req.headers['x-user-name'];
  if (Array.isArray(header)) return header[0] || 'Candidate';
  return header || 'Candidate';
}

export const discussController = {
  async getPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const category = req.query.category as string | undefined;
      const search = req.query.search as string | undefined;
      const sort = req.query.sort as 'trending' | 'latest' | 'active' | undefined;
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 30;

      const posts = await discussService.getPosts({
        category,
        search,
        sort,
        page,
        limit,
      });

      res.status(200).json(posts);
    } catch (err) {
      next(err);
    }
  },

  async getPostById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const post = await discussService.getPostById(id);
      res.status(200).json(post);
    } catch (err) {
      next(err);
    }
  },

  async createPost(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = getUserId(req);
      const userName = getUserName(req);
      const { category, title, content, tags, askAiModerator } = req.body;

      const post = await discussService.createPost(
        userId,
        userName,
        category || 'FULLSTACK',
        title,
        content,
        tags,
        askAiModerator !== false
      );

      res.status(201).json(post);
    } catch (err) {
      next(err);
    }
  },

  async addComment(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = getUserId(req);
      const userName = getUserName(req);
      const postId = req.params.id as string;
      const { content, askAiModerator } = req.body;

      const result = await discussService.addComment(
        postId,
        userId,
        userName,
        content,
        Boolean(askAiModerator)
      );

      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  },

  async upvotePost(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = getUserId(req);
      const id = req.params.id as string;
      const updated = await discussService.upvotePost(id, userId);
      res.status(200).json(updated);
    } catch (err) {
      next(err);
    }
  },
};
