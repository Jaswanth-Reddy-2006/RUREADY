import {
  PrepSubject,
  PrepCategoryType,
  PrepFormulaSheet,
  PrepCodingPattern,
  PrepLLDProblem,
  PrepHLDCaseStudy,
} from '@ru-ready/shared';

export interface PrepDomainCategory {
  id: PrepCategoryType;
  title: string;
  description: string;
  domains: PrepDomainConfig[];
}

export interface PrepDomainConfig {
  id: string;
  subjectKey: PrepSubject;
  name: string;
  description: string;
  category: PrepCategoryType;
  topicCount: number;
  questionCount: number;
  iconName: string;
  focusTopics: string[];
}

export const PREP_CATEGORIES: PrepDomainCategory[] = [
  {
    id: 'FUNDAMENTALS',
    title: 'Placement Fundamentals',
    description: 'Aptitude, reasoning, verbal skills, and data interpretation required for online campus assessment rounds.',
    domains: [
      {
        id: 'quant',
        subjectKey: 'APTITUDE',
        name: 'Quantitative Aptitude',
        description: 'Numerical ability, word problems, percentages, probability, and time-speed-distance.',
        category: 'FUNDAMENTALS',
        topicCount: 24,
        questionCount: 248,
        iconName: 'Calculator',
        focusTopics: ['Percentages', 'Profit & Loss', 'Time & Work', 'Probability', 'P&C'],
      },
      {
        id: 'reasoning',
        subjectKey: 'REASONING',
        name: 'Logical Reasoning',
        description: 'Analytical puzzles, seating arrangements, blood relations, syllogisms, and coding-decoding.',
        category: 'FUNDAMENTALS',
        topicCount: 21,
        questionCount: 190,
        iconName: 'Brain',
        focusTopics: ['Seating Arrangement', 'Syllogisms', 'Blood Relations', 'Puzzles'],
      },
      {
        id: 'verbal',
        subjectKey: 'VERBAL',
        name: 'Verbal Ability',
        description: 'Reading comprehension, grammar, para-jumbles, vocabulary, and error detection.',
        category: 'FUNDAMENTALS',
        topicCount: 14,
        questionCount: 150,
        iconName: 'FileText',
        focusTopics: ['Reading Comprehension', 'Sentence Correction', 'Para Jumbles'],
      },
      {
        id: 'data-interpretation',
        subjectKey: 'DATA_INTERPRETATION',
        name: 'Data Interpretation',
        description: 'Tables, bar charts, line graphs, pie charts, and caselet data analysis.',
        category: 'FUNDAMENTALS',
        topicCount: 7,
        questionCount: 95,
        iconName: 'BarChart2',
        focusTopics: ['Tables & Pie Charts', 'Bar Graphs', 'Caselets'],
      },
    ],
  },
  {
    id: 'CODING',
    title: 'Coding & Problem Solving',
    description: 'Language fundamentals, Data Structures & Algorithms, and high-frequency coding patterns.',
    domains: [
      {
        id: 'programming-fundamentals',
        subjectKey: 'PROGRAMMING',
        name: 'Programming Fundamentals',
        description: 'Variables, loops, functions, recursion, memory management in C++, Java, Python, JS.',
        category: 'CODING',
        topicCount: 12,
        questionCount: 140,
        iconName: 'Code',
        focusTopics: ['Recursion & Pointers', 'Memory Allocation', 'Control Flow'],
      },
      {
        id: 'dsa',
        subjectKey: 'DSA',
        name: 'Data Structures & Algorithms',
        description: 'Arrays, Trees, Graphs, Dynamic Programming, Backtracking, and Greedy strategies.',
        category: 'CODING',
        topicCount: 22,
        questionCount: 310,
        iconName: 'Code2',
        focusTopics: ['Dynamic Programming', 'Graph BFS/DFS', 'Trees & Heaps', 'Binary Search'],
      },
      {
        id: 'coding-patterns',
        subjectKey: 'CODING_PATTERNS',
        name: 'Coding Patterns',
        description: 'Master the 15 universal patterns: Two Pointers, Sliding Window, Monotonic Stack, etc.',
        category: 'CODING',
        topicCount: 15,
        questionCount: 185,
        iconName: 'Zap',
        focusTopics: ['Sliding Window', 'Two Pointers', 'Monotonic Stack', 'Fast & Slow'],
      },
      {
        id: 'competitive',
        subjectKey: 'COMPETITIVE',
        name: 'Competitive Problem Solving',
        description: 'Time-bounded coding challenge simulations with strict complexity verification.',
        category: 'CODING',
        topicCount: 10,
        questionCount: 120,
        iconName: 'Terminal',
        focusTopics: ['Bit Manipulation', 'Segment Trees', 'Disjoint Set Union'],
      },
    ],
  },
  {
    id: 'CORE_CS',
    title: 'Core Computer Science',
    description: 'Foundational CS subjects tested in technical screening and core engineering interviews.',
    domains: [
      {
        id: 'oop',
        subjectKey: 'OOP',
        name: 'Object-Oriented Programming',
        description: 'Encapsulation, Inheritance, Polymorphism, Abstraction, and SOLID principles.',
        category: 'CORE_CS',
        topicCount: 12,
        questionCount: 130,
        iconName: 'Layers',
        focusTopics: ['SOLID Principles', 'Interfaces vs Abstraction', 'Polymorphism'],
      },
      {
        id: 'dbms',
        subjectKey: 'DBMS',
        name: 'Database Management Systems',
        description: 'Relational model, ACID transactions, B+ Trees indexing, locks, and 1NF-BCNF normalization.',
        category: 'CORE_CS',
        topicCount: 14,
        questionCount: 160,
        iconName: 'Database',
        focusTopics: ['Transactions & ACID', '3NF & BCNF', 'B+ Tree Indexing', 'Locking'],
      },
      {
        id: 'sql',
        subjectKey: 'SQL',
        name: 'SQL Query & Optimization',
        description: 'Joins, CTEs, Window Functions, Subqueries, Indexes, and Query Execution Plans.',
        category: 'CORE_CS',
        topicCount: 15,
        questionCount: 175,
        iconName: 'Database',
        focusTopics: ['Window Functions', 'Complex Joins', 'CTEs', 'Index Optimization'],
      },
      {
        id: 'operating-systems',
        subjectKey: 'OPERATING_SYSTEMS',
        name: 'Operating Systems',
        description: 'Processes, Threads, CPU Scheduling, Synchronization, Deadlocks, Paging & Virtual Memory.',
        category: 'CORE_CS',
        topicCount: 15,
        questionCount: 180,
        iconName: 'Cpu',
        focusTopics: ['Process Synchronization', 'Deadlocks', 'Virtual Memory & Paging'],
      },
      {
        id: 'computer-networks',
        subjectKey: 'COMPUTER_NETWORKS',
        name: 'Computer Networks',
        description: 'OSI 7-Layer model, TCP/IP, Subnetting, Routing, DNS, HTTP/HTTPS, and Sockets.',
        category: 'CORE_CS',
        topicCount: 16,
        questionCount: 190,
        iconName: 'Globe',
        focusTopics: ['TCP vs UDP', 'HTTP/HTTPS & TLS', 'Subnetting & IP', 'DNS'],
      },
      {
        id: 'computer-architecture',
        subjectKey: 'COMPUTER_ARCHITECTURE',
        name: 'Computer Architecture',
        description: 'CPU pipeline execution, Cache hierarchy, Memory management, and RISC vs CISC.',
        category: 'CORE_CS',
        topicCount: 10,
        questionCount: 110,
        iconName: 'Cpu',
        focusTopics: ['Instruction Pipelining', 'Cache Line Mapping', 'Memory Hierarchy'],
      },
      {
        id: 'software-engineering',
        subjectKey: 'SOFTWARE_ENGINEERING',
        name: 'Software Engineering',
        description: 'SDLC models, Agile development, Testing strategies, and Code Review practices.',
        category: 'CORE_CS',
        topicCount: 10,
        questionCount: 95,
        iconName: 'CheckSquare',
        focusTopics: ['SDLC & Agile', 'Unit & Integration Testing', 'Code Quality'],
      },
    ],
  },
  {
    id: 'SYSTEM_DESIGN',
    title: 'System Design',
    description: 'Low-Level Design (LLD), Object-Oriented Patterns, and High-Level Design (HLD) distributed architecture.',
    domains: [
      {
        id: 'lld',
        subjectKey: 'LLD',
        name: 'Low-Level Design (LLD)',
        description: 'Design patterns (Singleton, Factory, Strategy, Observer) & machine coding problems like Parking Lot, Splitwise.',
        category: 'SYSTEM_DESIGN',
        topicCount: 16,
        questionCount: 140,
        iconName: 'Grid',
        focusTopics: ['Parking Lot Design', 'Splitwise System', 'Rate Limiter LLD', 'Factory & Strategy'],
      },
      {
        id: 'hld',
        subjectKey: 'HLD',
        name: 'High-Level Design (HLD)',
        description: 'Distributed systems scalability, load balancers, database sharding, CAP theorem & Uber/Netflix architecture.',
        category: 'SYSTEM_DESIGN',
        topicCount: 15,
        questionCount: 125,
        iconName: 'Server',
        focusTopics: ['URL Shortener', 'Uber Architecture', 'Database Sharding', 'Load Balancing'],
      },
      {
        id: 'system-design-fundamentals',
        subjectKey: 'SYSTEM_DESIGN_FUNDAMENTALS',
        name: 'System Design Fundamentals',
        description: 'Throughput, Latency, Scalability, Fault Tolerance, Consistency Models, and Microservices.',
        category: 'SYSTEM_DESIGN',
        topicCount: 10,
        questionCount: 105,
        iconName: 'Activity',
        focusTopics: ['CAP Theorem', 'Consistency Models', 'Idempotency & Retries'],
      },
    ],
  },
  {
    id: 'DEVELOPMENT',
    title: 'Development & Engineering',
    description: 'Modern Web, Frontend, Backend, APIs, Linux commands, Git workflow, and Cloud DevOps.',
    domains: [
      {
        id: 'frontend',
        subjectKey: 'FRONTEND',
        name: 'Frontend Development',
        description: 'HTML5, CSS3, Modern JavaScript (ES6+), React State & Hooks, DOM Events, and Web Vitals.',
        category: 'DEVELOPMENT',
        topicCount: 14,
        questionCount: 150,
        iconName: 'Layout',
        focusTopics: ['React Hooks & State', 'DOM Event Loop', 'CSS Flexbox/Grid'],
      },
      {
        id: 'backend',
        subjectKey: 'BACKEND',
        name: 'Backend Development',
        description: 'Node.js, Express, REST APIs, Microservices, Middleware, Authentication (JWT), and ORM.',
        category: 'DEVELOPMENT',
        topicCount: 14,
        questionCount: 160,
        iconName: 'Server',
        focusTopics: ['Node Event Loop', 'JWT & Auth', 'Express Middleware', 'REST Design'],
      },
      {
        id: 'web-dev',
        subjectKey: 'WEB_DEV',
        name: 'Web Fundamentals & Security',
        description: 'HTTP protocol, Cookies, Sessions, CORS, CSRF, XSS, and Browser Rendering Lifecycle.',
        category: 'DEVELOPMENT',
        topicCount: 10,
        questionCount: 110,
        iconName: 'Globe',
        focusTopics: ['CORS & CSRF Security', 'HTTP Headers & Cookies', 'Browser Storage'],
      },
      {
        id: 'git',
        subjectKey: 'GIT',
        name: 'Git & Version Control',
        description: 'Branching strategies, Merge vs Rebase, Stash, Cherry-pick, Conflict Resolution, and PR workflows.',
        category: 'DEVELOPMENT',
        topicCount: 8,
        questionCount: 85,
        iconName: 'GitBranch',
        focusTopics: ['Merge vs Rebase', 'Git Stash & Reset', 'Conflict Resolution'],
      },
      {
        id: 'linux',
        subjectKey: 'LINUX',
        name: 'Linux & Command Line',
        description: 'Shell commands, file permissions, process management, grep, awk, sed, and environment variables.',
        category: 'DEVELOPMENT',
        topicCount: 9,
        questionCount: 95,
        iconName: 'Terminal',
        focusTopics: ['File Permissions (chmod)', 'Grep & Awk', 'Process Signals (kill)'],
      },
      {
        id: 'devops',
        subjectKey: 'DEVOPS',
        name: 'Cloud & DevOps Fundamentals',
        description: 'Docker containers, Docker Compose, CI/CD pipelines, Nginx reverse proxy, and AWS basics.',
        category: 'DEVELOPMENT',
        topicCount: 10,
        questionCount: 100,
        iconName: 'Cloud',
        focusTopics: ['Docker Containers', 'CI/CD Pipelines', 'Nginx Reverse Proxy'],
      },
    ],
  },
  {
    id: 'SPECIALIZED',
    title: 'Specialized Track',
    description: 'AI/ML concepts, Cyber Security fundamentals, and Data Engineering foundations.',
    domains: [
      {
        id: 'ai-ml',
        subjectKey: 'AI_ML',
        name: 'AI & Machine Learning Fundamentals',
        description: 'Supervised vs Unsupervised learning, LLMs, RAG, Embeddings, Prompt Engineering, and Feature Scaling.',
        category: 'SPECIALIZED',
        topicCount: 12,
        questionCount: 120,
        iconName: 'Sparkles',
        focusTopics: ['LLM & RAG Architecture', 'Embeddings', 'Classification vs Regression'],
      },
      {
        id: 'cyber-security',
        subjectKey: 'CYBER_SECURITY',
        name: 'Cyber Security Fundamentals',
        description: 'Encryption, Hashing, Symmetric vs Asymmetrical keys, OWASP Top 10, and Network Security.',
        category: 'SPECIALIZED',
        topicCount: 8,
        questionCount: 80,
        iconName: 'ShieldCheck',
        focusTopics: ['OWASP Top 10', 'AES & RSA Encryption', 'Hashing vs Encryption'],
      },
    ],
  },
  {
    id: 'INTERVIEW_PREP',
    title: 'Interview Preparation',
    description: 'STAR behavioral answers, HR scenario mastery, technical defense, and company-specific tracks.',
    domains: [
      {
        id: 'hr-prep',
        subjectKey: 'HR_BEHAVIORAL_PREP',
        name: 'HR & Behavioral Preparation',
        description: 'STAR Method framework for leadership principles, conflict resolution, failure recovery, and background pitches.',
        category: 'INTERVIEW_PREP',
        topicCount: 12,
        questionCount: 110,
        iconName: 'MessageSquare',
        focusTopics: ['STAR Response Framework', 'Handling Technical Conflicts', 'Project Background Pitch'],
      },
      {
        id: 'company-prep',
        subjectKey: 'COMPANY_PREP',
        name: 'Company Preparation Tracks',
        description: 'Role-focused practice tracks for Amazon, Google, Microsoft, TCS, Infosys, Accenture.',
        category: 'INTERVIEW_PREP',
        topicCount: 10,
        questionCount: 140,
        iconName: 'Briefcase',
        focusTopics: ['Amazon SDE Track', 'TCS Digital Loop', 'Google SWE Preparation'],
      },
    ],
  },
];

