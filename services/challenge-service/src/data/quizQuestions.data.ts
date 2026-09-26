// ═══════════════════════════════════════════════════════════════
// RU Ready? — Technical Quiz Question Bank for Multiplayer Quizzes
// ═══════════════════════════════════════════════════════════════

export interface QuizQuestionSeed {
  id: string;
  category: string;
  topic: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const QUIZ_QUESTIONS_BANK: QuizQuestionSeed[] = [
  // DSA
  {
    id: 'quiz-dsa-1',
    category: 'DSA',
    topic: 'Hash Tables',
    difficulty: 'EASY',
    question: 'What is the average time complexity of searching for an element in a Hash Table with good distribution?',
    options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
    correctIndex: 0,
    explanation: 'A hash table with a uniform distribution has an expected/average lookup complexity of O(1).'
  },
  {
    id: 'quiz-dsa-2',
    category: 'DSA',
    topic: 'Trees',
    difficulty: 'MEDIUM',
    question: 'Which traversal of a Binary Search Tree (BST) produces elements in sorted non-decreasing order?',
    options: ['Pre-order', 'In-order', 'Post-order', 'Level-order'],
    correctIndex: 1,
    explanation: 'In-order traversal visits the Left subtree, then the Node, then the Right subtree, producing sorted output for BSTs.'
  },
  {
    id: 'quiz-dsa-3',
    category: 'DSA',
    topic: 'Graphs',
    difficulty: 'MEDIUM',
    question: 'Which algorithm finds the single-source shortest path in a graph with non-negative edge weights in O((V + E) log V)?',
    options: ['Floyd-Warshall', 'Bellman-Ford', 'Dijkstra\'s Algorithm', 'Kruskal\'s Algorithm'],
    correctIndex: 2,
    explanation: 'Dijkstra\'s algorithm with a min-priority queue achieves O((V + E) log V) time complexity for non-negative weighted graphs.'
  },
  {
    id: 'quiz-dsa-4',
    category: 'DSA',
    topic: 'Sorting',
    difficulty: 'EASY',
    question: 'What is the worst-case time complexity of standard QuickSort without random pivot selection?',
    options: ['O(N log N)', 'O(N)', 'O(N^2)', 'O(log N)'],
    correctIndex: 2,
    explanation: 'When the array is already sorted or reverse sorted, standard QuickSort degrades to O(N^2) without randomized or median-of-three pivots.'
  },

  // Operating Systems
  {
    id: 'quiz-os-1',
    category: 'OS',
    topic: 'Deadlocks',
    difficulty: 'MEDIUM',
    question: 'Which of the following is NOT one of the 4 Coffman conditions required for a deadlock to occur?',
    options: ['Mutual Exclusion', 'Hold and Wait', 'Preemption Allowed', 'Circular Wait'],
    correctIndex: 2,
    explanation: 'The 4 conditions are: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait. "Preemption Allowed" prevents deadlocks.'
  },
  {
    id: 'quiz-os-2',
    category: 'OS',
    topic: 'Virtual Memory',
    difficulty: 'EASY',
    question: 'What is a "Page Fault" in an Operating System?',
    options: [
      'A hardware error on the hard drive',
      'An interrupt when an accessed page is not currently in physical RAM',
      'A segmentation fault caused by NULL pointer dereference',
      'A buffer overflow in the kernel stack'
    ],
    correctIndex: 1,
    explanation: 'A page fault is an exception raised when a process attempts to access a memory page that is mapped in virtual address space but not loaded into physical RAM.'
  },
  {
    id: 'quiz-os-3',
    category: 'OS',
    topic: 'Synchronization',
    difficulty: 'MEDIUM',
    question: 'What is the difference between a mutex and a binary semaphore?',
    options: [
      'There is no difference; they are identical',
      'A mutex can only be released by the thread that acquired it, whereas a semaphore can be signaled by any thread',
      'A semaphore can only be used by one thread at all times',
      'A mutex allows priority inversion by default'
    ],
    correctIndex: 1,
    explanation: 'Mutex has the concept of ownership: only the owner thread can release it. A semaphore has no ownership and can be signaled across threads.'
  },

  // Database Management Systems
  {
    id: 'quiz-dbms-1',
    category: 'DBMS',
    topic: 'Transactions',
    difficulty: 'EASY',
    question: 'In ACID properties of Database Management Systems, what does the "I" stand for?',
    options: ['Integrity', 'Isolation', 'Indexing', 'Iteration'],
    correctIndex: 1,
    explanation: 'ACID stands for Atomicity, Consistency, Isolation, and Durability.'
  },
  {
    id: 'quiz-dbms-2',
    category: 'DBMS',
    topic: 'Indexing',
    difficulty: 'MEDIUM',
    question: 'Why are B+ Trees preferred over B Trees for disk-based relational database indexes?',
    options: [
      'B+ Trees store all actual data pointers in leaf nodes linked sequentially, optimizing range queries and disk block reads',
      'B+ Trees require less memory than Hash Indexes',
      'B+ Trees eliminate the need for write locks',
      'B+ Trees perform full table scans in O(1) time'
    ],
    correctIndex: 0,
    explanation: 'In B+ Trees, internal nodes only store keys, fitting more pointers per page, and leaf nodes form a linked list for fast range scans.'
  },
  {
    id: 'quiz-dbms-3',
    category: 'DBMS',
    topic: 'Isolation Levels',
    difficulty: 'HARD',
    question: 'Which transaction isolation level prevents Dirty Reads and Non-Repeatable Reads, but may still permit Phantom Reads?',
    options: ['Read Uncommitted', 'Read Committed', 'Repeatable Read', 'Serializable'],
    correctIndex: 2,
    explanation: 'Repeatable Read prevents dirty and non-repeatable reads by keeping shared locks on read rows until transaction end, but phantom rows can appear in ranges unless Serializable locking is used.'
  },

  // Computer Networks
  {
    id: 'quiz-networks-1',
    category: 'Networks',
    topic: 'Transport Layer',
    difficulty: 'EASY',
    question: 'How many packets are exchanged in the standard TCP connection establishment handshake?',
    options: ['2 (SYN, ACK)', '3 (SYN, SYN-ACK, ACK)', '4 (SYN, ACK, DATA, FIN)', '1 (CONNECT)'],
    correctIndex: 1,
    explanation: 'TCP uses a 3-way handshake: Client sends SYN, Server replies with SYN-ACK, and Client confirms with ACK.'
  },
  {
    id: 'quiz-networks-2',
    category: 'Networks',
    topic: 'Protocols',
    difficulty: 'MEDIUM',
    question: 'What underlying transport protocol does HTTP/3 utilize instead of TCP?',
    options: ['UDP / QUIC', 'SCTP', 'WebSocket over TLS', 'Raw IP Sockets'],
    correctIndex: 0,
    explanation: 'HTTP/3 runs over QUIC (built on UDP), resolving TCP head-of-line blocking and providing faster 0-RTT handshakes.'
  },

  // System Design
  {
    id: 'quiz-systemdesign-1',
    category: 'System Design',
    topic: 'Distributed Systems',
    difficulty: 'MEDIUM',
    question: 'According to the CAP theorem, in the presence of a network partition (P), a distributed system must choose between:',
    options: ['Cost and Performance', 'Consistency and Availability', 'Concurrency and Durability', 'Throughput and Latency'],
    correctIndex: 1,
    explanation: 'The CAP theorem states that when network partitions occur, a distributed data store can guarantee either Consistency (CP) or Availability (AP), but not both.'
  },
  {
    id: 'quiz-systemdesign-2',
    category: 'System Design',
    topic: 'Caching',
    difficulty: 'MEDIUM',
    question: 'In a "Cache-Aside" (Lazy Loading) caching pattern, what happens when a read request occurs?',
    options: [
      'The application always queries the database directly and writes to cache in the background',
      'The application checks cache first; if cache miss, it reads from DB and writes the result to cache before returning',
      'The database updates the cache synchronously on every SQL write',
      'Cache invalidation occurs every second'
    ],
    correctIndex: 1,
    explanation: 'In Cache-Aside, the application inspects the cache first. On a miss, it fetches from the DB, populates the cache with the record, and returns it.'
  }
];
