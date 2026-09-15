import React from 'react';
import { 
  Compass, Sparkles, Clock, Layers, ShieldCheck, 
  ArrowRight, CheckCircle2, GraduationCap, Building2, Flame
} from 'lucide-react';
import { Roadmap, RoadmapNode } from '../../store/useRoadmapStore';
import Button from '../ui/Button';

export interface StudentBlueprint {
  id: string;
  title: string;
  subtitle: string;
  targetAudience: string;
  rolePath: string;
  targetCompanyTier: Roadmap['targetCompanyTier'];
  difficulty: Roadmap['difficulty'];
  estimatedWeeks: number;
  weeklyHours: number;
  badgeText: string;
  accentColor: string;
  description: string;
  keyOutcomes: string[];
  nodesData: RoadmapNode[];
}

export const STUDENT_BLUEPRINTS: StudentBlueprint[] = [
  {
    id: 'blueprint-placement-90day',
    title: '90-Day Campus Placement Crunch: Full Stack & System Design',
    subtitle: 'From Semester Exams to High-Paying Product Offers',
    targetAudience: 'Final Year / Pre-Final Year College Students',
    rolePath: 'FULLSTACK',
    targetCompanyTier: 'FAANG',
    difficulty: 'Intermediate',
    estimatedWeeks: 12,
    weeklyHours: 15,
    badgeText: 'Most Popular for Placements',
    accentColor: '#2459A8',
    description: 'A focused, high-yield 12-week blueprint designed to bridge the gap between academic theory and real-world product engineering. Eliminates tutorial hell by enforcing concrete multi-tier architectures, real database indexing, and oral interview defense drills.',
    keyOutcomes: [
      'Master asynchronous runtime execution models & TypeScript invariants',
      'Architect a production microservice with PostgreSQL connection pooling & Redis caching',
      'Construct automated CI/CD pipelines with Docker and GitHub Actions',
      'Defend trade-offs (SQL vs NoSQL, Polling vs WebSockets) in FAANG-style interview loops'
    ],
    nodesData: [
      {
        id: 'node-p90-1',
        title: 'Asynchronous Runtimes, Memory Lifecycle & Event Loop Internals',
        subHeader: 'Phase 1 • Moving Past Syntax Memorization to Runtime Mechanics',
        category: 'Architecture',
        orderIndex: 1,
        status: 'IN_PROGRESS',
        score: 0,
        estimatedHours: 14,
        whatShouldIDo: {
          summary: 'Master the call stack, task queue, microtask queue, and memory heap lifecycle so you can diagnose memory leaks and concurrency race conditions.',
          actionSteps: [
            'Analyze task queue execution priority between Promise.then, setTimeout, and process.nextTick.',
            'Audit memory profiles using Chrome DevTools to locate detached DOM nodes and uncleaned event listeners.',
            'Implement a custom Promise pool concurrency limiter handling 50 concurrent requests without thread exhaustion.'
          ],
          mentalModels: [
            'Single-Threaded Event Loop with Non-Blocking I/O: JavaScript is single-threaded at the JavaScript level, but offloads file/network tasks to OS threads via libuv.',
            'Microtask Starvation: An endless recursive chain of microtasks (Promises) will completely block the macro-task queue and render the UI frozen.'
          ]
        },
        whatIsTheSource: [
          {
            id: 'src-p90-1-1',
            title: 'Node.js Event Loop, Timers and process.nextTick() Official Guide',
            url: 'https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/',
            type: 'DOCS',
            description: 'The definitive architectural breakdown of libuv phases, poll queue, and tick processors.'
          },
          {
            id: 'src-p90-1-2',
            title: 'What the heck is the event loop anyway? (Philip Roberts)',
            url: 'https://www.youtube.com/watch?v=8aGhZQkoFbQ',
            type: 'COURSE',
            description: 'Classic 25-minute visual walkthrough of call stack, web APIs, and task queue interactions.'
          }
        ],
        whatIsTheExactThing: {
          title: 'Custom Promise Concurrency Limiter Drill',
          description: 'Construct a reusable TypeScript utility `pLimit(concurrency)` that accepts an array of asynchronous tasks and guarantees no more than N tasks execute simultaneously.',
          deliverable: 'Tested TypeScript module with 100% test coverage simulating network delays and error propagation.',
          starterCode: `// Phase 1 Drill: Concurrency Limiter\nexport class ConcurrencyLimiter {\n  private queue: Array<() => Promise<any>> = [];\n  private activeCount = 0;\n\n  constructor(private readonly limit: number) {}\n\n  async run<T>(fn: () => Promise<T>): Promise<T> {\n    // TODO: Implement queue buffering and activeCount tracking\n    throw new Error("Not implemented");\n  }\n}`,
          verificationChecklist: [
            'Never exceeds the configured concurrency limit under high load',
            'Propagates rejected promises without stalling remaining queued tasks',
            'Resolves tasks in completion order with sub-5ms scheduler overhead'
          ]
        },
        microQuestions: [
          {
            id: 'mq-p90-1-1',
            questionText: 'What is the precise execution priority between Promise.resolve().then() and setTimeout(fn, 0)? Why does this matter in high-throughput servers?',
            focus: 'Microtask vs Macrotask Queue',
            suggestedAnswer: 'Microtasks (Promises) execute immediately after the current call stack empties and before the event loop yields to the macrotask queue (setTimeout). In high-throughput servers, an uncontrolled flood of microtasks can starve I/O handlers and timer callbacks.'
          }
        ]
      },
      {
        id: 'node-p90-2',
        title: 'Relational Database Schema Design, Query Plans & Indexing',
        subHeader: 'Phase 2 • Production Data Persistence Beyond Basic ORMs',
        category: 'Database',
        orderIndex: 2,
        status: 'LOCKED',
        score: 0,
        estimatedHours: 18,
        whatShouldIDo: {
          summary: 'Transition from naive ORM CRUD to database internals: B-Tree indexing, compound indexes, EXPLAIN ANALYZE execution plans, and transaction isolation levels.',
          actionSteps: [
            'Design a normalized multi-tenant relational schema in PostgreSQL with foreign key cascades and check constraints.',
            'Benchmark unindexed vs B-Tree indexed queries on a 1-million row dataset using EXPLAIN (ANALYZE, BUFFERS).',
            'Implement optimistic locking with version columns to prevent race conditions during concurrent balance deductions.'
          ],
          mentalModels: [
            'Index Cost Trade-off: Reads become O(log N) through B-Trees, but every write/update incurs extra write amplification as indexes must be rebalanced.',
            'ACID Guarantees: Isolation levels (Read Committed vs Serializable) represent a fundamental trade-off between throughput and phantom reads.'
          ]
        },
        whatIsTheSource: [
          {
            id: 'src-p90-2-1',
            title: 'Use The Index, Luke! — A Guide to Database Performance',
            url: 'https://use-the-index-luke.com/',
            type: 'DOCS',
            description: 'Comprehensive developer manual on how SQL indexes work under the hood without DBA jargon.'
          },
          {
            id: 'src-p90-2-2',
            title: 'PostgreSQL EXPLAIN Explained',
            url: 'https://www.postgresql.org/docs/current/using-explain.html',
            type: 'DOCS',
            description: 'Official guide to understanding Seq Scan vs Index Scan vs Bitmap Heap Scan.'
          }
        ],
        whatIsTheExactThing: {
          title: 'High-Concurrency Ledger & Query Optimizer Drill',
          description: 'Construct a PostgreSQL schema and query suite for an e-wallet ledger handling concurrent debits without negative balance glitches.',
          deliverable: 'SQL migration scripts, seed generator (100k records), and benchmark script demonstrating 10x query speedup with composite index.',
          starterCode: `// Phase 2 Drill: Atomic Wallet Transaction\nimport { Pool } from 'pg';\n\nexport async function transferFunds(pool: Pool, fromId: string, toId: string, amount: number) {\n  const client = await pool.connect();\n  try {\n    await client.query('BEGIN');\n    // TODO: Acquire row-level locks using SELECT ... FOR UPDATE\n    await client.query('COMMIT');\n  } catch (err) {\n    await client.query('ROLLBACK');\n    throw err;\n  } finally {\n    client.release();\n  }\n}`,
          verificationChecklist: [
            'Utilizes SELECT FOR UPDATE to prevent double-spending race conditions',
            'EXPLAIN ANALYZE confirms Index Scan instead of full table Seq Scan',
            'Automated concurrency simulation with 50 simultaneous debit requests leaves balance exact'
          ]
        },
        microQuestions: [
          {
            id: 'mq-p90-2-1',
            questionText: 'When would a composite index on (user_id, created_at) NOT be used by PostgreSQL? Explain index column ordering rules.',
            focus: 'Compound B-Tree Traversal',
            suggestedAnswer: 'A composite index on (user_id, created_at) follows leftmost prefix ordering. If a query only filters by created_at without user_id, PostgreSQL cannot leverage the index efficiently and must perform a full scan or loose index scan.'
          }
        ]
      },
      {
        id: 'node-p90-3',
        title: 'Distributed Caching, Cache Invalidation & Rate Limiting',
        subHeader: 'Phase 3 • Scaling Read Throughput & Protecting Database Tiers',
        category: 'Distributed Systems',
        orderIndex: 3,
        status: 'LOCKED',
        score: 0,
        estimatedHours: 16,
        whatShouldIDo: {
          summary: 'Implement Redis caching topologies (Cache-Aside, Write-Through), mitigate Cache Stampedes via distributed mutexes, and build a sliding-window rate limiter.',
          actionSteps: [
            'Build a Cache-Aside wrapper in TypeScript with probabilistic early expiration (XFetch) to eliminate cache stampedes.',
            'Construct a sliding-window log rate limiter using Redis sorted sets (ZSET) preventing API abuse.',
            'Evaluate Redis eviction policies (allkeys-lru vs volatile-lfu) for memory-constrained cloud nodes.'
          ],
          mentalModels: [
            'Cache Invalidation as Hard Problem: Stale cache reads are the primary source of distributed state bugs. Always define TTLs and deterministic cache keys.',
            'Sliding Window vs Fixed Window: Fixed windows suffer from boundary bursts (2x allowable requests at window seams); sliding windows smooth traffic evenly.'
          ]
        },
        whatIsTheSource: [
          {
            id: 'src-p90-3-1',
            title: 'Redis Official Architecture Manual: Caching Patterns',
            url: 'https://redis.io/docs/manual/patterns/',
            type: 'DOCS',
            description: 'Production patterns for caching, distributed locks (Redlock), and secondary indexing.'
          }
        ],
        whatIsTheExactThing: {
          title: 'Sliding-Window Redis Rate Limiting Middleware',
          description: 'Build an Express/Node.js rate-limiting middleware using Redis ZADD/ZREMRANGEBYSCORE that enforces 60 requests per minute per IP.',
          deliverable: 'Production-ready middleware with unit tests simulating clock tick progressions and concurrent spikes.',
          starterCode: `// Phase 3 Drill: Redis Sliding Window Rate Limiter\nimport Redis from 'ioredis';\n\nexport function createRateLimiter(redis: Redis, maxReqs: number, windowSecs: number) {\n  return async (clientIp: string): Promise<{ allowed: boolean; remaining: number }> => {\n    const now = Date.now();\n    const windowStart = now - (windowSecs * 1000);\n    // TODO: ZREMRANGEBYSCORE, ZADD, ZCARD in a pipeline/MULTI\n    return { allowed: true, remaining: maxReqs };\n  };\n}`,
          verificationChecklist: [
            'Uses Redis MULTI/EXEC transaction pipeline to prevent race conditions',
            'Correctly handles edge-burst traffic at exact 60-second window boundaries',
            'Overhead under 3ms per request using connection pooling'
          ]
        },
        microQuestions: [
          {
            id: 'mq-p90-3-1',
            questionText: 'What is a Cache Stampede (Dogpiling) and how do you protect your database when a high-traffic cache key expires simultaneously for 5,000 users?',
            focus: 'High-Concurrency Cache Invalidation',
            suggestedAnswer: 'A cache stampede occurs when a hot cache key expires and thousands of concurrent requests simultaneously miss the cache and hit the database to recompute the value. It is mitigated using distributed mutex locks (only 1 worker recomputes while others wait) or probabilistic early expiration (refreshing background cache prior to hard expiry).'
          }
        ]
      }
    ]
  },
  {
    id: 'blueprint-tier1-backend',
    title: 'Tier-1 Unicorn Backend Systems & Microservices (Go / TypeScript)',
    subtitle: 'Architect High-Throughput Streaming & Resilient Event Loops',
    targetAudience: 'Aspiring Stripe / Uber / Google Backend Engineers',
    rolePath: 'BACKEND',
    targetCompanyTier: 'FAANG',
    difficulty: 'Advanced',
    estimatedWeeks: 16,
    weeklyHours: 20,
    badgeText: 'High-Throughput Systems',
    accentColor: '#A0006D',
    description: 'A deep-dive backend engineering blueprint for students aiming for L4/L5 engineering bars. Emphasizes distributed state machines, gRPC/Protobuf contracts, Apache Kafka event streaming, and resilient horizontal autoscaling.',
    keyOutcomes: [
      'Design fault-tolerant event-driven microservices with Kafka and outbox patterns',
      'Implement gRPC bidirectional streaming with sub-10ms inter-service latency',
      'Architect distributed consensus and idempotent payment ledger workflows',
      'Solve distributed deadlocks and p99 tail latency spikes under production simulation'
    ],
    nodesData: [
      {
        id: 'node-t1-1',
        title: 'Idempotent Payment Processing & Distributed Outbox Pattern',
        subHeader: 'Phase 1 • Zero-Double-Charge Architectures under Network Failures',
        category: 'Architecture',
        orderIndex: 1,
        status: 'IN_PROGRESS',
        score: 0,
        estimatedHours: 20,
        whatShouldIDo: {
          summary: 'Build transactional outbox patterns to guarantee at-least-once message delivery to brokers without dual-write inconsistency bugs.',
          actionSteps: [
            'Design a Postgres outbox table written in the same local ACID transaction as business mutations.',
            'Implement a polling publisher daemon with row-level SKIP LOCKED processing outbox events.',
            'Implement client-side idempotency keys with distributed Redis lock checks.'
          ],
          mentalModels: [
            'Dual-Write Dilemma: You cannot atomically commit to a relational database AND publish to Kafka in a single operation without 2PC or Transactional Outbox.',
            'Idempotency as First Principle: In distributed networks, requests will be retried. The server must guarantee f(f(x)) = f(x).'
          ]
        },
        whatIsTheSource: [
          {
            id: 'src-t1-1-1',
            title: 'Transactional Outbox Pattern — Microservices.io',
            url: 'https://microservices.io/patterns/data/transactional-outbox.html',
            type: 'DOCS',
            description: 'The standard architectural pattern for reliable event publishing.'
          }
        ],
        whatIsTheExactThing: {
          title: 'Transactional Outbox & Idempotent Consumer Drill',
          description: 'Construct a payment authorization service with an idempotency key cache in Redis and a PostgreSQL outbox queue.',
          deliverable: 'Complete service with automated chaos test: kill the server mid-transaction and verify no double charge occurs.',
          starterCode: `// Phase 1 Drill: Idempotent Payment Processor\nexport async function processPayment(orderId: string, idempotencyKey: string, amount: number) {\n  // TODO: Check Redis for idempotencyKey, return cached result if found\n  // Otherwise, run ACID transaction inserting payment + outbox record\n}`,
          verificationChecklist: [
            'Duplicate requests with same idempotency key return identical response without re-charging',
            'Outbox messages are polled and marked published with FOR UPDATE SKIP LOCKED',
            'Zero orphaned records when simulated network drops occur'
          ]
        },
        microQuestions: [
          {
            id: 'mq-t1-1-1',
            questionText: 'Explain why dual-writing to a database and a message broker without the outbox pattern inevitably causes data inconsistency.',
            focus: 'Distributed Consistency',
            suggestedAnswer: 'If the database commit succeeds but the network fails before publishing to Kafka, the message is lost forever. Conversely, if the message publishes but the database transaction rolls back, downstream services act on phantom data. The transactional outbox solves this by writing the message directly into the database within the same atomic transaction.'
          }
        ]
      }
    ]
  },
  {
    id: 'blueprint-frontend-architect',
    title: 'Modern Frontend Platform & Web Vitals Architect (React / TS)',
    subtitle: 'Master Bundle Optimization, Core Web Vitals & Design Systems',
    targetAudience: 'Students wanting to build elite, performant web applications',
    rolePath: 'FRONTEND',
    targetCompanyTier: 'Unicorn',
    difficulty: 'Intermediate',
    estimatedWeeks: 12,
    weeklyHours: 12,
    badgeText: 'Lighthouse 100 & UX Excellence',
    accentColor: '#168A62',
    description: 'Learn how elite tech companies build responsive, highly accessible web applications. Focuses on browser layout engines, code splitting, optimistic UI state, and rendering performance.',
    keyOutcomes: [
      'Eliminate layout shifts (CLS) and optimize Largest Contentful Paint (LCP < 1.2s)',
      'Construct accessible, keyboard-navigable component design systems from scratch',
      'Implement optimistic client updates with rollback on network rejection',
      'Configure Vite/Webpack bundle chunking with dynamic imports and lazy hydration'
    ],
    nodesData: [
      {
        id: 'node-fe-1',
        title: 'Browser Rendering Pipelines, Compositing & Frame Budgeting',
        subHeader: 'Phase 1 • Achieving Deterministic 60fps & Sub-Second LCP',
        category: 'Frontend',
        orderIndex: 1,
        status: 'IN_PROGRESS',
        score: 0,
        estimatedHours: 14,
        whatShouldIDo: {
          summary: 'Understand how browsers parse HTML, construct DOM/CSSOM, execute layout/reflow, paint, and composite layers on the GPU.',
          actionSteps: [
            'Audit layout thrashing caused by reading DOM layout properties (offsetHeight) immediately after writes.',
            'Offload heavy animations to GPU-composited CSS properties (transform, opacity) avoiding repaint.',
            'Configure image aspect-ratio placeholders eliminating Cumulative Layout Shift (CLS).'
          ],
          mentalModels: [
            '16.6ms Frame Budget: At 60Hz, each frame has 16.6ms for JavaScript, style calculation, layout, paint, and compositing. Long tasks (>50ms) cause visible jank.',
            'Render-Blocking Resources: Critical CSS and synchronous scripts block first paint. Lazy-load non-critical assets.'
          ]
        },
        whatIsTheSource: [
          {
            id: 'src-fe-1-1',
            title: 'web.dev: How the Browser Renders Web Pages',
            url: 'https://web.dev/critical-rendering-path/',
            type: 'DOCS',
            description: 'Google Chrome team manual on DOM, CSSOM, and the critical rendering path.'
          }
        ],
        whatIsTheExactThing: {
          title: 'Virtual List / Windowing Engine Drill',
          description: 'Construct a virtualized infinite scroll list in React without third-party libraries that renders 100,000 items while keeping only 20 DOM nodes mounted.',
          deliverable: 'Smooth 60fps virtualized list component with dynamic item heights.',
          starterCode: `// Phase 1 Drill: Virtualized List Engine\nimport React, { useState, useRef } from 'react';\n\nexport function VirtualList<T>({ items, itemHeight, containerHeight, renderItem }: any) {\n  const [scrollTop, setScrollTop] = useState(0);\n  // TODO: Calculate startIndex and endIndex based on scrollTop\n  return <div style={{ height: containerHeight, overflowY: 'auto' }}>{/* ... */}</div>;\n}`,
          verificationChecklist: [
            'Never exceeds 30 DOM elements mounted regardless of total item count',
            'Maintains stable scrollbar height and zero jitter during rapid scrolling',
            'Lighthouse performance score 98+'
          ]
        },
        microQuestions: [
          {
            id: 'mq-fe-1-1',
            questionText: 'What is Forced Synchronous Layout (Layout Thrashing) and how do you prevent it in React component rendering cycles?',
            focus: 'DOM Reflow Performance',
            suggestedAnswer: 'Layout thrashing occurs when JavaScript writes to the DOM and then immediately reads a geometric layout property (such as offsetHeight or getBoundingClientRect), forcing the browser to perform a synchronous reflow before finishing the script. It is prevented by batching all DOM reads before writes or offloading measurements to requestAnimationFrame.'
          }
        ]
      }
    ]
  }
];

