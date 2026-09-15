import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import apiClient from '../api/client';

export interface RoadmapSourceItem {
  id: string;
  title: string;
  url: string;
  type: 'DOCS' | 'COURSE' | 'REPO' | 'BOOK' | 'ARTICLE';
  description?: string;
}

export interface RoadmapNode {
  id: string;
  title: string;          // Main Header (e.g., "PostgreSQL Indexing & B-Trees")
  subHeader: string;       // Sub-header (e.g., "Phase 2 • Database Engineering Core")
  category: string;
  orderIndex: number;
  status: 'LOCKED' | 'IN_PROGRESS' | 'MASTERED';
  score: number;
  estimatedHours: number;
  whatShouldIDo: {
    summary: string;
    actionSteps: string[];
    mentalModels: string[];
  };
  whatIsTheSource: RoadmapSourceItem[];
  whatIsTheExactThing: {
    title: string;
    description: string;
    deliverable: string;
    starterCode?: string;
    verificationChecklist: string[];
  };
  microQuestions: Array<{
    id: string;
    questionText: string;
    focus: string;
    suggestedAnswer?: string;
  }>;
}

export interface Roadmap {
  id: string;
  title: string;
  rolePath: string;
  category: 'FULLSTACK' | 'AIML' | 'DEVOPS' | 'SYSTEM_DESIGN' | 'DATA' | 'FRONTEND' | 'MOBILE' | 'CYBERSECURITY';
  targetCompanyTier: 'FAANG' | 'Unicorn' | 'Tier-1 FinTech' | 'High-Growth Startup' | 'Enterprise';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Staff';
  description: string;
  estimatedWeeks: number;
  isOfficial: boolean;
  isPublic: boolean;
  isAiGenerated: boolean;
  creatorId: string;
  creatorName: string;
  creatorUsername: string;
  creatorAvatar?: string;
  creatorRole?: string;
  overallReadiness: number;
  enrolledCount: number;
  upvotes: number;
  tags: string[];
  nodesData: RoadmapNode[];
  createdAt: string;
  updatedAt: string;
}

