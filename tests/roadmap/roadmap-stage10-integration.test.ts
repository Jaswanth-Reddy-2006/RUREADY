// ═══════════════════════════════════════════════════════════════
// Stage 10.6: Final Stage 10 Integration & Hardening Suite
// Complete End-to-End Workflow, Cross-Stage Consistency, Security & Privacy
// ═══════════════════════════════════════════════════════════════

import { describe, expect, it, vi, beforeEach } from 'vitest';
import { recruiterTalentService } from '../../services/roadmap-service/src/services/recruiter-talent.service.js';
import { jobDescriptionMatchService } from '../../services/roadmap-service/src/services/job-description-match.service.js';
import { recruiterShortlistService } from '../../services/roadmap-service/src/services/recruiter-shortlist.service.js';
import { cohortAnalyticsService } from '../../services/roadmap-service/src/services/cohort-analytics.service.js';
import { exportVerificationService } from '../../services/roadmap-service/src/services/export-verification.service.js';
import { verifiedProfileService } from '../../services/roadmap-service/src/services/verified-profile.service.js';
import { certificateGeneratorService } from '../../services/roadmap-service/src/services/certificate-generator.service.js';
import { roadmapController } from '../../services/roadmap-service/src/controllers/roadmap.controller.js';
import { prisma } from '../../services/roadmap-service/src/lib/prisma.js';
import { aiProviderManager } from '../../services/roadmap-service/src/lib/ai-provider-manager.js';
import { UnauthorizedError, ForbiddenError, NotFoundError, BadRequestError } from '../../services/roadmap-service/src/lib/errors.js';

