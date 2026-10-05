export interface InbuiltInterview {
  id: string;
  category: 'video' | 'coding';
  title: string;
  role: string;
  company?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Hardcore';
  durationMins: number;
  questionCount: number;
  trackType: string;
  tag: 'Popular' | 'FAANG' | 'Campus' | 'Trending' | 'High Yield' | 'System Design' | 'STAR Method';
  description: string;
  skills: string[];
  focusAreas: string[];
  rubrics: string[];
  interviewerPersona: {
    name: string;
    role: string;
    avatarUrl?: string;
    traits: string;
  };
  simulationMode: 'REALISTIC' | 'PRACTICE' | 'CHALLENGE' | 'STAR_FOCUS';
  sampleQuestions: string[];
  codeTemplate?: {
    language: string;
    starterCode: string;
    problemDescription: string;
    sampleTestcases: { input: string; output: string }[];
  };
}

// ═══════════════════════════════════════════════════════════════════════
// 1. IN-BUILT VIDEO / ORAL INTERVIEWS DATASET
// ═══════════════════════════════════════════════════════════════════════
export const INBUILT_VIDEO_INTERVIEWS: InbuiltInterview[] = [
  {
    id: 'video-sde-fullstack-tier1',
    category: 'video',
    title: 'Full-Stack SDE Technical & System Architecture',
    role: 'Full Stack Developer',
    company: 'Amazon',
    difficulty: 'Advanced',
    durationMins: 35,
    questionCount: 6,
    trackType: 'Technical & Architecture',
    tag: 'Popular',
    description: 'Complete technical grilling on REST APIs, React lifecycle, database indexing, distributed caching, and past project architecture.',
    skills: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'REST APIs', 'System Design'],
    focusAreas: ['Web Development', 'Backend', 'System Design', 'Projects'],
    rubrics: [
      'Architectural Depth & Trade-offs',
      'Clarity in Explaining Microservices',
      'Database Concurrency & Indexing Knowledge',
      'STAR Method for Technical Challenges',
    ],
    interviewerPersona: {
      name: 'Ava',
      role: 'Principal SDE Interviewer',
      traits: 'Probing, calibrated, asks deep follow-up questions on bottlenecks',
    },
    simulationMode: 'REALISTIC',
    sampleQuestions: [
      'Walk me through the most technically complex microservice you designed. What trade-offs did you make?',
      'How would you handle race conditions during flash-sale inventory decrements in a distributed database?',
      'Explain the difference between optimistic and pessimistic locking with a real-world ecommerce example.',
      'How do you debug a memory leak occurring in a long-running Node.js worker service in production?',
    ],
  },
  {
    id: 'video-google-dsa-systems',
    category: 'video',
    title: 'Google SWE Algorithmic Thinking & Scaling Defense',
    role: 'Software Engineer',
    company: 'Google',
    difficulty: 'Hardcore',
    durationMins: 45,
    questionCount: 5,
    trackType: 'DSA & Scalability',
    tag: 'FAANG',
    description: 'High-rigor technical interview evaluating asymptotic complexity bounds, distributed systems consistency models, and clean code principles.',
    skills: ['DSA', 'System Design', 'C++', 'Go', 'Distributed Systems', 'CAP Theorem'],
    focusAreas: ['DSA', 'Problem Solving', 'System Design', 'Technical Knowledge'],
    rubrics: [
      'First-Principles Algorithmic Derivation',
      'Handling Distributed Consistency (Eventual vs Strong)',
      'Clean Communication of Complex Math & Proofs',
      'Googliness & Collaborative Problem Solving',
    ],
    interviewerPersona: {
      name: 'Marcus',
      role: 'Staff Software Engineer at Google',
      traits: 'Analytical, focuses on edge cases and mathematical rigor',
    },
    simulationMode: 'CHALLENGE',
    sampleQuestions: [
      'How would you design a globally distributed URL shortener handling 500k writes per second with sub-10ms read latency?',
      'Explain how Consistent Hashing minimizes cache redistribution when server nodes crash.',
      'Compare Raft and Paxos consensus protocols. In what scenarios does leader election stall?',
      'How would you detect cycles in a massive directed dependency graph with billions of nodes?',
    ],
  },
  {
    id: 'video-frontend-core-js-react',
    category: 'video',
    title: 'Frontend Lead: Core JS Engine & Web Performance',
    role: 'Frontend Developer',
    company: 'Uber',
    difficulty: 'Intermediate',
    durationMins: 30,
    questionCount: 6,
    trackType: 'UI Architecture',
    tag: 'Trending',
    description: 'Deep dive into the JavaScript Event Loop, V8 garbage collection, React Fiber reconciliation, CSS layout thrashing, and Core Web Vitals.',
    skills: ['JavaScript', 'TypeScript', 'React', 'Web Performance', 'DOM Internals'],
    focusAreas: ['Frontend', 'Web Development', 'Technical Knowledge'],
    rubrics: [
      'Event Loop Microtasks vs Macrotasks Understanding',
      'React Fiber Concurrent Mode & State Batching',
      'Optimization of LCP, FID & Cumulative Layout Shift',
      'Accessibility & Security (XSS / CSRF)',
    ],
    interviewerPersona: {
      name: 'Elena',
      role: 'UI Platform Architect',
      traits: 'Interactive, focuses on browser internals and rendering pipelines',
    },
    simulationMode: 'REALISTIC',
    sampleQuestions: [
      'Explain step-by-step how the browser renders HTML to screen pixels. Where does layout thrashing occur?',
      'How does React 18 Concurrent Rendering prioritize urgent vs non-urgent state updates?',
      'Implement or explain a custom Promise.allSettled polyfill from scratch with error boundaries.',
      'How would you architect an infinite virtualized list rendering 1,000,000 live updating financial tickers?',
    ],
  },
  {
    id: 'video-backend-microservices-kafka',
    category: 'video',
    title: 'Backend High Scale: Kafka & Distributed Primitives',
    role: 'Backend Developer',
    company: 'Netflix',
    difficulty: 'Advanced',
    durationMins: 40,
    questionCount: 5,
    trackType: 'Backend Systems',
    tag: 'System Design',
    description: 'Probes event-driven architectures, Kafka partition consumer rebalances, database sharding, connection pooling, and circuit breaking.',
    skills: ['Java', 'Spring Boot', 'Kafka', 'PostgreSQL', 'Redis', 'Docker'],
    focusAreas: ['Backend', 'APIs', 'Databases', 'System Design'],
    rubrics: [
      'Event Sourcing & Exactly-Once Semantics',
      'Database Partitioning & Read-Replica Lag Strategies',
      'Resilience Patterns (Bulkheads, Retries, Circuit Breakers)',
      'Security & OAuth2 Token Validation',
    ],
    interviewerPersona: {
      name: 'David',
      role: 'Distributed Systems Lead',
      traits: 'Systematic, evaluates fault tolerance and failure modes',
    },
    simulationMode: 'REALISTIC',
    sampleQuestions: [
      'How do you guarantee exactly-once message delivery when writing from Kafka to an SQL database?',
      'Describe how you would handle schema migrations on a table containing 500 million live records without downtime.',
      'Explain how a multi-level cache (L1 in-memory, L2 Redis) prevents cache stampedes during traffic spikes.',
      'How do you implement distributed tracing across 50 microservices using OpenTelemetry?',
    ],
  },
  {
    id: 'video-amazon-behavioral-bar-raiser',
    category: 'video',
    title: 'Amazon Bar Raiser & Leadership Principles (LP)',
    role: 'Software Engineer',
    company: 'Amazon',
    difficulty: 'Advanced',
    durationMins: 30,
    questionCount: 5,
    trackType: 'Behavioral & Leadership',
    tag: 'STAR Method',
    description: 'Intense behavioral grilling calibrated on Customer Obsession, Ownership, Bias for Action, Disagree & Commit, and Delivering Results.',
    skills: ['Communication', 'STAR Method', 'Leadership', 'Conflict Resolution'],
    focusAreas: ['Behavioral', 'Communication'],
    rubrics: [
      'Strict STAR Structure (Situation, Task, Action, Result)',
      'Use of Quantitative Metrics in Results (% latency drop, $ saved)',
      'Demonstration of True Technical Ownership',
      'Graceful Handling of Disagreement and Mistakes',
    ],
    interviewerPersona: {
      name: 'Sarah',
      role: 'Amazon Certified Bar Raiser',
      traits: 'Direct, pushes for data metrics and personal contributions ("I" vs "We")',
    },
    simulationMode: 'STAR_FOCUS',
    sampleQuestions: [
      'Tell me about a time you had to make a high-stakes decision without complete technical data. What was the outcome?',
      'Describe a situation where you strongly disagreed with a tech lead or product manager. How did you handle it?',
      'Give an example of when you took ownership of a critical production outage that was outside your direct domain.',
      'Tell me about a time an engineering project you led failed to meet its deadline or goals. What did you learn?',
    ],
  },
  {
    id: 'video-tcs-prime-campus-interview',
    category: 'video',
    title: 'TCS Digital / Prime Technical & Managerial Loop',
    role: 'Software Engineer',
    company: 'TCS',
    difficulty: 'Intermediate',
    durationMins: 25,
    questionCount: 6,
    trackType: 'Campus Hiring',
    tag: 'Campus',
    description: 'Calibrated for TCS Prime / Digital hiring. Covers OOPs, SQL normalization, OS paging, basic algorithms, and managerial HR scenarios.',
    skills: ['Core CS', 'SQL', 'OOP', 'Java', 'Python', 'Web Development'],
    focusAreas: ['Core CS', 'Databases', 'Technical Knowledge', 'Behavioral'],
    rubrics: [
      'Precision in Core CS Definitions (Deadlocks, ACID, Normalization)',
      'Clarity in Final Year Academic Projects',
      'Professional Grooming & Spoken English Fluency',
      'Flexibility & Adaptability to New Technologies',
    ],
    interviewerPersona: {
      name: 'Vikram',
      role: 'Senior Delivery Manager',
      traits: 'Encouraging, structured, tests fundamental CS understanding',
    },
    simulationMode: 'PRACTICE',
    sampleQuestions: [
      'Explain the 4 pillars of Object-Oriented Programming with practical software examples.',
      'What are the 4 conditions required for a Deadlock to occur in an Operating System? How do you prevent them?',
      'Write and explain an SQL query to find the second highest salary without using the LIMIT keyword.',
      'Walk me through your engineering capstone project. What was your personal contribution?',
    ],
  },
  {
    id: 'video-ai-ml-llm-pipeline-defense',
    category: 'video',
    title: 'AI / ML Engineer: RAG Pipelines & Model Scaling',
    role: 'AI / ML Engineer',
    company: 'Meta',
    difficulty: 'Hardcore',
    durationMins: 40,
    questionCount: 5,
    trackType: 'AI & Data Systems',
    tag: 'High Yield',
    description: 'Technical evaluation on Vector Embeddings, RAG agent architectures, LoRA fine-tuning, KV cache optimization, and GPU serving latency.',
    skills: ['Python', 'PyTorch', 'Vector DBs', 'LLMs', 'RAG', 'Transformers'],
    focusAreas: ['Technical Knowledge', 'System Design', 'Projects'],
    rubrics: [
      'Deep Transformer Self-Attention Math',
      'Vector Search Indexing (HNSW vs IVF-PQ)',
      'RAG Retrieval Optimization & Chunking Strategies',
      'Quantization (GPTQ, AWQ) & KV Caching Trade-offs',
    ],
    interviewerPersona: {
      name: 'Dr. Evelyn',
      role: 'Lead AI Research Scientist',
      traits: 'Deep mathematical focus, questions loss curves and inference latency',
    },
    simulationMode: 'CHALLENGE',
    sampleQuestions: [
      'How does FlashAttention optimize the quadratic memory bottleneck in standard Multi-Head Attention?',
      'How would you design a sub-second hybrid search system combining dense vector embeddings with BM25 keyword search?',
      'Explain how LoRA reduces trainable parameters during LLM fine-tuning via low-rank matrix decomposition.',
      'What evaluation metrics would you track to detect hallucination in enterprise production RAG pipelines?',
    ],
  },
  {
    id: 'video-infosys-specialist-programmer',
    category: 'video',
    title: 'Infosys Specialist Programmer (Power Programmer)',
    role: 'Full Stack Developer',
    company: 'Infosys',
    difficulty: 'Intermediate',
    durationMins: 30,
    questionCount: 6,
    trackType: 'Campus Hiring',
    tag: 'Campus',
    description: 'Technical grilling on full-stack web architectures, REST API security, indexing strategies, and algorithm optimization.',
    skills: ['React', 'Node.js', 'SQL', 'DSA', 'REST APIs'],
    focusAreas: ['Web Development', 'Backend', 'DSA'],
    rubrics: [
      'Problem Decomposition & Approach',
      'Full Stack Architecture Clarity',
      'Database Normalization & Query Execution Plans',
    ],
    interviewerPersona: {
      name: 'Ananya',
      role: 'Principal Technical Architect',
      traits: 'Supportive, focuses on clean coding and system diagrams',
    },
    simulationMode: 'PRACTICE',
    sampleQuestions: [
      'How do indexes work internally in PostgreSQL using B-Trees? When does an index scan fail to speed up queries?',
      'Explain the difference between JWT authentication and session cookies regarding security and scalability.',
      'How do you handle asynchronous operations in JavaScript using Promises, async/await, and try/catch?',
      'Explain the Singleton and Factory design patterns with clean code examples.',
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════
// 2. IN-BUILT CODING SANDBOX INTERVIEWS DATASET
// ═══════════════════════════════════════════════════════════════════════
export const INBUILT_CODING_INTERVIEWS: InbuiltInterview[] = [
  {
    id: 'coding-dsa-two-pointers-sliding-window',
    category: 'coding',
    title: 'Two Pointers & Sliding Window Mastery',
    role: 'Software Engineer',
    company: 'Google',
    difficulty: 'Intermediate',
    durationMins: 30,
    questionCount: 2,
    trackType: 'DSA',
    tag: 'Popular',
    description: 'Solve classic linear-time optimization problems reducing O(N^2) brute force loops to optimal O(N) single-pass solutions.',
    skills: ['DSA', 'Arrays', 'Two Pointers', 'Sliding Window'],
    focusAreas: ['DSA', 'Problem Solving'],
    rubrics: [
      'Optimal Time & Space Complexity',
      'Clean Variable Naming & Zero Off-by-One Bugs',
      'Handling Empty, Single-Element & Duplicate Arrays',
      'Clear Socratic Communication in Comments',
    ],
    interviewerPersona: {
      name: 'Ava AI',
      role: 'Monaco Code Evaluator',
      traits: 'Evaluates testcases, Big-O bounds, and memory allocations',
    },
    simulationMode: 'REALISTIC',
    sampleQuestions: [
      'Longest Substring Without Repeating Characters (O(N) time, O(min(m, n)) space)',
      'Container With Most Water (Two Pointer Greedy Convergence)',
    ],
    codeTemplate: {
      language: 'javascript',
      starterCode: `/**
 * @param {string} s
 * @return {number}
 * 
 * Find the length of the longest substring without repeating characters.
 * Example 1: s = "abcabcbb" -> Output: 3 ("abc")
 * Example 2: s = "pwwkew" -> Output: 3 ("wke")
 */
function lengthOfLongestSubstring(s) {
  // TODO: Implement optimal O(N) sliding window solution
  let maxLength = 0;
  let left = 0;
  const charMap = new Map();

  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    if (charMap.has(char) && charMap.get(char) >= left) {
      left = charMap.get(char) + 1;
    }
    charMap.set(char, right);
    maxLength = Math.max(maxLength, right - left + 1);
  }

  return maxLength;
}
`,
      problemDescription: 'Given a string `s`, find the length of the longest substring without duplicate characters. Optimize for O(N) runtime and O(K) extra space.',
      sampleTestcases: [
        { input: '"abcabcbb"', output: '3' },
        { input: '"bbbbb"', output: '1' },
        { input: '"pwwkew"', output: '3' },
      ],
    },
  },
  {
    id: 'coding-machine-in-memory-cache-lru',
    category: 'coding',
    title: 'Machine Coding: Thread-Safe LRU Cache with TTL',
    role: 'Backend Developer',
    company: 'Flipkart',
    difficulty: 'Advanced',
    durationMins: 45,
    questionCount: 1,
    trackType: 'MachineCoding',
    tag: 'FAANG',
    description: 'Design and implement an in-memory Least Recently Used (LRU) Cache supporting O(1) get/put operations and optional TTL expiry eviction.',
    skills: ['Machine Coding', 'LLD', 'Data Structures', 'Doubly Linked List', 'HashMaps'],
    focusAreas: ['Backend', 'Technical Knowledge', 'Core CS'],
    rubrics: [
      'Strict O(1) Time Complexity for get() and put()',
      'Correct Doubly Linked List Node Re-linking',
      'Clean Separation of Concerns & Class Design',
      'Thread Safety & Edge Case Handling (Capacity = 0, Overwrites)',
    ],
    interviewerPersona: {
      name: 'Vikram',
      role: 'Staff LLD Architect',
      traits: 'Focuses on design patterns, memory footprint, and clean OOP',
    },
    simulationMode: 'REALISTIC',
    sampleQuestions: [
      'Implement LRUCache(capacity) with get(key), put(key, value), and evictExpired() methods.',
    ],
    codeTemplate: {
      language: 'typescript',
      starterCode: `class DNode<K, V> {
  key: K;
  value: V;
  prev: DNode<K, V> | null = null;
  next: DNode<K, V> | null = null;

  constructor(key: K, value: V) {
    this.key = key;
    this.value = value;
  }
}

export class LRUCache<K, V> {
  private capacity: number;
  private map: Map<K, DNode<K, V>>;
  private head: DNode<K, V>;
  private tail: DNode<K, V>;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.map = new Map();
    this.head = new DNode<K, V>(null as any, null as any);
    this.tail = new DNode<K, V>(null as any, null as any);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  get(key: K): V | -1 {
    if (!this.map.has(key)) return -1;
    const node = this.map.get(key)!;
    this.moveToHead(node);
    return node.value;
  }

  put(key: K, value: V): void {
    if (this.map.has(key)) {
      const node = this.map.get(key)!;
      node.value = value;
      this.moveToHead(node);
      return;
    }

    if (this.map.size >= this.capacity) {
      const lru = this.removeTail();
      this.map.delete(lru.key);
    }

    const newNode = new DNode(key, value);
    this.map.set(key, newNode);
    this.addToHead(newNode);
  }

  private addToHead(node: DNode<K, V>): void {
    node.prev = this.head;
    node.next = this.head.next;
    this.head.next!.prev = node;
    this.head.next = node;
  }

  private removeNode(node: DNode<K, V>): void {
    node.prev!.next = node.next;
    node.next!.prev = node.prev;
  }

  private moveToHead(node: DNode<K, V>): void {
    this.removeNode(node);
    this.addToHead(node);
  }

  private removeTail(): DNode<K, V> {
    const res = this.tail.prev!;
    this.removeNode(res);
    return res;
  }
}
`,
      problemDescription: 'Design an LRU Cache with strict O(1) reads and writes using a HashMap paired with a Doubly Linked List.',
      sampleTestcases: [
        { input: 'put(1,1), put(2,2), get(1)', output: '1' },
        { input: 'put(3,3), get(2)', output: '-1 (evicted)' },
      ],
    },
  },
  {
    id: 'coding-machine-rate-limiter-token-bucket',
    category: 'coding',
    title: 'Machine Coding: Token Bucket Rate Limiter Engine',
    role: 'Backend Developer',
    company: 'Uber',
    difficulty: 'Advanced',
    durationMins: 40,
    questionCount: 1,
    trackType: 'MachineCoding',
    tag: 'Trending',
    description: 'Implement a thread-safe in-memory Token Bucket / Leaky Bucket Rate Limiter capable of handling burst traffic and multi-user keys.',
    skills: ['Concurrency', 'System Design', 'Machine Coding', 'Algorithms'],
    focusAreas: ['Backend', 'Core CS', 'System Design'],
    rubrics: [
      'Lazy Token Refill Calculation',
      'Thread Safety & Synchronization Simulation',
      'Configurable Capacity and Refill Rate per Second',
      'Graceful Handling of Multi-tenant User IDs',
    ],
    interviewerPersona: {
      name: 'Ava AI',
      role: 'Platform Engineering Evaluator',
      traits: 'Tests burst traffic scenarios and clock skew resiliency',
    },
    simulationMode: 'REALISTIC',
    sampleQuestions: [
      'Implement RateLimiter.allowRequest(userId, cost) based on Token Bucket algorithm.',
    ],
    codeTemplate: {
      language: 'javascript',
      starterCode: `class TokenBucketRateLimiter {
  constructor(capacity, refillTokensPerSecond) {
    this.capacity = capacity;
    this.refillRate = refillTokensPerSecond;
    this.buckets = new Map();
  }

  allowRequest(userId, tokensRequested = 1) {
    const now = Date.now();
    let bucket = this.buckets.get(userId);

    if (!bucket) {
      bucket = {
        tokens: this.capacity,
        lastRefillTimestamp: now,
      };
      this.buckets.set(userId, bucket);
    } else {
      // Calculate token replenishment since last timestamp
      const elapsedSeconds = (now - bucket.lastRefillTimestamp) / 1000;
      const tokensToAdd = elapsedSeconds * this.refillRate;
      bucket.tokens = Math.min(this.capacity, bucket.tokens + tokensToAdd);
      bucket.lastRefillTimestamp = now;
    }

    if (bucket.tokens >= tokensRequested) {
      bucket.tokens -= tokensRequested;
      return true; // Request Allowed
    }

    return false; // Rate limit exceeded (429)
  }
}
`,
      problemDescription: 'Implement a high-throughput Token Bucket Rate Limiter algorithm with lazy token calculation.',
      sampleTestcases: [
        { input: 'allowRequest("user1", 1)', output: 'true' },
        { input: 'Burst 10 requests above capacity', output: 'false' },
      ],
    },
  },
  {
    id: 'coding-sql-complex-window-joins',
    category: 'coding',
    title: 'SQL Lab: Window Functions, CTEs & Analytics',
    role: 'Data Engineer',
    company: 'Amazon',
    difficulty: 'Intermediate',
    durationMins: 30,
    questionCount: 3,
    trackType: 'SQL',
    tag: 'High Yield',
    description: 'Write production SQL queries using DENSE_RANK(), PARTITION BY, Common Table Expressions (CTEs), and Self-Joins.',
    skills: ['SQL', 'PostgreSQL', 'DBMS', 'Query Optimization'],
    focusAreas: ['Databases', 'Technical Knowledge'],
    rubrics: [
      'Correct Window Function Partitioning',
      'Optimized Join Conditions (Avoid Cartesian Products)',
      'Handling NULL Values & Duplicate Ties in Ranking',
    ],
    interviewerPersona: {
      name: 'SQL Evaluator',
      role: 'Database Systems Lead',
      traits: 'Strict on query execution plan cost and index utilization',
    },
    simulationMode: 'REALISTIC',
    sampleQuestions: [
      'Find the top 3 highest earning employees in each department using DENSE_RANK().',
      'Calculate the 7-day rolling average revenue per merchant.',
    ],
    codeTemplate: {
      language: 'sql',
      starterCode: `-- Find the top 2 highest paid employees per department
-- Schema: Employee (id, name, salary, department_id), Department (id, name)

WITH RankedEmployees AS (
  SELECT 
    e.name AS employee_name,
    e.salary,
    d.name AS department_name,
    DENSE_RANK() OVER (
      PARTITION BY e.department_id 
      ORDER BY e.salary DESC
    ) AS rank_in_dept
  FROM Employee e
  INNER JOIN Department d ON e.department_id = d.id
)
SELECT 
  department_name,
  employee_name,
  salary
FROM RankedEmployees
WHERE rank_in_dept <= 2
ORDER BY department_name, salary DESC;
`,
      problemDescription: 'Write an SQL query using Common Table Expressions and Window Functions to compute departmental rankings.',
      sampleTestcases: [
        { input: 'Employee & Department records', output: 'Ranked top salary earners' },
      ],
    },
  },
  {
    id: 'coding-frontend-async-task-queue',
    category: 'coding',
    title: 'Frontend Architecture: Concurrent Async Task Runner',
    role: 'Frontend Developer',
    company: 'Atlassian',
    difficulty: 'Advanced',
    durationMins: 35,
    questionCount: 1,
    trackType: 'Frontend',
    tag: 'Trending',
    description: 'Build a concurrency-limited Promise task runner that executes N async tasks with a maximum concurrency limit and retry mechanism.',
    skills: ['JavaScript', 'TypeScript', 'Async/Await', 'Event Loop', 'Promises'],
    focusAreas: ['Frontend', 'Web Development'],
    rubrics: [
      'Strict Concurrency Limit (Never exceeding maxParallel)',
      'Preserving Returned Result Order matching input tasks',
      'Immediate slot reuse as soon as a promise settles',
      'Handling Task Rejections without aborting pending queue',
    ],
    interviewerPersona: {
      name: 'Ava AI',
      role: 'UI Platform Evaluator',
      traits: 'Tests concurrency limits, microtask queue scheduling, and memory leaks',
    },
    simulationMode: 'REALISTIC',
    sampleQuestions: [
      'Implement asyncPool(concurrencyLimit, tasks) returning a Promise of all results.',
    ],
    codeTemplate: {
      language: 'javascript',
      starterCode: `/**
 * Runs async tasks with a maximum concurrency limit.
 * @param {number} concurrencyLimit - Max concurrent promises running
 * @param {Array<() => Promise<any>>} tasks - Task factory functions
 * @return {Promise<Array<any>>} - Resolved values in original order
 */
async function parallelTaskRunner(concurrencyLimit, tasks) {
  const results = [];
  const executing = new Set();
  let currentIndex = 0;

  async function runNext() {
    if (currentIndex >= tasks.length) return;
    
    const index = currentIndex++;
    const taskPromise = tasks[index]().then((res) => {
      results[index] = res;
      executing.delete(taskPromise);
    });

    executing.add(taskPromise);

    if (executing.size >= concurrencyLimit) {
      await Promise.race(executing);
    }

    return runNext();
  }

  const workers = [];
  for (let i = 0; i < Math.min(concurrencyLimit, tasks.length); i++) {
    workers.push(runNext());
  }

  await Promise.all(workers);
  await Promise.all(executing);
  return results;
}
`,
      problemDescription: 'Implement a concurrent async promise queue with immediate worker slot replenishment.',
      sampleTestcases: [
        { input: 'concurrency=2, tasks=[100ms, 200ms, 50ms]', output: 'Resolved in optimal time' },
      ],
    },
  },
  {
    id: 'coding-dsa-graphs-tree-traversal',
    category: 'coding',
    title: 'Graph Traversal: Word Ladder & Shortest Path BFS',
    role: 'Software Engineer',
    company: 'Microsoft',
    difficulty: 'Advanced',
    durationMins: 35,
    questionCount: 2,
    trackType: 'DSA',
    tag: 'FAANG',
    description: 'Master unweighted shortest path algorithms on state-space graphs using Bidirectional Breadth-First Search (BFS).',
    skills: ['DSA', 'Graphs', 'BFS', 'Shortest Path', 'HashSets'],
    focusAreas: ['DSA', 'Problem Solving'],
    rubrics: [
      'Choosing BFS over DFS for shortest path guarantees',
      'Optimized String Transformation Lookup O(26 * L)',
      'Bidirectional Search Optimization',
    ],
    interviewerPersona: {
      name: 'Ava AI',
      role: 'Graph Algorithms Specialist',
      traits: 'Strict on visited state tracking and memory bounds',
    },
    simulationMode: 'CHALLENGE',
    sampleQuestions: [
      'Word Ladder: Find shortest transformation sequence from beginWord to endWord.',
      'Clone Graph: Deep copy an undirected connected graph.',
    ],
    codeTemplate: {
      language: 'javascript',
      starterCode: `/**
 * @param {string} beginWord
 * @param {string} endWord
 * @param {string[]} wordList
 * @return {number}
 */
function ladderLength(beginWord, endWord, wordList) {
  const wordSet = new Set(wordList);
  if (!wordSet.has(endWord)) return 0;

  let queue = [beginWord];
  let step = 1;

  while (queue.length > 0) {
    const nextQueue = [];

    for (const word of queue) {
      if (word === endWord) return step;

      const chars = word.split('');
      for (let i = 0; i < chars.length; i++) {
        const originalChar = chars[i];

        for (let c = 97; c <= 122; c++) {
          chars[i] = String.fromCharCode(c);
          const transformed = chars.join('');

          if (wordSet.has(transformed)) {
            wordSet.delete(transformed);
            nextQueue.push(transformed);
          }
        }
        chars[i] = originalChar;
      }
    }

    queue = nextQueue;
    step++;
  }

  return 0;
}
`,
      problemDescription: 'Given beginWord, endWord, and wordList, return the number of words in the shortest transformation sequence.',
      sampleTestcases: [
        { input: 'begin="hit", end="cog", list=["hot","dot","dog","lot","log","cog"]', output: '5' },
      ],
    },
  },
  {
    id: 'coding-campus-tcs-infosys-dsa',
    category: 'coding',
    title: 'Campus DSA Essentials: Arrays, Strings & Hashing',
    role: 'Software Engineer',
    company: 'TCS',
    difficulty: 'Beginner',
    durationMins: 25,
    questionCount: 3,
    trackType: 'DSA',
    tag: 'Campus',
    description: 'High-frequency campus screening problems: Two Sum, Valid Anagram, Subarray Sum Equals K, and Trapping Rain Water.',
    skills: ['DSA', 'Arrays', 'Strings', 'HashMaps', 'Prefix Sum'],
    focusAreas: ['DSA', 'Problem Solving'],
    rubrics: [
      'Linear O(N) Hash Table Solutions',
      'Clean Modular Code with Functions',
      'Zero Edge Case Failures (Negative numbers, empty inputs)',
    ],
    interviewerPersona: {
      name: 'Ava AI',
      role: 'Campus Screening Evaluator',
      traits: 'Guidance-friendly with real-time testcase feedback',
    },
    simulationMode: 'PRACTICE',
    sampleQuestions: [
      'Subarray Sum Equals K using Prefix Sum HashMap in O(N) time.',
      'Group Anagrams using character frequency key hashing.',
    ],
    codeTemplate: {
      language: 'javascript',
      starterCode: `/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 * Find total number of continuous subarrays whose sum equals k.
 */
function subarraySum(nums, k) {
  let count = 0;
  let currentSum = 0;
  const prefixMap = new Map();
  prefixMap.set(0, 1);

  for (const num of nums) {
    currentSum += num;
    if (prefixMap.has(currentSum - k)) {
      count += prefixMap.get(currentSum - k);
    }
    prefixMap.set(currentSum, (prefixMap.get(currentSum) || 0) + 1);
  }

  return count;
}
`,
      problemDescription: 'Given an array of integers `nums` and an integer `k`, return the total number of subarrays whose sum equals `k`.',
      sampleTestcases: [
        { input: 'nums=[1,1,1], k=2', output: '2' },
        { input: 'nums=[1,2,3], k=3', output: '2' },
      ],
    },
  },
];
