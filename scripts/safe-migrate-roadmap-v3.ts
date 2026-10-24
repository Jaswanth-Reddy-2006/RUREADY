import { prisma } from '../services/roadmap-service/src/lib/prisma.js';

async function main() {
  const statements = [
    `CREATE TABLE IF NOT EXISTS "roadmap_submissions" (
      "id" text PRIMARY KEY,
      "roadmapId" text NOT NULL REFERENCES "roadmaps"("id") ON DELETE CASCADE,
      "nodeId" text NOT NULL REFERENCES "roadmap_nodes"("id") ON DELETE CASCADE,
      "userId" text NOT NULL,
      "userName" text,
      "userAvatar" text,
      "deliverableType" text NOT NULL,
      "deliverableUrl" text,
      "deliverableText" text,
      "codeLanguage" text,
      "executionResult" jsonb,
      "status" text NOT NULL DEFAULT 'SUBMITTED',
      "evaluationFeedback" text,
      "rubricScore" integer,
      "competenciesDemonstrated" jsonb,
      "evaluatedAt" timestamp without time zone,
      "createdAt" timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE INDEX IF NOT EXISTS "roadmap_submissions_roadmapId_userId_idx" ON "roadmap_submissions"("roadmapId", "userId");`,
    `CREATE INDEX IF NOT EXISTS "roadmap_submissions_nodeId_userId_idx" ON "roadmap_submissions"("nodeId", "userId");`,

    `CREATE TABLE IF NOT EXISTS "roadmap_learning_circles" (
      "id" text PRIMARY KEY,
      "roadmapId" text NOT NULL REFERENCES "roadmaps"("id") ON DELETE CASCADE,
      "name" text NOT NULL,
      "description" text,
      "creatorId" text NOT NULL,
      "creatorName" text,
      "isPrivate" boolean NOT NULL DEFAULT false,
      "joinCode" text UNIQUE,
      "targetDate" timestamp without time zone,
      "weeklyGoalHours" integer NOT NULL DEFAULT 8,
      "createdAt" timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE INDEX IF NOT EXISTS "roadmap_learning_circles_roadmapId_idx" ON "roadmap_learning_circles"("roadmapId");`,

    `CREATE TABLE IF NOT EXISTS "roadmap_learning_circle_members" (
      "id" text PRIMARY KEY,
      "circleId" text NOT NULL REFERENCES "roadmap_learning_circles"("id") ON DELETE CASCADE,
      "userId" text NOT NULL,
      "userName" text NOT NULL,
      "userAvatar" text,
      "role" text NOT NULL DEFAULT 'MEMBER',
      "progressPercent" integer NOT NULL DEFAULT 0,
      "completedModulesCount" integer NOT NULL DEFAULT 0,
      "joinedAt" timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "roadmap_learning_circle_members_circleId_userId_key" ON "roadmap_learning_circle_members"("circleId", "userId");`,
    `CREATE INDEX IF NOT EXISTS "roadmap_learning_circle_members_userId_idx" ON "roadmap_learning_circle_members"("userId");`,
  ];

  console.log('Applying Roadmap V3 safe migrations...');
  for (const sql of statements) {
    try {
      await prisma.$executeRawUnsafe(sql);
      console.log('✓ Executed:', sql.substring(0, 60).replace(/\s+/g, ' ') + '...');
    } catch (e: any) {
      console.error('Migration error:', e.message);
    }
  }
  console.log('Roadmap V3 migrations finished successfully.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
