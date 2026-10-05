// ═══════════════════════════════════════════════════════════════
// Canonical Skill Taxonomy & Role Requirement Catalog
// Enterprise Knowledge Base for R U READY? Roadmap Engine
// ═══════════════════════════════════════════════════════════════

export interface TaxonomySkill {
  slug: string;
  name: string;
  category: string;
  description: string;
  prerequisites: string[]; // Slugs of skills that must precede this skill
}

export interface RoleSkillRequirement {
  skillSlug: string;
  targetProficiency: number; // 0 - 100 scale
  isCore?: boolean;
}

export interface CanonicalRoleDefinition {
  canonicalKey: string;
  title: string;
  description: string;
  skills: RoleSkillRequirement[];
}

// ─── 1. Canonical Skills Catalog ──────────────────────────────

export const SKILL_TAXONOMY: Record<string, TaxonomySkill> = {
  // ── Core CS & Programming Fundamentals ──
  'programming-fundamentals': {
    slug: 'programming-fundamentals',
    name: 'Programming Fundamentals & Control Flow',
    category: 'Programming',
    description: 'Variables, loops, conditionals, functions, recursion, and memory pointers.',
    prerequisites: [],
  },
  'oop-foundations': {
    slug: 'oop-foundations',
    name: 'Object-Oriented Programming (OOP)',
    category: 'OOP',
    description: 'Encapsulation, inheritance, polymorphism, abstraction, and SOLID principles.',
    prerequisites: ['programming-fundamentals'],
  },
  'data-structures-core': {
    slug: 'data-structures-core',
    name: 'Core Data Structures (Arrays, Lists, Stacks, Queues)',
    category: 'DSA',
    description: 'Linear data structures, dynamic array resizing, and memory layout.',
    prerequisites: ['programming-fundamentals'],
  },
  'algorithms-sorting-searching': {
    slug: 'algorithms-sorting-searching',
    name: 'Algorithms: Sorting, Searching & Complexity Analysis',
    category: 'DSA',
    description: 'Binary search, merge sort, quick sort, and Big-O asymptotic analysis.',
    prerequisites: ['data-structures-core'],
  },
  'trees-graphs-dsa': {
    slug: 'trees-graphs-dsa',
    name: 'Trees, Graphs & Advanced Algorithms',
    category: 'DSA',
    description: 'Binary search trees, BFS, DFS, Dijkstra, Dynamic Programming, and Topological Sort.',
    prerequisites: ['algorithms-sorting-searching'],
  },

  // ── Operating Systems, Linux & Networks ──
  'operating-systems-core': {
    slug: 'operating-systems-core',
    name: 'Operating Systems & Concurrency',
    category: 'Operating Systems',
    description: 'Processes, threads, CPU scheduling, deadlocks, virtual memory, and system calls.',
    prerequisites: ['programming-fundamentals'],
  },
  'linux-shell-scripting': {
    slug: 'linux-shell-scripting',
    name: 'Linux System Administration & Shell CLI',
    category: 'Linux',
    description: 'POSIX commands, bash scripting, file permissions, pipe I/O, and process signals.',
    prerequisites: [],
  },
  'computer-networks': {
    slug: 'computer-networks',
    name: 'Computer Networks & TCP/IP Protocols',
    category: 'Computer Networks',
    description: 'OSI model, TCP vs UDP handshakes, DNS resolution, TLS/SSL encryption, and HTTP lifecycle.',
    prerequisites: [],
  },
  'git-version-control': {
    slug: 'git-version-control',
    name: 'Git & Version Control Workflows',
    category: 'Git',
    description: 'Branching strategies, interactive rebasing, merge conflicts, pull request conventions.',
    prerequisites: [],
  },

  // ── Database Engineering & SQL ──
  'sql-foundations': {
    slug: 'sql-foundations',
    name: 'Relational Database Design & SQL Querying',
    category: 'SQL',
    description: 'Schema normalization (3NF), CRUD operations, joins, subqueries, and aggregate functions.',
    prerequisites: [],
  },
  'database-internals-indexing': {
    slug: 'database-internals-indexing',
    name: 'Database Internals, B-Trees & Query Optimization',
    category: 'DBMS',
    description: 'B-Tree vs GIN indexing, EXPLAIN query plans, ACID transaction isolation levels, and locks.',
    prerequisites: ['sql-foundations'],
  },

  // ── Frontend Engineering ──
  'html-css-dom': {
    slug: 'html-css-dom',
    name: 'Modern Semantic HTML, CSS & DOM Layouts',
    category: 'Frontend',
    description: 'Semantic markup, Flexbox, Grid, CSS animations, Responsive design, and Web Accessibility (a11y).',
    prerequisites: [],
  },
  'javascript-modern-es6': {
    slug: 'javascript-modern-es6',
    name: 'Modern JavaScript (ES2024+) & Async Engine',
    category: 'Programming',
    description: 'Closures, prototype chain, Promises, async/await, event loop microtasks, and DOM manipulation.',
    prerequisites: ['programming-fundamentals'],
  },
  'typescript-type-systems': {
    slug: 'typescript-type-systems',
    name: 'TypeScript & Advanced Static Type Systems',
    category: 'Programming',
    description: 'Generics, mapped types, conditional types, utility types, and strict runtime type safety.',
    prerequisites: ['javascript-modern-es6'],
  },
  'react-architecture': {
    slug: 'react-architecture',
    name: 'React 19 & Component Architecture',
    category: 'Frontend',
    description: 'Virtual DOM, Fiber reconciler, Hooks, State management (Zustand/Redux), and Server Actions.',
    prerequisites: ['javascript-modern-es6', 'typescript-type-systems', 'html-css-dom'],
  },

  // ── Backend Engineering & APIs ──
  'nodejs-async-runtime': {
    slug: 'nodejs-async-runtime',
    name: 'Node.js libuv Event Loop & Asynchronous I/O',
    category: 'Backend',
    description: 'Event loop phases, backpressure streams, worker threads, and cluster module for CPU workloads.',
    prerequisites: ['javascript-modern-es6', 'operating-systems-core'],
  },
  'rest-api-design': {
    slug: 'rest-api-design',
    name: 'RESTful API Design, Middleware & Authentication',
    category: 'APIs',
    description: 'Idempotent HTTP methods, status codes, JWT authentication, cookie sessions, rate limiting, and CORS.',
    prerequisites: ['computer-networks'],
  },

  // ── Distributed Systems, Caching & System Design ──
  'distributed-caching-redis': {
    slug: 'distributed-caching-redis',
    name: 'Distributed Caching & Redis Architecture',
    category: 'System Design',
    description: 'Cache-aside, write-through, eviction policies, token bucket rate limiters, and probabilistic early refresh.',
    prerequisites: ['database-internals-indexing', 'rest-api-design'],
  },
  'message-queues-kafka': {
    slug: 'message-queues-kafka',
    name: 'Event-Driven Architecture & Message Streaming (Kafka/RabbitMQ)',
    category: 'System Design',
    description: 'Pub/Sub topics, consumer groups, partition key hashing, outbox pattern, and idempotent consumer workers.',
    prerequisites: ['operating-systems-core', 'computer-networks'],
  },
  'system-design-hld': {
    slug: 'system-design-hld',
    name: 'High-Level System Design (HLD) & Distributed Scale',
    category: 'System Design',
    description: 'Load balancing, horizontal scaling, database sharding, CAP theorem trade-offs, consensus (Raft), and microservices.',
    prerequisites: ['distributed-caching-redis', 'message-queues-kafka', 'computer-networks'],
  },

  // ── DevOps & Cloud Engineering ──
  'docker-containerization': {
    slug: 'docker-containerization',
    name: 'Docker Containers & Multi-Stage Builds',
    category: 'DevOps',
    description: 'Dockerfile optimization, layers caching, namespaces, cgroups, and docker-compose networks.',
    prerequisites: ['linux-shell-scripting'],
  },
  'kubernetes-orchestration': {
    slug: 'kubernetes-orchestration',
    name: 'Kubernetes Pod Orchestration & Cluster Architecture',
    category: 'DevOps',
    description: 'Deployments, Services, Ingress, ConfigMaps, HPA autoscaling, liveness/readiness probes, and etcd.',
    prerequisites: ['docker-containerization', 'computer-networks'],
  },
  'ci-cd-github-actions': {
    slug: 'ci-cd-github-actions',
    name: 'CI/CD Pipelines, Infrastructure as Code & Observability',
    category: 'DevOps',
    description: 'Automated test runners, GitHub Actions workflows, Terraform provisioning, Prometheus metrics, and OpenTelemetry.',
    prerequisites: ['docker-containerization', 'git-version-control'],
  },

  // ── Data Science, Analytics & AI/ML ──
  'python-data-stack': {
    slug: 'python-data-stack',
    name: 'Python for High-Performance Data Engineering (NumPy & Pandas)',
    category: 'AI/ML',
    description: 'Vectorized operations, DataFrame indexing, memory downcasting, and analytical transformations.',
    prerequisites: ['programming-fundamentals'],
  },
  'statistics-probability': {
    slug: 'statistics-probability',
    name: 'Statistics, Probability & Hypothesis Testing',
    category: 'Data Science',
    description: 'Descriptive statistics, distributions, p-values, hypothesis testing, confidence intervals, and Bayes theorem.',
    prerequisites: [],
  },
  'exploratory-data-analysis': {
    slug: 'exploratory-data-analysis',
    name: 'Exploratory Data Analysis (EDA) & Data Visualization',
    category: 'Data Science',
    description: 'Data profiling, missing value imputation, outlier detection, Seaborn/Matplotlib visualization, and feature distributions.',
    prerequisites: ['python-data-stack'],
  },
  'business-intelligence-bi': {
    slug: 'business-intelligence-bi',
    name: 'Business Intelligence, Dashboards & KPI Storytelling',
    category: 'Data Analytics',
    description: 'Interactive executive dashboards, KPI modeling, SQL analytical queries, data warehousing concepts, and data storytelling.',
    prerequisites: ['sql-foundations'],
  },
  'machine-learning-foundations': {
    slug: 'machine-learning-foundations',
    name: 'Machine Learning & Neural Network Foundations',
    category: 'AI/ML',
    description: 'Linear/logistic regression, loss functions, gradient descent, backpropagation, and PyTorch tensors.',
    prerequisites: ['python-data-stack', 'statistics-probability'],
  },
  'deep-learning-neural-networks': {
    slug: 'deep-learning-neural-networks',
    name: 'Deep Learning, PyTorch & Neural Architectures',
    category: 'AI/ML',
    description: 'Deep neural networks, backpropagation, PyTorch tensors, CNNs, Transformers, and GPU training optimization.',
    prerequisites: ['machine-learning-foundations'],
  },
  'rag-vector-search': {
    slug: 'rag-vector-search',
    name: 'RAG Architecture, Embeddings & Vector Search (Pinecone/Qdrant)',
    category: 'AI/ML',
    description: 'Dense vs sparse retrieval, cosine similarity, chunking strategies, hybrid search, and prompt engineering.',
    prerequisites: ['machine-learning-foundations', 'computer-networks'],
  },
  'llm-fine-tuning-inference': {
    slug: 'llm-fine-tuning-inference',
    name: 'LLM Fine-Tuning (LoRA/QLoRA) & Scalable vLLM Serving',
    category: 'AI/ML',
    description: 'Transformer architecture, KV caching, tokenization, LoRA adapters, quantization, and high-throughput inference.',
    prerequisites: ['deep-learning-neural-networks', 'rag-vector-search'],
  },
};

