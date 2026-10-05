// ═══════════════════════════════════════════════════════════════
// Roadmap Generator Engine — Master Orchestration Layer
// Coordinates Skill Graph, Gap Analysis, AI Generation,
// Fallback Synthesis, and Transactional Persistence
// ═══════════════════════════════════════════════════════════════

import {
  RoadmapGenerationInput,
  RoadmapGenerationResult,
  SkillGapAnalysisResult,
  CareerRoadmapDTO,
  RoadmapTier,
  RoadmapLevel,
} from '@ru-ready/shared';
import {
  skillGraphEngine,
  SkillGraphEngine,
} from './skill-graph.engine.js';
import {
  skillGapAnalyzer,
  SkillGapAnalyzer,
} from './skill-gap.analyzer.js';
import {
  buildRoadmapSystemPrompt,
  buildRoadmapUserPrompt,
  RoadmapPromptPayload,
} from '../ai/prompt-templates.js';
import {
  roadmapAIClient,
  RoadmapAIClient,
} from '../ai/ai-client.js';
import {
  fallbackRoadmapSynthesizer,
  FallbackRoadmapSynthesizer,
} from './fallback-roadmap.synthesizer.js';
import {
  roadmapPersistenceService,
  RoadmapPersistenceService,
} from '../persistence/roadmap.persistence.js';
import {
  TrustedBackendContext,
} from '../mappers/roadmap.mapper.js';
import { GeneratedRoadmapOutput } from '../validators/roadmap-generation.validator.js';
import { BadRequestError } from '../lib/errors.js';

export interface GenerateRoadmapExecutionResult extends RoadmapGenerationResult {
  generationSource: 'AI' | 'FALLBACK';
}

export interface RoadmapGeneratorEngineOptions {
  skillGraphEngine?: SkillGraphEngine;
  skillGapAnalyzer?: SkillGapAnalyzer;
  aiClient?: RoadmapAIClient;
  fallbackSynthesizer?: FallbackRoadmapSynthesizer;
  persistenceService?: RoadmapPersistenceService;
}

export class RoadmapGeneratorEngine {
  private graphEngine: SkillGraphEngine;
  private gapAnalyzer: SkillGapAnalyzer;
  private aiClient: RoadmapAIClient;
  private fallbackSynthesizer: FallbackRoadmapSynthesizer;
  private persistenceService: RoadmapPersistenceService;

  constructor(options?: RoadmapGeneratorEngineOptions) {
    this.graphEngine = options?.skillGraphEngine || skillGraphEngine;
    this.gapAnalyzer = options?.skillGapAnalyzer || skillGapAnalyzer;
    this.aiClient = options?.aiClient || roadmapAIClient;
    this.fallbackSynthesizer = options?.fallbackSynthesizer || fallbackRoadmapSynthesizer;
    this.persistenceService = options?.persistenceService || roadmapPersistenceService;
  }

