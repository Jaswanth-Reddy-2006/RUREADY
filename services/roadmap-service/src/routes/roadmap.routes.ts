import { Router } from 'express';
import { roadmapController } from '../controllers/roadmap.controller.js';

const router: Router = Router();

router.get('/', roadmapController.getUserRoadmaps);
router.post('/generate', roadmapController.generateRoadmap);
router.get('/:id', roadmapController.getRoadmapById);
router.post('/:id/attempt', roadmapController.submitNodeAttempt);

export default router;
