// ═══════════════════════════════════════════════════════════════
// Bulk Credential Attestation & Verification Service — Stage 11.4
// Secure, Server-Authoritative Multi-Credential Attestation Engine
// ═══════════════════════════════════════════════════════════════

import { prisma } from '../lib/prisma.js';
import {
  BulkCredentialVerificationQueryDTO,
  BulkCredentialVerificationResponseDTO,
  BulkCredentialVerificationItemDTO,
  CredentialVerificationStatus,
  CredentialType,
  CredentialAttestationDetailsDTO,
} from '@ru-ready/shared';
import { verifiedProfileService } from './verified-profile.service.js';
import { certificateGeneratorService } from './certificate-generator.service.js';
import { institutionalCohortService } from './institutional-cohort.service.js';
import { UnauthorizedError, ForbiddenError } from '../lib/errors.js';

export interface BulkVerificationAuthContext {
  userId?: string;
  userRole?: string;
  institutionId?: string;
  institutionName?: string;
  organizationId?: string;
}

export class BulkVerificationService {
  /**
   * Verifies a batch of candidate credentials (VRF-* and CERT-*) server-authoritatively.
   * Preserves institutional security boundaries, privacy allowlists, and deterministic results.
   */
  public async verifyBulkCredentials(
    authContext: BulkVerificationAuthContext,
    input: BulkCredentialVerificationQueryDTO,
    baseUrl = 'https://ruready.dev'
  ): Promise<BulkCredentialVerificationResponseDTO> {
    // 1. Enforce Authentication & Role Authorization
    const role = (authContext.userRole || '').toUpperCase();
    if (role === 'CANDIDATE' || role === 'LEARNER' || role === 'STUDENT') {
      throw new ForbiddenError('Learners are not authorized for bulk institutional verification');
    }

    const hasInstitutionalIdentity = Boolean(
      authContext.institutionName || authContext.institutionId || input.institution
    );
    const hasRecruiterIdentity = Boolean(
      authContext.organizationId || input.organizationId || (authContext.userId && role === 'RECRUITER')
    );

    if (!hasInstitutionalIdentity && !hasRecruiterIdentity && !authContext.userId) {
      throw new UnauthorizedError('Authenticated institutional or recruiter identity required');
    }

    // Resolve authorized institution if institutional request
    let authorizedInstitution: string | null = null;
    if (hasInstitutionalIdentity) {
      authorizedInstitution = institutionalCohortService.resolveAndValidateInstitution(
        authContext,
        input.institution
      );
    }

    const credentialIds = input.credentialIds;
    const verifiedAt = new Date().toISOString();
    const results: BulkCredentialVerificationItemDTO[] = [];

    // 2. Pre-fetch relevant UserRoadmaps for the requested IDs to optimize database lookups
    const userRoadmapIds = new Set<string>();
    for (const rawId of credentialIds) {
      if (typeof rawId === 'string') {
        const id = rawId.trim();
        const vrfMatch = id.match(/^VRF-(.+)-[A-F0-9]{16}$/i);
        const certMatch = id.match(/^CERT-(.+)-[A-F0-9]{16}$/i);
        if (vrfMatch) userRoadmapIds.add(vrfMatch[1]);
        if (certMatch) userRoadmapIds.add(certMatch[1]);
      }
    }

    const roadmaps = userRoadmapIds.size > 0
      ? await prisma.userRoadmap.findMany({
          where: { id: { in: Array.from(userRoadmapIds) } },
          select: {
            id: true,
            userId: true,
            status: true,
            personalization: true,
          },
        })
      : [];

    const roadmapMap = new Map<string, any>();
    for (const rm of roadmaps) {
      roadmapMap.set(rm.id, rm);
    }

    // 3. Process each credential ID deterministically
    for (const rawId of credentialIds) {
      const id = typeof rawId === 'string' ? rawId.trim() : '';

      if (!id) {
        results.push({
          credentialId: rawId,
          credentialType: 'VERIFIED_PROFILE',
          status: 'INVALID',
          isValid: false,
          verifiedAt,
          errorReason: 'Credential ID cannot be empty',
        });
        continue;
      }

      // Check format
      const isCert = id.startsWith('CERT-');
      const isVrf = id.startsWith('VRF-');

      if (!isCert && !isVrf) {
        results.push({
          credentialId: id,
          credentialType: 'VERIFIED_PROFILE',
          status: 'INVALID',
          isValid: false,
          verifiedAt,
          errorReason: 'Unsupported credential identifier format. Expected VRF-* or CERT-*',
        });
        continue;
      }

      const credentialType: CredentialType = isCert ? 'CERTIFICATE' : 'VERIFIED_PROFILE';

      try {
        if (isCert) {
          // Verify Certificate
          const certResult = await certificateGeneratorService.verifyCertificate(id);

          if (!certResult.isValid) {
            results.push({
              credentialId: id,
              credentialType: 'CERTIFICATE',
              status: certResult.status === 'REVOKED' ? 'REVOKED' : 'NOT_FOUND',
              isValid: false,
              verifiedAt,
              errorReason: 'Certificate not found or verification failed',
            });
            continue;
          }

          // Extract userRoadmapId
          const match = id.match(/^CERT-(.+)-[A-F0-9]{16}$/i);
          const userRoadmapId = match ? match[1] : null;
          const userRoadmap = userRoadmapId ? roadmapMap.get(userRoadmapId) : null;

          const attestation = this.extractAttestationDetails(userRoadmap);

          // Check Institutional Scope
          if (authorizedInstitution && !this.matchesInstitution(attestation.institution, authorizedInstitution)) {
            results.push({
              credentialId: id,
              credentialType: 'CERTIFICATE',
              status: 'UNAUTHORIZED',
              isValid: false,
              verifiedAt,
              errorReason: 'Credential belongs to an unauthorized institution',
            });
            continue;
          }

          results.push({
            credentialId: id,
            credentialType: 'CERTIFICATE',
            status: 'VERIFIED',
            isValid: true,
            candidateName: certResult.recipientName,
            targetRole: certResult.targetRole,
            targetCompanyTier: certResult.targetCompanyTier,
            overallReadiness: certResult.overallReadiness,
            certificateId: certResult.certificateId,
            verificationId: certResult.verificationId,
            verificationUrl: certResult.verificationUrl,
            issuedAt: certResult.issuedAt,
            verifiedAt,
            attestation,
          });
        } else {
          // Verify Profile (VRF-*)
          const profileResult = await verifiedProfileService.verifyPublicProfile(id);

          if (!profileResult.isValid) {
            results.push({
              credentialId: id,
              credentialType: 'VERIFIED_PROFILE',
              status: 'NOT_FOUND',
              isValid: false,
              verifiedAt,
              errorReason: 'Verified career profile not found or verification hash mismatch',
            });
            continue;
          }

          // Extract userRoadmapId
          const match = id.match(/^VRF-(.+)-[A-F0-9]{16}$/i);
          const userRoadmapId = match ? match[1] : null;
          const userRoadmap = userRoadmapId ? roadmapMap.get(userRoadmapId) : null;

          const attestation = this.extractAttestationDetails(userRoadmap);

          // Check Institutional Scope
          if (authorizedInstitution && !this.matchesInstitution(attestation.institution, authorizedInstitution)) {
            results.push({
              credentialId: id,
              credentialType: 'VERIFIED_PROFILE',
              status: 'UNAUTHORIZED',
              isValid: false,
              verifiedAt,
              errorReason: 'Credential belongs to an unauthorized institution',
            });
            continue;
          }

          results.push({
            credentialId: id,
            credentialType: 'VERIFIED_PROFILE',
            status: 'VERIFIED',
            isValid: true,
            candidateName: profileResult.candidateName,
            targetRole: profileResult.targetRole,
            targetCompanyTier: profileResult.targetCompanyTier,
            overallReadiness: profileResult.overallReadiness,
            verificationId: profileResult.verificationId,
            verificationUrl: `${baseUrl}/verify/${profileResult.verificationId}`,
            issuedAt: profileResult.issuedAt,
            verifiedAt,
            attestation,
          });
        }
      } catch (err: any) {
        results.push({
          credentialId: id,
          credentialType,
          status: 'ERROR',
          isValid: false,
          verifiedAt,
          errorReason: err?.message || 'Unexpected verification failure',
        });
      }
    }

    // 4. Calculate Summary Counts
    let totalVerified = 0;
    let totalInvalid = 0;
    let totalNotFound = 0;
    let totalUnauthorized = 0;

    for (const r of results) {
      if (r.status === 'VERIFIED') totalVerified++;
      else if (r.status === 'INVALID' || r.status === 'ERROR') totalInvalid++;
      else if (r.status === 'NOT_FOUND') totalNotFound++;
      else if (r.status === 'UNAUTHORIZED') totalUnauthorized++;
    }

    return {
      totalRequested: credentialIds.length,
      totalVerified,
      totalInvalid,
      totalNotFound,
      totalUnauthorized,
      results,
      verifiedAt,
      institution: authorizedInstitution,
      organizationId: authContext.organizationId || input.organizationId || null,
    };
  }

