import { Router } from 'express';
import { analyticsController } from '../controllers/analytics.controller.js';

const router: Router = Router();

router.get('/session/:sessionId', analyticsController.getAnalysis);
router.post('/session/:sessionId/telemetry', analyticsController.submitTelemetry);
router.get('/dashboard', analyticsController.getDashboardMetrics);

export default router;
