import { Router } from 'express';
import multer from 'multer';
import { atsController } from '../controllers/ats.controller.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
});

const router: Router = Router();

router.post('/extract', upload.any(), atsController.extractDocument);
router.post('/parse-document', upload.any(), atsController.extractDocument);
router.post('/analyze', upload.any(), atsController.analyze);
router.post('/upload', upload.any(), atsController.analyze);
router.get('/:id', atsController.getAtsMatch);
router.post('/:id/launch', atsController.launchTailoredSession);

export default router;
