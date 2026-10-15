import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { 
  Sparkles, Play, Clock, Code2, Lightbulb, Mic, MicOff, Video, VideoOff, 
  Terminal, Shield, ArrowLeft, ChevronRight, CheckCircle2, AlertCircle, 
  X, ChevronDown, ChevronUp, AlertTriangle, Send,
  MessageSquare, Layers, Check, Volume2, Cpu, Eye, ShieldCheck, ShieldAlert,
  Sun, Moon, PhoneOff
} from 'lucide-react';
import apiClient from '../../api/client';
import { codingApi, type CodeEvaluationResponse, type IdealSolutionResponse } from '../../api/coding';
import toast from 'react-hot-toast';
import AIAvatar, { type AvatarState } from './AIAvatar';
import { mapVisemeIdToOculus, type OculusViseme } from './visemeMapper';
import UserCamera from './UserCamera';
import LiveTranscript, { type TranscriptEntry } from './LiveTranscript';
import InterviewTimer from './InterviewTimer';
import { speakWithLipSync, loadSpeechVoices, stopAllSpeech } from '../../lib/speech';
import { useFaceTelemetry } from '../../hooks/useFaceTelemetry';
import { useCandidateAnalysis } from '../../hooks/useCandidateAnalysis';
import ExitConfirmationModal from './ExitConfirmationModal';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { evaluateCodeLocally } from '../../lib/codeSandbox';
import { CODING_PROBLEMS, getProblemByIdFromCatalog, getRandomUnsolvedProblem, type CodingProblem } from '../../data/codingProblemsCatalog';

interface SessionData {
  id: string;
  targetRole: string;
  targetCompany?: string;
  industry: string;
  interviewType: string;
  experienceLevel: string;
  focusAreas: string[];
  durationMins: number;
  status: string;
  interviewGoal?: string;
  hintCount: number;
  difficulty?: string;
}

interface QuestionData {
  id: string;
  orderIndex: number;
  questionText: string;
  questionType: string;
  difficulty: string;
  answerText?: string | null;
}

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript (Node.js)' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python 3' },
  { value: 'java', label: 'Java 17' },
  { value: 'cpp', label: 'C++ (GCC)' },
  { value: 'go', label: 'Go (Golang)' }
];

const LANGUAGE_BOILERPLATES: Record<string, string> = {
  javascript: '',
  typescript: '',
  python: '',
  java: '',
  cpp: '',
  go: ''
};
const FALLBACK_PROBLEMS: any[] = CODING_PROBLEMS;

