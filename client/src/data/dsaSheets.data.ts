export interface DsaProblem {
  id: string;
  title: string;
  pattern: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  companyTags: string[];
  solved?: boolean;
  status?: 'UNSOLVED' | 'SOLVED' | 'REVISE';
  leetcodeUrl?: string;
  sandboxProblemId?: string;
}

export interface DsaPatternGroup {
  id: string;
  name: string;
  description: string;
  problemsCount: number;
  problems: DsaProblem[];
}

export const DSA_PATTERNS: DsaPatternGroup[] = [
  {
    id: 'two-pointers',
    name: 'Two Pointers & Sliding Window',
    description: 'Optimal O(N) linear time techniques for sorted arrays, palindromes, substrings, and subarrays.',
    problemsCount: 5,
    problems: [
      { id: 'p-1', title: 'Two Sum II - Input Array Is Sorted', pattern: 'Two Pointers', difficulty: 'Easy', companyTags: ['Amazon', 'Google'], sandboxProblemId: 'two-sum' },
      { id: 'p-2', title: 'Valid Palindrome', pattern: 'Two Pointers', difficulty: 'Easy', companyTags: ['Facebook', 'Microsoft', 'TCS'], sandboxProblemId: 'valid-palindrome' },
      { id: 'p-3', title: '3Sum', pattern: 'Two Pointers', difficulty: 'Medium', companyTags: ['Amazon', 'Microsoft', 'Flipkart'], sandboxProblemId: '3sum' },
      { id: 'p-4', title: 'Container With Most Water', pattern: 'Two Pointers', difficulty: 'Medium', companyTags: ['Google', 'Amazon'], sandboxProblemId: 'container-with-most-water' },
      { id: 'p-5', title: 'Longest Substring Without Repeating Characters', pattern: 'Sliding Window', difficulty: 'Medium', companyTags: ['Amazon', 'Microsoft'], sandboxProblemId: 'longest-substring-without-repeating-characters' },
    ],
  },
  {
    id: 'stack-and-queue',
    name: 'Stack & Monotonic Queue',
    description: 'LIFO structures for parenthesis validation, next greater elements, and histogram evaluations.',
    problemsCount: 4,
    problems: [
      { id: 'p-6', title: 'Valid Parentheses', pattern: 'Stack', difficulty: 'Easy', companyTags: ['Amazon', 'Google', 'TCS', 'Infosys'], sandboxProblemId: 'valid-parentheses' },
      { id: 'p-7', title: 'Min Stack', pattern: 'Stack', difficulty: 'Medium', companyTags: ['Amazon', 'Microsoft'] },
      { id: 'p-8', title: 'Daily Temperatures', pattern: 'Monotonic Stack', difficulty: 'Medium', companyTags: ['Amazon', 'Meta'] },
      { id: 'p-9', title: 'Trapping Rain Water', pattern: 'Monotonic Stack / Two Pointers', difficulty: 'Hard', companyTags: ['Amazon', 'Google', 'Flipkart'], sandboxProblemId: 'trapping-rain-water' },
    ],
  },
  {
    id: 'trees-and-graphs',
    name: 'Trees & Graph Traversal (BFS / DFS)',
    description: 'Hierarchical node traversal, topological sorting, connected components, and cycle detection.',
    problemsCount: 4,
    problems: [
      { id: 'p-10', title: 'Invert Binary Tree', pattern: 'Tree DFS', difficulty: 'Easy', companyTags: ['Google', 'Microsoft'] },
      { id: 'p-11', title: 'Maximum Depth of Binary Tree', pattern: 'Tree BFS/DFS', difficulty: 'Easy', companyTags: ['Amazon', 'Infosys'] },
      { id: 'p-12', title: 'Number of Islands', pattern: 'Graph DFS', difficulty: 'Medium', companyTags: ['Amazon', 'Google', 'Flipkart'], sandboxProblemId: 'number-of-islands' },
      { id: 'p-13', title: 'Course Schedule (Cycle Detection)', pattern: 'Topological Sort', difficulty: 'Medium', companyTags: ['Amazon', 'Microsoft'] },
    ],
  },
  {
    id: 'dynamic-programming',
    name: 'Dynamic Programming & Memoization',
    description: 'Overlapping subproblems and optimal substructure. 1D arrays, 2D grids, and 0/1 Knapsack paradigms.',
    problemsCount: 4,
    problems: [
      { id: 'p-14', title: 'Climbing Stairs', pattern: '1D DP', difficulty: 'Easy', companyTags: ['TCS', 'Infosys', 'Accenture'] },
      { id: 'p-15', title: 'Coin Change', pattern: 'Unbounded Knapsack', difficulty: 'Medium', companyTags: ['Amazon', 'Google', 'Flipkart'], sandboxProblemId: 'coin-change' },
      { id: 'p-16', title: 'Maximum Subarray (Kadane’s)', pattern: '1D DP', difficulty: 'Medium', companyTags: ['Amazon', 'Microsoft', 'Infosys'], sandboxProblemId: 'maximum-subarray' },
      { id: 'p-17', title: 'Longest Common Subsequence', pattern: '2D DP', difficulty: 'Medium', companyTags: ['Amazon', 'Microsoft'] },
    ],
  },
];
