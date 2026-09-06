// ═══════════════════════════════════════════════════════════════
// R U Ready? — Prisma Client Singleton
// Prevents multiple Prisma Client instances in development
// ═══════════════════════════════════════════════════════════════

import { PrismaClient } from '../generated/client/index.js';

const getDatabaseUrl = () => {
  const originalUrl = process.env.DATABASE_URL;
  if (!originalUrl) return undefined;

  try {
    if (originalUrl.startsWith('postgresql://') || originalUrl.startsWith('postgres://')) {
      const url = new URL(originalUrl);
      url.searchParams.set('connection_limit', '50');
      url.searchParams.set('pool_timeout', '30');
      return url.toString();
    }
  } catch (error) {
    console.warn('[Prisma] Failed to parse DATABASE_URL as URL. Appending raw params instead.', error);
  }

  if (originalUrl.includes('?')) {
    const parts = originalUrl.split('?');
    const params = new URLSearchParams(parts[1]);
    params.set('connection_limit', '50');
    params.set('pool_timeout', '30');
    return `${parts[0]}?${params.toString()}`;
  } else {
    return `${originalUrl}?connection_limit=50&pool_timeout=30`;
  }
};

const databaseUrl = getDatabaseUrl();

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: databaseUrl ? { db: { url: databaseUrl } } : { db: { url: process.env.DATABASE_URL } },
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;

