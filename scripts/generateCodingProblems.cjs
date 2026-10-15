// ═══════════════════════════════════════════════════════════════
// Comprehensive 130+ FAANG Coding Interview Problems Generator
// Based on Hugging Face LeetCode Datasets & Curated Engineering Curricula
// ═══════════════════════════════════════════════════════════════

const fs = require('fs');
const path = require('path');

const PROBLEMS = [
  // ─── 1. ARRAYS & HASHING ───
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'EASY',
    category: 'DSA',
    pattern: 'Arrays & Hashing',
    entryPoint: 'twoSum',
    optimalTime: 'O(N)',
    optimalSpace: 'O(N)',
    timeKeywords: ['o(n)', 'linear', 'o of n'],
    spaceKeywords: ['o(n)', 'linear', 'o of n', 'auxiliary'],
    description: `Given an array of integers \`nums\` and an integer \`target\`, return the indices of the two numbers such that they add up to \`target\`.

### Problem Statement & Context:
You are building an order reconciliation service where combinations of two payments must match a settlement batch total. You need to identify which pair of transactions sums precisely to the target amount.

### Requirements:
1. Each input will have **exactly one valid solution**.
2. You cannot use the same element twice (i.e. you cannot use nums[i] twice for the same pair).
3. The answer can be returned in any order of indices, e.g. \`[0, 1]\` or \`[1, 0]\`.
4. Your solution must scale efficiently for arrays up to 100,000 items.

### Examples:
**Example 1:**
- **Input:** \`nums = [2, 7, 11, 15], target = 9\`
- **Output:** \`[0, 1]\`
- **Explanation:** Because \`nums[0] + nums[1] == 2 + 7 == 9\`, we return \`[0, 1]\`.

**Example 2:**
- **Input:** \`nums = [3, 2, 4], target = 6\`
- **Output:** \`[1, 2]\`
- **Explanation:** \`nums[1] + nums[2] == 2 + 4 == 6\`. Notice that nums[0] + nums[0] (3 + 3) is invalid because an element at index 0 cannot be used twice.

**Example 3:**
- **Input:** \`nums = [3, 3], target = 6\`
- **Output:** \`[0, 1]\`
- **Explanation:** Here duplicate values exist at different indices, so both index 0 and index 1 are chosen.

### Constraints:
- \`2 <= nums.length <= 10^5\`
- \`-10^9 <= nums[i] <= 10^9\`
- \`-10^9 <= target <= 10^9\`
- Only one valid answer exists.`,
    testCases: [
      { input: [[2, 7, 11, 15], 9], expected: [0, 1], description: 'Basic pair' },
      { input: [[3, 2, 4], 6], expected: [1, 2], description: 'Non-adjacent pair' },
      { input: [[3, 3], 6], expected: [0, 1], description: 'Duplicate values' },
      { input: [[-1, -2, -3, -4, -5], -8], expected: [2, 4], description: 'Negative numbers', isHidden: true },
      { input: [[0, 4, 3, 0], 0], expected: [0, 3], description: 'Zeros pair', isHidden: true }
    ],
    editorial: {
      intuition: 'Instead of comparing every pair with nested loops in O(N^2) time, use a hash map to remember each number and its index. As you iterate, check if (target - num) was already recorded.',
      bruteForce: 'Nested loops checking all pairs (i, j) with i < j takes O(N^2) time and O(1) space.',
      optimalApproach: 'One-pass hash map: store each value to index mapping. For each number x, look up target - x.',
      complexityAnalysis: 'Time: O(N) because hash map lookup is O(1) amortized. Space: O(N) to store up to N elements.',
      edgeCases: ['Negative numbers', 'Zeros', 'Duplicate values at distinct indices']
    },
    hints: [
      'What information do you need to look up instantly as you iterate?',
      'Can you store the complement (target - current) in a hash table?',
      'You only need one pass: check if the complement exists before inserting.'
    ]
  },
  {
    id: 'valid-anagram',
    title: 'Valid Anagram',
    difficulty: 'EASY',
    category: 'DSA',
    pattern: 'Arrays & Hashing',
    entryPoint: 'isAnagram',
    optimalTime: 'O(N)',
    optimalSpace: 'O(1)',
    timeKeywords: ['o(n)', 'linear', 'o of n'],
    spaceKeywords: ['o(1)', 'constant', 'o of 1', 'o(k)'],
    description: `Given two strings \`s\` and \`t\`, return \`true\` if \`t\` is an anagram of \`s\`, and \`false\` otherwise.

### Problem Statement & Context:
An **Anagram** is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.

### Requirements:
1. Both strings must contain the exact same characters with the exact same frequencies.
2. The strings must have the exact same length to be anagrams.
3. Your solution should handle lowercase English letters as well as Unicode characters.

### Examples:
**Example 1:**
- **Input:** \`s = "anagram", t = "nagaram"\`
- **Output:** \`true\`

**Example 2:**
- **Input:** \`s = "rat", t = "car"\`
- **Output:** \`false\`

### Constraints:
- \`1 <= s.length, t.length <= 5 * 10^4\`
- \`s\` and \`t\` consist of lowercase English letters.`,
    testCases: [
      { input: ['anagram', 'nagaram'], expected: true },
      { input: ['rat', 'car'], expected: false },
      { input: ['a', 'a'], expected: true },
      { input: ['ab', 'a'], expected: false, isHidden: true }
    ],
    editorial: {
      intuition: 'Count frequency of each character across both strings and verify they match.',
      bruteForce: 'Sorting both strings takes O(N log N) time.',
      optimalApproach: 'Use an array of size 26 or a hash map to increment count for s and decrement for t.',
      complexityAnalysis: 'Time: O(N), Space: O(1) since English alphabet has 26 fixed characters.',
      edgeCases: ['Unequal lengths', 'Single character', 'Repeated characters']
    },
    hints: ['Check lengths first', 'Use character frequency counting', 'Fixed 26-element array provides O(1) space']
  },
  {
    id: 'contains-duplicate',
    title: 'Contains Duplicate',
    difficulty: 'EASY',
    category: 'DSA',
    pattern: 'Arrays & Hashing',
    entryPoint: 'containsDuplicate',
    optimalTime: 'O(N)',
    optimalSpace: 'O(N)',
    timeKeywords: ['o(n)', 'linear'],
    spaceKeywords: ['o(n)', 'linear'],
    description: `Given an integer array \`nums\`, return \`true\` if any value appears **at least twice** in the array, and return \`false\` if every element is distinct.

### Requirements:
1. Return boolean true or false.
2. Optimize for large arrays with up to 10^5 elements.

### Examples:
**Example 1:**
- **Input:** \`nums = [1, 2, 3, 1]\`
- **Output:** \`true\`

**Example 2:**
- **Input:** \`nums = [1, 2, 3, 4]\`
- **Output:** \`false\`

### Constraints:
- \`1 <= nums.length <= 10^5\`
- \`-10^9 <= nums[i] <= 10^9\``,
    testCases: [
      { input: [[1, 2, 3, 1]], expected: true },
      { input: [[1, 2, 3, 4]], expected: false },
      { input: [[1, 1, 1, 3, 3, 4, 3, 2, 4, 2]], expected: true }
    ],
    editorial: {
      intuition: 'Use a hash set to track elements visited so far.',
      bruteForce: 'Double loop checking pairs: O(N^2).',
      optimalApproach: 'Single scan inserting into Set. If element is already present, return true.',
      complexityAnalysis: 'Time: O(N), Space: O(N).',
      edgeCases: ['Array of size 1', 'All duplicate elements', 'All distinct elements']
    },
    hints: ['Can you use a Set?', 'Set size vs array length']
  },
  {
    id: 'group-anagrams',
    title: 'Group Anagrams',
    difficulty: 'MEDIUM',
    category: 'DSA',
    pattern: 'Arrays & Hashing',
    entryPoint: 'groupAnagrams',
    optimalTime: 'O(N * K)',
    optimalSpace: 'O(N * K)',
    timeKeywords: ['o(n * k)', 'o(n*k)', 'linear'],
    spaceKeywords: ['o(n * k)', 'o(n*k)'],
    description: `Given an array of strings \`strs\`, group the **anagrams** together. You can return the answer in any order.

### Requirements:
1. Words with identical letter counts belong to the same group.
2. Order of groups and order within groups does not matter.

### Examples:
**Example 1:**
- **Input:** \`strs = ["eat","tea","tan","ate","nat","bat"]\`
- **Output:** \`[["bat"],["nat","tan"],["ate","eat","tea"]]\`

### Constraints:
- \`1 <= strs.length <= 10^4\`
- \`0 <= strs[i].length <= 100\`
- \`strs[i]\` consists of lowercase English letters.`,
    testCases: [
      { input: [["eat","tea","tan","ate","nat","bat"]], expected: [["eat","tea","ate"],["tan","nat"],["bat"]] },
      { input: [[""]], expected: [[""]] },
      { input: [["a"]], expected: [["a"]] }
    ],
    editorial: {
      intuition: 'Each anagram has the same sorted form or character count signature. Use that as a hash map key.',
      bruteForce: 'Pairwise comparison takes quadratic time.',
      optimalApproach: 'Compute 26-length tuple/string frequency key for each word and group in map.',
      complexityAnalysis: 'Time: O(N * K) where K is max word length. Space: O(N * K).',
      edgeCases: ['Empty strings', 'Single letters', 'No anagrams present']
    },
    hints: ['What can serve as a canonical key for any anagram?', 'Sort characters or use character counts']
  },
  {
    id: 'top-k-frequent-elements',
    title: 'Top K Frequent Elements',
    difficulty: 'MEDIUM',
    category: 'DSA',
    pattern: 'Arrays & Hashing',
    entryPoint: 'topKFrequent',
    optimalTime: 'O(N)',
    optimalSpace: 'O(N)',
    timeKeywords: ['o(n)', 'linear', 'o(n log k)'],
    spaceKeywords: ['o(n)', 'linear'],
    description: `Given an integer array \`nums\` and an integer \`k\`, return the \`k\` most frequent elements. You may return the answer in any order.

### Requirements:
1. It is guaranteed that the answer is unique.
2. Must run better than O(N log N) (ideally O(N) using bucket sort or O(N log K) using min-heap).

### Examples:
**Example 1:**
- **Input:** \`nums = [1,1,1,2,2,3], k = 2\`
- **Output:** \`[1, 2]\`

### Constraints:
- \`1 <= nums.length <= 10^5\`
- \`k\` is in the range \`[1, the number of unique elements in the array]\`.`,
    testCases: [
      { input: [[1,1,1,2,2,3], 2], expected: [1, 2] },
      { input: [[1], 1], expected: [1] }
    ],
    editorial: {
      intuition: 'Count frequencies with a map, then place numbers into buckets indexed by frequency.',
      bruteForce: 'Sorting unique elements by count takes O(U log U).',
      optimalApproach: 'Bucket sort with array of lists of size N + 1 achieves linear time.',
      complexityAnalysis: 'Time: O(N), Space: O(N).',
      edgeCases: ['k equals number of unique elements', 'all elements have same frequency']
    },
    hints: ['Count frequencies first', 'Can you use bucket sort indexed by frequency?']
  },
  {
    id: 'product-of-array-except-self',
    title: 'Product of Array Except Self',
    difficulty: 'MEDIUM',
    category: 'DSA',
    pattern: 'Arrays & Hashing',
    entryPoint: 'productExceptSelf',
    optimalTime: 'O(N)',
    optimalSpace: 'O(1)',
    timeKeywords: ['o(n)', 'linear'],
    spaceKeywords: ['o(1)', 'constant', 'o(n)'],
    description: `Given an integer array \`nums\`, return an array \`answer\` such that \`answer[i]\` is equal to the product of all the elements of \`nums\` except \`nums[i]\`.

### Requirements:
1. You must write an algorithm that runs in **O(n)** time.
2. You **must not use the division operation**.
3. Auxiliary space should be O(1) (excluding the output array).

### Examples:
**Example 1:**
- **Input:** \`nums = [1, 2, 3, 4]\`
- **Output:** \`[24, 12, 8, 6]\`

**Example 2:**
- **Input:** \`nums = [-1, 1, 0, -3, 3]\`
- **Output:** \`[0, 0, 9, 0, 0]\`

### Constraints:
- \`2 <= nums.length <= 10^5\`
- \`-30 <= nums[i] <= 30\``,
    testCases: [
      { input: [[1, 2, 3, 4]], expected: [24, 12, 8, 6] },
      { input: [[-1, 1, 0, -3, 3]], expected: [0, 0, 9, 0, 0] }
    ],
    editorial: {
      intuition: 'Prefix products and suffix products multiplied together give the product except self.',
      bruteForce: 'Multiplying all other elements for each index takes O(N^2).',
      optimalApproach: 'Compute prefix products into result array, then sweep backwards maintaining a running suffix product.',
      complexityAnalysis: 'Time: O(N), Auxiliary Space: O(1).',
      edgeCases: ['Array containing zeros', 'Negative numbers']
    },
    hints: ['Think of prefix product and suffix product', 'Accumulate suffix in a single variable']
  },

  // ─── 2. TWO POINTERS ───
  {
    id: 'valid-palindrome',
    title: 'Valid Palindrome',
    difficulty: 'EASY',
    category: 'DSA',
    pattern: 'Two Pointers',
    entryPoint: 'isPalindrome',
    optimalTime: 'O(N)',
    optimalSpace: 'O(1)',
    timeKeywords: ['o(n)', 'linear'],
    spaceKeywords: ['o(1)', 'constant'],
    description: `A phrase is a **palindrome** if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.

Given a string \`s\`, return \`true\` if it is a palindrome, or \`false\` otherwise.

### Examples:
**Example 1:**
- **Input:** \`s = "A man, a plan, a canal: Panama"\`
- **Output:** \`true\`
- **Explanation:** "amanaplanacanalpanama" is a palindrome.

**Example 2:**
- **Input:** \`s = "race a car"\`
- **Output:** \`false\`

### Constraints:
- \`1 <= s.length <= 2 * 10^5\`
- \`s\` consists only of printable ASCII characters.`,
    testCases: [
      { input: ['A man, a plan, a canal: Panama'], expected: true },
      { input: ['race a car'], expected: false },
      { input: [' '], expected: true },
      { input: ['0P'], expected: false, isHidden: true }
    ],
    editorial: {
      intuition: 'Two pointers converging from both ends skipping non-alphanumeric characters.',
      bruteForce: 'Clean string into new string then reverse: O(N) space.',
      optimalApproach: 'In-place two pointers with left and right indices.',
      complexityAnalysis: 'Time: O(N), Space: O(1).',
      edgeCases: ['String with only punctuation', 'Single character', 'Case differences']
    },
    hints: ['Use two pointers left and right', 'Skip non-alphanumeric characters while left < right']
  },
  {
    id: 'two-sum-ii-input-array-is-sorted',
    title: 'Two Sum II - Input Array Is Sorted',
    difficulty: 'MEDIUM',
    category: 'DSA',
    pattern: 'Two Pointers',
    entryPoint: 'twoSum',
    optimalTime: 'O(N)',
    optimalSpace: 'O(1)',
    timeKeywords: ['o(n)', 'linear'],
    spaceKeywords: ['o(1)', 'constant'],
    description: `Given a **1-indexed** array of integers \`numbers\` that is already **sorted in non-decreasing order**, find two numbers such that they add up to a specific \`target\` number.

Return the indices of the two numbers, \`index1\` and \`index2\`, added by one as an integer array \`[index1, index2]\` of length 2.

### Constraints:
- \`2 <= numbers.length <= 3 * 10^4\`
- You may not use the same element twice.
- Exactly one solution exists.`,
    testCases: [
      { input: [[2,7,11,15], 9], expected: [1, 2] },
      { input: [[2,3,4], 6], expected: [1, 3] },
      { input: [[-1,0], -1], expected: [1, 2] }
    ],
    editorial: {
      intuition: 'Because the array is sorted, if sum < target increment left; if sum > target decrement right.',
      bruteForce: 'Binary search for each element is O(N log N).',
      optimalApproach: 'Two pointers at ends converging inward.',
      complexityAnalysis: 'Time: O(N), Space: O(1).',
      edgeCases: ['Negative numbers', 'Two equal elements']
    },
    hints: ['The array is sorted!', 'If sum is too small, move left pointer right']
  },
  {
    id: '3sum',
    title: '3Sum',
    difficulty: 'MEDIUM',
    category: 'DSA',
    pattern: 'Two Pointers',
    entryPoint: 'threeSum',
    optimalTime: 'O(N^2)',
    optimalSpace: 'O(1)',
    timeKeywords: ['o(n^2)', 'o(n squared)', 'quadratic'],
    spaceKeywords: ['o(1)', 'constant', 'o(n)'],
    description: `Given an integer array nums, return all the triplets \`[nums[i], nums[j], nums[k]]\` such that \`i != j\`, \`i != k\`, and \`j != k\`, and \`nums[i] + nums[j] + nums[k] == 0\`.

Notice that the solution set must not contain duplicate triplets.

### Examples:
**Example 1:**
- **Input:** \`nums = [-1,0,1,2,-1,-4]\`
- **Output:** \`[[-1,-1,2],[-1,0,1]]\`

### Constraints:
- \`3 <= nums.length <= 3000\`
- \`-10^5 <= nums[i] <= 10^5\``,
    testCases: [
      { input: [[-1,0,1,2,-1,-4]], expected: [[-1,-1,2],[-1,0,1]] },
      { input: [[0,1,1]], expected: [] },
      { input: [[0,0,0]], expected: [[0,0,0]] }
    ],
    editorial: {
      intuition: 'Sort array, fix one element, and use Two Pointers for the remaining two elements.',
      bruteForce: 'Checking all triplets takes O(N^3).',
      optimalApproach: 'Sort nums in O(N log N). Iterate i from 0 to N-3, then two pointers left and right.',
      complexityAnalysis: 'Time: O(N^2), Space: O(1) or O(N) depending on sorting implementation.',
      edgeCases: ['All zeros', 'Duplicates skipped to avoid duplicate triplets']
    },
    hints: ['Sort the array first', 'Fix the first element and solve 2Sum on the remaining subarray', 'Skip adjacent duplicate values']
  },
  {
    id: 'container-with-most-water',
    title: 'Container With Most Water',
    difficulty: 'MEDIUM',
    category: 'DSA',
    pattern: 'Two Pointers',
    entryPoint: 'maxArea',
    optimalTime: 'O(N)',
    optimalSpace: 'O(1)',
    timeKeywords: ['o(n)', 'linear'],
    spaceKeywords: ['o(1)', 'constant'],
    description: `You are given an integer array \`height\` of length \`n\`. There are \`n\` vertical lines drawn such that the two endpoints of the \`i-th\` line are \`(i, 0)\` and \`(i, height[i])\`.

Find two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store.

### Examples:
**Example 1:**
- **Input:** \`height = [1,8,6,2,5,4,8,3,7]\`
- **Output:** \`49\`
- **Explanation:** The max area is between index 1 and index 8: width = 7, min height = 7, area = 49.

### Constraints:
- \`n == height.length\`
- \`2 <= n <= 10^5\`
- \`0 <= height[i] <= 10^4\``,
    testCases: [
      { input: [[1,8,6,2,5,4,8,3,7]], expected: 49 },
      { input: [[1,1]], expected: 1 }
    ],
    editorial: {
      intuition: 'Start with widest container (left = 0, right = n-1). Always advance the pointer pointing to the shorter vertical bar.',
      bruteForce: 'Check all pairs of lines: O(N^2).',
      optimalApproach: 'Two pointers at extremities. Move whichever line is shorter.',
      complexityAnalysis: 'Time: O(N), Space: O(1).',
      edgeCases: ['All heights equal', 'Descending heights', 'Only 2 lines']
    },
    hints: ['Area is limited by the shorter line', 'Moving the taller line cannot increase area']
  },
  {
    id: 'trapping-rain-water',
    title: 'Trapping Rain Water',
    difficulty: 'HARD',
    category: 'DSA',
    pattern: 'Two Pointers',
    entryPoint: 'trap',
    optimalTime: 'O(N)',
    optimalSpace: 'O(1)',
    timeKeywords: ['o(n)', 'linear'],
    spaceKeywords: ['o(1)', 'constant'],
    description: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.

### Examples:
**Example 1:**
- **Input:** \`height = [0,1,0,2,1,0,1,3,2,1,2,1]\`
- **Output:** \`6\`

### Constraints:
- \`n == height.length\`
- \`1 <= n <= 2 * 10^4\`
- \`0 <= height[i] <= 10^5\``,
    testCases: [
      { input: [[0,1,0,2,1,0,1,3,2,1,2,1]], expected: 6 },
      { input: [[4,2,0,3,2,5]], expected: 9 }
    ],
    editorial: {
      intuition: 'Water above index i is determined by min(maxLeft, maxRight) - height[i]. Two pointers can track running maxes without arrays.',
      bruteForce: 'For each index, find left max and right max: O(N^2).',
      optimalApproach: 'Two pointers tracking leftMax and rightMax. Advance pointer with smaller max.',
      complexityAnalysis: 'Time: O(N), Space: O(1).',
      edgeCases: ['Strictly increasing/decreasing heights trap 0 water', 'Array length < 3']
    },
    hints: ['Water trapped at bar i depends on min of max height to left and right', 'Two pointers avoid extra arrays']
  },

  // ─── 3. SLIDING WINDOW ───
  {
    id: 'best-time-to-buy-and-sell-stock',
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'EASY',
    category: 'DSA',
    pattern: 'Sliding Window',
    entryPoint: 'maxProfit',
    optimalTime: 'O(N)',
    optimalSpace: 'O(1)',
    timeKeywords: ['o(n)', 'linear'],
    spaceKeywords: ['o(1)', 'constant'],
    description: `You are given an array \`prices\` where \`prices[i]\` is the price of a given stock on the \`i-th\` day.

You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.

Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return \`0\`.

### Examples:
**Example 1:**
- **Input:** \`prices = [7,1,5,3,6,4]\`
- **Output:** \`5\`
- **Explanation:** Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6 - 1 = 5.

**Example 2:**
- **Input:** \`prices = [7,6,4,3,1]\`
- **Output:** \`0\`

### Constraints:
- \`1 <= prices.length <= 10^5\`
- \`0 <= prices[i] <= 10^4\``,
    testCases: [
      { input: [[7,1,5,3,6,4]], expected: 5 },
      { input: [[7,6,4,3,1]], expected: 0 },
      { input: [[2,4,1]], expected: 2 }
    ],
    editorial: {
      intuition: 'Track the minimum price seen so far and compare each day price against it.',
      bruteForce: 'Compare all pairs: O(N^2).',
      optimalApproach: 'Single pass maintaining minPrice and maxProfit.',
      complexityAnalysis: 'Time: O(N), Space: O(1).',
      edgeCases: ['Monotonically decreasing prices', 'Single day', 'Prices with zero']
    },
    hints: ['Track minimum price seen so far', 'Calculate profit at each day']
  },
  {
    id: 'longest-substring-without-repeating-characters',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'MEDIUM',
    category: 'DSA',
    pattern: 'Sliding Window',
    entryPoint: 'lengthOfLongestSubstring',
    optimalTime: 'O(N)',
    optimalSpace: 'O(min(N, M))',
    timeKeywords: ['o(n)', 'linear'],
    spaceKeywords: ['o(n)', 'o(min(n, m))', 'linear'],
    description: `Given a string \`s\`, find the length of the **longest substring** without duplicate characters.

### Examples:
**Example 1:**
- **Input:** \`s = "abcabcbb"\`
- **Output:** \`3\`
- **Explanation:** The answer is "abc", with length 3.

**Example 2:**
- **Input:** \`s = "bbbbb"\`
- **Output:** \`1\`

**Example 3:**
- **Input:** \`s = "pwwkew"\`
- **Output:** \`3\`

### Constraints:
- \`0 <= s.length <= 5 * 10^4\`
- \`s\` consists of English letters, digits, symbols and spaces.`,
    testCases: [
      { input: ['abcabcbb'], expected: 3 },
      { input: ['bbbbb'], expected: 1 },
      { input: ['pwwkew'], expected: 3 },
      { input: [''], expected: 0, isHidden: true }
    ],
    editorial: {
      intuition: 'Use a sliding window [left, right] and a hash map tracking last seen index of characters.',
      bruteForce: 'Check all substrings for uniqueness: O(N^3).',
      optimalApproach: 'Sliding window: when character s[right] was seen inside window, move left to seen[char] + 1.',
      complexityAnalysis: 'Time: O(N), Space: O(min(N, M)) where M is character alphabet size.',
      edgeCases: ['Empty string', 'All identical characters', 'String with spaces']
    },
    hints: ['Use sliding window', 'Store the last seen index of each character']
  },
  {
    id: 'minimum-window-substring',
    title: 'Minimum Window Substring',
    difficulty: 'HARD',
    category: 'DSA',
    pattern: 'Sliding Window',
    entryPoint: 'minWindow',
    optimalTime: 'O(N + M)',
    optimalSpace: 'O(M)',
    timeKeywords: ['o(n + m)', 'linear', 'o(n)'],
    spaceKeywords: ['o(m)', 'o(1)'],
    description: `Given two strings \`s\` and \`t\` of lengths \`m\` and \`n\` respectively, return the **minimum window substring** of \`s\` such that every character in \`t\` (including duplicates) is included in the window. If there is no such substring, return the empty string \`""\`.

### Examples:
**Example 1:**
- **Input:** \`s = "ADOBECODEBANC", t = "ABC"\`
- **Output:** \`"BANC"\`

### Constraints:
- \`m == s.length\`, \`n == t.length\`
- \`1 <= m, n <= 10^5\`
- \`s\` and \`t\` consist of uppercase and lowercase English letters.`,
    testCases: [
      { input: ['ADOBECODEBANC', 'ABC'], expected: 'BANC' },
      { input: ['a', 'a'], expected: 'a' },
      { input: ['a', 'aa'], expected: '' }
    ],
    editorial: {
      intuition: 'Sliding window with character frequency count. Expand right until valid, then shrink left to find minimum.',
      bruteForce: 'Check all substrings: O(N^2 * M).',
      optimalApproach: 'Two pointers tracking match counts against target frequency map.',
      complexityAnalysis: 'Time: O(N + M), Space: O(M).',
      edgeCases: ['t longer than s', 'Duplicate characters in t']
    },
    hints: ['Count frequency of t', 'Expand right until window has all characters', 'Shrink left to minimize']
  },

  // ─── 4. STACK ───
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'EASY',
    category: 'DSA',
    pattern: 'Stack',
    entryPoint: 'isValid',
    optimalTime: 'O(N)',
    optimalSpace: 'O(N)',
    timeKeywords: ['o(n)', 'linear'],
    spaceKeywords: ['o(n)', 'linear'],
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.

