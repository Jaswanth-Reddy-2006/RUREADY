// ═══════════════════════════════════════════════════════════════
// Roadmap Persistence Service Tests
// Validates Atomic Prisma Transactions & Database Mapping
// ═══════════════════════════════════════════════════════════════

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  RoadmapPersistenceService,
  RoadmapPersistenceError,
  PersistRoadmapParams,
} from '../../services/roadmap-service/src/persistence/roadmap.persistence.js';
import { GeneratedRoadmapOutput } from '../../services/roadmap-service/src/validators/roadmap-generation.validator.js';
import { TrustedBackendContext } from '../../services/roadmap-service/src/mappers/roadmap.mapper.js';

// ─── Fixtures ─────────────────────────────────────────────────

const mockGeneratedRoadmap: GeneratedRoadmapOutput = {
  title: 'Full Stack Architecture Roadmap',
  description: 'Production curriculum for Full Stack engineers.',
  rolePath: 'fullstack',
  targetCompanyTier: 'FAANG',
  difficulty: 'INTERMEDIATE',
  estimatedWeeks: 12,
  phases: [
    {
      id: 'phase-1',
      title: 'Phase 1: Foundation & Core JS',
      description: 'Foundational runtime mechanics.',
      orderIndex: 0,
      nodes: [
        {
          id: 'node-1-js',
          phaseId: 'phase-1',
          title: 'Advanced JavaScript Runtime',
          category: 'Programming',
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
            summary: 'Master event loop mechanics.',
            actionSteps: ['Inspect call stack', 'Implement Promise'],
            mentalModels: ['Asynchronous event loop'],
          },
          whatIsTheSource: [
            {
              id: 'src-1',
              title: 'MDN Docs',
              url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
              type: 'DOCS',
            },
          ],
          whatIsTheExactThing: {
            title: 'Custom Promise Polyfill',
            description: 'Implement Promise polyfill from scratch.',
            deliverable: 'Tested Promise library.',
            verificationChecklist: ['Chaining works', 'Async resolution'],
          },
          microQuestions: [
            {
              id: 'q-1',
              questionText: 'What is microtask priority?',
              focus: 'Event Loop',
              suggestedAnswer: 'Microtasks execute before the next macrotask.',
            },
          ],
        },
      ],
    },
    {
      id: 'phase-2',
      title: 'Phase 2: Database Systems & Indexing',
      description: 'Relational data optimization.',
      orderIndex: 1,
      nodes: [
        {
          id: 'node-2-sql',
          phaseId: 'phase-2',
          title: 'PostgreSQL Indexing & Query Tuning',
          category: 'Database',
          orderIndex: 0,
          estimatedHours: 20,
          estimatedMinutes: 1200,
          requiresEvidence: true,
          targetProficiency: 90,
          status: 'LOCKED',
          score: 0,
          skills: [{ name: 'SQL', category: 'Database', targetProficiency: 90 }],
          prerequisiteNodeIds: ['node-1-js'],
          whatShouldIDo: {
            summary: 'Master B-Tree indexing and execution plans.',
            actionSteps: ['Inspect EXPLAIN ANALYZE', 'Design composite indexes'],
            mentalModels: ['Query planning cost model'],
          },
          whatIsTheSource: [
            {
              id: 'src-2',
              title: 'PostgreSQL Official Docs',
              url: 'https://www.postgresql.org/docs/current/',
              type: 'DOCS',
            },
          ],
          whatIsTheExactThing: {
            title: 'Index Optimization Drill',
            description: 'Optimize high latency queries.',
            deliverable: 'SQL migration and index comparison report.',
            verificationChecklist: ['No sequential scans', 'Sub-millisecond p99'],
          },
          microQuestions: [
            {
              id: 'q-2',
              questionText: 'How does B-Tree search work?',
              focus: 'Index Internals',
              suggestedAnswer: 'Traverses balanced tree nodes in O(log N) operations.',
            },
          ],
        },
      ],
    },
    {
      id: 'phase-3',
      title: 'Phase 3: Distributed Systems & Caching',
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
            mentalModels: ['Cache consistency trade-offs'],
          },
          whatIsTheSource: [
            {
              id: 'src-3',
              title: 'Redis Docs',
              url: 'https://redis.io/docs/latest/',
              type: 'DOCS',
            },
          ],
          whatIsTheExactThing: {
            title: 'Resilient Cache Decorator',
            description: 'Build distributed lock with Redis.',
            deliverable: 'TypeScript Redlock module.',
            verificationChecklist: ['Prevents stampedes', 'Safe failover'],
          },
          microQuestions: [
            {
              id: 'q-3',
              questionText: 'How to avoid cache stampede?',
              focus: 'Caching Strategies',
              suggestedAnswer: 'Use probabilistic early expiration and distributed mutex locks.',
            },
          ],
        },
      ],
    },
  ],
};

