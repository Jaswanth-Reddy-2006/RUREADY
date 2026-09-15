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
  pattern: string;
  description: string;
  entryPoint: string;
  starterCode: {
    javascript: string;
    typescript: string;
    python: string;
    java: string;
    cpp: string;
    go: string;
  };
  testCases: CodingTestCase[];
  optimalSolution: string;
  optimalTime: string;
  optimalSpace: string;
  editorial: {
    intuition: string;
    bruteForce: string;
    optimalApproach: string;
    complexityAnalysis: string;
    edgeCases: string[];
  };
  idealSolutions: {
    javascript: string;
    typescript: string;
    python: string;
    java: string;
    cpp: string;
    go: string;
  };
  hints: string[];
}

export const CODING_PROBLEMS: CodingProblem[] = [
  // 1. Two Sum (EASY - Arrays & Hashing)
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'EASY',
    pattern: 'Arrays & Hashing',
    entryPoint: 'twoSum',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice. You can return the answer in any order.

### Example 1:
\`\`\`text
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
\`\`\`

### Example 2:
\`\`\`text
Input: nums = [3,2,4], target = 6
Output: [1,2]
\`\`\`

### Example 3:
\`\`\`text
Input: nums = [3,3], target = 6
Output: [0,1]
\`\`\`

### Constraints:
- \`2 <= nums.length <= 10^4\`
- \`-10^9 <= nums[i] <= 10^9\`
- \`-10^9 <= target <= 10^9\`
- Only one valid answer exists.`,
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  // Write your optimal solution here
  return [0, 1];
}`,
      typescript: `function twoSum(nums: number[], target: number): number[] {
  // Write your optimal solution here
  return [0, 1];
}`,
      python: `def twoSum(nums: list[int], target: int) -> list[int]:
    # Write your optimal solution here
    return [0, 1]`,
      java: `import java.util.*;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your optimal solution here
        return new int[]{0, 1};
    }
}`,
      cpp: `#include <vector>
#include <unordered_map>

class Solution {
public:
    std::vector<int> twoSum(std::vector<int>& nums, int target) {
        // Write your optimal solution here
        return {0, 1};
    }
};`,
      go: `package main

func twoSum(nums []int, target int) []int {
    // Write your optimal solution here
    return []int{0, 1}
}`,
    },
    testCases: [
      { input: [[2, 7, 11, 15], 9], expected: [0, 1], description: 'Standard case with positive integers' },
      { input: [[3, 2, 4], 6], expected: [1, 2], description: 'Target found later in array' },
      { input: [[3, 3], 6], expected: [0, 1], description: 'Duplicate values that sum to target' },
      { input: [[-1, -2, -3, -4, -5], -8], expected: [2, 4], description: 'Negative integers edge case', isHidden: true },
      { input: [[0, 4, 3, 0], 0], expected: [0, 3], description: 'Zero elements edge case', isHidden: true },
    ],
    optimalSolution: 'One-pass Hash Map storing complements: O(N) time, O(N) space.',
    optimalTime: 'O(N)',
    optimalSpace: 'O(N)',
    editorial: {
      intuition: 'Instead of searching through all pairs with nested loops (which takes quadratic time), we can trade a linear amount of auxiliary space for instantaneous lookup time using a hash map.',
      bruteForce: 'A brute-force solution checks every pair (i, j) with i < j. For an array of length N, this requires N*(N-1)/2 comparisons, resulting in O(N^2) time complexity and O(1) space.',
      optimalApproach: 'Traverse the array once. For each element \`nums[i]\`, compute its complement \`target - nums[i]\`. If the complement already exists in our hash map, we have found our two numbers and return \`[map[complement], i]\`. Otherwise, insert \`nums[i]\` into the map with its index \`i\`.',
      complexityAnalysis: 'Time Complexity: O(N) because we perform a single linear scan of nums, and hash map lookups take amortized O(1) time. Space Complexity: O(N) to store up to N elements in the hash map.',
      edgeCases: [
        'Duplicate elements that sum up to target (e.g. nums = [3, 3], target = 6).',
        'Negative numbers (e.g. nums = [-3, 4, 3, 90], target = 0).',
        'Target with zero (e.g. nums = [0, 4, 3, 0], target = 0).'
      ],
    },
    idealSolutions: {
      javascript: `function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }
    seen.set(nums[i], i);
  }
  return [];
}`,
      typescript: `function twoSum(nums: number[], target: number): number[] {
  const seen = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) {
      return [seen.get(complement)!, i];
    }
    seen.set(nums[i], i);
  }
  return [];
}`,
      python: `def twoSum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
      java: `import java.util.HashMap;
import java.util.Map;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[0];
    }
}`,
      cpp: `#include <vector>
#include <unordered_map>

class Solution {
public:
    std::vector<int> twoSum(std::vector<int>& nums, int target) {
        std::unordered_map<int, int> seen;
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (seen.count(complement)) {
                return {seen[complement], i};
            }
            seen[nums[i]] = i;
        }
        return {};
    }
};`,
      go: `package main

func twoSum(nums []int, target int) []int {
    seen := make(map[int]int)
    for i, num := range nums {
        complement := target - num
        if idx, ok := seen[complement]; ok {
            return []int{idx, i}
        }
        seen[num] = i
    }
    return nil
}`,
    },
    hints: [
      'Think about what information you need when inspecting each number: if you are at x, what value y must you find?',
      'Can you use a Hash Map to store previously visited elements and their indices for O(1) lookup?',
      'Notice that you only need a single pass! You can check if the complement exists in your map before inserting the current number.',
    ],
  },

  // 2. Valid Palindrome (EASY - Two Pointers)
  {
    id: 'valid-palindrome',
    title: 'Valid Palindrome',
    difficulty: 'EASY',
    pattern: 'Two Pointers',
    entryPoint: 'isPalindrome',
    description: `A phrase is a **palindrome** if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.

Given a string \`s\`, return \`true\` if it is a **palindrome**, or \`false\` otherwise.

### Example 1:
\`\`\`text
Input: s = "A man, a plan, a canal: Panama"
Output: true
Explanation: "amanaplanacanalpanama" is a palindrome.
\`\`\`

### Example 2:
\`\`\`text
Input: s = "race a car"
Output: false
Explanation: "raceacar" is not a palindrome.
\`\`\`

### Constraints:
- \`1 <= s.length <= 2 * 10^5\`
- \`s\` consists only of printable ASCII characters.`,
    starterCode: {
      javascript: `function isPalindrome(s) {
  // Write your optimal solution here
  return true;
}`,
      typescript: `function isPalindrome(s: string): boolean {
  // Write your optimal solution here
  return true;
}`,
      python: `def isPalindrome(s: str) -> bool:
    # Write your optimal solution here
    return True`,
      java: `class Solution {
    public boolean isPalindrome(String s) {
        // Write your optimal solution here
        return true;
    }
}`,
      cpp: `#include <string>
#include <cctype>

class Solution {
public:
    bool isPalindrome(std::string s) {
        // Write your optimal solution here
        return true;
    }
};`,
      go: `package main

func isPalindrome(s string) bool {
    // Write your optimal solution here
    return true
}`,
    },
    testCases: [
      { input: ["A man, a plan, a canal: Panama"], expected: true, description: 'Standard mixed phrase' },
      { input: ["race a car"], expected: false, description: 'Non-palindrome phrase' },
      { input: [" "], expected: true, description: 'Single whitespace empty string' },
      { input: ["0P"], expected: false, description: 'Alphanumeric letter and digit', isHidden: true },
      { input: ["a."], expected: true, description: 'Single character with punctuation', isHidden: true },
    ],
    optimalSolution: 'Two pointers converging from ends: O(N) time, O(1) space.',
    optimalTime: 'O(N)',
    optimalSpace: 'O(1)',
    editorial: {
      intuition: 'Instead of creating a new filtered string, place two pointers at the start and end of the string and advance them inwards while comparing characters.',
      bruteForce: 'Allocating a filtered reversed string takes O(N) auxiliary space.',
      optimalApproach: 'Use two pointers: \`left = 0\` and \`right = s.length - 1\`. While \`left < right\`, advance \`left\` past non-alphanumeric characters and decrement \`right\` past non-alphanumeric characters. Compare lowercased characters at \`left\` and \`right\`.',
      complexityAnalysis: 'Time: O(N) single scan. Space: O(1) auxiliary variables.',
      edgeCases: ['Empty string or symbols only ("., ").', 'Single letter ("a").', 'Alphanumerics with numbers and letters mixed ("0P").'],
    },
    idealSolutions: {
      javascript: `function isPalindrome(s) {
  let left = 0, right = s.length - 1;
  const isAlphaNum = (ch) => /[a-zA-Z0-9]/.test(ch);
  while (left < right) {
    while (left < right && !isAlphaNum(s[left])) left++;
    while (left < right && !isAlphaNum(s[right])) right--;
    if (s[left].toLowerCase() !== s[right].toLowerCase()) return false;
    left++;
    right--;
  }
  return true;
}`,
      typescript: `function isPalindrome(s: string): boolean {
  let left = 0, right = s.length - 1;
  const isAlphaNum = (ch: string) => /[a-zA-Z0-9]/.test(ch);
  while (left < right) {
    while (left < right && !isAlphaNum(s[left])) left++;
    while (left < right && !isAlphaNum(s[right])) right--;
    if (s[left].toLowerCase() !== s[right].toLowerCase()) return false;
    left++;
    right--;
  }
  return true;
}`,
      python: `def isPalindrome(s: str) -> bool:
    left, right = 0, len(s) - 1
    while left < right:
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1
        if s[left].lower() != s[right].lower():
            return False
        left += 1
        right -= 1
    return True`,
      java: `class Solution {
    public boolean isPalindrome(String s) {
        int left = 0, right = s.length() - 1;
        while (left < right) {
            while (left < right && !Character.isLetterOrDigit(s.charAt(left))) left++;
            while (left < right && !Character.isLetterOrDigit(s.charAt(right))) right--;
            if (Character.toLowerCase(s.charAt(left)) != Character.toLowerCase(s.charAt(right))) {
                return false;
            }
            left++;
            right--;
        }
        return true;
    }
}`,
      cpp: `#include <string>
#include <cctype>

class Solution {
public:
    bool isPalindrome(std::string s) {
        int left = 0, right = s.size() - 1;
        while (left < right) {
            while (left < right && !isalnum(s[left])) left++;
            while (left < right && !isalnum(s[right])) right--;
            if (tolower(s[left]) != tolower(s[right])) return false;
            left++;
            right--;
        }
        return true;
    }
};`,
      go: `package main

import "unicode"

func isPalindrome(s string) bool {
    runes := []rune(s)
    left, right := 0, len(runes)-1
    for left < right {
        for left < right && !unicode.IsLetter(runes[left]) && !unicode.IsDigit(runes[left]) {
            left++
        }
        for left < right && !unicode.IsLetter(runes[right]) && !unicode.IsDigit(runes[right]) {
            right--
        }
        if unicode.ToLower(runes[left]) != unicode.ToLower(runes[right]) {
            return false
        }
        left++
        right--
    }
    return true
}`,
    },
    hints: [
      'Can you solve this without allocating a new string by checking characters in place?',
      'Try placing two pointers: one at the beginning of the string, one at the end.',
      'Remember to skip non-alphanumeric characters and convert uppercase letters to lowercase before comparing.',
    ],
  },

  // 3. Best Time to Buy and Sell Stock (EASY - Sliding Window)
  {
    id: 'best-time-to-buy-and-sell-stock',
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'EASY',
    pattern: 'Sliding Window',
    entryPoint: 'maxProfit',
    description: `You are given an array \`prices\` where \`prices[i]\` is the price of a given stock on the \`i\`-th day.

You want to maximize your profit by choosing a **single day** to buy one stock and choosing a **different day in the future** to sell that stock.

Return *the maximum profit you can achieve from this transaction*. If you cannot achieve any profit, return \`0\`.

### Example 1:
\`\`\`text
Input: prices = [7,1,5,3,6,4]
Output: 5
Explanation: Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.
\`\`\`

### Example 2:
\`\`\`text
Input: prices = [7,6,4,3,1]
Output: 0
\`\`\`

### Constraints:
- \`1 <= prices.length <= 10^5\`
- \`0 <= prices[i] <= 10^4\``,
    starterCode: {
      javascript: `function maxProfit(prices) {
  // Write your optimal solution here
  return 0;
}`,
      typescript: `function maxProfit(prices: number[]): number {
  // Write your optimal solution here
  return 0;
}`,
      python: `def maxProfit(prices: list[int]) -> int:
    # Write your optimal solution here
    return 0`,
      java: `class Solution {
    public int maxProfit(int[] prices) {
        // Write your optimal solution here
        return 0;
    }
}`,
      cpp: `#include <vector>
#include <algorithm>

class Solution {
public:
    int maxProfit(std::vector<int>& prices) {
        // Write your optimal solution here
        return 0;
    }
};`,
      go: `package main

func maxProfit(prices []int) int {
    // Write your optimal solution here
    return 0
}`,
    },
    testCases: [
      { input: [[7, 1, 5, 3, 6, 4]], expected: 5, description: 'Standard fluctuating price trend' },
      { input: [[7, 6, 4, 3, 1]], expected: 0, description: 'Monotonically decreasing prices' },
      { input: [[1, 2]], expected: 1, description: 'Two elements increasing' },
      { input: [[2, 4, 1]], expected: 2, description: 'Minimum price at the end', isHidden: true },
    ],
    optimalSolution: 'One-pass dynamic tracking of minimum price and max profit: O(N) time, O(1) space.',
    optimalTime: 'O(N)',
    optimalSpace: 'O(1)',
    editorial: {
      intuition: 'To maximize profit, on any day i, you want to sell having bought at the minimum price encountered prior to day i.',
      bruteForce: 'Examining every pair takes O(N^2) time.',
      optimalApproach: 'Maintain \`minPrice = Infinity\` and \`maxProfit = 0\`. Iterate through prices: update \`minPrice = min(minPrice, price)\` and \`maxProfit = max(maxProfit, price - minPrice)\`.',
      complexityAnalysis: 'Time: O(N) single linear pass. Space: O(1) constant variables.',
      edgeCases: ['Array of length 1.', 'Strictly decreasing prices.'],
    },
    idealSolutions: {
      javascript: `function maxProfit(prices) {
  let minPrice = Infinity, maxProfit = 0;
  for (const price of prices) {
    if (price < minPrice) minPrice = price;
    else maxProfit = Math.max(maxProfit, price - minPrice);
  }
  return maxProfit;
}`,
      typescript: `function maxProfit(prices: number[]): number {
  let minPrice = Infinity, maxProfit = 0;
  for (const price of prices) {
    if (price < minPrice) minPrice = price;
    else maxProfit = Math.max(maxProfit, price - minPrice);
  }
  return maxProfit;
}`,
      python: `def maxProfit(prices: list[int]) -> int:
    min_price = float('inf')
    max_profit = 0
    for price in prices:
        if price < min_price:
            min_price = price
        else:
            max_profit = max(max_profit, price - min_price)
    return max_profit`,
      java: `class Solution {
    public int maxProfit(int[] prices) {
        int minPrice = Integer.MAX_VALUE, maxProfit = 0;
        for (int price : prices) {
            if (price < minPrice) minPrice = price;
            else maxProfit = Math.max(maxProfit, price - minPrice);
        }
        return maxProfit;
    }
}`,
      cpp: `#include <vector>
#include <algorithm>
#include <climits>

class Solution {
public:
    int maxProfit(std::vector<int>& prices) {
        int minPrice = INT_MAX, maxProfit = 0;
        for (int price : prices) {
            if (price < minPrice) minPrice = price;
            else maxProfit = std::max(maxProfit, price - minPrice);
        }
        return maxProfit;
    }
};`,
      go: `package main

func maxProfit(prices []int) int {
    minPrice := int(^uint(0) >> 1)
    maxProfit := 0
    for _, price := range prices {
        if price < minPrice {
            minPrice = price
        } else if price-minPrice > maxProfit {
            maxProfit = price - minPrice
        }
    }
    return maxProfit
}`,
    },
    hints: [
      'If you were to sell today, which day would have been the best day to buy?',
      'Track the minimum price seen so far as you iterate through the list.',
      'At each day, the potential profit is current_price - min_price. Update your overall max profit accordingly.',
    ],
  },

  // 4. Valid Parentheses (EASY - Stack)
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'EASY',
    pattern: 'Stack',
    entryPoint: 'isValid',
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.

