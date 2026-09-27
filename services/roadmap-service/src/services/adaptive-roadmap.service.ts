import { prisma } from '../lib/prisma.js';
import { BadRequestError, NotFoundError } from '../lib/errors.js';
import {
  determineSprintAdaptation,
  getSprintWindow,
  personalizationSchema,
  selfReportedEvidenceSchema,
  sprintPerformanceSchema,
  taskProgressSchema,
} from '../domain/roadmap.domain.js';
import { z } from 'zod';

const structuredRoadmapSchema = z.object({
  title: z.string().trim().min(3).max(180),
  description: z.string().trim().min(10).max(4_000).optional(),
  rolePath: z.string().trim().min(2).max(80),
  targetCompanyTier: z.string().trim().min(2).max(80).default('FAANG'),
  visibility: z.enum(['PUBLIC', 'PRIVATE', 'UNLISTED']).default('PRIVATE'),
  goal: z.object({
    targetRole: z.string().trim().min(2).max(120),
    outcome: z.string().trim().min(2).max(160),
    targetCompany: z.string().trim().min(2).max(120).optional(),
    targetIndustry: z.string().trim().min(2).max(120).optional(),
    deadline: z.coerce.date().optional(),
    difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).default('INTERMEDIATE'),
    estimatedWeeks: z.number().int().min(1).max(260).optional(),
    freeOnly: z.boolean().default(false),
    budgetCents: z.number().int().min(0).max(10_000_000).optional(),
    currency: z.string().trim().length(3).default('INR'),
  }),
  nodes: z.array(z.object({
    title: z.string().trim().min(2).max(180),
    description: z.string().trim().max(2_000).optional(),
    category: z.string().trim().min(2).max(80),
    estimatedMinutes: z.number().int().min(15).max(10_000).default(60),
    requiresEvidence: z.boolean().default(false),
    targetProficiency: z.number().int().min(0).max(100).optional(),
    skills: z.array(z.object({
      name: z.string().trim().min(2).max(100),
      category: z.string().trim().min(2).max(80),
      targetProficiency: z.number().int().min(0).max(100).optional(),
    })).max(12).default([]),
  })).min(1).max(100),
});

type LegacyNode = {
  id?: string;
  title?: string;
  summary?: string;
  category?: string;
  orderIndex?: number;
  estimatedHours?: number;
  requiresEvidence?: boolean;
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96);
}

function getLegacyNodes(nodesData: unknown): LegacyNode[] {
  return Array.isArray(nodesData) ? (nodesData as LegacyNode[]) : [];
}

function getPlannedTaskCount(hoursPerDay: number, daysPerWeek: number, durationDays: 7 | 10): number {
  const availableMinutes = hoursPerDay * daysPerWeek * durationDays * 60 / 7;
  return Math.max(1, Math.min(4, Math.floor(availableMinutes / 90)));
}

