// ═══════════════════════════════════════════════════════════════
// R U Ready? — AI Management Routes
// ═══════════════════════════════════════════════════════════════

import { Router } from 'express';
import { aiController } from '../controllers/ai.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router: import('express').Router = Router();

// Routes require authentication
router.use(authenticate);

// GET /api/ai/config — Retrieve current active AI provider
router.get('/config', aiController.getConfig);

// POST /api/ai/config — Dynamically configure provider (Ollama, OpenAI, Gemini, Custom)
router.post('/config', aiController.updateConfig);

// GET /api/ai/health — Health ping / latency test to active provider
router.get('/health', aiController.testHealth);

export default router;
