// ═══════════════════════════════════════════════════════════════
// Roadmap Generator Engine Tests
// Validates Full Generation Pipeline, AI -> Fallback, and Persistence
// ═══════════════════════════════════════════════════════════════

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  RoadmapGeneratorEngine,
} from '../../services/roadmap-service/src/engine/roadmap-generator.engine.js';
import {
  SkillGraphEngine,
} from '../../services/roadmap-service/src/engine/skill-graph.engine.js';
import {
  SkillGapAnalyzer,
} from '../../services/roadmap-service/src/engine/skill-gap.analyzer.js';
import {
  RoadmapAIClient,
} from '../../services/roadmap-service/src/ai/ai-client.js';
import {
  FallbackRoadmapSynthesizer,
} from '../../services/roadmap-service/src/engine/fallback-roadmap.synthesizer.js';
import {
  RoadmapPersistenceService,
} from '../../services/roadmap-service/src/persistence/roadmap.persistence.js';
import {
  RoadmapGenerationInput,
  CareerRoadmapDTO,
} from '@ru-ready/shared';
import { GeneratedRoadmapOutput } from '../../services/roadmap-service/src/validators/roadmap-generation.validator.js';
import { TrustedBackendContext } from '../../services/roadmap-service/src/mappers/roadmap.mapper.js';
import { BadRequestError } from '../../services/roadmap-service/src/lib/errors.js';

// ─── Fixtures ─────────────────────────────────────────────────

const mockGeneratedRoadmap: GeneratedRoadmapOutput = {
  title: 'Full Stack Web Architecture',
  description: 'AI Generated fullstack curriculum.',
  rolePath: 'fullstack',
  targetCompanyTier: 'FAANG',
  difficulty: 'INTERMEDIATE',
  estimatedWeeks: 12,
  phases: [
    {
      id: 'phase-1',
      title: 'Phase 1: Web Foundation',
      orderIndex: 0,
      nodes: [
        {
          id: 'node-1',
          title: 'JavaScript Core',
          category: 'Programming',
          orderIndex: 0,
          estimatedHours: 15,
          status: 'LOCKED',
          score: 0,
          requiresEvidence: false,
          skills: [{ name: 'JavaScript', category: 'Programming' }],
          prerequisiteNodeIds: [],
          whatShouldIDo: {
            summary: 'Master JS engine runtime.',
            actionSteps: ['Step 1'],
            mentalModels: ['Model 1'],
          },
          whatIsTheSource: [{ id: 's1', title: 'MDN', url: 'https://developer.mozilla.org/en-US/docs/Web', type: 'DOCS' }],
          whatIsTheExactThing: {
            title: 'Polyfill Drill',
            description: 'Implement polyfill',
            deliverable: 'Tested library',
            verificationChecklist: ['Check 1'],
          },
          microQuestions: [{ id: 'q1', questionText: 'What is JS?', focus: 'Runtime' }],
        },
      ],
    },
    {
      id: 'phase-2',
      title: 'Phase 2: Database Systems',
      orderIndex: 1,
      nodes: [
        {
          id: 'node-2',
          title: 'SQL & Indexing',
          category: 'Database',
          orderIndex: 0,
          estimatedHours: 20,
          status: 'LOCKED',
          score: 0,
          requiresEvidence: true,
          skills: [{ name: 'SQL', category: 'Database' }],
          prerequisiteNodeIds: ['node-1'],
          whatShouldIDo: {
            summary: 'Master indexing.',
            actionSteps: ['Step 2'],
            mentalModels: ['Model 2'],
          },
          whatIsTheSource: [{ id: 's2', title: 'PG', url: 'https://www.postgresql.org/docs/current/', type: 'DOCS' }],
          whatIsTheExactThing: {
            title: 'SQL Drill',
            description: 'Write queries',
            deliverable: 'Tested SQL',
            verificationChecklist: ['Check 2'],
          },
          microQuestions: [{ id: 'q2', questionText: 'What is B-Tree?', focus: 'Index' }],
        },
      ],
    },
    {
      id: 'phase-3',
      title: 'Phase 3: Distributed Systems',
      orderIndex: 2,
      nodes: [
        {
          id: 'node-3',
          title: 'Redis Caching',
          category: 'System Design',
          orderIndex: 0,
          estimatedHours: 25,
          status: 'LOCKED',
          score: 0,
          requiresEvidence: true,
          skills: [{ name: 'Redis', category: 'System Design' }],
          prerequisiteNodeIds: ['node-2'],
          whatShouldIDo: {
            summary: 'Master caching.',
            actionSteps: ['Step 3'],
            mentalModels: ['Model 3'],
          },
          whatIsTheSource: [{ id: 's3', title: 'Redis', url: 'https://redis.io/docs/latest/', type: 'DOCS' }],
          whatIsTheExactThing: {
            title: 'Redis Drill',
            description: 'Write cache decorator',
            deliverable: 'Tested module',
            verificationChecklist: ['Check 3'],
          },
          microQuestions: [{ id: 'q3', questionText: 'What is XFetch?', focus: 'Cache' }],
        },
      ],
    },
  ],
};

