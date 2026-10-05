// ═══════════════════════════════════════════════════════════════
// Export & Verification Service — Stage 10.5
// Production-Grade, Privacy-Safe Export & Credential Verification Engine
// ═══════════════════════════════════════════════════════════════

import {
  RecruiterExportQueryDTO,
  CohortExportQueryDTO,
  ExportResultDTO,
  ExportFormat,
  RecruiterCandidateExportItemDTO,
} from '@ru-ready/shared';
import { recruiterShortlistService } from './recruiter-shortlist.service.js';
import { cohortAnalyticsService } from './cohort-analytics.service.js';
import { verifiedProfileService } from './verified-profile.service.js';
import { certificateGeneratorService } from './certificate-generator.service.js';
import { UnauthorizedError, NotFoundError } from '../lib/errors.js';

/**
 * Escapes values for RFC 4180 CSV generation.
 */
function escapeCsvValue(val: unknown): string {
  if (val === null || val === undefined) return '';
  let str = Array.isArray(val) ? val.join('; ') : String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    str = `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export class ExportVerificationService {
  /**
   * Exports recruiter's candidate shortlist in CSV or JSON format.
   * Strictly limited to recruiter-safe fields and multi-tenant recruiter isolation.
   */
  public async exportRecruiterShortlist(
    recruiterId: string,
    query: RecruiterExportQueryDTO = {},
    baseUrl = 'https://ruready.dev'
  ): Promise<ExportResultDTO> {
    if (!recruiterId || typeof recruiterId !== 'string' || !recruiterId.trim()) {
      throw new UnauthorizedError('Authenticated recruiter identity required for export');
    }

    const format: ExportFormat = query.format === 'csv' ? 'csv' : 'json';
    const limit = Math.min(500, Math.max(1, query.limit || 100));

    // Fetch shortlist records owned by this recruiter
    const shortlistResponse = await recruiterShortlistService.getShortlist(
      recruiterId,
      {
        status: query.status,
        targetRole: query.targetRole,
        search: query.search,
        page: 1,
        limit,
      },
      baseUrl
    );

    // Project strictly into RecruiterCandidateExportItemDTO
    const exportItems: RecruiterCandidateExportItemDTO[] = shortlistResponse.entries.map((entry) => ({
      id: entry.id,
      candidateId: entry.candidateId,
      candidateName: entry.candidateName,
      targetRole: entry.targetRole,
      targetCompanyTier: entry.targetCompanyTier,
      overallReadiness: entry.overallReadiness,
      pipelineStatus: entry.status,
      verifiedSkillsCount: entry.verifiedSkillsCount,
      masteredSkills: entry.masteredSkills,
      demonstratedSkills: entry.demonstratedSkills,
      matchScore: entry.matchContext?.matchScore ?? null,
      matchedSkills: entry.matchContext?.matchedSkills ?? [],
      missingSkills: entry.matchContext?.missingSkills ?? [],
      recruiterNotes: entry.notes ?? null,
      verificationId: entry.verificationId,
      verificationUrl: entry.verificationUrl,
      shortlistedAt: entry.createdAt,
      updatedAt: entry.updatedAt,
    }));

    const exportedAt = new Date().toISOString();
    const timestamp = Date.now();

    if (format === 'csv') {
      const headers = [
        'ID',
        'Candidate ID',
        'Candidate Name',
        'Target Role',
        'Company Tier',
        'Overall Readiness (%)',
        'Pipeline Status',
        'Verified Skills Count',
        'Mastered Skills',
        'Demonstrated Skills',
        'Match Score (%)',
        'Matched Skills',
        'Missing Skills',
        'Recruiter Notes',
        'Verification ID',
        'Verification URL',
        'Shortlisted At',
        'Updated At',
      ];

      const rows = exportItems.map((item) => [
        escapeCsvValue(item.id),
        escapeCsvValue(item.candidateId),
        escapeCsvValue(item.candidateName),
        escapeCsvValue(item.targetRole),
        escapeCsvValue(item.targetCompanyTier),
        escapeCsvValue(item.overallReadiness),
        escapeCsvValue(item.pipelineStatus),
        escapeCsvValue(item.verifiedSkillsCount),
        escapeCsvValue(item.masteredSkills),
        escapeCsvValue(item.demonstratedSkills),
        escapeCsvValue(item.matchScore ?? 'N/A'),
        escapeCsvValue(item.matchedSkills),
        escapeCsvValue(item.missingSkills),
        escapeCsvValue(item.recruiterNotes ?? ''),
        escapeCsvValue(item.verificationId),
        escapeCsvValue(item.verificationUrl),
        escapeCsvValue(item.shortlistedAt),
        escapeCsvValue(item.updatedAt),
      ]);

      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

      return {
        format: 'csv',
        filename: `recruiter-shortlist-${timestamp}.csv`,
        contentType: 'text/csv; charset=utf-8',
        data: csvContent,
        recordCount: exportItems.length,
        exportedAt,
      };
    }

    // JSON Format
    return {
      format: 'json',
      filename: `recruiter-shortlist-${timestamp}.json`,
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(
        {
          recruiterId,
          totalCandidates: exportItems.length,
          exportedAt,
          candidates: exportItems,
        },
        null,
        2
      ),
      recordCount: exportItems.length,
      exportedAt,
    };
  }

  /**
   * Exports aggregate cohort & campus analytics in CSV or JSON format.
   * Strictly aggregate-first: Never dumps individual student records.
   */
  public async exportCohortAnalytics(
    query: CohortExportQueryDTO = {},
    baseUrl = 'https://ruready.dev'
  ): Promise<ExportResultDTO> {
    const format: ExportFormat = query.format === 'csv' ? 'csv' : 'json';
    const analytics = await cohortAnalyticsService.getCohortAnalytics(query, baseUrl);
    const exportedAt = new Date().toISOString();
    const timestamp = Date.now();

    if (format === 'csv') {
      const lines: string[] = [];

      // Section 1: Summary Metrics
      lines.push('--- COHORT SUMMARY METRICS ---');
      lines.push('Metric,Value');
      lines.push(`Total Candidates,${analytics.summary.totalCandidates}`);
      lines.push(`Verified Candidates,${analytics.summary.verifiedCandidates}`);
      lines.push(`Active Candidates,${analytics.summary.activeCandidates}`);
      lines.push(`Completed Candidates,${analytics.summary.completedCandidates}`);
      lines.push(`Average Readiness (%),${analytics.summary.averageReadiness}`);
      lines.push(`Median Readiness (%),${analytics.summary.medianReadiness}`);
      lines.push(`Min Readiness (%),${analytics.summary.minReadiness}`);
      lines.push(`Max Readiness (%),${analytics.summary.maxReadiness}`);
      lines.push('');

      // Section 2: Readiness Bands
      lines.push('--- READINESS DISTRIBUTION BANDS ---');
      lines.push('Band,Min Score,Max Score,Candidate Count,Percentage (%)');
      for (const band of analytics.readinessDistribution.bands) {
        lines.push(
          `${escapeCsvValue(band.label)},${band.minScore},${band.maxScore},${band.candidateCount},${band.percentage}`
        );
      }
      lines.push('');

      // Section 3: Top Demonstrated Skills
      lines.push('--- TOP DEMONSTRATED SKILLS ---');
      lines.push('Skill Name,Category,Candidate Count,Coverage (%),Average Score,Mastered Count');
      for (const skill of analytics.skillsAnalysis.topDemonstratedSkills) {
        lines.push(
          `${escapeCsvValue(skill.skillName)},${escapeCsvValue(skill.category)},${skill.candidateCount},${skill.coveragePercentage},${skill.averageScore},${skill.masteredCount}`
        );
      }
      lines.push('');

      // Section 4: Common Skill Gaps
      lines.push('--- COMMON SKILL GAPS ---');
      lines.push('Skill Name,Category,Gap Count,Gap Percentage (%)');
      for (const gap of analytics.skillsAnalysis.commonSkillGaps) {
        lines.push(
          `${escapeCsvValue(gap.skillName)},${escapeCsvValue(gap.category ?? 'General')},${gap.gapCount},${gap.gapPercentage}`
        );
      }
      lines.push('');

      // Section 5: Assessment & Practical Performance
      lines.push('--- ASSESSMENT & PRACTICAL PERFORMANCE ---');
      lines.push('Metric,Value');
      lines.push(`Total Assessment Attempts,${analytics.assessmentPerformance.totalAttempts}`);
      lines.push(`Passed Assessment Attempts,${analytics.assessmentPerformance.passedAttempts}`);
      lines.push(`Assessment Pass Rate (%),${analytics.assessmentPerformance.overallPassRate}`);
      lines.push(`Average Assessment Score,${analytics.assessmentPerformance.averageScore}`);
      lines.push(
        `Candidates with Practical Evidence,${analytics.practicalEvidence.candidatesWithPracticalEvidence}`
      );
      lines.push(
        `Practical Evidence Coverage (%),${analytics.practicalEvidence.practicalCoveragePercentage}`
      );
      lines.push(`Total Practical Drills,${analytics.practicalEvidence.totalPracticalDrills}`);
      lines.push(`Average Practical Score,${analytics.practicalEvidence.averagePracticalScore}`);
      lines.push('');

      // Section 6: Target Role Distribution
      lines.push('--- TARGET ROLE DISTRIBUTION ---');
      lines.push('Role,Candidate Count,Percentage (%)');
      for (const r of analytics.distributions.roles) {
        lines.push(`${escapeCsvValue(r.key)},${r.count},${r.percentage}`);
      }

      return {
        format: 'csv',
        filename: `cohort-analytics-${timestamp}.csv`,
        contentType: 'text/csv; charset=utf-8',
        data: lines.join('\n'),
        recordCount: analytics.summary.totalCandidates,
        exportedAt,
      };
    }

    // JSON Format
    return {
      format: 'json',
      filename: `cohort-analytics-${timestamp}.json`,
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(analytics, null, 2),
      recordCount: analytics.summary.totalCandidates,
      exportedAt,
    };
  }

  /**
   * Exports candidate public verification record.
   */
  public async exportVerificationRecord(
    verificationId: string,
    format: ExportFormat = 'json'
  ): Promise<ExportResultDTO> {
    const trimmedId = verificationId?.trim();
    if (!trimmedId) {
      throw new NotFoundError('Verification identifier is required');
    }

    if (trimmedId.startsWith('CERT-')) {
      const certResult = await certificateGeneratorService.verifyCertificate(trimmedId);
      if (!certResult.isValid) {
        throw new NotFoundError('Certificate verification record not found or invalid');
      }

      const exportedAt = new Date().toISOString();
      const timestamp = Date.now();

      if (format === 'csv') {
        const headers = ['Verification ID', 'Certificate ID', 'Recipient Name', 'Target Role', 'Status', 'Issued At'];
        const row = [
          escapeCsvValue(certResult.verificationId),
          escapeCsvValue(certResult.certificateId),
          escapeCsvValue(certResult.recipientName),
          escapeCsvValue(certResult.targetRole),
          escapeCsvValue(certResult.status),
          escapeCsvValue(certResult.issuedAt),
        ];
        return {
          format: 'csv',
          filename: `certificate-verification-${timestamp}.csv`,
          contentType: 'text/csv; charset=utf-8',
          data: [headers.join(','), row.join(',')].join('\n'),
          recordCount: 1,
          exportedAt,
        };
      }

      return {
        format: 'json',
        filename: `certificate-verification-${timestamp}.json`,
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(certResult, null, 2),
        recordCount: 1,
        exportedAt,
      };
    }

    // Profile verification
    const profile = await verifiedProfileService.verifyPublicProfile(trimmedId);
    if (!profile || !profile.isValid) {
      throw new NotFoundError('Candidate verification record not found or invalid');
    }

    const exportedAt = new Date().toISOString();
    const timestamp = Date.now();

    if (format === 'csv') {
      const headers = ['Verification ID', 'Candidate Name', 'Target Role', 'Company Tier', 'Readiness (%)', 'Verified Evidence Count'];
      const row = [
        escapeCsvValue(profile.verificationId),
        escapeCsvValue(profile.candidateName),
        escapeCsvValue(profile.targetRole),
        escapeCsvValue(profile.targetCompanyTier),
        escapeCsvValue(profile.overallReadiness),
        escapeCsvValue(profile.verifiedEvidenceCount),
      ];
      return {
        format: 'csv',
        filename: `profile-verification-${timestamp}.csv`,
        contentType: 'text/csv; charset=utf-8',
        data: [headers.join(','), row.join(',')].join('\n'),
        recordCount: 1,
        exportedAt,
      };
    }

    return {
      format: 'json',
      filename: `profile-verification-${timestamp}.json`,
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(profile, null, 2),
      recordCount: 1,
      exportedAt,
    };
  }
}

export const exportVerificationService = new ExportVerificationService();
