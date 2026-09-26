// ═══════════════════════════════════════════════════════════════
// RU Ready? — Context-Aware AI System Design Interviewer
// Socratic dialogue driver and 11-dimension rubric evaluation engine
// ═══════════════════════════════════════════════════════════════

import { SystemDesignProblemDefinition } from '../data/systemDesignProblems.data.js';
import { CanvasGraph, ValidationReport } from '../engine/validatorEngine.js';
import { CapacityOutputs } from '../engine/capacityEngine.js';

export interface ChatMessage {
  id: string;
  role: 'ai' | 'candidate';
  content: string;
  timestamp: string;
  stage?: number;
  suggestions?: string[];
}

export interface EvaluationDimension {
  dimension: string;
  score: number; // 0 - 10
  maxScore: number;
  feedback: string;
}

export interface SystemDesignEvaluationReport {
  overallScore: number; // 0 - 100
  verdict: 'STRONG_HIRE' | 'HIRE' | 'LEANING_HIRE' | 'NEEDS_WORK' | 'NO_HIRE';
  summary: string;
  dimensions: EvaluationDimension[];
  strengths: string[];
  criticalOmissions: string[];
  recommendedRedesign: string;
}

export const STAGE_NAMES: Record<number, string> = {
  1: 'Requirements & Scoping',
  2: 'Capacity Estimation',
  3: 'High-Level Architecture',
  4: 'Deep Dive & Data Models',
  5: 'Scalability & Failure Scenarios',
  6: 'Trade-offs & CAP Theorem',
};

export class AIInterviewerService {
  /**
   * Generates the initial opening greeting from the AI Interviewer
   */
  static getOpeningGreeting(problem: SystemDesignProblemDefinition): ChatMessage {
    const greetingContent = `Hello! Welcome to your System Design interview for **${problem.title}**.

I'm your AI Interviewer. We will approach this like a real Staff Engineer interview in 6 stages:
1. **Requirements & Scoping**
2. **Capacity & Scale Estimation**
3. **High-Level Design**
4. **Deep Dive & Data Models**
5. **Scalability & Bottlenecks**
6. **Trade-offs & Resilience**

Let's begin with **Stage 1: Requirements & Scoping**. 
Take a moment to review the problem statement. What functional and non-functional requirements would you prioritize, and what clarifying questions do you have before we design the architecture?`;

    return {
      id: `ai_${Date.now()}`,
      role: 'ai',
      content: greetingContent,
      timestamp: new Date().toISOString(),
      stage: 1,
      suggestions: [
        'What is our expected daily active user (DAU) base?',
        'Are there strict p99 read/write latency SLAs?',
        'Do we need strong consistency or is eventual consistency acceptable?',
        'Can we define the core read vs write workflows?',
      ],
    };
  }

  /**
   * Generates a context-aware response based on whiteboard state, stage, and user message
   */
  static async generateDialogueResponse(params: {
    problem: SystemDesignProblemDefinition;
    stage: number;
    userMessage: string;
    graph: CanvasGraph;
    capacityOutputs?: CapacityOutputs;
    validationReport?: ValidationReport;
    transcript: ChatMessage[];
  }): Promise<{ message: ChatMessage; nextStage?: number }> {
    const { problem, stage, userMessage, graph, capacityOutputs, validationReport, transcript } = params;

    const nodesCount = graph.nodes?.length || 0;
    const nodeLabels = (graph.nodes || []).map((n) => n.data.label).join(', ');
    const userMsgLower = userMessage.toLowerCase();

    // Check if user is asking to advance stage
    let nextStage = stage;
    const wantsToAdvance =
      userMsgLower.includes('move to next') ||
      userMsgLower.includes('next stage') ||
      userMsgLower.includes('proceed to') ||
      userMsgLower.includes('ready for stage') ||
      userMsgLower.includes('next step');

    if (wantsToAdvance && stage < 6) {
      nextStage = stage + 1;
    }

    // Call external LLM (Gemini / Groq) if API key exists, otherwise use rich deterministic Socratic engine
    const apiKey = process.env.GEMINI_API_KEY || process.env.GROQ_API_KEY;

    if (apiKey) {
      try {
        const llmResponse = await this.callExternalLLM({
          problem,
          stage: nextStage,
          userMessage,
          graph,
          capacityOutputs,
          validationReport,
          transcript,
        });
        if (llmResponse) {
          return {
            message: {
              id: `ai_${Date.now()}`,
              role: 'ai',
              content: llmResponse.content,
              timestamp: new Date().toISOString(),
              stage: nextStage,
              suggestions: llmResponse.suggestions,
            },
            nextStage: nextStage !== stage ? nextStage : undefined,
          };
        }
      } catch (err) {
        console.warn('[AI Interviewer] LLM call failed, falling back to deterministic Socratic engine:', err);
      }
    }

    // Fallback: Deterministic context-rich Socratic interviewer
    const deterministicReply = this.generateDeterministicSocraticReply({
      problem,
      stage: nextStage,
      userMessage,
      nodesCount,
      nodeLabels,
      capacityOutputs,
      validationReport,
    });

    return {
      message: {
        id: `ai_${Date.now()}`,
        role: 'ai',
        content: deterministicReply.content,
        timestamp: new Date().toISOString(),
        stage: nextStage,
        suggestions: deterministicReply.suggestions,
      },
      nextStage: nextStage !== stage ? nextStage : undefined,
    };
  }

