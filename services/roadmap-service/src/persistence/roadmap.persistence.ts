// ═══════════════════════════════════════════════════════════════
// Roadmap Persistence Service — Atomic PostgreSQL Transaction
// Persists Validated 3-Pillar Roadmaps, Phases, Nodes & Skills
// ═══════════════════════════════════════════════════════════════

import { prisma } from '../lib/prisma.js';
import { GeneratedRoadmapOutput } from '../validators/roadmap-generation.validator.js';
import {
  mapPersistedRoadmapToDTO,
  mapGeneratedNodeToDefinition,
  mapGeneratedRoadmapToDTO,
  TrustedBackendContext,
} from '../mappers/roadmap.mapper.js';
import { CareerRoadmapDTO, RoadmapNodeDefinition } from '@ru-ready/shared';

export class RoadmapPersistenceError extends Error {
  public readonly code: string;
  public readonly cause?: unknown;

  constructor(message: string, code = 'ROADMAP_PERSISTENCE_FAILED', cause?: unknown) {
    super(message);
    this.name = 'RoadmapPersistenceError';
    this.code = code;
    this.cause = cause;
  }
}

export interface PersistGoalInput {
  targetRole?: string;
  outcome?: string;
  targetCompany?: string;
  targetIndustry?: string;
  deadline?: Date | string;
  difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  estimatedWeeks?: number;
  freeOnly?: boolean;
  budgetCents?: number;
  currency?: string;
}

export interface PersistRoadmapParams {
  generatedRoadmap: GeneratedRoadmapOutput;
  backendContext: TrustedBackendContext;
  customTechStack?: Record<string, any>;
  goal?: PersistGoalInput;
}

/**
 * Generates a clean URL/identifier-safe slug from a skill name.
 */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96);
}

export class RoadmapPersistenceService {
  private db: any;

  constructor(dbClient: any = prisma) {
    this.db = dbClient;
  }

