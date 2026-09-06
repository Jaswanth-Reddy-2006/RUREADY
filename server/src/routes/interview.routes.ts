// ═══════════════════════════════════════════════════════════════
// R U Ready? — Active Interview Routes
// ═══════════════════════════════════════════════════════════════

import { Router } from 'express';
import { interviewController } from '../controllers/interview.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { computationalApiLimiter } from '../middleware/security.js';

const router: import('express').Router = Router();

// All interview routes require authentication
router.use(authenticate);

// POST /api/interview/session — Create session
router.post('/session', interviewController.createSession);

// GET /api/interview/sessions — List all user's sessions
router.get('/sessions', interviewController.listSessions);

// GET /api/interview/session/:id — Get session by ID
router.get('/session/:id', interviewController.getSession);

// POST /api/interview/session/:id/start — Start session (generates first Q)
router.post('/session/:id/start', interviewController.startSession);

// POST /api/interview/session/:id/answer — Submit answer
router.post('/session/:id/answer', interviewController.submitAnswer);

// POST /api/interview/session/:id/hint — Increment hint count
router.post('/session/:id/hint', interviewController.incrementHintCount);

// GET /api/interview/session/:id/next — Get next adaptive question
router.get('/session/:id/next', computationalApiLimiter, interviewController.getNextQuestion);

// POST /api/interview/session/:id/run — Execute sandboxed test cases
router.post('/session/:id/run', computationalApiLimiter, interviewController.runTestCases);

// POST /api/interview/session/:id/complete — Mark as complete and evaluate
router.post('/session/:id/complete', interviewController.completeSession);

// POST /api/interview/session/:id/telemetry — Batch submit telemetry logs
router.post('/session/:id/telemetry', interviewController.submitTelemetry);

export default router;
