export interface GeneratedMilestone {
  title: string;
  description: string;
  type: 'MILESTONE' | 'PROJECT' | 'TASK';
  position: number;
  interview?: { topic: string; description: string };
  children?: Array<{ title: string; description: string }>;
}

export interface GeneratedRoadmapData {
  title: string;
  description: string;
  goal: string;
  category: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  estimatedWeeks: number;
  tags: string[];
  nodes: GeneratedMilestone[];
}

export function generateSmartRoadmap(params: {
  goal: string;
  role?: string;
  level?: string;
  weeks?: number;
  title?: string;
}): GeneratedRoadmapData {
  const goalLower = (params.goal || '').toLowerCase();
  const roleLower = (params.role || '').toLowerCase();
  const combined = `${goalLower} ${roleLower}`;

  const level = (params.level?.toUpperCase() || 'INTERMEDIATE') as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  const targetWeeks = params.weeks || (level === 'BEGINNER' ? 12 : level === 'ADVANCED' ? 16 : 10);

  // Frontend check
  if (combined.includes('front') || combined.includes('react') || combined.includes('vue') || combined.includes('next') || combined.includes('css') || combined.includes('ui/ux') || combined.includes('web dev')) {
    return {
      title: params.title || (params.role ? `${params.role} Mastery Path` : 'Modern Frontend Architecture & React'),
      description: `A focused ${targetWeeks}-week roadmap to build production-grade web applications, master component design systems, and pass frontend technical interviews.`,
      goal: params.goal,
      category: 'Frontend Engineering',
      difficulty: level,
      estimatedWeeks: targetWeeks,
      tags: ['HTML5/CSS3', 'TypeScript', 'React', 'Next.js', 'Tailwind CSS', 'State Management'],
      nodes: [
        {
          title: 'Semantic Foundations & Modern CSS Architecture',
          description: 'Master semantic HTML, accessible ARIA patterns, CSS Grid/Flexbox layouts, and Tailwind CSS design systems.',
          type: 'MILESTONE',
          position: 0,
          interview: { topic: 'CSS Layouts, Accessibility & Web Standards', description: 'Be prepared to explain CSS specificity, responsive design strategies, and WCAG accessibility standards.' },
          children: [
            { title: 'Responsive Layouts & CSS Grid', description: 'Build fluid multi-device layouts without media query bloat.' },
            { title: 'Accessibility (a11y) & ARIA', description: 'Ensure keyboard navigation and screen-reader compliance.' },
          ],
        },
        {
          title: 'TypeScript & Modern JavaScript In-Depth',
          description: 'Deep dive into event loop concurrency, closures, async/await, generics, and strict TypeScript types.',
          type: 'MILESTONE',
          position: 1,
          interview: { topic: 'JavaScript Concurrency & Async Architecture', description: 'Discuss event loop microtasks vs macrotasks, memory leaks, and TypeScript utility types.' },
          children: [
            { title: 'Generics & Advanced TypeScript', description: 'Model complex domain types safely with zero runtime overhead.' },
            { title: 'Async Patterns & Browser APIs', description: 'Handle WebSockets, IndexedDB, and Fetch abort controllers.' },
          ],
        },
        {
          title: 'Component Architecture with React & Next.js',
          description: 'Architect scalable component trees, Server Components, client state stores (Zustand), and memoization.',
          type: 'MILESTONE',
          position: 2,
          interview: { topic: 'React Fiber, Reconciliation & Performance', description: 'Explain re-rendering optimization, useMemo/useCallback tradeoffs, and Server Components.' },
          children: [
            { title: 'Next.js App Router & SSR', description: 'Optimize Core Web Vitals with streaming and server rendering.' },
            { title: 'State Architecture', description: 'Separate server cache (React Query) from client interaction state.' },
          ],
        },
        {
          title: 'Production Capstone: Interactive Web Application',
          description: 'Build and ship an end-to-end web product with authentication, real-time sync, and automated CI/CD.',
          type: 'PROJECT',
          position: 3,
          interview: { topic: 'Frontend System Design & Architecture', description: 'Present your project architecture, state management strategy, and security defenses.' },
          children: [
            { title: 'Testing Suite', description: 'Write unit tests with Vitest and E2E journeys with Playwright.' },
            { title: 'Performance Audit', description: 'Achieve 95+ Lighthouse scores and sub-second Largest Contentful Paint.' },
          ],
        },
        {
          title: 'Frontend Technical Interview Readiness',
          description: 'Practice live machine coding challenges, polyfills (Promise.all, debounce), and behavioral questions.',
          type: 'MILESTONE',
          position: 4,
          interview: { topic: 'Frontend Machine Coding & Live Problem Solving', description: 'Live coding problem solving under time pressure with an AI interviewer.' },
          children: [
            { title: 'Polyfill Implementation', description: 'Code custom implementations of Array methods and custom hooks.' },
            { title: 'Mock Technical Interview', description: 'Run timed mock interview sessions with real-time feedback.' },
          ],
        },
      ],
    };
  }

  // AI / ML check
  if (combined.includes('ai') || combined.includes('ml') || combined.includes('machine learning') || combined.includes('deep learning') || combined.includes('llm') || combined.includes('nlp') || combined.includes('rag') || combined.includes('gpt')) {
    return {
      title: params.title || (params.role ? `${params.role} Roadmap` : 'Full-Stack AI & LLM Systems Engineering'),
      description: `A rigorous ${targetWeeks}-week curriculum to master generative AI, RAG architectures, vector search, and production agent deployment.`,
      goal: params.goal,
      category: 'Artificial Intelligence',
      difficulty: level,
      estimatedWeeks: targetWeeks,
      tags: ['Python', 'PyTorch', 'Vector DBs', 'RAG', 'LangChain', 'LLMs', 'Agentic AI'],
      nodes: [
        {
          title: 'Python for AI & Concurrency Mechanics',
          description: 'Master asynchronous Python, NumPy vectorization, data pipelines, and tokenizer mechanics.',
          type: 'MILESTONE',
          position: 0,
          interview: { topic: 'Python Internals & Matrix Operations', description: 'Explain Python GIL, memory management, and NumPy broadcast semantics.' },
          children: [
            { title: 'Async Python & Fast APIs', description: 'Build low-latency streaming endpoints with FastAPI and asyncio.' },
            { title: 'Data Wrangling', description: 'Clean and tokenize multimodal training datasets efficiently.' },
          ],
        },
        {
          title: 'Prompt Engineering & Structured Outputs',
          description: 'Design few-shot prompt frameworks, JSON schema validations, and deterministic tool-calling schemas.',
          type: 'MILESTONE',
          position: 1,
          interview: { topic: 'LLM Mechanics & Hallucination Mitigation', description: 'Discuss context windows, attention mechanisms, temperature, and verification loops.' },
          children: [
            { title: 'Function Calling & Tools', description: 'Equip models with SQL querying, search APIs, and calculator tools.' },
            { title: 'Guardrails & Safety', description: 'Implement PII redaction, prompt injection defense, and output parsers.' },
          ],
        },
        {
          title: 'Retrieval Augmented Generation (RAG) Architecture',
          description: 'Construct hybrid semantic search pipelines using vector databases (Pinecone/pgvector) and reranking models.',
          type: 'MILESTONE',
          position: 2,
          interview: { topic: 'Vector Search & Embedding Spaces', description: 'Compare cosine similarity, HNSW indexes, chunking strategies, and BM25 hybrid search.' },
          children: [
            { title: 'Document Chunking & Embeddings', description: 'Evaluate semantic vs sliding window chunking strategies.' },
            { title: 'Rerankers & Query Expansion', description: 'Boost context relevance with cross-encoder reranking.' },
          ],
        },
        {
          title: 'Autonomous Multi-Agent Orchestration',
          description: 'Build stateful multi-agent systems with loop feedback, persistent memory, and subagent delegation.',
          type: 'PROJECT',
          position: 3,
          interview: { topic: 'Agentic Architectures & State Graphs', description: 'Explain cycle detection, self-reflection agents, and distributed task execution.' },
          children: [
            { title: 'State Graphs & Memory', description: 'Manage short-term scratchpad and long-term episodic memory.' },
            { title: 'Evaluation Benchmark Suite', description: 'Score precision, recall, and faithfulness with automated LLM judges.' },
          ],
        },
        {
          title: 'Production AI Deployment & System Design',
          description: 'Deploy models with streaming SSE responses, rate limiting, semantic caching, and cost monitoring.',
          type: 'MILESTONE',
          position: 4,
          interview: { topic: 'AI Systems Architecture & Cost Optimization', description: 'Design a high-throughput RAG search platform handling 10,000 queries per second.' },
          children: [
            { title: 'Semantic Caching with Redis', description: 'Dramatically reduce token costs by caching similar query vectors.' },
            { title: 'Live Mock AI Interview', description: 'Simulate a comprehensive machine learning system design interview.' },
          ],
        },
      ],
    };
  }

  // DevOps / Cloud / SRE
  if (combined.includes('devops') || combined.includes('sre') || combined.includes('cloud') || combined.includes('kubernetes') || combined.includes('docker') || combined.includes('aws') || combined.includes('terraform')) {
    return {
      title: params.title || (params.role ? `${params.role} Career Path` : 'Cloud Native DevOps & Infrastructure Engineering'),
      description: `An intensive ${targetWeeks}-week journey mastering Linux, containers, Kubernetes, Infrastructure as Code, and resilient CI/CD pipelines.`,
      goal: params.goal,
      category: 'DevOps & Cloud',
      difficulty: level,
      estimatedWeeks: targetWeeks,
      tags: ['Linux', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'AWS', 'Grafana'],
      nodes: [
        {
          title: 'Linux Systems, Networking & Security',
          description: 'Master bash automation, systemd process supervision, networking primitives (DNS, TCP, TLS), and firewall rules.',
          type: 'MILESTONE',
          position: 0,
          interview: { topic: 'Linux Internals & Network Troubleshooting', description: 'Troubleshoot dropped packets, zombie processes, and SSL handshake failures in live scenarios.' },
          children: [
            { title: 'Shell Scripting & Cron', description: 'Automate health monitoring and log rotation workflows.' },
            { title: 'TLS & Certificate Management', description: 'Configure automated Let’s Encrypt cert issuance and mutual TLS.' },
          ],
        },
        {
          title: 'Containerization & Docker Orchestration',
          description: 'Build secure, minimized multi-stage Docker images, enforce non-root execution, and orchestrate with Docker Compose.',
          type: 'MILESTONE',
          position: 1,
          interview: { topic: 'Container Runtimes, Namespaces & Cgroups', description: 'Explain Linux kernel namespaces, cgroups resource throttling, and container security isolation.' },
          children: [
            { title: 'Multi-Stage Optimization', description: 'Shrink container images from 1GB+ down to distroless under 50MB.' },
            { title: 'Container Security Scanning', description: 'Integrate Trivy vulnerability scanners into automated builds.' },
          ],
        },
        {
          title: 'Production Kubernetes Cluster Management',
          description: 'Deploy and scale workloads with Deployments, StatefulSets, Services, Ingress controllers, and Helm charts.',
          type: 'MILESTONE',
          position: 2,
          interview: { topic: 'Kubernetes Architecture & Fault Tolerance', description: 'Explain etcd consensus, kube-controller reconciliation loops, and zero-downtime rolling updates.' },
          children: [
            { title: 'Helm Charts & Packaging', description: 'Create parameterized application templates for dev, staging, and prod.' },
            { title: 'Auto-Scaling & Health Probes', description: 'Configure HPA (Horizontal Pod Autoscaler) and liveness/readiness probes.' },
          ],
        },
        {
          title: 'Infrastructure as Code (Terraform) & Cloud Architecture',
          description: 'Provision AWS/GCP resources declaratively with Terraform modules, remote state locking, and least-privilege IAM.',
          type: 'PROJECT',
          position: 3,
          interview: { topic: 'Cloud Architecture & Disaster Recovery', description: 'Design a multi-region highly available infrastructure with automated failover.' },
          children: [
            { title: 'Reusable Terraform Modules', description: 'Structure VPC, subnets, and RDS database clusters cleanly.' },
            { title: 'State Locking with DynamoDB', description: 'Prevent concurrent infrastructure mutations across engineering teams.' },
          ],
        },
        {
          title: 'CI/CD Pipelines, Observability & Incident Response',
          description: 'Build automated GitHub Actions workflows, instrument Prometheus metrics, and set up alertmanager notifications.',
          type: 'MILESTONE',
          position: 4,
          interview: { topic: 'DevOps & SRE Systems Design Interview', description: 'Simulate high-severity outage triage and present a post-mortem blameless review.' },
          children: [
            { title: 'Blue-Green / Canary Deployments', description: 'Roll out zero-downtime releases with traffic splitting.' },
            { title: 'Mock SRE Scenario Interview', description: 'Practice live system triage with an AI interviewer.' },
          ],
        },
      ],
    };
  }

  // DSA / Interview Prep
  if (combined.includes('interview') || combined.includes('dsa') || combined.includes('leetcode') || combined.includes('algorithm') || combined.includes('faang') || combined.includes('coding prep')) {
    return {
      title: params.title || (params.role ? `${params.role} Interview Loop` : 'FAANG Technical Interview Preparation Roadmap'),
      description: `A comprehensive ${targetWeeks}-week preparation loop covering high-frequency algorithmic patterns, system design, and behavioral storytelling.`,
      goal: params.goal,
      category: 'Interview Preparation',
      difficulty: level,
      estimatedWeeks: targetWeeks,
      tags: ['Data Structures', 'Algorithms', 'System Design', 'Mock Interviews', 'Behavioral STAR'],
      nodes: [
        {
          title: 'Algorithmic Patterns: Pointers, Sliding Window & Hash Maps',
          description: 'Master two pointers, sliding window optimizations, prefix sums, and fast frequency lookups with rigorous Big-O proofs.',
          type: 'MILESTONE',
          position: 0,
          interview: { topic: 'Array & String Algorithmic Optimization', description: 'Solve live algorithmic problems explaining space-time complexity trade-offs.' },
          children: [
            { title: 'Two Pointers & Sliding Window', description: 'Solve 20 high-frequency substring and interval problems.' },
            { title: 'Hash Table Optimizations', description: 'Design O(1) LRU Cache and amortized lookup structures.' },
          ],
        },
        {
          title: 'Trees, Graphs & Dynamic Programming',
          description: 'Master binary search trees, BFS/DFS graph traversals, Dijkstra shortest path, and 1D/2D dynamic programming memoization.',
          type: 'MILESTONE',
          position: 1,
          interview: { topic: 'Graph Traversals & Recursion Unwinding', description: 'Explain cycle detection, topological sorting, and state-transition DP tables.' },
          children: [
            { title: 'Graph Traversal Patterns', description: 'Implement topological sort and minimum spanning tree algorithms.' },
            { title: 'Dynamic Programming Mastery', description: 'Break down Knapsack and Longest Common Subsequence subproblems.' },
          ],
        },
        {
          title: 'Large-Scale System Design Fundamentals',
          description: 'Design distributed architectures: database sharding, caching tiers, consistent hashing, message brokers, and rate limiters.',
          type: 'MILESTONE',
          position: 2,
          interview: { topic: 'System Design: Scaling to 100M Daily Users', description: 'Whiteboard a live distributed system handling high concurrency and strict SLAs.' },
          children: [
            { title: 'Distributed Caching & Sharding', description: 'Compare master-replica replication with distributed quorum writes.' },
            { title: 'Event-Driven Architecture', description: 'Decouple ingestion bottlenecks with Kafka partitioned streams.' },
          ],
        },
        {
          title: 'Executive Behavioral & Leadership Stories (STAR Method)',
          description: 'Craft structured Situation-Task-Action-Result narratives demonstrating technical ownership, mentorship, and resolving conflict.',
          type: 'MILESTONE',
          position: 3,
          interview: { topic: 'Executive Behavioral Leadership Simulation', description: 'Answer tough behavioral questions evaluating leadership principles and ambiguity handling.' },
          children: [
            { title: 'Story Bank Matrix', description: 'Draft 5 adaptable stories covering cross-team friction, failures, and ownership.' },
            { title: 'Concise STAR Delivery', description: 'Practice 2-minute crisp responses without rambling.' },
          ],
        },
        {
          title: 'Final Full-Loop Mock Interview Simulation',
          description: 'Execute realistic, timed mock interviews across coding, system design, and behavioral stages with immediate rubric scoring.',
          type: 'PROJECT',
          position: 4,
          interview: { topic: 'Comprehensive FAANG Mock Interview Loop', description: 'Complete a full 45-minute timed mock interview with AI evaluation and actionable scoring.' },
          children: [
            { title: 'Timed Live Coding Session', description: 'Complete 2 LeetCode Mediums in 45 minutes under observation.' },
            { title: 'Post-Interview Gap Closure', description: 'Review telemetry report and close remaining knowledge gaps.' },
          ],
        },
      ],
    };
  }

  // Default / Backend & General Engineering
  return {
    title: params.title || (params.role ? `${params.role} Engineering Roadmap` : 'Modern Software Engineering & Systems Architecture'),
    description: `A structured ${targetWeeks}-week roadmap designed to take you from core concepts to building, scaling, and testing resilient production software.`,
    goal: params.goal,
    category: params.role || 'Software Engineering',
    difficulty: level,
    estimatedWeeks: targetWeeks,
    tags: ['Architecture', 'Clean Code', 'Databases', 'APIs', 'Testing', 'System Design'],
    nodes: [
      {
        title: 'Core Fundamentals & Domain Modeling',
        description: `Define foundational architecture and data modeling requirements tailored to: "${params.goal}".`,
        type: 'MILESTONE',
        position: 0,
        interview: { topic: 'Architecture & Domain Modeling Foundations', description: 'Explain design patterns, object-oriented/functional principles, and data boundaries.' },
        children: [
          { title: 'Requirements & Scope', description: 'Break down problem statement into measurable technical deliverables.' },
          { title: 'Domain Data Schema', description: 'Design clean schemas and entity relationships.' },
        ],
      },
      {
        title: 'Applied Engineering & Component Implementation',
        description: 'Build core business logic, structured API layers, validation schemas, and error boundaries.',
        type: 'MILESTONE',
        position: 1,
        interview: { topic: 'API Design, Validation & Error Handling', description: 'Discuss RESTful vs RPC patterns, status codes, and idempotency guarantees.' },
        children: [
          { title: 'Core Logic Implementation', description: 'Write testable, decoupled services with dependency injection.' },
          { title: 'Validation & Security', description: 'Enforce strict schema validation and sanitization on all inputs.' },
        ],
      },
      {
        title: 'Data Persistence, Caching & Performance',
        description: 'Integrate relational/NoSQL datastores, implement indexing strategies, and add in-memory caching.',
        type: 'MILESTONE',
        position: 2,
        interview: { topic: 'Database Performance & Caching Strategies', description: 'Explain index B-Trees, N+1 query problem, and cache eviction policies.' },
        children: [
          { title: 'Database Optimization', description: 'Analyze slow query plans and optimize indexing.' },
          { title: 'Cache Layer Integration', description: 'Implement cache-aside pattern with Redis.' },
        ],
      },
      {
        title: 'Production Capstone: End-to-End Implementation',
        description: 'Deliver a complete, tested, and deployable implementation solving your primary objective.',
        type: 'PROJECT',
        position: 3,
        interview: { topic: 'Technical Capstone Walkthrough & Code Review', description: 'Defend your engineering decisions in a simulated senior peer review.' },
        children: [
          { title: 'Automated Test Suite', description: 'Write unit, integration, and end-to-end tests with high coverage.' },
          { title: 'Cloud Deployment', description: 'Deploy with automated CI/CD and environment configuration.' },
        ],
      },
      {
        title: 'Evaluation, Polish & Technical Readiness',
        description: 'Run comprehensive mock interviews, optimize performance, and document your learnings for industry visibility.',
        type: 'MILESTONE',
        position: 4,
        interview: { topic: 'Comprehensive Technical Assessment', description: 'Participate in an AI-powered mock interview evaluating your domain knowledge.' },
        children: [
          { title: 'Performance & Security Review', description: 'Audit bottlenecks, memory utilization, and access controls.' },
          { title: 'Mock Interview & Certification', description: 'Validate readiness with a final timed interview checkpoint.' },
        ],
      },
    ],
  };
}