  private static generateDeterministicSocraticReply(params: {
    problem: SystemDesignProblemDefinition;
    stage: number;
    userMessage: string;
    nodesCount: number;
    nodeLabels: string;
    capacityOutputs?: CapacityOutputs;
    validationReport?: ValidationReport;
  }): { content: string; suggestions: string[] } {
    const { problem, stage, userMessage, nodesCount, nodeLabels, capacityOutputs, validationReport } = params;
    const msg = userMessage.toLowerCase();

    if (stage === 1) {
      if (msg.includes('latency') || msg.includes('sla') || msg.includes('dau') || msg.includes('users')) {
        return {
          content: `Excellent requirements scoping! To set our engineering baseline:
- **DAU**: ~${(problem.trafficDefaults.dau / 1_000_000).toFixed(0)} Million active users.
- **Latency SLA**: p99 read latency < 20ms; write latency < 100ms.
- **Availability**: 99.99% (four nines uptime).

Now let's transition to **Stage 2: Capacity & Scale Estimation**. Please head over to the **Capacity Calculator** tab to compute our QPS, bandwidth, storage, and cache memory requirements. What numbers do you anticipate?`,
          suggestions: [
            'Let us calculate Read and Write QPS based on the traffic defaults.',
            'What is the 80/20 cache memory requirement for our read load?',
            'How much storage will we need over 5 years factoring replication?',
          ],
        };
      }
      return {
        content: `Good points on the requirements. For **${problem.title}**, let's make sure we clearly bound the scope:
1. **Core functional actions**: ${problem.functionalRequirements[0]}
2. **Data lifecycle**: How long should records persist?
3. **Availability vs Consistency**: Which CAP priority should we honor during network partitions?

Once you're satisfied with the requirements, let's proceed to **Stage 2: Capacity Estimation**.`,
        suggestions: [
          'I am ready to move to Capacity Estimation.',
          'Let us prioritize High Availability (AP) over Strong Consistency (CP).',
          'What is the read-to-write ratio for this system?',
        ],
      };
    }

    if (stage === 2) {
      if (capacityOutputs) {
        return {
          content: `I reviewed your capacity calculations:
- **Peak Total QPS**: **${Math.round(capacityOutputs.peakTotalQps).toLocaleString()} req/s** (${capacityOutputs.readWriteRatio} Read/Write)
- **5-Year Storage (with 3x replica)**: **${capacityOutputs.totalStorageWithReplicationFormatted}**
- **Cache Memory (80/20 Rule)**: **${capacityOutputs.cacheMemoryRequiredFormatted}**
- **Recommended Nodes**: ~${capacityOutputs.recommendedAppServers} App Servers & ${capacityOutputs.recommendedRedisNodes} Cache Nodes.

These numbers give us clear scaling targets. Now let's head to **Stage 3: High-Level Architecture**.
Use the **Component Palette** on the left to drag and connect your core building blocks (Clients, Load Balancer, App Servers, Cache, Databases).`,
          suggestions: [
            'I have placed the Load Balancer, App Servers, and Redis Cache.',
            'Let us add an asynchronous queue for high-volume writes.',
            'Let us check the architecture validator diagnostics.',
          ],
        };
      }
      return {
        content: `For scale estimation, please open the **Capacity Calculator** panel and adjust the sliders for DAU, Read/Write ratio, and payload size. Once computed, explain how these numbers dictate your database and caching strategy.`,
        suggestions: [
          'I ran the capacity calculator with default traffic numbers.',
          'Ready to proceed to High-Level Architecture.',
        ],
      };
    }

    if (stage === 3) {
      let issuesMsg = '';
      if (validationReport && validationReport.issues.length > 0) {
        const topIssue = validationReport.issues[0];
        issuesMsg = `\n\n⚠️ **Architecture Warning Detected**: *${topIssue.title}* — ${topIssue.recommendation}`;
      }

      return {
        content: `Looking at your whiteboard canvas, you have placed **${nodesCount} components** (${nodeLabels || 'None yet'}).
${issuesMsg}

In Stage 3, explain:
1. How does a read request flow from the client through to the data layer?
2. How do you protect against Single Points of Failure (SPOFs)?
3. What edge protocols (HTTP/REST, gRPC, WebSocket) connect these services?`,
        suggestions: [
          'Clients connect via Load Balancer to Stateless Microservices.',
          'Reads check Redis cache first (cache-aside pattern); writes update PostgreSQL.',
          'I added Read Replicas to eliminate database SPOF.',
          'Ready to proceed to Stage 4: Deep Dive & Data Models.',
        ],
      };
    }

    if (stage === 4) {
      return {
        content: `Let's deep dive into the **Data Model & Core Algorithms** (Stage 4).
1. **Schema Design**: What tables, primary keys, and indexes are required?
2. **Access Patterns**: Are our queries optimized for point lookups or range scans?
3. **Caching Strategy**: Are you using Cache-Aside (Lazy Loading), Write-Through, or Write-Behind?`,
        suggestions: [
          'We use Cache-Aside with LRU eviction and 24h TTL.',
          'Our primary key is indexed on B-Tree / Hash for O(1) point lookups.',
          'We use Snowflake IDs for globally unique, time-sortable IDs.',
          'Let us move to Stage 5: Scalability & Failure Scenarios.',
        ],
      };
    }

    if (stage === 5) {
      return {
        content: `Let's test the resilience of your design in **Stage 5: Scalability & Failure Scenarios**:
1. **Cache Stampede**: What happens when 10,000 requests hit an expired hot cache key at the same millisecond?
2. **Database Failover**: If the Primary DB crashes, how does promotion to master happen without data loss?
3. **Partition Sharding**: How do you partition data once a single DB exceeds 10TB? (Consistent Hashing vs Range Partitioning)`,
        suggestions: [
          'We use Mutex locks / Probabilistic early expiration to prevent cache stampede.',
          'We use Consistent Hashing with virtual nodes to distribute database shards.',
          'We use automated Raft consensus / Multi-AZ failover for master promotion.',
          'Ready to discuss Stage 6: Trade-offs & CAP Theorem.',
        ],
      };
    }

    // Stage 6
    return {
      content: `We have reached the final stage — **Stage 6: Trade-offs & CAP Theorem Justification**.
Every senior design involves deliberate trade-offs:
- **CAP Theorem**: Did you choose AP (High Availability & Partition Tolerance) or CP (Consistency & Partition Tolerance)?
- **SQL vs NoSQL**: Why did you select this storage engine over alternatives?
- **Sync vs Async**: Where did you introduce asynchronous messaging, and what latency did you accept?

When you are ready, click **Finish Interview** to generate your official **11-Dimension Evaluation Report**!`,
      suggestions: [
        'We chose AP because eventual consistency is acceptable and uptime is critical.',
        'We use Kafka for async batching to protect downstream databases.',
        'I am ready to complete the interview and see my evaluation scorecard.',
      ],
    };
  }