// ══════════════════════════════════════════════════════════════════
// OFFICIAL RU READY BLUEPRINTS (COMPANY VETTED)
// ══════════════════════════════════════════════════════════════════
export const OFFICIAL_RU_ROADMAPS: Roadmap[] = [
  {
    id: 'official-fullstack-faang',
    title: 'Senior Fullstack & Cloud Systems Architect',
    rolePath: 'FULLSTACK',
    category: 'FULLSTACK',
    targetCompanyTier: 'FAANG',
    difficulty: 'Advanced',
    description: 'Comprehensive enterprise track covering concurrent React 19 architecture, asynchronous Node.js libuv event loops, Postgres B-Tree indexing, distributed Redis rate limiters, and microservice resiliency.',
    estimatedWeeks: 12,
    isOfficial: true,
    isPublic: true,
    isAiGenerated: false,
    creatorId: 'official-ru-ready',
    creatorName: 'RU Ready Curriculum Board',
    creatorUsername: 'ru_ready_official',
    creatorRole: 'Principal Architect Committee',
    overallReadiness: 0,
    enrolledCount: 3420,
    upvotes: 980,
    tags: ['React 19', 'Node.js', 'PostgreSQL', 'Redis', 'Docker', 'System Design'],
    createdAt: '2026-01-15T00:00:00Z',
    updatedAt: '2026-03-01T00:00:00Z',
    nodesData: [
      {
        id: 'node-fs-1',
        title: 'Concurrent React 19 & State Machine Architecture',
        subHeader: 'Phase 1 • High-Performance Frontend Systems',
        category: 'Frontend Core',
        orderIndex: 1,
        status: 'IN_PROGRESS',
        score: 45,
        estimatedHours: 18,
        whatShouldIDo: {
          summary: 'Master React 19 concurrent transitions, useTransition, useActionState, virtual DOM Fiber reconciliation, and atomic state slicing without cascade re-renders.',
          actionSteps: [
            'Audit existing component render cycles using React DevTools Profiler to identify commit phase bottlenecks.',
            'Deconstruct React Fiber reconciler phases: work loop, completeUnitOfWork, and priority lane queuing.',
            'Implement selective Zustand slice subscriptions to isolate re-render cascades in deeply nested component trees.',
            'Integrate React 19 Server Actions and optimistic mutation updates.'
          ],
          mentalModels: [
            'Fiber Tree Reconciliation: Render phase is interruptible and cooperative; Commit phase is synchronous and atomic.',
            'State Colocation: Always keep state as close as possible to the components that consume it.'
          ]
        },
        whatIsTheSource: [
          {
            id: 'src-fs-1a',
            title: 'Official React 19 Concurrent Mode & Hooks Documentation',
            url: 'https://react.dev/reference/react',
            type: 'DOCS',
            description: 'Core concepts behind useTransition, concurrent rendering, and server actions.'
          },
          {
            id: 'src-fs-1b',
            title: 'Deep-dive into React Fiber Architecture (Andrew Clark)',
            url: 'https://github.com/acdlite/react-fiber-architecture',
            type: 'REPO',
            description: 'The fundamental specification and data structures powering React reconciliation.'
          },
          {
            id: 'src-fs-1c',
            title: 'Zustand State Architecture & Selector Best Practices',
            url: 'https://docs.pmnd.rs/zustand/getting-started/introduction',
            type: 'DOCS',
            description: 'Fine-grained selector subscriptions to avoid re-render cascades.'
          }
        ],
        whatIsTheExactThing: {
          title: 'High-Throughput Financial Order Book UI Drill',
          description: 'Construct a real-time WebSocket order book ticker processing 1,000 tick updates/second. Isolate DOM re-renders so only changed price ladder rows re-paint.',
          deliverable: 'A React 19 application demonstrating useTransition with an atomic Zustand store and zero frame drops on 60 FPS profile recording.',
          starterCode: `// High-frequency selector subscription drill
import { create } from 'zustand';

interface OrderBookState {
  bids: Record<string, number>;
  asks: Record<string, number>;
  updateTicker: (orderId: string, price: number, side: 'bid' | 'ask') => void;
}

export const useOrderBookStore = create<OrderBookState>((set) => ({
  bids: {},
  asks: {},
  updateTicker: (orderId, price, side) => 
    set((state) => ({
      [side === 'bid' ? 'bids' : 'asks']: {
        ...state[side === 'bid' ? 'bids' : 'asks'],
        [orderId]: price
      }
    }))
}));`,
          verificationChecklist: [
            'Zero layout shifts on streaming data updates',
            'React DevTools Profiler confirms less than 5 components re-render per WebSocket packet',
            'Non-blocking user input while streaming orders'
          ]
        },
        microQuestions: [
          {
            id: 'mq-fs-1',
            questionText: 'Explain how React Fiber assigns priority lanes to high-priority user keystrokes vs low-priority background transitions.',
            focus: 'Concurrent Architecture',
            suggestedAnswer: 'Fiber uses 31-bit integer bitmasks to represent lane priorities. Urgent lanes (like user keystrokes) interrupt concurrent render lanes, re-queuing work while keeping input responsive.'
          },
          {
            id: 'mq-fs-2',
            questionText: 'How do you prevent unnecessary selector re-evaluations when passing inline callback functions in custom hooks?',
            focus: 'Performance Profiling',
            suggestedAnswer: 'Memoize selectors with useCallback or use the useShallow comparator from Zustand to avoid creating new object references on every render.'
          }
        ]
      },
      {
        id: 'node-fs-2',
        title: 'Node.js Event Loop & Non-Blocking Asynchronous I/O',
        subHeader: 'Phase 2 • Backend Concurrency & libuv Internals',
        category: 'Backend Core',
        orderIndex: 2,
        status: 'LOCKED',
        score: 0,
        estimatedHours: 16,
        whatShouldIDo: {
          summary: 'Deconstruct libuv phases (Timers, Poll, Check, Close) and master streaming pipelines with backpressure handling and worker threads.',
          actionSteps: [
            'Trace macro-task and micro-task queues across process.nextTick, Promise.then, and setImmediate.',
            'Build a bidirectional backpressure-safe Transform stream pipeline processing multi-gigabyte files with constant memory overhead (<50MB).',
            'Implement a CPU-bound worker thread pool for cryptography and heavy JSON parsing without stalling the main event loop.'
          ],
          mentalModels: [
            'Event Loop Rule: Never block the main thread. If computation takes >10ms, offload to Worker Threads or external queues.',
            'Backpressure Rule: If highWaterMark buffer threshold is exceeded, pause reading immediately until the write stream drains.'
          ]
        },
        whatIsTheSource: [
          {
            id: 'src-fs-2a',
            title: 'Node.js Event Loop, Timers, and process.nextTick() Official Guide',
            url: 'https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick',
            type: 'DOCS',
            description: 'Official deep dive into the 6 distinct phases of the libuv event loop.'
          },
          {
            id: 'src-fs-2b',
            title: 'Node.js Stream Handbook (Substack)',
            url: 'https://github.com/substack/stream-handbook',
            type: 'REPO',
            description: 'Definitive guide to streaming data, pipes, and backpressure management in Node.'
          }
        ],
        whatIsTheExactThing: {
          title: 'Constant-Memory CSV-to-JSON Multi-GB Stream Processor',
          description: 'Implement a stream pipeline utilizing node:stream/promises to parse a 5GB access log CSV and aggregate HTTP status codes without memory usage exceeding 64MB.',
          deliverable: 'Node.js script with pipeline(readStream, csvParser, aggregator, writeStream) with process.memoryUsage() logging.',
          starterCode: `import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { Transform } from 'node:stream';

const safeAggregator = new Transform({
  objectMode: true,
  transform(chunk, encoding, callback) {
    // Implement backpressure-safe chunk reduction
    callback(null, JSON.stringify(chunk) + '\\n');
  }
});`,
          verificationChecklist: [
            'Verified RAM usage stays strictly below 64MB regardless of file size',
            'Backpressure drain event listener properly unpauses readable stream',
            'Proper error handling ensuring all file descriptors are closed on failure'
          ]
        },
        microQuestions: [
          {
            id: 'mq-fs-2a',
            questionText: 'What is the precise execution priority order between process.nextTick, Promise microtasks, and setImmediate?',
            focus: 'Event Loop Order',
            suggestedAnswer: 'process.nextTick executes immediately at the conclusion of the current tick, followed by the microtask queue (Promises), before the event loop advances to the next libuv phase (where setImmediate runs in the Check phase).'
          }
        ]
      },
      {
        id: 'node-fs-3',
        title: 'PostgreSQL Index Structures & B-Tree Execution Plans',
        subHeader: 'Phase 3 • High-Throughput Relational Storage',
        category: 'Database Engineering',
        orderIndex: 3,
        status: 'LOCKED',
        score: 0,
        estimatedHours: 20,
        whatShouldIDo: {
          summary: 'Master B-Tree, BRIN, and GIN indexes in Postgres. Learn how to interpret EXPLAIN (ANALYZE, BUFFERS) plans and eliminate sequential table scans.',
          actionSteps: [
            'Analyze heap fetches vs index-only scans on million-row tables.',
            'Formulate composite indexes obeying the Leftmost Prefix Rule.',
            'Apply Partial Indexes with WHERE clauses to reduce index size by >80% for high-frequency queries.',
            'Resolve deadlocks and optimize transaction isolation levels (Read Committed vs Repeatable Read).'
          ],
          mentalModels: [
            'Leftmost Prefix Rule: An index on (A, B, C) can satisfy queries on (A), (A, B), or (A, B, C), but not on (B) or (C) alone.',
            'Index-Only Scan: If all requested columns exist inside the B-Tree index and the visibility map confirms page cleanliness, the heap is never touched.'
          ]
        },
        whatIsTheSource: [
          {
            id: 'src-fs-3a',
            title: 'PostgreSQL Documentation: Indexing Types & B-Tree Mechanics',
            url: 'https://www.postgresql.org/docs/current/indexes-types.html',
            type: 'DOCS',
            description: 'Comprehensive guide to B-Tree, Hash, GiST, SP-GiST, GIN, and BRIN indexes.'
          },
          {
            id: 'src-fs-3b',
            title: 'Use The Index, Luke! — A Guide to Database Performance',
            url: 'https://use-the-index-luke.com/',
            type: 'BOOK',
            description: 'The ultimate guide to SQL indexing and execution planner optimization.'
          }
        ],
        whatIsTheExactThing: {
          title: 'Million-Row Query Execution Optimization Drill',
          description: 'Construct a SQL schema with 2,000,000 order records. Optimize a sluggish query with multi-condition filtering from 1400ms down to <8ms using a composite partial B-Tree index.',
          deliverable: 'SQL migration script and before/after EXPLAIN ANALYZE comparison report showing zero sequential scans.',
          starterCode: `-- Optimized Partial Composite Index
CREATE INDEX CONCURRENTLY idx_orders_active_user_created 
ON orders (user_id, created_at DESC) 
INCLUDE (total_amount)
WHERE status = 'COMPLETED';`,
          verificationChecklist: [
            'Query execution drops from >1000ms to <10ms',
            'Buffers shared hit confirms index-only scan execution',
            'Index size is verified using pg_size_pretty'
          ]
        },
        microQuestions: [
          {
            id: 'mq-fs-3',
            questionText: 'When is a BRIN (Block Range Index) superior to a standard B-Tree index in PostgreSQL?',
            focus: 'Postgres Index Selection',
            suggestedAnswer: 'BRIN indexes are ideal for very large tables where rows are naturally ordered on disk (such as append-only time-series timestamps). They consume a fraction of the RAM of a B-Tree.'
          }
        ]
      },
      {
        id: 'node-fs-4',
        title: 'Distributed Rate Limiting & High-Availability Redis',
        subHeader: 'Phase 4 • Distributed Systems & Caching Resiliency',
        category: 'System Design',
        orderIndex: 4,
        status: 'LOCKED',
        score: 0,
        estimatedHours: 24,
        whatShouldIDo: {
          summary: 'Architect distributed sliding-window token bucket rate limiters using atomic Redis Lua scripts. Mitigate cache stampedes using probabilistic early expiration.',
          actionSteps: [
            'Design sliding-window log algorithms in Redis using Sorted Sets (ZREMRANGEBYSCORE + ZADD).',
            'Implement atomic Lua scripts to eliminate network round-trip race conditions.',
            'Deploy the XFetch probabilistic early expiration algorithm to prevent cache stampedes on hot cache keys.',
            'Configure Redis Sentinel failover and evaluate consistency tradeoffs.'
          ],
          mentalModels: [
            'Atomic Isolation: A Redis Lua script executes atomically on the single thread, preventing concurrency race conditions.',
            'Cache Stampede (Thundering Herd): When a hot key expires, multiple concurrent requests recompute the same heavy database query simultaneously unless mitigated.'
          ]
        },
        whatIsTheSource: [
          {
            id: 'src-fs-4a',
            title: 'Redis Official Documentation: Programmability with Lua Scripts',
            url: 'https://redis.io/docs/interact/programmability/eval-intro/',
            type: 'DOCS',
            description: 'Atomic operations and scripting inside the Redis runtime.'
          },
          {
            id: 'src-fs-4b',
            title: 'System Design Interview — Alex Xu (Rate Limiter Chapter)',
            url: 'https://bytebytego.com/',
            type: 'BOOK',
            description: 'Architectural diagrams and trade-offs of Token Bucket, Leaky Bucket, and Sliding Window.'
          }
        ],
        whatIsTheExactThing: {
          title: 'Distributed Sliding Window Rate Limiter Middleware',
          description: 'Construct an Express/Fastify middleware powered by an atomic Redis Lua script enforcing 100 requests per 60-second sliding window per user ID, handling burst traffic smoothly.',
          deliverable: 'Tested middleware module with automated test harness firing 200 concurrent requests, verifying exactly 100 pass and 100 receive HTTP 429.',
          starterCode: `const slidingWindowLua = \`
  local key = KEYS[1]
  local now = tonumber(ARGV[1])
  local window = tonumber(ARGV[2])
  local limit = tonumber(ARGV[3])
  local clearBefore = now - window

  redis.call('ZREMRANGEBYSCORE', key, 0, clearBefore)
  local currentRequests = redis.call('ZCARD', key)

  if currentRequests < limit then
    redis.call('ZADD', key, now, now)
    redis.call('EXPIRE', key, math.ceil(window / 1000))
    return 1
  else
    return 0
  end
\`;`,
          verificationChecklist: [
            'Redis Lua script runs in single atomic operation',
            'HTTP 429 Too Many Requests returned with Retry-After header',
            'Zero race conditions under concurrent load test'
          ]
        },
        microQuestions: [
          {
            id: 'mq-fs-4',
            questionText: 'How does the Sliding Window Counter algorithm compare to Fixed Window Counter in handling traffic spikes at window boundaries?',
            focus: 'Rate Limiting Algorithms',
            suggestedAnswer: 'Fixed Window counters can permit double the intended rate if traffic bursts around the boundary. Sliding Window Log or Counter calculates the weighted average of previous and current windows, preventing border spikes.'
          }
        ]
      }
    ]
  },
  {
    id: 'official-aiml-faang',
    title: 'Generative AI, LLM & RAG Systems Engineer',
    rolePath: 'AIML',
    category: 'AIML',
    targetCompanyTier: 'FAANG',
    difficulty: 'Advanced',
    description: 'Master advanced Retrieval-Augmented Generation (RAG), vector database indexing with HNSW, hybrid sparse-dense search, model quantization (GGUF/AWQ), and agentic workflows.',
    estimatedWeeks: 10,
    isOfficial: true,
    isPublic: true,
    isAiGenerated: false,
    creatorId: 'official-ru-ready',
    creatorName: 'RU Ready AI Research Group',
    creatorUsername: 'ru_ready_ai',
    creatorRole: 'Staff AI Researcher',
    overallReadiness: 0,
    enrolledCount: 2890,
    upvotes: 1140,
    tags: ['RAG', 'Vector DB', 'Pinecone', 'LangChain', 'Llama 3', 'Quantization'],
    createdAt: '2026-01-20T00:00:00Z',
    updatedAt: '2026-03-05T00:00:00Z',
    nodesData: [
      {
        id: 'node-ai-1',
        title: 'Hybrid Semantic Retrieval & HNSW Vector Indexing',
        subHeader: 'Phase 1 • Enterprise Vector Search & Embeddings',
        category: 'Vector Architecture',
        orderIndex: 1,
        status: 'IN_PROGRESS',
        score: 30,
        estimatedHours: 16,
        whatShouldIDo: {
          summary: 'Build high-accuracy semantic retrieval using Hierarchical Navigable Small World (HNSW) graphs, combining dense embeddings with BM25 sparse keyword ranking.',
          actionSteps: [
            'Understand cosine similarity, dot product, and Euclidean distance metric nuances.',
            'Implement Reciprocal Rank Fusion (RRF) to merge BM25 keyword rankings with dense text embeddings.',
            'Configure HNSW index parameters (M, efConstruction, efSearch) balancing recall precision with latency.'
          ],
          mentalModels: [
            'Hybrid Search: Dense vectors capture conceptual semantics, while sparse BM25 captures exact IDs, part numbers, and proper nouns.',
            'HNSW Trade-off: Higher efSearch increases accuracy/recall at the cost of queries-per-second.'
          ]
        },
        whatIsTheSource: [
          {
            id: 'src-ai-1a',
            title: 'Pinecone: Masterclass in HNSW Graphs & Vector Indexing',
            url: 'https://www.pinecone.io/learn/series/vector-search/',
            type: 'DOCS',
            description: 'Visual mathematical breakdown of Hierarchical Navigable Small World graphs.'
          },
          {
            id: 'src-ai-1b',
            title: 'Cohere: Hybrid Search and Reranking Architecture',
            url: 'https://docs.cohere.com/docs/reranking-best-practices',
            type: 'DOCS',
            description: 'How to combine sparse BM25 and dense embeddings with cross-encoder re-ranking.'
          }
        ],
        whatIsTheExactThing: {
          title: 'Production RAG Engine with Cross-Encoder Reranking',
          description: 'Construct an end-to-end Python retrieval engine indexing 10,000 technical PDF chunks into a local vector store with hybrid BM25 + dense search and a Cohere/BGE cross-encoder re-ranker.',
          deliverable: 'Python pipeline script outputting Top-5 retrieved chunks with ground-truth recall score evaluation.',
          starterCode: `from sentence_transformers import SentenceTransformer, CrossEncoder
import numpy as np

embedder = SentenceTransformer('all-MiniLM-L6-v2')
reranker = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')

def hybrid_search(query: str, corpus: list[str], top_k: int = 5):
    # Step 1: Compute query embedding
    # Step 2: Dense + Sparse merge with RRF
    # Step 3: Re-rank with Cross-Encoder
    pass`,
          verificationChecklist: [
            'Query latency < 80ms on 10k documents',
            'Cross-encoder re-ranking demonstrates measurable precision improvement over raw vector search',
            'Handles out-of-vocabulary technical identifiers flawlessly'
          ]
        },
        microQuestions: [
          {
            id: 'mq-ai-1',
            questionText: 'Why does cosine similarity between normalized vector embeddings produce identical rank ordering to dot product?',
            focus: 'Vector Geometry',
            suggestedAnswer: 'Cosine similarity is the dot product divided by the magnitudes. When vectors are L2-normalized (magnitude equals 1), the denominator is 1, making cosine similarity mathematically identical to dot product.'
          }
        ]
      },
      {
        id: 'node-ai-2',
        title: 'Local LLM Inference, Quantization & Fine-Tuning',
        subHeader: 'Phase 2 • Efficient LLM Serving & Adapters',
        category: 'Model Engineering',
        orderIndex: 2,
        status: 'LOCKED',
        score: 0,
        estimatedHours: 22,
        whatShouldIDo: {
          summary: 'Run high-throughput local models using Ollama, vLLM, and TensorRT-LLM. Master 4-bit/8-bit quantization (AWQ, GGUF) and QLoRA parameter-efficient fine-tuning.',
          actionSteps: [
            'Deploy local Ollama/vLLM inference instance with continuous batching and PagedAttention.',
            'Quantize a 7B parameter foundation model to 4-bit AWQ and benchmark perplexity degradation vs VRAM savings.',
            'Train a QLoRA adapter on specialized domain QA pairs using Unsloth/HuggingFace.'
          ],
          mentalModels: [
            'PagedAttention: Alleviates memory fragmentation in KV-cache by allocating non-contiguous memory blocks, mirroring virtual memory in OS.',
            'Quantization Tradeoff: Low-bit quantization reduces memory bandwidth bottlenecks at the cost of slight precision loss.'
          ]
        },
        whatIsTheSource: [
          {
            id: 'src-ai-2a',
            title: 'vLLM: Easy, Fast, and Cheap LLM Serving with PagedAttention',
            url: 'https://docs.vllm.ai/en/latest/',
            type: 'DOCS',
            description: 'Production high-throughput inference engine documentation.'
          },
          {
            id: 'src-ai-2b',
            title: 'Tim Dettmers: QLoRA — Efficient Finetuning of Quantized LLMs',
            url: 'https://github.com/artidoro/qlora',
            type: 'REPO',
            description: 'Original research paper and implementation of 4-bit normal float quantization with LoRA adapters.'
          }
        ],
        whatIsTheExactThing: {
          title: 'Continuous Batching LLM Server with OpenAI-Compatible API',
          description: 'Spin up a local vLLM or Ollama instance serving a 4-bit quantized Llama-3 model. Benchmark latency and tokens/sec under 50 concurrent client connections.',
          deliverable: 'Benchmarking script with concurrency plots showing P99 TTFT (Time-to-First-Token) and generation throughput.',
          starterCode: `# Benchmarking concurrency script
import asyncio, httpx, time

async def test_inference(prompt: str):
    start = time.perf_counter()
    async with httpx.AsyncClient(timeout=30) as client:
        res = await client.post('http://localhost:11434/api/generate', json={
            'model': 'llama3:8b',
            'prompt': prompt,
            'stream': False
        })
        ttft = time.perf_counter() - start
        return ttft`,
          verificationChecklist: [
            'Streaming token generation works with zero buffering delays',
            'VRAM utilization remains stable under concurrent load without OOM crash'
          ]
        },
        microQuestions: [
          {
            id: 'mq-ai-2',
            questionText: 'Explain how PagedAttention solves the KV-cache memory fragmentation issue in LLM serving.',
            focus: 'Inference Architecture',
            suggestedAnswer: 'Standard KV-cache pre-allocates contiguous memory for maximum sequence length, wasting up to 60-80% of VRAM. PagedAttention divides the KV-cache into fixed-size physical blocks that are dynamically assigned on demand.'
          }
        ]
      }
    ]
  },
  {
    id: 'official-devops-faang',
    title: 'Cloud Native DevOps & Site Reliability Engineer (SRE)',
    rolePath: 'DEVOPS',
    category: 'DEVOPS',
    targetCompanyTier: 'FAANG',
    difficulty: 'Advanced',
    description: 'Production Kubernetes pod lifecycle, multi-stage Docker optimization, Terraform Infrastructure-as-Code, Prometheus/Grafana alerting, and zero-downtime Canary deployments.',
    estimatedWeeks: 10,
    isOfficial: true,
    isPublic: true,
    isAiGenerated: false,
    creatorId: 'official-ru-ready',
    creatorName: 'RU Ready SRE Infrastructure Board',
    creatorUsername: 'ru_ready_sre',
    creatorRole: 'Staff Infrastructure Architect',
    overallReadiness: 0,
    enrolledCount: 2150,
    upvotes: 870,
    tags: ['Kubernetes', 'Docker', 'Terraform', 'Prometheus', 'CI/CD', 'AWS'],
    createdAt: '2026-01-25T00:00:00Z',
    updatedAt: '2026-03-02T00:00:00Z',
    nodesData: [
      {
        id: 'node-do-1',
        title: 'Kubernetes Pod Lifecycle, Probes & HPA Scaling',
        subHeader: 'Phase 1 • Container Orchestration & Resiliency',
        category: 'Container Orchestration',
        orderIndex: 1,
        status: 'IN_PROGRESS',
        score: 50,
        estimatedHours: 18,
        whatShouldIDo: {
          summary: 'Master Kubernetes container lifecycle: liveness, readiness, and startup probes; horizontal pod autoscaling (HPA) using custom metrics; and zero-downtime rolling deployments.',
          actionSteps: [
            'Configure graceful shutdown handling (SIGTERM vs SIGKILL) inside container entrypoint scripts.',
            'Deploy Readiness probes that decouple unhealthy pods from Service endpoints before traffic hits.',
            'Implement Horizontal Pod Autoscaler based on Prometheus custom metrics (e.g. queue depth or HTTP latency).'
          ],
          mentalModels: [
            'Liveness vs Readiness: Liveness restarts an unhealthy container; Readiness removes traffic from an unready container without killing it.'
          ]
        },
        whatIsTheSource: [
          {
            id: 'src-do-1a',
            title: 'Kubernetes Official Documentation: Container Probes & Lifecycle',
            url: 'https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/',
            type: 'DOCS',
            description: 'Comprehensive guide to container hooks, probes, and graceful pod termination.'
          }
        ],
        whatIsTheExactThing: {
          title: 'Zero-Downtime Canary Rolling Update Deployment Manifest',
          description: 'Construct a complete Kubernetes Deployment, Service, and HPA manifest with properly calibrated terminationGracePeriodSeconds and preStop hooks.',
          deliverable: 'Kubernetes YAML manifest and load-testing script proving 100% 200 OK responses during rolling update.',
          starterCode: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-gateway-deployment
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    spec:
      terminationGracePeriodSeconds: 30
      containers:
      - name: gateway
        image: gateway:v2
        lifecycle:
          preStop:
            exec:
              command: ["/bin/sh", "-c", "sleep 10"]`,
          verificationChecklist: [
            'Zero dropped connections during pod rolling update',
            'Readiness probe passes before pod receives traffic'
          ]
        },
        microQuestions: [
          {
            id: 'mq-do-1',
            questionText: 'Why is a preStop sleep hook critical when updating Kubernetes deployments behind an ingress controller?',
            focus: 'K8s Networking',
            suggestedAnswer: 'Endpoint updates propagate asynchronously. The preStop sleep ensures the pod continues serving active requests while ingress routers update their routing tables and cease directing new traffic.'
          }
        ]
      }
    ]
  },
  {
    id: 'official-sysdesign-faang',
    title: 'High-Frequency Distributed Backend & Concurrency Engineer',
    rolePath: 'SYSTEM_DESIGN',
    category: 'SYSTEM_DESIGN',
    targetCompanyTier: 'FAANG',
    difficulty: 'Staff',
    description: 'Design distributed architectures capable of handling 1M+ QPS. Master Kafka partition rebalancing, Raft consensus algorithm, distributed transactions with Saga pattern, and write-ahead logging.',
    estimatedWeeks: 14,
    isOfficial: true,
    isPublic: true,
    isAiGenerated: false,
    creatorId: 'official-ru-ready',
    creatorName: 'RU Ready Distributed Systems Group',
    creatorUsername: 'ru_ready_distrib',
    creatorRole: 'Principal Systems Architect',
    overallReadiness: 0,
    enrolledCount: 1980,
    upvotes: 910,
    tags: ['Distributed Systems', 'Kafka', 'Raft', 'Saga Pattern', 'Go', 'Cassandra'],
    createdAt: '2026-02-01T00:00:00Z',
    updatedAt: '2026-03-08T00:00:00Z',
    nodesData: [
      {
        id: 'node-sd-1',
        title: 'Kafka Partition Rebalancing & Exactly-Once Semantics',
        subHeader: 'Phase 1 • High-Throughput Event Streams',
        category: 'Event Streaming',
        orderIndex: 1,
        status: 'IN_PROGRESS',
        score: 40,
        estimatedHours: 20,
        whatShouldIDo: {
          summary: 'Master Apache Kafka partition assignment strategies (Cooperative Sticky Assignor), consumer group heartbeats, and transactional producer idempotency.',
          actionSteps: [
            'Configure idempotent producers with enable.idempotence=true to prevent duplicate writes on network retry.',
            'Implement Cooperative Sticky Rebalancing to prevent stop-the-world partition revocations.',
            'Construct transactional outbox patterns to achieve exactly-once event dispatch coupled with relational database updates.'
          ],
          mentalModels: [
            'Cooperative Rebalancing: Only reassigned partitions are paused; unaffected consumers continue processing messages without interruption.'
          ]
        },
        whatIsTheSource: [
          {
            id: 'src-sd-1a',
            title: 'Apache Kafka Official Documentation: Consumer Rebalance Protocol',
            url: 'https://kafka.apache.org/documentation/#consumerconfigs',
            type: 'DOCS',
            description: 'Deep dive into consumer group assignment strategies and coordinator heartbeats.'
          }
        ],
        whatIsTheExactThing: {
          title: 'Transactional Outbox Pattern Event Relayer',
          description: 'Implement a transactional outbox daemon in Node.js/Go that reads pending events from a Postgres outbox table with row-level locks and publishes them to Kafka with ACK=ALL.',
          deliverable: 'Demonstrated zero message loss during database failovers and simulated broker disconnects.',
          starterCode: `// Transactional Outbox Relayer
async function pollOutboxAndPublish() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const res = await client.query(
      'SELECT id, topic, payload FROM outbox WHERE status = $1 FOR UPDATE SKIP LOCKED LIMIT 50',
      ['PENDING']
    );
    // Publish to Kafka, then commit
  } finally {
    client.release();
  }
}`,
          verificationChecklist: [
            'Zero duplicate messages processed downstream',
            'SKIP LOCKED ensures multiple worker instances do not lock the same rows'
          ]
        },
        microQuestions: [
          {
            id: 'mq-sd-1',
            questionText: 'What is the purpose of FOR UPDATE SKIP LOCKED in database queue/outbox implementations?',
            focus: 'Concurrency Locking',
            suggestedAnswer: 'It allows multiple worker threads to pull available jobs concurrently without waiting for locked rows, completely avoiding serialization bottlenecks and lock contention.'
          }
        ]
      }
    ]
  }
];

// Sample Community Creations
export const COMMUNITY_ROADMAPS: Roadmap[] = [
  {
    id: 'comm-maya-nextjs',
    title: 'Modern Next.js 15 & Server Components Deep Dive',
    rolePath: 'FRONTEND',
    category: 'FRONTEND',
    targetCompanyTier: 'Unicorn',
    difficulty: 'Intermediate',
    description: 'Step-by-step roadmap to mastering React Server Components, Server Actions, Turbopack, and edge middleware for ultra-fast web apps.',
    estimatedWeeks: 6,
    isOfficial: false,
    isPublic: true,
    isAiGenerated: false,
    creatorId: 'usr-maya-99',
    creatorName: 'Maya Patel',
    creatorUsername: 'mayadev',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    creatorRole: 'Staff Frontend Engineer @ Stripe',
    overallReadiness: 0,
    enrolledCount: 740,
    upvotes: 310,
    tags: ['Next.js 15', 'RSC', 'Tailwind', 'TypeScript', 'Turbopack'],
    createdAt: '2026-02-10T00:00:00Z',
    updatedAt: '2026-02-28T00:00:00Z',
    nodesData: [
      {
        id: 'node-comm-1',
        title: 'React Server Components vs Client Island Boundaries',
        subHeader: 'Step 1 • Next.js Architecture',
        category: 'Next.js Core',
        orderIndex: 1,
        status: 'IN_PROGRESS',
        score: 60,
        estimatedHours: 12,
        whatShouldIDo: {
          summary: 'Understand the RSC boundary: what code runs strictly on the server and how client components are hydrated.',
          actionSteps: [
            'Inspect network tab for RSC flight payloads (text/x-component).',
            'Pass server components as children to client components to preserve server rendering.',
            'Implement Server Actions for form submissions without REST API boilerplate.'
          ],
          mentalModels: [
            'Server Components never ship JavaScript to the browser; they serialize to a virtual DOM representation over the wire.'
          ]
        },
        whatIsTheSource: [
          {
            id: 'src-comm-1',
            title: 'Next.js App Router Documentation: Server Components',
            url: 'https://nextjs.org/docs/app/building-your-application/rendering/server-components',
            type: 'DOCS',
            description: 'Official deep dive into server vs client component boundaries.'
          }
        ],
        whatIsTheExactThing: {
          title: 'Zero-Bundle-Size Markdown Documentation Viewer',
          description: 'Build an RSC viewer that parses and renders GitHub-flavored markdown with syntax highlighting on the server, sending zero markdown parser JS to client.',
          deliverable: 'Next.js App Router project verified in bundle analyzer with 0KB client markdown parser weight.',
          starterCode: `// Server component: zero client bundle size!
export default async function DocPage({ params }: { params: { slug: string } }) {
  const content = await fetchMarkdown(params.slug);
  return <article className="prose">{content}</article>;
}`,
          verificationChecklist: [
            'Bundle analyzer confirms parser is excluded from client bundle',
            'Fast first contentful paint < 0.6s'
          ]
        },
        microQuestions: [
          {
            id: 'mq-comm-1',
            questionText: 'Can a Client Component import a Server Component directly? What is the correct pattern?',
            focus: 'RSC Boundaries',
            suggestedAnswer: 'No, a Client Component cannot directly import a Server Component. The correct pattern is to pass the Server Component as a child or prop to the Client Component.'
          }
        ]
      }
    ]
  },
  {
    id: 'comm-alex-rust-backend',
    title: 'Rust for High-Throughput Microservices & Tokio',
    rolePath: 'SYSTEM_DESIGN',
    category: 'SYSTEM_DESIGN',
    targetCompanyTier: 'Tier-1 FinTech',
    difficulty: 'Advanced',
    description: 'Build memory-safe, zero-cost abstraction asynchronous backends using Rust, Tokio async runtime, Axum, and SQLx.',
    estimatedWeeks: 8,
    isOfficial: false,
    isPublic: true,
    isAiGenerated: false,
    creatorId: 'usr-alex-44',
    creatorName: 'Alex Rivera',
    creatorUsername: 'arivera_code',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    creatorRole: 'Systems Architect @ Citadel',
    overallReadiness: 0,
    enrolledCount: 520,
    upvotes: 245,
    tags: ['Rust', 'Tokio', 'Axum', 'PostgreSQL', 'FinTech'],
    createdAt: '2026-02-18T00:00:00Z',
    updatedAt: '2026-03-02T00:00:00Z',
    nodesData: [
      {
        id: 'node-comm-r1',
        title: 'Ownership, Lifetimes & Tokio Multi-threaded Async Runtime',
        subHeader: 'Step 1 • Rust Concurrency Primitives',
        category: 'Rust Core',
        orderIndex: 1,
        status: 'IN_PROGRESS',
        score: 35,
        estimatedHours: 15,
        whatShouldIDo: {
          summary: 'Master the borrow checker, Arc<Mutex<T>> vs channels (mpsc/broadcast), and asynchronous tasks spawned across Tokio worker threads.',
          actionSteps: [
            'Write multi-threaded task spawns with tokio::spawn without lifetime borrow issues.',
            'Implement message passing using tokio::sync::mpsc for decoupled actor communication.',
            'Benchmark memory footprint under high concurrency.'
          ],
          mentalModels: [
            'Do not communicate by sharing memory; share memory by communicating (channels).'
          ]
        },
        whatIsTheSource: [
          {
            id: 'src-rust-1',
            title: 'The Rust Programming Language Book (Official)',
            url: 'https://doc.rust-lang.org/book/',
            type: 'BOOK',
            description: 'The standard Rust reference for ownership, borrowing, and concurrency.'
          }
        ],
        whatIsTheExactThing: {
          title: 'Asynchronous TCP Trading Gateway Proxy',
          description: 'Build an Axum/Tokio proxy server routing FIX/JSON messages to backend microservices with sub-millisecond latency.',
          deliverable: 'Rust binary tested with wrk handling 25,000 QPS with memory under 20MB.',
          verificationChecklist: [
            'Sub-millisecond P99 response latency',
            'Zero unsafe blocks used'
          ]
        },
        microQuestions: [
          {
            id: 'mq-rust-1',
            questionText: 'When should you choose tokio::sync::Mutex over std::sync::Mutex?',
            focus: 'Tokio Concurrency',
            suggestedAnswer: 'Use tokio::sync::Mutex only when the lock must be held across an .await point. If holding the lock across an await is not needed, std::sync::Mutex is faster.'
          }
        ]
      }
    ]
  }
];

interface RoadmapStoreState {
  roadmaps: Roadmap[];
  enrolledRoadmapIds: string[];
  likedRoadmapIds: string[];
  previewRoadmap: Roadmap | null;
  activeRoadmapId: string | null;

  // Granular Node Engagement State
  completedChecklistItems: Record<string, number[]>;
  readSourceIds: Record<string, string[]>;
  nodeNotes: Record<string, string>;
  nodeCode: Record<string, string>;
  nodeSubmissions: Record<string, {
    passedTests: boolean;
    score: number;
    executionTimeMs: number;
    verbalFeedback?: string;
    submittedRepoUrl?: string;
  }>;

  // Actions
  setPreviewRoadmap: (roadmap: Roadmap | null) => void;
  setActiveRoadmap: (id: string | null) => void;
  enrollRoadmap: (id: string) => void;
  unenrollRoadmap: (id: string) => void;
  claimRoadmap: (id: string) => void;
  unclaimRoadmap: (id: string) => void;
  toggleUpvoteRoadmap: (id: string) => void;
  createManualRoadmap: (roadmapData: Omit<Roadmap, 'id' | 'createdAt' | 'updatedAt' | 'overallReadiness' | 'enrolledCount' | 'upvotes'>) => Roadmap;
  createAiRoadmap: (params: {
    rolePath: string;
    targetTier: string;
    difficulty: string;
    timelineWeeks: number;
    techStack: string[];
    focusGaps: string;
  }) => Promise<Roadmap>;
  updateRoadmap: (id: string, updates: Partial<Roadmap>) => void;
  deleteRoadmap: (id: string) => void;
  completeNode: (roadmapId: string, nodeId: string, score?: number) => void;
  toggleChecklistItem: (roadmapId: string, nodeId: string, index: number) => void;
  toggleSourceRead: (roadmapId: string, nodeId: string, sourceId: string) => void;
  saveNodeNotes: (roadmapId: string, nodeId: string, notes: string) => void;
  saveNodeCode: (roadmapId: string, nodeId: string, code: string) => void;
  recordNodeSubmission: (roadmapId: string, nodeId: string, submission: {
    passedTests: boolean;
    score: number;
    executionTimeMs: number;
    verbalFeedback?: string;
    submittedRepoUrl?: string;
  }) => void;
  syncWithBackend: () => Promise<void>;
}

export const useRoadmapStore = create<RoadmapStoreState>()(
  persist(
    (set, get) => ({
      roadmaps: [...OFFICIAL_RU_ROADMAPS, ...COMMUNITY_ROADMAPS],
      enrolledRoadmapIds: ['official-fullstack-faang'],
      likedRoadmapIds: ['official-fullstack-faang'],
      previewRoadmap: null,
      activeRoadmapId: 'official-fullstack-faang',

      completedChecklistItems: {},
      readSourceIds: {},
      nodeNotes: {},
      nodeCode: {},
      nodeSubmissions: {},

      setPreviewRoadmap: (roadmap) => set({ previewRoadmap: roadmap }),

      setActiveRoadmap: (id) => set({ activeRoadmapId: id }),

      enrollRoadmap: (id) => {
        const { enrolledRoadmapIds, roadmaps } = get();
        if (!enrolledRoadmapIds.includes(id)) {
          const updatedRoadmaps = roadmaps.map((r) =>
            r.id === id ? { ...r, enrolledCount: (r.enrolledCount || 0) + 1 } : r
          );
          set({
            enrolledRoadmapIds: [...enrolledRoadmapIds, id],
            roadmaps: updatedRoadmaps,
            activeRoadmapId: id,
          });
        }
      },

      unenrollRoadmap: (id) => {
        const { enrolledRoadmapIds, roadmaps } = get();
        set({
          enrolledRoadmapIds: enrolledRoadmapIds.filter((item) => item !== id),
          roadmaps: roadmaps.map((r) =>
            r.id === id ? { ...r, enrolledCount: Math.max(0, (r.enrolledCount || 1) - 1) } : r
          ),
          activeRoadmapId: get().activeRoadmapId === id ? null : get().activeRoadmapId,
        });
      },

      claimRoadmap: (id) => {
        get().enrollRoadmap(id);
      },

      unclaimRoadmap: (id) => {
        get().unenrollRoadmap(id);
      },

      toggleUpvoteRoadmap: (id) => {
        const { likedRoadmapIds, roadmaps } = get();
        const isLiked = likedRoadmapIds.includes(id);
        const newLiked = isLiked
          ? likedRoadmapIds.filter((item) => item !== id)
          : [...likedRoadmapIds, id];

        const updatedRoadmaps = roadmaps.map((r) => {
          if (r.id === id) {
            return {
              ...r,
              upvotes: isLiked ? Math.max(0, (r.upvotes || 0) - 1) : (r.upvotes || 0) + 1,
            };
          }
          return r;
        });

        set({
          likedRoadmapIds: newLiked,
          roadmaps: updatedRoadmaps,
        });

        apiClient.post(`/roadmap/${id}/upvote`, { upvoted: !isLiked }).catch(() => {});
      },

      createManualRoadmap: (roadmapData) => {
        const newRoadmap: Roadmap = {
          ...roadmapData,
          id: `roadmap-custom-${Date.now()}`,
          overallReadiness: 0,
          enrolledCount: 1,
          upvotes: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          roadmaps: [newRoadmap, ...state.roadmaps],
          enrolledRoadmapIds: [newRoadmap.id, ...state.enrolledRoadmapIds],
          activeRoadmapId: newRoadmap.id,
        }));

        // Fire-and-forget sync to backend API if available
        apiClient.post('/roadmap/manual', newRoadmap).catch(() => {
          // Gracefully keep local copy
        });

        return newRoadmap;
      },

      createAiRoadmap: async (params) => {
        // Synthesize dynamic AI nodes adhering strictly to the 3-pillar requirements:
        // 1. "What should I do?"
        // 2. "What is the source?"
        // 3. "What is the exact thing?"
        const generatedNodes: RoadmapNode[] = [
          {
            id: `ai-node-1-${Date.now()}`,
            title: `${params.techStack[0] || 'Core'} Architecture & State Machines`,
            subHeader: 'Milestone 01 • Fundamental Architecture & Execution Model',
            category: 'Core Competency',
            orderIndex: 1,
            status: 'IN_PROGRESS',
            score: 20,
            estimatedHours: Math.round(params.timelineWeeks * 3.5),
            whatShouldIDo: {
              summary: `Develop deep mastery of ${params.techStack.join(', ')}. Understand mental models, execution patterns, and performance limits for ${params.targetTier} engineering interviews.`,
              actionSteps: [
                `Analyze the runtime memory lifecycle and thread execution model of ${params.techStack[0] || 'your core stack'}.`,
                `Identify common latency anti-patterns in asynchronous pipelines and state propagation.`,
                `Build isolation boundaries around side effects to enable deterministic testing.`
              ],
              mentalModels: [
                'Execution Determinism: If a function depends on external state or time, encapsulate it behind an interface.',
                'Least Privilege Resource Access: Minimize shared mutable state across asynchronous boundaries.'
              ]
            },
            whatIsTheSource: [
              {
                id: 'ai-src-1a',
                title: `${params.techStack[0] || 'Technology'} Official Architecture Reference Guide`,
                url: 'https://github.com',
                type: 'DOCS',
                description: `Official documentation on concurrent runtime paradigms.`
              },
              {
                id: 'ai-src-1b',
                title: `${params.targetTier} System Engineering Standards & Clean Architecture`,
                url: 'https://martinfowler.com/architecture/',
                type: 'ARTICLE',
                description: 'Enterprise architectural patterns for distributed reliability.'
              }
            ],
            whatIsTheExactThing: {
              title: `${params.techStack[0] || 'High-Throughput'} Production Micro-Service Drill`,
              description: `Construct an end-to-end production module utilizing ${params.techStack.slice(0, 2).join(' & ')} handling real-time data ingestion with automated unit testing.`,
              deliverable: 'A tested code repository with benchmark logs demonstrating compliance with target latency SLOs.',
              starterCode: `// AI Generated Starter Drill: ${params.techStack[0] || 'Service'}\nexport async function handleIngestion(payload: Record<string, unknown>) {\n  // Implement validated business logic with zero blocking calls\n  return { success: true, timestamp: Date.now() };\n}`,
              verificationChecklist: [
                'Automated test coverage > 85%',
                'Zero memory leaks under simulated endurance test',
                'Proper error boundaries and telemetry'
              ]
            },
            microQuestions: [
              {
                id: 'ai-mq-1',
                questionText: `How would you diagnose and eliminate an unexpected P99 latency spike in ${params.techStack[0] || 'your service'}?`,
                focus: 'Performance Debugging',
                suggestedAnswer: 'Enable CPU profiling and distributed tracing (OpenTelemetry), trace slow database queries or GC pause times, and add metrics around external network dependencies.'
              }
            ]
          },
          {
            id: `ai-node-2-${Date.now()}`,
            title: `High-Availability Data Storage & ${params.targetTier} Scale Systems`,
            subHeader: 'Milestone 02 • Data Persistence & Scalability Patterns',
            category: 'Distributed Scale',
            orderIndex: 2,
            status: 'LOCKED',
            score: 0,
            estimatedHours: Math.round(params.timelineWeeks * 4.5),
            whatShouldIDo: {
              summary: `Address critical skill gaps: ${params.focusGaps || 'database indexing, caching layers, and distributed consensus'}. Scale persistence for high concurrent loads.`,
              actionSteps: [
                'Design partition keys and shard boundaries to prevent hot-spotting.',
                'Implement two-tier caching with TTL jitter and probabilistic early refresh.',
                'Analyze CAP theorem tradeoffs for read-heavy vs write-heavy workloads.'
              ],
              mentalModels: [
                'Sharding Principle: Pick a partition key with high cardinality and even distribution across nodes.',
                'Eventual Consistency: In distributed systems, sacrifice instant consistency for high availability and partition tolerance when appropriate.'
              ]
            },
            whatIsTheSource: [
              {
                id: 'ai-src-2a',
                title: 'Designing Data-Intensive Applications (Martin Kleppmann)',
                url: 'https://dataintensive.net/',
                type: 'BOOK',
                description: 'The industry-standard reference on storage engines, replication, and distributed consensus.'
              }
            ],
            whatIsTheExactThing: {
              title: 'Multi-Region Distributed Rate Limiting & Failover Service',
              description: `Implement an atomic distributed rate limiting and caching service handling 50,000 QPS with automatic fallback.`,
              deliverable: 'Deployable service with integration tests simulating redis node failures and network partitions.',
              verificationChecklist: [
                'Graceful degradation when primary cache node goes down',
                'Zero duplicate state writes during network partitions'
              ]
            },
            microQuestions: [
              {
                id: 'ai-mq-2',
                questionText: 'When would you prefer optimistic concurrency control over pessimistic row-level locking?',
                focus: 'Concurrency & Locking',
                suggestedAnswer: 'Optimistic concurrency control (via version numbers or timestamps) is preferred when read operations vastly outnumber writes and collision probability is low, avoiding database lock contention.'
              }
            ]
          },
          {
            id: `ai-node-3-${Date.now()}`,
            title: `System Resiliency, Observability & ${params.targetTier} Interview Defense`,
            subHeader: 'Milestone 03 • Production Readiness & Socratic Defense',
            category: 'Interview Mastery',
            orderIndex: 3,
            status: 'LOCKED',
            score: 0,
            estimatedHours: Math.round(params.timelineWeeks * 3.0),
            whatShouldIDo: {
              summary: `Prepare for ${params.targetTier} technical architecture rounds. Defend your design decisions and explain operational failure modes out loud.`,
              actionSteps: [
                'Formulate answers using the STAR format for behavioral and system architecture questions.',
                'Practice whiteboarding trade-offs between monolithic, microservice, and serverless approaches.',
                'Simulate real-time chaos engineering drills (circuit breakers, rate limiting, and backoff retries).'
              ],
              mentalModels: [
                'Defense First: Never state a technology choice without articulating at least two viable alternatives and why they were rejected.'
              ]
            },
            whatIsTheSource: [
              {
                id: 'ai-src-3a',
                title: 'Google SRE Book: Site Reliability Engineering',
                url: 'https://sre.google/sre-book/table-of-contents/',
                type: 'BOOK',
                description: 'How Google runs production systems with SLOs and error budgets.'
              }
            ],
            whatIsTheExactThing: {
              title: 'Ava AI Socratic Architectural Defense Simulation',
              description: 'Defend your end-to-end architecture against Ava Socratic challenge questions with real-time feedback on confidence, trade-off clarity, and technical depth.',
              deliverable: 'Full transcripts of Socratic defense passing the 85% benchmark score.',
              verificationChecklist: [
                'Articulate trade-offs of chosen database engine',
                'Demonstrate understanding of failover and disaster recovery'
              ]
            },
            microQuestions: [
              {
                id: 'ai-mq-3',
                questionText: `Walk through how you would architect a real-time tracking service at ${params.targetTier} scale from zero to 10M active users.`,
                focus: 'System Architecture Whiteboard',
                suggestedAnswer: 'Start with API Gateway and load balancers, horizontally scaled stateless application servers, Redis cluster for hot session data, Kafka for asynchronous event ingestion, and Cassandra or Postgres with read replicas for historical persistence.'
              }
            ]
          }
        ];

        const aiRoadmap: Roadmap = {
          id: `ai-roadmap-${Date.now()}`,
          title: `AI Curated ${params.rolePath} Mastery Blueprint`,
          rolePath: params.rolePath,
          category: (params.rolePath.toUpperCase() as any) || 'FULLSTACK',
          targetCompanyTier: (params.targetTier as any) || 'FAANG',
          difficulty: (params.difficulty as any) || 'Advanced',
          description: `Custom AI-synthesized career roadmap optimized for ${params.targetTier} standards, covering ${params.techStack.join(', ')} over ${params.timelineWeeks} weeks.`,
          estimatedWeeks: params.timelineWeeks,
          isOfficial: false,
          isPublic: true,
          isAiGenerated: true,
          creatorId: 'current-user',
          creatorName: 'You (AI Co-Pilot)',
          creatorUsername: 'you_ai',
          creatorRole: `Aspiring ${params.rolePath}`,
          overallReadiness: 15,
          enrolledCount: 1,
          upvotes: 1,
          tags: [...params.techStack, params.targetTier, `${params.timelineWeeks}w Track`],
          nodesData: generatedNodes,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          roadmaps: [aiRoadmap, ...state.roadmaps],
          enrolledRoadmapIds: [aiRoadmap.id, ...state.enrolledRoadmapIds],
          activeRoadmapId: aiRoadmap.id,
        }));

        apiClient.post('/roadmap/generate', {
          rolePath: params.rolePath,
          targetCompanyTier: params.targetTier,
          customTechStack: params.techStack.reduce((acc, curr, idx) => ({ ...acc, [`tech_${idx}`]: curr }), {}),
        }).catch(() => {
          // Gracefully persist locally
        });

        return aiRoadmap;
      },

      updateRoadmap: (id, updates) => {
        set((state) => ({
          roadmaps: state.roadmaps.map((r) =>
            r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r
          ),
        }));
      },

      deleteRoadmap: (id) => {
        set((state) => ({
          roadmaps: state.roadmaps.filter((r) => r.id !== id),
          enrolledRoadmapIds: state.enrolledRoadmapIds.filter((item) => item !== id),
          activeRoadmapId: state.activeRoadmapId === id ? null : state.activeRoadmapId,
        }));
      },

      completeNode: (roadmapId, nodeId, score = 95) => {
        const { roadmaps } = get();
        const roadmap = roadmaps.find((r) => r.id === roadmapId);
        if (!roadmap) return;

        const nodes = [...roadmap.nodesData];
        const targetIndex = nodes.findIndex((n) => n.id === nodeId);
        if (targetIndex === -1) return;

        nodes[targetIndex].status = 'MASTERED';
        nodes[targetIndex].score = score;

        // Unlock next node in sequence
        if (targetIndex + 1 < nodes.length && nodes[targetIndex + 1].status === 'LOCKED') {
          nodes[targetIndex + 1].status = 'IN_PROGRESS';
          nodes[targetIndex + 1].score = 40;
        }

        const masteredCount = nodes.filter((n) => n.status === 'MASTERED').length;
        const newReadiness = Math.min(100, Math.round((masteredCount / nodes.length) * 100));

        set({
          roadmaps: roadmaps.map((r) =>
            r.id === roadmapId
              ? { ...r, overallReadiness: newReadiness, nodesData: nodes, updatedAt: new Date().toISOString() }
              : r
          ),
        });

        apiClient.post(`/roadmap/${roadmapId}/attempt`, {
          nodeId,
          codeAnswer: 'Mastered via interactive sandbox',
        }).catch(() => {});
      },

      toggleChecklistItem: (roadmapId, nodeId, index) => {
        const key = `${roadmapId}_${nodeId}`;
        const current = get().completedChecklistItems[key] || [];
        const updated = current.includes(index)
          ? current.filter((i) => i !== index)
          : [...current, index];
        set((state) => ({
          completedChecklistItems: { ...state.completedChecklistItems, [key]: updated },
        }));
      },

      toggleSourceRead: (roadmapId, nodeId, sourceId) => {
        const key = `${roadmapId}_${nodeId}`;
        const current = get().readSourceIds[key] || [];
        const updated = current.includes(sourceId)
          ? current.filter((id) => id !== sourceId)
          : [...current, sourceId];
        set((state) => ({
          readSourceIds: { ...state.readSourceIds, [key]: updated },
        }));
      },

      saveNodeNotes: (roadmapId, nodeId, notes) => {
        const key = `${roadmapId}_${nodeId}`;
        set((state) => ({
          nodeNotes: { ...state.nodeNotes, [key]: notes },
        }));
      },

      saveNodeCode: (roadmapId, nodeId, code) => {
        const key = `${roadmapId}_${nodeId}`;
        set((state) => ({
          nodeCode: { ...state.nodeCode, [key]: code },
        }));
      },

      recordNodeSubmission: (roadmapId, nodeId, submission) => {
        const key = `${roadmapId}_${nodeId}`;
        set((state) => ({
          nodeSubmissions: { ...state.nodeSubmissions, [key]: submission },
        }));
      },

      syncWithBackend: async () => {
        try {
          const res = await apiClient.get('/roadmap');
          if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
            // merge backend roadmaps into local
            const backendMaps: Roadmap[] = res.data.data;
            const currentMaps = get().roadmaps;
            const existingIds = new Set(currentMaps.map((m) => m.id));
            const newFromBackend = backendMaps.filter((m) => !existingIds.has(m.id));
            if (newFromBackend.length > 0) {
              set({ roadmaps: [...newFromBackend, ...currentMaps] });
            }
          }
        } catch {
          // Backend may be offline; local state is preserved
        }
      },
    }),
    {
      name: 'ru-ready-career-roadmaps-v2',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
