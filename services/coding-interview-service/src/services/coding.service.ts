import { prisma } from '../lib/prisma.js';
import { sandboxService, EvaluationResult } from './sandbox.service.js';
import { NotFoundError, BadRequestError } from '../lib/errors.js';
import { v4 as uuidv4 } from 'uuid';
import { CODING_PROBLEMS, getProblemByIdFromCatalog, getRandomUnsolvedProblem, CodingProblem } from '../data/codingProblems.data.js';

const memoryCodingSessions = new Map<string, any>();
const userSolvedProblemsCache = new Map<string, Set<string>>();

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
  async getSolvedProblemIds(userId: string): Promise<string[]> {
    if (!userId) return [];
    try {
      const records: any[] = await (prisma as any).$queryRawUnsafe(
        `SELECT "problemId" FROM user_solved_problems WHERE "userId" = $1 AND "passed" = true`,
        userId
      );
      if (Array.isArray(records) && records.length > 0) {
        const ids = records.map((r) => r.problemId);
        userSolvedProblemsCache.set(userId, new Set(ids));
        return ids;
      }
    } catch {}

    const cached = userSolvedProblemsCache.get(userId);
    return cached ? Array.from(cached) : [];
  },

  async markProblemSolved(userId: string, problemId: string, language: string = 'javascript'): Promise<void> {
    if (!userId || !problemId) return;
    if (!userSolvedProblemsCache.has(userId)) {
      userSolvedProblemsCache.set(userId, new Set());
    }
    userSolvedProblemsCache.get(userId)!.add(problemId);

    try {
      await (prisma as any).$executeRawUnsafe(
        `INSERT INTO user_solved_problems ("id", "userId", "problemId", "language", "passed", "solvedAt")
         VALUES ($1, $2, $3, $4, true, NOW())
         ON CONFLICT ("userId", "problemId") DO UPDATE SET "passed" = true, "solvedAt" = NOW()`,
        uuidv4(),
        userId,
        problemId,
        language
      );
    } catch (err) {
      console.warn('[CodingService] Solved problem DB logging fallback:', (err as Error).message);
    }
  },

  async createSession(userId: string, targetRole: string, difficulty: string = 'MEDIUM', selectedLanguage: string = 'javascript', problemId?: string) {
    let resolvedProblemId = problemId;
    if (!resolvedProblemId) {
      // Pick a random problem that this user has NOT solved yet!
      const solvedIds = await this.getSolvedProblemIds(userId);
      const nextProblem = getRandomUnsolvedProblem(solvedIds, difficulty);
      resolvedProblemId = nextProblem.id;
    }

    const fallbackId = `csess_${uuidv4().replace(/-/g, '').slice(0, 16)}`;
    const sessionObj = {
      id: fallbackId,
      userId: userId || 'demo-user-123',
      targetRole: targetRole || 'Software Engineer',
      difficulty: difficulty || 'MEDIUM',
      selectedLanguage: selectedLanguage || 'javascript',
      problemId: resolvedProblemId,
      status: 'IN_PROGRESS',
      testCasesPassed: 0,
      startedAt: new Date(),
    };

    try {
      const created = await prisma.codingSession.create({
        data: {
          userId: userId || 'demo-user-123',
          targetRole,
          difficulty,
          selectedLanguage,
          problemId: resolvedProblemId,
          status: 'IN_PROGRESS',
        },
      });
      return created;
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
        await this.markProblemSolved(userId, problem.id, language);
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
    const normLang = (language || 'javascript').toLowerCase();
    const solutionCode = (problem as any).idealSolutions?.[normLang] || (problem as any).idealSolutions?.javascript || problem.editorial.optimalApproach;

    return {
      problemId: problem.id,
      title: problem.title,
      difficulty: problem.difficulty,
      pattern: problem.pattern,
      optimalSolution: (problem as any).optimalSolution || problem.editorial.optimalApproach,
      optimalTime: problem.optimalTime,
      optimalSpace: problem.optimalSpace,
      editorial: problem.editorial,
      code: solutionCode,
      language: normLang,
      idealSolutions: (problem as any).idealSolutions || {},
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
    const msg = (candidateMessage || '').toLowerCase().trim();
    const code = (candidateCode || '').trim();

    // 1. Deep Code AST & Pattern Analysis
    const hasNestedLoops = /(for|while)[\s\S]*?(for|while)/i.test(code);
    const hasHashMap = /(Map|Set|dict|hash_map|unordered_map|make\(map|HashMap|HashSet|\{\s*\}\s*\[)/i.test(code);
    const hasTwoPointers = /(left\s*<=?\s*right|binarySearch|mid\s*=|low\s*<=?\s*high|i\s*<\s*j|pointer)/i.test(code);
    const hasSorting = /(sort\(|\.sort\(|sorted\(|Arrays\.sort)/i.test(code);
    const isBareFunction = code.length < 90 || !/(for|while|return\s+\[\w+|return\s+\{\w+)/i.test(code);

    let feedback = "";
    let emotion: 'speaking' | 'thinking' | 'pleased' = 'speaking';

    // 2. Contextual Socratic Responses Based on Exact Code & Intent
    if (msg.includes('help') || msg.includes('stuck') || msg.includes('how to solve') || msg.includes('approach') || msg.includes('what should i do')) {
      emotion = 'thinking';
      if (isBareFunction) {
        feedback = `You've set up the function signature. Let's break down the logic: if you were to solve this manually with pencil and paper, how would you check whether a pair adds up to the target? What information do you need to store as you iterate through the list?`;
      } else if (hasNestedLoops && !hasHashMap) {
        feedback = `Looking closely at your implementation, you are currently using nested loops. That compares every pair in O(N²) quadratic time. In a production tech interview, that will exceed time limits. Notice that your inner loop simply searches for (target - nums[i]). What data structure allows you to look up previously seen numbers in O(1) constant time instead of O(N)?`;
      } else if (hasHashMap) {
        feedback = `You're on the right track using an optimal hash map! Make sure your logic checks whether the complement exists before inserting the current element, and be careful to return the index positions rather than the array values.`;
      } else if (hasTwoPointers) {
        feedback = `I see you are using two pointers. Remember that two pointers only works if the elements are ordered, but sorting would take O(N log N) time and shuffle your original indices. Can you achieve O(N) linear time using extra space instead?`;
      } else {
        feedback = `Consider the core pattern for this challenge: ${problem.pattern}. ${problem.editorial.intuition} What data structure can you leverage to achieve an optimal ${problem.optimalTime} runtime?`;
      }
    } else if (msg.includes('brute') || msg.includes('quadratic') || msg.includes('nested')) {
      emotion = 'thinking';
      feedback = `A brute-force approach tests every combination: ${problem.editorial.bruteForce}. While it proves correctness, it takes O(N²) time. Can you identify the repeated work in your inner loop, and how a lookup map could eliminate it?`;
    } else if (msg.includes('time') || msg.includes('space') || msg.includes('complexity') || msg.includes('big o') || msg.includes('big-o')) {
      emotion = 'pleased';
      const currentEstimate = hasNestedLoops ? 'O(N²)' : hasHashMap ? 'O(N)' : hasSorting ? 'O(N log N)' : 'O(N)';
      feedback = `Your current code operates around ${currentEstimate} time. The target optimal complexity for this problem is ${problem.optimalTime} time with ${problem.optimalSpace} auxiliary space. ${problem.editorial.complexityAnalysis}`;
    } else if (msg.includes('edge') || msg.includes('duplicate') || msg.includes('empty') || msg.includes('negative') || msg.includes('corner case')) {
      emotion = 'thinking';
      feedback = `Great thinking on interview edge cases! For this problem, be sure to account for: ${problem.editorial.edgeCases.join(', ')}. How does your current code handle duplicate elements or negative integers?`;
    } else if (msg.includes('optimal') || msg.includes('optimize') || msg.includes('better')) {
      emotion = 'pleased';
      if (hasNestedLoops) {
        feedback = `To optimize from O(N²) to O(N), replace the second loop with a hash map. As you visit each number, check if (target - num) is in your map. If yes, you've found the solution in a single pass!`;
      } else {
        feedback = `${problem.editorial.optimalApproach} This achieves ${problem.optimalTime} runtime.`;
      }
    } else {
      // General Adaptive Dialogue
      if (hasNestedLoops && !hasHashMap) {
        feedback = `I'm analyzing your current code: you have a nested loop running in O(N²) time. How can we optimize this to linear O(N) time using a hash table?`;
      } else if (hasHashMap) {
        feedback = `Your hash map logic is looking strong! Walk me through how your code handles edge cases like duplicate complement values or empty inputs.`;
      } else {
        feedback = `Consider the core pattern: ${problem.pattern}. ${problem.editorial.intuition} What data structure would give you O(1) lookups as you iterate?`;
      }
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
