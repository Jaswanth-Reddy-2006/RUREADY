// ═══════════════════════════════════════════════════════════════
// RU Ready? — Automated End-to-End Suite: 32-Roadmap-Studio-V3-Practical-Adaptive
// Tangible Deliverables, Adaptive Diagnostic Assessment, Socratic AI Companion & Learning Circles
// ═══════════════════════════════════════════════════════════════

import { describe, it, expect, beforeAll } from 'vitest';
import { prisma } from '../../../services/roadmap-service/src/lib/prisma.js';
import { RoadmapService } from '../../../services/roadmap-service/src/services/roadmap.service.js';
import { RoadmapDeliverableService } from '../../../services/roadmap-service/src/services/roadmap-deliverable.service.js';
import { RoadmapAdaptiveService } from '../../../services/roadmap-service/src/services/roadmap-adaptive.service.js';
import { RoadmapCompanionService } from '../../../services/roadmap-service/src/services/roadmap-companion.service.js';
import { RoadmapCircleService } from '../../../services/roadmap-service/src/services/roadmap-circle.service.js';

describe('32 — Roadmap Studio 3.0: Practical Deliverables, Adaptive Paths & Community Circles', { timeout: 35000 }, () => {
  const authorUserId = `usr_author_v3_${Date.now()}`;
  const learnerOneId = `usr_learner_one_${Date.now()}`;
  const learnerTwoId = `usr_learner_two_${Date.now()}`;

  let testRoadmapId = '';
  let nodeOneId = '';
  let nodeTwoId = '';

  beforeAll(async () => {
    // 1. Create a rich Production Backend Roadmap in real database
    const created = await RoadmapService.createRoadmap({
      ownerId: authorUserId,
      creatorName: 'Elena Rostova',
      creatorRole: 'Staff Distributed Systems Engineer',
      creatorCompany: 'Uber',
      isVerifiedCreator: true,
      title: 'Production High-Throughput Microservices & Event Architecture',
      description: 'Master fault-tolerant microservices, Kafka event streaming, and PostgreSQL transactional durability.',
      category: 'Backend Systems',
      difficulty: 'ADVANCED',
      estimatedWeeks: 10,
      tags: ['PostgreSQL', 'Kafka', 'Redis', 'Docker', 'Node.js'],
      nodes: [
        {
          title: 'PostgreSQL Concurrency, Indexing & Isolation Levels',
          description: 'MVCC, Serializable vs Repeatable Read, B-Tree and GIN indexes, deadlock prevention.',
          type: 'MODULE',
          metadata: {
            estimatedHours: 15,
            whyLearnThis: 'Database lock contention is the #1 cause of catastrophic microservice cascading failure under load.',
            whatYouWillLearn: ['MVCC and Snapshot Isolation', 'EXPLAIN ANALYZE interpretation', 'Advisory and Row Locks'],
            whatToBuild: 'High-concurrency inventory reservation API with zero overselling under race conditions.',
            howToVerify: 'Run 1,000 concurrent load test requests and assert exact balance without deadlocks.',
            unlockedSkills: ['PostgreSQL Index Tuning', 'Transaction Isolation', 'Deadlock Avoidance'],
          },
        },
        {
          title: 'Distributed Event Streaming with Apache Kafka',
          description: 'Partition rebalancing, log compaction, consumer group offsets, and idempotent producer pipelines.',
          type: 'MODULE',
          metadata: {
            estimatedHours: 20,
            whyLearnThis: 'Decouples services cleanly and provides guaranteed event ordering at hundreds of thousands of events per second.',
            whatYouWillLearn: ['Kafka log structure', 'Consumer group rebalance protocols', 'Exactly-once semantics'],
            whatToBuild: 'Order fulfillment event processor with dead-letter queue and automatic retry mechanism.',
            howToVerify: 'Kill consumer pod mid-batch and assert zero duplicate order charges upon recovery.',
            unlockedSkills: ['Kafka Streaming', 'Event Sourcing', 'Idempotent Consumer Design'],
          },
        },
      ],
    });

    testRoadmapId = created.id;
    nodeOneId = created.nodes[0].id;
    nodeTwoId = created.nodes[1].id;

    // 2. Initialize personal learning instances for learner one
    await RoadmapService.createLearningInstance(testRoadmapId, learnerOneId, 8);
    await RoadmapService.createLearningInstance(testRoadmapId, learnerTwoId, 6);
  });

  // ─────────────────────────────────────────────────────────────
  // 1. Dynamic "Your Next Action" Calculation
  // ─────────────────────────────────────────────────────────────
  describe('Dynamic Next Action Engine', () => {
    it('answers the 3 core questions: What to do now, Why it matters, and How to prove it', async () => {
      const nextAction = await RoadmapService.calculateNextAction(testRoadmapId, learnerOneId);

      expect(nextAction).toBeDefined();
      expect(nextAction.nodeId).toBe(nodeOneId);
      expect(nextAction.nodeTitle).toBe('PostgreSQL Concurrency, Indexing & Isolation Levels');
      expect(nextAction.estimatedHours).toBe(15);
      expect(nextAction.actionType).toBe('BUILD_MISSION');

      // Check 3 Core Human Questions
      expect(nextAction.whatToDoNow).toContain('inventory reservation API');
      expect(nextAction.whyItMatters).toContain('Database lock contention');
      expect(nextAction.howToProveIt).toContain('1,000 concurrent load test');
      expect(nextAction.allMastered).toBe(false);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 2. Tangible Deliverables & Evidence Submission Engine (Pillar 3)
  // ─────────────────────────────────────────────────────────────
  describe('Tangible Deliverables & Evidence Submission', () => {
    it('rejects invalid or non-git repository URLs', async () => {
      await expect(
        RoadmapDeliverableService.submitAndEvaluateDeliverable({
          roadmapId: testRoadmapId,
          nodeId: nodeOneId,
          userId: learnerOneId,
          userName: 'Alex Dev',
          deliverableType: 'REPOSITORY',
          deliverableUrl: 'https://mysite.com/fake-repo', // Not a legitimate git host
        })
      ).rejects.toThrow(/Repository URL must be a valid public Git host/);
    });

    it('rejects invalid deployment URLs without http/https protocol', async () => {
      await expect(
        RoadmapDeliverableService.submitAndEvaluateDeliverable({
          roadmapId: testRoadmapId,
          nodeId: nodeOneId,
          userId: learnerOneId,
          userName: 'Alex Dev',
          deliverableType: 'DEPLOYMENT',
          deliverableUrl: 'ftp://my-server/app', // Invalid protocol
        })
      ).rejects.toThrow(/Invalid URL format for live deployment/);
    });

    it('submits a valid GitHub repository deliverable and evaluates it with rubric scorecard', async () => {
      const submissionResult = await RoadmapDeliverableService.submitAndEvaluateDeliverable({
        roadmapId: testRoadmapId,
        nodeId: nodeOneId,
        userId: learnerOneId,
        userName: 'Alex Dev',
        deliverableType: 'REPOSITORY',
        deliverableUrl: 'https://github.com/alex-dev/postgres-concurrency-engine',
        deliverableText:
          'Implemented SELECT FOR UPDATE row-level locking on inventory lines with transaction isolation level REPEATABLE READ. Includes Docker Compose for Postgres 16 and Artillery load testing script simulating 1000 concurrent checkouts.',
      });

      expect(submissionResult.submission).toBeDefined();
      expect(submissionResult.submission.id).toBeTruthy();
      expect(submissionResult.submission.deliverableType).toBe('REPOSITORY');
      expect(submissionResult.submission.rubricScore).toBeGreaterThanOrEqual(75);
      expect(submissionResult.submission.status).toBe('PASSED');

      // Verify Evaluation details
      const evalResult = submissionResult.evaluation;
      expect(evalResult.status).toBe('PASSED');
      expect(evalResult.rubricScore).toBeGreaterThanOrEqual(75);
      expect(evalResult.strengths.length).toBeGreaterThanOrEqual(2);
      expect(evalResult.competenciesDemonstrated.length).toBeGreaterThanOrEqual(1);

      // Verify DB persistence in roadmap_submissions
      const storedSubmission = await (prisma as any).roadmapSubmission.findUnique({
        where: { id: submissionResult.submission.id },
      });
      expect(storedSubmission).not.toBeNull();
      expect(storedSubmission.deliverableUrl).toBe('https://github.com/alex-dev/postgres-concurrency-engine');

      // Verify RoadmapProgress updated automatically
      const prog = await prisma.roadmapProgress.findUnique({
        where: { nodeId_userId: { nodeId: nodeOneId, userId: learnerOneId } },
      });
      expect(prog?.status).toBe('DONE');
      expect(prog?.percent).toBe(100);
      expect(prog?.masteryStatus).toBe('ASSESSMENT_PASSED');
    });

    it('retrieves module-level and portfolio-level deliverable submissions', async () => {
      const nodeSubmissions = await RoadmapDeliverableService.getSubmissionsForNode(nodeOneId, learnerOneId);
      expect(nodeSubmissions.length).toBeGreaterThanOrEqual(1);

      const portfolioSubmissions = await RoadmapDeliverableService.getSubmissionsForRoadmap(testRoadmapId, learnerOneId);
      expect(portfolioSubmissions.length).toBeGreaterThanOrEqual(1);
      expect(portfolioSubmissions[0].node.title).toBe('PostgreSQL Concurrency, Indexing & Isolation Levels');
    });

    it('advances Next Action to the subsequent module after completing first mission', async () => {
      const nextAction = await RoadmapService.calculateNextAction(testRoadmapId, learnerOneId);
      expect(nextAction.nodeId).toBe(nodeTwoId);
      expect(nextAction.nodeTitle).toBe('Distributed Event Streaming with Apache Kafka');
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 3. Adaptive Diagnostic Assessment Engine (Pillar 2)
  // ─────────────────────────────────────────────────────────────
  describe('Adaptive Diagnostic Assessment & Path Engine', () => {
    it('generates diagnostic questions matching the modules in the roadmap', async () => {
      const diagnostic = await RoadmapAdaptiveService.generateDiagnostic(testRoadmapId);

      expect(diagnostic.roadmapId).toBe(testRoadmapId);
      expect(diagnostic.questions.length).toBeGreaterThanOrEqual(2);

      const q1 = diagnostic.questions[0];
      expect(q1.nodeId).toBe(nodeOneId);
      expect(q1.options.length).toBe(4);
      expect(q1.correctOptionIndex).toBeGreaterThanOrEqual(0);
      expect(q1.explanation).toBeTruthy();
    });

    it('evaluates answers, computes domain proficiencies, and recommends skipping mastered modules', async () => {
      const diagnostic = await RoadmapAdaptiveService.generateDiagnostic(testRoadmapId);

      // Answer question 1 correctly (Postgres) and question 2 incorrectly (Kafka)
      const answers: Record<string, number> = {
        [diagnostic.questions[0].id]: diagnostic.questions[0].correctOptionIndex,
        [diagnostic.questions[1].id]: (diagnostic.questions[1].correctOptionIndex + 1) % 4,
      };

      const evalResult = await RoadmapAdaptiveService.evaluateDiagnostic({
        roadmapId: testRoadmapId,
        userId: learnerTwoId,
        answers,
      });

      expect(evalResult.completedAt).toBeTruthy();
      expect(evalResult.overallScore).toBe(50);
      expect(evalResult.recommendations.length).toBe(2);

      const rec1 = evalResult.recommendations.find((r) => r.nodeId === nodeOneId);
      expect(rec1?.action).toBe('SKIP');
      expect(rec1?.reason).toContain('Demonstrated strong conceptual mastery');

      const rec2 = evalResult.recommendations.find((r) => r.nodeId === nodeTwoId);
      expect(rec2?.action).toBe('REVIEW');
      expect(rec2?.reason).toContain('Knowledge gap identified');

      // Verify customOverrides stored in RoadmapInstance without modifying canonical roadmap
      const instance = await prisma.roadmapInstance.findUnique({
        where: { userId_roadmapId: { userId: learnerTwoId, roadmapId: testRoadmapId } },
      });
      const overrides = instance?.customOverrides as any;
      expect(overrides?.diagnostic?.overallScore).toBe(50);
      expect(overrides?.diagnostic?.recommendations[0].action).toBe('SKIP');
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 4. Interactive AI Learning Companion (Pillar 4)
  // ─────────────────────────────────────────────────────────────
  describe('AI Learning Companion Engine', () => {
    it('provides Socratic hints without giving away the direct code solution', async () => {
      const response = await RoadmapCompanionService.chat({
        roadmapId: testRoadmapId,
        nodeId: nodeOneId,
        userId: learnerOneId,
        message: 'How do I stop two transactions from simultaneously deducting inventory balance?',
        mode: 'SOCRATIC_HINT',
      });

      expect(response.mode).toBe('SOCRATIC_HINT');
      expect(response.reply).toBeTruthy();
      // Should ask guiding questions rather than just outputting full code
      expect(response.suggestedPrompts.length).toBeGreaterThanOrEqual(2);
      expect(response.reply).toMatch(/\?|consider|what happens|how would/i);
    });

    it('explains deep technical concepts with intuitive real-world analogies', async () => {
      const response = await RoadmapCompanionService.chat({
        roadmapId: testRoadmapId,
        nodeId: nodeTwoId,
        userId: learnerOneId,
        message: 'Explain consumer group partition rebalance to me',
        mode: 'EXPLAIN',
      });

      expect(response.mode).toBe('EXPLAIN');
      expect(response.reply.length).toBeGreaterThan(50);
      expect(response.suggestedPrompts).toBeDefined();
    });

    it('provides step-by-step diagnostic checklists in DEBUG mode', async () => {
      const response = await RoadmapCompanionService.chat({
        roadmapId: testRoadmapId,
        nodeId: nodeOneId,
        userId: learnerOneId,
        message: 'I am seeing error: deadlock detected process 4921 waiting for ExclusiveLock',
        mode: 'DEBUG',
      });

      expect(response.mode).toBe('DEBUG');
      expect(response.reply).toMatch(/deadlock/i);
      expect(response.reply).toMatch(/1\.|2\.|audit|lock order/i);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 5. Learning Circles & Peer Accountability Cohorts (Pillar 5)
  // ─────────────────────────────────────────────────────────────
  describe('Learning Circles & Peer Cohorts', () => {
    let circleId = '';
    let inviteCode = '';

    it('creates an opt-in study circle with unique 6-character invite code', async () => {
      const circle = await RoadmapCircleService.createCircle({
        roadmapId: testRoadmapId,
        name: 'Backend Masters Cohort Spring 2026',
        description: 'Weekly Sunday sync and mutual code reviews for distributed systems milestones.',
        creatorId: learnerOneId,
        creatorName: 'Elena Rostova',
        weeklyGoalHours: 10,
        targetDate: '2026-06-30',
        isPrivate: false,
      });

      expect(circle).toBeDefined();
      expect(circle.id).toBeTruthy();
      expect(circle.joinCode).toHaveLength(6);
      expect(circle.members.length).toBe(1);
      expect(circle.members[0].role).toBe('CREATOR');

      circleId = circle.id;
      inviteCode = circle.joinCode;
    });

    it('allows another learner to join the cohort using the 6-character join code', async () => {
      const member = await RoadmapCircleService.joinCircle({
        joinCode: inviteCode,
        userId: learnerTwoId,
        userName: 'Marcus Vance',
      });

      expect(member).toBeDefined();
      expect(member.circleId).toBe(circleId);
      expect(member.userId).toBe(learnerTwoId);
      expect(member.role).toBe('MEMBER');
    });

    it('retrieves cohort details including members and cohort velocity', async () => {
      const circleDetails = await RoadmapCircleService.getCircleDetails(circleId);

      expect(circleDetails.cohortSize).toBe(2);
      expect(circleDetails.members).toHaveLength(2);
      expect(circleDetails.averageProgressPercent).toBeGreaterThanOrEqual(0);
    });

    it('retrieves public learning circles for a roadmap', async () => {
      const publicCircles = await RoadmapCircleService.getCirclesForRoadmap(testRoadmapId);
      expect(publicCircles.length).toBeGreaterThanOrEqual(1);
      const found = publicCircles.find((c: any) => c.id === circleId);
      expect(found).toBeDefined();
      expect(found.joinCode).toBe(inviteCode);
    });
  });
});
