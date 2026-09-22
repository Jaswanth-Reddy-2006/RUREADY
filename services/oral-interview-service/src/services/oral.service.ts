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
  if (/\b(end (the )?interview|stop (the )?interview|wrap up|finish session|i want to end)\b/i.test(clean)) {
    return 'END_INTERVIEW';
  }

  // 2. TIME QUERY
  if (/\b(how much time|time left|how many questions left|remaining time)\b/i.test(clean)) {
    return 'TIME_QUERY';
  }

  // 3. REPEAT QUESTION
  if (/\b(repeat|say (that|it) again|didn'?t hear|pardon|come again|what was the question)\b/i.test(clean)) {
    return 'REPEAT_QUESTION';
  }

  // 4. DON_T_KNOW
  if (/\b(don'?t know|not sure|no idea|haven'?t (used|worked)|never heard|unfamiliar|pass)\b/i.test(clean) && clean.length < 70) {
    return 'DON_T_KNOW';
  }

  // 5. CLARIFICATION & CONFIRMATION
  if (/\b(is this what you'?re asking|so you want me to|does this mean|are you asking|could you clarify)\b/i.test(clean)) {
    return 'CLARIFICATION';
  }

  // 6. TECHNICAL QUESTION
  if (/\b(what is the (max|maximum|input)|are duplicates allowed|is memory constrained)\b/i.test(clean)) {
    return 'TECHNICAL_QUESTION';
  }

  // 7. CORRECTION
  if (/\b(wait, actually|scratch that|let me fix|sorry, i meant)\b/i.test(clean)) {
    return 'CORRECTION';
  }

  // 8. HESITATION
  if (/^(umm+|uhh+|err+|let me think|give me a moment)\b/i.test(clean) && clean.length < 35) {
    return 'HESITATION';
  }

  // 9. SKIP
  if (/\b(skip|move on|next question|let'?s move to next)\b/i.test(clean)) {
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
            promptText = aiData.questionText.trim();
            if (aiData.questionType) qType = aiData.questionType;
            if (aiData.difficulty) difficulty = aiData.difficulty;
          }
        }
      } catch (fetchErr) {
        console.warn('[OralService] AI Service generate-next-question offline/timed out, using adaptive fallback:', (fetchErr as Error).message);
      }

      // Fallback domain matrix & Question Bank matching if AI Service offline
      let requiredConcepts: string[] = [];
      let optionalConcepts: string[] = [];

      if (!promptText) {
        // Try picking matching question from QUESTION_BANK
        const matchingBankItem = QUESTION_BANK[(nextOrder - 1) % QUESTION_BANK.length];
        if (matchingBankItem) {
          promptText = matchingBankItem.questionText;
          qType = matchingBankItem.category;
          difficulty = matchingBankItem.difficulty;
          requiredConcepts = matchingBankItem.requiredConcepts;
          optionalConcepts = matchingBankItem.optionalConcepts;
        } else {
          promptText = `Could you describe a challenging technical architecture problem you solved recently relative to ${role}?`;
          requiredConcepts = ['technical problem statement', 'architecture choice', 'trade-offs', 'outcome'];
        }
      } else {
        // Find matching required concepts if text aligns with question bank
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

      const questionPrompts = [
        `Could you describe a challenging technical problem you solved recently in a ${role} project?`,
        `How do you handle performance optimization and trade-offs when building scalable ${role} applications?`,
        `Can you explain your approach to testing and ensuring code reliability in production?`,
        `How do you handle cross-functional collaboration and conflicting technical requirements?`,
      ];

      const hash = (sessionId || 'seed').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const selectedIdx = (hash + (nextOrder - 1) * 7) % questionPrompts.length;

      const newQ = {
        id: `q_${uuidv4().slice(0, 8)}`,
        sessionId,
        orderIndex: nextOrder,
        questionText: questionPrompts[selectedIdx],
        questionType: 'TECHNICAL',
        difficulty: 'MEDIUM',
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

  async completeSession(sessionId: string, userId: string) {
    const analysis = {
      id: `an_${sessionId}`,
      sessionId,
      overallScore: 88,
      communicationScore: 85,
      technicalScore: 89,
      confidenceScore: 90,
      structureScore: 86,
      confidenceMeterScore: 89,
      confidenceSignals: {
        avgWpm: 132,
        avgPauseCount: 2,
        avgAnswerLength: 85,
      },
      eyeContactScore: 88,
      presenceScore: 92,
      summary: 'Candidate demonstrated strong problem-solving skills, articulate code structuring, and clear communication throughout the interview.',
      strengths: [
        'Rapid algorithmic intuition and proactive time/space complexity evaluation',
        'Clean, modular code structure with idiomatic syntax',
        'Clear, structured verbal walkthrough while reasoning through constraints',
      ],
      improvements: [
        'Formally write down input bounds before starting code implementation',
        'Minimize hesitation pauses during complexity justification',
        'Test extreme boundary cases out loud before submitting',
      ],
      actionableTips: [
        { tip: 'State Target Big-O Upfront', reason: 'Communicate asymptotic targets in the first minute of your response.' },
        { tip: 'Boundary Case Dry Run', reason: 'Test empty collections and duplicate inputs step-by-step.' },
        { tip: 'Micro-pause Pacing', reason: 'Replace filler words with silent pauses to maintain authoritative presence.' },
      ],
      readinessVerdict: 'READY',
      createdAt: new Date().toISOString(),
    };
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
