import { describe, expect, it, vi, beforeEach } from 'vitest';
import { roadmapController } from '../../services/roadmap-service/src/controllers/roadmap.controller.js';
import { roadmapService } from '../../services/roadmap-service/src/services/roadmap.service.js';
import { roadmapGeneratorEngine } from '../../services/roadmap-service/src/engine/roadmap-generator.engine.js';
import { BadRequestError, UnauthorizedError } from '../../services/roadmap-service/src/lib/errors.js';
import { RoadmapGenerationInput, RoadmapGenerationResult } from '@ru-ready/shared';

describe('Roadmap API Integration (Controller & Service)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  function createMockReqRes(options: {
    headers?: Record<string, string | string[] | undefined>;
    body?: any;
  }) {
    const req: any = {
      headers: options.headers || {},
      body: options.body || {},
    };

    let statusCode = 200;
    let jsonResponse: any = null;

    const res: any = {
      status: vi.fn((code: number) => {
        statusCode = code;
        return res;
      }),
      json: vi.fn((data: any) => {
        jsonResponse = data;
        return res;
      }),
    };

    const next = vi.fn();

    return {
      req,
      res,
      next,
      getStatusCode: () => statusCode,
      getJsonResponse: () => jsonResponse,
    };
  }

  const mockSuccessfulEngineResult: RoadmapGenerationResult = {
    roadmap: {
      id: 'rdmp_test_12345',
      title: 'Senior Fullstack Web Engineer Mastery Path',
      rolePath: 'FULLSTACK',
      category: 'FULLSTACK',
      targetCompanyTier: 'FAANG',
      difficulty: 'Advanced',
      description: 'AI-generated curriculum for Fullstack Engineer',
      estimatedWeeks: 12,
      isOfficial: false,
      isPublic: true,
      isAiGenerated: true,
      creatorId: 'usr_auth_999',
      creatorName: 'Alex Rivers',
      creatorUsername: 'alex_rivers',
      creatorAvatar: 'https://avatar.com/alex.png',
      creatorRole: 'Aspiring Fullstack Engineer',
      overallReadiness: 25,
      enrolledCount: 1,
      upvotes: 0,
      tags: ['React', 'Node.js', 'PostgreSQL'],
      nodesData: [
        {
          id: 'node-1',
          title: 'Frontend Architecture',
          subHeader: 'Phase 1 • Milestone 1',
          category: 'Frontend Core',
          orderIndex: 1,
          status: 'IN_PROGRESS',
          score: 35,
          estimatedHours: 20,
          whatShouldIDo: {
            summary: 'Build high performance React apps',
            actionSteps: ['Step 1'],
            mentalModels: ['Model 1'],
          },
          whatIsTheSource: [
            {
              id: 'src-1',
              title: 'React Docs',
              url: 'https://react.dev',
              type: 'DOCS',
            },
          ],
          whatIsTheExactThing: {
            title: 'Orderbook UI',
            description: 'Build an orderbook',
            deliverable: 'A working app',
            verificationChecklist: ['Runs smoothly'],
          },
          microQuestions: [
            {
              id: 'mq-1',
              questionText: 'What is Fiber?',
              focus: 'React',
              suggestedAnswer: 'Reconciliation algorithm',
            },
          ],
        },
      ],
      createdAt: '2026-09-30T00:00:00.000Z',
      updatedAt: '2026-09-30T00:00:00.000Z',
    },
    skillGapAnalysis: {
      targetRole: 'FULLSTACK',
      totalRequiredSkills: 10,
      masteredSkillsCount: 2,
      unmetSkillsCount: 8,
      overallReadinessBaseline: 20,
      skillGaps: [],
    },
    generationMetadata: {
      modelUsed: 'mock-llm',
      totalPhases: 1,
      totalMilestones: 1,
      estimatedTotalHours: 20,
      generatedAt: '2026-09-30T00:00:00.000Z',
    },
    generationSource: 'AI',
  };

  it('1. Authenticated valid request succeeds with status 201 and expected response structure', async () => {
    vi.spyOn(roadmapGeneratorEngine, 'generateRoadmap').mockResolvedValue(mockSuccessfulEngineResult);

    const { req, res, next, getStatusCode, getJsonResponse } = createMockReqRes({
      headers: {
        'x-user-id': 'usr_auth_999',
        'x-user-name': 'Alex Rivers',
        'x-user-username': 'alex_rivers',
        'x-user-avatar': 'https://avatar.com/alex.png',
      },
      body: {
        targetRole: 'FULLSTACK',
        targetCompanyTier: 'FAANG',
        timelineWeeks: 12,
        hoursPerDay: 3,
        daysPerWeek: 5,
        knownSkills: ['JavaScript', 'HTML/CSS'],
        identifiedBlindspots: ['Distributed Caching'],
      },
    });

    await roadmapController.generateRoadmap(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(getStatusCode()).toBe(201);
    const response = getJsonResponse();
    expect(response.success).toBe(true);
    expect(response.data.roadmap.id).toBe('rdmp_test_12345');
    expect(response.data.roadmap.creatorId).toBe('usr_auth_999');
    expect(response.data.generationSource).toBe('AI');
    expect(response.data.skillGapAnalysis.targetRole).toBe('FULLSTACK');
  });

  it('2. Missing authentication is rejected with UnauthorizedError (401)', async () => {
    const { req, res, next } = createMockReqRes({
      headers: {}, // No x-user-id header
      body: { targetRole: 'FULLSTACK' },
    });

    await roadmapController.generateRoadmap(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(UnauthorizedError);
    expect(err.statusCode).toBe(401);
  });

  it('3. Invalid request body (missing both targetRole and rolePath) is rejected with BadRequestError (400)', async () => {
    const { req, res, next } = createMockReqRes({
      headers: { 'x-user-id': 'usr_auth_123' },
      body: { hoursPerDay: 5 }, // No role specified
    });

    await roadmapController.generateRoadmap(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(BadRequestError);
    expect(err.statusCode).toBe(400);
    expect(err.message).toContain('Invalid generation request');
  });

  it('4. Unsupported / unparseable role is rejected cleanly with 400', async () => {
    const { req, res, next } = createMockReqRes({
      headers: { 'x-user-id': 'usr_auth_123' },
      body: { targetRole: 'X' }, // Too short (min 2 chars)
    });

    await roadmapController.generateRoadmap(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(BadRequestError);
    expect(err.statusCode).toBe(400);
  });

  it('5. GeneratorEngine is called with correct input parameters', async () => {
    const engineSpy = vi.spyOn(roadmapGeneratorEngine, 'generateRoadmap').mockResolvedValue(mockSuccessfulEngineResult);

    const { req, res, next } = createMockReqRes({
      headers: { 'x-user-id': 'usr_test_555' },
      body: {
        targetRole: 'BACKEND',
        targetCompany: 'Google',
        targetCompanyTier: 'FAANG',
        currentLevel: 'INTERMEDIATE',
        timelineWeeks: 8,
        hoursPerDay: 2,
        daysPerWeek: 6,
        knownSkills: ['Node.js', 'PostgreSQL'],
        identifiedBlindspots: ['Kafka'],
        focusAreas: ['System Design'],
        preferredTechnologies: ['TypeScript'],
        pedagogicalPriority: 'PROJECTS',
      },
    });

    await roadmapController.generateRoadmap(req, res, next);

    expect(engineSpy).toHaveBeenCalledTimes(1);
    const [passedInput, passedContext] = engineSpy.mock.calls[0];

    expect(passedInput.targetRole).toBe('BACKEND');
    expect(passedInput.targetCompany).toBe('Google');
    expect(passedInput.timelineWeeks).toBe(8);
    expect(passedInput.hoursPerDay).toBe(2);
    expect(passedInput.daysPerWeek).toBe(6);
    expect(passedInput.knownSkills).toEqual(['Node.js', 'PostgreSQL']);
    expect(passedInput.identifiedBlindspots).toEqual(['Kafka']);
    expect(passedInput.pedagogicalPriority).toBe('PROJECTS');
    expect(passedContext.userId).toBe('usr_test_555');
  });

  it('6. Authenticated user ID is passed into TrustedBackendContext', async () => {
    const engineSpy = vi.spyOn(roadmapGeneratorEngine, 'generateRoadmap').mockResolvedValue(mockSuccessfulEngineResult);

    const { req, res, next } = createMockReqRes({
      headers: {
        'x-user-id': 'usr_secure_authenticated_777',
        'x-user-name': 'Jane Doe',
        'x-user-username': 'janedoe',
      },
      body: { targetRole: 'FULLSTACK' },
    });

    await roadmapController.generateRoadmap(req, res, next);

    expect(engineSpy).toHaveBeenCalledTimes(1);
    const [, passedContext] = engineSpy.mock.calls[0];
    expect(passedContext.userId).toBe('usr_secure_authenticated_777');
    expect(passedContext.creatorId).toBe('usr_secure_authenticated_777');
    expect(passedContext.creatorName).toBe('Jane Doe');
    expect(passedContext.creatorUsername).toBe('janedoe');
  });

  it('7. Request body cannot override authenticated user ID or creatorId', async () => {
    const engineSpy = vi.spyOn(roadmapGeneratorEngine, 'generateRoadmap').mockResolvedValue(mockSuccessfulEngineResult);

    const { req, res, next } = createMockReqRes({
      headers: { 'x-user-id': 'usr_real_999' },
      body: {
        targetRole: 'FULLSTACK',
        userId: 'hacker_trying_to_impersonate',
        creatorId: 'fake_creator_id',
      },
    });

    await roadmapController.generateRoadmap(req, res, next);

    expect(engineSpy).toHaveBeenCalledTimes(1);
    const [, passedContext] = engineSpy.mock.calls[0];
    expect(passedContext.userId).toBe('usr_real_999');
    expect(passedContext.creatorId).toBe('usr_real_999');
  });

  it('8. AI generation path returns expected complete response structure', async () => {
    vi.spyOn(roadmapGeneratorEngine, 'generateRoadmap').mockResolvedValue(mockSuccessfulEngineResult);

    const result = await roadmapService.generateRoadmap('usr_123', {
      targetRole: 'FULLSTACK',
      targetCompanyTier: 'FAANG',
    });

    expect(result.generationSource).toBe('AI');
    expect(result.roadmap.title).toBe('Senior Fullstack Web Engineer Mastery Path');
    expect(result.skillGapAnalysis.totalRequiredSkills).toBe(10);
    expect(result.generationMetadata.modelUsed).toBe('mock-llm');
  });

  it('9. Fallback generation path returns expected valid fallback response when engine throws non-BadRequestError', async () => {
    vi.spyOn(roadmapGeneratorEngine, 'generateRoadmap').mockRejectedValue(
      new Error('Engine unexpected failure')
    );

    const result = await roadmapService.generateRoadmap('usr_123', {
      targetRole: 'FULLSTACK',
      targetCompanyTier: 'FAANG',
    });

    expect(result.generationSource).toBe('FALLBACK');
    expect(result.generationMetadata.modelUsed).toBe('legacy-template');
    expect(result.roadmap.rolePath).toBe('FULLSTACK');
    expect(result.roadmap.nodesData.length).toBeGreaterThan(0);
    expect(result.skillGapAnalysis.targetRole).toBe('FULLSTACK');
  });

  it('10. Persistence failure or BadRequestError propagates as 400', async () => {
    vi.spyOn(roadmapGeneratorEngine, 'generateRoadmap').mockRejectedValue(
      new BadRequestError('Role is not supported by skill taxonomy')
    );

    const { req, res, next } = createMockReqRes({
      headers: { 'x-user-id': 'usr_test_123' },
      body: { targetRole: 'FULLSTACK' },
    });

    await roadmapController.generateRoadmap(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(BadRequestError);
    expect(err.statusCode).toBe(400);
    expect(err.message).toBe('Role is not supported by skill taxonomy');
  });

  it('11. Legacy frontend payload ({ rolePath, targetCompanyTier, customTechStack }) remains 100% compatible', async () => {
    const engineSpy = vi.spyOn(roadmapGeneratorEngine, 'generateRoadmap').mockResolvedValue(mockSuccessfulEngineResult);

    const { req, res, next, getStatusCode, getJsonResponse } = createMockReqRes({
      headers: { 'x-user-id': 'usr_legacy_client' },
      body: {
        rolePath: 'FULLSTACK',
        targetCompanyTier: 'FAANG',
        customTechStack: {
          tech_0: 'React',
          tech_1: 'Node.js',
        },
      },
    });

    await roadmapController.generateRoadmap(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(getStatusCode()).toBe(201);
    expect(engineSpy).toHaveBeenCalledTimes(1);
    const [passedInput] = engineSpy.mock.calls[0];
    expect(passedInput.targetRole).toBe('FULLSTACK');
    expect(passedInput.preferredTechnologies).toContain('React');
    expect(passedInput.preferredTechnologies).toContain('Node.js');
    expect(getJsonResponse().success).toBe(true);
  });
});
