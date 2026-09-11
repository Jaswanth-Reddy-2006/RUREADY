// ═══════════════════════════════════════════════════════════════
// AI & Analysis Microservice — Discussion Routes
// ═══════════════════════════════════════════════════════════════

import { Router } from 'express';
import { discussController } from '../controllers/discuss.controller.js';

const router: Router = Router();

router.get('/', discussController.getPosts);
router.post('/', discussController.createPost);
router.post('/:id/upvote', discussController.upvotePost);

export default router;
