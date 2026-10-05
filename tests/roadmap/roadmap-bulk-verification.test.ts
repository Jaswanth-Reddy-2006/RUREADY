// ═══════════════════════════════════════════════════════════════
// Stage 11.4: Bulk Credential Attestation & Verification Tests
// Comprehensive Unit, Integration, Batch, Authorization & Security Suite
// ═══════════════════════════════════════════════════════════════

import { describe, expect, it, vi, beforeEach } from 'vitest';
import { bulkVerificationService } from '../../services/roadmap-service/src/services/bulk-verification.service.js';
import { verifiedProfileService } from '../../services/roadmap-service/src/services/verified-profile.service.js';
import { certificateGeneratorService } from '../../services/roadmap-service/src/services/certificate-generator.service.js';
import { validateBulkCredentialVerificationInput } from '../../services/roadmap-service/src/validators/bulk-verification.validator.js';
import { roadmapController } from '../../services/roadmap-service/src/controllers/roadmap.controller.js';
import { prisma } from '../../services/roadmap-service/src/lib/prisma.js';
import { BadRequestError, UnauthorizedError, ForbiddenError } from '../../services/roadmap-service/src/lib/errors.js';

describe('Stage 11.4: Bulk Credential Attestation & Verification Layer', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
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
      method: options.method || 'POST',
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

  const validRoadmapA = {
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
        tasks: [],
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

  const validRoadmapMIT = {
    id: 'urm_candidate_mit',
    userId: 'user_cand_mit',
    sourceRoadmapId: 'rm_backend_1',
    status: 'ACTIVE',
    personalization: JSON.stringify({
      candidateName: 'Tech MIT Student',
      institution: 'Massachusetts Institute of Technology',
      batch: 'Batch 2025',
      graduationYear: 2025,
      branch: 'Electrical Engineering & CS',
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
    sprints: [],
    skillEvidence: [],
    assessmentAttempts: [],
    updatedAt: new Date(),
  };

  describe('1. Zod Validation & Batch Bounding', () => {
    it('1. validates a valid batch of credential IDs', () => {
      const parsed = validateBulkCredentialVerificationInput({
        credentialIds: ['VRF-urm_candidate_1-0123456789ABCDEF', 'CERT-urm_candidate_1-0123456789ABCDEF'],
        institution: 'Stanford University',
      });

      expect(parsed.credentialIds).toHaveLength(2);
      expect(parsed.institution).toBe('Stanford University');
      expect(parsed.allowPartial).toBe(true);
    });

    it('4. rejects empty credential IDs array', () => {
      expect(() =>
        validateBulkCredentialVerificationInput({
          credentialIds: [],
        })
      ).toThrow(BadRequestError);
    });

    it('6. rejects batch size greater than 100', () => {
      const largeBatch = Array.from({ length: 101 }, (_, i) => `VRF-id-${i}`);
      expect(() =>
        validateBulkCredentialVerificationInput({
          credentialIds: largeBatch,
        })
      ).toThrow(BadRequestError);
    });
  });

  describe('2. Bulk Credential Verification Engine', () => {
    let validVrfId: string;
    let validCertId: string;
    let mitVrfId: string;

    beforeEach(async () => {
      vi.spyOn(prisma.userRoadmap, 'findUnique').mockImplementation(async (args: any) => {
        if (args?.where?.id === 'urm_candidate_1') return validRoadmapA as any;
        if (args?.where?.id === 'urm_candidate_mit') return validRoadmapMIT as any;
        return null;
      });

      vi.spyOn(prisma.userRoadmap, 'findMany').mockResolvedValue([validRoadmapA, validRoadmapMIT] as any);
      vi.spyOn(prisma.microAssessmentAttempt, 'findMany').mockResolvedValue([] as any);

      // Derive authentic IDs
      const profile = await verifiedProfileService.getVerifiedProfile('user_cand_1', 'urm_candidate_1');
      validVrfId = profile.verificationId;
      validCertId = `CERT-${validVrfId.replace(/^VRF-/, '')}`;

      const mitProfile = await verifiedProfileService.getVerifiedProfile('user_cand_mit', 'urm_candidate_mit');
      mitVrfId = mitProfile.verificationId;
    });

    it('1 & 2 & 7. verifies single and multiple valid credentials (VRF and CERT) server-authoritatively', async () => {
      const response = await bulkVerificationService.verifyBulkCredentials(
        { institutionName: 'Stanford University', userRole: 'INSTITUTION_ADMIN' },
        { credentialIds: [validVrfId, validCertId] }
      );

      expect(response.totalRequested).toBe(2);
      expect(response.totalVerified).toBe(2);
      expect(response.totalInvalid).toBe(0);
      expect(response.totalNotFound).toBe(0);
      expect(response.results).toHaveLength(2);

      const [vrfResult, certResult] = response.results;

      // VRF Item Assertions
      expect(vrfResult.credentialId).toBe(validVrfId);
      expect(vrfResult.credentialType).toBe('VERIFIED_PROFILE');
      expect(vrfResult.status).toBe('VERIFIED');
      expect(vrfResult.isValid).toBe(true);
      expect(vrfResult.candidateName).toBe('Jordan Lee');
      expect(vrfResult.targetRole).toBe('Backend Engineer');
      expect(vrfResult.attestation?.institution).toBe('Stanford University');
      expect(vrfResult.attestation?.batch).toBe('Batch 2026');

      // CERT Item Assertions
      expect(certResult.credentialId).toBe(validCertId);
      expect(certResult.credentialType).toBe('CERTIFICATE');
      expect(certResult.status).toBe('VERIFIED');
      expect(certResult.isValid).toBe(true);
      expect(certResult.certificateId).toBe(validCertId);
      expect(certResult.attestation?.institution).toBe('Stanford University');
    });

    it('3. handles duplicate credential IDs deterministically without dropping entries', async () => {
      const response = await bulkVerificationService.verifyBulkCredentials(
        { institutionName: 'Stanford University', userRole: 'INSTITUTION_ADMIN' },
        { credentialIds: [validVrfId, validVrfId, validCertId] }
      );

      expect(response.totalRequested).toBe(3);
      expect(response.totalVerified).toBe(3);
      expect(response.results).toHaveLength(3);
      expect(response.results[0].credentialId).toBe(validVrfId);
      expect(response.results[1].credentialId).toBe(validVrfId);
      expect(response.results[2].credentialId).toBe(validCertId);
    });

    it('5 & 8 & 9 & 19. handles safe partial failures: valid, not found, and malformed IDs in the same batch', async () => {
      const invalidFormatId = 'MALFORMED-12345';
      const notFoundId = 'VRF-urm_nonexistent-0123456789ABCDEF';

      const response = await bulkVerificationService.verifyBulkCredentials(
        { institutionName: 'Stanford University', userRole: 'INSTITUTION_ADMIN' },
        { credentialIds: [validVrfId, invalidFormatId, notFoundId] }
      );

      expect(response.totalRequested).toBe(3);
      expect(response.totalVerified).toBe(1);
      expect(response.totalInvalid).toBe(1);
      expect(response.totalNotFound).toBe(1);

      expect(response.results[0].status).toBe('VERIFIED');
      expect(response.results[1].status).toBe('INVALID');
      expect(response.results[1].errorReason).toContain('Unsupported credential identifier format');
      expect(response.results[2].status).toBe('NOT_FOUND');
    });

    it('10. correctly reports REVOKED status when certificate service returns REVOKED', async () => {
      vi.spyOn(certificateGeneratorService, 'verifyCertificate').mockResolvedValueOnce({
        isValid: false,
        certificateId: validCertId,
        verificationId: validVrfId,
        recipientName: 'Jordan Lee',
        targetRole: 'Backend Engineer',
        targetCompanyTier: 'FAANG',
        overallReadiness: 90,
        completedSprintCount: 1,
        verifiedEvidenceCount: 1,
        masteredSkills: ['Go'],
        issuedAt: new Date().toISOString(),
        verificationUrl: `https://ruready.dev/verify/${validVrfId}`,
        status: 'REVOKED',
      });

      const response = await bulkVerificationService.verifyBulkCredentials(
        { institutionName: 'Stanford University', userRole: 'INSTITUTION_ADMIN' },
        { credentialIds: [validCertId] }
      );

      expect(response.results[0].status).toBe('REVOKED');
      expect(response.results[0].isValid).toBe(false);
    });

    it('12 & 13. enforces institutional boundaries: marks cross-institution credentials as UNAUTHORIZED', async () => {
      const response = await bulkVerificationService.verifyBulkCredentials(
        { institutionName: 'Stanford University', userRole: 'INSTITUTION_ADMIN' },
        { credentialIds: [validVrfId, mitVrfId] }
      );

      expect(response.totalRequested).toBe(2);
      expect(response.totalVerified).toBe(1);
      expect(response.totalUnauthorized).toBe(1);

      const stanfordResult = response.results[0];
      const mitResult = response.results[1];

      expect(stanfordResult.status).toBe('VERIFIED');
      expect(mitResult.status).toBe('UNAUTHORIZED');
      expect(mitResult.errorReason).toContain('unauthorized institution');
    });

    it('16. strictly projects privacy-safe fields (zero leak of private notes, telemetry, or answers)', async () => {
      const response = await bulkVerificationService.verifyBulkCredentials(
        { institutionName: 'Stanford University', userRole: 'INSTITUTION_ADMIN' },
        { credentialIds: [validVrfId] }
      );

      const rawJson = JSON.stringify(response);
      expect(rawJson).not.toContain('Concurrency Assessment');
      expect(rawJson).not.toContain('answers');
      expect(rawJson).not.toContain('transcripts');
      expect(rawJson).not.toContain('notes');
    });

    it('17. directly reuses canonical verification services (verifiedProfileService & certificateGeneratorService)', async () => {
      const spyProfile = vi.spyOn(verifiedProfileService, 'verifyPublicProfile');
      const spyCert = vi.spyOn(certificateGeneratorService, 'verifyCertificate');

      await bulkVerificationService.verifyBulkCredentials(
        { institutionName: 'Stanford University', userRole: 'INSTITUTION_ADMIN' },
        { credentialIds: [validVrfId, validCertId] }
      );

      expect(spyProfile).toHaveBeenCalledWith(validVrfId);
      expect(spyCert).toHaveBeenCalledWith(validCertId);
    });

    it('18. preserves deterministic result ordering corresponding to the input list', async () => {
      const response = await bulkVerificationService.verifyBulkCredentials(
        { institutionName: 'Stanford University', userRole: 'INSTITUTION_ADMIN' },
        { credentialIds: [validCertId, validVrfId] }
      );

      expect(response.results[0].credentialId).toBe(validCertId);
      expect(response.results[0].credentialType).toBe('CERTIFICATE');
      expect(response.results[1].credentialId).toBe(validVrfId);
      expect(response.results[1].credentialType).toBe('VERIFIED_PROFILE');
    });
  });

  describe('3. Controller & HTTP Endpoints Integration', () => {
    let validVrfId: string;

    beforeEach(async () => {
      vi.spyOn(prisma.userRoadmap, 'findUnique').mockResolvedValue(validRoadmapA as any);
      vi.spyOn(prisma.userRoadmap, 'findMany').mockResolvedValue([validRoadmapA] as any);
      vi.spyOn(prisma.microAssessmentAttempt, 'findMany').mockResolvedValue([] as any);

      const profile = await verifiedProfileService.getVerifiedProfile('user_cand_1', 'urm_candidate_1');
      validVrfId = profile.verificationId;
    });

    it('POST /institution/credentials/verify-bulk returns 200 with bulk verification response', async () => {
      const { req, res, next, getStatusCode, getJsonResponse } = createMockReqRes({
        headers: {
          'x-institution-id': 'Stanford University',
          'x-user-role': 'INSTITUTION_ADMIN',
        },
        body: {
          credentialIds: [validVrfId],
        },
      });

      await roadmapController.bulkVerifyCredentials(req, res, next);

      expect(getStatusCode()).toBe(200);
      expect(getJsonResponse().success).toBe(true);
      expect(getJsonResponse().data.totalVerified).toBe(1);
      expect(getJsonResponse().data.results[0].status).toBe('VERIFIED');
    });

    it('15. rejects candidate/learner role from accessing bulk verification with 403 Forbidden', async () => {
      const { req, res, next } = createMockReqRes({
        headers: {
          'x-user-id': 'user_cand_1',
          'x-user-role': 'CANDIDATE',
        },
        body: {
          credentialIds: [validVrfId],
        },
      });

      await roadmapController.bulkVerifyCredentials(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError));
    });

    it('14. rejects unauthenticated requests with 401 Unauthorized', async () => {
      const { req, res, next } = createMockReqRes({
        headers: {}, // No auth headers
        body: {
          credentialIds: [validVrfId],
        },
      });

      await roadmapController.bulkVerifyCredentials(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });

    it('handles recruiter bulk verification correctly', async () => {
      const { req, res, next, getStatusCode, getJsonResponse } = createMockReqRes({
        headers: {
          'x-user-id': 'recruiter_123',
          'x-organization-id': 'org_techcorp',
          'x-user-role': 'RECRUITER',
        },
        body: {
          credentialIds: [validVrfId],
        },
      });

      await roadmapController.bulkVerifyCredentials(req, res, next);

      expect(getStatusCode()).toBe(200);
      expect(getJsonResponse().success).toBe(true);
      expect(getJsonResponse().data.totalVerified).toBe(1);
    });
  });
});
