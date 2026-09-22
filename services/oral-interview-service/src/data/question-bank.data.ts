// ═══════════════════════════════════════════════════════════════
// RU READY Advanced Oral Interview Engine — Question Bank & Rubrics
// ═══════════════════════════════════════════════════════════════

export interface QuestionBankItem {
  id: string;
  category: 'TECHNICAL' | 'BEHAVIOURAL' | 'SYSTEM_DESIGN' | 'PROJECT';
  topic: 'DSA' | 'OOP' | 'DBMS' | 'OS' | 'COMPUTER_NETWORKS' | 'SYSTEM_DESIGN' | 'WEB_DEV' | 'PROJECTS' | 'BEHAVIORAL';
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  questionText: string;
  requiredConcepts: string[];
  optionalConcepts: string[];
  commonMisconceptions: string[];
  simplerVariant?: string;
  harderVariant?: string;
  followUpQuestions: string[];
}

export const QUESTION_BANK: QuestionBankItem[] = [
  // ─── DSA ───────────────────────────────────────────────────
  {
    id: 'dsa_binary_search',
    category: 'TECHNICAL',
    topic: 'DSA',
    difficulty: 'MEDIUM',
    questionText: 'What is the time complexity of Binary Search, and why does it achieve that efficiency?',
    requiredConcepts: ['sorted data', 'halving search space', 'O(log n)'],
    optionalConcepts: ['divide and conquer', 'iterative vs recursive stack space', 'binary search tree comparison'],
    commonMisconceptions: ['Works on unsorted arrays', 'O(n) time complexity'],
    simplerVariant: 'What prerequisite must an array satisfy before you can perform Binary Search on it?',
    harderVariant: 'How would you adapt Binary Search to find the first occurrence of a target element in a sorted array with duplicates?',
    followUpQuestions: [
      'Can you explain why repeatedly halving the array results in a logarithmic runtime?',
      'What is the space complexity difference between recursive and iterative Binary Search?'
    ]
  },
  {
    id: 'dsa_hash_table',
    category: 'TECHNICAL',
    topic: 'DSA',
    difficulty: 'MEDIUM',
    questionText: 'How does a Hash Table handle collisions, and what is its worst-case time complexity?',
    requiredConcepts: ['hash function', 'collisions', 'chaining or open addressing', 'O(1) average, O(n) worst case'],
    optionalConcepts: ['load factor', 'rehashing', 'treeifying buckets (e.g. Java HashMap)'],
    commonMisconceptions: ['Hash tables are always O(1) in all cases', 'Collisions ruin a hash table completely'],
    simplerVariant: 'What is a hash collision in simple terms?',
    harderVariant: 'Under what specific conditions does Hash Table lookup degrade to O(n), and how do modern engines mitigate hash DoS attacks?',
    followUpQuestions: [
      'What is the difference between Separate Chaining and Open Addressing?',
      'How does load factor influence when a hash table expands?'
    ]
  },

  // ─── DBMS ──────────────────────────────────────────────────
  {
    id: 'dbms_normalization',
    category: 'TECHNICAL',
    topic: 'DBMS',
    difficulty: 'MEDIUM',
    questionText: 'What is database normalization, and why would an enterprise system choose to denormalize tables?',
    requiredConcepts: ['reducing data redundancy', 'normal forms (1NF, 2NF, 3NF)', 'functional dependencies', 'denormalization for read performance'],
    optionalConcepts: ['anomalies (insert, update, delete)', 'BCNF', 'JOIN cost reduction'],
    commonMisconceptions: ['Normalization means splitting every single table as much as possible', 'Denormalization is bad engineering practice'],
    simplerVariant: 'What problem does 1st Normal Form (1NF) solve in database design?',
    harderVariant: 'Walk me through a concrete scenario where denormalizing a 3NF schema reduced database IOPS under 100k QPS load.',
    followUpQuestions: [
      'Can you define what 3rd Normal Form (3NF) requires regarding transitive dependencies?',
      'When would you intentionally duplicate columns across SQL tables?'
    ]
  },
  {
    id: 'dbms_indexing',
    category: 'TECHNICAL',
    topic: 'DBMS',
    difficulty: 'MEDIUM',
    questionText: 'How do database indexes improve read performance, and what is the trade-off for write operations?',
    requiredConcepts: ['B-Tree / B+Tree structure', 'faster lookup / traversal', 'write overhead (UPDATE/INSERT/DELETE index maintenance)'],
    optionalConcepts: ['composite indexes', 'covering index', 'index scan vs sequential scan'],
    commonMisconceptions: ['Indexes speed up write queries', 'You should add an index to every single column'],
    simplerVariant: 'Why does an index speed up searching for a user by email?',
    harderVariant: 'Why are B+ Trees preferred over Binary Search Trees for disk-based database indexes?',
    followUpQuestions: [
      'What is a covering index and how does it avoid table lookups?',
      'What happens to index performance when inserting random UUID primary keys?'
    ]
  },

  // ─── SYSTEM DESIGN ─────────────────────────────────────────
  {
    id: 'sd_load_balancer',
    category: 'SYSTEM_DESIGN',
    topic: 'SYSTEM_DESIGN',
    difficulty: 'MEDIUM',
    questionText: 'Explain the role of a Load Balancer in modern web architectures and compare Round-Robin with Least-Connections algorithms.',
    requiredConcepts: ['distributing incoming traffic', 'high availability / redundancy', 'health checks', 'round-robin vs least connections'],
    optionalConcepts: ['Layer 4 vs Layer 7 load balancing', 'consistent hashing', 'sticky sessions'],
    commonMisconceptions: ['Load balancers prevent backend server failures', 'Round-robin is optimal for long-lived WebSocket connections'],
    simplerVariant: 'Why do high-traffic apps put a load balancer in front of application servers?',
    harderVariant: 'How would you handle load balancer failover itself to prevent single points of failure at the entry gateway?',
    followUpQuestions: [
      'What is the difference between Layer 4 (TCP) and Layer 7 (HTTP) load balancing?',
      'How does Consistent Hashing assist in sticky routing and cache key distribution?'
    ]
  },
  {
    id: 'sd_caching',
    category: 'SYSTEM_DESIGN',
    topic: 'SYSTEM_DESIGN',
    difficulty: 'HARD',
    questionText: 'How do caching strategies like Cache-Aside and Write-Through differ, and how do you handle cache invalidation?',
    requiredConcepts: ['Cache-Aside pattern', 'Write-Through / Write-Back', 'cache invalidation strategies', 'TTL / Eviction (LRU)'],
    optionalConcepts: ['cache stampede / thundering herd', 'Redis sentinel / cluster', 'eventual consistency'],
    commonMisconceptions: ['Caching solves data persistence problems', 'Cache invalidation is trivial'],
    simplerVariant: 'What is the main benefit of using Redis as an in-memory cache?',
    harderVariant: 'How do you prevent a cache stampede when a hot cache key expires simultaneously for 50,000 concurrent requests?',
    followUpQuestions: [
      'What happens when a database record is updated in Cache-Aside pattern?',
      'Can you explain how Least Recently Used (LRU) eviction works?'
    ]
  },

  // ─── OOP & CS FUNDAMENTALS ────────────────────────────────
  {
    id: 'oop_polymorphism',
    category: 'TECHNICAL',
    topic: 'OOP',
    difficulty: 'EASY',
    questionText: 'What is polymorphism in Object-Oriented Programming, and how does method overloading differ from method overriding?',
    requiredConcepts: ['poly-morphism (many forms)', 'overloading (compile-time / same method name different args)', 'overriding (runtime / subclass implementation)'],
    optionalConcepts: ['vtable / virtual methods', 'interfaces / abstract classes', 'Liskov Substitution Principle'],
    commonMisconceptions: ['Overloading and overriding are identical', 'Polymorphism requires multi-inheritance'],
    simplerVariant: 'Can you give a real-world analogy for method overriding in OOP?',
    harderVariant: 'How is dynamic dispatch implemented under the hood in C++ or Java via virtual function tables?',
    followUpQuestions: [
      'What is the benefit of programming to an interface rather than a concrete implementation?',
      'Can static methods be overridden in Java or TypeScript?'
    ]
  },

  // ─── WEB DEV ──────────────────────────────────────────────
  {
    id: 'web_rest_vs_graphql',
    category: 'TECHNICAL',
    topic: 'WEB_DEV',
    difficulty: 'MEDIUM',
    questionText: 'Compare REST APIs and GraphQL. What problem does GraphQL solve regarding over-fetching and under-fetching?',
    requiredConcepts: ['HTTP verbs / endpoints in REST', 'declarative query schema in GraphQL', 'over-fetching', 'under-fetching / N+1 problem'],
    optionalConcepts: ['DataLoader pattern', 'caching challenges in GraphQL', 'API versioning'],
    commonMisconceptions: ['GraphQL renders REST completely obsolete', 'GraphQL does not use HTTP'],
    simplerVariant: 'What HTTP method is typically used to retrieve data in a REST API?',
    harderVariant: 'How do you solve the N+1 database query problem when fetching nested relations in a GraphQL resolver?',
    followUpQuestions: [
      'What are the advantages of REST HTTP caching over GraphQL POST requests?',
      'How do you handle API versioning in REST vs GraphQL?'
    ]
  }
];

