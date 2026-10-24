// ═══════════════════════════════════════════════════════════════
// RU Ready? — Automated End-to-End Suite: 29-System-Design-Interactive-Studio
// Comprehensive Testing: Problem Catalog, Whiteboard Canvas, Validator Engine,
// Capacity Estimation, Socratic AI Dialogue, CAP Matrix & 11-Dimension Rubric
// ═══════════════════════════════════════════════════════════════

import { describe, it, expect } from 'vitest';
import { SystemDesignService } from '../../../services/system-design-service/src/services/systemDesign.service.js';
import { SYSTEM_DESIGN_PROBLEMS } from '../../../services/system-design-service/src/data/systemDesignProblems.data.js';
import { calculateCapacity, formatBytes } from '../../../services/system-design-service/src/engine/capacityEngine.js';
import { validateArchitecture, CanvasGraph } from '../../../services/system-design-service/src/engine/validatorEngine.js';
import { AIInterviewerService } from '../../../services/system-design-service/src/services/aiInterviewer.service.js';

describe('29 — System Design Studio: End-to-End Architecture & Interactive Canvas Verification', () => {

  // ─────────────────────────────────────────────────────────────
  // 1. Problem Catalog & Authoritative Specifications
  // ─────────────────────────────────────────────────────────────
  describe('Problem Catalog & Authoritative System Specifications', () => {
    it('retrieves full catalog of production-grade system design problems', async () => {
      const problems = await SystemDesignService.getProblems();
      expect(problems.length).toBeGreaterThanOrEqual(4);

      const slugs = problems.map((p) => p.slug);
      expect(slugs).toContain('url-shortener');
      expect(slugs).toContain('realtime-chat');
      expect(slugs).toContain('rate-limiter');
      expect(slugs).toContain('uber-ride-matching');
    });

    it('verifies complete schema attributes on each problem definition', async () => {
      for (const problem of SYSTEM_DESIGN_PROBLEMS) {
        expect(problem.id).toBeDefined();
        expect(problem.title).toBeDefined();
        expect(problem.difficulty).toMatch(/^(EASY|MEDIUM|HARD)$/);
        expect(problem.category).toBeDefined();
        expect(problem.functionalRequirements.length).toBeGreaterThanOrEqual(3);
        expect(problem.nonFunctionalRequirements.length).toBeGreaterThanOrEqual(3);
        expect(problem.trafficDefaults.dau).toBeGreaterThan(0);
        expect(problem.suggestedComponents.length).toBeGreaterThanOrEqual(5);
        expect(problem.stagesGuidance.stage1Requirements.length).toBeGreaterThan(0);
        expect(problem.stagesGuidance.stage2Capacity.length).toBeGreaterThan(0);
        expect(problem.stagesGuidance.stage3HighLevel.length).toBeGreaterThan(0);
        expect(problem.referenceArchitecture.nodes.length).toBeGreaterThanOrEqual(5);
        expect(problem.referenceArchitecture.edges.length).toBeGreaterThanOrEqual(4);
      }
    });

    it('filters problems by difficulty and category correctly', async () => {
      const easyProblems = await SystemDesignService.getProblems({ difficulty: 'EASY' });
      expect(easyProblems.every((p) => p.difficulty === 'EASY')).toBe(true);

      const realTimeProblems = await SystemDesignService.getProblems({ category: 'REAL_TIME' });
      expect(realTimeProblems.every((p) => p.category === 'REAL_TIME')).toBe(true);
      expect(realTimeProblems.some((p) => p.slug === 'realtime-chat')).toBe(true);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 2. Interactive Session Creation & Authoritative Lifecycle
  // ─────────────────────────────────────────────────────────────
  describe('Interactive Studio Session Lifecycle', () => {
    it('initializes a system design session with opening Socratic greeting and default state', async () => {
      const candidateId = `cand_${Date.now()}`;
      const session = await SystemDesignService.createSession(candidateId, 'sd_url_shortener', 'Jane Engineer');

      expect(session.id).toBeDefined();
      expect(session.userId).toBe(candidateId);
      expect(session.userName).toBe('Jane Engineer');
      expect(session.problem.slug).toBe('url-shortener');
      expect(session.stage).toBe(1);
      expect(session.status).toBe('IN_PROGRESS');

      // Transcript begins with Socratic opening greeting from Ava
      expect(session.transcript.length).toBeGreaterThanOrEqual(1);
      expect(session.transcript[0].role).toBe('ai');
      expect(session.transcript[0].content).toContain('Ava');
      expect(session.transcript[0].suggestions?.length).toBeGreaterThan(0);

      // Default canvas starts with initial client ingress node
      expect(session.graphData.nodes.length).toBeGreaterThanOrEqual(1);
      expect(session.graphData.nodes[0].data.subType).toBe('client_app');

      // Initial capacity numbers computed deterministically
      expect(session.capacityOutputs?.avgReadQps).toBeGreaterThan(0);
      expect(session.capacityOutputs?.avgWriteQps).toBeGreaterThan(0);
    });

    it('retrieves an existing active session with preserved state', async () => {
      const candidateId = `cand_resume_${Date.now()}`;
      const created = await SystemDesignService.createSession(candidateId, 'sd_realtime_chat', 'Devin');
      const retrieved = await SystemDesignService.getSession(created.id, candidateId);

      expect(retrieved).not.toBeNull();
      expect(retrieved?.id).toBe(created.id);
      expect(retrieved?.problem.slug).toBe('realtime-chat');
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 3. Deterministic Architecture Validator Engine
  // ─────────────────────────────────────────────────────────────
  describe('Architecture Validator Engine', () => {
    it('flags empty canvas as a critical issue', () => {
      const emptyGraph: CanvasGraph = { nodes: [], edges: [] };
      const report = validateArchitecture(emptyGraph);

      expect(report.score).toBe(0);
      expect(report.status).toBe('CRITICAL_ISSUES');
      expect(report.spofCount).toBe(1);
      expect(report.issues[0].id).toBe('EMPTY_CANVAS');
    });

    it('catches direct database exposure to public clients as a critical security vulnerability', () => {
      const insecureGraph: CanvasGraph = {
        nodes: [
          { id: 'client_1', data: { label: 'Web Browser', category: 'TRAFFIC', subType: 'client_app' } },
          { id: 'db_1', data: { label: 'PostgreSQL Database', category: 'STORAGE', subType: 'relational_db' } },
        ],
        edges: [
          { id: 'edge_direct', source: 'client_1', target: 'db_1', data: { protocol: 'DB_CONNECTION' } },
        ],
      };

      const report = validateArchitecture(insecureGraph);
      const securityIssue = report.issues.find((i) => i.category === 'SECURITY');

      expect(securityIssue).toBeDefined();
      expect(securityIssue?.title).toContain('Direct Database Exposure');
      expect(report.securityCount).toBeGreaterThanOrEqual(1);
      expect(report.score).toBeLessThan(70);
    });

    it('detects primary database Single Point of Failure (SPOF) when no replicas exist', () => {
      const graphWithoutReplica: CanvasGraph = {
        nodes: [
          { id: 'client_1', data: { label: 'Client', category: 'TRAFFIC', subType: 'client_app' } },
          { id: 'lb_1', data: { label: 'Load Balancer', category: 'TRAFFIC', subType: 'load_balancer' } },
          { id: 'api_1', data: { label: 'API Server', category: 'COMPUTE', subType: 'microservice', config: { instances: 3 } } },
          { id: 'db_1', data: { label: 'Postgres Primary', category: 'STORAGE', subType: 'relational_db', config: { replication: 1 } } },
        ],
        edges: [
          { id: 'e1', source: 'client_1', target: 'lb_1' },
          { id: 'e2', source: 'lb_1', target: 'api_1' },
          { id: 'e3', source: 'api_1', target: 'db_1' },
        ],
      };

      const report = validateArchitecture(graphWithoutReplica);
      const spofIssue = report.issues.find((i) => i.id === 'DB_SPOF_db_1');

      expect(spofIssue).toBeDefined();
      expect(spofIssue?.severity).toBe('ERROR');
      expect(spofIssue?.recommendation).toContain('Read Replica');
    });

    it('resolves SPOF and rewards architectural health when read replica is connected', () => {
      const resilientGraph: CanvasGraph = {
        nodes: [
          { id: 'client_1', data: { label: 'Client', category: 'TRAFFIC', subType: 'client_app' } },
          { id: 'lb_1', data: { label: 'Load Balancer', category: 'TRAFFIC', subType: 'load_balancer' } },
          { id: 'api_1', data: { label: 'API Server', category: 'COMPUTE', subType: 'microservice', config: { instances: 4 } } },
          { id: 'cache_1', data: { label: 'Redis Cache', category: 'RELIABILITY', subType: 'cache' } },
          { id: 'db_primary', data: { label: 'Postgres Primary', category: 'STORAGE', subType: 'relational_db' } },
          { id: 'db_replica', data: { label: 'Postgres Replica', category: 'RELIABILITY', subType: 'read_replica' } },
        ],
        edges: [
          { id: 'e1', source: 'client_1', target: 'lb_1' },
          { id: 'e2', source: 'lb_1', target: 'api_1' },
          { id: 'e3', source: 'api_1', target: 'cache_1' },
          { id: 'e4', source: 'api_1', target: 'db_primary' },
          { id: 'e5', source: 'db_primary', target: 'db_replica' },
        ],
      };

      const report = validateArchitecture(resilientGraph);
      const spofIssue = report.issues.find((i) => i.id === 'DB_SPOF_db_primary');

      expect(spofIssue).toBeUndefined();
      expect(report.score).toBeGreaterThanOrEqual(80);
      expect(report.passedChecks).toContain('Traffic Ingress & Load Balancing configured');
    });

    it('flags orphan/disconnected nodes', () => {
      const graphWithOrphan: CanvasGraph = {
        nodes: [
          { id: 'client_1', data: { label: 'Client', category: 'TRAFFIC', subType: 'client_app' } },
          { id: 'lb_1', data: { label: 'Load Balancer', category: 'TRAFFIC', subType: 'load_balancer' } },
          { id: 'orphan_kafka', data: { label: 'Kafka Broker', category: 'MESSAGING', subType: 'kafka' } },
        ],
        edges: [
          { id: 'e1', source: 'client_1', target: 'lb_1' },
        ],
      };

      const report = validateArchitecture(graphWithOrphan);
      const orphanIssue = report.issues.find((i) => i.category === 'ORPHAN');

      expect(orphanIssue).toBeDefined();
      expect(orphanIssue?.nodeIds).toContain('orphan_kafka');
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 4. Deterministic Capacity Calculation Engine
  // ─────────────────────────────────────────────────────────────
  describe('Capacity Estimation Engine', () => {
    it('calculates mathematically accurate QPS and read/write ratios', () => {
      const inputs = {
        dau: 10_000_000,
        readsPerUserPerDay: 50,
        writesPerUserPerDay: 5,
        avgReadPayloadBytes: 1024,
        avgWritePayloadBytes: 512,
        peakMultiplier: 2.0,
      };

      const output = calculateCapacity(inputs);

      // Total daily reads = 10M * 50 = 500M
      expect(output.totalDailyReads).toBe(500_000_000);
      // Avg Read QPS = 500,000,000 / 86400 = 5787.03
      expect(Math.round(output.avgReadQps)).toBe(5787);
      // Peak Read QPS = 5787 * 2.0 = 11574
      expect(Math.round(output.peakReadQps)).toBe(11574);

      // Total daily writes = 10M * 5 = 50M
      expect(output.totalDailyWrites).toBe(50_000_000);
      // Avg Write QPS = 50,000,000 / 86400 = 578.7
      expect(Math.round(output.avgWriteQps)).toBe(579);
      // Peak Write QPS = 578.7 * 2.0 = 1157
      expect(Math.round(output.peakWriteQps)).toBe(1157);

      expect(output.readWriteRatio).toBe('10.0:1');
    });

    it('computes 80/20 cache memory and 5-year storage with replication', () => {
      const inputs = {
        dau: 20_000_000,
        readsPerUserPerDay: 20,
        writesPerUserPerDay: 2,
        avgReadPayloadBytes: 2048,
        avgWritePayloadBytes: 1024,
        retentionYears: 5,
        replicationFactor: 3,
        cacheRatio: 0.20,
      };

      const output = calculateCapacity(inputs);

      // Daily Storage = 20M * 2 * 1024 B = 40,960,000,000 Bytes (~40.96 GB)
      expect(output.dailyStorageBytes).toBe(40_960_000_000);
      // 5-Year Storage = 40.96 GB * 365 * 5 = ~74.75 TB
      expect(output.retentionStorageBytes).toBe(40_960_000_000 * 365 * 5);
      // Total Storage with 3x replica = 74.75 TB * 3 = ~224.25 TB
      expect(output.totalStorageWithReplicationBytes).toBe(output.retentionStorageBytes * 3);

      // Cache RAM (80/20 rule): 20M * 20 reads * 2048 B * 0.20
      const totalDailyReadBytes = 20_000_000 * 20 * 2048;
      expect(output.cacheMemoryRequiredBytes).toBe(totalDailyReadBytes * 0.20);
      expect(output.cacheMemoryRequiredFormatted).toContain('GB');

      // Cluster recommendations
      expect(output.recommendedAppServers).toBeGreaterThan(0);
      expect(output.recommendedDbShards).toBeGreaterThan(0);
      expect(output.recommendedRedisNodes).toBeGreaterThan(0);
    });

    it('provides educational step-by-step mathematical breakdown', () => {
      const output = calculateCapacity({
        dau: 5_000_000,
        readsPerUserPerDay: 10,
        writesPerUserPerDay: 1,
        avgReadPayloadBytes: 1000,
        avgWritePayloadBytes: 500,
      });

      expect(output.breakdown.length).toBeGreaterThanOrEqual(4);
      expect(output.breakdown.some((b) => b.title.includes('QPS'))).toBe(true);
      expect(output.breakdown.some((b) => b.title.includes('Storage'))).toBe(true);
      expect(output.breakdown.some((b) => b.title.includes('Cache'))).toBe(true);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 5. Socratic Dialogue Progression & Context Synchronization
  // ─────────────────────────────────────────────────────────────
  describe('Socratic AI Interviewer & Multi-Stage Progression', () => {
    it('generates context-aware Socratic responses based on candidate statements and current stage', async () => {
      const problem = SYSTEM_DESIGN_PROBLEMS[0]; // TinyURL
      const graph: CanvasGraph = {
        nodes: [
          { id: '1', data: { label: 'Client', category: 'TRAFFIC', subType: 'client_app' } },
        ],
        edges: [],
      };

      // Candidate asks about SLAs in Stage 1
      const response = await AIInterviewerService.generateDialogueResponse({
        problem,
        stage: 1,
        userMessage: 'What are our latency SLAs and daily active user targets?',
        graph,
        transcript: [],
      });

      expect(response.message.role).toBe('ai');
      expect(response.message.content).toMatch(/(DAU|Latency|SLA|Requirements)/i);
      expect(response.message.suggestions?.length).toBeGreaterThan(0);
    });

    it('advances stages when candidate expresses readiness to proceed', async () => {
      const problem = SYSTEM_DESIGN_PROBLEMS[0];
      const graph: CanvasGraph = { nodes: [], edges: [] };

      const response = await AIInterviewerService.generateDialogueResponse({
        problem,
        stage: 1,
        userMessage: 'Requirements are clear. Let us move to next stage and do capacity estimation.',
        graph,
        transcript: [],
      });

      expect(response.nextStage).toBe(2);
      expect(response.message.stage).toBe(2);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 6. Comprehensive Evaluation Report Generation (11 Dimensions)
  // ─────────────────────────────────────────────────────────────
  describe('11-Dimension Evaluation & Final Rubric Report', () => {
    it('evaluates candidate performance across all 11 standardized dimensions', () => {
      const problem = SYSTEM_DESIGN_PROBLEMS[1]; // Real-Time Chat
      const graph: CanvasGraph = {
        nodes: [
          { id: 'client', data: { label: 'Web/Mobile Client', category: 'TRAFFIC', subType: 'client_app' } },
          { id: 'lb', data: { label: 'Load Balancer', category: 'TRAFFIC', subType: 'load_balancer' } },
          { id: 'gw', data: { label: 'WebSocket Gateway', category: 'MESSAGING', subType: 'websocket_gw' } },
          { id: 'redis', data: { label: 'Redis Pub/Sub', category: 'RELIABILITY', subType: 'cache' } },
          { id: 'kafka', data: { label: 'Kafka Message Bus', category: 'MESSAGING', subType: 'kafka' } },
          { id: 'worker', data: { label: 'Chat Ingest Worker', category: 'COMPUTE', subType: 'worker' } },
          { id: 'db', data: { label: 'Cassandra DB', category: 'STORAGE', subType: 'wide_column' } },
        ],
        edges: [
          { id: 'e1', source: 'client', target: 'lb' },
          { id: 'e2', source: 'lb', target: 'gw' },
          { id: 'e3', source: 'gw', target: 'redis' },
          { id: 'e4', source: 'gw', target: 'kafka' },
          { id: 'e5', source: 'kafka', target: 'worker' },
          { id: 'e6', source: 'worker', target: 'db' },
        ],
      };

      const capacityOutputs = calculateCapacity({
        dau: 50_000_000,
        readsPerUserPerDay: 200,
        writesPerUserPerDay: 40,
        avgReadPayloadBytes: 1024,
        avgWritePayloadBytes: 512,
      });

      const validationReport = validateArchitecture(graph, capacityOutputs.peakWriteQps, capacityOutputs.peakReadQps);

      const evaluation = AIInterviewerService.generateEvaluationReport({
        problem,
        graph,
        capacityOutputs,
        validationReport,
        transcript: [
          { id: '1', role: 'ai', content: 'Greeting', timestamp: '' },
          { id: '2', role: 'candidate', content: 'Clarified DAU and 50ms latency SLAs', timestamp: '' },
          { id: '3', role: 'candidate', content: 'Calculated 100GB socket RAM and Cassandra partitioned by channel_id', timestamp: '' },
        ],
        durationSeconds: 1200,
      });

      expect(evaluation.overallScore).toBeGreaterThanOrEqual(0);
      expect(evaluation.overallScore).toBeLessThanOrEqual(100);
      expect(evaluation.verdict).toMatch(/^(STRONG_HIRE|HIRE|LEANING_HIRE|NEEDS_WORK|NO_HIRE)$/);
      expect(evaluation.dimensions.length).toBe(11);

      // Verify key dimensions
      const dimensionNames = evaluation.dimensions.map((d) => d.dimension);
      expect(dimensionNames).toContain('1. Requirements Scoping & Clarification');
      expect(dimensionNames).toContain('2. Capacity & Scale Estimation');
      expect(dimensionNames).toContain('3. High-Level Component Selection');
      expect(dimensionNames).toContain('4. Data Modeling & Storage Strategy');
      expect(dimensionNames).toContain('5. Caching & Latency Optimization');
      expect(dimensionNames).toContain('6. Scalability & Sharding Strategy');
      expect(dimensionNames).toContain('7. Reliability, SPOF & Fault Tolerance');
      expect(dimensionNames).toContain('8. API Design & Edge Protocols');
      expect(dimensionNames).toContain('9. Trade-offs & CAP Theorem');
      expect(dimensionNames).toContain('10. Observability & Resilience');
      expect(dimensionNames).toContain('11. Structured Socratic Communication');

      expect(evaluation.strengths.length).toBeGreaterThan(0);
      expect(evaluation.recommendedRedesign).toBeDefined();
    });

    it('persists completed interview session and updates user history truthfully', async () => {
      const candidateId = `cand_full_${Date.now()}`;
      const session = await SystemDesignService.createSession(candidateId, 'sd_distributed_rate_limiter', 'Marcus');

      // Candidate builds graph
      const graph: CanvasGraph = {
        nodes: [
          { id: 'c1', data: { label: 'Client App', category: 'TRAFFIC', subType: 'client_app' } },
          { id: 'gw', data: { label: 'API Gateway', category: 'TRAFFIC', subType: 'api_gateway' } },
          { id: 'rl', data: { label: 'Rate Limiter', category: 'TRAFFIC', subType: 'rate_limiter' } },
          { id: 'redis', data: { label: 'Redis Cluster', category: 'RELIABILITY', subType: 'cache' } },
        ],
        edges: [
          { id: 'e1', source: 'c1', target: 'gw' },
          { id: 'e2', source: 'gw', target: 'rl' },
          { id: 'e3', source: 'rl', target: 'redis' },
        ],
      };
      await SystemDesignService.saveGraph(session.id, candidateId, graph);

      // Complete the interview
      const report = await SystemDesignService.finishSession(session.id, candidateId, 1800);
      expect(report.overallScore).toBeGreaterThanOrEqual(50);

      // Verify truthful history
      const history = await SystemDesignService.getUserHistory(candidateId);
      expect(history.length).toBe(1);
      expect(history[0].id).toBe(session.id);
      expect(history[0].status).toBe('COMPLETED');
      expect(history[0].score).toBe(report.overallScore);
      expect(history[0].problem.title).toContain('Rate Limiter');
    });
  });

});