const mockTrustedBackendContext: TrustedBackendContext = {
  id: 'rdmp_backend_999',
  userId: 'user_authenticated_123',
  overallReadiness: 40,
  isOfficial: false,
  isPublic: true,
  isAiGenerated: true,
  creatorId: 'user_authenticated_123',
  creatorName: 'Sarah Connor',
  creatorUsername: 'sconnor',
  creatorAvatar: 'https://avatar.com/sarah.png',
  creatorRole: 'Staff Architect',
  enrolledCount: 12,
  upvotes: 88,
  tags: ['Architecture', 'PostgreSQL', 'Redis'],
  createdAt: '2026-09-30T14:00:00.000Z',
  updatedAt: '2026-09-30T14:00:00.000Z',
};

// ─── Test Suite ───────────────────────────────────────────────

describe('Roadmap Persistence Service', () => {
  let mockPrisma: any;
  let persistenceService: RoadmapPersistenceService;
  let transactionOperations: string[];

  beforeEach(() => {
    transactionOperations = [];

    const mockTx = {
      careerRoadmap: {
        create: vi.fn().mockImplementation(async ({ data }) => {
          transactionOperations.push('careerRoadmap.create');
          return {
            id: 'cuid_roadmap_123',
            ...data,
            createdAt: new Date('2026-09-30T14:00:00.000Z'),
            updatedAt: new Date('2026-09-30T14:00:00.000Z'),
          };
        }),
        findUnique: vi.fn().mockImplementation(async () => {
          transactionOperations.push('careerRoadmap.findUnique');
          return {
            id: 'cuid_roadmap_123',
            userId: mockTrustedBackendContext.userId,
            title: mockGeneratedRoadmap.title,
            description: mockGeneratedRoadmap.description,
            rolePath: mockGeneratedRoadmap.rolePath,
            targetCompanyTier: mockGeneratedRoadmap.targetCompanyTier,
            overallReadiness: mockTrustedBackendContext.overallReadiness,
            visibility: 'PUBLIC',
            isOfficial: false,
            isAiGenerated: true,
            createdAt: new Date('2026-09-30T14:00:00.000Z'),
            updatedAt: new Date('2026-09-30T14:00:00.000Z'),
            goal: {
              difficulty: 'INTERMEDIATE',
              estimatedWeeks: 12,
            },
            phases: [
              {
                id: 'cuid_phase_1',
                title: 'Phase 1: Foundation & Core JS',
                orderIndex: 0,
                nodes: [
                  {
                    id: 'cuid_node_1',
                    legacyNodeId: 'node-1-js',
                    title: 'Advanced JavaScript Runtime',
                    category: 'Programming',
                    orderIndex: 0,
                    estimatedMinutes: 900,
                    requiresEvidence: false,
                    skills: [{ skill: { name: 'JavaScript', category: 'Programming' }, targetProficiency: 85 }],
                    prerequisites: [],
                  },
                ],
              },
            ],
            nodesData: [],
          };
        }),
      },
      roadmapPhase: {
        create: vi.fn().mockImplementation(async ({ data }) => {
          transactionOperations.push(`roadmapPhase.create:${data.orderIndex}`);
          return { id: `cuid_phase_${data.orderIndex + 1}`, ...data };
        }),
      },
      roadmapNode: {
        create: vi.fn().mockImplementation(async ({ data }) => {
          transactionOperations.push(`roadmapNode.create:${data.legacyNodeId}`);
          return { id: `cuid_node_${data.legacyNodeId}`, ...data };
        }),
      },
      skill: {
        upsert: vi.fn().mockImplementation(async ({ where, create }) => {
          transactionOperations.push(`skill.upsert:${where.slug}`);
          return { id: `cuid_skill_${where.slug}`, ...create };
        }),
      },
      roadmapNodeSkill: {
        create: vi.fn().mockImplementation(async ({ data }) => {
          transactionOperations.push(`roadmapNodeSkill.create:${data.nodeId}:${data.skillId}`);
          return data;
        }),
      },
      roadmapNodeDependency: {
        create: vi.fn().mockImplementation(async ({ data }) => {
          transactionOperations.push(`roadmapNodeDependency.create:${data.nodeId}->${data.prerequisiteNodeId}`);
          return data;
        }),
      },
    };

    mockPrisma = {
      $transaction: vi.fn().mockImplementation(async (callback) => {
        return callback(mockTx);
      }),
    };

    persistenceService = new RoadmapPersistenceService(mockPrisma);
  });

  // ─── 1. Successful Atomic Persistence ───────────────────────

  it('1. should atomically persist roadmap, phases, nodes, skills, and prerequisites inside one transaction', async () => {
    const params: PersistRoadmapParams = {
      generatedRoadmap: mockGeneratedRoadmap,
      backendContext: mockTrustedBackendContext,
      goal: {
        targetRole: 'Full Stack Engineer',
        outcome: 'Pass Tier-1 loops',
      },
    };

    const result = await persistenceService.persistRoadmap(params);

    expect(mockPrisma.$transaction).toHaveBeenCalledTimes(1);
    expect(result).toBeDefined();
    expect(result.id).toBe('cuid_roadmap_123');
    expect(result.userId).toBe(mockTrustedBackendContext.userId);

    // Verify operation sequence
    expect(transactionOperations).toContain('careerRoadmap.create');
    expect(transactionOperations).toContain('roadmapPhase.create:0');
    expect(transactionOperations).toContain('roadmapPhase.create:1');
    expect(transactionOperations).toContain('roadmapPhase.create:2');
    expect(transactionOperations).toContain('roadmapNode.create:node-1-js');
    expect(transactionOperations).toContain('roadmapNode.create:node-2-sql');
    expect(transactionOperations).toContain('roadmapNode.create:node-3-redis');
    expect(transactionOperations).toContain('skill.upsert:javascript');
    expect(transactionOperations).toContain('skill.upsert:sql');
    expect(transactionOperations).toContain('skill.upsert:redis');
  });

  it('2. should map prerequisiteNodeIds into relational RoadmapNodeDependency records', async () => {
    const params: PersistRoadmapParams = {
      generatedRoadmap: mockGeneratedRoadmap,
      backendContext: mockTrustedBackendContext,
    };

    await persistenceService.persistRoadmap(params);

    // node-2-sql depends on node-1-js
    expect(transactionOperations).toContain(
      'roadmapNodeDependency.create:cuid_node_node-2-sql->cuid_node_node-1-js'
    );
    // node-3-redis depends on node-2-sql
    expect(transactionOperations).toContain(
      'roadmapNodeDependency.create:cuid_node_node-3-redis->cuid_node_node-2-sql'
    );
  });

  it('3. should store full 3-pillar content in career_roadmaps.nodesData for JSON compatibility', async () => {
    let capturedData: any = null;
    mockPrisma.$transaction = vi.fn().mockImplementation(async (callback) => {
      const tx = {
        careerRoadmap: {
          create: vi.fn().mockImplementation(async ({ data }) => {
            capturedData = data;
            return { id: 'cuid_test', ...data };
          }),
          findUnique: vi.fn().mockResolvedValue({ id: 'cuid_test', nodesData: capturedData?.nodesData }),
        },
        roadmapPhase: { create: vi.fn().mockResolvedValue({ id: 'phase_1' }) },
        roadmapNode: { create: vi.fn().mockResolvedValue({ id: 'node_1' }) },
        skill: { upsert: vi.fn().mockResolvedValue({ id: 'skill_1' }) },
        roadmapNodeSkill: { create: vi.fn().mockResolvedValue({}) },
        roadmapNodeDependency: { create: vi.fn().mockResolvedValue({}) },
      };
      return callback(tx);
    });

    await persistenceService.persistRoadmap({
      generatedRoadmap: mockGeneratedRoadmap,
      backendContext: mockTrustedBackendContext,
    });

    expect(capturedData).toBeDefined();
    expect(capturedData.nodesData.length).toBe(3);
    expect(capturedData.nodesData[0].whatShouldIDo.summary).toContain('event loop mechanics');
    expect(capturedData.nodesData[0].whatIsTheSource.length).toBe(1);
    expect(capturedData.nodesData[0].whatIsTheExactThing.title).toBe('Custom Promise Polyfill');
  });

  // ─── 2. Security & Protected Fields ─────────────────────────

  it('4. should enforce backend ownership and not allow AI to override userId or isOfficial', async () => {
    let capturedCreatePayload: any = null;
    mockPrisma.$transaction = vi.fn().mockImplementation(async (callback) => {
      const tx = {
        careerRoadmap: {
          create: vi.fn().mockImplementation(async ({ data }) => {
            capturedCreatePayload = data;
            return { id: 'cuid_test', ...data };
          }),
          findUnique: vi.fn().mockResolvedValue({ id: 'cuid_test', ...capturedCreatePayload }),
        },
        roadmapPhase: { create: vi.fn().mockResolvedValue({ id: 'phase_1' }) },
        roadmapNode: { create: vi.fn().mockResolvedValue({ id: 'node_1' }) },
        skill: { upsert: vi.fn().mockResolvedValue({ id: 'skill_1' }) },
        roadmapNodeSkill: { create: vi.fn().mockResolvedValue({}) },
        roadmapNodeDependency: { create: vi.fn().mockResolvedValue({}) },
      };
      return callback(tx);
    });

    await persistenceService.persistRoadmap({
      generatedRoadmap: {
        ...mockGeneratedRoadmap,
        title: 'Hacked Roadmap',
      },
      backendContext: {
        id: 'secure_id_777',
        userId: 'trusted_authenticated_user',
        isOfficial: false,
        isAiGenerated: true,
      },
    });

    expect(capturedCreatePayload.userId).toBe('trusted_authenticated_user');
    expect(capturedCreatePayload.customTechStack.isOfficial).toBe(false);
    expect(capturedCreatePayload.customTechStack.isAiGenerated).toBe(true);
  });

  // ─── 3. Atomic Transaction Rollback on Failure ──────────────

  it('5. should throw RoadmapPersistenceError and abort transaction when phase creation fails', async () => {
    mockPrisma.$transaction = vi.fn().mockImplementation(async (callback) => {
      const tx = {
        careerRoadmap: { create: vi.fn().mockResolvedValue({ id: 'roadmap_1' }) },
        roadmapPhase: {
          create: vi.fn().mockRejectedValue(new Error('Phase table constraint violation')),
        },
      };
      return callback(tx);
    });

    await expect(
      persistenceService.persistRoadmap({
        generatedRoadmap: mockGeneratedRoadmap,
        backendContext: mockTrustedBackendContext,
      })
    ).rejects.toThrowError(RoadmapPersistenceError);
  });

  it('6. should throw RoadmapPersistenceError when node creation fails', async () => {
    mockPrisma.$transaction = vi.fn().mockImplementation(async (callback) => {
      const tx = {
        careerRoadmap: { create: vi.fn().mockResolvedValue({ id: 'roadmap_1' }) },
        roadmapPhase: { create: vi.fn().mockResolvedValue({ id: 'phase_1' }) },
        roadmapNode: { create: vi.fn().mockRejectedValue(new Error('Node foreign key error')) },
      };
      return callback(tx);
    });

    await expect(
      persistenceService.persistRoadmap({
        generatedRoadmap: mockGeneratedRoadmap,
        backendContext: mockTrustedBackendContext,
      })
    ).rejects.toThrowError(RoadmapPersistenceError);
  });

  it('7. should throw RoadmapPersistenceError when backendContext has no userId', async () => {
    await expect(
      persistenceService.persistRoadmap({
        generatedRoadmap: mockGeneratedRoadmap,
        backendContext: { id: 'test_id', userId: '' },
      })
    ).rejects.toThrowError('Trusted backendContext with valid userId is required');
  });
});
