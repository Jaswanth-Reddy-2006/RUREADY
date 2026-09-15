// ═══════════════════════════════════════════════════════════════
// R U Ready? — Comprehensive Coding Resources & Algorithmic Reference
// Language-Specific Cheat Sheets, Algorithmic Templates & Big-O Guide
// ═══════════════════════════════════════════════════════════════

export interface LanguageCheatSheet {
  language: string;
  name: string;
  dataStructures: {
    title: string;
    description: string;
    snippet: string;
  }[];
  utilityMethods: {
    title: string;
    description: string;
    snippet: string;
  }[];
}

export interface AlgorithmicTemplate {
  id: string;
  name: string;
  category: string;
  timeComplexity: string;
  spaceComplexity: string;
  description: string;
  codeByLanguage: Record<string, string>;
}

export const LANGUAGE_CHEAT_SHEETS: Record<string, LanguageCheatSheet> = {
  javascript: {
    language: 'javascript',
    name: 'JavaScript (Node.js)',
    dataStructures: [
      {
        title: 'Map (Hash Table)',
        description: 'Key-value store with O(1) average lookup, insertion, and deletion.',
        snippet: `const map = new Map();
map.set(key, value);
map.has(key); // returns boolean
map.get(key); // returns value or undefined
map.delete(key);
for (const [k, v] of map.entries()) { ... }`,
      },
      {
        title: 'Set (Unique Collection)',
        description: 'Collection of unique values with O(1) lookup and insertion.',
        snippet: `const set = new Set();
set.add(val);
set.has(val); // O(1)
set.delete(val);
set.size;`,
      },
      {
        title: 'Array (Dynamic List / Stack / Queue)',
        description: 'Contiguous list with index access O(1) and stack operations.',
        snippet: `const arr = [];
arr.push(x);    // Push to back: O(1)
arr.pop();      // Pop from back: O(1)
arr.unshift(x); // Prepend: O(N)
arr.shift();    // Dequeue: O(N)
arr.slice(start, end); // Subarray copy
arr.sort((a, b) => a - b); // Ascending sort: O(N log N)`,
      },
    ],
    utilityMethods: [
      {
        title: 'Sorting Numbers',
        description: 'JS sort defaults to lexicographical; provide numeric comparator.',
        snippet: `nums.sort((a, b) => a - b); // Ascending
nums.sort((a, b) => b - a); // Descending`,
      },
      {
        title: 'Math Utilities',
        description: 'Common mathematical operations.',
        snippet: `Math.max(...nums);
Math.min(...nums);
Math.floor(a / b);
Math.abs(x);`,
      },
    ],
  },
  typescript: {
    language: 'typescript',
    name: 'TypeScript',
    dataStructures: [
      {
        title: 'Map<K, V>',
        description: 'Typed Key-value store with O(1) performance.',
        snippet: `const map = new Map<number, number>();
map.set(key, val);
const exists = map.has(key);
const val = map.get(key);`,
      },
      {
        title: 'Set<T>',
        description: 'Typed set of unique values.',
        snippet: `const set = new Set<string>();
set.add('item');
set.has('item');`,
      },
      {
        title: 'Numeric Array & Tuple',
        description: 'Typed arrays and fixed-size tuples.',
        snippet: `const nums: number[] = [1, 2, 3];
const pair: [number, number] = [0, 1];
nums.sort((a, b) => a - b);`,
      },
    ],
    utilityMethods: [
      {
        title: 'Binary Search Midpoint',
        description: 'Overflow-safe midpoint computation.',
        snippet: `const mid = left + Math.floor((right - left) / 2);`,
      },
    ],
  },
  python: {
    language: 'python',
    name: 'Python 3',
    dataStructures: [
      {
        title: 'dict (Hash Map)',
        description: 'Fast key-value mapping with O(1) lookup.',
        snippet: `d = {}
d[key] = value
if key in d: ...
val = d.get(key, default_val)
from collections import defaultdict, Counter
counts = Counter(nums)
adj = defaultdict(list)`,
      },
      {
        title: 'set (Hash Set)',
        description: 'Unique set with O(1) membership testing.',
        snippet: `s = set()
s.add(val)
if val in s: ...
s.remove(val)`,
      },
      {
        title: 'heapq (Min-Heap / Priority Queue)',
        description: 'Binary heap implementation with O(log N) push and pop.',
        snippet: `import heapq
heap = []
heapq.heappush(heap, item)
smallest = heapq.heappop(heap)
heapq.heapify(nums) # O(N) in-place build
# For max-heap, invert signs: -x`,
      },
      {
        title: 'collections.deque (Double-ended Queue)',
        description: 'O(1) appends and pops from both ends for BFS.',
        snippet: `from collections import deque
queue = deque([root])
queue.append(node)
curr = queue.popleft() # O(1)`,
      },
    ],
    utilityMethods: [
      {
        title: 'Bisect (Binary Search)',
        description: 'Built-in binary search utilities.',
        snippet: `import bisect
idx = bisect.bisect_left(arr, target) # Leftmost insertion index`,
      },
      {
        title: 'List Slicing & Reverse',
        description: 'Python slice operations.',
        snippet: `reversed_list = nums[::-1]
subarray = nums[1:4]`,
      },
    ],
  },
  java: {
    language: 'java',
    name: 'Java 17',
    dataStructures: [
      {
        title: 'HashMap<K, V>',
        description: 'Hash table implementation with O(1) lookup.',
        snippet: `Map<Integer, Integer> map = new HashMap<>();
map.put(key, val);
map.containsKey(key);
int val = map.getOrDefault(key, 0);`,
      },
      {
        title: 'PriorityQueue (Min-Heap / Max-Heap)',
        description: 'Priority queue with custom comparator.',
        snippet: `// Min-heap:
PriorityQueue<Integer> minHeap = new PriorityQueue<>();
// Max-heap:
PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
minHeap.offer(val);
int top = minHeap.poll();`,
      },
      {
        title: 'Deque / ArrayDeque (Queue for BFS)',
        description: 'Faster than LinkedList for queues.',
        snippet: `Deque<TreeNode> queue = new ArrayDeque<>();
queue.offer(root);
TreeNode curr = queue.poll();`,
      },
    ],
    utilityMethods: [
      {
        title: 'Arrays & Collections Sorting',
        description: 'Sorting primitives and objects.',
        snippet: `Arrays.sort(nums); // Dual-Pivot Quicksort: O(N log N)
Collections.sort(list); // TimSort`,
      },
    ],
  },
  cpp: {
    language: 'cpp',
    name: 'C++ (GCC)',
    dataStructures: [
      {
        title: 'std::unordered_map',
        description: 'Hash map with O(1) average lookup.',
        snippet: `#include <unordered_map>
std::unordered_map<int, int> map;
map[key] = val;
if (map.find(key) != map.end()) { ... }
map.count(key); // 0 or 1`,
      },
      {
        title: 'std::priority_queue',
        description: 'Max-heap by default; custom min-heap with std::greater.',
        snippet: `#include <queue>
// Max-heap:
std::priority_queue<int> maxHeap;
// Min-heap:
std::priority_queue<int, std::vector<int>, std::greater<int>> minHeap;
minHeap.push(val);
int top = minHeap.top();
minHeap.pop();`,
      },
    ],
    utilityMethods: [
      {
        title: 'std::sort & binary_search',
        description: 'Standard library algorithms.',
        snippet: `#include <algorithm>
std::sort(nums.begin(), nums.end());
auto it = std::lower_bound(nums.begin(), nums.end(), target);`,
      },
    ],
  },
  go: {
    language: 'go',
    name: 'Go (Golang)',
    dataStructures: [
      {
        title: 'map[K]V',
        description: 'Built-in hash map.',
        snippet: `m := make(map[int]int)
m[key] = val
val, ok := m[key] // ok is true if key exists
delete(m, key)`,
      },
      {
        title: 'Slice as Queue / Stack',
        description: 'Idiomatic slice manipulation.',
        snippet: `// Stack:
stack = append(stack, x)
top := stack[len(stack)-1]
stack = stack[:len(stack)-1]

// Queue dequeue:
item := queue[0]
queue = queue[1:]`,
      },
    ],
    utilityMethods: [
      {
        title: 'slices.Sort',
        description: 'Go 1.21+ standard slices sorting.',
        snippet: `import "slices"
slices.Sort(nums) // Ascending in-place`,
      },
    ],
  },
};

