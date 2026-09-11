// ═══════════════════════════════════════════════════════════════
// R U Ready? — API Gateway Service Entry Point
// Single ingress entry point, reverse proxying 8 decoupled microservices
// ═══════════════════════════════════════════════════════════════

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { v4 as uuidv4 } from 'uuid';

const app: express.Express = express();
const PORT = parseInt(process.env.PORT || '4000', 10);
const NODE_ENV = process.env.NODE_ENV || 'development';

// Target downstream service URLs
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:4001';
const ORAL_INTERVIEW_SERVICE_URL = process.env.ORAL_INTERVIEW_SERVICE_URL || process.env.INTERVIEW_SERVICE_URL || 'http://localhost:4002';
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:4003';
const ANALYTICS_SERVICE_URL = process.env.ANALYTICS_SERVICE_URL || 'http://localhost:4004';
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:4005';
const CODING_INTERVIEW_SERVICE_URL = process.env.CODING_INTERVIEW_SERVICE_URL || 'http://localhost:4006';
const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL || 'http://localhost:4007';
const ADMIN_SERVICE_URL = process.env.ADMIN_SERVICE_URL || 'http://localhost:4008';
const RESUME_SERVICE_URL = process.env.RESUME_SERVICE_URL || 'http://localhost:3009';
const ROADMAP_SERVICE_URL = process.env.ROADMAP_SERVICE_URL || 'http://localhost:3010';

// Parse CORS origins from env
const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
  : ['http://localhost:3000', 'http://localhost:5173'];

// Security Headers
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  }),
);

// CORS Policy
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || corsOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin '${origin}' not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Request-Id'],
  }),
);

app.use(cookieParser());

// Request Correlation ID & User Identity Ingress Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const requestId = (req.headers['x-request-id'] as string) || uuidv4();
  req.headers['x-request-id'] = requestId;
  res.setHeader('X-Request-Id', requestId);

  // Extract user identity from Authorization header and pass down to microservices via X-User-Id header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      if (payload.userId) {
        req.headers['x-user-id'] = payload.userId;
      }
    } catch {
      // Ignore token parsing error
    }
  }
  next();
});

// Gateway Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'R U Ready? API Gateway',
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
    services: {
      auth: AUTH_SERVICE_URL,
      user: USER_SERVICE_URL,
      oralInterview: ORAL_INTERVIEW_SERVICE_URL,
      codingInterview: CODING_INTERVIEW_SERVICE_URL,
      aiAnalysis: AI_SERVICE_URL,
      payment: PAYMENT_SERVICE_URL,
      analytics: ANALYTICS_SERVICE_URL,
      admin: ADMIN_SERVICE_URL,
    },
  });
});

// ─── Microservices Reverse Proxies ────────────────────────────

// 1. Auth Service
app.use(
  '/api/auth',
  createProxyMiddleware({
    target: AUTH_SERVICE_URL,
    changeOrigin: true,
    ws: true,
  }),
);

// 2. User Service
app.use(
  '/api/user',
  createProxyMiddleware({
    target: USER_SERVICE_URL,
    changeOrigin: true,
    ws: true,
  }),
);

// 3. Oral Interview Service
app.use(
  '/api/interview/oral',
  createProxyMiddleware({
    target: ORAL_INTERVIEW_SERVICE_URL,
    changeOrigin: true,
    ws: true,
  }),
);

// 4. Coding Interview Service
app.use(
  '/api/interview/coding',
  createProxyMiddleware({
    target: CODING_INTERVIEW_SERVICE_URL,
    changeOrigin: true,
    ws: true,
  }),
);

// Generic Interview backward compatibility route
app.use(
  '/api/interview',
  createProxyMiddleware({
    target: ORAL_INTERVIEW_SERVICE_URL,
    changeOrigin: true,
    ws: true,
  }),
);

// 5. Payment Service
app.use(
  '/api/payments',
  createProxyMiddleware({
    target: PAYMENT_SERVICE_URL,
    changeOrigin: true,
    ws: true,
  }),
);

// 6. Analytics & Result Service
app.use(
  '/api/analysis',
  createProxyMiddleware({
    target: ANALYTICS_SERVICE_URL,
    changeOrigin: true,
    ws: true,
  }),
);

// 7. AI Analysis Service & ATS Engine
app.use(
  '/api/ai',
  createProxyMiddleware({
    target: AI_SERVICE_URL,
    changeOrigin: true,
    ws: true,
  }),
);

app.use(
  '/api/ats',
  createProxyMiddleware({
    target: RESUME_SERVICE_URL,
    changeOrigin: true,
    ws: true,
  }),
);

app.use(
  '/api/roadmap',
  createProxyMiddleware({
    target: ROADMAP_SERVICE_URL,
    changeOrigin: true,
    ws: true,
  }),
);

app.use(
  '/api/discuss',
  createProxyMiddleware({
    target: ROADMAP_SERVICE_URL,
    changeOrigin: true,
    ws: true,
  }),
);

// 8. Admin Service
app.use(
  '/api/admin',
  createProxyMiddleware({
    target: ADMIN_SERVICE_URL,
    changeOrigin: true,
    ws: true,
  }),
);

// Upload fallback to User Service
app.use(
  '/api/upload',
  createProxyMiddleware({
    target: USER_SERVICE_URL,
    changeOrigin: true,
    ws: true,
  }),
);

// 404 Handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    code: 'NOT_FOUND',
    message: `Gateway route ${req.method} ${req.originalUrl} not found`,
    requestId: req.headers['x-request-id'],
  });
});

// Global Error Handler
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  const requestId = req.headers['x-request-id'] || uuidv4();
  console.error(`[Gateway ${requestId}] Error:`, err);
  res.status(500).json({
    code: 'GATEWAY_ERROR',
    message: 'An unexpected error occurred in the API Gateway',
    requestId,
  });
});

app.listen(PORT, () => {
  console.log('');
  console.log('  ╔═══════════════════════════════════════════╗');
  console.log(`  ║       R U Ready? — API Gateway            ║`);
  console.log('  ╠═══════════════════════════════════════════╣');
  console.log(`  ║  🚀 Ingress: http://localhost:${PORT}        ║`);
  console.log(`  ║  📦 Auth target: ${AUTH_SERVICE_URL.padEnd(23)}║`);
  console.log(`  ║  📦 Oral target: ${ORAL_INTERVIEW_SERVICE_URL.padEnd(23)}║`);
  console.log(`  ║  📦 Coding target: ${CODING_INTERVIEW_SERVICE_URL.padEnd(21)}║`);
  console.log(`  ║  📦 Payment target: ${PAYMENT_SERVICE_URL.padEnd(20)}║`);
  console.log(`  ║  📦 Admin target: ${ADMIN_SERVICE_URL.padEnd(22)}║`);
  console.log('  ╚═══════════════════════════════════════════╝');
  console.log('');
});

export default app;
