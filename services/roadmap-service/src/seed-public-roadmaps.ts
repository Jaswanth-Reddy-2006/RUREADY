import { prisma } from './lib/prisma.js';

const curatedRoadmaps = [
  {
    key: 'rennetus-frontend-foundations',
    title: 'Frontend Engineer Foundations to Senior Architect',
    creatorName: 'Sarah Lin',
    creatorRole: 'Staff Frontend Architect',
    creatorCompany: 'Meta',
    isVerifiedCreator: true,
    isEndorsed: true,
    description: 'A production-grade journey from semantic web fundamentals to complex component architecture, performance budgets, and frontend system design.',
    goal: 'Build the foundational engineering skills and project evidence needed for senior frontend roles.',
    category: 'Frontend Engineering',
    difficulty: 'BEGINNER',
    estimatedWeeks: 12,
    followerCount: 2340,
    rating: 4.9,
    reviewCount: 142,
    tags: ['HTML5', 'CSS3', 'TypeScript', 'React', 'Next.js', 'Web Performance'],
    license: 'CC-BY-4.0',
    nodes: [
      {
        title: 'Semantic Web Foundations & Modern CSS Architecture',
        description: 'Master semantic HTML, accessible ARIA patterns, fluid CSS Grid/Flexbox layouts, and Tailwind design systems.',
        type: 'MODULE',
        position: 0,
        metadata: {
          estimatedHours: 16,
          learningObjectives: [
            'Implement fluid responsive layouts without fragile media queries.',
            'Ensure WCAG 2.1 AA keyboard accessibility and screen-reader readiness.',
          ],
          resources: [
            { title: 'MDN Web Docs: CSS Layout', url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout', type: 'DOC', isFree: true },
            { title: 'WebAIM: Accessible ARIA Design Patterns', url: 'https://webaim.org/techniques/aria/', type: 'ARTICLE', isFree: true },
          ],
          practicalTasks: [
            { id: 't1', title: 'Accessible Design System Component', description: 'Build an accessible modal dialog adhering to WAI-ARIA authoring practices.', deliverable: 'A tested component repository.' },
          ],
          assessmentRubric: {
            passingScore: 75,
            competencies: [
              { id: 'c1', name: 'Accessibility & Semantics', description: 'Proper usage of semantic markup and ARIA tags.', weight: 3 },
            ],
            practicalScenario: 'A modal dialog traps focus improperly on mobile browsers. How do you implement focus-trapping and escape-key handling safely?',
          },
        },
      },
      {
        title: 'TypeScript & JavaScript Concurrency In-Depth',
        description: 'Deep dive into event loop microtasks vs macrotasks, closures, asynchronous patterns, and strict type modeling.',
        type: 'MODULE',
        position: 1,
        metadata: {
          estimatedHours: 20,
          learningObjectives: [
            'Model complex business domain types with TypeScript generics and conditional types.',
            'Explain event loop execution order and avoid main thread blocking.',
          ],
          resources: [
            { title: 'TypeScript Official Handbook', url: 'https://www.typescriptlang.org/docs/handbook/intro.html', type: 'DOC', isFree: true },
          ],
          practicalTasks: [
            { id: 't2', title: 'Implement Custom Promise & Async Pool', description: 'Write a concurrency-limited async task pool from scratch.', deliverable: 'TypeScript async pool passing concurrency tests.' },
          ],
          assessmentRubric: {
            passingScore: 80,
            competencies: [
              { id: 'c2', name: 'Async Patterns & Concurrency', description: 'Handling race conditions and promises.', weight: 3 },
            ],
          },
        },
      },
      {
        title: 'Component Architecture with React & Next.js',
        description: 'Architect scalable component trees, Server Components, client state stores (Zustand), and memoization.',
        type: 'MODULE',
        position: 2,
        metadata: {
          estimatedHours: 24,
          learningObjectives: [
            'Separate server rendering (RSC) from interactive client boundaries.',
            'Optimize rendering performance avoiding wasteful re-renders.',
          ],
          resources: [
            { title: 'Next.js Official Documentation', url: 'https://nextjs.org/docs', type: 'DOC', isFree: true },
          ],
          practicalTasks: [
            { id: 't3', title: 'Next.js E-Commerce Catalog with Streaming', description: 'Build a streamed product catalog with suspended loading skeletons.', deliverable: 'A deployed Next.js web application.' },
          ],
          assessmentRubric: {
            passingScore: 80,
            competencies: [
              { id: 'c3', name: 'React Architecture & State', description: 'Separation of server cache from client state.', weight: 3 },
            ],
          },
        },
      },
      {
        title: 'Capstone: Production Enterprise Application',
        description: 'Build and ship an end-to-end web product with authentication, real-time sync, and automated CI/CD.',
        type: 'PROJECT',
        position: 3,
        metadata: {
          estimatedHours: 32,
          learningObjectives: [
            'Ship a multi-page web app with sub-second Largest Contentful Paint (LCP).',
            'Set up automated unit testing and end-to-end integration workflows.',
          ],
          resources: [
            { title: 'web.dev: Core Web Vitals Optimization', url: 'https://web.dev/vitals/', type: 'DOC', isFree: true },
          ],
          practicalTasks: [
            { id: 't4', title: 'Production Capstone Deployment', description: 'Deploy live web app to Vercel with GitHub Actions automated test gate.', deliverable: 'Live web application URL.' },
          ],
          assessmentRubric: {
            passingScore: 85,
            competencies: [
              { id: 'c4', name: 'Full-Stack Integration & Performance', description: 'Achieving 95+ Lighthouse performance scores.', weight: 4 },
            ],
          },
        },
      },
    ],
  },
  {
    key: 'rennetus-backend-cloud',
    title: 'Backend Engineering & High-Scale Systems',
    creatorName: 'Alex Mercer',
    creatorRole: 'Principal Systems Architect',
    creatorCompany: 'Amazon Web Services',
    isVerifiedCreator: true,
    isEndorsed: true,
    description: 'A masterclass roadmap covering HTTP & networking foundations, relational database index tuning, distributed caching, and event streaming.',
    goal: 'Design and deploy high-throughput, fault-tolerant backend services from the ground up.',
    category: 'Backend Engineering',
    difficulty: 'ADVANCED',
    estimatedWeeks: 16,
    followerCount: 3890,
    rating: 5.0,
    reviewCount: 215,
    tags: ['Node.js', 'PostgreSQL', 'Redis', 'Apache Kafka', 'Distributed Systems'],
    license: 'CC-BY-4.0',
    nodes: [
      {
        title: 'Networking Protocols, Sockets & HTTP/2 Architecture',
        description: 'Master TCP three-way handshakes, TLS termination, HTTP/2 multiplexing, and REST contract modeling.',
        type: 'MODULE',
        position: 0,
        metadata: {
          estimatedHours: 18,
          learningObjectives: [
            'Understand socket states (TIME_WAIT, ESTABLISHED) and connection pool sizing.',
            'Design idempotent REST endpoints with semantic error contracts.',
          ],
          resources: [
            { title: 'High Performance Browser Networking', url: 'https://hpbn.co/', type: 'DOC', isFree: true },
          ],
          practicalTasks: [
            { id: 't_b1', title: 'Build a Benchmark-Ready HTTP Service', description: 'Implement a raw TCP HTTP parser and benchmark with autocannon.', deliverable: 'A benchmark report showing 25k+ req/sec.' },
          ],
          assessmentRubric: {
            passingScore: 75,
            competencies: [
              { id: 'c_net', name: 'Connection Management & HTTP Semantics', description: 'Idempotency and connection pool optimization.', weight: 3 },
            ],
          },
        },
      },
      {
        title: 'Relational Schema Optimization & PostgreSQL Indexing',
        description: 'Design normalized schemas, tune B-tree and GIN indexes, diagnose EXPLAIN ANALYZE plans, and handle transactions.',
        type: 'MODULE',
        position: 1,
        metadata: {
          estimatedHours: 24,
          learningObjectives: [
            'Diagnose Seq Scan vs Index Scan using EXPLAIN ANALYZE.',
            'Prevent deadlock anomalies and select optimal isolation levels.',
          ],
          resources: [
            { title: 'Use The Index, Luke!', url: 'https://use-the-index-luke.com/', type: 'ARTICLE', isFree: true },
          ],
          practicalTasks: [
            { id: 't_b2', title: 'Optimize Million-Row Dataset', description: 'Seed 1M rows and write composite indexes to reduce query latency from 750ms to 8ms.', deliverable: 'Documented before/after EXPLAIN comparison.' },
          ],
          assessmentRubric: {
            passingScore: 80,
            competencies: [
              { id: 'c_db', name: 'Query Diagnostics & Indexing', description: 'Accurate reading of PostgreSQL execution plans.', weight: 4 },
            ],
          },
        },
      },
      {
        title: 'In-Memory Distributed Caching with Redis',
        description: 'Implement Cache-Aside, Write-Through, LRU eviction, and distributed rate limiting with Redis Lua scripts.',
        type: 'MODULE',
        position: 2,
        metadata: {
          estimatedHours: 18,
          learningObjectives: [
            'Prevent Cache Avalanche, Cache Stampede, and Cache Penetration.',
            'Implement atomic sliding-window rate limiters with Lua scripts.',
          ],
          resources: [
            { title: 'Redis University Courses', url: 'https://university.redis.com/', type: 'DOC', isFree: true },
          ],
          practicalTasks: [
            { id: 't_b3', title: 'Build Distributed Sliding Window Rate Limiter', description: 'Write an atomic Redis Lua script for API gateway rate limiting.', deliverable: 'Rate limiter middleware tested under concurrency.' },
          ],
          assessmentRubric: {
            passingScore: 80,
            competencies: [
              { id: 'c_cache', name: 'Cache Invalidation & Consistency', description: 'Mitigating stampede and race conditions.', weight: 3 },
            ],
          },
        },
      },
      {
        title: 'Event-Driven Messaging & Stream Processing with Kafka',
        description: 'Architect decoupled asynchronous microservices using Apache Kafka commit logs, partitions, and dead-letter queues.',
        type: 'MODULE',
        position: 3,
        metadata: {
          estimatedHours: 24,
          learningObjectives: [
            'Design partition keys to guarantee ordering while horizontally scaling consumers.',
            'Implement idempotent consumer handling and transaction outbox pattern.',
          ],
          resources: [
            { title: 'Confluent Kafka Core Architecture', url: 'https://docs.confluent.io/kafka/introduction.html', type: 'DOC', isFree: true },
          ],
          practicalTasks: [
            { id: 't_b4', title: 'Build Outbox Event Pipeline', description: 'Implement Transactional Outbox pattern with Debezium/Kafka to eliminate dual-write hazards.', deliverable: 'A running Docker Compose event stream stack.' },
          ],
          assessmentRubric: {
            passingScore: 85,
            competencies: [
              { id: 'c_kafka', name: 'Stream Partitioning & Idempotence', description: 'Zero message loss across consumer restarts.', weight: 4 },
            ],
          },
        },
      },
    ],
  },
  {
    key: 'rennetus-ai-engineering',
    title: 'Full-Stack AI & LLM Systems Engineering',
    creatorName: 'Dr. Elena Rostova',
    creatorRole: 'Staff AI Research Engineer',
    creatorCompany: 'Anthropic',
    isVerifiedCreator: true,
    isEndorsed: true,
    description: 'Build enterprise AI applications utilizing LLMs, hybrid RAG architectures, vector databases, and multi-agent coordination.',
    goal: 'Ship production-ready generative AI and intelligent agent applications with strict eval benchmarks.',
    category: 'Artificial Intelligence',
    difficulty: 'INTERMEDIATE',
    estimatedWeeks: 12,
    followerCount: 4120,
    rating: 4.9,
    reviewCount: 310,
    tags: ['Python', 'LLMs', 'RAG', 'Vector Databases', 'LangChain', 'Multi-Agent'],
    license: 'CC-BY-4.0',
    nodes: [
      {
        title: 'Modern Python Async & Tokenization Foundations',
        description: 'Master asynchronous Python (asyncio), BPE tokenization, embeddings geometry, and cosine similarity indexing.',
        type: 'MODULE',
        position: 0,
        metadata: {
          estimatedHours: 16,
          learningObjectives: ['Understand token limits, context windows, and vector distance metrics.'],
          resources: [{ title: 'Hugging Face NLP Course', url: 'https://huggingface.co/learn/nlp-course', type: 'DOC', isFree: true }],
          practicalTasks: [{ id: 't_ai1', title: 'Build In-Memory Cosine Vector Index', description: 'Implement vector similarity search in NumPy.', deliverable: 'Benchmarked NumPy vector retrieval.' }],
          assessmentRubric: { passingScore: 75, competencies: [{ id: 'c_vec', name: 'Vector Similarity Math', description: 'Cosine vs Dot product indexing.', weight: 3 }] },
        },
      },
      {
        title: 'Production RAG Architectures & Chunking Strategies',
        description: 'Design semantic chunking, reciprocal rank fusion (RRF), hybrid lexical + dense retrieval, and reranking.',
        type: 'MODULE',
        position: 1,
        metadata: {
          estimatedHours: 22,
          learningObjectives: ['Implement hybrid BM25 + dense embedding retrieval with Cross-Encoder reranking.'],
          resources: [{ title: 'Pinecone Learning Center: RAG Deep Dive', url: 'https://www.pinecone.io/learn/series/rag/', type: 'DOC', isFree: true }],
          practicalTasks: [{ id: 't_ai2', title: 'Hybrid Search Document QA System', description: 'Build a production document QA pipeline with Cohere reranking.', deliverable: 'Tested RAG pipeline.' }],
          assessmentRubric: { passingScore: 80, competencies: [{ id: 'c_rag', name: 'Retrieval Quality & Hallucination Mitigation', description: 'Evaluating precision and recall.', weight: 4 }] },
        },
      },
      {
        title: 'Autonomous Multi-Agent Systems & Tool Calling',
        description: 'Architect ReAct loop agents, tool execution boundaries, human-in-the-loop approvals, and structured JSON outputs.',
        type: 'MODULE',
        position: 2,
        metadata: {
          estimatedHours: 26,
          learningObjectives: ['Coordinate multi-agent swarms with state machines and cycle prevention.'],
          resources: [{ title: 'LangGraph Documentation', url: 'https://langchain-ai.github.io/langgraph/', type: 'DOC', isFree: true }],
          practicalTasks: [{ id: 't_ai3', title: 'Build Autonomous Research Agent', description: 'Deploy an agent that searches web, synthesizes facts, and generates cited reports.', deliverable: 'A running agent pipeline.' }],
          assessmentRubric: { passingScore: 85, competencies: [{ id: 'c_agent', name: 'Agent Orchestration & Guardrails', description: 'Preventing runaway loops and validating tool outputs.', weight: 4 }] },
        },
      },
    ],
  },
];

export async function seedPublicRoadmaps() {
  try {
    for (const item of curatedRoadmaps) {
      const existing = await prisma.roadmap.findFirst({ where: { ownerId: item.key } });

      if (existing) {
        // Update to make sure rich creator and verified fields are synced
        await prisma.roadmap.update({
          where: { id: existing.id },
          data: {
            creatorRole: item.creatorRole,
            creatorCompany: item.creatorCompany,
            isVerifiedCreator: item.isVerifiedCreator,
            isEndorsed: item.isEndorsed,
            followerCount: item.followerCount,
            rating: item.rating,
            reviewCount: item.reviewCount,
            license: item.license,
            isPublished: true,
            status: 'PUBLISHED',
          },
        });
        continue;
      }

      const created = await prisma.roadmap.create({
        data: {
          ownerId: item.key,
          creatorName: item.creatorName,
          creatorRole: item.creatorRole,
          creatorCompany: item.creatorCompany,
          isVerifiedCreator: item.isVerifiedCreator,
          isEndorsed: item.isEndorsed,
          title: item.title,
          description: item.description,
          goal: item.goal,
          category: item.category,
          difficulty: item.difficulty,
          estimatedWeeks: item.estimatedWeeks,
          tags: item.tags,
          followerCount: item.followerCount,
          rating: item.rating,
          reviewCount: item.reviewCount,
          status: 'PUBLISHED',
          isPublished: true,
          publishedAt: new Date(),
          license: item.license,
        },
      });

      for (const node of item.nodes) {
        await prisma.roadmapNode.create({
          data: {
            roadmapId: created.id,
            title: node.title,
            description: node.description,
            type: node.type,
            position: node.position,
            metadata: node.metadata as any,
          },
        });
      }
    }
    console.log('[Roadmap Service] Curated community roadmaps seeded successfully with rich verification metadata.');
  } catch (error) {
    console.warn('[Roadmap Service] Warning: Unable to seed curated community roadmaps:', error);
  }
}