// ─── Project-Based Progressive Deep-Dive Templates ──────────

export interface ProjectInterviewStep {
  level: number;
  stageName: string;
  promptTemplate: (projectName: string, techStack: string[]) => string;
  expectedConcepts: string[];
}

export const PROJECT_DEEP_DIVE_STAGES: ProjectInterviewStep[] = [
  {
    level: 1,
    stageName: 'Project Overview',
    promptTemplate: (name, tech) => `Can you briefly summarize your project "${name}" and why you selected ${tech.join(', ')}?`,
    expectedConcepts: ['problem statement', 'architecture high-level', 'technology choices'],
  },
  {
    level: 2,
    stageName: 'Tech Stack Rationale',
    promptTemplate: (name, tech) => `What led you to pick ${tech[0] || 'your core database'} over alternative options for "${name}"?`,
    expectedConcepts: ['trade-off analysis', 'performance', 'developer velocity', 'ecosystem'],
  },
  {
    level: 3,
    stageName: 'Architecture & State Management',
    promptTemplate: (name) => `Walk me through how data flows from the user interface down to your persistent storage in "${name}".`,
    expectedConcepts: ['client request', 'API endpoint', 'controller / service layer', 'database query'],
  },
  {
    level: 4,
    stageName: 'Scaling & Load Challenge',
    promptTemplate: (name) => `If traffic to "${name}" spiked 100x overnight, where would your primary performance bottleneck occur?`,
    expectedConcepts: ['database bottleneck', 'connection pool', 'CPU / memory constraints', 'caching strategy'],
  },
  {
    level: 5,
    stageName: 'Failure & Resilience',
    promptTemplate: (name, tech) => `What happens if your primary service or database crashes while a user is mid-action in "${name}"?`,
    expectedConcepts: ['error handling', 'graceful degradation', 'retries / circuit breaker', 'transaction rollback'],
  },
  {
    level: 6,
    stageName: 'Trade-offs & Hindsight',
    promptTemplate: (name) => `If you were rebuilding "${name}" from scratch today, what major design choice would you change?`,
    expectedConcepts: ['lessons learned', 'technical debt', 'improved architecture choice'],
  }
];
