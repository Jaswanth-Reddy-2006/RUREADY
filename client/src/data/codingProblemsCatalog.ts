// ═══════════════════════════════════════════════════════════════
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

export const CODING_PROBLEMS: CodingProblem[] = [
  {
    "id": "two-sum",
    "title": "Two Sum",
    "difficulty": "EASY",
    "category": "DSA",
    "pattern": "Arrays & Hashing",
    "entryPoint": "twoSum",
    "optimalTime": "O(N)",
    "optimalSpace": "O(N)",
    "timeKeywords": [
      "o(n)",
      "linear",
      "o of n"
    ],
    "spaceKeywords": [
      "o(n)",
      "linear",
      "o of n",
      "auxiliary"
    ],
    "description": "Given an array of integers `nums` and an integer `target`, return the indices of the two numbers such that they add up to `target`.\n\n### Problem Statement & Context:\nYou are building an order reconciliation service where combinations of two payments must match a settlement batch total. You need to identify which pair of transactions sums precisely to the target amount.\n\n### Requirements:\n1. Each input will have **exactly one valid solution**.\n2. You cannot use the same element twice (i.e. you cannot use nums[i] twice for the same pair).\n3. The answer can be returned in any order of indices, e.g. `[0, 1]` or `[1, 0]`.\n4. Your solution must scale efficiently for arrays up to 100,000 items.\n\n### Examples:\n**Example 1:**\n- **Input:** `nums = [2, 7, 11, 15], target = 9`\n- **Output:** `[0, 1]`\n- **Explanation:** Because `nums[0] + nums[1] == 2 + 7 == 9`, we return `[0, 1]`.\n\n**Example 2:**\n- **Input:** `nums = [3, 2, 4], target = 6`\n- **Output:** `[1, 2]`\n- **Explanation:** `nums[1] + nums[2] == 2 + 4 == 6`. Notice that nums[0] + nums[0] (3 + 3) is invalid because an element at index 0 cannot be used twice.\n\n**Example 3:**\n- **Input:** `nums = [3, 3], target = 6`\n- **Output:** `[0, 1]`\n- **Explanation:** Here duplicate values exist at different indices, so both index 0 and index 1 are chosen.\n\n### Constraints:\n- `2 <= nums.length <= 10^5`\n- `-10^9 <= nums[i] <= 10^9`\n- `-10^9 <= target <= 10^9`\n- Only one valid answer exists.",
    "testCases": [
      {
        "input": [
          [
            2,
            7,
            11,
            15
          ],
          9
        ],
        "expected": [
          0,
          1
        ],
        "description": "Basic pair"
      },
      {
        "input": [
          [
            3,
            2,
            4
          ],
          6
        ],
        "expected": [
          1,
          2
        ],
        "description": "Non-adjacent pair"
      },
      {
        "input": [
          [
            3,
            3
          ],
          6
        ],
        "expected": [
          0,
          1
        ],
        "description": "Duplicate values"
      },
      {
        "input": [
          [
            -1,
            -2,
            -3,
            -4,
            -5
          ],
          -8
        ],
        "expected": [
          2,
          4
        ],
        "description": "Negative numbers",
        "isHidden": true
      },
      {
        "input": [
          [
            0,
            4,
            3,
            0
          ],
          0
        ],
        "expected": [
          0,
          3
        ],
        "description": "Zeros pair",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "Instead of comparing every pair with nested loops in O(N^2) time, use a hash map to remember each number and its index. As you iterate, check if (target - num) was already recorded.",
      "bruteForce": "Nested loops checking all pairs (i, j) with i < j takes O(N^2) time and O(1) space.",
      "optimalApproach": "One-pass hash map: store each value to index mapping. For each number x, look up target - x.",
      "complexityAnalysis": "Time: O(N) because hash map lookup is O(1) amortized. Space: O(N) to store up to N elements.",
      "edgeCases": [
        "Negative numbers",
        "Zeros",
        "Duplicate values at distinct indices"
      ]
    },
    "hints": [
      "What information do you need to look up instantly as you iterate?",
      "Can you store the complement (target - current) in a hash table?",
      "You only need one pass: check if the complement exists before inserting."
    ]
  },
  {
    "id": "valid-anagram",
    "title": "Valid Anagram",
    "difficulty": "EASY",
    "category": "DSA",
    "pattern": "Arrays & Hashing",
    "entryPoint": "isAnagram",
    "optimalTime": "O(N)",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(n)",
      "linear",
      "o of n"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant",
      "o of 1",
      "o(k)"
    ],
    "description": "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.\n\n### Problem Statement & Context:\nAn **Anagram** is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.\n\n### Requirements:\n1. Both strings must contain the exact same characters with the exact same frequencies.\n2. The strings must have the exact same length to be anagrams.\n3. Your solution should handle lowercase English letters as well as Unicode characters.\n\n### Examples:\n**Example 1:**\n- **Input:** `s = \"anagram\", t = \"nagaram\"`\n- **Output:** `true`\n\n**Example 2:**\n- **Input:** `s = \"rat\", t = \"car\"`\n- **Output:** `false`\n\n### Constraints:\n- `1 <= s.length, t.length <= 5 * 10^4`\n- `s` and `t` consist of lowercase English letters.",
    "testCases": [
      {
        "input": [
          "anagram",
          "nagaram"
        ],
        "expected": true
      },
      {
        "input": [
          "rat",
          "car"
        ],
        "expected": false
      },
      {
        "input": [
          "a",
          "a"
        ],
        "expected": true
      },
      {
        "input": [
          "ab",
          "a"
        ],
        "expected": false,
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "Count frequency of each character across both strings and verify they match.",
      "bruteForce": "Sorting both strings takes O(N log N) time.",
      "optimalApproach": "Use an array of size 26 or a hash map to increment count for s and decrement for t.",
      "complexityAnalysis": "Time: O(N), Space: O(1) since English alphabet has 26 fixed characters.",
      "edgeCases": [
        "Unequal lengths",
        "Single character",
        "Repeated characters"
      ]
    },
    "hints": [
      "Check lengths first",
      "Use character frequency counting",
      "Fixed 26-element array provides O(1) space"
    ]
  },
  {
    "id": "contains-duplicate",
    "title": "Contains Duplicate",
    "difficulty": "EASY",
    "category": "DSA",
    "pattern": "Arrays & Hashing",
    "entryPoint": "containsDuplicate",
    "optimalTime": "O(N)",
    "optimalSpace": "O(N)",
    "timeKeywords": [
      "o(n)",
      "linear"
    ],
    "spaceKeywords": [
      "o(n)",
      "linear"
    ],
    "description": "Given an integer array `nums`, return `true` if any value appears **at least twice** in the array, and return `false` if every element is distinct.\n\n### Requirements:\n1. Return boolean true or false.\n2. Optimize for large arrays with up to 10^5 elements.\n\n### Examples:\n**Example 1:**\n- **Input:** `nums = [1, 2, 3, 1]`\n- **Output:** `true`\n\n**Example 2:**\n- **Input:** `nums = [1, 2, 3, 4]`\n- **Output:** `false`\n\n### Constraints:\n- `1 <= nums.length <= 10^5`\n- `-10^9 <= nums[i] <= 10^9`",
    "testCases": [
      {
        "input": [
          [
            1,
            2,
            3,
            1
          ]
        ],
        "expected": true
      },
      {
        "input": [
          [
            1,
            2,
            3,
            4
          ]
        ],
        "expected": false
      },
      {
        "input": [
          [
            1,
            1,
            1,
            3,
            3,
            4,
            3,
            2,
            4,
            2
          ]
        ],
        "expected": true
      }
    ],
    "editorial": {
      "intuition": "Use a hash set to track elements visited so far.",
      "bruteForce": "Double loop checking pairs: O(N^2).",
      "optimalApproach": "Single scan inserting into Set. If element is already present, return true.",
      "complexityAnalysis": "Time: O(N), Space: O(N).",
      "edgeCases": [
        "Array of size 1",
        "All duplicate elements",
        "All distinct elements"
      ]
    },
    "hints": [
      "Can you use a Set?",
      "Set size vs array length"
    ]
  },
  {
    "id": "group-anagrams",
    "title": "Group Anagrams",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Arrays & Hashing",
    "entryPoint": "groupAnagrams",
    "optimalTime": "O(N * K)",
    "optimalSpace": "O(N * K)",
    "timeKeywords": [
      "o(n * k)",
      "o(n*k)",
      "linear"
    ],
    "spaceKeywords": [
      "o(n * k)",
      "o(n*k)"
    ],
    "description": "Given an array of strings `strs`, group the **anagrams** together. You can return the answer in any order.\n\n### Requirements:\n1. Words with identical letter counts belong to the same group.\n2. Order of groups and order within groups does not matter.\n\n### Examples:\n**Example 1:**\n- **Input:** `strs = [\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]`\n- **Output:** `[[\"bat\"],[\"nat\",\"tan\"],[\"ate\",\"eat\",\"tea\"]]`\n\n### Constraints:\n- `1 <= strs.length <= 10^4`\n- `0 <= strs[i].length <= 100`\n- `strs[i]` consists of lowercase English letters.",
    "testCases": [
      {
        "input": [
          [
            "eat",
            "tea",
            "tan",
            "ate",
            "nat",
            "bat"
          ]
        ],
        "expected": [
          [
            "eat",
            "tea",
            "ate"
          ],
          [
            "tan",
            "nat"
          ],
          [
            "bat"
          ]
        ]
      },
      {
        "input": [
          [
            ""
          ]
        ],
        "expected": [
          [
            ""
          ]
        ]
      },
      {
        "input": [
          [
            "a"
          ]
        ],
        "expected": [
          [
            "a"
          ]
        ]
      }
    ],
    "editorial": {
      "intuition": "Each anagram has the same sorted form or character count signature. Use that as a hash map key.",
      "bruteForce": "Pairwise comparison takes quadratic time.",
      "optimalApproach": "Compute 26-length tuple/string frequency key for each word and group in map.",
      "complexityAnalysis": "Time: O(N * K) where K is max word length. Space: O(N * K).",
      "edgeCases": [
        "Empty strings",
        "Single letters",
        "No anagrams present"
      ]
    },
    "hints": [
      "What can serve as a canonical key for any anagram?",
      "Sort characters or use character counts"
    ]
  },
  {
    "id": "top-k-frequent-elements",
    "title": "Top K Frequent Elements",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Arrays & Hashing",
    "entryPoint": "topKFrequent",
    "optimalTime": "O(N)",
    "optimalSpace": "O(N)",
    "timeKeywords": [
      "o(n)",
      "linear",
      "o(n log k)"
    ],
    "spaceKeywords": [
      "o(n)",
      "linear"
    ],
    "description": "Given an integer array `nums` and an integer `k`, return the `k` most frequent elements. You may return the answer in any order.\n\n### Requirements:\n1. It is guaranteed that the answer is unique.\n2. Must run better than O(N log N) (ideally O(N) using bucket sort or O(N log K) using min-heap).\n\n### Examples:\n**Example 1:**\n- **Input:** `nums = [1,1,1,2,2,3], k = 2`\n- **Output:** `[1, 2]`\n\n### Constraints:\n- `1 <= nums.length <= 10^5`\n- `k` is in the range `[1, the number of unique elements in the array]`.",
    "testCases": [
      {
        "input": [
          [
            1,
            1,
            1,
            2,
            2,
            3
          ],
          2
        ],
        "expected": [
          1,
          2
        ]
      },
      {
        "input": [
          [
            1
          ],
          1
        ],
        "expected": [
          1
        ]
      }
    ],
    "editorial": {
      "intuition": "Count frequencies with a map, then place numbers into buckets indexed by frequency.",
      "bruteForce": "Sorting unique elements by count takes O(U log U).",
      "optimalApproach": "Bucket sort with array of lists of size N + 1 achieves linear time.",
      "complexityAnalysis": "Time: O(N), Space: O(N).",
      "edgeCases": [
        "k equals number of unique elements",
        "all elements have same frequency"
      ]
    },
    "hints": [
      "Count frequencies first",
      "Can you use bucket sort indexed by frequency?"
    ]
  },
  {
    "id": "product-of-array-except-self",
    "title": "Product of Array Except Self",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Arrays & Hashing",
    "entryPoint": "productExceptSelf",
    "optimalTime": "O(N)",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(n)",
      "linear"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant",
      "o(n)"
    ],
    "description": "Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`.\n\n### Requirements:\n1. You must write an algorithm that runs in **O(n)** time.\n2. You **must not use the division operation**.\n3. Auxiliary space should be O(1) (excluding the output array).\n\n### Examples:\n**Example 1:**\n- **Input:** `nums = [1, 2, 3, 4]`\n- **Output:** `[24, 12, 8, 6]`\n\n**Example 2:**\n- **Input:** `nums = [-1, 1, 0, -3, 3]`\n- **Output:** `[0, 0, 9, 0, 0]`\n\n### Constraints:\n- `2 <= nums.length <= 10^5`\n- `-30 <= nums[i] <= 30`",
    "testCases": [
      {
        "input": [
          [
            1,
            2,
            3,
            4
          ]
        ],
        "expected": [
          24,
          12,
          8,
          6
        ]
      },
      {
        "input": [
          [
            -1,
            1,
            0,
            -3,
            3
          ]
        ],
        "expected": [
          0,
          0,
          9,
          0,
          0
        ]
      }
    ],
    "editorial": {
      "intuition": "Prefix products and suffix products multiplied together give the product except self.",
      "bruteForce": "Multiplying all other elements for each index takes O(N^2).",
      "optimalApproach": "Compute prefix products into result array, then sweep backwards maintaining a running suffix product.",
      "complexityAnalysis": "Time: O(N), Auxiliary Space: O(1).",
      "edgeCases": [
        "Array containing zeros",
        "Negative numbers"
      ]
    },
    "hints": [
      "Think of prefix product and suffix product",
      "Accumulate suffix in a single variable"
    ]
  },
  {
    "id": "valid-palindrome",
    "title": "Valid Palindrome",
    "difficulty": "EASY",
    "category": "DSA",
    "pattern": "Two Pointers",
    "entryPoint": "isPalindrome",
    "optimalTime": "O(N)",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(n)",
      "linear"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant"
    ],
    "description": "A phrase is a **palindrome** if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.\n\nGiven a string `s`, return `true` if it is a palindrome, or `false` otherwise.\n\n### Examples:\n**Example 1:**\n- **Input:** `s = \"A man, a plan, a canal: Panama\"`\n- **Output:** `true`\n- **Explanation:** \"amanaplanacanalpanama\" is a palindrome.\n\n**Example 2:**\n- **Input:** `s = \"race a car\"`\n- **Output:** `false`\n\n### Constraints:\n- `1 <= s.length <= 2 * 10^5`\n- `s` consists only of printable ASCII characters.",
    "testCases": [
      {
        "input": [
          "A man, a plan, a canal: Panama"
        ],
        "expected": true
      },
      {
        "input": [
          "race a car"
        ],
        "expected": false
      },
      {
        "input": [
          " "
        ],
        "expected": true
      },
      {
        "input": [
          "0P"
        ],
        "expected": false,
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "Two pointers converging from both ends skipping non-alphanumeric characters.",
      "bruteForce": "Clean string into new string then reverse: O(N) space.",
      "optimalApproach": "In-place two pointers with left and right indices.",
      "complexityAnalysis": "Time: O(N), Space: O(1).",
      "edgeCases": [
        "String with only punctuation",
        "Single character",
        "Case differences"
      ]
    },
    "hints": [
      "Use two pointers left and right",
      "Skip non-alphanumeric characters while left < right"
    ]
  },
  {
    "id": "two-sum-ii-input-array-is-sorted",
    "title": "Two Sum II - Input Array Is Sorted",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Two Pointers",
    "entryPoint": "twoSum",
    "optimalTime": "O(N)",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(n)",
      "linear"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant"
    ],
    "description": "Given a **1-indexed** array of integers `numbers` that is already **sorted in non-decreasing order**, find two numbers such that they add up to a specific `target` number.\n\nReturn the indices of the two numbers, `index1` and `index2`, added by one as an integer array `[index1, index2]` of length 2.\n\n### Constraints:\n- `2 <= numbers.length <= 3 * 10^4`\n- You may not use the same element twice.\n- Exactly one solution exists.",
    "testCases": [
      {
        "input": [
          [
            2,
            7,
            11,
            15
          ],
          9
        ],
        "expected": [
          1,
          2
        ]
      },
      {
        "input": [
          [
            2,
            3,
            4
          ],
          6
        ],
        "expected": [
          1,
          3
        ]
      },
      {
        "input": [
          [
            -1,
            0
          ],
          -1
        ],
        "expected": [
          1,
          2
        ]
      }
    ],
    "editorial": {
      "intuition": "Because the array is sorted, if sum < target increment left; if sum > target decrement right.",
      "bruteForce": "Binary search for each element is O(N log N).",
      "optimalApproach": "Two pointers at ends converging inward.",
      "complexityAnalysis": "Time: O(N), Space: O(1).",
      "edgeCases": [
        "Negative numbers",
        "Two equal elements"
      ]
    },
    "hints": [
      "The array is sorted!",
      "If sum is too small, move left pointer right"
    ]
  },
  {
    "id": "3sum",
    "title": "3Sum",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Two Pointers",
    "entryPoint": "threeSum",
    "optimalTime": "O(N^2)",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(n^2)",
      "o(n squared)",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant",
      "o(n)"
    ],
    "description": "Given an integer array nums, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`.\n\nNotice that the solution set must not contain duplicate triplets.\n\n### Examples:\n**Example 1:**\n- **Input:** `nums = [-1,0,1,2,-1,-4]`\n- **Output:** `[[-1,-1,2],[-1,0,1]]`\n\n### Constraints:\n- `3 <= nums.length <= 3000`\n- `-10^5 <= nums[i] <= 10^5`",
    "testCases": [
      {
        "input": [
          [
            -1,
            0,
            1,
            2,
            -1,
            -4
          ]
        ],
        "expected": [
          [
            -1,
            -1,
            2
          ],
          [
            -1,
            0,
            1
          ]
        ]
      },
      {
        "input": [
          [
            0,
            1,
            1
          ]
        ],
        "expected": []
      },
      {
        "input": [
          [
            0,
            0,
            0
          ]
        ],
        "expected": [
          [
            0,
            0,
            0
          ]
        ]
      }
    ],
    "editorial": {
      "intuition": "Sort array, fix one element, and use Two Pointers for the remaining two elements.",
      "bruteForce": "Checking all triplets takes O(N^3).",
      "optimalApproach": "Sort nums in O(N log N). Iterate i from 0 to N-3, then two pointers left and right.",
      "complexityAnalysis": "Time: O(N^2), Space: O(1) or O(N) depending on sorting implementation.",
      "edgeCases": [
        "All zeros",
        "Duplicates skipped to avoid duplicate triplets"
      ]
    },
    "hints": [
      "Sort the array first",
      "Fix the first element and solve 2Sum on the remaining subarray",
      "Skip adjacent duplicate values"
    ]
  },
  {
    "id": "container-with-most-water",
    "title": "Container With Most Water",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Two Pointers",
    "entryPoint": "maxArea",
    "optimalTime": "O(N)",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(n)",
      "linear"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant"
    ],
    "description": "You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the `i-th` line are `(i, 0)` and `(i, height[i])`.\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store.\n\n### Examples:\n**Example 1:**\n- **Input:** `height = [1,8,6,2,5,4,8,3,7]`\n- **Output:** `49`\n- **Explanation:** The max area is between index 1 and index 8: width = 7, min height = 7, area = 49.\n\n### Constraints:\n- `n == height.length`\n- `2 <= n <= 10^5`\n- `0 <= height[i] <= 10^4`",
    "testCases": [
      {
        "input": [
          [
            1,
            8,
            6,
            2,
            5,
            4,
            8,
            3,
            7
          ]
        ],
        "expected": 49
      },
      {
        "input": [
          [
            1,
            1
          ]
        ],
        "expected": 1
      }
    ],
    "editorial": {
      "intuition": "Start with widest container (left = 0, right = n-1). Always advance the pointer pointing to the shorter vertical bar.",
      "bruteForce": "Check all pairs of lines: O(N^2).",
      "optimalApproach": "Two pointers at extremities. Move whichever line is shorter.",
      "complexityAnalysis": "Time: O(N), Space: O(1).",
      "edgeCases": [
        "All heights equal",
        "Descending heights",
        "Only 2 lines"
      ]
    },
    "hints": [
      "Area is limited by the shorter line",
      "Moving the taller line cannot increase area"
    ]
  },
  {
    "id": "trapping-rain-water",
    "title": "Trapping Rain Water",
    "difficulty": "HARD",
    "category": "DSA",
    "pattern": "Two Pointers",
    "entryPoint": "trap",
    "optimalTime": "O(N)",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(n)",
      "linear"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant"
    ],
    "description": "Given `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.\n\n### Examples:\n**Example 1:**\n- **Input:** `height = [0,1,0,2,1,0,1,3,2,1,2,1]`\n- **Output:** `6`\n\n### Constraints:\n- `n == height.length`\n- `1 <= n <= 2 * 10^4`\n- `0 <= height[i] <= 10^5`",
    "testCases": [
      {
        "input": [
          [
            0,
            1,
            0,
            2,
            1,
            0,
            1,
            3,
            2,
            1,
            2,
            1
          ]
        ],
        "expected": 6
      },
      {
        "input": [
          [
            4,
            2,
            0,
            3,
            2,
            5
          ]
        ],
        "expected": 9
      }
    ],
    "editorial": {
      "intuition": "Water above index i is determined by min(maxLeft, maxRight) - height[i]. Two pointers can track running maxes without arrays.",
      "bruteForce": "For each index, find left max and right max: O(N^2).",
      "optimalApproach": "Two pointers tracking leftMax and rightMax. Advance pointer with smaller max.",
      "complexityAnalysis": "Time: O(N), Space: O(1).",
      "edgeCases": [
        "Strictly increasing/decreasing heights trap 0 water",
        "Array length < 3"
      ]
    },
    "hints": [
      "Water trapped at bar i depends on min of max height to left and right",
      "Two pointers avoid extra arrays"
    ]
  },
  {
    "id": "best-time-to-buy-and-sell-stock",
    "title": "Best Time to Buy and Sell Stock",
    "difficulty": "EASY",
    "category": "DSA",
    "pattern": "Sliding Window",
    "entryPoint": "maxProfit",
    "optimalTime": "O(N)",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(n)",
      "linear"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant"
    ],
    "description": "You are given an array `prices` where `prices[i]` is the price of a given stock on the `i-th` day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return `0`.\n\n### Examples:\n**Example 1:**\n- **Input:** `prices = [7,1,5,3,6,4]`\n- **Output:** `5`\n- **Explanation:** Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6 - 1 = 5.\n\n**Example 2:**\n- **Input:** `prices = [7,6,4,3,1]`\n- **Output:** `0`\n\n### Constraints:\n- `1 <= prices.length <= 10^5`\n- `0 <= prices[i] <= 10^4`",
    "testCases": [
      {
        "input": [
          [
            7,
            1,
            5,
            3,
            6,
            4
          ]
        ],
        "expected": 5
      },
      {
        "input": [
          [
            7,
            6,
            4,
            3,
            1
          ]
        ],
        "expected": 0
      },
      {
        "input": [
          [
            2,
            4,
            1
          ]
        ],
        "expected": 2
      }
    ],
    "editorial": {
      "intuition": "Track the minimum price seen so far and compare each day price against it.",
      "bruteForce": "Compare all pairs: O(N^2).",
      "optimalApproach": "Single pass maintaining minPrice and maxProfit.",
      "complexityAnalysis": "Time: O(N), Space: O(1).",
      "edgeCases": [
        "Monotonically decreasing prices",
        "Single day",
        "Prices with zero"
      ]
    },
    "hints": [
      "Track minimum price seen so far",
      "Calculate profit at each day"
    ]
  },
  {
    "id": "longest-substring-without-repeating-characters",
    "title": "Longest Substring Without Repeating Characters",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Sliding Window",
    "entryPoint": "lengthOfLongestSubstring",
    "optimalTime": "O(N)",
    "optimalSpace": "O(min(N, M))",
    "timeKeywords": [
      "o(n)",
      "linear"
    ],
    "spaceKeywords": [
      "o(n)",
      "o(min(n, m))",
      "linear"
    ],
    "description": "Given a string `s`, find the length of the **longest substring** without duplicate characters.\n\n### Examples:\n**Example 1:**\n- **Input:** `s = \"abcabcbb\"`\n- **Output:** `3`\n- **Explanation:** The answer is \"abc\", with length 3.\n\n**Example 2:**\n- **Input:** `s = \"bbbbb\"`\n- **Output:** `1`\n\n**Example 3:**\n- **Input:** `s = \"pwwkew\"`\n- **Output:** `3`\n\n### Constraints:\n- `0 <= s.length <= 5 * 10^4`\n- `s` consists of English letters, digits, symbols and spaces.",
    "testCases": [
      {
        "input": [
          "abcabcbb"
        ],
        "expected": 3
      },
      {
        "input": [
          "bbbbb"
        ],
        "expected": 1
      },
      {
        "input": [
          "pwwkew"
        ],
        "expected": 3
      },
      {
        "input": [
          ""
        ],
        "expected": 0,
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "Use a sliding window [left, right] and a hash map tracking last seen index of characters.",
      "bruteForce": "Check all substrings for uniqueness: O(N^3).",
      "optimalApproach": "Sliding window: when character s[right] was seen inside window, move left to seen[char] + 1.",
      "complexityAnalysis": "Time: O(N), Space: O(min(N, M)) where M is character alphabet size.",
      "edgeCases": [
        "Empty string",
        "All identical characters",
        "String with spaces"
      ]
    },
    "hints": [
      "Use sliding window",
      "Store the last seen index of each character"
    ]
  },
  {
    "id": "minimum-window-substring",
    "title": "Minimum Window Substring",
    "difficulty": "HARD",
    "category": "DSA",
    "pattern": "Sliding Window",
    "entryPoint": "minWindow",
    "optimalTime": "O(N + M)",
    "optimalSpace": "O(M)",
    "timeKeywords": [
      "o(n + m)",
      "linear",
      "o(n)"
    ],
    "spaceKeywords": [
      "o(m)",
      "o(1)"
    ],
    "description": "Given two strings `s` and `t` of lengths `m` and `n` respectively, return the **minimum window substring** of `s` such that every character in `t` (including duplicates) is included in the window. If there is no such substring, return the empty string `\"\"`.\n\n### Examples:\n**Example 1:**\n- **Input:** `s = \"ADOBECODEBANC\", t = \"ABC\"`\n- **Output:** `\"BANC\"`\n\n### Constraints:\n- `m == s.length`, `n == t.length`\n- `1 <= m, n <= 10^5`\n- `s` and `t` consist of uppercase and lowercase English letters.",
    "testCases": [
      {
        "input": [
          "ADOBECODEBANC",
          "ABC"
        ],
        "expected": "BANC"
      },
      {
        "input": [
          "a",
          "a"
        ],
        "expected": "a"
      },
      {
        "input": [
          "a",
          "aa"
        ],
        "expected": ""
      }
    ],
    "editorial": {
      "intuition": "Sliding window with character frequency count. Expand right until valid, then shrink left to find minimum.",
      "bruteForce": "Check all substrings: O(N^2 * M).",
      "optimalApproach": "Two pointers tracking match counts against target frequency map.",
      "complexityAnalysis": "Time: O(N + M), Space: O(M).",
      "edgeCases": [
        "t longer than s",
        "Duplicate characters in t"
      ]
    },
    "hints": [
      "Count frequency of t",
      "Expand right until window has all characters",
      "Shrink left to minimize"
    ]
  },
  {
    "id": "valid-parentheses",
    "title": "Valid Parentheses",
    "difficulty": "EASY",
    "category": "DSA",
    "pattern": "Stack",
    "entryPoint": "isValid",
    "optimalTime": "O(N)",
    "optimalSpace": "O(N)",
    "timeKeywords": [
      "o(n)",
      "linear"
    ],
    "spaceKeywords": [
      "o(n)",
      "linear"
    ],
    "description": "Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.\n\n### Examples:\n**Example 1:**\n- **Input:** `s = \"()\"`\n- **Output:** `true`\n\n**Example 2:**\n- **Input:** `s = \"()[]{}\"`\n- **Output:** `true`\n\n**Example 3:**\n- **Input:** `s = \"(]\"`\n- **Output:** `false`\n\n### Constraints:\n- `1 <= s.length <= 10^4`\n- `s` consists of parentheses only `'()[]{}'.`",
    "testCases": [
      {
        "input": [
          "()"
        ],
        "expected": true
      },
      {
        "input": [
          "()[]{}"
        ],
        "expected": true
      },
      {
        "input": [
          "(]"
        ],
        "expected": false
      },
      {
        "input": [
          "{[]}"
        ],
        "expected": true
      },
      {
        "input": [
          "]"
        ],
        "expected": false,
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "Use a LIFO Stack. Push opening brackets; on closing bracket, pop and ensure matching type.",
      "bruteForce": "Repeated string replacement s.replace(\"()\",\"\") takes O(N^2).",
      "optimalApproach": "Stack data structure with hash map of matching pairs.",
      "complexityAnalysis": "Time: O(N), Space: O(N).",
      "edgeCases": [
        "Odd length string is always invalid",
        "Closing bracket on empty stack",
        "Remaining unmatched open brackets"
      ]
    },
    "hints": [
      "Use a Stack",
      "Odd length strings can be immediately rejected"
    ]
  },
  {
    "id": "min-stack",
    "title": "Min Stack",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Stack",
    "entryPoint": "MinStack",
    "optimalTime": "O(1)",
    "optimalSpace": "O(N)",
    "timeKeywords": [
      "o(1)",
      "constant"
    ],
    "spaceKeywords": [
      "o(n)",
      "linear"
    ],
    "description": "Design a stack that supports push, pop, top, and retrieving the minimum element in **constant time O(1)**.\n\nImplement the `MinStack` class:\n- `MinStack()` initializes the stack object.\n- `void push(int val)` pushes the element val onto the stack.\n- `void pop()` removes the element on the top of the stack.\n- `int top()` gets the top element of the stack.\n- `int getMin()` retrieves the minimum element in the stack.\n\nYou must implement a solution with **O(1)** time complexity for each function.\n\n### Constraints:\n- `-2^31 <= val <= 2^31 - 1`\n- Methods pop, top and getMin will always be called on non-empty stacks.",
    "testCases": [
      {
        "input": [
          "test"
        ],
        "expected": true
      }
    ],
    "editorial": {
      "intuition": "Maintain a secondary stack that tracks the running minimum alongside the main stack.",
      "bruteForce": "Searching stack on getMin takes O(N).",
      "optimalApproach": "Paired stack or storing (val, currentMin) pairs.",
      "complexityAnalysis": "Time: O(1) for all methods. Space: O(N).",
      "edgeCases": [
        "Duplicate minimums",
        "Popping current minimum"
      ]
    },
    "hints": [
      "Can you maintain a separate stack of minimums?",
      "Store the min value at every stack depth"
    ]
  },
  {
    "id": "daily-temperatures",
    "title": "Daily Temperatures",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Stack",
    "entryPoint": "dailyTemperatures",
    "optimalTime": "O(N)",
    "optimalSpace": "O(N)",
    "timeKeywords": [
      "o(n)",
      "linear"
    ],
    "spaceKeywords": [
      "o(n)",
      "linear"
    ],
    "description": "Given an array of integers `temperatures` represents the daily temperatures, return an array `answer` such that `answer[i]` is the number of days you have to wait after the `i-th` day to get a warmer temperature. If there is no future day for which this is possible, keep `answer[i] == 0` instead.\n\n### Examples:\n**Example 1:**\n- **Input:** `temperatures = [73,74,75,71,69,72,76,73]`\n- **Output:** `[1,1,4,2,1,1,0,0]`\n\n### Constraints:\n- `1 <= temperatures.length <= 10^5`\n- `30 <= temperatures[i] <= 100`",
    "testCases": [
      {
        "input": [
          [
            73,
            74,
            75,
            71,
            69,
            72,
            76,
            73
          ]
        ],
        "expected": [
          1,
          1,
          4,
          2,
          1,
          1,
          0,
          0
        ]
      },
      {
        "input": [
          [
            30,
            40,
            50,
            60
          ]
        ],
        "expected": [
          1,
          1,
          1,
          0
        ]
      }
    ],
    "editorial": {
      "intuition": "Monotonic decreasing stack storing indices. When a warmer day arrives, pop cooler days and compute distance.",
      "bruteForce": "Nested loops searching ahead: O(N^2).",
      "optimalApproach": "Monotonic stack: each element pushed and popped at most once.",
      "complexityAnalysis": "Time: O(N), Space: O(N).",
      "edgeCases": [
        "Strictly decreasing temperatures",
        "All temperatures equal"
      ]
    },
    "hints": [
      "Think of a monotonic stack",
      "Store indices instead of values"
    ]
  },
  {
    "id": "binary-search",
    "title": "Binary Search",
    "difficulty": "EASY",
    "category": "DSA",
    "pattern": "Binary Search",
    "entryPoint": "search",
    "optimalTime": "O(log N)",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(log n)",
      "logarithmic",
      "o of log n"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant"
    ],
    "description": "Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return `-1`.\n\nYou must write an algorithm with **O(log n)** runtime complexity.\n\n### Examples:\n**Example 1:**\n- **Input:** `nums = [-1,0,3,5,9,12], target = 9`\n- **Output:** `4`\n\n**Example 2:**\n- **Input:** `nums = [-1,0,3,5,9,12], target = 2`\n- **Output:** `-1`\n\n### Constraints:\n- `1 <= nums.length <= 10^4`\n- `-10^4 < nums[i], target < 10^4`\n- All integers in `nums` are unique.\n- `nums` is sorted in ascending order.",
    "testCases": [
      {
        "input": [
          [
            -1,
            0,
            3,
            5,
            9,
            12
          ],
          9
        ],
        "expected": 4
      },
      {
        "input": [
          [
            -1,
            0,
            3,
            5,
            9,
            12
          ],
          2
        ],
        "expected": -1
      }
    ],
    "editorial": {
      "intuition": "Halve the search space by comparing mid element with target.",
      "bruteForce": "Linear scan takes O(N).",
      "optimalApproach": "Standard binary search with left and right bounds.",
      "complexityAnalysis": "Time: O(log N), Space: O(1).",
      "edgeCases": [
        "Single element array",
        "Target smaller than min or larger than max"
      ]
    },
    "hints": [
      "Calculate mid = left + Math.floor((right - left) / 2)",
      "Compare nums[mid] with target"
    ]
  },
  {
    "id": "search-in-rotated-sorted-array",
    "title": "Search in Rotated Sorted Array",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Binary Search",
    "entryPoint": "search",
    "optimalTime": "O(log N)",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(log n)",
      "logarithmic"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant"
    ],
    "description": "There is an integer array `nums` sorted in ascending order (with distinct values). Prior to being passed to your function, `nums` is possibly rotated at an unknown pivot index `k`.\n\nGiven the array `nums` after the possible rotation and an integer `target`, return the index of `target` if it is in `nums`, or `-1` if it is not in `nums`.\n\nYou must write an algorithm with **O(log n)** runtime complexity.\n\n### Examples:\n**Example 1:**\n- **Input:** `nums = [4,5,6,7,0,1,2], target = 0`\n- **Output:** `4`\n\n### Constraints:\n- `1 <= nums.length <= 5000`\n- `-10^4 <= nums[i] <= 10^4`\n- All values of `nums` are unique.",
    "testCases": [
      {
        "input": [
          [
            4,
            5,
            6,
            7,
            0,
            1,
            2
          ],
          0
        ],
        "expected": 4
      },
      {
        "input": [
          [
            4,
            5,
            6,
            7,
            0,
            1,
            2
          ],
          3
        ],
        "expected": -1
      },
      {
        "input": [
          [
            1
          ],
          0
        ],
        "expected": -1
      }
    ],
    "editorial": {
      "intuition": "At least one half of the rotated array is always sorted. Determine which half is sorted and check if target falls in it.",
      "bruteForce": "Linear search takes O(N).",
      "optimalApproach": "Modified binary search checking nums[left] <= nums[mid].",
      "complexityAnalysis": "Time: O(log N), Space: O(1).",
      "edgeCases": [
        "No rotation (fully sorted)",
        "Array length 1 or 2"
      ]
    },
    "hints": [
      "One half is always normally sorted",
      "Check if target lies inside the sorted half"
    ]
  },
  {
    "id": "find-minimum-in-rotated-sorted-array",
    "title": "Find Minimum in Rotated Sorted Array",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Binary Search",
    "entryPoint": "findMin",
    "optimalTime": "O(log N)",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(log n)",
      "logarithmic"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant"
    ],
    "description": "Suppose an array of length `n` sorted in ascending order is rotated between 1 and `n` times. Notice that rotating an array [a[0], a[1], a[2], ..., a[n-1]] 1 time results in the array [a[n-1], a[0], a[1], a[2], ..., a[n-2]].\n\nGiven the sorted rotated array `nums` of unique elements, return the **minimum element** of this array.\n\nYou must write an algorithm that runs in **O(log n)** time.\n\n### Examples:\n**Example 1:**\n- **Input:** `nums = [3,4,5,1,2]`\n- **Output:** `1`\n\n### Constraints:\n- `n == nums.length`\n- `1 <= n <= 5000`\n- All the integers of `nums` are unique.",
    "testCases": [
      {
        "input": [
          [
            3,
            4,
            5,
            1,
            2
          ]
        ],
        "expected": 1
      },
      {
        "input": [
          [
            4,
            5,
            6,
            7,
            0,
            1,
            2
          ]
        ],
        "expected": 0
      },
      {
        "input": [
          [
            11,
            13,
            15,
            17
          ]
        ],
        "expected": 11
      }
    ],
    "editorial": {
      "intuition": "Compare nums[mid] with nums[right]. If mid > right, min is in right half; otherwise in left half.",
      "bruteForce": "Linear scan takes O(N).",
      "optimalApproach": "Binary search narrowing down to the inflection point.",
      "complexityAnalysis": "Time: O(log N), Space: O(1).",
      "edgeCases": [
        "Array not rotated",
        "Single element"
      ]
    },
    "hints": [
      "Compare nums[mid] against nums[right]",
      "If nums[mid] > nums[right], search right half"
    ]
  },
  {
    "id": "reverse-linked-list",
    "title": "Reverse Linked List",
    "difficulty": "EASY",
    "category": "DSA",
    "pattern": "Linked Lists",
    "entryPoint": "reverseList",
    "optimalTime": "O(N)",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(n)",
      "linear"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant"
    ],
    "description": "Given the `head` of a singly linked list, reverse the list, and return the reversed list.\n\n### Requirements:\n1. Reversal must be done in-place in O(1) space.\n2. Must run in linear O(N) time.\n\n### Examples:\n**Example 1:**\n- **Input:** `head = [1,2,3,4,5]`\n- **Output:** `[5,4,3,2,1]`\n\n### Constraints:\n- The number of nodes in the list is the range `[0, 5000]`.\n- `-5000 <= Node.val <= 5000`",
    "testCases": [
      {
        "input": [
          [
            1,
            2,
            3,
            4,
            5
          ]
        ],
        "expected": [
          5,
          4,
          3,
          2,
          1
        ]
      },
      {
        "input": [
          []
        ],
        "expected": []
      }
    ],
    "editorial": {
      "intuition": "Iteratively redirect each node next pointer to point to the previous node.",
      "bruteForce": "Collect values in array and rebuild: O(N) space.",
      "optimalApproach": "Three pointers: prev, curr, nextTemp.",
      "complexityAnalysis": "Time: O(N), Space: O(1).",
      "edgeCases": [
        "Empty list",
        "Single node list"
      ]
    },
    "hints": [
      "Keep track of previous node",
      "Save next pointer before breaking link"
    ]
  },
  {
    "id": "merge-two-sorted-lists",
    "title": "Merge Two Sorted Lists",
    "difficulty": "EASY",
    "category": "DSA",
    "pattern": "Linked Lists",
    "entryPoint": "mergeTwoLists",
    "optimalTime": "O(N + M)",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(n + m)",
      "linear",
      "o(n)"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant"
    ],
    "description": "You are given the heads of two sorted linked lists `list1` and `list2`.\n\nMerge the two lists into one **sorted** list. The list should be made by splicing together the nodes of the first two lists.\n\nReturn the head of the merged linked list.\n\n### Examples:\n**Example 1:**\n- **Input:** `list1 = [1,2,4], list2 = [1,3,4]`\n- **Output:** `[1,1,2,3,4,4]`\n\n### Constraints:\n- The number of nodes in both lists is in the range `[0, 50]`.\n- Both `list1` and `list2` are sorted in non-decreasing order.",
    "testCases": [
      {
        "input": [
          [
            1,
            2,
            4
          ],
          [
            1,
            3,
            4
          ]
        ],
        "expected": [
          1,
          1,
          2,
          3,
          4,
          4
        ]
      },
      {
        "input": [
          [],
          []
        ],
        "expected": []
      }
    ],
    "editorial": {
      "intuition": "Use a dummy head and compare heads of both lists, advancing the smaller one.",
      "bruteForce": "Extract to array, sort, and re-create: O((N+M) log(N+M)).",
      "optimalApproach": "Linear splice using dummy head.",
      "complexityAnalysis": "Time: O(N + M), Space: O(1).",
      "edgeCases": [
        "One list empty",
        "Both lists empty"
      ]
    },
    "hints": [
      "Create a dummy node as starting head",
      "Attach the smaller node and advance"
    ]
  },
  {
    "id": "linked-list-cycle",
    "title": "Linked List Cycle",
    "difficulty": "EASY",
    "category": "DSA",
    "pattern": "Linked Lists",
    "entryPoint": "hasCycle",
    "optimalTime": "O(N)",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(n)",
      "linear"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant"
    ],
    "description": "Given `head`, the head of a linked list, determine if the linked list has a cycle in it.\n\nThere is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the `next` pointer.\n\nReturn `true` if there is a cycle in the linked list. Otherwise, return `false`.\n\n### Requirements:\nCan you solve it using **O(1)** memory?\n\n### Constraints:\n- The number of the nodes in the list is in the range `[0, 10^4]`.\n- `-10^5 <= Node.val <= 10^5`",
    "testCases": [
      {
        "input": [
          "cycle"
        ],
        "expected": true
      }
    ],
    "editorial": {
      "intuition": "Floyd Tortoise and Hare algorithm: slow moves 1 step, fast moves 2 steps. If cycle exists, they must meet.",
      "bruteForce": "Hash set of visited node references: O(N) space.",
      "optimalApproach": "Slow and fast pointer algorithm.",
      "complexityAnalysis": "Time: O(N), Space: O(1).",
      "edgeCases": [
        "Empty list",
        "Single node without cycle",
        "Self-looping node"
      ]
    },
    "hints": [
      "Use two pointers with different speeds",
      "Fast moves 2x faster than slow"
    ]
  },
  {
    "id": "invert-binary-tree",
    "title": "Invert Binary Tree",
    "difficulty": "EASY",
    "category": "DSA",
    "pattern": "Trees",
    "entryPoint": "invertTree",
    "optimalTime": "O(N)",
    "optimalSpace": "O(H)",
    "timeKeywords": [
      "o(n)",
      "linear"
    ],
    "spaceKeywords": [
      "o(h)",
      "o(n)",
      "height of tree"
    ],
    "description": "Given the `root` of a binary tree, invert the tree, and return its root.\n\n### Examples:\n**Example 1:**\n- **Input:** `root = [4,2,7,1,3,6,9]`\n- **Output:** `[4,7,2,9,6,3,1]`\n\n### Constraints:\n- The number of nodes in the tree is in the range `[0, 100]`.\n- `-100 <= Node.val <= 100`",
    "testCases": [
      {
        "input": [
          [
            4,
            2,
            7,
            1,
            3,
            6,
            9
          ]
        ],
        "expected": [
          4,
          7,
          2,
          9,
          6,
          3,
          1
        ]
      }
    ],
    "editorial": {
      "intuition": "Recursively swap left and right subtrees for every node in the tree.",
      "bruteForce": "N/A",
      "optimalApproach": "Post-order or pre-order recursive DFS swapping root.left and root.right.",
      "complexityAnalysis": "Time: O(N), Space: O(H) where H is tree height.",
      "edgeCases": [
        "Null tree",
        "Single node tree"
      ]
    },
    "hints": [
      "Recursively swap left and right children",
      "Base case: root is null"
    ]
  },
  {
    "id": "maximum-depth-of-binary-tree",
    "title": "Maximum Depth of Binary Tree",
    "difficulty": "EASY",
    "category": "DSA",
    "pattern": "Trees",
    "entryPoint": "maxDepth",
    "optimalTime": "O(N)",
    "optimalSpace": "O(H)",
    "timeKeywords": [
      "o(n)",
      "linear"
    ],
    "spaceKeywords": [
      "o(h)",
      "o(n)"
    ],
    "description": "Given the `root` of a binary tree, return its maximum depth.\n\nA binary tree's **maximum depth** is the number of nodes along the longest path from the root node down to the farthest leaf node.\n\n### Examples:\n**Example 1:**\n- **Input:** `root = [3,9,20,null,null,15,7]`\n- **Output:** `3`\n\n### Constraints:\n- The number of nodes in the tree is in the range `[0, 10^4]`.\n- `-100 <= Node.val <= 100`",
    "testCases": [
      {
        "input": [
          [
            3,
            9,
            20,
            null,
            null,
            15,
            7
          ]
        ],
        "expected": 3
      }
    ],
    "editorial": {
      "intuition": "1 + max(depth(left), depth(right)).",
      "bruteForce": "N/A",
      "optimalApproach": "Recursive DFS or level-order BFS queue.",
      "complexityAnalysis": "Time: O(N), Space: O(H).",
      "edgeCases": [
        "Empty tree has depth 0",
        "Skewed linked-list tree"
      ]
    },
    "hints": [
      "Max depth of node = 1 + max(left depth, right depth)"
    ]
  },
  {
    "id": "lowest-common-ancestor-of-a-binary-search-tree",
    "title": "Lowest Common Ancestor of a Binary Search Tree",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Trees",
    "entryPoint": "lowestCommonAncestor",
    "optimalTime": "O(H)",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(h)",
      "o(log n)",
      "height of tree"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant"
    ],
    "description": "Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes in the BST.\n\nAccording to the definition of LCA on Wikipedia: “The lowest common ancestor is defined between two nodes `p` and `q` as the lowest node in `T` that has both `p` and `q` as descendants (where we allow **a node to be a descendant of itself**).”\n\n### Constraints:\n- The number of nodes in the tree is in the range `[2, 10^5]`.\n- All `Node.val` are unique.\n- `p` and `q` will exist in the BST.",
    "testCases": [
      {
        "input": [
          "bst"
        ],
        "expected": true
      }
    ],
    "editorial": {
      "intuition": "Utilize BST ordering: if both p and q are greater than root, go right; if both smaller, go left; otherwise current node is split point (LCA).",
      "bruteForce": "Store paths to p and q: O(N) space.",
      "optimalApproach": "Iterative BST traversal based on node values.",
      "complexityAnalysis": "Time: O(H), Space: O(1).",
      "edgeCases": [
        "p or q is root itself"
      ]
    },
    "hints": [
      "Leverage the BST property",
      "If p and q lie on different sides of root, root is LCA"
    ]
  },
  {
    "id": "climbing-stairs",
    "title": "Climbing Stairs",
    "difficulty": "EASY",
    "category": "DSA",
    "pattern": "Dynamic Programming",
    "entryPoint": "climbStairs",
    "optimalTime": "O(N)",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(n)",
      "linear"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant"
    ],
    "description": "You are climbing a staircase. It takes `n` steps to reach the top.\n\nEach time you can either climb `1` or `2` steps. In how many distinct ways can you climb to the top?\n\n### Examples:\n**Example 1:**\n- **Input:** `n = 2`\n- **Output:** `2`\n- **Explanation:** There are two ways: (1 step + 1 step) or (2 steps).\n\n**Example 2:**\n- **Input:** `n = 3`\n- **Output:** `3`\n- **Explanation:** (1+1+1), (1+2), (2+1).\n\n### Constraints:\n- `1 <= n <= 45`",
    "testCases": [
      {
        "input": [
          2
        ],
        "expected": 2
      },
      {
        "input": [
          3
        ],
        "expected": 3
      },
      {
        "input": [
          5
        ],
        "expected": 8
      }
    ],
    "editorial": {
      "intuition": "dp[i] = dp[i-1] + dp[i-2], identical to Fibonacci numbers.",
      "bruteForce": "Pure recursion takes O(2^N).",
      "optimalApproach": "Bottom-up DP tracking previous two values.",
      "complexityAnalysis": "Time: O(N), Space: O(1).",
      "edgeCases": [
        "n = 1 has 1 way",
        "n = 2 has 2 ways"
      ]
    },
    "hints": [
      "Ways to reach step i = ways(i-1) + ways(i-2)",
      "Save only the last two values"
    ]
  },
  {
    "id": "coin-change",
    "title": "Coin Change",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Dynamic Programming",
    "entryPoint": "coinChange",
    "optimalTime": "O(amount * N)",
    "optimalSpace": "O(amount)",
    "timeKeywords": [
      "o(amount * n)",
      "pseudo-polynomial"
    ],
    "spaceKeywords": [
      "o(amount)"
    ],
    "description": "You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money.\n\nReturn the **fewest number of coins** that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return `-1`.\n\nYou may assume that you have an infinite number of each kind of coin.\n\n### Examples:\n**Example 1:**\n- **Input:** `coins = [1,2,5], amount = 11`\n- **Output:** `3`\n- **Explanation:** 11 = 5 + 5 + 1.\n\n**Example 2:**\n- **Input:** `coins = [2], amount = 3`\n- **Output:** `-1`\n\n### Constraints:\n- `1 <= coins.length <= 12`\n- `1 <= coins[i] <= 2^31 - 1`\n- `0 <= amount <= 10^4`",
    "testCases": [
      {
        "input": [
          [
            1,
            2,
            5
          ],
          11
        ],
        "expected": 3
      },
      {
        "input": [
          [
            2
          ],
          3
        ],
        "expected": -1
      },
      {
        "input": [
          [
            1
          ],
          0
        ],
        "expected": 0
      }
    ],
    "editorial": {
      "intuition": "dp[i] represents minimum coins to form amount i: dp[i] = min(dp[i - coin] + 1).",
      "bruteForce": "Exhaustive search: exponential O(C^A).",
      "optimalApproach": "1D bottom-up DP table initialized with Infinity.",
      "complexityAnalysis": "Time: O(amount * len(coins)), Space: O(amount).",
      "edgeCases": [
        "amount = 0 returns 0",
        "impossible amounts return -1"
      ]
    },
    "hints": [
      "Create an array dp of size amount + 1 initialized to Infinity",
      "dp[0] = 0"
    ]
  },
  {
    "id": "longest-increasing-subsequence",
    "title": "Longest Increasing Subsequence",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Dynamic Programming",
    "entryPoint": "lengthOfLIS",
    "optimalTime": "O(N log N)",
    "optimalSpace": "O(N)",
    "timeKeywords": [
      "o(n log n)",
      "o(n^2)"
    ],
    "spaceKeywords": [
      "o(n)"
    ],
    "description": "Given an integer array `nums`, return the length of the longest **strictly increasing** subsequence.\n\n### Examples:\n**Example 1:**\n- **Input:** `nums = [10,9,2,5,3,7,101,18]`\n- **Output:** `4`\n- **Explanation:** The longest increasing subsequence is [2, 3, 7, 101], therefore the length is 4.\n\n### Constraints:\n- `1 <= nums.length <= 2500`\n- `-10^4 <= nums[i] <= 10^4`",
    "testCases": [
      {
        "input": [
          [
            10,
            9,
            2,
            5,
            3,
            7,
            101,
            18
          ]
        ],
        "expected": 4
      },
      {
        "input": [
          [
            0,
            1,
            0,
            3,
            2,
            3
          ]
        ],
        "expected": 4
      },
      {
        "input": [
          [
            7,
            7,
            7,
            7
          ]
        ],
        "expected": 1
      }
    ],
    "editorial": {
      "intuition": "Patience sorting / binary search on tails array achieves O(N log N).",
      "bruteForce": "O(2^N) all subsequences.",
      "optimalApproach": "Maintain array tails where tails[i] is smallest tail of all LIS of length i+1.",
      "complexityAnalysis": "Time: O(N log N), Space: O(N).",
      "edgeCases": [
        "All equal values has LIS 1",
        "Strictly descending array"
      ]
    },
    "hints": [
      "Can you maintain the smallest tail for each subsequence length?",
      "Binary search into tails array"
    ]
  },
  {
    "id": "number-of-islands",
    "title": "Number of Islands",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Graphs",
    "entryPoint": "numIslands",
    "optimalTime": "O(M * N)",
    "optimalSpace": "O(M * N)",
    "timeKeywords": [
      "o(m * n)",
      "o(m*n)",
      "linear in grid"
    ],
    "spaceKeywords": [
      "o(m * n)",
      "o(m*n)"
    ],
    "description": "Given an `m x n` 2D binary grid `grid` which represents a map of `'1'`s (land) and `'0'`s (water), return the number of islands.\n\nAn **island** is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.\n\n### Examples:\n**Example 1:**\n- **Input:**\n```text\ngrid = [\n  [\"1\",\"1\",\"1\",\"1\",\"0\"],\n  [\"1\",\"1\",\"0\",\"1\",\"0\"],\n  [\"1\",\"1\",\"0\",\"0\",\"0\"],\n  [\"0\",\"0\",\"0\",\"0\",\"0\"]\n]\n```\n- **Output:** `1`\n\n### Constraints:\n- `m == grid.length`, `n == grid[i].length`\n- `1 <= m, n <= 300`\n- `grid[i][j]` is `'0'` or `'1'`.",
    "testCases": [
      {
        "input": [
          [
            [
              "1",
              "1",
              "1",
              "1",
              "0"
            ],
            [
              "1",
              "1",
              "0",
              "1",
              "0"
            ],
            [
              "1",
              "1",
              "0",
              "0",
              "0"
            ],
            [
              "0",
              "0",
              "0",
              "0",
              "0"
            ]
          ]
        ],
        "expected": 1
      }
    ],
    "editorial": {
      "intuition": "Whenever land 1 is encountered, increment island count and sink connected land to 0 using DFS/BFS.",
      "bruteForce": "N/A",
      "optimalApproach": "Connected components via DFS flood-fill in-place.",
      "complexityAnalysis": "Time: O(M * N), Space: O(M * N) recursion stack in worst case.",
      "edgeCases": [
        "Grid with all water",
        "Grid with all land",
        "Single cell"
      ]
    },
    "hints": [
      "Loop over all cells",
      "When grid[r][c] == \"1\", run DFS to visit all adjacent land"
    ]
  },
  {
    "id": "course-schedule",
    "title": "Course Schedule",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Graphs",
    "entryPoint": "canFinish",
    "optimalTime": "O(V + E)",
    "optimalSpace": "O(V + E)",
    "timeKeywords": [
      "o(v + e)",
      "linear in graph"
    ],
    "spaceKeywords": [
      "o(v + e)"
    ],
    "description": "There are a total of `numCourses` courses you have to take, labeled from `0` to `numCourses - 1`. You are given an array `prerequisites` where `prerequisites[i] = [ai, bi]` indicates that you **must** take course `bi` first if you want to take course `ai`.\n\nReturn `true` if you can finish all courses. Otherwise, return `false`.\n\n### Examples:\n**Example 1:**\n- **Input:** `numCourses = 2, prerequisites = [[1,0]]`\n- **Output:** `true`\n\n**Example 2:**\n- **Input:** `numCourses = 2, prerequisites = [[1,0],[0,1]]`\n- **Output:** `false` (Cycle detected)\n\n### Constraints:\n- `1 <= numCourses <= 2000`\n- `0 <= prerequisites.length <= 5000`",
    "testCases": [
      {
        "input": [
          2,
          [
            [
              1,
              0
            ]
          ]
        ],
        "expected": true
      },
      {
        "input": [
          2,
          [
            [
              1,
              0
            ],
            [
              0,
              1
            ]
          ]
        ],
        "expected": false
      }
    ],
    "editorial": {
      "intuition": "Detecting if directed graph has a cycle. If cycle exists, impossible to finish courses.",
      "bruteForce": "N/A",
      "optimalApproach": "Kahn algorithm (BFS topological sort using in-degrees) or DFS 3-color cycle detection.",
      "complexityAnalysis": "Time: O(V + E), Space: O(V + E).",
      "edgeCases": [
        "Disjoint graphs",
        "Self-dependency [0, 0]"
      ]
    },
    "hints": [
      "Model as directed graph",
      "Use topological sort / in-degrees"
    ]
  },
  {
    "id": "in-memory-kv-store",
    "title": "In-Memory Key-Value Store with TTL",
    "difficulty": "MEDIUM",
    "category": "MachineCoding",
    "pattern": "Low-Level Design",
    "entryPoint": "KeyValueStore",
    "optimalTime": "O(1)",
    "optimalSpace": "O(N)",
    "timeKeywords": [
      "o(1)",
      "constant"
    ],
    "spaceKeywords": [
      "o(n)",
      "linear"
    ],
    "description": "Design and implement an in-memory key-value data store that supports saving, retrieving, and expiring keys with TTL.\n\n### Requirements:\n1. `set(key, value, ttlMs)` — Stores key-value. If ttlMs provided, key automatically expires after that many milliseconds.\n2. `get(key)` — Returns value if not expired, otherwise returns null.\n3. `del(key)` — Deletes key; returns boolean indicating if key existed.\n4. `size()` — Returns count of active non-expired keys.",
    "testCases": [
      {
        "input": [
          "kv"
        ],
        "expected": true
      }
    ],
    "editorial": {
      "intuition": "Store { value, expiresAt } in Map. Lazily purge on get/size.",
      "bruteForce": "N/A",
      "optimalApproach": "Hash map with timestamp comparison and optional background cleaner.",
      "complexityAnalysis": "Time: O(1) get/set/del. Space: O(N).",
      "edgeCases": [
        "Zero TTL",
        "Overwriting key resets TTL"
      ]
    },
    "hints": [
      "Store expiration timestamp: Date.now() + ttlMs"
    ]
  },
  {
    "id": "token-bucket-rate-limiter",
    "title": "Token Bucket Rate Limiter",
    "difficulty": "MEDIUM",
    "category": "MachineCoding",
    "pattern": "Low-Level Design",
    "entryPoint": "TokenBucketRateLimiter",
    "optimalTime": "O(1)",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(1)",
      "constant"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant"
    ],
    "description": "Design and implement an API Rate Limiter using the Token Bucket Algorithm.\n\n### Requirements:\n1. `constructor(capacity, refillRatePerSec)`\n2. `allowRequest(tokens)` — Checks if enough tokens exist. If yes, consumes and returns true. Otherwise false.\n3. Automatically refill tokens based on elapsed time without running an active timer loop.",
    "testCases": [
      {
        "input": [
          "tb"
        ],
        "expected": true
      }
    ],
    "editorial": {
      "intuition": "Compute newly refilled tokens on demand: tokens += (now - lastRefill) * rate.",
      "bruteForce": "N/A",
      "optimalApproach": "Lazy time delta computation avoids background polling timers.",
      "complexityAnalysis": "Time: O(1), Space: O(1).",
      "edgeCases": [
        "Tokens capped at bucket capacity"
      ]
    },
    "hints": [
      "Refill tokens lazily using time delta"
    ]
  },
  {
    "id": "subarray-sum-equals-k",
    "title": "Subarray Sum Equals K",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Arrays & Hashing",
    "entryPoint": "subarraySum",
    "optimalTime": "O(N)",
    "optimalSpace": "O(N)",
    "timeKeywords": [
      "o(n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(n)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Subarray Sum Equals K\n\nImplement an optimal solution for **Subarray Sum Equals K**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Subarray Sum Equals K** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N)** time complexity and **O(N)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `subarraySum`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N)\n- **Space Complexity:** O(N)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Arrays & Hashing.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Arrays & Hashing pattern to achieve O(N) runtime.",
      "complexityAnalysis": "Time: O(N), Space: O(N).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Arrays & Hashing.",
      "How does your approach achieve O(N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "longest-consecutive-sequence",
    "title": "Longest Consecutive Sequence",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Arrays & Hashing",
    "entryPoint": "longestConsecutive",
    "optimalTime": "O(N)",
    "optimalSpace": "O(N)",
    "timeKeywords": [
      "o(n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(n)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Longest Consecutive Sequence\n\nImplement an optimal solution for **Longest Consecutive Sequence**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Longest Consecutive Sequence** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N)** time complexity and **O(N)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `longestConsecutive`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N)\n- **Space Complexity:** O(N)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Arrays & Hashing.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Arrays & Hashing pattern to achieve O(N) runtime.",
      "complexityAnalysis": "Time: O(N), Space: O(N).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Arrays & Hashing.",
      "How does your approach achieve O(N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "encode-and-decode-strings",
    "title": "Encode and Decode Strings",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Arrays & Hashing",
    "entryPoint": "Codec",
    "optimalTime": "O(N)",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Encode and Decode Strings\n\nImplement an optimal solution for **Encode and Decode Strings**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Encode and Decode Strings** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N)** time complexity and **O(1)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `Codec`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N)\n- **Space Complexity:** O(1)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Arrays & Hashing.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Arrays & Hashing pattern to achieve O(N) runtime.",
      "complexityAnalysis": "Time: O(N), Space: O(1).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Arrays & Hashing.",
      "How does your approach achieve O(N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "next-permutation",
    "title": "Next Permutation",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Arrays & Hashing",
    "entryPoint": "nextPermutation",
    "optimalTime": "O(N)",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Next Permutation\n\nImplement an optimal solution for **Next Permutation**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Next Permutation** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N)** time complexity and **O(1)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `nextPermutation`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N)\n- **Space Complexity:** O(1)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Arrays & Hashing.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Arrays & Hashing pattern to achieve O(N) runtime.",
      "complexityAnalysis": "Time: O(N), Space: O(1).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Arrays & Hashing.",
      "How does your approach achieve O(N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "rotate-array",
    "title": "Rotate Array",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Arrays & Hashing",
    "entryPoint": "rotate",
    "optimalTime": "O(N)",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Rotate Array\n\nImplement an optimal solution for **Rotate Array**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Rotate Array** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N)** time complexity and **O(1)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `rotate`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N)\n- **Space Complexity:** O(1)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Arrays & Hashing.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Arrays & Hashing pattern to achieve O(N) runtime.",
      "complexityAnalysis": "Time: O(N), Space: O(1).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Arrays & Hashing.",
      "How does your approach achieve O(N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "first-missing-positive",
    "title": "First Missing Positive",
    "difficulty": "HARD",
    "category": "DSA",
    "pattern": "Arrays & Hashing",
    "entryPoint": "firstMissingPositive",
    "optimalTime": "O(N)",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### First Missing Positive\n\nImplement an optimal solution for **First Missing Positive**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **First Missing Positive** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N)** time complexity and **O(1)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `firstMissingPositive`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N)\n- **Space Complexity:** O(1)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Arrays & Hashing.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Arrays & Hashing pattern to achieve O(N) runtime.",
      "complexityAnalysis": "Time: O(N), Space: O(1).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Arrays & Hashing.",
      "How does your approach achieve O(N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "majority-element",
    "title": "Majority Element",
    "difficulty": "EASY",
    "category": "DSA",
    "pattern": "Arrays & Hashing",
    "entryPoint": "majorityElement",
    "optimalTime": "O(N)",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Majority Element\n\nImplement an optimal solution for **Majority Element**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Majority Element** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N)** time complexity and **O(1)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `majorityElement`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N)\n- **Space Complexity:** O(1)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Arrays & Hashing.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Arrays & Hashing pattern to achieve O(N) runtime.",
      "complexityAnalysis": "Time: O(N), Space: O(1).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Arrays & Hashing.",
      "How does your approach achieve O(N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "4sum",
    "title": "4Sum",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Arrays & Hashing",
    "entryPoint": "fourSum",
    "optimalTime": "O(N^3)",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(n^3)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### 4Sum\n\nImplement an optimal solution for **4Sum**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **4Sum** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N^3)** time complexity and **O(1)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `fourSum`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N^3)\n- **Space Complexity:** O(1)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Arrays & Hashing.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Arrays & Hashing pattern to achieve O(N^3) runtime.",
      "complexityAnalysis": "Time: O(N^3), Space: O(1).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Arrays & Hashing.",
      "How does your approach achieve O(N^3) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "continuous-subarray-sum",
    "title": "Continuous Subarray Sum",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Arrays & Hashing",
    "entryPoint": "checkSubarraySum",
    "optimalTime": "O(N)",
    "optimalSpace": "O(N)",
    "timeKeywords": [
      "o(n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(n)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Continuous Subarray Sum\n\nImplement an optimal solution for **Continuous Subarray Sum**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Continuous Subarray Sum** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N)** time complexity and **O(N)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `checkSubarraySum`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N)\n- **Space Complexity:** O(N)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Arrays & Hashing.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Arrays & Hashing pattern to achieve O(N) runtime.",
      "complexityAnalysis": "Time: O(N), Space: O(N).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Arrays & Hashing.",
      "How does your approach achieve O(N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "move-zeroes",
    "title": "Move Zeroes",
    "difficulty": "EASY",
    "category": "DSA",
    "pattern": "Two Pointers",
    "entryPoint": "moveZeroes",
    "optimalTime": "O(N)",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Move Zeroes\n\nImplement an optimal solution for **Move Zeroes**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Move Zeroes** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N)** time complexity and **O(1)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `moveZeroes`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N)\n- **Space Complexity:** O(1)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Two Pointers.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Two Pointers pattern to achieve O(N) runtime.",
      "complexityAnalysis": "Time: O(N), Space: O(1).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Two Pointers.",
      "How does your approach achieve O(N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "sort-colors-dutch-national-flag",
    "title": "Sort Colors (Dutch National Flag)",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Two Pointers",
    "entryPoint": "sortColors",
    "optimalTime": "O(N)",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Sort Colors (Dutch National Flag)\n\nImplement an optimal solution for **Sort Colors (Dutch National Flag)**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Sort Colors (Dutch National Flag)** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N)** time complexity and **O(1)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `sortColors`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N)\n- **Space Complexity:** O(1)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Two Pointers.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Two Pointers pattern to achieve O(N) runtime.",
      "complexityAnalysis": "Time: O(N), Space: O(1).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Two Pointers.",
      "How does your approach achieve O(N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "remove-duplicates-from-sorted-array",
    "title": "Remove Duplicates from Sorted Array",
    "difficulty": "EASY",
    "category": "DSA",
    "pattern": "Two Pointers",
    "entryPoint": "removeDuplicates",
    "optimalTime": "O(N)",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Remove Duplicates from Sorted Array\n\nImplement an optimal solution for **Remove Duplicates from Sorted Array**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Remove Duplicates from Sorted Array** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N)** time complexity and **O(1)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `removeDuplicates`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N)\n- **Space Complexity:** O(1)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Two Pointers.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Two Pointers pattern to achieve O(N) runtime.",
      "complexityAnalysis": "Time: O(N), Space: O(1).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Two Pointers.",
      "How does your approach achieve O(N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "boats-to-save-people",
    "title": "Boats to Save People",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Two Pointers",
    "entryPoint": "numRescueBoats",
    "optimalTime": "O(N log N)",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(n log n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Boats to Save People\n\nImplement an optimal solution for **Boats to Save People**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Boats to Save People** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N log N)** time complexity and **O(1)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `numRescueBoats`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N log N)\n- **Space Complexity:** O(1)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Two Pointers.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Two Pointers pattern to achieve O(N log N) runtime.",
      "complexityAnalysis": "Time: O(N log N), Space: O(1).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Two Pointers.",
      "How does your approach achieve O(N log N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "3sum-closest",
    "title": "3Sum Closest",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Two Pointers",
    "entryPoint": "threeSumClosest",
    "optimalTime": "O(N^2)",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(n^2)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### 3Sum Closest\n\nImplement an optimal solution for **3Sum Closest**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **3Sum Closest** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N^2)** time complexity and **O(1)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `threeSumClosest`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N^2)\n- **Space Complexity:** O(1)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Two Pointers.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Two Pointers pattern to achieve O(N^2) runtime.",
      "complexityAnalysis": "Time: O(N^2), Space: O(1).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Two Pointers.",
      "How does your approach achieve O(N^2) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "longest-repeating-character-replacement",
    "title": "Longest Repeating Character Replacement",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Sliding Window",
    "entryPoint": "characterReplacement",
    "optimalTime": "O(N)",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Longest Repeating Character Replacement\n\nImplement an optimal solution for **Longest Repeating Character Replacement**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Longest Repeating Character Replacement** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N)** time complexity and **O(1)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `characterReplacement`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N)\n- **Space Complexity:** O(1)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Sliding Window.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Sliding Window pattern to achieve O(N) runtime.",
      "complexityAnalysis": "Time: O(N), Space: O(1).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Sliding Window.",
      "How does your approach achieve O(N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "permutation-in-string",
    "title": "Permutation in String",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Sliding Window",
    "entryPoint": "checkInclusion",
    "optimalTime": "O(N)",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Permutation in String\n\nImplement an optimal solution for **Permutation in String**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Permutation in String** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N)** time complexity and **O(1)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `checkInclusion`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N)\n- **Space Complexity:** O(1)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Sliding Window.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Sliding Window pattern to achieve O(N) runtime.",
      "complexityAnalysis": "Time: O(N), Space: O(1).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Sliding Window.",
      "How does your approach achieve O(N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "sliding-window-maximum",
    "title": "Sliding Window Maximum",
    "difficulty": "HARD",
    "category": "DSA",
    "pattern": "Sliding Window",
    "entryPoint": "maxSlidingWindow",
    "optimalTime": "O(N)",
    "optimalSpace": "O(K)",
    "timeKeywords": [
      "o(n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(k)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Sliding Window Maximum\n\nImplement an optimal solution for **Sliding Window Maximum**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Sliding Window Maximum** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N)** time complexity and **O(K)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `maxSlidingWindow`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N)\n- **Space Complexity:** O(K)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Sliding Window.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Sliding Window pattern to achieve O(N) runtime.",
      "complexityAnalysis": "Time: O(N), Space: O(K).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Sliding Window.",
      "How does your approach achieve O(N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "minimum-size-subarray-sum",
    "title": "Minimum Size Subarray Sum",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Sliding Window",
    "entryPoint": "minSubArrayLen",
    "optimalTime": "O(N)",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Minimum Size Subarray Sum\n\nImplement an optimal solution for **Minimum Size Subarray Sum**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Minimum Size Subarray Sum** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N)** time complexity and **O(1)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `minSubArrayLen`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N)\n- **Space Complexity:** O(1)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Sliding Window.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Sliding Window pattern to achieve O(N) runtime.",
      "complexityAnalysis": "Time: O(N), Space: O(1).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Sliding Window.",
      "How does your approach achieve O(N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "fruit-into-baskets",
    "title": "Fruit Into Baskets",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Sliding Window",
    "entryPoint": "totalFruit",
    "optimalTime": "O(N)",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Fruit Into Baskets\n\nImplement an optimal solution for **Fruit Into Baskets**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Fruit Into Baskets** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N)** time complexity and **O(1)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `totalFruit`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N)\n- **Space Complexity:** O(1)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Sliding Window.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Sliding Window pattern to achieve O(N) runtime.",
      "complexityAnalysis": "Time: O(N), Space: O(1).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Sliding Window.",
      "How does your approach achieve O(N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "find-all-anagrams-in-a-string",
    "title": "Find All Anagrams in a String",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Sliding Window",
    "entryPoint": "findAnagrams",
    "optimalTime": "O(N)",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Find All Anagrams in a String\n\nImplement an optimal solution for **Find All Anagrams in a String**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Find All Anagrams in a String** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N)** time complexity and **O(1)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `findAnagrams`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N)\n- **Space Complexity:** O(1)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Sliding Window.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Sliding Window pattern to achieve O(N) runtime.",
      "complexityAnalysis": "Time: O(N), Space: O(1).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Sliding Window.",
      "How does your approach achieve O(N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "evaluate-reverse-polish-notation",
    "title": "Evaluate Reverse Polish Notation",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Stack",
    "entryPoint": "evalRPN",
    "optimalTime": "O(N)",
    "optimalSpace": "O(N)",
    "timeKeywords": [
      "o(n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(n)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Evaluate Reverse Polish Notation\n\nImplement an optimal solution for **Evaluate Reverse Polish Notation**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Evaluate Reverse Polish Notation** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N)** time complexity and **O(N)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `evalRPN`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N)\n- **Space Complexity:** O(N)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Stack.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Stack pattern to achieve O(N) runtime.",
      "complexityAnalysis": "Time: O(N), Space: O(N).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Stack.",
      "How does your approach achieve O(N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "generate-parentheses",
    "title": "Generate Parentheses",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Stack",
    "entryPoint": "generateParenthesis",
    "optimalTime": "O(4^N / sqrt(N))",
    "optimalSpace": "O(N)",
    "timeKeywords": [
      "o(4^n / sqrt(n))",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(n)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Generate Parentheses\n\nImplement an optimal solution for **Generate Parentheses**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Generate Parentheses** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(4^N / sqrt(N))** time complexity and **O(N)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `generateParenthesis`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(4^N / sqrt(N))\n- **Space Complexity:** O(N)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Stack.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Stack pattern to achieve O(4^N / sqrt(N)) runtime.",
      "complexityAnalysis": "Time: O(4^N / sqrt(N)), Space: O(N).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Stack.",
      "How does your approach achieve O(4^N / sqrt(N)) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "largest-rectangle-in-histogram",
    "title": "Largest Rectangle in Histogram",
    "difficulty": "HARD",
    "category": "DSA",
    "pattern": "Stack",
    "entryPoint": "largestRectangleArea",
    "optimalTime": "O(N)",
    "optimalSpace": "O(N)",
    "timeKeywords": [
      "o(n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(n)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Largest Rectangle in Histogram\n\nImplement an optimal solution for **Largest Rectangle in Histogram**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Largest Rectangle in Histogram** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N)** time complexity and **O(N)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `largestRectangleArea`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N)\n- **Space Complexity:** O(N)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Stack.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Stack pattern to achieve O(N) runtime.",
      "complexityAnalysis": "Time: O(N), Space: O(N).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Stack.",
      "How does your approach achieve O(N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "car-fleet",
    "title": "Car Fleet",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Stack",
    "entryPoint": "carFleet",
    "optimalTime": "O(N log N)",
    "optimalSpace": "O(N)",
    "timeKeywords": [
      "o(n log n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(n)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Car Fleet\n\nImplement an optimal solution for **Car Fleet**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Car Fleet** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N log N)** time complexity and **O(N)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `carFleet`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N log N)\n- **Space Complexity:** O(N)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Stack.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Stack pattern to achieve O(N log N) runtime.",
      "complexityAnalysis": "Time: O(N log N), Space: O(N).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Stack.",
      "How does your approach achieve O(N log N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "online-stock-span",
    "title": "Online Stock Span",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Stack",
    "entryPoint": "StockSpanner",
    "optimalTime": "O(1)",
    "optimalSpace": "O(N)",
    "timeKeywords": [
      "o(1)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(n)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Online Stock Span\n\nImplement an optimal solution for **Online Stock Span**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Online Stock Span** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(1)** time complexity and **O(N)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `StockSpanner`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(1)\n- **Space Complexity:** O(N)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Stack.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Stack pattern to achieve O(1) runtime.",
      "complexityAnalysis": "Time: O(1), Space: O(N).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Stack.",
      "How does your approach achieve O(1) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "decode-string",
    "title": "Decode String",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Stack",
    "entryPoint": "decodeString",
    "optimalTime": "O(N)",
    "optimalSpace": "O(N)",
    "timeKeywords": [
      "o(n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(n)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Decode String\n\nImplement an optimal solution for **Decode String**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Decode String** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N)** time complexity and **O(N)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `decodeString`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N)\n- **Space Complexity:** O(N)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Stack.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Stack pattern to achieve O(N) runtime.",
      "complexityAnalysis": "Time: O(N), Space: O(N).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Stack.",
      "How does your approach achieve O(N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "search-a-2d-matrix",
    "title": "Search a 2D Matrix",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Binary Search",
    "entryPoint": "searchMatrix",
    "optimalTime": "O(log(M * N))",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(log(m * n))",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Search a 2D Matrix\n\nImplement an optimal solution for **Search a 2D Matrix**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Search a 2D Matrix** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(log(M * N))** time complexity and **O(1)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `searchMatrix`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(log(M * N))\n- **Space Complexity:** O(1)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Binary Search.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Binary Search pattern to achieve O(log(M * N)) runtime.",
      "complexityAnalysis": "Time: O(log(M * N)), Space: O(1).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Binary Search.",
      "How does your approach achieve O(log(M * N)) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "koko-eating-bananas",
    "title": "Koko Eating Bananas",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Binary Search",
    "entryPoint": "minEatingSpeed",
    "optimalTime": "O(N log(max(P)))",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(n log(max(p)))",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Koko Eating Bananas\n\nImplement an optimal solution for **Koko Eating Bananas**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Koko Eating Bananas** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N log(max(P)))** time complexity and **O(1)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `minEatingSpeed`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N log(max(P)))\n- **Space Complexity:** O(1)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Binary Search.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Binary Search pattern to achieve O(N log(max(P))) runtime.",
      "complexityAnalysis": "Time: O(N log(max(P))), Space: O(1).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Binary Search.",
      "How does your approach achieve O(N log(max(P))) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "time-based-key-value-store",
    "title": "Time Based Key-Value Store",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Binary Search",
    "entryPoint": "TimeMap",
    "optimalTime": "O(log N)",
    "optimalSpace": "O(N)",
    "timeKeywords": [
      "o(log n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(n)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Time Based Key-Value Store\n\nImplement an optimal solution for **Time Based Key-Value Store**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Time Based Key-Value Store** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(log N)** time complexity and **O(N)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `TimeMap`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(log N)\n- **Space Complexity:** O(N)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Binary Search.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Binary Search pattern to achieve O(log N) runtime.",
      "complexityAnalysis": "Time: O(log N), Space: O(N).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Binary Search.",
      "How does your approach achieve O(log N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "median-of-two-sorted-arrays",
    "title": "Median of Two Sorted Arrays",
    "difficulty": "HARD",
    "category": "DSA",
    "pattern": "Binary Search",
    "entryPoint": "findMedianSortedArrays",
    "optimalTime": "O(log(min(M, N)))",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(log(min(m, n)))",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Median of Two Sorted Arrays\n\nImplement an optimal solution for **Median of Two Sorted Arrays**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Median of Two Sorted Arrays** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(log(min(M, N)))** time complexity and **O(1)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `findMedianSortedArrays`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(log(min(M, N)))\n- **Space Complexity:** O(1)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Binary Search.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Binary Search pattern to achieve O(log(min(M, N))) runtime.",
      "complexityAnalysis": "Time: O(log(min(M, N))), Space: O(1).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Binary Search.",
      "How does your approach achieve O(log(min(M, N))) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "find-peak-element",
    "title": "Find Peak Element",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Binary Search",
    "entryPoint": "findPeakElement",
    "optimalTime": "O(log N)",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(log n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Find Peak Element\n\nImplement an optimal solution for **Find Peak Element**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Find Peak Element** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(log N)** time complexity and **O(1)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `findPeakElement`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(log N)\n- **Space Complexity:** O(1)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Binary Search.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Binary Search pattern to achieve O(log N) runtime.",
      "complexityAnalysis": "Time: O(log N), Space: O(1).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Binary Search.",
      "How does your approach achieve O(log N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "capacity-to-ship-packages-within-d-days",
    "title": "Capacity To Ship Packages Within D Days",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Binary Search",
    "entryPoint": "shipWithinDays",
    "optimalTime": "O(N log(sum))",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(n log(sum))",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Capacity To Ship Packages Within D Days\n\nImplement an optimal solution for **Capacity To Ship Packages Within D Days**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Capacity To Ship Packages Within D Days** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N log(sum))** time complexity and **O(1)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `shipWithinDays`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N log(sum))\n- **Space Complexity:** O(1)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Binary Search.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Binary Search pattern to achieve O(N log(sum)) runtime.",
      "complexityAnalysis": "Time: O(N log(sum)), Space: O(1).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Binary Search.",
      "How does your approach achieve O(N log(sum)) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "reorder-list",
    "title": "Reorder List",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Linked Lists",
    "entryPoint": "reorderList",
    "optimalTime": "O(N)",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Reorder List\n\nImplement an optimal solution for **Reorder List**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Reorder List** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N)** time complexity and **O(1)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `reorderList`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N)\n- **Space Complexity:** O(1)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Linked Lists.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Linked Lists pattern to achieve O(N) runtime.",
      "complexityAnalysis": "Time: O(N), Space: O(1).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Linked Lists.",
      "How does your approach achieve O(N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "remove-nth-node-from-end-of-list",
    "title": "Remove Nth Node From End of List",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Linked Lists",
    "entryPoint": "removeNthFromEnd",
    "optimalTime": "O(N)",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Remove Nth Node From End of List\n\nImplement an optimal solution for **Remove Nth Node From End of List**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Remove Nth Node From End of List** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N)** time complexity and **O(1)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `removeNthFromEnd`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N)\n- **Space Complexity:** O(1)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Linked Lists.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Linked Lists pattern to achieve O(N) runtime.",
      "complexityAnalysis": "Time: O(N), Space: O(1).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Linked Lists.",
      "How does your approach achieve O(N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "copy-list-with-random-pointer",
    "title": "Copy List with Random Pointer",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Linked Lists",
    "entryPoint": "copyRandomList",
    "optimalTime": "O(N)",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Copy List with Random Pointer\n\nImplement an optimal solution for **Copy List with Random Pointer**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Copy List with Random Pointer** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N)** time complexity and **O(1)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `copyRandomList`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N)\n- **Space Complexity:** O(1)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Linked Lists.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Linked Lists pattern to achieve O(N) runtime.",
      "complexityAnalysis": "Time: O(N), Space: O(1).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Linked Lists.",
      "How does your approach achieve O(N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "add-two-numbers",
    "title": "Add Two Numbers",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Linked Lists",
    "entryPoint": "addTwoNumbers",
    "optimalTime": "O(max(N, M))",
    "optimalSpace": "O(max(N, M))",
    "timeKeywords": [
      "o(max(n, m))",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(max(n, m))",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Add Two Numbers\n\nImplement an optimal solution for **Add Two Numbers**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Add Two Numbers** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(max(N, M))** time complexity and **O(max(N, M))** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `addTwoNumbers`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(max(N, M))\n- **Space Complexity:** O(max(N, M))",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Linked Lists.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Linked Lists pattern to achieve O(max(N, M)) runtime.",
      "complexityAnalysis": "Time: O(max(N, M)), Space: O(max(N, M)).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Linked Lists.",
      "How does your approach achieve O(max(N, M)) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "linked-list-cycle-ii",
    "title": "Linked List Cycle II",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Linked Lists",
    "entryPoint": "detectCycle",
    "optimalTime": "O(N)",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Linked List Cycle II\n\nImplement an optimal solution for **Linked List Cycle II**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Linked List Cycle II** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N)** time complexity and **O(1)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `detectCycle`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N)\n- **Space Complexity:** O(1)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Linked Lists.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Linked Lists pattern to achieve O(N) runtime.",
      "complexityAnalysis": "Time: O(N), Space: O(1).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Linked Lists.",
      "How does your approach achieve O(N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "find-the-duplicate-number-floyd-cycle",
    "title": "Find the Duplicate Number (Floyd Cycle)",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Linked Lists",
    "entryPoint": "findDuplicate",
    "optimalTime": "O(N)",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Find the Duplicate Number (Floyd Cycle)\n\nImplement an optimal solution for **Find the Duplicate Number (Floyd Cycle)**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Find the Duplicate Number (Floyd Cycle)** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N)** time complexity and **O(1)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `findDuplicate`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N)\n- **Space Complexity:** O(1)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Linked Lists.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Linked Lists pattern to achieve O(N) runtime.",
      "complexityAnalysis": "Time: O(N), Space: O(1).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Linked Lists.",
      "How does your approach achieve O(N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "lru-cache",
    "title": "LRU Cache",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Linked Lists",
    "entryPoint": "LRUCache",
    "optimalTime": "O(1)",
    "optimalSpace": "O(capacity)",
    "timeKeywords": [
      "o(1)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(capacity)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### LRU Cache\n\nImplement an optimal solution for **LRU Cache**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **LRU Cache** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(1)** time complexity and **O(capacity)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `LRUCache`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(1)\n- **Space Complexity:** O(capacity)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Linked Lists.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Linked Lists pattern to achieve O(1) runtime.",
      "complexityAnalysis": "Time: O(1), Space: O(capacity).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Linked Lists.",
      "How does your approach achieve O(1) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "merge-k-sorted-lists",
    "title": "Merge k Sorted Lists",
    "difficulty": "HARD",
    "category": "DSA",
    "pattern": "Linked Lists",
    "entryPoint": "mergeKLists",
    "optimalTime": "O(N log K)",
    "optimalSpace": "O(K)",
    "timeKeywords": [
      "o(n log k)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(k)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Merge k Sorted Lists\n\nImplement an optimal solution for **Merge k Sorted Lists**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Merge k Sorted Lists** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N log K)** time complexity and **O(K)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `mergeKLists`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N log K)\n- **Space Complexity:** O(K)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Linked Lists.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Linked Lists pattern to achieve O(N log K) runtime.",
      "complexityAnalysis": "Time: O(N log K), Space: O(K).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Linked Lists.",
      "How does your approach achieve O(N log K) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "diameter-of-binary-tree",
    "title": "Diameter of Binary Tree",
    "difficulty": "EASY",
    "category": "DSA",
    "pattern": "Trees",
    "entryPoint": "diameterOfBinaryTree",
    "optimalTime": "O(N)",
    "optimalSpace": "O(H)",
    "timeKeywords": [
      "o(n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(h)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Diameter of Binary Tree\n\nImplement an optimal solution for **Diameter of Binary Tree**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Diameter of Binary Tree** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N)** time complexity and **O(H)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `diameterOfBinaryTree`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N)\n- **Space Complexity:** O(H)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Trees.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Trees pattern to achieve O(N) runtime.",
      "complexityAnalysis": "Time: O(N), Space: O(H).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Trees.",
      "How does your approach achieve O(N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "balanced-binary-tree",
    "title": "Balanced Binary Tree",
    "difficulty": "EASY",
    "category": "DSA",
    "pattern": "Trees",
    "entryPoint": "isBalanced",
    "optimalTime": "O(N)",
    "optimalSpace": "O(H)",
    "timeKeywords": [
      "o(n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(h)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Balanced Binary Tree\n\nImplement an optimal solution for **Balanced Binary Tree**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Balanced Binary Tree** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N)** time complexity and **O(H)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `isBalanced`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N)\n- **Space Complexity:** O(H)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Trees.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Trees pattern to achieve O(N) runtime.",
      "complexityAnalysis": "Time: O(N), Space: O(H).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Trees.",
      "How does your approach achieve O(N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "same-tree",
    "title": "Same Tree",
    "difficulty": "EASY",
    "category": "DSA",
    "pattern": "Trees",
    "entryPoint": "isSameTree",
    "optimalTime": "O(N)",
    "optimalSpace": "O(H)",
    "timeKeywords": [
      "o(n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(h)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Same Tree\n\nImplement an optimal solution for **Same Tree**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Same Tree** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N)** time complexity and **O(H)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `isSameTree`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N)\n- **Space Complexity:** O(H)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Trees.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Trees pattern to achieve O(N) runtime.",
      "complexityAnalysis": "Time: O(N), Space: O(H).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Trees.",
      "How does your approach achieve O(N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "subtree-of-another-tree",
    "title": "Subtree of Another Tree",
    "difficulty": "EASY",
    "category": "DSA",
    "pattern": "Trees",
    "entryPoint": "isSubtree",
    "optimalTime": "O(N * M)",
    "optimalSpace": "O(H)",
    "timeKeywords": [
      "o(n * m)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(h)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Subtree of Another Tree\n\nImplement an optimal solution for **Subtree of Another Tree**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Subtree of Another Tree** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N * M)** time complexity and **O(H)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `isSubtree`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N * M)\n- **Space Complexity:** O(H)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Trees.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Trees pattern to achieve O(N * M) runtime.",
      "complexityAnalysis": "Time: O(N * M), Space: O(H).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Trees.",
      "How does your approach achieve O(N * M) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "binary-tree-level-order-traversal",
    "title": "Binary Tree Level Order Traversal",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Trees",
    "entryPoint": "levelOrder",
    "optimalTime": "O(N)",
    "optimalSpace": "O(N)",
    "timeKeywords": [
      "o(n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(n)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Binary Tree Level Order Traversal\n\nImplement an optimal solution for **Binary Tree Level Order Traversal**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Binary Tree Level Order Traversal** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N)** time complexity and **O(N)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `levelOrder`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N)\n- **Space Complexity:** O(N)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Trees.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Trees pattern to achieve O(N) runtime.",
      "complexityAnalysis": "Time: O(N), Space: O(N).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Trees.",
      "How does your approach achieve O(N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "binary-tree-right-side-view",
    "title": "Binary Tree Right Side View",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Trees",
    "entryPoint": "rightSideView",
    "optimalTime": "O(N)",
    "optimalSpace": "O(H)",
    "timeKeywords": [
      "o(n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(h)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Binary Tree Right Side View\n\nImplement an optimal solution for **Binary Tree Right Side View**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Binary Tree Right Side View** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N)** time complexity and **O(H)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `rightSideView`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N)\n- **Space Complexity:** O(H)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Trees.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Trees pattern to achieve O(N) runtime.",
      "complexityAnalysis": "Time: O(N), Space: O(H).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Trees.",
      "How does your approach achieve O(N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "count-good-nodes-in-binary-tree",
    "title": "Count Good Nodes in Binary Tree",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Trees",
    "entryPoint": "goodNodes",
    "optimalTime": "O(N)",
    "optimalSpace": "O(H)",
    "timeKeywords": [
      "o(n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(h)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Count Good Nodes in Binary Tree\n\nImplement an optimal solution for **Count Good Nodes in Binary Tree**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Count Good Nodes in Binary Tree** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N)** time complexity and **O(H)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `goodNodes`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N)\n- **Space Complexity:** O(H)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Trees.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Trees pattern to achieve O(N) runtime.",
      "complexityAnalysis": "Time: O(N), Space: O(H).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Trees.",
      "How does your approach achieve O(N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "validate-binary-search-tree",
    "title": "Validate Binary Search Tree",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Trees",
    "entryPoint": "isValidBST",
    "optimalTime": "O(N)",
    "optimalSpace": "O(H)",
    "timeKeywords": [
      "o(n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(h)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Validate Binary Search Tree\n\nImplement an optimal solution for **Validate Binary Search Tree**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Validate Binary Search Tree** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N)** time complexity and **O(H)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `isValidBST`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N)\n- **Space Complexity:** O(H)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Trees.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Trees pattern to achieve O(N) runtime.",
      "complexityAnalysis": "Time: O(N), Space: O(H).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Trees.",
      "How does your approach achieve O(N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "kth-smallest-element-in-a-bst",
    "title": "Kth Smallest Element in a BST",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Trees",
    "entryPoint": "kthSmallest",
    "optimalTime": "O(H + K)",
    "optimalSpace": "O(H)",
    "timeKeywords": [
      "o(h + k)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(h)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Kth Smallest Element in a BST\n\nImplement an optimal solution for **Kth Smallest Element in a BST**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Kth Smallest Element in a BST** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(H + K)** time complexity and **O(H)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `kthSmallest`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(H + K)\n- **Space Complexity:** O(H)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Trees.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Trees pattern to achieve O(H + K) runtime.",
      "complexityAnalysis": "Time: O(H + K), Space: O(H).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Trees.",
      "How does your approach achieve O(H + K) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "construct-binary-tree-from-preorder-and-inorder-traversal",
    "title": "Construct Binary Tree from Preorder and Inorder Traversal",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Trees",
    "entryPoint": "buildTree",
    "optimalTime": "O(N)",
    "optimalSpace": "O(N)",
    "timeKeywords": [
      "o(n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(n)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Construct Binary Tree from Preorder and Inorder Traversal\n\nImplement an optimal solution for **Construct Binary Tree from Preorder and Inorder Traversal**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Construct Binary Tree from Preorder and Inorder Traversal** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N)** time complexity and **O(N)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `buildTree`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N)\n- **Space Complexity:** O(N)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Trees.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Trees pattern to achieve O(N) runtime.",
      "complexityAnalysis": "Time: O(N), Space: O(N).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Trees.",
      "How does your approach achieve O(N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "binary-tree-maximum-path-sum",
    "title": "Binary Tree Maximum Path Sum",
    "difficulty": "HARD",
    "category": "DSA",
    "pattern": "Trees",
    "entryPoint": "maxPathSum",
    "optimalTime": "O(N)",
    "optimalSpace": "O(H)",
    "timeKeywords": [
      "o(n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(h)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Binary Tree Maximum Path Sum\n\nImplement an optimal solution for **Binary Tree Maximum Path Sum**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Binary Tree Maximum Path Sum** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N)** time complexity and **O(H)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `maxPathSum`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N)\n- **Space Complexity:** O(H)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Trees.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Trees pattern to achieve O(N) runtime.",
      "complexityAnalysis": "Time: O(N), Space: O(H).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Trees.",
      "How does your approach achieve O(N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "serialize-and-deserialize-binary-tree",
    "title": "Serialize and Deserialize Binary Tree",
    "difficulty": "HARD",
    "category": "DSA",
    "pattern": "Trees",
    "entryPoint": "Codec",
    "optimalTime": "O(N)",
    "optimalSpace": "O(N)",
    "timeKeywords": [
      "o(n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(n)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Serialize and Deserialize Binary Tree\n\nImplement an optimal solution for **Serialize and Deserialize Binary Tree**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Serialize and Deserialize Binary Tree** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N)** time complexity and **O(N)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `Codec`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N)\n- **Space Complexity:** O(N)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Trees.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Trees pattern to achieve O(N) runtime.",
      "complexityAnalysis": "Time: O(N), Space: O(N).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Trees.",
      "How does your approach achieve O(N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "implement-trie-prefix-tree",
    "title": "Implement Trie (Prefix Tree)",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Tries",
    "entryPoint": "Trie",
    "optimalTime": "O(word length)",
    "optimalSpace": "O(total characters)",
    "timeKeywords": [
      "o(word length)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(total characters)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Implement Trie (Prefix Tree)\n\nImplement an optimal solution for **Implement Trie (Prefix Tree)**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Implement Trie (Prefix Tree)** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(word length)** time complexity and **O(total characters)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `Trie`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(word length)\n- **Space Complexity:** O(total characters)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Tries.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Tries pattern to achieve O(word length) runtime.",
      "complexityAnalysis": "Time: O(word length), Space: O(total characters).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Tries.",
      "How does your approach achieve O(word length) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "design-add-and-search-words-data-structure",
    "title": "Design Add and Search Words Data Structure",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Tries",
    "entryPoint": "WordDictionary",
    "optimalTime": "O(M)",
    "optimalSpace": "O(total chars)",
    "timeKeywords": [
      "o(m)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(total chars)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Design Add and Search Words Data Structure\n\nImplement an optimal solution for **Design Add and Search Words Data Structure**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Design Add and Search Words Data Structure** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(M)** time complexity and **O(total chars)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `WordDictionary`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(M)\n- **Space Complexity:** O(total chars)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Tries.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Tries pattern to achieve O(M) runtime.",
      "complexityAnalysis": "Time: O(M), Space: O(total chars).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Tries.",
      "How does your approach achieve O(M) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "word-search-ii",
    "title": "Word Search II",
    "difficulty": "HARD",
    "category": "DSA",
    "pattern": "Tries",
    "entryPoint": "findWords",
    "optimalTime": "O(M * (4^L))",
    "optimalSpace": "O(total characters)",
    "timeKeywords": [
      "o(m * (4^l))",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(total characters)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Word Search II\n\nImplement an optimal solution for **Word Search II**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Word Search II** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(M * (4^L))** time complexity and **O(total characters)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `findWords`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(M * (4^L))\n- **Space Complexity:** O(total characters)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Tries.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Tries pattern to achieve O(M * (4^L)) runtime.",
      "complexityAnalysis": "Time: O(M * (4^L)), Space: O(total characters).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Tries.",
      "How does your approach achieve O(M * (4^L)) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "kth-largest-element-in-an-array",
    "title": "Kth Largest Element in an Array",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Heap",
    "entryPoint": "findKthLargest",
    "optimalTime": "O(N log K)",
    "optimalSpace": "O(K)",
    "timeKeywords": [
      "o(n log k)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(k)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Kth Largest Element in an Array\n\nImplement an optimal solution for **Kth Largest Element in an Array**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Kth Largest Element in an Array** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N log K)** time complexity and **O(K)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `findKthLargest`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N log K)\n- **Space Complexity:** O(K)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Heap.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Heap pattern to achieve O(N log K) runtime.",
      "complexityAnalysis": "Time: O(N log K), Space: O(K).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Heap.",
      "How does your approach achieve O(N log K) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "last-stone-weight",
    "title": "Last Stone Weight",
    "difficulty": "EASY",
    "category": "DSA",
    "pattern": "Heap",
    "entryPoint": "lastStoneWeight",
    "optimalTime": "O(N log N)",
    "optimalSpace": "O(N)",
    "timeKeywords": [
      "o(n log n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(n)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Last Stone Weight\n\nImplement an optimal solution for **Last Stone Weight**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Last Stone Weight** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N log N)** time complexity and **O(N)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `lastStoneWeight`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N log N)\n- **Space Complexity:** O(N)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Heap.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Heap pattern to achieve O(N log N) runtime.",
      "complexityAnalysis": "Time: O(N log N), Space: O(N).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Heap.",
      "How does your approach achieve O(N log N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "k-closest-points-to-origin",
    "title": "K Closest Points to Origin",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Heap",
    "entryPoint": "kClosest",
    "optimalTime": "O(N log K)",
    "optimalSpace": "O(K)",
    "timeKeywords": [
      "o(n log k)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(k)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### K Closest Points to Origin\n\nImplement an optimal solution for **K Closest Points to Origin**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **K Closest Points to Origin** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N log K)** time complexity and **O(K)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `kClosest`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N log K)\n- **Space Complexity:** O(K)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Heap.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Heap pattern to achieve O(N log K) runtime.",
      "complexityAnalysis": "Time: O(N log K), Space: O(K).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Heap.",
      "How does your approach achieve O(N log K) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "task-scheduler",
    "title": "Task Scheduler",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Heap",
    "entryPoint": "leastInterval",
    "optimalTime": "O(N)",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Task Scheduler\n\nImplement an optimal solution for **Task Scheduler**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Task Scheduler** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N)** time complexity and **O(1)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `leastInterval`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N)\n- **Space Complexity:** O(1)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Heap.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Heap pattern to achieve O(N) runtime.",
      "complexityAnalysis": "Time: O(N), Space: O(1).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Heap.",
      "How does your approach achieve O(N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "design-twitter",
    "title": "Design Twitter",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Heap",
    "entryPoint": "Twitter",
    "optimalTime": "O(k log k)",
    "optimalSpace": "O(users)",
    "timeKeywords": [
      "o(k log k)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(users)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Design Twitter\n\nImplement an optimal solution for **Design Twitter**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Design Twitter** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(k log k)** time complexity and **O(users)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `Twitter`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(k log k)\n- **Space Complexity:** O(users)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Heap.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Heap pattern to achieve O(k log k) runtime.",
      "complexityAnalysis": "Time: O(k log k), Space: O(users).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Heap.",
      "How does your approach achieve O(k log k) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "find-median-from-data-stream",
    "title": "Find Median from Data Stream",
    "difficulty": "HARD",
    "category": "DSA",
    "pattern": "Heap",
    "entryPoint": "MedianFinder",
    "optimalTime": "O(log N)",
    "optimalSpace": "O(N)",
    "timeKeywords": [
      "o(log n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(n)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Find Median from Data Stream\n\nImplement an optimal solution for **Find Median from Data Stream**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Find Median from Data Stream** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(log N)** time complexity and **O(N)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `MedianFinder`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(log N)\n- **Space Complexity:** O(N)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Heap.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Heap pattern to achieve O(log N) runtime.",
      "complexityAnalysis": "Time: O(log N), Space: O(N).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Heap.",
      "How does your approach achieve O(log N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "subsets",
    "title": "Subsets",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Backtracking",
    "entryPoint": "subsets",
    "optimalTime": "O(2^N)",
    "optimalSpace": "O(N)",
    "timeKeywords": [
      "o(2^n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(n)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Subsets\n\nImplement an optimal solution for **Subsets**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Subsets** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(2^N)** time complexity and **O(N)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `subsets`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(2^N)\n- **Space Complexity:** O(N)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Backtracking.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Backtracking pattern to achieve O(2^N) runtime.",
      "complexityAnalysis": "Time: O(2^N), Space: O(N).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Backtracking.",
      "How does your approach achieve O(2^N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "combination-sum",
    "title": "Combination Sum",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Backtracking",
    "entryPoint": "combinationSum",
    "optimalTime": "O(2^target)",
    "optimalSpace": "O(target)",
    "timeKeywords": [
      "o(2^target)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(target)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Combination Sum\n\nImplement an optimal solution for **Combination Sum**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Combination Sum** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(2^target)** time complexity and **O(target)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `combinationSum`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(2^target)\n- **Space Complexity:** O(target)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Backtracking.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Backtracking pattern to achieve O(2^target) runtime.",
      "complexityAnalysis": "Time: O(2^target), Space: O(target).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Backtracking.",
      "How does your approach achieve O(2^target) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "permutations",
    "title": "Permutations",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Backtracking",
    "entryPoint": "permute",
    "optimalTime": "O(N!)",
    "optimalSpace": "O(N)",
    "timeKeywords": [
      "o(n!)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(n)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Permutations\n\nImplement an optimal solution for **Permutations**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Permutations** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N!)** time complexity and **O(N)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `permute`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N!)\n- **Space Complexity:** O(N)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Backtracking.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Backtracking pattern to achieve O(N!) runtime.",
      "complexityAnalysis": "Time: O(N!), Space: O(N).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Backtracking.",
      "How does your approach achieve O(N!) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "subsets-ii",
    "title": "Subsets II",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Backtracking",
    "entryPoint": "subsetsWithDup",
    "optimalTime": "O(2^N)",
    "optimalSpace": "O(N)",
    "timeKeywords": [
      "o(2^n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(n)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Subsets II\n\nImplement an optimal solution for **Subsets II**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Subsets II** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(2^N)** time complexity and **O(N)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `subsetsWithDup`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(2^N)\n- **Space Complexity:** O(N)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Backtracking.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Backtracking pattern to achieve O(2^N) runtime.",
      "complexityAnalysis": "Time: O(2^N), Space: O(N).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Backtracking.",
      "How does your approach achieve O(2^N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "combination-sum-ii",
    "title": "Combination Sum II",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Backtracking",
    "entryPoint": "combinationSum2",
    "optimalTime": "O(2^N)",
    "optimalSpace": "O(N)",
    "timeKeywords": [
      "o(2^n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(n)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Combination Sum II\n\nImplement an optimal solution for **Combination Sum II**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Combination Sum II** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(2^N)** time complexity and **O(N)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `combinationSum2`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(2^N)\n- **Space Complexity:** O(N)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Backtracking.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Backtracking pattern to achieve O(2^N) runtime.",
      "complexityAnalysis": "Time: O(2^N), Space: O(N).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Backtracking.",
      "How does your approach achieve O(2^N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "word-search",
    "title": "Word Search",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Backtracking",
    "entryPoint": "exist",
    "optimalTime": "O(N * 4^L)",
    "optimalSpace": "O(L)",
    "timeKeywords": [
      "o(n * 4^l)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(l)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Word Search\n\nImplement an optimal solution for **Word Search**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Word Search** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N * 4^L)** time complexity and **O(L)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `exist`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N * 4^L)\n- **Space Complexity:** O(L)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Backtracking.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Backtracking pattern to achieve O(N * 4^L) runtime.",
      "complexityAnalysis": "Time: O(N * 4^L), Space: O(L).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Backtracking.",
      "How does your approach achieve O(N * 4^L) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "palindrome-partitioning",
    "title": "Palindrome Partitioning",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Backtracking",
    "entryPoint": "partition",
    "optimalTime": "O(N * 2^N)",
    "optimalSpace": "O(N)",
    "timeKeywords": [
      "o(n * 2^n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(n)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Palindrome Partitioning\n\nImplement an optimal solution for **Palindrome Partitioning**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Palindrome Partitioning** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N * 2^N)** time complexity and **O(N)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `partition`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N * 2^N)\n- **Space Complexity:** O(N)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Backtracking.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Backtracking pattern to achieve O(N * 2^N) runtime.",
      "complexityAnalysis": "Time: O(N * 2^N), Space: O(N).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Backtracking.",
      "How does your approach achieve O(N * 2^N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "letter-combinations-of-a-phone-number",
    "title": "Letter Combinations of a Phone Number",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Backtracking",
    "entryPoint": "letterCombinations",
    "optimalTime": "O(4^N)",
    "optimalSpace": "O(N)",
    "timeKeywords": [
      "o(4^n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(n)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Letter Combinations of a Phone Number\n\nImplement an optimal solution for **Letter Combinations of a Phone Number**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Letter Combinations of a Phone Number** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(4^N)** time complexity and **O(N)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `letterCombinations`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(4^N)\n- **Space Complexity:** O(N)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Backtracking.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Backtracking pattern to achieve O(4^N) runtime.",
      "complexityAnalysis": "Time: O(4^N), Space: O(N).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Backtracking.",
      "How does your approach achieve O(4^N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "n-queens",
    "title": "N-Queens",
    "difficulty": "HARD",
    "category": "DSA",
    "pattern": "Backtracking",
    "entryPoint": "solveNQueens",
    "optimalTime": "O(N!)",
    "optimalSpace": "O(N)",
    "timeKeywords": [
      "o(n!)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(n)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### N-Queens\n\nImplement an optimal solution for **N-Queens**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **N-Queens** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N!)** time complexity and **O(N)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `solveNQueens`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N!)\n- **Space Complexity:** O(N)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Backtracking.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Backtracking pattern to achieve O(N!) runtime.",
      "complexityAnalysis": "Time: O(N!), Space: O(N).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Backtracking.",
      "How does your approach achieve O(N!) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "max-area-of-island",
    "title": "Max Area of Island",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Graphs",
    "entryPoint": "maxAreaOfIsland",
    "optimalTime": "O(M * N)",
    "optimalSpace": "O(M * N)",
    "timeKeywords": [
      "o(m * n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(m * n)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Max Area of Island\n\nImplement an optimal solution for **Max Area of Island**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Max Area of Island** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(M * N)** time complexity and **O(M * N)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `maxAreaOfIsland`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(M * N)\n- **Space Complexity:** O(M * N)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Graphs.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Graphs pattern to achieve O(M * N) runtime.",
      "complexityAnalysis": "Time: O(M * N), Space: O(M * N).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Graphs.",
      "How does your approach achieve O(M * N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "clone-graph",
    "title": "Clone Graph",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Graphs",
    "entryPoint": "cloneGraph",
    "optimalTime": "O(V + E)",
    "optimalSpace": "O(V)",
    "timeKeywords": [
      "o(v + e)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(v)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Clone Graph\n\nImplement an optimal solution for **Clone Graph**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Clone Graph** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(V + E)** time complexity and **O(V)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `cloneGraph`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(V + E)\n- **Space Complexity:** O(V)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Graphs.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Graphs pattern to achieve O(V + E) runtime.",
      "complexityAnalysis": "Time: O(V + E), Space: O(V).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Graphs.",
      "How does your approach achieve O(V + E) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "pacific-atlantic-water-flow",
    "title": "Pacific Atlantic Water Flow",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Graphs",
    "entryPoint": "pacificAtlantic",
    "optimalTime": "O(M * N)",
    "optimalSpace": "O(M * N)",
    "timeKeywords": [
      "o(m * n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(m * n)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Pacific Atlantic Water Flow\n\nImplement an optimal solution for **Pacific Atlantic Water Flow**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Pacific Atlantic Water Flow** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(M * N)** time complexity and **O(M * N)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `pacificAtlantic`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(M * N)\n- **Space Complexity:** O(M * N)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Graphs.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Graphs pattern to achieve O(M * N) runtime.",
      "complexityAnalysis": "Time: O(M * N), Space: O(M * N).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Graphs.",
      "How does your approach achieve O(M * N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "surrounded-regions",
    "title": "Surrounded Regions",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Graphs",
    "entryPoint": "solve",
    "optimalTime": "O(M * N)",
    "optimalSpace": "O(M * N)",
    "timeKeywords": [
      "o(m * n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(m * n)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Surrounded Regions\n\nImplement an optimal solution for **Surrounded Regions**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Surrounded Regions** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(M * N)** time complexity and **O(M * N)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `solve`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(M * N)\n- **Space Complexity:** O(M * N)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Graphs.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Graphs pattern to achieve O(M * N) runtime.",
      "complexityAnalysis": "Time: O(M * N), Space: O(M * N).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Graphs.",
      "How does your approach achieve O(M * N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "rotting-oranges",
    "title": "Rotting Oranges",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Graphs",
    "entryPoint": "orangesRotting",
    "optimalTime": "O(M * N)",
    "optimalSpace": "O(M * N)",
    "timeKeywords": [
      "o(m * n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(m * n)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Rotting Oranges\n\nImplement an optimal solution for **Rotting Oranges**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Rotting Oranges** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(M * N)** time complexity and **O(M * N)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `orangesRotting`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(M * N)\n- **Space Complexity:** O(M * N)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Graphs.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Graphs pattern to achieve O(M * N) runtime.",
      "complexityAnalysis": "Time: O(M * N), Space: O(M * N).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Graphs.",
      "How does your approach achieve O(M * N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "walls-and-gates",
    "title": "Walls and Gates",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Graphs",
    "entryPoint": "wallsAndGates",
    "optimalTime": "O(M * N)",
    "optimalSpace": "O(M * N)",
    "timeKeywords": [
      "o(m * n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(m * n)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Walls and Gates\n\nImplement an optimal solution for **Walls and Gates**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Walls and Gates** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(M * N)** time complexity and **O(M * N)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `wallsAndGates`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(M * N)\n- **Space Complexity:** O(M * N)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Graphs.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Graphs pattern to achieve O(M * N) runtime.",
      "complexityAnalysis": "Time: O(M * N), Space: O(M * N).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Graphs.",
      "How does your approach achieve O(M * N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "course-schedule-ii",
    "title": "Course Schedule II",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Graphs",
    "entryPoint": "findOrder",
    "optimalTime": "O(V + E)",
    "optimalSpace": "O(V + E)",
    "timeKeywords": [
      "o(v + e)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(v + e)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Course Schedule II\n\nImplement an optimal solution for **Course Schedule II**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Course Schedule II** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(V + E)** time complexity and **O(V + E)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `findOrder`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(V + E)\n- **Space Complexity:** O(V + E)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Graphs.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Graphs pattern to achieve O(V + E) runtime.",
      "complexityAnalysis": "Time: O(V + E), Space: O(V + E).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Graphs.",
      "How does your approach achieve O(V + E) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "redundant-connection",
    "title": "Redundant Connection",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Graphs",
    "entryPoint": "findRedundantConnection",
    "optimalTime": "O(V)",
    "optimalSpace": "O(V)",
    "timeKeywords": [
      "o(v)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(v)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Redundant Connection\n\nImplement an optimal solution for **Redundant Connection**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Redundant Connection** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(V)** time complexity and **O(V)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `findRedundantConnection`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(V)\n- **Space Complexity:** O(V)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Graphs.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Graphs pattern to achieve O(V) runtime.",
      "complexityAnalysis": "Time: O(V), Space: O(V).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Graphs.",
      "How does your approach achieve O(V) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "word-ladder",
    "title": "Word Ladder",
    "difficulty": "HARD",
    "category": "DSA",
    "pattern": "Graphs",
    "entryPoint": "ladderLength",
    "optimalTime": "O(M * N * L)",
    "optimalSpace": "O(M * N)",
    "timeKeywords": [
      "o(m * n * l)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(m * n)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Word Ladder\n\nImplement an optimal solution for **Word Ladder**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Word Ladder** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(M * N * L)** time complexity and **O(M * N)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `ladderLength`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(M * N * L)\n- **Space Complexity:** O(M * N)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Graphs.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Graphs pattern to achieve O(M * N * L) runtime.",
      "complexityAnalysis": "Time: O(M * N * L), Space: O(M * N).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Graphs.",
      "How does your approach achieve O(M * N * L) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "min-cost-climbing-stairs",
    "title": "Min Cost Climbing Stairs",
    "difficulty": "EASY",
    "category": "DSA",
    "pattern": "Dynamic Programming",
    "entryPoint": "minCostClimbingStairs",
    "optimalTime": "O(N)",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Min Cost Climbing Stairs\n\nImplement an optimal solution for **Min Cost Climbing Stairs**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Min Cost Climbing Stairs** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N)** time complexity and **O(1)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `minCostClimbingStairs`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N)\n- **Space Complexity:** O(1)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Dynamic Programming.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Dynamic Programming pattern to achieve O(N) runtime.",
      "complexityAnalysis": "Time: O(N), Space: O(1).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Dynamic Programming.",
      "How does your approach achieve O(N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "house-robber",
    "title": "House Robber",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Dynamic Programming",
    "entryPoint": "rob",
    "optimalTime": "O(N)",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### House Robber\n\nImplement an optimal solution for **House Robber**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **House Robber** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N)** time complexity and **O(1)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `rob`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N)\n- **Space Complexity:** O(1)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Dynamic Programming.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Dynamic Programming pattern to achieve O(N) runtime.",
      "complexityAnalysis": "Time: O(N), Space: O(1).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Dynamic Programming.",
      "How does your approach achieve O(N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "house-robber-ii",
    "title": "House Robber II",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Dynamic Programming",
    "entryPoint": "rob",
    "optimalTime": "O(N)",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### House Robber II\n\nImplement an optimal solution for **House Robber II**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **House Robber II** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N)** time complexity and **O(1)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `rob`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N)\n- **Space Complexity:** O(1)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Dynamic Programming.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Dynamic Programming pattern to achieve O(N) runtime.",
      "complexityAnalysis": "Time: O(N), Space: O(1).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Dynamic Programming.",
      "How does your approach achieve O(N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "longest-palindromic-substring",
    "title": "Longest Palindromic Substring",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Dynamic Programming",
    "entryPoint": "longestPalindrome",
    "optimalTime": "O(N^2)",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(n^2)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Longest Palindromic Substring\n\nImplement an optimal solution for **Longest Palindromic Substring**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Longest Palindromic Substring** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N^2)** time complexity and **O(1)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `longestPalindrome`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N^2)\n- **Space Complexity:** O(1)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Dynamic Programming.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Dynamic Programming pattern to achieve O(N^2) runtime.",
      "complexityAnalysis": "Time: O(N^2), Space: O(1).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Dynamic Programming.",
      "How does your approach achieve O(N^2) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "palindromic-substrings",
    "title": "Palindromic Substrings",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Dynamic Programming",
    "entryPoint": "countSubstrings",
    "optimalTime": "O(N^2)",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(n^2)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Palindromic Substrings\n\nImplement an optimal solution for **Palindromic Substrings**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Palindromic Substrings** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N^2)** time complexity and **O(1)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `countSubstrings`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N^2)\n- **Space Complexity:** O(1)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Dynamic Programming.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Dynamic Programming pattern to achieve O(N^2) runtime.",
      "complexityAnalysis": "Time: O(N^2), Space: O(1).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Dynamic Programming.",
      "How does your approach achieve O(N^2) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "decode-ways",
    "title": "Decode Ways",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Dynamic Programming",
    "entryPoint": "numDecodings",
    "optimalTime": "O(N)",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Decode Ways\n\nImplement an optimal solution for **Decode Ways**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Decode Ways** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N)** time complexity and **O(1)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `numDecodings`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N)\n- **Space Complexity:** O(1)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Dynamic Programming.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Dynamic Programming pattern to achieve O(N) runtime.",
      "complexityAnalysis": "Time: O(N), Space: O(1).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Dynamic Programming.",
      "How does your approach achieve O(N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "maximum-product-subarray",
    "title": "Maximum Product Subarray",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Dynamic Programming",
    "entryPoint": "maxProduct",
    "optimalTime": "O(N)",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Maximum Product Subarray\n\nImplement an optimal solution for **Maximum Product Subarray**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Maximum Product Subarray** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N)** time complexity and **O(1)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `maxProduct`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N)\n- **Space Complexity:** O(1)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Dynamic Programming.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Dynamic Programming pattern to achieve O(N) runtime.",
      "complexityAnalysis": "Time: O(N), Space: O(1).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Dynamic Programming.",
      "How does your approach achieve O(N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "word-break",
    "title": "Word Break",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Dynamic Programming",
    "entryPoint": "wordBreak",
    "optimalTime": "O(N * M * K)",
    "optimalSpace": "O(N)",
    "timeKeywords": [
      "o(n * m * k)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(n)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Word Break\n\nImplement an optimal solution for **Word Break**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Word Break** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N * M * K)** time complexity and **O(N)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `wordBreak`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N * M * K)\n- **Space Complexity:** O(N)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Dynamic Programming.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Dynamic Programming pattern to achieve O(N * M * K) runtime.",
      "complexityAnalysis": "Time: O(N * M * K), Space: O(N).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Dynamic Programming.",
      "How does your approach achieve O(N * M * K) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "partition-equal-subset-sum",
    "title": "Partition Equal Subset Sum",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Dynamic Programming",
    "entryPoint": "canPartition",
    "optimalTime": "O(N * sum)",
    "optimalSpace": "O(sum)",
    "timeKeywords": [
      "o(n * sum)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(sum)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Partition Equal Subset Sum\n\nImplement an optimal solution for **Partition Equal Subset Sum**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Partition Equal Subset Sum** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N * sum)** time complexity and **O(sum)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `canPartition`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N * sum)\n- **Space Complexity:** O(sum)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Dynamic Programming.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Dynamic Programming pattern to achieve O(N * sum) runtime.",
      "complexityAnalysis": "Time: O(N * sum), Space: O(sum).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Dynamic Programming.",
      "How does your approach achieve O(N * sum) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "unique-paths",
    "title": "Unique Paths",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Dynamic Programming",
    "entryPoint": "uniquePaths",
    "optimalTime": "O(M * N)",
    "optimalSpace": "O(N)",
    "timeKeywords": [
      "o(m * n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(n)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Unique Paths\n\nImplement an optimal solution for **Unique Paths**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Unique Paths** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(M * N)** time complexity and **O(N)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `uniquePaths`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(M * N)\n- **Space Complexity:** O(N)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Dynamic Programming.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Dynamic Programming pattern to achieve O(M * N) runtime.",
      "complexityAnalysis": "Time: O(M * N), Space: O(N).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Dynamic Programming.",
      "How does your approach achieve O(M * N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "longest-common-subsequence",
    "title": "Longest Common Subsequence",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Dynamic Programming",
    "entryPoint": "longestCommonSubsequence",
    "optimalTime": "O(M * N)",
    "optimalSpace": "O(min(M, N))",
    "timeKeywords": [
      "o(m * n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(min(m, n))",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Longest Common Subsequence\n\nImplement an optimal solution for **Longest Common Subsequence**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Longest Common Subsequence** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(M * N)** time complexity and **O(min(M, N))** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `longestCommonSubsequence`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(M * N)\n- **Space Complexity:** O(min(M, N))",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Dynamic Programming.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Dynamic Programming pattern to achieve O(M * N) runtime.",
      "complexityAnalysis": "Time: O(M * N), Space: O(min(M, N)).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Dynamic Programming.",
      "How does your approach achieve O(M * N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "edit-distance",
    "title": "Edit Distance",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Dynamic Programming",
    "entryPoint": "minDistance",
    "optimalTime": "O(M * N)",
    "optimalSpace": "O(min(M, N))",
    "timeKeywords": [
      "o(m * n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(min(m, n))",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Edit Distance\n\nImplement an optimal solution for **Edit Distance**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Edit Distance** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(M * N)** time complexity and **O(min(M, N))** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `minDistance`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(M * N)\n- **Space Complexity:** O(min(M, N))",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Dynamic Programming.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Dynamic Programming pattern to achieve O(M * N) runtime.",
      "complexityAnalysis": "Time: O(M * N), Space: O(min(M, N)).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Dynamic Programming.",
      "How does your approach achieve O(M * N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "target-sum",
    "title": "Target Sum",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Dynamic Programming",
    "entryPoint": "findTargetSumWays",
    "optimalTime": "O(N * sum)",
    "optimalSpace": "O(sum)",
    "timeKeywords": [
      "o(n * sum)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(sum)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Target Sum\n\nImplement an optimal solution for **Target Sum**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Target Sum** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N * sum)** time complexity and **O(sum)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `findTargetSumWays`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N * sum)\n- **Space Complexity:** O(sum)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Dynamic Programming.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Dynamic Programming pattern to achieve O(N * sum) runtime.",
      "complexityAnalysis": "Time: O(N * sum), Space: O(sum).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Dynamic Programming.",
      "How does your approach achieve O(N * sum) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "coin-change-ii",
    "title": "Coin Change II",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Dynamic Programming",
    "entryPoint": "change",
    "optimalTime": "O(amount * N)",
    "optimalSpace": "O(amount)",
    "timeKeywords": [
      "o(amount * n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(amount)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Coin Change II\n\nImplement an optimal solution for **Coin Change II**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Coin Change II** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(amount * N)** time complexity and **O(amount)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `change`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(amount * N)\n- **Space Complexity:** O(amount)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Dynamic Programming.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Dynamic Programming pattern to achieve O(amount * N) runtime.",
      "complexityAnalysis": "Time: O(amount * N), Space: O(amount).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Dynamic Programming.",
      "How does your approach achieve O(amount * N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "regular-expression-matching",
    "title": "Regular Expression Matching",
    "difficulty": "HARD",
    "category": "DSA",
    "pattern": "Dynamic Programming",
    "entryPoint": "isMatch",
    "optimalTime": "O(M * N)",
    "optimalSpace": "O(M * N)",
    "timeKeywords": [
      "o(m * n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(m * n)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Regular Expression Matching\n\nImplement an optimal solution for **Regular Expression Matching**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Regular Expression Matching** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(M * N)** time complexity and **O(M * N)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `isMatch`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(M * N)\n- **Space Complexity:** O(M * N)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Dynamic Programming.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Dynamic Programming pattern to achieve O(M * N) runtime.",
      "complexityAnalysis": "Time: O(M * N), Space: O(M * N).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Dynamic Programming.",
      "How does your approach achieve O(M * N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "maximum-subarray-kadane",
    "title": "Maximum Subarray (Kadane)",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Greedy",
    "entryPoint": "maxSubArray",
    "optimalTime": "O(N)",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Maximum Subarray (Kadane)\n\nImplement an optimal solution for **Maximum Subarray (Kadane)**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Maximum Subarray (Kadane)** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N)** time complexity and **O(1)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `maxSubArray`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N)\n- **Space Complexity:** O(1)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Greedy.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Greedy pattern to achieve O(N) runtime.",
      "complexityAnalysis": "Time: O(N), Space: O(1).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Greedy.",
      "How does your approach achieve O(N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "jump-game",
    "title": "Jump Game",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Greedy",
    "entryPoint": "canJump",
    "optimalTime": "O(N)",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Jump Game\n\nImplement an optimal solution for **Jump Game**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Jump Game** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N)** time complexity and **O(1)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `canJump`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N)\n- **Space Complexity:** O(1)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Greedy.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Greedy pattern to achieve O(N) runtime.",
      "complexityAnalysis": "Time: O(N), Space: O(1).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Greedy.",
      "How does your approach achieve O(N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "jump-game-ii",
    "title": "Jump Game II",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Greedy",
    "entryPoint": "jump",
    "optimalTime": "O(N)",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Jump Game II\n\nImplement an optimal solution for **Jump Game II**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Jump Game II** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N)** time complexity and **O(1)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `jump`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N)\n- **Space Complexity:** O(1)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Greedy.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Greedy pattern to achieve O(N) runtime.",
      "complexityAnalysis": "Time: O(N), Space: O(1).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Greedy.",
      "How does your approach achieve O(N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "gas-station",
    "title": "Gas Station",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Greedy",
    "entryPoint": "canCompleteCircuit",
    "optimalTime": "O(N)",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Gas Station\n\nImplement an optimal solution for **Gas Station**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Gas Station** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N)** time complexity and **O(1)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `canCompleteCircuit`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N)\n- **Space Complexity:** O(1)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Greedy.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Greedy pattern to achieve O(N) runtime.",
      "complexityAnalysis": "Time: O(N), Space: O(1).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Greedy.",
      "How does your approach achieve O(N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "hand-of-straights",
    "title": "Hand of Straights",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Greedy",
    "entryPoint": "isNStraightHand",
    "optimalTime": "O(N log N)",
    "optimalSpace": "O(N)",
    "timeKeywords": [
      "o(n log n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(n)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Hand of Straights\n\nImplement an optimal solution for **Hand of Straights**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Hand of Straights** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N log N)** time complexity and **O(N)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `isNStraightHand`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N log N)\n- **Space Complexity:** O(N)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Greedy.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Greedy pattern to achieve O(N log N) runtime.",
      "complexityAnalysis": "Time: O(N log N), Space: O(N).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Greedy.",
      "How does your approach achieve O(N log N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "partition-labels",
    "title": "Partition Labels",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Greedy",
    "entryPoint": "partitionLabels",
    "optimalTime": "O(N)",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Partition Labels\n\nImplement an optimal solution for **Partition Labels**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Partition Labels** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N)** time complexity and **O(1)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `partitionLabels`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N)\n- **Space Complexity:** O(1)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Greedy.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Greedy pattern to achieve O(N) runtime.",
      "complexityAnalysis": "Time: O(N), Space: O(1).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Greedy.",
      "How does your approach achieve O(N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "valid-parenthesis-string",
    "title": "Valid Parenthesis String",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Greedy",
    "entryPoint": "checkValidString",
    "optimalTime": "O(N)",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Valid Parenthesis String\n\nImplement an optimal solution for **Valid Parenthesis String**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Valid Parenthesis String** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N)** time complexity and **O(1)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `checkValidString`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N)\n- **Space Complexity:** O(1)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Greedy.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Greedy pattern to achieve O(N) runtime.",
      "complexityAnalysis": "Time: O(N), Space: O(1).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Greedy.",
      "How does your approach achieve O(N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "insert-interval",
    "title": "Insert Interval",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Intervals",
    "entryPoint": "insert",
    "optimalTime": "O(N)",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Insert Interval\n\nImplement an optimal solution for **Insert Interval**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Insert Interval** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N)** time complexity and **O(1)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `insert`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N)\n- **Space Complexity:** O(1)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Intervals.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Intervals pattern to achieve O(N) runtime.",
      "complexityAnalysis": "Time: O(N), Space: O(1).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Intervals.",
      "How does your approach achieve O(N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "merge-intervals",
    "title": "Merge Intervals",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Intervals",
    "entryPoint": "merge",
    "optimalTime": "O(N log N)",
    "optimalSpace": "O(N)",
    "timeKeywords": [
      "o(n log n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(n)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Merge Intervals\n\nImplement an optimal solution for **Merge Intervals**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Merge Intervals** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N log N)** time complexity and **O(N)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `merge`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N log N)\n- **Space Complexity:** O(N)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Intervals.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Intervals pattern to achieve O(N log N) runtime.",
      "complexityAnalysis": "Time: O(N log N), Space: O(N).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Intervals.",
      "How does your approach achieve O(N log N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "non-overlapping-intervals",
    "title": "Non-overlapping Intervals",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Intervals",
    "entryPoint": "eraseOverlapIntervals",
    "optimalTime": "O(N log N)",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(n log n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Non-overlapping Intervals\n\nImplement an optimal solution for **Non-overlapping Intervals**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Non-overlapping Intervals** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N log N)** time complexity and **O(1)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `eraseOverlapIntervals`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N log N)\n- **Space Complexity:** O(1)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Intervals.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Intervals pattern to achieve O(N log N) runtime.",
      "complexityAnalysis": "Time: O(N log N), Space: O(1).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Intervals.",
      "How does your approach achieve O(N log N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "meeting-rooms",
    "title": "Meeting Rooms",
    "difficulty": "EASY",
    "category": "DSA",
    "pattern": "Intervals",
    "entryPoint": "canAttendMeetings",
    "optimalTime": "O(N log N)",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(n log n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Meeting Rooms\n\nImplement an optimal solution for **Meeting Rooms**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Meeting Rooms** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N log N)** time complexity and **O(1)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `canAttendMeetings`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N log N)\n- **Space Complexity:** O(1)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Intervals.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Intervals pattern to achieve O(N log N) runtime.",
      "complexityAnalysis": "Time: O(N log N), Space: O(1).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Intervals.",
      "How does your approach achieve O(N log N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "meeting-rooms-ii",
    "title": "Meeting Rooms II",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Intervals",
    "entryPoint": "minMeetingRooms",
    "optimalTime": "O(N log N)",
    "optimalSpace": "O(N)",
    "timeKeywords": [
      "o(n log n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(n)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Meeting Rooms II\n\nImplement an optimal solution for **Meeting Rooms II**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Meeting Rooms II** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N log N)** time complexity and **O(N)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `minMeetingRooms`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N log N)\n- **Space Complexity:** O(N)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Intervals.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Intervals pattern to achieve O(N log N) runtime.",
      "complexityAnalysis": "Time: O(N log N), Space: O(N).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Intervals.",
      "How does your approach achieve O(N log N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "single-number",
    "title": "Single Number",
    "difficulty": "EASY",
    "category": "DSA",
    "pattern": "Bit Manipulation",
    "entryPoint": "singleNumber",
    "optimalTime": "O(N)",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Single Number\n\nImplement an optimal solution for **Single Number**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Single Number** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N)** time complexity and **O(1)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `singleNumber`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N)\n- **Space Complexity:** O(1)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Bit Manipulation.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Bit Manipulation pattern to achieve O(N) runtime.",
      "complexityAnalysis": "Time: O(N), Space: O(1).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Bit Manipulation.",
      "How does your approach achieve O(N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "number-of-1-bits",
    "title": "Number of 1 Bits",
    "difficulty": "EASY",
    "category": "DSA",
    "pattern": "Bit Manipulation",
    "entryPoint": "hammingWeight",
    "optimalTime": "O(1)",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(1)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Number of 1 Bits\n\nImplement an optimal solution for **Number of 1 Bits**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Number of 1 Bits** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(1)** time complexity and **O(1)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `hammingWeight`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(1)\n- **Space Complexity:** O(1)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Bit Manipulation.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Bit Manipulation pattern to achieve O(1) runtime.",
      "complexityAnalysis": "Time: O(1), Space: O(1).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Bit Manipulation.",
      "How does your approach achieve O(1) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "counting-bits",
    "title": "Counting Bits",
    "difficulty": "EASY",
    "category": "DSA",
    "pattern": "Bit Manipulation",
    "entryPoint": "countBits",
    "optimalTime": "O(N)",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Counting Bits\n\nImplement an optimal solution for **Counting Bits**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Counting Bits** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N)** time complexity and **O(1)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `countBits`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N)\n- **Space Complexity:** O(1)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Bit Manipulation.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Bit Manipulation pattern to achieve O(N) runtime.",
      "complexityAnalysis": "Time: O(N), Space: O(1).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Bit Manipulation.",
      "How does your approach achieve O(N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "reverse-bits",
    "title": "Reverse Bits",
    "difficulty": "EASY",
    "category": "DSA",
    "pattern": "Bit Manipulation",
    "entryPoint": "reverseBits",
    "optimalTime": "O(1)",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(1)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Reverse Bits\n\nImplement an optimal solution for **Reverse Bits**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Reverse Bits** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(1)** time complexity and **O(1)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `reverseBits`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(1)\n- **Space Complexity:** O(1)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Bit Manipulation.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Bit Manipulation pattern to achieve O(1) runtime.",
      "complexityAnalysis": "Time: O(1), Space: O(1).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Bit Manipulation.",
      "How does your approach achieve O(1) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "missing-number",
    "title": "Missing Number",
    "difficulty": "EASY",
    "category": "DSA",
    "pattern": "Bit Manipulation",
    "entryPoint": "missingNumber",
    "optimalTime": "O(N)",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Missing Number\n\nImplement an optimal solution for **Missing Number**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Missing Number** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N)** time complexity and **O(1)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `missingNumber`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N)\n- **Space Complexity:** O(1)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Bit Manipulation.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Bit Manipulation pattern to achieve O(N) runtime.",
      "complexityAnalysis": "Time: O(N), Space: O(1).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Bit Manipulation.",
      "How does your approach achieve O(N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "set-matrix-zeroes",
    "title": "Set Matrix Zeroes",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Math & Geometry",
    "entryPoint": "setZeroes",
    "optimalTime": "O(M * N)",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(m * n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Set Matrix Zeroes\n\nImplement an optimal solution for **Set Matrix Zeroes**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Set Matrix Zeroes** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(M * N)** time complexity and **O(1)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `setZeroes`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(M * N)\n- **Space Complexity:** O(1)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Math & Geometry.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Math & Geometry pattern to achieve O(M * N) runtime.",
      "complexityAnalysis": "Time: O(M * N), Space: O(1).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Math & Geometry.",
      "How does your approach achieve O(M * N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "spiral-matrix",
    "title": "Spiral Matrix",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Math & Geometry",
    "entryPoint": "spiralOrder",
    "optimalTime": "O(M * N)",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(m * n)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Spiral Matrix\n\nImplement an optimal solution for **Spiral Matrix**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Spiral Matrix** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(M * N)** time complexity and **O(1)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `spiralOrder`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(M * N)\n- **Space Complexity:** O(1)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Math & Geometry.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Math & Geometry pattern to achieve O(M * N) runtime.",
      "complexityAnalysis": "Time: O(M * N), Space: O(1).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Math & Geometry.",
      "How does your approach achieve O(M * N) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "rotate-image",
    "title": "Rotate Image",
    "difficulty": "MEDIUM",
    "category": "DSA",
    "pattern": "Math & Geometry",
    "entryPoint": "rotate",
    "optimalTime": "O(N^2)",
    "optimalSpace": "O(1)",
    "timeKeywords": [
      "o(n^2)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(1)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Rotate Image\n\nImplement an optimal solution for **Rotate Image**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Rotate Image** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(N^2)** time complexity and **O(1)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `rotate`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(N^2)\n- **Space Complexity:** O(1)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Math & Geometry.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Math & Geometry pattern to achieve O(N^2) runtime.",
      "complexityAnalysis": "Time: O(N^2), Space: O(1).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Math & Geometry.",
      "How does your approach achieve O(N^2) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "concurrent-async-task-queue-with-retries",
    "title": "Concurrent Async Task Queue with Retries",
    "difficulty": "MEDIUM",
    "category": "MachineCoding",
    "pattern": "Low-Level Design",
    "entryPoint": "AsyncTaskQueue",
    "optimalTime": "O(1)",
    "optimalSpace": "O(N)",
    "timeKeywords": [
      "o(1)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(n)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Concurrent Async Task Queue with Retries\n\nImplement an optimal solution for **Concurrent Async Task Queue with Retries**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Concurrent Async Task Queue with Retries** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(1)** time complexity and **O(N)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `AsyncTaskQueue`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(1)\n- **Space Complexity:** O(N)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Low-Level Design.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Low-Level Design pattern to achieve O(1) runtime.",
      "complexityAnalysis": "Time: O(1), Space: O(N).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Low-Level Design.",
      "How does your approach achieve O(1) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "thread-safe-lru-cache",
    "title": "Thread-safe LRU Cache",
    "difficulty": "MEDIUM",
    "category": "MachineCoding",
    "pattern": "Low-Level Design",
    "entryPoint": "LRUCache",
    "optimalTime": "O(1)",
    "optimalSpace": "O(capacity)",
    "timeKeywords": [
      "o(1)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(capacity)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Thread-safe LRU Cache\n\nImplement an optimal solution for **Thread-safe LRU Cache**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Thread-safe LRU Cache** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(1)** time complexity and **O(capacity)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `LRUCache`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(1)\n- **Space Complexity:** O(capacity)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Low-Level Design.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Low-Level Design pattern to achieve O(1) runtime.",
      "complexityAnalysis": "Time: O(1), Space: O(capacity).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Low-Level Design.",
      "How does your approach achieve O(1) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "pub-sub-event-bus",
    "title": "Pub-Sub Event Bus",
    "difficulty": "MEDIUM",
    "category": "MachineCoding",
    "pattern": "Low-Level Design",
    "entryPoint": "EventEmitter",
    "optimalTime": "O(1)",
    "optimalSpace": "O(N)",
    "timeKeywords": [
      "o(1)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(n)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Pub-Sub Event Bus\n\nImplement an optimal solution for **Pub-Sub Event Bus**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Pub-Sub Event Bus** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(1)** time complexity and **O(N)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `EventEmitter`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(1)\n- **Space Complexity:** O(N)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Low-Level Design.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Low-Level Design pattern to achieve O(1) runtime.",
      "complexityAnalysis": "Time: O(1), Space: O(N).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Low-Level Design.",
      "How does your approach achieve O(1) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "design-hit-counter",
    "title": "Design Hit Counter",
    "difficulty": "MEDIUM",
    "category": "MachineCoding",
    "pattern": "Low-Level Design",
    "entryPoint": "HitCounter",
    "optimalTime": "O(1)",
    "optimalSpace": "O(300)",
    "timeKeywords": [
      "o(1)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(300)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Design Hit Counter\n\nImplement an optimal solution for **Design Hit Counter**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Design Hit Counter** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(1)** time complexity and **O(300)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `HitCounter`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(1)\n- **Space Complexity:** O(300)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Low-Level Design.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Low-Level Design pattern to achieve O(1) runtime.",
      "complexityAnalysis": "Time: O(1), Space: O(300).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Low-Level Design.",
      "How does your approach achieve O(1) time?",
      "Check your boundary conditions carefully."
    ]
  },
  {
    "id": "design-snake-game",
    "title": "Design Snake Game",
    "difficulty": "MEDIUM",
    "category": "MachineCoding",
    "pattern": "Low-Level Design",
    "entryPoint": "SnakeGame",
    "optimalTime": "O(1)",
    "optimalSpace": "O(N)",
    "timeKeywords": [
      "o(1)",
      "linear",
      "logarithmic",
      "constant",
      "quadratic"
    ],
    "spaceKeywords": [
      "o(n)",
      "constant",
      "linear",
      "auxiliary"
    ],
    "description": "### Design Snake Game\n\nImplement an optimal solution for **Design Snake Game**.\n\n### Problem Description & Specification:\nIn technical systems engineering, efficiency is paramount. Implement the core logic for **Design Snake Game** matching optimal production standards.\n\n### Requirements:\n1. Handle all edge cases including boundary values, empty inputs, single elements, and large data ranges.\n2. Achieve optimal **O(1)** time complexity and **O(N)** space complexity.\n3. Write clean, modular, and self-contained code.\n\n### Function Signature / Entry Point:\n- Name: `SnakeGame`\n- Implement from scratch. No starter template is provided.\n\n### Complexity Targets:\n- **Time Complexity:** O(1)\n- **Space Complexity:** O(N)",
    "testCases": [
      {
        "input": [
          "default"
        ],
        "expected": true,
        "description": "Default correctness case"
      },
      {
        "input": [
          "edge"
        ],
        "expected": true,
        "description": "Edge boundary case",
        "isHidden": true
      }
    ],
    "editorial": {
      "intuition": "This problem evaluates proficiency in Low-Level Design.",
      "bruteForce": "Brute force solutions perform redundant computations.",
      "optimalApproach": "Use the Low-Level Design pattern to achieve O(1) runtime.",
      "complexityAnalysis": "Time: O(1), Space: O(N).",
      "edgeCases": [
        "Empty inputs",
        "Single element",
        "Duplicates",
        "Negative values"
      ]
    },
    "hints": [
      "Consider the core invariants of Low-Level Design.",
      "How does your approach achieve O(1) time?",
      "Check your boundary conditions carefully."
    ]
  }
];

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
