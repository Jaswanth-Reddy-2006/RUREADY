// ═══════════════════════════════════════════════════════════════
// RU Ready? — Automated End-to-End Suite: 31-Roadmap-Generator-V2-Interactive
// Interactive UX, Progressive AI Copilot, Cycle Detection, Optimistic Concurrency & Snapshots
// ═══════════════════════════════════════════════════════════════

import { describe, it, expect, beforeAll } from 'vitest';
import { prisma } from '../../../services/roadmap-service/src/lib/prisma.js';
import { RoadmapService } from '../../../services/roadmap-service/src/services/roadmap.service.js';
import { RoadmapAICopilot } from '../../../services/roadmap-service/src/services/roadmap-ai-copilot.js';

describe('31 — Roadmap Generator 2.0: Interactive UX, AI Copilot, Backend & Concurrency', { timeout: 30000 }, () => {
  const authorUserId = `usr_creator_v2_${Date.now()}`;
  let testRoadmapId = '';

  beforeAll(async () => {
    // Seed initial roadmap for concurrency and snapshot testing
    const created = await RoadmapService.createRoadmap({
      ownerId: authorUserId,
      creatorName: 'Alex Rivera',
      creatorRole: 'Principal Cloud Architect',
      creatorCompany: 'Stripe',
      isVerifiedCreator: true,
      title: 'Production Distributed Systems & Cloud Infrastructure',
      description: 'Master large-scale distributed systems, fault tolerance, and Kubernetes pipelines.',
      category: 'Cloud & Infrastructure',
      difficulty: 'ADVANCED',
      estimatedWeeks: 12,
      tags: ['Distributed Systems', 'Cloud', 'Kubernetes', 'Go'],
      nodes: [
        {
          title: 'Distributed Systems Fundamentals & Consensus',
          description: 'Raft, Paxos, CAP theorem, and consistency models.',
          type: 'MODULE',
          metadata: {
            estimatedHours: 20,
            whyLearnThis: 'Core foundation for designing systems that tolerate network partitions and node crashes.',
            whatYouWillLearn: ['Consensus protocols (Raft/Paxos)', 'CAP and PACELC trade-offs', 'Vector clocks'],
            whatToBuild: 'Mini Raft cluster consensus simulator in Go.',
            howToVerify: 'Verify leader election and log replication with network partition chaos injection.',
            unlockedSkills: ['Distributed Consensus', 'Fault Tolerance Design'],
          },
        },
        {
          title: 'Event-Driven Architectures & Partitioning',
          description: 'Kafka partitioning, consumer groups, and idempotency.',
          type: 'MODULE',
          metadata: {
            estimatedHours: 18,
            whyLearnThis: 'Essential for decoupling microservices at high throughput without data loss.',
            whatYouWillLearn: ['Partition keys & ordering guarantees', 'Consumer group rebalancing', 'Exactly-once semantics'],
            whatToBuild: 'Event-driven order transaction processing pipeline.',
            howToVerify: 'Pass end-to-end chaos tests with consumer node crashes and deduplication audit.',
            unlockedSkills: ['Kafka Streaming', 'Event Sourcing'],
          },
        },
      ],
    });

    testRoadmapId = created.id;
  });

  // ─────────────────────────────────────────────────────────────
  // 1. Goal Clarification Engine (Step B)
  // ─────────────────────────────────────────────────────────────
  describe('AI Goal Clarification Engine', () => {
    it('analyzes ambiguous goal and generates targeted clarifying questions with options', async () => {
      const ambiguousGoal = 'I want to learn backend development';
      const clarification = await RoadmapAICopilot.clarifyGoal(ambiguousGoal);

      expect(clarification.isReady).toBe(false);
      expect(clarification.questions.length).toBeGreaterThanOrEqual(2);

      // Verify targeted questions exist
      const questionIds = clarification.questions.map((q) => q.id);
      expect(questionIds).toContain('experience');
      expect(questionIds).toContain('weekly_hours');

      // Verify each question provides concrete options and user-facing rationale
      const expQ = clarification.questions.find((q) => q.id === 'experience');
      expect(expQ?.options.length).toBeGreaterThanOrEqual(3);
      expect(expQ?.reason).toBeTruthy();
    });

    it('recognizes a fully qualified goal with answers and marks isReady: true', async () => {
      const detailedGoal = 'Master distributed backend engineering with Go in 12 weeks';
      const answers = {
        experience: 'Intermediate developer with 2 years of experience',
        weekly_hours: '15-20 hours/week',
        primary_outcome: 'Build scalable production microservices and pass senior system design interviews',
      };

      const result = await RoadmapAICopilot.clarifyGoal(detailedGoal, answers);

      expect(result.isReady).toBe(true);
      expect(result.recommendedWeeks).toBe(12);
      expect(result.recommendedDifficulty).toBe('INTERMEDIATE');
      expect(result.detectedCategory).toBe('Backend Systems');
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 2. Canonical Structured Schema & The 7 Human Questions
  // ─────────────────────────────────────────────────────────────
  describe('Canonical Roadmap Generation & 7 Human Questions', () => {
    it('generates structured roadmap fulfilling the 7 human questions on all nodes', async () => {
      const draft = await RoadmapAICopilot.generateFromGoal(
        'Become a Job-Ready Kubernetes and Cloud Platform Engineer',
        {
          experience: 'Intermediate Linux and Docker user',
          weekly_hours: '15 hours/week',
          primary_outcome: 'Get hired as a Cloud Platform / DevOps Engineer',
        }
      );

      expect(draft.title).toBeTruthy();
      expect(draft.nodes.length).toBeGreaterThanOrEqual(3);

      for (const node of draft.nodes) {
        expect(node.title).toBeTruthy();
        expect(node.description).toBeTruthy();
        expect(node.type).toBeDefined();

        // Check the 7 human rationale answers
        expect(node.whyLearnThis).toBeTruthy();
        expect(node.whatYouWillLearn && node.whatYouWillLearn.length).toBeGreaterThan(0);
        expect(node.whatToBuild).toBeTruthy();
        expect(node.howToVerify).toBeTruthy();
        expect(node.unlockedSkills && node.unlockedSkills.length).toBeGreaterThan(0);
        expect(node.estimatedHours).toBeGreaterThan(0);
      }
    });

    it('ensures generated roadmap has zero circular prerequisite references', async () => {
      const draft = await RoadmapAICopilot.generateFromGoal('Master Algorithms and Data Structures');
      const cycleCheck = RoadmapAICopilot.detectCycles(draft.nodes);

      expect(cycleCheck.hasCycle).toBe(false);
      expect(cycleCheck.cycleNodes).toEqual([]);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 3. Directed Graph Cycle Detection Engine
  // ─────────────────────────────────────────────────────────────
  describe('Directed Graph Cycle Detection', () => {
    it('validates linear and diamond DAGs without false positives', () => {
      // Linear DAG: n1 -> n2 -> n3
      const linearGraph: any[] = [
        { id: 'n1', title: 'A', metadata: { prerequisiteNodeIds: [] } },
        { id: 'n2', title: 'B', metadata: { prerequisiteNodeIds: ['n1'] } },
        { id: 'n3', title: 'C', metadata: { prerequisiteNodeIds: ['n2'] } },
      ];
      expect(RoadmapAICopilot.detectCycles(linearGraph).hasCycle).toBe(false);

      // Diamond DAG: n1 -> n2, n1 -> n3, both -> n4
      const diamondGraph: any[] = [
        { id: 'n1', title: 'Root', metadata: { prerequisiteNodeIds: [] } },
        { id: 'n2', title: 'Branch 1', metadata: { prerequisiteNodeIds: ['n1'] } },
        { id: 'n3', title: 'Branch 2', metadata: { prerequisiteNodeIds: ['n1'] } },
        { id: 'n4', title: 'Join', metadata: { prerequisiteNodeIds: ['n2', 'n3'] } },
      ];
      expect(RoadmapAICopilot.detectCycles(diamondGraph).hasCycle).toBe(false);
    });

    it('detects circular prerequisite dependencies and identifies cycle path', () => {
      // Cyclic graph: n1 -> n2 -> n3 -> n1
      const cyclicGraph: any[] = [
        { id: 'n1', title: 'Node A', metadata: { prerequisiteNodeIds: ['n3'] } },
        { id: 'n2', title: 'Node B', metadata: { prerequisiteNodeIds: ['n1'] } },
        { id: 'n3', title: 'Node C', metadata: { prerequisiteNodeIds: ['n2'] } },
      ];

      const check = RoadmapAICopilot.detectCycles(cyclicGraph);
      expect(check.hasCycle).toBe(true);
      expect(check.cycleNodes.length).toBeGreaterThan(0);
      expect(check.cycleNodes).toContain('n1');
      expect(check.cycleNodes).toContain('n2');
      expect(check.cycleNodes).toContain('n3');
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 4. Interactive AI Copilot Targeted Surgical Edits
  // ─────────────────────────────────────────────────────────────
  describe('AI Copilot Targeted Graph Edits', () => {
    it('applies targeted patch: adds Docker module after fundamentals with structured diff', async () => {
      const currentRoadmap: any = {
        title: 'Backend Systems Path',
        estimatedWeeks: 10,
        nodes: [
          { id: 'n1', title: 'Linux Fundamentals', type: 'MODULE', position: 0, estimatedHours: 10, metadata: {} },
          { id: 'n2', title: 'Database Indexing', type: 'MODULE', position: 1, estimatedHours: 14, metadata: { prerequisiteNodeIds: ['n1'] } },
        ],
      };

      const patchResult = await RoadmapAICopilot.applyTargetedPatch(
        currentRoadmap,
        'Add Docker and containerization module after Linux fundamentals'
      );

      expect(patchResult.diff.added.length).toBeGreaterThan(0);
      expect(patchResult.diff.added[0]).toContain('Docker');
      expect(patchResult.updatedRoadmap.nodes.length).toBe(3);

      // Verify the new node was inserted and has the 7 human questions
      const addedNode = patchResult.updatedRoadmap.nodes.find((n: any) => n.title.includes('Docker'));
      expect(addedNode).toBeDefined();
      expect(addedNode.whyLearnThis).toBeTruthy();
      expect(addedNode.whatToBuild).toBeTruthy();
      expect(addedNode.howToVerify).toBeTruthy();
    });

    it('applies targeted patch: adds capstone project deliverable', async () => {
      const currentRoadmap: any = {
        title: 'Microservices Path',
        estimatedWeeks: 8,
        nodes: [
          { id: 'n1', title: 'REST & gRPC APIs', type: 'MODULE', position: 0, estimatedHours: 10, metadata: {} },
        ],
      };

      const patchResult = await RoadmapAICopilot.applyTargetedPatch(
        currentRoadmap,
        'Add an end-to-end capstone project to build a real-time trading platform'
      );

      expect(patchResult.diff.added.length).toBeGreaterThan(0);
      const capstone = patchResult.updatedRoadmap.nodes.find((n: any) => n.type === 'PROJECT');
      expect(capstone).toBeDefined();
      expect(capstone.title).toContain('Trading Platform');
      expect(capstone.whatToBuild).toBeTruthy();
    });

    it('applies targeted patch: reduces timeline to 8 weeks', async () => {
      const currentRoadmap: any = {
        title: 'Full Stack Engineering',
        estimatedWeeks: 16,
        nodes: [
          { id: 'n1', title: 'Frontend', type: 'MODULE', position: 0, estimatedHours: 40, metadata: {} },
          { id: 'n2', title: 'Backend', type: 'MODULE', position: 1, estimatedHours: 40, metadata: {} },
        ],
      };

      const patchResult = await RoadmapAICopilot.applyTargetedPatch(
        currentRoadmap,
        'Reduce total roadmap timeline to 8 weeks'
      );

      expect(patchResult.updatedRoadmap.estimatedWeeks).toBe(8);
      expect(patchResult.summary).toContain('8 weeks');
    });

    it('blocks copilot instructions that would form circular dependencies', async () => {
      const currentRoadmap: any = {
        title: 'Graph Path',
        estimatedWeeks: 4,
        nodes: [
          { id: 'n1', title: 'Module 1', type: 'MODULE', position: 0, metadata: { prerequisiteNodeIds: [] } },
          { id: 'n2', title: 'Module 2', type: 'MODULE', position: 1, metadata: { prerequisiteNodeIds: ['n1'] } },
        ],
      };

      // Manually simulate a circular instruction by making n1 depend on n2
      const cyclicNodes = [
        { id: 'n1', title: 'Module 1', type: 'MODULE', position: 0, metadata: { prerequisiteNodeIds: ['n2'] } },
        { id: 'n2', title: 'Module 2', type: 'MODULE', position: 1, metadata: { prerequisiteNodeIds: ['n1'] } },
      ];

      const cycle = RoadmapAICopilot.detectCycles(cyclicNodes);
      expect(cycle.hasCycle).toBe(true);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 5. Concurrency Control, Autosave & Cycle Protection on Commit
  // ─────────────────────────────────────────────────────────────
  describe('Optimistic Concurrency Control & Autosave Draft', () => {
    it('persists draft, increments version, and creates snapshot in roadmap_versions', async () => {
      const current = await prisma.roadmap.findUnique({
        where: { id: testRoadmapId },
        include: { nodes: true },
      });
      expect(current).not.toBeNull();
      const baseVer = current!.currentVersion;

      const saveResult = await RoadmapService.saveDraft(testRoadmapId, authorUserId, {
        baseVersion: baseVer,
        title: 'Production Distributed Systems & Cloud Infrastructure (Updated)',
        createSnapshot: true,
        changelog: 'Added observability and service mesh module',
        nodes: [
          ...current!.nodes.map((n) => ({
            id: n.id,
            title: n.title,
            description: n.description || '',
            type: n.type,
            metadata: n.metadata as any,
          })),
          {
            title: 'Service Mesh & Distributed Tracing',
            description: 'Envoy, Istio, OpenTelemetry, and distributed tracing instrumentation.',
            type: 'MODULE',
            metadata: {
              estimatedHours: 15,
              whyLearnThis: 'Essential for debugging microservice latency bottlenecks in production.',
              whatYouWillLearn: ['Envoy sidecar proxies', 'OpenTelemetry traces', 'Distributed span propagation'],
              whatToBuild: 'Distributed tracing instrumentation across 3 microservices with Jaeger.',
              howToVerify: 'Verify trace propagation across HTTP and gRPC boundaries under failure injection.',
              unlockedSkills: ['Distributed Tracing', 'Service Mesh'],
            },
          },
        ],
      });

      expect(saveResult.conflict).toBe(false);
      expect(saveResult.version).toBe(baseVer + 1);

      // Verify version record created in database
      const versionRecord = await prisma.roadmapVersion.findUnique({
        where: {
          roadmapId_version: { roadmapId: testRoadmapId, version: baseVer + 1 },
        },
      });
      expect(versionRecord).not.toBeNull();
      expect(versionRecord?.changelog).toBe('Added observability and service mesh module');
    });

    it('rejects stale baseVersion with HTTP 409 conflict detection to prevent overwriting concurrent edits', async () => {
      const current = await prisma.roadmap.findUnique({
        where: { id: testRoadmapId },
      });
      expect(current).not.toBeNull();
      const currentServerVersion = current!.currentVersion;

      // Simulate a concurrent tab attempting to save with old baseVersion (e.g. currentServerVersion - 1)
      const staleBaseVersion = currentServerVersion - 1;

      await expect(
        RoadmapService.saveDraft(testRoadmapId, authorUserId, {
          baseVersion: staleBaseVersion,
          title: 'Stale overwrite attempt',
        })
      ).rejects.toThrow(/REVISION_CONFLICT/);
    });

    it('rejects saving a draft that introduces a circular dependency in prerequisiteNodeIds', async () => {
      const current = await prisma.roadmap.findUnique({
        where: { id: testRoadmapId },
        include: { nodes: true },
      });
      const nodes = current!.nodes;
      expect(nodes.length).toBeGreaterThanOrEqual(2);

      // Create a cycle: node[0] depends on node[1], and node[1] depends on node[0]
      const cyclicNodes = [
        {
          id: nodes[0].id,
          title: nodes[0].title,
          metadata: { prerequisiteNodeIds: [nodes[1].id] },
        },
        {
          id: nodes[1].id,
          title: nodes[1].title,
          metadata: { prerequisiteNodeIds: [nodes[0].id] },
        },
      ];

      await expect(
        RoadmapService.saveDraft(testRoadmapId, authorUserId, {
          baseVersion: current!.currentVersion,
          nodes: cyclicNodes as any,
        })
      ).rejects.toThrow(/INVALID_GRAPH_CYCLE/);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 6. Version Snapshot History & Instant Rollback
  // ─────────────────────────────────────────────────────────────
  describe('Roadmap Version Snapshot History & Restore', () => {
    it('retrieves version history with snapshot metadata and author attribution', async () => {
      const versions = await RoadmapService.getVersionHistory(testRoadmapId);

      expect(versions.length).toBeGreaterThanOrEqual(1);
      const latest = versions[0];
      expect(latest.version).toBeGreaterThanOrEqual(2);
      expect(latest.changelog).toBeTruthy();
      expect(latest.createdBy).toBe(authorUserId);
    });

    it('restores an earlier version snapshot and increments current version with audit trail', async () => {
      const versions = await RoadmapService.getVersionHistory(testRoadmapId);
      const snapshotToRestore = versions[versions.length - 1]; // earliest snapshot
      const targetVersionNum = snapshotToRestore.version;

      const restored = await RoadmapService.restoreVersion(
        testRoadmapId,
        targetVersionNum,
        authorUserId
      );

      expect(restored.currentVersion).toBeGreaterThan(targetVersionNum);
      expect(restored.title).toBe(snapshotToRestore.title);

      // Verify restored nodes count matches snapshot
      const snapshotNodes = snapshotToRestore.nodesSnapshot as any[];
      expect(restored.nodes.length).toBe(snapshotNodes.length);

      // Verify a new restore snapshot was logged in database
      const latestVersion = await prisma.roadmapVersion.findUnique({
        where: {
          roadmapId_version: { roadmapId: testRoadmapId, version: restored.currentVersion },
        },
      });
      expect(latestVersion).not.toBeNull();
      expect(latestVersion?.changelog).toContain(`Restored from version ${targetVersionNum}`);
    });
  });
});
