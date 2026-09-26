// ═══════════════════════════════════════════════════════════════
// RU Ready? — System Design Service Implementation
// Session lifecycle, state persistence, capacity & validation coordination
// ═══════════════════════════════════════════════════════════════

import { prisma } from '../lib/prisma.js';
import { SYSTEM_DESIGN_PROBLEMS, SystemDesignProblemDefinition } from '../data/systemDesignProblems.data.js';
import { calculateCapacity, CapacityInputs, CapacityOutputs } from '../engine/capacityEngine.js';
import { validateArchitecture, CanvasGraph, ValidationReport } from '../engine/validatorEngine.js';
import { AIInterviewerService, ChatMessage, SystemDesignEvaluationReport } from './aiInterviewer.service.js';

export interface SystemDesignSessionState {
  id: string;
  userId: string;
  userName?: string;
  problemId: string;
  problem: SystemDesignProblemDefinition;
  stage: number;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';
  durationSeconds: number;
  graphData: CanvasGraph;
  capacityInputs: CapacityInputs;
  capacityOutputs?: CapacityOutputs;
  validationState: ValidationReport;
  transcript: ChatMessage[];
  score?: number;
  evaluation?: SystemDesignEvaluationReport;
  createdAt: string;
  updatedAt: string;
}

// In-memory fallback map if PostgreSQL database is undergoing cold-boot
const inMemorySessions = new Map<string, SystemDesignSessionState>();

export class SystemDesignService {
  /**
   * Get all problems with optional difficulty & category filter
   */
  static async getProblems(filter?: { difficulty?: string; category?: string }): Promise<SystemDesignProblemDefinition[]> {
    let list = [...SYSTEM_DESIGN_PROBLEMS];
    if (filter?.difficulty) {
      list = list.filter((p) => p.difficulty.toUpperCase() === filter.difficulty?.toUpperCase());
    }
    if (filter?.category) {
      list = list.filter((p) => p.category.toUpperCase() === filter.category?.toUpperCase());
    }
    return list;
  }

  /**
   * Get problem details by slug or ID
   */
  static async getProblemBySlugOrId(identifier: string): Promise<SystemDesignProblemDefinition | null> {
    const found = SYSTEM_DESIGN_PROBLEMS.find((p) => p.slug === identifier || p.id === identifier);
    return found || null;
  }

