import { Router } from 'express';
import { adminController } from '../controllers/admin.controller.js';

const router: Router = Router();

router.get('/metrics', adminController.getMetrics);
router.get('/analytics', adminController.getAnalytics);
router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUserById);
router.patch('/users/:id/plan', adminController.updateUserPlan);
router.get('/logs', adminController.getLogs);
router.get('/health-matrix', adminController.getHealthMatrix);
router.get('/system-logs', adminController.getSystemLogs);
router.get('/sessions/:id', adminController.getSessionDetail);

export default router;
