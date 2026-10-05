// ═══════════════════════════════════════════════════════════════
// AI Client & Prompt System Tests
// Tests Prompts, Sanitization, Response Parser, and Retry Logic
// ═══════════════════════════════════════════════════════════════

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  buildRoadmapSystemPrompt,
  buildRoadmapUserPrompt,
  sanitizePromptInput,
  sanitizeStringArray,
  RoadmapPromptPayload,
} from '../../services/roadmap-service/src/ai/prompt-templates.js';
import {
  parseAndValidateRoadmapAIResponse,
  stripMarkdownFences,
  extractJsonCandidate,
  RoadmapParserError,
} from '../../services/roadmap-service/src/ai/response-parser.js';
import {
  RoadmapAIClient,
  RoadmapAIGenerateOptions,
} from '../../services/roadmap-service/src/ai/ai-client.js';
import { AIProviderManager } from '../../services/roadmap-service/src/lib/ai-provider-manager.js';

// ─── Fixtures ─────────────────────────────────────────────────

const mockValidRoadmapPayload = {
  title: 'Full Stack Web Mastery',
  description: 'A comprehensive path to becoming a Senior Full Stack Engineer.',
  rolePath: 'full-stack-developer',
  targetCompanyTier: 'FAANG' as const,
  difficulty: 'INTERMEDIATE' as const,
  estimatedWeeks: 12,
  phases: [
    {
      id: 'phase-1',
      title: 'Foundation & Core Web Architecture',
      orderIndex: 0,
      nodes: [
        {
          id: 'node-1',
          title: 'Advanced JavaScript Runtime & Concurrency',
          category: 'Core Language',
          orderIndex: 0,
          estimatedHours: 15,
          status: 'LOCKED' as const,
          score: 0,
          requiresEvidence: false,
          skills: [{ name: 'JavaScript', category: 'Language' }],
          prerequisiteNodeIds: [],
          whatShouldIDo: {
            summary: 'Master the JavaScript event loop, microtasks vs macrotasks, and memory management.',
            actionSteps: ['Inspect call stack in Chrome DevTools', 'Build a custom micro-task queue'],
            mentalModels: ['Single-threaded concurrency with non-blocking event loop'],
          },
          whatIsTheSource: [
            {
              id: 'src-1',
              title: 'MDN Event Loop Docs',
              url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop',
              type: 'DOCS' as const,
            },
          ],
          whatIsTheExactThing: {
            title: 'Custom Promise Implementation',
            description: 'Implement a Promises/A+ compliant Promise library from scratch.',
            deliverable: 'A working MyPromise class passing standard test suites.',
            verificationChecklist: ['Supports then chaining', 'Handles async resolve/reject', 'Catches unhandled errors'],
          },
          microQuestions: [
            {
              id: 'q-1',
              questionText: 'What is the execution difference between process.nextTick and setImmediate?',
              focus: 'Event Loop Ordering',
              suggestedAnswer: 'nextTick executes at the end of the current phase before any I/O callbacks.',
            },
          ],
        },
      ],
    },
    {
      id: 'phase-2',
      title: 'Backend Systems & Distributed Caching',
      orderIndex: 1,
      nodes: [
        {
          id: 'node-2',
          title: 'Distributed Caching with Redis',
          category: 'Backend Architecture',
          orderIndex: 0,
          estimatedHours: 20,
          status: 'LOCKED' as const,
          score: 0,
          requiresEvidence: true,
          skills: [{ name: 'Redis', category: 'Database' }],
          prerequisiteNodeIds: ['node-1'],
          whatShouldIDo: {
            summary: 'Implement cache-aside, write-through patterns and mitigate stampedes.',
            actionSteps: ['Set up Redis cluster locally', 'Implement probabilistic cache early expiration'],
            mentalModels: ['Cache vs Source-of-truth consistency trade-offs'],
          },
          whatIsTheSource: [
            {
              id: 'src-2',
              title: 'Redis Official Documentation',
              url: 'https://redis.io/docs/latest/',
              type: 'DOCS' as const,
            },
          ],
          whatIsTheExactThing: {
            title: 'Resilient Cache Decorator',
            description: 'Build a distributed lock and cache manager with Redis and Node.js.',
            deliverable: 'TypeScript module with Redlock and TTL jitter.',
            verificationChecklist: ['Prevents stampedes under 10k RPS', 'Graceful fallback on Redis disconnect'],
          },
          microQuestions: [
            {
              id: 'q-2',
              questionText: 'How does the XFetch algorithm prevent cache stampedes?',
              focus: 'Cache Expiration Algorithms',
              suggestedAnswer: 'It triggers asynchronous early refresh as TTL approaches expiration based on computation delta.',
            },
          ],
        },
      ],
    },
    {
      id: 'phase-3',
      title: 'Production Hardening & System Design',
      orderIndex: 2,
      nodes: [
        {
          id: 'node-3',
          title: 'High-Throughput Message Streaming',
          category: 'Distributed Systems',
          orderIndex: 0,
          estimatedHours: 25,
          status: 'LOCKED' as const,
          score: 0,
          requiresEvidence: true,
          skills: [{ name: 'Kafka', category: 'Streaming' }],
          prerequisiteNodeIds: ['node-2'],
          whatShouldIDo: {
            summary: 'Design event-driven microservices with Kafka partitions and consumer groups.',
            actionSteps: ['Configure multi-broker Kafka cluster', 'Implement idempotent consumer processing'],
            mentalModels: ['Log-centric distributed storage and pub-sub semantics'],
          },
          whatIsTheSource: [
            {
              id: 'src-3',
              title: 'Apache Kafka Architecture Guide',
              url: 'https://kafka.apache.org/documentation/',
              type: 'DOCS' as const,
            },
          ],
          whatIsTheExactThing: {
            title: 'Idempotent Event Ingestion Pipeline',
            description: 'Build an event ingestion pipeline that guarantees exactly-once processing semantics.',
            deliverable: 'Kafka producer and consumer microservice with dead-letter queue.',
            verificationChecklist: ['Zero message loss on broker crash', 'Handles duplicate delivery seamlessly'],
          },
          microQuestions: [
            {
              id: 'q-3',
              questionText: 'Why do Kafka partitions determine consumer group parallelism?',
              focus: 'Kafka Scaling Model',
              suggestedAnswer: 'Each partition is assigned to exactly one consumer within a group to ensure strict message ordering.',
            },
          ],
        },
      ],
    },
  ],
};

