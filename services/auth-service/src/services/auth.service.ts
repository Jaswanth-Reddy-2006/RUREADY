// ═══════════════════════════════════════════════════════════════
// Auth Microservice — Auth Service Logic
// ═══════════════════════════════════════════════════════════════

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../lib/prisma.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret-ru-ready-2024';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-ru-ready-2024';
const ACCESS_TOKEN_EXPIRY = '2h';
const REFRESH_TOKEN_EXPIRY = '30d';
const BCRYPT_ROUNDS = 12;
const REFRESH_TOKEN_DAYS = 30;

async function storeRefreshTokenInBackend(userId: string, tokenId: string): Promise<void> {
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

async function getStoredRefreshToken(userId: string, tokenId: string): Promise<string | null> {
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

async function deleteStoredRefreshToken(userId: string, tokenId: string): Promise<void> {
  await prisma.refreshToken.deleteMany({
    where: { userId, tokenId },
  });
}

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

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateAccessToken(userId: string, email: string): string {
  const payload: AccessTokenPayload = { userId, email, type: 'access' };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const decoded = jwt.verify(token, JWT_SECRET) as AccessTokenPayload & { iat: number; exp: number };
  if (decoded.type !== 'access') {
    throw new Error('Invalid token type');
  }
  return { userId: decoded.userId, email: decoded.email, type: 'access' };
}

export async function generateRefreshToken(userId: string): Promise<string> {
  const tokenId = uuidv4();
  const payload: RefreshTokenPayload = { userId, tokenId, type: 'refresh' };
  const token = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });

  await storeRefreshTokenInBackend(userId, tokenId);
  return token;
}

export async function verifyRefreshToken(token: string): Promise<RefreshTokenPayload> {
  const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as RefreshTokenPayload & { iat: number; exp: number };
  if (decoded.type !== 'refresh') {
    throw new Error('Invalid token type');
  }

  const isValid = await getStoredRefreshToken(decoded.userId, decoded.tokenId);
  if (!isValid) {
    await revokeAllUserRefreshTokens(decoded.userId);
    throw new Error('Refresh token has been revoked');
  }

  await deleteStoredRefreshToken(decoded.userId, decoded.tokenId);
  return { userId: decoded.userId, tokenId: decoded.tokenId, type: 'refresh' };
}

export async function revokeAllUserRefreshTokens(userId: string): Promise<void> {
  await prisma.refreshToken.deleteMany({
    where: { userId },
  });
}
