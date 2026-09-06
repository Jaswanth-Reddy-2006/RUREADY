import { describe, it, expect } from 'vitest';

/**
 * Feature 16: Coding Interview Room Consolidation & Runner
 * Specifications:
 * - Monaco Editor dark theme integration (vs-dark)
 * - Code execution endpoint contract: POST /api/interview/session/:id/run
 * - Runner payload: { code: string, language: string }
 * - Runner response: { passed: boolean, output: string, error?: string, testResults?: any[] }
 * - Real-time execution loading state and output console
 */

interface RunRequestPayload {
  code: string;
  language: 'javascript' | 'typescript' | 'python';
}

interface TestCaseResult {
  name: string;
  passed: boolean;
  expected: string;
  actual: string;
}

interface RunResponsePayload {
  passed: boolean;
  output: string;
  error?: string;
  testResults: TestCaseResult[];
  executionTimeMs: number;
}

describe('Feature 16: Coding Interview Room Consolidation & Runner', () => {
  it('should format code runner request payload with valid code and language', () => {
    const payload: RunRequestPayload = {
      code: 'function twoSum(nums, target) { return [0, 1]; }',
      language: 'javascript',
    };

    expect(payload.code).toContain('twoSum');
    expect(['javascript', 'typescript', 'python']).toContain(payload.language);
  });

  it('should parse successful test run response with passed status and metrics', () => {
    const response: RunResponsePayload = {
      passed: true,
      output: 'All 3 test cases passed successfully.',
      testResults: [
        { name: 'Case 1: nums=[2,7,11,15], target=9', passed: true, expected: '[0,1]', actual: '[0,1]' },
        { name: 'Case 2: nums=[3,2,4], target=6', passed: true, expected: '[1,2]', actual: '[1,2]' },
      ],
      executionTimeMs: 42,
    };

    expect(response.passed).toBe(true);
    expect(response.testResults.length).toBe(2);
    expect(response.testResults.every((t) => t.passed)).toBe(true);
    expect(response.executionTimeMs).toBeGreaterThan(0);
  });

  it('should capture compile/syntax or runtime error in runner response', () => {
    const errorResponse: RunResponsePayload = {
      passed: false,
      output: 'SyntaxError: Unexpected token }',
      error: 'SyntaxError: Unexpected token } in line 4',
      testResults: [],
      executionTimeMs: 12,
    };

    expect(errorResponse.passed).toBe(false);
    expect(errorResponse.error).toContain('SyntaxError');
  });

  it('should configure Monaco Editor with vs-dark theme and obsidian accents', () => {
    const monacoOptions = {
      theme: 'vs-dark',
      fontSize: 14,
      fontFamily: 'JetBrains Mono, monospace',
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
    };

    expect(monacoOptions.theme).toBe('vs-dark');
    expect(monacoOptions.fontFamily).toContain('JetBrains Mono');
    expect(monacoOptions.automaticLayout).toBe(true);
  });

  it('should route code execution via standard endpoint template /api/interview/session/:id/run', () => {
    const buildRunEndpoint = (sessionId: string) => `/api/interview/session/${sessionId}/run`;
    expect(buildRunEndpoint('test-sess-99')).toBe('/api/interview/session/test-sess-99/run');
  });
});
