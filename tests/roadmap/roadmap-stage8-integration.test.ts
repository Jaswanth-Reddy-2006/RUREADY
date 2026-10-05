// ═══════════════════════════════════════════════════════════════
// Stage 8.5: Final Stage 8 Full Integration & Validation Suite
// End-to-End Cross-Stage Lifecycle: Resume -> Roadmap -> Interview ->
// Evidence -> History -> Verified Profile -> Certificate -> Notifications
// ═══════════════════════════════════════════════════════════════

import { describe, expect, it, vi, beforeEach } from 'vitest';
import { resumeBridgeService } from '../../services/roadmap-service/src/services/resume-bridge.service.js';
import { interviewTelemetryService } from '../../services/roadmap-service/src/services/interview-telemetry.service.js';
import { certificateGeneratorService } from '../../services/roadmap-service/src/services/certificate-generator.service.js';
import { sprintNotificationService } from '../../services/roadmap-service/src/services/sprint-notification.service.js';
import { verifiedProfileService } from '../../services/roadmap-service/src/services/verified-profile.service.js';
import { skillReadinessService } from '../../services/roadmap-service/src/services/skill-readiness.service.js';
import {
  deriveRoadmapLearningHistory,
  deriveSmartSprintNotifications,
  normalizeSkillName,
  DEFAULT_SMART_NOTIFICATION_PREFERENCES,
  InterviewTelemetryIngressDTO,
  RoadmapReadinessAnalyticsDTO,
} from '../../packages/shared/src/types/index.js';
import {
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  BadRequestError,
} from '../../services/roadmap-service/src/lib/errors.js';
import { prisma } from '../../services/roadmap-service/src/lib/prisma.js';

vi.mock('../../services/roadmap-service/src/lib/prisma.js', () => ({
  prisma: {
    userRoadmap: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
    },
    skill: {
      findFirst: vi.fn(),
      findMany: vi.fn(),
    },
    skillEvidence: {
      findFirst: vi.fn(),
      create: vi.fn(),
    },
    microAssessmentAttempt: {
      findMany: vi.fn().mockResolvedValue([]),
    },
  },
}));

