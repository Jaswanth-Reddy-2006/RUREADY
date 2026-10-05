// ═══════════════════════════════════════════════════════════════
// Canonical Roadmap Mapper Tests
// Validates Pure Transformations between Generated, Persisted & Shared DTOs
// ═══════════════════════════════════════════════════════════════

import { describe, it, expect } from 'vitest';
import {
  mapGeneratedRoadmapToDTO,
  mapPersistedRoadmapToDTO,
  mapGeneratedNodeToDefinition,
  mapGeneratedPhaseToDefinition,
  TrustedBackendContext,
} from '../../services/roadmap-service/src/mappers/roadmap.mapper.js';
import { GeneratedRoadmapOutput } from '../../services/roadmap-service/src/validators/roadmap-generation.validator.js';

// ─── Fixtures ─────────────────────────────────────────────────

const mockGeneratedRoadmap: GeneratedRoadmapOutput = {
  title: 'Full Stack Mastery',
  description: 'AI Generated Full Stack path.',
  rolePath: 'fullstack',
  targetCompanyTier: 'FAANG',
  difficulty: 'INTERMEDIATE',
  estimatedWeeks: 12,
  phases: [
    {
      id: 'phase-1',
      title: 'Phase 1: Web Core & Concurrency',
      description: 'Foundational JS runtime and DOM.',
      orderIndex: 0,
      nodes: [
        {
          id: 'node-1-js',
          phaseId: 'phase-1',
          title: 'Advanced JavaScript Runtime',
          subHeader: 'Event Loop & Promises',
          category: 'Core Language',
          orderIndex: 0,
          estimatedHours: 15,
          estimatedMinutes: 900,
          requiresEvidence: false,
          targetProficiency: 85,
          status: 'LOCKED',
          score: 0,
          skills: [{ name: 'JavaScript', category: 'Programming', targetProficiency: 85 }],
          prerequisiteNodeIds: [],
          whatShouldIDo: {
            summary: 'Understand event loop phases, microtasks vs macrotasks.',
            actionSteps: ['Study libuv architecture', 'Write custom Promise'],
            mentalModels: ['Non-blocking asynchronous execution'],
          },
          whatIsTheSource: [
            {
              id: 'src-1',
              title: 'MDN Event Loop Guide',
              url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop',
              type: 'DOCS',
            },
          ],
          whatIsTheExactThing: {
            title: 'Custom Promise Polyfill',
            description: 'Implement Promises/A+ compliant Promise library.',
            deliverable: 'MyPromise.ts with test suite.',
            verificationChecklist: ['Chaining works', 'Catches unhandled exceptions'],
          },
          microQuestions: [
            {
              id: 'q-1',
              questionText: 'What is the microtask queue priority order?',
              focus: 'Event Loop Ordering',
              suggestedAnswer: 'Microtasks execute immediately after the current sync stack.',
            },
          ],
        },
      ],
    },
    {
      id: 'phase-2',
      title: 'Phase 2: Database Systems & Indexing',
      orderIndex: 1,
      nodes: [
        {
          id: 'node-2-sql',
          phaseId: 'phase-2',
          title: 'PostgreSQL Internals & Query Tuning',
          category: 'DBMS',
          orderIndex: 0,
          estimatedHours: 20,
          requiresEvidence: true,
          status: 'LOCKED',
          score: 0,
          skills: [{ name: 'SQL', category: 'Database', targetProficiency: 90 }],
          prerequisiteNodeIds: ['node-1-js'],
          whatShouldIDo: {
            summary: 'Master B-Tree indexing and execution plans.',
            actionSteps: ['Inspect EXPLAIN ANALYZE', 'Design composite indexes'],
            mentalModels: ['Cost-based query optimizer'],
          },
          whatIsTheSource: [
            {
              id: 'src-2',
              title: 'Use The Index Luke',
              url: 'https://use-the-index-luke.com/',
              type: 'DOCS',
            },
          ],
          whatIsTheExactThing: {
            title: 'High-Throughput Index Tuning Drill',
            description: 'Tune slow queries on 1M rows table.',
            deliverable: 'Optimized schema migration and EXPLAIN comparison.',
            verificationChecklist: ['Eliminates sequential scans', 'Reduces query p99 latency by 80%'],
          },
          microQuestions: [
            {
              id: 'q-2',
              questionText: 'When is a composite index column ordering critical?',
              focus: 'B-Tree Leftmost Prefix Rule',
              suggestedAnswer: 'The leading column must match the query WHERE filter to utilize the index.',
            },
          ],
        },
      ],
    },
    {
      id: 'phase-3',
      title: 'Phase 3: Production Scale & System Design',
      orderIndex: 2,
      nodes: [
        {
          id: 'node-3-redis',
          phaseId: 'phase-3',
          title: 'Distributed Caching Architecture',
          category: 'System Design',
          orderIndex: 0,
          estimatedHours: 25,
          requiresEvidence: true,
          status: 'LOCKED',
          score: 0,
          skills: [{ name: 'Redis', category: 'Distributed Systems', targetProficiency: 85 }],
          prerequisiteNodeIds: ['node-2-sql'],
          whatShouldIDo: {
            summary: 'Implement cache-aside and mitigate stampedes.',
            actionSteps: ['Deploy Redis cluster', 'Implement XFetch early refresh'],
            mentalModels: ['Cache coherence vs consistency trade-offs'],
          },
          whatIsTheSource: [
            {
              id: 'src-3',
              title: 'Redis Architecture Docs',
              url: 'https://redis.io/docs/latest/',
              type: 'DOCS',
            },
          ],
          whatIsTheExactThing: {
            title: 'Resilient Distributed Lock Manager',
            description: 'Build Redlock distributed lock with TTL jitter.',
            deliverable: 'TypeScript Redlock client module.',
            verificationChecklist: ['Prevents race conditions under 10k RPS', 'Safe node failover handling'],
          },
          microQuestions: [
            {
              id: 'q-3',
              questionText: 'How does Redlock achieve consensus across independent Redis masters?',
              focus: 'Distributed Consensus',
              suggestedAnswer: 'By acquiring locks on a quorum (majority) of masters within a time-bound drift threshold.',
            },
          ],
        },
      ],
    },
  ],
};

