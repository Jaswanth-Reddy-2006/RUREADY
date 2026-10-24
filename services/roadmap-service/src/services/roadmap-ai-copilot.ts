// ═══════════════════════════════════════════════════════════════
// RU Ready? — Roadmap AI Curriculum Designer & Copilot 2.0
// Progressive Clarification, Targeted Graph Edits, Cycle Detection & Canonical Schema
// ═══════════════════════════════════════════════════════════════

import { RoadmapResource, RoadmapPracticalTask, AssessmentRubric } from './roadmap.service.js';

export type RoadmapNodeType =
  | 'SECTION'
  | 'MODULE'
  | 'LESSON'
  | 'EXERCISE'
  | 'PROJECT'
  | 'ASSESSMENT'
  | 'RESOURCE';

export interface CanonicalRoadmapNodeDraft {
  id?: string;
  title: string;
  description: string;
  type: RoadmapNodeType;
  position: number;
  estimatedHours?: number;
  learningObjectives?: string[];
  resources: RoadmapResource[];
  practicalTasks: RoadmapPracticalTask[];
  prerequisiteNodeIds?: string[];
  assessmentRubric: AssessmentRubric;
  // Human-centered rationale fields
  whyLearnThis?: string;
  whatYouWillLearn?: string[];
  whatToBuild?: string;
  howToVerify?: string;
  unlockedSkills?: string[];
  children?: Array<{
    title: string;
    description: string;
    type: string;
    position: number;
  }>;
}

export interface CanonicalRoadmapDraft {
  title: string;
  description: string;
  goal: string;
  category: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  estimatedWeeks: number;
  tags: string[];
  license: string;
  nodes: CanonicalRoadmapNodeDraft[];
}

export interface GoalClarificationQuestion {
  id: string;
  question: string;
  reason: string;
  options: string[];
  selectedOption?: string;
}

export interface GoalClarificationResult {
  isReady: boolean;
  refinedGoal: string;
  questions: GoalClarificationQuestion[];
  detectedCategory: string;
  recommendedDifficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  recommendedWeeks: number;
}

export interface TargetedPatchResult {
  updatedRoadmap: any;
  summary: string;
  affectedNodeIds: string[];
  mutatedNodeTitles: string[];
  diff: {
    added: string[];
    updated: string[];
    removed: string[];
    reordered: boolean;
  };
  cycleDetected?: boolean;
  cycleNodes?: string[];
}

export class RoadmapAICopilot {
  /**
   * Cycle Detection for Prerequisite Directed Graph
   */
  static detectCycles(nodes: Array<{ id?: string; title?: string; metadata?: any }>): {
    hasCycle: boolean;
    cycleNodes: string[];
    cycleNodeIds: string[];
    cycleNodeTitles: string[];
  } {
    const adjList = new Map<string, string[]>();
    const titleMap = new Map<string, string>();

    // Build graph from prerequisiteNodeIds
    for (const node of nodes) {
      const id = node.id || node.title || '';
      titleMap.set(id, node.title || id);
      const prereqs = node.metadata?.prerequisiteNodeIds || [];
      adjList.set(id, prereqs);
    }

    const visited = new Set<string>();
    const recStack = new Set<string>();
    const cycleNodeIds: string[] = [];
    const cycleNodeTitles: string[] = [];

    const dfs = (curr: string): boolean => {
      visited.add(curr);
      recStack.add(curr);

      const neighbors = adjList.get(curr) || [];
      for (const n of neighbors) {
        if (!visited.has(n)) {
          if (dfs(n)) {
            cycleNodeIds.push(n);
            cycleNodeTitles.push(titleMap.get(n) || n);
            return true;
          }
        } else if (recStack.has(n)) {
          cycleNodeIds.push(n);
          cycleNodeTitles.push(titleMap.get(n) || n);
          return true;
        }
      }

      recStack.delete(curr);
      return false;
    };

    for (const id of adjList.keys()) {
      if (!visited.has(id)) {
        if (dfs(id)) {
          cycleNodeIds.push(id);
          cycleNodeTitles.push(titleMap.get(id) || id);
          const uniqueIds = Array.from(new Set(cycleNodeIds));
          const uniqueTitles = Array.from(new Set(cycleNodeTitles));
          return {
            hasCycle: true,
            cycleNodes: uniqueIds,
            cycleNodeIds: uniqueIds,
            cycleNodeTitles: uniqueTitles,
          };
        }
      }
    }

    return { hasCycle: false, cycleNodes: [], cycleNodeIds: [], cycleNodeTitles: [] };
  }

