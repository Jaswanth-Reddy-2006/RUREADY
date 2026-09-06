import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { Redis } from 'ioredis';
import cluster from 'node:cluster';

// ─── Redis Connection Configuration ──────────────────────────

const redisUrl = process.env.REDIS_URL;
export let redisClient: Redis | null = null;
let redisStore: RedisStore | null = null;

if (redisUrl && !cluster.isPrimary) {
  try {
    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 2,
      retryStrategy: (times: number) => {
        if (times > 2) {
          console.warn('[Security] Redis connection failed. Falling back to in-memory rate limiting store.');
          redisClient?.disconnect();
          redisClient = null;
          return null;
        }
        return Math.min(times * 100, 2000);
      }
    });

    redisClient.on('error', (err: any) => {
      console.warn('[Security] Redis Connection Error:', err.message);
      redisClient = null;
      redisStore = null;
    });

    redisStore = new RedisStore({
      // @ts-ignore
      sendCommand: (...args: string[]) => {
        if (redisClient) {
          return redisClient.call(args[0], ...args.slice(1));
        }
        throw new Error('Redis client disconnected');
      }
    });
    console.log('[Security] Redis-backed rate limit store initialized.');
  } catch (err) {
    console.warn('[Security] Failed to initialize Redis Client:', err);
    redisClient = null;
    redisStore = null;
  }
}

// ─── Global CORS Middleware ──────────────────────────────────

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
  : ['http://localhost:5173', 'http://localhost:3000'];

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Permit requests with no origin only in non-production environments (e.g. tests, curl)
    if (!origin && process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    if (origin && allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`Origin ${origin} not allowed by CORS under strict security policy`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['set-cookie']
});

// ─── Helmet CSP Middleware ───────────────────────────────────

export const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "https:", "wss:", "ws:"],
      // Allow local webcam & microphone streaming (blob:, mediastream:)
      mediaSrc: ["'self'", "blob:", "mediastream:", "https:"],
      imgSrc: ["'self'", "data:", "blob:", "https:"],
      // Block evaluation injections by omitting 'unsafe-eval'
      scriptSrc: ["'self'", "https:"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      fontSrc: ["'self'", "https:", "data:"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  }
});

// ─── Dynamic Route-Specific Rate Limiters ────────────────────

/**
 * Auth/General API Limiter: 100 requests per 15 minutes
 */
export const generalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { keyGeneratorIpFallback: false },
  store: redisStore || undefined, // Fallback to memory store if Redis is unconfigured/offline
  keyGenerator: (req: Request) => {
    return (req as any).user?.userId || req.ip || 'unknown';
  },
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      code: 'TOO_MANY_REQUESTS',
      message: 'General API limits exceeded. Please wait 15 minutes.',
      requestId: (req as any).requestId || 'unknown'
    });
  }
});

/**
 * Computational/High-Cost Limiter: 5 requests per 1 minute
 * Applied to sandboxed compilation / run and AI QUESTION generation routes
 */
export const computationalApiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { keyGeneratorIpFallback: false },
  store: redisStore || undefined,
  keyGenerator: (req: Request) => {
    return (req as any).user?.userId || req.ip || 'unknown';
  },
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      code: 'TOO_MANY_REQUESTS',
      message: 'High-cost computational threshold reached. Limit is strictly 5 executions per minute.',
      requestId: (req as any).requestId || 'unknown'
    });
  }
});
