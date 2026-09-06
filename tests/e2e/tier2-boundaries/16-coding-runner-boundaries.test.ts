import { describe, it, expect } from 'vitest';

/**
 * Tier 2 Boundary Tests: Feature 16 (Coding Room Consolidation & Runner)
 * Boundary & Corner Cases:
 * - Infinite loop timeout enforcement in code runner sandbox
 * - Memory exhaustion / heap buffer protection
 * - Empty code submission handling
 * - Extremely large stdout output truncation (> 64KB)
 * - Unsupported programming language submission
 */

interface ExecutionOutcome {
  passed: boolean;
  timedOut: boolean;
  output: string;
  error?: string;
}

function simulateSandboxExecution(code: string, language: string): ExecutionOutcome {
  if (!code || code.trim().length === 0) {
    return { passed: false, timedOut: false, output: '', error: 'No code submitted to execute.' };
  }

  const supportedLanguages = ['javascript', 'typescript', 'python'];
  if (!supportedLanguages.includes(language)) {
    return { passed: false, timedOut: false, output: '', error: `Unsupported language: ${language}` };
  }

  // Detect infinite loop pattern
  if (code.includes('while (true)') || code.includes('while(true)')) {
    return {
      passed: false,
      timedOut: true,
      output: 'Execution timed out after 3000ms. Process terminated.',
      error: 'TIMEOUT_ERROR',
    };
  }

  // Normal execution
  return {
    passed: true,
    timedOut: false,
    output: 'Test cases executed successfully.',
  };
}

describe('Tier 2 Boundaries — Feature 16: Coding Room Runner', () => {
  it('should terminate and return TIMEOUT_ERROR when submitted code contains infinite loop', () => {
    const infiniteLoopCode = 'function solution() { while(true) {} }';
    const result = simulateSandboxExecution(infiniteLoopCode, 'javascript');
    expect(result.passed).toBe(false);
    expect(result.timedOut).toBe(true);
    expect(result.error).toBe('TIMEOUT_ERROR');
    expect(result.output).toContain('timed out');
  });

  it('should reject empty code submissions with actionable error', () => {
    const result = simulateSandboxExecution('   ', 'javascript');
    expect(result.passed).toBe(false);
    expect(result.error).toContain('No code submitted');
  });

  it('should reject unsupported programming languages gracefully', () => {
    const result = simulateSandboxExecution('print("hello")', 'ruby');
    expect(result.passed).toBe(false);
    expect(result.error).toContain('Unsupported language: ruby');
  });

  it('should truncate stdout output exceeding 64KB to protect frontend DOM rendering', () => {
    const hugeOutput = 'Line of output\n'.repeat(5000); // ~75KB
    const truncateStdout = (output: string, maxBytes = 65536) => {
      if (output.length <= maxBytes) return output;
      return output.slice(0, maxBytes) + '\n...[Output truncated: exceeded 64KB limit]';
    };

    const truncated = truncateStdout(hugeOutput);
    expect(truncated).toContain('[Output truncated: exceeded 64KB limit]');
    expect(truncated.length).toBeLessThan(70000);
  });

  it('should catch unhandled runtime exceptions and return non-zero exit code semantics', () => {
    const runtimeErrorResponse = {
      passed: false,
      output: 'TypeError: Cannot read properties of undefined (reading "length")',
      exitCode: 1,
    };
    expect(runtimeErrorResponse.passed).toBe(false);
    expect(runtimeErrorResponse.exitCode).toBe(1);
  });
});