interface StudentBlueprintCardProps {
  blueprint: StudentBlueprint;
  onSelect: (blueprint: StudentBlueprint) => void;
}

export default function StudentBlueprintCard({ blueprint, onSelect }: StudentBlueprintCardProps) {
  return (
    <div className="bg-white border border-[#DCE7F2] rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-md hover:border-[#4A8BDF]/40 transition-all flex flex-col justify-between space-y-5 group">
      
      <div className="space-y-3">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span 
            className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full font-mono"
            style={{ backgroundColor: `${blueprint.accentColor}15`, color: blueprint.accentColor }}
          >
            {blueprint.badgeText}
          </span>

          <div className="flex items-center gap-2 text-xs text-[#526078] font-mono">
            <span className="flex items-center gap-1">
              <Clock size={12} /> {blueprint.estimatedWeeks} wks
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Flame size={12} className="text-[#A0006D]" /> {blueprint.weeklyHours}h/wk
            </span>
          </div>
        </div>

        {/* Title & Subtitle */}
        <div>
          <h3 className="text-base sm:text-lg font-bold font-display text-[#11183D] group-hover:text-[#2459A8] transition-colors leading-snug">
            {blueprint.title}
          </h3>
          <p className="text-xs font-medium text-[#4A8BDF] mt-0.5 font-display">
            {blueprint.subtitle}
          </p>
        </div>

        {/* Target Audience Pill */}
        <div className="flex items-center gap-1.5 text-xs text-[#526078] bg-[#EFFAFD] p-2 rounded-xl border border-[#DCE7F2]">
          <GraduationCap size={14} className="text-[#2459A8] shrink-0" />
          <span className="truncate font-medium">{blueprint.targetAudience}</span>
        </div>

        {/* Description */}
        <p className="text-xs text-[#526078] leading-relaxed line-clamp-3">
          {blueprint.description}
        </p>

        {/* Key Outcomes */}
        <div className="space-y-1.5 pt-2 border-t border-[#DCE7F2]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#11183D] font-mono block">
            What You'll Actually Build & Defend:
          </span>
          <div className="space-y-1">
            {blueprint.keyOutcomes.slice(0, 3).map((outcome, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[11px] text-[#334155]">
                <CheckCircle2 size={12} className="text-[#168A62] shrink-0 mt-0.5" />
                <span className="line-clamp-1">{outcome}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="pt-4 border-t border-[#DCE7F2] flex items-center justify-between gap-3">
        <div className="flex items-center gap-1 text-[11px] text-[#526078] font-mono">
          <Layers size={13} className="text-[#4A8BDF]" />
          <span>{blueprint.nodesData.length} Sequenced Milestones</span>
        </div>

        <Button
          variant="royal"
          size="sm"
          onClick={() => onSelect(blueprint)}
          iconRight={<ArrowRight size={13} />}
          className="shadow-xs text-xs"
        >
          Fork Blueprint
        </Button>
      </div>

    </div>
  );
}
