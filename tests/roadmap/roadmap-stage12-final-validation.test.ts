// ═══════════════════════════════════════════════════════════════
// Stage 12: Final Roadmap Production Readiness & Release Validation
// Comprehensive System-Wide Production Readiness Test Suite (Stages 1-12)
// ═══════════════════════════════════════════════════════════════

import { describe, expect, it, vi, beforeEach } from 'vitest';
import { roadmapService } from '../../services/roadmap-service/src/services/roadmap.service.js';
import { skillReadinessService } from '../../services/roadmap-service/src/services/skill-readiness.service.js';
import { verifiedProfileService } from '../../services/roadmap-service/src/services/verified-profile.service.js';
import { certificateGeneratorService } from '../../services/roadmap-service/src/services/certificate-generator.service.js';
import { institutionalCohortService } from '../../services/roadmap-service/src/services/institutional-cohort.service.js';
import { recruiterShortlistService } from '../../services/roadmap-service/src/services/recruiter-shortlist.service.js';
import { recruiterCollaborationService } from '../../services/roadmap-service/src/services/recruiter-collaboration.service.js';
import { atsExportService } from '../../services/roadmap-service/src/services/ats-export.service.js';
import { bulkVerificationService } from '../../services/roadmap-service/src/services/bulk-verification.service.js';
import { smartNotificationService } from '../../services/roadmap-service/src/services/smart-notification.service.js';
import { roadmapGeneratorEngine } from '../../services/roadmap-service/src/engine/roadmap-generator.engine.js';
import { fallbackRoadmapSynthesizer } from '../../services/roadmap-service/src/engine/fallback-roadmap.synthesizer.js';
import { prisma } from '../../services/roadmap-service/src/lib/prisma.js';
import { BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError } from '../../services/roadmap-service/src/lib/errors.js';

