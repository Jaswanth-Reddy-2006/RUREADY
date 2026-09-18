// ═══════════════════════════════════════════════════════════════
// Career Roadmap & Skill Mastery Service — Enterprise Scale
// ═══════════════════════════════════════════════════════════════

import { prisma } from '../lib/prisma.js';
import { NotFoundError, BadRequestError } from '../lib/errors.js';
import { z } from 'zod';

export interface RoadmapNode {
  id: string;
  title: string;
  category: string;
  status: 'LOCKED' | 'IN_PROGRESS' | 'MASTERED';
  score: number;
  orderIndex: number;
  summary: string;
  concepts: string[];
  codeSnippet: string;
  microQuestions: Array<{
    id: string;
    questionText: string;
    focus: string;
    suggestedAnswer?: string;
  }>;
}

export const GenerateRoadmapSchema = z.object({
  rolePath: z.string().min(2).max(50),
  targetCompanyTier: z.string().optional().default('FAANG'),
  customTechStack: z.record(z.string()).optional(),
});

const PRE_BUILT_ROADMAPS: Record<string, { title: string; nodes: Omit<RoadmapNode, 'status' | 'score'>[] }> = {
  FULLSTACK: {
    title: 'Senior Fullstack Web Engineer Mastery Path',
    nodes: [
      {
        id: 'node-fs-1',
        title: 'Modern React & Concurrent State Architecture',
        category: 'Frontend Core',
        orderIndex: 1,
        summary: 'Deep dive into virtual DOM diffing, useMemo/useCallback optimization, and global state machines.',
        concepts: [
          'Virtual DOM reconciler algorithm and Fiber tree priority queuing.',
          'Custom hook encapsulation and side-effect cleanup isolation.',
          'Avoiding re-render cascades with selective selector subscriptions.'
        ],
        codeSnippet: `// Selective Zustand state subscription
const user = useUserStore((state) => state.user);
const updateScore = useUserStore((state) => state.updateScore);`,
        microQuestions: [
          { 
            id: 'mq-fs-1a', 
            questionText: 'Explain how React Fiber reconciler prioritizes concurrent renders.', 
            focus: 'React Internals',
            suggestedAnswer: 'React Fiber assigns priority lanes to updates. High-priority user interactions interrupt lower-priority background transitions to keep UI responsive.'
          },
          { 
            id: 'mq-fs-1b', 
            questionText: 'How do you prevent unnecessary re-renders in deeply nested component trees?', 
            focus: 'Performance',
            suggestedAnswer: 'Use fine-grained selector subscriptions, memoize heavy computations with useMemo, and push state down to the lowest common ancestor.'
          }
        ]
      },
      {
        id: 'node-fs-2',
        title: 'Node.js Event Loop & Concurrency',
        category: 'Backend Core',
        orderIndex: 2,
        summary: 'Master asynchronous I/O, event loop phases, worker threads, and stream pipelines.',
        concepts: [
          'Timers, Poll, Check (setImmediate), and Close phases of libuv event loop.',
          'Backpressure management in Node.js Transform streams.',
          'Worker Threads vs Cluster module for CPU-bound computational workloads.'
        ],
        codeSnippet: `import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';

await pipeline(
  createReadStream('large_dataset.csv'),
  transformCsvToJson,
  createWriteStream('output.json')
);`,
        microQuestions: [
          { 
            id: 'mq-fs-2a', 
            questionText: 'What is the difference between process.nextTick and setImmediate in the Node event loop?', 
            focus: 'Async Runtime',
            suggestedAnswer: 'process.nextTick executes immediately after the current operation before the event loop advances. setImmediate runs in the Check phase of the event loop.'
          },
          { 
            id: 'mq-fs-2b', 
            questionText: 'How do you handle stream backpressure when piping high-throughput datasets?', 
            focus: 'Streams',
            suggestedAnswer: 'Use stream.pipeline() which automatically pauses the readable source when write buffers fill up, resuming when the drain event fires.'
          }
        ]
      },
      {
        id: 'node-fs-3',
        title: 'PostgreSQL Indexing & B-Trees',
        category: 'Database Engineering',
        orderIndex: 3,
        summary: 'Optimize database query response times using B-Tree, GIN, and Partial indexes.',
        concepts: [
          'B-Tree vs Hash vs GIN index data structures in PostgreSQL.',
          'Analyzing EXPLAIN ANALYZE execution plans and sequential scans.',
          'ACID isolation levels and avoiding deadlocks in concurrent transactions.'
        ],
        codeSnippet: `-- Partial index for high-throughput queries
CREATE INDEX idx_active_users_email 
ON user_profiles (email) 
WHERE is_active = true;`,
        microQuestions: [
          { 
            id: 'mq-fs-3a', 
            questionText: 'When would you choose a GIN index over a standard B-Tree index in Postgres?', 
            focus: 'Index Structures',
            suggestedAnswer: 'GIN indexes are ideal for multi-valued data types like JSONB, Arrays, and Full-Text search where individual elements within a column need indexing.'
          },
          { 
            id: 'mq-fs-3b', 
            questionText: 'Explain the difference between Read Committed and Repeatable Read transaction isolation levels.', 
            focus: 'ACID Transactions',
            suggestedAnswer: 'Read Committed sees new commits made during transaction execution. Repeatable Read takes a snapshot at transaction start, preventing non-repeatable reads.'
          }
        ]
      },
      {
        id: 'node-fs-4',
        title: 'Distributed Rate Limiting & Caching',
        category: 'System Design',
        orderIndex: 4,
        summary: 'Design high-throughput Redis caching layers and token bucket rate limiters.',
        concepts: [
          'Token Bucket vs Sliding Window Log rate limiting algorithms.',
          'Cache Stampede prevention using probabilistic early expiration (XFetch).',
          'Redis Sentinel high-availability vs Redis Cluster sharding.'
        ],
        codeSnippet: `// Redis sliding window counter via Lua script
const res = await redis.eval(slidingWindowLua, 1, \`rate:\${userId}\`, now, windowMs, limit);`,
        microQuestions: [
          { 
            id: 'mq-fs-4a', 
            questionText: 'How do you prevent a cache stampede when a hot Redis key expires?', 
            focus: 'Caching Strategies',
            suggestedAnswer: 'Use Probabilistic Early Expiration (XFetch algorithm) where requests near expiration probabilistically trigger a background refresh while serving cached data.'
          },
          { 
            id: 'mq-fs-4b', 
            questionText: 'Compare Token Bucket with Sliding Window Log rate limiters.', 
            focus: 'System Architecture',
            suggestedAnswer: 'Token Bucket has minimal memory overhead and allows bursts. Sliding Window Log provides exact precision but consumes higher memory per user request.'
          }
        ]
      }
    ]
  },
  DATA_ANALYST: {
    title: 'Data Analyst & Analytics Engineer Mastery Path',
    nodes: [
      {
        id: 'node-da-1',
        title: 'SQL Window Functions & Analytical Aggregations',
        category: 'SQL Mastery',
        orderIndex: 1,
        summary: 'Master complex analytical queries with RANK, DENSE_RANK, NTILE, and CTEs.',
        concepts: [
          'PARTITION BY vs GROUP BY syntax and execution order.',
          'Cumulative moving averages using ROWS BETWEEN UNBOUNDED PRECEDING.',
          'Optimizing CTEs with WITH MATERIALIZED query execution.'
        ],
        codeSnippet: `SELECT customer_id, purchase_amount,
  AVG(purchase_amount) OVER (
    PARTITION BY customer_id 
    ORDER BY purchase_date 
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ) AS rolling_7d_avg
FROM transactions;`,
        microQuestions: [
          { 
            id: 'mq-da-1a', 
            questionText: 'Explain the difference between RANK() and DENSE_RANK() in SQL windowing.', 
            focus: 'SQL Analytics',
            suggestedAnswer: 'RANK() skips rank numbers after duplicate values (e.g. 1, 2, 2, 4), while DENSE_RANK() does not skip rank values (e.g. 1, 2, 2, 3).'
          }
        ]
      },
      {
        id: 'node-da-2',
        title: 'Pandas Data Wrangling & Vectorization',
        category: 'Python Analytics',
        orderIndex: 2,
        summary: 'High-performance Python data transformations, indexing, and memory reduction.',
        concepts: [
          'Vectorized Operations vs slow DataFrame iterrows loop iterations.',
          'Memory reduction via categorical dtypes and downcasting integers.',
          'Handling missing data with forward/backward fill and interpolation.'
        ],
        codeSnippet: `import pandas as pd
df['category'] = df['category'].astype('category')
df['sales'] = pd.to_numeric(df['sales'], downcast='float')`,
        microQuestions: [
          { 
            id: 'mq-da-2a', 
            questionText: 'Why is vectorization in Pandas significantly faster than iterating with iterrows()?', 
            focus: 'Python Performance',
            suggestedAnswer: 'Vectorization leverages compiled C/C++ SIMD loops directly in memory without Python interpreter overhead per row.'
          }
        ]
      }
    ]
  },
  AIML: {
    title: 'AI / ML & LLM Application Specialist Path',
    nodes: [
      {
        id: 'node-ml-1',
        title: 'RAG Architecture & Vector Search Embeddings',
        category: 'LLM Systems',
        orderIndex: 1,
        summary: 'Build scalable Retrieval-Augmented Generation systems with Pinecone/Qdrant.',
        concepts: [
          'Cosine Similarity vs Euclidean Distance vs Dot Product in vector search.',
          'Chunking strategies (Hierarchical, Recursive, Semantic splitters).',
          'Hybrid Search combining BM25 keyword matching with Dense Embeddings.'
        ],
        codeSnippet: `const queryVector = await embeddings.embedQuery(userQuery);
const matches = await vectorStore.query({
  vector: queryVector,
  topK: 5,
  includeMetadata: true
});`,
        microQuestions: [
          { 
            id: 'mq-ml-1a', 
            questionText: 'Explain how Hybrid Search combines BM25 keyword search with dense vector embeddings.', 
            focus: 'RAG Architecture',
            suggestedAnswer: 'BM25 captures exact keyword/acronym matches, while dense vectors capture semantic meaning. Reciprocal Rank Fusion (RRF) blends both scores for optimal retrieval.'
          }
        ]
      }
    ]
  },
  DEVOPS: {
    title: 'DevOps & Distributed Cloud Architect Path',
    nodes: [
      {
        id: 'node-dev-1',
        title: 'Kubernetes Cluster Architecture & Pod Orchestration',
        category: 'Containers & K8s',
        orderIndex: 1,
        summary: 'Master Kubernetes control plane, ingress controllers, horizontal pod autoscaling, and statefulsets.',
        concepts: [
          'Kube-apiserver, etcd consensus, and Kubelet reconciler cycles.',
          'HPA (Horizontal Pod Autoscaler) metrics with custom Prometheus adapters.',
          'Zero-downtime rolling updates and readiness/liveness probe calibration.'
        ],
        codeSnippet: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: auth-microservice
spec:
  replicas: 3
  strategy:
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0`,
        microQuestions: [
          { 
            id: 'mq-dev-1a', 
            questionText: 'What is the difference between a Liveness Probe and a Readiness Probe in K8s?', 
            focus: 'Kubernetes Reliability',
            suggestedAnswer: 'Liveness probes restart a deadlocked container. Readiness probes stop routing traffic to a container until it has finished initial boot or warmup.'
          }
        ]
      }
    ]
  },
  SYSTEM_DESIGN: {
    title: 'Staff Distributed System Design & Architecture Path',
    nodes: [
      {
        id: 'node-sd-1',
        title: 'Distributed Consensus & Event-Driven Queues',
        category: 'Distributed Systems',
        orderIndex: 1,
        summary: 'Design fault-tolerant distributed consensus systems using Raft, Kafka event streams, and idempotent consumers.',
        concepts: [
          'CAP theorem trade-offs and tunable consistency in Cassandra / DynamoDB.',
          'Kafka partition key hashing and consumer group rebalancing.',
          'Two-Phase Commit (2PC) vs Saga orchestration for distributed transactions.'
        ],
        codeSnippet: `// Outbox Pattern for distributed transaction consistency
await prisma.$transaction([
  prisma.order.create({ data: orderData }),
  prisma.outboxEvent.create({ data: { type: 'ORDER_CREATED', payload: orderData } })
]);`,
        microQuestions: [
          { 
            id: 'mq-sd-1a', 
            questionText: 'How does the Transactional Outbox pattern prevent dual-write inconsistencies?', 
            focus: 'Distributed Transactions',
            suggestedAnswer: 'The database change and event record are saved in a single ACID transaction. A background worker polls the outbox table to reliably publish to the message broker.'
          }
        ]
      }
    ]
  }
};

const memoryRoadmaps = new Map<string, any>();

function buildDefaultRoadmap(
  userId: string,
  rolePath: string = 'FULLSTACK',
  targetCompanyTier: string = 'FAANG',
  customId?: string
) {
  const validatedRole = (rolePath || 'FULLSTACK').toUpperCase();
  const template = PRE_BUILT_ROADMAPS[validatedRole] || PRE_BUILT_ROADMAPS.FULLSTACK;
  const initialNodes: RoadmapNode[] = template.nodes.map((n, idx) => ({
    ...n,
    status: idx === 0 ? 'IN_PROGRESS' : 'LOCKED',
    score: idx === 0 ? 35 : 0,
  }));

  const id = customId || `rdmp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const obj: any = {
    id,
    userId,
    rolePath: validatedRole,
    targetCompanyTier,
    overallReadiness: 25,
    nodesData: initialNodes as any,
    customTechStack: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  memoryRoadmaps.set(id, obj);
  return obj;
}

export const roadmapService = {
  async generateRoadmap(
    userId: string,
    rolePath: string = 'FULLSTACK',
    targetCompanyTier: string = 'FAANG',
    customTechStack?: Record<string, string>
  ) {
    const validated = GenerateRoadmapSchema.parse({
      rolePath: rolePath.toUpperCase(),
      targetCompanyTier,
      customTechStack,
    });

    const template = PRE_BUILT_ROADMAPS[validated.rolePath] || PRE_BUILT_ROADMAPS.FULLSTACK;

    let initialNodes: RoadmapNode[] = template.nodes.map((n, idx) => ({
      ...n,
      status: idx === 0 ? 'IN_PROGRESS' : 'LOCKED',
      score: idx === 0 ? 35 : 0,
    }));

    if (validated.customTechStack && Object.keys(validated.customTechStack).length > 0) {
      initialNodes = initialNodes.map((node) => {
        let title = node.title;
        let concepts = [...node.concepts];
        const stack = validated.customTechStack!;

        if (stack.frontend && node.category.includes('Frontend')) {
          title = `${stack.frontend} Component Architecture & State`;
          concepts[0] = `Mastering ${stack.frontend} reactivity lifecycle and performance profiling.`;
        }
        if (stack.backend && node.category.includes('Backend')) {
          title = `${stack.backend} Asynchronous Microservices`;
          concepts[0] = `Optimizing ${stack.backend} runtime concurrency and connection pooling.`;
        }
        if (stack.database && node.category.includes('Database')) {
          title = `${stack.database} Query Indexing & Data Models`;
          concepts[0] = `High-throughput indexing structures and query execution in ${stack.database}.`;
        }
        if (stack.cloud && (node.category.includes('System') || node.category.includes('Containers'))) {
          title = `${stack.cloud} Infrastructure & Distributed Reliability`;
          concepts[0] = `Deploying fault-tolerant microservices on ${stack.cloud}.`;
        }

        return {
          ...node,
          title,
          concepts,
        };
      });
    }

    const memoryObj: any = {
      id: `rdmp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      userId,
      rolePath: validated.rolePath,
      targetCompanyTier: validated.targetCompanyTier,
      overallReadiness: 25,
      nodesData: initialNodes as any,
      customTechStack: validated.customTechStack || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    memoryRoadmaps.set(memoryObj.id, memoryObj);

    try {
      const roadmap = await prisma.careerRoadmap.create({
        data: {
          userId,
          rolePath: validated.rolePath,
          targetCompanyTier: validated.targetCompanyTier,
          overallReadiness: 25,
          nodesData: initialNodes as any,
          customTechStack: validated.customTechStack as any,
        },
      });
      memoryRoadmaps.set(roadmap.id, roadmap);
      return roadmap;
    } catch (err) {
      console.warn('[RoadmapService] Database unavailable, using in-memory store:', (err as Error).message);
      return memoryObj as any;
    }
  },

  async getUserRoadmaps(userId: string) {
    try {
      let roadmaps = await prisma.careerRoadmap.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 20,
      });

      if (roadmaps.length === 0) {
        const defaultMap = await this.generateRoadmap(userId, 'FULLSTACK', 'FAANG');
        roadmaps = [defaultMap];
      }

      return roadmaps;
    } catch (err) {
      console.warn('[RoadmapService] DB unavailable for getUserRoadmaps, serving in-memory:', (err as Error).message);
      const userRoadmaps = Array.from(memoryRoadmaps.values()).filter(
        (m: any) => m.userId === userId || m.userId === 'demo-user-id'
      );
      if (userRoadmaps.length > 0) {
        return userRoadmaps;
      }
      const defaultMap = buildDefaultRoadmap(userId, 'FULLSTACK', 'FAANG');
      return [defaultMap];
    }
  },

  async getRoadmapById(id: string, userId: string) {
    try {
      const roadmap = await prisma.careerRoadmap.findFirst({
        where: { id, userId },
      });
      if (roadmap) return roadmap;
    } catch (err) {
      console.warn('[RoadmapService] DB unavailable for getRoadmapById, checking memory:', (err as Error).message);
    }

    if (memoryRoadmaps.has(id)) {
      return memoryRoadmaps.get(id);
    }

    const upper = id.toUpperCase();
    if (PRE_BUILT_ROADMAPS[upper]) {
      return buildDefaultRoadmap(userId, upper, 'FAANG', id);
    }

    const firstMap = Array.from(memoryRoadmaps.values())[0];
    if (firstMap) return firstMap;

    return buildDefaultRoadmap(userId, 'FULLSTACK', 'FAANG', id);
  },

  async submitNodeAttempt(
    userId: string,
    roadmapId: string,
    nodeId: string,
    _codeAnswer?: string,
    _verbalAnswer?: string
  ) {
    const roadmap = await this.getRoadmapById(roadmapId, userId);
    const nodes = (((roadmap.nodesData as unknown as RoadmapNode[]) || []).map((n) => ({ ...n })));

    const nodeIndex = nodes.findIndex((n) => n.id === nodeId);
    if (nodeIndex !== -1) {
      nodes[nodeIndex].status = 'MASTERED';
      nodes[nodeIndex].score = 95;

      if (nodeIndex + 1 < nodes.length) {
        if (nodes[nodeIndex + 1].status === 'LOCKED') {
          nodes[nodeIndex + 1].status = 'IN_PROGRESS';
          nodes[nodeIndex + 1].score = 40;
        }
      }
    }

    const masteredCount = nodes.filter((n) => n.status === 'MASTERED').length;
    const newReadiness = Math.min(100, Math.round((masteredCount / Math.max(1, nodes.length)) * 100));

    const updatedMemory = {
      ...roadmap,
      overallReadiness: newReadiness,
      nodesData: nodes,
      updatedAt: new Date(),
    };
    memoryRoadmaps.set(roadmapId, updatedMemory);

    try {
      const updated = await prisma.careerRoadmap.update({
        where: { id: roadmapId },
        data: {
          overallReadiness: newReadiness,
          nodesData: nodes as any,
        },
      });

      return {
        roadmap: updated,
        node: nodes[nodeIndex] || nodes[0],
        masteredCount,
        totalCount: nodes.length,
        newReadiness,
      };
    } catch {
      return {
        roadmap: updatedMemory,
        node: nodes[nodeIndex] || nodes[0],
        masteredCount,
        totalCount: nodes.length,
        newReadiness,
      };
    }
  },

  async createManualRoadmap(userId: string, data: any) {
    const memoryObj = {
      id: `rdmp_manual_${Date.now()}`,
      userId,
      rolePath: data.rolePath || 'FULLSTACK',
      targetCompanyTier: data.targetCompanyTier || 'FAANG',
      overallReadiness: 0,
      nodesData: data.nodesData || [],
      customTechStack: {
        title: data.title,
        description: data.description,
        difficulty: data.difficulty,
        estimatedWeeks: data.estimatedWeeks,
        isPublic: data.isPublic ?? true,
        creatorName: data.creatorName || 'Candidate',
        creatorUsername: data.creatorUsername || 'candidate',
        tags: data.tags || [],
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    memoryRoadmaps.set(memoryObj.id, memoryObj);

    try {
      const roadmap = await prisma.careerRoadmap.create({
        data: {
          userId,
          rolePath: data.rolePath || 'FULLSTACK',
          targetCompanyTier: data.targetCompanyTier || 'FAANG',
          overallReadiness: 0,
          nodesData: (data.nodesData || []) as any,
          customTechStack: memoryObj.customTechStack as any,
        },
      });
      return roadmap;
    } catch (err) {
      console.warn('[RoadmapService] DB unavailable for createManualRoadmap:', (err as Error).message);
      return memoryObj;
    }
  },

  async getPublicCatalog() {
    try {
      const dbRoadmaps = await prisma.careerRoadmap.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50,
      });
      if (dbRoadmaps && dbRoadmaps.length > 0) return dbRoadmaps;
    } catch (err) {
      console.warn('[RoadmapService] DB unavailable for getPublicCatalog, serving defaults:', (err as Error).message);
    }

    if (memoryRoadmaps.size === 0) {
      buildDefaultRoadmap('system', 'FULLSTACK', 'FAANG');
      buildDefaultRoadmap('system', 'AIML', 'FAANG');
      buildDefaultRoadmap('system', 'DEVOPS', 'FAANG');
    }

    return Array.from(memoryRoadmaps.values());
  },

  async getUserCreatedRoadmaps(userId: string) {
    try {
      return await prisma.careerRoadmap.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
    } catch {
      return Array.from(memoryRoadmaps.values()).filter((m: any) => m.userId === userId);
    }
  },
};
