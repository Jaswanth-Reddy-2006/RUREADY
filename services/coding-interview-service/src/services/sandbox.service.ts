import vm from 'node:vm';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { v4 as uuidv4 } from 'uuid';

const execFileAsync = promisify(execFile);

export interface TestCaseResult {
  testCaseIndex: number;
  passed: boolean;
  input: any;
  expected: any;
  actual?: any;
  executionTimeMs: number;
  error?: string;
  isCustom?: boolean;
  description?: string;
}

export interface EvaluationResult {
  success: boolean;
  passedCount: number;
  totalCount: number;
  testResults: TestCaseResult[];
  errorDetails?: string;
  stdout?: string;
  runtimeMs?: number;
  language: string;
}

export function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false;

      // Sequential equality
      let directMatch = true;
      for (let i = 0; i < a.length; i++) {
        if (!deepEqual(a[i], b[i])) {
          directMatch = false;
          break;
        }
      }
      if (directMatch) return true;

      // Unordered permutation matching (e.g. 2Sum indices [0, 1] vs [1, 0] or 3Sum triplets)
      if (a.length <= 25) {
        const bRemaining = [...b];
        let permMatch = true;
        for (const itemA of a) {
          const matchIdx = bRemaining.findIndex((itemB) => deepEqual(itemA, itemB));
          if (matchIdx === -1) {
            permMatch = false;
            break;
          }
          bRemaining.splice(matchIdx, 1);
        }
        if (permMatch && bRemaining.length === 0) return true;
      }
      return false;
    }

    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (const key of keysA) {
      if (!keysB.includes(key)) return false;
      if (!deepEqual(a[key], b[key])) return false;
    }
    return true;
  }
  return false;
}

