import { prisma } from '../services/roadmap-service/src/lib/prisma.js';

async function main() {
  const statements = [
    // 1. roadmaps table
    `ALTER TABLE "roadmaps" ADD COLUMN IF NOT EXISTS "currentVersion" integer DEFAULT 1;`,
    `ALTER TABLE "roadmaps" ADD COLUMN IF NOT EXISTS "forkedFromId" text;`,
    `ALTER TABLE "roadmaps" ADD COLUMN IF NOT EXISTS "forkedFromVersion" integer;`,
    `ALTER TABLE "roadmaps" ADD COLUMN IF NOT EXISTS "forkCount" integer DEFAULT 0;`,
    `ALTER TABLE "roadmaps" ADD COLUMN IF NOT EXISTS "followerCount" integer DEFAULT 0;`,
    `ALTER TABLE "roadmaps" ADD COLUMN IF NOT EXISTS "rating" double precision DEFAULT 0.0;`,
    `ALTER TABLE "roadmaps" ADD COLUMN IF NOT EXISTS "reviewCount" integer DEFAULT 0;`,
    `ALTER TABLE "roadmaps" ADD COLUMN IF NOT EXISTS "isEndorsed" boolean DEFAULT false;`,
    `ALTER TABLE "roadmaps" ADD COLUMN IF NOT EXISTS "creatorRole" text;`,
    `ALTER TABLE "roadmaps" ADD COLUMN IF NOT EXISTS "creatorCompany" text;`,
    `ALTER TABLE "roadmaps" ADD COLUMN IF NOT EXISTS "isVerifiedCreator" boolean DEFAULT false;`,
    `ALTER TABLE "roadmaps" ADD COLUMN IF NOT EXISTS "license" text DEFAULT 'CC-BY-4.0';`,
    `ALTER TABLE "roadmaps" ADD COLUMN IF NOT EXISTS "graphLayout" jsonb DEFAULT '{"nodes": [], "edges": []}'::jsonb;`,

    // 2. roadmap_progress table
    `ALTER TABLE "roadmap_progress" ADD COLUMN IF NOT EXISTS "masteryStatus" text DEFAULT 'NOT_STARTED';`,
    `ALTER TABLE "roadmap_progress" ADD COLUMN IF NOT EXISTS "competenciesDemonstrated" jsonb DEFAULT '[]'::jsonb;`,
    `ALTER TABLE "roadmap_progress" ADD COLUMN IF NOT EXISTS "checklistCompleted" jsonb DEFAULT '[]'::jsonb;`,
    `ALTER TABLE "roadmap_progress" ADD COLUMN IF NOT EXISTS "assessmentScore" integer;`,
    `ALTER TABLE "roadmap_progress" ADD COLUMN IF NOT EXISTS "lastAssessmentAt" timestamp without time zone;`,

    // 3. roadmap_instances table
    `CREATE TABLE IF NOT EXISTS "roadmap_instances" (
      "id" text PRIMARY KEY,
      "userId" text NOT NULL,
      "roadmapId" text NOT NULL REFERENCES "roadmaps"("id") ON DELETE CASCADE,
      "roadmapVersion" integer NOT NULL DEFAULT 1,
      "status" text NOT NULL DEFAULT 'ACTIVE',
      "targetPaceHoursPerWeek" integer NOT NULL DEFAULT 6,
      "currentModuleId" text,
      "progressPercent" integer NOT NULL DEFAULT 0,
      "completedModulesCount" integer NOT NULL DEFAULT 0,
      "totalModulesCount" integer NOT NULL DEFAULT 0,
      "customOverrides" jsonb DEFAULT '{}'::jsonb,
      "createdAt" timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "roadmap_instances_userId_roadmapId_idx" ON "roadmap_instances"("userId", "roadmapId");`,
    `CREATE INDEX IF NOT EXISTS "roadmap_instances_userId_idx" ON "roadmap_instances"("userId");`,

    // 4. roadmap_follows table
    `CREATE TABLE IF NOT EXISTS "roadmap_follows" (
      "id" text PRIMARY KEY,
      "userId" text NOT NULL,
      "roadmapId" text NOT NULL REFERENCES "roadmaps"("id") ON DELETE CASCADE,
      "createdAt" timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "roadmap_follows_userId_roadmapId_idx" ON "roadmap_follows"("userId", "roadmapId");`,
    `CREATE INDEX IF NOT EXISTS "roadmap_follows_userId_idx" ON "roadmap_follows"("userId");`,

    // 5. roadmap_reviews table
    `CREATE TABLE IF NOT EXISTS "roadmap_reviews" (
      "id" text PRIMARY KEY,
      "roadmapId" text NOT NULL REFERENCES "roadmaps"("id") ON DELETE CASCADE,
      "userId" text NOT NULL,
      "userName" text NOT NULL,
      "userAvatar" text,
      "rating" integer NOT NULL,
      "reviewText" text NOT NULL,
      "isVerifiedLearner" boolean NOT NULL DEFAULT false,
      "createdAt" timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "roadmap_reviews_roadmapId_userId_idx" ON "roadmap_reviews"("roadmapId", "userId");`,
    `CREATE INDEX IF NOT EXISTS "roadmap_reviews_roadmapId_idx" ON "roadmap_reviews"("roadmapId");`,

    // 6. roadmap_discussions table
    `CREATE TABLE IF NOT EXISTS "roadmap_discussions" (
      "id" text PRIMARY KEY,
      "roadmapId" text NOT NULL REFERENCES "roadmaps"("id") ON DELETE CASCADE,
      "nodeId" text,
      "userId" text NOT NULL,
      "userName" text NOT NULL,
      "userAvatar" text,
      "title" text,
      "content" text NOT NULL,
      "replyCount" integer NOT NULL DEFAULT 0,
      "createdAt" timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE INDEX IF NOT EXISTS "roadmap_discussions_roadmapId_idx" ON "roadmap_discussions"("roadmapId");`,
    `CREATE INDEX IF NOT EXISTS "roadmap_discussions_nodeId_idx" ON "roadmap_discussions"("nodeId");`,

    // 7. roadmap_assessment_attempts table
    `CREATE TABLE IF NOT EXISTS "roadmap_assessment_attempts" (
      "id" text PRIMARY KEY,
      "userId" text NOT NULL,
      "roadmapId" text NOT NULL REFERENCES "roadmaps"("id") ON DELETE CASCADE,
      "nodeId" text NOT NULL,
      "nodeTitle" text NOT NULL,
      "score" integer NOT NULL,
      "passed" boolean NOT NULL,
      "verdict" text NOT NULL,
      "feedback" text NOT NULL,
      "competencyScores" jsonb NOT NULL DEFAULT '[]'::jsonb,
      "transcript" jsonb NOT NULL DEFAULT '[]'::jsonb,
      "createdAt" timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE INDEX IF NOT EXISTS "roadmap_assessment_attempts_userId_roadmapId_idx" ON "roadmap_assessment_attempts"("userId", "roadmapId");`,
    `CREATE INDEX IF NOT EXISTS "roadmap_assessment_attempts_nodeId_idx" ON "roadmap_assessment_attempts"("nodeId");`
  ];

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    try {
      await prisma.$executeRawUnsafe(stmt);
    } catch (e: any) {
      console.warn(`Warning on statement ${i}:`, e.message);
    }
  }

  console.log('--- Verification of created tables ---');
  const allTables: any = await prisma.$queryRawUnsafe(`
    SELECT table_name FROM information_schema.tables WHERE table_name LIKE 'roadmap%' ORDER BY table_name;
  `);
  for (const t of allTables) {
    console.log(' - Table exists:', t.table_name);
  }
}

main()
  .then(() => console.log('Roadmap schema migration completed successfully!'))
  .catch((err) => console.error('Migration error:', err))
  .finally(() => prisma.$disconnect());
