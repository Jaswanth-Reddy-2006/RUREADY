// ═══════════════════════════════════════════════════════════════
// AI Roadmap Output Validation Schema — Zod Contracts
// Strictly Validates AI-Generated 3-Pillar Curriculum Output
// ═══════════════════════════════════════════════════════════════

import { z } from 'zod';

// ─── 1. Resource Source Schema ────────────────────────────────

export const roadmapResourceSourceSchema = z.object({
  id: z.string().trim().min(1).max(100),
  title: z.string().trim().min(2).max(200),
  url: z.string().trim().url({ message: 'Resource URL must be a valid HTTP/HTTPS URL' }).max(2000),
  type: z.enum(['DOCS', 'COURSE', 'REPO', 'BOOK', 'ARTICLE']),
  description: z.string().trim().max(1000).optional(),
}).strict();

// ─── 2. Practical Drill Schema ────────────────────────────────

export const practicalDrillTestCaseSchema = z.object({
  input: z.any(),
  expected: z.any(),
  description: z.string().trim().max(500).optional(),
}).strict();

export const roadmapPracticalDrillSchema = z.object({
  title: z.string().trim().min(3).max(200),
  description: z.string().trim().min(10).max(4000),
  deliverable: z.string().trim().min(5).max(1000),
  starterCode: z.string().max(20000).optional(),
  verificationChecklist: z
    .array(z.string().trim().min(3).max(500))
    .min(1, { message: 'Drill must contain at least one verification checklist item' })
    .max(15),
  language: z.string().trim().max(50).optional(),
  entryPoint: z.string().trim().max(100).optional(),
  testCases: z.array(practicalDrillTestCaseSchema).max(20).optional(),
}).strict();

// ─── 3. Micro-Question Schema ─────────────────────────────────

export const roadmapMicroQuestionSchema = z.object({
  id: z.string().trim().min(1).max(100),
  questionText: z.string().trim().min(5).max(1000),
  focus: z.string().trim().min(2).max(120),
  suggestedAnswer: z.string().trim().max(3000).optional(),
}).strict();

// ─── 4. Node / Milestone Definition Schema ────────────────────

export const roadmapNodeDefinitionSchema = z.object({
  id: z.string().trim().min(1).max(100),
  phaseId: z.string().trim().max(100).optional(),
  title: z.string().trim().min(2).max(200),
  subHeader: z.string().trim().max(250).optional(),
  category: z.string().trim().min(2).max(100),
  orderIndex: z.number().int().min(0).max(100),
  estimatedHours: z
    .number()
    .min(1, { message: 'Estimated hours must be at least 1 hour' })
    .max(80, { message: 'Estimated hours cannot exceed 80 hours per milestone' }),
  estimatedMinutes: z.number().int().positive().max(4800).optional(),
  requiresEvidence: z.boolean().default(false),
  requiresAssessment: z.boolean().default(false),
  targetProficiency: z.number().int().min(0).max(100).optional(),
  status: z.enum(['LOCKED', 'IN_PROGRESS', 'MASTERED']).default('LOCKED'),
  score: z.number().int().min(0).max(100).default(0),
  skills: z
    .array(
      z.object({
        name: z.string().trim().min(2).max(120),
        category: z.string().trim().min(2).max(100),
        targetProficiency: z.number().int().min(0).max(100).optional(),
      }).strict()
    )
    .min(1, { message: 'Milestone must be mapped to at least one skill' })
    .max(12),
  prerequisiteNodeIds: z.array(z.string().trim().max(100)).default([]),

  // ── 3-Pillar Content ──
  whatShouldIDo: z.object({
    summary: z.string().trim().min(10).max(3000),
    actionSteps: z
      .array(z.string().trim().min(5).max(800))
      .min(1, { message: 'Must contain at least 1 action step' })
      .max(10),
    mentalModels: z
      .array(z.string().trim().min(5).max(800))
      .min(1, { message: 'Must contain at least 1 mental model' })
      .max(10),
  }).strict(),

  whatIsTheSource: z
    .array(roadmapResourceSourceSchema)
    .min(1, { message: 'Must contain at least 1 verified resource source' })
    .max(10),

  whatIsTheExactThing: roadmapPracticalDrillSchema,

  microQuestions: z
    .array(roadmapMicroQuestionSchema)
    .min(1, { message: 'Milestone must include at least 1 micro-question' })
    .max(4, { message: 'Milestone cannot have more than 4 micro-questions' }),
}).strict();

// ─── 5. Phase Definition Schema ───────────────────────────────

export const roadmapPhaseDefinitionSchema = z.object({
  id: z.string().trim().min(1).max(100),
  title: z.string().trim().min(2).max(200),
  description: z.string().trim().max(2000).optional(),
  orderIndex: z.number().int().min(0).max(20),
  nodes: z
    .array(roadmapNodeDefinitionSchema)
    .min(1, { message: 'Each phase must contain at least 1 milestone node' })
    .max(10),
}).strict();

// ─── 6. Generated AI Roadmap Output Schema ───────────────────

export const generatedRoadmapOutputSchema = z
  .object({
    title: z.string().trim().min(3).max(200),
    description: z.string().trim().max(4000).optional(),
    rolePath: z.string().trim().min(2).max(100),
    targetCompanyTier: z
      .enum(['FAANG', 'Unicorn', 'Tier-1 FinTech', 'High-Growth Startup', 'Enterprise'])
      .default('FAANG'),
    difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'STAFF']).default('INTERMEDIATE'),
    estimatedWeeks: z
      .number()
      .int()
      .min(1, { message: 'Estimated timeline must be at least 1 week' })
      .max(104, { message: 'Estimated timeline cannot exceed 104 weeks (2 years)' }),
    phases: z
      .array(roadmapPhaseDefinitionSchema)
      .min(3, { message: 'Generated roadmap must contain at least 3 progressive phases' })
      .max(5, { message: 'Generated roadmap cannot exceed 5 phases' }),
  })
  .strict()
  .refine(
    (data) => {
      const totalNodes = data.phases.reduce((acc, phase) => acc + phase.nodes.length, 0);
      return totalNodes >= 3 && totalNodes <= 25;
    },
    {
      message: 'Total milestone nodes across all phases must be between 3 and 25 nodes',
    }
  );

// ─── Inferred Types ───────────────────────────────────────────

export type GeneratedRoadmapOutput = z.infer<typeof generatedRoadmapOutputSchema>;
export type GeneratedPhaseDefinition = z.infer<typeof roadmapPhaseDefinitionSchema>;
export type GeneratedNodeDefinition = z.infer<typeof roadmapNodeDefinitionSchema>;
export type GeneratedResourceSource = z.infer<typeof roadmapResourceSourceSchema>;
export type GeneratedPracticalDrill = z.infer<typeof roadmapPracticalDrillSchema>;
export type GeneratedMicroQuestion = z.infer<typeof roadmapMicroQuestionSchema>;