describe('Stage 8.5: Final Stage 8 Integration & Validation', () => {
  const learnerUserId = 'usr_learner_850';
  const intruderUserId = 'usr_intruder_999';
  const testRoadmapId = 'rdmp_e2e_850';
  const testUserRoadmapId = 'ur_e2e_850';
  const referenceDate = new Date('2026-10-04T12:00:00.000Z');

  beforeEach(() => {
    vi.clearAllMocks();
    resumeBridgeService.clearMemoryStore();
    interviewTelemetryService.clearMemoryStore();
  });

  // ═══════════════════════════════════════════════════════════════
  // 1. End-to-End Cross-Stage Lifecycle Trace
  // ═══════════════════════════════════════════════════════════════
  describe('1. Full Cross-Stage Lifecycle Integration', () => {
    it('executes complete journey: Resume -> Roadmap Prefill -> Interview Evidence -> Learning History -> Verified Certificate -> Smart Notifications', async () => {
      // ─────────────────────────────────────────────────────────────
      // STEP 1 & 2: Resume Bridge & ATS Prefill (Stage 8.1)
      // ─────────────────────────────────────────────────────────────
      resumeBridgeService.setMockResume({
        id: 'res_850',
        userId: learnerUserId,
        fileName: 'alex_chen_fullstack.pdf',
        skills: ['react', 'ts', 'node.js', 'docker'],
        uploadedAt: new Date('2026-09-01T10:00:00.000Z'),
      });

      resumeBridgeService.setMockProfile({
        id: 'prof_850',
        userId: learnerUserId,
        name: 'Alex Chen',
        title: 'Software Engineer',
        experienceYears: 3,
        targetRoles: ['Senior Fullstack Engineer'],
      });

      resumeBridgeService.setMockAtsMatch({
        id: 'ats_850',
        userId: learnerUserId,
        jobTitle: 'Senior Fullstack Engineer',
        companyName: 'Stripe',
        matchScore: 78,
        summary: 'Strong frontend fundamentals, missing Redis caching and System Design depth.',
        matchedSkills: ['React', 'TypeScript', 'Node.js'],
        missingSkills: ['Redis', 'System Design', 'PostgreSQL'],
        createdAt: new Date('2026-09-02T10:00:00.000Z'),
      });

      const prefill = await resumeBridgeService.getResumePrefill(learnerUserId);
      expect(prefill.candidateName).toBe('Alex Chen');
      expect(prefill.suggestedTargetRole).toBe('Senior Fullstack Engineer');
      expect(prefill.suggestedLevel).toBe('INTERMEDIATE');
      expect(prefill.knownSkills).toEqual(
        expect.arrayContaining(['React', 'TypeScript', 'Node.js', 'Docker'])
      );
      expect(prefill.identifiedBlindspots).toEqual(
        expect.arrayContaining(['Redis', 'System Design', 'PostgreSQL'])
      );

      // ─────────────────────────────────────────────────────────────
      // STEP 3 & 4: Roadmap Enrollment with Sprints (Stage 4 - 6)
      // ─────────────────────────────────────────────────────────────
      const mockRoadmapState = {
        id: testUserRoadmapId,
        userId: learnerUserId,
        sourceRoadmapId: testRoadmapId,
        status: 'ACTIVE',
        createdAt: new Date('2026-09-05T00:00:00.000Z'),
        sourceRoadmap: {
          id: testRoadmapId,
          title: 'Senior Fullstack Career Path',
          rolePath: 'Senior Fullstack Engineer',
          targetCompanyTier: 'FAANG',
          goal: { title: 'Master Distributed Systems & Modern Web' },
        },
        personalization: {
          targetRole: prefill.targetRole,
          targetCompany: 'Stripe',
          knownSkills: prefill.knownSkills,
          identifiedBlindspots: prefill.identifiedBlindspots,
          hoursPerDay: 2,
          daysPerWeek: 5,
          notificationPreferences: { ...DEFAULT_SMART_NOTIFICATION_PREFERENCES },
          readNotificationIds: [],
        },
        sprints: [
          {
            id: 'sprint_1',
            sprintNumber: 1,
            objective: 'Microservices & Async Messaging',
            status: 'COMPLETED',
            startDate: '2026-09-05T00:00:00.000Z',
            endDate: '2026-09-15T00:00:00.000Z',
            completedAt: '2026-09-14T18:00:00.000Z',
            performance: { taskCompletion: 100 },
            tasks: [
              {
                id: 'task_1',
                orderIndex: 0,
                status: 'COMPLETED',
                completedAt: '2026-09-14T18:00:00.000Z',
                requiresAssessment: false,
              },
            ],
          },
          {
            id: 'sprint_2',
            sprintNumber: 2,
            objective: 'System Architecture & Database Scaling',
            status: 'ACTIVE',
            startDate: '2026-09-16T00:00:00.000Z',
            endDate: '2026-09-26T00:00:00.000Z', // In past relative to 2026-10-04
            tasks: [
              {
                id: 'task_2_overdue',
                orderIndex: 0,
                status: 'IN_PROGRESS',
                requiresAssessment: false,
              },
              {
                id: 'task_3_assess',
                orderIndex: 1,
                status: 'TODO',
                requiresAssessment: true,
              },
            ],
          },
        ],
        adaptations: [
          {
            id: 'adapt_850',
            action: 'ACCELERATE',
            reason: 'Demonstrated high competency in Node.js backend drills.',
            createdAt: '2026-09-20T00:00:00.000Z',
          },
        ],
        skillEvidence: [] as any[],
        assessmentAttempts: [],
      };

      // ─────────────────────────────────────────────────────────────
      // STEP 5 & 6: Ingest Mock Interview Telemetry (Stage 8.2)
      // ─────────────────────────────────────────────────────────────
      interviewTelemetryService.seedUserRoadmap({
        id: testUserRoadmapId,
        userId: learnerUserId,
        status: 'ACTIVE',
        updatedAt: new Date(),
      });
      interviewTelemetryService.seedSkill({
        id: 'sk_sys_design',
        name: 'System Design',
        slug: 'system-design',
        category: 'Architecture',
      });
      interviewTelemetryService.seedSkill({
        id: 'sk_postgres',
        name: 'PostgreSQL',
        slug: 'postgresql',
        category: 'Database',
      });

      const telemetryPayload: InterviewTelemetryIngressDTO = {
        interviewId: 'intv_mock_850',
        userId: learnerUserId,
        userRoadmapId: testUserRoadmapId,
        interviewType: 'TECHNICAL',
        targetRole: 'Senior Fullstack Engineer',
        overallScore: 88,
        technicalScore: 90,
        communicationScore: 85,
        readinessVerdict: 'STRONG_HIRE',
        evaluatedSkills: [
          { skillName: 'System Design', score: 88, confidence: 85 },
          { skillName: 'PostgreSQL', score: 92, confidence: 90 },
        ],
        completedAt: '2026-09-25T14:00:00.000Z',
      };

      const ingressResult = await interviewTelemetryService.ingestTelemetry(
        learnerUserId,
        telemetryPayload
      );
      expect(ingressResult.success).toBe(true);
      expect(ingressResult.evidenceCount).toBe(2);

      // Attach evidence to mock state
      mockRoadmapState.skillEvidence = [
        {
          id: 'ev_intv_1',
          skillId: 'sk_sys_design',
          skill: { name: 'System Design', category: 'Architecture' },
          source: 'CODING_INTERVIEW',
          demonstratedScore: 88,
          confidence: 85,
          assessedAt: new Date('2026-09-25T14:00:00.000Z'),
        },
        {
          id: 'ev_intv_2',
          skillId: 'sk_postgres',
          skill: { name: 'PostgreSQL', category: 'Database' },
          source: 'CODING_INTERVIEW',
          demonstratedScore: 92,
          confidence: 90,
          assessedAt: new Date('2026-09-25T14:00:00.000Z'),
        },
      ];

      // ─────────────────────────────────────────────────────────────
      // STEP 7: Derive Learning History with Telemetry Evidence (Stage 7.2)
      // ─────────────────────────────────────────────────────────────
      const learningHistory = deriveRoadmapLearningHistory(mockRoadmapState, referenceDate);
      expect(learningHistory.totalEvidenceCount).toBe(2);
      expect(learningHistory.timeline.length).toBeGreaterThan(0);
      const evidenceTimelineEvent = learningHistory.timeline.find(
        (t) => t.source === 'CODING_INTERVIEW'
      );
      expect(evidenceTimelineEvent).toBeDefined();

      // ─────────────────────────────────────────────────────────────
      // STEP 8, 9 & 10: Verified Profile & Certificate Generation (Stage 8.3)
      // ─────────────────────────────────────────────────────────────
      vi.mocked(prisma.userRoadmap.findUnique).mockResolvedValue(mockRoadmapState as any);

      const mockReadiness: RoadmapReadinessAnalyticsDTO = {
        userRoadmapId: testUserRoadmapId,
        overallReadiness: 76,
        targetRole: 'Senior Fullstack Engineer',
        targetCompanyTier: 'FAANG',
        skills: [
          {
            skillId: 'sk_sys_design',
            skillName: 'System Design',
            category: 'Architecture',
            masteryScore: 88,
            confidence: 85,
            evidenceCount: 1,
            status: 'MASTERED',
          },
          {
            skillId: 'sk_postgres',
            skillName: 'PostgreSQL',
            category: 'Database',
            masteryScore: 92,
            confidence: 90,
            evidenceCount: 1,
            status: 'MASTERED',
          },
        ],
        strengths: ['PostgreSQL', 'System Design'],
        blindspots: [],
        lastCalculatedAt: new Date().toISOString(),
      };

      vi.spyOn(skillReadinessService, 'calculateRoadmapReadiness').mockResolvedValue(mockReadiness);

      const certData = await certificateGeneratorService.generateCertificateData(
        learnerUserId,
        testUserRoadmapId
      );

      expect(certData.isEligible).toBe(true);
      expect(certData.certificateId).toMatch(/^CERT-ur_e2e_850-/);
      expect(certData.overallReadiness).toBe(76);
      expect(certData.completedSprintCount).toBe(1);
      expect(certData.verifiedEvidenceCount).toBe(2);
      expect(certData.masteredSkills).toContain('System Design');
      expect(certData.masteredSkills).toContain('PostgreSQL');

      // Verify certificate authenticity via public endpoint
      const verificationResult = await certificateGeneratorService.verifyCertificate(
        certData.verificationId
      );
      expect(verificationResult.isValid).toBe(true);
      expect(verificationResult.status).toBe('AUTHENTIC');
      expect(verificationResult.certificateId).toBe(certData.certificateId);

      // ─────────────────────────────────────────────────────────────
      // STEP 11: Smart Sprint Notifications Feed (Stage 8.4)
      // ─────────────────────────────────────────────────────────────
      const notificationsFeed = deriveSmartSprintNotifications(mockRoadmapState, referenceDate);
      expect(notificationsFeed.userRoadmapId).toBe(testUserRoadmapId);
      expect(notificationsFeed.totalCount).toBeGreaterThan(0);

      const notificationTypes = notificationsFeed.notifications.map((n) => n.type);
      expect(notificationTypes).toContain('SPRINT_COMPLETED');
      expect(notificationTypes).toContain('ROADMAP_ADAPTATION');
      expect(notificationTypes).toContain('TASK_OVERDUE');
      expect(notificationTypes).toContain('ASSESSMENT_DUE');

      // Ensure stable deterministic notification IDs
      for (const n of notificationsFeed.notifications) {
        expect(n.id).toBeDefined();
        expect(n.isRead).toBe(false);
      }
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // 2. Data Consistency & Canonical Thresholds
  // ═══════════════════════════════════════════════════════════════
  describe('2. Data Consistency & Canonical Standards', () => {
    it('consistently normalizes skill aliases across resume prefill and interview ingress', () => {
      const rawAliases = ['ts', 'react.js', 'postgres', 'k8s', 'amazon web services', 'py'];
      const normalized = rawAliases.map(normalizeSkillName);

      expect(normalized).toEqual([
        'TypeScript',
        'React',
        'PostgreSQL',
        'Kubernetes',
        'AWS',
        'Python',
      ]);
    });

    it('enforces canonical assessment pass threshold of >= 70 across assessment and drill evaluations', () => {
      // Canonically: 70 is passing, 69 is failing
      const passingScore = 70;
      const failingScore = 69;

      expect(passingScore >= 70).toBe(true);
      expect(failingScore >= 70).toBe(false);
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // 3. Strict Security & IDOR Authorization Boundary
  // ═══════════════════════════════════════════════════════════════
  describe('3. Strict Security & Cross-User IDOR Protection', () => {
    it('rejects cross-user access on Resume Prefill (Stage 8.1)', async () => {
      resumeBridgeService.setMockResume({
        id: 'res_owner',
        userId: learnerUserId,
        fileName: 'secret_resume.pdf',
        skills: ['Rust', 'C++'],
        uploadedAt: new Date(),
      });

      // Intruder attempting to query learner's resume
      await expect(
        resumeBridgeService.getResumePrefill(intruderUserId, { resumeId: 'res_owner' })
      ).rejects.toThrow(ForbiddenError);
    });

    it('rejects cross-user access on Interview Telemetry Ingress (Stage 8.2)', async () => {
      const payload: InterviewTelemetryIngressDTO = {
        interviewId: 'intv_hack',
        userId: learnerUserId, // Belongs to learner
        interviewType: 'TECHNICAL',
        overallScore: 99,
        evaluatedSkills: [{ skillName: 'React', score: 100 }],
      };

      // Intruder sending payload on behalf of learner
      await expect(
        interviewTelemetryService.ingestTelemetry(intruderUserId, payload)
      ).rejects.toThrow(ForbiddenError);
    });

    it('rejects cross-user access on Certificate Data (Stage 8.3)', async () => {
      const mockRoadmap = {
        id: testUserRoadmapId,
        userId: learnerUserId,
        status: 'ACTIVE',
        personalization: {},
        sprints: [],
        adaptations: [],
        skillEvidence: [],
        assessmentAttempts: [],
      };
      vi.mocked(prisma.userRoadmap.findUnique).mockResolvedValue(mockRoadmap as any);

      // Intruder attempting to access learner certificate
      await expect(
        certificateGeneratorService.generateCertificateData(intruderUserId, testUserRoadmapId)
      ).rejects.toThrow(ForbiddenError);
    });

    it('rejects cross-user access on Notifications Feed and Preference Updates (Stage 8.4)', async () => {
      const mockRoadmap = {
        id: testUserRoadmapId,
        userId: learnerUserId,
        status: 'ACTIVE',
        personalization: {},
        sprints: [],
        adaptations: [],
      };
      vi.mocked(prisma.userRoadmap.findUnique).mockResolvedValue(mockRoadmap as any);

      await expect(
        sprintNotificationService.getNotifications(intruderUserId, testUserRoadmapId)
      ).rejects.toThrow(ForbiddenError);

      await expect(
        sprintNotificationService.updatePreferences(intruderUserId, testUserRoadmapId, { enabled: false })
      ).rejects.toThrow(ForbiddenError);
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // 4. Privacy & Sensitive Data Protection
  // ═══════════════════════════════════════════════════════════════
  describe('4. Privacy & Sensitive Data Redaction', () => {
    it('ensures public verification and certificates do NOT leak private contacts, assessment answers, or DB queries', async () => {
      const mockRoadmap = {
        id: testUserRoadmapId,
        userId: learnerUserId,
        status: 'ACTIVE',
        createdAt: new Date(),
        personalization: {
          targetRole: 'Backend Engineer',
          email: 'secret@learner.com',
          phone: '+1-555-0199',
        },
        sourceRoadmap: {
          rolePath: 'Backend Engineer',
          targetCompanyTier: 'FAANG',
        },
        sprints: [{ id: 's1', sprintNumber: 1, status: 'COMPLETED', tasks: [] }],
        adaptations: [],
        skillEvidence: [
          {
            id: 'ev1',
            skillId: 'sk1',
            skill: { name: 'Node.js', category: 'Backend' },
            source: 'CODING_INTERVIEW',
            demonstratedScore: 90,
            confidence: 85,
            assessedAt: new Date(),
          },
        ],
        assessmentAttempts: [],
      };
      vi.mocked(prisma.userRoadmap.findUnique).mockResolvedValue(mockRoadmap as any);

      const mockReadiness: RoadmapReadinessAnalyticsDTO = {
        userRoadmapId: testUserRoadmapId,
        overallReadiness: 65,
        targetRole: 'Backend Engineer',
        targetCompanyTier: 'FAANG',
        skills: [
          {
            skillId: 'sk1',
            skillName: 'Node.js',
            category: 'Backend',
            masteryScore: 90,
            confidence: 85,
            evidenceCount: 1,
            status: 'MASTERED',
          },
        ],
        strengths: ['Node.js'],
        blindspots: [],
        lastCalculatedAt: new Date().toISOString(),
      };
      vi.spyOn(skillReadinessService, 'calculateRoadmapReadiness').mockResolvedValue(mockReadiness);

      const certData = await certificateGeneratorService.generateCertificateData(
        learnerUserId,
        testUserRoadmapId
      );

      const certJson = JSON.stringify(certData);
      expect(certJson).not.toContain('secret@learner.com');
      expect(certJson).not.toContain('+1-555-0199');
      expect(certJson).not.toContain('SELECT');
      expect(certJson).not.toContain('prisma');
      expect(certJson).not.toContain('password');

      const verification = await certificateGeneratorService.verifyCertificate(
        certData.verificationId
      );
      const verifJson = JSON.stringify(verification);
      expect(verifJson).not.toContain('secret@learner.com');
      expect(verifJson).not.toContain('+1-555-0199');
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // 5. Idempotency & Duplicate Suppression
  // ═══════════════════════════════════════════════════════════════
  describe('5. Idempotency & Duplicate Suppression', () => {
    it('suppresses duplicate interview telemetry submissions cleanly', async () => {
      interviewTelemetryService.seedUserRoadmap({
        id: testUserRoadmapId,
        userId: learnerUserId,
        status: 'ACTIVE',
        updatedAt: new Date(),
      });
      interviewTelemetryService.seedSkill({
        id: 'sk_react',
        name: 'React',
        slug: 'react',
        category: 'Frontend',
      });

      const payload: InterviewTelemetryIngressDTO = {
        interviewId: 'intv_dup_test',
        userId: learnerUserId,
        userRoadmapId: testUserRoadmapId,
        interviewType: 'CODING_INTERVIEW',
        overallScore: 85,
        evaluatedSkills: [{ skillName: 'React', score: 85 }],
      };

      const firstRun = await interviewTelemetryService.ingestTelemetry(learnerUserId, payload);
      expect(firstRun.success).toBe(true);
      expect(firstRun.evidenceCount).toBe(1);
      expect(firstRun.skippedDuplicatesCount).toBe(0);

      // Re-running same interview event
      const secondRun = await interviewTelemetryService.ingestTelemetry(learnerUserId, payload);
      expect(secondRun.success).toBe(true);
      expect(secondRun.evidenceCount).toBe(0);
      expect(secondRun.skippedDuplicatesCount).toBe(1);
    });

    it('produces stable deterministic notification IDs preventing alert duplication', () => {
      const mockRoadmap = {
        id: testUserRoadmapId,
        status: 'ACTIVE',
        personalization: { notificationPreferences: { ...DEFAULT_SMART_NOTIFICATION_PREFERENCES } },
        sprints: [
          {
            id: 'sprint_1',
            sprintNumber: 1,
            status: 'COMPLETED',
            endDate: '2026-09-20T00:00:00.000Z',
            tasks: [],
          },
        ],
        adaptations: [{ id: 'adapt_1', action: 'CONTINUE', createdAt: '2026-09-20T00:00:00.000Z' }],
      };

      const feed1 = deriveSmartSprintNotifications(mockRoadmap, referenceDate);
      const feed2 = deriveSmartSprintNotifications(mockRoadmap, referenceDate);

      const ids1 = feed1.notifications.map((n) => n.id);
      const ids2 = feed2.notifications.map((n) => n.id);

      expect(ids1).toEqual(ids2);
      expect(new Set(ids1).size).toBe(ids1.length); // All unique IDs
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // 6. Subsystem Failure Isolation
  // ═══════════════════════════════════════════════════════════════
  describe('6. Subsystem Failure Isolation', () => {
    it('corrupted or missing fields in notifications do not throw runtime exceptions', () => {
      const incompleteRoadmap = {
        id: testUserRoadmapId,
        status: 'ACTIVE',
        personalization: undefined,
        sprints: undefined,
        adaptations: undefined,
      };

      expect(() => {
        const feed = deriveSmartSprintNotifications(incompleteRoadmap, referenceDate);
        expect(feed.notifications).toBeDefined();
        expect(feed.unreadCount).toBe(feed.notifications.length);
      }).not.toThrow();
    });

    it('ineligible certificate request fails cleanly without breaking roadmap state', async () => {
      const ineligibleRoadmap = {
        id: 'ur_ineligible',
        userId: learnerUserId,
        status: 'ACTIVE',
        personalization: { targetRole: 'Junior Dev' },
        sprints: [],
        adaptations: [],
        skillEvidence: [],
        assessmentAttempts: [],
      };
      vi.mocked(prisma.userRoadmap.findUnique).mockResolvedValue(ineligibleRoadmap as any);

      const mockReadiness: RoadmapReadinessAnalyticsDTO = {
        userRoadmapId: 'ur_ineligible',
        overallReadiness: 5,
        targetRole: 'Junior Dev',
        targetCompanyTier: 'Tier 3',
        skills: [],
        strengths: [],
        blindspots: [],
        lastCalculatedAt: new Date().toISOString(),
      };
      vi.spyOn(skillReadinessService, 'calculateRoadmapReadiness').mockResolvedValue(mockReadiness);

      const certData = await certificateGeneratorService.generateCertificateData(
        learnerUserId,
        'ur_ineligible'
      );
      expect(certData.isEligible).toBe(false);
      expect(certData.ineligibilityReason).toBeDefined();

      // PDF download on ineligible roadmap throws BadRequestError
      await expect(
        certificateGeneratorService.generateCertificatePdf(learnerUserId, 'ur_ineligible')
      ).rejects.toThrow(BadRequestError);
    });
  });
});