const mockPersistedDTO: CareerRoadmapDTO = {
  id: 'rdmp_persisted_123',
  userId: 'user_auth_777',
  title: 'Full Stack Web Architecture',
  description: 'AI Generated fullstack curriculum.',
  rolePath: 'fullstack',
  targetCompanyTier: 'FAANG',
  difficulty: 'INTERMEDIATE',
  overallReadiness: 45,
  estimatedWeeks: 12,
  isOfficial: false,
  isPublic: true,
  isAiGenerated: true,
  creatorId: 'user_auth_777',
  enrolledCount: 0,
  upvotes: 0,
  tags: [],
  phases: [],
  nodesData: [
    {
      id: 'node-1',
      title: 'JavaScript Core',
      category: 'Programming',
      orderIndex: 0,
      estimatedHours: 15,
      status: 'LOCKED',
      score: 0,
      skills: [{ name: 'JavaScript', category: 'Programming' }],
      whatShouldIDo: { summary: 'Summary', actionSteps: [], mentalModels: [] },
      whatIsTheSource: [],
      whatIsTheExactThing: { title: 'Drill', description: 'Desc', deliverable: 'Deliv', verificationChecklist: [] },
      microQuestions: [],
    },
  ],
  createdAt: '2026-09-30T10:00:00.000Z',
  updatedAt: '2026-09-30T10:00:00.000Z',
};

const mockTrustedBackendContext: TrustedBackendContext = {
  id: 'ctx_id_123',
  userId: 'user_auth_777',
  isOfficial: false,
  isPublic: true,
  creatorId: 'user_auth_777',
};

// ─── Test Suite ───────────────────────────────────────────────

