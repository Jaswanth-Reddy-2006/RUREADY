export interface CsQuestion {
  id: string;
  question: string;
  answer: string;
  keyPoints: string[];
  codeSnippet?: string;
  language?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  companyTags: string[];
}

export interface CsTopic {
  id: string;
  title: string;
  summary: string;
  coreConcepts: { term: string; definition: string }[];
}

export interface CsSubject {
  id: string;
  name: string;
  code: string;
  icon: string;
  color: string;
  tagline: string;
  overview: string;
  topics: CsTopic[];
  questions: CsQuestion[];
}

export const CORE_CS_SUBJECTS: CsSubject[] = [
  {
    id: 'os',
    name: 'Operating Systems',
    code: 'OS',
    icon: '💻',
    color: '#4A8BDF',
    tagline: 'Process Scheduling, Concurrency, Memory & Deadlocks',
    overview: 'The bridge between software and hardware. Tested in over 85% of technical campus interviews for freshers across service and product companies.',
    topics: [
      {
        id: 'processes-threads',
        title: 'Processes vs Threads & Concurrency',
        summary: 'A process is an executing instance of a program with isolated virtual memory. A thread is a lightweight execution unit inside a process sharing code, data, and OS resources with its sibling threads.',
        coreConcepts: [
          { term: 'Process Control Block (PCB)', definition: 'Data structure in OS kernel containing process state, program counter, CPU registers, CPU scheduling info, and memory-management info.' },
          { term: 'Context Switching', definition: 'The state saving of the active process/thread and state restoration of another process/thread so execution can resume later. Involves CPU cache flushing overhead.' },
          { term: 'Race Condition', definition: 'A concurrency flaw where multiple threads access and manipulate shared data concurrently, and the outcome depends on the nondeterministic execution order.' },
        ],
      },
      {
        id: 'deadlocks',
        title: 'Deadlocks & Banker’s Algorithm',
        summary: 'A situation where a set of processes are blocked because each process is holding a resource and waiting for another resource held by some other process in the same set.',
        coreConcepts: [
          { term: 'Coffman Conditions', definition: 'The 4 necessary conditions for deadlock: 1) Mutual Exclusion, 2) Hold and Wait, 3) No Preemption, 4) Circular Wait.' },
          { term: 'Banker’s Algorithm', definition: 'Deadlock avoidance algorithm developed by Dijkstra that tests for safety by simulating the allocation of predetermined maximum possible amounts of all resources.' },
        ],
      },
      {
        id: 'memory-management',
        title: 'Virtual Memory, Paging & Segmentation',
        summary: 'Virtual memory creates an illusion of large contiguous memory, allowing programs larger than physical RAM to execute seamlessly.',
        coreConcepts: [
          { term: 'Paging', definition: 'Memory management scheme dividing physical memory into fixed-size blocks (Frames) and logical memory into same-size blocks (Pages).' },
          { term: 'Page Fault', definition: 'Hardware interrupt raised when a program accesses a virtual memory page that is currently not mapped into physical RAM, requiring disk I/O.' },
          { term: 'Thrashing', definition: 'A state where the CPU spends significantly more time swapping pages in and out of disk than executing instructions due to insufficient memory.' },
        ],
      },
    ],
    questions: [
      {
        id: 'os-1',
        question: 'What is the fundamental difference between a Process and a Thread?',
        answer: 'A Process is an isolated program execution unit with its own independent address space, file handles, and memory map. If one process crashes, other processes are unaffected.\n\nA Thread is a lightweight sub-execution flow inside a process. Multiple threads in the same process share the same heap, data, and code segments, but maintain their own independent Program Counter, CPU registers, and call stack. A crash in one thread can terminate the entire process.',
        keyPoints: [
          'Processes have independent memory; threads share heap memory.',
          'Context switching between threads is much faster than between processes because page tables and TLB caches do not need to be flushed.',
          'Processes communicate via IPC (Inter-Process Communication like pipes, sockets, shared memory); threads communicate directly via shared memory with synchronization.',
        ],
        difficulty: 'Easy',
        companyTags: ['TCS', 'Infosys', 'Accenture', 'Amazon', 'Microsoft'],
      },
      {
        id: 'os-2',
        question: 'Explain the 4 Coffman Conditions required for a Deadlock to occur.',
        answer: 'A deadlock can arise if and only if all four of the following conditions hold simultaneously in a system:\n\n1. Mutual Exclusion: At least one resource must be held in a non-shareable mode (only one process can use it at a time).\n2. Hold and Wait: A process must be holding at least one resource and waiting to acquire additional resources held by other processes.\n3. No Preemption: Resources cannot be forcibly taken away; a resource can be released only voluntarily by the process holding it.\n4. Circular Wait: A closed chain of processes exists such that each process holds at least one resource needed by the next process in the chain (P0 waits for P1, P1 waits for P2... Pn waits for P0).',
        keyPoints: [
          'Breaking ANY single condition prevents deadlocks.',
          'Deadlock Prevention aims to eliminate one of the 4 Coffman conditions at design time.',
          'Deadlock Avoidance uses dynamic state tracking (like Banker’s Algorithm) to never enter an unsafe state.',
        ],
        difficulty: 'Medium',
        companyTags: ['Infosys', 'Amazon', 'Flipkart', 'Wipro'],
      },
      {
        id: 'os-3',
        question: 'What is Thrashing in Virtual Memory, and how does the OS recover from it?',
        answer: 'Thrashing occurs when the virtual memory subsystem is under severe memory pressure, causing the operating system to spend more time swapping pages between disk and RAM than actually executing application instructions.\n\nCause: As more processes are admitted into memory, the page frames allocated to each process decrease. When a process’s allocated frames fall below its active "Working Set", page faults occur on almost every memory reference.\n\nRecovery: The OS resolves thrashing using Working Set Models or Page Fault Frequency (PFF). If thrashing is detected, the OS suspends (swaps out) one or more lower-priority processes entirely to free up RAM for remaining processes.',
        keyPoints: [
          'CPU utilization drops drastically during thrashing while Disk I/O reaches 100%.',
          'The Working Set Model tracks the set of pages referenced by a process in the most recent Δ time window.',
        ],
        difficulty: 'Medium',
        companyTags: ['Amazon', 'Google', 'Flipkart'],
      },
    ],
  },
  {
    id: 'dbms',
    name: 'DBMS & SQL',
    code: 'DBMS',
    icon: '🗄️',
    color: '#0284C7',
    tagline: 'ACID Transactions, Normalization, Indexing & Complex Queries',
    overview: 'Database Management Systems and SQL are tested in technical rounds of virtually all SDE, Data Analyst, and Backend hiring loops.',
    topics: [
      {
        id: 'acid-properties',
        title: 'ACID Properties & Transactions',
        summary: 'A transaction is a logical unit of work. ACID guarantees data integrity even in the event of hardware failures or concurrent access.',
        coreConcepts: [
          { term: 'Atomicity', definition: '"All or nothing". Either all operations in the transaction complete successfully, or the entire transaction is rolled back to its initial state.' },
          { term: 'Consistency', definition: 'A transaction brings the database from one valid state to another, preserving all schema invariants and integrity constraints (foreign keys, uniqueness).' },
          { term: 'Isolation', definition: 'Concurrent execution of transactions results in a system state equivalent to serial execution. Controlled via Isolation Levels.' },
          { term: 'Durability', definition: 'Once a transaction commits, its changes survive permanently in non-volatile storage even across unexpected system crashes or power outages.' },
        ],
      },
      {
        id: 'normalization',
        title: 'Database Normalization (1NF to BCNF)',
        summary: 'The process of organizing data to reduce redundancy and eliminate insertion, update, and deletion anomalies.',
        coreConcepts: [
          { term: '1NF (First Normal Form)', definition: 'Each column contains atomic (indivisible) values, and no repeating groups exist.' },
          { term: '2NF (Second Normal Form)', definition: 'Must be in 1NF and have NO Partial Dependencies (all non-key attributes must fully depend on the entire primary key).' },
          { term: '3NF (Third Normal Form)', definition: 'Must be in 2NF and have NO Transitive Dependencies (non-key attributes cannot depend on other non-key attributes).' },
          { term: 'BCNF (Boyce-Codd)', definition: 'A stricter version of 3NF where for every functional dependency X → Y, X must be a super key.' },
        ],
      },
      {
        id: 'indexing',
        title: 'B-Tree Indexing vs Hash Indexing',
        summary: 'An auxiliary data structure that improves the speed of data retrieval operations on a table at the cost of additional write overhead.',
        coreConcepts: [
          { term: 'Clustered Index', definition: 'Determines the physical order of rows in the table. A table can have only ONE clustered index (usually the primary key).' },
          { term: 'Non-Clustered Index', definition: 'Stores a separate list of indexed values alongside pointers to the actual data rows. A table can have multiple non-clustered indexes.' },
        ],
      },
    ],
    questions: [
      {
        id: 'dbms-1',
        question: 'What are the 4 SQL Transaction Isolation Levels and what read phenomena do they prevent?',
        answer: 'The ANSI SQL standard defines four transaction isolation levels:\n\n1. Read Uncommitted: Transactions can read uncommitted changes made by other transactions. Vulnerable to Dirty Reads, Non-Repeatable Reads, and Phantom Reads.\n\n2. Read Committed: A transaction only reads data that has already been committed. Prevents Dirty Reads, but vulnerable to Non-Repeatable Reads and Phantom Reads.\n\n3. Repeatable Read: Guarantees that any data read during the transaction remains unchanged across subsequent reads. Prevents Dirty Reads and Non-Repeatable Reads. (Default in MySQL InnoDB).\n\n4. Serializable: Complete isolation. Transactions execute as if sequentially. Prevents all anomalies including Phantom Reads.',
        keyPoints: [
          'Dirty Read: Reading uncommitted, rolled-back data.',
          'Non-Repeatable Read: Reading row X, another transaction modifies row X and commits, re-reading row X yields different values.',
          'Phantom Read: Re-running a range query (e.g. WHERE salary > 50k) returns newly inserted rows committed by another transaction.',
        ],
        difficulty: 'Hard',
        companyTags: ['Amazon', 'Flipkart', 'Microsoft', 'Google'],
      },
      {
        id: 'dbms-2',
        question: 'Explain the difference between WHERE and HAVING clauses in SQL.',
        answer: 'WHERE filters rows BEFORE any aggregation (GROUP BY) takes place. It operates on individual row records and cannot contain aggregate functions (like SUM, COUNT, AVG).\n\nHAVING filters groups AFTER aggregation (GROUP BY) has been calculated. It operates on grouped summary records and can evaluate aggregate functions.',
        keyPoints: [
          'Syntax Order: SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY',
          'Execution Order: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY',
        ],
        codeSnippet: 'SELECT department_id, COUNT(*) as employee_count\nFROM employees\nWHERE status = \'ACTIVE\'\nGROUP BY department_id\nHAVING COUNT(*) >= 5;',
        language: 'sql',
        difficulty: 'Easy',
        companyTags: ['TCS', 'Infosys', 'Accenture', 'Cognizant'],
      },
    ],
  },
  {
    id: 'cn',
    name: 'Computer Networks',
    code: 'CN',
    icon: '🌐',
    color: '#047857',
    tagline: 'OSI vs TCP/IP, TCP 3-Way Handshake, DNS & HTTP Protocols',
    overview: 'Essential for understanding distributed systems, cloud computing, web APIs, and backend architectures.',
    topics: [
      {
        id: 'osi-tcp-layers',
        title: 'OSI 7-Layer Model vs TCP/IP Suite',
        summary: 'Standardized reference models describing network communications between computing systems.',
        coreConcepts: [
          { term: 'OSI 7 Layers', definition: 'Physical, Data Link (MAC/Ethernet), Network (IP/Routers), Transport (TCP/UDP), Session, Presentation, Application (HTTP/DNS).' },
          { term: 'TCP/IP 4 Layers', definition: 'Network Interface (Link), Internet (IP), Transport (TCP/UDP), Application (HTTP/FTP/SSH).' },
        ],
      },
      {
        id: 'tcp-handshake',
        title: 'TCP 3-Way Handshake & Connection Termination',
        summary: 'The protocol mechanism establishing a reliable, full-duplex byte-stream connection before any application data is exchanged.',
        coreConcepts: [
          { term: 'SYN (Synchronize)', definition: 'Client sends SYN packet with an initial sequence number (ISN) to initiate connection.' },
          { term: 'SYN-ACK', definition: 'Server responds acknowledging client ISN and sends its own server ISN.' },
          { term: 'ACK (Acknowledge)', definition: 'Client acknowledges server ISN. Connection is now ESTABLISHED.' },
        ],
      },
      {
        id: 'dns-lifecycle',
        title: 'What Happens When You Type google.com in a Browser?',
        summary: 'The canonical senior engineering interview question testing the complete journey from user keystroke to rendered pixel.',
        coreConcepts: [
          { term: 'DNS Resolution', definition: 'Browser cache → OS cache → Router → Recursive Resolver (ISP) → Root DNS (.) → TLD DNS (.com) → Authoritative DNS.' },
          { term: 'TLS Handshake', definition: 'Asymmetric encryption key exchange followed by symmetric session key generation for encrypted HTTPS transmission.' },
        ],
      },
    ],
    questions: [
      {
        id: 'cn-1',
        question: 'Compare TCP and UDP. When would an engineer deliberately choose UDP over TCP?',
        answer: 'TCP (Transmission Control Protocol) is connection-oriented, reliable, and ordered. It guarantees packet delivery via acknowledgments, retransmissions, flow control (sliding window), and congestion control. It adds 20 bytes of header overhead.\n\nUDP (User Datagram Protocol) is connectionless, unreliable, and unordered. Packets (datagrams) are sent as "fire and forget" with no guarantee of delivery or sequence, but minimal 8-byte header overhead and zero handshake latency.\n\nWhen to choose UDP:\n- Real-time gaming (lost packet is useless by the time retransmission arrives)\n- Live video/voice streaming (WebRTC, VoIP where latency > minor packet loss)\n- DNS query lookups (quick single request/response where speed is priority)\n- IoT telemetry broadcasting',
        keyPoints: [
          'TCP: Slower, reliable, high overhead, ordered.',
          'UDP: Fast, best-effort, lightweight, unordered.',
        ],
        difficulty: 'Easy',
        companyTags: ['TCS', 'Infosys', 'Amazon', 'Wipro'],
      },
      {
        id: 'cn-2',
        question: 'Explain the TCP 3-Way Handshake step-by-step with sequence and acknowledgment numbers.',
        answer: 'The TCP handshake establishes sequence numbers for reliable full-duplex communication:\n\nStep 1 (SYN): Client sends SYN packet to server with random initial sequence number X (Seq=X, SYN=1).\n\nStep 2 (SYN-ACK): Server receives SYN. It allocates buffers and resources, then replies with SYN-ACK containing its own random sequence number Y, and acknowledges client’s sequence number by sending Ack=X+1 (Seq=Y, Ack=X+1, SYN=1, ACK=1).\n\nStep 3 (ACK): Client receives SYN-ACK. It replies with an ACK packet containing Ack=Y+1. The connection is now established, and client can optionally begin sending application payload data in this third packet.',
        keyPoints: [
          'Protects against delayed duplicate packets from old sessions.',
          'SYN Flood Attack: Malicious clients send thousands of SYNs without completing Step 3, exhausting server connection memory.',
        ],
        difficulty: 'Medium',
        companyTags: ['Amazon', 'Google', 'Microsoft', 'Flipkart'],
      },
    ],
  },
  {
    id: 'oops',
    name: 'OOPs & System Design',
    code: 'OOP',
    icon: '🏗️',
    color: '#A0006D',
    tagline: '4 Pillars of OOPs, SOLID Principles & Design Patterns',
    overview: 'The architectural foundation for building scalable, maintainable, modular enterprise software.',
    topics: [
      {
        id: 'four-pillars',
        title: 'The 4 Pillars of Object-Oriented Programming',
        summary: 'Encapsulation, Abstraction, Inheritance, and Polymorphism form the bedrock of object-oriented languages (Java, C++, Python, TypeScript).',
        coreConcepts: [
          { term: 'Encapsulation', definition: 'Bundling data (attributes) and methods that operate on that data into a single unit (class), while restricting direct access via access modifiers (private, protected).' },
          { term: 'Abstraction', definition: 'Hiding internal implementation complexity and exposing only necessary interfaces to the outside world.' },
          { term: 'Inheritance', definition: 'Mechanism where a child class acquires properties and behaviors of a parent class, promoting code reusability.' },
          { term: 'Polymorphism', definition: '"Many forms". Ability of an object or method to take on multiple forms—Compile-time (Method Overloading) vs Runtime (Method Overriding).' },
        ],
      },
      {
        id: 'solid-principles',
        title: 'SOLID Design Principles',
        summary: 'Five design principles introduced by Robert C. Martin ("Uncle Bob") for writing maintainable, understandable, and flexible software.',
        coreConcepts: [
          { term: 'Single Responsibility (S)', definition: 'A class should have one, and only one, reason to change.' },
          { term: 'Open/Closed (O)', definition: 'Software entities should be open for extension, but closed for modification.' },
          { term: 'Liskov Substitution (L)', definition: 'Subtypes must be substitutable for their base types without altering program correctness.' },
          { term: 'Interface Segregation (I)', definition: 'Clients should not be forced to depend upon interfaces that they do not use.' },
          { term: 'Dependency Inversion (D)', definition: 'High-level modules should not depend on low-level modules; both should depend on abstractions.' },
        ],
      },
    ],
    questions: [
      {
        id: 'oops-1',
        question: 'What is the difference between Method Overloading and Method Overriding?',
        answer: 'Method Overloading occurs within the same class when two or more methods have the same name but different parameters (number of arguments, types, or order). It is resolved at compile time (Static Polymorphism).\n\nMethod Overriding occurs across a parent and child class relationship when a subclass provides a specific implementation of a method that is already defined in its superclass with the exact same name, return type, and parameter list. It is resolved dynamically at runtime (Dynamic Polymorphism via vtable).',
        keyPoints: [
          'Overloading: Same class, different parameter signatures, compile-time binding.',
          'Overriding: Parent-child inheritance, identical parameter signatures, runtime dynamic dispatch.',
        ],
        difficulty: 'Easy',
        companyTags: ['TCS', 'Infosys', 'Accenture', 'Capgemini'],
      },
      {
        id: 'oops-2',
        question: 'Explain the Open/Closed Principle (OCP) with a concrete coding example.',
        answer: 'The Open/Closed Principle states that software components (classes, modules, functions) should be open for extension (adding new functionality), but closed for modification (not modifying existing, tested source code).\n\nViolation: Using a giant switch-case block inside a PaymentProcessor to handle CreditCard, PayPal, and Crypto. Adding ApplePay requires modifying the existing class, introducing regression risk.\n\nCompliant Design: Define a PaymentMethod interface with a processPayment() contract. CreditCardPayment, PayPalPayment, and ApplePayPayment implement this interface independently. PaymentProcessor depends only on the interface, so new payment types can be added without changing PaymentProcessor.',
        keyPoints: [
          'Achieved using interfaces, abstract classes, and the Strategy pattern.',
          'Prevents cascading bugs and simplifies automated testing.',
        ],
        difficulty: 'Medium',
        companyTags: ['Amazon', 'Flipkart', 'Microsoft'],
      },
    ],
  },
];