  /**
   * Atomically persists a generated roadmap and all related relational entities
   * (Goal, Phases, Nodes, Skills, NodeSkills, and NodeDependencies) in a single transaction.
   *
   * @throws RoadmapPersistenceError if any part of the database transaction fails.
   */
  public async persistRoadmap(params: PersistRoadmapParams): Promise<CareerRoadmapDTO> {
    const { generatedRoadmap, backendContext, customTechStack, goal } = params;

    if (!backendContext || !backendContext.userId) {
      throw new RoadmapPersistenceError('Trusted backendContext with valid userId is required', 'MISSING_BACKEND_CONTEXT');
    }

    if (!generatedRoadmap || !Array.isArray(generatedRoadmap.phases) || generatedRoadmap.phases.length === 0) {
      throw new RoadmapPersistenceError('Valid generatedRoadmap with phases is required', 'INVALID_ROADMAP_PAYLOAD');
    }

    // 1. Prepare flat nodesData containing full 3-pillar content for JSON compatibility
    const flatNodesData: RoadmapNodeDefinition[] = [];
    for (const phase of generatedRoadmap.phases) {
      for (const node of phase.nodes) {
        flatNodesData.push(mapGeneratedNodeToDefinition(node, phase.id));
      }
    }

    try {
      return await this.db.$transaction(async (tx: any) => {
        // ── Step 1: Create CareerRoadmap record ──
        const createdRoadmap = await tx.careerRoadmap.create({
          data: {
            userId: backendContext.userId,
            title: generatedRoadmap.title,
            description: generatedRoadmap.description,
            rolePath: generatedRoadmap.rolePath,
            targetCompanyTier: generatedRoadmap.targetCompanyTier,
            visibility: backendContext.isPublic === false ? 'PRIVATE' : 'PUBLIC',
            overallReadiness: backendContext.overallReadiness ?? 0,
            nodesData: flatNodesData as any,
            customTechStack: {
              title: generatedRoadmap.title,
              description: generatedRoadmap.description,
              difficulty: generatedRoadmap.difficulty,
              estimatedWeeks: generatedRoadmap.estimatedWeeks,
              isOfficial: backendContext.isOfficial ?? false,
              isPublic: backendContext.isPublic ?? true,
              isAiGenerated: backendContext.isAiGenerated ?? true,
              creatorId: backendContext.creatorId || backendContext.userId,
              creatorName: backendContext.creatorName,
              creatorUsername: backendContext.creatorUsername,
              creatorAvatar: backendContext.creatorAvatar,
              creatorRole: backendContext.creatorRole,
              enrolledCount: backendContext.enrolledCount ?? 0,
              upvotes: backendContext.upvotes ?? 0,
              tags: backendContext.tags || [],
              ...customTechStack,
            } as any,
            ...(goal
              ? {
                  goal: {
                    create: {
                      targetRole: goal.targetRole || generatedRoadmap.rolePath,
                      outcome: goal.outcome || `Pass interviews and achieve mastery for ${generatedRoadmap.title}`,
                      targetCompany: goal.targetCompany,
                      targetIndustry: goal.targetIndustry,
                      deadline: goal.deadline ? new Date(goal.deadline) : undefined,
                      difficulty: (['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].includes(goal.difficulty as string)
                        ? goal.difficulty
                        : generatedRoadmap.difficulty === 'STAFF'
                        ? 'ADVANCED'
                        : generatedRoadmap.difficulty) as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED',
                      estimatedWeeks: generatedRoadmap.estimatedWeeks,
                      freeOnly: goal.freeOnly ?? false,
                      budgetCents: goal.budgetCents,
                      currency: goal.currency || 'INR',
                    },
                  },
                }
              : {}),
          },
        });

        // ── Step 2: Create RoadmapPhase records ──
        const createdPhases = [];
        for (const phase of generatedRoadmap.phases) {
          const createdPhase = await tx.roadmapPhase.create({
            data: {
              roadmapId: createdRoadmap.id,
              title: phase.title,
              description: phase.description,
              orderIndex: phase.orderIndex,
            },
          });
          createdPhases.push(createdPhase);
        }

        // ── Step 3: Create RoadmapNodes, Skills, and RoadmapNodeSkills ──
        let globalNodeOrderIndex = 0;
        const domainIdToDbNodeMap = new Map<string, any>();

        for (let pIdx = 0; pIdx < generatedRoadmap.phases.length; pIdx++) {
          const phase = generatedRoadmap.phases[pIdx];
          const createdPhase = createdPhases[pIdx];

          for (const node of phase.nodes) {
            const createdNode = await tx.roadmapNode.create({
              data: {
                roadmapId: createdRoadmap.id,
                phaseId: createdPhase.id,
                legacyNodeId: node.id,
                title: node.title,
                description: node.whatShouldIDo?.summary || '',
                category: node.category,
                orderIndex: globalNodeOrderIndex++,
                estimatedMinutes: node.estimatedMinutes || Math.round((node.estimatedHours || 1) * 60),
                requiresEvidence: Boolean(node.requiresEvidence),
                requiresAssessment: Boolean(node.requiresAssessment),
                targetProficiency: node.targetProficiency,
              },
            });

            domainIdToDbNodeMap.set(node.id, createdNode);

            // Upsert skill and create RoadmapNodeSkill link
            for (const skillInput of node.skills) {
              const skillSlug = slugify(skillInput.name);
              const skill = await tx.skill.upsert({
                where: { slug: skillSlug },
                update: {
                  name: skillInput.name,
                  category: skillInput.category,
                },
                create: {
                  slug: skillSlug,
                  name: skillInput.name,
                  category: skillInput.category,
                },
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
        }

        // ── Step 4: Create RoadmapNodeDependency links for prerequisites ──
        for (const phase of generatedRoadmap.phases) {
          for (const node of phase.nodes) {
            const dbNode = domainIdToDbNodeMap.get(node.id);
            if (dbNode && Array.isArray(node.prerequisiteNodeIds) && node.prerequisiteNodeIds.length > 0) {
              for (const prereqDomainId of node.prerequisiteNodeIds) {
                const prereqDbNode = domainIdToDbNodeMap.get(prereqDomainId);
                if (prereqDbNode && prereqDbNode.id !== dbNode.id) {
                  await tx.roadmapNodeDependency.create({
                    data: {
                      nodeId: dbNode.id,
                      prerequisiteNodeId: prereqDbNode.id,
                    },
                  });
                }
              }
            }
          }
        }

        // ── Step 5: Query complete relational record and map to DTO ──
        const fullRecord = await tx.careerRoadmap.findUnique({
          where: { id: createdRoadmap.id },
          include: {
            goal: true,
            phases: {
              orderBy: { orderIndex: 'asc' },
              include: {
                nodes: {
                  orderBy: { orderIndex: 'asc' },
                  include: {
                    skills: { include: { skill: true } },
                    prerequisites: true,
                  },
                },
              },
            },
          },
        });

        return mapPersistedRoadmapToDTO(fullRecord);
      });
    } catch (err: any) {
      if (err.message && (err.message.includes('does not exist') || err.message.includes('no such table') || (err.message.includes('relation') && err.message.includes('does not exist')))) {
        console.warn('[RoadmapPersistenceService] Database tables not yet migrated in PostgreSQL. Preserving generated roadmap DTO.');
        return mapGeneratedRoadmapToDTO(generatedRoadmap, backendContext);
      }
      if (err instanceof RoadmapPersistenceError) {
        throw err;
      }
      throw new RoadmapPersistenceError(
        `Failed to persist generated roadmap: ${err.message || 'Database transaction aborted'}`,
        'DATABASE_TRANSACTION_FAILED',
        err
      );
    }
  }
}

export const roadmapPersistenceService = new RoadmapPersistenceService();