describe('Stage 10.6: Final Stage 10 Integration & Validation', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    recruiterShortlistService.clearStore();
  });

  function createMockReqRes(options: {
    method?: string;
    headers?: Record<string, string | string[] | undefined>;
    params?: Record<string, string>;
    query?: Record<string, any>;
    body?: any;
    protocol?: string;
  }) {
    const req: any = {
      method: options.method || 'GET',
      headers: options.headers || {},
      params: options.params || {},
      query: options.query || {},
      body: options.body || {},
      protocol: options.protocol || 'https',
      get: (headerName: string) => options.headers?.[headerName.toLowerCase()] || 'ruready.dev',
    };

    let statusCode = 200;
    let jsonResponse: any = null;
    let sentData: any = null;
    const responseHeaders: Record<string, string> = {};

    const res: any = {
      status: vi.fn((code: number) => {
        statusCode = code;
        return res;
      }),
      json: vi.fn((data: any) => {
        jsonResponse = data;
        return res;
      }),
      send: vi.fn((data: any) => {
        sentData = data;
        return res;
      }),
      setHeader: vi.fn((name: string, value: string) => {
        responseHeaders[name] = value;
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
      getSentData: () => sentData,
      getResponseHeaders: () => responseHeaders,
    };
  }

  const mockCandidateRoadmap = {
    id: 'urm_stage10_e2e_1',
    userId: 'user_e2e_candidate',
    sourceRoadmapId: 'rm_e2e_distributed',
    status: 'ACTIVE',
    personalization: {
      candidateName: 'Elena Rostova',
      institution: 'UC Berkeley',
      college: 'EECS',
      batch: '2026',
      graduationYear: 2026,
      branch: 'Computer Science',
      targetRole: 'Distributed Systems Engineer',
      targetCompanyTier: 'FAANG',
    },
    sourceRoadmap: {
      id: 'rm_e2e_distributed',
      title: 'Distributed Systems Specialist',
      rolePath: 'Distributed Systems Engineer',
      targetRole: 'Distributed Systems Engineer',
      targetCompanyTier: 'FAANG',
      visibility: 'PUBLIC',
      goal: { id: 'g1', targetRole: 'Distributed Systems Engineer' },
    },
    sprints: [
      {
        id: 'sp_10_1',
        title: 'Sprint 1: Raft Consensus',
        status: 'COMPLETED',
        performance: { id: 'perf_10_1', taskCompletion: 100, assessmentScore: 94, practicalScore: 96 },
      },
    ],
    skillEvidence: [
      {
        id: 'ev_10_1',
        skillId: 'sk_raft',
        source: 'PRACTICAL_DRILL',
        score: 95,
        demonstratedScore: 95,
        confidence: 'HIGH',
        skill: { id: 'sk_raft', name: 'Raft Consensus', category: 'Distributed Systems' },
      },
      {
        id: 'ev_10_2',
        skillId: 'sk_rust',
        source: 'CODING_INTERVIEW',
        score: 92,
        demonstratedScore: 92,
        confidence: 'HIGH',
        skill: { id: 'sk_rust', name: 'Rust', category: 'Language' },
      },
    ],
    assessmentAttempts: [
      {
        id: 'att_10_1',
        score: 94,
        passed: true,
        assessment: { id: 'as_raft', title: 'Raft Protocol Assessment' },
        skill: { id: 'sk_raft', name: 'Raft Consensus' },
      },
    ],
    updatedAt: new Date(),
  };

  describe('1. Complete End-to-End Recruiter Workflow (Stage 10.1 → 10.5)', () => {
    it('executes full pipeline: Search → Match → Shortlist → Transition → Analytics → Export → Verify', async () => {
      vi.spyOn(prisma.userRoadmap, 'findMany').mockResolvedValue([mockCandidateRoadmap as any]);
      vi.spyOn(prisma.userRoadmap, 'findFirst').mockResolvedValue(mockCandidateRoadmap as any);
      vi.spyOn(prisma.userRoadmap, 'findUnique').mockResolvedValue(mockCandidateRoadmap as any);
      vi.spyOn(prisma.microAssessmentAttempt, 'findMany').mockResolvedValue([] as any);

      // 1. Recruiter Talent Search (Stage 10.1)
      const searchResult = await recruiterTalentService.searchCandidates({
        skills: ['Rust'],
        targetRole: 'Distributed Systems',
      });
      expect(searchResult.total).toBe(1);
      const foundCandidate = searchResult.candidates[0];
      expect(foundCandidate.candidateName).toBe('Elena Rostova');
      expect(foundCandidate.demonstratedSkills).toContain('Rust');

      // 2. Job Description Matching (Stage 10.2)
      const matchResult = await jobDescriptionMatchService.matchJobDescription({
        title: 'Senior Distributed Systems Engineer',
        description: 'Senior Distributed Systems Engineer requiring Rust, Raft Consensus, and Kubernetes.',
        requiredSkills: ['Rust', 'Kubernetes'],
      });
      expect(matchResult.totalMatches).toBe(1);
      const matched = matchResult.matches[0];
      expect(matched.matchScore).toBeGreaterThan(0);
      expect(matched.requiredSkillsMatched).toContain('Rust');
      expect(matched.requiredSkillsMissing).toContain('Kubernetes');

      // 3. Shortlist Candidate with Match Context (Stage 10.3)
      const shortlistEntry = await recruiterShortlistService.addToShortlist('recruiter_primary', {
        candidateId: foundCandidate.candidateId,
        userRoadmapId: foundCandidate.userRoadmapId,
        status: 'SHORTLISTED',
        notes: 'Top candidate for distributed team',
        matchContext: {
          jobTitle: 'Senior Distributed Systems Engineer',
          matchScore: matched.matchScore,
          matchedSkills: matched.requiredSkillsMatched,
          missingSkills: matched.requiredSkillsMissing,
        },
      });
      expect(shortlistEntry.status).toBe('SHORTLISTED');
      expect(shortlistEntry.matchContext?.matchScore).toBe(matched.matchScore);
      expect(shortlistEntry.notes).toBe('Top candidate for distributed team');

      // 4. Move Candidate Through Pipeline Transitions (Stage 10.3)
      const reviewing = await recruiterShortlistService.updateShortlistEntry(
        'recruiter_primary',
        shortlistEntry.id,
        { status: 'REVIEWING' }
      );
      expect(reviewing.status).toBe('REVIEWING');

      const interview = await recruiterShortlistService.updateShortlistEntry(
        'recruiter_primary',
        shortlistEntry.id,
        { status: 'INTERVIEW', notes: 'Technical interview scheduled' }
      );
      expect(interview.status).toBe('INTERVIEW');
      expect(interview.notes).toBe('Technical interview scheduled');

      const selected = await recruiterShortlistService.updateShortlistEntry(
        'recruiter_primary',
        shortlistEntry.id,
        { status: 'SELECTED' }
      );
      expect(selected.status).toBe('SELECTED');

      // 5. Aggregate Cohort Analytics (Stage 10.4)
      const cohortAnalytics = await cohortAnalyticsService.getCohortAnalytics({
        institution: 'UC Berkeley',
      });
      expect(cohortAnalytics.summary.totalCandidates).toBe(1);
      expect(cohortAnalytics.readinessDistribution.bands).toHaveLength(4);
      expect(cohortAnalytics.skillsAnalysis.topDemonstratedSkills.length).toBeGreaterThan(0);
      expect(cohortAnalytics.assessmentPerformance.totalAttempts).toBe(1);
      expect(cohortAnalytics.assessmentPerformance.overallPassRate).toBe(100);

      // 6. Recruiter Shortlist Export (Stage 10.5)
      const shortlistCsv = await exportVerificationService.exportRecruiterShortlist('recruiter_primary', {
        format: 'csv',
      });
      expect(shortlistCsv.format).toBe('csv');
      expect(shortlistCsv.data).toContain('Elena Rostova');
      expect(shortlistCsv.data).toContain('SELECTED');
      expect(shortlistCsv.data).toContain('Technical interview scheduled');

      const shortlistJson = await exportVerificationService.exportRecruiterShortlist('recruiter_primary', {
        format: 'json',
      });
      const parsedJson = JSON.parse(shortlistJson.data);
      expect(parsedJson.candidates[0].pipelineStatus).toBe('SELECTED');

      // 7. Cohort Analytics Export (Stage 10.5)
      const cohortCsv = await exportVerificationService.exportCohortAnalytics({
        format: 'csv',
        institution: 'UC Berkeley',
      });
      expect(cohortCsv.format).toBe('csv');
      expect(cohortCsv.data).toContain('--- COHORT SUMMARY METRICS ---');

      // 8. Public Credential Verification & Export (Stage 10.5)
      const profile = await verifiedProfileService.getVerifiedProfile(
        'user_e2e_candidate',
        'urm_stage10_e2e_1'
      );
      const verifiedPublic = await verifiedProfileService.verifyPublicProfile(profile.verificationId);
      expect(verifiedPublic.isValid).toBe(true);
      expect(verifiedPublic.candidateName).toBe('Elena Rostova');

      const verificationExport = await exportVerificationService.exportVerificationRecord(
        profile.verificationId,
        'json'
      );
      const parsedExport = JSON.parse(verificationExport.data);
      expect(parsedExport.verificationId).toBe(profile.verificationId);
      expect(parsedExport.targetRole).toBe('Distributed Systems Engineer');
    });
  });

  describe('2. Cross-Stage Data Consistency', () => {
    it('maintains consistent readiness, skills, and verification identifiers across all services', async () => {
      vi.spyOn(prisma.userRoadmap, 'findMany').mockResolvedValue([mockCandidateRoadmap as any]);
      vi.spyOn(prisma.userRoadmap, 'findFirst').mockResolvedValue(mockCandidateRoadmap as any);
      vi.spyOn(prisma.userRoadmap, 'findUnique').mockResolvedValue(mockCandidateRoadmap as any);
      vi.spyOn(prisma.microAssessmentAttempt, 'findMany').mockResolvedValue([] as any);

      // Search vs Shortlist vs Verified Profile
      const searchRes = await recruiterTalentService.searchCandidates();
      const candidateCard = searchRes.candidates[0];

      const shortlistRes = await recruiterShortlistService.addToShortlist('recruiter_1', {
        candidateId: candidateCard.candidateId,
      });

      const profile = await verifiedProfileService.getVerifiedProfile(
        'user_e2e_candidate',
        'urm_stage10_e2e_1'
      );

      // Check identical authoritative values
      expect(candidateCard.overallReadiness).toBe(shortlistRes.overallReadiness);
      expect(candidateCard.targetRole).toBe(shortlistRes.targetRole);
      expect(candidateCard.targetCompanyTier).toBe(shortlistRes.targetCompanyTier);
      expect(candidateCard.demonstratedSkills).toEqual(shortlistRes.demonstratedSkills);
      expect(candidateCard.verificationId).toBe(shortlistRes.verificationId);
      expect(candidateCard.verificationUrl).toBe(shortlistRes.verificationUrl);
      expect(candidateCard.userRoadmapId).toBe(profile.userRoadmapId);
      expect(candidateCard.candidateName).toBe(profile.candidateName);
      expect(candidateCard.targetRole).toBe(profile.targetRole);
    });
  });

  describe('3. Multi-Tenant Recruiter Security & Authorization Isolation', () => {
    it('strictly isolates Recruiter A and Recruiter B pipelines and private notes', async () => {
      vi.spyOn(prisma.userRoadmap, 'findFirst').mockResolvedValue(mockCandidateRoadmap as any);

      // Recruiter A shortlists candidate
      const entryA = await recruiterShortlistService.addToShortlist('recruiter_A', {
        candidateId: 'user_e2e_candidate',
        notes: 'Recruiter A confidential assessment',
        status: 'INTERVIEW',
      });

      // Recruiter B shortlists candidate
      const entryB = await recruiterShortlistService.addToShortlist('recruiter_B', {
        candidateId: 'user_e2e_candidate',
        notes: 'Recruiter B private memo',
        status: 'SHORTLISTED',
      });

      // Recruiter A's list has only Recruiter A's notes & status
      const listA = await recruiterShortlistService.getShortlist('recruiter_A', {});
      expect(listA.entries[0].notes).toBe('Recruiter A confidential assessment');
      expect(listA.entries[0].status).toBe('INTERVIEW');

      // Recruiter B cannot see Recruiter A's notes
      const listB = await recruiterShortlistService.getShortlist('recruiter_B', {});
      expect(listB.entries[0].notes).toBe('Recruiter B private memo');
      expect(listB.entries[0].status).toBe('SHORTLISTED');

      // Cross-Recruiter IDOR protections
      await expect(
        recruiterShortlistService.getShortlistEntryById('recruiter_B', entryA.id)
      ).rejects.toThrow(ForbiddenError);

      await expect(
        recruiterShortlistService.updateShortlistEntry('recruiter_B', entryA.id, {
          status: 'SELECTED',
        })
      ).rejects.toThrow(ForbiddenError);

      await expect(
        recruiterShortlistService.removeFromShortlist('recruiter_B', entryA.id)
      ).rejects.toThrow(ForbiddenError);

      // Export isolation
      const exportA = await exportVerificationService.exportRecruiterShortlist('recruiter_A', { format: 'json' });
      const parsedA = JSON.parse(exportA.data);
      expect(parsedA.candidates[0].recruiterNotes).toBe('Recruiter A confidential assessment');
      expect(parsedA.candidates[0].pipelineStatus).toBe('INTERVIEW');
    });

    it('rejects unauthenticated requests across all Stage 10 controller endpoints', async () => {
      const mockReqRes = createMockReqRes({ headers: {} }); // Missing x-user-id

      await roadmapController.searchRecruiterTalent(mockReqRes.req, mockReqRes.res, mockReqRes.next);
      expect(mockReqRes.next).toHaveBeenCalledWith(expect.any(UnauthorizedError));

      mockReqRes.next.mockClear();
      await roadmapController.matchJobDescription(mockReqRes.req, mockReqRes.res, mockReqRes.next);
      expect(mockReqRes.next).toHaveBeenCalledWith(expect.any(UnauthorizedError));

      mockReqRes.next.mockClear();
      await roadmapController.addToShortlist(mockReqRes.req, mockReqRes.res, mockReqRes.next);
      expect(mockReqRes.next).toHaveBeenCalledWith(expect.any(UnauthorizedError));

      mockReqRes.next.mockClear();
      await roadmapController.getCohortAnalytics(mockReqRes.req, mockReqRes.res, mockReqRes.next);
      expect(mockReqRes.next).toHaveBeenCalledWith(expect.any(UnauthorizedError));

      mockReqRes.next.mockClear();
      await roadmapController.exportRecruiterShortlist(mockReqRes.req, mockReqRes.res, mockReqRes.next);
      expect(mockReqRes.next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });
  });

  describe('4. Privacy Boundaries & Zero-Leakage Audit', () => {
    it('verifies that no raw quiz answers, interview transcripts, or internal prompts leak across any Stage 10 output', async () => {
      vi.spyOn(prisma.userRoadmap, 'findMany').mockResolvedValue([mockCandidateRoadmap as any]);
      vi.spyOn(prisma.userRoadmap, 'findFirst').mockResolvedValue(mockCandidateRoadmap as any);

      // Search Output
      const search = await recruiterTalentService.searchCandidates();
      const searchCard = search.candidates[0] as any;
      expect(searchCard.answers).toBeUndefined();
      expect(searchCard.transcript).toBeUndefined();
      expect(searchCard.prompts).toBeUndefined();

      // Shortlist Output
      const shortlist = await recruiterShortlistService.addToShortlist('recruiter_1', {
        candidateId: 'user_e2e_candidate',
      });
      expect((shortlist as any).answers).toBeUndefined();
      expect((shortlist as any).transcript).toBeUndefined();

      // Cohort Analytics Output
      const cohort = await cohortAnalyticsService.getCohortAnalytics();
      expect((cohort as any).students).toBeUndefined();
      expect((cohort as any).candidates).toBeUndefined();

      // Export Output
      const exportJson = await exportVerificationService.exportRecruiterShortlist('recruiter_1', { format: 'json' });
      const parsed = JSON.parse(exportJson.data);
      expect(parsed.candidates[0].answers).toBeUndefined();
      expect(parsed.candidates[0].transcripts).toBeUndefined();
    });
  });
});