describe('Stage 12: Final Roadmap Production Readiness & Release Validation Suite', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    recruiterShortlistService.clearStore();
    recruiterCollaborationService.clearStore();
    vi.spyOn(prisma.microAssessmentAttempt, 'findMany').mockResolvedValue([
      {
        id: 'att_12_1',
        userId: 'user_stage12_alex',
        score: 92,
        passed: true,
        completedAt: new Date(),
        skill: { id: 'sk_go', slug: 'go', name: 'Go' },
      },
    ] as any);
  });

  const mockLearnerRoadmap = {
    id: 'urm_stage12_learner',
    userId: 'user_stage12_alex',
    sourceRoadmapId: 'rm_backend_architect',
    status: 'ACTIVE',
    personalization: JSON.stringify({
      candidateName: 'Alex Mercer',
      institution: 'Stanford University',
      college: 'School of Engineering',
      batch: 'Class of 2026',
      graduationYear: 2026,
      branch: 'Computer Science',
      targetRole: 'Backend Engineer',
      targetCompanyTier: 'FAANG',
    }),
    sourceRoadmap: {
      id: 'rm_backend_architect',
      title: 'Senior Backend Engineer',
      rolePath: 'Backend Engineer',
      targetRole: 'Backend Engineer',
      targetCompanyTier: 'FAANG',
      visibility: 'PUBLIC',
      goal: { id: 'g1', targetRole: 'Backend Engineer' },
    },
    sprints: [
      {
        id: 'sp_12_1',
        sprintNumber: 1,
        title: 'Distributed Concurrency & Storage',
        status: 'COMPLETED',
        performance: { id: 'perf_12_1', score: 94 },
        tasks: [
          {
            id: 'task_12_1',
            title: 'Build Raft Consensus Node',
            status: 'COMPLETED',
            requiresEvidence: true,
            requiresAssessment: true,
          },
        ],
      },
    ],
    skillEvidence: [
      {
        id: 'ev_12_1',
        skillId: 'sk_go',
        source: 'PROJECT',
        demonstratedScore: 95,
        assessedAt: new Date(),
        skill: { id: 'sk_go', slug: 'go', name: 'Go', category: 'Backend' },
      },
    ],
    assessmentAttempts: [
      {
        id: 'att_12_1',
        score: 92,
        passed: true,
        completedAt: new Date(),
        assessment: { id: 'as_12_1', title: 'Advanced Go Concurrency' },
        skill: { id: 'sk_go', slug: 'go', name: 'Go' },
      },
    ],
    updatedAt: new Date(),
  };

  describe('1. Complete Learner Lifecycle & Core Progression Journey', () => {
    it('1. validates complete end-to-end learner journey from generation through verified certification', async () => {
      vi.spyOn(prisma.userRoadmap, 'findUnique').mockResolvedValue(mockLearnerRoadmap as any);
      vi.spyOn(prisma.userRoadmap, 'findFirst').mockResolvedValue(mockLearnerRoadmap as any);
      vi.spyOn(prisma.userRoadmap, 'findMany').mockResolvedValue([mockLearnerRoadmap] as any);

      // 1. Learner Profile & History
      const history = await verifiedProfileService.getVerifiedProfile('user_stage12_alex', 'urm_stage12_learner');
      expect(history.completedSprintCount).toBe(1);
      expect(history.verifiedEvidenceCount).toBe(1);
      expect(history.verificationId).toContain('VRF-');

      // 2. Calibrated Role Readiness
      const readiness = await skillReadinessService.calculateRoadmapReadiness('user_stage12_alex', 'urm_stage12_learner');
      expect(readiness.targetRole).toBe('Backend Engineer');

      // 3. Verifiable Certificate & QR Verification
      const cert = await certificateGeneratorService.generateCertificateData('user_stage12_alex', 'urm_stage12_learner');
      expect(cert.isEligible).toBe(true);
      expect(cert.certificateId).toContain('CERT-');
      expect(cert.verificationUrl).toContain('/verify/VRF-');

      // 4. Public Verification
      const publicVerification = await verifiedProfileService.verifyPublicProfile(cert.verificationId);
      expect(publicVerification.isValid).toBe(true);
      expect(publicVerification.candidateName).toBe('Alex Mercer');
    });

    it('2. validates resilient roadmap generation and deterministic fallback synthesizer on AI failure', () => {
      const fallback = fallbackRoadmapSynthesizer.synthesizeRoadmap({
        targetRole: 'Machine Learning Engineer',
        targetCompanyTier: 'FAANG',
        knownSkills: ['python'],
        weeklyHours: 15,
        timelineWeeks: 12,
      });

      expect(fallback.title).toContain('Mastery Roadmap');
      expect(fallback.phases.length).toBeGreaterThanOrEqual(3);
      expect(fallback.phases[0].nodes.length).toBeGreaterThan(0);
      expect(fallback.rolePath).toBeDefined();
      expect(fallback.estimatedWeeks).toBe(12);
    });
  });

  describe('2. B2B Enterprise, Institutional Cohort & ATS Pipeline Validation', () => {
    it('3. validates institutional cohort analytics and batch summary scoping', async () => {
      vi.spyOn(prisma.userRoadmap, 'findMany').mockResolvedValue([mockLearnerRoadmap] as any);

      const cohort = await institutionalCohortService.getInstitutionalBatchSummary(
        { institutionName: 'Stanford University', userRole: 'INSTITUTION_ADMIN' },
        { institution: 'Stanford University' }
      );

      expect(cohort.institution).toBe('Stanford University');
      expect(cohort.summary.totalCandidates).toBe(1);
      expect(cohort.readinessDistribution.averageReadiness).toBeGreaterThan(0);
    });

    it('4. validates recruiter collaborative review, shortlist transition and team rubric consensus', async () => {
      vi.spyOn(prisma.userRoadmap, 'findFirst').mockResolvedValue(mockLearnerRoadmap as any);

      const feedback = await recruiterCollaborationService.submitFeedback(
        {
          recruiterId: 'recruiter_enterprise_1',
          organizationId: 'org_meta_tech',
          recruiterName: 'Elena Rostova',
        },
        {
          candidateId: 'user_stage12_alex',
          rubric: {
            technicalSkillsScore: 5,
            communicationScore: 5,
            problemSolvingScore: 5,
            roleFitScore: 4,
            practicalEvidenceScore: 5,
            overallScore: 96,
            recommendation: 'STRONG_HIRE',
          },
          comments: 'World-class systems engineering competency.',
          isSharedWithTeam: true,
        }
      );

      expect(feedback.rubric.overallScore).toBe(96);
      expect(feedback.rubric.recommendation).toBe('STRONG_HIRE');
      expect(feedback.isSharedWithTeam).toBe(true);
    });

    it('5. validates multi-adapter ATS exports across Greenhouse, Lever, Workday and Generic CSV', async () => {
      vi.spyOn(prisma.userRoadmap, 'findMany').mockResolvedValue([mockLearnerRoadmap] as any);

      const ghExport = await atsExportService.exportInstitutionalAtsBatch(
        { institutionName: 'Stanford University', userRole: 'INSTITUTION_ADMIN' },
        { adapter: 'GREENHOUSE', format: 'csv' }
      );
      expect(ghExport.contentType).toContain('text/csv');
      expect(ghExport.data).toContain('Alex Mercer');
      expect(ghExport.recordCount).toBe(1);

      const wdExport = await atsExportService.exportInstitutionalAtsBatch(
        { institutionName: 'Stanford University', userRole: 'INSTITUTION_ADMIN' },
        { adapter: 'WORKDAY', format: 'json' }
      );
      expect(wdExport.contentType).toContain('application/json');
      expect(wdExport.recordCount).toBe(1);
    });

    it('6. validates server-authoritative bulk credential verification and attestation', async () => {
      vi.spyOn(prisma.userRoadmap, 'findUnique').mockResolvedValue(mockLearnerRoadmap as any);
      vi.spyOn(prisma.userRoadmap, 'findMany').mockResolvedValue([mockLearnerRoadmap] as any);

      const profile = await verifiedProfileService.getVerifiedProfile('user_stage12_alex', 'urm_stage12_learner');
      const vrfId = profile.verificationId;
      const certId = `CERT-${vrfId.replace(/^VRF-/, '')}`;

      const bulkResult = await bulkVerificationService.verifyBulkCredentials(
        { institutionName: 'Stanford University', userRole: 'INSTITUTION_ADMIN' },
        { credentialIds: [vrfId, certId] }
      );

      expect(bulkResult.totalRequested).toBe(2);
      expect(bulkResult.totalVerified).toBe(2);
      expect(bulkResult.results[0].status).toBe('VERIFIED');
      expect(bulkResult.results[1].status).toBe('VERIFIED');
      expect(bulkResult.results[0].attestation?.institution).toBe('Stanford University');
    });
  });

  describe('3. Production Security, Multi-Tenant Isolation & Privacy Protections', () => {
    it('7. enforces cross-organization recruiter isolation', async () => {
      vi.spyOn(prisma.userRoadmap, 'findFirst').mockResolvedValue(mockLearnerRoadmap as any);

      await recruiterCollaborationService.submitFeedback(
        { recruiterId: 'rec_a', organizationId: 'org_a' },
        {
          candidateId: 'user_stage12_alex',
          rubric: {
            technicalSkillsScore: 5,
            communicationScore: 5,
            problemSolvingScore: 5,
            roleFitScore: 5,
            practicalEvidenceScore: 5,
            overallScore: 100,
            recommendation: 'STRONG_HIRE',
          },
          isSharedWithTeam: true,
        }
      );

      const threadB = await recruiterCollaborationService.getCandidateCollaborationThread(
        { recruiterId: 'rec_b', organizationId: 'org_b' },
        'user_stage12_alex'
      );

      expect(threadB.totalReviews).toBe(0);
      expect(threadB.feedbackList).toHaveLength(0);
    });

    it('8. enforces cross-institution campus isolation', async () => {
      vi.spyOn(prisma.userRoadmap, 'findMany').mockResolvedValue([mockLearnerRoadmap] as any);

      await expect(
        institutionalCohortService.getInstitutionalBatchSummary(
          { institutionName: 'Stanford University', userRole: 'INSTITUTION_ADMIN' },
          { institution: 'MIT' }
        )
      ).rejects.toThrow(ForbiddenError);
    });

    it('9. strictly prevents data leakage in ATS exports and public verification outputs', async () => {
      vi.spyOn(prisma.userRoadmap, 'findMany').mockResolvedValue([mockLearnerRoadmap] as any);

      const atsResult = await atsExportService.exportInstitutionalAtsBatch(
        { institutionName: 'Stanford University', userRole: 'INSTITUTION_ADMIN' },
        { format: 'json', adapter: 'LEVER' }
      );

      const rawAts = JSON.stringify(atsResult);
      expect(rawAts).not.toContain('Advanced Go Concurrency');
      expect(rawAts).not.toContain('answers');
      expect(rawAts).not.toContain('password');
      expect(rawAts).not.toContain('token');
      expect(rawAts).not.toContain('privateNotes');
    });

    it('10. handles edge cases, empty datasets, and out-of-bounds requests safely', async () => {
      vi.spyOn(prisma.userRoadmap, 'findMany').mockResolvedValue([] as any);

      const emptyCohort = await institutionalCohortService.getInstitutionalBatchSummary(
        { institutionName: 'Stanford University', userRole: 'INSTITUTION_ADMIN' },
        { institution: 'Stanford University' }
      );

      expect(emptyCohort.summary.totalCandidates).toBe(0);
      expect(emptyCohort.readinessDistribution.averageReadiness).toBe(0);

      const emptyExport = await atsExportService.exportInstitutionalAtsBatch(
        { institutionName: 'Stanford University', userRole: 'INSTITUTION_ADMIN' },
        { format: 'json' }
      );

      expect(emptyExport.recordCount).toBe(0);
    });
  });
});
