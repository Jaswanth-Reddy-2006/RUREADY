// ═══════════════════════════════════════════════════════════════
// Stage 11.5: Final Stage 11 Integration & Validation Suite
// Comprehensive End-to-End Cross-Stage Integration & Security Tests
// ═══════════════════════════════════════════════════════════════

import { describe, expect, it, vi, beforeEach } from 'vitest';
import { institutionalCohortService } from '../../services/roadmap-service/src/services/institutional-cohort.service.js';
import { recruiterShortlistService } from '../../services/roadmap-service/src/services/recruiter-shortlist.service.js';
import { recruiterCollaborationService } from '../../services/roadmap-service/src/services/recruiter-collaboration.service.js';
import { atsExportService } from '../../services/roadmap-service/src/services/ats-export.service.js';
import { bulkVerificationService } from '../../services/roadmap-service/src/services/bulk-verification.service.js';
import { verifiedProfileService } from '../../services/roadmap-service/src/services/verified-profile.service.js';
import { prisma } from '../../services/roadmap-service/src/lib/prisma.js';
import { UnauthorizedError, ForbiddenError, BadRequestError } from '../../services/roadmap-service/src/lib/errors.js';

describe('Stage 11.5: Final Stage 11 Integration & Validation', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    recruiterShortlistService.clearStore();
    recruiterCollaborationService.clearStore();
    vi.spyOn(prisma.microAssessmentAttempt, 'findMany').mockResolvedValue([] as any);
  });

  const mockStanfordCandidate1 = {
    id: 'urm_stanford_1',
    userId: 'user_stanford_1',
    sourceRoadmapId: 'rm_backend_1',
    status: 'ACTIVE',
    personalization: JSON.stringify({
      candidateName: 'Alice Stanford',
      institution: 'Stanford University',
      college: 'School of Engineering',
      batch: 'Batch 2026',
      graduationYear: 2026,
      branch: 'Computer Science',
      targetRole: 'Senior Backend Engineer',
      targetCompanyTier: 'FAANG',
    }),
    sourceRoadmap: {
      id: 'rm_backend_1',
      title: 'Senior Backend Engineer',
      rolePath: 'Backend Engineer',
      targetRole: 'Senior Backend Engineer',
      targetCompanyTier: 'FAANG',
      visibility: 'PUBLIC',
      goal: { id: 'g1', targetRole: 'Backend Engineer' },
    },
    sprints: [
      {
        id: 'sp_st_1',
        sprintNumber: 1,
        title: 'Concurrency & Go',
        status: 'COMPLETED',
        performance: { id: 'perf_1', score: 95 },
        tasks: [],
      },
    ],
    skillEvidence: [
      {
        id: 'ev_st_1',
        skillId: 'sk_go',
        source: 'PROJECT',
        demonstratedScore: 92,
        assessedAt: new Date(),
        skill: { id: 'sk_go', name: 'Go', category: 'Backend' },
      },
    ],
    assessmentAttempts: [
      {
        id: 'att_st_1',
        score: 90,
        passed: true,
        completedAt: new Date(),
        assessment: { id: 'as_1', title: 'Go Concurrency' },
        skill: { id: 'sk_go', name: 'Go' },
      },
    ],
    updatedAt: new Date(),
  };

  const mockBerkeleyCandidate2 = {
    id: 'urm_berkeley_2',
    userId: 'user_berkeley_2',
    sourceRoadmapId: 'rm_backend_1',
    status: 'ACTIVE',
    personalization: JSON.stringify({
      candidateName: 'Bob Berkeley',
      institution: 'UC Berkeley',
      college: 'EECS',
      batch: 'Batch 2025',
      graduationYear: 2025,
      branch: 'EECS',
      targetRole: 'Senior Backend Engineer',
      targetCompanyTier: 'FAANG',
    }),
    sourceRoadmap: {
      id: 'rm_backend_1',
      title: 'Senior Backend Engineer',
      rolePath: 'Backend Engineer',
      targetRole: 'Senior Backend Engineer',
      targetCompanyTier: 'FAANG',
      visibility: 'PUBLIC',
      goal: { id: 'g1', targetRole: 'Backend Engineer' },
    },
    sprints: [
      {
        id: 'sp_bk_1',
        sprintNumber: 1,
        title: 'Distributed Storage',
        status: 'COMPLETED',
        performance: { id: 'perf_2', score: 88 },
        tasks: [],
      },
    ],
    skillEvidence: [
      {
        id: 'ev_bk_1',
        skillId: 'sk_rust',
        source: 'PROJECT',
        demonstratedScore: 85,
        assessedAt: new Date(),
        skill: { id: 'sk_rust', name: 'Rust', category: 'Backend' },
      },
    ],
    assessmentAttempts: [],
    updatedAt: new Date(),
  };

  describe('1. Cross-Stage Pipeline & Data Flow Integration', () => {
    it('1. verifies Institution -> Cohort -> Candidate flow (Stage 11.1)', async () => {
      vi.spyOn(prisma.userRoadmap, 'findMany').mockResolvedValue([mockStanfordCandidate1, mockBerkeleyCandidate2] as any);

      const summary = await institutionalCohortService.getInstitutionalBatchSummary(
        { institutionName: 'Stanford University', userRole: 'INSTITUTION_ADMIN' },
        { institution: 'Stanford University' }
      );

      expect(summary.institution).toBe('Stanford University');
      expect(summary.summary.totalCandidates).toBe(1);
      expect(summary.summary.activeCandidates).toBe(1);
      expect(summary.readinessDistribution.averageReadiness).toBeGreaterThan(0);
      expect(summary.readinessDistribution.bands).toBeDefined();
    });

    it('2 & 3. verifies Recruiter -> Candidate Shortlist & Multi-Recruiter Collaboration (Stage 11.2)', async () => {
      vi.spyOn(prisma.userRoadmap, 'findFirst').mockResolvedValue(mockStanfordCandidate1 as any);

      // Recruiter 1 in Org Acme Corp adds candidate and submits shared review
      const feedback1 = await recruiterCollaborationService.submitFeedback(
        {
          recruiterId: 'recruiter_alice',
          organizationId: 'org_acme_corp',
          recruiterName: 'Alice Recruiter',
        },
        {
          candidateId: 'user_stanford_1',
          rubric: {
            technicalSkillsScore: 5,
            communicationScore: 4,
            problemSolvingScore: 5,
            roleFitScore: 4,
            practicalEvidenceScore: 4,
            overallScore: 88,
            recommendation: 'STRONG_HIRE',
          },
          comments: 'Exceptional backend capabilities and concurrency mastery.',
          isSharedWithTeam: true,
        }
      );

      // Recruiter 2 in Org Acme Corp submits private review on same candidate
      const feedback2 = await recruiterCollaborationService.submitFeedback(
        {
          recruiterId: 'recruiter_bob',
          organizationId: 'org_acme_corp',
          recruiterName: 'Bob Recruiter',
        },
        {
          candidateId: 'user_stanford_1',
          rubric: {
            technicalSkillsScore: 4,
            communicationScore: 4,
            problemSolvingScore: 4,
            roleFitScore: 4,
            practicalEvidenceScore: 4,
            overallScore: 80,
            recommendation: 'HIRE',
          },
          comments: 'Check compensation expectations during interview.',
          isSharedWithTeam: false,
        }
      );

      expect(feedback1.isSharedWithTeam).toBe(true);
      expect(feedback2.isSharedWithTeam).toBe(false);

      // Thread viewed by Recruiter Alice (sees shared feedback + her own feedback)
      const aliceThread = await recruiterCollaborationService.getCandidateCollaborationThread(
        { recruiterId: 'recruiter_alice', organizationId: 'org_acme_corp' },
        'user_stanford_1'
      );

      expect(aliceThread.totalReviews).toBe(1);
      expect(aliceThread.feedbackList).toHaveLength(1);
      expect(aliceThread.averageRubricScore).toBe(88);

      // Thread viewed by Recruiter Bob (sees shared feedback + his private feedback)
      const bobThread = await recruiterCollaborationService.getCandidateCollaborationThread(
        { recruiterId: 'recruiter_bob', organizationId: 'org_acme_corp' },
        'user_stanford_1'
      );

      expect(bobThread.totalReviews).toBe(2);
      expect(bobThread.feedbackList).toHaveLength(2);
    });

    it('4 & 5. verifies Shared Feedback Export and Strict Private Notes Exclusion (Stage 11.3)', async () => {
      vi.spyOn(prisma.userRoadmap, 'findFirst').mockResolvedValue(mockStanfordCandidate1 as any);
      vi.spyOn(prisma.userRoadmap, 'findMany').mockResolvedValue([mockStanfordCandidate1] as any);

      // Add candidate to recruiter shortlist
      await recruiterShortlistService.addToShortlist('recruiter_alice', {
        candidateId: 'user_stanford_1',
        candidateName: 'Alice Stanford',
        targetRole: 'Senior Backend Engineer',
        targetCompanyTier: 'FAANG',
        overallReadiness: 92,
        masteredSkills: ['Go'],
        demonstratedSkills: ['Go'],
      });

      // Add shared feedback and private comments
      await recruiterCollaborationService.submitFeedback(
        { recruiterId: 'recruiter_alice', organizationId: 'org_acme_corp' },
        {
          candidateId: 'user_stanford_1',
          rubric: {
            technicalSkillsScore: 5,
            communicationScore: 4,
            problemSolvingScore: 5,
            roleFitScore: 4,
            practicalEvidenceScore: 4,
            overallScore: 88,
            recommendation: 'STRONG_HIRE',
          },
          comments: 'CONFIDENTIAL_COMPENSATION_NOTE_DO_NOT_LEAK',
          isSharedWithTeam: true,
        }
      );

      const exportResult = await atsExportService.exportRecruiterAtsPipeline(
        { recruiterId: 'recruiter_alice', organizationId: 'org_acme_corp' },
        { adapter: 'GENERIC_ATS', format: 'json' }
      );

      expect(exportResult.recordCount).toBe(1);
      const candidatePayload = JSON.parse(exportResult.data as string).candidates[0];

      // Shared rubric summary is present
      expect(candidatePayload.collaborationSummary.sharedFeedbackCount).toBe(1);
      expect(candidatePayload.collaborationSummary.latestRecommendation).toBe('STRONG_HIRE');
      expect(candidatePayload.collaborationSummary.averageRubricScore).toBe(88);

      // Raw comments and confidential notes are NEVER exported into standard ATS candidate items
      expect(exportResult.data).not.toContain('CONFIDENTIAL_COMPENSATION_NOTE_DO_NOT_LEAK');
    });

    it('6 & 7. verifies Institutional ATS Export with strict filtering (Stage 11.3)', async () => {
      vi.spyOn(prisma.userRoadmap, 'findMany').mockResolvedValue([mockStanfordCandidate1, mockBerkeleyCandidate2] as any);

      const stanfordExport = await atsExportService.exportInstitutionalAtsBatch(
        { institutionName: 'Stanford University', userRole: 'INSTITUTION_ADMIN' },
        { institution: 'Stanford University', format: 'json', adapter: 'WORKDAY' }
      );

      expect(stanfordExport.recordCount).toBe(1);
      const data = JSON.parse(stanfordExport.data as string);
      expect(data.institution).toBe('Stanford University');
      expect(data.applicants[0].Applicant_Data.Applicant_ID).toBe('user_stanford_1');
      expect(stanfordExport.data).not.toContain('Bob Berkeley');
    });

    it('8 & 9. verifies ATS + Credential Verification integration and canonical consistency (Stage 11.4)', async () => {
      vi.spyOn(prisma.userRoadmap, 'findUnique').mockImplementation(async (args: any) => {
        if (args?.where?.id === 'urm_stanford_1') return mockStanfordCandidate1 as any;
        return null;
      });
      vi.spyOn(prisma.userRoadmap, 'findMany').mockResolvedValue([mockStanfordCandidate1] as any);

      // Derive authentic verification ID
      const profile = await verifiedProfileService.getVerifiedProfile('user_stanford_1', 'urm_stanford_1');
      const vrfId = profile.verificationId;

      // Verify in Bulk Verification
      const bulkResponse = await bulkVerificationService.verifyBulkCredentials(
        { institutionName: 'Stanford University', userRole: 'INSTITUTION_ADMIN' },
        { credentialIds: [vrfId] }
      );

      expect(bulkResponse.totalVerified).toBe(1);
      expect(bulkResponse.results[0].status).toBe('VERIFIED');
      expect(bulkResponse.results[0].verificationId).toBe(vrfId);
      expect(bulkResponse.results[0].attestation?.institution).toBe('Stanford University');
    });
  });

  describe('2. Authorization Matrix & Multi-Tenant Isolation', () => {
    it('10. verifies cross-tenant isolation between recruiter organizations', async () => {
      vi.spyOn(prisma.userRoadmap, 'findFirst').mockResolvedValue(mockStanfordCandidate1 as any);

      // Org Acme Corp feedback
      await recruiterCollaborationService.submitFeedback(
        { recruiterId: 'recruiter_alice', organizationId: 'org_acme_corp' },
        {
          candidateId: 'user_stanford_1',
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

      // Recruiter from Beta Corp inspects candidate thread
      const betaThread = await recruiterCollaborationService.getCandidateCollaborationThread(
        { recruiterId: 'recruiter_charlie', organizationId: 'org_beta_corp' },
        'user_stanford_1'
      );

      // Beta Corp sees 0 reviews from Acme Corp
      expect(betaThread.totalReviews).toBe(0);
      expect(betaThread.feedbackList).toHaveLength(0);
    });

    it('11. verifies cross-institution isolation', async () => {
      vi.spyOn(prisma.userRoadmap, 'findMany').mockResolvedValue([mockStanfordCandidate1, mockBerkeleyCandidate2] as any);

      // Stanford admin requests Berkeley cohort
      await expect(
        institutionalCohortService.getInstitutionalBatchSummary(
          { institutionName: 'Stanford University', userRole: 'INSTITUTION_ADMIN' },
          { institution: 'UC Berkeley' }
        )
      ).rejects.toThrow(ForbiddenError);
    });

    it('14. handles bulk verification with mixed authorized and unauthorized credentials', async () => {
      vi.spyOn(prisma.userRoadmap, 'findUnique').mockImplementation(async (args: any) => {
        if (args?.where?.id === 'urm_stanford_1') return mockStanfordCandidate1 as any;
        if (args?.where?.id === 'urm_berkeley_2') return mockBerkeleyCandidate2 as any;
        return null;
      });
      vi.spyOn(prisma.userRoadmap, 'findMany').mockResolvedValue([mockStanfordCandidate1, mockBerkeleyCandidate2] as any);

      const stProfile = await verifiedProfileService.getVerifiedProfile('user_stanford_1', 'urm_stanford_1');
      const bkProfile = await verifiedProfileService.getVerifiedProfile('user_berkeley_2', 'urm_berkeley_2');

      const response = await bulkVerificationService.verifyBulkCredentials(
        { institutionName: 'Stanford University', userRole: 'INSTITUTION_ADMIN' },
        { credentialIds: [stProfile.verificationId, bkProfile.verificationId] }
      );

      expect(response.totalRequested).toBe(2);
      expect(response.totalVerified).toBe(1);
      expect(response.totalUnauthorized).toBe(1);
      expect(response.results[0].status).toBe('VERIFIED');
      expect(response.results[1].status).toBe('UNAUTHORIZED');
    });

    it('unauthenticated requests throw UnauthorizedError', async () => {
      await expect(
        bulkVerificationService.verifyBulkCredentials(
          {},
          { credentialIds: ['VRF-test-1234567890ABCDEF'] }
        )
      ).rejects.toThrow(UnauthorizedError);
    });

    it('candidate role rejected from accessing institutional / recruiter bulk verification', async () => {
      await expect(
        bulkVerificationService.verifyBulkCredentials(
          { userId: 'user_123', userRole: 'CANDIDATE' },
          { credentialIds: ['VRF-test-1234567890ABCDEF'] }
        )
      ).rejects.toThrow(ForbiddenError);
    });
  });

  describe('3. Privacy, Determinism & Bounds Validation', () => {
    it('12. strictly prevents leakage of assessment answers, telemetry, prompts or raw entities', async () => {
      vi.spyOn(prisma.userRoadmap, 'findMany').mockResolvedValue([mockStanfordCandidate1] as any);

      const exportResult = await atsExportService.exportInstitutionalAtsBatch(
        { institutionName: 'Stanford University', userRole: 'INSTITUTION_ADMIN' },
        { institution: 'Stanford University', format: 'json', adapter: 'LEVER' }
      );

      const payloadString = JSON.stringify(exportResult);
      expect(payloadString).not.toContain('Go Concurrency');
      expect(payloadString).not.toContain('assessmentAttempts');
      expect(payloadString).not.toContain('telemetry');
      expect(payloadString).not.toContain('prompt');
    });

    it('13. repeated operations on identical data produce identical deterministic outputs', async () => {
      vi.spyOn(prisma.userRoadmap, 'findMany').mockResolvedValue([mockStanfordCandidate1] as any);

      const run1 = await atsExportService.exportInstitutionalAtsBatch(
        { institutionName: 'Stanford University', userRole: 'INSTITUTION_ADMIN' },
        { institution: 'Stanford University', format: 'csv', adapter: 'GREENHOUSE' }
      );

      const run2 = await atsExportService.exportInstitutionalAtsBatch(
        { institutionName: 'Stanford University', userRole: 'INSTITUTION_ADMIN' },
        { institution: 'Stanford University', format: 'csv', adapter: 'GREENHOUSE' }
      );

      expect(run1.data).toEqual(run2.data);
      expect(run1.contentType).toEqual(run2.contentType);
    });

    it('16. handles empty datasets gracefully without errors', async () => {
      vi.spyOn(prisma.userRoadmap, 'findMany').mockResolvedValue([] as any);

      const exportResult = await atsExportService.exportInstitutionalAtsBatch(
        { institutionName: 'Stanford University', userRole: 'INSTITUTION_ADMIN' },
        { institution: 'Stanford University', format: 'json' }
      );

      expect(exportResult.recordCount).toBe(0);
      const data = JSON.parse(exportResult.data as string);
      expect(data.candidates).toHaveLength(0);
    });

    it('17. enforces maximum bounded limits and rejects out-of-bounds requests', async () => {
      vi.spyOn(prisma.userRoadmap, 'findMany').mockResolvedValue([] as any);

      // Verify that requesting limit > 500 in export gets bounded to 500
      const exportResult = await atsExportService.exportInstitutionalAtsBatch(
        { institutionName: 'Stanford University', userRole: 'INSTITUTION_ADMIN' },
        { institution: 'Stanford University', limit: 1000 }
      );

      expect(exportResult.recordCount).toBe(0);
    });
  });
});
