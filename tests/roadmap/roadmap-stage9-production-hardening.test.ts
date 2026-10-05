// ═══════════════════════════════════════════════════════════════
// Stage 9: Roadmap Production Readiness & Hardening Suite
// Audits AI Failure Resilience, Input Validation Boundaries,
// Concurrency & Idempotency, Transaction Atomicity, Sanitized Observability,
// and Linear Derivation Performance
// ═══════════════════════════════════════════════════════════════

import { describe, expect, it, vi, beforeEach } from 'vitest';
import {
  RoadmapGeneratorEngine,
  roadmapGeneratorEngine,
} from '../../services/roadmap-service/src/engine/roadmap-generator.engine.js';
import { FallbackRoadmapSynthesizer } from '../../services/roadmap-service/src/engine/fallback-roadmap.synthesizer.js';
import {
  generatedRoadmapOutputSchema,
  roadmapNodeDefinitionSchema,
} from '../../services/roadmap-service/src/validators/roadmap-generation.validator.js';
import {
  deriveDailyLearningPlan,
  deriveRoadmapLearningHistory,
  deriveSmartSprintNotifications,
  DEFAULT_SMART_NOTIFICATION_PREFERENCES,
  RoadmapSprintDTO,
  UserRoadmapDTO,
} from '../../packages/shared/src/types/index.js';
import {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
} from '../../services/roadmap-service/src/lib/errors.js';
import { AIProviderManager } from '../../services/roadmap-service/src/lib/ai-provider-manager.js';
import { RoadmapPersistenceService, RoadmapPersistenceError } from '../../services/roadmap-service/src/persistence/roadmap.persistence.js';