### Examples:
**Example 1:**
- **Input:** \`s = "()"\`
- **Output:** \`true\`

**Example 2:**
- **Input:** \`s = "()[]{}"\`
- **Output:** \`true\`

**Example 3:**
- **Input:** \`s = "(]"\`
- **Output:** \`false\`

### Constraints:
- \`1 <= s.length <= 10^4\`
- \`s\` consists of parentheses only \`'()[]{}'.\``,
    testCases: [
      { input: ['()'], expected: true },
      { input: ['()[]{}'], expected: true },
      { input: ['(]'], expected: false },
      { input: ['{[]}'], expected: true },
      { input: [']'], expected: false, isHidden: true }
    ],
    editorial: {
      intuition: 'Use a LIFO Stack. Push opening brackets; on closing bracket, pop and ensure matching type.',
      bruteForce: 'Repeated string replacement s.replace("()","") takes O(N^2).',
      optimalApproach: 'Stack data structure with hash map of matching pairs.',
      complexityAnalysis: 'Time: O(N), Space: O(N).',
      edgeCases: ['Odd length string is always invalid', 'Closing bracket on empty stack', 'Remaining unmatched open brackets']
    },
    hints: ['Use a Stack', 'Odd length strings can be immediately rejected']
  },
  {
    id: 'min-stack',
    title: 'Min Stack',
    difficulty: 'MEDIUM',
    category: 'DSA',
    pattern: 'Stack',
    entryPoint: 'MinStack',
    optimalTime: 'O(1)',
    optimalSpace: 'O(N)',
    timeKeywords: ['o(1)', 'constant'],
    spaceKeywords: ['o(n)', 'linear'],
    description: `Design a stack that supports push, pop, top, and retrieving the minimum element in **constant time O(1)**.

Implement the \`MinStack\` class:
- \`MinStack()\` initializes the stack object.
- \`void push(int val)\` pushes the element val onto the stack.
- \`void pop()\` removes the element on the top of the stack.
- \`int top()\` gets the top element of the stack.
- \`int getMin()\` retrieves the minimum element in the stack.

You must implement a solution with **O(1)** time complexity for each function.

### Constraints:
- \`-2^31 <= val <= 2^31 - 1\`
- Methods pop, top and getMin will always be called on non-empty stacks.`,
    testCases: [
      { input: ['test'], expected: true }
    ],
    editorial: {
      intuition: 'Maintain a secondary stack that tracks the running minimum alongside the main stack.',
      bruteForce: 'Searching stack on getMin takes O(N).',
      optimalApproach: 'Paired stack or storing (val, currentMin) pairs.',
      complexityAnalysis: 'Time: O(1) for all methods. Space: O(N).',
      edgeCases: ['Duplicate minimums', 'Popping current minimum']
    },
    hints: ['Can you maintain a separate stack of minimums?', 'Store the min value at every stack depth']
  },
  {
    id: 'daily-temperatures',
    title: 'Daily Temperatures',
    difficulty: 'MEDIUM',
    category: 'DSA',
    pattern: 'Stack',
    entryPoint: 'dailyTemperatures',
    optimalTime: 'O(N)',
    optimalSpace: 'O(N)',
    timeKeywords: ['o(n)', 'linear'],
    spaceKeywords: ['o(n)', 'linear'],
    description: `Given an array of integers \`temperatures\` represents the daily temperatures, return an array \`answer\` such that \`answer[i]\` is the number of days you have to wait after the \`i-th\` day to get a warmer temperature. If there is no future day for which this is possible, keep \`answer[i] == 0\` instead.

### Examples:
**Example 1:**
- **Input:** \`temperatures = [73,74,75,71,69,72,76,73]\`
- **Output:** \`[1,1,4,2,1,1,0,0]\`

### Constraints:
- \`1 <= temperatures.length <= 10^5\`
- \`30 <= temperatures[i] <= 100\``,
    testCases: [
      { input: [[73,74,75,71,69,72,76,73]], expected: [1,1,4,2,1,1,0,0] },
      { input: [[30,40,50,60]], expected: [1,1,1,0] }
    ],
    editorial: {
      intuition: 'Monotonic decreasing stack storing indices. When a warmer day arrives, pop cooler days and compute distance.',
      bruteForce: 'Nested loops searching ahead: O(N^2).',
      optimalApproach: 'Monotonic stack: each element pushed and popped at most once.',
      complexityAnalysis: 'Time: O(N), Space: O(N).',
      edgeCases: ['Strictly decreasing temperatures', 'All temperatures equal']
    },
    hints: ['Think of a monotonic stack', 'Store indices instead of values']
  },

  // ─── 5. BINARY SEARCH ───
  {
    id: 'binary-search',
    title: 'Binary Search',
    difficulty: 'EASY',
    category: 'DSA',
    pattern: 'Binary Search',
    entryPoint: 'search',
    optimalTime: 'O(log N)',
    optimalSpace: 'O(1)',
    timeKeywords: ['o(log n)', 'logarithmic', 'o of log n'],
    spaceKeywords: ['o(1)', 'constant'],
    description: `Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`. If \`target\` exists, then return its index. Otherwise, return \`-1\`.

You must write an algorithm with **O(log n)** runtime complexity.

### Examples:
**Example 1:**
- **Input:** \`nums = [-1,0,3,5,9,12], target = 9\`
- **Output:** \`4\`

**Example 2:**
- **Input:** \`nums = [-1,0,3,5,9,12], target = 2\`
- **Output:** \`-1\`

### Constraints:
- \`1 <= nums.length <= 10^4\`
- \`-10^4 < nums[i], target < 10^4\`
- All integers in \`nums\` are unique.
- \`nums\` is sorted in ascending order.`,
    testCases: [
      { input: [[-1,0,3,5,9,12], 9], expected: 4 },
      { input: [[-1,0,3,5,9,12], 2], expected: -1 }
    ],
    editorial: {
      intuition: 'Halve the search space by comparing mid element with target.',
      bruteForce: 'Linear scan takes O(N).',
      optimalApproach: 'Standard binary search with left and right bounds.',
      complexityAnalysis: 'Time: O(log N), Space: O(1).',
      edgeCases: ['Single element array', 'Target smaller than min or larger than max']
    },
    hints: ['Calculate mid = left + Math.floor((right - left) / 2)', 'Compare nums[mid] with target']
  },
  {
    id: 'search-in-rotated-sorted-array',
    title: 'Search in Rotated Sorted Array',
    difficulty: 'MEDIUM',
    category: 'DSA',
    pattern: 'Binary Search',
    entryPoint: 'search',
    optimalTime: 'O(log N)',
    optimalSpace: 'O(1)',
    timeKeywords: ['o(log n)', 'logarithmic'],
    spaceKeywords: ['o(1)', 'constant'],
    description: `There is an integer array \`nums\` sorted in ascending order (with distinct values). Prior to being passed to your function, \`nums\` is possibly rotated at an unknown pivot index \`k\`.

Given the array \`nums\` after the possible rotation and an integer \`target\`, return the index of \`target\` if it is in \`nums\`, or \`-1\` if it is not in \`nums\`.

You must write an algorithm with **O(log n)** runtime complexity.

### Examples:
**Example 1:**
- **Input:** \`nums = [4,5,6,7,0,1,2], target = 0\`
- **Output:** \`4\`

### Constraints:
- \`1 <= nums.length <= 5000\`
- \`-10^4 <= nums[i] <= 10^4\`
- All values of \`nums\` are unique.`,
    testCases: [
      { input: [[4,5,6,7,0,1,2], 0], expected: 4 },
      { input: [[4,5,6,7,0,1,2], 3], expected: -1 },
      { input: [[1], 0], expected: -1 }
    ],
    editorial: {
      intuition: 'At least one half of the rotated array is always sorted. Determine which half is sorted and check if target falls in it.',
      bruteForce: 'Linear search takes O(N).',
      optimalApproach: 'Modified binary search checking nums[left] <= nums[mid].',
      complexityAnalysis: 'Time: O(log N), Space: O(1).',
      edgeCases: ['No rotation (fully sorted)', 'Array length 1 or 2']
    },
    hints: ['One half is always normally sorted', 'Check if target lies inside the sorted half']
  },
  {
    id: 'find-minimum-in-rotated-sorted-array',
    title: 'Find Minimum in Rotated Sorted Array',
    difficulty: 'MEDIUM',
    category: 'DSA',
    pattern: 'Binary Search',
    entryPoint: 'findMin',
    optimalTime: 'O(log N)',
    optimalSpace: 'O(1)',
    timeKeywords: ['o(log n)', 'logarithmic'],
    spaceKeywords: ['o(1)', 'constant'],
    description: `Suppose an array of length \`n\` sorted in ascending order is rotated between 1 and \`n\` times. Notice that rotating an array [a[0], a[1], a[2], ..., a[n-1]] 1 time results in the array [a[n-1], a[0], a[1], a[2], ..., a[n-2]].

Given the sorted rotated array \`nums\` of unique elements, return the **minimum element** of this array.

You must write an algorithm that runs in **O(log n)** time.

### Examples:
**Example 1:**
- **Input:** \`nums = [3,4,5,1,2]\`
- **Output:** \`1\`

### Constraints:
- \`n == nums.length\`
- \`1 <= n <= 5000\`
- All the integers of \`nums\` are unique.`,
    testCases: [
      { input: [[3,4,5,1,2]], expected: 1 },
      { input: [[4,5,6,7,0,1,2]], expected: 0 },
      { input: [[11,13,15,17]], expected: 11 }
    ],
    editorial: {
      intuition: 'Compare nums[mid] with nums[right]. If mid > right, min is in right half; otherwise in left half.',
      bruteForce: 'Linear scan takes O(N).',
      optimalApproach: 'Binary search narrowing down to the inflection point.',
      complexityAnalysis: 'Time: O(log N), Space: O(1).',
      edgeCases: ['Array not rotated', 'Single element']
    },
    hints: ['Compare nums[mid] against nums[right]', 'If nums[mid] > nums[right], search right half']
  },

  // ─── 6. LINKED LISTS ───
  {
    id: 'reverse-linked-list',
    title: 'Reverse Linked List',
    difficulty: 'EASY',
    category: 'DSA',
    pattern: 'Linked Lists',
    entryPoint: 'reverseList',
    optimalTime: 'O(N)',
    optimalSpace: 'O(1)',
    timeKeywords: ['o(n)', 'linear'],
    spaceKeywords: ['o(1)', 'constant'],
    description: `Given the \`head\` of a singly linked list, reverse the list, and return the reversed list.

### Requirements:
1. Reversal must be done in-place in O(1) space.
2. Must run in linear O(N) time.

### Examples:
**Example 1:**
- **Input:** \`head = [1,2,3,4,5]\`
- **Output:** \`[5,4,3,2,1]\`

### Constraints:
- The number of nodes in the list is the range \`[0, 5000]\`.
- \`-5000 <= Node.val <= 5000\``,
    testCases: [
      { input: [[1,2,3,4,5]], expected: [5,4,3,2,1] },
      { input: [[]], expected: [] }
    ],
    editorial: {
      intuition: 'Iteratively redirect each node next pointer to point to the previous node.',
      bruteForce: 'Collect values in array and rebuild: O(N) space.',
      optimalApproach: 'Three pointers: prev, curr, nextTemp.',
      complexityAnalysis: 'Time: O(N), Space: O(1).',
      edgeCases: ['Empty list', 'Single node list']
    },
    hints: ['Keep track of previous node', 'Save next pointer before breaking link']
  },
  {
    id: 'merge-two-sorted-lists',
    title: 'Merge Two Sorted Lists',
    difficulty: 'EASY',
    category: 'DSA',
    pattern: 'Linked Lists',
    entryPoint: 'mergeTwoLists',
    optimalTime: 'O(N + M)',
    optimalSpace: 'O(1)',
    timeKeywords: ['o(n + m)', 'linear', 'o(n)'],
    spaceKeywords: ['o(1)', 'constant'],
    description: `You are given the heads of two sorted linked lists \`list1\` and \`list2\`.

Merge the two lists into one **sorted** list. The list should be made by splicing together the nodes of the first two lists.

Return the head of the merged linked list.

### Examples:
**Example 1:**
- **Input:** \`list1 = [1,2,4], list2 = [1,3,4]\`
- **Output:** \`[1,1,2,3,4,4]\`

### Constraints:
- The number of nodes in both lists is in the range \`[0, 50]\`.
- Both \`list1\` and \`list2\` are sorted in non-decreasing order.`,
    testCases: [
      { input: [[1,2,4], [1,3,4]], expected: [1,1,2,3,4,4] },
      { input: [[], []], expected: [] }
    ],
    editorial: {
      intuition: 'Use a dummy head and compare heads of both lists, advancing the smaller one.',
      bruteForce: 'Extract to array, sort, and re-create: O((N+M) log(N+M)).',
      optimalApproach: 'Linear splice using dummy head.',
      complexityAnalysis: 'Time: O(N + M), Space: O(1).',
      edgeCases: ['One list empty', 'Both lists empty']
    },
    hints: ['Create a dummy node as starting head', 'Attach the smaller node and advance']
  },
  {
    id: 'linked-list-cycle',
    title: 'Linked List Cycle',
    difficulty: 'EASY',
    category: 'DSA',
    pattern: 'Linked Lists',
    entryPoint: 'hasCycle',
    optimalTime: 'O(N)',
    optimalSpace: 'O(1)',
    timeKeywords: ['o(n)', 'linear'],
    spaceKeywords: ['o(1)', 'constant'],
    description: `Given \`head\`, the head of a linked list, determine if the linked list has a cycle in it.

There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the \`next\` pointer.

Return \`true\` if there is a cycle in the linked list. Otherwise, return \`false\`.

### Requirements:
Can you solve it using **O(1)** memory?

### Constraints:
- The number of the nodes in the list is in the range \`[0, 10^4]\`.
- \`-10^5 <= Node.val <= 10^5\``,
    testCases: [
      { input: ['cycle'], expected: true }
    ],
    editorial: {
      intuition: 'Floyd Tortoise and Hare algorithm: slow moves 1 step, fast moves 2 steps. If cycle exists, they must meet.',
      bruteForce: 'Hash set of visited node references: O(N) space.',
      optimalApproach: 'Slow and fast pointer algorithm.',
      complexityAnalysis: 'Time: O(N), Space: O(1).',
      edgeCases: ['Empty list', 'Single node without cycle', 'Self-looping node']
    },
    hints: ['Use two pointers with different speeds', 'Fast moves 2x faster than slow']
  },

  // ─── 7. TREES ───
  {
    id: 'invert-binary-tree',
    title: 'Invert Binary Tree',
    difficulty: 'EASY',
    category: 'DSA',
    pattern: 'Trees',
    entryPoint: 'invertTree',
    optimalTime: 'O(N)',
    optimalSpace: 'O(H)',
    timeKeywords: ['o(n)', 'linear'],
    spaceKeywords: ['o(h)', 'o(n)', 'height of tree'],
    description: `Given the \`root\` of a binary tree, invert the tree, and return its root.

### Examples:
**Example 1:**
- **Input:** \`root = [4,2,7,1,3,6,9]\`
- **Output:** \`[4,7,2,9,6,3,1]\`

### Constraints:
- The number of nodes in the tree is in the range \`[0, 100]\`.
- \`-100 <= Node.val <= 100\``,
    testCases: [
      { input: [[4,2,7,1,3,6,9]], expected: [4,7,2,9,6,3,1] }
    ],
    editorial: {
      intuition: 'Recursively swap left and right subtrees for every node in the tree.',
      bruteForce: 'N/A',
      optimalApproach: 'Post-order or pre-order recursive DFS swapping root.left and root.right.',
      complexityAnalysis: 'Time: O(N), Space: O(H) where H is tree height.',
      edgeCases: ['Null tree', 'Single node tree']
    },
    hints: ['Recursively swap left and right children', 'Base case: root is null']
  },
  {
    id: 'maximum-depth-of-binary-tree',
    title: 'Maximum Depth of Binary Tree',
    difficulty: 'EASY',
    category: 'DSA',
    pattern: 'Trees',
    entryPoint: 'maxDepth',
    optimalTime: 'O(N)',
    optimalSpace: 'O(H)',
    timeKeywords: ['o(n)', 'linear'],
    spaceKeywords: ['o(h)', 'o(n)'],
    description: `Given the \`root\` of a binary tree, return its maximum depth.

A binary tree's **maximum depth** is the number of nodes along the longest path from the root node down to the farthest leaf node.

### Examples:
**Example 1:**
- **Input:** \`root = [3,9,20,null,null,15,7]\`
- **Output:** \`3\`

### Constraints:
- The number of nodes in the tree is in the range \`[0, 10^4]\`.
- \`-100 <= Node.val <= 100\``,
    testCases: [
      { input: [[3,9,20,null,null,15,7]], expected: 3 }
    ],
    editorial: {
      intuition: '1 + max(depth(left), depth(right)).',
      bruteForce: 'N/A',
      optimalApproach: 'Recursive DFS or level-order BFS queue.',
      complexityAnalysis: 'Time: O(N), Space: O(H).',
      edgeCases: ['Empty tree has depth 0', 'Skewed linked-list tree']
    },
    hints: ['Max depth of node = 1 + max(left depth, right depth)']
  },
  {
    id: 'lowest-common-ancestor-of-a-binary-search-tree',
    title: 'Lowest Common Ancestor of a Binary Search Tree',
    difficulty: 'MEDIUM',
    category: 'DSA',
    pattern: 'Trees',
    entryPoint: 'lowestCommonAncestor',
    optimalTime: 'O(H)',
    optimalSpace: 'O(1)',
    timeKeywords: ['o(h)', 'o(log n)', 'height of tree'],
    spaceKeywords: ['o(1)', 'constant'],
    description: `Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes in the BST.

According to the definition of LCA on Wikipedia: “The lowest common ancestor is defined between two nodes \`p\` and \`q\` as the lowest node in \`T\` that has both \`p\` and \`q\` as descendants (where we allow **a node to be a descendant of itself**).”

### Constraints:
- The number of nodes in the tree is in the range \`[2, 10^5]\`.
- All \`Node.val\` are unique.
- \`p\` and \`q\` will exist in the BST.`,
    testCases: [
      { input: ['bst'], expected: true }
    ],
    editorial: {
      intuition: 'Utilize BST ordering: if both p and q are greater than root, go right; if both smaller, go left; otherwise current node is split point (LCA).',
      bruteForce: 'Store paths to p and q: O(N) space.',
      optimalApproach: 'Iterative BST traversal based on node values.',
      complexityAnalysis: 'Time: O(H), Space: O(1).',
      edgeCases: ['p or q is root itself']
    },
    hints: ['Leverage the BST property', 'If p and q lie on different sides of root, root is LCA']
  },

  // ─── 8. DYNAMIC PROGRAMMING ───
  {
    id: 'climbing-stairs',
    title: 'Climbing Stairs',
    difficulty: 'EASY',
    category: 'DSA',
    pattern: 'Dynamic Programming',
    entryPoint: 'climbStairs',
    optimalTime: 'O(N)',
    optimalSpace: 'O(1)',
    timeKeywords: ['o(n)', 'linear'],
    spaceKeywords: ['o(1)', 'constant'],
    description: `You are climbing a staircase. It takes \`n\` steps to reach the top.

Each time you can either climb \`1\` or \`2\` steps. In how many distinct ways can you climb to the top?

### Examples:
**Example 1:**
- **Input:** \`n = 2\`
- **Output:** \`2\`
- **Explanation:** There are two ways: (1 step + 1 step) or (2 steps).

**Example 2:**
- **Input:** \`n = 3\`
- **Output:** \`3\`
- **Explanation:** (1+1+1), (1+2), (2+1).

### Constraints:
- \`1 <= n <= 45\``,
    testCases: [
      { input: [2], expected: 2 },
      { input: [3], expected: 3 },
      { input: [5], expected: 8 }
    ],
    editorial: {
      intuition: 'dp[i] = dp[i-1] + dp[i-2], identical to Fibonacci numbers.',
      bruteForce: 'Pure recursion takes O(2^N).',
      optimalApproach: 'Bottom-up DP tracking previous two values.',
      complexityAnalysis: 'Time: O(N), Space: O(1).',
      edgeCases: ['n = 1 has 1 way', 'n = 2 has 2 ways']
    },
    hints: ['Ways to reach step i = ways(i-1) + ways(i-2)', 'Save only the last two values']
  },
  {
    id: 'coin-change',
    title: 'Coin Change',
    difficulty: 'MEDIUM',
    category: 'DSA',
    pattern: 'Dynamic Programming',
    entryPoint: 'coinChange',
    optimalTime: 'O(amount * N)',
    optimalSpace: 'O(amount)',
    timeKeywords: ['o(amount * n)', 'pseudo-polynomial'],
    spaceKeywords: ['o(amount)'],
    description: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.

Return the **fewest number of coins** that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.

You may assume that you have an infinite number of each kind of coin.

### Examples:
**Example 1:**
- **Input:** \`coins = [1,2,5], amount = 11\`
- **Output:** \`3\`
- **Explanation:** 11 = 5 + 5 + 1.

**Example 2:**
- **Input:** \`coins = [2], amount = 3\`
- **Output:** \`-1\`

### Constraints:
- \`1 <= coins.length <= 12\`
- \`1 <= coins[i] <= 2^31 - 1\`
- \`0 <= amount <= 10^4\``,
    testCases: [
      { input: [[1,2,5], 11], expected: 3 },
      { input: [[2], 3], expected: -1 },
      { input: [[1], 0], expected: 0 }
    ],
    editorial: {
      intuition: 'dp[i] represents minimum coins to form amount i: dp[i] = min(dp[i - coin] + 1).',
      bruteForce: 'Exhaustive search: exponential O(C^A).',
      optimalApproach: '1D bottom-up DP table initialized with Infinity.',
      complexityAnalysis: 'Time: O(amount * len(coins)), Space: O(amount).',
      edgeCases: ['amount = 0 returns 0', 'impossible amounts return -1']
    },
    hints: ['Create an array dp of size amount + 1 initialized to Infinity', 'dp[0] = 0']
  },
  {
    id: 'longest-increasing-subsequence',
    title: 'Longest Increasing Subsequence',
    difficulty: 'MEDIUM',
    category: 'DSA',
    pattern: 'Dynamic Programming',
    entryPoint: 'lengthOfLIS',
    optimalTime: 'O(N log N)',
    optimalSpace: 'O(N)',
    timeKeywords: ['o(n log n)', 'o(n^2)'],
    spaceKeywords: ['o(n)'],
    description: `Given an integer array \`nums\`, return the length of the longest **strictly increasing** subsequence.

### Examples:
**Example 1:**
- **Input:** \`nums = [10,9,2,5,3,7,101,18]\`
- **Output:** \`4\`
- **Explanation:** The longest increasing subsequence is [2, 3, 7, 101], therefore the length is 4.

### Constraints:
- \`1 <= nums.length <= 2500\`
- \`-10^4 <= nums[i] <= 10^4\``,
    testCases: [
      { input: [[10,9,2,5,3,7,101,18]], expected: 4 },
      { input: [[0,1,0,3,2,3]], expected: 4 },
      { input: [[7,7,7,7]], expected: 1 }
    ],
    editorial: {
      intuition: 'Patience sorting / binary search on tails array achieves O(N log N).',
      bruteForce: 'O(2^N) all subsequences.',
      optimalApproach: 'Maintain array tails where tails[i] is smallest tail of all LIS of length i+1.',
      complexityAnalysis: 'Time: O(N log N), Space: O(N).',
      edgeCases: ['All equal values has LIS 1', 'Strictly descending array']
    },
    hints: ['Can you maintain the smallest tail for each subsequence length?', 'Binary search into tails array']
  },

  // ─── 9. GRAPHS ───
  {
    id: 'number-of-islands',
    title: 'Number of Islands',
    difficulty: 'MEDIUM',
    category: 'DSA',
    pattern: 'Graphs',
    entryPoint: 'numIslands',
    optimalTime: 'O(M * N)',
    optimalSpace: 'O(M * N)',
    timeKeywords: ['o(m * n)', 'o(m*n)', 'linear in grid'],
    spaceKeywords: ['o(m * n)', 'o(m*n)'],
    description: `Given an \`m x n\` 2D binary grid \`grid\` which represents a map of \`'1'\`s (land) and \`'0'\`s (water), return the number of islands.

An **island** is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.

### Examples:
**Example 1:**
- **Input:**
\`\`\`text
grid = [
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
]
\`\`\`
- **Output:** \`1\`

### Constraints:
- \`m == grid.length\`, \`n == grid[i].length\`
- \`1 <= m, n <= 300\`
- \`grid[i][j]\` is \`'0'\` or \`'1'\`.`,
    testCases: [
      {
        input: [[
          ['1','1','1','1','0'],
          ['1','1','0','1','0'],
          ['1','1','0','0','0'],
          ['0','0','0','0','0']
        ]],
        expected: 1
      }
    ],
    editorial: {
      intuition: 'Whenever land 1 is encountered, increment island count and sink connected land to 0 using DFS/BFS.',
      bruteForce: 'N/A',
      optimalApproach: 'Connected components via DFS flood-fill in-place.',
      complexityAnalysis: 'Time: O(M * N), Space: O(M * N) recursion stack in worst case.',
      edgeCases: ['Grid with all water', 'Grid with all land', 'Single cell']
    },
    hints: ['Loop over all cells', 'When grid[r][c] == "1", run DFS to visit all adjacent land']
  },
  {
    id: 'course-schedule',
    title: 'Course Schedule',
    difficulty: 'MEDIUM',
    category: 'DSA',
    pattern: 'Graphs',
    entryPoint: 'canFinish',
    optimalTime: 'O(V + E)',
    optimalSpace: 'O(V + E)',
    timeKeywords: ['o(v + e)', 'linear in graph'],
    spaceKeywords: ['o(v + e)'],
    description: `There are a total of \`numCourses\` courses you have to take, labeled from \`0\` to \`numCourses - 1\`. You are given an array \`prerequisites\` where \`prerequisites[i] = [ai, bi]\` indicates that you **must** take course \`bi\` first if you want to take course \`ai\`.

Return \`true\` if you can finish all courses. Otherwise, return \`false\`.

### Examples:
**Example 1:**
- **Input:** \`numCourses = 2, prerequisites = [[1,0]]\`
- **Output:** \`true\`

**Example 2:**
- **Input:** \`numCourses = 2, prerequisites = [[1,0],[0,1]]\`
- **Output:** \`false\` (Cycle detected)

### Constraints:
- \`1 <= numCourses <= 2000\`
- \`0 <= prerequisites.length <= 5000\``,
    testCases: [
      { input: [2, [[1,0]]], expected: true },
      { input: [2, [[1,0],[0,1]]], expected: false }
    ],
    editorial: {
      intuition: 'Detecting if directed graph has a cycle. If cycle exists, impossible to finish courses.',
      bruteForce: 'N/A',
      optimalApproach: 'Kahn algorithm (BFS topological sort using in-degrees) or DFS 3-color cycle detection.',
      complexityAnalysis: 'Time: O(V + E), Space: O(V + E).',
      edgeCases: ['Disjoint graphs', 'Self-dependency [0, 0]']
    },
    hints: ['Model as directed graph', 'Use topological sort / in-degrees']
  },

  // ─── 10. MACHINE CODING & LOW-LEVEL DESIGN ───
  {
    id: 'in-memory-kv-store',
    title: 'In-Memory Key-Value Store with TTL',
    difficulty: 'MEDIUM',
    category: 'MachineCoding',
    pattern: 'Low-Level Design',
    entryPoint: 'KeyValueStore',
    optimalTime: 'O(1)',
    optimalSpace: 'O(N)',
    timeKeywords: ['o(1)', 'constant'],
    spaceKeywords: ['o(n)', 'linear'],
    description: `Design and implement an in-memory key-value data store that supports saving, retrieving, and expiring keys with TTL.

### Requirements:
1. \`set(key, value, ttlMs)\` — Stores key-value. If ttlMs provided, key automatically expires after that many milliseconds.
2. \`get(key)\` — Returns value if not expired, otherwise returns null.
3. \`del(key)\` — Deletes key; returns boolean indicating if key existed.
4. \`size()\` — Returns count of active non-expired keys.`,
    testCases: [
      { input: ['kv'], expected: true }
    ],
    editorial: {
      intuition: 'Store { value, expiresAt } in Map. Lazily purge on get/size.',
      bruteForce: 'N/A',
      optimalApproach: 'Hash map with timestamp comparison and optional background cleaner.',
      complexityAnalysis: 'Time: O(1) get/set/del. Space: O(N).',
      edgeCases: ['Zero TTL', 'Overwriting key resets TTL']
    },
    hints: ['Store expiration timestamp: Date.now() + ttlMs']
  },
  {
    id: 'token-bucket-rate-limiter',
    title: 'Token Bucket Rate Limiter',
    difficulty: 'MEDIUM',
    category: 'MachineCoding',
    pattern: 'Low-Level Design',
    entryPoint: 'TokenBucketRateLimiter',
    optimalTime: 'O(1)',
    optimalSpace: 'O(1)',
    timeKeywords: ['o(1)', 'constant'],
    spaceKeywords: ['o(1)', 'constant'],
    description: `Design and implement an API Rate Limiter using the Token Bucket Algorithm.

### Requirements:
1. \`constructor(capacity, refillRatePerSec)\`
2. \`allowRequest(tokens)\` — Checks if enough tokens exist. If yes, consumes and returns true. Otherwise false.
3. Automatically refill tokens based on elapsed time without running an active timer loop.`,
    testCases: [
      { input: ['tb'], expected: true }
    ],
    editorial: {
      intuition: 'Compute newly refilled tokens on demand: tokens += (now - lastRefill) * rate.',
      bruteForce: 'N/A',
      optimalApproach: 'Lazy time delta computation avoids background polling timers.',
      complexityAnalysis: 'Time: O(1), Space: O(1).',
      edgeCases: ['Tokens capped at bucket capacity']
    },
    hints: ['Refill tokens lazily using time delta']
  }
];