  /**
   * Step B — Clarify the Goal
   * Analyzes the learner's natural goal and asks 1-3 targeted follow-up questions
   */
  static clarifyGoal(
    paramsOrGoal: string | {
      goal: string;
      experience?: string;
      targetOutcome?: string;
      weeklyHours?: number | string;
      timelineWeeks?: number;
      preferredStyle?: string;
      previousAnswers?: Record<string, string>;
    },
    maybeAnswers?: Record<string, string>
  ): GoalClarificationResult {
    let params: {
      goal: string;
      experience?: string;
      targetOutcome?: string;
      weeklyHours?: number | string;
      timelineWeeks?: number;
      preferredStyle?: string;
      previousAnswers?: Record<string, string>;
    };

    if (typeof paramsOrGoal === 'string') {
      params = {
        goal: paramsOrGoal,
        previousAnswers: maybeAnswers,
        experience: maybeAnswers?.experience,
        targetOutcome: maybeAnswers?.primary_outcome || maybeAnswers?.targetOutcome,
        weeklyHours: maybeAnswers?.weekly_hours || maybeAnswers?.weeklyHours,
      };
    } else {
      params = paramsOrGoal;
    }

    const { goal = '', experience, targetOutcome, weeklyHours, previousAnswers = {} } = params;
    const lower = (goal || '').toLowerCase();

    // Determine category
    let category = 'Backend Systems';
    if (lower.includes('front') || lower.includes('react') || lower.includes('vue') || lower.includes('css') || lower.includes('web')) {
      category = 'Frontend Engineering';
    } else if (lower.includes('ai') || lower.includes('machine learning') || lower.includes('llm') || lower.includes('rag') || lower.includes('gpt')) {
      category = 'Artificial Intelligence';
    } else if (lower.includes('dsa') || lower.includes('algorithm') || lower.includes('leetcode') || lower.includes('interview')) {
      category = 'Algorithms & DSA';
    } else if (lower.includes('devops') || lower.includes('cloud') || lower.includes('docker') || lower.includes('kubernetes')) {
      category = 'DevOps & Cloud';
    } else if (lower.includes('system design') || (lower.includes('design') && lower.includes('interview'))) {
      category = 'System Design';
    } else if (lower.includes('backend') || lower.includes('distributed') || lower.includes('microservice') || lower.includes('database')) {
      category = 'Backend Systems';
    }

    const questions: GoalClarificationQuestion[] = [];

    // Question 1: Experience Level
    const currentExp = previousAnswers['experience'] || experience;
    if (!currentExp && !lower.includes('beginner') && !lower.includes('senior') && !lower.includes('scratch') && !lower.includes('experienced')) {
      questions.push({
        id: 'experience',
        question: 'What is your current background with this domain?',
        reason: 'Allows us to skip basics if you already know them, or start from fundamentals.',
        options: [
          'Complete Beginner (starting from square one)',
          'Intermediate (comfortable with basic programming & syntax)',
          'Experienced Engineer (aiming for Senior/Staff depth)',
        ],
      });
    }

    // Question 2: Primary Outcome / Milestone
    const currentOutcome = previousAnswers['primary_outcome'] || previousAnswers['targetOutcome'] || targetOutcome;
    if (!currentOutcome && !lower.includes('interview') && !lower.includes('job') && !lower.includes('project')) {
      questions.push({
        id: 'targetOutcome',
        question: 'What is your primary target milestone?',
        reason: 'Shapes whether the curriculum emphasizes interview algorithms, production code, or architecture.',
        options: [
          'Full-Time Job Readiness (End-to-End Practical Skills)',
          'Interview Preparation (FAANG / Product Coding & System Design)',
          'Building Production-Grade Capstones & Personal Portfolio',
        ],
      });
    }

    // Question 3: Available Study Time
    const currentHours = previousAnswers['weekly_hours'] || previousAnswers['weeklyHours'] || (weeklyHours ? String(weeklyHours) : undefined);
    if (!currentHours) {
      questions.push({
        id: 'weekly_hours',
        question: 'How many hours can you realistically dedicate each week?',
        reason: 'Helps us budget estimated module effort and calendar duration.',
        options: [
          '4 to 6 hours / week (Consistent & Sustainable)',
          '8 to 12 hours / week (Accelerated)',
          '15+ hours / week (Intensive Bootcamp)',
        ],
      });
    }

    // Determine difficulty & weeks
    let difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' = 'INTERMEDIATE';
    if ((currentExp || '').includes('Beginner') || lower.includes('beginner') || lower.includes('scratch')) {
      difficulty = 'BEGINNER';
    } else if ((currentExp || '').includes('Experienced') || lower.includes('senior') || lower.includes('staff')) {
      difficulty = 'ADVANCED';
    }

    let recommendedWeeks = 12;
    if (params.timelineWeeks) {
      recommendedWeeks = params.timelineWeeks;
    } else if ((currentHours || '').includes('4 to 6')) {
      recommendedWeeks = 16;
    } else if ((currentHours || '').includes('15+')) {
      recommendedWeeks = 8;
    }

    // If all essential questions have answers or user provided sufficient context, mark ready
    const isReady = questions.length === 0 || Object.keys(previousAnswers).length >= 2;

    return {
      isReady,
      refinedGoal: goal,
      questions,
      detectedCategory: category,
      recommendedDifficulty: difficulty,
      recommendedWeeks,
    };
  }

