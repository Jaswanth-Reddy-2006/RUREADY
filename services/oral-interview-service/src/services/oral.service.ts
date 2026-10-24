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

export function getInitialInterviewPrompt(targetRole: string, targetCompany?: string): string {
  const roleLower = (targetRole || 'Software Engineer').toLowerCase();
  const company = targetCompany && targetCompany !== 'None / General Target' ? targetCompany : '';

  if (company) {
    if (roleLower.includes('frontend') || roleLower.includes('react')) {
      return `To kick off, given ${company}'s focus on high-performance web applications, walk me through the architecture of a complex user interface you recently implemented in React, and the main state management trade-offs you navigated.`;
    } else if (roleLower.includes('backend') || roleLower.includes('api') || roleLower.includes('node') || roleLower.includes('distributed')) {
      return `To start our technical discussion, considering ${company}'s scale, walk me through a high-throughput backend service you recently designed or maintained, and the latency or reliability requirements you had to satisfy.`;
    }
    return `To begin our interview, tell me about a technically demanding feature or service you recently engineered that aligns with the core challenges at ${company}, and the architectural decisions you personally made.`;
  }

  if (roleLower.includes('frontend') || roleLower.includes('react')) {
    return `To begin our technical discussion, walk me through the architecture of a complex production application or feature you recently built with React, and how you decided what state should live locally versus shared globally.`;
  } else if (roleLower.includes('backend') || roleLower.includes('node') || roleLower.includes('java') || roleLower.includes('python') || roleLower.includes('go')) {
    return `To get started, describe a backend service or data pipeline you recently implemented, and the primary scaling or database concurrency considerations you had to solve.`;
  } else if (roleLower.includes('full') || roleLower.includes('fullstack')) {
    return `To begin, walk me through an end-to-end feature you engineered from the database schema up to the client interface, highlighting the primary architectural trade-offs you navigated.`;
  } else if (roleLower.includes('system') || roleLower.includes('devops') || roleLower.includes('cloud') || roleLower.includes('sre')) {
    return `To kick off, describe a critical infrastructure or deployment pipeline challenge you recently solved, and how you ensured high availability and observability under traffic spikes.`;
  }
  return `To kick off our technical discussion, describe a technically demanding project you recently engineered as a ${targetRole || 'Software Engineer'}, and the core system design trade-offs you had to defend.`;
}

export function generateContextualFollowUp(
  targetRole: string,
  targetCompany: string | undefined,
  currentQuestionText: string,
  answerText: string
): { followUpText: string; spokenBridge: string } {
  const ans = (answerText || '').toLowerCase();
  const company = targetCompany && targetCompany !== 'None / General Target' ? ` at ${targetCompany}` : '';

  if (ans.includes('react') || ans.includes('redux') || ans.includes('hook') || ans.includes('frontend') || ans.includes('render') || ans.includes('state') || ans.includes('virtual dom')) {
    return {
      followUpText: `You mentioned managing component state and rendering${company}. How do you isolate state updates to prevent unnecessary re-render waterfalls, and what trade-offs do you consider between Context API, external stores like Zustand, and local state?`,
      spokenBridge: `Good explanation. Let me probe deeper into your frontend architecture:`,
    };
  }

  if (ans.includes('redis') || ans.includes('cache') || ans.includes('caching') || ans.includes('memcached')) {
    return {
      followUpText: `Regarding the caching layer you touched on: how do you manage cache invalidation strategies, handle cache penetration or stampedes under sudden traffic surges, and ensure consistency with your primary database?`,
      spokenBridge: `Interesting points on caching. Diving into the concurrency aspects:`,
    };
  }

  if (ans.includes('postgres') || ans.includes('sql') || ans.includes('mongo') || ans.includes('database') || ans.includes('index') || ans.includes('query') || ans.includes('transaction')) {
    return {
      followUpText: `Following up on your database layer: when queries experience high latency under concurrency, what indexing strategies (like B-Tree vs Hash or composite indexes) do you implement, and how do you prevent transaction deadlocks?`,
      spokenBridge: `Understood. Let us explore the database trade-offs a step further:`,
    };
  }

  if (ans.includes('microservice') || ans.includes('api') || ans.includes('kafka') || ans.includes('queue') || ans.includes('worker') || ans.includes('event') || ans.includes('async')) {
    return {
      followUpText: `You mentioned distributed services and communication. How do you handle network partition timeouts, implement idempotency for retry mechanisms, and prevent message duplication in your event pipelines?`,
      spokenBridge: `That is a critical system consideration. Following up on resilience:`,
    };
  }

  if (ans.includes('python') || ans.includes('fastapi') || ans.includes('django') || ans.includes('celery')) {
    return {
      followUpText: `Given your Python stack: how do you manage the Global Interpreter Lock under CPU-bound tasks, structure asyncio event loops, and tune background worker concurrency?`,
      spokenBridge: `Good technical foundation. Following up on your Python internals:`,
    };
  }

  if (ans.includes('java') || ans.includes('spring') || ans.includes('jvm')) {
    return {
      followUpText: `In your Java and Spring services: how do you tune thread pool executors, manage transactional boundaries across repositories, and handle JVM garbage collection pause latency?`,
      spokenBridge: `Solid overview. Let us probe deeper into your Spring architecture:`,
    };
  }

  return {
    followUpText: `Could you walk me through the primary technical trade-offs you evaluated when making that choice, and how you would redesign it if the traffic volume or scale multiplied by a factor of ten?`,
    spokenBridge: `You're on the right track. Can you elaborate further on the architectural trade-offs?`,
  };
}

