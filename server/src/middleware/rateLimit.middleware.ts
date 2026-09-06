// ═══════════════════════════════════════════════════════════════
// R U Ready? — Rate Limit Middleware
// In-memory sliding window rate limiter
// ═══════════════════════════════════════════════════════════════════════

import { Request, Response, NextFunction } from 'express';
import { RateLimitError } from '../lib/errors.js';

const rateLimitStore = new Map<string, number[]>();

function cleanupWindow(entries: number[], windowStart: number): number[] {
  return entries.filter((timestamp) => timestamp > windowStart);
}

interface RateLimitOptions {
  /** Unique prefix for the rate limit key (e.g., 'api', 'auth', 'interview') */
  prefix: string;
  /** Maximum number of requests allowed within the window */
  maxRequests: number;
  /** Window size in seconds */
  windowSecs: number;
  /** Key extractor function — determines what to rate limit by (default: IP) */
  keyExtractor?: (req: Request) => string;
}

/**
 * Creates an in-memory sliding window rate limiter middleware.
 *
 * Uses a timestamp list per client key.
 * On each request:
 *   1. Remove entries older than the window
 *   2. Count remaining entries
 *   3. If under limit, add the current request timestamp
 *   4. If over limit, reject with 429
 *
 * This approach is suitable for local development without Redis.
 */
export function rateLimit(options: RateLimitOptions) {
  const {
    prefix,
    maxRequests,
    windowSecs,
    keyExtractor,
  } = options;

  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const identifier = keyExtractor
        ? keyExtractor(req)
        : req.ip || req.socket.remoteAddress || 'unknown';

      const key = `ratelimit:${prefix}:${identifier}`;
      const now = Date.now();
      const windowStart = now - windowSecs * 1000;

      const existing = rateLimitStore.get(key) ?? [];
      const filtered = cleanupWindow(existing, windowStart);
      filtered.push(now);
      rateLimitStore.set(key, filtered);

      const currentCount = filtered.length;

      if (currentCount > maxRequests) {
        const oldestTimestamp = filtered[0] ?? now;
        const retryAfterSecs = Math.max(
          1,
          Math.ceil((oldestTimestamp + windowSecs * 1000 - now) / 1000),
        );

        res.setHeader('Retry-After', retryAfterSecs.toString());
        res.setHeader('X-RateLimit-Limit', maxRequests.toString());
        res.setHeader('X-RateLimit-Remaining', '0');

        next(new RateLimitError(retryAfterSecs));
        return;
      }

      const remaining = Math.max(0, maxRequests - currentCount);
      res.setHeader('X-RateLimit-Limit', maxRequests.toString());
      res.setHeader('X-RateLimit-Remaining', remaining.toString());
      res.setHeader(
        'X-RateLimit-Reset',
        Math.ceil((now + windowSecs * 1000) / 1000).toString(),
      );

      next();
    } catch (error) {
      console.error('[RateLimit] In-memory rate limiter error, allowing request:', error);
      next();
    }
  };
}

// ─── Pre-configured Rate Limiters ────────────────────────────

/** General API rate limit: 100 requests per minute per IP */
export const apiRateLimit = rateLimit({
  prefix: 'api',
  maxRequests: 100,
  windowSecs: 60,
});

/** Auth endpoints: 10 requests per minute per IP (stricter) */
export const authRateLimit = rateLimit({
  prefix: 'auth',
  maxRequests: 10,
  windowSecs: 60,
});

/** Interview starts: 5 per day per user */
export const interviewStartRateLimit = rateLimit({
  prefix: 'interview-start',
  maxRequests: 5,
  windowSecs: 86400, // 24 hours
  keyExtractor: (req: Request) => (req as any).user?.userId || req.ip || 'unknown',
});
