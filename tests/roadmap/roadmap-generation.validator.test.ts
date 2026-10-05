import { describe, expect, it } from 'vitest';
import {
  generatedRoadmapOutputSchema,
  roadmapNodeDefinitionSchema,
  roadmapPhaseDefinitionSchema,
  roadmapPracticalDrillSchema,
  roadmapResourceSourceSchema,
  roadmapMicroQuestionSchema,
} from '../../services/roadmap-service/src/validators/roadmap-generation.validator.js';

describe('AI Roadmap Output Validator (Stage 3 Step 1)', () => {
  const createValidMockNode = (id: string, title: string, orderIndex: number) => ({
    id,
    title,
    category: 'Backend Core',
    orderIndex,
    estimatedHours: 12,
    skills: [{ name: 'Node.js', category: 'Backend', targetProficiency: 85 }],
    prerequisiteNodeIds: [],
    whatShouldIDo: {
      summary: 'Master the libuv event loop phases, worker threads, and asynchronous stream backpressure.',
      actionSteps: [
        'Audit synchronous blocking calls in existing request pipelines.',
        'Implement custom transform streams with backpressure drain listeners.',
      ],
      mentalModels: [
        'Non-blocking I/O: Offload heavy I/O to libuv thread pool while keeping the main loop responsive.',
      ],
    },
    whatIsTheSource: [
      {
        id: 'src-node-1',
        title: 'Node.js Official Event Loop Documentation',
        url: 'https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick',
        type: 'DOCS' as const,
        description: 'Complete breakdown of timers, poll, and check phases.',
      },
    ],
    whatIsTheExactThing: {
      title: 'High-Throughput CSV Transform Stream Drill',
      description: 'Build a streaming pipeline processing 1M rows with constant memory footprint.',
      deliverable: 'A tested Node.js script using stream.pipeline with under 50MB RSS memory.',
      starterCode: 'import { pipeline } from "node:stream/promises";',
      verificationChecklist: [
        'Memory usage remains constant during 500MB stream run',
        'Backpressure properly pauses upstream readable stream',
      ],
    },
    microQuestions: [
      {
        id: 'mq-1',
        questionText: 'Explain the difference between process.nextTick and setImmediate.',
        focus: 'Event Loop Runtime',
        suggestedAnswer: 'process.nextTick fires immediately before the event loop advances to the next phase.',
      },
    ],
  });

  const createValidMockPhase = (id: string, title: string, orderIndex: number, nodeCount = 1) => ({
    id,
    title,
    description: `Curriculum phase covering ${title}`,
    orderIndex,
    nodes: Array.from({ length: nodeCount }, (_, i) =>
      createValidMockNode(`node-${id}-${i + 1}`, `Milestone ${i + 1} for ${title}`, i + 1)
    ),
  });

  // ─── 1. Valid Minimal Roadmap ─────────────────────────────────
  it('1. accepts a valid minimal roadmap with 3 phases and 1 node each', () => {
    const validMinimal = {
      title: 'Fullstack Web Engineer Blueprint',
      rolePath: 'FULLSTACK',
      targetCompanyTier: 'FAANG',
      difficulty: 'INTERMEDIATE',
      estimatedWeeks: 12,
      phases: [
        createValidMockPhase('phase-1', 'Foundations', 1),
        createValidMockPhase('phase-2', 'Core Backend', 2),
        createValidMockPhase('phase-3', 'Distributed Scaling', 3),
      ],
    };

    const parsed = generatedRoadmapOutputSchema.parse(validMinimal);
    expect(parsed.title).toBe('Fullstack Web Engineer Blueprint');
    expect(parsed.phases.length).toBe(3);
  });

  // ─── 2. Valid Complete 3-Pillar Roadmap ───────────────────────
  it('2. accepts a valid comprehensive 3-pillar roadmap', () => {
    const validFull = {
      title: 'Staff Distributed Systems Architect Track',
      description: 'Comprehensive curriculum targeting Tier-1 FinTech and FAANG engineering bars.',
      rolePath: 'SYSTEM_DESIGN',
      targetCompanyTier: 'Tier-1 FinTech',
      difficulty: 'STAFF',
      estimatedWeeks: 16,
      phases: [
        createValidMockPhase('phase-1', 'Distributed Storage & Indexing', 1, 2),
        createValidMockPhase('phase-2', 'Event Streaming & Kafka', 2, 2),
        createValidMockPhase('phase-3', 'High-Availability Consensus', 3, 2),
        createValidMockPhase('phase-4', 'Production Chaos Engineering', 4, 1),
      ],
    };

    const parsed = generatedRoadmapOutputSchema.parse(validFull);
    expect(parsed.phases.length).toBe(4);
    expect(parsed.phases[0].nodes[0].whatIsTheExactThing.verificationChecklist.length).toBeGreaterThanOrEqual(1);
    expect(parsed.phases[0].nodes[0].microQuestions.length).toBeGreaterThanOrEqual(1);
  });

  // ─── 3. Missing Title ─────────────────────────────────────────
  it('3. rejects roadmap when title is missing or empty', () => {
    const invalid = {
      title: '   ',
      rolePath: 'FULLSTACK',
      estimatedWeeks: 12,
      phases: [
        createValidMockPhase('p1', 'P1', 1),
        createValidMockPhase('p2', 'P2', 2),
        createValidMockPhase('p3', 'P3', 3),
      ],
    };

    expect(() => generatedRoadmapOutputSchema.parse(invalid)).toThrow();
  });

  // ─── 4. Missing Phases ────────────────────────────────────────
  it('4. rejects roadmap when phases array is missing', () => {
    const invalid = {
      title: 'Backend Track',
      rolePath: 'BACKEND',
      estimatedWeeks: 12,
    };

    expect(() => generatedRoadmapOutputSchema.parse(invalid)).toThrow();
  });

  // ─── 5. Too Few Phases (< 3) ──────────────────────────────────
  it('5. rejects roadmap with fewer than 3 phases', () => {
    const invalid = {
      title: 'Backend Track',
      rolePath: 'BACKEND',
      estimatedWeeks: 12,
      phases: [
        createValidMockPhase('p1', 'P1', 1),
        createValidMockPhase('p2', 'P2', 2),
      ],
    };

    expect(() => generatedRoadmapOutputSchema.parse(invalid)).toThrow(/at least 3 progressive phases/);
  });

  // ─── 6. Too Many Phases (> 5) ─────────────────────────────────
  it('6. rejects roadmap with more than 5 phases', () => {
    const invalid = {
      title: 'Backend Track',
      rolePath: 'BACKEND',
      estimatedWeeks: 12,
      phases: [
        createValidMockPhase('p1', 'P1', 1),
        createValidMockPhase('p2', 'P2', 2),
        createValidMockPhase('p3', 'P3', 3),
        createValidMockPhase('p4', 'P4', 4),
        createValidMockPhase('p5', 'P5', 5),
        createValidMockPhase('p6', 'P6', 6),
      ],
    };

    expect(() => generatedRoadmapOutputSchema.parse(invalid)).toThrow(/cannot exceed 5 phases/);
  });

  // ─── 7. Invalid estimatedHours ────────────────────────────────
  it('7. rejects node with estimatedHours less than 1 or greater than 80', () => {
    const nodeLowHours = { ...createValidMockNode('n1', 'Test', 1), estimatedHours: 0 };
    expect(() => roadmapNodeDefinitionSchema.parse(nodeLowHours)).toThrow(/at least 1 hour/);

    const nodeHighHours = { ...createValidMockNode('n1', 'Test', 1), estimatedHours: 95 };
    expect(() => roadmapNodeDefinitionSchema.parse(nodeHighHours)).toThrow(/cannot exceed 80 hours/);
  });

  // ─── 8. Invalid URL ───────────────────────────────────────────
  it('8. rejects resource with an invalid URL format', () => {
    const invalidResource = {
      id: 'res-1',
      title: 'Broken Docs',
      url: 'not-a-valid-http-url',
      type: 'DOCS',
    };

    expect(() => roadmapResourceSourceSchema.parse(invalidResource)).toThrow(/valid HTTP\/HTTPS URL/);
  });

  // ─── 9. Zero Micro-Questions ──────────────────────────────────
  it('9. rejects node with empty microQuestions array', () => {
    const nodeNoQuestions = { ...createValidMockNode('n1', 'Test', 1), microQuestions: [] };
    expect(() => roadmapNodeDefinitionSchema.parse(nodeNoQuestions)).toThrow(/at least 1 micro-question/);
  });

  // ─── 10. More Than 4 Micro-Questions ──────────────────────────
  it('10. rejects node with more than 4 micro-questions', () => {
    const nodeManyQuestions = {
      ...createValidMockNode('n1', 'Test', 1),
      microQuestions: [
        { id: 'q1', questionText: 'Question 1', focus: 'Focus 1' },
        { id: 'q2', questionText: 'Question 2', focus: 'Focus 2' },
        { id: 'q3', questionText: 'Question 3', focus: 'Focus 3' },
        { id: 'q4', questionText: 'Question 4', focus: 'Focus 4' },
        { id: 'q5', questionText: 'Question 5', focus: 'Focus 5' },
      ],
    };

    expect(() => roadmapNodeDefinitionSchema.parse(nodeManyQuestions)).toThrow(/cannot have more than 4 micro-questions/);
  });

  // ─── 11. Missing Verification Checklist ───────────────────────
  it('11. rejects practical drill with empty verificationChecklist', () => {
    const drillNoChecklist = {
      title: 'Drill Title',
      description: 'Long enough description for the practical drill.',
      deliverable: 'Deliverable description',
      verificationChecklist: [],
    };

    expect(() => roadmapPracticalDrillSchema.parse(drillNoChecklist)).toThrow(/at least one verification checklist item/);
  });

  // ─── 12. Malformed Resource ───────────────────────────────────
  it('12. rejects resource with an invalid type enum value', () => {
    const malformed = {
      id: 'res-1',
      title: 'Resource',
      url: 'https://example.com/docs',
      type: 'INVALID_TYPE',
    };

    expect(() => roadmapResourceSourceSchema.parse(malformed)).toThrow();
  });

  // ─── 13. Malformed Practical Drill ────────────────────────────
  it('13. rejects practical drill missing deliverable field', () => {
    const malformed = {
      title: 'Drill Title',
      description: 'Long enough description for the practical drill.',
      verificationChecklist: ['Check item 1'],
    };

    expect(() => roadmapPracticalDrillSchema.parse(malformed)).toThrow();
  });

  // ─── 14. Malformed Phase ──────────────────────────────────────
  it('14. rejects phase with empty nodes array', () => {
    const malformed = {
      id: 'phase-1',
      title: 'Phase without nodes',
      orderIndex: 1,
      nodes: [],
    };

    expect(() => roadmapPhaseDefinitionSchema.parse(malformed)).toThrow(/at least 1 milestone node/);
  });

  // ─── 15. Malformed Node ───────────────────────────────────────
  it('15. rejects node missing whatShouldIDo 3-pillar content', () => {
    const nodeMissingPillar = {
      id: 'node-1',
      title: 'Node Title',
      category: 'Core',
      orderIndex: 1,
      estimatedHours: 10,
      skills: [{ name: 'Skill', category: 'Cat' }],
      whatIsTheSource: [{ id: 's1', title: 'Source', url: 'https://example.com', type: 'DOCS' }],
      whatIsTheExactThing: {
        title: 'Drill',
        description: 'Description here',
        deliverable: 'Deliverable',
        verificationChecklist: ['Item 1'],
      },
      microQuestions: [{ id: 'q1', questionText: 'Question', focus: 'Focus' }],
    };

    expect(() => roadmapNodeDefinitionSchema.parse(nodeMissingPillar)).toThrow();
  });

  // ─── 16. Unknown Root Fields in Strict Mode ───────────────────
  it('16. rejects root roadmap with unrecognized/backend-owned fields (strict mode)', () => {
    const invalidWithBackendFields = {
      title: 'Fullstack Blueprint',
      rolePath: 'FULLSTACK',
      estimatedWeeks: 12,
      userId: 'hacker-injected-user-id', // Backend-owned field should be rejected!
      overallReadiness: 99,              // Backend-owned field should be rejected!
      phases: [
        createValidMockPhase('p1', 'P1', 1),
        createValidMockPhase('p2', 'P2', 2),
        createValidMockPhase('p3', 'P3', 3),
      ],
    };

    expect(() => generatedRoadmapOutputSchema.parse(invalidWithBackendFields)).toThrow();
  });
});