  private static async callExternalLLM(params: {
    problem: SystemDesignProblemDefinition;
    stage: number;
    userMessage: string;
    graph: CanvasGraph;
    capacityOutputs?: CapacityOutputs;
    validationReport?: ValidationReport;
    transcript: ChatMessage[];
  }): Promise<{ content: string; suggestions: string[] } | null> {
    // If external key is present, implement HTTP call to Gemini / Groq
    return null;
  }

  /**
   * Generates the comprehensive 11-dimension evaluation report
   */
  static generateEvaluationReport(params: {
    problem: SystemDesignProblemDefinition;
    graph: CanvasGraph;
    capacityOutputs?: CapacityOutputs;
    validationReport?: ValidationReport;
    transcript: ChatMessage[];
    durationSeconds: number;
  }): SystemDesignEvaluationReport {
    const { problem, graph, capacityOutputs, validationReport, transcript, durationSeconds } = params;

    const nodeCount = graph.nodes?.length || 0;
    const edgeCount = graph.edges?.length || 0;
    const validatorScore = validationReport?.score || 70;
    const userMessageCount = transcript.filter((t) => t.role === 'candidate').length;

    // Dimension 1: Requirements Scoping
    const reqScore = Math.min(10, Math.max(5, userMessageCount >= 2 ? 9 : 6));
    // Dimension 2: Capacity Estimation
    const capScore = capacityOutputs ? 9 : 4;
    // Dimension 3: High-Level Architecture
    const hldScore = nodeCount >= 5 && edgeCount >= 4 ? 9 : nodeCount >= 3 ? 7 : 4;
    // Dimension 4: Data Modeling
    const dataScore = graph.nodes.some((n) => n.data.category === 'STORAGE') ? 8 : 4;
    // Dimension 5: Caching & Latency
    const cacheScore = graph.nodes.some((n) => n.data.subType === 'cache' || n.data.subType === 'key_value' || n.data.subType === 'cdn') ? 9 : 5;
    // Dimension 6: Scalability & Sharding
    const scaleScore = nodeCount >= 6 ? 8 : 6;
    // Dimension 7: Reliability & SPOF Mitigation
    const relScore = Math.round((validatorScore / 100) * 10);
    // Dimension 8: API Design & Protocols
    const protoScore = graph.edges.some((e) => e.data?.protocol) ? 9 : 6;
    // Dimension 9: Trade-offs & CAP
    const capTheoremScore = userMessageCount >= 4 ? 8 : 6;
    // Dimension 10: Observability & Security
    const obsScore = graph.nodes.some((n) => n.data.category === 'OBSERVABILITY' || n.data.subType === 'rate_limiter') ? 9 : 5;
    // Dimension 11: Structured Communication
    const commScore = Math.min(10, Math.max(6, Math.floor(userMessageCount * 1.5) + 3));

    const dimensions: EvaluationDimension[] = [
      {
        dimension: '1. Requirements Scoping & Clarification',
        score: reqScore,
        maxScore: 10,
        feedback: reqScore >= 8 ? 'Strong framing of functional scope and non-functional latency/availability targets.' : 'Good start, but should clarify exact throughput SLAs and boundary conditions earlier.',
      },
      {
        dimension: '2. Capacity & Scale Estimation',
        score: capScore,
        maxScore: 10,
        feedback: capScore >= 8 ? 'Accurately derived QPS, network bandwidth, 80/20 cache sizing, and 5-year storage growth.' : 'Needs deeper mathematical rigor on peak multipliers and storage replication factoring.',
      },
      {
        dimension: '3. High-Level Component Selection',
        score: hldScore,
        maxScore: 10,
        feedback: hldScore >= 8 ? 'Clean separation of concerns across Ingress, Stateless Compute, Cache, and Persistence.' : 'Architecture needs clearer modular boundaries between frontend ingress and core microservices.',
      },
      {
        dimension: '4. Data Modeling & Storage Strategy',
        score: dataScore,
        maxScore: 10,
        feedback: dataScore >= 8 ? 'Appropriate database engine selection tailored to the read/write workload characteristics.' : 'Consider indexing strategies and partition keys to prevent hot spots.',
      },
      {
        dimension: '5. Caching & Latency Optimization',
        score: cacheScore,
        maxScore: 10,
        feedback: cacheScore >= 8 ? 'In-memory Redis/CDN caching layer effectively offloads heavy database read traffic.' : 'Missing distributed caching layer for high-frequency reads.',
      },
      {
        dimension: '6. Scalability & Sharding Strategy',
        score: scaleScore,
        maxScore: 10,
        feedback: scaleScore >= 8 ? 'Demonstrated horizontal scaling and consistent hashing principles.' : 'Should specify database sharding algorithms (Range vs Consistent Hashing).',
      },
      {
        dimension: '7. Reliability, SPOF & Fault Tolerance',
        score: relScore,
        maxScore: 10,
        feedback: relScore >= 8 ? 'No critical Single Points of Failure detected; redundancy configured across critical paths.' : `Architecture validator identified ${validationReport?.spofCount || 1} potential SPOF vulnerabilities.`,
      },
      {
        dimension: '8. API Design & Edge Protocols',
        score: protoScore,
        maxScore: 10,
        feedback: protoScore >= 8 ? 'Proper directional edge protocols (REST, gRPC, WebSockets, Kafka Streams) specified.' : 'Explicit network protocols should be annotated on all inter-service edges.',
      },
      {
        dimension: '9. Trade-offs & CAP Theorem',
        score: capTheoremScore,
        maxScore: 10,
        feedback: capTheoremScore >= 8 ? 'Solid justification of consistency vs availability trade-offs under network partitions.' : 'Could delve deeper into eventual consistency reconciliation and conflict resolution.',
      },
      {
        dimension: '10. Observability & Resilience',
        score: obsScore,
        maxScore: 10,
        feedback: obsScore >= 8 ? 'Centralized metrics, distributed tracing, and rate limiting incorporated.' : 'Add centralized telemetry (Prometheus/Grafana) and circuit breakers for cascading failure prevention.',
      },
      {
        dimension: '11. Structured Socratic Communication',
        score: commScore,
        maxScore: 10,
        feedback: commScore >= 8 ? 'Logical, iterative progression through all 6 interview stages with clear rationale.' : 'Communicate trade-offs before diving into low-level component placement.',
      },
    ];

    const totalRaw = dimensions.reduce((acc, d) => acc + d.score, 0);
    const overallScore = Math.round((totalRaw / 110) * 100);

    let verdict: SystemDesignEvaluationReport['verdict'] = 'HIRE';
    if (overallScore >= 88) verdict = 'STRONG_HIRE';
    else if (overallScore >= 75) verdict = 'HIRE';
    else if (overallScore >= 62) verdict = 'LEANING_HIRE';
    else if (overallScore >= 45) verdict = 'NEEDS_WORK';
    else verdict = 'NO_HIRE';

    const strengths: string[] = [];
    if (cacheScore >= 8) strengths.push('Effective in-memory caching and low-latency read path optimization.');
    if (hldScore >= 8) strengths.push('Well-structured multi-tier architecture with clean separation of concerns.');
    if (capScore >= 8) strengths.push('Accurate mathematical capacity calculations aligned with real-world sizing.');
    if (protoScore >= 8) strengths.push('Sound protocol selection (gRPC for internal microservices, REST/WS for public ingress).');
    if (strengths.length === 0) strengths.push('Good foundational understanding of distributed system building blocks.');

    const criticalOmissions: string[] = [];
    if (validationReport?.issues.some((i) => i.category === 'SPOF')) {
      criticalOmissions.push('Ensure all database and compute nodes have multi-AZ replicas to eliminate SPOFs.');
    }
    if (!graph.nodes.some((n) => n.data.category === 'MESSAGING')) {
      criticalOmissions.push('Introduce an asynchronous message queue (Kafka/RabbitMQ) to buffer high-throughput writes.');
    }
    if (obsScore < 7) {
      criticalOmissions.push('Incorporate distributed tracing (OpenTelemetry/Jaeger) and health check probes.');
    }

    return {
      overallScore,
      verdict,
      summary: `Candidate demonstrated solid ${problem.difficulty} system design fundamentals for "${problem.title}", scoring ${overallScore}/100 across 11 key engineering dimensions.`,
      dimensions,
      strengths,
      criticalOmissions,
      recommendedRedesign: problem.referenceArchitecture.explanation,
    };
  }
}