  /**
   * Extracts safe attestation details from UserRoadmap personalization.
   */
  private extractAttestationDetails(userRoadmap: any): CredentialAttestationDetailsDTO {
    if (!userRoadmap) {
      return {
        institution: null,
        college: null,
        batch: null,
        graduationYear: null,
        branch: null,
      };
    }

    let p: Record<string, any> = {};
    if (typeof userRoadmap.personalization === 'string') {
      try {
        p = JSON.parse(userRoadmap.personalization);
      } catch {
        p = {};
      }
    } else if (userRoadmap.personalization && typeof userRoadmap.personalization === 'object') {
      p = userRoadmap.personalization;
    }

    return {
      institution: p.institution || p.college || p.organization || null,
      college: p.college || null,
      batch: p.batch || (p.graduationYear ? `Class of ${p.graduationYear}` : null),
      graduationYear: p.graduationYear || null,
      branch: p.branch || null,
    };
  }

  /**
   * Helper to verify if candidate's institution matches the authorized institution filter.
   */
  private matchesInstitution(candidateInstitution: string | null | undefined, authorizedInstitution: string): boolean {
    if (!candidateInstitution) return false;
    const cand = candidateInstitution.trim().toLowerCase();
    const auth = authorizedInstitution.trim().toLowerCase();
    return cand.includes(auth) || auth.includes(cand);
  }
}

export const bulkVerificationService = new BulkVerificationService();