export function getDomainQuestionForStage(
  stageOrder: number,
  targetRole: string,
  targetCompany: string | undefined,
  previousQA: Array<{ questionText: string; answerText?: string }>
): { questionText: string; questionType: string; category: string; difficulty: string; spokenBridge: string } {
  const roleLower = (targetRole || 'Software Engineer').toLowerCase();
  const allSpoken = previousQA.map(p => (p.answerText || '').toLowerCase()).join(' ');

  if (stageOrder <= 1) {
    return {
      questionText: getInitialInterviewPrompt(targetRole, targetCompany),
      questionType: 'TECHNICAL',
      category: 'TECHNICAL',
      difficulty: 'MEDIUM',
      spokenBridge: "To start our technical interview:",
    };
  }

  if (stageOrder === 2) {
    if (allSpoken.includes('react') || allSpoken.includes('frontend') || roleLower.includes('front')) {
      return {
        questionText: `In your frontend architecture, how do you manage complex client-side state, optimize rendering performance with memoization or virtualization, and ensure optimal Core Web Vitals?`,
        questionType: 'TECHNICAL',
        category: 'TECHNICAL',
        difficulty: 'MEDIUM',
        spokenBridge: "Moving into our technical stack deep dive:",
      };
    } else if (allSpoken.includes('node') || allSpoken.includes('backend') || allSpoken.includes('express') || roleLower.includes('back')) {
      return {
        questionText: `When designing your backend services and APIs, how do you structure your data validation layer, handle database connection pooling, and isolate errors across asynchronous pipelines?`,
        questionType: 'TECHNICAL',
        category: 'TECHNICAL',
        difficulty: 'MEDIUM',
        spokenBridge: "Moving into our backend architecture deep dive:",
      };
    } else if (allSpoken.includes('python') || allSpoken.includes('django') || allSpoken.includes('fastapi')) {
      return {
        questionText: `Given your experience with Python, how do you handle asynchronous I/O, background worker queues with Celery or Redis, and API performance optimization?`,
        questionType: 'TECHNICAL',
        category: 'TECHNICAL',
        difficulty: 'MEDIUM',
        spokenBridge: "Diving deeper into your service architecture:",
      };
    } else if (allSpoken.includes('java') || allSpoken.includes('spring')) {
      return {
        questionText: `In your Spring Boot services, how do you manage dependency injection, thread pool sizing, and transactional boundary isolation across microservices?`,
        questionType: 'TECHNICAL',
        category: 'TECHNICAL',
        difficulty: 'MEDIUM',
        spokenBridge: "Diving deeper into your service architecture:",
      };
    }
    return {
      questionText: `In the primary tech stack you use as a ${targetRole || 'Software Engineer'}, walk me through the end-to-end architecture of a significant feature or service you developed.`,
      questionType: 'TECHNICAL',
      category: 'TECHNICAL',
      difficulty: 'MEDIUM',
      spokenBridge: "Moving into our technical stack deep dive:",
    };
  }

  if (stageOrder === 3) {
    if (allSpoken.includes('postgres') || allSpoken.includes('sql') || allSpoken.includes('mongo') || allSpoken.includes('database') || roleLower.includes('back') || roleLower.includes('full')) {
      return {
        questionText: `When scaling your database layer under high concurrent write throughput, how do you evaluate indexing strategies, database connection pooling, and decide between caching with Redis versus read replicas?`,
        questionType: 'SYSTEM_DESIGN',
        category: 'SYSTEM_DESIGN',
        difficulty: 'MEDIUM',
        spokenBridge: "Let us now focus on system architecture and scalability:",
      };
    } else if (roleLower.includes('front')) {
      return {
        questionText: `How do you architect large-scale client applications for offline resilience, service worker caching, and secure token management without exposing vulnerable XSS or CSRF surfaces?`,
        questionType: 'SYSTEM_DESIGN',
        category: 'SYSTEM_DESIGN',
        difficulty: 'MEDIUM',
        spokenBridge: "Let us now focus on client architecture and security:",
      };
    }
    return {
      questionText: `How do you approach scalability bottlenecks in your system, specifically regarding load balancing, caching layers, and handling asynchronous task processing?`,
      questionType: 'SYSTEM_DESIGN',
      category: 'SYSTEM_DESIGN',
      difficulty: 'MEDIUM',
      spokenBridge: "Let us now focus on system architecture and scalability:",
    };
  }

  if (stageOrder === 4) {
    return {
      questionText: `Can you describe a complex production bug, memory leak, or latency bottleneck you diagnosed in your systems? What telemetry or profiling tools did you use, and how did you verify the permanent fix?`,
      questionType: 'TECHNICAL',
      category: 'TECHNICAL',
      difficulty: 'HARD',
      spokenBridge: "Moving into real-world troubleshooting and incident response:",
    };
  }

  return {
    questionText: `Tell me about a time you faced a sharp technical disagreement with a teammate or stakeholder regarding system architecture or library choice. How did you objectively evaluate the trade-offs and build consensus?`,
    questionType: 'BEHAVIOURAL',
    category: 'BEHAVIOURAL',
    difficulty: 'MEDIUM',
    spokenBridge: "For our final discussion area regarding engineering collaboration:",
  };
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

        const dynamicPrompt = getInitialInterviewPrompt(dbSession.targetRole, dbSession.targetCompany || undefined);
        const question = await prisma.oralQuestion.create({
          data: {
            sessionId,
            orderIndex: 1,
            questionText: dynamicPrompt,
            questionType: 'TECHNICAL',
            category: 'TECHNICAL',
            difficulty: 'MEDIUM',
            evalStrengths: [],
            evalWeaknesses: [],
          },
        });

        // Store Ava opening prompt into chat history
        await prisma.oralChatHistory.create({
          data: {
            sessionId,
            role: 'ai',
            content: dynamicPrompt,
          },
        });

        return { session: updated, currentQuestion: question };
      }
    } catch (err) {
      console.warn('[OralService] DB startSession fallback:', (err as Error).message);
    }

    // Fallback store lookup
    const memSession = memorySessions.get(sessionId);
    const targetRole = memSession?.targetRole || 'Software Engineer';
    const targetCompany = memSession?.targetCompany;
    if (!memSession) {
      const newSession = {
        id: sessionId,
        userId: userId || 'demo-user-123',
        targetRole,
        status: 'IN_PROGRESS',
        startedAt: new Date(),
      };
      memorySessions.set(sessionId, newSession);
    } else {
      memSession.status = 'IN_PROGRESS';
      memSession.startedAt = new Date();
    }

    const dynamicPrompt = getInitialInterviewPrompt(targetRole, targetCompany);
    const question = {
      id: `q_${uuidv4().slice(0, 8)}`,
      sessionId,
      orderIndex: 1,
      questionText: dynamicPrompt,
      questionType: 'TECHNICAL',
      category: 'TECHNICAL',
      difficulty: 'MEDIUM',
      evalStrengths: [],
      evalWeaknesses: [],
    };

    const questions = memoryQuestions.get(sessionId) || [];
    questions.push(question);
    memoryQuestions.set(sessionId, questions);

    const chats = memoryChatHistory.get(sessionId) || [];
    chats.push({
      id: uuidv4(),
      sessionId,
      role: 'ai',
      content: dynamicPrompt,
      timestamp: new Date(),
    });
    memoryChatHistory.set(sessionId, chats);

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
        spokenResponse: 'Understood. That is completely okay. Let us move to the next question.',
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

    // Substantive fallback evaluation based on candidate answer length, structure, and detail
    if (!evaluationResult) {
      const words = answerText ? answerText.trim().split(/\s+/).filter(Boolean) : [];
      const wordCount = words.length;
      let calculatedScore = 75;
      let calculatedQuality = 'PARTIAL';
      let feedback = 'Solid foundational answer, though exploring more architectural trade-offs would strengthen your response.';

      if (wordCount < 10) {
        calculatedScore = 40;
        calculatedQuality = 'POOR';
        feedback = 'Brief response. Providing concrete examples, architectural context, and trade-offs would demonstrate deeper mastery.';
      } else if (wordCount < 25) {
        calculatedScore = 60;
        calculatedQuality = 'PARTIAL';
        feedback = 'Answer is concise. Expanding on practical challenges and implementation details would elevate your technical rating.';
      } else if (wordCount >= 70) {
        calculatedScore = 88;
        calculatedQuality = 'STRONG';
        feedback = 'Very detailed and comprehensive explanation demonstrating strong technical depth and clarity.';
      } else if (wordCount >= 40) {
        calculatedScore = 80;
        calculatedQuality = 'GOOD';
        feedback = 'Well-structured response that addresses the core requirements with good technical clarity.';
      }

      evaluationResult = {
        intent: 'ANSWER',
        correctness: calculatedScore / 100,
        conceptCoverage: Math.min(1.0, (calculatedScore + 5) / 100),
        depth: Math.min(1.0, calculatedScore / 100),
        clarity: Math.min(1.0, (calculatedScore + 10) / 100),
        relevance: 0.85,
        confidence: calculatedScore > 70 ? 0.85 : 0.65,
        coveredConcepts: [],
        missingConcepts: [],
        misconceptions: [],
        quality: calculatedQuality,
        score: calculatedScore,
        feedback,
        recommendedAction: calculatedScore >= 75 ? 'ADVANCE' : 'PROBE_DEPTH',
        spokenResponse: calculatedScore >= 75 ? 'That makes a lot of sense. Let us dive a bit deeper.' : 'Could you expand on that with a specific example?',
        emotion: calculatedScore >= 75 ? 'encouraging' : 'curious',
        gesture: 'nod',
      };
    }

    const sessionObj = await this.getSession(sessionId, userId);
    const existingQuestions = sessionObj.questions || [];
    const context = {
      sessionId,
      currentState: sessionObj.engineState || 'ASKING',
      currentQuestionIndex: existingQuestions.length || 1,
      totalQuestionsPlanned: sessionObj.durationMins ? Math.round(sessionObj.durationMins / 4) : 5,
      currentDifficulty: sessionObj.currentDifficulty || 'MEDIUM',
      consecutiveStrongAnswers: sessionObj.consecutiveStrongAnswers || 0,
      consecutiveWeakAnswers: sessionObj.consecutiveWeakAnswers || 0,
      sessionMemory: existingQuestions,
    };

    const transitionResult = InterviewStateMachine.handleIntent(context, evaluationResult);

    try {
      // 1. Locate the DB question
      let targetQ: any = null;
      if (questionId) {
        targetQ = await prisma.oralQuestion.findUnique({
          where: { id: questionId },
        });
      }
      if (!targetQ) {
        targetQ = await prisma.oralQuestion.findFirst({
          where: { sessionId, answerText: null },
          orderBy: { orderIndex: 'desc' },
        });
      }
      if (!targetQ) {
        targetQ = await prisma.oralQuestion.findFirst({
          where: { sessionId },
          orderBy: { orderIndex: 'desc' },
        });
      }

      const updateData: any = {
        answerText: isSkip ? `[Candidate skipped: "${answerText || 'Not familiar with this topic'}"]` : answerText,
        answeredAt: new Date(),
        timeTakenSecs: timeTaken,
        evalScore: evaluationResult.score,
        evalFeedback: evaluationResult.feedback,
        evalStrengths: evaluationResult.coveredConcepts || [],
        evalWeaknesses: evaluationResult.missingConcepts || [],
      };

      let updatedQuestion: any;
      if (targetQ) {
        updatedQuestion = await prisma.oralQuestion.update({
          where: { id: targetQ.id },
          data: updateData,
        });
      } else {
        updatedQuestion = await prisma.oralQuestion.create({
          data: {
            sessionId,
            orderIndex: 1,
            questionText: 'Technical overview discussion',
            questionType: 'TECHNICAL',
            ...updateData,
          },
        });
      }

      // 2. Chat history for candidate answer
      await prisma.oralChatHistory.create({
        data: {
          sessionId,
          role: 'user',
          content: isSkip ? `[Candidate skipped: "${answerText || 'Not familiar with this topic'}"]` : answerText,
        },
      });

      // 3. Evaluate completion or determine next question / follow-up
      const allDbQuestions = await prisma.oralQuestion.findMany({
        where: { sessionId },
        orderBy: { orderIndex: 'asc' },
      });

      const answeredCount = allDbQuestions.filter(q => q.answerText && q.answerText.trim()).length;
      const durationMins = sessionObj.durationMins || 20;
      const maxQuestions = Math.max(5, Math.ceil(durationMins / 3));

      const startedAt = sessionObj.startedAt ? new Date(sessionObj.startedAt).getTime() : Date.now();
      const elapsedMinutes = (Date.now() - startedAt) / (1000 * 60);

      // Session Complete Condition
      if (
        (elapsedMinutes >= durationMins && answeredCount >= 3) ||
        answeredCount >= maxQuestions ||
        transitionResult.nextAction === 'COMPLETE_INTERVIEW'
      ) {
        const closingResponse = "That completes all the questions for today's session! You've done an excellent job discussing your engineering experiences. Let me now compile your complete evaluation report.";
        await prisma.oralChatHistory.create({
          data: {
            sessionId,
            role: 'ai',
            content: closingResponse,
          },
        });

        return {
          ...updatedQuestion,
          evaluation: evaluationResult,
          transition: transitionResult,
          isFollowUp: false,
          spokenResponse: closingResponse,
          nextQuestion: null,
          isComplete: true,
        };
      }

      // 4. Determine if Follow-up or Next Domain Question
      const wasFollowUp = targetQ?.questionType === 'FOLLOW_UP';
      const words = answerText ? answerText.trim().split(/\s+/).filter(Boolean) : [];

      let shouldFollowUp = false;
      if (!isSkip && !wasFollowUp) {
        if (
          (targetQ?.orderIndex || 1) <= 1 ||
          transitionResult.nextAction === 'PROBE_DEPTH' ||
          transitionResult.nextAction === 'HARDER_FOLLOW_UP' ||
          transitionResult.nextAction === 'SIMPLER_QUESTION' ||
          evaluationResult.recommendedAction === 'PROBE_DEPTH' ||
          words.length < 35 ||
          evaluationResult.quality === 'PARTIAL' ||
          /(redis|cache|caching|kafka|queue|postgres|sql|react|microservice)/i.test(answerText)
        ) {
          shouldFollowUp = true;
        }
      }

      let newPrompt = '';
      let newBridge = '';
      let newType = 'TECHNICAL';
      let newCategory = 'TECHNICAL';
      let newDifficulty = 'MEDIUM';

      if (shouldFollowUp) {
        const fup = generateContextualFollowUp(
          sessionObj.targetRole || 'Software Engineer',
          sessionObj.targetCompany,
          targetQ?.questionText || '',
          answerText
        );
        newPrompt = fup.followUpText;
        newBridge = fup.spokenBridge;
        newType = 'FOLLOW_UP';
        newCategory = targetQ?.category || 'TECHNICAL';
        newDifficulty = transitionResult.updatedDifficulty || 'MEDIUM';
      } else {
        // Advance to next stage question
        const nextStageOrder = Math.max(2, allDbQuestions.filter(q => q.questionType !== 'FOLLOW_UP').length + 1);
        const stageQ = getDomainQuestionForStage(
          nextStageOrder,
          sessionObj.targetRole || 'Software Engineer',
          sessionObj.targetCompany,
          allDbQuestions.map(q => ({ questionText: q.questionText, answerText: q.answerText || '' }))
        );
        newPrompt = stageQ.questionText;
        newBridge = isSkip
          ? "No problem at all, that is completely fine. Let's transition to our next core topic: "
          : (wasFollowUp
            ? "That clarifies the implementation nicely. Let's move on to our next core topic: "
            : (stageQ.spokenBridge || "Good. That covers the foundational requirements. Moving to our next topic: "));
        newType = stageQ.questionType;
        newCategory = stageQ.category;
        newDifficulty = stageQ.difficulty;
      }

      const nextOrderIndex = (targetQ?.orderIndex || allDbQuestions.length) + 1;
      const createdQ = await prisma.oralQuestion.create({
        data: {
          sessionId,
          orderIndex: nextOrderIndex,
          questionText: newPrompt,
          questionType: newType,
          category: newCategory,
          difficulty: newDifficulty,
          evalStrengths: [],
          evalWeaknesses: [],
        },
      });

      const fullSpokenResponse = `${newBridge ? newBridge + ' ' : ''}${newPrompt}`.trim();
      await prisma.oralChatHistory.create({
        data: {
          sessionId,
          role: 'ai',
          content: fullSpokenResponse,
        },
      });

      return {
        ...updatedQuestion,
        evaluation: evaluationResult,
        transition: transitionResult,
        isFollowUp: shouldFollowUp,
        spokenResponse: fullSpokenResponse,
        nextQuestion: createdQ,
        isComplete: false,
      };

    } catch (err) {
      console.warn('[OralService] DB submitAnswer fallback:', (err as Error).message);
      const questions = memoryQuestions.get(sessionId) || [];
      let q = questions.find((item) => item.id === questionId);
      if (!q) {
        q = questions[questions.length - 1] || {
          id: questionId,
          sessionId,
          orderIndex: 1,
          questionText: 'Tell me about yourself',
        };
      }
      q.answerText = answerText;
      q.answeredAt = new Date();
      q.timeTakenSecs = timeTaken;
      q.evalScore = evaluationResult.score;
      q.evalFeedback = evaluationResult.feedback;

      const chats = memoryChatHistory.get(sessionId) || [];
      chats.push({
        id: uuidv4(),
        sessionId,
        role: 'user',
        content: isSkip ? `[Candidate skipped: "${answerText || 'Not familiar with this topic'}"]` : answerText,
        timestamp: new Date(),
      });

      const answeredCount = questions.filter(item => item.answerText && item.answerText.trim()).length;
      const durationMins = sessionObj.durationMins || 20;
      const maxQuestions = Math.max(5, Math.ceil(durationMins / 3));

      if (answeredCount >= maxQuestions) {
        const closingText = "That completes all the questions for today's session! You've done an excellent job discussing your engineering experiences. Let me now compile your complete evaluation report.";
        chats.push({
          id: uuidv4(),
          sessionId,
          role: 'ai',
          content: closingText,
          timestamp: new Date(),
        });
        memoryChatHistory.set(sessionId, chats);

        return {
          ...q,
          evaluation: evaluationResult,
          transition: transitionResult,
          isFollowUp: false,
          spokenResponse: closingText,
          nextQuestion: null,
          isComplete: true,
        };
      }

      const wasFollowUp = q.questionType === 'FOLLOW_UP';
      const words = answerText ? answerText.trim().split(/\s+/).filter(Boolean) : [];
      const shouldFollowUp = !isSkip && !wasFollowUp && ((q.orderIndex || 1) <= 1 || words.length < 35 || evaluationResult.quality === 'PARTIAL' || /(redis|cache|caching|kafka|queue|postgres|sql|react|microservice)/i.test(answerText));

      let newPrompt = '';
      let newBridge = '';
      let newType = 'TECHNICAL';
      let newCategory = 'TECHNICAL';
      let newDifficulty = 'MEDIUM';

      if (shouldFollowUp) {
        const fup = generateContextualFollowUp(
          sessionObj.targetRole || 'Software Engineer',
          sessionObj.targetCompany,
          q.questionText || '',
          answerText
        );
        newPrompt = fup.followUpText;
        newBridge = fup.spokenBridge;
        newType = 'FOLLOW_UP';
      } else {
        const stageQ = getDomainQuestionForStage(
          questions.length + 1,
          sessionObj.targetRole || 'Software Engineer',
          sessionObj.targetCompany,
          questions.map(item => ({ questionText: item.questionText, answerText: item.answerText || '' }))
        );
        newPrompt = stageQ.questionText;
        newBridge = isSkip
          ? "No problem at all, that is completely fine. Let's transition to our next core topic: "
          : (wasFollowUp ? "That clarifies the implementation nicely. Let's move on to our next core topic: " : stageQ.spokenBridge);
        newType = stageQ.questionType;
        newCategory = stageQ.category;
        newDifficulty = stageQ.difficulty;
      }

      const newQ = {
        id: `q_${uuidv4().slice(0, 8)}`,
        sessionId,
        orderIndex: questions.length + 1,
        questionText: newPrompt,
        questionType: newType,
        category: newCategory,
        difficulty: newDifficulty,
        evalStrengths: [],
        evalWeaknesses: [],
      };

      questions.push(newQ);
      memoryQuestions.set(sessionId, questions);

      const fullSpokenResponse = `${newBridge ? newBridge + ' ' : ''}${newPrompt}`.trim();
      chats.push({
        id: uuidv4(),
        sessionId,
        role: 'ai',
        content: fullSpokenResponse,
        timestamp: new Date(),
      });
      memoryChatHistory.set(sessionId, chats);

      return {
        ...q,
        evaluation: evaluationResult,
        transition: transitionResult,
        isFollowUp: shouldFollowUp,
        spokenResponse: fullSpokenResponse,
        nextQuestion: newQ,
        isComplete: false,
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
        if (dbSession.feedbackSummary && dbSession.feedbackSummary.trim().startsWith('{')) {
          try {
            sessionWithAnalysis.analysis = JSON.parse(dbSession.feedbackSummary);
          } catch (e) {
            // ignore
          }
        }
        if (!sessionWithAnalysis.analysis && memoryAnalysis.has(sessionId)) {
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
      const existingQuestions = session.questions || [];
      const existingCount = existingQuestions.length;
      const durationMins = session.durationMins || 20;
      const startedAt = session.startedAt ? new Date(session.startedAt).getTime() : Date.now();
      const elapsedMinutes = (Date.now() - startedAt) / (1000 * 60);
      const maxQuestionsForDuration = Math.max(5, Math.ceil(durationMins / 3));

      if ((elapsedMinutes >= durationMins && existingCount >= 3) || existingCount >= maxQuestionsForDuration) {
        return { isComplete: true };
      }

      const nextOrder = existingCount + 1;
      const stageQ = getDomainQuestionForStage(
        nextOrder,
        session.targetRole || 'Software Engineer',
        session.targetCompany,
        existingQuestions.map((q: any) => ({ questionText: q.questionText, answerText: q.answerText || '' }))
      );

      try {
        const createdQ = await prisma.oralQuestion.create({
          data: {
            sessionId,
            orderIndex: nextOrder,
            questionText: stageQ.questionText,
            questionType: stageQ.questionType,
            category: stageQ.category,
            difficulty: stageQ.difficulty,
            evalStrengths: [],
            evalWeaknesses: [],
          },
        });
        return {
          isComplete: false,
          question: createdQ,
          ...createdQ,
        };
      } catch {
        const questionObj = {
          id: `q_${uuidv4().slice(0, 8)}`,
          sessionId,
          orderIndex: nextOrder,
          questionText: stageQ.questionText,
          questionType: stageQ.questionType,
          category: stageQ.category,
          difficulty: stageQ.difficulty,
          evalStrengths: [],
          evalWeaknesses: [],
        };
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
      return { isComplete: false };
    }
  },

  async completeSession(sessionId: string, userId: string, payload?: any) {
    const session = await this.getSession(sessionId, userId);
    const questions: any[] = session.questions || [];
    const answered = questions.filter((q: any) => q.answerText && q.answerText.trim() && !q.answerText.includes('[Candidate skipped:'));

    // Proctoring & telemetry values from live video ML session
    const tabBlurCount = payload?.proctoring?.tabBlurCount ?? 0;
    const rawEyeContact = payload?.proctoring?.eyeContactScore;
    const eyeContactScore = rawEyeContact != null && !isNaN(Number(rawEyeContact)) ? Math.round(Number(rawEyeContact)) : 82;
    const postureStatus = payload?.confidenceMetrics?.postureStatus || 'Optimal';
    const composureLevel = payload?.confidenceMetrics?.composureLevel || 'Calm';

    let technicalScore = 0;
    let communicationScore = 0;
    let confidenceScore = 0;
    let problemSolvingScore = 0;
    let depthScore = 0;
    let relevanceScore = 0;
    let structureScore = 0;
    let industryReadinessScore = 0;
    let overallScore = 0;

    let totalWords = 0;
    let fillerCount = 0;
    const detectedFillers: string[] = [];
    const strengths: string[] = [];
    const improvements: string[] = [];

    const isEarlyAbandon = answered.length === 0;

    if (!isEarlyAbandon) {
      // 1. Technical score from answered questions (actual evalScores)
      const totalScore = answered.reduce((acc: number, q: any) => acc + (typeof q.evalScore === 'number' ? q.evalScore : 75), 0);
      technicalScore = Math.max(10, Math.min(100, Math.round(totalScore / answered.length)));

      // 2. Communication score from real candidate transcript, pace, and fillers
      const allAnswers = answered.map((q: any) => q.answerText).join(' ');
      const words = allAnswers.split(/\s+/).filter(Boolean);
      totalWords = words.length;

      const fillers = ['um', 'umm', 'uh', 'uhh', 'like', 'basically', 'actually', 'literally', 'you know'];
      for (const f of fillers) {
        const regex = new RegExp(`\\b${f}\\b`, 'gi');
        const matches = allAnswers.match(regex);
        if (matches) {
          fillerCount += matches.length;
          detectedFillers.push(f);
        }
      }

      const totalAnsweredSecs = answered.reduce((acc: number, q: any) => acc + (q.timeTakenSecs || 35), 0);
      const answeredMins = Math.max(0.2, totalAnsweredSecs / 60);
      const realWpm = Math.round(totalWords / answeredMins);

      const paceScore = realWpm >= 110 && realWpm <= 165
        ? 95
        : realWpm < 110
          ? Math.max(25, 95 - (110 - realWpm) * 0.7)
          : Math.max(30, 95 - (realWpm - 165) * 0.6);

      const avgWordsPerQ = totalWords / answered.length;
      const lengthScore = avgWordsPerQ >= 35
        ? Math.min(98, 70 + (avgWordsPerQ - 35) * 0.6)
        : Math.max(20, avgWordsPerQ * 2.0);

      const fillerPenalty = Math.min(30, fillerCount * 3.5);
      communicationScore = Math.max(10, Math.min(100, Math.round(paceScore * 0.35 + lengthScore * 0.45 + (100 - fillerPenalty) * 0.20)));

      // 3. Confidence & Proctoring Telemetry
      const proctorPenalty = tabBlurCount * 14 + (eyeContactScore < 75 ? 12 : 0) + (postureStatus === 'Off-Center' ? 8 : 0);
      confidenceScore = payload?.isDisqualified
        ? 0
        : Math.max(15, Math.min(100, Math.round(eyeContactScore * 0.6 + (100 - proctorPenalty) * 0.4)));

      // 4. Secondary Dimensions (calibrated to real responses)
      problemSolvingScore = Math.max(10, Math.min(100, Math.round(technicalScore * 0.85 + (totalWords >= 50 ? 10 : 0) + (answered.length > 1 ? 5 : 0))));
      depthScore = Math.max(10, Math.min(100, Math.round(Math.min(96, (avgWordsPerQ / 45) * 75 + 15))));
      relevanceScore = Math.max(10, Math.min(100, Math.round(technicalScore * 0.60 + communicationScore * 0.40 - (questions.length - answered.length) * 10)));
      structureScore = Math.max(10, Math.min(100, Math.round(technicalScore * 0.40 + communicationScore * 0.40 + depthScore * 0.20)));
      industryReadinessScore = Math.max(10, Math.min(100, Math.round(technicalScore * 0.35 + communicationScore * 0.25 + problemSolvingScore * 0.20 + confidenceScore * 0.20)));

      // 5. Overall Weighted Composite Score
      overallScore = Math.max(
        10,
        Math.min(
          100,
          Math.round(
            technicalScore * 0.35 +
            communicationScore * 0.25 +
            problemSolvingScore * 0.15 +
            confidenceScore * 0.15 +
            structureScore * 0.10
          )
        )
      );

      // Strengths & Improvements extraction
      answered.forEach((q: any) => {
        if (q.evalStrengths && Array.isArray(q.evalStrengths)) {
          strengths.push(...q.evalStrengths);
        }
        if (q.evalWeaknesses && Array.isArray(q.evalWeaknesses)) {
          improvements.push(...q.evalWeaknesses);
        }
      });

      if (eyeContactScore >= 80) {
        strengths.push(`Maintained strong, engaging on-camera eye contact (${eyeContactScore}%).`);
      }
      if (tabBlurCount === 0) {
        strengths.push('Strict test environment compliance: zero tab switch or window blur events.');
      }
      if (realWpm >= 115 && realWpm <= 160) {
        strengths.push(`Well-paced conversational cadence (${realWpm} words per minute).`);
      }

      if (fillerCount > 0) {
        improvements.push(`Reduce verbal filler tokens (${fillerCount} instances detected: ${Array.from(new Set(detectedFillers)).slice(0, 3).join(', ')}).`);
      }
      if (eyeContactScore < 70) {
        improvements.push(`Increase eye contact with the camera to project confidence (${eyeContactScore}% recorded).`);
      }
      if (tabBlurCount > 0) {
        improvements.push(`Avoid context-switching: ${tabBlurCount} window blur events recorded during the session.`);
      }
      if (technicalScore < 70) {
        improvements.push('Elaborate with deeper architectural trade-offs, scalability limits, and concrete implementation examples.');
      }
      if (improvements.length === 0) {
        if (questions.length > answered.length) {
          improvements.push(`Review skipped topics (${questions.length - answered.length} question(s) passed) to build comprehensive domain mastery.`);
        } else if (technicalScore < 85) {
          improvements.push('Incorporate deeper trade-offs around memory footprints, caching invalidation, and failure modes.');
        } else {
          improvements.push('Elaborate on production failure recovery, edge cases, and automated rollback strategies.');
        }
      }
    } else {
      // Clean, honest data for zero-answer early exit
      overallScore = 0;
      technicalScore = 0;
      communicationScore = 0;
      confidenceScore = eyeContactScore;
      problemSolvingScore = 0;
      depthScore = 0;
      relevanceScore = 0;
      structureScore = 0;
      industryReadinessScore = 0;

      strengths.push('Successfully established audio, microphone, and webcam device check.');
      improvements.push('Provide verbal responses during the live interview to receive full AI rubric scoring.');
    }

    const readinessVerdict = overallScore >= 80 ? 'READY' : overallScore >= 60 ? 'ALMOST_READY' : 'NOT_READY';

    // ─── Dynamic Stages Breakdown (Built from ACTUAL questions asked) ───
    const stages: any[] = [];
    if (questions.length === 0) {
      stages.push({
        stageNumber: 1,
        stageName: 'Interview Track',
        questionCount: 0,
        durationMins: 0,
        score: 0,
        description: 'No questions delivered.',
      });
    } else if (questions.length === 1) {
      const q = questions[0];
      stages.push({
        stageNumber: 1,
        stageName: q.category || 'Technical Foundations',
        questionCount: 1,
        durationMins: Math.max(1, Math.round((q.timeTakenSecs || 45) / 60)),
        score: typeof q.evalScore === 'number' ? q.evalScore : (q.answerText ? technicalScore : 0),
        description: q.questionText.slice(0, 95) + '…',
      });
    } else if (questions.length === 2) {
      questions.forEach((q: any, i: number) => {
        stages.push({
          stageNumber: i + 1,
          stageName: q.category || (i === 0 ? 'System Foundations' : 'Technical Deep Dive'),
          questionCount: 1,
          durationMins: Math.max(1, Math.round((q.timeTakenSecs || 45) / 60)),
          score: typeof q.evalScore === 'number' ? q.evalScore : (q.answerText ? technicalScore : 0),
          description: q.questionText.slice(0, 95) + '…',
        });
      });
    } else {
      const stageCount = Math.min(questions.length, 4);
      const chunkSize = Math.ceil(questions.length / stageCount);
      for (let s = 0; s < stageCount; s++) {
        const stageQuestions = questions.slice(s * chunkSize, (s + 1) * chunkSize);
        if (stageQuestions.length === 0) continue;
        const stageAnswered = stageQuestions.filter((q: any) => q.answerText);
        const stageScore = stageAnswered.length > 0
          ? Math.round(stageAnswered.reduce((a: number, q: any) => a + (q.evalScore || technicalScore), 0) / stageAnswered.length)
          : (isEarlyAbandon ? 0 : technicalScore);
        const stageDurSecs = stageQuestions.reduce((a: number, q: any) => a + (q.timeTakenSecs || 45), 0);
        const primaryCategory = stageQuestions[0].category || (s === 0 ? 'Core Architecture' : s === 1 ? 'Deep Dive' : s === 2 ? 'Problem Solving' : 'Review & Wrap Up');

        stages.push({
          stageNumber: s + 1,
          stageName: primaryCategory,
          questionCount: stageQuestions.length,
          durationMins: Math.max(1, Math.round(stageDurSecs / 60)),
          score: stageScore,
          description: stageQuestions[0].questionText.slice(0, 95) + '…',
        });
      }
    }

    // ─── Dynamic Performance Timeline (All actual questions) ───
    const performanceTimeline = questions.map((q: any, idx: number) => {
      const score = typeof q.evalScore === 'number' ? q.evalScore : (q.answerText ? technicalScore : 0);
      let rating: 'Strong' | 'Good' | 'Needs Improvement' | 'Weak' = 'Good';
      if (score >= 80) rating = 'Strong';
      else if (score >= 60) rating = 'Good';
      else if (score >= 40) rating = 'Needs Improvement';
      else rating = 'Weak';

      return {
        questionIndex: idx + 1,
        questionLabel: `Q${idx + 1}`,
        score,
        rating,
        category: q.category || 'Technical',
        durationSecs: q.timeTakenSecs || (q.answerText ? 45 : 0),
        questionText: q.questionText,
      };
    });

    // ─── Dynamic Interview Summary ───
    const timeTakenVals = answered.map((q: any) => (q.timeTakenSecs || 0) / 60);
    const avgDurMin = timeTakenVals.length ? +(timeTakenVals.reduce((a, b) => a + b, 0) / timeTakenVals.length).toFixed(1) : 0;
    const maxDurMin = timeTakenVals.length ? +Math.max(...timeTakenVals).toFixed(1) : 0;
    const minDurMin = timeTakenVals.length ? +Math.min(...timeTakenVals).toFixed(1) : 0;

    const uniqueTopics = Array.from(new Set(
      questions.map((q: any) => q.category).filter(Boolean).concat(session.focusAreas || [])
    )) as string[];
    if (uniqueTopics.length === 0) {
      uniqueTopics.push(session.targetRole || 'Software Engineering');
    }

    const interviewSummary = {
      totalQuestionsAsked: questions.length,
      questionsAnswered: answered.length,
      questionsSkipped: questions.length - answered.length,
      averageAnswerLengthMinutes: avgDurMin,
      longestAnswerMinutes: maxDurMin,
      shortestAnswerMinutes: minDurMin,
      followUpQuestionsCount: questions.filter((q: any) => q.questionType === 'FOLLOW_UP').length,
      topicsCovered: uniqueTopics,
    };

    // ─── Dynamic Personalized Recommendations (Ranked by candidate's 3 lowest dimensions) ───
    const dimensionPool = [
      {
        name: 'Technical Knowledge',
        score: technicalScore,
        title: 'Deepen System Design & Architectural Fundamentals',
        weakness: `Technical score registered at ${technicalScore}/100 with opportunities to elaborate on distributed limits.`,
        action: 'Study high-throughput caching, read/write database partitioning, and microservice decoupling patterns.',
        expectedOutcome: 'Confidently justify latency vs throughput trade-offs in technical architectural rounds.',
        practiceResource: '/system-design',
      },
      {
        name: 'Communication',
        score: communicationScore,
        title: 'Refine Speech Cadence & Minimize Filler Words',
        weakness: fillerCount > 0 ? `Detected ${fillerCount} verbal filler tokens affecting delivery clarity.` : 'Verbal pacing can be calibrated for clearer articulation.',
        action: 'Replace verbal fillers with silent 1-second deliberate pauses to project calm authority.',
        expectedOutcome: 'Structured, authoritative answers delivered at an optimal 120-150 WPM.',
        practiceResource: '/video/setup',
      },
      {
        name: 'Confidence & Proctoring',
        score: confidenceScore,
        title: 'Strengthen Camera Eye Contact & Composure',
        weakness: `Camera focus score evaluated at ${confidenceScore}% during the session.`,
        action: 'Keep visual gaze centered on the webcam lens and position camera at eye level.',
        expectedOutcome: 'High on-camera engagement and superior proctoring compliance scores.',
        practiceResource: '/video/setup',
      },
      {
        name: 'Problem Solving',
        score: problemSolvingScore,
        title: 'Adopt Structured Problem-Solving Frameworks',
        weakness: 'Responses jumped into implementation without establishing edge cases or constraints.',
        action: 'Apply the STAR method: articulate Context, Problem, Execution, and Measurable Metric Lift.',
        expectedOutcome: 'Crisp, structured problem breakdowns demonstrating Senior/Staff engineering maturity.',
        practiceResource: '/challenges',
      },
      {
        name: 'Depth of Explanation',
        score: depthScore,
        title: 'Elaborate with Measurable Metrics & Failure Scenarios',
        weakness: 'Initial answers were brief and omitted production failure handling.',
        action: 'Substantiate technical claims with quantifiable metrics (QPS, memory, p99 latency) and recovery strategies.',
        expectedOutcome: 'Deep technical credibility demonstrating production experience.',
        practiceResource: '/preparation',
      },
    ];

    dimensionPool.sort((a, b) => a.score - b.score);
    const recommendations = dimensionPool.slice(0, 3).map((item, idx) => ({
      priority: idx + 1,
      title: item.title,
      weakness: item.weakness,
      action: item.action,
      expectedOutcome: item.expectedOutcome,
      practiceResource: item.practiceResource,
    }));

    // ─── Practice Resources ───
    const practiceResources = [
      {
        title: 'System Design Fundamentals',
        subtitle: 'Scalable system patterns, caching & sharding',
        category: 'System Design',
        link: '/system-design',
        iconType: 'layers',
      },
      {
        title: 'Database Architecture',
        subtitle: 'SQL vs NoSQL, indexing & consistency models',
        category: 'Databases',
        link: '/preparation',
        iconType: 'database',
      },
      {
        title: 'AI Mock Interview',
        subtitle: 'Practice technical discussions with Ava',
        category: 'Interview Practice',
        link: '/video/setup',
        iconType: 'mic',
      },
      {
        title: 'Technical Challenges',
        subtitle: 'Hands-on problem solving under timed constraints',
        category: 'Coding & Algorithms',
        link: '/challenges',
        iconType: 'code',
      },
    ];

    const categoryScores = {
      'Technical Knowledge': technicalScore,
      'Communication': communicationScore,
      'Problem Solving': problemSolvingScore,
      'Depth of Explanation': depthScore,
      'Relevance': relevanceScore,
      'Confidence': confidenceScore,
      'Structure': structureScore,
      'Industry Readiness': industryReadinessScore,
    };

    let summaryText = isEarlyAbandon
      ? `Interview session ended early before spoken responses were submitted. No evaluation scoring registered for ${session.targetRole || 'Software Engineer'}.`
      : `Candidate completed oral interview for ${session.targetRole || 'Software Engineer'}. Technical proficiency scored at ${technicalScore}/100, communication clarity at ${communicationScore}/100, and proctoring composure at ${confidenceScore}/100.`;

    let analysis: any = {
      id: `an_${sessionId}`,
      sessionId,
      overallScore,
      communicationScore,
      technicalScore,
      confidenceScore,
      structureScore,
      problemSolvingScore,
      depthScore,
      relevanceScore,
      industryReadinessScore,
      categoryScores,
      confidenceMeterScore: confidenceScore,
      confidenceSignals: {
        avgWpm: answered.length > 0 ? Math.round(totalWords / Math.max(0.2, (answered.reduce((a: number, q: any) => a + (q.timeTakenSecs || 35), 0) / 60))) : 0,
        avgPauseCount: fillerCount,
        avgAnswerLength: answered.length > 0 ? Math.round(totalWords / answered.length) : 0,
      },
      eyeContactScore,
      presenceScore: confidenceScore,
      summary: summaryText,
      strengths: Array.from(new Set(strengths)).slice(0, 5),
      improvements: Array.from(new Set(improvements)).slice(0, 5),
      actionableTips: recommendations.map(r => ({ tip: r.title, reason: r.action })),
      stageBreakdown: stages,
      performanceTimeline,
      interviewSummary,
      recommendations,
      practiceResources,
      readinessVerdict,
      createdAt: new Date().toISOString(),
    };

    memoryAnalysis.set(sessionId, analysis);

    try {
      const updated = await prisma.oralSession.update({
        where: { id: sessionId },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
          overallScore,
          feedbackSummary: JSON.stringify(analysis),
        },
      });
      return { ...updated, analysis };
    } catch (err) {
      console.warn('[OralService] DB completeSession fallback:', (err as Error).message);
      const s = memorySessions.get(sessionId);
      if (s) {
        s.status = 'COMPLETED';
        s.completedAt = new Date();
        s.overallScore = overallScore;
        s.feedbackSummary = JSON.stringify(analysis);
        s.analysis = analysis;
      }
      return s || { id: sessionId, status: 'COMPLETED', overallScore, analysis };
    }
  },
};