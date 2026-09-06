// ═══════════════════════════════════════════════════════════════
// R U Ready? — Active Analysis Routes
// ═══════════════════════════════════════════════════════════════

import { Router } from 'express';
import { analysisController } from '../controllers/analysis.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router: import('express').Router = Router();

// All analysis routes require authentication
router.use(authenticate);

// GET /api/analysis/session/:id — Get full analysis for a session
router.get('/session/:id', analysisController.getSessionAnalysis);

// GET /api/analysis/history — Aggregated historical score trends
router.get('/history', analysisController.getAnalysisHistory);

export default router;
