// ═══════════════════════════════════════════════════════════════
// R U Ready? — Admin Routes
// ═══════════════════════════════════════════════════════════════

import { Router } from 'express';
import { adminController } from '../controllers/admin.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/admin.middleware.js';

const router: import('express').Router = Router();

// Secure all admin routes with JWT authentication & Admin privilege check
router.use(authenticate, requireAdmin);

// GET /api/admin/metrics — Key summary indicators
router.get('/metrics', adminController.getMetrics);

// GET /api/admin/analytics — Detailed traffic, 7-day trend & conversion analytics
router.get('/analytics', adminController.getAnalytics);

// GET /api/admin/users — Registered user roster with search & plan badges
router.get('/users', adminController.getUsers);

// GET /api/admin/users/:id — Single user details and past session history
router.get('/users/:id', adminController.getUserDetail);

// GET /api/admin/logs — Chronological audit logs of mock interviews
router.get('/logs', adminController.getLogs);

// GET /api/admin/sessions/:id — Comprehensive single session detail for inspection
router.get('/sessions/:id', adminController.getSessionDetail);

// PATCH /api/admin/users/:id/plan — Update candidate plan
router.patch('/users/:id/plan', adminController.updateUserPlan);

export default router;
