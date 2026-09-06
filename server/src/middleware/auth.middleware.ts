// ═══════════════════════════════════════════════════════════════
// R U Ready? — Auth Middleware
// JWT verification middleware — attaches req.user on success
// ═══════════════════════════════════════════════════════════════

import { Request, Response, NextFunction } from 'express';
import { AuthError, TokenExpiredError } from '../lib/errors.js';
import { verifyAccessToken } from '../services/auth.service.js';

// ─── Express Request Augmentation ────────────────────────────

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
      };
    }
  }
}

// ─── Middleware ───────────────────────────────────────────────

/**
 * Authenticate requests by verifying the Bearer token in the Authorization header.
 * On success, populates `req.user` with { userId, email }.
 * On failure, throws AuthError which the global error handler will catch.
 */
export function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AuthError('Authorization header is required');
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new AuthError('Authorization header must be in format: Bearer <token>');
    }

    const token = parts[1];

    if (!token) {
      throw new AuthError('Token is required');
    }

    const payload = verifyAccessToken(token);

    req.user = {
      userId: payload.userId,
      email: payload.email,
    };

    next();
  } catch (error) {
    if (error instanceof AuthError) {
      next(error);
      return;
    }

    // JWT-specific errors (expired, malformed, etc.)
    if (error instanceof Error) {
      if (error.name === 'TokenExpiredError') {
        next(new TokenExpiredError('Access token has expired'));
        return;
      }
      if (error.name === 'JsonWebTokenError') {
        next(new AuthError('Invalid access token'));
        return;
      }
    }

    next(new AuthError('Authentication failed'));
  }
}
