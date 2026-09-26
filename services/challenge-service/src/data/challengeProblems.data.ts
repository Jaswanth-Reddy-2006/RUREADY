// ═══════════════════════════════════════════════════════════════
// RU Ready? — Curated DSA Challenge Problem Bank with Test Suites
// ═══════════════════════════════════════════════════════════════

export interface ChallengeProblemSeed {
  id: string;
  title: string;
  slug: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  topicTags: string[];
  description: string;
  constraints: string[];
  examples: Array<{ input: string; output: string; explanation?: string }>;
  starterCodes: Record<string, string>;
  testCases: Array<{ input: any; expected: any; description?: string }>;
  idealSolution: string;
}

export const CHALLENGE_PROBLEMS: ChallengeProblemSeed[] = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'EASY',
    topicTags: ['Arrays', 'Hash Maps', 'Two Pointers'],
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice. You can return the answer in any order.`,
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    examples: [
      {
        input: 'nums = [2, 7, 11, 15], target = 9',
        output: '[0, 1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3, 2, 4], target = 6',
        output: '[1, 2]',
        explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].'
      }
    ],
    starterCodes: {
      javascript: `/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction twoSum(nums, target) {\n  // Write your optimal solution here\n  return [];\n}`,
      typescript: `function twoSum(nums: number[], target: number): number[] {\n  // Write your optimal solution here\n  return [];\n}`,
      python: `def twoSum(nums: list[int], target: int) -> list[int]:\n    # Write your optimal solution here\n    return []`,
      java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        return new int[]{};\n    }\n}`,
      cpp: `#include <vector>\n\nclass Solution {\npublic:\n    std::vector<int> twoSum(std::vector<int>& nums, int target) {\n        return {};\n    }\n};`,
      go: `package main\n\nfunc twoSum(nums []int, target int) []int {\n    return []int{}\n}`
    },
    testCases: [
      { input: [[2, 7, 11, 15], 9], expected: [0, 1], description: 'Basic pair test' },
      { input: [[3, 2, 4], 6], expected: [1, 2], description: 'Non-zero indexed pair' },
      { input: [[3, 3], 6], expected: [0, 1], description: 'Duplicate values' },
      { input: [[-1, -2, -3, -4, -5], -8], expected: [2, 4], description: 'Negative numbers' },
      { input: [[1000000, 500, 2000000, 500], 1000], expected: [1, 3], description: 'Boundary large elements' }
    ],
    idealSolution: `function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}`
  },
  {
    id: 'valid-anagram',
    title: 'Valid Anagram',
    slug: 'valid-anagram',
    difficulty: 'EASY',
    topicTags: ['Strings', 'Hash Maps', 'Counting'],
    description: `Given two strings \`s\` and \`t\`, return \`true\` if \`t\` is an anagram of \`s\`, and \`false\` otherwise.

An **Anagram** is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.`,
    constraints: [
      '1 <= s.length, t.length <= 5 * 10^4',
      's and t consist of lowercase English letters.'
    ],
    examples: [
      {
        input: 's = "anagram", t = "nagaram"',
        output: 'true',
        explanation: 'Both words contain exactly 3 a\'s, 1 g, 1 m, 1 n, and 1 r.'
      },
      {
        input: 's = "rat", t = "car"',
        output: 'false'
      }
    ],
    starterCodes: {
      javascript: `/**\n * @param {string} s\n * @param {string} t\n * @return {boolean}\n */\nfunction isAnagram(s, t) {\n  // Write your optimal solution here\n  return false;\n}`,
      typescript: `function isAnagram(s: string, t: string): boolean {\n  // Write your optimal solution here\n  return false;\n}`,
      python: `def isAnagram(s: str, t: str) -> bool:\n    # Write your optimal solution here\n    return False`,
      java: `class Solution {\n    public boolean isAnagram(String s, String t) {\n        return false;\n    }\n}`,
      cpp: `#include <string>\n\nclass Solution {\npublic:\n    bool isAnagram(std::string s, std::string t) {\n        return false;\n    }\n};`,
      go: `package main\n\nfunc isAnagram(s string, t string) bool {\n    return false\n}`
    },
    testCases: [
      { input: ['anagram', 'nagaram'], expected: true, description: 'Standard anagram' },
      { input: ['rat', 'car'], expected: false, description: 'Different characters' },
      { input: ['a', 'ab'], expected: false, description: 'Different length' },
      { input: ['listen', 'silent'], expected: true, description: 'Valid multi-character anagram' },
      { input: ['aacc', 'ccac'], expected: false, description: 'Frequency mismatch' }
    ],
    idealSolution: `function isAnagram(s, t) {\n  if (s.length !== t.length) return false;\n  const count = {};\n  for (const c of s) count[c] = (count[c] || 0) + 1;\n  for (const c of t) {\n    if (!count[c]) return false;\n    count[c]--;\n  }\n  return true;\n}`
  },
  {
    id: 'best-time-to-buy-and-sell-stock',
    title: 'Best Time to Buy and Sell Stock',
    slug: 'best-time-to-buy-and-sell-stock',
    difficulty: 'EASY',
    topicTags: ['Arrays', 'Dynamic Programming', 'Sliding Window'],
    description: `You are given an array \`prices\` where \`prices[i]\` is the price of a given stock on the \`i\`th day.

You want to maximize your profit by choosing a **single day** to buy one stock and choosing a **different day in the future** to sell that stock.

Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return \`0\`.`,
    constraints: [
      '1 <= prices.length <= 10^5',
      '0 <= prices[i] <= 10^4'
    ],
    examples: [
      {
        input: 'prices = [7, 1, 5, 3, 6, 4]',
        output: '5',
        explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6 - 1 = 5.'
      },
      {
        input: 'prices = [7, 6, 4, 3, 1]',
        output: '0',
        explanation: 'In this case, no transactions are done and max profit = 0.'
      }
    ],
    starterCodes: {
      javascript: `/**\n * @param {number[]} prices\n * @return {number}\n */\nfunction maxProfit(prices) {\n  // Write your optimal solution here\n  return 0;\n}`,
      typescript: `function maxProfit(prices: number[]): number {\n  // Write your optimal solution here\n  return 0;\n}`,
      python: `def maxProfit(prices: list[int]) -> int:\n    # Write your optimal solution here\n    return 0`,
      java: `class Solution {\n    public int maxProfit(int[] prices) {\n        return 0;\n    }\n}`,
      cpp: `#include <vector>\n\nclass Solution {\npublic:\n    int maxProfit(std::vector<int>& prices) {\n        return 0;\n    }\n};`,
      go: `package main\n\nfunc maxProfit(prices []int) int {\n    return 0\n}`
    },
    testCases: [
      { input: [[7, 1, 5, 3, 6, 4]], expected: 5, description: 'Standard peak profit' },
      { input: [[7, 6, 4, 3, 1]], expected: 0, description: 'Decreasing prices' },
      { input: [[2, 4, 1]], expected: 2, description: 'Early peak then lower price' },
      { input: [[1, 2]], expected: 1, description: 'Two elements minimal gain' },
      { input: [[3, 2, 6, 5, 0, 3]], expected: 4, description: 'Multiple valleys' }
    ],
    idealSolution: `function maxProfit(prices) {\n  let minPrice = Infinity;\n  let maxProfit = 0;\n  for (let i = 0; i < prices.length; i++) {\n    if (prices[i] < minPrice) {\n      minPrice = prices[i];\n    } else if (prices[i] - minPrice > maxProfit) {\n      maxProfit = prices[i] - minPrice;\n    }\n  }\n  return maxProfit;\n}`
  },
  {
    id: 'longest-substring-without-repeating-characters',
    title: 'Longest Substring Without Repeating Characters',
    slug: 'longest-substring-without-repeating-characters',
    difficulty: 'MEDIUM',
    topicTags: ['Hash Tables', 'Strings', 'Sliding Window'],
    description: `Given a string \`s\`, find the length of the **longest substring** without repeating characters.`,
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces.'
    ],
    examples: [
      {
        input: 's = "abcabcbb"',
        output: '3',
        explanation: 'The answer is "abc", with the length of 3.'
      },
      {
        input: 's = "bbbbb"',
        output: '1',
        explanation: 'The answer is "b", with the length of 1.'
      },
      {
        input: 's = "pwwkew"',
        output: '3',
        explanation: 'The answer is "wke", with the length of 3.'
      }
    ],
    starterCodes: {
      javascript: `/**\n * @param {string} s\n * @return {number}\n */\nfunction lengthOfLongestSubstring(s) {\n  // Write your optimal solution here\n  return 0;\n}`,
      typescript: `function lengthOfLongestSubstring(s: string): number {\n  // Write your optimal solution here\n  return 0;\n}`,
      python: `def lengthOfLongestSubstring(s: str) -> int:\n    # Write your optimal solution here\n    return 0`,
      java: `class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        return 0;\n    }\n}`,
      cpp: `#include <string>\n\nclass Solution {\npublic:\n    int lengthOfLongestSubstring(std::string s) {\n        return 0;\n    }\n};`,
      go: `package main\n\nfunc lengthOfLongestSubstring(s string) int {\n    return 0\n}`
    },
    testCases: [
      { input: ['abcabcbb'], expected: 3, description: 'Standard repeating characters' },
      { input: ['bbbbb'], expected: 1, description: 'All identical chars' },
      { input: ['pwwkew'], expected: 3, description: 'Middle unique substring' },
      { input: [''], expected: 0, description: 'Empty string' },
      { input: ['dvdf'], expected: 3, description: 'Repeated char in sub-window' }
    ],
    idealSolution: `function lengthOfLongestSubstring(s) {\n  const seen = new Map();\n  let left = 0;\n  let maxLen = 0;\n  for (let right = 0; right < s.length; right++) {\n    const char = s[right];\n    if (seen.has(char) && seen.get(char) >= left) {\n      left = seen.get(char) + 1;\n    }\n    seen.set(char, right);\n    maxLen = Math.max(maxLen, right - left + 1);\n  }\n  return maxLen;\n}`
  },
  {
    id: 'container-with-most-water',
    title: 'Container With Most Water',
    slug: 'container-with-most-water',
    difficulty: 'MEDIUM',
    topicTags: ['Arrays', 'Two Pointers', 'Greedy'],
    description: `You are given an integer array \`height\` of length \`n\`. There are \`n\` vertical lines drawn such that the two endpoints of the \`i\`th line are \`(i, 0)\` and \`(i, height[i])\`.

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return the maximum amount of water a container can store.`,
    constraints: [
      'n == height.length',
      '2 <= n <= 10^5',
      '0 <= height[i] <= 10^4'
    ],
    examples: [
      {
        input: 'height = [1,8,6,2,5,4,8,3,7]',
        output: '49',
        explanation: 'The max area is between index 1 (height 8) and index 8 (height 7): min(8, 7) * (8 - 1) = 7 * 7 = 49.'
      },
      {
        input: 'height = [1,1]',
        output: '1'
      }
    ],
    starterCodes: {
      javascript: `/**\n * @param {number[]} height\n * @return {number}\n */\nfunction maxArea(height) {\n  // Write your optimal solution here\n  return 0;\n}`,
      typescript: `function maxArea(height: number[]): number {\n  // Write your optimal solution here\n  return 0;\n}`,
      python: `def maxArea(height: list[int]) -> int:\n    # Write your optimal solution here\n    return 0`,
      java: `class Solution {\n    public int maxArea(int[] height) {\n        return 0;\n    }\n}`,
      cpp: `#include <vector>\n\nclass Solution {\npublic:\n    int maxArea(std::vector<int>& height) {\n        return 0;\n    }\n};`,
      go: `package main\n\nfunc maxArea(height []int) int {\n    return 0\n}`
    },
    testCases: [
      { input: [[1, 8, 6, 2, 5, 4, 8, 3, 7]], expected: 49, description: 'Standard container' },
      { input: [[1, 1]], expected: 1, description: 'Minimal length array' },
      { input: [[4, 3, 2, 1, 4]], expected: 16, description: 'Equal boundary heights' },
      { input: [[1, 2, 1]], expected: 2, description: 'Three pillars' },
      { input: [[1, 2, 4, 3]], expected: 4, description: 'Asymmetric heights' }
    ],
    idealSolution: `function maxArea(height) {\n  let left = 0, right = height.length - 1;\n  let maxWater = 0;\n  while (left < right) {\n    const width = right - left;\n    const h = Math.min(height[left], height[right]);\n    maxWater = Math.max(maxWater, width * h);\n    if (height[left] < height[right]) left++;\n    else right--;\n  }\n  return maxWater;\n}`
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    slug: 'valid-parentheses',
    difficulty: 'EASY',
    topicTags: ['Stacks', 'Strings'],
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only \'()[]{}\'.'
    ],
    examples: [
      {
        input: 's = "()"',
        output: 'true'
      },
      {
        input: 's = "()[]{}"',
        output: 'true'
      },
      {
        input: 's = "(]"',
        output: 'false'
      }
    ],
    starterCodes: {
      javascript: `/**\n * @param {string} s\n * @return {boolean}\n */\nfunction isValid(s) {\n  // Write your optimal solution here\n  return false;\n}`,
      typescript: `function isValid(s: string): boolean {\n  // Write your optimal solution here\n  return false;\n}`,
      python: `def isValid(s: str) -> bool:\n    # Write your optimal solution here\n    return False`,
      java: `class Solution {\n    public boolean isValid(String s) {\n        return false;\n    }\n}`,
      cpp: `#include <string>\n\nclass Solution {\npublic:\n    bool isValid(std::string s) {\n        return false;\n    }\n};`,
      go: `package main\n\nfunc isValid(s string) bool {\n    return false\n}`
    },
    testCases: [
      { input: ['()'], expected: true, description: 'Single parenthesis pair' },
      { input: ['()[]{}'], expected: true, description: 'Multiple sequential pairs' },
      { input: ['(]'], expected: false, description: 'Mismatched types' },
      { input: ['([)]'], expected: false, description: 'Interleaved invalid nesting' },
      { input: ['{[]}'], expected: true, description: 'Nested valid brackets' }
    ],
    idealSolution: `function isValid(s) {\n  const stack = [];\n  const map = { ')': '(', '}': '{', ']': '[' };\n  for (const c of s) {\n    if (c in map) {\n      if (stack.pop() !== map[c]) return false;\n    } else {\n      stack.push(c);\n    }\n  }\n  return stack.length === 0;\n}`
  },
  {
    id: 'maximum-subarray',
    title: 'Maximum Subarray (Kadane\'s Algorithm)',
    slug: 'maximum-subarray',
    difficulty: 'MEDIUM',
    topicTags: ['Arrays', 'Dynamic Programming', 'Divide and Conquer'],
    description: `Given an integer array \`nums\`, find the subarray with the largest sum, and return its sum.`,
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4'
    ],
    examples: [
      {
        input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
        output: '6',
        explanation: 'The subarray [4,-1,2,1] has the largest sum 6.'
      },
      {
        input: 'nums = [1]',
        output: '1'
      },
      {
        input: 'nums = [5,4,-1,7,8]',
        output: '23'
      }
    ],
    starterCodes: {
      javascript: `/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction maxSubArray(nums) {\n  // Write your optimal solution here\n  return 0;\n}`,
      typescript: `function maxSubArray(nums: number[]): number {\n  // Write your optimal solution here\n  return 0;\n}`,
      python: `def maxSubArray(nums: list[int]) -> int:\n    # Write your optimal solution here\n    return 0`,
      java: `class Solution {\n    public int maxSubArray(int[] nums) {\n        return 0;\n    }\n}`,
      cpp: `#include <vector>\n\nclass Solution {\npublic:\n    int maxSubArray(std::vector<int>& nums) {\n        return 0;\n    }\n};`,
      go: `package main\n\nfunc maxSubArray(nums []int) int {\n    return 0\n}`
    },
    testCases: [
      { input: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6, description: 'Mixed positive and negative' },
      { input: [[1]], expected: 1, description: 'Single element' },
      { input: [[5, 4, -1, 7, 8]], expected: 23, description: 'Predominantly positive' },
      { input: [[-1, -2, -3]], expected: -1, description: 'All negative elements' },
      { input: [[-2, -1]], expected: -1, description: 'Two negative elements' }
    ],
    idealSolution: `function maxSubArray(nums) {\n  let maxSoFar = nums[0];\n  let currMax = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    currMax = Math.max(nums[i], currMax + nums[i]);\n    maxSoFar = Math.max(maxSoFar, currMax);\n  }\n  return maxSoFar;\n}`
  },
  {
    id: 'coin-change',
    title: 'Coin Change',
    slug: 'coin-change',
    difficulty: 'MEDIUM',
    topicTags: ['Dynamic Programming', 'BFS'],
    description: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.

Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.

You may assume that you have an infinite number of each kind of coin.`,
    constraints: [
      '1 <= coins.length <= 12',
      '1 <= coins[i] <= 2^31 - 1',
      '0 <= amount <= 10^4'
    ],
    examples: [
      {
        input: 'coins = [1, 2, 5], amount = 11',
        output: '3',
        explanation: '11 = 5 + 5 + 1'
      },
      {
        input: 'coins = [2], amount = 3',
        output: '-1'
      },
      {
        input: 'coins = [1], amount = 0',
        output: '0'
      }
    ],
    starterCodes: {
      javascript: `/**\n * @param {number[]} coins\n * @param {number} amount\n * @return {number}\n */\nfunction coinChange(coins, amount) {\n  // Write your optimal solution here\n  return -1;\n}`,
      typescript: `function coinChange(coins: number[], amount: number): number {\n  // Write your optimal solution here\n  return -1;\n}`,
      python: `def coinChange(coins: list[int], amount: int) -> int:\n    # Write your optimal solution here\n    return -1`,
      java: `class Solution {\n    public int coinChange(int[] coins, int amount) {\n        return -1;\n    }\n}`,
      cpp: `#include <vector>\n\nclass Solution {\npublic:\n    int coinChange(std::vector<int>& coins, int amount) {\n        return -1;\n    }\n};`,
      go: `package main\n\nfunc coinChange(coins []int, amount int) int {\n    return -1\n}`
    },
    testCases: [
      { input: [[1, 2, 5], 11], expected: 3, description: 'Greedy match with multiple 5s' },
      { input: [[2], 3], expected: -1, description: 'Impossible amount' },
      { input: [[1], 0], expected: 0, description: 'Zero amount' },
      { input: [[186, 419, 83, 408], 6249], expected: 20, description: 'Large arbitrary denominations' },
      { input: [[2, 5, 10, 1], 27], expected: 4, description: 'Combination selection' }
    ],
    idealSolution: `function coinChange(coins, amount) {\n  const dp = new Array(amount + 1).fill(Infinity);\n  dp[0] = 0;\n  for (let i = 1; i <= amount; i++) {\n    for (const c of coins) {\n      if (i - c >= 0) {\n        dp[i] = Math.min(dp[i], dp[i - c] + 1);\n      }\n    }\n  }\n  return dp[amount] === Infinity ? -1 : dp[amount];\n}`
  }
];
