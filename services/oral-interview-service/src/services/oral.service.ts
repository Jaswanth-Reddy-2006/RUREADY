import { prisma } from '../lib/prisma.js';
import { NotFoundError } from '../lib/errors.js';
import { v4 as uuidv4 } from 'uuid';
import { QUESTION_BANK, PROJECT_DEEP_DIVE_STAGES } from '../data/question-bank.data.js';
import { InterviewStateMachine } from './interview-fsm.js';
import { StructuredEvaluation } from '@ru-ready/shared';

const memorySessions = new Map<string, any>();
const memoryQuestions = new Map<string, any[]>();
const memoryChatHistory = new Map<string, any[]>();
const memoryAnalysis = new Map<string, any>();


export function classifyCandidateIntent(text: string): any {
  if (!text || !text.trim()) return 'ANSWER';
  const clean = text.toLowerCase().trim();

  // 1. END INTERVIEW
  if (/\b(end (the )?(interview|call|meet|session)|stop (the )?(interview|session)|wrap up|finish (the )?session|i want to end|let'?s end)\b/i.test(clean)) {
    return 'END_INTERVIEW';
  }

  // 2. TIME & PROGRESS QUERY
  if (/\b(how much time|time left|how many questions (left|remaining)|remaining time|what'?s the time|how am i doing on time)\b/i.test(clean)) {
    return 'TIME_QUERY';
  }

  // 3. REPEAT QUESTION
  if (/\b(repeat|say (that|it) again|didn'?t (hear|catch)|pardon|come again|what was the question|one more time|could you repeat|can you please repeat)\b/i.test(clean)) {
    return 'REPEAT_QUESTION';
  }

  // 4. DON_T_KNOW & UNFAMILIAR
  if (/\b(don'?t know|not sure|no idea|haven'?t (used|worked with|touched)|never heard|unfamiliar with|not familiar|pass on this|don'?t have experience with)\b/i.test(clean) && clean.length < 90) {
    return 'DON_T_KNOW';
  }

  // 5. CLARIFICATION & SCOPE CONFIRMATION
  if (/\b(is this what you'?re asking|so you want me to|does this mean|are you asking (about|if)|could you clarify|should i focus on|can i assume|are you looking for|would you prefer|high level or deep dive)\b/i.test(clean)) {
    return 'CLARIFICATION';
  }

  // 6. TECHNICAL CONSTRAINT QUESTION
  if (/\b(what is the (max|maximum|input|scale|throughput|latency)|are duplicates allowed|is memory constrained|can (we|i) use (a )?(library|cache|framework)|single region or multi region|is this distributed)\b/i.test(clean)) {
    return 'TECHNICAL_QUESTION';
  }

  // 7. CORRECTION & REPHRASING
  if (/\b(wait,? actually|scratch that|let me fix|sorry,? i meant|to correct myself|let me rephrase|what i actually meant)\b/i.test(clean)) {
    return 'CORRECTION';
  }

  // 8. HESITATION / THINKING TIME
  if (/^(umm+|uhh+|err+|let me think|give me a (moment|second)|just a second|one moment please|let me collect my thoughts)\b/i.test(clean) && clean.length < 50) {
    return 'HESITATION';
  }

  // 9. SKIP
  if (/\b(skip|move on|next question|next topic|let'?s move (to |on to )?next)\b/i.test(clean) && clean.length < 60) {
    return 'SKIP_QUESTION';
  }

  return 'ANSWER';
}

export const oralService = {
  async createSession(userId: string, data: any) {
    const fallbackId = `sess_${uuidv4().replace(/-/g, '').slice(0, 16)}`;
    const sessionObj = {
      id: fallbackId,
      userId: userId || 'demo-user-123',
      interviewType: data.interviewType || 'JOB',
      targetRole: data.targetRole || 'Software Engineer',
      targetCompany: data.targetCompany || 'Top Tech Companies',
      industry: data.industry || 'Technology',
      experienceLevel: data.experienceLevel || 'MID',
      focusAreas: data.focusAreas && data.focusAreas.length ? data.focusAreas : ['General Technical'],
      interviewGoal: data.interviewGoal || 'Mock Interview Practice',
      durationMins: data.durationMins || 20,
      resumeId: data.resumeId || null,
      status: 'SETUP',
      createdAt: new Date(),
      questions: [],
      chatHistory: [],
    };

    try {
      const dbSession = await prisma.oralSession.create({
        data: {
          userId: userId || 'demo-user-123',
          interviewType: data.interviewType,
          targetRole: data.targetRole,
          targetCompany: data.targetCompany,
          industry: data.industry,
          experienceLevel: data.experienceLevel,
          focusAreas: data.focusAreas && data.focusAreas.length ? data.focusAreas : ['General Technical'],
          interviewGoal: data.interviewGoal,
          durationMins: data.durationMins || 20,
          resumeId: data.resumeId,
          status: 'SETUP',
        },
      });
      return dbSession;
    } catch (err) {
      console.warn('[OralService] Database write bypassed, using resilient session fallback:', (err as Error).message);
      memorySessions.set(fallbackId, sessionObj);
      memoryQuestions.set(fallbackId, []);
      memoryChatHistory.set(fallbackId, []);
      return sessionObj;
    }
  },

  async startSession(sessionId: string, userId: string) {
    const firstQuestionText = `Tell me about yourself and your experience relative to the target role.`;
    
    try {
      const dbSession = await prisma.oralSession.findFirst({
        where: { id: sessionId },
      });

      if (dbSession) {
        const updated = await prisma.oralSession.update({
          where: { id: sessionId },
          data: {
            status: 'IN_PROGRESS',
            startedAt: new Date(),
          },
        });

        const question = await prisma.oralQuestion.create({
          data: {
            sessionId,
            orderIndex: 1,
            questionText: `Tell me about yourself and your experience relative to the ${dbSession.targetRole} role.`,
            questionType: 'BEHAVIOURAL',
            difficulty: 'MEDIUM',
            evalStrengths: [],
            evalWeaknesses: [],
          },
        });

        return { session: updated, currentQuestion: question };
      }
    } catch (err) {
      console.warn('[OralService] DB startSession fallback:', (err as Error).message);
    }

    // Fallback store lookup
    const memSession = memorySessions.get(sessionId);
    if (!memSession) {
      // Create session on the fly if not found
      const newSession = {
        id: sessionId,
        userId: userId || 'demo-user-123',
        targetRole: 'Fullstack Engineer',
        status: 'IN_PROGRESS',
        startedAt: new Date(),
      };
      memorySessions.set(sessionId, newSession);
    } else {
      memSession.status = 'IN_PROGRESS';
      memSession.startedAt = new Date();
    }

    const question = {
      id: `q_${uuidv4().slice(0, 8)}`,
      sessionId,
      orderIndex: 1,
      questionText: `Tell me about yourself and your background in software engineering.`,
      questionType: 'BEHAVIOURAL',
      difficulty: 'MEDIUM',
      evalStrengths: [],
      evalWeaknesses: [],
    };

    const questions = memoryQuestions.get(sessionId) || [];
    questions.push(question);
    memoryQuestions.set(sessionId, questions);

    return { session: memorySessions.get(sessionId), currentQuestion: question };
  },

  async submitAnswer(
    sessionId: string,
    userId: string,
    questionId: string,
    answerText: string,
    timeTaken: number,
    isSkip?: boolean
  ) {
    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:4003';
    let evaluationResult: any = null;

    if (isSkip) {
      evaluationResult = {
        intent: 'SKIP_QUESTION',
        correctness: 0,
        conceptCoverage: 0,
        depth: 0,
        clarity: 0.5,
        relevance: 0,
        confidence: 0,
        coveredConcepts: [],
        missingConcepts: [],
        misconceptions: [],
        quality: 'DON_T_KNOW',
        score: 0,
        feedback: 'Candidate skipped this question.',
        recommendedAction: 'MOVE_ON',
        spokenResponse: 'Understood. Let us move to the next question.',
        emotion: 'encouraging',
        gesture: 'nod',
        isSkip: true,
      };
    } else {
      try {
        const session = await this.getSession(sessionId, userId);
        const currentQ = (session.questions || []).find((q: any) => q.id === questionId);
        if (currentQ) {
          const evalResp = await fetch(`${aiServiceUrl}/internal/evaluate-answer`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              questionText: currentQ.questionText,
              questionType: currentQ.questionType,
              answerText,
              session,
              requiredConcepts: currentQ.requiredConcepts || [],
              optionalConcepts: currentQ.optionalConcepts || [],
            }),
            signal: AbortSignal.timeout(10000),
          });
          if (evalResp.ok) {
            evaluationResult = await evalResp.json();
          }
        }
      } catch (e) {
        console.warn('[OralService] AI evaluate-answer skipped/fallback:', (e as Error).message);
      }
    }

    // Default fallback evaluation if service unavailable
    if (!evaluationResult) {
      evaluationResult = {
        intent: 'ANSWER',
        correctness: 0.75,
        conceptCoverage: 0.70,
        depth: 0.60,
        clarity: 0.80,
        relevance: 0.85,
        confidence: 0.75,
        coveredConcepts: [],
        missingConcepts: [],
        misconceptions: [],
        quality: 'PARTIAL',
        score: 75,
        feedback: 'Solid answer, but deeper architectural trade-offs could be highlighted.',
        recommendedAction: 'PROBE_DEPTH',
        spokenResponse: "You are on the right track. Can you explain that in slightly more detail?",
        emotion: 'curious',
        gesture: 'nod',
      };
    }

    const sessionObj = await this.getSession(sessionId, userId);
    const context = {
      sessionId,
      currentState: sessionObj.engineState || 'ASKING',
      currentQuestionIndex: sessionObj.questions ? sessionObj.questions.length : 1,
      totalQuestionsPlanned: sessionObj.durationMins ? Math.round(sessionObj.durationMins / 4) : 5,
      currentDifficulty: sessionObj.currentDifficulty || 'MEDIUM',
      consecutiveStrongAnswers: sessionObj.consecutiveStrongAnswers || 0,
      consecutiveWeakAnswers: sessionObj.consecutiveWeakAnswers || 0,
      sessionMemory: sessionObj.questions || [],
    };

    const transitionResult = InterviewStateMachine.handleIntent(context, evaluationResult);

    try {
      const updateData: any = {
        answerText,
        answeredAt: new Date(),
        timeTakenSecs: timeTaken,
        evalScore: evaluationResult.score,
        evalFeedback: evaluationResult.feedback,
      };

      const updatedQuestion = await prisma.oralQuestion.update({
        where: { id: questionId },
        data: updateData,
      });

      await prisma.oralChatHistory.create({
        data: {
          sessionId,
          role: 'user',
          content: isSkip ? `[Candidate skipped: "${answerText || 'Not familiar with this topic'}"]` : answerText,
        },
      });

      return {
        ...updatedQuestion,
        evaluation: evaluationResult,
        transition: transitionResult,
      };
    } catch (err) {
      console.warn('[OralService] DB submitAnswer fallback:', (err as Error).message);
      const questions = memoryQuestions.get(sessionId) || [];
      const q = questions.find((item) => item.id === questionId) || {
        id: questionId,
        sessionId,
        orderIndex: 1,
        questionText: 'Tell me about yourself',
      };
      q.answerText = answerText;
      q.answeredAt = new Date();
      q.timeTakenSecs = timeTaken;
      (q as any).evalScore = evaluationResult.score;
      (q as any).evalFeedback = evaluationResult.feedback;

      return {
        ...q,
        evaluation: evaluationResult,
        transition: transitionResult,
      };
    }

  },

  async getSession(sessionId: string, userId: string) {
    try {
      const dbSession = await prisma.oralSession.findFirst({
        where: { id: sessionId },
        include: {
          questions: { orderBy: { orderIndex: 'asc' } },
          chatHistory: { orderBy: { timestamp: 'asc' } },
        },
      });

      if (dbSession) {
        const sessionWithAnalysis: any = { ...dbSession };
        if (memoryAnalysis.has(sessionId)) {
          sessionWithAnalysis.analysis = memoryAnalysis.get(sessionId);
        }
        return sessionWithAnalysis;
      }
    } catch (err) {
      console.warn('[OralService] DB getSession fallback:', (err as Error).message);
    }

    const memSession = memorySessions.get(sessionId);
    if (memSession) {
      const sessionWithAnalysis: any = {
        ...memSession,
        questions: memoryQuestions.get(sessionId) || [],
        chatHistory: memoryChatHistory.get(sessionId) || [],
      };
      if (memoryAnalysis.has(sessionId)) {
        sessionWithAnalysis.analysis = memoryAnalysis.get(sessionId);
      }
      return sessionWithAnalysis;
    }

    // Auto construct active fallback session if requested
    const autoSession: any = {
      id: sessionId,
      userId: userId || 'demo-user-123',
      targetRole: 'Fullstack Engineer',
      targetCompany: 'Top Tech Companies',
      industry: 'Technology',
      experienceLevel: 'MID',
      focusAreas: ['DSA', 'System Design'],
      durationMins: 20,
      status: 'IN_PROGRESS',
      startedAt: new Date(),
      questions: memoryQuestions.get(sessionId) || [],
      chatHistory: memoryChatHistory.get(sessionId) || [],
    };
    if (memoryAnalysis.has(sessionId)) {
      autoSession.analysis = memoryAnalysis.get(sessionId);
    }
    memorySessions.set(sessionId, autoSession);
    return autoSession;
  },

  async listSessions(userId?: string) {
    try {
      const dbSessions = await prisma.oralSession.findMany({
        where: { userId: userId || 'demo-user-123' },
        orderBy: { createdAt: 'desc' },
      });
      if (dbSessions && dbSessions.length > 0) return dbSessions;
    } catch (err) {
      console.warn('[OralService] DB listSessions fallback:', (err as Error).message);
    }

    return Array.from(memorySessions.values());
  },

  async getNextQuestion(sessionId: string, userId: string) {
    try {
      const session = await this.getSession(sessionId, userId);
      const existingCount = session.questions ? session.questions.length : 0;
      if (existingCount >= 5) {
        return { isComplete: true };
      }

      const nextOrder = existingCount + 1;
      const role = session.targetRole || 'Software Engineer';
      const roleLower = role.toLowerCase();

      // Formulate past Q&A context to pass to Ollama / AI Service
      const previousQA = (session.questions || []).map((q: any) => ({
        questionText: q.questionText,
        answerText: q.answerText || '',
        score: q.evalScore ?? undefined,
      }));

      let promptText = '';
      let qType = 'TECHNICAL';
      let difficulty = 'MEDIUM';

      const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:4003';
      try {
        const resp = await fetch(`${aiServiceUrl}/internal/generate-next-question`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session: {
              id: session.id,
              targetRole: session.targetRole || 'Software Engineer',
              targetCompany: session.targetCompany || 'Top Tech Companies',
              industry: session.industry || 'Technology',
              experienceLevel: session.experienceLevel || 'MID',
              focusAreas: session.focusAreas || ['Software Engineering', 'System Design'],
              interviewType: session.interviewType || 'TECHNICAL',
            },
            previousQA,
            orderIndex: nextOrder - 1,
          }),
          signal: AbortSignal.timeout(10000),
        });

        if (resp.ok) {
          const aiData = (await resp.json()) as any;
          if (aiData?.questionText?.trim()) {
            promptText = aiData.questionText.trim()
              .replace(/^(Follow-up|Follow up|Question\s*\d+|Next question|Follow-up Question)\s*:\s*/i, '')
              .trim();
            if (aiData.questionType) qType = aiData.questionType;
            if (aiData.difficulty) difficulty = aiData.difficulty;
          }
        }
      } catch (fetchErr) {
        console.warn('[OralService] AI Service generate-next-question offline/timed out, using adaptive fallback:', (fetchErr as Error).message);
      }

      // Cohesive 5-Stage Adaptive Question Strategy (Domain & Stated Stack Aware)
      let requiredConcepts: string[] = [];
      let optionalConcepts: string[] = [];

      if (!promptText) {
        const allSpokenSoFar = previousQA.map((p: any) => (p.answerText || '').toLowerCase()).join(' ');
        const roleLower = (session.targetRole || 'Software Engineer').toLowerCase();

        if (nextOrder === 1) {
          promptText = `Tell me about yourself, your recent engineering experience, and what technical stack you work with day-to-day as a ${session.targetRole || 'Software Engineer'}.`;
          qType = 'BEHAVIOURAL';
          difficulty = 'EASY';
          requiredConcepts = ['background overview', 'current technical stack', 'notable project or impact'];
        } else if (nextOrder === 2) {
          // Stage 2: Deep dive into the candidate's exact stated stack
          if (allSpokenSoFar.includes('react') || allSpokenSoFar.includes('frontend') || roleLower.includes('front')) {
            promptText = `You mentioned working with frontend technologies. How do you manage complex client state, prevent unnecessary component re-renders, and ensure optimal Core Web Vitals in production?`;
            requiredConcepts = ['state management', 'render optimization', 'Core Web Vitals (LCP, INP, CLS)', 'component architecture'];
          } else if (allSpokenSoFar.includes('node') || allSpokenSoFar.includes('backend') || allSpokenSoFar.includes('express') || roleLower.includes('back')) {
            promptText = `You mentioned working on backend services. How do you design your REST or GraphQL APIs, structure database connections, and handle asynchronous error propagation at scale?`;
            requiredConcepts = ['API design', 'database connection pooling', 'error handling middleware', 'asynchronous event loop'];
          } else if (allSpokenSoFar.includes('python') || allSpokenSoFar.includes('django') || allSpokenSoFar.includes('fastapi') || allSpokenSoFar.includes('ai') || allSpokenSoFar.includes('ml')) {
            promptText = `Given your experience with Python and data/backend services, how do you handle asynchronous I/O, background task queues with Celery or Redis, and API performance optimization?`;
            requiredConcepts = ['asyncio / asynchronous I/O', 'background worker queues', 'caching with Redis', 'data validation'];
          } else if (allSpokenSoFar.includes('java') || allSpokenSoFar.includes('spring')) {
            promptText = `In your Spring Boot / Java services, how do you manage dependency injection, thread pool executor tuning, and transactional boundary isolation across microservices?`;
            requiredConcepts = ['Spring IoC / Dependency Injection', 'Thread pool sizing', 'Transaction management (@Transactional)', 'Microservice boundaries'];
          } else {
            promptText = `In the primary tech stack you use as a ${session.targetRole || 'Software Engineer'}, walk me through the end-to-end architecture of a significant feature or service you developed.`;
            requiredConcepts = ['architecture layout', 'data flow', 'component interaction', 'trade-offs made'];
          }
          qType = 'TECHNICAL';
          difficulty = 'MEDIUM';
        } else if (nextOrder === 3) {
          // Stage 3: System Architecture & Data/Trade-off Layer
          if (allSpokenSoFar.includes('postgres') || allSpokenSoFar.includes('sql') || allSpokenSoFar.includes('database') || allSpokenSoFar.includes('mongo') || roleLower.includes('full') || roleLower.includes('back')) {
            promptText = `When scaling your database layer under high concurrent traffic, how do you evaluate indexing strategies, connection pooling, and choosing between SQL vs NoSQL or caching with Redis?`;
            requiredConcepts = ['indexing (B-Tree)', 'read vs write trade-offs', 'caching invalidation strategy', 'concurrency control'];
          } else if (roleLower.includes('front')) {
            promptText = `How do you architect large-scale client-side applications for offline resilience, service worker caching, and secure token storage without exposing vulnerable XSS surfaces?`;
            requiredConcepts = ['service workers / caching strategies', 'token security (HttpOnly vs memory)', 'XSS / CSRF mitigation', 'bundle splitting'];
          } else {
            promptText = `How do you approach scalability bottlenecks in your system, specifically regarding load balancing, caching layers, and handling asynchronous task processing?`;
            requiredConcepts = ['load balancing algorithms', 'caching layers', 'message queuing', 'system bottlenecks'];
          }
          qType = 'SYSTEM_DESIGN';
          difficulty = 'MEDIUM';
        } else if (nextOrder === 4) {
          // Stage 4: Real-World Troubleshooting / Production Outage / Optimization
          promptText = `Can you describe a complex production bug, memory leak, or performance latency bottleneck you investigated in your applications? How did you isolate root cause and verify the fix?`;
          qType = 'TECHNICAL';
          difficulty = 'HARD';
          requiredConcepts = ['root cause analysis', 'profiling & telemetry tools', 'mitigation strategy', 'long-term regression prevention'];
        } else {
          // Stage 5: Behavioral & Engineering Leadership
          promptText = `Tell me about a time you faced a sharp technical disagreement with a teammate regarding system architecture or library choice. How did you evaluate trade-offs and reach alignment?`;
          qType = 'BEHAVIOURAL';
          difficulty = 'MEDIUM';
          requiredConcepts = ['conflict resolution', 'objective technical trade-offs', 'team alignment', 'positive outcome'];
        }
      } else {
        // Find matching required concepts if text aligns with question bank or defaults
        const bankMatch = QUESTION_BANK.find(q => promptText.toLowerCase().includes(q.topic.toLowerCase()));
        if (bankMatch) {
          requiredConcepts = bankMatch.requiredConcepts;
          optionalConcepts = bankMatch.optionalConcepts;
        } else {
          requiredConcepts = ['core concept', 'technical implementation', 'trade-offs'];
        }
      }

      const questionObj = {
        id: `q_${uuidv4().slice(0, 8)}`,
        sessionId,
        orderIndex: nextOrder,
        questionText: promptText,
        questionType: qType,
        difficulty,
        requiredConcepts,
        optionalConcepts,
        evalStrengths: [],
        evalWeaknesses: [],
      };

      try {
        const createdQ = await prisma.oralQuestion.create({
          data: {
            sessionId,
            orderIndex: nextOrder,
            questionText: promptText,
            questionType: qType,
            difficulty,
            evalStrengths: [],
            evalWeaknesses: [],
          },
        });
        return {
          isComplete: false,
          question: { ...createdQ, requiredConcepts, optionalConcepts },
          ...createdQ,
          requiredConcepts,
          optionalConcepts,
        };
      } catch {
        const questions = memoryQuestions.get(sessionId) || [];
        questions.push(questionObj);
        memoryQuestions.set(sessionId, questions);
        return {
          isComplete: false,
          question: questionObj,
          ...questionObj,
        };
      }

    } catch (err) {
      console.warn('[OralService] DB getNextQuestion fallback:', (err as Error).message);
      const questions = memoryQuestions.get(sessionId) || [];
      const nextOrder = questions.length + 1;
      if (nextOrder > 5) {
        return { isComplete: true };
      }

      const memSession = memorySessions.get(sessionId) || {};
      const role = memSession.targetRole || 'Software Engineer';
      const roleLower = role.toLowerCase();
      const allSpokenSoFar = questions.map((p: any) => (p.answerText || '').toLowerCase()).join(' ');

      let promptText = '';
      let qType = 'TECHNICAL';
      let difficulty = 'MEDIUM';

      if (nextOrder === 1) {
        promptText = `Tell me about yourself, your recent engineering experience, and what technical stack you work with day-to-day as a ${role}.`;
        qType = 'BEHAVIOURAL';
        difficulty = 'EASY';
      } else if (nextOrder === 2) {
        if (allSpokenSoFar.includes('react') || allSpokenSoFar.includes('frontend') || roleLower.includes('front')) {
          promptText = `You mentioned working with frontend technologies. How do you manage complex client state, prevent unnecessary component re-renders, and ensure optimal Core Web Vitals in production?`;
        } else if (allSpokenSoFar.includes('node') || allSpokenSoFar.includes('backend') || allSpokenSoFar.includes('express') || roleLower.includes('back')) {
          promptText = `You mentioned working on backend services. How do you design your REST or GraphQL APIs, structure database connections, and handle asynchronous error propagation at scale?`;
        } else if (allSpokenSoFar.includes('python') || allSpokenSoFar.includes('django') || allSpokenSoFar.includes('fastapi')) {
          promptText = `Given your experience with Python, how do you handle asynchronous I/O, background worker queues with Celery or Redis, and API performance optimization?`;
        } else {
          promptText = `In the primary tech stack you use as a ${role}, walk me through the end-to-end architecture of a significant feature or service you developed.`;
        }
      } else if (nextOrder === 3) {
        promptText = `When scaling your system under high concurrent traffic, how do you evaluate indexing strategies, database connection pooling, and caching with Redis?`;
        qType = 'SYSTEM_DESIGN';
      } else if (nextOrder === 4) {
        promptText = `Can you describe a complex production bug, memory leak, or performance latency bottleneck you investigated in your applications? How did you isolate root cause and verify the fix?`;
        difficulty = 'HARD';
      } else {
        promptText = `Tell me about a time you faced a sharp technical disagreement with a teammate regarding system architecture or library choice. How did you evaluate trade-offs and reach alignment?`;
        qType = 'BEHAVIOURAL';
      }

      const newQ = {
        id: `q_${uuidv4().slice(0, 8)}`,
        sessionId,
        orderIndex: nextOrder,
        questionText: promptText,
        questionType: qType,
        difficulty,
        evalStrengths: [],
        evalWeaknesses: [],
      };

      questions.push(newQ);
      memoryQuestions.set(sessionId, questions);
      return {
        isComplete: false,
        question: newQ,
        ...newQ,
      };
    }
  },

  async completeSession(sessionId: string, userId: string, payload?: any) {
    const session = await this.getSession(sessionId, userId);
    const questions: any[] = session.questions || [];
    const answered = questions.filter((q: any) => q.answerText && q.answerText.trim());

    // 1. Technical score from answered questions
    let technicalScore = 0;
    if (answered.length > 0) {
      const totalScore = answered.reduce((acc: number, q: any) => acc + (typeof q.evalScore === 'number' ? q.evalScore : 70), 0);
      technicalScore = Math.round(totalScore / answered.length);
    }

    // 2. Communication score from real words and pace
    const allAnswers = answered.map((q: any) => q.answerText).join(' ');
    const words = allAnswers.split(/\s+/).filter(Boolean);
    const totalWords = words.length;

    let fillerCount = 0;
    const fillers = ['um', 'umm', 'uh', 'uhh', 'like', 'basically', 'actually', 'literally'];
    for (const f of fillers) {
      const regex = new RegExp(`\\b${f}\\b`, 'gi');
      const matches = allAnswers.match(regex);
      if (matches) fillerCount += matches.length;
    }

    const fillerPenalty = Math.min(30, fillerCount * 3);
    const lengthScore = Math.min(100, Math.max(30, (totalWords / (answered.length || 1)) * 1.5));
    const communicationScore = answered.length > 0
      ? Math.max(20, Math.min(100, Math.round(lengthScore * 0.7 + (100 - fillerPenalty) * 0.3)))
      : 0;

    // 3. Confidence & Proctoring
    const tabBlurCount = payload?.proctoring?.tabBlurCount ?? 0;
    const eyeContactScore = payload?.proctoring?.eyeContactScore ?? (payload?.isDisqualified ? 0 : 85);
    const confidenceScore = payload?.isDisqualified ? 0 : Math.max(0, Math.min(100, 100 - tabBlurCount * 15 - (eyeContactScore < 75 ? 15 : 0)));

    const structureScore = Math.max(0, Math.min(100, Math.round(technicalScore * 0.55 + communicationScore * 0.3 + confidenceScore * 0.15)));
    const overallScore = Math.max(0, Math.min(100, Math.round(technicalScore * 0.40 + communicationScore * 0.30 + confidenceScore * 0.30)));

    // 4. Dynamic Strengths & Improvements
    const strengths: string[] = [];
    const improvements: string[] = [];

    answered.forEach((q: any) => {
      if (q.evalStrengths && Array.isArray(q.evalStrengths)) {
        strengths.push(...q.evalStrengths);
      }
      if (q.evalWeaknesses && Array.isArray(q.evalWeaknesses)) {
        improvements.push(...q.evalWeaknesses);
      }
    });

    if (strengths.length === 0) {
      if (technicalScore >= 70) strengths.push(`Demonstrated solid competence in ${session.targetRole || 'engineering'} topics.`);
      if (communicationScore >= 70) strengths.push('Clear conversational pace and articulation.');
      if (strengths.length === 0) strengths.push('Completed the interview session.');
    }

    if (improvements.length === 0) {
      if (fillerCount > 2) improvements.push(`Reduce verbal fillers (${fillerCount} detected).`);
      if (technicalScore < 70) improvements.push('Expand technical depth and discuss architectural trade-offs.');
      if (tabBlurCount > 0) improvements.push(`Avoid window switching (${tabBlurCount} tab blur events).`);
      if (improvements.length === 0) improvements.push('Practice structuring responses using the STAR method.');
    }

    const readinessVerdict = overallScore >= 80 ? 'READY' : overallScore >= 60 ? 'ALMOST_READY' : 'NOT_READY';

    let analysis: any = {
      id: `an_${sessionId}`,
      sessionId,
      overallScore,
      communicationScore,
      technicalScore,
      confidenceScore,
      structureScore,
      confidenceMeterScore: confidenceScore,
      confidenceSignals: {
        avgWpm: Math.round(totalWords / Math.max(1, (answered.length * 1.5))),
        avgPauseCount: fillerCount,
        avgAnswerLength: Math.round(totalWords / (answered.length || 1)),
      },
      eyeContactScore,
      presenceScore: confidenceScore,
      summary: `Candidate completed interview for ${session.targetRole || 'Software Engineer'}. Technical score: ${technicalScore}/100. Communication score: ${communicationScore}/100. Proctoring & confidence: ${confidenceScore}/100.`,
      strengths: Array.from(new Set(strengths)).slice(0, 3),
      improvements: Array.from(new Set(improvements)).slice(0, 3),
      actionableTips: [
        { tip: 'Substantiate Trade-offs', reason: `For ${session.targetRole || 'target'} roles, discuss scalability and system limits.` },
        { tip: 'Fluent Delivery', reason: fillerCount > 0 ? 'Replace filler words with deliberate pauses.' : 'Maintain your clear speaking rhythm.' },
        { tip: 'Screen Presence', reason: 'Keep visual focus locked on the interviewer to maximize proctoring scores.' },
      ],
      readinessVerdict,
      createdAt: new Date().toISOString(),
    };

    // Try calling AI Analysis service RPC for full neural compilation
    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:4003';
    try {
      const resp = await fetch(`${aiServiceUrl}/internal/evaluate-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          confidenceMetrics: {
            score: confidenceScore,
            signals: analysis.confidenceSignals,
          },
          proctoring: {
            eyeContactScore,
            presenceScore: confidenceScore,
            tabBlurCount,
          },
        }),
        signal: AbortSignal.timeout(6000),
      });
      if (resp.ok) {
        const aiAnalysis = await resp.json();
        if (aiAnalysis && aiAnalysis.overallScore !== undefined) {
          analysis = aiAnalysis;
        }
      }
    } catch (e) {
      console.warn('[OralService] ai-analysis-service evaluate-session RPC skipped/fallback:', (e as Error).message);
    }

    memoryAnalysis.set(sessionId, analysis);

    try {
      const updated = await prisma.oralSession.update({
        where: { id: sessionId },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
        },
      });
      return { ...updated, analysis };
    } catch (err) {
      console.warn('[OralService] DB completeSession fallback:', (err as Error).message);
      const s = memorySessions.get(sessionId);
      if (s) {
        s.status = 'COMPLETED';
        s.completedAt = new Date();
        s.analysis = analysis;
      }
      return s || { id: sessionId, status: 'COMPLETED', analysis };
    }
  },
};
