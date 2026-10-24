import { prisma } from '../services/challenge-service/src/lib/prisma.js';
import { SYSTEM_DESIGN_PROBLEMS } from '../services/system-design-service/src/data/systemDesignProblems.data.js';

async function migrateAndSeed() {
  console.log('--- 1. Safe DDL for match_sessions ---');
  await prisma.$executeRawUnsafe(`
    ALTER TABLE "match_sessions" 
      ADD COLUMN IF NOT EXISTS "difficulty" text DEFAULT 'MEDIUM',
      ADD COLUMN IF NOT EXISTS "resultSummary" text,
      ADD COLUMN IF NOT EXISTS "problemId" text,
      ADD COLUMN IF NOT EXISTS "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP;
  `);
  console.log('Successfully aligned match_sessions columns.');

  console.log('--- 2. Safe DDL for match_participants ---');
  await prisma.$executeRawUnsafe(`
    ALTER TABLE "match_participants" 
      ADD COLUMN IF NOT EXISTS "problemsSolved" integer DEFAULT 0,
      ADD COLUMN IF NOT EXISTS "passedTests" integer DEFAULT 0,
      ADD COLUMN IF NOT EXISTS "totalTests" integer DEFAULT 5,
      ADD COLUMN IF NOT EXISTS "ratingBefore" integer DEFAULT 1200,
      ADD COLUMN IF NOT EXISTS "ratingAfter" integer DEFAULT 1200,
      ADD COLUMN IF NOT EXISTS "xpEarned" integer DEFAULT 0,
      ADD COLUMN IF NOT EXISTS "status" text DEFAULT 'IN_PROGRESS';
  `);
  console.log('Successfully aligned match_participants columns.');

  console.log('--- 3. Seed system_design_problems ---');
  for (const p of SYSTEM_DESIGN_PROBLEMS) {
    await prisma.$executeRawUnsafe(`
      INSERT INTO "system_design_problems" (
        "id", "slug", "title", "difficulty", "category", "summary", "description",
        "functionalRequirements", "nonFunctionalRequirements", "trafficDefaults",
        "suggestedComponents", "starterGraph", "referenceArchitecture", "rubricTemplate",
        "createdAt", "updatedAt"
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10::jsonb,
        $11, $12::jsonb, $13::jsonb, $14::jsonb,
        NOW(), NOW()
      )
      ON CONFLICT ("id") DO UPDATE SET
        "title" = EXCLUDED."title",
        "difficulty" = EXCLUDED."difficulty",
        "category" = EXCLUDED."category",
        "summary" = EXCLUDED."summary",
        "description" = EXCLUDED."description",
        "functionalRequirements" = EXCLUDED."functionalRequirements",
        "nonFunctionalRequirements" = EXCLUDED."nonFunctionalRequirements",
        "trafficDefaults" = EXCLUDED."trafficDefaults",
        "suggestedComponents" = EXCLUDED."suggestedComponents",
        "referenceArchitecture" = EXCLUDED."referenceArchitecture",
        "updatedAt" = NOW();
    `,
      p.id,
      p.slug,
      p.title,
      p.difficulty,
      p.category,
      p.summary,
      p.description,
      p.functionalRequirements,
      p.nonFunctionalRequirements,
      JSON.stringify(p.trafficDefaults),
      p.suggestedComponents,
      JSON.stringify({ nodes: [], edges: [] }),
      JSON.stringify(p.referenceArchitecture),
      JSON.stringify({})
    );
    console.log(`Seeded/Updated problem: ${p.title} (${p.id})`);
  }

  console.log('\n--- Verification ---');
  const sessionCols: any = await prisma.$queryRawUnsafe(`
    SELECT column_name FROM information_schema.columns WHERE table_name = 'match_sessions';
  `);
  console.log('match_sessions columns count:', sessionCols.length);

  const participantCols: any = await prisma.$queryRawUnsafe(`
    SELECT column_name FROM information_schema.columns WHERE table_name = 'match_participants';
  `);
  console.log('match_participants columns count:', participantCols.length);

  const seededProblems: any = await prisma.$queryRawUnsafe(`
    SELECT id, slug, title FROM system_design_problems;
  `);
  console.log('system_design_problems in DB:', seededProblems.length);
}

migrateAndSeed()
  .then(() => console.log('Migration & Seeding completed successfully!'))
  .catch((err) => console.error('Migration error:', err))
  .finally(() => prisma.$disconnect());
