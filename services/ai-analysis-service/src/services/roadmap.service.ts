// ═══════════════════════════════════════════════════════════════
// AI & Analysis Microservice — Career Roadmap & Skill Mastery Service
// ═══════════════════════════════════════════════════════════════

import { prisma } from '../lib/prisma.js';
import { NotFoundError, BadRequestError } from '../lib/errors.js';

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
  }>;
}

const PRE_BUILT_ROADMAPS: Record<string, { title: string; nodes: Omit<RoadmapNode, 'status' | 'score'>[] }> = {
  FULLSTACK: {
    title: 'Senior Fullstack Web Engineer Mastery Path',
    nodes: [
      {
        id: 'node-fs-1',
        title: 'Modern React & State Architecture',
        category: 'Frontend Core',
        orderIndex: 1,
        summary: 'Deep dive into virtual DOM diffing, useMemo/useCallback optimization, and global state machines.',
        concepts: [
          'Virtual DOM reconciler algorithm and Fiber tree architecture.',
          'Custom hook encapsulation and side-effect isolation.',
          'Avoiding re-render cascades with selective selector subscriptions.'
        ],
        codeSnippet: `// React performance selector pattern
const useUserStore = create((set) => ({
  user: null,
  setUser: (u) => set({ user: u })
}));`,
        microQuestions: [
          { id: 'mq-fs-1a', questionText: 'Explain how React Fiber reconciler prioritizes concurrent renders.', focus: 'React Internals' },
          { id: 'mq-fs-1b', questionText: 'How do you prevent unnecessary re-renders in deeply nested component trees?', focus: 'Performance' }
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
  createReadStream('input.log'),
  transformStream,
  createWriteStream('output.log')
);`,
        microQuestions: [
          { id: 'mq-fs-2a', questionText: 'What is the difference between process.nextTick and setImmediate in the Node event loop?', focus: 'Async Runtime' },
          { id: 'mq-fs-2b', questionText: 'How do you handle stream backpressure when piping large datasets?', focus: 'Streams' }
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
        codeSnippet: `-- Partial index for active users
CREATE INDEX idx_active_users_email 
ON user_profiles (email) 
WHERE is_active = true;`,
        microQuestions: [
          { id: 'mq-fs-3a', questionText: 'When would you choose a GIN index over a standard B-Tree index in Postgres?', focus: 'Index Structures' },
          { id: 'mq-fs-3b', questionText: 'Explain the difference between Read Committed and Repeatable Read transaction isolation levels.', focus: 'ACID Transactions' }
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
          'Cache Stampede prevention using probabilistic early expiration and distributed locks.',
          'Redis Sentinel high-availability vs Redis Cluster sharding.'
        ],
        codeSnippet: `// Redis sliding window rate limiter
const currentWindow = Math.floor(Date.now() / 60000);
const count = await redis.incr(\`rate:\${userId}:\${currentWindow}\`);`,
        microQuestions: [
          { id: 'mq-fs-4a', questionText: 'How do you prevent a cache stampede when a hot Redis key expires?', focus: 'Caching Strategies' },
          { id: 'mq-fs-4b', questionText: 'Compare the Token Bucket algorithm with the Sliding Window Rate Limiting algorithm.', focus: 'System Architecture' }
        ]
      }
    ]
  },
  DATA_ANALYST: {
    title: 'Data Analyst & Analytics Engineer Mastery Path',
    nodes: [
      {
        id: 'node-da-1',
        title: 'SQL Window Functions & Aggregations',
        category: 'SQL Mastery',
        orderIndex: 1,
        summary: 'Master complex analytical queries with RANK, DENSE_RANK, NTILE, and CTEs.',
        concepts: [
          'PARTITION BY vs GROUP BY syntax and execution order.',
          'Cumulative moving averages using ROWS BETWEEN UNBOUNDED PRECEDING.',
          'Optimizing CTEs with WITH MATERIALIZED blocks.'
        ],
        codeSnippet: `SELECT customer_id, purchase_amount,
  AVG(purchase_amount) OVER (
    PARTITION BY customer_id 
    ORDER BY purchase_date 
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ) AS rolling_avg
FROM transactions;`,
        microQuestions: [
          { id: 'mq-da-1a', questionText: 'Explain the difference between RANK() and DENSE_RANK() in SQL windowing.', focus: 'SQL Analytics' },
          { id: 'mq-da-1b', questionText: 'How do you write a rolling 7-day average query in PostgreSQL?', focus: 'Window Functions' }
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
          { id: 'mq-da-2a', questionText: 'Why is vectorization in Pandas significantly faster than iterating with iterrows()?', focus: 'Python Performance' },
          { id: 'mq-da-2b', questionText: 'How do you reduce the memory footprint of a multi-gigabyte CSV in Pandas?', focus: 'Data Engineering' }
        ]
      }
    ]
  },
  AIML: {
    title: 'AI / ML & LLM Application Engineer Path',
    nodes: [
      {
        id: 'node-ml-1',
        title: 'RAG Architecture & Vector Embeddings',
        category: 'LLM Systems',
        orderIndex: 1,
        summary: 'Build scalable Retrieval-Augmented Generation systems with Pinecone/Qdrant.',
        concepts: [
          'Cosine Similarity vs Euclidean Distance vs Dot Product in vector search.',
          'Chunking strategies (Hierarchical, Recursive, Semantic splitters).',
          'Hybrid Search combining BM25 keyword matching with Dense Embeddings.'
        ],
        codeSnippet: `const queryVector = await embeddings.embedQuery(userQuery);
const matches = await index.query({
  vector: queryVector,
  topK: 5,
  includeMetadata: true
});`,
        microQuestions: [
          { id: 'mq-ml-1a', questionText: 'Explain how Hybrid Search combines BM25 keyword search with dense vector embeddings.', focus: 'RAG Architecture' },
          { id: 'mq-ml-1b', questionText: 'What chunking strategy works best for legal or technical documentation RAG pipelines?', focus: 'Embeddings' }
        ]
      }
    ]
  }
};

export const roadmapService = {
  async generateRoadmap(
    userId: string,
    rolePath: string = 'FULLSTACK',
    targetCompanyTier: string = 'FAANG',
    customTechStack?: Record<string, string>
  ) {
    const template = PRE_BUILT_ROADMAPS[rolePath.toUpperCase()] || PRE_BUILT_ROADMAPS.FULLSTACK;

    let initialNodes: RoadmapNode[] = template.nodes.map((n, idx) => ({
      ...n,
      status: idx === 0 ? 'IN_PROGRESS' : 'LOCKED',
      score: idx === 0 ? 40 : 0,
    }));

    // Apply custom tech stack substitutions if provided
    if (customTechStack && Object.keys(customTechStack).length > 0) {
      initialNodes = initialNodes.map((node) => {
        let title = node.title;
        let concepts = [...node.concepts];
        if (customTechStack.frontend && node.category.includes('Frontend')) {
          title = `${customTechStack.frontend} Architecture & State Management`;
          concepts[0] = `Mastering ${customTechStack.frontend} component lifecycle and reactivity.`;
        }
        if (customTechStack.backend && node.category.includes('Backend')) {
          title = `${customTechStack.backend} High-Performance Microservices`;
          concepts[0] = `Optimizing ${customTechStack.backend} asynchronous I/O and runtime concurrency.`;
        }
        if (customTechStack.database && node.category.includes('Database')) {
          title = `${customTechStack.database} High-Throughput Indexing & Queries`;
          concepts[0] = `Query plan optimization and indexing structures in ${customTechStack.database}.`;
        }
        return {
          ...node,
          title,
          concepts,
        };
      });
    }

    const roadmap = await prisma.careerRoadmap.create({
      data: {
        userId,
        rolePath: rolePath.toUpperCase(),
        targetCompanyTier,
        overallReadiness: 25,
        nodesData: initialNodes as any,
        customTechStack: customTechStack as any,
      },
    });

    return roadmap;
  },

  async getUserRoadmaps(userId: string) {
    let roadmaps = await prisma.careerRoadmap.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (roadmaps.length === 0) {
      // Create initial default roadmap
      const defaultMap = await this.generateRoadmap(userId, 'FULLSTACK', 'FAANG');
      roadmaps = [defaultMap];
    }

    return roadmaps;
  },

  async getRoadmapById(id: string, userId: string) {
    const roadmap = await prisma.careerRoadmap.findFirst({
      where: { id, userId },
    });

    if (!roadmap) {
      throw new NotFoundError('Career Roadmap not found.');
    }

    return roadmap;
  },

  async submitNodeAttempt(
    userId: string,
    roadmapId: string,
    nodeId: string,
    codeAnswer?: string,
    verbalAnswer?: string
  ) {
    const roadmap = await this.getRoadmapById(roadmapId, userId);
    const nodes = (roadmap.nodesData as unknown as RoadmapNode[]) || [];

    const nodeIndex = nodes.findIndex((n) => n.id === nodeId);
    if (nodeIndex === -1) {
      throw new BadRequestError('Roadmap node not found');
    }

    // Mark current node as MASTERED
    nodes[nodeIndex].status = 'MASTERED';
    nodes[nodeIndex].score = 95;

    // Unlock next node if present
    if (nodeIndex + 1 < nodes.length) {
      if (nodes[nodeIndex + 1].status === 'LOCKED') {
        nodes[nodeIndex + 1].status = 'IN_PROGRESS';
        nodes[nodeIndex + 1].score = 30;
      }
    }

    const masteredCount = nodes.filter((n) => n.status === 'MASTERED').length;
    const newReadiness = Math.min(100, Math.round((masteredCount / nodes.length) * 100));

    const updated = await prisma.careerRoadmap.update({
      where: { id: roadmapId },
      data: {
        overallReadiness: newReadiness,
        nodesData: nodes as any,
      },
    });

    return {
      roadmap: updated,
      node: nodes[nodeIndex],
      masteredCount,
      totalCount: nodes.length,
      newReadiness,
    };
  },
};
