// ═══════════════════════════════════════════════════════════════
// Stage 11.3: ATS Integration & Standardized Batch Export Tests
// Comprehensive Unit, Integration, Adapter, Privacy & Multi-Tenant Suite
// ═══════════════════════════════════════════════════════════════

import { describe, expect, it, vi, beforeEach } from 'vitest';
import { atsExportService } from '../../services/roadmap-service/src/services/ats-export.service.js';
import { recruiterShortlistService } from '../../services/roadmap-service/src/services/recruiter-shortlist.service.js';
import { recruiterCollaborationService } from '../../services/roadmap-service/src/services/recruiter-collaboration.service.js';
import { validateAtsExportQuery } from '../../services/roadmap-service/src/validators/ats-export.validator.js';
import { roadmapController } from '../../services/roadmap-service/src/controllers/roadmap.controller.js';
import { prisma } from '../../services/roadmap-service/src/lib/prisma.js';
import { BadRequestError, UnauthorizedError, ForbiddenError } from '../../services/roadmap-service/src/lib/errors.js';

describe('Stage 11.3: ATS Integration & Standardized Batch Export Layer', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    recruiterShortlistService.clearStore();
    recruiterCollaborationService.clearStore();
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

  const mockUserRoadmapA = {
    id: 'urm_candidate_1',
    userId: 'user_cand_1',
    sourceRoadmapId: 'rm_backend_1',
    status: 'ACTIVE',
    personalization: JSON.stringify({
      candidateName: 'Jordan Lee',
      institution: 'Stanford University',
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
        id: 'sp_1',
        sprintNumber: 1,
        title: 'Distributed Systems',
        status: 'COMPLETED',
        performance: { id: 'perf_1', score: 95 },
        tasks: [
          {
            id: 't_1',
            status: 'COMPLETED',
            requiresEvidence: true,
            requiresAssessment: false,
            completedAt: new Date(),
          },
        ],
      },
    ],
    skillEvidence: [
      {
        id: 'ev_1',
        skillId: 'sk_go',
        source: 'PRACTICAL_DRILL',
        demonstratedScore: 94,
        assessedAt: new Date(),
        skill: { id: 'sk_go', name: 'Go', category: 'Backend' },
      },
    ],
    assessmentAttempts: [
      {
        id: 'att_1',
        score: 90,
        passed: true,
        completedAt: new Date(),
        assessment: { id: 'as_1', title: 'Concurrency Assessment' },
        skill: { id: 'sk_go', name: 'Go' },
      },
    ],
    updatedAt: new Date(),
  };

  const mockUserRoadmapB = {
    id: 'urm_candidate_2',
    userId: 'user_cand_2',
    sourceRoadmapId: 'rm_backend_1',
    status: 'COMPLETED',
    personalization: JSON.stringify({
      candidateName: 'Morgan Smith',
      institution: 'Stanford University',
      batch: 'Batch 2025',
      graduationYear: 2025,
      branch: 'Information Technology',
      targetRole: 'Backend Engineer',
      targetCompanyTier: 'Tier 1',
    }),
    sourceRoadmap: {
      id: 'rm_backend_1',
      title: 'Backend Engineer',
      rolePath: 'Backend Engineer',
      targetRole: 'Backend Engineer',
      targetCompanyTier: 'Tier 1',
      visibility: 'PUBLIC',
      goal: { id: 'g1', targetRole: 'Backend Engineer' },
    },
    sprints: [],
    skillEvidence: [],
    assessmentAttempts: [],
    updatedAt: new Date(),
  };

  describe('1. Zod Validation & Schema Bounding', () => {
    it('validates ATS export query with default values', () => {
      const parsed = validateAtsExportQuery({});
      expect(parsed.format).toBe('json');
      expect(parsed.adapter).toBe('GENERIC_ATS');
      expect(parsed.status).toBe('ALL');
      expect(parsed.limit).toBe(100);
    });

    it('validates custom adapters, formats, and filters', () => {
      const parsed = validateAtsExportQuery({
        format: 'csv',
        adapter: 'GREENHOUSE',
        status: 'INTERVIEW',
        targetRole: 'Backend Engineer',
        minReadiness: 60,
        maxReadiness: 95,
        institution: 'Stanford University',
        limit: '250',
      });
      expect(parsed.format).toBe('csv');
      expect(parsed.adapter).toBe('GREENHOUSE');
      expect(parsed.status).toBe('INTERVIEW');
      expect(parsed.minReadiness).toBe(60);
      expect(parsed.maxReadiness).toBe(95);
      expect(parsed.limit).toBe(250);
    });

    it('rejects minReadiness > maxReadiness', () => {
      expect(() =>
        validateAtsExportQuery({
          minReadiness: 90,
          maxReadiness: 50,
        })
      ).toThrow(BadRequestError);
    });

    it('bounds max export limit to 500 records', () => {
      expect(() => validateAtsExportQuery({ limit: 1000 })).toThrow(BadRequestError);
    });
  });

  describe('2. Recruiter ATS Export (Generic, Greenhouse, Workday, Lever)', () => {
    beforeEach(async () => {
      vi.spyOn(prisma.userRoadmap, 'findFirst').mockImplementation(async (args: any) => {
        if (args?.where?.userId === 'user_cand_1') return mockUserRoadmapA as any;
        if (args?.where?.userId === 'user_cand_2') return mockUserRoadmapB as any;
        return mockUserRoadmapA as any;
      });

      vi.spyOn(prisma.userRoadmap, 'findMany').mockResolvedValue([mockUserRoadmapA, mockUserRoadmapB] as any);

      // Populate recruiter shortlist
      await recruiterShortlistService.addToShortlist('recruiter_alpha', {
        candidateId: 'user_cand_1',
        status: 'SHORTLISTED',
        notes: 'Private recruiter note that must NEVER leak to ATS',
        matchContext: {
          jobTitle: 'Senior Go Engineer',
          matchScore: 92,
          matchedSkills: ['Go', 'Distributed Systems'],
          missingSkills: ['Kubernetes'],
        },
      });

      // Submit shared feedback by recruiter_alpha
      await recruiterCollaborationService.submitFeedback(
        {
          recruiterId: 'recruiter_alpha',
          organizationId: 'org_techcorp',
          recruiterName: 'Alice Recruiter',
        },
        {
          candidateId: 'user_cand_1',
          stage: 'SHORTLISTED',
          isSharedWithTeam: true,
          rubric: {
            technicalSkillsScore: 5,
            communicationScore: 4,
            problemSolvingScore: 5,
            roleFitScore: 4,
            practicalEvidenceScore: 5,
            recommendation: 'STRONG_HIRE',
          },
          comments: 'Exceptional backend capabilities',
        }
      );

      // Submit private unshared feedback by recruiter_beta
      await recruiterCollaborationService.submitFeedback(
        {
          recruiterId: 'recruiter_beta',
          organizationId: 'org_techcorp',
          recruiterName: 'Bob Reviewer',
        },
        {
          candidateId: 'user_cand_1',
          stage: 'SHORTLISTED',
          isSharedWithTeam: false,
          rubric: {
            technicalSkillsScore: 3,
            communicationScore: 3,
            problemSolvingScore: 3,
            roleFitScore: 3,
            practicalEvidenceScore: 3,
            recommendation: 'LEANING_HIRE',
          },
          comments: 'Internal private observation - do not export',
        }
      );
    });

    it('exports recruiter talent pipeline in Generic ATS JSON format', async () => {
      const result = await atsExportService.exportRecruiterAtsPipeline(
        { recruiterId: 'recruiter_alpha', organizationId: 'org_techcorp' },
        { adapter: 'GENERIC_ATS', format: 'json' }
      );

      expect(result.format).toBe('json');
      expect(result.contentType).toContain('application/json');
      expect(result.recordCount).toBe(1);

      const parsed = JSON.parse(result.data);
      expect(parsed.adapter).toBe('GENERIC_ATS');
      expect(parsed.organizationId).toBe('org_techcorp');
      expect(parsed.candidates).toHaveLength(1);

      const candidate = parsed.candidates[0];
      expect(candidate.candidateId).toBe('user_cand_1');
      expect(candidate.candidateName).toBe('Jordan Lee');
      expect(candidate.pipelineStatus).toBe('SHORTLISTED');
      expect(candidate.matchScore).toBe(92);
      expect(candidate.verificationId).toBeDefined();

      // Verify privacy protection: Private recruiter notes NEVER present in ATS export item
      expect(candidate.recruiterNotes).toBeUndefined();
      expect(candidate.notes).toBeUndefined();
      expect(result.data).not.toContain('Private recruiter note that must NEVER leak to ATS');
      expect(result.data).not.toContain('Internal private observation - do not export');

      // Verify collaboration summary aggregates ONLY shared feedback
      expect(candidate.collaborationSummary.totalReviews).toBe(1);
      expect(candidate.collaborationSummary.latestRecommendation).toBe('STRONG_HIRE');
      expect(candidate.collaborationSummary.averageRubricScore).toBe(92);
    });

    it('exports recruiter pipeline with Greenhouse adapter schema in CSV and JSON', async () => {
      // CSV format
      const csvResult = await atsExportService.exportRecruiterAtsPipeline(
        { recruiterId: 'recruiter_alpha', organizationId: 'org_techcorp' },
        { adapter: 'GREENHOUSE', format: 'csv' }
      );

      expect(csvResult.format).toBe('csv');
      expect(csvResult.contentType).toContain('text/csv');
      expect(csvResult.filename).toContain('ats-export-greenhouse-');
      expect(csvResult.data).toContain('Candidate External ID,Candidate Name,Job Title,Stage');
      expect(csvResult.data).toContain('Jordan Lee');
      expect(csvResult.data).toContain('STRONG_HIRE');

      // JSON format
      const jsonResult = await atsExportService.exportRecruiterAtsPipeline(
        { recruiterId: 'recruiter_alpha', organizationId: 'org_techcorp' },
        { adapter: 'GREENHOUSE', format: 'json' }
      );

      const parsed = JSON.parse(jsonResult.data);
      expect(parsed.adapter).toBe('GREENHOUSE');
      expect(parsed.candidates[0].first_name).toBe('Jordan');
      expect(parsed.candidates[0].last_name).toBe('Lee');
      expect(parsed.candidates[0].external_id).toBe('user_cand_1');
      expect(parsed.candidates[0].custom_fields.ruready_recommendation).toBe('STRONG_HIRE');
      expect(parsed.candidates[0].attachments[0].url).toContain('/verify/');
    });

    it('exports recruiter pipeline with Workday adapter schema in CSV and JSON', async () => {
      const jsonResult = await atsExportService.exportRecruiterAtsPipeline(
        { recruiterId: 'recruiter_alpha', organizationId: 'org_techcorp' },
        { adapter: 'WORKDAY', format: 'json' }
      );

      const parsed = JSON.parse(jsonResult.data);
      expect(parsed.adapter).toBe('WORKDAY');
      expect(parsed.applicants).toHaveLength(1);
      expect(parsed.applicants[0].Applicant_Data.Applicant_ID).toBe('user_cand_1');
      expect(parsed.applicants[0].Applicant_Data.Legal_Name).toBe('Jordan Lee');
      expect(parsed.applicants[0].Applicant_Data.Assessment_Summary.Recommendation).toBe('STRONG_HIRE');
      expect(parsed.applicants[0].Applicant_Data.Verification_Reference.Reference_ID).toBeDefined();

      const csvResult = await atsExportService.exportRecruiterAtsPipeline(
        { recruiterId: 'recruiter_alpha', organizationId: 'org_techcorp' },
        { adapter: 'WORKDAY', format: 'csv' }
      );
      expect(csvResult.data).toContain('Applicant_ID,Legal_Name,Applied_Position');
    });

    it('exports recruiter pipeline with Lever adapter schema in CSV and JSON', async () => {
      const jsonResult = await atsExportService.exportRecruiterAtsPipeline(
        { recruiterId: 'recruiter_alpha', organizationId: 'org_techcorp' },
        { adapter: 'LEVER', format: 'json' }
      );

      const parsed = JSON.parse(jsonResult.data);
      expect(parsed.adapter).toBe('LEVER');
      expect(parsed.opportunities).toHaveLength(1);
      expect(parsed.opportunities[0].id).toBe('user_cand_1');
      expect(parsed.opportunities[0].name).toBe('Jordan Lee');
      expect(parsed.opportunities[0].scores.recommendation).toBe('STRONG_HIRE');
      expect(parsed.opportunities[0].tags.some((t: string) => t.startsWith('Readiness:'))).toBe(true);
    });

    it('enforces multi-tenant isolation: Recruiter from Org A cannot export Org B candidates', async () => {
      const orgBResult = await atsExportService.exportRecruiterAtsPipeline(
        { recruiterId: 'recruiter_beta', organizationId: 'org_othercorp' },
        { adapter: 'GENERIC_ATS', format: 'json' }
      );

      const parsed = JSON.parse(orgBResult.data);
      expect(parsed.candidates).toHaveLength(0);
      expect(orgBResult.recordCount).toBe(0);
    });
  });

  describe('3. Institutional Batch ATS Export', () => {
    beforeEach(() => {
      vi.spyOn(prisma.userRoadmap, 'findMany').mockResolvedValue([
        mockUserRoadmapA,
        mockUserRoadmapB,
      ] as any);
    });

    it('exports institutional batch candidates in Generic ATS CSV format', async () => {
      const result = await atsExportService.exportInstitutionalAtsBatch(
        { institutionName: 'Stanford University', userRole: 'INSTITUTION_ADMIN' },
        { institution: 'Stanford University', adapter: 'GENERIC_ATS', format: 'csv' }
      );

      expect(result.format).toBe('csv');
      expect(result.contentType).toContain('text/csv');
      expect(result.recordCount).toBe(2);
      expect(result.data).toContain('Candidate ID,Candidate Name,Target Role');
      expect(result.data).toContain('Jordan Lee');
      expect(result.data).toContain('Morgan Smith');
    });

    it('applies batch, branch, graduationYear, and readiness filters accurately', async () => {
      const result = await atsExportService.exportInstitutionalAtsBatch(
        { institutionName: 'Stanford University', userRole: 'INSTITUTION_ADMIN' },
        {
          institution: 'Stanford University',
          batch: 'Batch 2026',
          graduationYear: 2026,
          branch: 'Computer Science',
          minReadiness: 70,
          format: 'json',
        }
      );

      const parsed = JSON.parse(result.data);
      expect(parsed.candidates).toHaveLength(1);
      expect(parsed.candidates[0].candidateName).toBe('Jordan Lee');
      expect(parsed.candidates[0].batch).toBe('Batch 2026');
      expect(parsed.candidates[0].branch).toBe('Computer Science');
    });

    it('blocks cross-institution access: Stanford cannot export MIT cohorts', async () => {
      await expect(
        atsExportService.exportInstitutionalAtsBatch(
          { institutionName: 'Stanford University', userRole: 'INSTITUTION_ADMIN' },
          { institution: 'Massachusetts Institute of Technology' }
        )
      ).rejects.toThrow(ForbiddenError);
    });

    it('returns safe empty export when no candidates match filters', async () => {
      const result = await atsExportService.exportInstitutionalAtsBatch(
        { institutionName: 'Stanford University', userRole: 'INSTITUTION_ADMIN' },
        { institution: 'Stanford University', branch: 'NonExistentBranch', format: 'json' }
      );

      expect(result.recordCount).toBe(0);
      const parsed = JSON.parse(result.data);
      expect(parsed.candidates).toEqual([]);
    });

    it('safely handles RFC 4180 CSV escaping for candidate names and values with special characters', async () => {
      const specialRoadmap = {
        ...mockUserRoadmapA,
        userId: 'user_special_99',
        personalization: JSON.stringify({
          candidateName: 'Doe, Jane "Special"',
          institution: 'Stanford University',
          batch: 'Batch, 2026\nWinter',
          branch: 'CS, AI & Systems',
          targetRole: 'Full Stack, AI Engineer',
        }),
      };

      vi.spyOn(prisma.userRoadmap, 'findMany').mockResolvedValue([specialRoadmap as any]);

      const result = await atsExportService.exportInstitutionalAtsBatch(
        { institutionName: 'Stanford University', userRole: 'INSTITUTION_ADMIN' },
        { institution: 'Stanford University', format: 'csv' }
      );

      expect(result.data).toContain('"Doe, Jane ""Special"""');
      expect(result.data).toContain('"Batch, 2026\nWinter"');
      expect(result.data).toContain('"CS, AI & Systems"');
    });
  });

  describe('4. Controller & HTTP Endpoints Integration', () => {
    beforeEach(async () => {
      vi.spyOn(prisma.userRoadmap, 'findFirst').mockImplementation(async (args: any) => {
        return mockUserRoadmapA as any;
      });

      vi.spyOn(prisma.userRoadmap, 'findMany').mockResolvedValue([mockUserRoadmapA] as any);

      await recruiterShortlistService.addToShortlist('recruiter_alpha', {
        candidateId: 'user_cand_1',
        status: 'SHORTLISTED',
      });
    });

    it('GET /recruiter/ats/export returns 200 with JSON export result', async () => {
      const { req, res, next, getStatusCode, getJsonResponse } = createMockReqRes({
        headers: {
          'x-recruiter-id': 'recruiter_alpha',
          'x-organization-id': 'org_techcorp',
        },
        query: { adapter: 'GENERIC_ATS', format: 'json' },
      });

      await roadmapController.exportRecruiterAtsPipeline(req, res, next);

      expect(getStatusCode()).toBe(200);
      expect(getJsonResponse().success).toBe(true);
      expect(getJsonResponse().data.format).toBe('json');
      expect(getJsonResponse().data.recordCount).toBe(1);
    });

    it('GET /recruiter/ats/export with download=true sets proper content headers', async () => {
      const { req, res, next, getStatusCode, getSentData, getResponseHeaders } = createMockReqRes({
        headers: {
          'x-recruiter-id': 'recruiter_alpha',
          'x-organization-id': 'org_techcorp',
        },
        query: { adapter: 'GREENHOUSE', format: 'csv', download: 'true' },
      });

      await roadmapController.exportRecruiterAtsPipeline(req, res, next);

      expect(getStatusCode()).toBe(200);
      expect(getResponseHeaders()['Content-Disposition']).toContain('attachment; filename="ats-export-greenhouse-');
      expect(getResponseHeaders()['Content-Type']).toContain('text/csv');
      expect(getSentData()).toContain('Candidate External ID');
    });

    it('GET /institution/ats/export returns institutional ATS export', async () => {
      const { req, res, next, getStatusCode, getJsonResponse } = createMockReqRes({
        headers: {
          'x-institution-id': 'Stanford University',
          'x-user-role': 'INSTITUTION_ADMIN',
        },
        query: { adapter: 'WORKDAY', format: 'json' },
      });

      await roadmapController.exportInstitutionalAtsBatch(req, res, next);

      expect(getStatusCode()).toBe(200);
      expect(getJsonResponse().success).toBe(true);
      expect(getJsonResponse().data.format).toBe('json');
    });

    it('enforces authentication: 401 when recruiter identity is missing', async () => {
      const { req, res, next } = createMockReqRes({
        headers: {}, // No recruiter / org headers
      });

      await roadmapController.exportRecruiterAtsPipeline(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });

    it('enforces institutional authorization: 403 on cross-tenant access attempt', async () => {
      const { req, res, next } = createMockReqRes({
        headers: {
          'x-institution-id': 'Stanford University',
        },
        query: {
          institution: 'Harvard University',
        },
      });

      await roadmapController.exportInstitutionalAtsBatch(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError));
    });
  });
});
