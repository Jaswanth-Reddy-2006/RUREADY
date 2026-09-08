// ═══════════════════════════════════════════════════════════════
// AI & Analysis Microservice — AI Routes
// ═══════════════════════════════════════════════════════════════

import { Router } from 'express';
import { aiController } from '../controllers/ai.controller.js';

const router: Router = Router();

router.get('/config', aiController.getConfig);
router.post('/config', aiController.updateConfig);
router.get('/health', aiController.testHealth);

export default router;
