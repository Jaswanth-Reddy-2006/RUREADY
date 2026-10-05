// ═══════════════════════════════════════════════════════════════
// ATS Export & Integration Service — Stage 11.3
// Standardized, Privacy-Safe ATS Export Adapter Layer
// ═══════════════════════════════════════════════════════════════

import { prisma } from '../lib/prisma.js';
import {
  AtsExportQueryDTO,
  AtsAdapterType,
  AtsCandidateExportItemDTO,
  AtsCollaborationSummaryDTO,
  AtsBatchExportResponseDTO,
  ExportResultDTO,
  ExportFormat,
  deriveRoadmapProfileSummary,
  RubricRecommendation,
} from '@ru-ready/shared';
import { recruiterShortlistService } from './recruiter-shortlist.service.js';
import { recruiterCollaborationService } from './recruiter-collaboration.service.js';
import { institutionalCohortService, InstitutionalAuthContext } from './institutional-cohort.service.js';
import { UnauthorizedError } from '../lib/errors.js';

export interface RecruiterAtsAuthContext {
  recruiterId: string;
  organizationId: string;
  recruiterName?: string;
  role?: string;
}

/**
 * Escapes values according to RFC 4180 CSV specifications.
 */
function escapeCsvValue(val: unknown): string {
  if (val === null || val === undefined) return '';
  let str = Array.isArray(val) ? val.join('; ') : String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    str = `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export class AtsExportService {
  /**
   * Exports recruiter's talent pipeline/shortlist formatted for an ATS adapter.
   * Strictly filters out private notes and unshared feedback.
   */
  public async exportRecruiterAtsPipeline(
    authContext: RecruiterAtsAuthContext,
    query: AtsExportQueryDTO = {},
    baseUrl = 'https://ruready.dev'
  ): Promise<ExportResultDTO> {
    const recruiterId = authContext.recruiterId?.trim();
    const organizationId = authContext.organizationId?.trim();

    if (!recruiterId || !organizationId) {
      throw new UnauthorizedError('Authenticated recruiter and organization required for ATS export');
    }

    const adapter: AtsAdapterType = query.adapter || 'GENERIC_ATS';
    const format: ExportFormat = query.format === 'csv' ? 'csv' : 'json';
    const limit = Math.min(500, Math.max(1, query.limit || 100));

    // Fetch shortlist from recruiterShortlistService (multi-tenant isolated)
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

    const minReadiness = query.minReadiness ?? 0;
    const maxReadiness = query.maxReadiness ?? 100;

    // Filter by readiness range if requested
    let filteredEntries = shortlistResponse.entries.filter(
      (entry) => entry.overallReadiness >= minReadiness && entry.overallReadiness <= maxReadiness
    );

    // Fetch user roadmaps to retrieve cohort metadata if available
    const candidateIds = filteredEntries.map((e) => e.candidateId);
    const candidateRoadmaps = await prisma.userRoadmap.findMany({
      where: {
        userId: { in: candidateIds },
        status: { in: ['ACTIVE', 'COMPLETED'] },
        sourceRoadmap: { visibility: 'PUBLIC' },
      },
      select: {
        userId: true,
        personalization: true,
      },
    });

    const personalizationMap = new Map<string, Record<string, any>>();
    for (const cr of candidateRoadmaps) {
      try {
        const p = typeof cr.personalization === 'string' ? JSON.parse(cr.personalization) : cr.personalization || {};
        personalizationMap.set(cr.userId, p);
      } catch {
        personalizationMap.set(cr.userId, {});
      }
    }

    // Enrich candidates with shared collaboration rubric summary
    const exportItems: AtsCandidateExportItemDTO[] = [];

    for (const entry of filteredEntries) {
      const p = personalizationMap.get(entry.candidateId) || {};

      // Retrieve team collaboration thread to derive shared rubric summary
      let collabSummary: AtsCollaborationSummaryDTO = {
        totalReviews: 0,
        averageRubricScore: null,
        latestRecommendation: null,
        sharedFeedbackCount: 0,
      };

      try {
        const thread = await recruiterCollaborationService.getCandidateCollaborationThread(
          { recruiterId, organizationId },
          entry.candidateId
        );

        // Filter ONLY shared feedback (isSharedWithTeam === true)
        const sharedFeedback = thread.feedbackList.filter((f) => f.isSharedWithTeam);
        if (sharedFeedback.length > 0) {
          const sumScores = sharedFeedback.reduce((sum, f) => sum + (f.rubric.overallScore ?? 0), 0);
          collabSummary = {
            totalReviews: sharedFeedback.length,
            averageRubricScore: Math.round(sumScores / sharedFeedback.length),
            latestRecommendation: sharedFeedback[0].rubric.recommendation,
            sharedFeedbackCount: sharedFeedback.length,
          };
        }
      } catch {
        // Fallback default if no collaboration thread exists
      }

      exportItems.push({
        candidateId: entry.candidateId,
        candidateName: entry.candidateName,
        targetRole: entry.targetRole,
        targetCompanyTier: entry.targetCompanyTier,
        overallReadiness: entry.overallReadiness,
        pipelineStatus: entry.status,
        matchScore: entry.matchContext?.matchScore ?? null,
        demonstratedSkills: entry.demonstratedSkills || [],
        masteredSkills: entry.masteredSkills || [],
        missingSkills: entry.matchContext?.missingSkills || [],
        collaborationSummary: collabSummary,
        verificationId: entry.verificationId,
        verificationUrl: entry.verificationUrl,
        institution: p.institution || p.college || null,
        batch: p.batch || (p.graduationYear ? `Class of ${p.graduationYear}` : null),
        graduationYear: p.graduationYear || null,
        branch: p.branch || null,
        exportedAt: new Date().toISOString(),
      });
    }

    // Sort deterministically by candidateId
    exportItems.sort((a, b) => a.candidateId.localeCompare(b.candidateId));

    return this.renderExportPayload({
      adapter,
      format,
      organizationId,
      institution: null,
      candidates: exportItems,
    });
  }

  /**
   * Exports institutional cohort/batch candidates formatted for an ATS adapter.
   * Strictly enforces institutional boundary and excludes private data.
   */
  public async exportInstitutionalAtsBatch(
    authContext: InstitutionalAuthContext,
    query: AtsExportQueryDTO = {},
    baseUrl = 'https://ruready.dev'
  ): Promise<ExportResultDTO> {
    const validatedInstitution = institutionalCohortService.resolveAndValidateInstitution(
      authContext,
      query.institution
    );

    const adapter: AtsAdapterType = query.adapter || 'GENERIC_ATS';
    const format: ExportFormat = query.format === 'csv' ? 'csv' : 'json';
    const limit = Math.min(500, Math.max(1, query.limit || 100));

    const minReadiness = query.minReadiness ?? 0;
    const maxReadiness = query.maxReadiness ?? 100;
    const institutionFilter = validatedInstitution.toLowerCase();
    const collegeFilter = query.college?.trim().toLowerCase() || null;
    const batchFilter = query.batch?.trim().toLowerCase() || null;
    const gradYearFilter = query.graduationYear ? String(query.graduationYear).trim().toLowerCase() : null;
    const branchFilter = query.branch?.trim().toLowerCase() || null;
    const roleFilter = query.targetRole?.trim().toLowerCase() || null;
    const tierFilter = query.targetCompanyTier?.trim().toLowerCase() || null;

    // Fetch matching roadmaps
    const userRoadmaps = await prisma.userRoadmap.findMany({
      where: {
        status: { in: ['ACTIVE', 'COMPLETED'] },
        sourceRoadmap: { visibility: 'PUBLIC' },
      },
      include: {
        sourceRoadmap: {
          include: { goal: true },
        },
        sprints: {
          include: {
            performance: true,
            tasks: {
              select: {
                id: true,
                status: true,
                completedAt: true,
                requiresEvidence: true,
                requiresAssessment: true,
              },
            },
          },
          orderBy: { sprintNumber: 'asc' },
        },
        skillEvidence: {
          include: { skill: true },
          orderBy: { assessedAt: 'desc' },
        },
        assessmentAttempts: {
          include: { assessment: true, skill: true },
          orderBy: { completedAt: 'desc' },
        },
      },
      orderBy: { userId: 'asc' },
    });

    const exportItems: AtsCandidateExportItemDTO[] = [];

    for (const ur of userRoadmaps) {
      if (exportItems.length >= limit) break;

      const summary = deriveRoadmapProfileSummary(ur, baseUrl);
      const personalization: Record<string, any> =
        typeof ur.personalization === 'string'
          ? (() => {
              try {
                return JSON.parse(ur.personalization);
              } catch {
                return {};
              }
            })()
          : (ur.personalization as Record<string, any>) || {};

      // Filter by Readiness
      if (summary.overallReadiness < minReadiness || summary.overallReadiness > maxReadiness) {
        continue;
      }

      // Filter by Institution
      const candidateInst = (
        personalization.institution ||
        personalization.college ||
        personalization.organization ||
        ''
      ).toLowerCase();

      if (!candidateInst.includes(institutionFilter)) {
        continue;
      }

      if (collegeFilter && !candidateInst.includes(collegeFilter)) {
        continue;
      }

      // Filter by Batch
      const candidateBatch = (personalization.batch || '').toLowerCase();
      if (batchFilter && !candidateBatch.includes(batchFilter)) {
        continue;
      }

      // Filter by Graduation Year
      const candidateGradYear = personalization.graduationYear
        ? String(personalization.graduationYear).toLowerCase()
        : '';
      if (gradYearFilter && candidateGradYear !== gradYearFilter) {
        continue;
      }

      // Filter by Branch
      const candidateBranch = (personalization.branch || '').toLowerCase();
      if (branchFilter && !candidateBranch.includes(branchFilter)) {
        continue;
      }

      // Filter by Target Role
      const candidateRole = (
        summary.targetRole ||
        ur.sourceRoadmap?.rolePath ||
        personalization.targetRole ||
        ''
      ).toLowerCase();
      if (roleFilter && !candidateRole.includes(roleFilter)) {
        continue;
      }

      // Filter by Tier
      const candidateTier = (
        summary.targetCompanyTier ||
        ur.sourceRoadmap?.targetCompanyTier ||
        personalization.targetCompanyTier ||
        ''
      ).toLowerCase();
      if (tierFilter && !candidateTier.includes(tierFilter)) {
        continue;
      }

      // Candidate Display Name (Derived safely)
      const candidateName =
        personalization.candidateName || summary.candidateName || `Candidate ${ur.userId.slice(0, 8)}`;

      const masteredSkills = summary.verifiedSkills
        .filter((s) => s.status === 'MASTERED')
        .map((s) => s.name);
      const demonstratedSkills = summary.verifiedSkills.map((s) => s.name);

      exportItems.push({
        candidateId: ur.userId,
        candidateName,
        targetRole: summary.targetRole,
        targetCompanyTier: summary.targetCompanyTier,
        overallReadiness: summary.overallReadiness,
        pipelineStatus: 'SHORTLISTED',
        matchScore: null,
        demonstratedSkills,
        masteredSkills,
        missingSkills: [],
        collaborationSummary: {
          totalReviews: 0,
          averageRubricScore: null,
          latestRecommendation: null,
          sharedFeedbackCount: 0,
        },
        verificationId: summary.verificationId,
        verificationUrl: summary.verificationUrl,
        institution: personalization.institution || validatedInstitution,
        batch: personalization.batch || (personalization.graduationYear ? `Class of ${personalization.graduationYear}` : null),
        graduationYear: personalization.graduationYear || null,
        branch: personalization.branch || null,
        exportedAt: new Date().toISOString(),
      });
    }

    // Sort deterministically by candidateId
    exportItems.sort((a, b) => a.candidateId.localeCompare(b.candidateId));

    return this.renderExportPayload({
      adapter,
      format,
      organizationId: null,
      institution: validatedInstitution,
      candidates: exportItems,
    });
  }

  /**
   * Renders candidates into specified adapter schema and format (CSV or JSON).
   */
  private renderExportPayload(params: {
    adapter: AtsAdapterType;
    format: ExportFormat;
    organizationId: string | null;
    institution: string | null;
    candidates: AtsCandidateExportItemDTO[];
  }): ExportResultDTO {
    const { adapter, format, organizationId, institution, candidates } = params;
    const timestamp = Date.now();
    const exportedAt = new Date().toISOString();

    if (format === 'csv') {
      let csvContent = '';

      switch (adapter) {
        case 'GREENHOUSE': {
          const headers = [
            'Candidate External ID',
            'Candidate Name',
            'Job Title',
            'Stage',
            'RuReady Readiness (%)',
            'RuReady Rubric Score',
            'Rubric Recommendation',
            'Skills Mastered',
            'Skills Demonstrated',
            'RuReady Verification ID',
            'RuReady Verification URL',
            'University',
            'Graduation Year',
            'Branch',
          ];

          const rows = candidates.map((c) => [
            escapeCsvValue(c.candidateId),
            escapeCsvValue(c.candidateName),
            escapeCsvValue(c.targetRole),
            escapeCsvValue(c.pipelineStatus),
            escapeCsvValue(c.overallReadiness),
            escapeCsvValue(c.collaborationSummary.averageRubricScore ?? ''),
            escapeCsvValue(c.collaborationSummary.latestRecommendation ?? ''),
            escapeCsvValue(c.masteredSkills),
            escapeCsvValue(c.demonstratedSkills),
            escapeCsvValue(c.verificationId),
            escapeCsvValue(c.verificationUrl),
            escapeCsvValue(c.institution ?? ''),
            escapeCsvValue(c.graduationYear ?? ''),
            escapeCsvValue(c.branch ?? ''),
          ]);

          csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
          break;
        }

        case 'WORKDAY': {
          const headers = [
            'Applicant_ID',
            'Legal_Name',
            'Applied_Position',
            'Stage_Name',
            'Readiness_Score',
            'Evaluation_Rating',
            'Recommendation',
            'Competencies_Mastered',
            'Competencies_Demonstrated',
            'Verification_ID',
            'Verification_URL',
            'Educational_Institution',
            'Academic_Cohort',
          ];

          const rows = candidates.map((c) => [
            escapeCsvValue(c.candidateId),
            escapeCsvValue(c.candidateName),
            escapeCsvValue(c.targetRole),
            escapeCsvValue(c.pipelineStatus),
            escapeCsvValue(c.overallReadiness),
            escapeCsvValue(c.collaborationSummary.averageRubricScore ?? ''),
            escapeCsvValue(c.collaborationSummary.latestRecommendation ?? ''),
            escapeCsvValue(c.masteredSkills),
            escapeCsvValue(c.demonstratedSkills),
            escapeCsvValue(c.verificationId),
            escapeCsvValue(c.verificationUrl),
            escapeCsvValue(c.institution ?? ''),
            escapeCsvValue(c.batch ?? ''),
          ]);

          csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
          break;
        }

        case 'LEVER': {
          const headers = [
            'Candidate ID',
            'Name',
            'Headline',
            'Stage',
            'Readiness Score',
            'Rating',
            'Recommendation',
            'Tags',
            'Verification Reference',
            'Verification URL',
            'School',
            'Graduation Cohort',
          ];

          const rows = candidates.map((c) => [
            escapeCsvValue(c.candidateId),
            escapeCsvValue(c.candidateName),
            escapeCsvValue(`${c.targetRole} (${c.targetCompanyTier})`),
            escapeCsvValue(c.pipelineStatus),
            escapeCsvValue(c.overallReadiness),
            escapeCsvValue(c.collaborationSummary.averageRubricScore ?? ''),
            escapeCsvValue(c.collaborationSummary.latestRecommendation ?? ''),
            escapeCsvValue([...c.masteredSkills, ...c.demonstratedSkills]),
            escapeCsvValue(c.verificationId),
            escapeCsvValue(c.verificationUrl),
            escapeCsvValue(c.institution ?? ''),
            escapeCsvValue(c.batch ?? ''),
          ]);

          csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
          break;
        }

        case 'GENERIC_ATS':
        default: {
          const headers = [
            'Candidate ID',
            'Candidate Name',
            'Target Role',
            'Company Tier',
            'Overall Readiness (%)',
            'Pipeline Status',
            'Match Score (%)',
            'Mastered Skills',
            'Demonstrated Skills',
            'Missing Skills',
            'Total Reviews',
            'Average Rubric Score',
            'Latest Recommendation',
            'Verification ID',
            'Verification URL',
            'Institution',
            'Batch',
            'Graduation Year',
            'Branch',
            'Exported At',
          ];

          const rows = candidates.map((c) => [
            escapeCsvValue(c.candidateId),
            escapeCsvValue(c.candidateName),
            escapeCsvValue(c.targetRole),
            escapeCsvValue(c.targetCompanyTier),
            escapeCsvValue(c.overallReadiness),
            escapeCsvValue(c.pipelineStatus),
            escapeCsvValue(c.matchScore ?? 'N/A'),
            escapeCsvValue(c.masteredSkills),
            escapeCsvValue(c.demonstratedSkills),
            escapeCsvValue(c.missingSkills),
            escapeCsvValue(c.collaborationSummary.totalReviews),
            escapeCsvValue(c.collaborationSummary.averageRubricScore ?? ''),
            escapeCsvValue(c.collaborationSummary.latestRecommendation ?? ''),
            escapeCsvValue(c.verificationId),
            escapeCsvValue(c.verificationUrl),
            escapeCsvValue(c.institution ?? ''),
            escapeCsvValue(c.batch ?? ''),
            escapeCsvValue(c.graduationYear ?? ''),
            escapeCsvValue(c.branch ?? ''),
            escapeCsvValue(c.exportedAt),
          ]);

          csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
          break;
        }
      }

      return {
        format: 'csv',
        filename: `ats-export-${adapter.toLowerCase()}-${timestamp}.csv`,
        contentType: 'text/csv; charset=utf-8',
        data: csvContent,
        recordCount: candidates.length,
        exportedAt,
      };
    }

    // JSON Format Renderers
    let jsonData: any;

    switch (adapter) {
      case 'GREENHOUSE': {
        jsonData = {
          adapter: 'GREENHOUSE',
          totalCandidates: candidates.length,
          organizationId,
          institution,
          exportedAt,
          candidates: candidates.map((c) => ({
            first_name: c.candidateName.split(' ')[0] || c.candidateName,
            last_name: c.candidateName.split(' ').slice(1).join(' ') || '',
            external_id: c.candidateId,
            title: c.targetRole,
            company_tier: c.targetCompanyTier,
            application_stage: c.pipelineStatus,
            custom_fields: {
              ruready_readiness_score: c.overallReadiness,
              ruready_rubric_score: c.collaborationSummary.averageRubricScore,
              ruready_recommendation: c.collaborationSummary.latestRecommendation,
              ruready_verification_id: c.verificationId,
              ruready_verification_url: c.verificationUrl,
              mastered_skills: c.masteredSkills,
              demonstrated_skills: c.demonstratedSkills,
              university: c.institution,
              graduation_year: c.graduationYear,
              branch: c.branch,
            },
            attachments: [
              {
                type: 'VERIFICATION_BADGE',
                url: c.verificationUrl,
              },
            ],
          })),
        };
        break;
      }

      case 'WORKDAY': {
        jsonData = {
          adapter: 'WORKDAY',
          totalCandidates: candidates.length,
          organizationId,
          institution,
          exportedAt,
          applicants: candidates.map((c) => ({
            Applicant_Data: {
              Applicant_ID: c.candidateId,
              Legal_Name: c.candidateName,
              Target_Position: c.targetRole,
              Pipeline_Stage: c.pipelineStatus,
              Readiness_Metric: {
                Score: c.overallReadiness,
                Tier: c.targetCompanyTier,
              },
              Assessment_Summary: {
                Average_Rubric_Rating: c.collaborationSummary.averageRubricScore,
                Recommendation: c.collaborationSummary.latestRecommendation,
                Reviews_Count: c.collaborationSummary.totalReviews,
              },
              Competency_Data: {
                Mastered: c.masteredSkills,
                Demonstrated: c.demonstratedSkills,
              },
              Verification_Reference: {
                Reference_ID: c.verificationId,
                Public_URL: c.verificationUrl,
              },
              Education_Data: {
                Institution: c.institution,
                Batch: c.batch,
                Graduation_Year: c.graduationYear,
                Discipline: c.branch,
              },
            },
          })),
        };
        break;
      }

      case 'LEVER': {
        jsonData = {
          adapter: 'LEVER',
          totalCandidates: candidates.length,
          organizationId,
          institution,
          exportedAt,
          opportunities: candidates.map((c) => ({
            id: c.candidateId,
            name: c.candidateName,
            headline: `${c.targetRole} • ${c.targetCompanyTier} Ready`,
            stage: c.pipelineStatus,
            tags: [
              `Readiness:${c.overallReadiness}%`,
              ...(c.masteredSkills.map((s) => `Skill:${s}`)),
            ],
            scores: {
              readiness: c.overallReadiness,
              rubricRating: c.collaborationSummary.averageRubricScore,
              recommendation: c.collaborationSummary.latestRecommendation,
            },
            links: [c.verificationUrl],
            customFields: {
              verificationId: c.verificationId,
              institution: c.institution,
              batch: c.batch,
              graduationYear: c.graduationYear,
              branch: c.branch,
            },
          })),
        };
        break;
      }

      case 'GENERIC_ATS':
      default: {
        const payload: AtsBatchExportResponseDTO = {
          adapter: 'GENERIC_ATS',
          format: 'json',
          totalCandidates: candidates.length,
          organizationId,
          institution,
          candidates,
          exportedAt,
        };
        jsonData = payload;
        break;
      }
    }

    return {
      format: 'json',
      filename: `ats-export-${adapter.toLowerCase()}-${timestamp}.json`,
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(jsonData, null, 2),
      recordCount: candidates.length,
      exportedAt,
    };
  }
}

export const atsExportService = new AtsExportService();
