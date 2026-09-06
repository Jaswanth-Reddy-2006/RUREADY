// ═══════════════════════════════════════════════════════════════
// R U Ready? — Seed Admin Account
// ═══════════════════════════════════════════════════════════════

import bcrypt from 'bcryptjs';
import prisma from './lib/prisma.js';

async function seedAdmin() {
  const email = 'admin@ruready.ai';
  const password = 'Admin@12345';
  const passwordHash = await bcrypt.hash(password, 12);

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    await prisma.user.update({
      where: { email },
      data: {
        name: 'RU Ready Administrator',
        passwordHash,
      },
    });
    console.log(`✅ Admin user updated: ${email} / ${password}`);
  } else {
    await prisma.user.create({
      data: {
        email,
        name: 'RU Ready Administrator',
        passwordHash,
      },
    });
    console.log(`✅ Admin user created: ${email} / ${password}`);
  }
}

seedAdmin()
  .catch((err) => {
    console.error('Error seeding admin:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