// Sample Formulas for Aptitude
export const APTITUDE_FORMULA_SHEETS: Record<string, PrepFormulaSheet[]> = {
  Percentages: [
    {
      title: 'Percentage Change',
      formula: '((New Value - Original Value) / Original Value) * 100',
      explanation: 'Calculates relative percentage increase or decrease from baseline.',
      example: 'Price increases from $80 to $100 -> ((100 - 80) / 80) * 100 = +25%',
      commonTraps: 'Confusing percentage increase with percentage of the new total.',
    },
    {
      title: 'Successive Percentage Change',
      formula: 'A + B + (A * B / 100)',
      explanation: 'Combines two sequential percentage changes A% and B%.',
      example: '+20% followed by +10% -> 20 + 10 + (200 / 100) = +32% total change.',
      commonTraps: 'Simply adding 20% + 10% = 30% (incorrect).',
    },
  ],
  'Time & Work': [
    {
      title: 'Combined Work Rate',
      formula: 'Rate(Total) = (1 / A_time) + (1 / B_time)',
      explanation: 'Work rates add linearly when working together.',
      example: 'A takes 10 days, B takes 15 days -> Combined = (1/10) + (1/15) = 1/6 (6 days total).',
      commonTraps: 'Adding days directly (10 + 15 = 25 days).',
    },
  ],
};

