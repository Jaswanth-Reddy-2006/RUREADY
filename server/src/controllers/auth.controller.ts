// ═══════════════════════════════════════════════════════════════
// R U Ready? — Auth Controller
// Handles register, login, refresh, and logout endpoints
// ═══════════════════════════════════════════════════════════════

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import {
  AuthError,
  ConflictError,
  ValidationError,
} from '../lib/errors.js';
import {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  revokeAllUserRefreshTokens,
} from '../services/auth.service.js';

// ─── Validation Schemas ──────────────────────────────────────

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters'),
  email: z
    .string()
    .trim()
    .email('Invalid email address')
    .toLowerCase(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be at most 128 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    ),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Invalid email address')
    .toLowerCase(),
  password: z
    .string()
    .min(1, 'Password is required'),
});

// ─── Cookie Configuration ────────────────────────────────────

const REFRESH_COOKIE_NAME = 'refreshToken';
const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: 'strict' as const,
  path: '/api/auth/refresh',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
};

// ─── Controllers ─────────────────────────────────────────────

/**
 * POST /api/auth/register
 * Creates a new user account and returns JWT tokens.
 */
export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { name, email, password } = req.body as z.infer<typeof registerSchema>;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictError('An account with this email already exists');
    }

    // Hash password and create user
    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Generate tokens
    const accessToken = generateAccessToken(user.id, user.email);
    const refreshToken = await generateRefreshToken(user.id);

    // Set refresh token as httpOnly cookie
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, REFRESH_COOKIE_OPTIONS);

    const isUserAdmin = user.email.toLowerCase() === 'admin@ruready.ai' || user.email.toLowerCase().startsWith('admin@');

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: isUserAdmin ? 'ADMIN' : 'CANDIDATE',
        plan: 'FREE',
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
      accessToken,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/check-email
 * Checks if an email is already registered in real time.
 */
export async function checkEmail(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { email } = req.body as { email?: string };
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      res.status(200).json({ exists: false });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.trim() },
      select: { id: true },
    });

    res.status(200).json({ exists: !!existingUser });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/login
 * Authenticates a user and returns JWT tokens.
 */
export async function login(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { email, password } = req.body as z.infer<typeof loginSchema>;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Use generic message to prevent user enumeration
      throw new AuthError('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new AuthError('Invalid email or password');
    }

    // Generate tokens
    const accessToken = generateAccessToken(user.id, user.email);
    const refreshToken = await generateRefreshToken(user.id);

    // Set refresh token as httpOnly cookie
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, REFRESH_COOKIE_OPTIONS);

    const isUserAdmin = user.email.toLowerCase() === 'admin@ruready.ai' || user.email.toLowerCase().startsWith('admin@');

    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: isUserAdmin ? 'ADMIN' : 'CANDIDATE',
        plan: 'FREE',
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
      accessToken,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/refresh
 * Rotates the refresh token and returns a new access token.
 * Reads the refresh token from the httpOnly cookie.
 */
export async function refresh(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const token = req.cookies?.[REFRESH_COOKIE_NAME];

    if (!token) {
      throw new AuthError('Refresh token is required');
    }

    // Verify and rotate the refresh token
    let payload;
    try {
      payload = await verifyRefreshToken(token);
    } catch {
      // Clear the invalid cookie
      res.clearCookie(REFRESH_COOKIE_NAME, REFRESH_COOKIE_OPTIONS);
      throw new AuthError('Invalid or expired refresh token');
    }

    // Fetch user to ensure they still exist and get latest email
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true },
    });

    if (!user) {
      throw new AuthError('User no longer exists');
    }

    // Generate new token pair
    const newAccessToken = generateAccessToken(user.id, user.email);
    const newRefreshToken = await generateRefreshToken(user.id);

    // Set new refresh token cookie
    res.cookie(REFRESH_COOKIE_NAME, newRefreshToken, REFRESH_COOKIE_OPTIONS);

    res.status(200).json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/logout
 * Revokes all refresh tokens for the user and clears the cookie.
 */
export async function logout(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const token = req.cookies?.[REFRESH_COOKIE_NAME];
    let userId: string | undefined;

    const jwt = await import('jsonwebtoken');

    if (token) {
      try {
        const decoded = jwt.default.decode(token) as {
          userId?: string;
        } | null;
        userId = decoded?.userId;
      } catch {
        // Token is malformed — ignore
      }
    }

    // Fallback: If cookie was not sent due to path scope restriction,
    // decode the user ID from the Authorization header access token.
    if (!userId && req.headers.authorization) {
      try {
        const parts = req.headers.authorization.split(' ');
        if (parts.length === 2 && parts[0] === 'Bearer') {
          const accessToken = parts[1];
          const decoded = jwt.default.decode(accessToken) as {
            userId?: string;
          } | null;
          userId = decoded?.userId;
        }
      } catch {
        // ignore
      }
    }

    if (userId) {
      await revokeAllUserRefreshTokens(userId);
    }

    // Clear the refresh token cookie specifying the matching path constraint
    res.clearCookie(REFRESH_COOKIE_NAME, REFRESH_COOKIE_OPTIONS);

    res.status(200).json({
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
}
