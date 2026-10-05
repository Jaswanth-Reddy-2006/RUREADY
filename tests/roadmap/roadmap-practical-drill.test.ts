import { describe, expect, it, vi, beforeEach } from 'vitest';
import { roadmapController } from '../../services/roadmap-service/src/controllers/roadmap.controller.js';
import { practicalDrillService } from '../../services/roadmap-service/src/services/practical-drill.service.js';
import { prisma } from '../../services/roadmap-service/src/lib/prisma.js';
import { BadRequestError, ForbiddenError, UnauthorizedError } from '../../services/roadmap-service/src/lib/errors.js';
import { useRoadmapStore } from '../../client/src/store/useRoadmapStore.js';
import { roadmapApi } from '../../client/src/api/roadmap.js';

describe('Stage 5.4: Practical / Coding Evaluation', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    practicalDrillService.rateLimitMap.clear();
  });

  function createMockReqRes(options: {
    headers?: Record<string, string | string[] | undefined>;
    params?: Record<string, string>;
    query?: Record<string, string>;
    body?: any;
  }) {
    const req: any = {
      headers: options.headers || {},
      params: options.params || {},
      query: options.query || {},
      body: options.body || {},
    };

    let statusCode = 200;
    let jsonResponse: any = null;

    const res: any = {
      status: vi.fn((code: number) => {
        statusCode = code;
        return res;
      }),
      json: vi.fn((data: any) => {
        jsonResponse = data;
        return res;
      }),
    };

    const next = vi.fn();

    return {
      req,
      res,
      next,
      getStatusCode: () => statusCode,
      getJsonResponse: () => jsonResponse,
    };
  }

  describe('1. Security & Sandbox Isolation Controls', () => {
    it('blocks dangerous Node APIs like child_process and process in JavaScript submission', async () => {
      const code = `
        function solve() {
          const cp = process.mainModule.require('child_process');
          return cp.execSync('dir');
        }
      `;
      const safety = practicalDrillService.validateCodeSafety(code, 'javascript');
      expect(safety.safe).toBe(false);
      expect(safety.reason).toContain('Security restriction');
    });

    it('blocks dangerous Python modules like import os and subprocess', async () => {
      const code = `
import os
def solve():
    return os.listdir('.')
      `;
      const safety = practicalDrillService.validateCodeSafety(code, 'python');
      expect(safety.safe).toBe(false);
      expect(safety.reason).toContain('Security restriction');
    });

    it('rejects submissions exceeding 64KB size limit', async () => {
      const hugeCode = 'let a = 1;\n'.repeat(7000); // 77KB > 64KB
      const safety = practicalDrillService.validateCodeSafety(hugeCode, 'javascript');
      expect(safety.safe).toBe(false);
      expect(safety.reason).toContain('64KB');
    });

    it('enforces execution rate limits per user', () => {
      const user = 'user_rate_test_1';
      const check1 = practicalDrillService.checkRateLimit(user, 1000);
      expect(check1.allowed).toBe(true);

      const check2 = practicalDrillService.checkRateLimit(user, 1000);
      expect(check2.allowed).toBe(false);
      expect(check2.waitTimeMs).toBeGreaterThan(0);
    });
  });

  describe('2. Sandboxed Test Runner & Assertion Execution', () => {
    it('evaluates passing JavaScript test cases and returns structured results', async () => {
      const code = `
        function twoSum(nums, target) {
          const map = new Map();
          for (let i = 0; i < nums.length; i++) {
            const diff = target - nums[i];
            if (map.has(diff)) return [map.get(diff), i];
            map.set(nums[i], i);
          }
          return [];
        }
      `;
      const testCases = [
        { input: [[2, 7, 11, 15], 9], expected: [0, 1], description: 'Standard 2Sum' },
        { input: [[3, 2, 4], 6], expected: [1, 2], description: 'Non-zero index' },
      ];

      const result = await practicalDrillService.evaluateCodeInSandbox(code, testCases, 'javascript', 'twoSum');
      expect(result.success).toBe(true);
      expect(result.passedCount).toBe(2);
      expect(result.totalCount).toBe(2);
      expect(result.testResults.length).toBe(2);
      expect(result.testResults[0].passed).toBe(true);
    });

    it('evaluates failing JavaScript test cases without crashing', async () => {
      const code = `
        function twoSum(nums, target) {
          return [0, 0]; // Incorrect
        }
      `;
      const testCases = [
        { input: [[2, 7, 11, 15], 9], expected: [0, 1], description: 'Standard 2Sum' },
      ];

      const result = await practicalDrillService.evaluateCodeInSandbox(code, testCases, 'javascript', 'twoSum');
      expect(result.success).toBe(false);
      expect(result.passedCount).toBe(0);
      expect(result.totalCount).toBe(1);
      expect(result.testResults[0].passed).toBe(false);
      expect(result.testResults[0].error).toContain('Expected');
    });

    it('catches runtime exceptions and returns structured error without throwing', async () => {
      const code = `
        function twoSum(nums, target) {
          throw new Error('Custom runtime error inside candidate code');
        }
      `;
      const testCases = [
        { input: [[2, 7, 11, 15], 9], expected: [0, 1], description: 'Standard 2Sum' },
      ];

      const result = await practicalDrillService.evaluateCodeInSandbox(code, testCases, 'javascript', 'twoSum');
      expect(result.success).toBe(false);
      expect(result.testResults[0].error).toContain('Custom runtime error inside candidate code');
    });

    it('evaluates TypeScript code with stripped interfaces and annotations', async () => {
      const code = `
        interface RequestPayload {
          id: string;
          count: number;
        }
        export function processPayload(req: RequestPayload): boolean {
          return req.count > 0;
        }
      `;
      const testCases = [
        { input: [{ id: 'req-1', count: 5 }], expected: true, description: 'Positive count' },
        { input: [{ id: 'req-2', count: 0 }], expected: false, description: 'Zero count' },
      ];

      const result = await practicalDrillService.evaluateCodeInSandbox(code, testCases, 'typescript', 'processPayload');
      expect(result.success).toBe(true);
      expect(result.passedCount).toBe(2);
    });
  });

  describe('3. End-to-End Practical Drill Evaluation & SkillEvidence Integration', () => {
    it('creates SkillEvidence with real skillId when tests pass', async () => {
      const mockCreatedEvidence = {
        id: 'ev_proj_101',
        userRoadmapId: 'ur_test_1',
        skillId: 'skill_react_concurrency',
        source: 'PROJECT',
        demonstratedScore: 100,
        estimatedProficiency: 100,
        confidence: 85,
        externalReference: 'drill_attempt_1',
        metadata: { passedCount: 2, totalCount: 2 },
        assessedAt: new Date(),
      };

      vi.spyOn(prisma.userRoadmap, 'findUnique').mockResolvedValue({
        id: 'ur_test_1',
        userId: 'user_dev_1',
        sourceRoadmap: {
          nodesData: [
            {
              id: 'node_drill_1',
              title: 'React Concurrency Drill',
              skills: [{ name: 'React Concurrency', category: 'Frontend' }],
              whatIsTheExactThing: {
                title: 'Concurrency Polyfill',
                description: 'Implement fiber queue',
                deliverable: 'Tested queue module',
                verificationChecklist: ['Queue handles batching', 'Priority scheduling works'],
                testCases: [
                  { input: [10], expected: 20, description: 'Doubler invariant' },
                ],
                entryPoint: 'doubleVal',
              },
            },
          ],
        },
        sprints: [
          {
            tasks: [
              {
                id: 'task_sprint_1',
                roadmapNodeId: 'node_drill_1',
                roadmapNode: {
                  skills: [{ skillId: 'skill_react_concurrency' }],
                },
              },
            ],
          },
        ],
      } as any);

      vi.spyOn(prisma.skillEvidence, 'create').mockResolvedValue(mockCreatedEvidence as any);

      const result = await practicalDrillService.evaluatePracticalDrill('user_dev_1', {
        userRoadmapId: 'ur_test_1',
        nodeId: 'node_drill_1',
        sprintTaskId: 'task_sprint_1',
        code: 'function doubleVal(x) { return x * 2; }',
        language: 'javascript',
      });

      expect(result.success).toBe(true);
      expect(result.passed).toBe(true);
      expect(result.score).toBe(100);
      expect(result.evidenceRecorded).toBe(true);
      expect(result.skillId).toBe('skill_react_concurrency');
      expect(prisma.skillEvidence.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userRoadmapId: 'ur_test_1',
            skillId: 'skill_react_concurrency',
            source: 'PROJECT',
            demonstratedScore: 100,
          }),
        })
      );
    });

    it('does NOT create SkillEvidence when test execution fails', async () => {
      vi.spyOn(prisma.userRoadmap, 'findUnique').mockResolvedValue({
        id: 'ur_test_1',
        userId: 'user_dev_1',
        sourceRoadmap: {
          nodesData: [
            {
              id: 'node_drill_1',
              title: 'React Concurrency Drill',
              skills: [{ name: 'React Concurrency', category: 'Frontend' }],
              whatIsTheExactThing: {
                title: 'Concurrency Polyfill',
                description: 'Implement fiber queue',
                deliverable: 'Tested queue module',
                verificationChecklist: ['Queue handles batching'],
                testCases: [
                  { input: [10], expected: 20, description: 'Doubler invariant' },
                ],
                entryPoint: 'doubleVal',
              },
            },
          ],
        },
        sprints: [],
      } as any);

      const createEvidenceSpy = vi.spyOn(prisma.skillEvidence, 'create');

      const result = await practicalDrillService.evaluatePracticalDrill('user_dev_1', {
        userRoadmapId: 'ur_test_1',
        nodeId: 'node_drill_1',
        code: 'function doubleVal(x) { return x * 99; /* wrong */ }',
        language: 'javascript',
      });

      expect(result.success).toBe(false);
      expect(result.passed).toBe(false);
      expect(result.evidenceRecorded).toBe(false);
      expect(createEvidenceSpy).not.toHaveBeenCalled();
    });

    it('rejects unauthorized user from submitting to another user roadmap (403 Forbidden)', async () => {
      vi.spyOn(prisma.userRoadmap, 'findUnique').mockResolvedValue({
        id: 'ur_test_1',
        userId: 'owner_user_99',
        sourceRoadmap: { nodesData: [] },
        sprints: [],
      } as any);

      await expect(
        practicalDrillService.evaluatePracticalDrill('attacker_user_1', {
          userRoadmapId: 'ur_test_1',
          code: 'function solve() { return true; }',
          language: 'javascript',
        })
      ).rejects.toThrow(ForbiddenError);
    });

    it('rejects unsupported programming languages with Zod error', async () => {
      await expect(
        practicalDrillService.evaluatePracticalDrill('user_dev_1', {
          code: 'fn main() {}',
          language: 'rust', // Not supported
        })
      ).rejects.toThrow();
    });
  });

  describe('4. Controller & HTTP API Integration', () => {
    it('handles POST /api/roadmap/drill/evaluate successfully', async () => {
      vi.spyOn(practicalDrillService, 'evaluatePracticalDrill').mockResolvedValue({
        id: 'drill_att_1',
        success: true,
        passed: true,
        score: 100,
        passedCount: 1,
        totalCount: 1,
        testResults: [{ testCaseIndex: 1, name: 'Check', passed: true, executionTimeMs: 5 }],
        runtimeMs: 12,
        language: 'javascript',
        evidenceRecorded: true,
        evidenceId: 'ev_1',
        skillId: 'skill_1',
        completedAt: new Date().toISOString(),
      });

      const { req, res, next, getStatusCode, getJsonResponse } = createMockReqRes({
        headers: { 'x-user-id': 'user_tester_1' },
        body: {
          code: 'function solve() { return true; }',
          language: 'javascript',
        },
      });

      await roadmapController.evaluatePracticalDrill(req, res, next);

      expect(getStatusCode()).toBe(200);
      expect(getJsonResponse().success).toBe(true);
      expect(getJsonResponse().data.passed).toBe(true);
      expect(getJsonResponse().data.evidenceRecorded).toBe(true);
    });

    it('requires authentication header x-user-id', async () => {
      const { req, res, next } = createMockReqRes({
        headers: {}, // Missing x-user-id
        body: {
          code: 'function solve() { return true; }',
          language: 'javascript',
        },
      });

      await roadmapController.evaluatePracticalDrill(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });
  });

  describe('5. Client Zustand Store Integration', () => {
    it('evaluatePracticalDrill updates activeUserRoadmap skillEvidence when passed', async () => {
      const mockResult = {
        id: 'drill_101',
        success: true,
        passed: true,
        score: 95,
        passedCount: 3,
        totalCount: 3,
        testResults: [],
        runtimeMs: 18,
        language: 'javascript',
        evidenceRecorded: true,
        evidenceId: 'ev_proj_1',
        skillId: 'skill_distributed_locks',
        completedAt: new Date().toISOString(),
      };

      vi.spyOn(roadmapApi, 'evaluatePracticalDrill').mockResolvedValue(mockResult);

      const store = useRoadmapStore.getState();
      useRoadmapStore.setState({
        activeUserRoadmap: {
          id: 'ur-101',
          userId: 'user-1',
          sourceRoadmapId: 'rm-101',
          sourceRoadmap: {} as any,
          status: 'ACTIVE',
          personalization: {} as any,
          sprints: [],
          skillEvidence: [],
        },
        userRoadmaps: {
          'ur-101': {
            id: 'ur-101',
            userId: 'user-1',
            sourceRoadmapId: 'rm-101',
            sourceRoadmap: {} as any,
            status: 'ACTIVE',
            personalization: {} as any,
            sprints: [],
            skillEvidence: [],
          },
        },
      });

      const res = await store.evaluatePracticalDrill({
        userRoadmapId: 'ur-101',
        code: 'function lock() { return true; }',
        language: 'javascript',
      });

      expect(res.success).toBe(true);
      expect(res.data?.passed).toBe(true);

      const updatedEvidence = useRoadmapStore.getState().activeUserRoadmap?.skillEvidence;
      expect(updatedEvidence).toBeDefined();
      expect(updatedEvidence?.length).toBe(1);
      expect(updatedEvidence?.[0].source).toBe('PROJECT');
      expect(updatedEvidence?.[0].demonstratedScore).toBe(95);
    });
  });
});