  /**
   * Create or resume a system design interview session
   */
  static async createSession(userId: string, problemId: string, userName?: string): Promise<SystemDesignSessionState> {
    const problem = await this.getProblemBySlugOrId(problemId);
    if (!problem) {
      throw new Error(`System Design Problem not found: ${problemId}`);
    }

    const initialCapacityInputs: CapacityInputs = {
      dau: problem.trafficDefaults.dau,
      readsPerUserPerDay: problem.trafficDefaults.readsPerUserPerDay,
      writesPerUserPerDay: problem.trafficDefaults.writesPerUserPerDay,
      avgReadPayloadBytes: problem.trafficDefaults.avgReadPayloadBytes,
      avgWritePayloadBytes: problem.trafficDefaults.avgWritePayloadBytes,
      peakMultiplier: problem.trafficDefaults.peakMultiplier,
      retentionYears: problem.trafficDefaults.retentionYears,
      replicationFactor: problem.trafficDefaults.replicationFactor,
    };

    const initialCapacityOutputs = calculateCapacity(initialCapacityInputs);
    const initialGraph: CanvasGraph = {
      nodes: [
        {
          id: 'node_client',
          type: 'archNode',
          position: { x: 80, y: 200 },
          data: { label: 'Web & Mobile Clients', category: 'TRAFFIC', subType: 'client_app' },
        },
      ],
      edges: [],
    };

    const initialValidation = validateArchitecture(
      initialGraph,
      initialCapacityOutputs.peakWriteQps,
      initialCapacityOutputs.peakReadQps
    );

    const openingGreeting = AIInterviewerService.getOpeningGreeting(problem);
    const sessionId = `sd_sess_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    const sessionState: SystemDesignSessionState = {
      id: sessionId,
      userId,
      userName: userName || 'Candidate',
      problemId: problem.id,
      problem,
      stage: 1,
      status: 'IN_PROGRESS',
      durationSeconds: 0,
      graphData: initialGraph,
      capacityInputs: initialCapacityInputs,
      capacityOutputs: initialCapacityOutputs,
      validationState: initialValidation,
      transcript: [openingGreeting],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Store in-memory
    inMemorySessions.set(sessionId, sessionState);

    // Persist to Postgres if available
    try {
      await prisma.systemDesignSession.create({
        data: {
          id: sessionId,
          userId,
          userName: sessionState.userName,
          problemId: problem.id,
          title: problem.title,
          stage: 1,
          status: 'IN_PROGRESS',
          durationSeconds: 0,
          graphData: initialGraph as any,
          capacityInputs: initialCapacityInputs as any,
          capacityOutputs: initialCapacityOutputs as any,
          validationState: initialValidation as any,
          transcript: [openingGreeting] as any,
        },
      });
    } catch (e) {
      console.warn('[SystemDesignService] Prisma create fallback to memory:', (e as Error).message);
    }

    return sessionState;
  }

  /**
   * Get an existing session by ID
   */
  static async getSession(sessionId: string, userId: string): Promise<SystemDesignSessionState | null> {
    if (inMemorySessions.has(sessionId)) {
      return inMemorySessions.get(sessionId)!;
    }

    try {
      const dbSession = await prisma.systemDesignSession.findUnique({
        where: { id: sessionId },
      });
      if (dbSession) {
        const problem = await this.getProblemBySlugOrId(dbSession.problemId);
        if (!problem) return null;

        const state: SystemDesignSessionState = {
          id: dbSession.id,
          userId: dbSession.userId,
          userName: dbSession.userName || 'Candidate',
          problemId: dbSession.problemId,
          problem,
          stage: dbSession.stage,
          status: dbSession.status as any,
          durationSeconds: dbSession.durationSeconds,
          graphData: dbSession.graphData as any,
          capacityInputs: dbSession.capacityInputs as any,
          capacityOutputs: dbSession.capacityOutputs as any,
          validationState: dbSession.validationState as any,
          transcript: dbSession.transcript as any,
          score: dbSession.score || undefined,
          evaluation: dbSession.evaluation as any,
          createdAt: dbSession.createdAt.toISOString(),
          updatedAt: dbSession.updatedAt.toISOString(),
        };

        inMemorySessions.set(sessionId, state);
        return state;
      }
    } catch (e) {
      console.warn('[SystemDesignService] Prisma getSession error:', (e as Error).message);
    }

    return null;
  }

  /**
   * Save canvas graph updates and trigger auto-validation
   */
  static async saveGraph(sessionId: string, userId: string, graph: CanvasGraph): Promise<ValidationReport> {
    const session = await this.getSession(sessionId, userId);
    if (!session) throw new Error('Session not found');

    const peakWrite = session.capacityOutputs?.peakWriteQps || 2500;
    const peakRead = session.capacityOutputs?.peakReadQps || 10000;
    const validation = validateArchitecture(graph, peakWrite, peakRead);

    session.graphData = graph;
    session.validationState = validation;
    session.updatedAt = new Date().toISOString();

    inMemorySessions.set(sessionId, session);

    try {
      await prisma.systemDesignSession.update({
        where: { id: sessionId },
        data: {
          graphData: graph as any,
          validationState: validation as any,
          updatedAt: new Date(),
        },
      });
    } catch {
      // ignore
    }

    return validation;
  }

  /**
   * Run capacity calculations and save
   */
  static async updateCapacity(sessionId: string, userId: string, inputs: CapacityInputs): Promise<CapacityOutputs> {
    const session = await this.getSession(sessionId, userId);
    if (!session) throw new Error('Session not found');

    const outputs = calculateCapacity(inputs);
    session.capacityInputs = inputs;
    session.capacityOutputs = outputs;

    // Re-run validation with updated QPS numbers
    const validation = validateArchitecture(session.graphData, outputs.peakWriteQps, outputs.peakReadQps);
    session.validationState = validation;
    session.updatedAt = new Date().toISOString();

    inMemorySessions.set(sessionId, session);

    try {
      await prisma.systemDesignSession.update({
        where: { id: sessionId },
        data: {
          capacityInputs: inputs as any,
          capacityOutputs: outputs as any,
          validationState: validation as any,
          updatedAt: new Date(),
        },
      });
    } catch {
      // ignore
    }

    return outputs;
  }

  /**
   * Send candidate message to AI interviewer
   */
  static async sendChatMessage(sessionId: string, userId: string, messageText: string): Promise<ChatMessage> {
    const session = await this.getSession(sessionId, userId);
    if (!session) throw new Error('Session not found');

    const userMessage: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'candidate',
      content: messageText,
      timestamp: new Date().toISOString(),
      stage: session.stage,
    };

    session.transcript.push(userMessage);

    const { message: aiReply, nextStage } = await AIInterviewerService.generateDialogueResponse({
      problem: session.problem,
      stage: session.stage,
      userMessage: messageText,
      graph: session.graphData,
      capacityOutputs: session.capacityOutputs,
      validationReport: session.validationState,
      transcript: session.transcript,
    });

    if (nextStage) {
      session.stage = nextStage;
    }

    session.transcript.push(aiReply);
    session.updatedAt = new Date().toISOString();

    inMemorySessions.set(sessionId, session);

    try {
      await prisma.systemDesignSession.update({
        where: { id: sessionId },
        data: {
          stage: session.stage,
          transcript: session.transcript as any,
          updatedAt: new Date(),
        },
      });
    } catch {
      // ignore
    }

    return aiReply;
  }

  /**
   * Complete interview session and generate 11-dimension evaluation report
   */
  static async finishSession(sessionId: string, userId: string, durationSeconds: number): Promise<SystemDesignEvaluationReport> {
    const session = await this.getSession(sessionId, userId);
    if (!session) throw new Error('Session not found');

    const evaluation = AIInterviewerService.generateEvaluationReport({
      problem: session.problem,
      graph: session.graphData,
      capacityOutputs: session.capacityOutputs,
      validationReport: session.validationState,
      transcript: session.transcript,
      durationSeconds: durationSeconds || session.durationSeconds || 600,
    });

    session.status = 'COMPLETED';
    session.durationSeconds = durationSeconds;
    session.score = evaluation.overallScore;
    session.evaluation = evaluation;
    session.updatedAt = new Date().toISOString();

    inMemorySessions.set(sessionId, session);

    try {
      await prisma.systemDesignSession.update({
        where: { id: sessionId },
        data: {
          status: 'COMPLETED',
          durationSeconds,
          score: evaluation.overallScore,
          evaluation: evaluation as any,
          updatedAt: new Date(),
        },
      });
    } catch {
      // ignore
    }

    return evaluation;
  }

  /**
   * Get user session history
   */
  static async getUserHistory(userId: string): Promise<SystemDesignSessionState[]> {
    const memList = Array.from(inMemorySessions.values()).filter((s) => s.userId === userId);
    try {
      const dbList = await prisma.systemDesignSession.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });

      if (dbList.length > 0) {
        return dbList.map((dbSession) => {
          const problem = SYSTEM_DESIGN_PROBLEMS.find((p) => p.id === dbSession.problemId) || SYSTEM_DESIGN_PROBLEMS[0];
          return {
            id: dbSession.id,
            userId: dbSession.userId,
            userName: dbSession.userName || 'Candidate',
            problemId: dbSession.problemId,
            problem,
            stage: dbSession.stage,
            status: dbSession.status as any,
            durationSeconds: dbSession.durationSeconds,
            graphData: dbSession.graphData as any,
            capacityInputs: dbSession.capacityInputs as any,
            capacityOutputs: dbSession.capacityOutputs as any,
            validationState: dbSession.validationState as any,
            transcript: dbSession.transcript as any,
            score: dbSession.score || undefined,
            evaluation: dbSession.evaluation as any,
            createdAt: dbSession.createdAt.toISOString(),
            updatedAt: dbSession.updatedAt.toISOString(),
          };
        });
      }
    } catch {
      // fallback
    }

    return memList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}
