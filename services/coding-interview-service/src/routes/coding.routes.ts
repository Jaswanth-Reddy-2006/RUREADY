import { Router } from 'express';
import { codingController } from '../controllers/coding.controller.js';

const router: Router = Router();

router.post('/session', codingController.createSession);
router.get('/session/:id', codingController.getSession);
router.get('/problems', codingController.getProblems);
router.get('/problems/:id', codingController.getProblemById);
router.post('/session/:id/run', codingController.runTestCases);
router.get('/session/:id/ideal/:problemId', codingController.getIdealSolution);
router.get('/session/:id/ideal', codingController.getIdealSolution);
router.get('/problems/:id/ideal', codingController.getIdealSolution);
router.post('/session/:id/hint', codingController.getProgressiveHint);
router.post('/session/:id/dialogue', codingController.getSocraticDialogue);

export default router;
