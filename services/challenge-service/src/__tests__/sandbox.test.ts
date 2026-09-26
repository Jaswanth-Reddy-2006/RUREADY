// ═══════════════════════════════════════════════════════════════
// RU Ready? — Automated Unit Tests: Code Execution Sandbox
// ═══════════════════════════════════════════════════════════════

import { describe, it, expect } from 'vitest';
import { sandboxService, deepEqual } from '../services/sandbox.service.js';

describe('Sandbox Code Execution Engine', () => {
  it('deepEqual matches arrays with set-like element ordering', () => {
    expect(deepEqual([0, 1], [0, 1])).toBe(true);
    expect(deepEqual([0, 1], [1, 0])).toBe(true);
    expect(deepEqual([1, 2, 3], [3, 2, 1])).toBe(true);
    expect(deepEqual([1, 2], [1, 3])).toBe(false);
  });

  it('successfully evaluates correct Two Sum implementation in JavaScript', async () => {
    const code = `
      function twoSum(nums, target) {
        const map = new Map();
        for (let i = 0; i < nums.length; i++) {
          const complement = target - nums[i];
          if (map.has(complement)) {
            return [map.get(complement), i];
          }
          map.set(nums[i], i);
        }
        return [];
      }
    `;

    const testCases = [
      { input: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { input: [[3, 2, 4], 6], expected: [1, 2] },
      { input: [[3, 3], 6], expected: [0, 1] }
    ];

    const result = await sandboxService.evaluateCode(code, testCases, 'javascript');
    expect(result.success).toBe(true);
    expect(result.passedCount).toBe(3);
    expect(result.totalCount).toBe(3);
  });

  it('correctly reports failure for incorrect implementations', async () => {
    const code = `
      function twoSum(nums, target) {
        return [0, 0];
      }
    `;

    const testCases = [
      { input: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { input: [[3, 2, 4], 6], expected: [1, 2] }
    ];

    const result = await sandboxService.evaluateCode(code, testCases, 'javascript');
    expect(result.success).toBe(false);
    expect(result.passedCount).toBe(0);
  });

  it('blocks dangerous operations (e.g. process access, fs, child_process)', async () => {
    const maliciousCode = `
      function attack() {
        return process.mainModule.require('child_process').execSync('whoami');
      }
    `;

    const result = await sandboxService.evaluateCode(maliciousCode, [{ input: [], expected: '' }], 'javascript');
    expect(result.success).toBe(false);
    expect(result.errorDetails).toContain('Security restriction');
  });

  it('enforces execution timeout on infinite loops without crashing service', async () => {
    const infiniteLoopCode = `
      function solve() {
        while(true) {}
      }
    `;

    const result = await sandboxService.evaluateCode(infiniteLoopCode, [{ input: [], expected: 1 }], 'javascript');
    expect(result.success).toBe(false);
  });
});
