export interface ProjectQuestion {
  question: string;
  interviewerIntent: string;
  idealAnswer: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  category: 'Full Stack' | 'AI / ML' | 'Systems & Cloud' | 'Real-Time Web';
  difficulty: 'Intermediate' | 'Advanced';
  tagline: string;
  techStack: string[];
  githubUrl: string;
  liveDemoUrl?: string;
  architectureOverview: string;
  coreFeatures: string[];
  databaseSchema: { table: string; description: string; columns: string[] }[];
  scalingChallenges: string[];
  interviewQuestions: ProjectQuestion[];
  starBullets: string[];
}

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: 'ecommerce-microservices',
    title: 'High-Throughput E-Commerce Microservices Engine',
    category: 'Full Stack',
    difficulty: 'Advanced',
    tagline: 'Event-driven distributed architecture with Kafka, Redis caching, and PostgreSQL',
    techStack: ['Node.js', 'TypeScript', 'Apache Kafka', 'Redis', 'PostgreSQL', 'Docker', 'Kubernetes'],
    githubUrl: 'https://github.com/ru-ready/ecommerce-microservices-blueprint',
    architectureOverview: 'Decomposed monolithic store into 4 independent containerized microservices: Auth & User Service, Product Catalog Service, Order Lifecycle Service, and Payment Processing Service communicating asynchronously via Kafka event streams with idempotent consumers.',
    coreFeatures: [
      'Event-driven order placement and inventory reservation using Kafka',
      'Distributed Redis cache with TTL and cache-aside invalidation',
      'Stripe webhook integration with duplicate transaction idempotency keys',
      'JWT authentication with rotating refresh tokens and RBAC middleware',
    ],
    databaseSchema: [
      { table: 'users', description: 'User credentials and hashed passwords', columns: ['id (UUID)', 'email', 'password_hash', 'role', 'created_at'] },
      { table: 'products', description: 'Product inventory items and pricing', columns: ['id (UUID)', 'title', 'sku', 'stock_quantity', 'price_cents'] },
      { table: 'orders', description: 'Order status and customer reference', columns: ['id (UUID)', 'user_id', 'status (PENDING, PAID, FAILED)', 'total_amount'] },
      { table: 'order_items', description: 'Items in an order with snapshot price', columns: ['id', 'order_id', 'product_id', 'quantity', 'unit_price'] },
    ],
    scalingChallenges: [
      'Distributed Transaction Rollback (Saga Pattern vs 2-Phase Commit)',
      'Preventing Race Conditions during Flash Sales using Redis Distributed Locks (Redlock)',
      'Handling Kafka consumer rebalances without message duplication',
    ],
    interviewQuestions: [
      {
        question: 'How did you handle distributed transactions when an order is placed but payment fails?',
        interviewerIntent: 'Checks if candidate understands distributed system failure modes and the Saga pattern.',
        idealAnswer: 'I implemented an Orchestration-based Saga pattern. When an order is initiated, the Order Service emits an OrderCreated event. The Inventory Service reserves stock. If the Payment Service subsequently emits a PaymentFailed event, the Order Orchestrator triggers a compensating transaction event (CancelInventoryReservation) that restores the reserved stock and marks the order as CANCELLED.',
      },
      {
        question: 'How do you prevent two users from purchasing the exact last item in stock concurrently?',
        interviewerIntent: 'Tests concurrency control, database isolation, or distributed locking.',
        idealAnswer: 'I utilized Redis distributed locks with an atomic Lua script for inventory decrements before persisting to PostgreSQL. In PostgreSQL, I enforced atomic updates using row-level locking: `UPDATE products SET stock = stock - 1 WHERE id = $1 AND stock > 0 RETURNING stock;`. If 0 rows are updated, the transaction is rejected gracefully.',
      },
    ],
    starBullets: [
      'Architected event-driven microservices processing 4,500 requests/sec with sub-45ms P99 latency.',
      'Mitigated flash sale race conditions using atomic Redis Lua scripts, achieving 100% inventory accuracy.',
      'Reduced database query load by 68% by implementing Redis cache-aside invalidation.',
    ],
  },
  {
    id: 'ai-rag-assistant',
    title: 'Enterprise RAG Document Intelligence Assistant',
    category: 'AI / ML',
    difficulty: 'Advanced',
    tagline: 'Multi-modal document vector search with semantic chunking and LLM re-ranking',
    techStack: ['Python', 'FastAPI', 'Qdrant / ChromaDB', 'LangChain', 'Gemini / Ollama', 'React', 'Docker'],
    githubUrl: 'https://github.com/ru-ready/enterprise-rag-assistant-blueprint',
    architectureOverview: 'End-to-end Retrieval-Augmented Generation pipeline. Ingests PDFs, Word docs, and markdown, applies semantic chunking with sliding overlaps, generates dense vector embeddings, stores in Qdrant Vector DB, and executes reciprocal rank fusion (RRF) before synthesis.',
    coreFeatures: [
      'Multi-format parser for PDFs, DOCX, and scanned documents with OCR',
      'Semantic chunking preserving table structures and header hierarchies',
      'Hybrid search combining dense vector similarity with sparse BM25 keyword search',
      'Hallucination guardrails and source citation references in generated responses',
    ],
    databaseSchema: [
      { table: 'documents', description: 'Uploaded files and metadata', columns: ['id (UUID)', 'filename', 'file_size', 'status', 'uploaded_at'] },
      { table: 'chunks', description: 'Extracted text snippets and embedding vector IDs', columns: ['id (UUID)', 'doc_id', 'chunk_index', 'text_content', 'token_count', 'vector_id'] },
      { table: 'chat_sessions', description: 'Conversation context and Q&A logs', columns: ['id', 'user_id', 'query', 'response', 'sources_json'] },
    ],
    scalingChallenges: [
      'Chunk boundary context loss for multi-page financial tables',
      'Latency optimization across embedding models and LLM token streaming',
      'Mitigating retrieval noise through cross-encoder re-ranking',
    ],
    interviewQuestions: [
      {
        question: 'Why did you choose Hybrid Search (Dense + Sparse BM25) instead of pure vector search?',
        interviewerIntent: 'Tests understanding of vector embedding limitations on exact acronyms, error codes, and specific serial numbers.',
        idealAnswer: 'Pure vector embeddings are excellent for semantic meaning, but struggle with exact keyword matching—such as specific error codes ("ERR_502_BAD_GATEWAY"), legal clause numbers ("Section 4.2.1"), or product SKU codes. Hybrid search combines dense semantic vectors with BM25 keyword frequency, scoring via Reciprocal Rank Fusion (RRF) to provide the highest retrieval accuracy.',
      },
    ],
    starBullets: [
      'Engineered a RAG pipeline cutting document search retrieval latency from 4.2s to 380ms.',
      'Improved answer accuracy by 34% by introducing Hybrid Search (BM25 + Dense) with Reciprocal Rank Fusion.',
      'Implemented streaming SSE responses with exact page-level source citations.',
    ],
  },
  {
    id: 'distributed-task-queue',
    title: 'Distributed Asynchronous Task Queue & Rate Limiter',
    category: 'Systems & Cloud',
    difficulty: 'Intermediate',
    tagline: 'High-throughput fault-tolerant task scheduler built in Go with Redis and Token Bucket limiter',
    techStack: ['Go', 'Redis', 'PostgreSQL', 'Docker', 'Prometheus', 'Grafana'],
    githubUrl: 'https://github.com/ru-ready/distributed-task-queue-blueprint',
    architectureOverview: 'Worker pool architecture with priority queues, exponential backoff retries, dead-letter queues (DLQ), and distributed sliding window rate limiting.',
    coreFeatures: [
      'Multi-worker concurrency pool with graceful shutdown signals (SIGINT/SIGTERM)',
      'Token Bucket and Sliding Window rate limiting per API client key',
      'Dead-Letter Queue (DLQ) with automatic alert dispatch for failing jobs',
      'Prometheus metric export for task throughput, failure rates, and worker latency',
    ],
    databaseSchema: [
      { table: 'tasks', description: 'Job records and lifecycle states', columns: ['id (UUID)', 'payload_json', 'status (QUEUED, RUNNING, COMPLETED, FAILED)', 'retry_count', 'scheduled_at'] },
    ],
    scalingChallenges: [
      'Preventing split-brain worker duplicate processing using atomic Redis locks',
      'Ensuring fair task distribution between heavy compute jobs and fast I/O jobs',
    ],
    interviewQuestions: [
      {
        question: 'How do you implement the Token Bucket rate-limiting algorithm in a distributed environment?',
        interviewerIntent: 'Checks low-level systems knowledge and race condition management.',
        idealAnswer: 'In a single server, token bucket uses a mutex and timestamp. In a distributed setting, storing bucket count and last refill timestamp in Redis with atomic Lua scripts prevents race conditions between multiple API gateways, evaluating tokens and updating timestamps in a single atomic Redis round-trip.',
      },
    ],
    starBullets: [
      'Engineered a Go-based task executor handling 12,000 background jobs/sec across 4 worker nodes.',
      'Reduced API abuse by 99.4% through a distributed Redis sliding-window rate limiter.',
      'Achieved zero task drops during rolling deploys using graceful OS termination signal handlers.',
    ],
  },
  {
    id: 'collab-whiteboard',
    title: 'Real-Time Collaborative Whiteboard & Code Canvas',
    category: 'Real-Time Web',
    difficulty: 'Intermediate',
    tagline: 'Conflict-free replicated data types (CRDTs) with WebSockets and Canvas API',
    techStack: ['React', 'TypeScript', 'WebSockets / Socket.io', 'Node.js', 'CRDTs (Yjs)', 'HTML5 Canvas'],
    githubUrl: 'https://github.com/ru-ready/realtime-whiteboard-blueprint',
    architectureOverview: 'Full-duplex real-time canvas enabling multiple remote users to draw, drop shapes, and write code concurrently without state collision using Yjs CRDTs.',
    coreFeatures: [
      'Real-time cursor tracking and presence indicators for up to 50 active room peers',
      'Vector drawing tools with freehand smoothing and shape recognition',
      'Automatic room state snapshotting and reconnection recovery over WebSockets',
    ],
    databaseSchema: [
      { table: 'whiteboards', description: 'Room data and creator details', columns: ['id (UUID)', 'title', 'room_code', 'created_by', 'created_at'] },
    ],
    scalingChallenges: [
      'Minimizing WebSocket payload sizes when sending rapid freehand drawing coordinates',
      'Handling offline edits and merging divergent branches upon network reconnect',
    ],
    interviewQuestions: [
      {
        question: 'How do CRDTs solve conflict resolution compared to Operational Transformation (OT)?',
        interviewerIntent: 'Tests understanding of modern collaborative architectures like Google Docs or Figma.',
        idealAnswer: 'Operational Transformation (OT) requires a central server to order and transform operations chronologically before broadcasting. CRDTs (Conflict-free Replicated Data Types) mathematically guarantee strong eventual consistency: peers can apply edits concurrently in any order, and their local states will converge deterministically without a central arbiter.',
      },
    ],
    starBullets: [
      'Delivered sub-25ms real-time stroke synchronization across 50 concurrent canvas participants.',
      'Eliminated state divergence using Yjs CRDTs with automatic offline reconnection synchronization.',
      'Optimized network payload by 82% through point batching and bezier curve path simplification.',
    ],
  },
];