describe('RoadmapGeneratorEngine', () => {
  let mockGraphEngine: SkillGraphEngine;
  let mockGapAnalyzer: SkillGapAnalyzer;
  let mockAiClient: RoadmapAIClient;
  let mockFallbackSynthesizer: FallbackRoadmapSynthesizer;
  let mockPersistenceService: RoadmapPersistenceService;
  let engine: RoadmapGeneratorEngine;

  beforeEach(() => {
    mockGraphEngine = new SkillGraphEngine();
    mockGapAnalyzer = new SkillGapAnalyzer();

    mockAiClient = {
      generateRoadmap: vi.fn().mockResolvedValue(mockGeneratedRoadmap),
      isRetryableError: vi.fn(),
    } as unknown as RoadmapAIClient;

    mockFallbackSynthesizer = {
      synthesizeRoadmap: vi.fn().mockReturnValue(mockGeneratedRoadmap),
    } as unknown as FallbackRoadmapSynthesizer;

    mockPersistenceService = {
      persistRoadmap: vi.fn().mockResolvedValue(mockPersistedDTO),
    } as unknown as RoadmapPersistenceService;

    engine = new RoadmapGeneratorEngine({
      skillGraphEngine: mockGraphEngine,
      skillGapAnalyzer: mockGapAnalyzer,
      aiClient: mockAiClient,
      fallbackSynthesizer: mockFallbackSynthesizer,
      persistenceService: mockPersistenceService,
    });
  });

  // ─── 1. Successful AI Generation ────────────────────────────

  it('1. should coordinate successful AI generation pipeline end-to-end', async () => {
    const input: RoadmapGenerationInput = {
      targetRole: 'fullstack',
      targetCompanyTier: 'FAANG',
      currentLevel: 'INTERMEDIATE',
      timelineWeeks: 12,
      hoursPerDay: 2,
      daysPerWeek: 5,
    };

    const result = await engine.generateRoadmap(input, mockTrustedBackendContext);

    expect(result).toBeDefined();
    expect(result.generationSource).toBe('AI');
    expect(result.generationMetadata.modelUsed).toBe('gpt-4o');
    expect(result.roadmap.id).toBe('rdmp_persisted_123');
    expect(result.skillGapAnalysis).toBeDefined();
    expect(mockAiClient.generateRoadmap).toHaveBeenCalledTimes(1);
    expect(mockPersistenceService.persistRoadmap).toHaveBeenCalledTimes(1);
    expect(mockFallbackSynthesizer.synthesizeRoadmap).not.toHaveBeenCalled();
  });

  it('2. should correctly normalize role and resolve canonical skills', async () => {
    const normalizeSpy = vi.spyOn(mockGraphEngine, 'normalizeRole');
    const resolveSpy = vi.spyOn(mockGraphEngine, 'resolveRoleSkills');

    await engine.generateRoadmap(
      { targetRole: 'Senior Fullstack Web Engineer' },
      mockTrustedBackendContext
    );

    expect(normalizeSpy).toHaveBeenCalledWith('Senior Fullstack Web Engineer');
    expect(resolveSpy).toHaveBeenCalledWith('FULLSTACK', 'FAANG');
  });

  it('3. should perform topological skill ordering and DAG depth calculation', async () => {
    const topoOrderSpy = vi.spyOn(mockGraphEngine, 'getTopologicalOrder');
    const depthSpy = vi.spyOn(mockGraphEngine, 'calculateSkillDepths');

    await engine.generateRoadmap({ targetRole: 'backend' }, mockTrustedBackendContext);

    expect(topoOrderSpy).toHaveBeenCalled();
    expect(depthSpy).toHaveBeenCalledTimes(1);
  });

  it('4. should analyze skill gaps and produce readiness baseline', async () => {
    const gapSpy = vi.spyOn(mockGapAnalyzer, 'analyzeSkillGap');

    const result = await engine.generateRoadmap(
      {
        targetRole: 'aiml',
        knownSkills: ['Python', 'SQL'],
        identifiedBlindspots: ['Vector Search'],
      },
      mockTrustedBackendContext
    );

    expect(gapSpy).toHaveBeenCalledTimes(1);
    expect(result.skillGapAnalysis.targetRole).toBe('AIML');
    expect(result.skillGapAnalysis.overallReadinessBaseline).toBeGreaterThanOrEqual(0);
  });

  // ─── 2. Graceful Degradation to Fallback ─────────────────────

  it('5. should trigger fallback synthesizer when AI client fails after retries', async () => {
    mockAiClient.generateRoadmap = vi
      .fn()
      .mockRejectedValue(new Error('AI Provider HTTP 500: Server Error'));

    const result = await engine.generateRoadmap(
      { targetRole: 'devops' },
      mockTrustedBackendContext
    );

    expect(result.generationSource).toBe('FALLBACK');
    expect(result.generationMetadata.modelUsed).toBe('deterministic-synthesizer-v1');
    expect(mockFallbackSynthesizer.synthesizeRoadmap).toHaveBeenCalledTimes(1);
    expect(mockPersistenceService.persistRoadmap).toHaveBeenCalledTimes(1);
  });

  it('6. should succeed and persist when AI is in mock mode (bypasses to fallback)', async () => {
    mockAiClient.generateRoadmap = vi
      .fn()
      .mockRejectedValue(new Error('AI Provider is configured in mock mode.'));

    const result = await engine.generateRoadmap(
      { targetRole: 'system_design' },
      mockTrustedBackendContext
    );

    expect(result.generationSource).toBe('FALLBACK');
    expect(result.roadmap).toBeDefined();
  });

  // ─── 3. Error Handling & Validation ─────────────────────────

  it('7. should throw BadRequestError when targetRole is missing or empty, and accept open-ended roles', async () => {
    await expect(
      engine.generateRoadmap({ targetRole: '' }, mockTrustedBackendContext)
    ).rejects.toThrowError(BadRequestError);

    await expect(
      engine.generateRoadmap({ targetRole: '   ' }, mockTrustedBackendContext)
    ).rejects.toThrowError(BadRequestError);

    // Open-ended roles should succeed without throwing
    const result = await engine.generateRoadmap({ targetRole: 'Cloud Security Architect' }, mockTrustedBackendContext);
    expect(result.roadmap).toBeDefined();
    expect(result.skillGapAnalysis.targetRole).toBe('Cloud Security Architect');
  });

  it('8. should throw BadRequestError when backendContext has no userId', async () => {
    await expect(
      engine.generateRoadmap({ targetRole: 'fullstack' }, { id: '1', userId: '' })
    ).rejects.toThrowError('Trusted backendContext with a valid userId is required');
  });

  it('9. should propagate persistence service failure cleanly', async () => {
    mockPersistenceService.persistRoadmap = vi
      .fn()
      .mockRejectedValue(new Error('Database transaction connection error'));

    await expect(
      engine.generateRoadmap({ targetRole: 'fullstack' }, mockTrustedBackendContext)
    ).rejects.toThrow('Database transaction connection error');
  });

  // ─── 4. Security & Dependency Isolation ─────────────────────

  it('10. should not allow AI output to override trusted backendContext userId or isOfficial', async () => {
    let capturedPersistenceParams: any = null;
    mockPersistenceService.persistRoadmap = vi.fn().mockImplementation(async (params) => {
      capturedPersistenceParams = params;
      return mockPersistedDTO;
    });

    await engine.generateRoadmap(
      { targetRole: 'fullstack' },
      { id: 'sec_1', userId: 'strictly_authenticated_user', isOfficial: false }
    );

    expect(capturedPersistenceParams.backendContext.userId).toBe('strictly_authenticated_user');
    expect(capturedPersistenceParams.backendContext.isOfficial).toBe(false);
  });
});
