import { prisma } from '../lib/prisma.js';
import { sandboxService, EvaluationResult } from './sandbox.service.js';
import { NotFoundError, BadRequestError } from '../lib/errors.js';
import { v4 as uuidv4 } from 'uuid';
import { CODING_PROBLEMS, getProblemByIdFromCatalog, CodingProblem } from '../data/codingProblems.data.js';

const memoryCodingSessions = new Map<string, any>();

export interface InterviewerResponse {
  message: string;
  tone: 'praising' | 'encouraging' | 'guiding' | 'probing';
  avatarEmotion: 'pleased' | 'thinking' | 'speaking' | 'neutral';
  followUpQuestion?: string;
}

export interface CodingRunResult extends EvaluationResult {
  interviewerResponse: InterviewerResponse;
}

export const codingService = {
  async createSession(userId: string, targetRole: string, difficulty: string = 'MEDIUM', selectedLanguage: string = 'javascript', problemId?: string) {
    const fallbackId = `csess_${uuidv4().replace(/-/g, '').slice(0, 16)}`;
    const sessionObj = {
      id: fallbackId,
      userId: userId || 'demo-user-123',
      targetRole: targetRole || 'Software Engineer',
      difficulty: difficulty || 'MEDIUM',
      selectedLanguage: selectedLanguage || 'javascript',
      problemId: problemId || 'two-sum',
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
      const dbProblems = await prisma.preDefinedProblem.findMany();
      if (dbProblems && dbProblems.length >= 10) return dbProblems;
    } catch (err) {
      console.warn('[CodingService] DB getProblems fallback:', (err as Error).message);
    }

    return CODING_PROBLEMS;
  },

  async getProblemById(id: string) {
    const fromCatalog = getProblemByIdFromCatalog(id);
    if (fromCatalog) return fromCatalog;

    try {
      const problem = await prisma.preDefinedProblem.findUnique({ where: { id } });
      if (problem) return problem;
    } catch (err) {
      console.warn('[CodingService] DB getProblemById fallback:', (err as Error).message);
    }

    return CODING_PROBLEMS[0];
  },

  async runTestCases(
    sessionId: string,
    userId: string,
    code: string,
    language: string = 'javascript',
    problemId?: string,
    customTestCase?: any
  ): Promise<CodingRunResult> {
    if (!code) {
      throw new BadRequestError('Code submission is empty');
    }

    const problem: CodingProblem = (problemId ? getProblemByIdFromCatalog(problemId) : undefined) || CODING_PROBLEMS[0];

    const runResult = await sandboxService.evaluateCode(
      code,
      problem.testCases,
      language || 'javascript',
      problem.entryPoint,
      customTestCase
    );

    const interviewerResponse = this.generateInterviewerResponse(runResult, problem, code, language);

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

    return {
      ...runResult,
      interviewerResponse,
    };
  },

  generateInterviewerResponse(
    runResult: EvaluationResult,
    problem: CodingProblem,
    code: string,
    language: string
  ): InterviewerResponse {
    // 1. All Passed
    if (runResult.success) {
      const complexityPrompts = [
        `Excellent job! All unit test cases are green. How would you evaluate your solution's Big-O time and auxiliary space complexity? Could we optimize the memory footprint any further?`,
        `Nice work! Your algorithmic logic handled all standard and edge cases. Walk me through your time complexity—is this optimal, and how would it behave if N scaled to millions of elements?`,
        `Outstanding! All test cases passed cleanly. What data structure choice was key to achieving this runtime, and are there any trade-offs you considered?`,
        `Solid solution! Your code meets the optimal correctness criteria. Could you defend your space complexity for the hiring board before we finalize this question?`,
      ];
      const randomPrompt = complexityPrompts[Math.floor(Math.random() * complexityPrompts.length)];
      return {
        message: randomPrompt,
        tone: 'praising',
        avatarEmotion: 'pleased',
        followUpQuestion: `What is the optimal Big-O time and space complexity of your solution?`,
      };
    }

    // 2. Compilation / Syntax Error
    if (runResult.errorDetails && runResult.errorDetails.includes('Compilation / Syntax Error')) {
      const cleanErr = runResult.errorDetails.replace('Compilation / Syntax Error:', '').trim();
      return {
        message: `No worries at all—syntax hiccups happen to everyone under interview pressure. It looks like: "${cleanErr.slice(0, 110)}". Take a moment to check your syntax or declaration, and run it again when you're ready.`,
        tone: 'encouraging',
        avatarEmotion: 'neutral',
        followUpQuestion: `Do you want to review the expected function signature?`,
      };
    }

    // 3. Partial Failure on Edge Cases
    const failedCases = runResult.testResults.filter((r) => !r.passed);
    const firstFailed = failedCases[0];
    const failedDesc = firstFailed?.description || `test case #${firstFailed?.testCaseIndex || 1}`;

    const failureFeedbackOptions = [
      `You're on the right track! You passed ${runResult.passedCount} of ${runResult.totalCount} test cases. However, it seems to stumble on ${failedDesc}. Trace through your loop bounds and edge conditions for that specific case.`,
      `Good progress so far (${runResult.passedCount}/${runResult.totalCount} passed). Your general approach works, but an edge case failed on ${failedDesc}. What happens when the input has duplicate values or boundary limits?`,
      `Getting closer! ${runResult.passedCount} test cases passed. Notice test case #${firstFailed?.testCaseIndex || 1}: your code returned ${JSON.stringify(firstFailed?.actual)}, but expected ${JSON.stringify(firstFailed?.expected)}. Walk me through how your code handles that branch.`,
    ];

    return {
      message: failureFeedbackOptions[Math.floor(Math.random() * failureFeedbackOptions.length)],
      tone: 'guiding',
      avatarEmotion: 'thinking',
      followUpQuestion: `How does your algorithm handle the input ${firstFailed?.input ? JSON.stringify(firstFailed.input).slice(0, 40) : 'for this edge case'}?`,
    };
  },

  async getIdealSolution(problemId: string, language: string = 'javascript') {
    const problem = getProblemByIdFromCatalog(problemId) || CODING_PROBLEMS[0];
    const normLang = (language || 'javascript').toLowerCase() as keyof typeof problem.idealSolutions;
    const solutionCode = problem.idealSolutions[normLang] || problem.idealSolutions.javascript;

    return {
      problemId: problem.id,
      title: problem.title,
      difficulty: problem.difficulty,
      pattern: problem.pattern,
      optimalSolution: problem.optimalSolution,
      optimalTime: problem.optimalTime,
      optimalSpace: problem.optimalSpace,
      editorial: problem.editorial,
      code: solutionCode,
      language: normLang,
      idealSolutions: problem.idealSolutions,
    };
  },

  async getProgressiveHint(problemId: string, hintLevel: number = 1, candidateCode?: string) {
    const problem = getProblemByIdFromCatalog(problemId) || CODING_PROBLEMS[0];
    const level = Math.min(Math.max(1, hintLevel), 3);
    const hintText = problem.hints[level - 1] || problem.hints[0];

    const spokenPrompt = level === 1
      ? `Here is your high-level algorithmic intuition hint: ${hintText}`
      : level === 2
      ? `Here is your data structure and pattern hint: ${hintText}`
      : `Here is your edge-case and implementation hint: ${hintText}`;

    return {
      problemId: problem.id,
      hintLevel: level,
      hintText,
      spokenPrompt,
      allHints: problem.hints.slice(0, level),
    };
  },

  async getSocraticDialogue(problemId: string, candidateMessage: string, candidateCode?: string) {
    const problem = getProblemByIdFromCatalog(problemId) || CODING_PROBLEMS[0];
    const msg = (candidateMessage || '').toLowerCase();

    let feedback = `That's a thoughtful question regarding "${problem.title}". `;
    let emotion: 'speaking' | 'thinking' | 'pleased' = 'speaking';

    if (msg.includes('duplicate') || msg.includes('empty') || msg.includes('negative')) {
      feedback += `Yes, you should definitely account for edge cases such as ${problem.editorial.edgeCases.join(', ')}. How would your current data structure handle those?`;
      emotion = 'thinking';
    } else if (msg.includes('brute') || msg.includes('approach') || msg.includes('intuition')) {
      feedback += `A brute force approach would be: ${problem.editorial.bruteForce}. Can you see where the redundant operations are, and how ${problem.editorial.optimalApproach.slice(0, 100)}... would optimize it?`;
      emotion = 'thinking';
    } else if (msg.includes('time') || msg.includes('space') || msg.includes('complexity')) {
      feedback += `The target optimal time complexity is ${problem.optimalTime} and auxiliary space is ${problem.optimalSpace}. ${problem.editorial.intuition}`;
      emotion = 'pleased';
    } else {
      feedback += `Consider the core pattern for this problem: ${problem.pattern}. ${problem.editorial.intuition} What data structure can you leverage to achieve ${problem.optimalTime} runtime?`;
    }

    return {
      reply: feedback,
      emotion,
      problemTitle: problem.title,
      pattern: problem.pattern,
    };
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
      problemId: 'two-sum',
      status: 'IN_PROGRESS',
      testCasesPassed: 0,
      startedAt: new Date(),
    };
    memoryCodingSessions.set(sessionId, autoSession);
    return autoSession;
  },
};