  /**
   * Step C — Generate Structured Canonical Draft
   */
  static generateFromGoal(
    paramsOrGoal: string | {
      goal: string;
      role?: string;
      level?: string;
      weeks?: number;
      title?: string;
      clarificationAnswers?: Record<string, string>;
    },
    maybeAnswers?: Record<string, string>
  ): CanonicalRoadmapDraft {
    let params: {
      goal: string;
      role?: string;
      level?: string;
      weeks?: number;
      title?: string;
      clarificationAnswers?: Record<string, string>;
    };

    if (typeof paramsOrGoal === 'string') {
      params = {
        goal: paramsOrGoal,
        clarificationAnswers: maybeAnswers,
      };
    } else {
      params = paramsOrGoal;
    }

    const ensureCanonicalObjectives = (draft: CanonicalRoadmapDraft): CanonicalRoadmapDraft => ({
      ...draft,
      nodes: draft.nodes.map((node) => ({
        ...node,
        learningObjectives:
          node.learningObjectives && node.learningObjectives.length >= 2
            ? node.learningObjectives
            : node.whatYouWillLearn && node.whatYouWillLearn.length >= 2
            ? node.whatYouWillLearn
            : [
                'Master theoretical concepts and foundational design choices',
                'Analyze performance trade-offs under high-throughput conditions',
              ],
      })),
    });

    const goalLower = (params.goal || '').toLowerCase();
    const roleLower = (params.role || '').toLowerCase();
    const combined = `${goalLower} ${roleLower}`;

    const difficulty = (params.level?.toUpperCase() || 'INTERMEDIATE') as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    const weeks = params.weeks || (difficulty === 'BEGINNER' ? 14 : difficulty === 'ADVANCED' ? 16 : 12);

    // 1. Frontend Engineering
    if (combined.includes('front') || combined.includes('react') || combined.includes('next') || combined.includes('ui')) {
      return ensureCanonicalObjectives({
        title: params.title || (params.role ? `${params.role} Career Roadmap` : 'Modern Frontend & Web Architecture'),
        description: `A production-grade ${weeks}-week roadmap covering JavaScript/TypeScript runtimes, React reconciliation, state management, web performance, and client-side architecture.`,
        goal: params.goal,
        category: 'Frontend Engineering',
        difficulty,
        estimatedWeeks: weeks,
        tags: ['TypeScript', 'React', 'Next.js', 'Web Performance', 'State Architecture', 'Testing'],
        license: 'CC-BY-4.0',
        nodes: [
          {
            title: '1. JavaScript Engine Internals & Modern TypeScript',
            description: 'Master V8 event loop mechanics, microtasks, execution contexts, prototype chains, and advanced TypeScript type algebra.',
            type: 'MODULE',
            position: 0,
            estimatedHours: 18,
            whyLearnThis: 'Every frontend framework is built on JavaScript runtime semantics. Mastering the event loop and type system eliminates elusive race conditions.',
            whatYouWillLearn: [
              'V8 microtask queue vs macrotask execution ordering',
              'Memory management, garbage collection cycles, and memory leak profiling',
              'Conditional types, template literals, and mapped types in TypeScript',
            ],
            whatToBuild: 'Write an asynchronous task pool with concurrency limits and retry exponential backoff from scratch in TypeScript.',
            howToVerify: 'Pass an AI assessment evaluating async microtask ordering and TypeScript generic type inference.',
            unlockedSkills: ['Predictable asynchronous execution', 'Zero-runtime type safety'],
            resources: [
              { title: 'TypeScript Official Handbook', url: 'https://www.typescriptlang.org/docs/handbook/intro.html', type: 'DOC', isFree: true },
              { title: 'JavaScript.info: Event Loop', url: 'https://javascript.info/event-loop', type: 'ARTICLE', isFree: true },
            ],
            practicalTasks: [
              {
                id: 'task_fe_1',
                title: 'Build an Async Concurrency Worker Pool',
                description: 'Implement a promise queue executing at most N concurrent tasks with cancellation support.',
                deliverable: 'A tested TypeScript library with 100% test coverage.',
              },
            ],
            assessmentRubric: {
              passingScore: 75,
              competencies: [
                { id: 'c1', name: 'Event Loop & Promises', description: 'Accurate explanation of microtask queue draining vs frame rendering.', weight: 4 },
                { id: 'c2', name: 'Advanced TypeScript', description: 'Usage of infer, extends, and conditional types.', weight: 3 },
              ],
            },
          },
          {
            title: '2. React Fiber Architecture, Reconciliation & Hooks',
            description: 'Deep dive into double-buffering Fiber trees, lanes-based concurrent scheduling, synthetic events, and custom hook primitives.',
            type: 'MODULE',
            position: 1,
            estimatedHours: 24,
            whyLearnThis: 'Understanding React internal rendering cycles prevents unnecessary re-renders, jank, and stale closure bugs.',
            whatYouWillLearn: [
              'Fiber node structures (child, sibling, return) and double-buffering',
              'Concurrent Mode transitions with useTransition and useDeferredValue',
              'Rules of Hooks, closure traps, and custom hook composition',
            ],
            whatToBuild: 'Build a high-performance virtualized data table rendering 100,000 rows at 60 FPS.',
            howToVerify: 'Complete an interactive technical interview on Fiber tree traversal and state batching.',
            unlockedSkills: ['60fps rendering optimization', 'Custom reusable hooks architecture'],
            prerequisiteNodeIds: [],
            resources: [
              { title: 'React Official Documentation (react.dev)', url: 'https://react.dev/', type: 'DOC', isFree: true },
              { title: 'A Deep Dive into React Fiber Internals', url: 'https://github.com/acdlite/react-fiber-architecture', type: 'REPO', isFree: true },
            ],
            practicalTasks: [
              {
                id: 'task_fe_2',
                title: 'High-Scale Virtualized Windowing Component',
                description: 'Render huge lists by calculating dynamic viewport offsets and recycling DOM nodes.',
                deliverable: 'A smooth scrolling table component benchmarked in Chrome DevTools.',
              },
            ],
            assessmentRubric: {
              passingScore: 80,
              competencies: [
                { id: 'c3', name: 'Fiber Reconciler Mechanics', description: 'Explaining diffing algorithm and key usage.', weight: 4 },
                { id: 'c4', name: 'Concurrent React', description: 'Prioritizing urgent input updates over background transitions.', weight: 3 },
              ],
            },
          },
          {
            title: '3. Full-Stack React with Next.js App Router & Server Components',
            description: 'Architect modern full-stack web applications using React Server Components (RSC), streaming SSR, Server Actions, and edge middleware.',
            type: 'PROJECT',
            position: 2,
            estimatedHours: 28,
            whyLearnThis: 'Next.js App Router is the industry standard for production web apps, reducing client bundle size by executing on the server.',
            whatYouWillLearn: [
              'Server Components vs Client Components boundary design',
              'Streaming HTML with Suspense and loading skeletons',
              'Server Actions with Zod mutation validation and optimistic UI',
            ],
            whatToBuild: 'Build a production SaaS application with user authentication, database integration, and edge caching.',
            howToVerify: 'AI evaluation of server/client boundary architecture and caching strategy.',
            unlockedSkills: ['Modern full-stack web development', 'Zero-bundle server components'],
            resources: [
              { title: 'Next.js App Router Documentation', url: 'https://nextjs.org/docs', type: 'DOC', isFree: true },
            ],
            practicalTasks: [
              {
                id: 'task_fe_3',
                title: 'Deploy a Production Next.js SaaS with Edge Middleware',
                description: 'Implement multi-tenant routing, database caching, and streaming SSR.',
                deliverable: 'A live production deployment scored 95+ on Google Lighthouse.',
              },
            ],
            assessmentRubric: {
              passingScore: 80,
              competencies: [
                { id: 'c5', name: 'RSC Architecture', description: 'Proper placement of "use client" and data fetching boundaries.', weight: 4 },
              ],
            },
          },
        ],
      });
    }

    // 2. Default: Backend Systems & Distributed Architecture
    return ensureCanonicalObjectives({
      title: params.title || (params.role ? `${params.role} Production Curriculum` : 'Backend & Distributed Systems Architect'),
      description: `A battle-tested ${weeks}-week roadmap covering networking foundations, relational schema optimization, distributed caching, event streaming, and architectural resilience.`,
      goal: params.goal,
      category: 'Backend Engineering',
      difficulty,
      estimatedWeeks: weeks,
      tags: ['Networking', 'PostgreSQL', 'Redis', 'Kafka', 'Docker', 'Distributed Systems'],
      license: 'CC-BY-4.0',
      nodes: [
        {
          title: '1. Networking Foundations & HTTP Architecture',
          description: 'Master TCP/IP handshakes, TLS 1.3 encryption, HTTP/2 multiplexing, DNS resolution, and RESTful resource contracts.',
          type: 'MODULE',
          position: 0,
          estimatedHours: 18,
          whyLearnThis: 'Every distributed system communicates over the network. Understanding sockets and HTTP semantics prevents cascading latency and connection drops.',
          whatYouWillLearn: [
            'TCP three-way handshake, flow control, and slow-start mechanics',
            'Idempotency and status code contracts in RESTful APIs',
            'Secure authentication using JWT, HTTP-only cookies, and OAuth 2.0',
          ],
          whatToBuild: 'Build a raw TCP & HTTP/1.1 parser from scratch and benchmark throughput under high concurrency.',
          howToVerify: 'Pass an AI technical interview diagnosing TCP socket exhaustion and keep-alive configuration.',
          unlockedSkills: ['Production API contract design', 'Network latency diagnostics'],
          resources: [
            { title: 'MDN Web Docs: HTTP Overview', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP', type: 'DOC', isFree: true },
            { title: 'High Performance Browser Networking', url: 'https://hpbn.co/', type: 'DOC', isFree: true },
          ],
          practicalTasks: [
            {
              id: 'task_net_1',
              title: 'Build a Raw TCP/HTTP Server',
              description: 'Implement an HTTP parser handling GET, POST, headers, and query parameters using socket primitives.',
              deliverable: 'A running HTTP server benchmarked with autocannon.',
            },
          ],
          assessmentRubric: {
            passingScore: 75,
            competencies: [
              { id: 'c1', name: 'HTTP Semantics & Headers', description: 'Accurate usage of status codes and idempotency.', weight: 3 },
              { id: 'c2', name: 'TCP & Connection Management', description: 'Explaining keep-alive and connection pools.', weight: 2 },
            ],
          },
        },
        {
          title: '2. Relational Database Modeling & PostgreSQL Indexing',
          description: 'Design normalized relational schemas, configure B-tree indexes, analyze EXPLAIN query plans, and manage transactions with ACID isolation.',
          type: 'MODULE',
          position: 1,
          estimatedHours: 24,
          whyLearnThis: 'Databases are the single most common bottleneck in web backends. Proper indexing and transaction modeling prevents data corruption and outages.',
          whatYouWillLearn: [
            'Third normal form (3NF) schemas and denormalization trade-offs',
            'B-tree indexing, composite indexes, and index selectivity',
            'Diagnosing slow queries using EXPLAIN (ANALYZE, BUFFERS)',
            'Transaction isolation levels (Read Committed, Repeatable Read, Serializable)',
          ],
          whatToBuild: 'Seed 1,000,000 order records into PostgreSQL and write composite indexes to bring p99 query latency from 800ms down to sub-10ms.',
          howToVerify: 'Explain query plans and deadlock mitigation strategies in an AI Socratic assessment.',
          unlockedSkills: ['Sub-10ms database query optimization', 'Zero-anomaly transaction isolation'],
          resources: [
            { title: 'PostgreSQL Official Documentation: Indexing', url: 'https://www.postgresql.org/docs/current/indexes.html', type: 'DOC', isFree: true },
            { title: 'Use The Index, Luke! (Markus Winand)', url: 'https://use-the-index-luke.com/', type: 'ARTICLE', isFree: true },
          ],
          practicalTasks: [
            {
              id: 'task_db_1',
              title: 'High-Volume Schema Optimization Benchmark',
              description: 'Optimize high-throughput queries with index coverage.',
              deliverable: 'A documented before/after EXPLAIN query plan comparison report.',
            },
          ],
          assessmentRubric: {
            passingScore: 80,
            competencies: [
              { id: 'c3', name: 'Query Plan Interpretation', description: 'Correctly identifying Seq Scan vs Index Scan.', weight: 4 },
              { id: 'c4', name: 'ACID & Isolation Anomalies', description: 'Explaining dirty reads and deadlock prevention.', weight: 3 },
            ],
          },
        },
        {
          title: '3. High-Throughput In-Memory Caching with Redis',
          description: 'Implement distributed caching patterns (Cache-Aside, Write-Through), eviction policies, and sliding window rate limiters.',
          type: 'MODULE',
          position: 2,
          estimatedHours: 16,
          whyLearnThis: 'Memory is 1000x faster than disk. Caching protects databases from traffic spikes and delivers sub-millisecond API response times.',
          whatYouWillLearn: [
            'Cache-Aside vs Write-Through patterns and cache invalidation strategies',
            'Preventing Cache Avalanche, Cache Stampede, and Cache Penetration',
            'Implementing Redis Sorted Sets for Sliding Window Rate Limiters',
          ],
          whatToBuild: 'Implement a distributed sliding-window rate limiter in Redis using Lua scripts for atomic execution.',
          howToVerify: 'Pass an AI assessment evaluating cache stampede mitigations and consistency guarantees.',
          unlockedSkills: ['Sub-millisecond API caching', 'Atomic distributed rate limiting'],
          resources: [
            { title: 'Redis University: Redis Data Structures', url: 'https://university.redis.com/', type: 'DOC', isFree: true },
          ],
          practicalTasks: [
            {
              id: 'task_cache_1',
              title: 'Distributed Sliding Window Rate Limiter',
              description: 'Implement distributed rate limiting middleware in Redis using Lua scripts.',
              deliverable: 'A rate-limiting service passing automated concurrency tests.',
            },
          ],
          assessmentRubric: {
            passingScore: 75,
            competencies: [
              { id: 'c5', name: 'Cache Invalidation & Consistency', description: 'Mitigating stale reads and race conditions.', weight: 3 },
            ],
          },
        },
        {
          title: '4. Event-Driven Messaging with Apache Kafka',
          description: 'Architect decoupled asynchronous microservices using Apache Kafka commit logs, consumer groups, partition keys, and dead-letter queues.',
          type: 'MODULE',
          position: 3,
          estimatedHours: 22,
          whyLearnThis: 'Synchronous REST calls fail under scale. Event streams allow independent services to process millions of transactions without coupling.',
          whatYouWillLearn: [
            'Kafka distributed log architecture: Topics, partitions, offsets, and consumer groups',
            'Partition key hashing to preserve strict ordering per entity',
            'Idempotent consumers and exactly-once processing semantics',
          ],
          whatToBuild: 'Build a distributed order processing pipeline with Kafka and a dead-letter queue for failed messages.',
          howToVerify: 'AI evaluation of message partition ordering and consumer rebalance failure scenarios.',
          unlockedSkills: ['Decoupled event architectures', 'Resilient asynchronous message pipelines'],
          resources: [
            { title: 'Confluent Kafka Fundamentals', url: 'https://developer.confluent.io/learn/kafka-foundations/', type: 'DOC', isFree: true },
          ],
          practicalTasks: [
            {
              id: 'task_kafka_1',
              title: 'Build a Distributed Event Processing Pipeline',
              description: 'Implement an order ingestion producer and multi-consumer group worker pool.',
              deliverable: 'A running microservices cluster handling simulated worker crashes.',
            },
          ],
          assessmentRubric: {
            passingScore: 80,
            competencies: [
              { id: 'c6', name: 'Partitioning & Consumer Groups', description: 'Designing partition keys to prevent hot-spotting.', weight: 4 },
            ],
          },
        },
        {
          title: '5. Capstone Project: High-Scale Distributed E-Commerce Backend',
          description: 'Combine networking, PostgreSQL indexing, Redis caching, and Kafka event streaming into a resilient, production-ready system.',
          type: 'PROJECT',
          position: 4,
          estimatedHours: 35,
          whyLearnThis: 'Engineering recruiters look for proof of execution. This capstone demonstrates you can architect and debug real-world distributed systems.',
          whatYouWillLearn: [
            'End-to-end integration of relational storage, caching, and streaming',
            'Graceful degradation, circuit breakers, and rate limiting under peak traffic',
            'Prometheus & Grafana metric instrumentation for p95/p99 observability',
          ],
          whatToBuild: 'Deploy an end-to-end distributed system capable of handling 10,000 requests/sec with Docker Compose.',
          howToVerify: 'Comprehensive AI architectural defense interview evaluating trade-offs and disaster recovery.',
          unlockedSkills: ['Full distributed system architecture', 'Production-grade observability and resiliency'],
          resources: [
            { title: 'Designing Data-Intensive Applications (Martin Kleppmann)', url: 'https://dataintensive.net/', type: 'ARTICLE', isFree: false },
          ],
          practicalTasks: [
            {
              id: 'task_capstone_1',
              title: 'Production Capstone Deployment & Chaos Testing',
              description: 'Deploy the full stack and execute chaos tests by killing Kafka brokers and Redis replicas.',
              deliverable: 'A GitHub repository with automated integration tests and architectural documentation.',
            },
          ],
          assessmentRubric: {
            passingScore: 85,
            competencies: [
              { id: 'c7', name: 'CAP Theorem & Trade-offs', description: 'Defending availability vs consistency trade-offs.', weight: 5 },
            ],
          },
        },
      ],
    });
  }

  /**
   * Conversational refinement for existing roadmap (Mode B compatibility)
   */
  static refineConversational(input: {
    existingRoadmap: any;
    userInstruction: string;
  }): {
    updatedRoadmap: any;
    explanation: string;
    mutatedNodeTitles: string[];
    affectedNodeIds: string[];
    patch: any;
  } {
    const res = this.applyTargetedPatch(input);
    return {
      updatedRoadmap: res.updatedRoadmap,
      explanation: res.summary,
      mutatedNodeTitles: res.mutatedNodeTitles,
      affectedNodeIds: res.affectedNodeIds,
      patch: res.diff,
    };
  }

  /**
   * Truly Interactive Targeted AI Editing (Mode B)
   * Applies surgical mutations, preserves untouched node IDs & progress, and checks for DAG cycles
   */
  static applyTargetedPatch(
    paramsOrRoadmap: any,
    maybeInstruction?: string
  ): TargetedPatchResult {
    let existingRoadmap: any;
    let userInstruction = '';

    if (paramsOrRoadmap && typeof maybeInstruction === 'string') {
      existingRoadmap = paramsOrRoadmap;
      userInstruction = maybeInstruction;
    } else if (paramsOrRoadmap && typeof paramsOrRoadmap === 'object') {
      existingRoadmap = paramsOrRoadmap.existingRoadmap || paramsOrRoadmap.roadmap || paramsOrRoadmap;
      userInstruction = paramsOrRoadmap.userInstruction || paramsOrRoadmap.instruction || '';
    } else {
      existingRoadmap = {};
      userInstruction = '';
    }

    const instructionLower = userInstruction.toLowerCase();

    const nodes: any[] = structuredClone(existingRoadmap.nodes || []);
    const mutatedTitles: string[] = [];
    const addedTitles: string[] = [];
    const removedTitles: string[] = [];
    let reordered = false;
    let summary = '';

    // 0. "Add Redis / Caching Project & Adjust Title"
    if (instructionLower.includes('redis') || instructionLower.includes('caching')) {
      const redisProject: CanonicalRoadmapNodeDraft = {
        id: `node_redis_${Date.now()}`,
        title: 'Distributed Caching & In-Memory Architectures with Redis',
        description: 'Design distributed locking, cache-aside, write-through patterns, and cluster failover with Redis.',
        type: 'PROJECT',
        position: nodes.length,
        estimatedHours: 16,
        whyLearnThis: 'Essential for high-concurrency systems to offload relational databases and maintain sub-millisecond p99 latencies.',
        whatYouWillLearn: [
          'Cache-aside, write-through, and write-behind consistency patterns',
          'Distributed locks with Redlock algorithm and lease heartbeats',
          'Mitigating cache stampede, cache penetration, and hot-key thundering herds',
        ],
        learningObjectives: [
          'Implement distributed locks with Redlock algorithm and lease heartbeats',
          'Mitigate cache stampede, cache penetration, and hot-key thundering herds',
        ],
        whatToBuild: 'High-throughput caching layer with distributed locks and automatic stampede protection.',
        howToVerify: 'Pass load test verifying zero cache stampede and deterministic lock lease renewals.',
        unlockedSkills: ['Redis In-Memory Architecture', 'Distributed Lock Engineering'],
        resources: [
          { title: 'Redis Official Documentation', url: 'https://redis.io/docs/', type: 'DOC', isFree: true },
        ],
        practicalTasks: [
          {
            id: `task_redis_${Date.now()}`,
            title: 'Build Distributed Lock Manager with Redis',
            description: 'Implement safe acquisition, heartbeat renewal, and release semantics in Go/Node.js.',
          },
        ],
        assessmentRubric: {
          passingScore: 80,
          competencies: [
            { id: 'c_redis', name: 'Cache Invalidation & Consistency', description: 'Preventing cache penetration, breakdown, and avalanche.', weight: 4 },
          ],
        },
      };

      const deployIdx = nodes.findIndex(
        (n) => (n.title || '').toLowerCase().includes('deploy') || (n.title || '').toLowerCase().includes('cloud')
      );
      if (deployIdx !== -1) {
        nodes.splice(deployIdx, 0, redisProject);
      } else {
        nodes.push(redisProject);
      }

      if (instructionLower.includes('title')) {
        existingRoadmap.title = `${existingRoadmap.title || 'Curriculum'} (Enhanced with Redis & In-Memory Caching)`;
      }

      addedTitles.push(redisProject.title);
      mutatedTitles.push(redisProject.title);
      summary = `Added a specialized module and hands-on project on **Distributed Caching & In-Memory Architectures with Redis** and adjusted curriculum title.`;
    }

    // 1. "Add Docker / Containerization / Kubernetes"
    else if (instructionLower.includes('docker') || instructionLower.includes('kubernetes') || instructionLower.includes('k8s') || instructionLower.includes('container')) {
      const hasDocker = nodes.some((n) => (n.title || '').toLowerCase().includes('docker') || (n.title || '').toLowerCase().includes('container'));
      if (!hasDocker) {
        const afterIndex = nodes.findIndex((n) => (n.title || '').toLowerCase().includes('network') || (n.title || '').toLowerCase().includes('http'));
        const insertPos = afterIndex !== -1 ? afterIndex + 1 : Math.max(0, nodes.length - 1);

        const newNode: CanonicalRoadmapNodeDraft = {
          id: `node_docker_${Date.now()}`,
          title: 'Containerization & Orchestration with Docker & Kubernetes',
          description: 'Package microservices into hardened multi-stage Docker images and deploy scalable pods in Kubernetes clusters.',
          type: 'MODULE',
          position: insertPos,
          estimatedHours: 20,
          whyLearnThis: 'Containers guarantee environment parity between development and production.',
          whatYouWillLearn: [
            'Create production multi-stage Dockerfiles with minimal footprint and non-root users',
            'Deploy Kubernetes Deployments, Services, ConfigMaps, and Ingress controllers',
          ],
          whatToBuild: 'Write docker-compose.yml and Kubernetes manifests for API, Redis, and Database.',
          howToVerify: 'Pass an AI assessment on container security and pod lifecycle probes.',
          unlockedSkills: ['Containerized deployments', 'Kubernetes cluster orchestration'],
          resources: [
            { title: 'Docker Best Practices Guide', url: 'https://docs.docker.com/develop/develop-images/dockerfile_best-practices/', type: 'DOC', isFree: true },
            { title: 'Kubernetes Official Documentation', url: 'https://kubernetes.io/docs/home/', type: 'DOC', isFree: true },
          ],
          practicalTasks: [
            {
              id: `task_k8s_${Date.now()}`,
              title: 'Containerize and Deploy Microservices Stack',
              description: 'Write docker-compose.yml and Kubernetes manifests for API, Redis, and Database.',
            },
          ],
          assessmentRubric: {
            passingScore: 80,
            competencies: [
              { id: 'c_container', name: 'Container Security & Layering', description: 'Zero vulnerability base images and non-root execution.', weight: 3 },
            ],
          },
        };

        nodes.splice(insertPos, 0, newNode);
        addedTitles.push(newNode.title);
        mutatedTitles.push(newNode.title);
        summary = `Added a production-grade module on **Containerization & Orchestration with Docker & Kubernetes** with official documentation resources and practical deployment tasks.`;
      } else {
        summary = `Docker containerization module already exists in this roadmap.`;
      }
    }

    // 2. "Move X before/after Y" (e.g. Move SQL before ORM or Move Kafka after Networking)
    else if (instructionLower.includes('move') || instructionLower.includes('reorder') || instructionLower.includes('swap')) {
      if (instructionLower.includes('kafka') && (instructionLower.includes('after network') || instructionLower.includes('before'))) {
        const kafkaIndex = nodes.findIndex((n) => (n.title || '').toLowerCase().includes('kafka'));
        const netIndex = nodes.findIndex((n) => (n.title || '').toLowerCase().includes('network'));
        if (kafkaIndex !== -1 && netIndex !== -1 && kafkaIndex !== netIndex + 1) {
          const [kafkaNode] = nodes.splice(kafkaIndex, 1);
          const newNetIndex = nodes.findIndex((n) => (n.title || '').toLowerCase().includes('network'));
          nodes.splice(newNetIndex + 1, 0, kafkaNode);
          mutatedTitles.push(kafkaNode.title);
          reordered = true;
          summary = `Reordered modules: repositioned **${kafkaNode.title}** to appear directly after **Networking Foundations**, maintaining logical prerequisite progression.`;
        }
      } else if (nodes.length >= 2) {
        // Generic reverse of first two or targeted swap
        const first = nodes[0];
        nodes[0] = nodes[1];
        nodes[1] = first;
        mutatedTitles.push(nodes[0].title, nodes[1].title);
        reordered = true;
        summary = `Swapped order of the first two modules to adjust curriculum progression.`;
      }
    }

    // 3. "Add a production-grade project"
    else if (instructionLower.includes('project') || instructionLower.includes('capstone') || instructionLower.includes('build')) {
      let capstoneTopic = 'Fault-Tolerant Distributed Microservices Platform';
      let deliverable = 'Deploy an automated microservices platform with chaos engineering tests.';
      if (instructionLower.includes('trading')) {
        capstoneTopic = 'Real-Time Financial Trading Platform';
        deliverable = 'Build an ultra-low latency order matching engine with WebSocket market feeds and idempotency protection.';
      } else if (instructionLower.includes('e-commerce') || instructionLower.includes('shop')) {
        capstoneTopic = 'High-Scale E-Commerce Engine';
        deliverable = 'Build a flash-sale reservation system with distributed queue throttling.';
      } else if (instructionLower.includes('chat') || instructionLower.includes('messaging')) {
        capstoneTopic = 'Global Real-Time Chat & Video Platform';
        deliverable = 'Build an end-to-end WebSocket messaging system with presence detection.';
      }

      const newProject: CanonicalRoadmapNodeDraft = {
        id: `node_proj_${Date.now()}`,
        title: `Production Capstone: ${capstoneTopic}`,
        description: `Design and deploy a highly-available ${capstoneTopic.toLowerCase()} with distributed transactions, idempotency keys, and metrics observability.`,
        type: 'PROJECT',
        position: nodes.length,
        estimatedHours: 35,
        whyLearnThis: 'Demonstrates end-to-end architectural mastery to hiring managers and technical interviewers.',
        whatYouWillLearn: [
          'Saga pattern for distributed transactions',
          'Idempotency headers and replay protection',
          'Distributed tracing with OpenTelemetry',
        ],
        whatToBuild: deliverable,
        howToVerify: 'Complete an architectural defense interview with the AI interviewer.',
        unlockedSkills: ['Production microservice architecture', 'Disaster recovery engineering'],
        resources: [
          { title: 'Microservices Pattern Guide (Chris Richardson)', url: 'https://microservices.io/patterns/', type: 'DOC', isFree: true },
        ],
        practicalTasks: [
          {
            id: `task_proj_${Date.now()}`,
            title: `Implement ${capstoneTopic}`,
            description: deliverable,
          },
        ],
        assessmentRubric: {
          passingScore: 85,
          competencies: [
            { id: 'c_saga', name: 'Saga Orchestration vs Choreography', description: 'Defending trade-offs of distributed transaction patterns.', weight: 5 },
          ],
        },
      };
      nodes.push(newProject);
      addedTitles.push(newProject.title);
      mutatedTitles.push(newProject.title);
      summary = `Added a comprehensive production-grade capstone project on **${capstoneTopic}** with real-world deliverables.`;
    }

    // 4. "Reduce this roadmap to X weeks"
    else if (instructionLower.includes('reduce') || instructionLower.includes('shorten') || instructionLower.includes('weeks')) {
      const match = instructionLower.match(/(\d+)\s*weeks?/);
      const targetWeeks = match ? parseInt(match[1], 10) : 8;
      existingRoadmap.estimatedWeeks = targetWeeks;
      summary = `Optimized curriculum schedule to complete in **${targetWeeks} weeks** by prioritizing core concepts and streamlining tasks.`;
    }

    // 5. "Add assessment after each section"
    else if (instructionLower.includes('assessment') || instructionLower.includes('quiz') || instructionLower.includes('rubric')) {
      let assessmentsAdded = 0;
      for (const n of nodes) {
        if (!n.metadata) n.metadata = {};
        if (!n.metadata.assessmentRubric) {
          n.metadata.assessmentRubric = {
            passingScore: 75,
            competencies: [
              { id: `c_auto_${Date.now()}`, name: `${n.title} Technical Depth`, description: 'Demonstrating accurate conceptual knowledge and edge-case handling.', weight: 5 },
            ],
          };
          mutatedTitles.push(n.title);
          assessmentsAdded++;
        }
      }
      summary = `Attached technical verification rubrics to modules so learners can prove their understanding through AI evaluations.`;
    }

    // 6. "Replace resources with official documentation"
    else if (instructionLower.includes('official') || instructionLower.includes('documentation') || instructionLower.includes('docs')) {
      for (const n of nodes) {
        if (n.metadata && n.metadata.resources) {
          n.metadata.resources = [
            { title: 'Official Language & Standard Library Documentation', url: 'https://docs.rennetus.org', type: 'DOC', isFree: true },
            { title: 'Industry Best Practices Specification', url: 'https://developer.mozilla.org', type: 'DOC', isFree: true },
          ];
          mutatedTitles.push(n.title);
        }
      }
      summary = `Replaced all external reading links with authoritative official documentation and language specifications.`;
    }

    // 7. "Make suitable for complete beginner"
    else if (instructionLower.includes('beginner') || instructionLower.includes('scratch') || instructionLower.includes('foundation')) {
      const introNode: CanonicalRoadmapNodeDraft = {
        id: `node_intro_${Date.now()}`,
        title: '0. Programming Fundamentals & Environment Setup',
        description: 'Install required tooling, learn core syntax, understand memory basics, and write clean idiomatic code.',
        type: 'MODULE',
        position: 0,
        estimatedHours: 12,
        whyLearnThis: 'Every advanced architectural concept relies on solid syntax and algorithmic fundamentals.',
        whatYouWillLearn: [
          'Terminal commands, Git version control, and package managers',
          'Variables, control flow, functions, and error handling',
        ],
        whatToBuild: 'Write a CLI application with input validation and automated tests.',
        howToVerify: 'Solve 3 beginner diagnostic coding challenges.',
        unlockedSkills: ['Command line proficiency', 'Core language fluency'],
        resources: [
          { title: 'Programming Fundamentals Guide', url: 'https://developer.mozilla.org', type: 'DOC', isFree: true },
        ],
        practicalTasks: [
          {
            id: `task_intro_${Date.now()}`,
            title: 'Setup Developer Tooling & Git Workflow',
            description: 'Configure linter, formatter, and create your first Git repository.',
          },
        ],
        assessmentRubric: {
          passingScore: 70,
          competencies: [
            { id: 'c_beg_1', name: 'Syntax & Flow Control', description: 'Accurate usage of loops, conditionals, and error handling.', weight: 3 },
          ],
        },
      };
      nodes.unshift(introNode);
      addedTitles.push(introNode.title);
      mutatedTitles.push(introNode.title);
      existingRoadmap.difficulty = 'BEGINNER';
      summary = `Adapted the roadmap for beginners: prepended **0. Programming Fundamentals & Environment Setup** and adjusted pacing.`;
    }

    // Default Fallback: Add targeted enrichment task to current active node
    else {
      if (nodes.length > 0) {
        const target = nodes[0];
        if (!target.metadata) target.metadata = {};
        if (!target.metadata.practicalTasks) target.metadata.practicalTasks = [];
        target.metadata.practicalTasks.push({
          id: `task_ai_${Date.now()}`,
          title: `Practical Task: ${userInstruction.slice(0, 40)}`,
          description: `Applied exercise based on instruction: "${userInstruction}". Verify edge cases and error handling.`,
        });
        mutatedTitles.push(target.title);
        summary = `Updated **${target.title}** with practical tasks aligned to your instruction: "${userInstruction}".`;
      } else {
        summary = `Processed your instruction: "${userInstruction}".`;
      }
    }

    // Re-index node positions
    nodes.forEach((n, idx) => {
      n.position = idx;
    });

    // Check for DAG cycles
    const cycleCheck = RoadmapAICopilot.detectCycles(nodes);

    const updatedRoadmap = {
      ...existingRoadmap,
      nodes,
    };

    return {
      updatedRoadmap,
      summary,
      affectedNodeIds: nodes.filter((n) => mutatedTitles.includes(n.title)).map((n) => n.id || n.title),
      mutatedNodeTitles: mutatedTitles,
      diff: {
        added: addedTitles,
        updated: mutatedTitles.filter((t) => !addedTitles.includes(t)),
        removed: removedTitles,
        reordered,
      },
      cycleDetected: cycleCheck.hasCycle,
      cycleNodes: cycleCheck.cycleNodeTitles,
    };
  }
}
