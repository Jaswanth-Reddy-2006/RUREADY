// ═══════════════════════════════════════════════════════════════
// Stage 10.5: Export & Verification Tests
// Comprehensive Unit, Integration, Format, Privacy & Security Suite
// ═══════════════════════════════════════════════════════════════

import { describe, expect, it, vi, beforeEach } from 'vitest';
import { exportVerificationService } from '../../services/roadmap-service/src/services/export-verification.service.js';
import { recruiterShortlistService } from '../../services/roadmap-service/src/services/recruiter-shortlist.service.js';
import { verifiedProfileService } from '../../services/roadmap-service/src/services/verified-profile.service.js';
import {
  validateRecruiterExportQuery,
  validateCohortExportQuery,
} from '../../services/roadmap-service/src/validators/export-verification.validator.js';
import { roadmapController } from '../../services/roadmap-service/src/controllers/roadmap.controller.js';
import { prisma } from '../../services/roadmap-service/src/lib/prisma.js';
import { BadRequestError, UnauthorizedError, NotFoundError } from '../../services/roadmap-service/src/lib/errors.js';

describe('Stage 10.5: Export & Verification Layer', () => {
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

  const mockUserRoadmap = {
    id: 'urm_candidate_101',
    userId: 'user_cand_101',
    sourceRoadmapId: 'rm_backend_101',
    status: 'ACTIVE',
    personalization: {
      candidateName: 'Alex Mercer',
      institution: 'Carnegie Mellon University',
      college: 'Computer Science',
      targetRole: 'Backend Engineer',
      targetCompanyTier: 'FAANG',
    },
    sourceRoadmap: {
      id: 'rm_backend_101',
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
        title: 'Sprint 1: Concurrency',
        status: 'COMPLETED',
        performance: { id: 'perf_1', score: 95 },
      },
    ],
    skillEvidence: [
      {
        id: 'ev_1',
        skillId: 'sk_go',
        source: 'PRACTICAL_DRILL',
        score: 94,
        demonstratedScore: 94,
        confidence: 'HIGH',
        skill: { id: 'sk_go', name: 'Go', category: 'Backend' },
      },
    ],
    assessmentAttempts: [
      {
        id: 'att_1',
        score: 92,
        passed: true,
        assessment: { id: 'as_1', title: 'Concurrency Assessment' },
        skill: { id: 'sk_go', name: 'Go' },
      },
    ],
    updatedAt: new Date(),
  };

  describe('1. Zod Validation & Parameter Sanitization', () => {
    it('validates recruiter export query with default and custom values', () => {
      const defaultParsed = validateRecruiterExportQuery({});
      expect(defaultParsed.format).toBe('json');
      expect(defaultParsed.status).toBe('ALL');
      expect(defaultParsed.limit).toBe(100);

      const customParsed = validateRecruiterExportQuery({
        format: 'csv',
        status: 'SHORTLISTED',
        targetRole: 'Backend Engineer',
        limit: '250',
      });
      expect(customParsed.format).toBe('csv');
      expect(customParsed.status).toBe('SHORTLISTED');
      expect(customParsed.limit).toBe(250);
    });

    it('bounds maximum limit to 500 records', () => {
      expect(() => validateRecruiterExportQuery({ limit: 999 })).toThrow(BadRequestError);
    });

    it('validates cohort export query', () => {
      const cohortQuery = validateCohortExportQuery({
        format: 'csv',
        institution: 'Carnegie Mellon',
        minReadiness: 50,
        maxReadiness: 90,
      });
      expect(cohortQuery.format).toBe('csv');
      expect(cohortQuery.institution).toBe('Carnegie Mellon');
    });
  });

  describe('2. Recruiter Shortlist Export (CSV & JSON)', () => {
    it('exports shortlist in structured JSON with recruiter-safe fields', async () => {
      vi.spyOn(prisma.userRoadmap, 'findFirst').mockResolvedValue(mockUserRoadmap as any);

      await recruiterShortlistService.addToShortlist('recruiter_alpha', {
        candidateId: 'user_cand_101',
        notes: 'Top tier Go developer',
        status: 'SHORTLISTED',
        matchContext: {
          jobTitle: 'Senior Go Engineer',
          matchScore: 92,
          matchedSkills: ['Go', 'Concurrency'],
          missingSkills: ['Kubernetes'],
        },
      });

      const exportResult = await exportVerificationService.exportRecruiterShortlist('recruiter_alpha', {
        format: 'json',
      });

      expect(exportResult.format).toBe('json');
      expect(exportResult.contentType).toContain('application/json');
      expect(exportResult.recordCount).toBe(1);

      const parsed = JSON.parse(exportResult.data);
      expect(parsed.recruiterId).toBe('recruiter_alpha');
      expect(parsed.candidates[0].candidateName).toBe('Alex Mercer');
      expect(parsed.candidates[0].targetRole).toBe('Backend Engineer');
      expect(parsed.candidates[0].pipelineStatus).toBe('SHORTLISTED');
      expect(parsed.candidates[0].recruiterNotes).toBe('Top tier Go developer');
      expect(parsed.candidates[0].matchScore).toBe(92);

      // Verify no sensitive telemetry/answers leaked
      expect(parsed.candidates[0].answers).toBeUndefined();
      expect(parsed.candidates[0].transcripts).toBeUndefined();
    });

    it('exports shortlist in RFC 4180 compliant CSV', async () => {
      vi.spyOn(prisma.userRoadmap, 'findFirst').mockResolvedValue(mockUserRoadmap as any);

      await recruiterShortlistService.addToShortlist('recruiter_alpha', {
        candidateId: 'user_cand_101',
        notes: 'Great problem solver, highly recommended!',
        status: 'INTERVIEW',
      });

      const exportResult = await exportVerificationService.exportRecruiterShortlist('recruiter_alpha', {
        format: 'csv',
      });

      expect(exportResult.format).toBe('csv');
      expect(exportResult.contentType).toContain('text/csv');
      expect(exportResult.filename).toContain('recruiter-shortlist-');
      expect(exportResult.data).toContain('Alex Mercer');
      expect(exportResult.data).toContain('INTERVIEW');
      expect(exportResult.data).toContain('"Great problem solver, highly recommended!"');
    });

    it('enforces multi-tenant isolation: Recruiter A export never contains Recruiter B candidates', async () => {
      vi.spyOn(prisma.userRoadmap, 'findFirst').mockResolvedValue(mockUserRoadmap as any);

      await recruiterShortlistService.addToShortlist('recruiter_alpha', {
        candidateId: 'user_cand_101',
        notes: 'Alpha candidate',
        status: 'SHORTLISTED',
      });

      await recruiterShortlistService.addToShortlist('recruiter_beta', {
        candidateId: 'user_cand_101',
        notes: 'Beta candidate note',
        status: 'REVIEWING',
      });

      const exportAlpha = await exportVerificationService.exportRecruiterShortlist('recruiter_alpha', {
        format: 'json',
      });
      const parsedAlpha = JSON.parse(exportAlpha.data);

      expect(parsedAlpha.candidates.length).toBe(1);
      expect(parsedAlpha.candidates[0].recruiterNotes).toBe('Alpha candidate');
      expect(parsedAlpha.candidates[0].pipelineStatus).toBe('SHORTLISTED');
    });
  });

  describe('3. Cohort Analytics Export (CSV & JSON)', () => {
    it('exports aggregate cohort analytics in JSON format without student data dumps', async () => {
      vi.spyOn(prisma.userRoadmap, 'findMany').mockResolvedValue([mockUserRoadmap as any]);

      const result = await exportVerificationService.exportCohortAnalytics({
        format: 'json',
        institution: 'Carnegie Mellon',
      });

      expect(result.format).toBe('json');
      const parsed = JSON.parse(result.data);
      expect(parsed.summary.totalCandidates).toBe(1);
      expect(parsed.readinessDistribution.bands).toHaveLength(4);
      expect(parsed.candidates).toBeUndefined(); // Zero candidate dump
    });

    it('exports cohort analytics in multi-section CSV format', async () => {
      vi.spyOn(prisma.userRoadmap, 'findMany').mockResolvedValue([mockUserRoadmap as any]);

      const result = await exportVerificationService.exportCohortAnalytics({
        format: 'csv',
      });

      expect(result.format).toBe('csv');
      expect(result.data).toContain('--- COHORT SUMMARY METRICS ---');
      expect(result.data).toContain('--- READINESS DISTRIBUTION BANDS ---');
      expect(result.data).toContain('--- TOP DEMONSTRATED SKILLS ---');
      expect(result.data).toContain('--- ASSESSMENT & PRACTICAL PERFORMANCE ---');
    });
  });

  describe('4. Candidate Verification Record Export', () => {
    it('exports profile verification record in JSON and CSV', async () => {
      vi.spyOn(prisma.userRoadmap, 'findUnique').mockResolvedValue(mockUserRoadmap as any);
      vi.spyOn(prisma.userRoadmap, 'findFirst').mockResolvedValue(mockUserRoadmap as any);
      vi.spyOn(prisma.microAssessmentAttempt, 'findMany').mockResolvedValue([] as any);

      const profile = await verifiedProfileService.getVerifiedProfile('user_cand_101', 'urm_candidate_101');

      // Export JSON
      const jsonExport = await exportVerificationService.exportVerificationRecord(profile.verificationId, 'json');
      expect(jsonExport.format).toBe('json');
      const parsed = JSON.parse(jsonExport.data);
      expect(parsed.verificationId).toBe(profile.verificationId);

      // Export CSV
      const csvExport = await exportVerificationService.exportVerificationRecord(profile.verificationId, 'csv');
      expect(csvExport.format).toBe('csv');
      expect(csvExport.data).toContain('Verification ID');
    });

    it('throws NotFoundError for invalid or forged verification identifiers', async () => {
      vi.spyOn(prisma.userRoadmap, 'findUnique').mockResolvedValue(null);
      vi.spyOn(prisma.userRoadmap, 'findFirst').mockResolvedValue(null);

      await expect(
        exportVerificationService.exportVerificationRecord('VRF-INVALID-FAKE')
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('5. Controller & HTTP Endpoints Integration', () => {
    it('GET /recruiter/shortlist/export returns export result (200)', async () => {
      vi.spyOn(prisma.userRoadmap, 'findFirst').mockResolvedValue(mockUserRoadmap as any);

      await recruiterShortlistService.addToShortlist('recruiter_xyz', {
        candidateId: 'user_cand_101',
        status: 'SHORTLISTED',
      });

      const { req, res, next, getStatusCode, getJsonResponse } = createMockReqRes({
        headers: { 'x-user-id': 'recruiter_xyz' },
        query: { format: 'json' },
      });

      await roadmapController.exportRecruiterShortlist(req, res, next);

      expect(getStatusCode()).toBe(200);
      expect(getJsonResponse().success).toBe(true);
      expect(getJsonResponse().data.format).toBe('json');
    });

    it('GET /recruiter/shortlist/export with download=true sets attachment headers', async () => {
      vi.spyOn(prisma.userRoadmap, 'findFirst').mockResolvedValue(mockUserRoadmap as any);

      await recruiterShortlistService.addToShortlist('recruiter_xyz', {
        candidateId: 'user_cand_101',
        status: 'SHORTLISTED',
      });

      const { req, res, next, getStatusCode, getSentData, getResponseHeaders } = createMockReqRes({
        headers: { 'x-user-id': 'recruiter_xyz' },
        query: { format: 'csv', download: 'true' },
      });

      await roadmapController.exportRecruiterShortlist(req, res, next);

      expect(getStatusCode()).toBe(200);
      expect(getResponseHeaders()['Content-Disposition']).toContain('attachment; filename="recruiter-shortlist-');
      expect(getResponseHeaders()['Content-Type']).toContain('text/csv');
      expect(getSentData()).toContain('Candidate Name');
    });

    it('GET /verify/:verificationId/export returns verification export', async () => {
      vi.spyOn(prisma.userRoadmap, 'findUnique').mockResolvedValue(mockUserRoadmap as any);
      vi.spyOn(prisma.userRoadmap, 'findFirst').mockResolvedValue(mockUserRoadmap as any);
      vi.spyOn(prisma.microAssessmentAttempt, 'findMany').mockResolvedValue([] as any);

      const profile = await verifiedProfileService.getVerifiedProfile('user_cand_101', 'urm_candidate_101');

      const { req, res, next, getStatusCode, getJsonResponse } = createMockReqRes({
        params: { verificationId: profile.verificationId },
        query: { format: 'json' },
      });

      await roadmapController.exportVerificationRecord(req, res, next);

      expect(getStatusCode()).toBe(200);
      expect(getJsonResponse().success).toBe(true);
      expect(getJsonResponse().data.format).toBe('json');
    });

    it('enforces authentication on recruiter export endpoints', async () => {
      const { req, res, next } = createMockReqRes({
        headers: {}, // No x-user-id
      });

      await roadmapController.exportRecruiterShortlist(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });
  });
});
