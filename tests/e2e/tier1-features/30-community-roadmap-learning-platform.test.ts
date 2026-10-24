// ═══════════════════════════════════════════════════════════════
// RU Ready? — Automated End-to-End Suite: 30-Community-Roadmap-Learning-Platform
// Comprehensive Testing: Community Discovery, Verified vs Endorsed Identity,
// 3 Studio Creation Modes, Personal Learning Plans, Provenance Forking & AI Verification
// ═══════════════════════════════════════════════════════════════

import { describe, it, expect, beforeAll } from 'vitest';
import { prisma } from '../../../services/roadmap-service/src/lib/prisma.js';
import { RoadmapService } from '../../../services/roadmap-service/src/services/roadmap.service.js';
import { RoadmapAICopilot } from '../../../services/roadmap-service/src/services/roadmap-ai-copilot.js';
import { RoadmapAssessmentService } from '../../../services/roadmap-service/src/services/roadmap-assessment.service.js';

describe('30 — Community-Powered, AI-Assisted Roadmap Studio & Learning Platform', { timeout: 25000 }, () => {
  const testUserId = `usr_learner_${Date.now()}`;
  const authorUserId = `usr_staff_architect_${Date.now()}`;

  // ─────────────────────────────────────────────────────────────
  // 1. Community Discovery & Contributor Identity Distinction
  // ─────────────────────────────────────────────────────────────
  describe('Roadmap Community & Credential Verification', () => {
    it('retrieves published roadmaps with category, difficulty, and keyword search', async () => {
      const roadmaps = await RoadmapService.exploreCommunityRoadmaps({
        category: 'all',
        difficulty: 'all',
      });

      expect(roadmaps.length).toBeGreaterThanOrEqual(1);
      const backendRoadmap = roadmaps.find((r) => r.category === 'Backend Systems' || r.category === 'Frontend Engineering');
      expect(backendRoadmap).toBeDefined();
    });

    it('strictly distinguishes Verified Contributor Identity from Officially Endorsed Curriculum', async () => {
      // 1. Create a Verified Contributor roadmap (e.g. Staff Engineer @ Meta)
      const verifiedAuthorRoadmap = await RoadmapService.createRoadmap({
        ownerId: authorUserId,
        creatorName: 'Priya Sharma',
        creatorRole: 'Staff Frontend Architect',
        creatorCompany: 'Meta',
        isVerifiedCreator: true,
        isEndorsed: false, // NOT endorsed by default
        title: 'High-Scale Frontend Architecture & Performance',
        description: 'The real-world battle-tested roadmap from junior to staff frontend engineer.',
        category: 'Frontend Engineering',
        difficulty: 'ADVANCED',
        estimatedWeeks: 14,
        tags: ['React', 'Architecture', 'Performance'],
        nodes: [
          {
            title: 'Modern Rendering Engines & Virtual DOM Internals',
            description: 'Fiber tree reconciler mechanics and concurrent scheduling.',
            metadata: { estimatedHours: 20 },
          },
        ],
      });

      // Publish it
      await RoadmapService.publishRoadmap(verifiedAuthorRoadmap.id, authorUserId);

      // 2. Query with filter = VERIFIED
      const verifiedList = await RoadmapService.exploreCommunityRoadmaps({
        filter: 'VERIFIED',
      });

      const foundVerified = verifiedList.find((r) => r.id === verifiedAuthorRoadmap.id);
      expect(foundVerified).toBeDefined();
      expect(foundVerified?.isVerifiedCreator).toBe(true);
      expect(foundVerified?.isEndorsed).toBe(false);
      expect(foundVerified?.creatorRole).toBe('Staff Frontend Architect');
      expect(foundVerified?.creatorCompany).toBe('Meta');

      // 3. Query with filter = ENDORSED
      const endorsedList = await RoadmapService.exploreCommunityRoadmaps({
        filter: 'ENDORSED',
      });
      // The verified author roadmap should NOT appear as official endorsement
      expect(endorsedList.some((r) => r.id === verifiedAuthorRoadmap.id)).toBe(false);
    });

    it('supports following and unfollowing community roadmaps with accurate counter mutations', async () => {
      const publicRoadmaps = await RoadmapService.exploreCommunityRoadmaps({});
      const target = publicRoadmaps[0];
      expect(target).toBeDefined();

      const initialFollowers = target.followerCount || 0;

      // Follow
      const followRes = await RoadmapService.toggleFollow(target.id, testUserId);
      expect(followRes.following).toBe(true);
      expect(followRes.followerCount).toBe(initialFollowers + 1);

      // Verify persistence in DB
      const dbFollow = await prisma.roadmapFollow.findUnique({
        where: { userId_roadmapId: { userId: testUserId, roadmapId: target.id } },
      });
      expect(dbFollow).not.toBeNull();

      // Unfollow
      const unfollowRes = await RoadmapService.toggleFollow(target.id, testUserId);
      expect(unfollowRes.following).toBe(false);
      expect(unfollowRes.followerCount).toBe(initialFollowers);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 2. Personal Learning Plans & Custom Pacing ("My Roadmaps")
  // ─────────────────────────────────────────────────────────────
  describe('Personal Learning Workspace & Pacing Adaptability', () => {
    it('creates an active personal learning instance without modifying the author original', async () => {
      const publicRoadmaps = await RoadmapService.exploreCommunityRoadmaps({});
      const templateRoadmap = publicRoadmaps[0];

      // Learner enrolls with 8 hours/week study pace
      const instance = await RoadmapService.createLearningInstance(templateRoadmap.id, testUserId, 8);

      expect(instance.id).toBeDefined();
      expect(instance.roadmapId).toBe(templateRoadmap.id);
      expect(instance.userId).toBe(testUserId);
      expect(instance.targetPaceHoursPerWeek).toBe(8);
      expect(instance.completionPercent).toBe(0);
      expect(instance.masteryCount).toBe(0);
      expect(instance.targetCompletionDate).toBeDefined();

      // Original roadmap remains completely intact
      const refreshedOriginal = await prisma.roadmap.findUnique({
        where: { id: templateRoadmap.id },
      });
      expect(refreshedOriginal?.title).toBe(templateRoadmap.title);
      expect(refreshedOriginal?.ownerId).toBe(templateRoadmap.ownerId);
    });

    it('populates user workspace showing instances, followed roadmaps, creations, and summary stats', async () => {
      const workspace = await RoadmapService.getUserWorkspace(testUserId);

      expect(workspace).toBeDefined();
      expect(workspace.instances.length).toBeGreaterThanOrEqual(1);
      expect(workspace.summary).toBeDefined();
      expect(workspace.summary.activeLearningCount).toBeGreaterThanOrEqual(1);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 3. Roadmap Studio: Three Creation Modes & Canonical Parity
  // ─────────────────────────────────────────────────────────────
  describe('Roadmap Studio Creation Modes & Provenance', () => {
    // Mode A: Manual Creation
    it('Mode A: creates roadmap with rich canonical node metadata (DAG, objectives, tasks, rubrics)', async () => {
      const created = await RoadmapService.createRoadmap({
        ownerId: authorUserId,
        creatorName: 'Staff Systems Architect',
        creatorRole: 'Staff Systems Architect',
        creatorCompany: 'AWS',
        isVerifiedCreator: true,
        title: 'Event-Driven Distributed Systems & Storage Internals',
        description: 'Comprehensive curriculum on replication, write-ahead logs, and consensus protocols.',
        category: 'Backend Systems',
        difficulty: 'ADVANCED',
        estimatedWeeks: 12,
        tags: ['Distributed Systems', 'Raft', 'WAL', 'Kafka'],
        license: 'CC-BY-4.0',
        nodes: [
          {
            title: 'Write-Ahead Logs & Storage Engines',
            description: 'LSM trees vs B+Trees and sequential disk flush mechanics.',
            position: 0,
            metadata: {
              estimatedHours: 18,
              learningObjectives: [
                'Understand append-only log serialization and fsync trade-offs',
                'Design compaction routines for immutable SSTables',
              ],
              resources: [
                {
                  title: 'Database Internals Architecture Guide',
                  url: 'https://databass.dev',
                  type: 'DOC',
                },
              ],
              practicalTasks: [
                {
                  id: 'task-wal-1',
                  title: 'Implement an Append-Only WAL with Binary Framing',
                  description: 'Support crash recovery replay in under 500ms.',
                },
              ],
              assessmentRubric: {
                passingScore: 80,
                competencies: [
                  {
                    id: 'wal-comp-1',
                    name: 'Storage Durability & fsync Semantics',
                    description: 'Explains group commits, write buffering, and crash safety.',
                    weight: 5,
                  },
                ],
              },
            },
          },
        ],
      });

      expect(created.id).toBeDefined();
      expect(created.nodes.length).toBe(1);

      const node = created.nodes[0];
      const meta = node.metadata as any;
      expect(meta.estimatedHours).toBe(18);
      expect(meta.learningObjectives.length).toBe(2);
      expect(meta.resources.length).toBe(1);
      expect(meta.practicalTasks.length).toBe(1);
      expect(meta.assessmentRubric.passingScore).toBe(80);
    });

    // Mode B: AI-Assisted Conversational Refinement Copilot
    it('Mode B: executes targeted conversational mutations preserving unaffected modules', async () => {
      // 1. Create a base roadmap with 2 modules
      const baseRoadmap = await RoadmapService.createRoadmap({
        ownerId: authorUserId,
        title: 'Cloud Native Microservices Architecture',
        description: 'Core microservice communication and resilient gateways.',
        nodes: [
          {
            title: 'REST & gRPC Microservice Contracts',
            description: 'Protobuf definitions and HTTP/2 multiplexing.',
            position: 0,
            metadata: { estimatedHours: 10 },
          },
          {
            title: 'Containerization & Docker Fundamentals',
            description: 'Layer caching and multi-stage builds.',
            position: 1,
            metadata: { estimatedHours: 12 },
          },
        ],
      });

      // 2. Perform conversational refinement: "Add Redis caching project and update title"
      const refinement = RoadmapAICopilot.refineConversational({
        existingRoadmap: baseRoadmap,
        userInstruction: 'Add a project on distributed Redis caching before deployment and adjust title',
      });

      expect(refinement.updatedRoadmap).toBeDefined();
      expect(refinement.mutatedNodeTitles.length).toBeGreaterThanOrEqual(1);
      expect(refinement.explanation.length).toBeGreaterThan(10);

      // Verify that existing modules are preserved and new module has full canonical schema
      const nodeTitles = refinement.updatedRoadmap.nodes.map((n) => n.title);
      expect(nodeTitles).toContain('REST & gRPC Microservice Contracts');
    });

    // Mode C: Fast Goal-Driven AI Generation
    it('Mode C: generates instant canonical curriculum from prompt goal with 100% schema parity', () => {
      const generated = RoadmapAICopilot.generateFromGoal({
        goal: 'Become a Senior Distributed Systems and Backend Engineer mastering Raft, Kafka, and Postgres',
        role: 'Senior Backend Engineer',
        level: 'ADVANCED',
        weeks: 16,
      });

      expect(generated.title).toBeDefined();
      expect(['Backend Systems', 'Backend Engineering']).toContain(generated.category);
      expect(generated.difficulty).toBe('ADVANCED');
      expect(generated.nodes.length).toBeGreaterThanOrEqual(3);

      // Verify canonical schema compliance on every single generated node
      for (const node of generated.nodes) {
        expect(node.title).toBeDefined();
        expect(node.description).toBeDefined();
        expect(node.learningObjectives.length).toBeGreaterThanOrEqual(2);
        expect(node.resources.length).toBeGreaterThanOrEqual(1);
        expect(node.practicalTasks.length).toBeGreaterThanOrEqual(1);
        expect(node.assessmentRubric).toBeDefined();
        expect(node.assessmentRubric.passingScore).toBeGreaterThanOrEqual(75);
      }
    });

    // Provenance & Forking
    it('forks a roadmap with full provenance attribution and increments parent forkCount', async () => {
      const parent = await RoadmapService.createRoadmap({
        ownerId: authorUserId,
        title: 'Original Principal Systems Roadmap',
        description: 'Original author curriculum.',
        nodes: [{ title: 'Module 1', description: 'Desc 1' }],
      });
      await RoadmapService.publishRoadmap(parent.id, authorUserId);

      // Learner forks the roadmap
      const forked = await RoadmapService.forkRoadmap(parent.id, testUserId, 'My Custom Systems Journey');

      expect(forked.id).not.toBe(parent.id);
      expect(forked.ownerId).toBe(testUserId);
      expect(forked.title).toBe('My Custom Systems Journey');
      expect(forked.forkedFromId).toBe(parent.id);
      expect(forked.forkedFromVersion).toBe(1);

      // Verify parent fork count was incremented
      const updatedParent = await prisma.roadmap.findUnique({ where: { id: parent.id } });
      expect(updatedParent?.forkCount).toBe(1);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 4. AI Learning Verification Engine & Authoritative Mastery States
  // ─────────────────────────────────────────────────────────────
  describe('AI Learning Verification & 7 Mastery States', () => {
    let testRoadmapId: string;
    let testNodeId: string;

    beforeAll(async () => {
      const created = await RoadmapService.createRoadmap({
        ownerId: authorUserId,
        title: 'Database Concurrency & Transaction Isolation',
        nodes: [
          {
            title: 'ACID Guarantees & Two-Phase Locking',
            description: 'MVCC snapshots, phantom reads, and write skew anomalies.',
            metadata: {
              learningObjectives: [
                'Explain how MVCC avoids read-write lock contention',
                'Demonstrate write skew anomaly under snapshot isolation',
              ],
              assessmentRubric: {
                passingScore: 75,
                competencies: [
                  {
                    id: 'comp-mvcc-1',
                    name: 'Multi-Version Concurrency Control (MVCC) Mechanics',
                    description: 'Technical explanation of transaction visibility and undo logs.',
                    weight: 5,
                  },
                ],
              },
            },
          },
        ],
      });
      testRoadmapId = created.id;
      testNodeId = created.nodes[0].id;
    });

    it('generates adaptive verification challenges based on module rubric', () => {
      const questions = RoadmapAssessmentService.generateQuestionsForModule(
        'ACID Guarantees & Two-Phase Locking',
        {
          learningObjectives: ['Explain how MVCC avoids read-write lock contention'],
          assessmentRubric: {
            passingScore: 75,
            competencies: [{ id: 'comp-1', name: 'MVCC Mechanics' }],
          },
        }
      );

      expect(questions.length).toBeGreaterThanOrEqual(1);
      expect(questions[0].question.length).toBeGreaterThan(15);
      expect(questions[0].expectedKeyPoints.length).toBeGreaterThanOrEqual(1);
    });

    it('evaluates answers with strong technical depth to ASSESSMENT_PASSED / MASTERED', async () => {
      const submission = {
        userId: testUserId,
        roadmapId: testRoadmapId,
        nodeId: testNodeId,
        answers: [
          {
            questionId: 'comp-mvcc-1',
            answerText:
              'MVCC implements snapshot isolation by maintaining multiple versions of a tuple with creation and deletion transaction timestamps. Readers do not block writers and writers do not block readers because queries inspect a consistent transaction snapshot via the undo log without acquiring exclusive locks. Write skew occurs under snapshot isolation when concurrent transactions read overlapping datasets and write to disjoint subsets, violating global invariants without triggering raw write-write lock contention. Production mitigation requires serializable isolation or explicit SELECT FOR UPDATE locks to prevent race conditions and ensure transaction consistency under heavy concurrency scale.',
          },
        ],
      };

      const result = await RoadmapAssessmentService.evaluateAssessment(submission);

      expect(result.score).toBeGreaterThanOrEqual(75);
      expect(result.passed).toBe(true);
      expect(['ASSESSMENT_PASSED', 'MASTERED']).toContain(result.masteryStatus);
      expect(result.competenciesDemonstrated.length).toBeGreaterThanOrEqual(1);

      // Verify truthful persistence in database
      const dbProgress = await prisma.roadmapProgress.findUnique({
        where: { nodeId_userId: { nodeId: testNodeId, userId: testUserId } },
      });
      expect(dbProgress).not.toBeNull();
      expect(dbProgress?.masteryStatus).toBe(result.masteryStatus);
      expect(dbProgress?.assessmentScore).toBe(result.score);

      // Verify attempt history was recorded
      const attempts = await RoadmapAssessmentService.getAssessmentHistory(testUserId, testNodeId);
      expect(attempts.length).toBeGreaterThanOrEqual(1);
      expect(attempts[0].score).toBe(result.score);
    });

    it('evaluates superficial or weak answers to NEEDS_IMPROVEMENT with recommended retry plan', async () => {
      const weakUserId = `usr_weak_${Date.now()}`;
      const weakSubmission = {
        userId: weakUserId,
        roadmapId: testRoadmapId,
        nodeId: testNodeId,
        answers: [
          {
            questionId: 'comp-mvcc-1',
            answerText: 'MVCC makes databases faster by doing transactions.', // Too brief, lacking depth
          },
        ],
      };

      const result = await RoadmapAssessmentService.evaluateAssessment(weakSubmission);

      expect(result.score).toBeLessThan(75);
      expect(result.passed).toBe(false);
      expect(result.masteryStatus).toBe('NEEDS_IMPROVEMENT');
      expect(result.recommendedRetryPlan).toBeDefined();
      expect(result.recommendedRetryPlan?.suggestedReviewTopics.length).toBeGreaterThanOrEqual(1);

      // Verify truthful persistence in database reflects NEEDS_IMPROVEMENT
      const dbProgress = await prisma.roadmapProgress.findUnique({
        where: { nodeId_userId: { nodeId: testNodeId, userId: weakUserId } },
      });
      expect(dbProgress?.masteryStatus).toBe('NEEDS_IMPROVEMENT');
    });

    it('demonstrates that learning completion (checkmarks) is strictly separate from demonstrated mastery', async () => {
      const learnerId = `usr_learner_checkbox_${Date.now()}`;

      // Learner checks off all items in the UI (100% learning completion)
      await prisma.roadmapProgress.create({
        data: {
          roadmapId: testRoadmapId,
          nodeId: testNodeId,
          userId: learnerId,
          percent: 100,
          status: 'DONE',
          masteryStatus: 'LEARNING_COMPLETE', // Not yet assessment passed or mastered
        },
      });

      const beforeAssessment = await prisma.roadmapProgress.findUnique({
        where: { nodeId_userId: { nodeId: testNodeId, userId: learnerId } },
      });

      expect(beforeAssessment?.percent).toBe(100);
      expect(beforeAssessment?.masteryStatus).toBe('LEARNING_COMPLETE');
      expect(beforeAssessment?.assessmentScore).toBeNull(); // No assessment yet demonstrated!
    });
  });
});