### Example 1:
\`\`\`text
Input: s = "()"
Output: true
\`\`\`

### Example 2:
\`\`\`text
Input: s = "()[]{}"
Output: true
\`\`\`

### Example 3:
\`\`\`text
Input: s = "(]"
Output: false
\`\`\`

### Constraints:
- \`1 <= s.length <= 10^4\`
- \`s\` consists of parentheses only \`'()[]{}'\`.`,
    starterCode: {
      javascript: `function isValid(s) {
  // Write your optimal solution here
  return true;
}`,
      typescript: `function isValid(s: string): boolean {
  // Write your optimal solution here
  return true;
}`,
      python: `def isValid(s: str) -> bool:
    # Write your optimal solution here
    return True`,
      java: `class Solution {
    public boolean isValid(String s) {
        // Write your optimal solution here
        return true;
    }
}`,
      cpp: `#include <string>
#include <stack>

class Solution {
public:
    bool isValid(std::string s) {
        // Write your optimal solution here
        return true;
    }
};`,
      go: `package main

func isValid(s string) bool {
    // Write your optimal solution here
    return true
}`,
    },
    testCases: [
      { input: ["()"], expected: true, description: 'Simple single pair' },
      { input: ["()[]{}"], expected: true, description: 'Multiple adjacent balanced pairs' },
      { input: ["(]"], expected: false, description: 'Mismatched closing bracket' },
      { input: ["([)]"], expected: false, description: 'Interleaved invalid order' },
      { input: ["{[]}"], expected: true, description: 'Nested valid brackets' },
      { input: ["]"], expected: false, description: 'Single closing bracket without open', isHidden: true },
    ],
    optimalSolution: 'LIFO Stack with bracket matching lookup: O(N) time, O(N) space.',
    optimalTime: 'O(N)',
    optimalSpace: 'O(N)',
    editorial: {
      intuition: 'Brackets must close in reverse chronological order: the most recently opened bracket must be the first one to close. A Stack (LIFO) is the ideal data structure.',
      bruteForce: 'Repeated string replacement takes O(N^2) time.',
      optimalApproach: 'Iterate through characters. Push opening brackets to stack. For closing brackets, pop and verify matching opening bracket.',
      complexityAnalysis: 'Time: O(N). Space: O(N) for stack.',
      edgeCases: ['Starts with closing bracket.', 'Odd string length.', 'Unclosed opening brackets remaining.'],
    },
    idealSolutions: {
      javascript: `function isValid(s) {
  if (s.length % 2 !== 0) return false;
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (const char of s) {
    if (map[char]) {
      if (stack.pop() !== map[char]) return false;
    } else {
      stack.push(char);
    }
  }
  return stack.length === 0;
}`,
      typescript: `function isValid(s: string): boolean {
  if (s.length % 2 !== 0) return false;
  const stack: string[] = [];
  const map: Record<string, string> = { ')': '(', '}': '{', ']': '[' };
  for (const char of s) {
    if (map[char]) {
      if (stack.pop() !== map[char]) return false;
    } else {
      stack.push(char);
    }
  }
  return stack.length === 0;
}`,
      python: `def isValid(s: str) -> bool:
    if len(s) % 2 != 0:
        return False
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    for char in s:
        if char in mapping:
            top_element = stack.pop() if stack else '#'
            if mapping[char] != top_element:
                return False
        else:
            stack.append(char)
    return not stack`,
      java: `import java.util.Stack;

class Solution {
    public boolean isValid(String s) {
        if (s.length() % 2 != 0) return false;
        Stack<Character> stack = new Stack<>();
        for (char c : s.toCharArray()) {
            if (c == '(') stack.push(')');
            else if (c == '{') stack.push('}');
            else if (c == '[') stack.push(']');
            else if (stack.isEmpty() || stack.pop() != c) return false;
        }
        return stack.isEmpty();
    }
}`,
      cpp: `#include <string>
#include <stack>
#include <unordered_map>

class Solution {
public:
    bool isValid(std::string s) {
        if (s.size() % 2 != 0) return false;
        std::stack<char> st;
        std::unordered_map<char, char> map = {{')', '('}, {'}', '{'}, {']', '['}};
        for (char c : s) {
            if (map.count(c)) {
                if (st.empty() || st.top() != map[c]) return false;
                st.pop();
            } else {
                st.push(c);
            }
        }
        return st.empty();
    }
};`,
      go: `package main

func isValid(s string) bool {
    if len(s)%2 != 0 {
        return false
    }
    stack := []rune{}
    match := map[rune]rune{')': '(', '}': '{', ']': '['}
    for _, ch := range s {
        if open, exists := match[ch]; exists {
            if len(stack) == 0 || stack[len(stack)-1] != open {
                return false
            }
            stack = stack[:len(stack)-1]
        } else {
            stack = append(stack, ch)
        }
    }
    return len(stack) == 0
}`,
    },
    hints: [
      'What data structure allows you to inspect the most recently added open bracket?',
      'If you encounter a closing bracket, what should be at the top of the stack?',
      'Consider what happens if the string is empty, starts with a closing bracket, or has leftover open brackets.',
    ],
  },

  // 5. Maximum Subarray (MEDIUM - Dynamic Programming)
  {
    id: 'maximum-subarray',
    title: 'Maximum Subarray',
    difficulty: 'MEDIUM',
    pattern: 'Dynamic Programming',
    entryPoint: 'maxSubArray',
    description: `Given an integer array \`nums\`, find the subarray with the largest sum, and return *its sum*.

### Example 1:
\`\`\`text
Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
Output: 6
Explanation: The subarray [4,-1,2,1] has the largest sum 6.
\`\`\`

### Example 2:
\`\`\`text
Input: nums = [1]
Output: 1
\`\`\`

### Example 3:
\`\`\`text
Input: nums = [5,4,-1,7,8]
Output: 23
\`\`\`

### Constraints:
- \`1 <= nums.length <= 10^5\`
- \`-10^4 <= nums[i] <= 10^4\``,
    starterCode: {
      javascript: `function maxSubArray(nums) {
  // Write your optimal solution here
  return nums[0];
}`,
      typescript: `function maxSubArray(nums: number[]): number {
  // Write your optimal solution here
  return nums[0];
}`,
      python: `def maxSubArray(nums: list[int]) -> int:
    # Write your optimal solution here
    return nums[0]`,
      java: `class Solution {
    public int maxSubArray(int[] nums) {
        // Write your optimal solution here
        return nums[0];
    }
}`,
      cpp: `#include <vector>
#include <algorithm>

class Solution {
public:
    int maxSubArray(std::vector<int>& nums) {
        // Write your optimal solution here
        return nums[0];
    }
};`,
      go: `package main

func maxSubArray(nums []int) int {
    // Write your optimal solution here
    return nums[0]
}`,
    },
    testCases: [
      { input: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6, description: 'Standard mixed positive & negative array' },
      { input: [[1]], expected: 1, description: 'Single element array' },
      { input: [[5, 4, -1, 7, 8]], expected: 23, description: 'Predominantly positive array' },
      { input: [[-1, -2, -3]], expected: -1, description: 'All negative numbers', isHidden: true },
    ],
    optimalSolution: "Kadane's Algorithm: O(N) time, O(1) space.",
    optimalTime: 'O(N)',
    optimalSpace: 'O(1)',
    editorial: {
      intuition: 'If the running sum of a subarray drops below zero, adding it to subsequent elements will only reduce their total sum. Thus, reset the running sum whenever it turns negative.',
      bruteForce: 'Checking all subarrays takes O(N^2) time.',
      optimalApproach: 'Set \`maxSum = nums[0]\` and \`currentSum = 0\`. For each num: \`currentSum = max(num, currentSum + num)\`, \`maxSum = max(maxSum, currentSum)\`.',
      complexityAnalysis: 'Time: O(N). Space: O(1).',
      edgeCases: ['All negative numbers array.'],
    },
    idealSolutions: {
      javascript: `function maxSubArray(nums) {
  let maxSum = nums[0], currentSum = 0;
  for (const num of nums) {
    currentSum = Math.max(num, currentSum + num);
    maxSum = Math.max(maxSum, currentSum);
  }
  return maxSum;
}`,
      typescript: `function maxSubArray(nums: number[]): number {
  let maxSum = nums[0], currentSum = 0;
  for (const num of nums) {
    currentSum = Math.max(num, currentSum + num);
    maxSum = Math.max(maxSum, currentSum);
  }
  return maxSum;
}`,
      python: `def maxSubArray(nums: list[int]) -> int:
    max_sum = nums[0]
    current_sum = 0
    for num in nums:
        current_sum = max(num, current_sum + num)
        max_sum = max(max_sum, current_sum)
    return max_sum`,
      java: `class Solution {
    public int maxSubArray(int[] nums) {
        int maxSum = nums[0], currentSum = 0;
        for (int num : nums) {
            currentSum = Math.max(num, currentSum + num);
            maxSum = Math.max(maxSum, currentSum);
        }
        return maxSum;
    }
}`,
      cpp: `#include <vector>
#include <algorithm>

class Solution {
public:
    int maxSubArray(std::vector<int>& nums) {
        int maxSum = nums[0], currentSum = 0;
        for (int num : nums) {
            currentSum = std::max(num, currentSum + num);
            maxSum = std::max(maxSum, currentSum);
        }
        return maxSum;
    }
};`,
      go: `package main

func maxSubArray(nums []int) int {
    maxSum := nums[0]
    currentSum := 0
    for _, num := range nums {
        if currentSum+num > num {
            currentSum += num
        } else {
            currentSum = num
        }
        if currentSum > maxSum {
            maxSum = currentSum
        }
    }
    return maxSum
}`,
    },
    hints: [
      'If the sum of your prefix is negative, does extending it help any future subarray?',
      'Can you decide at each index whether to extend the existing subarray or start fresh with the current number?',
    ],
  },

  // 6. Longest Substring Without Repeating Characters (MEDIUM - Sliding Window)
  {
    id: 'longest-substring-without-repeating-characters',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'MEDIUM',
    pattern: 'Sliding Window',
    entryPoint: 'lengthOfLongestSubstring',
    description: `Given a string \`s\`, find the length of the **longest substring** without duplicate characters.

### Example 1:
\`\`\`text
Input: s = "abcabcbb"
Output: 3
Explanation: The answer is "abc", with the length of 3.
\`\`\`

### Example 2:
\`\`\`text
Input: s = "bbbbb"
Output: 1
Explanation: The answer is "b", with the length of 1.
\`\`\`

### Constraints:
- \`0 <= s.length <= 5 * 10^4\`
- \`s\` consists of English letters, digits, symbols and spaces.`,
    starterCode: {
      javascript: `function lengthOfLongestSubstring(s) {
  // Write your optimal solution here
  return 0;
}`,
      typescript: `function lengthOfLongestSubstring(s: string): number {
  // Write your optimal solution here
  return 0;
}`,
      python: `def lengthOfLongestSubstring(s: str) -> int:
    # Write your optimal solution here
    return 0`,
      java: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        // Write your optimal solution here
        return 0;
    }
}`,
      cpp: `#include <string>
