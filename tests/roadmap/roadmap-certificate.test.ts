// ═══════════════════════════════════════════════════════════════
// Stage 8.3: Verifiable PDF Certificate & QR Export Tests
// Verified Eligibility, PDF Generation, QR Integrity, Public Verification,
// & Authorization Boundary
// ═══════════════════════════════════════════════════════════════

import { describe, expect, it, vi, beforeEach } from 'vitest';
import {
  CertificateGeneratorService,
  certificateGeneratorService,
} from '../../services/roadmap-service/src/services/certificate-generator.service.js';
import { verifiedProfileService } from '../../services/roadmap-service/src/services/verified-profile.service.js';
import { roadmapController } from '../../services/roadmap-service/src/controllers/roadmap.controller.js';
import {
  VerifiableCertificateDTO,
  VerifiedCareerProfileDTO,
} from '../../packages/shared/src/types/index.js';
import {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
} from '../../services/roadmap-service/src/lib/errors.js';

describe('Stage 8.3: Verifiable PDF Certificate + QR Export', () => {
  let certService: CertificateGeneratorService;

  const mockUserId = 'usr_learner_803';
  const mockOtherUserId = 'usr_intruder_999';
  const mockUserRoadmapId = 'ur_cert_803';
  const mockVerificationId = 'VRF-ur_cert_803-A1B2C3D4E5F67890';

  const mockVerifiedProfileEligible: VerifiedCareerProfileDTO = {
    verificationId: mockVerificationId,
    verificationUrl: `https://ruready.dev/verify/${mockVerificationId}`,
    userRoadmapId: mockUserRoadmapId,
    roadmapId: 'rdmp_fullstack_1',
    candidateName: 'Elena Rostova',
    candidateUsername: 'elena_rostova',
    targetRole: 'Senior Fullstack Engineer',
    targetCompanyTier: 'FAANG',
    overallReadiness: 78,
    masteredSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    demonstratedSkills: ['Docker', 'Kubernetes'],
    completedSprintCount: 3,
    verifiedEvidenceCount: 8,
    assessmentSummary: { totalAttempts: 5, passedAttempts: 5, averageScore: 92 },
    practicalSummary: { totalDrills: 3, passedDrills: 3, averageScore: 88 },
    sprintArchives: [],
    evidence: [],
    assessments: [],
    timeline: [],
    issuedAt: '2026-10-04T12:00:00.000Z',
  };

  const mockVerifiedProfileIneligible: VerifiedCareerProfileDTO = {
    verificationId: 'VRF-ur_empty_000-0000000000000000',
    verificationUrl: 'https://ruready.dev/verify/VRF-ur_empty_000-0000000000000000',
    userRoadmapId: 'ur_empty_000',
    roadmapId: 'rdmp_empty_0',
    candidateName: 'New Learner',
    targetRole: 'Backend Developer',
    targetCompanyTier: 'Unicorn',
    overallReadiness: 0,
    masteredSkills: [],
    demonstratedSkills: [],
    completedSprintCount: 0,
    verifiedEvidenceCount: 0,
    assessmentSummary: { totalAttempts: 0, passedAttempts: 0, averageScore: null },
    practicalSummary: { totalDrills: 0, passedDrills: 0, averageScore: null },
    sprintArchives: [],
    evidence: [],
    assessments: [],
    timeline: [],
    issuedAt: '2026-10-04T12:00:00.000Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    certService = new CertificateGeneratorService();
  });

  // ─── A. Certificate Eligibility & Data Contract ───────────────

  describe('A. Certificate Eligibility & Integrity', () => {
    it('1. eligible learner generates authoritative certificate metadata with unique ID and QR URL', async () => {
      vi.spyOn(verifiedProfileService, 'getVerifiedProfile').mockResolvedValue(mockVerifiedProfileEligible);

      const certData = await certService.generateCertificateData(mockUserId, mockUserRoadmapId);

      expect(certData.isEligible).toBe(true);
      expect(certData.certificateId).toBe('CERT-ur_cert_803-A1B2C3D4E5F67890');
      expect(certData.verificationId).toBe(mockVerificationId);
      expect(certData.verificationUrl).toContain(mockVerificationId);
      expect(certData.recipientName).toBe('Elena Rostova');
      expect(certData.targetRole).toBe('Senior Fullstack Engineer');
      expect(certData.overallReadiness).toBe(78);
      expect(certData.completedSprintCount).toBe(3);
      expect(certData.verifiedEvidenceCount).toBe(8);
      expect(certData.masteredSkills).toEqual(['React', 'TypeScript', 'Node.js', 'PostgreSQL']);
      expect(certData.achievementSummary).toContain('78% calibrated readiness');
    });

    it('2. ineligible learner receives isEligible: false with clear reason when no milestones are verified', async () => {
      vi.spyOn(verifiedProfileService, 'getVerifiedProfile').mockResolvedValue(mockVerifiedProfileIneligible);

      const certData = await certService.generateCertificateData(mockUserId, 'ur_empty_000');

      expect(certData.isEligible).toBe(false);
      expect(certData.ineligibilityReason).toBeDefined();
      expect(certData.ineligibilityReason).toContain('must complete at least 1 sprint');
    });

    it('3. certificate data derives exclusively from authoritative server data without client fabrication', async () => {
      const spy = vi
        .spyOn(verifiedProfileService, 'getVerifiedProfile')
        .mockResolvedValue(mockVerifiedProfileEligible);

      const certData = await certService.generateCertificateData(mockUserId, mockUserRoadmapId);

      expect(spy).toHaveBeenCalledWith(mockUserId, mockUserRoadmapId, expect.any(String));
      expect(certData.overallReadiness).toBe(mockVerifiedProfileEligible.overallReadiness);
      expect(certData.completedSprintCount).toBe(mockVerifiedProfileEligible.completedSprintCount);
    });
  });

  // ─── B. Security & Authorization Enforcement ──────────────────

  describe('B. Security & Authorization Enforcement', () => {
    it('4. throws ForbiddenError if attempting cross-user certificate generation', async () => {
      vi.spyOn(verifiedProfileService, 'getVerifiedProfile').mockRejectedValue(
        new ForbiddenError('You are not authorized to view the verified profile for this roadmap')
      );

      await expect(
        certService.generateCertificateData(mockOtherUserId, mockUserRoadmapId)
      ).rejects.toThrow(ForbiddenError);
    });

    it('5. throws NotFoundError if roadmap does not exist', async () => {
      vi.spyOn(verifiedProfileService, 'getVerifiedProfile').mockRejectedValue(
        new NotFoundError('User roadmap not found')
      );

      await expect(
        certService.generateCertificateData(mockUserId, 'ur_nonexistent')
      ).rejects.toThrow(NotFoundError);
    });
  });

  // ─── C. PDF Generation & QR Embedding ─────────────────────────

  describe('C. High-Resolution PDF Certificate & QR Rendering', () => {
    it('6. generates printable landscape PDF buffer with embedded QR verification code', async () => {
      vi.spyOn(verifiedProfileService, 'getVerifiedProfile').mockResolvedValue(mockVerifiedProfileEligible);

      const result = await certService.generateCertificatePdf(mockUserId, mockUserRoadmapId);

      expect(result.contentType).toBe('application/pdf');
      expect(result.filename).toContain('ruready-certificate-elena-rostova');
      expect(result.filename).toContain('.pdf');
      expect(result.buffer).toBeInstanceOf(Buffer);
      expect(result.buffer.length).toBeGreaterThan(1000);

      // Verify PDF magic bytes header "%PDF-"
      const header = result.buffer.subarray(0, 5).toString('ascii');
      expect(header).toBe('%PDF-');
    });

    it('7. throws BadRequestError when attempting PDF download for ineligible user', async () => {
      vi.spyOn(verifiedProfileService, 'getVerifiedProfile').mockResolvedValue(mockVerifiedProfileIneligible);

      await expect(
        certService.generateCertificatePdf(mockUserId, 'ur_empty_000')
      ).rejects.toThrow(BadRequestError);
    });
  });

  // ─── D. Public Verification System Integration ────────────────

  describe('D. Public Verification & Authenticity Validation', () => {
    it('8. verifies authentic certificate via valid verification ID', async () => {
      vi.spyOn(verifiedProfileService, 'verifyPublicProfile').mockResolvedValue({
        verificationId: mockVerificationId,
        candidateName: 'Elena Rostova',
        targetRole: 'Senior Fullstack Engineer',
        targetCompanyTier: 'FAANG',
        overallReadiness: 78,
        masteredSkills: ['React', 'TypeScript', 'Node.js'],
        demonstratedSkills: [],
        completedSprintCount: 3,
        verifiedEvidenceCount: 8,
        assessmentSummary: { totalAttempts: 5, passedAttempts: 5, averageScore: 92 },
        practicalSummary: { totalDrills: 3, passedDrills: 3, averageScore: 88 },
        sprintArchives: [],
        evidence: [],
        assessments: [],
        timeline: [],
        issuedAt: '2026-10-04T12:00:00.000Z',
        isValid: true,
      });

      const verification = await certService.verifyCertificate(mockVerificationId);

      expect(verification.isValid).toBe(true);
      expect(verification.status).toBe('AUTHENTIC');
      expect(verification.recipientName).toBe('Elena Rostova');
      expect(verification.targetRole).toBe('Senior Fullstack Engineer');
      expect(verification.overallReadiness).toBe(78);
      expect(verification.verificationUrl).toContain(mockVerificationId);
    });

    it('9. rejects invalid or forged verification ID safely with isValid: false and status: INVALID', async () => {
      vi.spyOn(verifiedProfileService, 'verifyPublicProfile').mockResolvedValue({
        verificationId: 'VRF-forged-999',
        targetRole: 'Unknown',
        targetCompanyTier: 'Unknown',
        overallReadiness: 0,
        masteredSkills: [],
        demonstratedSkills: [],
        completedSprintCount: 0,
        verifiedEvidenceCount: 0,
        assessmentSummary: { totalAttempts: 0, passedAttempts: 0, averageScore: null },
        practicalSummary: { totalDrills: 0, passedDrills: 0, averageScore: null },
        sprintArchives: [],
        evidence: [],
        assessments: [],
        timeline: [],
        issuedAt: new Date().toISOString(),
        isValid: false,
      });

      const verification = await certService.verifyCertificate('VRF-forged-999');

      expect(verification.isValid).toBe(false);
      expect(verification.status).toBe('INVALID');
    });
  });

  // ─── E. Controller Endpoints Integration ───────────────────────

  describe('E. Controller Endpoints Integration', () => {
    function createMockReqRes(options: {
      headers?: Record<string, string | string[] | undefined>;
      params?: Record<string, string>;
      query?: Record<string, string>;
    }) {
      const req: any = {
        headers: options.headers || {},
        params: options.params || {},
        query: options.query || {},
        protocol: 'https',
        get: (h: string) => (h === 'host' ? 'ruready.dev' : undefined),
      };

      let statusCode = 200;
      let jsonResponse: any = null;
      let sentData: any = null;
      const responseHeaders: Record<string, string | number> = {};

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
        setHeader: vi.fn((name: string, value: string | number) => {
          responseHeaders[name.toLowerCase()] = value;
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

    it('10. getCertificate returns 200 OK with certificate DTO', async () => {
      vi.spyOn(certificateGeneratorService, 'generateCertificateData').mockResolvedValue({
        certificateId: 'CERT-123',
        verificationId: mockVerificationId,
        verificationUrl: `https://ruready.dev/verify/${mockVerificationId}`,
        recipientName: 'Elena Rostova',
        targetRole: 'Senior Fullstack Engineer',
        targetCompanyTier: 'FAANG',
        overallReadiness: 78,
        completedSprintCount: 3,
        verifiedEvidenceCount: 8,
        masteredSkills: ['React'],
        demonstratedSkills: [],
        achievementSummary: 'Summary',
        issuedAt: '2026-10-04T12:00:00.000Z',
        isEligible: true,
      });

      const { req, res, next, getStatusCode, getJsonResponse } = createMockReqRes({
        headers: { 'x-user-id': mockUserId },
        params: { userRoadmapId: mockUserRoadmapId },
      });

      await roadmapController.getCertificate(req, res, next);

      expect(getStatusCode()).toBe(200);
      expect(getJsonResponse().success).toBe(true);
      expect(getJsonResponse().data.certificateId).toBe('CERT-123');
    });

    it('11. downloadCertificatePdf streams PDF with application/pdf Content-Type', async () => {
      const mockPdfBuffer = Buffer.from('%PDF-1.4 Mock PDF Stream Data');
      vi.spyOn(certificateGeneratorService, 'generateCertificatePdf').mockResolvedValue({
        buffer: mockPdfBuffer,
        filename: 'ruready-certificate-elena-rostova.pdf',
        contentType: 'application/pdf',
      });

      const { req, res, next, getStatusCode, getSentData, getResponseHeaders } = createMockReqRes({
        headers: { 'x-user-id': mockUserId },
        params: { userRoadmapId: mockUserRoadmapId },
      });

      await roadmapController.downloadCertificatePdf(req, res, next);

      expect(getStatusCode()).toBe(200);
      expect(getResponseHeaders()['content-type']).toBe('application/pdf');
      expect(getResponseHeaders()['content-disposition']).toContain('ruready-certificate-elena-rostova.pdf');
      expect(getSentData()).toEqual(mockPdfBuffer);
    });

    it('12. verifyCertificate returns 200 OK with verification result for public queries', async () => {
      vi.spyOn(certificateGeneratorService, 'verifyCertificate').mockResolvedValue({
        isValid: true,
        certificateId: 'CERT-123',
        verificationId: mockVerificationId,
        recipientName: 'Elena Rostova',
        targetRole: 'Senior Fullstack Engineer',
        targetCompanyTier: 'FAANG',
        overallReadiness: 78,
        completedSprintCount: 3,
        verifiedEvidenceCount: 8,
        masteredSkills: ['React'],
        issuedAt: '2026-10-04T12:00:00.000Z',
        verificationUrl: `https://ruready.dev/verify/${mockVerificationId}`,
        status: 'AUTHENTIC',
      });

      const { req, res, next, getStatusCode, getJsonResponse } = createMockReqRes({
        params: { verificationId: mockVerificationId },
      });

      await roadmapController.verifyCertificate(req, res, next);

      expect(getStatusCode()).toBe(200);
      expect(getJsonResponse().success).toBe(true);
      expect(getJsonResponse().data.isValid).toBe(true);
      expect(getJsonResponse().data.status).toBe('AUTHENTIC');
    });

    it('13. getCertificate throws UnauthorizedError for unauthenticated requests', async () => {
      const { req, res, next } = createMockReqRes({
        headers: {}, // Missing x-user-id
        params: { userRoadmapId: mockUserRoadmapId },
      });

      await roadmapController.getCertificate(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });
  });
});
