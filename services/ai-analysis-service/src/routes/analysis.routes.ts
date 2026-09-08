// ═══════════════════════════════════════════════════════════════
// AI & Analysis Microservice — Analysis Routes
// ═══════════════════════════════════════════════════════════════

import { Router } from 'express';
import { analysisController } from '../controllers/analysis.controller.js';

const router: Router = Router();

router.get('/session/:id', analysisController.getSessionAnalysis);
router.get('/history', analysisController.getAnalysisHistory);

export default router;