export const adaptiveRoadmapService = {
  async createStructuredRoadmap(userId: string, input: unknown) {
    const payload = structuredRoadmapSchema.parse(input);

    return prisma.$transaction(async (tx) => {
      const roadmap = await tx.careerRoadmap.create({
        data: {
          userId,
          title: payload.title,
          description: payload.description,
          rolePath: payload.rolePath,
          targetCompanyTier: payload.targetCompanyTier,
          visibility: payload.visibility,
          overallReadiness: 0,
          nodesData: payload.nodes.map((node, index) => ({
            id: `node-${index + 1}`,
            title: node.title,
            summary: node.description || '',
            category: node.category,
            orderIndex: index + 1,
          })),
          goal: { create: payload.goal },
          nodes: {
            create: payload.nodes.map((node, index) => ({
              legacyNodeId: `node-${index + 1}`,
              title: node.title,
              description: node.description,
              category: node.category,
              orderIndex: index + 1,
              estimatedMinutes: node.estimatedMinutes,
              requiresEvidence: node.requiresEvidence,
              targetProficiency: node.targetProficiency,
            })),
          },
        },
        include: { nodes: { orderBy: { orderIndex: 'asc' } }, goal: true },
      });

      for (const [index, node] of payload.nodes.entries()) {
        const createdNode = roadmap.nodes[index];
        for (const skillInput of node.skills) {
          const skill = await tx.skill.upsert({
            where: { slug: slugify(skillInput.name) },
            update: { name: skillInput.name, category: skillInput.category },
            create: { slug: slugify(skillInput.name), name: skillInput.name, category: skillInput.category },
          });
          await tx.roadmapNodeSkill.create({
            data: {
              nodeId: createdNode.id,
              skillId: skill.id,
              targetProficiency: skillInput.targetProficiency,
            },
          });
        }
      }

      return roadmap;
    });
  },

  async followRoadmap(userId: string, roadmapId: string, input: unknown) {
    const personalization = personalizationSchema.parse(input);
    const source = await prisma.careerRoadmap.findFirst({
      where: {
        id: roadmapId,
        OR: [{ userId }, { visibility: 'PUBLIC' }, { visibility: 'UNLISTED' }],
      },
      include: { nodes: { orderBy: { orderIndex: 'asc' } } },
    });

    if (!source) throw new NotFoundError('Roadmap not found or unavailable');

    const existing = await prisma.userRoadmap.findUnique({
      where: { userId_sourceRoadmapId: { userId, sourceRoadmapId: roadmapId } },
    });
    if (existing) return this.getUserRoadmap(userId, existing.id);

    const instance = await prisma.userRoadmap.create({
      data: {
        userId,
        sourceRoadmapId: roadmapId,
        personalization: personalization as object,
        planSnapshot: { sourceRoadmapUpdatedAt: source.updatedAt.toISOString() },
      },
    });

    await this.createNextSprint(instance.id, source, personalization, 1, new Date());
    return this.getUserRoadmap(userId, instance.id);
  },

  async getUserRoadmaps(userId: string) {
    return prisma.userRoadmap.findMany({
      where: { userId },
      include: {
        sourceRoadmap: { include: { goal: true } },
        sprints: {
          where: { status: { in: ['ACTIVE', 'UPCOMING'] } },
          orderBy: { sprintNumber: 'asc' },
          take: 1,
          include: { tasks: { orderBy: { orderIndex: 'asc' } } },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  },

  async getUserRoadmap(userId: string, userRoadmapId: string) {
    const instance = await prisma.userRoadmap.findFirst({
      where: { id: userRoadmapId, userId },
      include: {
        sourceRoadmap: { include: { goal: true } },
        sprints: {
          orderBy: { sprintNumber: 'asc' },
          include: { tasks: { orderBy: { orderIndex: 'asc' } }, performance: true },
        },
        adaptations: { orderBy: { createdAt: 'desc' } },
        skillEvidence: { include: { skill: true }, orderBy: { assessedAt: 'desc' } },
      },
    });
    if (!instance) throw new NotFoundError('Your roadmap was not found');
    return instance;
  },

  async updateSprintTask(userId: string, sprintId: string, taskId: string, input: unknown) {
    const payload = taskProgressSchema.parse(input);
    const task = await prisma.roadmapSprintTask.findFirst({
      where: { id: taskId, sprintId, sprint: { userRoadmap: { userId } } },
      include: { sprint: { select: { userRoadmapId: true } } },
    });
    if (!task) throw new NotFoundError('Sprint task not found');

    if (payload.status === 'COMPLETED' && task.requiresEvidence) {
      const evidenceCount = await prisma.skillEvidence.count({ where: { userRoadmapId: task.sprint.userRoadmapId } });
      if (evidenceCount === 0) {
        throw new BadRequestError('This task requires evidence before it can be completed');
      }
    }

    return prisma.roadmapSprintTask.update({
      where: { id: task.id },
      data: {
        status: payload.status,
        completedAt: payload.status === 'COMPLETED' ? new Date() : null,
      },
    });
  },

  async recordSelfReportedEvidence(userId: string, userRoadmapId: string, input: unknown) {
    const payload = selfReportedEvidenceSchema.parse(input);
    const instance = await prisma.userRoadmap.findFirst({ where: { id: userRoadmapId, userId } });
    if (!instance) throw new NotFoundError('Your roadmap was not found');

    const skill = await prisma.skill.findUnique({ where: { id: payload.skillId } });
    if (!skill) throw new NotFoundError('Skill not found');

    return prisma.skillEvidence.create({
      data: {
        userRoadmapId,
        skillId: skill.id,
        source: 'SELF_REPORTED',
        estimatedProficiency: payload.estimatedProficiency,
        confidence: 20,
        metadata: payload.notes ? { notes: payload.notes } : undefined,
      },
      include: { skill: true },
    });
  },

  async completeSprint(userId: string, sprintId: string, input: unknown) {
    const performanceInput = sprintPerformanceSchema.parse(input);
    const sprint = await prisma.roadmapSprint.findFirst({
      where: { id: sprintId, userRoadmap: { userId } },
      include: { tasks: { orderBy: { orderIndex: 'asc' } }, userRoadmap: true },
    });
    if (!sprint) throw new NotFoundError('Sprint not found');
    if (sprint.status === 'COMPLETED') throw new BadRequestError('Sprint is already completed');

    const relevantTasks = sprint.tasks.filter((task) => task.status !== 'SKIPPED');
    const completedTasks = relevantTasks.filter((task) => task.status === 'COMPLETED');
    const taskCompletion = relevantTasks.length === 0 ? 100 : Math.round((completedTasks.length / relevantTasks.length) * 100);
    const recommendation = determineSprintAdaptation({ taskCompletion, ...performanceInput });

    await prisma.$transaction([
      prisma.roadmapSprint.update({
        where: { id: sprint.id },
        data: { status: 'COMPLETED', decision: recommendation.decision },
      }),
      prisma.sprintPerformance.upsert({
        where: { sprintId: sprint.id },
        create: { sprintId: sprint.id, taskCompletion, decision: recommendation.decision, ...performanceInput },
        update: { taskCompletion, decision: recommendation.decision, ...performanceInput },
      }),
    ]);

    let nextSprint = null;
    if (recommendation.action) {
      const personalization = personalizationSchema.parse(sprint.userRoadmap.personalization);
      const source = await prisma.careerRoadmap.findUnique({
        where: { id: sprint.userRoadmap.sourceRoadmapId },
        include: { nodes: { orderBy: { orderIndex: 'asc' } } },
      });
      if (source) {
        nextSprint = await this.createNextSprint(
          sprint.userRoadmapId,
          source,
          personalization,
          sprint.sprintNumber + 1,
          new Date(sprint.endDate.getTime() + 86_400_000),
          recommendation.action,
          sprint.tasks.filter((task) => task.status !== 'COMPLETED'),
        );
      }

      await prisma.roadmapAdaptation.create({
        data: {
          userRoadmapId: sprint.userRoadmapId,
          sprintId: sprint.id,
          action: recommendation.action,
          reason: recommendation.reason,
          evidence: { taskCompletion, ...performanceInput },
          previousState: { sprintNumber: sprint.sprintNumber, objective: sprint.objective },
          newState: nextSprint ? { nextSprintId: nextSprint.id, objective: nextSprint.objective } : { nextSprintPending: true },
        },
      });
    }

    return {
      sprint: await prisma.roadmapSprint.findUnique({ include: { tasks: true, performance: true }, where: { id: sprint.id } }),
      recommendation,
      nextSprint,
    };
  },

  async createNextSprint(
    userRoadmapId: string,
    source: { nodesData: unknown; nodes: Array<{ id: string; title: string; description: string | null; orderIndex: number; estimatedMinutes: number; requiresEvidence: boolean }>; },
    personalization: z.infer<typeof personalizationSchema>,
    sprintNumber: number,
    startDate: Date,
    action?: 'ACCELERATE_TASK' | 'INSERT_REINFORCEMENT' | 'EXTEND_SPRINT' | 'REDUCE_WORKLOAD' | 'INCREASE_PRACTICE',
    carryForward: Array<{ title: string; description: string | null; estimatedMinutes: number; requiresEvidence: boolean }> = [],
  ) {
    const existing = await prisma.roadmapSprint.findUnique({
      where: { userRoadmapId_sprintNumber: { userRoadmapId, sprintNumber } },
    });
    if (existing) return existing;

    const durationDays = personalization.sprintDurationDays;
    const window = getSprintWindow(startDate, durationDays);
    const taskCount = getPlannedTaskCount(personalization.hoursPerDay, personalization.daysPerWeek, durationDays);
    const sourceNodes = source.nodes.length > 0
      ? source.nodes.map((node) => ({
          roadmapNodeId: node.id,
          title: node.title,
          description: node.description,
          orderIndex: node.orderIndex,
          estimatedMinutes: node.estimatedMinutes,
          requiresEvidence: node.requiresEvidence,
        }))
      : getLegacyNodes(source.nodesData).map((node, index) => ({
          roadmapNodeId: null,
          title: node.title || `Roadmap task ${index + 1}`,
          description: node.summary || null,
          orderIndex: node.orderIndex || index + 1,
          estimatedMinutes: Math.max(30, Math.round((node.estimatedHours || 1) * 60)),
          requiresEvidence: Boolean(node.requiresEvidence),
        }));
    const offset = Math.max(0, (sprintNumber - 1) * taskCount);
    const upcoming = sourceNodes.slice(action === 'ACCELERATE_TASK' ? offset + 1 : offset, offset + taskCount + 1);
    const carried = carryForward.slice(0, taskCount).map((task, index) => ({ ...task, roadmapNodeId: null, orderIndex: index + 1 }));
    const selectedTasks = action === 'EXTEND_SPRINT' && carried.length > 0 ? carried : upcoming;
    const reinforcement = action === 'INSERT_REINFORCEMENT'
      ? [{ roadmapNodeId: null, title: `Reinforcement practice for ${personalization.targetRole}`, description: 'Use an assessment or practical task to demonstrate the weakest sprint skill before advancing.', orderIndex: 0, estimatedMinutes: 90, requiresEvidence: true }]
      : [];
    const tasks = [...reinforcement, ...selectedTasks].slice(0, 4);
    const objective = action === 'INSERT_REINFORCEMENT'
      ? `Strengthen the weakest demonstrated skill for ${personalization.targetRole}`
      : tasks[0]?.title || `Progress toward ${personalization.targetRole}`;

    return prisma.roadmapSprint.create({
      data: {
        userRoadmapId,
        sprintNumber,
        startDate: window.startDate,
        endDate: window.endDate,
        objective,
        expectedMinutes: tasks.reduce((total, task) => total + task.estimatedMinutes, 0),
        status: sprintNumber === 1 ? 'ACTIVE' : 'UPCOMING',
        tasks: {
          create: tasks.map((task, index) => ({
            roadmapNodeId: task.roadmapNodeId,
            title: task.title,
            description: task.description,
            orderIndex: index + 1,
            estimatedMinutes: task.estimatedMinutes,
            requiresEvidence: task.requiresEvidence,
          })),
        },
      },
      include: { tasks: { orderBy: { orderIndex: 'asc' } } },
    });
  },
};
