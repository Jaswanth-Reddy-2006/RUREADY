import { PrismaClient } from '../src/generated/client/index.js';

export async function initRoadmapDb() {
  const prisma = new PrismaClient();
  try {
    console.log('[Roadmap DB] Verifying and initializing roadmap tables...');

    const statements = [
      `CREATE TABLE IF NOT EXISTS "roadmaps" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "ownerId" TEXT NOT NULL,
        "creatorName" TEXT,
        "title" TEXT NOT NULL,
        "description" TEXT,
        "goal" TEXT,
        "category" TEXT,
        "difficulty" TEXT,
        "estimatedWeeks" INTEGER,
        "tags" JSONB,
        "cloneCount" INTEGER NOT NULL DEFAULT 0,
        "viewCount" INTEGER NOT NULL DEFAULT 0,
        "status" TEXT NOT NULL DEFAULT 'DRAFT',
        "isPublished" BOOLEAN NOT NULL DEFAULT false,
        "publishedAt" TIMESTAMP(3),
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`,

      `CREATE TABLE IF NOT EXISTS "roadmap_nodes" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "roadmapId" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "description" TEXT,
        "type" TEXT NOT NULL DEFAULT 'TOPIC',
        "position" INTEGER NOT NULL DEFAULT 0,
        "metadata" JSONB,
        "parentId" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`,

      `CREATE TABLE IF NOT EXISTS "roadmap_collaborators" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "roadmapId" TEXT NOT NULL,
        "userId" TEXT,
        "email" TEXT NOT NULL,
        "role" TEXT NOT NULL DEFAULT 'VIEWER',
        "status" TEXT NOT NULL DEFAULT 'PENDING',
        "invitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "joinedAt" TIMESTAMP(3)
      )`,

      `CREATE TABLE IF NOT EXISTS "roadmap_progress" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "roadmapId" TEXT NOT NULL,
        "nodeId" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'NOT_STARTED',
        "percent" INTEGER NOT NULL DEFAULT 0,
        "notes" TEXT,
        "completedAt" TIMESTAMP(3),
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`,

      `CREATE TABLE IF NOT EXISTS "roadmap_templates" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "category" TEXT,
        "isPublic" BOOLEAN NOT NULL DEFAULT true,
        "authorId" TEXT,
        "definition" JSONB NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`,

      `CREATE TABLE IF NOT EXISTS "roadmap_shares" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "roadmapId" TEXT NOT NULL,
        "token" TEXT NOT NULL,
        "expiresAt" TIMESTAMP(3),
        "access" TEXT NOT NULL DEFAULT 'VIEW',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`,

      `CREATE INDEX IF NOT EXISTS "roadmaps_ownerId_idx" ON "roadmaps"("ownerId")`,
      `CREATE INDEX IF NOT EXISTS "roadmaps_status_idx" ON "roadmaps"("status")`,
      `CREATE INDEX IF NOT EXISTS "roadmap_nodes_roadmapId_position_idx" ON "roadmap_nodes"("roadmapId", "position")`,
      `CREATE INDEX IF NOT EXISTS "roadmap_nodes_parentId_idx" ON "roadmap_nodes"("parentId")`,
      `CREATE INDEX IF NOT EXISTS "roadmap_collaborators_userId_idx" ON "roadmap_collaborators"("userId")`,
      `CREATE UNIQUE INDEX IF NOT EXISTS "roadmap_collaborators_roadmapId_email_key" ON "roadmap_collaborators"("roadmapId", "email")`,
      `CREATE INDEX IF NOT EXISTS "roadmap_progress_roadmapId_userId_idx" ON "roadmap_progress"("roadmapId", "userId")`,
      `CREATE UNIQUE INDEX IF NOT EXISTS "roadmap_progress_nodeId_userId_key" ON "roadmap_progress"("nodeId", "userId")`,
      `CREATE INDEX IF NOT EXISTS "roadmap_templates_category_isPublic_idx" ON "roadmap_templates"("category", "isPublic")`,
      `CREATE UNIQUE INDEX IF NOT EXISTS "roadmap_shares_roadmapId_key" ON "roadmap_shares"("roadmapId")`,
      `CREATE UNIQUE INDEX IF NOT EXISTS "roadmap_shares_token_key" ON "roadmap_shares"("token")`,

      `DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'roadmap_nodes_roadmapId_fkey'
        ) THEN
          ALTER TABLE "roadmap_nodes" ADD CONSTRAINT "roadmap_nodes_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "roadmaps"("id") ON DELETE CASCADE ON UPDATE CASCADE;
        END IF;

        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'roadmap_nodes_parentId_fkey'
        ) THEN
          ALTER TABLE "roadmap_nodes" ADD CONSTRAINT "roadmap_nodes_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "roadmap_nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
        END IF;

        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'roadmap_collaborators_roadmapId_fkey'
        ) THEN
          ALTER TABLE "roadmap_collaborators" ADD CONSTRAINT "roadmap_collaborators_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "roadmaps"("id") ON DELETE CASCADE ON UPDATE CASCADE;
        END IF;

        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'roadmap_progress_roadmapId_fkey'
        ) THEN
          ALTER TABLE "roadmap_progress" ADD CONSTRAINT "roadmap_progress_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "roadmaps"("id") ON DELETE CASCADE ON UPDATE CASCADE;
        END IF;

        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'roadmap_progress_nodeId_fkey'
        ) THEN
          ALTER TABLE "roadmap_progress" ADD CONSTRAINT "roadmap_progress_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "roadmap_nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
        END IF;

        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'roadmap_shares_roadmapId_fkey'
        ) THEN
          ALTER TABLE "roadmap_shares" ADD CONSTRAINT "roadmap_shares_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "roadmaps"("id") ON DELETE CASCADE ON UPDATE CASCADE;
        END IF;
      END $$;`
    ];

    for (const sql of statements) {
      await prisma.$executeRawUnsafe(sql);
    }


    console.log('[Roadmap DB] Roadmap tables & indexes initialized successfully!');
  } catch (error) {
    console.error('[Roadmap DB] Initialization error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

initRoadmapDb()
  .then(() => {
    console.log('[Roadmap DB] Setup complete.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('[Roadmap DB] Setup failed:', err);
    process.exit(1);
  });

