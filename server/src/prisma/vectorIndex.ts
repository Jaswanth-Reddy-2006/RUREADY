import { prisma } from '../lib/prisma.js';

async function runVectorIndexMigration() {
  console.log('[Vector Index] Starting raw pgvector/HNSW index registration...');

  try {
    // 1. Enable extension if supported by database engine
    try {
      await prisma.$executeRawUnsafe('CREATE EXTENSION IF NOT EXISTS vector;');
      console.log('[Vector Index] Enabled "vector" extension successfully.');
    } catch (extErr: any) {
      console.warn(
        '\n[Vector Index Diagnostic] WARNING: Could not register "vector" extension.\n' +
        'Ensure that the database instance has "pgvector" binaries installed and loaded (e.g. use "ankane/pgvector" image).\n' +
        'Error Details: ' + extErr.message + '\n'
      );
      // Exit gracefully without throwing a crash since database engine might not have pgvector in dev environment
      return;
    }

    // 2. Build HNSW Cosine Index over embedding column
    // Try table name "resumes" mapping from @@map first
    try {
      await prisma.$executeRawUnsafe(`
        CREATE INDEX IF NOT EXISTS resume_embedding_hnsw_idx 
        ON "resumes" 
        USING hnsw (embedding vector_cosine_ops);
      `);
      console.log('[Vector Index] Created HNSW cosine index on "resumes" table successfully.');
    } catch (resumesErr: any) {
      console.log('[Vector Index] Table "resumes" index creation skipped or failed. Attempting fallback to "Resume" table...', resumesErr.message);
      
      try {
        await prisma.$executeRawUnsafe(`
          CREATE INDEX IF NOT EXISTS resume_embedding_hnsw_idx 
          ON "Resume" 
          USING hnsw (embedding vector_cosine_ops);
        `);
        console.log('[Vector Index] Created HNSW cosine index on "Resume" table successfully.');
      } catch (resumeErr: any) {
        console.error(
          '\n[Vector Index Diagnostic] ERROR: Failed to create index on either "resumes" or "Resume" table.\n' +
          'Verify that the table exists and the "embedding" column type is a vector.\n' +
          'Error Details: ' + resumeErr.message + '\n'
        );
      }
    }
  } catch (error: any) {
    console.error('[Vector Index] Unexpected migration error:', error);
  } finally {
    await prisma.$disconnect();
    console.log('[Vector Index] Database connection closed.');
  }
}

// Run migration
runVectorIndexMigration();
