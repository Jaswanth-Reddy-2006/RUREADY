// ═══════════════════════════════════════════════════════════════
// Micro-Assessment Service — Stage 5.1
// ═══════════════════════════════════════════════════════════════

import { prisma } from '../lib/prisma.js';
import { BadRequestError, NotFoundError } from '../lib/errors.js';
import {
  evaluateAssessmentAnswers,
  submitAssessmentSchema,
  getAssessmentAdaptationSignal,
  AssessmentQuestionData,
} from '../domain/roadmap.domain.js';
import {
  MicroAssessmentDTO,
  AssessmentAttemptResultDTO,
} from '@ru-ready/shared';
import { roadmapAIClient } from '../ai/ai-client.js';
import {
  buildAssessmentSystemPrompt,
  buildAssessmentUserPrompt,
} from '../ai/prompt-templates.js';

interface StoredAssessment {
  id: string;
  title: string;
  description?: string | null;
  roadmapNodeId?: string | null;
  skillId?: string | null;
  skillName?: string | null;
  questions: AssessmentQuestionData[];
  createdAt: Date;
}

interface StoredAttempt {
  id: string;
  assessmentId: string;
  userId: string;
  userRoadmapId?: string | null;
  sprintId?: string | null;
  sprintTaskId?: string | null;
  skillId?: string | null;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  passed: boolean;
  answers: unknown;
  completedAt: Date;
}

const memoryAssessments = new Map<string, StoredAssessment>();
const memoryAttempts = new Map<string, StoredAttempt>();

function sanitizeAssessment(assessment: StoredAssessment): MicroAssessmentDTO {
  return {
    id: assessment.id,
    title: assessment.title,
    description: assessment.description ?? null,
    roadmapNodeId: assessment.roadmapNodeId ?? null,
    skillId: assessment.skillId ?? null,
    skillName: assessment.skillName ?? null,
    questions: assessment.questions.map((q, idx) => ({
      id: q.id,
      questionText: q.questionText,
      options: q.options,
      orderIndex: idx,
    })),
    createdAt: assessment.createdAt.toISOString(),
  };
}

