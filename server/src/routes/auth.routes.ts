// ═══════════════════════════════════════════════════════════════
// R U Ready? — Auth Routes
// POST /register, /login, /refresh, /logout
// ═══════════════════════════════════════════════════════════════

import { Router } from 'express';
import {
  register,
  login,
  refresh,
  logout,
  checkEmail,
  registerSchema,
  loginSchema,
} from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { authRateLimit } from '../middleware/rateLimit.middleware.js';

const router: import('express').Router = Router();

// All auth routes get stricter rate limiting (10 req/min per IP)
router.use(authRateLimit);

// POST /api/auth/check-email
router.post('/check-email', checkEmail);

// POST /api/auth/register
router.post(
  '/register',
  validate({ body: registerSchema }),
  register,
);

// POST /api/auth/login
router.post(
  '/login',
  validate({ body: loginSchema }),
  login,
);

// POST /api/auth/refresh
router.post('/refresh', refresh);

// POST /api/auth/logout
router.post('/logout', logout);

export default router;
