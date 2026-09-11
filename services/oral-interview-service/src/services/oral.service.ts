import { prisma } from '../lib/prisma.js';
import { NotFoundError } from '../lib/errors.js';
import { v4 as uuidv4 } from 'uuid';

const memorySessions = new Map<string, any>();
const memoryQuestions = new Map<string, any[]>();
const memoryChatHistory = new Map<string, any[]>();

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

  async submitAnswer(sessionId: string, userId: string, questionId: string, answerText: string, timeTaken: number) {
    try {
      const updatedQuestion = await prisma.oralQuestion.update({
        where: { id: questionId },
        data: {
          answerText,
          answeredAt: new Date(),
          timeTakenSecs: timeTaken,
        },
      });

      await prisma.oralChatHistory.create({
        data: {
          sessionId,
          role: 'user',
          content: answerText,
        },
      });

      return updatedQuestion;
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

      const history = memoryChatHistory.get(sessionId) || [];
      history.push({ role: 'user', content: answerText, timestamp: new Date() });
      memoryChatHistory.set(sessionId, history);

      return q;
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

      if (dbSession) return dbSession;
    } catch (err) {
      console.warn('[OralService] DB getSession fallback:', (err as Error).message);
    }

    const memSession = memorySessions.get(sessionId);
    if (memSession) {
      return {
        ...memSession,
        questions: memoryQuestions.get(sessionId) || [],
        chatHistory: memoryChatHistory.get(sessionId) || [],
      };
    }

    // Auto construct active fallback session if requested
    const autoSession = {
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
      const nextOrder = existingCount + 1;
      const role = session.targetRole || 'Software Engineer';
      const roleLower = role.toLowerCase();

      const questionMatrix: Record<string, string[]> = {
        frontend: [
          `Walk me through how you optimize Web Vitals (LCP, CLS, INP) for a high-traffic ${role} application.`,
          'How do you manage complex client-side state across deeply nested component hierarchies without triggering cascading re-renders?',
          'Explain your strategy for client-side caching, service workers, and offline resilience in modern Web apps.',
          'How do you defend against XSS, CSRF, and third-party script vulnerabilities in frontend architectures?',
        ],
        backend: [
          `How do you design database indexing and partitioning strategies for a ${role} backend facing heavy write traffic?`,
          'Walk me through your design for a resilient distributed locking mechanism across microservices.',
          'How do you prevent data inconsistency and handle eventual consistency in event-driven architectures using Kafka or RabbitMQ?',
          'Explain how you implement zero-downtime database schema migrations on a live production table with millions of rows.',
        ],
        fullstack: [
          `Walk me through the end-to-end data pipeline from the browser event to the database transaction in a ${role} system.`,
          'How do you balance server-side rendering (SSR) vs client-side hydration for dynamic data-heavy platforms?',
          'Explain your approach to rate-limiting, API gateway management, and token authentication at scale.',
          'How do you structure microservices or modular monoliths to maintain clean separation of concerns?',
        ],
        general: [
          `Could you describe a challenging technical architecture problem you solved recently for ${role}?`,
          `How do you handle performance optimization and architectural trade-offs when building scalable applications?`,
          `Can you explain your approach to automated testing and ensuring code reliability in production?`,
          `How do you handle cross-functional technical disagreements and conflicting system requirements?`,
        ]
      };

      let category = 'general';
      if (/front|react|vue|angular|js|ts|ui/i.test(roleLower)) category = 'frontend';
      else if (/back|node|spring|java|python|go|golang|postgres|sql/i.test(roleLower)) category = 'backend';
      else if (/full/i.test(roleLower)) category = 'fullstack';

      const pool = questionMatrix[category] || questionMatrix.general;
      const hash = (sessionId || 'seed').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const selectedIdx = (hash + (nextOrder - 1) * 7) % pool.length;
      const promptText = pool[selectedIdx];

      return await prisma.oralQuestion.create({
        data: {
          sessionId,
          orderIndex: nextOrder,
          questionText: promptText,
          questionType: 'TECHNICAL',
          difficulty: 'MEDIUM',
          evalStrengths: [],
          evalWeaknesses: [],
        },
      });
    } catch (err) {
      console.warn('[OralService] DB getNextQuestion fallback:', (err as Error).message);
      const questions = memoryQuestions.get(sessionId) || [];
      const nextOrder = questions.length + 1;
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
      return newQ;
    }
  },

  async completeSession(sessionId: string, userId: string) {
    try {
      return await prisma.oralSession.update({
        where: { id: sessionId },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
        },
      });
    } catch (err) {
      console.warn('[OralService] DB completeSession fallback:', (err as Error).message);
      const s = memorySessions.get(sessionId);
      if (s) {
        s.status = 'COMPLETED';
        s.completedAt = new Date();
      }
      return s || { id: sessionId, status: 'COMPLETED' };
    }
  },
};