// Coding Pattern Templates
export const CODING_PATTERNS_DATA: PrepCodingPattern[] = [
  {
    id: 'sliding-window',
    patternName: 'Sliding Window',
    whenToUse: 'Subarray or substring problems searching for min, max, or target length.',
    clues: ['Contiguous subarray', 'Subsegment of array/string', 'Target sum or max distinct chars'],
    templateCode: `function slidingWindow(arr, k) {
  let left = 0, windowSum = 0, maxVal = -Infinity;
  for (let right = 0; right < arr.length; right++) {
    windowSum += arr[right];
    if (right - left + 1 === k) {
      maxVal = Math.max(maxVal, windowSum);
      windowSum -= arr[left++];
    }
  }
  return maxVal;
}`,
    commonMistakes: ['Forgetting to shrink window from left', 'Off-by-one window size calculation'],
    sampleProblems: ['Maximum Sum Subarray of Size K', 'Longest Substring Without Repeating Characters'],
  },
  {
    id: 'two-pointers',
    patternName: 'Two Pointers',
    whenToUse: 'Sorted arrays or linked lists seeking pairs/triplets or palindrome checks.',
    clues: ['Array is sorted', 'Search for pair with target sum', 'In-place array manipulation'],
    templateCode: `function twoSumSorted(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left < right) {
    const sum = arr[left] + arr[right];
    if (sum === target) return [left, right];
    else if (sum < target) left++;
    else right--;
  }
  return [];
}`,
    commonMistakes: ['Applying two pointers on unsorted array without sorting first'],
    sampleProblems: ['Two Sum II (Sorted)', 'Container With Most Water', '3Sum'],
  },
];

