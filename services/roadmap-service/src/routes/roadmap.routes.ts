import { Router } from 'express';
import { roadmapController } from '../controllers/roadmap.controller.js';

const router: Router = Router();

router.get('/catalog', roadmapController.getCatalog);
router.post('/structured', roadmapController.createStructuredRoadmap);
router.post('/manual', roadmapController.createManualRoadmap);
router.get('/adaptive', roadmapController.getMyAdaptiveRoadmaps);
router.get('/adaptive/:userRoadmapId', roadmapController.getAdaptiveRoadmap);
router.post('/adaptive/:userRoadmapId/evidence', roadmapController.recordSkillEvidence);
router.patch('/sprints/:sprintId/tasks/:taskId', roadmapController.updateSprintTask);
router.post('/sprints/:sprintId/complete', roadmapController.completeSprint);
router.get('/user', roadmapController.getUserRoadmaps);
router.get('/user/:userId', roadmapController.getUserRoadmapsByCreator);
router.get('/', roadmapController.getUserRoadmaps);
router.post('/generate', roadmapController.generateRoadmap);
router.post('/:id/follow', roadmapController.followRoadmap);
router.get('/:id', roadmapController.getRoadmapById);
router.post('/:id/attempt', roadmapController.submitNodeAttempt);

export default router;