export interface SqlChallenge {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  tablesUsed: string[];
  initialQuery: string;
  expectedQuery: string;
  explanation: string;
  companyTags: string[];
}

export const SQL_CHALLENGES: SqlChallenge[] = [
  {
    id: 'sql-1',
    title: 'Find Second Highest Salary',
    difficulty: 'Easy',
    description: 'Write a SQL query to find the second highest distinct salary from the employees table. If there is no second highest salary, return NULL.',
    tablesUsed: ['employees'],
    initialQuery: 'SELECT DISTINCT salary \nFROM employees \nORDER BY salary DESC \nLIMIT 1 OFFSET 1;',
    expectedQuery: 'SELECT MAX(salary) as SecondHighestSalary \nFROM employees \nWHERE salary < (SELECT MAX(salary) FROM employees);',
    explanation: 'Using subquery to find the maximum salary strictly less than the overall maximum salary cleanly handles NULL returns when all employees have the same salary or only one employee exists.',
    companyTags: ['TCS', 'Infosys', 'Accenture', 'Amazon'],
  },
  {
    id: 'sql-2',
    title: 'Department Highest Salary',
    difficulty: 'Medium',
    description: 'Find employees who have the highest salary in each of the departments.',
    tablesUsed: ['employees', 'departments'],
    initialQuery: 'SELECT d.name as Department, e.name as Employee, e.salary\nFROM employees e\nJOIN departments d ON e.department_id = d.id\nWHERE (e.department_id, e.salary) IN (\n  SELECT department_id, MAX(salary)\n  FROM employees\n  GROUP BY department_id\n);',
    expectedQuery: 'SELECT d.name as Department, e.name as Employee, e.salary\nFROM employees e\nJOIN departments d ON e.department_id = d.id\nWHERE (e.department_id, e.salary) IN (\n  SELECT department_id, MAX(salary)\n  FROM employees\n  GROUP BY department_id\n);',
    explanation: 'Correlated subquery or tuple matching with (department_id, MAX(salary)) correctly selects ties if multiple employees share the department peak salary.',
    companyTags: ['Amazon', 'Flipkart', 'Microsoft'],
  },
  {
    id: 'sql-3',
    title: 'Rank Employees by Salary with Window Functions',
    difficulty: 'Medium',
    description: 'Rank employees within their department by salary descending using DENSE_RANK().',
    tablesUsed: ['employees'],
    initialQuery: 'SELECT id, name, department_id, salary,\n  DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) as salary_rank\nFROM employees;',
    expectedQuery: 'SELECT id, name, department_id, salary,\n  DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) as salary_rank\nFROM employees;',
    explanation: 'DENSE_RANK() assigns consecutive rank numbers without skipping ranks in case of identical ties (e.g. 1, 2, 2, 3), partitioned per department.',
    companyTags: ['Amazon', 'Google', 'Flipkart'],
  },
];
