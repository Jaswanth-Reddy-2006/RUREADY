import { prisma } from '../lib/prisma.js';
import { performance } from 'node:perf_hooks';
import { InterviewType, ExperienceLevel, InterviewMode, SessionStatus } from '../generated/client/index.js';

async function runHighVolumeStressSeed() {
  console.log('[Stress Seed] Starting high-volume database SRE benchmarking...');

  try {
    // 1. Create a primary mock user profile
    const email = `stress_tester_${Date.now()}@ruready.sre`;
    const user = await prisma.user.create({
      data: {
        email,
        name: 'SRE Load Tester',
        passwordHash: '$2b$10$vK3d9jLzRk9G9kG9kG9kG.loadtesterhashvaluehere', // Mock hash
      },
    });
    console.log(`[Stress Seed] Created primary SRE load test user: ${user.email}`);

    // 2. Generate 50 mock InterviewSession records (25 ORAL, 25 CODING)
    const sessionsData = [];
    for (let i = 0; i < 50; i++) {
      sessionsData.push({
        userId: user.id,
        interviewType: i < 25 ? InterviewType.COMMUNICATION : InterviewType.CODING,
        targetRole: 'Staff Site Reliability Engineer',
        industry: 'Cloud Infrastructure',
        experienceLevel: ExperienceLevel.SENIOR,
        focusAreas: ['High Concurrency', 'Database Isolation', 'Telemetry Pipelines'],
        mode: i < 25 ? InterviewMode.ORAL : InterviewMode.CODING,
        status: SessionStatus.COMPLETED,
      });
    }

    console.log('[Stress Seed] Saving 50 mock interview sessions...');
    await prisma.interviewSession.createMany({ data: sessionsData });
    
    // Retrieve created sessions to get their IDs
    const sessions = await prisma.interviewSession.findMany({
      where: { userId: user.id },
      select: { id: true },
    });
    console.log(`[Stress Seed] Retained ${sessions.length} database session records.`);

    // 3. Synthesize telemetry logs (2,000 per session * 50 sessions = 100,000 records)
    const telemetryTypes = ['TAB_BLUR', 'EYE_CONTACT_DROP', 'SPEECH_METRIC', 'STRESS_COEFFICIENT'];
    const totalRecordsTarget = sessions.length * 2000;
    console.log(`[Stress Seed] Synthesizing ${totalRecordsTarget} timeseries telemetry logs in memory...`);

    const telemetryLogs: any[] = [];
    const baseTime = Date.now();

    for (let sIdx = 0; sIdx < sessions.length; sIdx++) {
      const sessionId = sessions[sIdx].id;
      
      for (let tIdx = 0; tIdx < 2000; tIdx++) {
        // Increment timestamp forward by 500ms intervals
        const timestamp = new Date(baseTime + tIdx * 500);
        
        // Rotate logged type values
        const type = telemetryTypes[tIdx % telemetryTypes.length];
        
        // Generate realistic fluctuations
        const wordsPerMinute = type === 'SPEECH_METRIC' ? Math.floor(110 + Math.random() * 50) : null;
        const fillerWordsCount = type === 'SPEECH_METRIC' ? Math.floor(Math.random() * 5) : null;
        const stressCoefficient = type === 'STRESS_COEFFICIENT' 
          ? Math.min(1.0, Math.max(0.0, 0.15 + Math.random() * 0.45)) 
          : null;

        telemetryLogs.push({
          sessionId,
          type,
          wordsPerMinute,
          fillerWordsCount,
          stressCoefficient,
          timestamp,
        });
      }
    }

    console.log(`[Stress Seed] Memory allocation complete. Total telemetry log size: ${telemetryLogs.length}`);

    // 4. High-Speed Batch Insertion (chunking into blocks of 10,000)
    const CHUNK_SIZE = 10000;
    const startTime = performance.now();

    for (let i = 0; i < telemetryLogs.length; i += CHUNK_SIZE) {
      const chunk = telemetryLogs.slice(i, i + CHUNK_SIZE);
      const chunkNum = Math.floor(i / CHUNK_SIZE) + 1;
      
      const chunkStartTime = performance.now();
      await prisma.telemetryLog.createMany({
        data: chunk,
        skipDuplicates: true,
      });
      const chunkEndTime = performance.now();
      
      console.log(`[Stress Seed] Chunk ${chunkNum}/${Math.ceil(telemetryLogs.length / CHUNK_SIZE)} inserted. Size: ${chunk.length}. Latency: ${(chunkEndTime - chunkStartTime).toFixed(2)}ms`);
    }

    const endTime = performance.now();
    const durationSecs = ((endTime - startTime) / 1000).toFixed(3);
    const insertsPerSec = Math.round(telemetryLogs.length / (parseFloat(durationSecs) || 1));

    console.log('\n╔═════════════════════════════════════════════════════════════════╗');
    console.log('║               SRE LOAD BENCHMARK COMPLETE                       ║');
    console.log('╠═════════════════════════════════════════════════════════════════╣');
    console.log(`║  🚀 Total Telemetry Rows Loaded: ${telemetryLogs.length.toString().padEnd(30)} ║`);
    console.log(`║  ⏱️  Total Pipelined I/O Duration: ${durationSecs.padEnd(27)}s  ║`);
    console.log(`║  ⚡ Throughput Speed: ${insertsPerSec.toString().padEnd(20)} inserts/second   ║`);
    console.log('╚═════════════════════════════════════════════════════════════════╝\n');

  } catch (error) {
    console.error('[Stress Seed] SRE database benchmark failed:', error);
  } finally {
    await prisma.$disconnect();
    console.log('[Stress Seed] Database connection closed.');
  }
}

// Run stress seed
runHighVolumeStressSeed();
