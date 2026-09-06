// ═══════════════════════════════════════════════════════════════
// R U Ready? — Express Server Entry Point
// CORS, Helmet, cookie-parser, routes, global error handler
// ═══════════════════════════════════════════════════════════════

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cluster from 'node:cluster';
import os from 'node:os';

// ─── Load environment variables from root .env ───────────────
// Must be done before any other imports that read process.env

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// ─── Imports ─────────────────────────────────────────────────

import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import { v4 as uuidv4 } from 'uuid';

import { AppError, ValidationError, RateLimitError } from './lib/errors.js';
import { prisma } from './lib/prisma.js';
import { corsMiddleware, helmetMiddleware, generalApiLimiter } from './middleware/security.js';

// Route imports
import authRoutes from './routes/auth.routes.js';
import interviewRoutes from './routes/interview.routes.js';
import analysisRoutes from './routes/analysis.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import aiRoutes from './routes/ai.routes.js';
import adminRoutes from './routes/admin.routes.js';

// ─── App Configuration ──────────────────────────────────────

const app: import('express').Express = express();
const PORT = parseInt(process.env.PORT || '4000', 10);
const NODE_ENV = process.env.NODE_ENV || 'development';

// Parse CORS origins from env (comma-separated)
const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
  : ['http://localhost:5173'];

// ─── Global Middleware ───────────────────────────────────────

// Security headers
app.use(helmetMiddleware);

// CORS with strict origin allowlist
app.use(corsMiddleware);

// Cookie parser (for refresh token in httpOnly cookies)
app.use(cookieParser());

// JSON body parsing (limit to 1MB to prevent abuse)
app.use(express.json({ limit: '1mb' }));

// URL-encoded body parsing
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Global API rate limiting (100 req/15min per IP, Redis-backed)
app.use('/api', generalApiLimiter);

// ─── Health Check ────────────────────────────────────────────

app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'R U Ready? API',
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ──────────────────────────────────────────────

app.use('/api/auth', authRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);

// ─── 404 Handler ─────────────────────────────────────────────

app.use('/api/*', (req: Request, res: Response) => {
  res.status(404).json({
    code: 'NOT_FOUND',
    message: `Route ${req.method} ${req.originalUrl} not found`,
    requestId: uuidv4(),
  });
});

// ─── Global Error Handler ────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  const requestId = uuidv4();

  // Log the full error internally (with stack trace)
  console.error(`[${requestId}] Error:`, {
    message: err.message,
    stack: NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
  });

  // Handle our custom AppError subclasses
  if (err instanceof AppError) {
    const responseBody: Record<string, unknown> = {
      code: err.code,
      message: err.message,
      requestId,
    };

    // Include validation details if present
    if (err instanceof ValidationError && err.details) {
      responseBody.details = err.details;
    }

    // Include Retry-After for rate limit errors
    if (err instanceof RateLimitError) {
      res.setHeader('Retry-After', err.retryAfterSecs.toString());
    }

    res.status(err.statusCode).json(responseBody);
    return;
  }

  // Handle Multer errors (file upload)
  if (err.name === 'MulterError') {
    const multerErr = err as Error & { code: string };
    let message = 'File upload error';

    if (multerErr.code === 'LIMIT_FILE_SIZE') {
      message = 'File size exceeds the 5MB limit';
    } else if (multerErr.code === 'LIMIT_UNEXPECTED_FILE') {
      message = 'Unexpected file field';
    }

    res.status(400).json({
      code: 'UPLOAD_ERROR',
      message,
      requestId,
    });
    return;
  }

  // Handle CORS errors
  if (err.message && err.message.includes('not allowed by CORS')) {
    res.status(403).json({
      code: 'CORS_ERROR',
      message: 'Cross-origin request blocked',
      requestId,
    });
    return;
  }

  // Handle JSON parse errors
  if (err.name === 'SyntaxError' && 'body' in err) {
    res.status(400).json({
      code: 'INVALID_JSON',
      message: 'Request body contains invalid JSON',
      requestId,
    });
    return;
  }

  // Unknown / unhandled errors — never expose internal details
  res.status(500).json({
    code: 'INTERNAL_ERROR',
    message: 'An unexpected error occurred',
    requestId,
  });
});

// ─── Server Startup ──────────────────────────────────────────