#include <unordered_map>
#include <algorithm>

class Solution {
public:
    int lengthOfLongestSubstring(std::string s) {
        // Write your optimal solution here
        return 0;
    }
};`,
      go: `package main

func lengthOfLongestSubstring(s string) int {
    // Write your optimal solution here
    return 0
}`,
    },
    testCases: [
      { input: ["abcabcbb"], expected: 3, description: 'Standard repeating pattern' },
      { input: ["bbbbb"], expected: 1, description: 'All identical characters' },
      { input: ["pwwkew"], expected: 3, description: 'Repeating character in middle' },
      { input: [""], expected: 0, description: 'Empty string boundary', isHidden: true },
      { input: ["abba"], expected: 2, description: 'Tricky pointer jump edge case', isHidden: true },
    ],
    optimalSolution: 'Sliding window with hash map storing last seen index: O(N) time, O(min(N, M)) space.',
    optimalTime: 'O(N)',
    optimalSpace: 'O(min(N, M))',
    editorial: {
      intuition: 'Maintain a window \`[left, right]\` containing unique characters. Jump \`left\` past the duplicate when seen.',
      bruteForce: 'Checking all substrings takes O(N^3) time.',
      optimalApproach: 'Use a hash map mapping each character to its most recent index. If \`s[right]\` was seen at \`idx >= left\`, update \`left = idx + 1\`. Track \`maxLength = max(maxLength, right - left + 1)\`.',
      complexityAnalysis: 'Time: O(N). Space: O(min(N, M)).',
      edgeCases: ['Empty string "" -> 0.', 'All unique chars.', 'Back-to-back duplicates like "abba".'],
    },
    idealSolutions: {
      javascript: `function lengthOfLongestSubstring(s) {
  const lastSeen = new Map();
  let left = 0, maxLen = 0;
  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    if (lastSeen.has(char) && lastSeen.get(char) >= left) {
      left = lastSeen.get(char) + 1;
    }
    lastSeen.set(char, right);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`,
      typescript: `function lengthOfLongestSubstring(s: string): number {
  const lastSeen = new Map<string, number>();
  let left = 0, maxLen = 0;
  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    if (lastSeen.has(char) && lastSeen.get(char)! >= left) {
      left = lastSeen.get(char)! + 1;
    }
    lastSeen.set(char, right);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`,
      python: `def lengthOfLongestSubstring(s: str) -> int:
    last_seen = {}
    left = 0
    max_len = 0
    for right, char in enumerate(s):
        if char in last_seen and last_seen[char] >= left:
            left = last_seen[char] + 1
        last_seen[char] = right
        max_len = max(max_len, right - left + 1)
    return max_len`,
      java: `import java.util.HashMap;
import java.util.Map;

class Solution {
    public int lengthOfLongestSubstring(String s) {
        Map<Character, Integer> lastSeen = new HashMap<>();
        int left = 0, maxLen = 0;
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            if (lastSeen.containsKey(c) && lastSeen.get(c) >= left) {
                left = lastSeen.get(c) + 1;
            }
            lastSeen.put(c, right);
            maxLen = Math.max(maxLen, right - left + 1);
        }
        return maxLen;
    }
}`,
      cpp: `#include <string>
#include <unordered_map>
#include <algorithm>

class Solution {
public:
    int lengthOfLongestSubstring(std::string s) {
        std::unordered_map<char, int> lastSeen;
        int left = 0, maxLen = 0;
        for (int right = 0; right < s.size(); right++) {
            char c = s[right];
            if (lastSeen.count(c) && lastSeen[c] >= left) {
                left = lastSeen[c] + 1;
            }
            lastSeen[c] = right;
            maxLen = std::max(maxLen, right - left + 1);
        }
        return maxLen;
    }
};`,
      go: `package main

func lengthOfLongestSubstring(s string) int {
    lastSeen := make(map[rune]int)
    left, maxLen := 0, 0
    for right, ch := range s {
        if idx, exists := lastSeen[ch]; exists && idx >= left {
            left = idx + 1
        }
        lastSeen[ch] = right
        currLen := right - left + 1
        if currLen > maxLen {
            maxLen = currLen
        }
    }
    return maxLen
}`,
    },
    hints: [
      'Maintain a sliding window of unique characters.',
      'Store each character and its most recent index in a map.',
      'Make sure the left pointer never moves backwards!',
    ],
  },

  // 7. Container With Most Water (MEDIUM - Two Pointers)
  {
    id: 'container-with-most-water',
    title: 'Container With Most Water',
    difficulty: 'MEDIUM',
    pattern: 'Two Pointers',
    entryPoint: 'maxArea',
    description: `You are given an integer array \`height\` of length \`n\`. There are \`n\` vertical lines drawn such that the two endpoints of the \`i\`-th line are \`(i, 0)\` and \`(i, height[i])\`.

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return *the maximum amount of water a container can store*.

### Example 1:
\`\`\`text
Input: height = [1,8,6,2,5,4,8,3,7]
Output: 49
\`\`\`

### Example 2:
\`\`\`text
Input: height = [1,1]
Output: 1
\`\`\`

### Constraints:
- \`n == height.length\`
- \`2 <= n <= 10^5\`
- \`0 <= height[i] <= 10^4\``,
    starterCode: {
      javascript: `function maxArea(height) {
  // Write your optimal solution here
  return 0;
}`,
      typescript: `function maxArea(height: number[]): number {
  // Write your optimal solution here
  return 0;
}`,
      python: `def maxArea(height: list[int]) -> int:
    # Write your optimal solution here
    return 0`,
      java: `class Solution {
    public int maxArea(int[] height) {
        // Write your optimal solution here
        return 0;
    }
}`,
      cpp: `#include <vector>
#include <algorithm>

class Solution {
public:
    int maxArea(std::vector<int>& height) {
        // Write your optimal solution here
        return 0;
    }
};`,
      go: `package main

func maxArea(height []int) int {
    // Write your optimal solution here
    return 0
}`,
    },
    testCases: [
      { input: [[1, 8, 6, 2, 5, 4, 8, 3, 7]], expected: 49, description: 'Standard varying heights' },
      { input: [[1, 1]], expected: 1, description: 'Minimum length array' },
      { input: [[4, 3, 2, 1, 4]], expected: 16, description: 'Symmetric tall boundaries' },
    ],
    optimalSolution: 'Two pointers converging from ends, moving shorter line inwards: O(N) time, O(1) space.',
    optimalTime: 'O(N)',
    optimalSpace: 'O(1)',
    editorial: {
      intuition: 'Area is width * min(height[left], height[right]). Moving the taller pointer inwards can only decrease width without increasing height bottleneck. Always move the shorter pointer inwards.',
      bruteForce: 'Checking all pairs takes O(N^2) time.',
      optimalApproach: 'Set \`left = 0, right = N - 1\`. Track max area. If \`height[left] < height[right]\` increment left, else decrement right.',
      complexityAnalysis: 'Time: O(N). Space: O(1).',
      edgeCases: ['All heights equal.', 'Two elements.'],
    },
    idealSolutions: {
      javascript: `function maxArea(height) {
  let left = 0, right = height.length - 1, maxWater = 0;
  while (left < right) {
    const width = right - left;
    const h = Math.min(height[left], height[right]);
    maxWater = Math.max(maxWater, width * h);
    if (height[left] < height[right]) left++;
    else right--;
  }
  return maxWater;
}`,
      typescript: `function maxArea(height: number[]): number {
  let left = 0, right = height.length - 1, maxWater = 0;
  while (left < right) {
    const width = right - left;
    const h = Math.min(height[left], height[right]);
    maxWater = Math.max(maxWater, width * h);
    if (height[left] < height[right]) left++;
    else right--;
  }
  return maxWater;
}`,
      python: `def maxArea(height: list[int]) -> int:
    left, right = 0, len(height) - 1
    max_water = 0
    while left < right:
        width = right - left
        h = min(height[left], height[right])
        max_water = max(max_water, width * h)
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    return max_water`,
      java: `class Solution {
    public int maxArea(int[] height) {
        int left = 0, right = height.length - 1;
        int maxWater = 0;
        while (left < right) {
            int width = right - left;
            int h = Math.min(height[left], height[right]);
            maxWater = Math.max(maxWater, width * h);
            if (height[left] < height[right]) left++;
            else right--;
        }
        return maxWater;
    }
}`,
      cpp: `#include <vector>
#include <algorithm>

class Solution {
public:
    int maxArea(std::vector<int>& height) {
        int left = 0, right = height.size() - 1;
        int maxWater = 0;
        while (left < right) {
            int width = right - left;
            int h = std::min(height[left], height[right]);
            maxWater = std::max(maxWater, width * h);
            if (height[left] < height[right]) left++;
            else right--;
        }
        return maxWater;
    }
};`,
      go: `package main

func maxArea(height []int) int {
    left, right := 0, len(height)-1
    maxWater := 0
    for left < right {
        width := right - left
        h := height[left]
        if height[right] < h {
            h = height[right]
        }
        if width*h > maxWater {
            maxWater = width * h
        }
        if height[left] < height[right] {
            left++
        } else {
            right--
        }
    }
    return maxWater
}`,
    },
    hints: [
      'Start with the widest container (left = 0, right = n-1). Which line limits the water capacity?',
      'If you move the taller line inwards, capacity can never increase.',
    ],
  },

  // 8. 3Sum (MEDIUM - Two Pointers)
  {
    id: 'three-sum',
    title: '3Sum',
    difficulty: 'MEDIUM',
    pattern: 'Two Pointers',
    entryPoint: 'threeSum',
    description: `Given an integer array nums, return all the triplets \`[nums[i], nums[j], nums[k]]\` such that \`i != j\`, \`i != k\`, and \`j != k\`, and \`nums[i] + nums[j] + nums[k] == 0\`.

Notice that the solution set must not contain duplicate triplets.

### Example 1:
\`\`\`text
Input: nums = [-1,0,1,2,-1,-4]
Output: [[-1,-1,2],[-1,0,1]]
\`\`\`

### Example 2:
\`\`\`text
Input: nums = [0,1,1]
Output: []
\`\`\`

### Example 3:
\`\`\`text
Input: nums = [0,0,0]
Output: [[0,0,0]]
\`\`\`

### Constraints:
- \`3 <= nums.length <= 3000\`
- \`-10^5 <= nums[i] <= 10^5\``,
    starterCode: {
      javascript: `function threeSum(nums) {
  // Write your optimal solution here
  return [];
}`,
      typescript: `function threeSum(nums: number[]): number[][] {
  // Write your optimal solution here
  return [];
}`,
      python: `def threeSum(nums: list[int]) -> list[list[int]]:
    # Write your optimal solution here
    return []`,
      java: `import java.util.*;

class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        // Write your optimal solution here
        return new ArrayList<>();
    }
}`,
      cpp: `#include <vector>

class Solution {
public:
    std::vector<std::vector<int>> threeSum(std::vector<int>& nums) {
        // Write your optimal solution here
        return {};
    }
};`,
      go: `package main

func threeSum(nums []int) [][]int {
    // Write your optimal solution here
    return nil
}`,
    },
    testCases: [
      { input: [[-1, 0, 1, 2, -1, -4]], expected: [[-1, -1, 2], [-1, 0, 1]], description: 'Multiple triplets with duplicates' },
      { input: [[0, 1, 1]], expected: [], description: 'No triplets summing to zero' },
      { input: [[0, 0, 0]], expected: [[0, 0, 0]], description: 'All zeros triplet' },
    ],
    optimalSolution: 'Sort array then use Two Pointers with duplicate skipping: O(N^2) time, O(1) space.',
    optimalTime: 'O(N^2)',
    optimalSpace: 'O(1)',
    editorial: {
      intuition: 'Sorting makes deduplication easy and allows Two Pointers to find pairs that sum to -nums[i].',
      bruteForce: 'Checking all triplets takes O(N^3) time.',
      optimalApproach: 'Sort nums. Iterate i from 0 to N-3. Skip duplicates for i. Use two pointers left = i + 1, right = N - 1. If sum is 0, add triplet and skip duplicates for left and right.',
      complexityAnalysis: 'Time: O(N^2). Space: O(1) auxiliary.',
      edgeCases: ['All zeros [0, 0, 0].', 'No possible triplet.', 'Heavy duplicate values.'],
    },
    idealSolutions: {
      javascript: `function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (nums[i] > 0) break;
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let left = i + 1, right = nums.length - 1;
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]]);
        while (left < right && nums[left] === nums[left + 1]) left++;
        while (left < right && nums[right] === nums[right - 1]) right--;
        left++;
        right--;
      } else if (sum < 0) left++;
      else right--;
    }
  }
  return result;
}`,
      typescript: `function threeSum(nums: number[]): number[][] {
  nums.sort((a, b) => a - b);
  const result: number[][] = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (nums[i] > 0) break;
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let left = i + 1, right = nums.length - 1;
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]]);
        while (left < right && nums[left] === nums[left + 1]) left++;
        while (left < right && nums[right] === nums[right - 1]) right--;
        left++;
        right--;
      } else if (sum < 0) left++;
      else right--;
    }
  }
  return result;
}`,
      python: `def threeSum(nums: list[int]) -> list[list[int]]:
    nums.sort()
    result = []
    for i in range(len(nums) - 2):
        if nums[i] > 0:
            break
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        left, right = i + 1, len(nums) - 1
        while left < right:
            total = nums[i] + nums[left] + nums[right]
            if total == 0:
                result.append([nums[i], nums[left], nums[right]])
                while left < right and nums[left] == nums[left + 1]:
                    left += 1
                while left < right and nums[right] == nums[right - 1]:
                    right -= 1
                left += 1
                right -= 1
            elif total < 0:
                left += 1
            else:
                right -= 1
    return result`,
      java: `import java.util.*;

class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> result = new ArrayList<>();
        for (int i = 0; i < nums.length - 2; i++) {
            if (nums[i] > 0) break;
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            int left = i + 1, right = nums.length - 1;
            while (left < right) {
                int sum = nums[i] + nums[left] + nums[right];
                if (sum == 0) {
                    result.add(Arrays.asList(nums[i], nums[left], nums[right]));
                    while (left < right && nums[left] == nums[left + 1]) left++;
                    while (left < right && nums[right] == nums[right - 1]) right--;
                    left++;
                    right--;
                } else if (sum < 0) left++;
                else right--;
            }
        }
        return result;
    }
}`,
      cpp: `#include <vector>
#include <algorithm>

class Solution {
public:
    std::vector<std::vector<int>> threeSum(std::vector<int>& nums) {
        std::sort(nums.begin(), nums.end());
        std::vector<std::vector<int>> result;
        for (int i = 0; i < (int)nums.size() - 2; i++) {
            if (nums[i] > 0) break;
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            int left = i + 1, right = nums.size() - 1;
            while (left < right) {
                int sum = nums[i] + nums[left] + nums[right];
                if (sum == 0) {
                    result.push_back({nums[i], nums[left], nums[right]});
                    while (left < right && nums[left] == nums[left + 1]) left++;
                    while (left < right && nums[right] == nums[right - 1]) right--;
                    left++;
                    right--;
                } else if (sum < 0) left++;
                else right--;
            }
        }
        return result;
    }
};`,
      go: `package main

import "sort"

func threeSum(nums []int) [][]int {
    sort.Ints(nums)
    result := [][]int{}
    for i := 0; i < len(nums)-2; i++ {
        if nums[i] > 0 {
            break
        }
        if i > 0 && nums[i] == nums[i-1] {
            continue
        }
        left, right := i+1, len(nums)-1
        for left < right {
            sum := nums[i] + nums[left] + nums[right]
            if sum == 0 {
                result = append(result, []int{nums[i], nums[left], nums[right]})
                for left < right && nums[left] == nums[left+1] {
                    left++
                }
                for left < right && nums[right] == nums[right-1] {
                    right--
                }
                left++
                right--
            } else if sum < 0 {
                left++
            } else {
                right--
            }
        }
    }
    return result
}`,
    },
    hints: [
      'Sort the array first. How does sorting reduce the search space?',
      'Fix the first element, then use Two Pointers to find the remaining pair.',
      'Remember to skip duplicates for all three pointers to ensure unique triplets.',
    ],
  },

  // 9. Coin Change (MEDIUM - Dynamic Programming)
  {
    id: 'coin-change',
    title: 'Coin Change',
    difficulty: 'MEDIUM',
    pattern: 'Dynamic Programming',
    entryPoint: 'coinChange',
    description: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.

Return *the fewest number of coins that you need to make up that amount*. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.

You may assume that you have an infinite number of each kind of coin.

### Example 1:
\`\`\`text
Input: coins = [1,2,5], amount = 11
Output: 3
Explanation: 11 = 5 + 5 + 1
\`\`\`

### Constraints:
- \`1 <= coins.length <= 12\`
- \`0 <= amount <= 10^4\``,
    starterCode: {
      javascript: `function coinChange(coins, amount) {
  // Write your optimal solution here
  return -1;
}`,
      typescript: `function coinChange(coins: number[], amount: number): number {
  // Write your optimal solution here
  return -1;
}`,
      python: `def coinChange(coins: list[int], amount: int) -> int:
    # Write your optimal solution here
    return -1`,
      java: `class Solution {
    public int coinChange(int[] coins, int amount) {
        // Write your optimal solution here
        return -1;
    }
}`,
      cpp: `#include <vector>

class Solution {
public:
    int coinChange(std::vector<int>& coins, int amount) {
        // Write your optimal solution here
        return -1;
    }
};`,
      go: `package main

func coinChange(coins []int, amount int) int {
    // Write your optimal solution here
    return -1
}`,
    },
    testCases: [
      { input: [[1, 2, 5], 11], expected: 3, description: 'Standard denomination combination' },
      { input: [[2], 3], expected: -1, description: 'Impossible amount' },
      { input: [[1], 0], expected: 0, description: 'Zero target amount base case' },
    ],
    optimalSolution: 'Bottom-up 1D Dynamic Programming: O(amount * N) time, O(amount) space.',
    optimalTime: 'O(amount * N)',
    optimalSpace: 'O(amount)',
    editorial: {
      intuition: 'Greedy fails for coins like [1, 3, 4, 5] and amount 7. DP solves this by finding the minimum coins for every value from 1 to amount.',
      bruteForce: 'Recursive tree takes exponential time O(N^amount).',
      optimalApproach: 'Initialize dp array of size amount + 1 with Infinity. dp[0] = 0. For i from 1 to amount: for coin in coins: if i - coin >= 0: dp[i] = min(dp[i], dp[i-coin] + 1).',
      complexityAnalysis: 'Time: O(amount * N). Space: O(amount).',
      edgeCases: ['Amount = 0 returns 0.', 'Coins larger than amount.', 'No valid coin combination.'],
    },
    idealSolutions: {
      javascript: `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (i - coin >= 0) dp[i] = Math.min(dp[i], dp[i - coin] + 1);
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
      typescript: `function coinChange(coins: number[], amount: number): number {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (i - coin >= 0) dp[i] = Math.min(dp[i], dp[i - coin] + 1);
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
      python: `def coinChange(coins: list[int], amount: int) -> int:
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for i in range(1, amount + 1):
        for coin in coins:
            if i - coin >= 0:
                dp[i] = min(dp[i], dp[i - coin] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1`,
      java: `import java.util.Arrays;

class Solution {
    public int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);
        dp[0] = 0;
        for (int i = 1; i <= amount; i++) {
            for (int coin : coins) {
                if (i - coin >= 0) dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
}`,
      cpp: `#include <vector>
#include <algorithm>

class Solution {
public:
    int coinChange(std::vector<int>& coins, int amount) {
        std::vector<int> dp(amount + 1, amount + 1);
        dp[0] = 0;
        for (int i = 1; i <= amount; i++) {
            for (int coin : coins) {
                if (i - coin >= 0) dp[i] = std::min(dp[i], dp[i - coin] + 1);
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
};`,
      go: `package main

func coinChange(coins []int, amount int) int {
    dp := make([]int, amount+1)
    for i := 1; i <= amount; i++ {
        dp[i] = amount + 1
    }
    dp[0] = 0
    for i := 1; i <= amount; i++ {
        for _, coin := range coins {
            if i-coin >= 0 && dp[i-coin]+1 < dp[i] {
                dp[i] = dp[i-coin] + 1
            }
        }
    }
    if dp[amount] > amount {
        return -1
    }
    return dp[amount]
}`,
    },
    hints: [
      'Express the answer for amount A in terms of subproblems: dp[A - coin] + 1.',
      'Initialize your dp array with a sentinel value representing unreachable amounts.',
    ],
  },

  // 10. Merge Intervals (MEDIUM - Intervals)
  {
    id: 'merge-intervals',
    title: 'Merge Intervals',
    difficulty: 'MEDIUM',
    pattern: 'Intervals',
    entryPoint: 'merge',
    description: `Given an array of \`intervals\` where \`intervals[i] = [start_i, end_i]\`, merge all overlapping intervals, and return *an array of the non-overlapping intervals that cover all the intervals in the input*.

### Example 1:
\`\`\`text
Input: intervals = [[1,3],[2,6],[8,10],[15,18]]
Output: [[1,6],[8,10],[15,18]]
Explanation: Since intervals [1,3] and [2,6] overlap, merge them into [1,6].
\`\`\`

### Constraints:
- \`1 <= intervals.length <= 10^4\`
- \`intervals[i].length == 2\``,
    starterCode: {
      javascript: `function merge(intervals) {
  // Write your optimal solution here
  return [];
}`,
      typescript: `function merge(intervals: number[][]): number[][] {
  // Write your optimal solution here
  return [];
}`,
      python: `def merge(intervals: list[list[int]]) -> list[list[int]]:
    # Write your optimal solution here
    return []`,
      java: `class Solution {
    public int[][] merge(int[][] intervals) {
        // Write your optimal solution here
        return new int[0][0];
    }
}`,
      cpp: `#include <vector>

class Solution {
public:
    std::vector<std::vector<int>> merge(std::vector<std::vector<int>>& intervals) {
        // Write your optimal solution here
        return {};
    }
};`,
      go: `package main

func merge(intervals [][]int) [][]int {
    // Write your optimal solution here
    return nil
}`,
    },
    testCases: [
      { input: [[[1, 3], [2, 6], [8, 10], [15, 18]]], expected: [[1, 6], [8, 10], [15, 18]], description: 'Standard overlapping intervals' },
      { input: [[[1, 4], [4, 5]]], expected: [[1, 5]], description: 'Adjacent touching intervals' },
    ],
    optimalSolution: 'Sort by start time, linear merge: O(N log N) time, O(N) space.',
    optimalTime: 'O(N log N)',
    optimalSpace: 'O(N)',
    editorial: {
      intuition: 'Sorting by start time ensures all potentially overlapping intervals are adjacent in the list.',
      bruteForce: 'Pairwise graph matching takes O(N^2) time.',
      optimalApproach: 'Sort intervals by start. Iterate through intervals: if current interval starts before previous ends, merge by updating end = max(end, curr.end). Otherwise, append as a new interval.',
      complexityAnalysis: 'Time: O(N log N). Space: O(N).',
      edgeCases: ['Touching endpoints [1, 4] and [4, 5] overlap.', 'Completely nested intervals [1, 10] and [2, 5].'],
    },
    idealSolutions: {
      javascript: `function merge(intervals) {
  if (intervals.length <= 1) return intervals;
  intervals.sort((a, b) => a[0] - b[0]);
  const merged = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const last = merged[merged.length - 1], curr = intervals[i];
    if (curr[0] <= last[1]) last[1] = Math.max(last[1], curr[1]);
    else merged.push(curr);
  }
  return merged;
}`,
      typescript: `function merge(intervals: number[][]): number[][] {
  if (intervals.length <= 1) return intervals;
  intervals.sort((a, b) => a[0] - b[0]);
  const merged: number[][] = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const last = merged[merged.length - 1], curr = intervals[i];
    if (curr[0] <= last[1]) last[1] = Math.max(last[1], curr[1]);
    else merged.push(curr);
  }
  return merged;
}`,
      python: `def merge(intervals: list[list[int]]) -> list[list[int]]:
    intervals.sort(key=lambda x: x[0])
    merged = []
    for interval in intervals:
        if not merged or merged[-1][1] < interval[0]:
            merged.append(interval)
        else:
            merged[-1][1] = max(merged[-1][1], interval[1])
    return merged`,
      java: `import java.util.*;

class Solution {
    public int[][] merge(int[][] intervals) {
        if (intervals.length <= 1) return intervals;
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
        List<int[]> merged = new ArrayList<>();
        int[] current = intervals[0];
        merged.add(current);
        for (int[] interval : intervals) {
            if (interval[0] <= current[1]) current[1] = Math.max(current[1], interval[1]);
            else {
                current = interval;
                merged.add(current);
            }
        }
        return merged.toArray(new int[merged.size()][]);
    }
}`,
      cpp: `#include <vector>
#include <algorithm>

class Solution {
public:
    std::vector<std::vector<int>> merge(std::vector<std::vector<int>>& intervals) {
        if (intervals.empty()) return {};
        std::sort(intervals.begin(), intervals.end());
        std::vector<std::vector<int>> merged;
        merged.push_back(intervals[0]);
        for (size_t i = 1; i < intervals.size(); i++) {
            if (intervals[i][0] <= merged.back()[1]) merged.back()[1] = std::max(merged.back()[1], intervals[i][1]);
            else merged.push_back(intervals[i]);
        }
        return merged;
    }
};`,
      go: `package main

import "sort"

func merge(intervals [][]int) [][]int {
    if len(intervals) <= 1 {
        return intervals
    }
    sort.Slice(intervals, func(i, j int) bool {
        return intervals[i][0] < intervals[j][0]
    })
    merged := [][]int{intervals[0]}
    for i := 1; i < len(intervals); i++ {
        last := merged[len(merged)-1]
        curr := intervals[i]
        if curr[0] <= last[1] {
            if curr[1] > last[1] {
                last[1] = curr[1]
            }
        } else {
            merged = append(merged, curr)
        }
    }
    return merged
}`,
    },
    hints: [
      'Sort intervals by start time first.',
      'Compare current start with last merged end.',
    ],
  },

  // 11. Reverse Linked List (EASY - Linked Lists)
  {
    id: 'reverse-linked-list',
    title: 'Reverse Linked List',
    difficulty: 'EASY',
    pattern: 'Linked Lists',
    entryPoint: 'reverseList',
    description: `Given the \`head\` of a singly linked list (represented as an array of values for evaluation), reverse the list, and return *the reversed list*.

### Example 1:
\`\`\`text
Input: head = [1,2,3,4,5]
Output: [5,4,3,2,1]
\`\`\`

### Constraints:
- \`0 <= head.length <= 5000\``,
    starterCode: {
      javascript: `function reverseList(head) {
  // Write your optimal solution here
  return head;
}`,
      typescript: `function reverseList(head: number[]): number[] {
  // Write your optimal solution here
  return head;
}`,
      python: `def reverseList(head: list[int]) -> list[int]:
    # Write your optimal solution here
    return head`,
      java: `class Solution {
    public int[] reverseList(int[] head) {
        // Write your optimal solution here
        return head;
    }
}`,
      cpp: `#include <vector>

class Solution {
public:
    std::vector<int> reverseList(std::vector<int>& head) {
        // Write your optimal solution here
        return head;
    }
};`,
      go: `package main

func reverseList(head []int) []int {
    // Write your optimal solution here
    return head
}`,
    },
    testCases: [
      { input: [[1, 2, 3, 4, 5]], expected: [5, 4, 3, 2, 1], description: 'Standard 5 element list' },
      { input: [[1, 2]], expected: [2, 1], description: 'Two element list' },
      { input: [[]], expected: [], description: 'Empty list edge case' },
    ],
    optimalSolution: 'Iterative 3-pointer reversal: O(N) time, O(1) space.',
    optimalTime: 'O(N)',
    optimalSpace: 'O(1)',
    editorial: {
      intuition: 'At each node, redirect current.next to prev, then advance pointers.',
      bruteForce: 'Copying to array and creating new nodes takes O(N) space.',
      optimalApproach: 'Iterate through nodes keeping track of prev, curr, next. Point curr.next to prev.',
      complexityAnalysis: 'Time: O(N). Space: O(1).',
      edgeCases: ['Empty list.', 'Single node.'],
    },
    idealSolutions: {
      javascript: `function reverseList(head) {
  const result = [];
  for (let i = head.length - 1; i >= 0; i--) result.push(head[i]);
  return result;
}`,
      typescript: `function reverseList(head: number[]): number[] {
  const result: number[] = [];
  for (let i = head.length - 1; i >= 0; i--) result.push(head[i]);
  return result;
}`,
      python: `def reverseList(head: list[int]) -> list[int]:
    return head[::-1]`,
      java: `class Solution {
    public int[] reverseList(int[] head) {
        int[] res = new int[head.length];
        for (int i = 0; i < head.length; i++) res[i] = head[head.length - 1 - i];
        return res;
    }
}`,
      cpp: `#include <vector>
#include <algorithm>

class Solution {
public:
    std::vector<int> reverseList(std::vector<int>& head) {
        std::vector<int> res = head;
        std::reverse(res.begin(), res.end());
        return res;
    }
};`,
      go: `package main

func reverseList(head []int) []int {
    res := make([]int, len(head))
    for i := 0; i < len(head); i++ {
        res[i] = head[len(head)-1-i]
    }
    return res
}`,
    },
    hints: [
      'Maintain prev, curr, and next pointers.',
      'Remember to save curr.next before changing the link!',
    ],
  },

  // 12. Search in Rotated Sorted Array (MEDIUM - Binary Search)
  {
    id: 'search-in-rotated-sorted-array',
    title: 'Search in Rotated Sorted Array',
    difficulty: 'MEDIUM',
    pattern: 'Binary Search',
    entryPoint: 'search',
    description: `There is an integer array \`nums\` sorted in ascending order (with distinct values) that is possibly rotated at an unknown pivot.

Given \`nums\` and integer \`target\`, return *the index of \`target\` if it is in \`nums\`, or \`-1\` if it is not*.

Runtime complexity must be \`O(log n)\`.

### Example 1:
\`\`\`text
Input: nums = [4,5,6,7,0,1,2], target = 0
Output: 4
\`\`\`

### Constraints:
- \`1 <= nums.length <= 5000\`
- All values of \`nums\` are unique.`,
    starterCode: {
      javascript: `function search(nums, target) {
  // Write your optimal solution here
  return -1;
}`,
      typescript: `function search(nums: number[], target: number): number {
  // Write your optimal solution here
  return -1;
}`,
      python: `def search(nums: list[int], target: int) -> int:
    # Write your optimal solution here
    return -1`,
      java: `class Solution {
    public int search(int[] nums, int target) {
        // Write your optimal solution here
        return -1;
    }
}`,
      cpp: `#include <vector>

class Solution {
public:
    int search(std::vector<int>& nums, int target) {
        // Write your optimal solution here
        return -1;
    }
};`,
      go: `package main

func search(nums []int, target int) int {
    // Write your optimal solution here
    return -1
}`,
    },
    testCases: [
      { input: [[4, 5, 6, 7, 0, 1, 2], 0], expected: 4, description: 'Target in right shifted section' },
      { input: [[4, 5, 6, 7, 0, 1, 2], 3], expected: -1, description: 'Target absent from array' },
      { input: [[1], 0], expected: -1, description: 'Single element mismatch' },
    ],
    optimalSolution: 'Modified Binary Search checking sorted half: O(log N) time, O(1) space.',
    optimalTime: 'O(log N)',
    optimalSpace: 'O(1)',
    editorial: {
      intuition: 'At any midpoint, at least one half of the array is guaranteed to be normally sorted.',
      bruteForce: 'Linear search takes O(N) time.',
      optimalApproach: 'Binary search: check if left half is sorted. If so, verify if target is within bounds; else check right half.',
      complexityAnalysis: 'Time: O(log N). Space: O(1).',
      edgeCases: ['Single element.', 'Array not rotated.'],
    },
    idealSolutions: {
      javascript: `function search(nums, target) {
  let left = 0, right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;
    if (nums[left] <= nums[mid]) {
      if (target >= nums[left] && target < nums[mid]) right = mid - 1;
      else left = mid + 1;
    } else {
      if (target > nums[mid] && target <= nums[right]) left = mid + 1;
      else right = mid - 1;
    }
  }
  return -1;
}`,
      typescript: `function search(nums: number[], target: number): number {
  let left = 0, right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;
    if (nums[left] <= nums[mid]) {
      if (target >= nums[left] && target < nums[mid]) right = mid - 1;
      else left = mid + 1;
    } else {
      if (target > nums[mid] && target <= nums[right]) left = mid + 1;
      else right = mid - 1;
    }
  }
  return -1;
}`,
      python: `def search(nums: list[int], target: int) -> int:
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        if nums[left] <= nums[mid]:
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        else:
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1
    return -1`,
      java: `class Solution {
    public int search(int[] nums, int target) {
        int left = 0, right = nums.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) return mid;
            if (nums[left] <= nums[mid]) {
                if (target >= nums[left] && target < nums[mid]) right = mid - 1;
                else left = mid + 1;
            } else {
                if (target > nums[mid] && target <= nums[right]) left = mid + 1;
                else right = mid - 1;
            }
        }
        return -1;
    }
}`,
      cpp: `#include <vector>

class Solution {
public:
    int search(std::vector<int>& nums, int target) {
        int left = 0, right = nums.size() - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) return mid;
            if (nums[left] <= nums[mid]) {
                if (target >= nums[left] && target < nums[mid]) right = mid - 1;
                else left = mid + 1;
            } else {
                if (target > nums[mid] && target <= nums[right]) left = mid + 1;
                else right = mid - 1;
            }
        }
        return -1;
    }
};`,
      go: `package main

func search(nums []int, target int) int {
    left, right := 0, len(nums)-1
    for left <= right {
        mid := left + (right-left)/2
        if nums[mid] == target {
            return mid
        }
        if nums[left] <= nums[mid] {
            if target >= nums[left] && target < nums[mid] {
                right = mid - 1
            } else {
                left = mid + 1
            }
        } else {
            if target > nums[mid] && target <= nums[right] {
                left = mid + 1
            } else {
                right = mid - 1
            }
        }
    }
    return -1
}`,
    },
    hints: [
      'At least one half is always sorted.',
      'Check if nums[left] <= nums[mid] to determine which half is sorted.',
    ],
  },

  // 13. Number of Islands (MEDIUM - Graphs / BFS / DFS)
  {
    id: 'number-of-islands',
    title: 'Number of Islands',
    difficulty: 'MEDIUM',
    pattern: 'Graphs',
    entryPoint: 'numIslands',
    description: `Given an \`m x n\` 2D binary grid \`grid\` representing \`'1'\`s (land) and \`'0'\`s (water), return *the number of islands*.

An island is formed by connecting adjacent lands horizontally or vertically.

### Example 1:
\`\`\`text
Input: grid = [
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
]
Output: 1
\`\`\`

### Constraints:
- \`1 <= m, n <= 300\``,
    starterCode: {
      javascript: `function numIslands(grid) {
  // Write your optimal solution here
  return 0;
}`,
      typescript: `function numIslands(grid: string[][]): number {
  // Write your optimal solution here
  return 0;
}`,
      python: `def numIslands(grid: list[list[str]]) -> int:
    # Write your optimal solution here
    return 0`,
      java: `class Solution {
    public int numIslands(char[][] grid) {
        // Write your optimal solution here
        return 0;
    }
}`,
      cpp: `#include <vector>

class Solution {
public:
    int numIslands(std::vector<std::vector<char>>& grid) {
        // Write your optimal solution here
        return 0;
    }
};`,
      go: `package main

func numIslands(grid [][]byte) int {
    // Write your optimal solution here
    return 0
}`,
    },
    testCases: [
      {
        input: [[
          ["1", "1", "1", "1", "0"],
          ["1", "1", "0", "1", "0"],
          ["1", "1", "0", "0", "0"],
          ["0", "0", "0", "0", "0"]
        ]],
        expected: 1,
        description: 'Single large connected island'
      },
      {
        input: [[
          ["1", "1", "0", "0", "0"],
          ["1", "1", "0", "0", "0"],
          ["0", "0", "1", "0", "0"],
          ["0", "0", "0", "1", "1"]
        ]],
        expected: 3,
        description: 'Three separate islands'
      },
    ],
    optimalSolution: 'DFS/BFS sink visited land: O(M * N) time, O(M * N) space.',
    optimalTime: 'O(M * N)',
    optimalSpace: 'O(M * N)',
    editorial: {
      intuition: 'Connected components problem on a grid. Sinking visited land cells prevents redundant traversal.',
      bruteForce: 'Without marking visited cells, search enters infinite loops.',
      optimalApproach: 'Iterate every cell. When "1" is encountered, increment count and DFS to sink all connected land cells to "0".',
      complexityAnalysis: 'Time: O(M * N). Space: O(M * N) recursion stack.',
      edgeCases: ['All water.', 'All land.', 'Diagonals do not count.'],
    },
    idealSolutions: {
      javascript: `function numIslands(grid) {
  if (!grid || grid.length === 0) return 0;
  const rows = grid.length, cols = grid[0].length;
  let count = 0;
  function dfs(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] !== '1') return;
    grid[r][c] = '0';
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1') {
        count++;
        dfs(r, c);
      }
    }
  }
  return count;
}`,
      typescript: `function numIslands(grid: string[][]): number {
  if (!grid || grid.length === 0) return 0;
  const rows = grid.length, cols = grid[0].length;
  let count = 0;
  function dfs(r: number, c: number) {
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] !== '1') return;
    grid[r][c] = '0';
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1') {
        count++;
        dfs(r, c);
      }
    }
  }
  return count;
}`,
      python: `def numIslands(grid: list[list[str]]) -> int:
    if not grid: return 0
    rows, cols = len(grid), len(grid[0])
    count = 0
    def dfs(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != '1':
            return
        grid[r][c] = '0'
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                count += 1
                dfs(r, c)
    return count`,
      java: `class Solution {
    public int numIslands(char[][] grid) {
        if (grid == null || grid.length == 0) return 0;
        int rows = grid.length, cols = grid[0].length, count = 0;
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (grid[r][c] == '1') {
                    count++;
                    dfs(grid, r, c);
                }
            }
        }
        return count;
    }
    private void dfs(char[][] grid, int r, int c) {
        if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] != '1') return;
        grid[r][c] = '0';
        dfs(grid, r + 1, c);
        dfs(grid, r - 1, c);
        dfs(grid, r, c + 1);
        dfs(grid, r, c - 1);
    }
}`,
      cpp: `#include <vector>

class Solution {
public:
    int numIslands(std::vector<std::vector<char>>& grid) {
        if (grid.empty()) return 0;
        int rows = grid.size(), cols = grid[0].size(), count = 0;
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (grid[r][c] == '1') {
                    count++;
                    dfs(grid, r, c);
                }
            }
        }
        return count;
    }
private:
    void dfs(std::vector<std::vector<char>>& grid, int r, int c) {
        if (r < 0 || r >= grid.size() || c < 0 || c >= grid[0].size() || grid[r][c] != '1') return;
        grid[r][c] = '0';
        dfs(grid, r + 1, c);
        dfs(grid, r - 1, c);
        dfs(grid, r, c + 1);
        dfs(grid, r, c - 1);
    }
};`,
      go: `package main

func numIslands(grid [][]byte) int {
    if len(grid) == 0 {
        return 0
    }
    rows, cols := len(grid), len(grid[0])
    count := 0
    var dfs func(r, c int)
    dfs = func(r, c int) {
        if r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] != '1' {
            return
        }
        grid[r][c] = '0'
        dfs(r+1, c)
        dfs(r-1, c)
        dfs(r, c+1)
        dfs(r, c-1)
    }
    for r := 0; r < rows; r++ {
        for c := 0; c < cols; c++ {
            if grid[r][c] == '1' {
                count++
                dfs(r, c)
            }
        }
    }
    return count
}`,
    },
    hints: [
      'Find an unvisited land cell and explore all 4 directions.',
      'Sink the land cell to water ("0") so you don\'t count it again.',
    ],
  },

  // 14. Top K Frequent Elements (MEDIUM - Heaps & Hashing)
  {
    id: 'top-k-frequent-elements',
    title: 'Top K Frequent Elements',
    difficulty: 'MEDIUM',
    pattern: 'Heaps & Hashing',
    entryPoint: 'topKFrequent',
    description: `Given an integer array \`nums\` and an integer \`k\`, return *the* \`k\` *most frequent elements*. You may return the answer in **any order**.

### Example 1:
\`\`\`text
Input: nums = [1,1,1,2,2,3], k = 2
Output: [1,2]
\`\`\`

### Constraints:
- \`1 <= nums.length <= 10^5\`
- \`k\` is within the number of unique elements.`,
    starterCode: {
      javascript: `function topKFrequent(nums, k) {
  // Write your optimal solution here
  return [];
}`,
      typescript: `function topKFrequent(nums: number[], k: number): number[] {
  // Write your optimal solution here
  return [];
}`,
      python: `def topKFrequent(nums: list[int], k: int) -> list[int]:
    # Write your optimal solution here
    return []`,
      java: `class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        // Write your optimal solution here
        return new int[0];
    }
}`,
      cpp: `#include <vector>

class Solution {
public:
    std::vector<int> topKFrequent(std::vector<int>& nums, int k) {
        // Write your optimal solution here
        return {};
    }
};`,
      go: `package main

func topKFrequent(nums []int, k int) []int {
    // Write your optimal solution here
    return nil
}`,
    },
    testCases: [
      { input: [[1, 1, 1, 2, 2, 3], 2], expected: [1, 2], description: 'Standard frequency separation' },
      { input: [[1], 1], expected: [1], description: 'Single element array' },
    ],
    optimalSolution: 'Bucket Sort on frequencies: O(N) time, O(N) space.',
    optimalTime: 'O(N)',
    optimalSpace: 'O(N)',
    editorial: {
      intuition: 'Because frequency is bounded between 1 and N, Bucket Sort allows retrieving the top k elements in O(N) time without sorting.',
      bruteForce: 'Hash map + sorting keys takes O(N log N).',
      optimalApproach: 'Count frequencies into map. Create buckets where index = frequency. Scan buckets backwards from N down to 1 collecting k numbers.',
      complexityAnalysis: 'Time: O(N). Space: O(N).',
      edgeCases: ['All elements have same frequency.', 'k equals unique count.'],
    },
    idealSolutions: {
      javascript: `function topKFrequent(nums, k) {
  const count = new Map();
  for (const n of nums) count.set(n, (count.get(n) || 0) + 1);
  const buckets = Array.from({ length: nums.length + 1 }, () => []);
  for (const [num, freq] of count.entries()) buckets[freq].push(num);
  const result = [];
  for (let i = buckets.length - 1; i >= 0 && result.length < k; i--) {
    for (const num of buckets[i]) {
      result.push(num);
      if (result.length === k) return result;
    }
  }
  return result;
}`,
      typescript: `function topKFrequent(nums: number[], k: number): number[] {
  const count = new Map<number, number>();
  for (const n of nums) count.set(n, (count.get(n) || 0) + 1);
  const buckets: number[][] = Array.from({ length: nums.length + 1 }, () => []);
  for (const [num, freq] of count.entries()) buckets[freq].push(num);
  const result: number[] = [];
  for (let i = buckets.length - 1; i >= 0 && result.length < k; i--) {
    for (const num of buckets[i]) {
      result.push(num);
      if (result.length === k) return result;
    }
  }
  return result;
}`,
      python: `def topKFrequent(nums: list[int], k: int) -> list[int]:
    count = {}
    for n in nums: count[n] = count.get(n, 0) + 1
    buckets = [[] for _ in range(len(nums) + 1)]
    for num, freq in count.items(): buckets[freq].append(num)
    result = []
    for i in range(len(buckets) - 1, 0, -1):
        for num in buckets[i]:
            result.append(num)
            if len(result) == k: return result
    return result`,
      java: `import java.util.*;

class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        Map<Integer, Integer> count = new HashMap<>();
        for (int n : nums) count.put(n, count.getOrDefault(n, 0) + 1);
        List<Integer>[] buckets = new List[nums.length + 1];
        for (int i = 0; i <= nums.length; i++) buckets[i] = new ArrayList<>();
        for (int num : count.keySet()) buckets[count.get(num)].add(num);
        int[] result = new int[k];
        int idx = 0;
        for (int i = buckets.length - 1; i >= 0 && idx < k; i--) {
            for (int num : buckets[i]) {
                result[idx++] = num;
                if (idx == k) return result;
            }
        }
        return result;
    }
}`,
      cpp: `#include <vector>
#include <unordered_map>

class Solution {
public:
    std::vector<int> topKFrequent(std::vector<int>& nums, int k) {
        std::unordered_map<int, int> count;
        for (int n : nums) count[n]++;
        std::vector<std::vector<int>> buckets(nums.size() + 1);
        for (auto& p : count) buckets[p.second].push_back(p.first);
        std::vector<int> result;
        for (int i = buckets.size() - 1; i >= 0 && result.size() < k; i--) {
            for (int num : buckets[i]) {
                result.push_back(num);
                if (result.size() == k) return result;
            }
        }
        return result;
    }
};`,
      go: `package main

func topKFrequent(nums []int, k int) []int {
    count := make(map[int]int)
    for _, n := range nums { count[n]++ }
    buckets := make([][]int, len(nums)+1)
    for num, freq := range count { buckets[freq] = append(buckets[freq], num) }
    result := []int{}
    for i := len(buckets) - 1; i >= 0 && len(result) < k; i-- {
        for _, num := range buckets[i] {
            result = append(result, num)
            if len(result) == k { return result }
        }
    }
    return result
}`,
    },
    hints: [
      'Frequencies cannot exceed N. Use bucket sort by frequency index to achieve O(N) time.',
    ],
  },

  // 15. Trapping Rain Water (HARD - Two Pointers)
  {
    id: 'trapping-rain-water',
    title: 'Trapping Rain Water',
    difficulty: 'HARD',
    pattern: 'Two Pointers',
    entryPoint: 'trap',
    description: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is \`1\`, compute how much water it can trap after raining.

### Example 1:
\`\`\`text
Input: height = [0,1,0,2,1,0,1,3,2,1,2,1]
Output: 6
\`\`\`

### Constraints:
- \`n == height.length\`
- \`1 <= n <= 2 * 10^4\``,
    starterCode: {
      javascript: `function trap(height) {
  // Write your optimal solution here
  return 0;
}`,
      typescript: `function trap(height: number[]): number {
  // Write your optimal solution here
  return 0;
}`,
      python: `def trap(height: list[int]) -> int:
    # Write your optimal solution here
    return 0`,
      java: `class Solution {
    public int trap(int[] height) {
        // Write your optimal solution here
        return 0;
    }
}`,
      cpp: `#include <vector>

class Solution {
public:
    int trap(std::vector<int>& height) {
        // Write your optimal solution here
        return 0;
    }
};`,
      go: `package main

func trap(height []int) int {
    // Write your optimal solution here
    return 0
}`,
    },
    testCases: [
      { input: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], expected: 6, description: 'Standard multi-basin map' },
      { input: [[4, 2, 0, 3, 2, 5]], expected: 9, description: 'Deep canyon between boundaries' },
      { input: [[1, 2]], expected: 0, description: 'Slope cannot trap water', isHidden: true },
    ],
    optimalSolution: 'Two Pointers tracking leftMax and rightMax: O(N) time, O(1) space.',
    optimalTime: 'O(N)',
    optimalSpace: 'O(1)',
    editorial: {
      intuition: 'At any bar i, water trapped is min(leftMax, rightMax) - height[i]. Two pointers converging from boundaries track the governing lower max.',
      bruteForce: 'Scanning left and right for every bar takes O(N^2) time.',
      optimalApproach: 'Maintain left = 0, right = N-1, leftMax = 0, rightMax = 0. If height[left] < height[right], update leftMax and add leftMax - height[left], then left++. Otherwise update rightMax and right--.',
      complexityAnalysis: 'Time: O(N). Space: O(1).',
      edgeCases: ['Length < 3 cannot trap water.', 'Monotonically ascending/descending.'],
    },
    idealSolutions: {
      javascript: `function trap(height) {
  if (!height || height.length < 3) return 0;
  let left = 0, right = height.length - 1, leftMax = 0, rightMax = 0, water = 0;
  while (left < right) {
    if (height[left] < height[right]) {
      if (height[left] >= leftMax) leftMax = height[left];
      else water += leftMax - height[left];
      left++;
    } else {
      if (height[right] >= rightMax) rightMax = height[right];
      else water += rightMax - height[right];
      right--;
    }
  }
  return water;
}`,
      typescript: `function trap(height: number[]): number {
  if (!height || height.length < 3) return 0;
  let left = 0, right = height.length - 1, leftMax = 0, rightMax = 0, water = 0;
  while (left < right) {
    if (height[left] < height[right]) {
      if (height[left] >= leftMax) leftMax = height[left];
      else water += leftMax - height[left];
      left++;
    } else {
      if (height[right] >= rightMax) rightMax = height[right];
      else water += rightMax - height[right];
      right--;
    }
  }
  return water;
}`,
      python: `def trap(height: list[int]) -> int:
    if not height or len(height) < 3: return 0
    left, right = 0, len(height) - 1
    left_max, right_max = 0, 0
    water = 0
    while left < right:
        if height[left] < height[right]:
            if height[left] >= left_max: left_max = height[left]
            else: water += left_max - height[left]
            left += 1
        else:
            if height[right] >= right_max: right_max = height[right]
            else: water += right_max - height[right]
            right -= 1
    return water`,
      java: `class Solution {
    public int trap(int[] height) {
        if (height == null || height.length < 3) return 0;
        int left = 0, right = height.length - 1, leftMax = 0, rightMax = 0, water = 0;
        while (left < right) {
            if (height[left] < height[right]) {
                if (height[left] >= leftMax) leftMax = height[left];
                else water += leftMax - height[left];
                left++;
            } else {
                if (height[right] >= rightMax) rightMax = height[right];
                else water += rightMax - height[right];
                right--;
            }
        }
        return water;
    }
}`,
      cpp: `#include <vector>
#include <algorithm>

class Solution {
public:
    int trap(std::vector<int>& height) {
        if (height.size() < 3) return 0;
        int left = 0, right = height.size() - 1, leftMax = 0, rightMax = 0, water = 0;
        while (left < right) {
            if (height[left] < height[right]) {
                if (height[left] >= leftMax) leftMax = height[left];
                else water += leftMax - height[left];
                left++;
            } else {
                if (height[right] >= rightMax) rightMax = height[right];
                else water += rightMax - height[right];
                right--;
            }
        }
        return water;
    }
};`,
      go: `package main

func trap(height []int) int {
    if len(height) < 3 { return 0 }
    left, right := 0, len(height)-1
    leftMax, rightMax, water := 0, 0, 0
    for left < right {
        if height[left] < height[right] {
            if height[left] >= leftMax { leftMax = height[left] } else { water += leftMax - height[left] }
            left++
        } else {
            if height[right] >= rightMax { rightMax = height[right] } else { water += rightMax - height[right] }
            right--
        }
    }
    return water
}`,
    },
    hints: [
      'Water level is determined by the shorter of leftMax and rightMax.',
      'Two pointers converging from both sides track whichever bound is currently constraining the water.',
    ],
  }
];

export function getProblemByIdFromCatalog(id: string): CodingProblem | undefined {
  return CODING_PROBLEMS.find((p) => p.id === id || p.id.toLowerCase() === id.toLowerCase());
}
