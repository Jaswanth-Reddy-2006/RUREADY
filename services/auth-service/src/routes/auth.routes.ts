// ═══════════════════════════════════════════════════════════════
// Auth Microservice — Auth Routes
// ═══════════════════════════════════════════════════════════════

import { Router } from 'express';
import {
  register,
  login,
  refresh,
  logout,
  checkEmail,
  verifyTokenInternal,
} from '../controllers/auth.controller.js';

const router: Router = Router();

// POST /api/auth/check-email
router.post('/check-email', checkEmail);

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/refresh
router.post('/refresh', refresh);

// POST /api/auth/logout
router.post('/logout', logout);

// POST /internal/verify-token (inter-service RPC verification)
router.post('/internal/verify-token', verifyTokenInternal);

export default router;
