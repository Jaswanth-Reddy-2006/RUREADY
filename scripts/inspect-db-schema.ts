import { prisma } from '../services/challenge-service/src/lib/prisma.js';

async function main() {
  const problems: any = await prisma.$queryRawUnsafe(`
    SELECT id, slug, title, difficulty, category FROM system_design_problems;
  `);
  console.log(`\n=== Existing system_design_problems (${problems.length} total) ===`);
  for (const p of problems) {
    console.log(`  - [${p.slug}] ${p.title} (${p.difficulty}, ${p.category})`);
  }
}

main().finally(() => prisma.$disconnect());
