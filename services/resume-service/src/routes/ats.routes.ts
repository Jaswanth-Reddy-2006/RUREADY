import { Router } from 'express';
import { atsController } from '../controllers/ats.controller.js';

const router: Router = Router();

router.post('/analyze', atsController.analyze);
router.get('/:id', atsController.getAtsMatch);
router.post('/:id/launch', atsController.launchTailoredSession);

export default router;