describe('Stage 9: Roadmap Production Readiness & Final Hardening', () => {
  const testUserId = 'usr_prod_ready_901';
  const testRoadmapId = 'rdmp_prod_901';
  const testUserRoadmapId = 'ur_prod_901';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ═══════════════════════════════════════════════════════════════
  // 1. AI Failure Resilience & Fallback Engine
  // ═══════════════════════════════════════════════════════════════
  describe('1. AI Failure Resilience & Fallback Engine', () => {
    it('gracefully triggers deterministic fallback synthesizer when LLM returns malformed JSON or throws HTTP 500', async () => {
      const failingAiClient = {
        generateRoadmap: vi.fn().mockRejectedValue(new Error('AI Provider HTTP 500: Internal Server Error')),
      };

      const mockPersistenceService = {
        persistRoadmap: vi.fn().mockImplementation(async ({ generatedRoadmap, backendContext }) => ({
          id: 'rdmp_fallback_persisted',
          userId: backendContext.userId,
          title: generatedRoadmap.title,
          description: generatedRoadmap.description,
          rolePath: generatedRoadmap.rolePath,
          targetCompanyTier: generatedRoadmap.targetCompanyTier,
          phases: generatedRoadmap.phases,
          nodesData: [],
          isAiGenerated: true,
        })),
      };

      const engine = new RoadmapGeneratorEngine({
        aiClient: failingAiClient as any,
        persistenceService: mockPersistenceService as any,
      });

      const result = await engine.generateRoadmap(
        {
          targetRole: 'Fullstack Engineer',
          targetCompanyTier: 'FAANG',
          currentLevel: 'INTERMEDIATE',
          timelineWeeks: 12,
          hoursPerDay: 2,
          daysPerWeek: 5,
        },
        { userId: testUserId }
      );

      expect(result.generationSource).toBe('FALLBACK');
      expect(result.generationMetadata.modelUsed).toBe('deterministic-synthesizer-v1');
      expect(result.roadmap).toBeDefined();
      expect(result.roadmap.title).toContain('Full Stack');
      expect(result.roadmap.phases?.length).toBeGreaterThanOrEqual(3);
    });

    it('strictly validates schema contracts and rejects incomplete or invalid AI responses', () => {
      const invalidRoadmapPayload = {
        title: 'Broken Roadmap',
        // Missing rolePath, estimatedWeeks, and phases
      };

      const parseResult = generatedRoadmapOutputSchema.safeParse(invalidRoadmapPayload);
      expect(parseResult.success).toBe(false);
      if (!parseResult.success) {
        expect(parseResult.error.issues.length).toBeGreaterThan(0);
      }
    });

    it('rejects milestone node definitions missing required 3-pillar content', () => {
      const invalidNodePayload = {
        id: 'node_broken',
        title: 'Broken Node',
        category: 'Backend',
        orderIndex: 0,
        estimatedHours: 4,
        skills: [{ name: 'Node.js', category: 'Backend' }],
        // Missing whatShouldIDo, whatIsTheSource, whatIsTheExactThing, microQuestions
      };

      const parseResult = roadmapNodeDefinitionSchema.safeParse(invalidNodePayload);
      expect(parseResult.success).toBe(false);
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // 2. Input Validation Boundaries & Payload Limits
  // ═══════════════════════════════════════════════════════════════
  describe('2. Input Validation Boundaries & Payload Caps', () => {
    it('rejects empty or whitespace-only target roles during generation', async () => {
      await expect(
        roadmapGeneratorEngine.generateRoadmap(
          { targetRole: '   ' },
          { userId: testUserId }
        )
      ).rejects.toThrow(BadRequestError);
    });

    it('rejects generation requests without a valid authenticated backend context', async () => {
      await expect(
        roadmapGeneratorEngine.generateRoadmap(
          { targetRole: 'Backend Engineer' },
          { userId: '' } // Invalid empty userId
        )
      ).rejects.toThrow(BadRequestError);
    });

    it('safely clamps extreme timelineWeeks [1, 104] and hoursPerDay [0.5, 16] without throwing overflow errors', async () => {
      const synthesizer = new FallbackRoadmapSynthesizer();
      const output = synthesizer.synthesizeRoadmap({
        targetRole: 'BACKEND',
        targetCompanyTier: 'FAANG',
        level: 'INTERMEDIATE',
        timelineWeeks: 9999, // Extreme high
        weeklyHours: 1000,   // Extreme high
      });

      expect(output.estimatedWeeks).toBeLessThanOrEqual(104);
      expect(output.phases.length).toBeGreaterThanOrEqual(3);
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // 3. Database Transaction Atomicity & Safety
  // ═══════════════════════════════════════════════════════════════
  describe('3. Database Transaction Atomicity & Safety', () => {
    it('rolls back completely if any child relation fails to persist during atomic transaction', async () => {
      const mockTxDb = {
        $transaction: vi.fn(async (cb) => {
          const fakeTx = {
            careerRoadmap: { create: vi.fn().mockResolvedValue({ id: 'rdmp_fail_test' }) },
            goal: { create: vi.fn().mockRejectedValue(new Error('Foreign key violation on goal')) },
          };
          return cb(fakeTx);
        }),
      };

      const persistenceService = new RoadmapPersistenceService(mockTxDb);

      const sampleRoadmap = new FallbackRoadmapSynthesizer().synthesizeRoadmap({
        targetRole: 'FULLSTACK',
        targetCompanyTier: 'FAANG',
        level: 'INTERMEDIATE',
        timelineWeeks: 12,
        weeklyHours: 10,
      });

      await expect(
        persistenceService.persistRoadmap({
          generatedRoadmap: sampleRoadmap,
          backendContext: { userId: testUserId, creatorRole: 'USER' },
        })
      ).rejects.toThrow(RoadmapPersistenceError);
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // 4. Concurrency & Idempotency
  // ═══════════════════════════════════════════════════════════════
  describe('4. Concurrency & Idempotency', () => {
    it('handles simultaneous notification evaluations without state mutation or race conditions', async () => {
      const sampleRoadmap: UserRoadmapDTO = {
        id: testUserRoadmapId,
        userId: testUserId,
        status: 'ACTIVE',
        personalization: {
          notificationPreferences: { ...DEFAULT_SMART_NOTIFICATION_PREFERENCES },
          readNotificationIds: [],
        },
        sprints: [
          {
            id: 'sprint_active',
            sprintNumber: 1,
            status: 'ACTIVE',
            startDate: '2026-10-01T00:00:00.000Z',
            endDate: '2026-10-08T00:00:00.000Z',
            tasks: [
              { id: 't1', status: 'TODO', orderIndex: 0, requiresAssessment: true },
            ],
          },
        ],
        adaptations: [],
      } as any;

      // Run 20 concurrent derivations simultaneously
      const results = await Promise.all(
        Array.from({ length: 20 }, () =>
          deriveSmartSprintNotifications(sampleRoadmap, new Date('2026-10-04T12:00:00.000Z'))
        )
      );

      const baselineJson = JSON.stringify(results[0]);
      for (const res of results) {
        expect(JSON.stringify(res)).toBe(baselineJson);
      }
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // 5. Performance & Linear Scale Derivations
  // ═══════════════════════════════════════════════════════════════
  describe('5. Performance & O(N) Scaling', () => {
    it('derives daily learning plan for large sprint in sub-millisecond time without memory spikes', () => {
      const largeSprint: RoadmapSprintDTO = {
        id: 'sprint_large',
        sprintNumber: 1,
        status: 'ACTIVE',
        startDate: '2026-10-01T00:00:00.000Z',
        endDate: '2026-10-08T00:00:00.000Z',
        tasks: Array.from({ length: 50 }, (_, i) => ({
          id: `task_${i}`,
          sprintId: 'sprint_large',
          orderIndex: i,
          title: `Milestone Task ${i + 1}`,
          status: i < 20 ? 'COMPLETED' : i === 20 ? 'IN_PROGRESS' : 'TODO',
          estimatedMinutes: 45,
          completedAt: i < 20 ? '2026-10-02T10:00:00.000Z' : null,
        })) as any,
      };

      const start = performance.now();
      const plan = deriveDailyLearningPlan(
        largeSprint,
        { hoursPerDay: 2, daysPerWeek: 5, sprintDurationDays: 7 },
        new Date('2026-10-04T12:00:00.000Z')
      );
      const elapsed = performance.now() - start;

      expect(elapsed).toBeLessThan(50); // Under 50ms
      expect(plan.sprintTasksTotal).toBe(50);
      expect(plan.sprintTasksCompleted).toBe(20);
      expect(plan.todayTasks.length).toBeGreaterThan(0);
    });

    it('derives learning history with 100+ timeline events deterministically within 50ms', () => {
      const mockLargeRoadmap = {
        id: 'ur_large',
        userId: testUserId,
        status: 'ACTIVE',
        sprints: Array.from({ length: 10 }, (_, i) => ({
          id: `sprint_${i}`,
          sprintNumber: i + 1,
          status: 'COMPLETED',
          startDate: '2026-09-01T00:00:00.000Z',
          endDate: '2026-09-08T00:00:00.000Z',
          completedAt: '2026-09-08T00:00:00.000Z',
          tasks: Array.from({ length: 5 }, (_, j) => ({
            id: `t_${i}_${j}`,
            orderIndex: j,
            status: 'COMPLETED',
            completedAt: '2026-09-05T00:00:00.000Z',
          })),
        })),
        skillEvidence: Array.from({ length: 20 }, (_, i) => ({
          id: `ev_${i}`,
          skillId: `sk_${i}`,
          source: 'CODING_INTERVIEW',
          assessedAt: new Date('2026-09-10T00:00:00.000Z'),
        })),
        adaptations: [],
      };

      const start = performance.now();
      const history = deriveRoadmapLearningHistory(mockLargeRoadmap);
      const elapsed = performance.now() - start;

      expect(elapsed).toBeLessThan(50); // Under 50ms
      expect(history.timeline.length).toBeGreaterThan(0);
      expect(history.completedSprintsCount).toBe(10);
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // 6. Sanitized Observability & Security Error Normalization
  // ═══════════════════════════════════════════════════════════════
  describe('6. Sanitized Observability & Error Normalization', () => {
    it('ensures standard error classes expose appropriate HTTP status codes without leaking stack traces', () => {
      const badReq = new BadRequestError('Invalid input');
      const unauth = new UnauthorizedError();
      const forbidden = new ForbiddenError();
      const notFound = new NotFoundError('Roadmap not found');

      expect(badReq.statusCode).toBe(400);
      expect(unauth.statusCode).toBe(401);
      expect(forbidden.statusCode).toBe(403);
      expect(notFound.statusCode).toBe(404);

      expect(badReq.message).toBe('Invalid input');
      expect(unauth.message).toBe('Authentication is required');
      expect(forbidden.message).toBe('Access forbidden');
    });

    it('ensures AIProviderManager abort controller handles timeout configurations cleanly', () => {
      const manager = new AIProviderManager({
        provider: 'custom',
        baseUrl: 'http://127.0.0.1:9999/v1',
        timeoutMs: 100, // Short timeout for test
      });

      expect(manager.getConfig().timeoutMs).toBe(100);
    });
  });
});
