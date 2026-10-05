// ═══════════════════════════════════════════════════════════════
// Stage 8.3: Verifiable PDF Certificate & QR Export Service
// Server-Authoritative Certificate Generation, PDF Rendering & QR Verification
// ═══════════════════════════════════════════════════════════════

import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import {
  VerifiableCertificateDTO,
  CertificateVerificationResultDTO,
} from '@ru-ready/shared';
import { verifiedProfileService } from './verified-profile.service.js';
import { BadRequestError, NotFoundError } from '../lib/errors.js';

export class CertificateGeneratorService {
  /**
   * Generates server-authoritative certificate metadata and validates learner eligibility.
   */
  public async generateCertificateData(
    userId: string,
    userRoadmapId: string,
    baseUrl = 'https://ruready.dev'
  ): Promise<VerifiableCertificateDTO> {
    const profile = await verifiedProfileService.getVerifiedProfile(userId, userRoadmapId, baseUrl);

    // Deterministic eligibility check:
    // Learner must have at least 1 completed sprint, 1 verified skill evidence, 1 mastered skill, or >= 15% overall readiness.
    const isEligible =
      profile.overallReadiness >= 15 ||
      profile.completedSprintCount >= 1 ||
      profile.verifiedEvidenceCount >= 1 ||
      profile.masteredSkills.length >= 1;

    const certificateId = `CERT-${profile.verificationId.replace(/^VRF-/, '')}`;
    const recipientName = profile.candidateName || 'R U Ready Learner';
    const targetRole = profile.targetRole || 'Software Engineer';
    const targetCompanyTier = profile.targetCompanyTier || 'FAANG';
    const verificationUrl = profile.verificationUrl || `${baseUrl}/verify/${profile.verificationId}`;

    if (!isEligible) {
      return {
        certificateId,
        verificationId: profile.verificationId,
        verificationUrl,
        recipientName,
        targetRole,
        targetCompanyTier,
        overallReadiness: profile.overallReadiness,
        completedSprintCount: profile.completedSprintCount,
        verifiedEvidenceCount: profile.verifiedEvidenceCount,
        masteredSkills: profile.masteredSkills,
        demonstratedSkills: profile.demonstratedSkills,
        achievementSummary: 'Certificate eligibility requirements not yet met.',
        issuedAt: profile.issuedAt,
        isEligible: false,
        ineligibilityReason:
          'To earn a Verifiable Career Readiness Certificate, you must complete at least 1 sprint, verify 1 skill evidence milestone, or achieve >= 15% readiness.',
      };
    }

    const achievementSummary = `Demonstrated verified technical mastery for ${targetRole} (${targetCompanyTier} benchmark) with ${profile.overallReadiness}% calibrated readiness across ${profile.completedSprintCount} sprint(s) and ${profile.verifiedEvidenceCount} verified skill evidence milestone(s).`;

    return {
      certificateId,
      verificationId: profile.verificationId,
      verificationUrl,
      recipientName,
      targetRole,
      targetCompanyTier,
      overallReadiness: profile.overallReadiness,
      completedSprintCount: profile.completedSprintCount,
      verifiedEvidenceCount: profile.verifiedEvidenceCount,
      masteredSkills: profile.masteredSkills,
      demonstratedSkills: profile.demonstratedSkills,
      achievementSummary,
      issuedAt: profile.issuedAt,
      isEligible: true,
    };
  }

  /**
   * Generates a printable, high-resolution PDF certificate with embedded QR verification code.
   */
  public async generateCertificatePdf(
    userId: string,
    userRoadmapId: string,
    baseUrl = 'https://ruready.dev'
  ): Promise<{ buffer: Buffer; filename: string; contentType: string }> {
    const certData = await this.generateCertificateData(userId, userRoadmapId, baseUrl);

    if (!certData.isEligible) {
      throw new BadRequestError(
        certData.ineligibilityReason || 'User is not yet eligible for a verifiable achievement certificate'
      );
    }

    // 1. Generate crisp high-resolution QR code data URL
    const qrDataUrl = await QRCode.toDataURL(certData.verificationUrl, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 256,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    });

    const qrImageBuffer = Buffer.from(qrDataUrl.replace(/^data:image\/png;base64,/, ''), 'base64');

    // 2. Render PDF Document in landscape
    return new Promise<{ buffer: Buffer; filename: string; contentType: string }>((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          layout: 'landscape',
          margin: 36,
          info: {
            Title: `R U Ready Certificate - ${certData.recipientName}`,
            Author: 'R U Ready? AI Career Mastery Platform',
            Subject: `Verified Role Readiness: ${certData.targetRole}`,
            Keywords: 'Certificate, Career Readiness, AI Roadmap, Verified Skills',
          },
        });

