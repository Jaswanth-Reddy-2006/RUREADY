// ═══════════════════════════════════════════════════════════════
// Canonical Roadmap DTO Mapper
// Pure, Deterministic Transformations between Generated,
// Persisted Prisma Entities and Shared TypeScript Contracts
// ═══════════════════════════════════════════════════════════════

import {
  CareerRoadmapDTO,
  RoadmapPhaseDefinition,
  RoadmapNodeDefinition,
  RoadmapTier,
  RoadmapLevel,
  RoadmapResourceSource,
  RoadmapPracticalDrill,
  RoadmapMicroQuestion,
} from '@ru-ready/shared';
import {
  GeneratedRoadmapOutput,
  GeneratedPhaseDefinition,
  GeneratedNodeDefinition,
  GeneratedResourceSource,
  GeneratedPracticalDrill,
  GeneratedMicroQuestion,
} from '../validators/roadmap-generation.validator.js';

/**
 * Backend-owned metadata that MUST NOT be controlled or forged by AI output.
 */
export interface TrustedBackendContext {
  id: string;
  userId: string;
  overallReadiness?: number;
  isOfficial?: boolean;
  isPublic?: boolean;
  isAiGenerated?: boolean;
  creatorId?: string;
  creatorName?: string;
  creatorUsername?: string;
  creatorAvatar?: string;
  creatorRole?: string;
  enrolledCount?: number;
  upvotes?: number;
  tags?: string[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

// ─── 1. Sub-Entity Mappers ─────────────────────────────────────

/**
 * Maps a single GeneratedResourceSource to canonical RoadmapResourceSource.
 */
export function mapResourceSource(src: GeneratedResourceSource): RoadmapResourceSource {
  return {
    id: src.id,
    title: src.title,
    url: src.url,
    type: src.type,
    description: src.description,
  };
}

/**
 * Maps a single GeneratedPracticalDrill to canonical RoadmapPracticalDrill.
 */
export function mapPracticalDrill(drill: GeneratedPracticalDrill): RoadmapPracticalDrill {
  return {
    title: drill.title,
    description: drill.description,
    deliverable: drill.deliverable,
    starterCode: drill.starterCode,
    verificationChecklist: [...drill.verificationChecklist],
    ...(drill.language ? { language: drill.language } : {}),
    ...(drill.entryPoint ? { entryPoint: drill.entryPoint } : {}),
    ...(drill.testCases ? { testCases: drill.testCases.map((tc) => ({ input: tc.input, expected: tc.expected, description: tc.description })) } : {}),
  };
}

/**
 * Maps a single GeneratedMicroQuestion to canonical RoadmapMicroQuestion.
 */
export function mapMicroQuestion(q: GeneratedMicroQuestion): RoadmapMicroQuestion {
  return {
    id: q.id,
    questionText: q.questionText,
    focus: q.focus,
    suggestedAnswer: q.suggestedAnswer,
  };
}

/**
 * Maps a single GeneratedNodeDefinition to canonical RoadmapNodeDefinition.
 * Preserves all 3-pillar content, drills, skills, and prerequisite links.
 */
export function mapGeneratedNodeToDefinition(
  node: GeneratedNodeDefinition,
  parentPhaseId?: string
): RoadmapNodeDefinition {
  const phaseId = node.phaseId || parentPhaseId;

  return {
    id: node.id,
    phaseId,
    title: node.title,
    subHeader: node.subHeader,
    category: node.category,
    orderIndex: node.orderIndex,
    estimatedHours: node.estimatedHours,
    estimatedMinutes: node.estimatedMinutes || Math.round(node.estimatedHours * 60),
    requiresEvidence: node.requiresEvidence ?? false,
    requiresAssessment: node.requiresAssessment ?? false,
    targetProficiency: node.targetProficiency,
    status: node.status || 'LOCKED',
    score: node.score || 0,
    skills: node.skills.map((s) => ({
      name: s.name,
      category: s.category,
      targetProficiency: s.targetProficiency,
    })),
    prerequisiteNodeIds: node.prerequisiteNodeIds ? [...node.prerequisiteNodeIds] : [],
    whatShouldIDo: {
      summary: node.whatShouldIDo.summary,
      actionSteps: [...node.whatShouldIDo.actionSteps],
      mentalModels: [...node.whatShouldIDo.mentalModels],
    },
    whatIsTheSource: node.whatIsTheSource.map(mapResourceSource),
    whatIsTheExactThing: mapPracticalDrill(node.whatIsTheExactThing),
    microQuestions: node.microQuestions.map(mapMicroQuestion),
  };
}

/**
 * Maps a single GeneratedPhaseDefinition to canonical RoadmapPhaseDefinition.
 */
export function mapGeneratedPhaseToDefinition(
  phase: GeneratedPhaseDefinition
): RoadmapPhaseDefinition {
  return {
    id: phase.id,
    title: phase.title,
    description: phase.description,
    orderIndex: phase.orderIndex,
    nodes: phase.nodes
      .map((node) => mapGeneratedNodeToDefinition(node, phase.id))
      .sort((a, b) => a.orderIndex - b.orderIndex),
  };
}

// ─── 2. Primary DTO Mappers ────────────────────────────────────

/**
 * Maps validated AI-Generated (or Fallback-Synthesized) roadmap output
 * into canonical CareerRoadmapDTO by merging with trusted backend context.
 *
 * Guarantees:
 * - AI cannot forge backend-owned fields (id, userId, isOfficial, timestamps, etc.).
 * - All 3-pillar nodes are collected and sorted into nodesData and phases.
 * - Deep immutability: Does not mutate inputs.
 */
export function mapGeneratedRoadmapToDTO(
  generated: GeneratedRoadmapOutput,
  backendContext: TrustedBackendContext
): CareerRoadmapDTO {
  const mappedPhases = generated.phases
    .map(mapGeneratedPhaseToDefinition)
    .sort((a, b) => a.orderIndex - b.orderIndex);

  // Flatten all nodes across phases into canonical nodesData
  const flatNodes: RoadmapNodeDefinition[] = [];
  for (const phase of mappedPhases) {
    for (const node of phase.nodes) {
      flatNodes.push({ ...node, phaseId: phase.id });
    }
  }

  const createdAt = backendContext.createdAt
    ? typeof backendContext.createdAt === 'string'
      ? backendContext.createdAt
      : backendContext.createdAt.toISOString()
    : new Date().toISOString();

  const updatedAt = backendContext.updatedAt
    ? typeof backendContext.updatedAt === 'string'
      ? backendContext.updatedAt
      : backendContext.updatedAt.toISOString()
    : createdAt;

  return {
    id: backendContext.id,
    userId: backendContext.userId,
    title: generated.title,
    description: generated.description,
    rolePath: generated.rolePath,
    targetCompanyTier: generated.targetCompanyTier as RoadmapTier,
    difficulty: generated.difficulty as RoadmapLevel,
    overallReadiness: backendContext.overallReadiness ?? 0,
    estimatedWeeks: generated.estimatedWeeks,
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
    tags: backendContext.tags ? [...backendContext.tags] : [],
    phases: mappedPhases,
    nodesData: flatNodes,
    createdAt,
    updatedAt,
  };
}

/**
 * Maps persisted Prisma CareerRoadmap records (with optional relations)
 * into canonical CareerRoadmapDTO.
 */
export function mapPersistedRoadmapToDTO(record: any): CareerRoadmapDTO {
  if (!record || typeof record !== 'object') {
    throw new Error('Cannot map invalid or empty database record to CareerRoadmapDTO');
  }

  const createdAt = record.createdAt instanceof Date ? record.createdAt.toISOString() : String(record.createdAt || new Date().toISOString());
  const updatedAt = record.updatedAt instanceof Date ? record.updatedAt.toISOString() : String(record.updatedAt || createdAt);

  // Parse custom tech stack metadata if present
  const customTech = record.customTechStack && typeof record.customTechStack === 'object' ? record.customTechStack : {};

  // Extract relational or JSON phases
  let phases: RoadmapPhaseDefinition[] = [];
  if (Array.isArray(record.phases) && record.phases.length > 0) {
    phases = record.phases.map((p: any) => ({
      id: p.id,
      title: p.title,
      description: p.description || undefined,
      orderIndex: p.orderIndex,
      nodes: Array.isArray(p.nodes)
        ? p.nodes.map((n: any) => ({
            id: n.id || n.legacyNodeId,
            phaseId: p.id,
            title: n.title,
            subHeader: n.subHeader || undefined,
            category: n.category,
            orderIndex: n.orderIndex,
            estimatedHours: Math.max(1, Math.round((n.estimatedMinutes || 60) / 60)),
            estimatedMinutes: n.estimatedMinutes || 60,
            requiresEvidence: Boolean(n.requiresEvidence),
            requiresAssessment: Boolean(n.requiresAssessment),
            targetProficiency: n.targetProficiency || undefined,
            status: n.status || 'LOCKED',
            score: n.score || 0,
            skills: Array.isArray(n.skills)
              ? n.skills.map((s: any) => ({
                  name: s.skill?.name || s.name || 'Core Skill',
                  category: s.skill?.category || s.category || n.category,
                  targetProficiency: s.targetProficiency,
                }))
              : [],
            prerequisiteNodeIds: Array.isArray(n.prerequisites)
              ? n.prerequisites.map((dep: any) => dep.prerequisiteNodeId)
              : [],
            whatShouldIDo: n.whatShouldIDo || {
              summary: n.description || n.summary || `Master core ${n.category} concepts.`,
              actionSteps: ['Study principles', 'Implement practical prototype', 'Verify performance'],
              mentalModels: ['First principles engineering'],
            },
            whatIsTheSource: Array.isArray(n.whatIsTheSource) ? n.whatIsTheSource : [],
            whatIsTheExactThing: n.whatIsTheExactThing || {
              title: `${n.title} Practical Implementation`,
              description: n.description || 'Hands-on engineering drill.',
              deliverable: 'Tested modular code solution.',
              verificationChecklist: ['Unit tests pass', 'Edge cases handled'],
            },
            microQuestions: Array.isArray(n.microQuestions) ? n.microQuestions : [],
          }))
        : [],
    }));
  }

  // Extract flat nodesData from JSON column or relational nodes
  let nodesData: RoadmapNodeDefinition[] = [];
  if (Array.isArray(record.nodesData) && record.nodesData.length > 0) {
    nodesData = record.nodesData.map((n: any, idx: number) => ({
      id: n.id || `node-${idx + 1}`,
      phaseId: n.phaseId || undefined,
      title: n.title,
      subHeader: n.subHeader || undefined,
      category: n.category || 'Core Systems',
      orderIndex: n.orderIndex !== undefined ? n.orderIndex : idx,
      estimatedHours: n.estimatedHours || Math.max(1, Math.round((n.estimatedMinutes || 60) / 60)),
      estimatedMinutes: n.estimatedMinutes || (n.estimatedHours ? n.estimatedHours * 60 : 60),
      requiresEvidence: Boolean(n.requiresEvidence),
      requiresAssessment: Boolean(n.requiresAssessment),
      targetProficiency: n.targetProficiency,
      status: n.status || 'LOCKED',
      score: n.score || 0,
      skills: Array.isArray(n.skills) ? n.skills : [],
      prerequisiteNodeIds: Array.isArray(n.prerequisiteNodeIds) ? n.prerequisiteNodeIds : [],
      whatShouldIDo: n.whatShouldIDo || {
        summary: n.summary || n.description || 'Concept mastery',
        actionSteps: n.concepts || ['Learn core mechanics'],
        mentalModels: ['Production trade-offs'],
      },
      whatIsTheSource: Array.isArray(n.whatIsTheSource) ? n.whatIsTheSource : [],
      whatIsTheExactThing: n.whatIsTheExactThing || {
        title: `${n.title} Drill`,
        description: n.summary || 'Practical task',
        deliverable: 'Working code module',
        starterCode: n.codeSnippet,
        verificationChecklist: ['Passes verification'],
      },
      microQuestions: Array.isArray(n.microQuestions) ? n.microQuestions : [],
    }));
  } else if (phases.length > 0) {
    for (const p of phases) {
      nodesData.push(...p.nodes);
    }
  }

  const difficulty: RoadmapLevel =
    record.goal?.difficulty ||
    customTech.difficulty ||
    (record.difficulty as RoadmapLevel) ||
    'INTERMEDIATE';

  const estimatedWeeks =
    record.goal?.estimatedWeeks ||
    customTech.estimatedWeeks ||
    record.estimatedWeeks ||
    12;

  const isPublic =
    record.visibility === 'PUBLIC' ||
    customTech.isPublic === true ||
    record.isPublic === true;

  return {
    id: record.id,
    userId: record.userId,
    title: record.title || customTech.title || `${record.rolePath} Mastery Roadmap`,
    description: record.description || customTech.description,
    rolePath: record.rolePath,
    targetCompanyTier: (record.targetCompanyTier || 'FAANG') as RoadmapTier,
    difficulty,
    overallReadiness: record.overallReadiness ?? 0,
    estimatedWeeks,
    isOfficial: Boolean(record.isOfficial),
    isPublic,
    isAiGenerated: Boolean(record.isAiGenerated ?? true),
    creatorId: record.creatorId || customTech.creatorId || record.userId,
    creatorName: record.creatorName || customTech.creatorName,
    creatorUsername: record.creatorUsername || customTech.creatorUsername,
    creatorAvatar: record.creatorAvatar || customTech.creatorAvatar,
    creatorRole: record.creatorRole || customTech.creatorRole,
    enrolledCount: record.enrolledCount ?? 0,
    upvotes: record.upvotes ?? 0,
    tags: Array.isArray(record.tags) ? record.tags : Array.isArray(customTech.tags) ? customTech.tags : [],
    phases,
    nodesData,
    createdAt,
    updatedAt,
  };
}