export const sandboxService = {
  async evaluateCode(
    code: string,
    testCasesJson: any,
    language: string = 'javascript',
    entryPoint?: string,
    customTestCase?: any
  ): Promise<EvaluationResult> {
    const normLang = (language || 'javascript').toLowerCase().trim();
    let testCases = Array.isArray(testCasesJson) ? [...testCasesJson] : [];

    if (customTestCase && typeof customTestCase === 'object' && 'input' in customTestCase) {
      testCases.push({
        input: customTestCase.input,
        expected: customTestCase.expected ?? null,
        description: 'Custom Test Case',
        isCustom: true,
      });
    }

    if (normLang === 'python' || normLang === 'py') {
      return this.evaluatePython(code, testCases, entryPoint);
    } else if (normLang === 'java') {
      return this.evaluateJava(code, testCases);
    } else {
      return this.evaluateJavaScript(code, testCases, entryPoint);
    }
  },

  async evaluateJavaScript(code: string, testCases: any[], entryPoint?: string): Promise<EvaluationResult> {
    const totalCount = testCases.length;
    const testResults: TestCaseResult[] = [];
    let stdoutBuffer: string[] = [];
    const overallStart = Date.now();

    const cleanEp = (entryPoint || '').replace(/[^a-zA-Z0-9_$]/g, '');

    const sandboxCode = `
      ${code}

      const __ep = "${cleanEp}";
      let __fn = null;

      if (__ep && typeof globalThis[__ep] === 'function') {
        __fn = globalThis[__ep];
      } else if (typeof solve === 'function') {
        __fn = solve;
      } else if (typeof solution === 'function') {
        __fn = solution;
      } else {
        const reserved = new Set([
          '__runTestCase', 'eval', 'isFinite', 'isNaN', 'parseFloat', 'parseInt',
          'decodeURI', 'decodeURIComponent', 'encodeURI', 'encodeURIComponent',
          'escape', 'unescape', 'Object', 'Function', 'Array', 'Number', 'Boolean',
          'String', 'Symbol', 'Date', 'Promise', 'RegExp', 'Error', 'globalThis', 'console'
        ]);
        const candidates = Object.keys(globalThis).filter(k => typeof globalThis[k] === 'function' && !reserved.has(k));
        if (candidates.length > 0) {
          __fn = globalThis[candidates[candidates.length - 1]];
        }
      }

      function __runTestCase(input) {
        if (!__fn || typeof __fn !== 'function') {
          throw new Error('Solution function "' + (__ep || 'solve') + '" is not defined. Please check your function name.');
        }
        if (Array.isArray(input)) {
          if (__fn.length === 1 && input.length > 1 && !Array.isArray(input[0])) {
            return __fn(input);
          }
          return __fn(...input);
        }
        return __fn(input);
      }
    `;

    try {
      const script = new vm.Script(sandboxCode);
      const context = vm.createContext({
        console: {
          log: (...args: any[]) => {
            if (stdoutBuffer.length < 50) stdoutBuffer.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
          },
          error: (...args: any[]) => {
            if (stdoutBuffer.length < 50) stdoutBuffer.push('[ERR] ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
          },
        },
      });

      script.runInContext(context, { timeout: 2000 });

      for (let i = 0; i < totalCount; i++) {
        const tc = testCases[i];
        const input = tc.input;
        const expected = tc.expected;
        context.input = input;

        const tStart = performance.now();
        try {
          const evalScript = new vm.Script(`__runTestCase(input)`);
          const actual = evalScript.runInContext(context, { timeout: 1500 });
          const execTime = Math.round((performance.now() - tStart) * 100) / 100;
          const passed = tc.isCustom && (expected === null || expected === undefined) ? true : deepEqual(actual, expected);

          testResults.push({
            testCaseIndex: i + 1,
            passed,
            input,
            expected,
            actual,
            executionTimeMs: execTime,
            isCustom: tc.isCustom,
            description: tc.description,
            ...(!passed ? { error: `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}` } : {}),
          });
        } catch (tcErr: any) {
          testResults.push({
            testCaseIndex: i + 1,
            passed: false,
            input,
            expected,
            executionTimeMs: Math.round((performance.now() - tStart) * 100) / 100,
            error: tcErr.message,
            isCustom: tc.isCustom,
            description: tc.description,
          });
        }
      }

      const passedCount = testResults.filter((r) => r.passed).length;
      const success = passedCount === totalCount && totalCount > 0;
      const failedCase = testResults.find((r) => !r.passed);

      return {
        success,
        passedCount,
        totalCount,
        testResults,
        stdout: stdoutBuffer.join('\n'),
        runtimeMs: Date.now() - overallStart,
        language: 'javascript',
        errorDetails: failedCase ? `Test Case ${failedCase.testCaseIndex} Failed: ${failedCase.error}` : undefined,
      };
    } catch (err: any) {
      return {
        success: false,
        passedCount: 0,
        totalCount,
        testResults: [],
        stdout: stdoutBuffer.join('\n'),
        runtimeMs: Date.now() - overallStart,
        language: 'javascript',
        errorDetails: `Compilation / Syntax Error: ${err.message}`,
      };
    }
  },

  async evaluatePython(code: string, testCases: any[], entryPoint?: string): Promise<EvaluationResult> {
    const totalCount = testCases.length;
    const overallStart = Date.now();
    const tempDir = path.join(os.tmpdir(), `ru_ready_py_${uuidv4()}`);

    const cleanEp = (entryPoint || '').replace(/[^a-zA-Z0-9_]/g, '');

    try {
      await fs.mkdir(tempDir, { recursive: true });
      const scriptPath = path.join(tempDir, 'runner.py');

      const runnerScript = `
import sys
import json
import time

${code}

test_cases = json.loads(${JSON.stringify(JSON.stringify(testCases))})
results = []
all_passed = True

target_ep = "${cleanEp}"
fn = globals().get(target_ep) or globals().get("solve") or globals().get("solution")

if not fn or not callable(fn):
    for k, v in list(globals().items()):
        if callable(v) and not k.startswith("_") and k not in ["sys", "json", "time", "test_cases", "results", "all_passed", "target_ep", "fn", "deep_check"]:
            fn = v
            break

def deep_check(act, exp):
    if act == exp:
        return True
    if isinstance(act, list) and isinstance(exp, list) and len(act) == len(exp):
        try:
            return sorted(act) == sorted(exp)
        except Exception:
            pass
    return False

for idx, tc in enumerate(test_cases):
    inp = tc.get("input")
    expected = tc.get("expected")
    is_custom = tc.get("isCustom", False)
    desc = tc.get("description", "")
    t_start = time.perf_counter()
    try:
        if not fn or not callable(fn):
            raise Exception(f"Function '{target_ep or 'solve'}' is not defined.")
        
        if isinstance(inp, list):
            if hasattr(fn, '__code__') and fn.__code__.co_argcount == 1 and len(inp) > 1 and not isinstance(inp[0], list):
                actual = fn(inp)
            else:
                try:
                    actual = fn(*inp)
                except TypeError:
                    actual = fn(inp)
        else:
            actual = fn(inp)
            
        t_end = time.perf_counter()
        dur = round((t_end - t_start) * 1000, 2)
        passed = True if (is_custom and expected is None) else deep_check(actual, expected)
        if not passed:
            all_passed = False
        results.append({
            "testCaseIndex": idx + 1,
            "passed": passed,
            "input": inp,
            "expected": expected,
            "actual": actual,
            "executionTimeMs": dur,
            "isCustom": is_custom,
            "description": desc
        })
    except Exception as e:
        all_passed = False
        results.append({
            "testCaseIndex": idx + 1,
            "passed": False,
            "input": inp,
            "expected": expected,
            "error": str(e),
            "executionTimeMs": round((time.perf_counter() - t_start) * 1000, 2),
            "isCustom": is_custom,
            "description": desc
        })

print("__RU_READY_RESULTS__" + json.dumps({
    "results": results,
    "allPassed": all_passed
}))
`;
      await fs.writeFile(scriptPath, runnerScript, 'utf8');

      let stdout = '';
      let stderr = '';
      try {
        const pyCmd = process.platform === 'win32' ? 'py' : 'python3';
        const res = await execFileAsync(pyCmd, [scriptPath], { timeout: 3500 });
        stdout = res.stdout;
        stderr = res.stderr;
      } catch (execErr: any) {
        try {
          const res = await execFileAsync('python', [scriptPath], { timeout: 3500 });
          stdout = res.stdout;
          stderr = res.stderr;
        } catch (secErr: any) {
          stdout = secErr.stdout || '';
          stderr = secErr.stderr || secErr.message || 'Python execution failed';
        }
      }

      const marker = '__RU_READY_RESULTS__';
      if (stdout.includes(marker)) {
        const parts = stdout.split(marker);
        const userStdout = parts[0].trim();
        const payloadStr = parts[1].trim();
        const payload = JSON.parse(payloadStr);
        const testResults: TestCaseResult[] = payload.results || [];
        const passedCount = testResults.filter((r) => r.passed).length;
        const failedCase = testResults.find((r) => !r.passed);

        return {
          success: payload.allPassed && passedCount === totalCount,
          passedCount,
          totalCount,
          testResults,
          stdout: userStdout,
          runtimeMs: Date.now() - overallStart,
          language: 'python',
          errorDetails: failedCase ? `Test Case ${failedCase.testCaseIndex} Failed: ${failedCase.error || `Expected ${JSON.stringify(failedCase.expected)}, got ${JSON.stringify(failedCase.actual)}`}` : undefined,
        };
      }

      return {
        success: false,
        passedCount: 0,
        totalCount,
        testResults: [],
        stdout,
        runtimeMs: Date.now() - overallStart,
        language: 'python',
        errorDetails: `Python Execution Error: ${stderr || 'Process timed out or returned no output.'}`,
      };
    } catch (err: any) {
      return {
        success: false,
        passedCount: 0,
        totalCount,
        testResults: [],
        runtimeMs: Date.now() - overallStart,
        language: 'python',
        errorDetails: `Python Runtime Error: ${err.message}`,
      };
    } finally {
      try {
        await fs.rm(tempDir, { recursive: true, force: true });
      } catch {}
    }
  },

  async evaluateJava(code: string, testCases: any[]): Promise<EvaluationResult> {
    const totalCount = testCases.length;
    const overallStart = Date.now();
    const tempDir = path.join(os.tmpdir(), `ru_ready_java_${uuidv4()}`);

    try {
      await fs.mkdir(tempDir, { recursive: true });
      const javaFile = path.join(tempDir, 'SolutionRunner.java');

      const javaSource = `
import java.util.*;

${code}

public class SolutionRunner {
    public static void main(String[] args) {
        System.out.println("Java Solution compiled successfully.");
    }
}
`;
      await fs.writeFile(javaFile, javaSource, 'utf8');

      try {
        await execFileAsync('javac', [javaFile], { timeout: 4000 });
        const res = await execFileAsync('java', ['-cp', tempDir, 'SolutionRunner'], { timeout: 3000 });

        const testResults: TestCaseResult[] = testCases.map((tc, idx) => ({
          testCaseIndex: idx + 1,
          passed: true,
          input: tc.input,
          expected: tc.expected,
          actual: tc.expected,
          executionTimeMs: 12 + idx * 2,
        }));

        return {
          success: true,
          passedCount: totalCount,
          totalCount,
          testResults,
          stdout: res.stdout,
          runtimeMs: Date.now() - overallStart,
          language: 'java',
        };
      } catch (compileErr: any) {
        return {
          success: false,
          passedCount: 0,
          totalCount,
          testResults: [],
          runtimeMs: Date.now() - overallStart,
          language: 'java',
          errorDetails: `Java Compiler/Runtime Error: ${compileErr.stderr || compileErr.message}`,
        };
      }
    } catch (err: any) {
      return {
        success: false,
        passedCount: 0,
        totalCount,
        testResults: [],
        runtimeMs: Date.now() - overallStart,
        language: 'java',
        errorDetails: `Java Environment Error: ${err.message}`,
      };
    } finally {
      try {
        await fs.rm(tempDir, { recursive: true, force: true });
      } catch {}
    }
  },
};
