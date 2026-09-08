import { Router } from 'express';
import { codingController } from '../controllers/coding.controller.js';

const router: Router = Router();

router.post('/session', codingController.createSession);
router.get('/session/:id', codingController.getSession);
router.get('/problems', codingController.getProblems);
router.get('/problems/:id', codingController.getProblemById);
router.post('/session/:id/run', codingController.runTestCases);

export default router;
