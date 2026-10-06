import { Router } from 'express';
import multer from 'multer';
import { resumeParserController } from '../controllers/resumeParser.controller.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB limit
});

const router: Router = Router();

router.post('/parse', upload.any(), resumeParserController.parseResume);
router.post('/score', resumeParserController.scoreResumeWithBge);
router.post('/evaluate', resumeParserController.evaluateResume);

export default router;
