import { prisma } from '../services/roadmap-service/src/lib/prisma.js';

async function main() {
  const statements = [
    `CREATE TABLE IF NOT EXISTS "roadmap_versions" (
      "id" text PRIMARY KEY,
      "roadmapId" text NOT NULL REFERENCES "roadmaps"("id") ON DELETE CASCADE,
      "version" integer NOT NULL,
      "title" text NOT NULL,
      "description" text,
      "changelog" text,
      "nodesSnapshot" jsonb NOT NULL,
      "graphLayout" jsonb,
      "createdBy" text,
      "createdAt" timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "roadmap_versions_roadmapId_version_idx" ON "roadmap_versions"("roadmapId", "version");`,
    `CREATE INDEX IF NOT EXISTS "roadmap_versions_roadmapId_createdAt_idx" ON "roadmap_versions"("roadmapId", "createdAt");`,
  ];

  console.log('Applying Roadmap V2 safe migrations...');
  for (const sql of statements) {
    try {
      await prisma.$executeRawUnsafe(sql);
      console.log('✓ Executed:', sql.substring(0, 60).replace(/\s+/g, ' ') + '...');
    } catch (e: any) {
      console.error('Migration error:', e.message);
    }
  }
  console.log('Roadmap V2 migrations finished successfully.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
