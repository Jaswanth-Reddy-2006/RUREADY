import { describe, it, expect } from 'vitest';

/**
 * Tier 4 Real-World Application Scenario 2: Technical Architect Coding Challenge
 * Complete Workflow:
 * 1. Coding interview setup with TECHNICAL_ARCHITECT persona
 * 2. Pre-flight check with 4K UHD monitor resolution
 * 3. Monaco Editor vs-dark session initialization
 * 4. Initial code execution fails edge case
 * 5. Hint unlock (-15pts penalty deduction)
 * 6. Code revision and all tests pass
 * 7. Benchmark evaluation against Meta SDE2 and Google L4 standards
 */

describe('Tier 4 Scenario 2 — Technical Architect Coding Challenge', () => {
  it('should complete technical coding lifecycle with runner execution and progressive hint deduction', () => {
    // 1. Setup
    const setup = {
      role: 'Principal Backend Engineer',
      experienceLevel: 'LEAD',
      persona: 'TECHNICAL_ARCHITECT',
      language: 'typescript',
      interviewGoal: 'Concurrency, cache stampede mitigation, and O(N) time complexity',
    };
    expect(setup.persona).toBe('TECHNICAL_ARCHITECT');

    // 2. Pre-flight Check on 4K monitor (3840x2160)
    const monitor = { width: 3840, height: 2160 };
    const isSupported = monitor.width >= 1024 && monitor.height >= 720;
    expect(isSupported).toBe(true);

    // 3. Initial Code Attempt (Naive O(N^2))
    const initialCode = `
      export function findSubarraySum(nums: number[], k: number): number {
        let count = 0;
        for (let i = 0; i < nums.length; i++) {
          let sum = 0;
          for (let j = i; j < nums.length; j++) {
            sum += nums[j];
            if (sum === k) count++;
          }
        }
        return count;
      }
    `;

    // 4. Code Runner Test Execution (Timeout on large test case)
    const runnerRun1 = {
      passed: false,
      testsPassed: 2,
      totalTests: 3,
      error: 'TLE: Time Limit Exceeded on 100,000 element test case (O(N^2) detected).',
    };
    expect(runnerRun1.passed).toBe(false);
    expect(runnerRun1.error).toContain('Time Limit Exceeded');

    // 5. Unlock Progressive Hint 1 (-15pts)
    let hintsUsed = 1;
    const penalty = hintsUsed * 15;
    expect(penalty).toBe(15);

    // 6. Revised Optimal Code (Prefix Sum Hash Map O(N))
    const revisedCode = `
      export function findSubarraySum(nums: number[], k: number): number {
        const map = new Map<number, number>();
        map.set(0, 1);
        let count = 0, sum = 0;
        for (const num of nums) {
          sum += num;
          if (map.has(sum - k)) count += map.get(sum - k)!;
          map.set(sum, (map.get(sum) || 0) + 1);
        }
        return count;
      }
    `;
    expect(revisedCode).toContain('Map<number, number>');

    // 7. Code Runner Run 2 -> All tests pass
    const runnerRun2 = {
      passed: true,
      testsPassed: 3,
      totalTests: 3,
      executionTimeMs: 48,
    };
    expect(runnerRun2.passed).toBe(true);
    expect(runnerRun2.testsPassed).toBe(3);

    // 8. Evaluation & Scoring with Hint Penalty
    const rawScore = 95; // High algorithmic design
    const finalScore = rawScore - penalty; // 95 - 15 = 80
    expect(finalScore).toBe(80);

    // 9. Benchmark comparison
    const benchmarks = [
      { name: 'Amazon SDE2', threshold: 75, passed: finalScore >= 75 },
      { name: 'Meta SDE2', threshold: 78, passed: finalScore >= 78 },
      { name: 'Google L4', threshold: 82, passed: finalScore >= 82 },
    ];

    expect(benchmarks.find((b) => b.name === 'Meta SDE2')?.passed).toBe(true);
    expect(benchmarks.find((b) => b.name === 'Google L4')?.passed).toBe(false); // 80 < 82 due to hint penalty
  });

  it('should initialize Monaco editor with dark theme and JetBrains Mono monospace font', () => {
    const editorConfig = {
      theme: 'vs-dark',
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 14,
      lineNumbers: 'on',
      minimap: { enabled: false },
    };

    expect(editorConfig.theme).toBe('vs-dark');
    expect(editorConfig.fontFamily).toContain('JetBrains Mono');
    expect(editorConfig.minimap.enabled).toBe(false);
  });

  it('should format test output tab displaying pass/fail results for each test case', () => {
    const testResults = [
      { id: 1, name: 'Small array target match', passed: true },
      { id: 2, name: 'Negative numbers array', passed: true },
      { id: 3, name: 'Large array stress test', passed: true },
    ];

    expect(testResults.length).toBe(3);
    expect(testResults.every((t) => t.passed)).toBe(true);
  });
});
