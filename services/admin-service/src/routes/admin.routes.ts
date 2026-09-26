import { Router } from 'express';
import { adminController } from '../controllers/admin.controller.js';

const router: Router = Router();

// Core Analytics & Users
router.get('/metrics', adminController.getMetrics);
router.get('/analytics', adminController.getAnalytics);
router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUserById);
router.patch('/users/:id/plan', adminController.updateUserPlan);

// Logs & Health
router.get('/logs', adminController.getLogs);
router.get('/health-matrix', adminController.getHealthMatrix);
router.get('/system-logs', adminController.getSystemLogs);
router.get('/sessions/:id', adminController.getSessionDetail);

// Feature 1: System Controls & Cache Management
router.get('/system-controls', adminController.getSystemControls);
router.post('/system-controls/maintenance', adminController.toggleMaintenance);
router.post('/system-controls/llm-model', adminController.updateLlmEngines);
router.post('/system-controls/flush-cache', adminController.flushCache);
router.post('/system-controls/restart/:serviceName', adminController.restartService);

// Feature 2: Platform Broadcasts & Announcements
router.get('/broadcasts', adminController.getBroadcasts);
router.post('/broadcasts', adminController.createBroadcast);
router.patch('/broadcasts/:id/toggle', adminController.toggleBroadcast);
router.delete('/broadcasts/:id', adminController.deleteBroadcast);

// Feature 3: Live Anti-Cheat & Integrity Hub
router.get('/integrity', adminController.getIntegrityMetrics);

export default router;