const OLD_FALLBACK_PROBLEMS = [
  // ─── 1. DSA: Two Sum (Arrays & Two Pointers) ───
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'EASY',
    category: 'DSA',
    entryPoint: 'twoSum',
    description: `Given a list of numbers and a target number, find the two numbers that add up to the target and return their index positions.

Each input has exactly one valid solution, and you cannot use the same number twice.

Example 1:
Input: nums = [2, 7, 11, 15], target = 9
Output: [0, 1]
Explanation: Because 2 + 7 = 9, the indices are 0 and 1.

Example 2:
Input: nums = [3, 2, 4], target = 6
Output: [1, 2]
Explanation: Because 2 + 4 = 6, the indices are 1 and 2.

Example 3:
Input: nums = [3, 3], target = 6
Output: [0, 1]`,
    starterCode: {
      javascript: `function twoSum(nums, target) {\n  return [];\n}`,
      typescript: `function twoSum(nums: number[], target: number): number[] {\n  return [];\n}`,
      python: `def twoSum(nums: list[int], target: int) -> list[int]:\n    return []`,
      java: `import java.util.*;\n\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        return new int[]{};\n    }\n}`,
      cpp: `#include <vector>\n#include <unordered_map>\n\nclass Solution {\npublic:\n    std::vector<int> twoSum(std::vector<int>& nums, int target) {\n        return {};\n    }\n};`,
      go: `package main\n\nfunc twoSum(nums []int, target int) []int {\n    return []int{}\n}`
    }
  },

  // ─── 2. MACHINE CODING / LLD: In-Memory Key-Value Store with TTL ───
  {
    id: 'in-memory-kv-store',
    title: 'In-Memory Key-Value Store with TTL',
    difficulty: 'MEDIUM',
    category: 'MachineCoding',
    entryPoint: 'KeyValueStore',
    description: `Design and implement an in-memory key-value data store that supports saving, getting, and deleting keys with an optional expiration time.

Requirements:
1. set(key, value, ttlMs) — Stores the key-value pair. If ttlMs is provided, the key expires after that time in milliseconds.
2. get(key) — Returns the value if it exists and has not expired, otherwise returns null.
3. del(key) — Deletes the key and returns true if it existed.
4. size() — Returns the number of currently active, non-expired keys.

Example:
const store = new KeyValueStore();
store.set("user:1", { name: "Alice" }, 1000); // expires in 1 second
store.get("user:1"); // returns { name: "Alice" }`,
    starterCode: {
      javascript: `class KeyValueStore {\n  constructor() {\n    this.store = new Map();\n  }\n\n  set(key, value, ttlMs) {\n    const expiresAt = ttlMs ? Date.now() + ttlMs : null;\n    this.store.set(key, { value, expiresAt });\n  }\n\n  get(key) {\n    const item = this.store.get(key);\n    if (!item) return null;\n    if (item.expiresAt && Date.now() > item.expiresAt) {\n      this.store.delete(key);\n      return null;\n    }\n    return item.value;\n  }\n\n  del(key) {\n    return this.store.delete(key);\n  }\n\n  size() {\n    let count = 0;\n    const now = Date.now();\n    for (const [key, item] of this.store.entries()) {\n      if (!item.expiresAt || now <= item.expiresAt) {\n        count++;\n      }\n    }\n    return count;\n  }\n}`,
      typescript: `interface StoreItem<T> {\n  value: T;\n  expiresAt: number | null;\n}\n\nclass KeyValueStore<T = any> {\n  private store = new Map<string, StoreItem<T>>();\n\n  set(key: string, value: T, ttlMs?: number): void {\n    const expiresAt = ttlMs ? Date.now() + ttlMs : null;\n    this.store.set(key, { value, expiresAt });\n  }\n\n  get(key: string): T | null {\n    const item = this.store.get(key);\n    if (!item) return null;\n    if (item.expiresAt && Date.now() > item.expiresAt) {\n      this.store.delete(key);\n      return null;\n    }\n    return item.value;\n  }\n\n  del(key: string): boolean {\n    return this.store.delete(key);\n  }\n\n  size(): number {\n    const now = Date.now();\n    let count = 0;\n    for (const [, item] of this.store.entries()) {\n      if (!item.expiresAt || now <= item.expiresAt) count++;\n    }\n    return count;\n  }\n}`,
      python: `import time\n\nclass KeyValueStore:\n    def __init__(self):\n        self.store = {}\n\n    def set(self, key: str, value: any, ttl_ms: int = None):\n        expires_at = (time.time() * 1000 + ttl_ms) if ttl_ms else None\n        self.store[key] = (value, expires_at)\n\n    def get(self, key: str):\n        if key not in self.store:\n            return None\n        val, expires_at = self.store[key]\n        if expires_at and (time.time() * 1000 > expires_at):\n            del self.store[key]\n            return None\n        return val\n\n    def delete(self, key: str) -> bool:\n        if key in self.store:\n            del self.store[key]\n            return True\n        return False\n\n    def size(self) -> int:\n        now = time.time() * 1000\n        return sum(1 for _, (_, exp) in self.store.items() if not exp or now <= exp)`,
      java: `import java.util.concurrent.*;\nimport java.util.*;\n\npublic class KeyValueStore {\n    private static class Entry {\n        Object value;\n        Long expiresAt;\n        Entry(Object v, Long exp) { this.value = v; this.expiresAt = exp; }\n    }\n    private final Map<String, Entry> store = new ConcurrentHashMap<>();\n\n    public void set(String key, Object value, Long ttlMs) {\n        Long expiresAt = ttlMs != null ? System.currentTimeMillis() + ttlMs : null;\n        store.put(key, new Entry(value, expiresAt));\n    }\n\n    public Object get(String key) {\n        Entry entry = store.get(key);\n        if (entry == null) return null;\n        if (entry.expiresAt != null && System.currentTimeMillis() > entry.expiresAt) {\n            store.remove(key);\n            return null;\n        }\n        return entry.value;\n    }\n}`,
      cpp: `#include <unordered_map>\n#include <chrono>\n#include <string>\n\nclass KeyValueStore {\n    struct Entry {\n        std::string value;\n        long long expiresAt;\n    };\n    std::unordered_map<std::string, Entry> store;\npublic:\n    void set(const std::string& key, const std::string& val, long long ttlMs = 0) {\n        long long exp = ttlMs > 0 ? getCurrentTimeMs() + ttlMs : 0;\n        store[key] = {val, exp};\n    }\n    long long getCurrentTimeMs() {\n        return std::chrono::duration_cast<std::chrono::milliseconds>(\n            std::chrono::system_clock::now().time_since_epoch()).count();\n    }\n};`,
      go: `package main\n\nimport "time"\n\ntype StoreItem struct {\n    Value     interface{}\n    ExpiresAt int64\n}\n\ntype KeyValueStore struct {\n    store map[string]StoreItem\n}\n\nfunc NewKVStore() *KeyValueStore {\n    return &KeyValueStore{store: make(map[string]StoreItem)}\n}`
    }
  },

  // ─── 3. MACHINE CODING / LLD: Token Bucket Rate Limiter ───
  {
    id: 'token-bucket-rate-limiter',
    title: 'Token Bucket Rate Limiter',
    difficulty: 'MEDIUM',
    category: 'MachineCoding',
    entryPoint: 'TokenBucketRateLimiter',
    description: `Design and implement an API Rate Limiter using the Token Bucket Algorithm.

Requirements:
1. capacity — Maximum tokens the bucket can hold.
2. refillRate — Number of tokens added to the bucket per second.
3. allowRequest(tokens) — Checks if enough tokens are available. If yes, consumes tokens and returns true. Otherwise, returns false without consuming tokens.`,
    starterCode: {
      javascript: `class TokenBucketRateLimiter {\n  constructor(capacity, refillRatePerSec) {\n    this.capacity = capacity;\n    this.refillRate = refillRatePerSec;\n    this.tokens = capacity;\n    this.lastRefill = Date.now();\n  }\n\n  allowRequest(tokens = 1) {\n    this.refill();\n    if (this.tokens >= tokens) {\n      this.tokens -= tokens;\n      return true;\n    }\n    return false;\n  }\n\n  refill() {\n    const now = Date.now();\n    const elapsedSec = (now - this.lastRefill) / 1000;\n    this.tokens = Math.min(this.capacity, this.tokens + elapsedSec * this.refillRate);\n    this.lastRefill = now;\n  }\n}`,
      typescript: `class TokenBucketRateLimiter {\n  private tokens: number;\n  private lastRefill: number;\n\n  constructor(private capacity: number, private refillRatePerSec: number) {\n    this.tokens = capacity;\n    this.lastRefill = Date.now();\n  }\n\n  allowRequest(tokens: number = 1): boolean {\n    this.refill();\n    if (this.tokens >= tokens) {\n      this.tokens -= tokens;\n      return true;\n    }\n    return false;\n  }\n\n  private refill(): void {\n    const now = Date.now();\n    const elapsedSec = (now - this.lastRefill) / 1000;\n    this.tokens = Math.min(this.capacity, this.tokens + elapsedSec * this.refillRatePerSec);\n    this.lastRefill = now;\n  }\n}`,
      python: `import time\n\nclass TokenBucketRateLimiter:\n    def __init__(self, capacity: int, refill_rate_per_sec: float):\n        self.capacity = capacity\n        self.refill_rate = refill_rate_per_sec\n        self.tokens = float(capacity)\n        self.last_refill = time.time()\n\n    def allow_request(self, tokens: int = 1) -> bool:\n        self._refill()\n        if self.tokens >= tokens:\n            self.tokens -= tokens\n            return True\n        return False\n\n    def _refill(self):\n        now = time.time()\n        elapsed = now - self.last_refill\n        self.tokens = min(float(self.capacity), self.tokens + elapsed * self.refill_rate)\n        self.last_refill = now`,
      java: `public class TokenBucketRateLimiter {\n    private final long capacity;\n    private final double refillRatePerSec;\n    private double tokens;\n    private long lastRefill;\n\n    public TokenBucketRateLimiter(long capacity, double refillRatePerSec) {\n        this.capacity = capacity;\n        this.refillRatePerSec = refillRatePerSec;\n        this.tokens = capacity;\n        this.lastRefill = System.currentTimeMillis();\n    }\n\n    public synchronized boolean allowRequest(int tokensNeeded) {\n        refill();\n        if (tokens >= tokensNeeded) {\n            tokens -= tokensNeeded;\n            return true;\n        }\n        return false;\n    }\n\n    private void refill() {\n        long now = System.currentTimeMillis();\n        double elapsedSec = (now - lastRefill) / 1000.0;\n        tokens = Math.min(capacity, tokens + elapsedSec * refillRatePerSec);\n        lastRefill = now;\n    }\n}`,
      cpp: `#include <chrono>\n#include <algorithm>\n\nclass TokenBucketRateLimiter {\n    double capacity;\n    double refillRate;\n    double tokens;\n    std::chrono::time_point<std::chrono::steady_clock> lastRefill;\npublic:\n    TokenBucketRateLimiter(double cap, double rate) : capacity(cap), refillRate(rate), tokens(cap), lastRefill(std::chrono::steady_clock::now()) {}\n};`,
      go: `package main\n\nimport "time"\n\ntype TokenBucketRateLimiter struct {\n    capacity   float64\n    refillRate float64\n    tokens     float64\n    lastRefill time.Time\n}`
    }
  },

  // ─── 4. FRONTEND JS: Concurrent Async Task Queue ───
  {
    id: 'async-task-queue',
    title: 'Concurrent Async Task Queue with Retries',
    difficulty: 'MEDIUM',
    category: 'Frontend',
    entryPoint: 'AsyncTaskQueue',
    description: `Implement a task queue that executes asynchronous functions with a limit on how many run concurrently and retries failed tasks.

Requirements:
1. constructor(concurrency, maxRetries) — Sets max parallel tasks and retries.
2. enqueue(taskFn) — Returns a Promise that resolves when the task finishes or rejects if all retries fail.
3. At most concurrency tasks execute simultaneously.`,
    starterCode: {
      javascript: `class AsyncTaskQueue {\n  constructor(concurrency = 2, maxRetries = 2) {\n    this.concurrency = concurrency;\n    this.maxRetries = maxRetries;\n    this.running = 0;\n    this.queue = [];\n  }\n\n  enqueue(taskFn) {\n    return new Promise((resolve, reject) => {\n      this.queue.push({ taskFn, retries: 0, resolve, reject });\n      this.processNext();\n    });\n  }\n\n  async processNext() {\n    if (this.running >= this.concurrency || this.queue.length === 0) return;\n    this.running++;\n    const item = this.queue.shift();\n\n    try {\n      const result = await item.taskFn();\n      item.resolve(result);\n    } catch (err) {\n      if (item.retries < this.maxRetries) {\n        item.retries++;\n        this.queue.unshift(item);\n      } else {\n        item.reject(err);\n      }\n    } finally {\n      this.running--;\n      this.processNext();\n    }\n  }\n}`,
      typescript: `type TaskFn<T> = () => Promise<T>;\n\nclass AsyncTaskQueue {\n  private running = 0;\n  private queue: Array<{ taskFn: TaskFn<any>; retries: number; resolve: (val: any) => void; reject: (err: any) => void }> = [];\n\n  constructor(private concurrency: number = 2, private maxRetries: number = 2) {}\n\n  enqueue<T>(taskFn: TaskFn<T>): Promise<T> {\n    return new Promise<T>((resolve, reject) => {\n      this.queue.push({ taskFn, retries: 0, resolve, reject });\n      this.processNext();\n    });\n  }\n\n  private async processNext(): Promise<void> {\n    if (this.running >= this.concurrency || this.queue.length === 0) return;\n    this.running++;\n    const item = this.queue.shift()!;\n    try {\n      const res = await item.taskFn();\n      item.resolve(res);\n    } catch (err) {\n      if (item.retries < this.maxRetries) {\n        item.retries++;\n        this.queue.unshift(item);\n      } else {\n        item.reject(err);\n      }\n    } finally {\n      this.running--;\n      this.processNext();\n    }\n  }\n}`,
      python: `import asyncio\n\nclass AsyncTaskQueue:\n    def __init__(self, concurrency: int = 2, max_retries: int = 2):\n        self.semaphore = asyncio.Semaphore(concurrency)\n        self.max_retries = max_retries\n\n    async def enqueue(self, task_fn):\n        async with self.semaphore:\n            for attempt in range(self.max_retries + 1):\n                try:\n                    return await task_fn()\n                except Exception as e:\n                    if attempt == self.max_retries:\n                        raise e`,
      java: `import java.util.concurrent.*;\n\npublic class AsyncTaskQueue {\n    private final ExecutorService executor;\n    public AsyncTaskQueue(int concurrency) {\n        this.executor = Executors.newFixedThreadPool(concurrency);\n    }\n}`,
      cpp: `#include <thread>\n#include <future>\n#include <queue>\n\nclass AsyncTaskQueue {\n    // Thread Pool / Task Queue implementation\n};`,
      go: `package main\n\ntype AsyncTaskQueue struct {\n    sem chan struct{}\n}\n\nfunc NewTaskQueue(concurrency int) *AsyncTaskQueue {\n    return &AsyncTaskQueue{sem: make(chan struct{}, concurrency)}\n}`
    }
  },

  // ─── 5. BACKEND & DISTRIBUTED: Thread-safe LRU Cache ───
  {
    id: 'lru-cache',
    title: 'LRU Cache (Least Recently Used)',
    difficulty: 'MEDIUM',
    category: 'Backend',
    entryPoint: 'LRUCache',
    description: `Design a data structure for a Least Recently Used (LRU) Cache with fixed capacity.

Requirements:
1. get(key) — Return the value if the key exists, otherwise return -1.
2. put(key, value) — Adds or updates the key-value pair. If capacity is exceeded, evict the least recently accessed key first.

Example:
const cache = new LRUCache(2);
cache.put(1, 1);
cache.put(2, 2);
cache.get(1);    // returns 1
cache.put(3, 3); // evicts key 2
cache.get(2);    // returns -1 (not found)`,
    starterCode: {
      javascript: `class TokenBucketRateLimiter {\n  constructor(capacity, refillRatePerSec) {\n    this.capacity = capacity;\n    this.refillRate = refillRatePerSec;\n    this.tokens = capacity;\n    this.lastRefill = Date.now();\n  }\n\n  allowRequest(tokens = 1) {\n    this.refill();\n    if (this.tokens >= tokens) {\n      this.tokens -= tokens;\n      return true;\n    }\n    return false;\n  }\n\n  refill() {\n    const now = Date.now();\n    const elapsedSec = (now - this.lastRefill) / 1000;\n    this.tokens = Math.min(this.capacity, this.tokens + elapsedSec * this.refillRate);\n    this.lastRefill = now;\n  }\n}`,
      typescript: `class TokenBucketRateLimiter {\n  private tokens: number;\n  private lastRefill: number;\n\n  constructor(private capacity: number, private refillRatePerSec: number) {\n    this.tokens = capacity;\n    this.lastRefill = Date.now();\n  }\n\n  allowRequest(tokens: number = 1): boolean {\n    this.refill();\n    if (this.tokens >= tokens) {\n      this.tokens -= tokens;\n      return true;\n    }\n    return false;\n  }\n\n  private refill(): void {\n    const now = Date.now();\n    const elapsedSec = (now - this.lastRefill) / 1000;\n    this.tokens = Math.min(this.capacity, this.tokens + elapsedSec * this.refillRatePerSec);\n    this.lastRefill = now;\n  }\n}`,
      python: `import time\n\nclass TokenBucketRateLimiter:\n    def __init__(self, capacity: int, refill_rate_per_sec: float):\n        self.capacity = capacity\n        self.refill_rate = refill_rate_per_sec\n        self.tokens = float(capacity)\n        self.last_refill = time.time()\n\n    def allow_request(self, tokens: int = 1) -> bool:\n        self._refill()\n        if self.tokens >= tokens:\n            self.tokens -= tokens\n            return True\n        return False\n\n    def _refill(self):\n        now = time.time()\n        elapsed = now - self.last_refill\n        self.tokens = min(float(self.capacity), self.tokens + elapsed * self.refill_rate)\n        self.last_refill = now`,
      java: `public class TokenBucketRateLimiter {\n    private final long capacity;\n    private final double refillRatePerSec;\n    private double tokens;\n    private long lastRefill;\n\n    public TokenBucketRateLimiter(long capacity, double refillRatePerSec) {\n        this.capacity = capacity;\n        this.refillRatePerSec = refillRatePerSec;\n        this.tokens = capacity;\n        this.lastRefill = System.currentTimeMillis();\n    }\n\n    public synchronized boolean allowRequest(int tokensNeeded) {\n        refill();\n        if (tokens >= tokensNeeded) {\n            tokens -= tokensNeeded;\n            return true;\n        }\n        return false;\n    }\n\n    private void refill() {\n        long now = System.currentTimeMillis();\n        double elapsedSec = (now - lastRefill) / 1000.0;\n        tokens = Math.min(capacity, tokens + elapsedSec * refillRatePerSec);\n        lastRefill = now;\n    }\n}`,
      cpp: `#include <chrono>\n#include <algorithm>\n\nclass TokenBucketRateLimiter {\n    double capacity;\n    double refillRate;\n    double tokens;\n    std::chrono::time_point<std::chrono::steady_clock> lastRefill;\npublic:\n    TokenBucketRateLimiter(double cap, double rate) : capacity(cap), refillRate(rate), tokens(cap), lastRefill(std::chrono::steady_clock::now()) {}\n};`,
      go: `package main\n\nimport "time"\n\ntype TokenBucketRateLimiter struct {\n    capacity   float64\n    refillRate float64\n    tokens     float64\n    lastRefill time.Time\n}`
    }
  },

  // ─── 4. FRONTEND JS: Concurrent Async Task Queue ───
  {
    id: 'async-task-queue',
    title: 'Concurrent Async Task Queue with Retries',
    difficulty: 'MEDIUM',
    category: 'Frontend',
    entryPoint: 'AsyncTaskQueue',
    description: `Implement a Promise-based Async Task Queue that executes tasks with a maximum concurrency limit and automatic retries on failure.

### Requirements:
1. \`constructor(concurrency: number, maxRetries: number = 2)\`
2. \`enqueue(taskFn: () => Promise<any>): Promise<any>\` — Returns a Promise that resolves when \`taskFn\` completes or rejects if all retries fail.
3. At most \`concurrency\` tasks may execute in parallel.

### Example:
\`\`\`javascript
const queue = new AsyncTaskQueue(2, 3);
const res = await queue.enqueue(() => fetch('/api/data'));
\`\`\``,
    starterCode: {
      javascript: `class AsyncTaskQueue {\n  constructor(concurrency = 2, maxRetries = 2) {\n    this.concurrency = concurrency;\n    this.maxRetries = maxRetries;\n    this.running = 0;\n    this.queue = [];\n  }\n\n  enqueue(taskFn) {\n    return new Promise((resolve, reject) => {\n      this.queue.push({ taskFn, retries: 0, resolve, reject });\n      this.processNext();\n    });\n  }\n\n  async processNext() {\n    if (this.running >= this.concurrency || this.queue.length === 0) return;\n    this.running++;\n    const item = this.queue.shift();\n\n    try {\n      const result = await item.taskFn();\n      item.resolve(result);\n    } catch (err) {\n      if (item.retries < this.maxRetries) {\n        item.retries++;\n        this.queue.unshift(item);\n      } else {\n        item.reject(err);\n      }\n    } finally {\n      this.running--;\n      this.processNext();\n    }\n  }\n}`,
      typescript: `type TaskFn<T> = () => Promise<T>;\n\nclass AsyncTaskQueue {\n  private running = 0;\n  private queue: Array<{ taskFn: TaskFn<any>; retries: number; resolve: (val: any) => void; reject: (err: any) => void }> = [];\n\n  constructor(private concurrency: number = 2, private maxRetries: number = 2) {}\n\n  enqueue<T>(taskFn: TaskFn<T>): Promise<T> {\n    return new Promise<T>((resolve, reject) => {\n      this.queue.push({ taskFn, retries: 0, resolve, reject });\n      this.processNext();\n    });\n  }\n\n  private async processNext(): Promise<void> {\n    if (this.running >= this.concurrency || this.queue.length === 0) return;\n    this.running++;\n    const item = this.queue.shift()!;\n    try {\n      const res = await item.taskFn();\n      item.resolve(res);\n    } catch (err) {\n      if (item.retries < this.maxRetries) {\n        item.retries++;\n        this.queue.unshift(item);\n      } else {\n        item.reject(err);\n      }\n    } finally {\n      this.running--;\n      this.processNext();\n    }\n  }\n}`,
      python: `import asyncio\n\nclass AsyncTaskQueue:\n    def __init__(self, concurrency: int = 2, max_retries: int = 2):\n        self.semaphore = asyncio.Semaphore(concurrency)\n        self.max_retries = max_retries\n\n    async def enqueue(self, task_fn):\n        async with self.semaphore:\n            for attempt in range(self.max_retries + 1):\n                try:\n                    return await task_fn()\n                except Exception as e:\n                    if attempt == self.max_retries:\n                        raise e`,
      java: `import java.util.concurrent.*;\n\npublic class AsyncTaskQueue {\n    private final ExecutorService executor;\n    public AsyncTaskQueue(int concurrency) {\n        this.executor = Executors.newFixedThreadPool(concurrency);\n    }\n}`,
      cpp: `#include <thread>\n#include <future>\n#include <queue>\n\nclass AsyncTaskQueue {\n    // Thread Pool / Task Queue implementation\n};`,
      go: `package main\n\ntype AsyncTaskQueue struct {\n    sem chan struct{}\n}\n\nfunc NewTaskQueue(concurrency int) *AsyncTaskQueue {\n    return &AsyncTaskQueue{sem: make(chan struct{}, concurrency)}\n}`
    }
  },

  // ─── 5. BACKEND & DISTRIBUTED: Thread-safe LRU Cache ───
  {
    id: 'lru-cache',
    title: 'LRU Cache (Least Recently Used)',
    difficulty: 'MEDIUM',
    category: 'Backend',
    entryPoint: 'LRUCache',
    description: `Design a data structure for a Least Recently Used (LRU) Cache with a fixed capacity.

Requirements:
1. get(key) — Return the value if the key exists, otherwise return -1.
2. put(key, value) — Adds or updates the key-value pair. If capacity is exceeded, evict the least recently accessed key first.

Example:
const cache = new LRUCache(2);
cache.put(1, 1);
cache.put(2, 2);
cache.get(1);    // returns 1
cache.put(3, 3); // evicts key 2
cache.get(2);    // returns -1 (not found)`,
    starterCode: {
      javascript: `class LRUCache {\n  /**\n   * @param {number} capacity\n   */\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.cache = new Map();\n  }\n\n  /**\n   * @param {number} key\n   * @return {number}\n   */\n  get(key) {\n    if (!this.cache.has(key)) return -1;\n    const val = this.cache.get(key);\n    this.cache.delete(key);\n    this.cache.set(key, val);\n    return val;\n  }\n\n  /**\n   * @param {number} key\n   * @param {number} value\n   * @return {void}\n   */\n  put(key, value) {\n    if (this.cache.has(key)) {\n      this.cache.delete(key);\n    } else if (this.cache.size >= this.capacity) {\n      const oldestKey = this.cache.keys().next().value;\n      this.cache.delete(oldestKey);\n    }\n    this.cache.set(key, value);\n  }\n}`,
      typescript: `class LRUCache {\n  private cache = new Map<number, number>();\n  constructor(private capacity: number) {}\n\n  get(key: number): number {\n    if (!this.cache.has(key)) return -1;\n    const val = this.cache.get(key)!;\n    this.cache.delete(key);\n    this.cache.set(key, val);\n    return val;\n  }\n\n  put(key: number, value: number): void {\n    if (this.cache.has(key)) {\n      this.cache.delete(key);\n    } else if (this.cache.size >= this.capacity) {\n      const oldestKey = this.cache.keys().next().value!;\n      this.cache.delete(oldestKey);\n    }\n    this.cache.set(key, value);\n  }\n}`,
      python: `from collections import OrderedDict\n\nclass LRUCache:\n    def __init__(self, capacity: int):\n        self.capacity = capacity\n        self.cache = OrderedDict()\n\n    def get(self, key: int) -> int:\n        if key not in self.cache:\n            return -1\n        self.cache.move_to_end(key)\n        return self.cache[key]\n\n    def put(self, key: int, value: int) -> None:\n        if key in self.cache:\n            self.cache.move_to_end(key)\n        self.cache[key] = value\n        if len(self.cache) > self.capacity:\n            self.cache.popitem(last=False)`,
      java: `import java.util.LinkedHashMap;\nimport java.util.Map;\n\nclass LRUCache {\n    private final int capacity;\n    private final LinkedHashMap<Integer, Integer> map;\n\n    public LRUCache(int capacity) {\n        this.capacity = capacity;\n        this.map = new LinkedHashMap<Integer, Integer>(capacity, 0.75f, true) {\n            @Override\n            protected boolean removeEldestEntry(Map.Entry<Integer, Integer> eldest) {\n                return size() > LRUCache.this.capacity;\n            }\n        };\n    }\n\n    public int get(int key) {\n        return map.getOrDefault(key, -1);\n    }\n\n    public void put(int key, int value) {\n        map.put(key, value);\n    }\n}`,
      cpp: `#include <unordered_map>\n#include <list>\n\nclass LRUCache {\n    int cap;\n    std::list<std::pair<int, int>> l;\n    std::unordered_map<int, std::list<std::pair<int, int>>::iterator> m;\npublic:\n    LRUCache(int capacity) : cap(capacity) {}\n    int get(int key) {\n        if (m.find(key) == m.end()) return -1;\n        l.splice(l.begin(), l, m[key]);\n        return m[key]->second;\n    }\n    void put(int key, int value) {\n        if (m.find(key) != m.end()) {\n            l.splice(l.begin(), l, m[key]);\n            m[key]->second = value;\n            return;\n        }\n        if (l.size() == cap) {\n            m.erase(l.back().first);\n            l.pop_back();\n        }\n        l.emplace_front(key, value);\n        m[key] = l.begin();\n    }\n};`,
      go: `package main\n\ntype LRUCache struct {\n    capacity int\n}`
    }
  }
];

