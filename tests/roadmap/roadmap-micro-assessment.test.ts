import { describe, expect, it, vi, beforeEach } from 'vitest';
import { roadmapController } from '../../services/roadmap-service/src/controllers/roadmap.controller.js';
import { microAssessmentService } from '../../services/roadmap-service/src/services/micro-assessment.service.js';
import { evaluateAssessmentAnswers, submitAssessmentSchema } from '../../services/roadmap-service/src/domain/roadmap.domain.js';
import { prisma } from '../../services/roadmap-service/src/lib/prisma.js';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../../services/roadmap-service/src/lib/errors.js';
import { useRoadmapStore } from '../../client/src/store/useRoadmapStore.js';
import { roadmapApi } from '../../client/src/api/roadmap.js';

describe('Stage 5.1: Micro-Assessment Foundation', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    microAssessmentService.clearMemory();
  });

  function createMockReqRes(options: {
    headers?: Record<string, string | string[] | undefined>;
    params?: Record<string, string>;
    query?: Record<string, string>;
    body?: any;
  }) {
    const req: any = {
      headers: options.headers || {},
      params: options.params || {},
      query: options.query || {},
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

  const mockAssessmentData = {
    id: 'assess-fs-1',
    title: 'React Fiber Concurrency Assessment',
    description: 'Verify understanding of concurrent rendering lanes and fiber trees',
    roadmapNodeId: 'node-fs-1',
    skillId: 'skill-react-fiber',
    skillName: 'React Fiber',
    questions: [
      {
        id: 'q1',
        questionText: 'What is the primary role of the React Fiber reconciler?',
        options: [
          'Enable incremental and interruptible rendering of component trees',
          'Replace the browser DOM entirely',
          'Execute backend database queries directly',
          'Convert CSS to WebGL shaders',
        ],
        correctOptionIndex: 0,
        explanation: 'React Fiber allows incremental rendering by breaking rendering work into units of work.',
      },
      {
        id: 'q2',
        questionText: 'Which phase of React Fiber execution is synchronous and atomic?',
        options: ['Render phase', 'Commit phase', 'Reconciliation phase', 'Diffing phase'],
        correctOptionIndex: 1,
        explanation: 'The commit phase applies DOM mutations synchronously and cannot be interrupted.',
      },
    ],
    createdAt: new Date(),
  };

  describe('1. Micro-Assessment Service: getAssessment & sanitization', () => {
    it('should retrieve an assessment and sanitize questions (hide correctOptionIndex & explanation)', async () => {
      microAssessmentService.seedAssessment(mockAssessmentData);

      const sanitized = await microAssessmentService.getAssessment('assess-fs-1');

      expect(sanitized).toBeDefined();
      expect(sanitized.id).toBe('assess-fs-1');
      expect(sanitized.title).toBe('React Fiber Concurrency Assessment');
      expect(sanitized.questions.length).toBe(2);

      // Verify that answers and explanations are NOT exposed before submission
      for (const q of sanitized.questions) {
        expect((q as any).correctOptionIndex).toBeUndefined();
        expect((q as any).explanation).toBeUndefined();
        expect(q.options.length).toBe(4);
      }
    });

    it('should throw NotFoundError if assessment is missing', async () => {
      vi.spyOn(prisma.microAssessment, 'findUnique').mockResolvedValue(null);

      await expect(microAssessmentService.getAssessment('non-existent')).rejects.toThrow(NotFoundError);
    });

    it('should create and return synthesized assessment for a roadmap node if none exists', async () => {
      const assessment = await microAssessmentService.getOrCreateAssessmentForNode('node-fs-2', 'skill-node-io');

      expect(assessment).toBeDefined();
      expect(assessment.roadmapNodeId).toBe('node-fs-2');
      expect(assessment.questions.length).toBeGreaterThanOrEqual(2);
      expect((assessment.questions[0] as any).correctOptionIndex).toBeUndefined();
    });
  });

  describe('2. Micro-Assessment Domain: evaluateAssessmentAnswers()', () => {
    it('should compute exact correct count, percentage score, and passed status (>= 70%)', () => {
      const questions = mockAssessmentData.questions;

      // Perfect score (2/2 = 100%)
      const perfectSubmission = [
        { questionId: 'q1', selectedOptionIndex: 0 },
        { questionId: 'q2', selectedOptionIndex: 1 },
      ];
      const perfectResult = evaluateAssessmentAnswers(questions, perfectSubmission);
      expect(perfectResult.totalQuestions).toBe(2);
      expect(perfectResult.correctAnswers).toBe(2);
      expect(perfectResult.score).toBe(100);
      expect(perfectResult.passed).toBe(true);
      expect(perfectResult.questionResults[0].isCorrect).toBe(true);
      expect(perfectResult.questionResults[1].isCorrect).toBe(true);

      // Partial score (1/2 = 50% -> failed)
      const partialSubmission = [
        { questionId: 'q1', selectedOptionIndex: 0 },
        { questionId: 'q2', selectedOptionIndex: 0 }, // wrong
      ];
      const partialResult = evaluateAssessmentAnswers(questions, partialSubmission);
      expect(partialResult.correctAnswers).toBe(1);
      expect(partialResult.score).toBe(50);
      expect(partialResult.passed).toBe(false);
      expect(partialResult.questionResults[1].isCorrect).toBe(false);
      expect(partialResult.questionResults[1].correctOptionIndex).toBe(1);
      expect(partialResult.questionResults[1].explanation).toBe(
        'The commit phase applies DOM mutations synchronously and cannot be interrupted.'
      );
    });
  });

  describe('3. Micro-Assessment Service: submitAssessment() validation & scoring', () => {
    it('should evaluate server-side, persist attempt, and return full result with explanations', async () => {
      microAssessmentService.seedAssessment(mockAssessmentData);

      const result = await microAssessmentService.submitAssessment('user-1', {
        assessmentId: 'assess-fs-1',
        answers: [
          { questionId: 'q1', selectedOptionIndex: 0 },
          { questionId: 'q2', selectedOptionIndex: 1 },
        ],
      });

      expect(result).toBeDefined();
      expect(result.score).toBe(100);
      expect(result.passed).toBe(true);
      expect(result.correctAnswers).toBe(2);
      expect(result.totalQuestions).toBe(2);
      expect(result.questionResults[0].explanation).toBeDefined();

      const attempts = await microAssessmentService.getUserAttempts('user-1', 'assess-fs-1');
      expect(attempts.length).toBe(1);
      expect(attempts[0].score).toBe(100);
    });

    it('should reject submission if question does not belong to the assessment', async () => {
      microAssessmentService.seedAssessment(mockAssessmentData);

      await expect(
        microAssessmentService.submitAssessment('user-1', {
          assessmentId: 'assess-fs-1',
          answers: [{ questionId: 'invalid-q-99', selectedOptionIndex: 0 }],
        })
      ).rejects.toThrow(BadRequestError);
    });

    it('should reject invalid input payload with empty answers', async () => {
      await expect(
        microAssessmentService.submitAssessment('user-1', {
          assessmentId: 'assess-fs-1',
          answers: [],
        })
      ).rejects.toThrow();
    });

    it('should record SkillEvidence when userRoadmapId and skillId are provided', async () => {
      microAssessmentService.seedAssessment(mockAssessmentData);

      vi.spyOn(prisma.userRoadmap, 'findFirst').mockResolvedValue({
        id: 'ur-101',
        userId: 'user-1',
        sourceRoadmap: { nodes: [] },
      } as any);

      vi.spyOn(prisma.microAssessmentAttempt, 'create').mockResolvedValue({} as any);

      const createEvidenceSpy = vi.spyOn(prisma.skillEvidence, 'create').mockResolvedValue({
        id: 'ev-101',
        userRoadmapId: 'ur-101',
        skillId: 'skill-react-fiber',
        source: 'ASSESSMENT',
        demonstratedScore: 100,
      } as any);


      const result = await microAssessmentService.submitAssessment('user-1', {
        assessmentId: 'assess-fs-1',
        userRoadmapId: 'ur-101',
        skillId: 'skill-react-fiber',
        answers: [
          { questionId: 'q1', selectedOptionIndex: 0 },
          { questionId: 'q2', selectedOptionIndex: 1 },
        ],
      });

      expect(result.evidenceRecorded).toBe(true);
      expect(createEvidenceSpy).toHaveBeenCalled();
    });

    it('should support multiple consecutive attempts and store history', async () => {
      microAssessmentService.seedAssessment(mockAssessmentData);

      // Attempt 1: Failed
      const res1 = await microAssessmentService.submitAssessment('user-1', {
        assessmentId: 'assess-fs-1',
        answers: [
          { questionId: 'q1', selectedOptionIndex: 3 },
          { questionId: 'q2', selectedOptionIndex: 3 },
        ],
      });
      expect(res1.score).toBe(0);
      expect(res1.passed).toBe(false);

      // Attempt 2: Mastered
      const res2 = await microAssessmentService.submitAssessment('user-1', {
        assessmentId: 'assess-fs-1',
        answers: [
          { questionId: 'q1', selectedOptionIndex: 0 },
          { questionId: 'q2', selectedOptionIndex: 1 },
        ],
      });
      expect(res2.score).toBe(100);
      expect(res2.passed).toBe(true);

      const userAttempts = await microAssessmentService.getUserAttempts('user-1', 'assess-fs-1');
      expect(userAttempts.length).toBe(2);
    });
  });

  describe('4. Roadmap Controller: Assessment Endpoints', () => {
    it('GET /assessments/:assessmentId returns 200 with sanitized assessment', async () => {
      microAssessmentService.seedAssessment(mockAssessmentData);

      const { req, res, next, getStatusCode, getJsonResponse } = createMockReqRes({
        headers: { 'x-user-id': 'user-1' },
        params: { assessmentId: 'assess-fs-1' },
      });

      await roadmapController.getAssessmentById(req, res, next);

      expect(getStatusCode()).toBe(200);
      const json = getJsonResponse();
      expect(json.success).toBe(true);
      expect(json.data.id).toBe('assess-fs-1');
      expect(json.data.questions.length).toBe(2);
      expect(json.data.questions[0].correctOptionIndex).toBeUndefined();
    });

    it('GET /assessments/nodes/:nodeId returns 200 with node assessment', async () => {
      const { req, res, next, getStatusCode, getJsonResponse } = createMockReqRes({
        headers: { 'x-user-id': 'user-1' },
        params: { nodeId: 'node-fs-1' },
      });

      await roadmapController.getAssessmentForNode(req, res, next);

      expect(getStatusCode()).toBe(200);
      const json = getJsonResponse();
      expect(json.success).toBe(true);
      expect(json.data.roadmapNodeId).toBe('node-fs-1');
    });

    it('POST /assessments/submit returns 201 with grading result', async () => {
      microAssessmentService.seedAssessment(mockAssessmentData);

      const { req, res, next, getStatusCode, getJsonResponse } = createMockReqRes({
        headers: { 'x-user-id': 'user-1' },
        body: {
          assessmentId: 'assess-fs-1',
          answers: [
            { questionId: 'q1', selectedOptionIndex: 0 },
            { questionId: 'q2', selectedOptionIndex: 1 },
          ],
        },
      });

      await roadmapController.submitAssessment(req, res, next);

      expect(getStatusCode()).toBe(201);
      const json = getJsonResponse();
      expect(json.success).toBe(true);
      expect(json.data.score).toBe(100);
      expect(json.data.passed).toBe(true);
    });

    it('rejects unauthenticated request to submit assessment', async () => {
      const { req, res, next } = createMockReqRes({
        headers: {},
        body: { assessmentId: 'assess-fs-1', answers: [] },
      });

      await roadmapController.submitAssessment(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });
  });

  describe('5. Frontend Zustand Store: Micro-Assessment Actions', () => {
    it('fetchAssessmentForNode updates currentAssessment in store', async () => {
      vi.spyOn(roadmapApi, 'getAssessmentForNode').mockResolvedValue({
        id: 'mock-assessment-1',
        title: 'Mock Assessment',
        description: 'Mock Description',
        roadmapNodeId: 'node-1',
        skillId: 'skill-1',
        questions: [{ id: 'q1', questionText: 'Q1', options: ['A', 'B'], orderIndex: 0 }],
        createdAt: new Date().toISOString(),
      });

      const assessment = await useRoadmapStore.getState().fetchAssessmentForNode('node-1', 'skill-1');

      expect(assessment).toBeDefined();
      expect(useRoadmapStore.getState().currentAssessment?.id).toBe('mock-assessment-1');
      expect(useRoadmapStore.getState().isAssessmentLoading).toBe(false);
    });

    it('submitAssessmentAnswers records result and updates activeUserRoadmap skillEvidence', async () => {
      const mockResult = {
        id: 'att-101',
        assessmentId: 'mock-assessment-1',
        userId: 'user-1',
        userRoadmapId: 'ur-101',
        skillId: 'skill-1',
        totalQuestions: 2,
        correctAnswers: 2,
        score: 100,
        passed: true,
        questionResults: [],
        evidenceRecorded: true,
        completedAt: new Date().toISOString(),
      };

      vi.spyOn(roadmapApi, 'submitAssessment').mockResolvedValue(mockResult);

      // Preload activeUserRoadmap in store
      useRoadmapStore.setState({
        activeUserRoadmap: {
          id: 'ur-101',
          userId: 'user-1',
          sourceRoadmapId: 'road-1',
          status: 'ACTIVE',
          personalization: { targetRole: 'Fullstack', hoursPerDay: 1.5, daysPerWeek: 5, sprintDurationDays: 7 },
          sprints: [],
          skillEvidence: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          sourceRoadmap: {} as any,
        },
      });

      const response = await useRoadmapStore.getState().submitAssessmentAnswers({
        assessmentId: 'mock-assessment-1',
        userRoadmapId: 'ur-101',
        skillId: 'skill-1',
        answers: [{ questionId: 'q1', selectedOptionIndex: 0 }],
      });

      expect(response.success).toBe(true);
      expect(response.result?.score).toBe(100);

      const storeState = useRoadmapStore.getState();
      expect(storeState.assessmentResults['att-101']).toBeDefined();
      expect(storeState.activeUserRoadmap?.skillEvidence?.length).toBe(1);
      expect(storeState.activeUserRoadmap?.skillEvidence?.[0].source).toBe('ASSESSMENT');
    });

    it('handles backend submission errors gracefully without corrupting state', async () => {
      vi.spyOn(roadmapApi, 'submitAssessment').mockRejectedValue(new Error('Assessment server error'));

      const response = await useRoadmapStore.getState().submitAssessmentAnswers({
        assessmentId: 'invalid-assessment',
        answers: [{ questionId: 'q1', selectedOptionIndex: 0 }],
      });

      expect(response.success).toBe(false);
      expect(response.error).toBe('Assessment server error');
    });
  });
});