// LLD Problems Data
export const LLD_PROBLEMS_DATA: PrepLLDProblem[] = [
  {
    id: 'parking-lot',
    title: 'Design a Multi-Level Parking Lot System',
    difficulty: 'MEDIUM',
    requirements: [
      'Support multiple vehicle types (Motorcycle, Car, Truck)',
      'Multiple floors with designated spot sizes',
      'Issue parking ticket upon entry with timestamp',
      'Calculate fee upon exit based on duration and vehicle type',
    ],
    entities: ['ParkingLot', 'ParkingFloor', 'ParkingSpot', 'Vehicle', 'Ticket', 'Payment'],
    classes: ['Vehicle (Abstract)', 'Car', 'Truck', 'Motorcycle', 'Ticket', 'PaymentStrategy'],
    patternsUsed: ['Strategy Pattern (Fee calculation)', 'Singleton Pattern (ParkingLot manager)', 'Factory Pattern (Vehicle creation)'],
    skeletonCode: `// LLD Parking Lot Skeleton (TypeScript)
export abstract class Vehicle {
  constructor(public licensePlate: string, public type: 'CAR' | 'TRUCK' | 'BIKE') {}
}

export class Ticket {
  public issueTime: Date = new Date();
  constructor(public id: string, public spotId: string, public vehicle: Vehicle) {}
}

export interface FeeStrategy {
  calculateFee(durationHours: number, vehicleType: string): number;
}
`,
  },
  {
    id: 'splitwise',
    title: 'Design an Expense Sharing Application (Splitwise)',
    difficulty: 'HARD',
    requirements: [
      'Users can create groups and add expenses',
      'Support Equal, Exact, and Percentage splits',
      'Calculate net balances between members',
      'Simplify debt transactions to minimize transfer count',
    ],
    entities: ['User', 'Group', 'Expense', 'Split', 'BalanceSheet'],
    classes: ['Expense (Abstract)', 'EqualExpense', 'PercentExpense', 'ExpenseManager'],
    patternsUsed: ['Strategy Pattern (Split calculation)', 'Observer Pattern (Expense notifications)'],
    skeletonCode: `// Splitwise LLD Skeleton
export interface Split {
  userId: string;
  amount: number;
}

export abstract class Expense {
  constructor(public id: string, public amount: number, public paidBy: string, public splits: Split[]) {}
}
`,
  },
];

