// ═══════════════════════════════════════════════════════════════
// R U Ready? — Admin Authorization Middleware
// Verifies user has administrative permissions
// ═══════════════════════════════════════════════════════════════

import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma.js';
import { AuthError } from '../lib/errors.js';

export async function requireAdmin(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  const userId = (req as any).user?.userId;
  const userEmail = (req as any).user?.email?.toLowerCase();

  if (!userId) {
    next(new AuthError('Authentication required to access admin resources.'));
    return;
  }

  // Fast check by email domain / specific admin address
  if (userEmail === 'admin@ruready.ai' || userEmail?.startsWith('admin@') || userEmail?.includes('+admin')) {
    next();
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    if (!user) {
      next(new AuthError('User account not found.'));
      return;
    }

    const email = user.email.toLowerCase();
    if (email === 'admin@ruready.ai' || email.startsWith('admin@') || email.includes('+admin')) {
      next();
      return;
    }

    next(new AuthError('Access denied. Administrator privileges required.'));
  } catch (error) {
    next(error);
  }
}
