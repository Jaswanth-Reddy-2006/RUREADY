// ═══════════════════════════════════════════════════════════════
// AI & Analysis Microservice — Entry Point (Port 4003)
// ═══════════════════════════════════════════════════════════════

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from './lib/errors.js';
import aiRoutes from './routes/ai.routes.js';
import analysisRoutes from './routes/analysis.routes.js';
import atsRoutes from './routes/ats.routes.js';
import roadmapRoutes from './routes/roadmap.routes.js';
import discussRoutes from './routes/discuss.routes.js';
import { analysisController } from './controllers/analysis.controller.js';

const app: express.Express = express();
const PORT = parseInt(process.env.AI_SERVICE_PORT || '4003', 10);
const NODE_ENV = process.env.NODE_ENV || 'development';

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'AI & Analysis Microservice',
    port: PORT,
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/ai', aiRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/ats', atsRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/discuss', discussRoutes);
app.use('/', aiRoutes);
app.use('/', analysisRoutes);
app.use('/ats', atsRoutes);
app.use('/roadmap', roadmapRoutes);
app.use('/discuss', discussRoutes);

// Internal Service RPC Endpoints
app.post('/internal/evaluate-session', analysisController.evaluateSessionInternal);
app.post('/internal/generate-next-question', analysisController.generateNextQuestionInternal);
app.post('/internal/evaluate-answer', analysisController.evaluateAnswerInternal);

// Global Error Handler
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  const requestId = (req.headers['x-request-id'] as string) || uuidv4();
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      code: err.code,
      message: err.message,
      requestId,
    });
    return;
  }

  console.error(`[AIService ${requestId}] Internal Error:`, err);
  res.status(500).json({
    code: 'INTERNAL_ERROR',
    message: 'An unexpected error occurred in AI & Analysis Service',
    requestId,
  });
});

app.listen(PORT, () => {
  console.log('');
  console.log('  ╔═══════════════════════════════════════════╗');
  console.log(`  ║   R U Ready? — AI & Analysis Service      ║`);
  console.log('  ╠═══════════════════════════════════════════╣');
  console.log(`  ║  🚀 Running on http://localhost:${PORT}      ║`);
  console.log('  ╚═══════════════════════════════════════════╝');
  console.log('');
});

export default app;