        const buffers: Buffer[] = [];
        doc.on('data', (chunk) => buffers.push(chunk));
        doc.on('end', () => {
          const pdfData = Buffer.concat(buffers);
          const sanitizedName = certData.recipientName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          resolve({
            buffer: pdfData,
            filename: `ruready-certificate-${sanitizedName}-${certData.certificateId.slice(-8)}.pdf`,
            contentType: 'application/pdf',
          });
        });
        doc.on('error', (err) => reject(err));

        const width = doc.page.width;
        const height = doc.page.height;

        // Background & Borders
        doc.rect(0, 0, width, height).fill('#fafafa');

        // Outer Decorative Border
        doc
          .rect(20, 20, width - 40, height - 40)
          .lineWidth(3)
          .stroke('#0f172a');

        // Inner Gold/Accent Border
        doc
          .rect(26, 26, width - 52, height - 52)
          .lineWidth(1)
          .stroke('#3b82f6');

        // Corner accents
        const cornerSize = 16;
        doc.rect(20, 20, cornerSize, cornerSize).fill('#0f172a');
        doc.rect(width - 20 - cornerSize, 20, cornerSize, cornerSize).fill('#0f172a');
        doc.rect(20, height - 20 - cornerSize, cornerSize, cornerSize).fill('#0f172a');
        doc.rect(width - 20 - cornerSize, height - 20 - cornerSize, cornerSize, cornerSize).fill('#0f172a');

        // Top Brand Header
        doc
          .font('Helvetica-Bold')
          .fontSize(12)
          .fillColor('#3b82f6')
          .text('R U READY?  •  AI CAREER READINESS & MASTERY PLATFORM', 0, 50, {
            align: 'center',
            width,
          });

        // Certificate Title
        doc
          .font('Helvetica-Bold')
          .fontSize(24)
          .fillColor('#0f172a')
          .text('CERTIFICATE OF VERIFIED CAREER READINESS', 0, 75, {
            align: 'center',
            width,
          });

        // Presentation text
        doc
          .font('Helvetica')
          .fontSize(11)
          .fillColor('#64748b')
          .text('This is authoritatively certified to recognize that', 0, 115, {
            align: 'center',
            width,
          });

        // Recipient Name
        doc
          .font('Helvetica-Bold')
          .fontSize(26)
          .fillColor('#1e3a8a')
          .text(certData.recipientName, 0, 138, {
            align: 'center',
            width,
          });

        // Achievement Text
        doc
          .font('Helvetica')
          .fontSize(11)
          .fillColor('#475569')
          .text('has successfully demonstrated verified technical mastery and calibrated role readiness for:', 0, 180, {
            align: 'center',
            width,
          });

        // Target Role & Tier
        doc
          .font('Helvetica-Bold')
          .fontSize(18)
          .fillColor('#0f172a')
          .text(`${certData.targetRole}  (${certData.targetCompanyTier} Benchmark)`, 0, 202, {
            align: 'center',
            width,
          });

        // Metrics Banner Box
        const boxY = 240;
        const boxWidth = 540;
        const boxX = (width - boxWidth) / 2;
        doc
          .rect(boxX, boxY, boxWidth, 65)
          .fillAndStroke('#f1f5f9', '#cbd5e1');

        // Column 1: Overall Readiness
        doc
          .font('Helvetica-Bold')
          .fontSize(20)
          .fillColor('#2563eb')
          .text(`${certData.overallReadiness}%`, boxX + 20, boxY + 12, { width: 150, align: 'center' });
        doc
          .font('Helvetica')
          .fontSize(9)
          .fillColor('#64748b')
          .text('CALIBRATED READINESS', boxX + 20, boxY + 38, { width: 150, align: 'center' });

        // Column 2: Completed Sprints
        doc
          .font('Helvetica-Bold')
          .fontSize(20)
          .fillColor('#0f172a')
          .text(`${certData.completedSprintCount}`, boxX + 190, boxY + 12, { width: 160, align: 'center' });
        doc
          .font('Helvetica')
          .fontSize(9)
          .fillColor('#64748b')
          .text('COMPLETED SPRINTS', boxX + 190, boxY + 38, { width: 160, align: 'center' });

        // Column 3: Verified Evidence Milestones
        doc
          .font('Helvetica-Bold')
          .fontSize(20)
          .fillColor('#0f172a')
          .text(`${certData.verifiedEvidenceCount}`, boxX + 370, boxY + 12, { width: 150, align: 'center' });
        doc
          .font('Helvetica')
          .fontSize(9)
          .fillColor('#64748b')
          .text('VERIFIED EVIDENCE', boxX + 370, boxY + 38, { width: 150, align: 'center' });

