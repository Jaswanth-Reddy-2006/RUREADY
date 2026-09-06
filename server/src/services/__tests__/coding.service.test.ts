import { describe, it, expect } from 'vitest';
import { codingService } from '../coding.service.js';

describe('codingService Multi-Language Sandbox Evaluation Suite', () => {
  // 1. JavaScript Valid Solution
  it('should successfully pass correct JavaScript code solving palindrome checker', async () => {
    const code = `
      function solve(str) {
        const clean = str.toLowerCase().replace(/[^a-z0-9]/g, '');
        return clean === clean.split('').reverse().join('');
      }
    `;

    const testCases = [
      { input: 'racecar', expected: true },
      { input: 'A man, a plan, a canal: Panama', expected: true },
      { input: 'hello', expected: false },
    ];

    const result = await codingService.evaluateCode(code, testCases, 'javascript');
    expect(result.success).toBe(true);
    expect(result.passedCount).toBe(3);
    expect(result.totalCount).toBe(3);
    expect(result.testResults.length).toBe(3);
    expect(result.testResults[0].passed).toBe(true);
    expect(result.errorDetails).toBeUndefined();
  });

  // 2. JavaScript Failing Solution
  it('should halt and report failure for incorrect output returns in JavaScript', async () => {
    const code = `
      function solve(str) {
        return null;
      }
    `;

    const testCases = [
      { input: 'racecar', expected: true },
      { input: 'hello', expected: false },
    ];

    const result = await codingService.evaluateCode(code, testCases, 'javascript');
    expect(result.success).toBe(false);
    expect(result.passedCount).toBe(0);
    expect(result.totalCount).toBe(2);
    expect(result.errorDetails).toContain('Failed');
  });

  // 3. Deep Structural Equality (Two Sum)
  it('should correctly assert deep equality for array values in Two Sum', async () => {
    const code = `
      function solve(nums, target) {
        const map = new Map();
        for (let i = 0; i < nums.length; i++) {
          const comp = target - nums[i];
          if (map.has(comp)) {
            return [map.get(comp), i];
          }
          map.set(nums[i], i);
        }
        return [];
      }
    `;

    const testCases = [
      { input: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { input: [[3, 2, 4], 6], expected: [1, 2] },
    ];

    const result = await codingService.evaluateCode(code, testCases, 'javascript');
    expect(result.success).toBe(true);
    expect(result.passedCount).toBe(2);
  });

  // 4. Python Sandboxed Execution
  it('should successfully execute Python code and return structured test case metrics', async () => {
    const pyCode = `
def solve(s):
    clean = "".join(c.lower() for c in s if c.isalnum())
    return clean == clean[::-1]
`;

    const testCases = [
      { input: 'racecar', expected: true },
      { input: 'hello', expected: false },
    ];

    const result = await codingService.evaluateCode(pyCode, testCases, 'python');
    expect(result.totalCount).toBe(2);
    expect(result.language).toBe('python');
    if (result.success) {
      expect(result.passedCount).toBe(2);
      expect(result.testResults[0].passed).toBe(true);
    }
  });

  // 5. Java Sandboxed Execution
  it('should successfully compile and execute Java code', async () => {
    const javaCode = `
public class Solution {
    public static boolean solve(String s) {
        return true;
    }
}
`;

    const testCases = [
      { input: 'racecar', expected: true },
    ];

    const result = await codingService.evaluateCode(javaCode, testCases, 'java');
    expect(result.totalCount).toBe(1);
    expect(result.language).toBe('java');
  });
});
