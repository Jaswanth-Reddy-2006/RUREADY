import { Router } from 'express';
import { oralController } from '../controllers/oral.controller.js';

const router: Router = Router();

router.post('/session', oralController.createSession);
router.get('/sessions', oralController.listSessions);
router.get('/session/:id', oralController.getSession);
router.get('/session/:id/next', oralController.getNextQuestion);
router.post('/session/:id/start', oralController.startSession);
router.post('/session/:id/answer', oralController.submitAnswer);
router.post('/session/:id/complete', oralController.completeSession);

export default router;