        // Mastered Skills List (if available)
        const skillsToShow = certData.masteredSkills.slice(0, 6);
        if (skillsToShow.length > 0) {
          doc
            .font('Helvetica-Bold')
            .fontSize(9)
            .fillColor('#475569')
            .text('VERIFIED COMPETENCIES:  ', 60, 325, { continued: true })
            .font('Helvetica')
            .fillColor('#0f172a')
            .text(skillsToShow.join('  •  '));
        }

        // Footer Divider
        doc
          .moveTo(50, 420)
          .lineTo(width - 50, 420)
          .lineWidth(0.5)
          .stroke('#cbd5e1');

        // Bottom Left: Issue Date & Certificate ID
        const formattedDate = new Date(certData.issuedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

        doc
          .font('Helvetica-Bold')
          .fontSize(9)
          .fillColor('#0f172a')
          .text(`Certificate ID: `, 60, 440, { continued: true })
          .font('Helvetica')
          .fillColor('#334155')
          .text(certData.certificateId);

        doc
          .font('Helvetica-Bold')
          .fontSize(9)
          .fillColor('#0f172a')
          .text(`Issue Date: `, 60, 458, { continued: true })
          .font('Helvetica')
          .fillColor('#334155')
          .text(formattedDate);

        doc
          .font('Helvetica-Bold')
          .fontSize(8)
          .fillColor('#2563eb')
          .text(`Verify Online: `, 60, 476, { continued: true })
          .font('Helvetica')
          .fillColor('#475569')
          .text(certData.verificationUrl);

        // Bottom Right: Embedded QR Code
        doc.image(qrImageBuffer, width - 150, 428, { width: 85, height: 85 });

        doc
          .font('Helvetica')
          .fontSize(7)
          .fillColor('#94a3b8')
          .text('SCAN TO VERIFY', width - 150, 516, { width: 85, align: 'center' });

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Verifies certificate authenticity via unique verification identifier.
   */
  public async verifyCertificate(verificationId: string): Promise<CertificateVerificationResultDTO> {
    if (!verificationId || typeof verificationId !== 'string') {
      return {
        isValid: false,
        certificateId: 'UNKNOWN',
        verificationId: verificationId || 'UNKNOWN',
        recipientName: 'Unknown',
        targetRole: 'Unknown',
        targetCompanyTier: 'Unknown',
        overallReadiness: 0,
        completedSprintCount: 0,
        verifiedEvidenceCount: 0,
        masteredSkills: [],
        issuedAt: new Date().toISOString(),
        verificationUrl: '',
        status: 'INVALID',
      };
    }

    const vrfId = verificationId.startsWith('CERT-')
      ? `VRF-${verificationId.replace(/^CERT-/, '')}`
      : verificationId;
    const publicProfile = await verifiedProfileService.verifyPublicProfile(vrfId);

    const certId = verificationId.startsWith('CERT-')
      ? verificationId
      : `CERT-${verificationId.replace(/^VRF-/, '')}`;

    if (!publicProfile.isValid) {
      return {
        isValid: false,
        certificateId: certId,
        verificationId,
        recipientName: publicProfile.candidateName || 'Unknown',
        targetRole: publicProfile.targetRole || 'Unknown',
        targetCompanyTier: publicProfile.targetCompanyTier || 'Unknown',
        overallReadiness: publicProfile.overallReadiness || 0,
        completedSprintCount: publicProfile.completedSprintCount || 0,
        verifiedEvidenceCount: publicProfile.verifiedEvidenceCount || 0,
        masteredSkills: publicProfile.masteredSkills || [],
        issuedAt: publicProfile.issuedAt || new Date().toISOString(),
        verificationUrl: `https://ruready.dev/verify/${vrfId}`,
        status: 'INVALID',
      };
    }

    return {
      isValid: true,
      certificateId: certId,
      verificationId: vrfId,
      recipientName: publicProfile.candidateName || 'R U Ready Learner',
      targetRole: publicProfile.targetRole,
      targetCompanyTier: publicProfile.targetCompanyTier,
      overallReadiness: publicProfile.overallReadiness,
      completedSprintCount: publicProfile.completedSprintCount,
      verifiedEvidenceCount: publicProfile.verifiedEvidenceCount,
      masteredSkills: publicProfile.masteredSkills || [],
      issuedAt: publicProfile.issuedAt,
      verificationUrl: `https://ruready.dev/verify/${vrfId}`,
      status: 'AUTHENTIC',
    };
  }
}

export const certificateGeneratorService = new CertificateGeneratorService();