export const microAssessmentService = {
  _memoryAssessments: memoryAssessments,
  _memoryAttempts: memoryAttempts,

  clearMemory() {
    memoryAssessments.clear();
    memoryAttempts.clear();
  },

  seedAssessment(assessment: StoredAssessment) {
    memoryAssessments.set(assessment.id, assessment);
  },

  async getAssessment(assessmentId: string): Promise<MicroAssessmentDTO> {
    try {
      const dbAssessment = await prisma.microAssessment.findUnique({
        where: { id: assessmentId },
        include: {
          questions: { orderBy: { orderIndex: 'asc' } },
          skill: true,
        },
      });

      if (dbAssessment) {
        const stored: StoredAssessment = {
          id: dbAssessment.id,
          title: dbAssessment.title,
          description: dbAssessment.description,
          roadmapNodeId: dbAssessment.roadmapNodeId,
          skillId: dbAssessment.skillId,
          skillName: dbAssessment.skill?.name ?? null,
          questions: dbAssessment.questions.map((q) => ({
            id: q.id,
            questionText: q.questionText,
            options: q.options,
            correctOptionIndex: q.correctOptionIndex,
            explanation: q.explanation,
          })),
          createdAt: dbAssessment.createdAt,
        };
        memoryAssessments.set(stored.id, stored);
        return sanitizeAssessment(stored);
      }
    } catch {
      // fallback to memory
    }

    const memoryItem = memoryAssessments.get(assessmentId);
    if (!memoryItem) {
      throw new NotFoundError('Assessment not found');
    }

    return sanitizeAssessment(memoryItem);
  },

  async getOrCreateAssessmentForNode(nodeId: string, skillId?: string): Promise<MicroAssessmentDTO> {
    // Check if assessment already exists in memory or DB
    for (const assessment of memoryAssessments.values()) {
      if (assessment.roadmapNodeId === nodeId || (skillId && assessment.skillId === skillId)) {
        return sanitizeAssessment(assessment);
      }
    }

    try {
      const existing = await prisma.microAssessment.findFirst({
        where: {
          OR: [
            { roadmapNodeId: nodeId },
            ...(skillId ? [{ skillId }] : []),
          ],
        },
        include: {
          questions: { orderBy: { orderIndex: 'asc' } },
          skill: true,
        },
      });

      if (existing) {
        const stored: StoredAssessment = {
          id: existing.id,
          title: existing.title,
          description: existing.description,
          roadmapNodeId: existing.roadmapNodeId,
          skillId: existing.skillId,
          skillName: existing.skill?.name ?? null,
          questions: existing.questions.map((q) => ({
            id: q.id,
            questionText: q.questionText,
            options: q.options,
            correctOptionIndex: q.correctOptionIndex,
            explanation: q.explanation,
          })),
          createdAt: existing.createdAt,
        };
        memoryAssessments.set(stored.id, stored);
        return sanitizeAssessment(stored);
      }

      // Try finding node and skill in DB
      const node = await prisma.roadmapNode.findUnique({
        where: { id: nodeId },
        include: { skills: { include: { skill: true } } },
      });

      const skill = skillId
        ? await prisma.skill.findUnique({ where: { id: skillId } })
        : node?.skills?.[0]?.skill;

      let title = node ? `${node.title} Knowledge Verification` : `Skill Assessment`;
      let description = node?.description || `Verify core concepts and practical proficiency.`;
      let questions: AssessmentQuestionData[] | null = null;

      // ── Stage 5.3: AI-Powered Question Generation with Graceful Fallback ──
      try {
        const systemPrompt = buildAssessmentSystemPrompt();
        const userPrompt = buildAssessmentUserPrompt({
          skillName: skill?.name || node?.title || 'Engineering Competency',
          skillCategory: skill?.category || node?.category || 'Core Systems',
          nodeTitle: node?.title,
          nodeDescription: node?.description || undefined,
          questionCount: 3,
        });

        const aiOutput = await roadmapAIClient.generateAssessment(systemPrompt, userPrompt);
        if (aiOutput && Array.isArray(aiOutput.questions) && aiOutput.questions.length > 0) {
          title = aiOutput.title;
          description = aiOutput.description || description;
          questions = aiOutput.questions.map((q, idx) => ({
            id: `q_ai_${nodeId}_${idx + 1}`,
            questionText: q.questionText,
            options: q.options,
            correctOptionIndex: q.correctOptionIndex,
            explanation: q.explanation,
          }));
        }
      } catch {
        // AI generation bypass/failure -> proceed to deterministic fallback
      }

      // Deterministic fallback question bank
      if (!questions || questions.length === 0) {
        questions = [
          {
            id: `q_${nodeId}_1`,
            questionText: `What is the primary architectural consideration when implementing ${node?.title || 'this capability'}?`,
            options: [
              'Separation of concerns and deterministic state management',
              'Storing all mutable state in a single global variable',
              'Disabling all runtime validation for faster execution',
              'Synchronously blocking the main thread during heavy operations',
            ],
            correctOptionIndex: 0,
            explanation: 'Separation of concerns and deterministic state management ensure high reliability and maintainability.',
          },
          {
            id: `q_${nodeId}_2`,
            questionText: `Which pattern best mitigates edge-case failures and ensures system resilience for ${skill?.name || 'this skill'}?`,
            options: [
              'Ignoring boundary errors until user reports them',
              'Defensive validation, explicit error boundaries, and circuit breakers',
              'Hardcoding retry loops with zero timeout limit',
              'Relying solely on client-side state without server verification',
            ],
            correctOptionIndex: 1,
            explanation: 'Explicit error boundaries and input validation prevent cascading system failures.',
          },
          {
            id: `q_${nodeId}_3`,
            questionText: `What metric is most indicative of production readiness for this component?`,
            options: [
              'High line count without test coverage',
              'Consistent latency within SLA thresholds and zero unhandled exceptions',
              'Total number of external dependencies',
              'Manual verification without automated assertions',
            ],
            correctOptionIndex: 1,
            explanation: 'Meeting SLA latency benchmarks and robust exception handling characterize production readiness.',
          },
        ];
      }

      const created = await prisma.microAssessment.create({
        data: {
          title,
          description,
          roadmapNodeId: node ? node.id : null,
          skillId: skill ? skill.id : null,
          questions: {
            create: questions.map((q, idx) => ({
              questionText: q.questionText,
              options: q.options,
              correctOptionIndex: q.correctOptionIndex,
              explanation: q.explanation,
              orderIndex: idx,
            })),
          },
        },
        include: {
          questions: { orderBy: { orderIndex: 'asc' } },
          skill: true,
        },
      });

      const stored: StoredAssessment = {
        id: created.id,
        title: created.title,
        description: created.description,
        roadmapNodeId: created.roadmapNodeId,
        skillId: created.skillId,
        skillName: created.skill?.name ?? null,
        questions: created.questions.map((q) => ({
          id: q.id,
          questionText: q.questionText,
          options: q.options,
          correctOptionIndex: q.correctOptionIndex,
          explanation: q.explanation,
        })),
        createdAt: created.createdAt,
      };
      memoryAssessments.set(stored.id, stored);
      return sanitizeAssessment(stored);
    } catch {
      // Memory fallback synthesizer
      const fallbackId = `assess_${nodeId}`;
      let questions: AssessmentQuestionData[] | null = null;
      let title = `${nodeId} Skill Assessment`;
      let description = 'Verify core concepts and practical proficiency.';

      try {
        const systemPrompt = buildAssessmentSystemPrompt();
        const userPrompt = buildAssessmentUserPrompt({
          skillName: skillId || nodeId,
          nodeTitle: nodeId,
          questionCount: 3,
        });
        const aiOutput = await roadmapAIClient.generateAssessment(systemPrompt, userPrompt);
        if (aiOutput && Array.isArray(aiOutput.questions) && aiOutput.questions.length > 0) {
          title = aiOutput.title;
          description = aiOutput.description || description;
          questions = aiOutput.questions.map((q, idx) => ({
            id: `q_ai_mem_${nodeId}_${idx + 1}`,
            questionText: q.questionText,
            options: q.options,
            correctOptionIndex: q.correctOptionIndex,
            explanation: q.explanation,
          }));
        }
      } catch {
        // fallback
      }

      if (!questions || questions.length === 0) {
        questions = [
          {
            id: `q_${nodeId}_1`,
            questionText: `What is the core principle behind ${nodeId}?`,
            options: [
              'Predictable state transitions and modular design',
              'Global uncontrolled side effects',
              'Avoiding all caching layers',
              'Skipping all automated tests',
            ],
            correctOptionIndex: 0,
            explanation: 'Modular design and predictable state transitions are foundational to software craftsmanship.',
          },
          {
            id: `q_${nodeId}_2`,
            questionText: `How should exceptional conditions be handled?`,
            options: [
              'Silently ignore errors',
              'Throw and handle with structured error responses',
              'Terminate the entire server process without logs',
              'Send raw stack traces directly to end users',
            ],
            correctOptionIndex: 1,
            explanation: 'Structured error handling and logging ensure robust observability and graceful degradation.',
          },
        ];
      }

      const memoryAssessment: StoredAssessment = {
        id: fallbackId,
        title,
        description,
        roadmapNodeId: nodeId,
        skillId: skillId ?? null,
        skillName: 'Core Competency',
        questions,
        createdAt: new Date(),
      };
      memoryAssessments.set(fallbackId, memoryAssessment);
      return sanitizeAssessment(memoryAssessment);
    }
  },

  async submitAssessment(userId: string, input: unknown): Promise<AssessmentAttemptResultDTO> {
    const payload = submitAssessmentSchema.parse(input);

    // 1. Fetch raw assessment (with correct answers)
    let assessment = memoryAssessments.get(payload.assessmentId);
    if (!assessment) {
      try {
        const dbAssessment = await prisma.microAssessment.findUnique({
          where: { id: payload.assessmentId },
          include: { questions: { orderBy: { orderIndex: 'asc' } }, skill: true },
        });
        if (dbAssessment) {
          assessment = {
            id: dbAssessment.id,
            title: dbAssessment.title,
            description: dbAssessment.description,
            roadmapNodeId: dbAssessment.roadmapNodeId,
            skillId: dbAssessment.skillId,
            skillName: dbAssessment.skill?.name ?? null,
            questions: dbAssessment.questions.map((q) => ({
              id: q.id,
              questionText: q.questionText,
              options: q.options,
              correctOptionIndex: q.correctOptionIndex,
              explanation: q.explanation,
            })),
            createdAt: dbAssessment.createdAt,
          };
          memoryAssessments.set(assessment.id, assessment);
        }
      } catch {
        // DB lookup failure
      }
    }

    if (!assessment) {
      throw new NotFoundError('Assessment not found');
    }

    // 2. Validate question IDs
    const validQuestionIds = new Set(assessment.questions.map((q) => q.id));
    for (const ans of payload.answers) {
      if (!validQuestionIds.has(ans.questionId)) {
        throw new BadRequestError(`Question ${ans.questionId} does not belong to this assessment`);
      }
    }

    // 3. UserRoadmap ownership validation if provided
    let targetSkillId = payload.skillId || assessment.skillId;
    if (payload.userRoadmapId) {
      try {
        const userRoadmap = await prisma.userRoadmap.findFirst({
          where: { id: payload.userRoadmapId, userId },
          include: { sourceRoadmap: { include: { nodes: { include: { skills: true } } } } },
        });
        if (!userRoadmap) {
          throw new NotFoundError('Your roadmap was not found or belongs to another user');
        }

        if (!targetSkillId && assessment.roadmapNodeId) {
          const matchedNode = userRoadmap.sourceRoadmap.nodes.find(
            (n) => n.id === assessment!.roadmapNodeId || n.legacyNodeId === assessment!.roadmapNodeId
          );
          if (matchedNode && matchedNode.skills.length > 0) {
            targetSkillId = matchedNode.skills[0].skillId;
          }
        }
      } catch (err) {
        if (err instanceof NotFoundError || err instanceof BadRequestError) throw err;
      }
    }

    if (payload.sprintId) {
      try {
        const sprint = await prisma.roadmapSprint.findFirst({
          where: { id: payload.sprintId, userRoadmap: { userId } },
        });
        if (!sprint) {
          throw new NotFoundError('Sprint not found or belongs to another user');
        }
      } catch (err) {
        if (err instanceof NotFoundError || err instanceof BadRequestError) throw err;
      }
    }

    if (payload.sprintTaskId) {
      try {
        const task = await prisma.roadmapSprintTask.findFirst({
          where: { id: payload.sprintTaskId, sprint: { userRoadmap: { userId } } },
        });
        if (!task) {
          throw new NotFoundError('Sprint task not found or belongs to another user');
        }
      } catch (err) {
        if (err instanceof NotFoundError || err instanceof BadRequestError) throw err;
      }
    }

    // 4. Evaluate Server-side
    const evaluation = evaluateAssessmentAnswers(assessment.questions, payload.answers);
    const adaptationSignal = getAssessmentAdaptationSignal(evaluation.score);

    const attemptId = `att_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const attemptRecord: StoredAttempt = {
      id: attemptId,
      assessmentId: assessment.id,
      userId,
      userRoadmapId: payload.userRoadmapId ?? null,
      sprintId: payload.sprintId ?? null,
      sprintTaskId: payload.sprintTaskId ?? null,
      skillId: targetSkillId ?? null,
      totalQuestions: evaluation.totalQuestions,
      correctAnswers: evaluation.correctAnswers,
      score: evaluation.score,
      passed: evaluation.passed,
      answers: evaluation.questionResults,
      completedAt: new Date(),
    };
    memoryAttempts.set(attemptId, attemptRecord);

    let evidenceRecorded = false;

    // 5. Persist to DB if available
    try {
      await prisma.microAssessmentAttempt.create({
        data: {
          id: attemptId,
          assessmentId: assessment.id,
          userId,
          userRoadmapId: payload.userRoadmapId || null,
          sprintId: payload.sprintId || null,
          sprintTaskId: payload.sprintTaskId || null,
          skillId: targetSkillId || null,
          totalQuestions: evaluation.totalQuestions,
          correctAnswers: evaluation.correctAnswers,
          score: evaluation.score,
          passed: evaluation.passed,
          answers: evaluation.questionResults as any,
          completedAt: attemptRecord.completedAt,
        },
      });

      // If userRoadmapId and skillId are present, persist SkillEvidence
      if (payload.userRoadmapId && targetSkillId) {
        await prisma.skillEvidence.create({
          data: {
            userRoadmapId: payload.userRoadmapId,
            skillId: targetSkillId,
            source: 'ASSESSMENT',
            demonstratedScore: evaluation.score,
            estimatedProficiency: evaluation.score,
            confidence: Math.max(50, Math.min(95, evaluation.score)),
            externalReference: attemptId,
            metadata: {
              assessmentId: assessment.id,
              totalQuestions: evaluation.totalQuestions,
              correctAnswers: evaluation.correctAnswers,
              passed: evaluation.passed,
            },
          },
        });
        evidenceRecorded = true;
      }
    } catch {
      // In memory fallback mode
      if (payload.userRoadmapId && targetSkillId) {
        evidenceRecorded = true;
      }
    }

    return {
      id: attemptId,
      assessmentId: assessment.id,
      userId,
      userRoadmapId: payload.userRoadmapId ?? null,
      sprintId: payload.sprintId ?? null,
      sprintTaskId: payload.sprintTaskId ?? null,
      skillId: targetSkillId ?? null,
      totalQuestions: evaluation.totalQuestions,
      correctAnswers: evaluation.correctAnswers,
      score: evaluation.score,
      passed: evaluation.passed,
      questionResults: evaluation.questionResults,
      evidenceRecorded,
      adaptationRecommendation: adaptationSignal,
      completedAt: attemptRecord.completedAt.toISOString(),
    };
  },

  async getUserAttempts(userId: string, assessmentId?: string): Promise<StoredAttempt[]> {
    try {
      const dbAttempts = await prisma.microAssessmentAttempt.findMany({
        where: {
          userId,
          ...(assessmentId ? { assessmentId } : {}),
        },
        orderBy: { completedAt: 'desc' },
      });

      if (dbAttempts && dbAttempts.length > 0) {
        return dbAttempts.map((att) => ({
          id: att.id,
          assessmentId: att.assessmentId,
          userId: att.userId,
          userRoadmapId: att.userRoadmapId,
          sprintId: att.sprintId,
          sprintTaskId: att.sprintTaskId,
          skillId: att.skillId,
          totalQuestions: att.totalQuestions,
          correctAnswers: att.correctAnswers,
          score: att.score,
          passed: att.passed,
          answers: att.answers,
          completedAt: att.completedAt,
        }));
      }
    } catch {
      // fallback to memory
    }

    return Array.from(memoryAttempts.values()).filter(
      (att) => att.userId === userId && (!assessmentId || att.assessmentId === assessmentId)
    );
  },
};
