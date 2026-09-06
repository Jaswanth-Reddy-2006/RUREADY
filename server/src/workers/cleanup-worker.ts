import { prisma } from '../lib/prisma.js';

export async function runPruningCycle() {
  console.log(`[Worker] Starting telemetry and session pruning cycle...`);

  try {
    // 1. Find sessions marked as deleted
    const softDeletedSessions = await prisma.interviewSession.findMany({
      where: { isDeleted: true },
      select: { id: true },
      take: 100 // Process up to 100 sessions per cycle
    });

    if (softDeletedSessions.length === 0) {
      console.log(`[Worker] No soft-deleted sessions found. Pruning cycle complete.`);
      return;
    }

    console.log(`[Worker] Found ${softDeletedSessions.length} soft-deleted sessions to prune.`);

    for (const session of softDeletedSessions) {
      const sessionId = session.id;
      console.log(`[Worker] Pruning session: ${sessionId}`);

      // 2. Batch-delete TelemetryLogs (500 rows per batch) to prevent table locks
      let deletedTelemetryRows = 0;
      do {
        const result = await prisma.$executeRawUnsafe(`
          DELETE FROM "TelemetryLog" 
          WHERE id IN (
            SELECT id FROM "TelemetryLog" 
            WHERE "sessionId" = $1 
            LIMIT 500
          )
        `, sessionId);
        deletedTelemetryRows = result;
        console.log(`[Worker] Deleted ${deletedTelemetryRows} TelemetryLog rows for session ${sessionId}.`);
      } while (deletedTelemetryRows > 0);

      // 3. Batch-delete CodeExecutionDeltas (500 rows per batch)
      let deletedCodeRows = 0;
      do {
        const result = await prisma.$executeRawUnsafe(`
          DELETE FROM "CodeExecutionDelta" 
          WHERE id IN (
            SELECT id FROM "CodeExecutionDelta" 
            WHERE "sessionId" = $1 
            LIMIT 500
          )
        `, sessionId);
        deletedCodeRows = result;
        console.log(`[Worker] Deleted ${deletedCodeRows} CodeExecutionDelta rows for session ${sessionId}.`);
      } while (deletedCodeRows > 0);

      // 4. Once child records are pruned, hard delete the InterviewSession.
      // This will cascade delete remaining questions/analysis (few rows) without locking.
      await prisma.interviewSession.delete({
        where: { id: sessionId }
      });
      console.log(`[Worker] Successfully hard-deleted session ${sessionId}.`);
    }

    console.log(`[Worker] Batch pruning cycle complete.`);
  } catch (error) {
    console.error(`[Worker] Error during batch pruning cycle:`, error);
  }
}

// If executed directly, run it once
const runDirectly = process.argv[1]?.endsWith('cleanup-worker.ts') || process.argv[1]?.endsWith('cleanup-worker.js');
if (runDirectly) {
  runPruningCycle().then(() => {
    prisma.$disconnect();
    process.exit(0);
  });
}
