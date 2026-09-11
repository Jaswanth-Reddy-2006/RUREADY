// ═══════════════════════════════════════════════════════════════
// AI & Analysis Microservice — ATS Routes
// ═══════════════════════════════════════════════════════════════

import { Router } from 'express';
import multer from 'multer';
import { atsController } from '../controllers/ats.controller.js';

const upload = multer({ storage: multer.memoryStorage() });
const router: Router = Router();

router.post('/analyze', upload.single('resumeFile'), atsController.analyze);
router.get('/:id', atsController.getAtsMatch);
router.post('/:id/launch', atsController.launchTailoredSession);

export default router;
