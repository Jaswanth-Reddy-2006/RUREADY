// ═══════════════════════════════════════════════════════════════
// Auth Microservice — Auth Service Logic
// ═══════════════════════════════════════════════════════════════

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../lib/prisma.js';
import { emailService } from './email.service.js';
import { AuthError, ConflictError, NotFoundError } from '../lib/errors.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret-ru-ready-2024';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-ru-ready-2024';
const ACCESS_TOKEN_EXPIRY = '2h';
const REFRESH_TOKEN_EXPIRY = '30d';
const BCRYPT_ROUNDS = 12;
const REFRESH_TOKEN_DAYS = 30;

async function storeRefreshTokenInBackend(userId: string, tokenId: string): Promise<void> {
  try {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_DAYS);

    await prisma.refreshToken.upsert({
      where: {
        userId_tokenId: { userId, tokenId },
      },
      create: { userId, tokenId, expiresAt },
      update: { expiresAt },
    });
  } catch (err: any) {
    console.warn('[AuthService] Could not store refresh token in DB (DB offline/mock mode):', err?.message || err);
  }
}

async function getStoredRefreshToken(userId: string, tokenId: string): Promise<string | null> {
  try {
    const record = await prisma.refreshToken.findUnique({
      where: {
        userId_tokenId: { userId, tokenId },
      },
    });

    if (!record || record.expiresAt < new Date()) {
      if (record) {
        try {
          await prisma.refreshToken.delete({
            where: { userId_tokenId: { userId, tokenId } },
          });
        } catch {
          // ignore
        }
      }
      return null;
    }

    return 'valid';
  } catch (err: any) {
    console.warn('[AuthService] DB check fallback for refresh token:', err?.message || err);
    return 'valid';
  }
}

async function deleteStoredRefreshToken(userId: string, tokenId: string): Promise<void> {
  try {
    await prisma.refreshToken.deleteMany({
      where: { userId, tokenId },
    });
  } catch {
    // ignore
  }
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

/**
 * Generate a 6-digit registration OTP, store hash in DB, and send via Resend
 */
export async function generateAndSendRegistrationOtp(
  email: string,
  name?: string
): Promise<{ success: boolean; message: string; emailSent?: boolean }> {
  const cleanEmail = email.trim().toLowerCase();

  // 1. Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: cleanEmail },
  });
  if (existingUser) {
    throw new ConflictError('An account with this email already exists. Please log in.');
  }

  // 2. Generate cryptographically strong 6-digit numeric OTP
  const rawOtp = crypto.randomInt(100000, 999999).toString();
  const otpHash = crypto.createHash('sha256').update(rawOtp + JWT_SECRET).digest('hex');
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // 3. Remove any previous unverified OTP for this email
  await prisma.otpVerification.deleteMany({
    where: { email: cleanEmail },
  });

  // 4. Store hashed OTP in database
  await prisma.otpVerification.create({
    data: {
      email: cleanEmail,
      otpHash,
      expiresAt,
    },
  });

  // 5. Dispatch email via Resend
  const emailResult = await emailService.sendRegistrationOtp(cleanEmail, name || 'Candidate', rawOtp);

  console.log(
    `\n======================================================================\n` +
    `🔑 [RENNETUS AUTH OTP]\n` +
    `   Recipient: ${cleanEmail}\n` +
    `   OTP Code:  ${rawOtp}\n` +
    `   Resend:    ${emailResult.success ? '✅ Delivered to Inbox' : '⚠️ Resend Sandbox Restricted (Domain unverified on Resend)'}\n` +
    `======================================================================\n`
  );

  return {
    success: true,
    message: emailResult.success
      ? `Verification code dispatched to ${cleanEmail}`
      : `Verification code generated. Please check your email.`,
    emailSent: emailResult.success,
  };
}

/**
 * Verify 6-digit OTP and return a signed temporary verification token
 */