const mockTrustedBackendContext: TrustedBackendContext = {
  id: 'rdmp_trusted_123',
  userId: 'user_auth_456',
  overallReadiness: 30,
  isOfficial: false,
  isPublic: true,
  isAiGenerated: true,
  creatorId: 'user_auth_456',
  creatorName: 'Alex Mercer',
  creatorUsername: 'alex_mercer',
  creatorAvatar: 'https://avatar.com/alex.png',
  creatorRole: 'Full Stack Engineer',
  enrolledCount: 15,
  upvotes: 42,
  tags: ['React', 'Node.js', 'PostgreSQL'],
  createdAt: '2026-09-30T10:00:00.000Z',
  updatedAt: '2026-09-30T10:00:00.000Z',
};

// ─── Test Suite ───────────────────────────────────────────────

describe('Canonical Roadmap DTO Mapper', () => {

  // ─── 1. Generated Output Mapping ────────────────────────────

  it('1. should map GeneratedRoadmapOutput into a complete CareerRoadmapDTO', () => {
    const dto = mapGeneratedRoadmapToDTO(mockGeneratedRoadmap, mockTrustedBackendContext);

    expect(dto).toBeDefined();
    expect(dto.id).toBe('rdmp_trusted_123');
    expect(dto.userId).toBe('user_auth_456');
    expect(dto.title).toBe(mockGeneratedRoadmap.title);
    expect(dto.description).toBe(mockGeneratedRoadmap.description);
    expect(dto.rolePath).toBe('fullstack');
    expect(dto.targetCompanyTier).toBe('FAANG');
    expect(dto.difficulty).toBe('INTERMEDIATE');
    expect(dto.estimatedWeeks).toBe(12);
  });

  it('2. should preserve all phases and their sequential order', () => {
    const dto = mapGeneratedRoadmapToDTO(mockGeneratedRoadmap, mockTrustedBackendContext);

    expect(dto.phases.length).toBe(3);
    expect(dto.phases[0].id).toBe('phase-1');
    expect(dto.phases[1].id).toBe('phase-2');
    expect(dto.phases[2].id).toBe('phase-3');
    expect(dto.phases[0].orderIndex).toBe(0);
    expect(dto.phases[1].orderIndex).toBe(1);
    expect(dto.phases[2].orderIndex).toBe(2);
  });

  it('3. should preserve all milestone nodes across phases and in flat nodesData', () => {
    const dto = mapGeneratedRoadmapToDTO(mockGeneratedRoadmap, mockTrustedBackendContext);

    expect(dto.nodesData.length).toBe(3);
    expect(dto.nodesData[0].id).toBe('node-1-js');
    expect(dto.nodesData[1].id).toBe('node-2-sql');
    expect(dto.nodesData[2].id).toBe('node-3-redis');
  });

  it('4. should preserve all 3-pillar content without data loss', () => {
    const dto = mapGeneratedRoadmapToDTO(mockGeneratedRoadmap, mockTrustedBackendContext);
    const node1 = dto.nodesData[0];

    // Pillar 1
    expect(node1.whatShouldIDo.summary).toContain('event loop phases');
    expect(node1.whatShouldIDo.actionSteps).toEqual(['Study libuv architecture', 'Write custom Promise']);
    expect(node1.whatShouldIDo.mentalModels).toEqual(['Non-blocking asynchronous execution']);

    // Pillar 2
    expect(node1.whatIsTheSource.length).toBe(1);
    expect(node1.whatIsTheSource[0].url).toBe('https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop');
    expect(node1.whatIsTheSource[0].type).toBe('DOCS');

    // Pillar 3
    expect(node1.whatIsTheExactThing.title).toBe('Custom Promise Polyfill');
    expect(node1.whatIsTheExactThing.verificationChecklist).toEqual(['Chaining works', 'Catches unhandled exceptions']);

    // Micro Questions
    expect(node1.microQuestions.length).toBe(1);
    expect(node1.microQuestions[0].questionText).toBe('What is the microtask queue priority order?');
  });

  it('5. should preserve prerequisiteNodeIds', () => {
    const dto = mapGeneratedRoadmapToDTO(mockGeneratedRoadmap, mockTrustedBackendContext);

    expect(dto.nodesData[0].prerequisiteNodeIds).toEqual([]);
    expect(dto.nodesData[1].prerequisiteNodeIds).toEqual(['node-1-js']);
    expect(dto.nodesData[2].prerequisiteNodeIds).toEqual(['node-2-sql']);
  });

  it('6. should preserve skill lists and target proficiencies', () => {
    const dto = mapGeneratedRoadmapToDTO(mockGeneratedRoadmap, mockTrustedBackendContext);
    const sqlNode = dto.nodesData[1];

    expect(sqlNode.skills).toEqual([
      { name: 'SQL', category: 'Database', targetProficiency: 90 },
    ]);
  });

  it('7. should preserve estimatedHours and compute estimatedMinutes when missing', () => {
    const dto = mapGeneratedRoadmapToDTO(mockGeneratedRoadmap, mockTrustedBackendContext);

    expect(dto.nodesData[0].estimatedHours).toBe(15);
    expect(dto.nodesData[0].estimatedMinutes).toBe(900);

    // Node 2 has estimatedHours: 20 and no estimatedMinutes -> computed 1200
    expect(dto.nodesData[1].estimatedHours).toBe(20);
    expect(dto.nodesData[1].estimatedMinutes).toBe(1200);
  });

  // ─── 2. Backend Security & Provenance ────────────────────────

  it('8. should strictly source backend-owned fields from trusted backend context, not AI output', () => {
    const dto = mapGeneratedRoadmapToDTO(mockGeneratedRoadmap, mockTrustedBackendContext);

    expect(dto.id).toBe('rdmp_trusted_123');
    expect(dto.userId).toBe('user_auth_456');
    expect(dto.creatorId).toBe('user_auth_456');
    expect(dto.creatorName).toBe('Alex Mercer');
    expect(dto.creatorUsername).toBe('alex_mercer');
    expect(dto.creatorAvatar).toBe('https://avatar.com/alex.png');
    expect(dto.isOfficial).toBe(false);
    expect(dto.isAiGenerated).toBe(true);
    expect(dto.overallReadiness).toBe(30);
    expect(dto.enrolledCount).toBe(15);
    expect(dto.upvotes).toBe(42);
    expect(dto.tags).toEqual(['React', 'Node.js', 'PostgreSQL']);
    expect(dto.createdAt).toBe('2026-09-30T10:00:00.000Z');
  });

  // ─── 3. Persisted Record Mapping ─────────────────────────────

  it('9. should map persisted Prisma-like records correctly', () => {
    const mockPrismaRecord = {
      id: 'db_rdmp_789',
      userId: 'user_db_111',
      title: 'Senior Backend Engineer',
      description: 'Prisma persisted backend roadmap',
      rolePath: 'backend',
      targetCompanyTier: 'FAANG',
      overallReadiness: 50,
      isOfficial: true,
      visibility: 'PUBLIC',
      isAiGenerated: true,
      createdAt: new Date('2026-09-30T12:00:00.000Z'),
      updatedAt: new Date('2026-09-30T12:00:00.000Z'),
      goal: {
        difficulty: 'ADVANCED',
        estimatedWeeks: 16,
      },
      phases: [
        {
          id: 'phase_db_1',
          title: 'Foundation Phase',
          orderIndex: 0,
          nodes: [
            {
              id: 'node_db_1',
              title: 'Operating Systems & Concurrency',
              category: 'Core CS',
              orderIndex: 0,
              estimatedMinutes: 360,
              requiresEvidence: true,
              skills: [{ skill: { name: 'OS', category: 'Core CS' }, targetProficiency: 85 }],
              prerequisites: [],
            },
          ],
        },
      ],
      nodesData: [],
    };

    const dto = mapPersistedRoadmapToDTO(mockPrismaRecord);

    expect(dto.id).toBe('db_rdmp_789');
    expect(dto.userId).toBe('user_db_111');
    expect(dto.difficulty).toBe('ADVANCED');
    expect(dto.estimatedWeeks).toBe(16);
    expect(dto.isOfficial).toBe(true);
    expect(dto.isPublic).toBe(true);
    expect(dto.phases.length).toBe(1);
    expect(dto.nodesData.length).toBe(1);
    expect(dto.nodesData[0].id).toBe('node_db_1');
    expect(dto.nodesData[0].estimatedHours).toBe(6);
    expect(dto.nodesData[0].skills[0].name).toBe('OS');
    expect(dto.createdAt).toBe('2026-09-30T12:00:00.000Z');
  });

  // ─── 4. Immutability & Determinism ───────────────────────────

  it('10. should not mutate source generated or context objects', () => {
    const originalGenerated = JSON.parse(JSON.stringify(mockGeneratedRoadmap));
    const originalContext = JSON.parse(JSON.stringify(mockTrustedBackendContext));

    mapGeneratedRoadmapToDTO(mockGeneratedRoadmap, mockTrustedBackendContext);

    expect(mockGeneratedRoadmap).toEqual(originalGenerated);
    expect(mockTrustedBackendContext).toEqual(originalContext);
  });

  it('11. should produce byte-for-byte identical DTOs for identical inputs (Determinism)', () => {
    const run1 = mapGeneratedRoadmapToDTO(mockGeneratedRoadmap, mockTrustedBackendContext);
    const run2 = mapGeneratedRoadmapToDTO(mockGeneratedRoadmap, mockTrustedBackendContext);

    expect(run1).toEqual(run2);
  });
});