  /**
   * Main generation orchestration method.
   * Executes the full pipeline:
   * Graph Resolution -> Gap Analysis -> Prompt Building -> AI Generation (with retry)
   * -> Graceful Fallback (if AI fails) -> Atomic Persistence -> DTO Result.
   */
  public async generateRoadmap(
    input: RoadmapGenerationInput,
    backendContext: TrustedBackendContext
  ): Promise<GenerateRoadmapExecutionResult> {
    if (!input || !input.targetRole || typeof input.targetRole !== 'string' || !input.targetRole.trim()) {
      throw new BadRequestError('targetRole must be a non-empty string');
    }

    if (!backendContext || !backendContext.userId) {
      throw new BadRequestError('Trusted backendContext with a valid userId is required');
    }

    const tier: RoadmapTier = (['FAANG', 'Unicorn', 'Tier-1 FinTech', 'High-Growth Startup', 'Enterprise'].includes(
      input.targetCompanyTier as RoadmapTier
    )
      ? (input.targetCompanyTier as RoadmapTier)
      : 'FAANG');

    const level: RoadmapLevel = (['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'STAFF'].includes(
      input.currentLevel as RoadmapLevel
    )
      ? (input.currentLevel as RoadmapLevel)
      : 'INTERMEDIATE');

    const timelineWeeks = Math.max(1, Math.min(104, Math.round(input.timelineWeeks || 12)));
    const hoursPerDay = Math.max(0.5, Math.min(16, input.hoursPerDay || 2));
    const daysPerWeek = Math.max(1, Math.min(7, input.daysPerWeek || 5));
    const weeklyHours = Math.round(hoursPerDay * daysPerWeek);

    // ── Step 1: Normalize role & resolve canonical skills ──
    const canonicalKey = this.graphEngine.normalizeRole(input.targetRole);
    const resolvedRoleSkills = this.graphEngine.resolveRoleSkills(canonicalKey, tier);

    // ── Step 2: Build topological skill graph & DAG depth layers ──
    const expandedSkills = this.graphEngine.expandWithPrerequisites(
      resolvedRoleSkills.map((r) => r.skill.slug)
    );
    const orderedSkills = this.graphEngine.getTopologicalOrder(expandedSkills);
    const depthMap = this.graphEngine.calculateSkillDepths(orderedSkills);

    const depthLayers: Record<number, string[]> = {};
    for (const skill of orderedSkills) {
      const depth = depthMap.get(skill.slug) || 0;
      if (!depthLayers[depth]) {
        depthLayers[depth] = [];
      }
      depthLayers[depth].push(skill.name);
    }

    // ── Step 3: Analyze skill gaps & readiness baseline ──
    const gapAnalysis: SkillGapAnalysisResult = this.gapAnalyzer.analyzeSkillGap({
      targetRole: canonicalKey,
      requiredSkills: resolvedRoleSkills,
      userEvidence: (input as any).userEvidence,
      knownSkillNames: input.knownSkills,
      identifiedBlindspots: input.identifiedBlindspots,
    });

    const missingSkills = gapAnalysis.skillGaps
      .filter((g) => g.currentProficiency < g.requiredProficiency)
      .map((g) => g.skillName);

    // ── Step 4 & 5: Construct AI Prompts and Execute AI Generation ──
    const roleTitle = this.getRoleDisplayTitle(canonicalKey);
    const promptPayload: RoadmapPromptPayload = {
      role: canonicalKey.toLowerCase(),
      targetRoleTitle: roleTitle,
      tier,
      level,
      timelineWeeks,
      weeklyHours,
      requiredSkills: resolvedRoleSkills.map((s) => s.skill.name),
      missingSkills: missingSkills.length > 0 ? missingSkills : resolvedRoleSkills.map((s) => s.skill.name),
      prerequisiteOrder: orderedSkills.map((s) => s.name),
      depthLayers,
      focusAreas: input.focusAreas,
      knownSkills: input.knownSkills,
      identifiedBlindspots: input.identifiedBlindspots,
      preferredTechnologies: input.preferredTechnologies,
      targetCompany: input.targetCompany,
      targetOutcome: input.targetOutcome,
    };

    let generatedRoadmap: GeneratedRoadmapOutput | null = null;
    let generationSource: 'AI' | 'FALLBACK' = 'AI';
    let modelUsed = 'gpt-4o';

    try {
      const systemPrompt = buildRoadmapSystemPrompt();
      const userPrompt = buildRoadmapUserPrompt(promptPayload);

      generatedRoadmap = await this.aiClient.generateRoadmap(systemPrompt, userPrompt);
      generationSource = 'AI';
      modelUsed = 'gpt-4o';
    } catch (aiErr: any) {
      console.warn(
        `[RoadmapGeneratorEngine] AI generation failed (${aiErr.message || 'retries exhausted'}). Triggering deterministic fallback synthesizer.`
      );

      // ── Step 6: Fallback Synthesizer Activation ──
      generatedRoadmap = this.fallbackSynthesizer.synthesizeRoadmap({
        targetRole: canonicalKey,
        targetCompanyTier: tier,
        level,
        timelineWeeks,
        weeklyHours,
        userEvidence: (input as any).userEvidence,
        knownSkills: input.knownSkills,
        identifiedBlindspots: input.identifiedBlindspots,
        focusAreas: input.focusAreas,
      });

      generationSource = 'FALLBACK';
      modelUsed = 'deterministic-synthesizer-v1';
    }

    // ── Step 7: Enrich trusted backend context ──
    const enrichedBackendContext: TrustedBackendContext = {
      ...backendContext,
      overallReadiness: gapAnalysis.overallReadinessBaseline,
      isAiGenerated: true,
    };

    // ── Step 8: Transactional Database Persistence ──
    const persistedRoadmapDTO: CareerRoadmapDTO = await this.persistenceService.persistRoadmap({
      generatedRoadmap,
      backendContext: enrichedBackendContext,
      customTechStack: input.preferredTechnologies
        ? { preferredTechnologies: input.preferredTechnologies }
        : undefined,
      goal: {
        targetRole: input.targetRole,
        outcome: input.targetOutcome || `Achieve career mastery for ${roleTitle}`,
        targetCompany: input.targetCompany,
        deadline: input.timelineWeeks
          ? new Date(Date.now() + input.timelineWeeks * 7 * 24 * 60 * 60 * 1000)
          : undefined,
        difficulty: level === 'STAFF' ? 'ADVANCED' : level,
        estimatedWeeks: timelineWeeks,
        freeOnly: input.freeOnly,
        budgetCents: input.budgetCents,
        currency: input.currency || 'INR',
      },
    });

    // ── Step 9: Assemble final generation result ──
    const totalMilestones = persistedRoadmapDTO.nodesData?.length || 0;
    const totalPhases = persistedRoadmapDTO.phases?.length || 0;
    const estimatedTotalHours = (persistedRoadmapDTO.nodesData || []).reduce(
      (sum, node) => sum + (node.estimatedHours || 1),
      0
    );

    return {
      roadmap: persistedRoadmapDTO,
      skillGapAnalysis: gapAnalysis,
      generationMetadata: {
        modelUsed,
        totalPhases,
        totalMilestones,
        estimatedTotalHours,
        generatedAt: new Date().toISOString(),
      },
      generationSource,
    };
  }

  private getRoleDisplayTitle(canonicalKey: string): string {
    const map: Record<string, string> = {
      FULLSTACK: 'Senior Full Stack & Cloud Systems Architect',
      FRONTEND: 'Senior Frontend & Web Application Architect',
      BACKEND: 'High-Throughput Backend & Distributed Systems Engineer',
      DATA_SCIENTIST: 'Lead Data Scientist & Applied Machine Learning Specialist',
      DATA_ANALYST: 'Senior Data & Business Intelligence Analyst',
      AIML: 'Generative AI, LLM & RAG Systems Engineer',
      DEVOPS: 'Cloud Native DevOps & Site Reliability Engineer',
      SYSTEM_DESIGN: 'Staff Distributed System Architect',
    };
    return map[canonicalKey] || canonicalKey;
  }
}

export const roadmapGeneratorEngine = new RoadmapGeneratorEngine();
