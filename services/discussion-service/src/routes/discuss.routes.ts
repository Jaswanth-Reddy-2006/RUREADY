import { Router } from 'express';
import { discussController } from '../controllers/discuss.controller.js';

const router: Router = Router();

router.get('/', discussController.getPosts);
router.get('/:id', discussController.getPostById);
router.post('/', discussController.createPost);
router.post('/:id/upvote', discussController.upvotePost);
router.post('/:id/comments', discussController.addComment);

export default router;