// ─── 2. Canonical Roles Catalog ───────────────────────────────

export const CANONICAL_ROLES: Record<string, CanonicalRoleDefinition> = {
  FULLSTACK: {
    canonicalKey: 'FULLSTACK',
    title: 'Senior Fullstack & Cloud Systems Architect',
    description: 'End-to-end fullstack development encompassing React 19, TypeScript, Node.js concurrency, PostgreSQL indexing, and distributed caching.',
    skills: [
      { skillSlug: 'html-css-dom', targetProficiency: 85, isCore: true },
      { skillSlug: 'javascript-modern-es6', targetProficiency: 90, isCore: true },
      { skillSlug: 'typescript-type-systems', targetProficiency: 85, isCore: true },
      { skillSlug: 'react-architecture', targetProficiency: 90, isCore: true },
      { skillSlug: 'nodejs-async-runtime', targetProficiency: 85, isCore: true },
      { skillSlug: 'rest-api-design', targetProficiency: 85, isCore: true },
      { skillSlug: 'sql-foundations', targetProficiency: 85, isCore: true },
      { skillSlug: 'database-internals-indexing', targetProficiency: 80, isCore: true },
      { skillSlug: 'distributed-caching-redis', targetProficiency: 75, isCore: true },
      { skillSlug: 'git-version-control', targetProficiency: 80, isCore: false },
      { skillSlug: 'docker-containerization', targetProficiency: 75, isCore: false },
    ],
  },

  FRONTEND: {
    canonicalKey: 'FRONTEND',
    title: 'Senior Frontend & Web Application Architect',
    description: 'Modern component systems, web performance, state management, TypeScript type safety, and responsive accessible UI/UX.',
    skills: [
      { skillSlug: 'html-css-dom', targetProficiency: 90, isCore: true },
      { skillSlug: 'javascript-modern-es6', targetProficiency: 90, isCore: true },
      { skillSlug: 'typescript-type-systems', targetProficiency: 85, isCore: true },
      { skillSlug: 'react-architecture', targetProficiency: 90, isCore: true },
      { skillSlug: 'rest-api-design', targetProficiency: 80, isCore: true },
      { skillSlug: 'git-version-control', targetProficiency: 80, isCore: false },
    ],
  },

  BACKEND: {
    canonicalKey: 'BACKEND',
    title: 'High-Throughput Backend & Distributed Systems Engineer',
    description: 'Specialized in asynchronous microservices, database engine optimization, distributed caching, message queues, and high availability.',
    skills: [
      { skillSlug: 'programming-fundamentals', targetProficiency: 90, isCore: true },
      { skillSlug: 'oop-foundations', targetProficiency: 85, isCore: true },
      { skillSlug: 'operating-systems-core', targetProficiency: 85, isCore: true },
      { skillSlug: 'computer-networks', targetProficiency: 85, isCore: true },
      { skillSlug: 'nodejs-async-runtime', targetProficiency: 90, isCore: true },
      { skillSlug: 'rest-api-design', targetProficiency: 90, isCore: true },
      { skillSlug: 'sql-foundations', targetProficiency: 90, isCore: true },
      { skillSlug: 'database-internals-indexing', targetProficiency: 85, isCore: true },
      { skillSlug: 'distributed-caching-redis', targetProficiency: 85, isCore: true },
      { skillSlug: 'message-queues-kafka', targetProficiency: 80, isCore: true },
      { skillSlug: 'system-design-hld', targetProficiency: 80, isCore: true },
      { skillSlug: 'docker-containerization', targetProficiency: 75, isCore: false },
    ],
  },

  DATA_SCIENTIST: {
    canonicalKey: 'DATA_SCIENTIST',
    title: 'Lead Data Scientist & Applied Machine Learning Specialist',
    description: 'Statistical modeling, exploratory data analysis, feature engineering, machine learning pipelines, and deep learning architectures.',
    skills: [
      { skillSlug: 'programming-fundamentals', targetProficiency: 90, isCore: true },
      { skillSlug: 'python-data-stack', targetProficiency: 90, isCore: true },
      { skillSlug: 'sql-foundations', targetProficiency: 85, isCore: true },
      { skillSlug: 'statistics-probability', targetProficiency: 90, isCore: true },
      { skillSlug: 'exploratory-data-analysis', targetProficiency: 85, isCore: true },
      { skillSlug: 'machine-learning-foundations', targetProficiency: 90, isCore: true },
      { skillSlug: 'deep-learning-neural-networks', targetProficiency: 80, isCore: true },
      { skillSlug: 'git-version-control', targetProficiency: 80, isCore: false },
    ],
  },

  DATA_ANALYST: {
    canonicalKey: 'DATA_ANALYST',
    title: 'Senior Data & Business Intelligence Analyst',
    description: 'Advanced SQL data extraction, exploratory data analysis, statistical insights, KPI dashboard design, and business data storytelling.',
    skills: [
      { skillSlug: 'sql-foundations', targetProficiency: 90, isCore: true },
      { skillSlug: 'database-internals-indexing', targetProficiency: 80, isCore: false },
      { skillSlug: 'python-data-stack', targetProficiency: 80, isCore: true },
      { skillSlug: 'statistics-probability', targetProficiency: 85, isCore: true },
      { skillSlug: 'exploratory-data-analysis', targetProficiency: 90, isCore: true },
      { skillSlug: 'business-intelligence-bi', targetProficiency: 90, isCore: true },
      { skillSlug: 'git-version-control', targetProficiency: 75, isCore: false },
    ],
  },

  AIML: {
    canonicalKey: 'AIML',
    title: 'Generative AI, LLM & RAG Systems Engineer',
    description: 'Production AI engineering covering Python vectorization, Neural Networks, Retrieval-Augmented Generation, and LLM fine-tuning.',
    skills: [
      { skillSlug: 'programming-fundamentals', targetProficiency: 90, isCore: true },
      { skillSlug: 'python-data-stack', targetProficiency: 90, isCore: true },
      { skillSlug: 'statistics-probability', targetProficiency: 85, isCore: true },
      { skillSlug: 'machine-learning-foundations', targetProficiency: 85, isCore: true },
      { skillSlug: 'deep-learning-neural-networks', targetProficiency: 85, isCore: true },
      { skillSlug: 'rag-vector-search', targetProficiency: 90, isCore: true },
      { skillSlug: 'llm-fine-tuning-inference', targetProficiency: 80, isCore: true },
      { skillSlug: 'rest-api-design', targetProficiency: 80, isCore: true },
      { skillSlug: 'docker-containerization', targetProficiency: 75, isCore: false },
      { skillSlug: 'git-version-control', targetProficiency: 80, isCore: false },
    ],
  },

  DEVOPS: {
    canonicalKey: 'DEVOPS',
    title: 'Cloud Native DevOps & Site Reliability Engineer (SRE)',
    description: 'Infrastructure automation, Kubernetes pod orchestration, CI/CD pipelines, distributed telemetry, and Linux kernel reliability.',
    skills: [
      { skillSlug: 'linux-shell-scripting', targetProficiency: 90, isCore: true },
      { skillSlug: 'computer-networks', targetProficiency: 85, isCore: true },
      { skillSlug: 'operating-systems-core', targetProficiency: 80, isCore: true },
      { skillSlug: 'git-version-control', targetProficiency: 85, isCore: true },
      { skillSlug: 'docker-containerization', targetProficiency: 90, isCore: true },
      { skillSlug: 'kubernetes-orchestration', targetProficiency: 90, isCore: true },
      { skillSlug: 'ci-cd-github-actions', targetProficiency: 85, isCore: true },
      { skillSlug: 'rest-api-design', targetProficiency: 75, isCore: false },
      { skillSlug: 'distributed-caching-redis', targetProficiency: 70, isCore: false },
    ],
  },

  SYSTEM_DESIGN: {
    canonicalKey: 'SYSTEM_DESIGN',
    title: 'Staff Distributed System Architect',
    description: 'Large-scale distributed systems architecture, event streaming, data partitioning, consensus protocols, and fault tolerance.',
    skills: [
      { skillSlug: 'computer-networks', targetProficiency: 90, isCore: true },
      { skillSlug: 'operating-systems-core', targetProficiency: 90, isCore: true },
      { skillSlug: 'database-internals-indexing', targetProficiency: 90, isCore: true },
      { skillSlug: 'distributed-caching-redis', targetProficiency: 90, isCore: true },
      { skillSlug: 'message-queues-kafka', targetProficiency: 90, isCore: true },
      { skillSlug: 'system-design-hld', targetProficiency: 95, isCore: true },
      { skillSlug: 'trees-graphs-dsa', targetProficiency: 80, isCore: true },
      { skillSlug: 'docker-containerization', targetProficiency: 80, isCore: false },
    ],
  },
};