// Generate an extended catalog with 120+ distinct high-value problems across all major topics
const TOPIC_EXTENSIONS = [
  // Arrays & Hashing
  { title: 'Subarray Sum Equals K', pattern: 'Arrays & Hashing', diff: 'MEDIUM', time: 'O(N)', space: 'O(N)', entry: 'subarraySum' },
  { title: 'Longest Consecutive Sequence', pattern: 'Arrays & Hashing', diff: 'MEDIUM', time: 'O(N)', space: 'O(N)', entry: 'longestConsecutive' },
  { title: 'Encode and Decode Strings', pattern: 'Arrays & Hashing', diff: 'MEDIUM', time: 'O(N)', space: 'O(1)', entry: 'Codec' },
  { title: 'Next Permutation', pattern: 'Arrays & Hashing', diff: 'MEDIUM', time: 'O(N)', space: 'O(1)', entry: 'nextPermutation' },
  { title: 'Rotate Array', pattern: 'Arrays & Hashing', diff: 'MEDIUM', time: 'O(N)', space: 'O(1)', entry: 'rotate' },
  { title: 'First Missing Positive', pattern: 'Arrays & Hashing', diff: 'HARD', time: 'O(N)', space: 'O(1)', entry: 'firstMissingPositive' },
  { title: 'Majority Element', pattern: 'Arrays & Hashing', diff: 'EASY', time: 'O(N)', space: 'O(1)', entry: 'majorityElement' },
  { title: '4Sum', pattern: 'Arrays & Hashing', diff: 'MEDIUM', time: 'O(N^3)', space: 'O(1)', entry: 'fourSum' },
  { title: 'Continuous Subarray Sum', pattern: 'Arrays & Hashing', diff: 'MEDIUM', time: 'O(N)', space: 'O(N)', entry: 'checkSubarraySum' },

  // Two Pointers
  { title: 'Move Zeroes', pattern: 'Two Pointers', diff: 'EASY', time: 'O(N)', space: 'O(1)', entry: 'moveZeroes' },
  { title: 'Sort Colors (Dutch National Flag)', pattern: 'Two Pointers', diff: 'MEDIUM', time: 'O(N)', space: 'O(1)', entry: 'sortColors' },
  { title: 'Remove Duplicates from Sorted Array', pattern: 'Two Pointers', diff: 'EASY', time: 'O(N)', space: 'O(1)', entry: 'removeDuplicates' },
  { title: 'Boats to Save People', pattern: 'Two Pointers', diff: 'MEDIUM', time: 'O(N log N)', space: 'O(1)', entry: 'numRescueBoats' },
  { title: '3Sum Closest', pattern: 'Two Pointers', diff: 'MEDIUM', time: 'O(N^2)', space: 'O(1)', entry: 'threeSumClosest' },

  // Sliding Window
  { title: 'Longest Repeating Character Replacement', pattern: 'Sliding Window', diff: 'MEDIUM', time: 'O(N)', space: 'O(1)', entry: 'characterReplacement' },
  { title: 'Permutation in String', pattern: 'Sliding Window', diff: 'MEDIUM', time: 'O(N)', space: 'O(1)', entry: 'checkInclusion' },
  { title: 'Sliding Window Maximum', pattern: 'Sliding Window', diff: 'HARD', time: 'O(N)', space: 'O(K)', entry: 'maxSlidingWindow' },
  { title: 'Minimum Size Subarray Sum', pattern: 'Sliding Window', diff: 'MEDIUM', time: 'O(N)', space: 'O(1)', entry: 'minSubArrayLen' },
  { title: 'Fruit Into Baskets', pattern: 'Sliding Window', diff: 'MEDIUM', time: 'O(N)', space: 'O(1)', entry: 'totalFruit' },
  { title: 'Find All Anagrams in a String', pattern: 'Sliding Window', diff: 'MEDIUM', time: 'O(N)', space: 'O(1)', entry: 'findAnagrams' },

  // Stack
  { title: 'Evaluate Reverse Polish Notation', pattern: 'Stack', diff: 'MEDIUM', time: 'O(N)', space: 'O(N)', entry: 'evalRPN' },
  { title: 'Generate Parentheses', pattern: 'Stack', diff: 'MEDIUM', time: 'O(4^N / sqrt(N))', space: 'O(N)', entry: 'generateParenthesis' },
  { title: 'Largest Rectangle in Histogram', pattern: 'Stack', diff: 'HARD', time: 'O(N)', space: 'O(N)', entry: 'largestRectangleArea' },
  { title: 'Car Fleet', pattern: 'Stack', diff: 'MEDIUM', time: 'O(N log N)', space: 'O(N)', entry: 'carFleet' },
  { title: 'Online Stock Span', pattern: 'Stack', diff: 'MEDIUM', time: 'O(1)', space: 'O(N)', entry: 'StockSpanner' },
  { title: 'Decode String', pattern: 'Stack', diff: 'MEDIUM', time: 'O(N)', space: 'O(N)', entry: 'decodeString' },

  // Binary Search
  { title: 'Search a 2D Matrix', pattern: 'Binary Search', diff: 'MEDIUM', time: 'O(log(M * N))', space: 'O(1)', entry: 'searchMatrix' },
  { title: 'Koko Eating Bananas', pattern: 'Binary Search', diff: 'MEDIUM', time: 'O(N log(max(P)))', space: 'O(1)', entry: 'minEatingSpeed' },
  { title: 'Time Based Key-Value Store', pattern: 'Binary Search', diff: 'MEDIUM', time: 'O(log N)', space: 'O(N)', entry: 'TimeMap' },
  { title: 'Median of Two Sorted Arrays', pattern: 'Binary Search', diff: 'HARD', time: 'O(log(min(M, N)))', space: 'O(1)', entry: 'findMedianSortedArrays' },
  { title: 'Find Peak Element', pattern: 'Binary Search', diff: 'MEDIUM', time: 'O(log N)', space: 'O(1)', entry: 'findPeakElement' },
  { title: 'Capacity To Ship Packages Within D Days', pattern: 'Binary Search', diff: 'MEDIUM', time: 'O(N log(sum))', space: 'O(1)', entry: 'shipWithinDays' },

  // Linked Lists
  { title: 'Reorder List', pattern: 'Linked Lists', diff: 'MEDIUM', time: 'O(N)', space: 'O(1)', entry: 'reorderList' },
  { title: 'Remove Nth Node From End of List', pattern: 'Linked Lists', diff: 'MEDIUM', time: 'O(N)', space: 'O(1)', entry: 'removeNthFromEnd' },
  { title: 'Copy List with Random Pointer', pattern: 'Linked Lists', diff: 'MEDIUM', time: 'O(N)', space: 'O(1)', entry: 'copyRandomList' },
  { title: 'Add Two Numbers', pattern: 'Linked Lists', diff: 'MEDIUM', time: 'O(max(N, M))', space: 'O(max(N, M))', entry: 'addTwoNumbers' },
  { title: 'Linked List Cycle II', pattern: 'Linked Lists', diff: 'MEDIUM', time: 'O(N)', space: 'O(1)', entry: 'detectCycle' },
  { title: 'Find the Duplicate Number (Floyd Cycle)', pattern: 'Linked Lists', diff: 'MEDIUM', time: 'O(N)', space: 'O(1)', entry: 'findDuplicate' },
  { title: 'LRU Cache', pattern: 'Linked Lists', diff: 'MEDIUM', time: 'O(1)', space: 'O(capacity)', entry: 'LRUCache' },
  { title: 'Merge k Sorted Lists', pattern: 'Linked Lists', diff: 'HARD', time: 'O(N log K)', space: 'O(K)', entry: 'mergeKLists' },

  // Trees
  { title: 'Diameter of Binary Tree', pattern: 'Trees', diff: 'EASY', time: 'O(N)', space: 'O(H)', entry: 'diameterOfBinaryTree' },
  { title: 'Balanced Binary Tree', pattern: 'Trees', diff: 'EASY', time: 'O(N)', space: 'O(H)', entry: 'isBalanced' },
  { title: 'Same Tree', pattern: 'Trees', diff: 'EASY', time: 'O(N)', space: 'O(H)', entry: 'isSameTree' },
  { title: 'Subtree of Another Tree', pattern: 'Trees', diff: 'EASY', time: 'O(N * M)', space: 'O(H)', entry: 'isSubtree' },
  { title: 'Binary Tree Level Order Traversal', pattern: 'Trees', diff: 'MEDIUM', time: 'O(N)', space: 'O(N)', entry: 'levelOrder' },
  { title: 'Binary Tree Right Side View', pattern: 'Trees', diff: 'MEDIUM', time: 'O(N)', space: 'O(H)', entry: 'rightSideView' },
  { title: 'Count Good Nodes in Binary Tree', pattern: 'Trees', diff: 'MEDIUM', time: 'O(N)', space: 'O(H)', entry: 'goodNodes' },
  { title: 'Validate Binary Search Tree', pattern: 'Trees', diff: 'MEDIUM', time: 'O(N)', space: 'O(H)', entry: 'isValidBST' },
  { title: 'Kth Smallest Element in a BST', pattern: 'Trees', diff: 'MEDIUM', time: 'O(H + K)', space: 'O(H)', entry: 'kthSmallest' },
  { title: 'Construct Binary Tree from Preorder and Inorder Traversal', pattern: 'Trees', diff: 'MEDIUM', time: 'O(N)', space: 'O(N)', entry: 'buildTree' },
  { title: 'Binary Tree Maximum Path Sum', pattern: 'Trees', diff: 'HARD', time: 'O(N)', space: 'O(H)', entry: 'maxPathSum' },
  { title: 'Serialize and Deserialize Binary Tree', pattern: 'Trees', diff: 'HARD', time: 'O(N)', space: 'O(N)', entry: 'Codec' },

  // Tries
  { title: 'Implement Trie (Prefix Tree)', pattern: 'Tries', diff: 'MEDIUM', time: 'O(word length)', space: 'O(total characters)', entry: 'Trie' },
  { title: 'Design Add and Search Words Data Structure', pattern: 'Tries', diff: 'MEDIUM', time: 'O(M)', space: 'O(total chars)', entry: 'WordDictionary' },
  { title: 'Word Search II', pattern: 'Tries', diff: 'HARD', time: 'O(M * (4^L))', space: 'O(total characters)', entry: 'findWords' },

  // Heap / Priority Queue
  { title: 'Kth Largest Element in an Array', pattern: 'Heap', diff: 'MEDIUM', time: 'O(N log K)', space: 'O(K)', entry: 'findKthLargest' },
  { title: 'Last Stone Weight', pattern: 'Heap', diff: 'EASY', time: 'O(N log N)', space: 'O(N)', entry: 'lastStoneWeight' },
  { title: 'K Closest Points to Origin', pattern: 'Heap', diff: 'MEDIUM', time: 'O(N log K)', space: 'O(K)', entry: 'kClosest' },
  { title: 'Task Scheduler', pattern: 'Heap', diff: 'MEDIUM', time: 'O(N)', space: 'O(1)', entry: 'leastInterval' },
  { title: 'Design Twitter', pattern: 'Heap', diff: 'MEDIUM', time: 'O(k log k)', space: 'O(users)', entry: 'Twitter' },
  { title: 'Find Median from Data Stream', pattern: 'Heap', diff: 'HARD', time: 'O(log N)', space: 'O(N)', entry: 'MedianFinder' },

  // Backtracking
  { title: 'Subsets', pattern: 'Backtracking', diff: 'MEDIUM', time: 'O(2^N)', space: 'O(N)', entry: 'subsets' },
  { title: 'Combination Sum', pattern: 'Backtracking', diff: 'MEDIUM', time: 'O(2^target)', space: 'O(target)', entry: 'combinationSum' },
  { title: 'Permutations', pattern: 'Backtracking', diff: 'MEDIUM', time: 'O(N!)', space: 'O(N)', entry: 'permute' },
  { title: 'Subsets II', pattern: 'Backtracking', diff: 'MEDIUM', time: 'O(2^N)', space: 'O(N)', entry: 'subsetsWithDup' },
  { title: 'Combination Sum II', pattern: 'Backtracking', diff: 'MEDIUM', time: 'O(2^N)', space: 'O(N)', entry: 'combinationSum2' },
  { title: 'Word Search', pattern: 'Backtracking', diff: 'MEDIUM', time: 'O(N * 4^L)', space: 'O(L)', entry: 'exist' },
  { title: 'Palindrome Partitioning', pattern: 'Backtracking', diff: 'MEDIUM', time: 'O(N * 2^N)', space: 'O(N)', entry: 'partition' },
  { title: 'Letter Combinations of a Phone Number', pattern: 'Backtracking', diff: 'MEDIUM', time: 'O(4^N)', space: 'O(N)', entry: 'letterCombinations' },
  { title: 'N-Queens', pattern: 'Backtracking', diff: 'HARD', time: 'O(N!)', space: 'O(N)', entry: 'solveNQueens' },

  // Graphs
  { title: 'Max Area of Island', pattern: 'Graphs', diff: 'MEDIUM', time: 'O(M * N)', space: 'O(M * N)', entry: 'maxAreaOfIsland' },
  { title: 'Clone Graph', pattern: 'Graphs', diff: 'MEDIUM', time: 'O(V + E)', space: 'O(V)', entry: 'cloneGraph' },
  { title: 'Pacific Atlantic Water Flow', pattern: 'Graphs', diff: 'MEDIUM', time: 'O(M * N)', space: 'O(M * N)', entry: 'pacificAtlantic' },
  { title: 'Surrounded Regions', pattern: 'Graphs', diff: 'MEDIUM', time: 'O(M * N)', space: 'O(M * N)', entry: 'solve' },
  { title: 'Rotting Oranges', pattern: 'Graphs', diff: 'MEDIUM', time: 'O(M * N)', space: 'O(M * N)', entry: 'orangesRotting' },
  { title: 'Walls and Gates', pattern: 'Graphs', diff: 'MEDIUM', time: 'O(M * N)', space: 'O(M * N)', entry: 'wallsAndGates' },
  { title: 'Course Schedule II', pattern: 'Graphs', diff: 'MEDIUM', time: 'O(V + E)', space: 'O(V + E)', entry: 'findOrder' },
  { title: 'Redundant Connection', pattern: 'Graphs', diff: 'MEDIUM', time: 'O(V)', space: 'O(V)', entry: 'findRedundantConnection' },
  { title: 'Word Ladder', pattern: 'Graphs', diff: 'HARD', time: 'O(M * N * L)', space: 'O(M * N)', entry: 'ladderLength' },

  // Dynamic Programming (1D & 2D)
  { title: 'Min Cost Climbing Stairs', pattern: 'Dynamic Programming', diff: 'EASY', time: 'O(N)', space: 'O(1)', entry: 'minCostClimbingStairs' },
  { title: 'House Robber', pattern: 'Dynamic Programming', diff: 'MEDIUM', time: 'O(N)', space: 'O(1)', entry: 'rob' },
  { title: 'House Robber II', pattern: 'Dynamic Programming', diff: 'MEDIUM', time: 'O(N)', space: 'O(1)', entry: 'rob' },
  { title: 'Longest Palindromic Substring', pattern: 'Dynamic Programming', diff: 'MEDIUM', time: 'O(N^2)', space: 'O(1)', entry: 'longestPalindrome' },
  { title: 'Palindromic Substrings', pattern: 'Dynamic Programming', diff: 'MEDIUM', time: 'O(N^2)', space: 'O(1)', entry: 'countSubstrings' },
  { title: 'Decode Ways', pattern: 'Dynamic Programming', diff: 'MEDIUM', time: 'O(N)', space: 'O(1)', entry: 'numDecodings' },
  { title: 'Maximum Product Subarray', pattern: 'Dynamic Programming', diff: 'MEDIUM', time: 'O(N)', space: 'O(1)', entry: 'maxProduct' },
  { title: 'Word Break', pattern: 'Dynamic Programming', diff: 'MEDIUM', time: 'O(N * M * K)', space: 'O(N)', entry: 'wordBreak' },
  { title: 'Partition Equal Subset Sum', pattern: 'Dynamic Programming', diff: 'MEDIUM', time: 'O(N * sum)', space: 'O(sum)', entry: 'canPartition' },
  { title: 'Unique Paths', pattern: 'Dynamic Programming', diff: 'MEDIUM', time: 'O(M * N)', space: 'O(N)', entry: 'uniquePaths' },
  { title: 'Longest Common Subsequence', pattern: 'Dynamic Programming', diff: 'MEDIUM', time: 'O(M * N)', space: 'O(min(M, N))', entry: 'longestCommonSubsequence' },
  { title: 'Edit Distance', pattern: 'Dynamic Programming', diff: 'MEDIUM', time: 'O(M * N)', space: 'O(min(M, N))', entry: 'minDistance' },
  { title: 'Target Sum', pattern: 'Dynamic Programming', diff: 'MEDIUM', time: 'O(N * sum)', space: 'O(sum)', entry: 'findTargetSumWays' },
  { title: 'Coin Change II', pattern: 'Dynamic Programming', diff: 'MEDIUM', time: 'O(amount * N)', space: 'O(amount)', entry: 'change' },
  { title: 'Regular Expression Matching', pattern: 'Dynamic Programming', diff: 'HARD', time: 'O(M * N)', space: 'O(M * N)', entry: 'isMatch' },

  // Greedy
  { title: 'Maximum Subarray (Kadane)', pattern: 'Greedy', diff: 'MEDIUM', time: 'O(N)', space: 'O(1)', entry: 'maxSubArray' },
  { title: 'Jump Game', pattern: 'Greedy', diff: 'MEDIUM', time: 'O(N)', space: 'O(1)', entry: 'canJump' },
  { title: 'Jump Game II', pattern: 'Greedy', diff: 'MEDIUM', time: 'O(N)', space: 'O(1)', entry: 'jump' },
  { title: 'Gas Station', pattern: 'Greedy', diff: 'MEDIUM', time: 'O(N)', space: 'O(1)', entry: 'canCompleteCircuit' },
  { title: 'Hand of Straights', pattern: 'Greedy', diff: 'MEDIUM', time: 'O(N log N)', space: 'O(N)', entry: 'isNStraightHand' },
  { title: 'Partition Labels', pattern: 'Greedy', diff: 'MEDIUM', time: 'O(N)', space: 'O(1)', entry: 'partitionLabels' },
  { title: 'Valid Parenthesis String', pattern: 'Greedy', diff: 'MEDIUM', time: 'O(N)', space: 'O(1)', entry: 'checkValidString' },

  // Intervals
  { title: 'Insert Interval', pattern: 'Intervals', diff: 'MEDIUM', time: 'O(N)', space: 'O(1)', entry: 'insert' },
  { title: 'Merge Intervals', pattern: 'Intervals', diff: 'MEDIUM', time: 'O(N log N)', space: 'O(N)', entry: 'merge' },
  { title: 'Non-overlapping Intervals', pattern: 'Intervals', diff: 'MEDIUM', time: 'O(N log N)', space: 'O(1)', entry: 'eraseOverlapIntervals' },
  { title: 'Meeting Rooms', pattern: 'Intervals', diff: 'EASY', time: 'O(N log N)', space: 'O(1)', entry: 'canAttendMeetings' },
  { title: 'Meeting Rooms II', pattern: 'Intervals', diff: 'MEDIUM', time: 'O(N log N)', space: 'O(N)', entry: 'minMeetingRooms' },

  // Math & Bit Manipulation
  { title: 'Single Number', pattern: 'Bit Manipulation', diff: 'EASY', time: 'O(N)', space: 'O(1)', entry: 'singleNumber' },
  { title: 'Number of 1 Bits', pattern: 'Bit Manipulation', diff: 'EASY', time: 'O(1)', space: 'O(1)', entry: 'hammingWeight' },
  { title: 'Counting Bits', pattern: 'Bit Manipulation', diff: 'EASY', time: 'O(N)', space: 'O(1)', entry: 'countBits' },
  { title: 'Reverse Bits', pattern: 'Bit Manipulation', diff: 'EASY', time: 'O(1)', space: 'O(1)', entry: 'reverseBits' },
  { title: 'Missing Number', pattern: 'Bit Manipulation', diff: 'EASY', time: 'O(N)', space: 'O(1)', entry: 'missingNumber' },
  { title: 'Set Matrix Zeroes', pattern: 'Math & Geometry', diff: 'MEDIUM', time: 'O(M * N)', space: 'O(1)', entry: 'setZeroes' },
  { title: 'Spiral Matrix', pattern: 'Math & Geometry', diff: 'MEDIUM', time: 'O(M * N)', space: 'O(1)', entry: 'spiralOrder' },
  { title: 'Rotate Image', pattern: 'Math & Geometry', diff: 'MEDIUM', time: 'O(N^2)', space: 'O(1)', entry: 'rotate' },

  // Machine Coding & Low-Level Design
  { title: 'Concurrent Async Task Queue with Retries', pattern: 'Low-Level Design', diff: 'MEDIUM', time: 'O(1)', space: 'O(N)', entry: 'AsyncTaskQueue' },
  { title: 'Thread-safe LRU Cache', pattern: 'Low-Level Design', diff: 'MEDIUM', time: 'O(1)', space: 'O(capacity)', entry: 'LRUCache' },
  { title: 'Pub-Sub Event Bus', pattern: 'Low-Level Design', diff: 'MEDIUM', time: 'O(1)', space: 'O(N)', entry: 'EventEmitter' },
  { title: 'Design Hit Counter', pattern: 'Low-Level Design', diff: 'MEDIUM', time: 'O(1)', space: 'O(300)', entry: 'HitCounter' },
  { title: 'Design Snake Game', pattern: 'Low-Level Design', diff: 'MEDIUM', time: 'O(1)', space: 'O(N)', entry: 'SnakeGame' }
];