export default function CodingInterviewRoom() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Dark Theme by Default
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('dark');

  const toggleTheme = () => {
    const next = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(next);
  };

  // Core Room States
  const [session, setSession] = useState<SessionData | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Booting up Monaco compiler engine...');
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingLabel, setProcessingLabel] = useState('');

  // Active Console Tab
  const [consoleTab, setConsoleTab] = useState<'testcases' | 'terminal'>('testcases');

  // Multi-Problem Catalog & Active Problem State (Total count hidden from candidate)
  const [problems, setProblems] = useState<any[]>(FALLBACK_PROBLEMS);
  const [currentProblemIndex, setCurrentProblemIndex] = useState<number>(0);
  const [selectedProblemId, setSelectedProblemId] = useState<string>('two-sum');
  const [currentProblem, setCurrentProblem] = useState<any>(FALLBACK_PROBLEMS[0]);
  const [savedCodes, setSavedCodes] = useState<Record<string, Record<string, string>>>({});

  // Real-time Captions State
  const [activeCaption, setActiveCaption] = useState<{ speaker: 'ava' | 'user'; text: string } | null>({
    speaker: 'ava',
    text: "Welcome to your technical coding assessment. Review the problem on the left and run test cases when you write code."
  });

  // Socratic Coding States
  const [codeLanguage, setCodeLanguage] = useState('javascript');
  const [codeValue, setCodeValue] = useState(LANGUAGE_BOILERPLATES.javascript);
  const [hintCount, setLocalHintCount] = useState(0);
  const [unlockedHints, setUnlockedHints] = useState<string[]>([]);
  const [consoleOutput, setConsoleOutput] = useState('Terminal sandbox initialized. Click [Run Test Cases] to execute.');
  const [consoleColor, setConsoleColor] = useState('text-slate-300');
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [isRunningCode, setIsRunningCode] = useState(false);
  const [testResults, setTestResults] = useState<CodeEvaluationResponse | null>(null);
  const [interviewerFeedback, setInterviewerFeedback] = useState<any>(null);

  // Audio/Video Hardware Telemetry
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);

  // AI Speech/Avatar Animation States
  const [avatarState, setAvatarState] = useState<AvatarState>('idle');
  const [aiIsSpeaking, setAiIsSpeaking] = useState(false);
  const [mouthOpenness, setMouthOpenness] = useState(0.08);
  const [spokenWord, setSpokenWord] = useState('');
  const [activeViseme, setActiveViseme] = useState<OculusViseme>('viseme_sil');
  const [clarificationInput, setClarificationInput] = useState('');

  // Speech Recognition States (Web Speech API)
  const [answerText, setAnswerText] = useState('');
  const finalTranscriptRef = useRef('');
  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef(false);
  const latestAnswerRef = useRef('');

  // Interview History
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);

  // Solved problem tracking & Strict Interview Evaluator States
  const [solvedProblemIds, setSolvedProblemIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('renatus_solved_coding_problems') || '[]');
    } catch {
      return [];
    }
  });
  const hasAskedComplexityRef = useRef<boolean>(false);
  const complexityAttemptsRef = useRef<number>(0);
  const waitingForComplexityResponseRef = useRef<boolean>(false);

  // Proctoring telemetry logs
  const proctorDataRef = useRef({
    tabBlurCount: 0,
    gazeScores: [] as number[],
  });

  const questionStartRef = useRef<number | null>(null);
  const currentQuestionRef = useRef<QuestionData | null>(null);
  useEffect(() => {
    currentQuestionRef.current = currentQuestion;
  }, [currentQuestion]);

  // Proactive Socratic Code Checking Telemetry (1 to 2 minutes interval)
  const lastCodeCheckedRef = useRef<string>('');
  const lastProactiveSpokenTimeRef = useRef<number>(Date.now());
  const lastSpokenAdviceCategoryRef = useRef<string>('');
  const codeValueRef = useRef<string>(codeValue);
  const aiIsSpeakingRef = useRef<boolean>(aiIsSpeaking);
  const isProcessingRef = useRef<boolean>(isProcessing);

  useEffect(() => {
    codeValueRef.current = codeValue;
  }, [codeValue]);

  useEffect(() => {
    aiIsSpeakingRef.current = aiIsSpeaking;
  }, [aiIsSpeaking]);

  useEffect(() => {
    isProcessingRef.current = isProcessing;
  }, [isProcessing]);

  // Clean unmount: kill all voice synthesis immediately on leave
  useEffect(() => {
    return () => {
      stopAllSpeech();
    };
  }, []);

  // Face telemetry & Proctoring engine
  const { stressCoefficient, isOffGaze, eyeGazeScore } = useFaceTelemetry(mediaStream, isCameraOn, id);

  // Multi-Modal Behavioral & Speech Telemetry Engine
  const candidateMetrics = useCandidateAnalysis(mediaStream, isCameraOn, isMicOn, id, answerText);

  useEffect(() => {
    if (isCameraOn && mediaStream) {
      proctorDataRef.current.gazeScores.push(eyeGazeScore);
      if (proctorDataRef.current.gazeScores.length > 200) {
        proctorDataRef.current.gazeScores.shift();
      }
    }
  }, [eyeGazeScore, isCameraOn, mediaStream]);

  // Disqualification and Cheating Enforcement
  const [isDisqualified, setIsDisqualified] = useState(false);
  const [disqualificationReason, setDisqualificationReason] = useState('');
  const hasDisqualifiedRef = useRef(false);
  const [showExitModal, setShowExitModal] = useState(false);

  const handleDisqualifyAndAutoSubmit = useCallback(async (reason: string) => {
    if (hasDisqualifiedRef.current || !id) return;
    hasDisqualifiedRef.current = true;
    setIsDisqualified(true);
    setDisqualificationReason(reason);

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen().catch(() => {});
      }
    } catch {}

    if (mediaStream) {
      mediaStream.getTracks().forEach((t) => t.stop());
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    try {
      await apiClient.post(`/interview/session/${id}/complete`, {
        isDisqualified: true,
        cheatingDetected: true,
        disqualificationReason: reason,
        confidenceMetrics: {
          score: 0,
          signals: { avgWpm: 0, avgPauseCount: 0, avgAnswerLength: 0 }
        },
        proctoring: {
          eyeContactScore: 0,
          presenceScore: 0,
          tabBlurCount: 99,
          flag: 'DISQUALIFIED_CHEATING_DETECTED'
        }
      });
    } catch (err) {
      console.error('Failed to log coding disqualification:', err);
    }

    toast.error(`Exam Terminated: ${reason}`);
    setTimeout(() => {
      navigate(`/interview/${id}/analysis`);
    }, 1500);
  }, [id, mediaStream, navigate]);

  // Browser anti-cheat blocks & desktop switch detection
  useEffect(() => {
    if (!currentProblem || isLoading || hasDisqualifiedRef.current) return;

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !hasDisqualifiedRef.current) {
        handleDisqualifyAndAutoSubmit("Full-screen mode exited or candidate gestured to desktop.");
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && !hasDisqualifiedRef.current) {
        handleDisqualifyAndAutoSubmit("Virtual desktop switch, tab switch, or window minimized during exam.");
      }
    };

    const handleBlur = () => {
      if (!hasDisqualifiedRef.current) {
        handleDisqualifyAndAutoSubmit("Window focus lost: candidate shifted desktops or clicked external application.");
      }
    };

    const blockBackNavigation = () => {
      window.history.pushState(null, '', window.location.href);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', blockBackNavigation);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('popstate', blockBackNavigation);
    };
  }, [currentProblem, isLoading, handleDisqualifyAndAutoSubmit]);

  // Algorithmic approach analyzer (Brute Force vs Optimal vs Binary Search)
  const analyzeApproach = (code: string) => {
    const cleanCode = code.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');

    // Check for nested loops or quadratic iterations (Brute Force)
    const hasNestedLoops = /(for|while)\s*\(.*?\)\s*\{[^{}]*(for|while)\s*\(|(for|while)\s*\(.*?\)[\s\S]*?(for|while)\s*\(|\.forEach\([^)]*?\([^)]*?=>[\s\S]*?\.forEach|for\s*\(.*?\)[\s\S]*?(\.indexOf|\.includes|\.findIndex)/i.test(cleanCode);

    // Check for hash map / dictionary lookup (Optimal)
    const hasHashMap = /(new Map\(|Map<|unordered_map|HashMap|seen\[|dict\[|lookup\[|memo\[|\.has\(|\.set\(|\.get\()/i.test(cleanCode);

    // Check for binary search / two-pointer pattern
    const hasBinarySearchOrTwoPointers = /(binarySearch|left\s*<=?\s*right|low\s*<=?\s*high|mid\s*=|Math\.floor\(\s*\(\s*left|\/\s*2\b|while\s*\(\s*left\s*<\s*right)/i.test(cleanCode);

    return {
      hasNestedLoops,
      hasHashMap,
      hasBinarySearchOrTwoPointers,
    };
  };

  // Strict FAANG Technical Evaluator: Analyzes candidate's verbal complexity explanation
  const evaluateCandidateComplexityAnswer = (
    candidateText: string,
    problem: any,
    code: string
  ): { isCorrect: boolean; feedback: string; emotion: AvatarState } => {
    const lower = candidateText.toLowerCase().trim();
    const approach = analyzeApproach(code);

    const targetTime = (problem?.optimalTime || 'O(N)').toLowerCase();
    const targetSpace = (problem?.optimalSpace || 'O(1)').toLowerCase();
    const isCurrentlyQuadratic = approach.hasNestedLoops && !approach.hasHashMap;

    // Detect claims
    const claimsConstantTime = lower.includes('o(1)') || lower.includes('o of 1') || lower.includes('constant time');
    const claimsLogTime = lower.includes('o(log') || lower.includes('log n') || lower.includes('logarithmic');
    const claimsLinearTime = lower.includes('o(n)') || lower.includes('o of n') || lower.includes('linear time');
    const claimsNLogNTime = lower.includes('n log n') || lower.includes('o(n log n)') || lower.includes('linearithmic');
    const claimsQuadraticTime = lower.includes('o(n^2)') || lower.includes('o(n squared)') || lower.includes('n square') || lower.includes('quadratic');

    const claimsConstantSpace = lower.includes('o(1)') || lower.includes('constant space') || lower.includes('no extra space');
    const claimsLinearSpace = lower.includes('o(n)') || lower.includes('linear space') || lower.includes('o of n space');

    const mentionedAnyComplexity = claimsConstantTime || claimsLogTime || claimsLinearTime || claimsNLogNTime || claimsQuadraticTime || claimsConstantSpace || claimsLinearSpace;
    const admitsNotKnowing = lower.includes("don't know") || lower.includes("dont know") || lower.includes("not sure") || lower.includes("no idea");

    if (admitsNotKnowing) {
      return {
        isCorrect: false,
        feedback: "You said you don't know. Think about how many times your loops iterate through the input. Do you know the time and space complexity or not?",
        emotion: 'concerned'
      };
    }

    if (!mentionedAnyComplexity) {
      return {
        isCorrect: false,
        feedback: "You said wrong. That is not a valid time and space complexity. Can you think carefully and tell me again? Do you know this or not?",
        emotion: 'concerned'
      };
    }

    let timeMatches = false;
    if (isCurrentlyQuadratic) {
      timeMatches = claimsQuadraticTime || (claimsLinearTime && targetTime.includes('o(n)'));
    } else if (targetTime.includes('o(log n)')) {
      timeMatches = claimsLogTime;
    } else if (targetTime.includes('o(n log n)')) {
      timeMatches = claimsNLogNTime;
    } else if (targetTime.includes('o(n)')) {
      timeMatches = claimsLinearTime;
    } else if (targetTime.includes('o(1)')) {
      timeMatches = claimsConstantTime;
    }

    if (timeMatches) {
      return {
        isCorrect: true,
        feedback: "That's correct. Good analysis. Continue writing your solution and test your code when you're ready.",
        emotion: 'pleased'
      };
    } else {
      return {
        isCorrect: false,
        feedback: "You said wrong. That is not the correct time and space complexity. Can you think carefully and tell me again? Do you know this or not?",
        emotion: 'concerned'
      };
    }
  };

  // Deep Socratic Reasoning Engine: Analyzes candidate code & query accurately
  const evaluateSocraticFeedback = (
    userInput: string,
    code: string,
    problem: any,
    language: string,
    currentResults: any
  ): { reply: string; emotion: AvatarState } => {
    const text = (userInput || '').toLowerCase();
    const cleanCode = code.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '').trim();

    const hasNestedLoops = /(for|while)\s*\(.*?\)\s*\{[^{}]*(for|while)\s*\(|(for|while)\s*\(.*?\)[\s\S]*?(for|while)\s*\(|\.forEach\([^)]*?\([^)]*?=>[\s\S]*?\.forEach|for\s*\(.*?\)[\s\S]*?(\.indexOf|\.includes|\.findIndex)|for\s+\w+\s+in[\s\S]*?for\s+\w+\s+in/i.test(cleanCode);
    const hasHashMap = /(new Map\(|Map<|unordered_map|HashMap|seen\[|dict\[|lookup\[|memo\[|\.has\(|\.set\(|\.get\(|std::unordered_map|make\(map)/i.test(cleanCode);
    const hasTwoPointers = /(binarySearch|left\s*<=?\s*right|low\s*<=?\s*high|mid\s*=|Math\.floor\(\s*\(\s*left|\/\s*2\b|while\s*\(\s*left\s*<\s*right|i\s*<\s*j)/i.test(cleanCode);
    const hasSorting = /(sort\(|\.sort\(|sorted\(|Arrays\.sort|std::sort)/i.test(cleanCode);
    const isBareFunction = cleanCode.length < 90 || !/(for|while|return\s+\[\w+|return\s+\{\w+|return\s+\w+)/i.test(cleanCode);

    // 1. Candidate asking for help / advice
    if (text.includes('help') || text.includes('stuck') || text.includes('how to solve') || text.includes('approach') || text.includes('what should i do')) {
      if (isBareFunction) {
        return {
          reply: "You've got the function signature set up. Let's start with your intuition: as you iterate through the elements, what information do you need to look up instantly to find the matching pair?",
          emotion: 'thinking',
        };
      }
      if (hasNestedLoops && !hasHashMap) {
        return {
          reply: "I'm looking directly at your code: you currently have nested loops comparing pairs in O(N²) quadratic time. In a production tech interview, that will exceed time limits. Inside the inner loop, you are searching for (target - nums[i]). What data structure would let you look up previously seen numbers in O(1) constant time instead of O(N)?",
          emotion: 'thinking',
        };
      }
      if (hasHashMap) {
        return {
          reply: "Your hash map approach is on the optimal O(N) path! Make sure your logic checks whether the complement exists before or while inserting, and be careful to return the index positions rather than the array values.",
          emotion: 'thinking',
        };
      }
      if (hasTwoPointers) {
        return {
          reply: "Two pointers is a clean algorithmic pattern, but remember that two pointers requires the array to be sorted first. Sorting would cost O(N log N) time and would scramble the original indices. Can we achieve linear O(N) time without sorting by using extra space?",
          emotion: 'thinking',
        };
      }
      return {
        reply: "Take a step back and identify the core bottleneck. What redundant work is being done, and what data structure would allow you to check previous values in constant time?",
        emotion: 'thinking',
      };
    }

    // 2. Candidate asking about failed test cases
    if (text.includes('fail') || text.includes('error') || text.includes('why') || text.includes('test case')) {
      if (currentResults && currentResults.passedCount < currentResults.totalCount) {
        if (hasNestedLoops && !hasHashMap) {
          return {
            reply: `You passed ${currentResults.passedCount} of ${currentResults.totalCount} test cases. Nested loops will struggle on large hidden test cases. Let's optimize to a single pass using a hash map to avoid time limit exceeded errors.`,
            emotion: 'thinking',
          };
        }
        return {
          reply: `Notice the failed test cases: check your boundary conditions, return statement, and make sure you return the indices of the matching pair, not the values.`,
          emotion: 'thinking',
        };
      }
      return {
        reply: "Trace your code with a small edge case: what happens when the array contains duplicate numbers, negative values, or when the target is zero?",
        emotion: 'thinking',
      };
    }

    // 3. Candidate asking about time / space complexity
    if (text.includes('time') || text.includes('space') || text.includes('complexity') || text.includes('big o') || text.includes('big-o')) {
      return {
        reply: "As the candidate, you should analyze and tell me: what do you think is the time and space complexity of what you've implemented so far?",
        emotion: 'thinking',
      };
    }

    // 4. Candidate asking about optimal / better approach
    if (text.includes('optimal') || text.includes('better') || text.includes('optimize') || text.includes('can i do better')) {
      if (hasNestedLoops) {
        return {
          reply: "Yes, you can optimize this significantly! By using a hash map or dictionary, you can store numbers as you visit them. This eliminates the inner loop and drops your runtime from O(N²) to O(N) linear time.",
          emotion: 'pleased',
        };
      }
      if (hasHashMap) {
        return {
          reply: "Your hash map solution is already the optimal O(N) single-pass approach! Make sure you handle edge cases cleanly.",
          emotion: 'pleased',
        };
      }
    }

    // 5. General fallback
    if (hasNestedLoops && !hasHashMap) {
      return {
        reply: "I notice you are working on a nested loop brute-force solution. That works for small inputs, but takes O(N²) time. How can we use a hash table to achieve O(N) runtime?",
        emotion: 'thinking',
      };
    }
    if (hasHashMap) {
      return {
        reply: "Your hash map logic is looking promising. Talk me through how your code handles edge cases like duplicates or negative numbers.",
        emotion: 'speaking',
      };
    }

    return {
      reply: "Walk me through what your algorithm is doing step-by-step. What is your current time and space complexity?",
      emotion: 'speaking',
    };
  };

  // Cleanly formats problem description & examples into modern cards without raw markdown
  const renderCleanProblemDescription = (rawDesc: string) => {
    if (!rawDesc) return null;
    const cleanDesc = rawDesc.split(/###?\s*Constraints/i)[0].trim();
    
    // Split into core explanation and examples
    const parts = cleanDesc.split(/###?\s*Example\s*\d*:?/i);
    const mainStatement = parts[0]
      .replace(/```text[\s\S]*?```/g, '')
      .replace(/`([^`]+)`/g, '$1')
      .trim();

    // Extract example blocks
    const exampleRegex = /(?:###?\s*)?Example\s*(\d+)?:?\s*(?:```text)?([\s\S]*?)(?:```|$)(?=(?:###?\s*Example|\s*$))/gi;
    const examples: Array<{ title: string; input: string; output: string; explanation?: string }> = [];
    let match;
    let count = 1;
    while ((match = exampleRegex.exec(cleanDesc)) !== null) {
      const block = match[2] || match[0];
      const inputMatch = block.match(/Input:\s*([^\n\r]+)/i);
      const outputMatch = block.match(/Output:\s*([^\n\r]+)/i);
      const expMatch = block.match(/Explanation:\s*([^\n\r]+)/i);
      if (inputMatch || outputMatch) {
        examples.push({
          title: `Example ${count++}`,
          input: inputMatch ? inputMatch[1].trim() : '',
          output: outputMatch ? outputMatch[1].trim() : '',
          explanation: expMatch ? expMatch[1].trim() : undefined,
        });
      }
    }

    return (
      <div className="space-y-3.5">
        <p className={`text-xs leading-relaxed font-sans ${themeMode === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
          {mainStatement}
        </p>

        {examples.length > 0 && (
          <div className="space-y-2.5 pt-1">
            {examples.map((ex, i) => (
              <div 
                key={i}
                className={`p-3 rounded-xl border text-[11px] font-mono space-y-1.5 transition-all ${
                  themeMode === 'light' 
                    ? 'bg-slate-50 border-slate-200 text-slate-800' 
                    : 'bg-slate-900/90 border-slate-800 text-slate-300'
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#4A8BDF] font-mono block">
                  {ex.title}
                </span>
                {ex.input && (
                  <div>
                    <span className="text-slate-500 font-semibold mr-1.5">Input:</span>
                    <span className={themeMode === 'light' ? 'text-slate-900' : 'text-slate-100'}>{ex.input}</span>
                  </div>
                )}
                {ex.output && (
                  <div>
                    <span className="text-slate-500 font-semibold mr-1.5">Output:</span>
                    <span className={themeMode === 'light' ? 'text-slate-900 font-bold' : 'text-emerald-400 font-bold'}>{ex.output}</span>
                  </div>
                )}
                {ex.explanation && (
                  <div className="text-[10px] text-slate-400 font-sans mt-0.5">
                    <span className="font-semibold text-slate-500 mr-1 font-mono">Note:</span>
                    {ex.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Compile and execute candidate code against sandbox test cases
  const handleRunCode = async () => {
    if (isRunningCode) return;

    const trimmedCode = (codeValue || '').trim();
    const isOnlyCommentsOrEmpty = trimmedCode.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '').replace(/#.*/g, '').trim().length === 0;

    if (!trimmedCode || isOnlyCommentsOrEmpty) {
      setIsConsoleOpen(true);
      setConsoleTab('terminal');
      setConsoleColor('text-rose-400');
      setConsoleOutput(`[ERROR] No code submitted.\nPlease write your complete solution in the editor before running.\n`);
      toast.error('No code to run. Please write your solution.');
      await aiSpeak("You haven't written any code yet. Please implement your solution before running.");
      return;
    }

    setIsConsoleOpen(true);
    setIsRunningCode(true);
    setConsoleColor('text-slate-400 animate-pulse');
    setConsoleOutput('Compiling code and running sandboxed hidden test suite...\n');
    setConsoleTab('testcases');

    const timestamp = new Date().toLocaleTimeString();

    try {
      let result: any = null;

      // 1. Attempt backend sandbox microservice first
      try {
        result = await codingApi.runTestCases(
          id || 'session',
          codeValue,
          codeLanguage,
          selectedProblemId
        );
      } catch (backendErr: any) {
        console.warn('[CodingRoom] Backend sandbox service unavailable, evaluating via client sandbox engine:', backendErr);
      }

      // 2. If backend was unreachable or returned empty/malformed results, run client sandbox evaluator
      if (!result || !result.testResults || result.testResults.length === 0) {
        const clientEval = await evaluateCodeLocally(codeValue, codeLanguage, currentProblem);
        result = {
          success: clientEval.success,
          passedCount: clientEval.passedCount,
          totalCount: clientEval.totalCount,
          testResults: clientEval.testResults,
          errorDetails: clientEval.errorDetails,
          stdout: clientEval.stdout,
          runtimeMs: clientEval.runtimeMs,
          language: clientEval.language,
        };
      }

      setTestResults(result);

      if (result.interviewerResponse) {
        setInterviewerFeedback(result.interviewerResponse);
        if (result.interviewerResponse.avatarEmotion) {
          setAvatarState(result.interviewerResponse.avatarEmotion as any);
        }
      }

      if (result.success) {
        setConsoleColor('text-emerald-400');
        let logs = `[${timestamp}] COMPILATION & TEST SUITE PASSED\n`;
        logs += `==========================================\n`;
        logs += `Status: SUCCESS (${result.passedCount}/${result.totalCount} hidden test cases passed)\n`;
        logs += `Runtime: ${result.runtimeMs || 14}ms\n\n`;
        if (result.stdout) {
          logs += `Standard Output:\n${result.stdout}\n\n`;
        }
        logs += `All hidden test cases passed. Your code is verified!`;
        setConsoleOutput(logs);
        toast.success(`Passed all ${result.passedCount}/${result.totalCount} hidden test cases!`);

        // Record problem as solved
        if (selectedProblemId) {
          setSolvedProblemIds((prev) => Array.from(new Set([...prev, selectedProblemId])));
          try {
            await apiClient.post('/interview/coding/solved', { problemId: selectedProblemId, language: codeLanguage });
          } catch {}
          try {
            const saved = JSON.parse(localStorage.getItem('renatus_solved_coding_problems') || '[]');
            if (!saved.includes(selectedProblemId)) {
              saved.push(selectedProblemId);
              localStorage.setItem('renatus_solved_coding_problems', JSON.stringify(saved));
            }
          } catch {}
        }

        // Detect candidate approach
        const approach = analyzeApproach(codeValue);
        let feedbackMessage = "";

        if (approach.hasNestedLoops && !approach.hasHashMap) {
          feedbackMessage = "Your solution passes the basic test cases, but it operates in O(N²) quadratic time complexity. In an engineering interview, you will be asked: how can we optimize this to O(N) linear time using a hash map?";
        } else if (approach.hasHashMap) {
          feedbackMessage = "Outstanding! You solved this in an optimal O(N) time with a hash map. All hidden test cases passed.";
        } else if (approach.hasBinarySearchOrTwoPointers) {
          feedbackMessage = "Brilliant work! You've demonstrated the two-pointer approach as well.";
        } else {
          feedbackMessage = "Great job! All hidden test cases passed cleanly.";
        }

        waitingForComplexityResponseRef.current = true;
        hasAskedComplexityRef.current = true;
        await aiSpeak(feedbackMessage + " Now, can you explain the time and space complexity of your implementation?");
      } else {
        setConsoleColor('text-orange-400');
        let logs = `[${timestamp}] TEST SUITE EVALUATION\n`;
        logs += `==========================================\n`;
        logs += `Passed: ${result.passedCount}/${result.totalCount} hidden test cases\n`;
        if (result.runtimeMs) {
          logs += `Runtime: ${result.runtimeMs}ms\n\n`;
        }
        if (result.stdout) {
          logs += `Standard Output:\n${result.stdout}\n\n`;
        }
        logs += `${result.errorDetails || 'Incorrect return value for edge cases.'}`;
        setConsoleOutput(logs);
        toast.error(`Passed ${result.passedCount}/${result.totalCount} hidden test cases. Check edge conditions.`);

        const feedbackMessage = result.errorDetails && result.errorDetails.includes('Compilation')
          ? "There is a compilation error in your code. Review the compiler output and fix the syntax before running again."
          : `You passed ${result.passedCount} of ${result.totalCount} hidden test cases. Boundary conditions or edge cases failed. Look at the test output and trace through your logic.`;
        await aiSpeak(feedbackMessage);
      }
    } catch (err: any) {
      setConsoleColor('text-rose-400');
      const errMsg = err.response?.data?.error || err.message || 'Execution error';
      setConsoleOutput(`[COMPILER ERROR] Execution halted: ${errMsg}`);
      toast.error('Code execution failed. Check syntax.');
      await aiSpeak("Don't worry, syntax hiccups happen under interview pressure. Review the error in compiler output and let's run it again.");
    } finally {
      setIsRunningCode(false);
    }
  };

  const handleRequestHint = async () => {
    if (isProcessing) return;
    const nextCount = Math.min(3, hintCount + 1);
    setLocalHintCount(nextCount);
    toast.success(`Requested Level ${nextCount} hint`);
    await aiSpeak(`Here is a Level ${nextCount} progressive hint for your problem: Consider tracking previously seen elements using an auxiliary Hash Map structure for constant-time lookup.`);
  };


  // Add system speaker transcript entries
  const addTranscriptEntry = useCallback((speaker: 'ai' | 'user', text: string) => {
    setTranscript((prev) => [
      ...prev,
      {
        id: `${speaker}-${Date.now()}-${Math.random()}`,
        speaker,
        text,
        timestamp: Date.now()
      }
    ]);
  }, []);

  // AI Voice speech synthesizer (also updates live on-screen captions)
  const aiSpeak = useCallback((text: string): Promise<void> => {
    return new Promise((resolve) => {
      addTranscriptEntry('ai', text);
      setActiveCaption({ speaker: 'ava', text });
      setAvatarState('speaking');
      setSpokenWord('');
      setActiveViseme('viseme_sil');

      speakWithLipSync(text, {
        onStart: () => setAiIsSpeaking(true),
        onEnd: () => {
          setAiIsSpeaking(false);
          setMouthOpenness(0.08);
          setSpokenWord('');
          setActiveViseme('viseme_sil');
          setAvatarState('listening');
          resolve();
        },
        onViseme: (openness, fragment, _shape, visemeId) => {
          setMouthOpenness(openness);
          if (fragment && fragment.trim()) setSpokenWord(fragment.trim());
          if (visemeId) {
            setActiveViseme(mapVisemeIdToOculus(visemeId));
          }
        }
      });
    });
  }, [addTranscriptEntry]);

  // Switch to next problem seamlessly without revealing total question count
  const handleSkipQuestion = async () => {
    // Save current problem code
    if (currentProblem) {
      setSavedCodes((prev) => ({
        ...prev,
        [currentProblem.id]: {
          ...(prev[currentProblem.id] || {}),
          [codeLanguage]: codeValue,
        },
      }));
    }

    const targetList = problems.length > 0 ? problems : CODING_PROBLEMS;
    const solvedSet = new Set(solvedProblemIds);
    let candidatePool = targetList.filter((p: any) => !solvedSet.has(p.id) && p.id !== currentProblem?.id);
    if (candidatePool.length === 0) {
      candidatePool = targetList.filter((p: any) => p.id !== currentProblem?.id);
    }
    if (candidatePool.length === 0) candidatePool = targetList;

    const nextProb = candidatePool[Math.floor(Math.random() * candidatePool.length)] || targetList[(currentProblemIndex + 1) % targetList.length];
    const nextIndex = targetList.findIndex((p: any) => p.id === nextProb.id);

    setCurrentProblemIndex(nextIndex >= 0 ? nextIndex : 0);
    setSelectedProblemId(nextProb.id);
    setCurrentProblem(nextProb);

    // Restore saved code if available, else start completely clean
    const restoredCode = savedCodes[nextProb.id]?.[codeLanguage] || '';
    setCodeValue(restoredCode);
    setTestResults(null);
    setInterviewerFeedback(null);
    hasAskedComplexityRef.current = false;
    complexityAttemptsRef.current = 0;
    waitingForComplexityResponseRef.current = false;
    toast.success('Loaded next question');

    const message = "No problem at all! Let's pivot to a different challenge. Take a breath, review the new problem statement on the left, and explain your thought process out loud when you're ready.";
    await aiSpeak(message);
    startListening();
  };

  // Return to first problem and restore its code
  const handleReturnToFirstQuestion = async () => {
    const targetList = problems.length > 0 ? problems : CODING_PROBLEMS;
    const firstProb = targetList[0];

    // Save current question code
    if (currentProblem) {
      setSavedCodes((prev) => ({
        ...prev,
        [currentProblem.id]: {
          ...(prev[currentProblem.id] || {}),
          [codeLanguage]: codeValue,
        },
      }));
    }

    setCurrentProblemIndex(0);
    setSelectedProblemId(firstProb.id);
    setCurrentProblem(firstProb);

    const restoredCode = savedCodes[firstProb.id]?.[codeLanguage] || '';
    setCodeValue(restoredCode);
    setTestResults(null);
    setInterviewerFeedback(null);
    hasAskedComplexityRef.current = false;
    complexityAttemptsRef.current = 0;
    waitingForComplexityResponseRef.current = false;
    toast.success('Returned to first question');

    const message = "Okay, let's go back to your first challenge. Here is the question and your code.";
    await aiSpeak(message);
    startListening();
  };

  // Interactive Conversational Handler (Intent detection)
  const handleConversationalInput = async (rawInput: string) => {
    const text = rawInput.trim();
    if (!text || isProcessing) return;

    addTranscriptEntry('user', text);
    setActiveCaption({ speaker: 'user', text });
    setClarificationInput('');
    setAnswerText('');
    finalTranscriptRef.current = '';

    const lower = text.toLowerCase();

    // 1. Skip / unable to solve / change question intent (e.g. "Sorry, I am not able to do this question")
    const isSkipIntent =
      lower.includes("not able to do this question") ||
      lower.includes("not able to do this") ||
      lower.includes("not able to solve") ||
      lower.includes("unable to solve") ||
      lower.includes("change this question") ||
      lower.includes("change the question") ||
      lower.includes("change question") ||
      lower.includes("different question") ||
      lower.includes("don't know this question") ||
      lower.includes("don't know") ||
      lower.includes("dont know") ||
      lower.includes("skip this question") ||
      lower.includes("skip question") ||
      lower.includes("next question") ||
      lower.includes("next problem") ||
      lower.includes("cannot solve") ||
      lower.includes("can't solve") ||
      (lower.includes("sorry") && (lower.includes("not able") || lower.includes("can't") || lower.includes("cannot") || lower.includes("stuck")));

    if (isSkipIntent) {
      await handleSkipQuestion();
      return;
    }

    // 2. Return to first question intent
    if (
      lower.includes("first question") ||
      lower.includes("first solution") ||
      lower.includes("remember my first") ||
      lower.includes("remember the first") ||
      lower.includes("back to the first") ||
      lower.includes("back to question 1") ||
      lower.includes("go back to my first")
    ) {
      await handleReturnToFirstQuestion();
      return;
    }

    // 3. Strict Complexity Evaluation if candidate was asked about complexity or mentions Big-O
    const isDiscussingComplexity =
      waitingForComplexityResponseRef.current ||
      lower.includes('complexity') ||
      lower.includes('big o') ||
      lower.includes('o(n') ||
      lower.includes('o(1') ||
      lower.includes('o of') ||
      lower.includes('log n') ||
      lower.includes('n square') ||
      lower.includes('quadratic') ||
      lower.includes('linear');

    if (isDiscussingComplexity) {
      const evalRes = evaluateCandidateComplexityAnswer(text, currentProblem, codeValue);
      if (evalRes.isCorrect) {
        waitingForComplexityResponseRef.current = false;
        hasAskedComplexityRef.current = true;
        setAvatarState('pleased');
        await aiSpeak(evalRes.feedback);
        startListening();
        return;
      } else {
        complexityAttemptsRef.current += 1;
        if (complexityAttemptsRef.current >= 2) {
          waitingForComplexityResponseRef.current = false;
          setAvatarState('concerned');
          await aiSpeak("You said wrong again. Let's move on with your code implementation, and we will evaluate your complexity reasoning in the final technical report.");
        } else {
          setAvatarState('concerned');
          await aiSpeak("You said wrong. That is not the correct time and space complexity. Can you think carefully and tell me again? Do you know this or not?");
        }
        startListening();
        return;
      }
    }

    // 4. General Socratic Dialogue with Deep Code Context
    setIsProcessing(true);
    setAvatarState('thinking');
    setProcessingLabel('Ava is analyzing your approach...');

    try {
      let replyText = '';
      let emotionState: AvatarState = 'thinking';

      try {
        const dialogueRes = await codingApi.sendDialogue(id || '', selectedProblemId, text, codeValue);
        if (dialogueRes && dialogueRes.reply && dialogueRes.reply.length > 20 && !dialogueRes.reply.includes("That's a thoughtful question regarding")) {
          replyText = dialogueRes.reply;
          emotionState = dialogueRes.emotion || 'speaking';
        }
      } catch {}

      if (!replyText) {
        const localEval = evaluateSocraticFeedback(text, codeValue, currentProblem, codeLanguage, testResults);
        replyText = localEval.reply;
        emotionState = localEval.emotion;
      }

      setIsProcessing(false);
      setProcessingLabel('');
      setAvatarState(emotionState);
      await aiSpeak(replyText);
      startListening();
    } catch {
      setIsProcessing(false);
      setProcessingLabel('');
      const localEval = evaluateSocraticFeedback(text, codeValue, currentProblem, codeLanguage, testResults);
      await aiSpeak(localEval.reply);
      startListening();
    }
  };

  // Speech Recognition control hooks
  const startListening = useCallback(() => {
    if (!recognitionRef.current || !isMicOn) return;

    setAvatarState('listening');
    setAnswerText('');
    finalTranscriptRef.current = '';
    isListeningRef.current = true;

    try {
      recognitionRef.current.start();
    } catch {
      // Already running
    }
  }, [isMicOn]);

  const stopListening = useCallback(() => {
    isListeningRef.current = false;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Already stopped
      }
    }
  }, []);

  // Submit code solution & transcript
  const submitSolution = useCallback(async () => {
    if (!currentQuestion || isProcessing) return;

    const spokenAnswer = latestAnswerRef.current.trim();
    stopListening();
    setIsProcessing(true);
    setAvatarState('thinking');
    setProcessingLabel('Ava is compiling your final code solution and STAR score metrics...');

    try {
      await apiClient.post(`/interview/session/${id}/answer`, {
        questionId: currentQuestion.id,
        answerText: `[Final Submission in ${codeLanguage}]:\n\`\`\`${codeLanguage}\n${codeValue}\n\`\`\`\n[Candidate Final Verbal Defense]: ${spokenAnswer || 'Complete solution submitted.'}`,
        timeTaken: Math.max(10, Math.floor((Date.now() - (questionStartRef.current || Date.now())) / 1000)),
      });
      
      const nextRes = await apiClient.get(`/interview/session/${id}/next`);

      if (nextRes.data.isComplete) {
        setAvatarState('pleased');
        await aiSpeak(
          "Outstanding work! You have completed the coding evaluation round. I am generating your granular readiness report and technical scorecard now."
        );
        
        if (mediaStream) {
          mediaStream.getTracks().forEach((t) => t.stop());
        }

        const gaze = proctorDataRef.current.gazeScores;
        const eyeContactScore = gaze.length
          ? Math.round(gaze.reduce((a, b) => a + b, 0) / gaze.length)
          : 85;
        const tabBlurCount = proctorDataRef.current.tabBlurCount;
        const presenceScore = Math.max(0, Math.min(100, 100 - tabBlurCount * 15));

        const confidenceMetrics = {
          score: candidateMetrics.speakingConfidence || 85,
          signals: {
            avgWpm: candidateMetrics.speechRateWpm || 125,
            avgPauseCount: candidateMetrics.fidgetIndex || 0,
            avgAnswerLength: candidateMetrics.expressionBreakdown?.focused ?? 50,
          },
        };

        await apiClient.post(`/interview/session/${id}/complete`, {
          confidenceMetrics,
          proctoring: {
            eyeContactScore,
            presenceScore,
            tabBlurCount,
          },
        });

        toast.success('Coding Assessment Completed!');
        navigate(`/interview/${id}/analysis`);
      } else {
        const nextQ = nextRes.data.question;
        setCurrentQuestion(nextQ);
        setAnswerText('');
        latestAnswerRef.current = '';
        setIsProcessing(false);
        setProcessingLabel('');
        
        await aiSpeak(`Great progress. Here is your next problem: ${nextQ.questionText}`);
        startListening();
      }
    } catch (err) {
      console.warn('Backend submission failed, proceeding with local analysis:', err);
      setIsProcessing(false);
      setProcessingLabel('');
      toast.success('Coding Assessment Completed!');
      navigate(`/coding/${id}/analysis`);
    }
  }, [id, currentQuestion, isProcessing, codeValue, codeLanguage, aiSpeak, startListening, stopListening, navigate, mediaStream]);

  const handleSaveAndExit = useCallback(() => {
    if (currentProblem && id) {
      localStorage.setItem(`coding_session_code_${id}_${currentProblem.id}`, codeValue);
    }
    stopListening();
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => {
        try { track.stop(); } catch {}
      });
    }
    navigate('/coding');
  }, [currentProblem, id, codeValue, stopListening, mediaStream, navigate]);

  // End Call Button Handler (Terminates session & navigates directly to analysis)
  const handleEndCall = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen().catch(() => {});
      }
    } catch {}

    stopListening();
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => {
        try { track.stop(); } catch {}
      });
    }
    stopAllSpeech();

    try {
      const gaze = proctorDataRef.current.gazeScores;
      const eyeContactScore = gaze.length
        ? Math.round(gaze.reduce((a, b) => a + b, 0) / gaze.length)
        : 85;
      const tabBlurCount = proctorDataRef.current.tabBlurCount;
      const presenceScore = Math.max(0, Math.min(100, 100 - tabBlurCount * 15));

      await apiClient.post(`/interview/session/${id}/complete`, {
        confidenceMetrics: {
          score: candidateMetrics?.speakingConfidence || 85,
          signals: {
            avgWpm: candidateMetrics?.speechRateWpm || 125,
            avgPauseCount: candidateMetrics?.fidgetIndex || 0,
            avgAnswerLength: candidateMetrics?.expressionBreakdown?.focused ?? 50,
          },
        },
        proctoring: {
          eyeContactScore,
          presenceScore,
          tabBlurCount,
        },
      });
    } catch {}

    toast.success('Interview session ended.');
    navigate(`/interview/${id}/analysis`);
  }, [id, mediaStream, stopListening, candidateMetrics, navigate]);

  // Speech Recognition lifecycle setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';

    rec.onresult = (event: any) => {
      let interimText = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const chunk = result[0]?.transcript || '';
        if (result.isFinal) {
          finalTranscriptRef.current += chunk + ' ';
          const lowerChunk = chunk.toLowerCase().trim();
          const isSkipTrigger =
            lowerChunk.includes("not able to do this question") ||
            lowerChunk.includes("not able to do this") ||
            lowerChunk.includes("not able to solve") ||
            lowerChunk.includes("unable to solve") ||
            lowerChunk.includes("change this question") ||
            lowerChunk.includes("change the question") ||
            lowerChunk.includes("change question") ||
            lowerChunk.includes("different question") ||
            lowerChunk.includes("don't know this question") ||
            lowerChunk.includes("skip question") ||
            lowerChunk.includes("skip this question") ||
            lowerChunk.includes("next question") ||
            lowerChunk.includes("next problem") ||
            lowerChunk.includes("cannot solve") ||
            lowerChunk.includes("can't solve") ||
            (lowerChunk.includes("sorry") && (lowerChunk.includes("not able") || lowerChunk.includes("can't") || lowerChunk.includes("cannot") || lowerChunk.includes("stuck")));

          if (isSkipTrigger) {
            handleSkipQuestion();
            return;
          }
          if (
            lowerChunk.includes("remember my first question") ||
            lowerChunk.includes("first solution again") ||
            lowerChunk.includes("back to my first")
          ) {
            handleReturnToFirstQuestion();
            return;
          }
        } else {
          interimText += chunk;
        }
      }
      const combined = `${finalTranscriptRef.current}${interimText}`.replace(/\s+/g, ' ').trim();
      setAnswerText(combined);
      latestAnswerRef.current = combined;
      if (combined) {
        setActiveCaption({ speaker: 'user', text: combined });
      }
    };

    rec.onend = () => {
      if (isListeningRef.current) {
        try { rec.start(); } catch {}
      }
    };

    recognitionRef.current = rec;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  // Hardware setups
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  useEffect(() => {
    let active = true;
    let localStream: MediaStream | null = null;

    async function setupHardware() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: 'user' },
          audio: true,
        });
        if (active) {
          setMediaStream(stream);
          localStream = stream;
        } else {
          stream.getTracks().forEach((track) => track.stop());
        }
      } catch (err) {
        console.error('Failed to secure proctoring cameras:', err);
        toast.error('Camera/Mic access is required for proctoring.');
      }
    }

    setupHardware();
    loadSpeechVoices();

    return () => {
      active = false;
      if (localStream) {
        localStream.getTracks().forEach((track) => {
          try {
            track.stop();
          } catch {}
        });
      }
    };
  }, []);

  // Fetch Session data on mount
  useEffect(() => {
    async function loadSession() {
      try {
        setLoadingMessage('Configuring secure IDE container & loading problem catalog...');

        // 1. Load Problem Catalog
        let problemList: any[] = [];
        try {
          problemList = await codingApi.getProblems();
          if (Array.isArray(problemList) && problemList.length > 0) {
            setProblems(problemList);
          } else {
            setProblems(CODING_PROBLEMS);
            problemList = CODING_PROBLEMS;
          }
        } catch (catErr) {
          console.warn('Failed to load catalog:', catErr);
          setProblems(CODING_PROBLEMS);
          problemList = CODING_PROBLEMS;
        }

        // 2. Load Session details
        let sessionData: any = null;
        try {
          sessionData = await codingApi.getSession(id || '');
        } catch {
          try {
            const fallbackRes = await apiClient.get(`/interview/session/${id}`);
            sessionData = fallbackRes.data;
          } catch {}
        }

        setSession(sessionData);

        // Fetch user's solved problems
        let userSolved: string[] = [];
        try {
          const solvedRes = await apiClient.get('/interview/coding/solved');
          if (solvedRes.data?.solvedProblemIds) {
            userSolved = solvedRes.data.solvedProblemIds;
            setSolvedProblemIds(userSolved);
          }
        } catch {
          userSolved = solvedProblemIds;
        }

        // 3. Resolve active problem — pick fresh unsolved problem if not explicit
        const solvedSet = new Set(userSolved);
        let targetProbId = sessionData?.problemId;
        if (!targetProbId) {
          const unsolvedPool = problemList.filter((p: any) => !solvedSet.has(p.id));
          const chosen = unsolvedPool.length > 0 ? unsolvedPool[Math.floor(Math.random() * unsolvedPool.length)] : problemList[0];
          targetProbId = chosen?.id || 'two-sum';
        }

        setSelectedProblemId(targetProbId);

        const initialIndex = problemList.findIndex((p: any) => p.id === targetProbId);
        setCurrentProblemIndex(initialIndex >= 0 ? initialIndex : 0);

        let activeProb = problemList.find((p: any) => p.id === targetProbId) || problemList[0];
        if (!activeProb) {
          try {
            activeProb = await codingApi.getProblemById(targetProbId);
          } catch {}
        }
        if (!activeProb) {
          activeProb = CODING_PROBLEMS[0];
        }

        setCurrentProblem(activeProb);
        // Start completely clean — candidate writes full program structure from scratch
        setCodeValue('');

        setIsLoading(false);
      } catch (err) {
        console.error('Failed to bootstrap coding session:', err);
        setLoadError('Failed to initialize coding playground session.');
        setIsLoading(false);
      }
    }

    loadSession();
  }, [id, codeLanguage]);

  // Language switch handler with code preservation
  const handleLanguageChange = async (newLang: string) => {
    if (currentProblem) {
      setSavedCodes((prev) => ({
        ...prev,
        [currentProblem.id]: {
          ...(prev[currentProblem.id] || {}),
          [codeLanguage]: codeValue,
        },
      }));
    }

    setCodeLanguage(newLang);
    const restored = savedCodes[currentProblem?.id]?.[newLang] || '';
    setCodeValue(restored);
    toast.success(`Switched to ${newLang.toUpperCase()}`);
  };

  // Auto-start coding interview session
  const hasAutoStartedRef = useRef(false);

  const handleJoinCall = useCallback(async () => {
    try {
      const container = document.documentElement;
      if (container.requestFullscreen) {
        await container.requestFullscreen();
      }
    } catch {}

    if (currentProblem) {
      const intro = `Welcome to your technical coding assessment. I am Ava, your interviewer today. I'll be reviewing your algorithmic reasoning, problem-solving approach, and code implementation. Take your time to review the problem statement on the left, speak your thoughts out loud, and run your code when you are ready. Let's begin!`;
      await aiSpeak(intro);
    }
  }, [currentProblem, aiSpeak]);

  useEffect(() => {
    if (!isLoading && currentProblem && !hasAutoStartedRef.current) {
      hasAutoStartedRef.current = true;
      handleJoinCall();
    }
  }, [isLoading, currentProblem, handleJoinCall]);

  // Proactive Socratic Code Review Loop (Ava checks code every 30-45 seconds)
  useEffect(() => {
    if (isLoading || !currentProblem) return;

    const intervalId = setInterval(async () => {
      // Guard clauses: do not interrupt if AI is speaking, processing, disqualified, or spoke recently (<30s)
      if (
        aiIsSpeakingRef.current ||
        isProcessingRef.current ||
        isDisqualified ||
        Date.now() - lastProactiveSpokenTimeRef.current < 30000
      ) {
        return;
      }

      const currentCode = (codeValueRef.current || '').trim();
      const isNearlyEmpty = currentCode.length <= 15;
      const isUnchanged = currentCode === lastCodeCheckedRef.current;

      // 1. Candidate is idle / analyzing problem
      if (isNearlyEmpty || isUnchanged) {
        if (lastSpokenAdviceCategoryRef.current === 'idle_hint') {
          return;
        }
        lastSpokenAdviceCategoryRef.current = 'idle_hint';
        lastProactiveSpokenTimeRef.current = Date.now();
        lastCodeCheckedRef.current = currentCode;

        const hint = "I notice you are analyzing the problem. Feel free to explain your initial thoughts out loud. What data structure or algorithmic pattern comes to mind for this challenge?";
        await aiSpeak(hint);
        return;
      }

      // 2. Candidate has written code — ask about complexity!
      if (!hasAskedComplexityRef.current && currentCode.length > 25) {
        lastSpokenAdviceCategoryRef.current = 'complexity_check';
        lastProactiveSpokenTimeRef.current = Date.now();
        lastCodeCheckedRef.current = currentCode;
        waitingForComplexityResponseRef.current = true;
        hasAskedComplexityRef.current = true;

        await aiSpeak("I see your code taking shape. Can you explain the time and space complexity of your approach?");
        startListening();
        return;
      }

      // 3. Candidate approach analysis
      const approach = analyzeApproach(currentCode);

      if (approach.hasNestedLoops && !approach.hasHashMap) {
        if (lastSpokenAdviceCategoryRef.current === 'nested_loops') return;
        lastSpokenAdviceCategoryRef.current = 'nested_loops';
        lastProactiveSpokenTimeRef.current = Date.now();
        lastCodeCheckedRef.current = currentCode;

        await aiSpeak(
          "I see you are using nested loops here. That will execute in quadratic O(N²) time. Think about how a hash table can help you optimize this to linear time."
        );
        return;
      }

      if (currentCode.length > 40 && !testResults) {
        if (lastSpokenAdviceCategoryRef.current === 'run_code_prompt') return;
        lastSpokenAdviceCategoryRef.current = 'run_code_prompt';
        lastProactiveSpokenTimeRef.current = Date.now();
        lastCodeCheckedRef.current = currentCode;

        await aiSpeak(
          "Your implementation is coming along nicely. Whenever you are ready, click 'Run Code' to test your implementation."
        );
      }
    }, 10000);

    return () => clearInterval(intervalId);
  }, [isLoading, currentProblem, aiSpeak, isDisqualified]);

  if (isDisqualified) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 text-white p-6 overflow-hidden">
        <div className="max-w-lg w-full bg-slate-900 border border-rose-500/50 rounded-3xl p-8 shadow-2xl space-y-6 text-center">
          <div className="h-20 w-20 mx-auto rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500 animate-pulse">
            <ShieldAlert size={40} />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-rose-400 font-bold bg-rose-950/60 border border-rose-800/60 px-3 py-1 rounded-full">
              Integrity Violation Detected
            </span>
            <h1 className="text-2xl font-black font-display text-slate-100 mt-3">
              Coding Exam Terminated & Submitted
            </h1>
            <p className="text-xs text-slate-300 mt-2.5 leading-relaxed font-body">
              {disqualificationReason || "A virtual desktop switch, tab switch, or full-screen exit was detected during your live coding assessment. Your exam has been automatically terminated and submitted as a cheating violation."}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/40 text-left text-xs space-y-2 text-rose-200">
            <div className="flex items-center justify-between font-mono text-[11px]">
              <span>Status:</span>
              <span className="font-bold text-rose-400">DISQUALIFIED</span>
            </div>
            <div className="flex items-center justify-between font-mono text-[11px]">
              <span>Integrity Score:</span>
              <span className="font-bold text-rose-400">0 / 100</span>
            </div>
            <div className="flex items-center justify-between font-mono text-[11px]">
              <span>Violation:</span>
              <span className="font-bold text-rose-400">Recorded in Proctoring Log</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate(`/interview/${id}/analysis`)}
            className="w-full py-3.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-2xl transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2 font-display"
          >
            <span>View Integrity Report →</span>
          </button>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900 px-6 text-white font-body">
        <div className="max-w-md w-full border border-rose-200 bg-white rounded-3xl p-8 text-center space-y-5 shadow-2xl text-slate-800">
          <AlertCircle size={48} className="text-rose-600 mx-auto" />
          <h2 className="text-xl font-bold font-display text-slate-900">Session Initialization Failed</h2>
          <p className="text-xs text-slate-500 leading-relaxed">{loadError}</p>
          <Button onClick={() => navigate('/dashboard')} fullWidth>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center font-body ${
        themeMode === 'light' ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-white'
      }`}>
        <div className="text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2459A8] to-[#4A8BDF] shadow-xl text-white font-bold text-lg font-display animate-pulse">
            RU
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold font-display tracking-tight">Technical Interview Studio</h3>
            <p className="text-xs text-slate-400 font-mono">Initializing evaluation environment...</p>
          </div>
        </div>
      </div>
    );
  }



  return (
    <div 
      className={`w-screen h-screen overflow-hidden flex flex-col font-body select-none transition-colors ${
        themeMode === 'light' ? 'bg-[#F4F7FC] text-slate-800' : 'bg-slate-950 text-slate-200'
      }`}
      onCopy={(e) => { e.preventDefault(); toast.error('SECURITY: Clipboard copying is locked during interview.'); }}
      onCut={(e) => { e.preventDefault(); toast.error('SECURITY: Clipboard cutting is locked during interview.'); }}
      onPaste={(e) => { e.preventDefault(); toast.error('SECURITY: Clipboard pasting is locked during interview.'); }}
    >
      {/* AI Compiler Thinking Overlay */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <div className={`max-w-md w-full border rounded-3xl p-8 text-center space-y-4 shadow-2xl ${
              themeMode === 'light' ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
            }`}>
              <div className="mx-auto h-12 w-12 border-3 border-blue-600 border-t-transparent animate-spin rounded-full" />
              <div>
                <h3 className="text-sm font-bold font-display uppercase tracking-wider">Ava Socratic AI Engine</h3>
                <p className="text-xs text-slate-500 mt-1 font-body">{processingLabel}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header Bar — Minimal, Clean & Polished with Theme Switcher */}
      <header className={`px-6 py-3.5 border-b flex items-center justify-between shrink-0 shadow-xs z-20 transition-colors ${
        themeMode === 'light' ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-100'
      }`}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-[#2459A8] to-[#4A8BDF] flex items-center justify-center text-white font-bold text-xs shadow-sm font-display">
              RU
            </div>
            <span className={`text-base font-bold font-display ${themeMode === 'light' ? 'text-slate-900' : 'text-white'}`}>
              Renatus
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-900/40 text-blue-300 font-mono">
              CODING
            </span>
          </div>

          <div className={`h-4 w-px ${themeMode === 'light' ? 'bg-slate-300' : 'bg-slate-700'}`} />

          <span className={`text-xs sm:text-sm font-semibold truncate max-w-[200px] sm:max-w-md ${
            themeMode === 'light' ? 'text-slate-700' : 'text-slate-300'
          }`}>
            {session?.targetRole || 'Software Engineer'} • Technical Interview
          </span>
        </div>

        {/* Right Header Actions: Timer, Theme Switcher & End Call */}
        <div className="flex items-center gap-2.5">
          <InterviewTimer isRunning={true} />

          <button
            type="button"
            onClick={toggleTheme}
            className={`p-2 rounded-xl transition-all cursor-pointer border flex items-center justify-center ${
              themeMode === 'light'
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700'
            }`}
            title={themeMode === 'light' ? 'Switch to Dark Theme' : 'Switch to Light Theme'}
          >
            {themeMode === 'light' ? <Moon size={15} /> : <Sun size={15} />}
          </button>

          <button
            type="button"
            onClick={handleEndCall}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-sm hover:shadow transition-all cursor-pointer font-display active:scale-95 border border-rose-500/40 whitespace-nowrap"
            title="End interview immediately"
          >
            <PhoneOff className="w-4 h-4" />
            <span>End Call</span>
          </button>
        </div>
      </header>

      {/* Main Studio 2-Pane Split */}
      <main className="flex-1 flex overflow-hidden min-h-0 bg-slate-950 transition-colors">
        
        {/* LEFT PANE (42vw): 1. Question on Top, 2. Ava 3D Avatar & Candidate Video at Bottom */}
        <section className={`w-[42vw] h-full flex flex-col border-r min-w-[380px] overflow-hidden transition-colors ${
          themeMode === 'light' ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
        }`}>
          
          {/* Top Section: Problem Statement & Live Transcript */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            <div className="space-y-3 animate-in fade-in">
              {/* Problem Title Bar (Without Question Title or Easy Badge) */}
              <div className={`flex items-center justify-between gap-2 border-b pb-2.5 ${
                themeMode === 'light' ? 'border-slate-200' : 'border-slate-800'
              }`}>
                <div className="flex items-center gap-2">
                  <Code2 size={16} className="text-[#4A8BDF]" />
                  <h2 className={`text-sm font-bold font-display ${themeMode === 'light' ? 'text-slate-900' : 'text-white'}`}>
                    Problem Description
                  </h2>
                </div>
              </div>

              {/* Clean Problem Description with Formatted Examples */}
              <div className={`p-4 rounded-xl border text-xs leading-relaxed font-body shadow-2xs ${
                themeMode === 'light' ? 'border-slate-200 bg-slate-50/70 text-slate-800' : 'border-slate-800 bg-slate-950/70 text-slate-200'
              }`}>
                {renderCleanProblemDescription(currentProblem?.description || '')}
              </div>

              {/* Change / Skip Question Action */}
              <div className="flex items-center justify-between px-1 text-xs">
                <button
                  type="button"
                  onClick={handleSkipQuestion}
                  className="text-slate-400 hover:text-[#4A8BDF] flex items-center gap-1.5 transition-colors cursor-pointer text-[11px]"
                >
                  <span>Can't solve this? Change question</span>
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Section: 1. Ava's Video (Bright Studio 3D Model) & 2. Candidate's Video */}
          <div className={`p-3.5 border-t shrink-0 grid grid-cols-2 gap-3 ${
            themeMode === 'light' ? 'bg-slate-100/60 border-slate-200' : 'bg-slate-950 border-slate-800'
          }`}>
            {/* Ava 3D Avatar (Moving Three.js WebGL Model with Bright Studio Background) */}
            <div className="relative h-44 rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-700/60 bg-gradient-to-tr from-sky-200 via-indigo-100 to-white shadow-md flex items-center justify-center">
              <AIAvatar
                state={avatarState}
                expression={
                  aiIsSpeaking ? 'SPEAKING' :
                  isProcessing ? 'THINKING' :
                  avatarState === 'listening' ? 'INTERESTED' :
                  avatarState === 'pleased' ? 'ENCOURAGING' :
                  avatarState === 'concerned' ? 'CONCERNED' :
                  'NEUTRAL'
                }
                isSpeaking={aiIsSpeaking}
                mouthOpenness={mouthOpenness}
                activeVisemeShape={activeViseme}
                currentWord={spokenWord}
                persona="AVA"
                className="w-full h-full object-cover"
              />

              {/* Luminous Warm Studio Ambient Vignette */}
              <div className="absolute inset-0 bg-radial-at-c from-transparent via-transparent to-indigo-900/10 pointer-events-none" />
            </div>

            {/* Candidate Live Webcam Feed */}
            <div className="relative h-44 rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-md">
              {mediaStream ? (
                <video
                  ref={(ref) => {
                    if (ref && mediaStream && ref.srcObject !== mediaStream) {
                      ref.srcObject = mediaStream;
                    }
                  }}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover scale-x-[-1]"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 bg-slate-900">
                  <VideoOff size={16} className="mb-1 text-slate-600" />
                  <span className="text-[9px] font-mono">Camera Connecting...</span>
                </div>
              )}
            </div>
          </div>

        </section>

        {/* RIGHT PANE (58vw): Monaco Code Studio & Sandboxed Test Console */}
        <section className="flex-1 h-full flex flex-col min-w-[500px] bg-slate-950 transition-colors">
          
          {/* Top IDE Toolbar */}
          <div className="h-11 shrink-0 px-4 flex items-center justify-between border-b bg-slate-900 border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase font-mono text-slate-400">
                Language:
              </span>
              <select
                value={codeLanguage}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="border text-xs font-semibold px-2.5 py-1 rounded-lg focus:outline-none cursor-pointer transition-colors bg-slate-800 border-slate-700 text-white focus:border-blue-400"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Button: Run Code Only */}
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="royal"
                onClick={() => handleRunCode()}
                disabled={isRunningCode || isProcessing}
                icon={<Play size={12} className="text-white" />}
              >
                {isRunningCode ? 'Running...' : 'Run Code'}
              </Button>
            </div>
          </div>


          {/* Monaco Code Editor */}
          <div className={`flex-1 min-h-0 relative ${
            themeMode === 'light' ? 'bg-white' : 'bg-[#1E1E1E]'
          }`}>
            <Editor
              height="100%"
              language={
                codeLanguage === 'cpp' ? 'cpp' :
                codeLanguage === 'go' ? 'go' :
                codeLanguage === 'python' ? 'python' :
                codeLanguage === 'java' ? 'java' :
                codeLanguage === 'typescript' ? 'typescript' :
                'javascript'
              }
              theme={themeMode === 'light' ? 'light' : 'vs-dark'}
              value={codeValue}
              onChange={(val) => setCodeValue(val || '')}
              onMount={handleEditorDidMount}
              options={{
                fontSize: 14,
                fontFamily: 'JetBrains Mono, Fira Code, monospace',
                minimap: { enabled: false },
                lineNumbers: 'on',
                tabSize: 2,
                cursorBlinking: 'smooth',
                automaticLayout: true,
                padding: { top: 12, bottom: 12 },
                scrollBeyondLastLine: false,
                bracketPairColorization: { enabled: true },
                formatOnType: true,
              }}
            />
          </div>

          {/* Hidden Test Cases & Compiler Output Console */}
          <div className={`shrink-0 border-t flex flex-col transition-all duration-300 ${
            isConsoleOpen ? 'h-64' : 'h-10'
          } ${
            themeMode === 'light' ? 'border-slate-200 bg-white' : 'border-slate-800 bg-slate-900'
          }`}>
            
            {/* Console Header Bar */}
            <div className={`h-10 border-b px-4 flex items-center justify-between shrink-0 ${
              themeMode === 'light' ? 'border-slate-200 bg-slate-50' : 'border-slate-800 bg-slate-950'
            }`}>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsConsoleOpen(true);
                    setConsoleTab('testcases');
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    consoleTab === 'testcases'
                      ? themeMode === 'light'
                        ? 'bg-white text-blue-600 border border-slate-200 shadow-2xs font-bold'
                        : 'bg-slate-800 text-blue-400 border border-slate-700 shadow-xs font-bold'
                      : themeMode === 'light'
                      ? 'text-slate-600 hover:text-slate-900'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Hidden Test Cases {testResults ? `(${testResults.passedCount}/${testResults.totalCount || 5})` : ''}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsConsoleOpen(true);
                    setConsoleTab('terminal');
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    consoleTab === 'terminal'
                      ? themeMode === 'light'
                        ? 'bg-white text-blue-600 border border-slate-200 shadow-2xs font-bold'
                        : 'bg-slate-800 text-blue-400 border border-slate-700 shadow-xs font-bold'
                      : themeMode === 'light'
                      ? 'text-slate-600 hover:text-slate-900'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Compiler Output
                </button>
              </div>

              {/* Collapse / Expand Control */}
              <div className="flex items-center gap-3 text-xs">
                <button
                  onClick={() => setIsConsoleOpen((prev) => !prev)}
                  className={`text-xs transition-colors cursor-pointer flex items-center gap-1 ${
                    themeMode === 'light' ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {isConsoleOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                  <span>{isConsoleOpen ? 'Collapse' : 'Expand'}</span>
                </button>
              </div>
            </div>

            {/* Console Body: Sandboxed Test Matrix or Terminal */}
            {isConsoleOpen && (
              <div className={`flex-1 flex overflow-hidden ${themeMode === 'light' ? 'bg-slate-50 border-t border-slate-200' : 'bg-slate-950 border-t border-slate-800'}`}>
                <div className={`flex-1 p-4 overflow-y-auto font-mono text-xs ${themeMode === 'light' ? 'text-slate-800' : 'text-slate-100'}`}>
                  {consoleTab === 'testcases' ? (
                    <div className="space-y-3">
                      {testResults ? (
                        <div className="space-y-2.5">
                          <div className={`flex items-center justify-between p-3 rounded-xl border ${
                            themeMode === 'light' ? 'bg-white border-slate-200 shadow-2xs' : 'bg-slate-900 border-slate-800'
                          }`}>
                            <div className="flex items-center gap-2">
                              <span className={`font-bold ${themeMode === 'light' ? 'text-slate-900' : 'text-white'}`}>Execution Result:</span>
                              <span className="text-slate-400 text-[11px]">({codeLanguage} sandbox runtime)</span>
                            </div>
                            <Badge variant={testResults.success ? "success" : "error"} size="xs">
                              {testResults.success ? 'All Hidden Cases Passed ✓' : `${testResults.passedCount}/${testResults.totalCount} Passed`}
                            </Badge>
                          </div>

                          {/* Hidden Test Cases Matrix (Inputs/Outputs Strictly Hidden) */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                            {(testResults.testResults || [1, 2, 3, 4, 5]).map((tc: any, i: number) => {
                              const isPassed = typeof tc === 'object' ? tc.passed : false;
                              const time = typeof tc === 'object' && tc.executionTimeMs ? `${tc.executionTimeMs}ms` : '12ms';
                              return (
                                <div
                                  key={i}
                                  className={`p-3 rounded-xl border text-xs flex items-center justify-between font-mono transition-all ${
                                    isPassed
                                      ? themeMode === 'light'
                                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                                        : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                                      : themeMode === 'light'
                                        ? 'bg-rose-50 border-rose-200 text-rose-800'
                                        : 'bg-rose-950/20 border-rose-500/30 text-rose-200'
                                  }`}
                                >
                                  <span className="flex items-center gap-2">
                                    <span className={`h-2 w-2 rounded-full ${isPassed ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                    <span>Hidden Test Case #{i + 1}</span>
                                  </span>
                                  <span className="text-[10px] font-bold">
                                    {isPassed ? `Passed (${time}) ✓` : `Failed (${time}) ✗`}
                                  </span>
                                </div>
                              );
                            })}
                          </div>

                          {testResults.errorDetails && (
                            <div className={`p-3 rounded-xl border text-xs font-mono ${
                              themeMode === 'light' ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                            }`}>
                              {testResults.errorDetails}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className={`p-3 rounded-xl border flex items-center justify-between ${
                            themeMode === 'light' ? 'bg-white border-slate-200 shadow-2xs' : 'bg-slate-900 border-slate-800'
                          }`}>
                            <div className="flex items-center gap-2">
                              <Shield size={14} className="text-blue-500" />
                              <span className={`font-bold text-xs ${themeMode === 'light' ? 'text-slate-900' : 'text-white'}`}>Hidden Test Suite (Sandboxed Matrix)</span>
                            </div>
                            <span className={`text-[11px] font-mono ${themeMode === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>5 Hidden Cases Locked</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {[1, 2, 3, 4, 5].map((caseNum) => (
                              <div
                                key={caseNum}
                                className={`p-3 rounded-xl border flex items-center justify-between text-xs font-mono ${
                                  themeMode === 'light'
                                    ? 'bg-white border-slate-200 text-slate-700'
                                    : 'bg-slate-900/60 border-slate-800 text-slate-300'
                                }`}
                              >
                                <span className="flex items-center gap-2">
                                  <span className={`h-2 w-2 rounded-full ${themeMode === 'light' ? 'bg-slate-400' : 'bg-slate-600'}`} />
                                  <span>Hidden Test Case #{caseNum}</span>
                                </span>
                                <span className={`text-[10px] px-2 py-0.5 rounded ${
                                  themeMode === 'light' ? 'text-slate-500 bg-slate-100' : 'text-slate-500 bg-slate-800/80'
                                }`}>
                                  Locked
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className={`p-3 rounded-xl border text-xs font-sans ${
                            themeMode === 'light'
                              ? 'bg-blue-50 border-blue-200 text-blue-900'
                              : 'bg-blue-950/20 border-blue-500/30 text-blue-200'
                          }`}>
                            All test cases are strictly hidden to evaluate true algorithmic correctness. Click <strong className={`font-mono ${themeMode === 'light' ? 'text-blue-950' : 'text-white'}`}>[Run Test Cases]</strong> to execute your code against this sandbox.
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <pre className={`whitespace-pre-wrap leading-relaxed select-text ${
                      themeMode === 'light' && consoleColor === 'text-slate-300' ? 'text-slate-800' : consoleColor
                    }`}>
                      {consoleOutput}
                    </pre>
                  )}
                </div>

              </div>
            )}

          </div>

        </section>

      </main>

      {/* Exit & Session Preservation Modal */}
      <ExitConfirmationModal
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
        onSaveAndExit={handleSaveAndExit}
        onEndAndSubmit={submitSolution}
        interviewType="CODING"
      />
    </div>
  );
}
