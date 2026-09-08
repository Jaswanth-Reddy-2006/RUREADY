import { prisma } from '../lib/prisma.js';
import { sandboxService } from './sandbox.service.js';
import { NotFoundError, BadRequestError } from '../lib/errors.js';
import { v4 as uuidv4 } from 'uuid';

const memoryCodingSessions = new Map<string, any>();

export const codingService = {
  async createSession(userId: string, targetRole: string, difficulty: string = 'MEDIUM', selectedLanguage: string = 'javascript') {
    const fallbackId = `csess_${uuidv4().replace(/-/g, '').slice(0, 16)}`;
    const sessionObj = {
      id: fallbackId,
      userId: userId || 'demo-user-123',
      targetRole: targetRole || 'Software Engineer',
      difficulty: difficulty || 'MEDIUM',
      selectedLanguage: selectedLanguage || 'javascript',
      status: 'IN_PROGRESS',
      testCasesPassed: 0,
      startedAt: new Date(),
    };

    try {
      return await prisma.codingSession.create({
        data: {
          userId: userId || 'demo-user-123',
          targetRole,
          difficulty,
          selectedLanguage,
          status: 'IN_PROGRESS',
        },
      });
    } catch (err) {
      console.warn('[CodingService] Database write bypassed, using fallback session:', (err as Error).message);
      memoryCodingSessions.set(fallbackId, sessionObj);
      return sessionObj;
    }
  },

  async getProblems() {
    try {
      const problems = await prisma.preDefinedProblem.findMany();
      if (problems && problems.length > 0) return problems;
    } catch (err) {
      console.warn('[CodingService] DB getProblems fallback:', (err as Error).message);
    }

    return [
      {
        id: 'two-sum',
        title: 'Two Sum',
        difficulty: 'EASY',
        pattern: 'Arrays & Hashing',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
        starterCode: { javascript: 'function twoSum(nums, target) {\n  // Write solution\n  return [0, 1];\n}' },
        testCases: [{ input: [[2, 7, 11, 15], 9], expected: [0, 1] }],
        optimalSolution: 'Use Hash Map',
        optimalTime: 'O(N)',
        optimalSpace: 'O(N)',
      },
    ];
  },

  async getProblemById(id: string) {
    try {
      const problem = await prisma.preDefinedProblem.findUnique({ where: { id } });
      if (problem) return problem;
    } catch (err) {
      console.warn('[CodingService] DB getProblemById fallback:', (err as Error).message);
    }

    return {
      id: id || 'two-sum',
      title: 'Two Sum',
      difficulty: 'EASY',
      pattern: 'Arrays & Hashing',
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
      starterCode: { javascript: 'function twoSum(nums, target) {\n  return [0, 1];\n}' },
      testCases: [{ input: [[2, 7, 11, 15], 9], expected: [0, 1] }],
      optimalSolution: 'Use Hash Map',
      optimalTime: 'O(N)',
      optimalSpace: 'O(N)',
    };
  },

  async runTestCases(sessionId: string, userId: string, code: string, language: string) {
    if (!code) {
      throw new BadRequestError('Code submission is empty');
    }

    let problem: any = null;
    try {
      problem = await prisma.preDefinedProblem.findFirst();
    } catch {
      // Fallback
    }

    if (!problem) {
      problem = {
        id: 'default-two-sum',
        title: 'Two Sum',
        difficulty: 'EASY',
        pattern: 'Arrays & Hashing',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
        starterCode: { javascript: 'function solve(nums, target) { return [0, 1]; }' } as any,
        testCases: [
          { input: [[2, 7, 11, 15], 9], expected: [0, 1] },
        ] as any,
        optimalSolution: 'Use Hash Map',
        optimalTime: 'O(N)',
        optimalSpace: 'O(N)',
      };
    }

    const runResult = await sandboxService.evaluateCode(code, problem.testCases, language || 'javascript');

    try {
      await prisma.codeExecutionDelta.create({
        data: {
          sessionId,
          code,
          language: language || 'javascript',
          output: runResult.errorDetails || `Passed ${runResult.passedCount}/${runResult.totalCount} test cases.`,
          success: runResult.success,
        },
      });

      if (runResult.success) {
        await prisma.codingSession.update({
          where: { id: sessionId },
          data: {
            testCasesPassed: runResult.passedCount,
            selectedLanguage: language || 'javascript',
          },
        });
      }
    } catch (err) {
      console.warn('[CodingService] DB execution delta logging fallback:', (err as Error).message);
    }

    return runResult;
  },

  async getSession(sessionId: string, userId: string) {
    try {
      const session = await prisma.codingSession.findFirst({
        where: { id: sessionId },
        include: { executionDeltas: { orderBy: { timestamp: 'desc' } } },
      });

      if (session) return session;
    } catch (err) {
      console.warn('[CodingService] DB getSession fallback:', (err as Error).message);
    }

    const memSession = memoryCodingSessions.get(sessionId);
    if (memSession) return memSession;

    const autoSession = {
      id: sessionId,
      userId: userId || 'demo-user-123',
      targetRole: 'Fullstack Engineer',
      difficulty: 'MEDIUM',
      selectedLanguage: 'javascript',
      status: 'IN_PROGRESS',
      testCasesPassed: 0,
      startedAt: new Date(),
    };
    memoryCodingSessions.set(sessionId, autoSession);
    return autoSession;
  },
};
