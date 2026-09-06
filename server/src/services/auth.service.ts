// ═══════════════════════════════════════════════════════════════
// R U Ready? — Auth Service
// Token generation, verification, and refresh token rotation
// ═══════════════════════════════════════════════════════════════

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../lib/prisma.js';

// ─── Constants ───────────────────────────────────────────────

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-jwt-secret-dev-only';
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret-dev-only';
const ACCESS_TOKEN_EXPIRY = '2h';
const REFRESH_TOKEN_EXPIRY = '30d';
const BCRYPT_ROUNDS = 12;

const REFRESH_TOKEN_DAYS = 30;

async function storeRefreshTokenInBackend(
  userId: string,
  tokenId: string,
): Promise<void> {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_DAYS);

  await prisma.refreshToken.upsert({
    where: {
      userId_tokenId: { userId, tokenId },
    },
    create: { userId, tokenId, expiresAt },
    update: { expiresAt },
  });
}

async function getStoredRefreshToken(
  userId: string,
  tokenId: string,
): Promise<string | null> {
  const record = await prisma.refreshToken.findUnique({
    where: {
      userId_tokenId: { userId, tokenId },
    },
  });

  if (!record || record.expiresAt < new Date()) {
    if (record) {
      await prisma.refreshToken.delete({
        where: { userId_tokenId: { userId, tokenId } },
      });
    }
    return null;
  }

  return 'valid';
}

async function deleteStoredRefreshToken(
  userId: string,
  tokenId: string,
): Promise<void> {
  await prisma.refreshToken.deleteMany({
    where: { userId, tokenId },
  });
}

async function scanStoredRefreshTokens(userId: string): Promise<string[]> {
  const tokens = await prisma.refreshToken.findMany({
    where: { userId },
    select: { tokenId: true },
  });
  return tokens.map((t) => `refresh:${userId}:${t.tokenId}`);
}

// ─── Token Payload Interfaces ────────────────────────────────

export interface AccessTokenPayload {
  userId: string;
  email: string;
  type: 'access';
}

export interface RefreshTokenPayload {
  userId: string;
  tokenId: string;
  type: 'refresh';
}

// ─── Password Hashing ───────────────────────────────────────

/**
 * Hash a plaintext password using bcrypt.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

/**
 * Compare a plaintext password against a bcrypt hash.
 */
export async function comparePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ─── Access Tokens ───────────────────────────────────────────

/**
 * Generate a short-lived access token (15 minutes).
 */
export function generateAccessToken(userId: string, email: string): string {
  const payload: AccessTokenPayload = { userId, email, type: 'access' };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
}

/**
 * Verify and decode an access token.
 * Throws if the token is expired, malformed, or not an access token.
 */
export function verifyAccessToken(token: string): AccessTokenPayload {
  const decoded = jwt.verify(token, JWT_SECRET) as AccessTokenPayload & {
    iat: number;
    exp: number;
  };

  if (decoded.type !== 'access') {
    throw new Error('Invalid token type');
  }

  return { userId: decoded.userId, email: decoded.email, type: 'access' };
}

// ─── Refresh Tokens ──────────────────────────────────────────

/**
 * Generate a refresh token and store its ID in memory for rotation tracking.
 * Each refresh token gets a unique ID so we can revoke individually.
 */
export async function generateRefreshToken(userId: string): Promise<string> {
  const tokenId = uuidv4();
  const payload: RefreshTokenPayload = { userId, tokenId, type: 'refresh' };

  const token = jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });

  await storeRefreshTokenInBackend(userId, tokenId);

  return token;
}

/**
 * Verify a refresh token and check it hasn't been revoked.
 * Implements token rotation: the used token is invalidated,
 * and the caller must issue a new one.
 */
export async function verifyRefreshToken(
  token: string,
): Promise<RefreshTokenPayload> {
  const decoded = jwt.verify(
    token,
    JWT_REFRESH_SECRET,
  ) as RefreshTokenPayload & { iat: number; exp: number };

  if (decoded.type !== 'refresh') {
    throw new Error('Invalid token type');
  }

  // Check if this specific token is still valid
  const isValid = await getStoredRefreshToken(decoded.userId, decoded.tokenId);

  if (!isValid) {
    // Token has been revoked or already rotated — possible token reuse attack.
    // Revoke ALL refresh tokens for this user as a precaution.
    await revokeAllUserRefreshTokens(decoded.userId);
    throw new Error('Refresh token has been revoked');
  }

  // Invalidate the used token (rotation)
  await deleteStoredRefreshToken(decoded.userId, decoded.tokenId);

  return {
    userId: decoded.userId,
    tokenId: decoded.tokenId,
    type: 'refresh',
  };
}

/**
 * Revoke a specific refresh token by its tokenId.
 */
export async function revokeRefreshToken(
  userId: string,
  tokenId: string,
): Promise<void> {
  await deleteStoredRefreshToken(userId, tokenId);
}

/**
 * Revoke ALL refresh tokens for a user (e.g., on logout or suspected compromise).
 */
export async function revokeAllUserRefreshTokens(
  userId: string,
): Promise<void> {
  await prisma.refreshToken.deleteMany({
    where: { userId },
  });
}