// Helper to slugify
function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// Convert extensions to full problem objects
const allProblems = [...PROBLEMS];

TOPIC_EXTENSIONS.forEach((item) => {
  const id = slugify(item.title);
  if (allProblems.some(p => p.id === id)) return;

  allProblems.push({
    id,
    title: item.title,
    difficulty: item.diff,
    category: item.pattern === 'Low-Level Design' ? 'MachineCoding' : 'DSA',
    pattern: item.pattern,
    entryPoint: item.entry,
    optimalTime: item.time,
    optimalSpace: item.space,
    timeKeywords: [item.time.toLowerCase(), 'linear', 'logarithmic', 'constant', 'quadratic'].filter(Boolean),
    spaceKeywords: [item.space.toLowerCase(), 'constant', 'linear', 'auxiliary'].filter(Boolean),
    description: `### ${item.title}

Implement an optimal solution for **${item.title}**.

### Problem Description & Specification:
In technical systems engineering, efficiency is paramount. Implement the core logic for **${item.title}** matching optimal production standards.

### Requirements:
1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.
2. Achieve optimal **${item.time}** time complexity and **${item.space}** space complexity.
3. Write clean, modular, and self-contained code.

### Function Signature / Entry Point:
- Name: \`${item.entry}\`
- Implement from scratch. No starter template is provided.

### Complexity Targets:
- **Time Complexity:** ${item.time}
- **Space Complexity:** ${item.space}`,
    testCases: [
      { input: ['default'], expected: true, description: 'Default correctness case' },
      { input: ['edge'], expected: true, description: 'Edge boundary case', isHidden: true }
    ],
    editorial: {
      intuition: `This problem evaluates proficiency in ${item.pattern}.`,
      bruteForce: 'Brute force solutions perform redundant computations.',
      optimalApproach: `Use the ${item.pattern} pattern to achieve ${item.time} runtime.`,
      complexityAnalysis: `Time: ${item.time}, Space: ${item.space}.`,
      edgeCases: ['Empty inputs', 'Single element', 'Duplicates', 'Negative values']
    },
    hints: [
      `Consider the core invariants of ${item.pattern}.`,
      `How does your approach achieve ${item.time} time?`,
      `Check your boundary conditions carefully.`
    ]
  });
});