// ─── 3. Role Alias Normalization Table ────────────────────────

export const ROLE_ALIASES: Record<string, string> = {
  // Fullstack aliases
  'fullstack': 'FULLSTACK',
  'full stack': 'FULLSTACK',
  'full-stack': 'FULLSTACK',
  'fullstack web engineer': 'FULLSTACK',
  'full stack software engineer': 'FULLSTACK',
  'fullstack developer': 'FULLSTACK',
  'full stack developer': 'FULLSTACK',
  'senior fullstack web engineer': 'FULLSTACK',
  'web development': 'FULLSTACK',
  'web developer': 'FULLSTACK',

  // Frontend aliases
  'frontend': 'FRONTEND',
  'front-end': 'FRONTEND',
  'front end': 'FRONTEND',
  'frontend developer': 'FRONTEND',
  'front end developer': 'FRONTEND',
  'frontend engineer': 'FRONTEND',
  'front end engineer': 'FRONTEND',
  'ui engineer': 'FRONTEND',
  'react developer': 'FRONTEND',
  'ui developer': 'FRONTEND',

  // Backend aliases
  'backend': 'BACKEND',
  'back end': 'BACKEND',
  'back-end': 'BACKEND',
  'backend engineer': 'BACKEND',
  'backend developer': 'BACKEND',
  'backend software engineer': 'BACKEND',
  'node.js developer': 'BACKEND',
  'server engineer': 'BACKEND',

  // Data Scientist aliases
  'data scientist': 'DATA_SCIENTIST',
  'data science': 'DATA_SCIENTIST',
  'lead data scientist': 'DATA_SCIENTIST',
  'applied data scientist': 'DATA_SCIENTIST',
  'senior data scientist': 'DATA_SCIENTIST',

  // Data Analyst aliases
  'data analyst': 'DATA_ANALYST',
  'data analytics': 'DATA_ANALYST',
  'data analysis': 'DATA_ANALYST',
  'business intelligence analyst': 'DATA_ANALYST',
  'bi analyst': 'DATA_ANALYST',
  'data analytics engineer': 'DATA_ANALYST',
  'quantitative analyst': 'DATA_ANALYST',
  'senior data analyst': 'DATA_ANALYST',

  // AI / ML aliases
  'aiml': 'AIML',
  'ai/ml': 'AIML',
  'ai-ml': 'AIML',
  'ai ml': 'AIML',
  'ai': 'AIML',
  'ml': 'AIML',
  'ai engineer': 'AIML',
  'ml engineer': 'AIML',
  'machine learning engineer': 'AIML',
  'machine learning': 'AIML',
  'ai / ml specialist': 'AIML',
  'ai / ml & llm specialist': 'AIML',
  'llm engineer': 'AIML',
  'llm specialist': 'AIML',
  'deep learning engineer': 'AIML',

  // DevOps & Cloud aliases
  'devops': 'DEVOPS',
  'dev ops': 'DEVOPS',
  'dev-ops': 'DEVOPS',
  'sre': 'DEVOPS',
  'site reliability engineer': 'DEVOPS',
  'cloud engineer': 'DEVOPS',
  'cloud native devops': 'DEVOPS',
  'cloud architect': 'DEVOPS',
  'infrastructure engineer': 'DEVOPS',

  // System Design aliases
  'system_design': 'SYSTEM_DESIGN',
  'system design': 'SYSTEM_DESIGN',
  'systems design': 'SYSTEM_DESIGN',
  'distributed systems': 'SYSTEM_DESIGN',
  'distributed systems engineer': 'SYSTEM_DESIGN',
  'systems architect': 'SYSTEM_DESIGN',
  'software architect': 'SYSTEM_DESIGN',
  'system design & architecture': 'SYSTEM_DESIGN',
};
