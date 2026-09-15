export interface RecruitmentRound {
  number: number;
  name: string;
  duration: string;
  description: string;
  focusAreas: string[];
  tips: string[];
}

export interface CompanyKit {
  id: string;
  name: string;
  logo: string;
  tier: 'Service' | 'Product' | 'FAANG';
  tierLabel: string;
  packageRange: string;
  hiringRoles: string[];
  roundsCount: number;
  overview: string;
  eligibility: string;
  examPattern: {
    platform: string;
    sections: { name: string; questions: number; timeMinutes: number; cutoffPercent: number }[];
    negativeMarking: boolean;
  };
  rounds: RecruitmentRound[];
  repeatedTopics: string[];
  sampleQuestions: { question: string; type: 'Coding' | 'Technical' | 'HR' | 'Aptitude'; difficulty: 'Easy' | 'Medium' | 'Hard' }[];
  weekByWeekRoadmap: { week: string; goal: string; tasks: string[] }[];
  themeColor: string;
}

export const COMPANY_KITS: CompanyKit[] = [
  {
    id: 'tcs',
    name: 'TCS (Tata Consultancy Services)',
    logo: '🏢',
    tier: 'Service',
    tierLabel: 'IT Services Leader',
    packageRange: '₹3.5 LPA (Ninja) • ₹7.0 LPA (Digital) • ₹9–12 LPA (Prime)',
    hiringRoles: ['Assistant System Engineer', 'Digital Software Engineer', 'Prime Specialist'],
    roundsCount: 4,
    overview: 'TCS hires freshers primarily through the National Qualifier Test (NQT) on TCS iON. The test has two tiers: Foundation (Quant, Verbal, Reasoning) determining Ninja offers, and Advanced (Advanced Quant/Reasoning + 2 Coding problems) unlocking Digital and Prime bands.',
    eligibility: 'B.Tech / B.E / MCA / M.Tech • 60% or 6.0 CGPA throughout (10th, 12th, UG) • Max 1 active backlog allowed at test time.',
    examPattern: {
      platform: 'TCS iON Assessment Engine',
      negativeMarking: false,
      sections: [
        { name: 'Foundation Numerical Ability', questions: 20, timeMinutes: 25, cutoffPercent: 65 },
        { name: 'Foundation Verbal Ability', questions: 25, timeMinutes: 25, cutoffPercent: 60 },
        { name: 'Foundation Reasoning Ability', questions: 20, timeMinutes: 25, cutoffPercent: 65 },
        { name: 'Advanced Quantitative & Reasoning', questions: 15, timeMinutes: 25, cutoffPercent: 70 },
        { name: 'Advanced Coding (2 Problems)', questions: 2, timeMinutes: 90, cutoffPercent: 75 },
      ],
    },
    rounds: [
      {
        number: 1,
        name: 'TCS NQT Online Assessment',
        duration: '190 mins',
        description: 'Single integrated test on TCS iON covering foundation aptitude, advanced quantitative reasoning, and two hands-on coding problems.',
        focusAreas: ['Arithmetic Math', 'Logical Deduction', 'Bitwise Manipulation', 'Array & String Manipulation'],
        tips: ['Focus heavily on Sectional Time Limits—you cannot switch back to previous sections once submitted.', 'Coding problem 1 is usually basic arrays; problem 2 requires hashing or sliding window.'],
      },
      {
        number: 2,
        name: 'Technical Interview',
        duration: '35–45 mins',
        description: 'One-on-one interview focused on C/Java/Python basics, OOPs concepts, SQL queries, and your final year academic project.',
        focusAreas: ['OOPs (Inheritance vs Polymorphism)', 'SQL Joins & Group By', 'Project Architecture', 'Basic DSA'],
        tips: ['Be prepared to write basic SQL queries and explain your project role clearly using STAR.'],
      },
      {
        number: 3,
        name: 'Managerial Interview',
        duration: '20–30 mins',
        description: 'Problem-solving scenarios, work ethics, teamwork, and dealing with conflicting deadlines.',
        focusAreas: ['Situational Judgment', 'Agile & Teamwork', 'Handling Pressure'],
        tips: ['Give concrete examples from college group projects and internships.'],
      },
      {
        number: 4,
        name: 'HR Interview',
        duration: '15 mins',
        description: 'Relocation willingness, shift flexibility, background verification, and company alignment.',
        focusAreas: ['Willingness to Relocate', '2-Year Agreement', 'Company Core Values'],
        tips: ['Express enthusiasm for learning new technologies and confirm readiness for PAN India relocation.'],
      },
    ],
    repeatedTopics: ['Arrays & Hash Maps', 'String Reversals & Palindromes', 'SQL Joins', 'OOPs Principles', 'Number Theory & GCD'],
    sampleQuestions: [
      { question: 'Given an array of integers, rotate the array to the right by k steps.', type: 'Coding', difficulty: 'Easy' },
      { question: 'Find the second most frequent character in a given string.', type: 'Coding', difficulty: 'Easy' },
      { question: 'What is the difference between TRUNCATE, DELETE, and DROP in SQL?', type: 'Technical', difficulty: 'Easy' },
      { question: 'Explain the 4 pillars of OOPs with a real-world banking scenario.', type: 'Technical', difficulty: 'Easy' },
      { question: 'Why TCS, and are you comfortable working on night shifts or 24/7 client rotations?', type: 'HR', difficulty: 'Easy' },
    ],
    weekByWeekRoadmap: [
      { week: 'Week 1', goal: 'Aptitude Speed & Formulas', tasks: ['Time & Work', 'Percentages & Profit/Loss', 'Logical Syllogisms', 'Daily 30-min Speed Drills'] },
      { week: 'Week 2', goal: 'Core Language & Basic DSA', tasks: ['Pointers & Strings in C/Java', 'Array Manipulation', 'Hash Maps', 'Solve 15 TCS NQT Past Coding PYQs'] },
      { week: 'Week 3', goal: 'Core CS (OS, DBMS, OOPs)', tasks: ['SQL Joins & Window Functions', 'Processes vs Threads', 'SOLID Principles', 'Academic Project Review'] },
      { week: 'Week 4', goal: 'Full Mock Simulations', tasks: ['Take 2 Full Timed NQT Mock Assessments', 'Practice Ava Technical Mock Interview', 'HR Behavioral STAR Alignment'] },
    ],
    themeColor: '#4A8BDF',
  },
  {
    id: 'infosys',
    name: 'Infosys',
    logo: '🔷',
    tier: 'Service',
    tierLabel: 'Global IT Consultancy',
    packageRange: '₹3.6 LPA (SE) • ₹6.25 LPA (DSE) • ₹9.5–21 LPA (Specialist Programmer)',
    hiringRoles: ['Systems Engineer (SE)', 'Digital Specialist Engineer (DSE)', 'Specialist Programmer (SP)'],
    roundsCount: 3,
    overview: 'Infosys runs distinct hiring tracks: Systems Engineer (SE) focuses on aptitude, pseudocode, and mathematical puzzles, while DSE and SP are recruited via HackWithInfy / InfyTQ featuring heavy competitive programming (Greedy, Dynamic Programming, Graphs).',
    eligibility: 'B.Tech / B.E / M.Tech / MCA • 60% or 6.0 CGPA minimum • No active backlogs allowed.',
    examPattern: {
      platform: 'Infosys Assessment Platform',
      negativeMarking: false,
      sections: [
        { name: 'Mathematical Ability', questions: 10, timeMinutes: 35, cutoffPercent: 70 },
        { name: 'Logical & Analytical Reasoning', questions: 15, timeMinutes: 25, cutoffPercent: 65 },
        { name: 'Verbal Ability', questions: 20, timeMinutes: 20, cutoffPercent: 60 },
        { name: 'Pseudocode Assessment', questions: 5, timeMinutes: 10, cutoffPercent: 70 },
        { name: 'Numerical Puzzles', questions: 4, timeMinutes: 10, cutoffPercent: 60 },
      ],
    },
    rounds: [
      {
        number: 1,
        name: 'Online Aptitude & Pseudocode Assessment',
        duration: '100 mins',
        description: 'Comprehensive test covering math, analytical reasoning, verbal, pseudocode tracing, and high-difficulty puzzles.',
        focusAreas: ['Pseudocode Tracing', 'Crypto-arithmetic Puzzles', 'Syllogisms', 'Data Interpretation'],
        tips: ['Mathematical questions have high sectional weightage—budget at least 3 minutes per puzzle.', 'Pseudocode questions heavily test bitwise XOR and recursive base conditions.'],
      },
      {
        number: 2,
        name: 'Technical Interview',
        duration: '40 mins',
        description: 'Interview testing DSA implementation, Database normal forms, operating system concurrency, and candidate project code.',
        focusAreas: ['Dynamic Programming (for DSE/SP)', 'Database Indexing', 'API Integration', 'Code Optimization'],
        tips: ['For DSE/SP candidates, interviewers will ask for optimal Big-O space/time proofs.'],
      },
      {
        number: 3,
        name: 'HR & Cultural Alignment',
        duration: '15 mins',
        description: 'Verification of communication clarity, adaptability, Mysore training readiness, and service commitment.',
        focusAreas: ['Infosys Principles', 'Learning Agility', 'Adaptability'],
        tips: ['Express enthusiasm for the world-renowned Infosys Mysore training program.'],
      },
    ],
    repeatedTopics: ['Recursion & Backtracking', 'Dynamic Programming', 'Pseudocode Tracing', 'SQL Subqueries', 'Puzzles'],
    sampleQuestions: [
      { question: 'Given an array, find the maximum subarray sum (Kadane’s Algorithm).', type: 'Coding', difficulty: 'Medium' },
      { question: 'Solve the SEND + MORE = MONEY crypto-arithmetic puzzle.', type: 'Aptitude', difficulty: 'Hard' },
      { question: 'Explain B-Trees and how database indexes speed up SELECT queries.', type: 'Technical', difficulty: 'Medium' },
      { question: 'How do you handle working on a legacy codebase with minimal documentation?', type: 'HR', difficulty: 'Easy' },
    ],
    weekByWeekRoadmap: [
      { week: 'Week 1', goal: 'Pseudocode & Puzzles Mastery', tasks: ['Bitwise Operators & Tracing', 'Crypto-Arithmetic Puzzles', 'Data Sufficiency'] },
      { week: 'Week 2', goal: 'Competitive Programming DSA', tasks: ['Greedy Algorithms', 'Dynamic Programming Patterns', 'Binary Search on Answer'] },
      { week: 'Week 3', goal: 'Databases & Web APIs', tasks: ['Normalization (1NF–BCNF)', 'RESTful Endpoints', 'SQL Complex Joins'] },
      { week: 'Week 4', goal: 'Infosys Mock Rounds', tasks: ['Full 100-min Platform Mock', 'Ava Live Technical Grilling', 'HR STAR Prep'] },
    ],
    themeColor: '#0284C7',
  },
  {
    id: 'accenture',
    name: 'Accenture',
    logo: '⚡',
    tier: 'Service',
    tierLabel: 'Global Technology & Consulting',
    packageRange: '₹4.5 LPA (ASE) • ₹6.5 LPA (AASC) • ₹11 LPA (AEH)',
    hiringRoles: ['Associate Software Engineer (ASE)', 'Advanced ASE (AASC)', 'Accenture Elite Hire (AEH)'],
    roundsCount: 4,
    overview: 'Accenture runs their recruitment process on the HirePro platform across 4 mandatory sequential stages: Cognitive & Technical Assessment (90 mins), Coding Assessment (45 mins, 2 questions), AI Communication Assessment, and Final Technical + HR Interview.',
    eligibility: 'B.Tech / B.E / MCA / M.Tech • 65% or 6.5 CGPA • No active backlogs at time of recruitment.',
    examPattern: {
      platform: 'HirePro Assessment Platform',
      negativeMarking: false,
      sections: [
        { name: 'Cognitive (Quant, Reasoning, Verbal)', questions: 50, timeMinutes: 50, cutoffPercent: 65 },
        { name: 'Technical (Pseudocode, Cloud, Security)', questions: 40, timeMinutes: 40, cutoffPercent: 65 },
        { name: 'Hands-on Coding (2 Questions)', questions: 2, timeMinutes: 45, cutoffPercent: 70 },
        { name: 'AI Voice Communication Test', questions: 30, timeMinutes: 30, cutoffPercent: 75 },
      ],
    },
    rounds: [
      {
        number: 1,
        name: 'Cognitive & Technical Assessment',
        duration: '90 mins',
        description: 'Elimination round covering quantitative aptitude, logical deduction, English, pseudocode, MS Office, cloud fundamentals, and network security.',
        focusAreas: ['Pseudocode Tracing', 'Critical Reasoning', 'Cloud Basics (IaaS/PaaS/SaaS)', 'Network Security'],
        tips: ['Scoring above the threshold immediately launches Round 2 (Coding) in the same session.'],
      },
      {
        number: 2,
        name: 'Coding Assessment',
        duration: '45 mins',
        description: 'Two coding problems on arrays, strings, bit manipulation, or matrix math. Both must compile without errors.',
        focusAreas: ['Array Operations', 'String Parsing', 'Prefix Sums', 'Matrix Transformations'],
        tips: ['At least 1 problem fully passed and 1 partially passed is required to qualify.'],
      },
      {
        number: 3,
        name: 'AI Communication Assessment',
        duration: '30 mins',
        description: 'Automated voice assessment via Pearson/HirePro testing pronunciation, reading fluency, listening recall, and impromptu storytelling.',
        focusAreas: ['Pronunciation & Accent', 'Fluency (No long pauses)', 'Vocabulary', 'Sentence Mastery'],
        tips: ['Use a wired headset with crisp microphone. Speak at 140–160 WPM without filler words.'],
      },
      {
        number: 4,
        name: 'Combined Technical + HR Interview',
        duration: '30 mins',
        description: 'Interviewer reviews resume projects, fundamental CS concepts, situational ethics, and cultural fit.',
        focusAreas: ['Resume Projects', 'Cloud & AI Awareness', 'Team Collaboration', 'Career Goals'],
        tips: ['Be prepared to discuss your project challenges and how you resolved team disagreements.'],
      },
    ],
    repeatedTopics: ['Prefix Sums & Arrays', 'Bitwise Operators', 'Cloud Fundamentals', 'Network Protocols', 'Sentence Correction'],
    sampleQuestions: [
      { question: 'Given an array of integers, return the index of the equilibrium element where sum of left equals sum of right.', type: 'Coding', difficulty: 'Easy' },
      { question: 'What is the primary difference between IaaS, PaaS, and SaaS in Cloud Computing?', type: 'Technical', difficulty: 'Easy' },
      { question: 'Describe a situation where you had to learn an entirely new tech stack in under 2 weeks.', type: 'HR', difficulty: 'Easy' },
    ],
    weekByWeekRoadmap: [
      { week: 'Week 1', goal: 'Cognitive & Pseudocode Prep', tasks: ['MS Office & Cloud MCQs', 'Pseudocode Loops & Recursion', 'Logical Reasoning Drills'] },
      { week: 'Week 2', goal: 'Coding Sprint', tasks: ['String Manipulation', 'Array Searching & Sorting', 'Matrix Traversal', 'Solve 10 Accenture Coding PYQs'] },
      { week: 'Week 3', goal: 'Communication & AI Speech', tasks: ['Practice Reading Aloud', 'Audio Story Retelling', 'Mock Speech Telemetry on Ava'] },
      { week: 'Week 4', goal: 'Final Interview Simulation', tasks: ['Project Architecture Defense', 'Behavioral STAR Scenarios', 'Full HirePro Mock'] },
    ],
    themeColor: '#A0006D',
  },
  {
    id: 'amazon',
    name: 'Amazon',
    logo: '📦',
    tier: 'FAANG',
    tierLabel: 'Big Tech / Tier-1',
    packageRange: '₹30–48 LPA (SDE-1) • Intern: ₹1.1–1.5 Lakh/month',
    hiringRoles: ['Software Development Engineer 1 (SDE-1)', 'SDE Intern', 'Data Engineer'],
    roundsCount: 5,
    overview: 'Amazon’s hiring bar evaluates both technical problem-solving (medium/hard DSA) and deep alignment with Amazon’s 16 Leadership Principles (Customer Obsession, Ownership, Dive Deep, Deliver Results). The final interview includes the infamous "Bar Raiser" round.',
    eligibility: 'B.Tech / M.Tech / MCA in CS/IT/ECE • Strong foundation in Data Structures, Algorithms, and Object-Oriented Design.',
    examPattern: {
      platform: 'Hackerrank / Mettl',
      negativeMarking: false,
      sections: [
        { name: 'Online Coding Assessment (2 Problems)', questions: 2, timeMinutes: 70, cutoffPercent: 100 },
        { name: 'Work Style Assessment (LP Scenarios)', questions: 35, timeMinutes: 20, cutoffPercent: 80 },
      ],
    },
    rounds: [
      {
        number: 1,
        name: 'Online Coding OA + Workstyles',
        duration: '90 mins',
        description: '2 LeetCode Medium/Hard problems + situational judgment test mapping candidate choices to Amazon Leadership Principles.',
        focusAreas: ['Trees & Graphs (BFS/DFS)', 'Dynamic Programming', 'Heaps & Priority Queues', 'Leadership Principles'],
        tips: ['Both coding problems must pass all edge cases including performance bounds within time limits.'],
      },
      {
        number: 2,
        name: 'Technical Round 1: DSA & Problem Solving',
        duration: '60 mins',
        description: 'Deep dive into algorithmic optimization, time/space trade-offs, and 2 Leadership Principle behavioral questions.',
        focusAreas: ['Hash Maps & Sliding Window', 'Two Pointers', 'Graph Traversal', 'Customer Obsession'],
        tips: ['Always state brute-force first, calculate its Big-O, then iteratively optimize before writing clean code.'],
      },
      {
        number: 3,
        name: 'Technical Round 2: Data Structures & LLD',
        duration: '60 mins',
        description: 'Low-Level Object Oriented Design (e.g., Design a Parking Lot, Locker System, or File System) + LP questions.',
        focusAreas: ['Object Oriented Design', 'Design Patterns (Factory, Strategy)', 'Clean Interfaces', 'Ownership'],
        tips: ['Focus on extensibility, loose coupling, and handle error edge cases.'],
      },
      {
        number: 4,
        name: 'Technical Round 3: Algorithms & Scalability',
        duration: '60 mins',
        description: 'Complex tree/graph problem or dynamic programming optimization + Bias for Action scenarios.',
        focusAreas: ['Binary Search Trees', 'Topological Sort', 'Trie / Interval Trees', 'Deliver Results'],
        tips: ['Test your own code manually on edge cases (empty input, single node, cycle) before telling the interviewer you are finished.'],
      },
      {
        number: 5,
        name: 'Bar Raiser Round',
        duration: '60 mins',
        description: 'Conducted by an independent senior leader outside the hiring team to ensure the candidate raises the team bar.',
        focusAreas: ['16 Leadership Principles', 'Conflict Resolution', 'Deep Technical Architecture', 'Frugality & Earn Trust'],
        tips: ['Prepare 6–8 distinct STAR stories highlighting quantifiable impact and ownership.'],
      },
    ],
    repeatedTopics: ['Trees & BST', 'Graph BFS/DFS', 'Topological Sort', 'Heaps & Priority Queues', 'LRU Cache Design', '16 Leadership Principles'],
    sampleQuestions: [
      { question: 'Design an LRU (Least Recently Used) Cache with O(1) get and put operations.', type: 'Coding', difficulty: 'Medium' },
      { question: 'Given a 2D grid of 1s and 0s, count the number of distinct islands.', type: 'Coding', difficulty: 'Medium' },
      { question: 'Trapping Rain Water: Calculate total water trapped between elevation bars.', type: 'Coding', difficulty: 'Hard' },
      { question: 'Tell me about a time you made a critical decision without having all the required data (Bias for Action).', type: 'HR', difficulty: 'Medium' },
      { question: 'Describe a project where you had to push back on a deadline to deliver higher customer quality (Customer Obsession).', type: 'HR', difficulty: 'Hard' },
    ],
    weekByWeekRoadmap: [
      { week: 'Weeks 1–2', goal: 'Core FAANG DSA Mastery', tasks: ['Arrays, Sliding Window, Two Pointers', 'Binary Search Variants', 'LinkedLists & Fast-Slow Pointers'] },
      { week: 'Weeks 3–4', goal: 'Non-Linear Structures & Graphs', tasks: ['Binary Trees & Lowest Common Ancestor', 'Graph BFS/DFS & Dijkstra', 'Heaps / Top K Frequent'] },
      { week: 'Weeks 5–6', goal: 'DP & Low Level Design', tasks: ['1D & 2D Dynamic Programming', 'Design Parking Lot / Elevator System', 'SOLID Principles'] },
      { week: 'Weeks 7–8', goal: 'LP Stories & Mock Grilling', tasks: ['Draft 8 STAR stories for 16 LPs', 'Ava Bar Raiser AI Mock Simulation', 'Monaco Timed OA Practice'] },
    ],
    themeColor: '#F59E0B',
  },
  {
    id: 'google',
    name: 'Google',
    logo: '🌐',
    tier: 'FAANG',
    tierLabel: 'Tier-1 Engineering Bar',
    packageRange: '₹35–55+ LPA (L3 Software Engineer) • Intern: ₹1.5–2.2 Lakh/month',
    hiringRoles: ['Software Engineer (L3)', 'SWE Intern', 'Associate Product Manager'],
    roundsCount: 5,
    overview: 'Google sets the gold standard for algorithmic rigor, clean code modularity, and "Googliness". Interviews consist of 45-minute whiteboarding / Chromebook coding sessions with zero tolerance for suboptimal time complexity.',
    eligibility: 'B.Tech / B.E / M.Tech / PhD in CS or related field • Exceptional algorithmic depth and data structures mastery.',
    examPattern: {
      platform: 'Google Internal Coding Platform',
      negativeMarking: false,
      sections: [
        { name: 'Online Coding Challenge (2 Hard Problems)', questions: 2, timeMinutes: 60, cutoffPercent: 100 },
      ],
    },
    rounds: [
      {
        number: 1,
        name: 'Online Coding Assessment / Phone Screen',
        duration: '45 mins',
        description: 'Fast-paced algorithmic problem solving with a Google engineer via Google Meet + Google Docs/CoderPad.',
        focusAreas: ['Strings & Arrays', 'Dynamic Programming', 'Graph Theory', 'Time Complexity Proofs'],
        tips: ['Write production-quality code with descriptive variable names and helper functions.'],
      },
      {
        number: 2,
        name: 'Onsite Coding Round 1: Complex Algorithms',
        duration: '45 mins',
        description: 'Advanced graph traversal, shortest paths, or dynamic programming with state compression.',
        focusAreas: ['Dijkstra / Bellman-Ford', 'Bitmask DP', 'Union Find', 'Trie'],
        tips: ['Communicate your thought process out loud before writing a single line of code.'],
      },
      {
        number: 3,
        name: 'Onsite Coding Round 2: Data Structure Engineering',
        duration: '45 mins',
        description: 'Building custom data structures with composite Big-O operational requirements (e.g., O(1) insert, delete, and getRandom).',
        focusAreas: ['Custom Heap/HashMap hybrids', 'Segment Trees', 'Prefix Trees', 'Memory Efficiency'],
        tips: ['Consider memory layout, cache friendliness, and concurrency implications.'],
      },
      {
        number: 4,
        name: 'Onsite Coding Round 3: Recursive State & Search',
        duration: '45 mins',
        description: 'Backtracking with heavy branch pruning or tree path memoization.',
        focusAreas: ['Recursion Tree Pruning', 'Memoization', 'A* Search', 'Complexity Analysis'],
        tips: ['Explicitly state the recursion stack space in your space complexity analysis.'],
      },
      {
        number: 5,
        name: 'Googliness & Leadership',
        duration: '45 mins',
        description: 'Evaluation of intellectual humility, ethical decision-making, bias for inclusion, and navigating ambiguity.',
        focusAreas: ['Intellectual Humility', 'Handling Ambiguity', 'Peer Collaboration', 'Ethical Standards'],
        tips: ['Show that you welcome constructive criticism, validate peer perspectives, and prioritize user privacy.'],
      },
    ],
    repeatedTopics: ['Trie & Prefix Matching', 'Dijkstra & BFS/DFS', 'Segment Trees', 'Bitmask DP', 'Union Find / Disjoint Sets', 'Googliness'],
    sampleQuestions: [
      { question: 'Implement an Autocomplete System using Trie with top 3 most frequent suggestions.', type: 'Coding', difficulty: 'Hard' },
      { question: 'Word Ladder II: Find all shortest transformation sequences from beginWord to endWord.', type: 'Coding', difficulty: 'Hard' },
      { question: 'Tell me about a time you advocated for an engineering decision that was initially rejected by your peers.', type: 'HR', difficulty: 'Medium' },
    ],
    weekByWeekRoadmap: [
      { week: 'Weeks 1–3', goal: 'Advanced Trees & Graphs', tasks: ['Trie & Aho-Corasick', 'Dijkstra & Minimum Spanning Tree', 'Bridges & Articulation Points'] },
      { week: 'Weeks 4–6', goal: 'Hard Dynamic Programming', tasks: ['DP on Trees', 'Bitmask State Compression', 'Digit DP & Knapsack Variants'] },
      { week: 'Weeks 7–8', goal: 'Custom Data Structures', tasks: ['Segment Trees / Fenwick Trees', 'LRU/LFU Caches', 'Disjoint Set Union (DSU)'] },
      { week: 'Weeks 9–10', goal: 'Google Whiteboard Mock', tasks: ['Daily 45-min Timed Coding on Plain Text', 'Ava Googliness Behavioral Simulation'] },
    ],
    themeColor: '#EA4335',
  },
  {
    id: 'flipkart',
    name: 'Flipkart',
    logo: '🛍️',
    tier: 'Product',
    tierLabel: 'Top Tier Indian Unicorn',
    packageRange: '₹18–32 LPA (SDE-1) • Intern: ₹80k–1.2 Lakh/month',
    hiringRoles: ['Software Development Engineer 1', 'UI Engineer', 'Data Analyst'],
    roundsCount: 4,
    overview: 'Flipkart’s hiring loop is heavily focused on Machine Coding (a 90–120 minute live low-level design implementation round), advanced DSA, and high-concurrency e-commerce scaling scenarios.',
    eligibility: 'B.Tech / M.Tech in CS/IT • Strong grasp of OOPs, LLD, and concurrency.',
    examPattern: {
      platform: 'HackerEarth / Mettl',
      negativeMarking: false,
      sections: [
        { name: 'Online Coding Challenge (3 Problems)', questions: 3, timeMinutes: 90, cutoffPercent: 80 },
      ],
    },
    rounds: [
      {
        number: 1,
        name: 'Online Coding Assessment (GRiD / Campus)',
        duration: '90 mins',
        description: '3 algorithmic problems testing greedy paradigms, intervals, graph shortest paths, and dynamic programming.',
        focusAreas: ['Greedy Scheduling', 'Interval Merging', 'BFS/DFS', 'Dynamic Programming'],
        tips: ['All test cases including memory limits must pass cleanly.'],
      },
      {
        number: 2,
        name: 'Machine Coding Round (Live LLD)',
        duration: '90–120 mins',
        description: 'Signature Flipkart round: Candidates are given a real problem (e.g. Design Flipkart Flash Sale, In-Memory Ride Sharing, or Splitwise) and must write fully working, modular OOP code with driver tests.',
        focusAreas: ['Clean OOP Architecture', 'Design Patterns', 'Thread Safety & Concurrency', 'Driver Test Suite'],
        tips: ['Focus on separation of concerns (Models, Services, Repositories). The code MUST compile and run.'],
      },
      {
        number: 3,
        name: 'Problem Solving & DSA',
        duration: '60 mins',
        description: 'Hard algorithmic problem solving focused on tree traversal, graph shortest paths, and memoization.',
        focusAreas: ['Graph Traversal', 'Binary Search on Values', 'Dynamic Programming'],
        tips: ['Explain edge case handling: empty input, concurrent calls, integer overflows.'],
      },
      {
        number: 4,
        name: 'Hiring Manager & Culture Fit',
        duration: '45 mins',
        description: 'Past projects review, architectural choices, handling pressure during Big Billion Days, and startup agility.',
        focusAreas: ['Project Deep Dive', 'Ownership & Hustle', 'E-Commerce Scale Thinking'],
        tips: ['Highlight past experiences where you built scalable systems or resolved critical bottlenecks.'],
      },
    ],
    repeatedTopics: ['Machine Coding LLD', 'Concurrency & Thread Safety', 'Intervals & Scheduling', 'Graph Shortest Paths', 'Design Patterns'],
    sampleQuestions: [
      { question: 'Machine Coding: Design a Flash Sale System handling limited inventory and concurrent checkout requests.', type: 'Coding', difficulty: 'Hard' },
      { question: 'Given an array of meeting intervals, find the minimum number of conference rooms required.', type: 'Coding', difficulty: 'Medium' },
      { question: 'How would you prevent double-spending when 10,000 users click "Buy Now" on the last iPhone in stock?', type: 'Technical', difficulty: 'Hard' },
    ],
    weekByWeekRoadmap: [
      { week: 'Week 1', goal: 'Machine Coding Mastery', tasks: ['Design Patterns: Factory, Singleton, Strategy', 'Build In-Memory Splitwise', 'Build Snake & Ladder OOP Engine'] },
      { week: 'Week 2', goal: 'Concurrency & Thread Safety', tasks: ['Java/Go Concurrency Primitives', 'Mutex, Locks, Semaphores', 'Build Thread-Safe In-Memory Cache'] },
      { week: 'Week 3', goal: 'Advanced Algorithmic Patterns', tasks: ['Interval Merging', 'Topological Sort', 'Dijkstra & 0/1 BFS'] },
      { week: 'Week 4', goal: 'Mock Machine Coding', tasks: ['90-min Live Machine Coding Simulation', 'Ava Hiring Manager Round'] },
    ],
    themeColor: '#2563EB',
  },
];