export const ALGORITHMIC_TEMPLATES: AlgorithmicTemplate[] = [
  {
    id: 'two-pointers',
    name: 'Two Pointers (Opposite Ends)',
    category: 'Array / String',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    description: 'Use two pointers starting at opposite boundaries (left = 0, right = n - 1) converging towards the center.',
    codeByLanguage: {
      javascript: `function twoPointers(arr) {
  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    if (condition(arr[left], arr[right])) {
      return [left, right];
    }
    // Adjust pointers based on condition
    left++;
    right--;
  }
  return null;
}`,
      typescript: `function twoPointers(arr: number[]): number[] | null {
  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    // Evaluation logic
    left++;
    right--;
  }
  return null;
}`,
      python: `def two_pointers(arr: list[int]) -> list[int] | None:
    left, right = 0, len(arr) - 1
    while left < right:
        # Evaluation logic
        if condition(arr[left], arr[right]):
            return [left, right]
        left += 1
        right -= 1
    return None`,
      java: `public int[] twoPointers(int[] arr) {
    int left = 0, right = arr.length - 1;
    while (left < right) {
        // Evaluation logic
        left++;
        right--;
    }
    return new int[]{};
}`,
      cpp: `std::vector<int> twoPointers(const std::vector<int>& arr) {
    int left = 0, right = arr.size() - 1;
    while (left < right) {
        // Evaluation logic
        left++;
        right--;
    }
    return {};
}`,
      go: `func twoPointers(arr []int) []int {
    left, right := 0, len(arr)-1
    for left < right {
        // Evaluation logic
        left++
        right--
    }
    return nil
}`,
    },
  },
  {
    id: 'binary-search',
    name: 'Binary Search (Exact & Bound)',
    category: 'Searching',
    timeComplexity: 'O(log N)',
    spaceComplexity: 'O(1)',
    description: 'Divide and conquer on a sorted array by halving the search space at each iteration.',
    codeByLanguage: {
      javascript: `function binarySearch(nums, target) {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    if (nums[mid] === target) {
      return mid;
    } else if (nums[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
}`,
      typescript: `function binarySearch(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
      python: `def binary_search(nums: list[int], target: int) -> int:
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`,
      java: `public int binarySearch(int[] nums, int target) {
    int left = 0, right = nums.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,
      cpp: `int binarySearch(const std::vector<int>& nums, int target) {
    int left = 0, right = nums.size() - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,
      go: `func binarySearch(nums []int, target int) int {
    left, right := 0, len(nums)-1
    for left <= right {
        mid := left + (right-left)/2
        if nums[mid] == target {
            return mid
        } else if nums[mid] < target {
            left = mid + 1
        } else {
            right = mid - 1
        }
    }
    return -1
}`,
    },
  },
  {
    id: 'sliding-window',
    name: 'Sliding Window (Dynamic)',
    category: 'Array / Substring',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(K)',
    description: 'Expand the right boundary to consume elements; contract the left boundary when constraint is violated.',
    codeByLanguage: {
      javascript: `function slidingWindow(s) {
  let left = 0;
  let maxLen = 0;
  const windowMap = new Map();

  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    windowMap.set(char, (windowMap.get(char) || 0) + 1);

    // Contract window when condition violates
    while (windowMap.get(char) > 1) {
      windowMap.set(s[left], windowMap.get(s[left]) - 1);
      left++;
    }
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`,
      typescript: `function slidingWindow(s: string): number {
  let left = 0;
  let maxLen = 0;
  const seen = new Map<string, number>();

  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    seen.set(ch, (seen.get(ch) || 0) + 1);

    while ((seen.get(ch) || 0) > 1) {
      seen.set(s[left], (seen.get(s[left]) || 0) - 1);
      left++;
    }
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`,
      python: `def sliding_window(s: str) -> int:
    left = 0
    max_len = 0
    counts = {}

    for right, char in enumerate(s):
        counts[char] = counts.get(char, 0) + 1
        while counts[char] > 1:
            counts[s[left]] -= 1
            left += 1
        max_len = max(max_len, right - left + 1)
    return max_len`,
      java: `public int slidingWindow(String s) {
    int left = 0, maxLen = 0;
    Map<Character, Integer> counts = new HashMap<>();

    for (int right = 0; right < s.length(); right++) {
        char c = s.charAt(right);
        counts.put(c, counts.getOrDefault(c, 0) + 1);

        while (counts.get(c) > 1) {
            char leftChar = s.charAt(left);
            counts.put(leftChar, counts.get(leftChar) - 1);
            left++;
        }
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}`,
      cpp: `int slidingWindow(const std::string& s) {
    int left = 0, maxLen = 0;
    std::unordered_map<char, int> counts;

    for (int right = 0; right < s.size(); right++) {
        char c = s[right];
        counts[c]++;

        while (counts[c] > 1) {
            counts[s[left]]--;
            left++;
        }
        maxLen = std::max(maxLen, right - left + 1);
    }
    return maxLen;
}`,
      go: `func slidingWindow(s string) int {
    left, maxLen := 0, 0
    counts := make(map[byte]int)

    for right := 0; right < len(s); right++ {
        c := s[right]
        counts[c]++

        for counts[c] > 1 {
            counts[s[left]]--
            left++
        }
        if right-left+1 > maxLen {
            maxLen = right - left + 1
        }
    }
    return maxLen
}`,
    },
  },
];

export const BIG_O_GUIDE = [
  { scale: 'N ≤ 10-12', complexity: 'O(N!) or O(N² · 2ᴺ)', technique: 'Backtracking, Permutations, Hamiltonian Paths' },
  { scale: 'N ≤ 20-25', complexity: 'O(2ᴺ)', technique: 'Subsets, Bitmask DP, Exhaustive Recursion' },
  { scale: 'N ≤ 100-400', complexity: 'O(N³)', technique: 'Floyd-Warshall, Matrix Multiplication, 3D DP' },
  { scale: 'N ≤ 1,000-2,000', complexity: 'O(N²)', technique: 'Nested loops, 2D DP, Insertion Sort' },
  { scale: 'N ≤ 100,000-200,000', complexity: 'O(N log N) or O(N)', technique: 'Hash Table, Two Pointers, Binary Search, Sliding Window, Merge Sort' },
  { scale: 'N ≤ 10,000,000', complexity: 'O(N)', technique: 'Single pass iteration, Prefix Sums, Monotonic Stack' },
  { scale: 'N ≥ 1,000,000,000', complexity: 'O(log N) or O(1)', technique: 'Binary Search, Math formulas, Bitwise operations' },
];

export const EDGE_CASES_CHECKLIST = [
  { title: 'Empty or Single-Element Collection', desc: 'Check if len == 0 or len == 1 before accessing index 0 or 1.' },
  { title: 'Duplicate Elements', desc: 'Will duplicate numbers collide in hash sets or cause infinite loops in two pointers?' },
  { title: 'Negative Values & Zero', desc: 'Do multiplications flip signs? Does modulo behave properly for negatives?' },
  { title: '32-Bit Integer Overflow', desc: 'In Java/C++, does sum or product exceed 2^31 - 1 (2,147,483,647)? Use long/int64.' },
  { title: 'Target Not Reachable', desc: 'Always define and verify the fallback return value (e.g., -1, empty array, or null).' },
];