export async function verifyRegistrationOtp(
  email: string,
  otp: string
): Promise<{ verified: boolean; verificationToken: string }> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanOtp = otp.trim();

  const record = await prisma.otpVerification.findFirst({
    where: {
      email: cleanEmail,
      expiresAt: { gt: new Date() },
    },
  });

  if (!record) {
    throw new AuthError('Verification code has expired or does not exist. Please request a new code.');
  }

  // Rate-limiting attempt count
  if (record.attempts >= 5) {
    await prisma.otpVerification.delete({ where: { id: record.id } });
    throw new AuthError('Too many failed verification attempts. Please request a new code.');
  }

  const expectedHash = crypto.createHash('sha256').update(cleanOtp + JWT_SECRET).digest('hex');

  if (record.otpHash !== expectedHash) {
    await prisma.otpVerification.update({
      where: { id: record.id },
      data: { attempts: { increment: 1 } },
    });
    throw new AuthError('Invalid verification code. Please check and try again.');
  }

  // Successfully verified! Delete OTP record
  await prisma.otpVerification.delete({ where: { id: record.id } });

  // Issue a 30-minute signed verification token
  const verificationToken = jwt.sign(
    { email: cleanEmail, type: 'email-verified' },
    JWT_SECRET,
    { expiresIn: '30m' }
  );

  return {
    verified: true,
    verificationToken,
  };
}

/**
 * Validate temporary email verification token
 */
export function verifyEmailToken(token: string, expectedEmail: string): boolean {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string; type: string };
    return decoded.type === 'email-verified' && decoded.email.toLowerCase() === expectedEmail.toLowerCase();
  } catch {
    return false;
  }
}

/**
 * Initiate Forgot Password flow: Generates secure token and sends reset link via Resend
 */
export async function sendForgotPasswordReset(
  email: string
): Promise<{ success: boolean; message: string; emailSent?: boolean }> {
  const cleanEmail = email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email: cleanEmail },
  });

  // Always return success even if user not found to prevent account enumeration
  if (!user) {
    return {
      success: true,
      message: 'If an account is associated with this email, a password reset link has been dispatched.',
    };
  }

  // Generate 32-byte secure random token
  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  // Remove existing tokens
  await prisma.passwordResetToken.deleteMany({
    where: { email: cleanEmail },
  });

  // Persist token hash
  await prisma.passwordResetToken.create({
    data: {
      email: cleanEmail,
      tokenHash,
      expiresAt,
    },
  });

  // Construct Reset URL
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const resetUrl = `${clientUrl}/reset-password?token=${rawToken}&email=${encodeURIComponent(cleanEmail)}`;

  const emailResult = await emailService.sendPasswordResetEmail(cleanEmail, resetUrl);

  console.log(
    `\n======================================================================\n` +
    `🔑 [RENNETUS PASSWORD RESET LINK]\n` +
    `   Recipient: ${cleanEmail}\n` +
    `   Reset URL: ${resetUrl}\n` +
    `   Resend:    ${emailResult.success ? '✅ Delivered to Inbox' : '⚠️ Resend Sandbox Restricted (Domain unverified on Resend)'}\n` +
    `======================================================================\n`
  );

  return {
    success: true,
    message: 'If an account is associated with this email, a password reset link has been dispatched.',
    emailSent: emailResult.success,
  };
}

/**
 * Reset password using token sent to email
 */
export async function resetPasswordWithToken(
  token: string,
  email: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  const cleanEmail = email.trim().toLowerCase();
  const tokenHash = crypto.createHash('sha256').update(token.trim()).digest('hex');

  const record = await prisma.passwordResetToken.findFirst({
    where: {
      email: cleanEmail,
      tokenHash,
      expiresAt: { gt: new Date() },
    },
  });

  if (!record) {
    throw new AuthError('This password reset link is invalid or has expired. Please request a new link.');
  }

  const user = await prisma.user.findUnique({
    where: { email: cleanEmail },
  });

  if (!user) {
    throw new NotFoundError('User account not found');
  }

  // Hash new password
  const newPasswordHash = await hashPassword(newPassword);

  // Update password in DB
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: newPasswordHash },
  });

  // Clean up used token
  await prisma.passwordResetToken.delete({
    where: { id: record.id },
  });

  // Invalidate any active refresh tokens to force re-login
  await revokeAllUserRefreshTokens(user.id);

  return {
    success: true,
    message: 'Your password has been successfully reset. Please sign in with your new password.',
  };
}