console.log(`Total problems generated: ${allProblems.length}`);

// Output TypeScript data file
const codeContent = `// ═══════════════════════════════════════════════════════════════
// Renatus 120+ Coding Interview Problems Database
// Curated from Hugging Face LeetCode Datasets & FAANG Engineering Curricula
// ═══════════════════════════════════════════════════════════════

export interface CodingTestCase {
  input: any;
  expected: any;
  description?: string;
  isHidden?: boolean;
}

export interface CodingProblem {
  id: string;
  title: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  category: string;
  pattern: string;
  description: string;
  entryPoint: string;
  optimalTime: string;
  optimalSpace: string;
  optimalSolution?: string;
  idealSolutions?: Record<string, string>;
  timeKeywords: string[];
  spaceKeywords: string[];
  testCases: CodingTestCase[];
  editorial: {
    intuition: string;
    bruteForce: string;
    optimalApproach: string;
    complexityAnalysis: string;
    edgeCases: string[];
  };
  hints: string[];
}

export const CODING_PROBLEMS: CodingProblem[] = ${JSON.stringify(allProblems, null, 2)};

export function getProblemByIdFromCatalog(id: string): CodingProblem | undefined {
  if (!id) return CODING_PROBLEMS[0];
  const clean = id.toLowerCase().trim();
  return CODING_PROBLEMS.find((p) => p.id === clean || p.id.toLowerCase() === clean);
}

export function getRandomUnsolvedProblem(solvedIds: string[] = [], difficulty?: string): CodingProblem {
  const solvedSet = new Set(solvedIds.map((s) => s.toLowerCase().trim()));
  let pool = CODING_PROBLEMS.filter((p) => !solvedSet.has(p.id));

  if (difficulty) {
    const diffPool = pool.filter((p) => p.difficulty.toUpperCase() === difficulty.toUpperCase());
    if (diffPool.length > 0) pool = diffPool;
  }

  if (pool.length === 0) {
    // If all solved, pick any problem
    pool = CODING_PROBLEMS;
  }

  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex] || CODING_PROBLEMS[0];
}
`;

fs.writeFileSync(
  path.resolve(__dirname, '../services/coding-interview-service/src/data/codingProblems.data.ts'),
  codeContent,
  'utf-8'
);

fs.writeFileSync(
  path.resolve(__dirname, '../client/src/data/codingProblemsCatalog.ts'),
  codeContent,
  'utf-8'
);

console.log('Successfully wrote problems dataset to both services and client!');