// HLD Case Studies Data
export const HLD_CASE_STUDIES_DATA: PrepHLDCaseStudy[] = [
  {
    id: 'url-shortener',
    title: 'Design a Scalable URL Shortener (TinyURL)',
    estimatedCapacity: '100M URLs created/day • 10:1 Read-to-Write ratio (1 Billion reads/day) • ~500 QPS Write / 5000 QPS Read',
    architectureComponents: ['API Gateway', 'Key Generation Service (KGS)', 'Redis Cache Cluster', 'NoSQL DB (Cassandra / DynamoDB)', 'CDN'],
    databaseStrategy: 'NoSQL document store (Cassandra) indexed by ShortKey for ultra-fast point lookups.',
    cachingStrategy: 'Redis cluster caching top 20% hot URLs (80/20 rule) to achieve <10ms read latency.',
    tradeoffs: ['Base62 vs Hash Collision Resolution', 'Pre-generating Keys (KGS) vs On-the-fly Hashing'],
  },
  {
    id: 'uber-architecture',
    title: 'Design a Real-Time Ride Hailing System (Uber)',
    estimatedCapacity: '5M active drivers • QuadKey / H3 Spatial Indexing • Location pings every 4 seconds',
    architectureComponents: ['Location Ingestion Service', 'Geospatial Index (Redis H3)', 'Match Engine', 'Trip Dispatcher', 'Kafka Stream'],
    databaseStrategy: 'Geospatial Redis + PostgreSQL for user billing & trip history.',
    cachingStrategy: 'In-memory QuadTree / Geohash index in Redis for driver location updates.',
    tradeoffs: ['Push vs Pull for driver location updates', 'Consistent Hashing vs Sharding by City'],
  },
];