// ─── Test Suite ───────────────────────────────────────────────

describe('Roadmap AI Infrastructure & Client', () => {

  // ─── 1. PROMPT & SANITIZATION TESTS ─────────────────────────

  describe('Prompt Templates & Sanitization', () => {
    it('1. should include all required candidate context in user prompt', () => {
      const payload: RoadmapPromptPayload = {
        role: 'backend-engineer',
        targetRoleTitle: 'Senior Backend Engineer',
        tier: 'FAANG',
        level: 'ADVANCED',
        timelineWeeks: 16,
        weeklyHours: 20,
        requiredSkills: ['Node.js', 'PostgreSQL', 'Redis', 'Kafka'],
        missingSkills: ['Redis', 'Kafka'],
        prerequisiteOrder: ['Node.js', 'PostgreSQL', 'Redis', 'Kafka'],
        depthLayers: { 0: ['Node.js', 'PostgreSQL'], 1: ['Redis'], 2: ['Kafka'] },
        targetCompany: 'Google',
        targetOutcome: 'Pass L5 Backend Loop',
      };

      const userPrompt = buildRoadmapUserPrompt(payload);

      expect(userPrompt).toContain('Senior Backend Engineer');
      expect(userPrompt).toContain('FAANG');
      expect(userPrompt).toContain('Google');
      expect(userPrompt).toContain('ADVANCED');
      expect(userPrompt).toContain('16 weeks');
      expect(userPrompt).toContain('20 hours/week');
      expect(userPrompt).toContain('Pass L5 Backend Loop');
    });

    it('2. should present canonical prerequisite ordering in user prompt', () => {
      const payload: RoadmapPromptPayload = {
        role: 'frontend-engineer',
        targetRoleTitle: 'Frontend Engineer',
        tier: 'Unicorn',
        level: 'INTERMEDIATE',
        timelineWeeks: 12,
        weeklyHours: 15,
        requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React', 'Next.js'],
        missingSkills: ['Next.js'],
        prerequisiteOrder: ['HTML', 'CSS', 'JavaScript', 'React', 'Next.js'],
        depthLayers: {},
      };

      const userPrompt = buildRoadmapUserPrompt(payload);
      expect(userPrompt).toContain('HTML → CSS → JavaScript → React → Next.js');
    });

    it('3. should sanitize user-controlled text and strip template delimiters and HTML tags', () => {
      const dirtyString = '<script>alert("hack")</script> {{system_override}} ${process.env.SECRET} Backend Engineer <style>body{}</style>';
      const sanitized = sanitizePromptInput(dirtyString);

      expect(sanitized).not.toContain('<script>');
      expect(sanitized).not.toContain('{{system_override}}');
      expect(sanitized).not.toContain('${process.env.SECRET}');
      expect(sanitized).not.toContain('<style>');
      expect(sanitized).toContain('Backend Engineer');

      const dirtyArray = ['<p>React</p>', '{{inject}} Node.js', 'React'];
      const sanitizedArray = sanitizeStringArray(dirtyArray);
      expect(sanitizedArray).toEqual(['React', 'Node.js']);
    });

    it('4. should keep system prompt independent and not expose candidate data', () => {
      const systemPrompt = buildRoadmapSystemPrompt();
      expect(systemPrompt).toContain('Principal Curriculum Architect');
      expect(systemPrompt).toContain('SKILL GRAPH FIDELITY');
      expect(systemPrompt).toContain('3-PILLAR CURRICULUM PER MILESTONE NODE');
      expect(systemPrompt).not.toContain('Candidate Target Profile');
    });
  });

  // ─── 2. RESPONSE PARSER TESTS ───────────────────────────────

  describe('Response Parser & Validation', () => {
    it('5. should parse valid direct JSON text', () => {
      const jsonText = JSON.stringify(mockValidRoadmapPayload);
      const parsed = parseAndValidateRoadmapAIResponse(jsonText);

      expect(parsed.title).toBe(mockValidRoadmapPayload.title);
      expect(parsed.phases.length).toBe(3);
      expect(parsed.phases[0].nodes[0].whatIsTheExactThing.title).toBe('Custom Promise Implementation');
    });

    it('6. should strip markdown code fences and parse JSON properly', () => {
      const markdownJson = `\`\`\`json\n${JSON.stringify(mockValidRoadmapPayload, null, 2)}\n\`\`\``;
      const stripped = stripMarkdownFences(markdownJson);
      expect(stripped.startsWith('{')).toBe(true);
      expect(stripped.endsWith('}')).toBe(true);

      const parsed = parseAndValidateRoadmapAIResponse(markdownJson);
      expect(parsed.rolePath).toBe('full-stack-developer');
    });

    it('7. should throw INVALID_JSON on unparseable malformed text', () => {
      const invalidJson = '{ title: "Unclosed JSON string, invalid format ';
      expect(() => parseAndValidateRoadmapAIResponse(invalidJson)).toThrowError(RoadmapParserError);
      try {
        parseAndValidateRoadmapAIResponse(invalidJson);
      } catch (err: any) {
        expect(err.code).toBe('INVALID_JSON');
      }
    });

    it('8. should throw EMPTY_RESPONSE on empty or whitespace strings', () => {
      expect(() => parseAndValidateRoadmapAIResponse('')).toThrowError(RoadmapParserError);
      expect(() => parseAndValidateRoadmapAIResponse('   \n  ')).toThrowError(RoadmapParserError);
      try {
        parseAndValidateRoadmapAIResponse('');
      } catch (err: any) {
        expect(err.code).toBe('EMPTY_RESPONSE');
      }
    });

    it('9. should throw SCHEMA_VALIDATION_ERROR when schema constraints are violated', () => {
      const invalidRoadmap = {
        ...mockValidRoadmapPayload,
        phases: [mockValidRoadmapPayload.phases[0]], // Less than minimum 3 phases
      };

      try {
        parseAndValidateRoadmapAIResponse(JSON.stringify(invalidRoadmap));
        expect.unreachable();
      } catch (err: any) {
        expect(err).toBeInstanceOf(RoadmapParserError);
        expect(err.code).toBe('SCHEMA_VALIDATION_ERROR');
        expect(err.zodErrors.length).toBeGreaterThan(0);
      }
    });

    it('10. should validate and pass completely conforming roadmap structures', () => {
      const valid = parseAndValidateRoadmapAIResponse(JSON.stringify(mockValidRoadmapPayload));
      expect(valid.estimatedWeeks).toBe(12);
      expect(valid.phases[0].nodes[0].whatShouldIDo.actionSteps.length).toBeGreaterThan(0);
    });
  });

  // ─── 3. RETRY & ERROR CLASSIFICATION TESTS ──────────────────

  describe('AI Client Retry Policy', () => {
    let mockProviderManager: AIProviderManager;
    let client: RoadmapAIClient;

    beforeEach(() => {
      mockProviderManager = new AIProviderManager({
        provider: 'openai',
        apiKey: 'test-key-12345678901234567890',
        baseUrl: 'https://api.openai.com/v1',
      });
      client = new RoadmapAIClient(mockProviderManager, {
        maxRetries: 2,
        initialBackoffMs: 10, // fast for tests
        backoffMultiplier: 1.5,
      });
    });

    it('11. should identify 429 status as retryable', () => {
      const err = new Error('Rate limit exceeded');
      (err as any).status = 429;
      expect(client.isRetryableError(err)).toBe(true);
    });

    it('12. should identify 500/502/503 status as retryable', () => {
      const err500 = new Error('Internal Server Error');
      (err500 as any).status = 500;
      expect(client.isRetryableError(err500)).toBe(true);

      const err503 = new Error('Service Unavailable');
      (err503 as any).status = 503;
      expect(client.isRetryableError(err503)).toBe(true);
    });

    it('13. should identify network failures and AbortError timeouts as retryable', () => {
      const abortErr = new Error('The operation was aborted');
      abortErr.name = 'AbortError';
      expect(client.isRetryableError(abortErr)).toBe(true);

      const netErr = new Error('TypeError: fetch failed');
      expect(client.isRetryableError(netErr)).toBe(true);
    });

    it('14. should NOT retry on HTTP 400 Bad Request', () => {
      const err400 = new Error('Bad Request: Invalid model parameters');
      (err400 as any).status = 400;
      expect(client.isRetryableError(err400)).toBe(false);
    });

    it('15. should NOT retry on HTTP 401 Unauthorized', () => {
      const err401 = new Error('Unauthorized: Invalid API Key');
      (err401 as any).status = 401;
      expect(client.isRetryableError(err401)).toBe(false);
    });
  });

  // ─── 4. CLIENT EXECUTION TESTS ──────────────────────────────

  describe('RoadmapAIClient Execution', () => {
    it('16. should successfully generate roadmap when provider returns valid response', async () => {
      const mockManager = new AIProviderManager({
        provider: 'openai',
        apiKey: 'test-key-12345678901234567890',
      });

      const callSpy = vi
        .spyOn(mockManager, 'callChatCompletion')
        .mockResolvedValue(JSON.stringify(mockValidRoadmapPayload));

      const client = new RoadmapAIClient(mockManager, { maxRetries: 1, initialBackoffMs: 5 });

      const result = await client.generateRoadmap('system prompt', 'user prompt');
      expect(callSpy).toHaveBeenCalledTimes(1);
      expect(result.title).toBe('Full Stack Web Mastery');
      expect(result.phases.length).toBe(3);
    });

    it('17. should retry transient errors and succeed on subsequent attempt', async () => {
      const mockManager = new AIProviderManager({
        provider: 'openai',
        apiKey: 'test-key-12345678901234567890',
      });

      const transientError = new Error('AI Provider HTTP 429: Too Many Requests');
      (transientError as any).status = 429;

      const callSpy = vi
        .spyOn(mockManager, 'callChatCompletion')
        .mockRejectedValueOnce(transientError)
        .mockResolvedValueOnce(JSON.stringify(mockValidRoadmapPayload));

      const client = new RoadmapAIClient(mockManager, { maxRetries: 2, initialBackoffMs: 5 });

      const result = await client.generateRoadmap('system prompt', 'user prompt');
      expect(callSpy).toHaveBeenCalledTimes(2);
      expect(result.title).toBe('Full Stack Web Mastery');
    });

    it('18. should eventually throw error if retries are exhausted', async () => {
      const mockManager = new AIProviderManager({
        provider: 'openai',
        apiKey: 'test-key-12345678901234567890',
      });

      const err500 = new Error('AI Provider HTTP 500: Server Error');
      (err500 as any).status = 500;

      const callSpy = vi
        .spyOn(mockManager, 'callChatCompletion')
        .mockRejectedValue(err500);

      const client = new RoadmapAIClient(mockManager, { maxRetries: 2, initialBackoffMs: 5 });

      await expect(client.generateRoadmap('system', 'user')).rejects.toThrow('Server Error');
      expect(callSpy).toHaveBeenCalledTimes(3); // 1 initial + 2 retries
    });

    it('19. should safely handle mock provider mode without hanging', async () => {
      const mockManager = new AIProviderManager({
        provider: 'mock',
      });

      const client = new RoadmapAIClient(mockManager);
      await expect(client.generateRoadmap('system', 'user')).rejects.toThrow(
        'AI Provider is configured in mock mode. Real LLM invocation bypassed.'
      );
    });
  });
});
