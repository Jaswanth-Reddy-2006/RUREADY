// ═══════════════════════════════════════════════════════════════
// RU Ready? — System Design Express Routes
// ═══════════════════════════════════════════════════════════════

import { Router } from 'express';
import { SystemDesignController } from '../controllers/systemDesign.controller.js';

const router: Router = Router();

// Problem bank
router.get('/problems', SystemDesignController.getProblems);
router.get('/problems/:id', SystemDesignController.getProblemById);

// Sessions
router.post('/sessions', SystemDesignController.createSession);
router.get('/sessions/history', SystemDesignController.getUserHistory);
router.get('/sessions/:id', SystemDesignController.getSession);
router.put('/sessions/:id/graph', SystemDesignController.saveGraph);
router.post('/sessions/:id/calculate-capacity', SystemDesignController.updateCapacity);
router.post('/sessions/:id/chat', SystemDesignController.sendChatMessage);
router.post('/sessions/:id/finish', SystemDesignController.finishSession);

export default router;