// ─── Server Startup & Clustering ──────────────────────────────

let server: any = null;
const useCluster = process.env.CLUSTER_MODE === 'true' && NODE_ENV === 'production';

if (useCluster && cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  console.log('');
  console.log('  ╔═══════════════════════════════════════════╗');
  console.log('  ║    R U Ready? — Primary Cluster Manager    ║');
  console.log('  ╠═══════════════════════════════════════════╣');
  console.log(`  ║  🚀 Spawning workers on all ${numCPUs} CPU cores   ║`);
  console.log('  ╚═══════════════════════════════════════════╝');
  console.log('');

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.warn(`[Primary] Worker process ${worker.process.pid} exited (code: ${code}, signal: ${signal}). Spawn-resurrecting replacement worker thread immediately.`);
    cluster.fork();
  });
} else {
  server = app.listen(PORT, () => {
    console.log('');
    console.log('  ╔═══════════════════════════════════════════╗');
    console.log(`  ║         R U Ready? — Worker ${process.pid.toString().padEnd(6)}        ║`);
    console.log('  ╠═══════════════════════════════════════════╣');
    console.log(`  ║  🚀 Running on http://localhost:${PORT}      ║`);
    console.log(`  ║  📦 Environment: ${NODE_ENV.padEnd(22)}║`);
    console.log(`  ║  🔒 CORS: ${corsOrigins.join(', ').substring(0, 30).padEnd(30)}║`);
    const aiLive =
      process.env.AI_MOCK !== 'true' &&
      process.env.AI_API_KEY &&
      !process.env.AI_API_KEY.includes('your-ai');
    console.log(`  ║  🤖 AI: ${(aiLive ? `LIVE (${process.env.AI_MODEL || 'default'})` : 'MOCK').padEnd(31)}║`);
    console.log('  ╚═══════════════════════════════════════════╝');
    console.log('');
  });

  // ─── Graceful Shutdown ───────────────────────────────────────

  let isShuttingDown = false;

  const gracefulShutdown = async (signal: string) => {
    if (isShuttingDown) return;
    isShuttingDown = true;
    console.log(`\n[Worker ${process.pid}] Received ${signal}. Initiating graceful shutdown sequence...`);

    const serverClosePromise = new Promise<void>((resolve) => {
      if (server) {
        server.close(() => {
          console.log(`[Worker ${process.pid}] Express HTTP server successfully closed.`);
          resolve();
        });
      } else {
        resolve();
      }
    });

    const gracePeriodPromise = new Promise<void>((_, reject) => {
      setTimeout(() => {
        reject(new Error('Grace period of 15 seconds expired.'));
      }, 15000);
    });

    const cleanupAndExit = async (exitCode: number) => {
      try {
        const securityMod = await import('./middleware/security.js');
        const redisClient = securityMod.redisClient;
        if (redisClient) {
          await redisClient.quit();
          console.log(`[Worker ${process.pid}] Redis client disconnected cleanly.`);
        }
      } catch (err) {
        console.error(`[Worker ${process.pid}] Error disconnecting Redis client:`, err);
      }

      try {
        await prisma.$disconnect();
        console.log(`[Worker ${process.pid}] Prisma client disconnected cleanly.`);
      } catch (err) {
        console.error(`[Worker ${process.pid}] Error disconnecting Prisma client:`, err);
      }

      console.log(`[Worker ${process.pid}] Shutdown procedure completed. Exiting.`);
      process.exit(exitCode);
    };

    try {
      // Race HTTP server close against 15s grace timer
      await Promise.race([serverClosePromise, gracePeriodPromise]);
      console.log(`[Worker ${process.pid}] All ongoing connections completed successfully.`);
      await cleanupAndExit(0);
    } catch (error: any) {
      console.warn(`[Worker ${process.pid}] Force shutdown triggered: ${error.message}`);
      await cleanupAndExit(1);
    }
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  // Handle unhandled rejections and uncaught exceptions
  process.on('unhandledRejection', (reason: unknown) => {
    console.error(`[Worker ${process.pid}] Unhandled Rejection:`, reason);
  });

  process.on('uncaughtException', (error: Error) => {
    console.error(`[Worker ${process.pid}] Uncaught Exception:`, error);
    gracefulShutdown('uncaughtException');
  });
}

export default app;
