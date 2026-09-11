// ═══════════════════════════════════════════════════════════════
// AI & Analysis Microservice — Roadmap Routes
// ═══════════════════════════════════════════════════════════════

import { Router } from 'express';
import { roadmapController } from '../controllers/roadmap.controller.js';

const router: Router = Router();

router.post('/generate', roadmapController.generate);
router.get('/user', roadmapController.getUserRoadmaps);
router.get('/:id', roadmapController.getRoadmapById);
router.post('/:id/nodes/:nodeId/submit', roadmapController.submitNodeAttempt);

export default router;
