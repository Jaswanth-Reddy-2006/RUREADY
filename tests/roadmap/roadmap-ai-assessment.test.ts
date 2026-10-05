import { describe, expect, it, vi, beforeEach } from 'vitest';
import { microAssessmentService } from '../../services/roadmap-service/src/services/micro-assessment.service.js';
import { roadmapAIClient } from '../../services/roadmap-service/src/ai/ai-client.js';
import { aiProviderManager } from '../../services/roadmap-service/src/lib/ai-provider-manager.js';
import {
  generatedAssessmentOutputSchema,
  generatedAssessmentQuestionSchema,
} from '../../services/roadmap-service/src/validators/assessment-generation.validator.js';
import {
  parseAndValidateAssessmentAIResponse,
  RoadmapParserError,
} from '../../services/roadmap-service/src/ai/response-parser.js';
import {
  buildAssessmentSystemPrompt,
  buildAssessmentUserPrompt,
} from '../../services/roadmap-service/src/ai/prompt-templates.js';

describe('Stage 5.3: AI-Powered Assessment Generation', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    microAssessmentService.clearMemory();
  });

  const validAIQuestionsPayload = {
    title: 'Redis Caching & Concurrency Assessment',
    description: 'Verify practical proficiency in Redis cluster replication and key eviction.',
    questions: [
      {
        questionText: 'Which eviction policy evicts the least recently used keys out of all keys with an expire set?',
        questionType: 'MULTIPLE_CHOICE' as const,
        options: ['allkeys-lru', 'volatile-lru', 'volatile-random', 'noeviction'],
        correctOptionIndex: 1,
        explanation: 'volatile-lru evicts keys by testing LRU among only keys with an expiration TTL set.',
        difficulty: 'MEDIUM' as const,
      },
      {
        questionText: 'How does Redis handle master-replica replication backlog upon network reconnection?',
        questionType: 'MULTIPLE_CHOICE' as const,
        options: [
          'Full resync via RDB dump only',
          'Partial resynchronization using replication ID and byte offset in the backlog buffer',
          'Discarding all replica data without resync',
          'Restarting all nodes synchronously',
        ],
        correctOptionIndex: 1,
        explanation: 'Redis PSYNC uses the master replication ID and byte offset to stream only missed delta commands.',
        difficulty: 'HARD' as const,
      },
      {
        questionText: 'What is the time complexity of the Redis ZADD command when inserting M elements into a Sorted Set with N elements?',
        questionType: 'MULTIPLE_CHOICE' as const,
        options: ['O(1)', 'O(M*log(N))', 'O(N^2)', 'O(M+N)'],
        correctOptionIndex: 1,
        explanation: 'Each element insertion in a skiplist takes O(log N), so M elements take O(M*log(N)).',
        difficulty: 'MEDIUM' as const,
      },
    ],
  };

  describe('1. Prompt Architecture & Sanitization', () => {
    it('1a. builds robust system prompt containing strict evaluation and MCQ integrity rules', () => {
      const systemPrompt = buildAssessmentSystemPrompt();
      expect(systemPrompt).toContain('Principal Technical Assessment Evaluator');
      expect(systemPrompt).toContain('MULTIPLE-CHOICE INTEGRITY');
      expect(systemPrompt).toContain('correctOptionIndex');
      expect(systemPrompt).toContain('OUTPUT FORMAT DIRECTIVE');
    });

    it('1b. builds sanitized user prompt stripping dangerous tokens and delimiters', () => {
      const userPrompt = buildAssessmentUserPrompt({
        skillName: 'Redis <script>alert("hack")</script> {{template}} ${inject}',
        skillCategory: 'Databases & Caching',
        nodeTitle: 'Distributed Cache Invalidation',
        nodeDescription: 'Deep dive into cache stampede prevention.',
        targetRole: 'Staff Infrastructure Engineer',
        level: 'ADVANCED',
        questionCount: 3,
      });

      expect(userPrompt).toContain('Primary Skill: Redis');
      expect(userPrompt).not.toContain('<script>');
      expect(userPrompt).not.toContain('{{template}}');
      expect(userPrompt).not.toContain('${inject}');
      expect(userPrompt).toContain('Staff Infrastructure Engineer');
      expect(userPrompt).toContain('Number of Questions Required: 3');
    });
  });

  describe('2. Schema Validation & Semantic Integrity Checks', () => {
    it('2a. validates valid AI assessment output schema', () => {
      const parsed = generatedAssessmentOutputSchema.parse(validAIQuestionsPayload);
      expect(parsed.questions.length).toBe(3);
      expect(parsed.questions[0].correctOptionIndex).toBe(1);
    });

    it('2b. rejects question when correctOptionIndex is out of options bounds (>= options.length)', () => {
      const invalidQuestion = {
        questionText: 'What is the concurrency model of Node.js?',
        questionType: 'MULTIPLE_CHOICE' as const,
        options: ['Single-threaded event loop with libuv worker pool', 'Multi-threaded kernel processes'],
        correctOptionIndex: 5, // Invalid index
        explanation: 'Node.js utilizes a single-threaded JS execution model with libuv threadpool for async I/O.',
      };

      const result = generatedAssessmentQuestionSchema.safeParse(invalidQuestion);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('correctOptionIndex must be a valid index');
      }
    });

    it('2c. rejects question with duplicate option choices', () => {
      const duplicateOptionsQuestion = {
        questionText: 'What is the primary purpose of an index in PostgreSQL?',
        questionType: 'MULTIPLE_CHOICE' as const,
        options: ['Speed up queries', 'Speed up queries', 'Increase disk storage'],
        correctOptionIndex: 0,
        explanation: 'Indexes optimize search and filtering query performance.',
      };

      const result = generatedAssessmentQuestionSchema.safeParse(duplicateOptionsQuestion);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('duplicate entries');
      }
    });

    it('2d. rejects assessment with duplicate question texts', () => {
      const duplicateQuestionsAssessment = {
        title: 'Duplicate Questions Test',
        questions: [
          {
            questionText: 'What is optimistic locking?',
            questionType: 'MULTIPLE_CHOICE' as const,
            options: ['Version/Timestamp comparison at commit', 'Pessimistic table lock'],
            correctOptionIndex: 0,
            explanation: 'Optimistic locking validates record versions at write time.',
          },
          {
            questionText: 'What is optimistic locking?', // Duplicate
            questionType: 'MULTIPLE_CHOICE' as const,
            options: ['Locking rows on read', 'Exclusive table lock'],
            correctOptionIndex: 0,
            explanation: 'Repeated question.',
          },
        ],
      };

      const result = generatedAssessmentOutputSchema.safeParse(duplicateQuestionsAssessment);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('duplicate questions');
      }
    });

    it('2e. rejects malformed JSON or empty string in parseAndValidateAssessmentAIResponse', () => {
      expect(() => parseAndValidateAssessmentAIResponse('')).toThrow(RoadmapParserError);
      expect(() => parseAndValidateAssessmentAIResponse('Not JSON')).toThrow(RoadmapParserError);
      expect(() => parseAndValidateAssessmentAIResponse('{"title": "Broken", "questions": []}')).toThrow(RoadmapParserError);
    });

    it('2f. extracts and parses JSON even with markdown code fence wrappers', () => {
      const rawWithFences = `\`\`\`json\n${JSON.stringify(validAIQuestionsPayload)}\n\`\`\``;
      const parsed = parseAndValidateAssessmentAIResponse(rawWithFences);
      expect(parsed.title).toBe(validAIQuestionsPayload.title);
      expect(parsed.questions.length).toBe(3);
    });
  });

  describe('3. RoadmapAIClient: generateAssessment() with Retries', () => {
    it('3a. generates validated assessment when AI provider succeeds', async () => {
      vi.spyOn(aiProviderManager, 'getConfig').mockReturnValue({
        provider: 'gemini',
        model: 'gemini-1.5-pro',
        timeoutMs: 5000,
        temperature: 0.2,
      });

      vi.spyOn(aiProviderManager, 'callChatCompletion').mockResolvedValue(
        JSON.stringify(validAIQuestionsPayload)
      );

      const result = await roadmapAIClient.generateAssessment('system', 'user');

      expect(result).toBeDefined();
      expect(result.title).toBe('Redis Caching & Concurrency Assessment');
      expect(result.questions.length).toBe(3);
    });

    it('3b. retries and recovers from transient JSON syntax errors in LLM output', async () => {
      vi.spyOn(aiProviderManager, 'getConfig').mockReturnValue({
        provider: 'gemini',
        model: 'gemini-1.5-pro',
        timeoutMs: 5000,
        temperature: 0.2,
      });

      vi.spyOn(aiProviderManager, 'callChatCompletion')
        .mockResolvedValueOnce('Broken { invalid json')
        .mockResolvedValueOnce(JSON.stringify(validAIQuestionsPayload));

      const result = await roadmapAIClient.generateAssessment('system', 'user', {
        retryConfig: { maxRetries: 2, initialBackoffMs: 1 },
      });

      expect(result.questions.length).toBe(3);
      expect(aiProviderManager.callChatCompletion).toHaveBeenCalledTimes(2);
    });

    it('3c. throws if provider is configured in mock mode', async () => {
      vi.spyOn(aiProviderManager, 'getConfig').mockReturnValue({
        provider: 'mock',
        model: 'mock',
        timeoutMs: 5000,
        temperature: 0.2,
      });

      await expect(roadmapAIClient.generateAssessment('system', 'user')).rejects.toThrow(
        'AI Provider is configured in mock mode'
      );
    });
  });

  describe('4. MicroAssessmentService: AI Generation with Deterministic Fallback', () => {
    it('4a. generates and sanitizes AI questions when AI provider succeeds', async () => {
      vi.spyOn(roadmapAIClient, 'generateAssessment').mockResolvedValue(validAIQuestionsPayload);

      const assessmentDTO = await microAssessmentService.getOrCreateAssessmentForNode(
        'node-redis-101',
        'skill-redis'
      );

      expect(assessmentDTO.id).toBeDefined();
      expect(assessmentDTO.title).toBe('Redis Caching & Concurrency Assessment');
      expect(assessmentDTO.questions.length).toBe(3);

      // Sanitization verification: correct answers & explanations must NOT be present in GET DTO
      for (const q of assessmentDTO.questions) {
        expect((q as any).correctOptionIndex).toBeUndefined();
        expect((q as any).explanation).toBeUndefined();
        expect(q.options.length).toBeGreaterThanOrEqual(2);
      }
    });

    it('4b. gracefully falls back to deterministic question bank when AI generation throws', async () => {
      vi.spyOn(roadmapAIClient, 'generateAssessment').mockRejectedValue(
        new Error('LLM rate limit or provider error')
      );

      const assessmentDTO = await microAssessmentService.getOrCreateAssessmentForNode(
        'node-redis-fallback',
        'skill-redis'
      );

      expect(assessmentDTO).toBeDefined();
      expect(assessmentDTO.questions.length).toBeGreaterThanOrEqual(2);
      expect(assessmentDTO.questions[0].questionText).toBeDefined();
      expect((assessmentDTO.questions[0] as any).correctOptionIndex).toBeUndefined();
      expect((assessmentDTO.questions[0] as any).explanation).toBeUndefined();
    });

    it('4c. caches and reuses existing assessment without re-calling AI generator on subsequent requests', async () => {
      const aiSpy = vi.spyOn(roadmapAIClient, 'generateAssessment').mockResolvedValue(validAIQuestionsPayload);

      const firstCall = await microAssessmentService.getOrCreateAssessmentForNode('node-cache-test');
      const secondCall = await microAssessmentService.getOrCreateAssessmentForNode('node-cache-test');

      expect(firstCall.id).toBe(secondCall.id);
      expect(firstCall.title).toBe(secondCall.title);
      // AI generation should have been invoked exactly once
      expect(aiSpy).toHaveBeenCalledTimes(1);
    });

    it('4d. allows learner to submit answers to AI-generated assessment and returns full explanation & adaptation signal', async () => {
      vi.spyOn(roadmapAIClient, 'generateAssessment').mockResolvedValue(validAIQuestionsPayload);

      const assessmentDTO = await microAssessmentService.getOrCreateAssessmentForNode(
        'node-ai-submit-test'
      );

      const q1 = assessmentDTO.questions[0];
      const q2 = assessmentDTO.questions[1];
      const q3 = assessmentDTO.questions[2];

      const submission = await microAssessmentService.submitAssessment('user-learner-1', {
        assessmentId: assessmentDTO.id,
        answers: [
          { questionId: q1.id, selectedOptionIndex: 1 }, // Correct
          { questionId: q2.id, selectedOptionIndex: 1 }, // Correct
          { questionId: q3.id, selectedOptionIndex: 1 }, // Correct
        ],
      });

      expect(submission.score).toBe(100);
      expect(submission.passed).toBe(true);
      expect(submission.correctAnswers).toBe(3);
      expect(submission.questionResults.length).toBe(3);
      // Post-submission, explanations are released
      expect(submission.questionResults[0].explanation).toContain('volatile-lru');
      expect(submission.adaptationRecommendation?.decision).toBe('ACCELERATE');
    });
  });
});
