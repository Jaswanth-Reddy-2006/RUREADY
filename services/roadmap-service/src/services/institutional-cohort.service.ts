// ═══════════════════════════════════════════════════════════════
// Institutional Cohort & Batch Tracking Service — Stage 11.1
// Server-Authoritative Campus & Institutional Batch Analytics Engine
// ═══════════════════════════════════════════════════════════════

import { prisma } from '../lib/prisma.js';
import {
  InstitutionalCohortQueryDTO,
  InstitutionalBatchSummaryDTO,
  InstitutionalBatchListResponseDTO,
  InstitutionalBatchOverviewItemDTO,
  BatchMilestoneVelocityDTO,
  ReadinessBandDTO,
  CohortSkillMetricDTO,
  CohortSkillGapDTO,
  CohortDistributionItemDTO,
  CohortAssessmentSummaryDTO,
  CohortPracticalSummaryDTO,
  deriveRoadmapProfileSummary,
  normalizeSkillName,
} from '@ru-ready/shared';
import { UnauthorizedError, ForbiddenError } from '../lib/errors.js';

export interface InstitutionalAuthContext {
  userId?: string;
  userRole?: string;
  institutionId?: string;
  institutionName?: string;
}

export class InstitutionalCohortService {
  /**
   * Enforces institutional multi-tenant security boundaries.
   * Resolves authoritative institution filter and blocks cross-institution tampering.
   */
  public resolveAndValidateInstitution(
    authContext: InstitutionalAuthContext,
    requestedInstitution?: string | null
  ): string {
    const authInst = authContext.institutionName || authContext.institutionId || null;
    const reqInst = requestedInstitution?.trim() || null;

    if (!authInst && !reqInst) {
      throw new UnauthorizedError('Authenticated institutional identity required');
    }

    if (authInst && reqInst) {
      const lowerAuth = authInst.toLowerCase();
      const lowerReq = reqInst.toLowerCase();
      if (!lowerReq.includes(lowerAuth) && !lowerAuth.includes(lowerReq)) {
        throw new ForbiddenError('You are not authorized to access cohort data for this institution');
      }
      return reqInst;
    }

    return (reqInst || authInst) as string;
  }

  /**
   * Computes comprehensive aggregate batch tracking and cohort analytics for an institution.
   * Strictly aggregate-only: Never leaks candidate names, user IDs, private notes, or quiz answers.
   */
  public async getInstitutionalBatchSummary(
    authContext: InstitutionalAuthContext,
    query: InstitutionalCohortQueryDTO = {},
    baseUrl = 'https://ruready.dev'
  ): Promise<InstitutionalBatchSummaryDTO> {
    const validatedInstitution = this.resolveAndValidateInstitution(authContext, query.institution);

    const minReadiness = query.minReadiness ?? 0;
    const maxReadiness = query.maxReadiness ?? 100;
    const institutionFilter = validatedInstitution.toLowerCase();
    const collegeFilter = query.college?.trim().toLowerCase() || null;
    const batchFilter = query.batch?.trim().toLowerCase() || null;
    const gradYearFilter = query.graduationYear ? String(query.graduationYear).trim().toLowerCase() : null;
    const branchFilter = query.branch?.trim().toLowerCase() || null;
    const roleFilter = query.targetRole?.trim().toLowerCase() || null;
    const tierFilter = query.targetCompanyTier?.trim().toLowerCase() || null;
    const roadmapIdFilter = query.roadmapId?.trim() || null;

    // 1. Fetch eligible public user roadmaps with related data
    const whereClause: any = {
      status: { in: ['ACTIVE', 'COMPLETED'] },
      sourceRoadmap: {
        visibility: 'PUBLIC',
      },
    };

    if (roadmapIdFilter) {
      whereClause.sourceRoadmapId = roadmapIdFilter;
    }

    const userRoadmaps = await prisma.userRoadmap.findMany({
      where: whereClause,
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
      orderBy: { updatedAt: 'desc' },
    });

    // 2. Filter cohort candidates matching institutional criteria
    const matchedCandidates: Array<{
      userRoadmap: any;
      summary: ReturnType<typeof deriveRoadmapProfileSummary>;
      personalization: Record<string, any>;
    }> = [];

    for (const ur of userRoadmaps) {
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

      // Filter by Readiness Range
      if (summary.overallReadiness < minReadiness || summary.overallReadiness > maxReadiness) {
        continue;
      }

      // Filter by Institution / College
      const candidateInstitution = (
        personalization.institution ||
        personalization.college ||
        personalization.organization ||
        ''
      ).toLowerCase();

      if (!candidateInstitution.includes(institutionFilter)) {
        continue;
      }

      if (collegeFilter && !candidateInstitution.includes(collegeFilter)) {
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

      // Filter by Company Tier
      const candidateTier = (
        summary.targetCompanyTier ||
        ur.sourceRoadmap?.targetCompanyTier ||
        personalization.targetCompanyTier ||
        ''
      ).toLowerCase();
      if (tierFilter && !candidateTier.includes(tierFilter)) {
        continue;
      }

      matchedCandidates.push({
        userRoadmap: ur,
        summary,
        personalization,
      });
    }

    const totalCandidates = matchedCandidates.length;

    // Handle Empty Batch Edge Case
    if (totalCandidates === 0) {
      return this.buildEmptyResponse(validatedInstitution, query);
    }

    // 3. Compute Candidate, Readiness, and Milestone Aggregations
    let activeCandidates = 0;
    let completedCandidates = 0;
    const readinessScores: number[] = [];

    const bandCounts: Record<string, number> = {
      TIER_1_ADVANCED: 0,
      TIER_2_PROFICIENT: 0,
      TIER_3_DEVELOPING: 0,
      TIER_4_BEGINNER: 0,
    };

    let totalSprintsEnrolled = 0;
    let completedSprintsCount = 0;
    let totalMilestonesCompleted = 0;
    let activeSprintsCount = 0;

    const roleMap = new Map<string, number>();
    const batchMap = new Map<string, number>();
    const branchMap = new Map<string, number>();

    const skillAggregateMap = new Map<
      string,
      {
        skillId?: string;
        skillName: string;
        category: string;
        candidateCount: number;
        totalScore: number;
        masteredCount: number;
      }
    >();

    const skillGapMap = new Map<string, { skillName: string; category: string; gapCount: number }>();
    const skillCategoryMap = new Map<string, number>();

    let totalAssessmentAttempts = 0;
    let passedAssessmentAttempts = 0;
    let totalAssessmentScoreSum = 0;
    let assessedCandidatesCount = 0;

    let candidatesWithPractical = 0;
    let totalPracticalDrills = 0;
    let totalPracticalScoreSum = 0;
    let practicalScoreCount = 0;
    const evidenceSourceCounts: Record<string, number> = {};

    for (const item of matchedCandidates) {
      const { userRoadmap, summary, personalization } = item;
      const readiness = summary.overallReadiness;
      readinessScores.push(readiness);

      if (userRoadmap.status === 'ACTIVE') {
        activeCandidates++;
      } else if (userRoadmap.status === 'COMPLETED') {
        completedCandidates++;
      }

      // Readiness Bands
      if (readiness >= 80) {
        bandCounts.TIER_1_ADVANCED++;
      } else if (readiness >= 60) {
        bandCounts.TIER_2_PROFICIENT++;
      } else if (readiness >= 40) {
        bandCounts.TIER_3_DEVELOPING++;
      } else {
        bandCounts.TIER_4_BEGINNER++;
      }

      // Milestone & Sprint Velocity
      if (Array.isArray(userRoadmap.sprints)) {
        for (const sprint of userRoadmap.sprints) {
          totalSprintsEnrolled++;
          if (sprint.status === 'COMPLETED') {
            completedSprintsCount++;
          } else if (sprint.status === 'ACTIVE') {
            activeSprintsCount++;
          }
          if (Array.isArray(sprint.tasks)) {
            for (const task of sprint.tasks) {
              if (task.status === 'COMPLETED') {
                totalMilestonesCompleted++;
              }
            }
          }
        }
      }

      // Distributions
      const role = summary.targetRole || 'Software Engineer';
      roleMap.set(role, (roleMap.get(role) || 0) + 1);

      const batch = personalization.batch || (personalization.graduationYear ? `Class of ${personalization.graduationYear}` : 'General Batch');
      batchMap.set(batch, (batchMap.get(batch) || 0) + 1);

      const branch = personalization.branch || 'General';
      branchMap.set(branch, (branchMap.get(branch) || 0) + 1);

      // Skills Aggregation
      for (const vs of summary.verifiedSkills) {
        const canonical = normalizeSkillName(vs.name);
        const category = vs.category || 'General';
        skillCategoryMap.set(category, (skillCategoryMap.get(category) || 0) + 1);

        const existing = skillAggregateMap.get(canonical) || {
          skillId: vs.skillId,
          skillName: canonical,
          category,
          candidateCount: 0,
          totalScore: 0,
          masteredCount: 0,
        };

        existing.candidateCount++;
        existing.totalScore += vs.score ?? 0;
        if (vs.status === 'MASTERED') {
          existing.masteredCount++;
        }
        skillAggregateMap.set(canonical, existing);
      }

      // Assessments
      if (Array.isArray(userRoadmap.assessmentAttempts) && userRoadmap.assessmentAttempts.length > 0) {
        assessedCandidatesCount++;
        for (const att of userRoadmap.assessmentAttempts) {
          totalAssessmentAttempts++;
          totalAssessmentScoreSum += att.score || 0;
          if (att.passed || (att.score && att.score >= 70)) {
            passedAssessmentAttempts++;
          }
        }
      }

      // Practical Evidence
      if (Array.isArray(userRoadmap.skillEvidence) && userRoadmap.skillEvidence.length > 0) {
        let hasPractical = false;
        for (const ev of userRoadmap.skillEvidence) {
          const src = ev.source || 'PROJECT';
          evidenceSourceCounts[src] = (evidenceSourceCounts[src] || 0) + 1;

          if (ev.demonstratedScore !== null && ev.demonstratedScore !== undefined) {
            totalPracticalDrills++;
            totalPracticalScoreSum += ev.demonstratedScore;
            practicalScoreCount++;
            hasPractical = true;
          }
        }
        if (hasPractical) {
          candidatesWithPractical++;
        }
      }
    }

    // Compute Summary Math
    readinessScores.sort((a, b) => a - b);
    const sumReadiness = readinessScores.reduce((a, b) => a + b, 0);
    const averageReadiness = Math.round(sumReadiness / totalCandidates);
    const medianReadiness =
      totalCandidates % 2 === 0
        ? Math.round((readinessScores[totalCandidates / 2 - 1] + readinessScores[totalCandidates / 2]) / 2)
        : readinessScores[Math.floor(totalCandidates / 2)];

    // Readiness Bands
    const bands: ReadinessBandDTO[] = [
      {
        band: 'TIER_1_ADVANCED',
        label: 'Advanced (80-100%)',
        minScore: 80,
        maxScore: 100,
        candidateCount: bandCounts.TIER_1_ADVANCED,
        percentage: Math.round((bandCounts.TIER_1_ADVANCED / totalCandidates) * 100),
      },
      {
        band: 'TIER_2_PROFICIENT',
        label: 'Proficient (60-79%)',
        minScore: 60,
        maxScore: 79,
        candidateCount: bandCounts.TIER_2_PROFICIENT,
        percentage: Math.round((bandCounts.TIER_2_PROFICIENT / totalCandidates) * 100),
      },
      {
        band: 'TIER_3_DEVELOPING',
        label: 'Developing (40-59%)',
        minScore: 40,
        maxScore: 59,
        candidateCount: bandCounts.TIER_3_DEVELOPING,
        percentage: Math.round((bandCounts.TIER_3_DEVELOPING / totalCandidates) * 100),
      },
      {
        band: 'TIER_4_BEGINNER',
        label: 'Early Stage (0-39%)',
        minScore: 0,
        maxScore: 39,
        candidateCount: bandCounts.TIER_4_BEGINNER,
        percentage: Math.round((bandCounts.TIER_4_BEGINNER / totalCandidates) * 100),
      },
    ];

    // Milestone Velocity
    const sprintCompletionRate =
      totalSprintsEnrolled > 0 ? Math.round((completedSprintsCount / totalSprintsEnrolled) * 100) : 0;
    const averageSprintsCompleted =
      totalCandidates > 0 ? Math.round((completedSprintsCount / totalCandidates) * 10) / 10 : 0;
    const activeSprintVelocity =
      totalSprintsEnrolled > 0 ? Math.round((activeSprintsCount / totalSprintsEnrolled) * 100) : 0;

    const milestoneVelocity: BatchMilestoneVelocityDTO = {
      totalSprintsEnrolled,
      completedSprintsCount,
      averageSprintsCompleted,
      sprintCompletionRate,
      activeSprintVelocity,
      milestonesCompleted: totalMilestonesCompleted,
    };

    // Top Skills
    const topDemonstratedSkills: CohortSkillMetricDTO[] = Array.from(skillAggregateMap.values())
      .map((item) => ({
        skillId: item.skillId,
        skillName: item.skillName,
        category: item.category,
        candidateCount: item.candidateCount,
        coveragePercentage: Math.round((item.candidateCount / totalCandidates) * 100),
        averageScore: Math.round(item.totalScore / item.candidateCount),
        masteredCount: item.masteredCount,
      }))
      .sort((a, b) => b.candidateCount - a.candidateCount || b.averageScore - a.averageScore)
      .slice(0, 15);

    // Skill Gaps
    const commonSkillGaps: CohortSkillGapDTO[] = Array.from(skillGapMap.values())
      .map((item) => ({
        skillName: item.skillName,
        category: item.category,
        gapCount: item.gapCount,
        gapPercentage: Math.round((item.gapCount / totalCandidates) * 100),
      }))
      .sort((a, b) => b.gapCount - a.gapCount)
      .slice(0, 10);

    // Categories
    const categoryBreakdown: CohortDistributionItemDTO[] = Array.from(skillCategoryMap.entries())
      .map(([key, count]) => ({
        key,
        count,
        percentage: Math.round((count / Math.max(1, skillCategoryMap.size)) * 100),
      }))
      .sort((a, b) => b.count - a.count);

    // Assessment Performance
    const assessmentPerformance: CohortAssessmentSummaryDTO = {
      totalAttempts: totalAssessmentAttempts,
      passedAttempts: passedAssessmentAttempts,
      overallPassRate:
        totalAssessmentAttempts > 0 ? Math.round((passedAssessmentAttempts / totalAssessmentAttempts) * 100) : 0,
      averageScore:
        totalAssessmentAttempts > 0 ? Math.round(totalAssessmentScoreSum / totalAssessmentAttempts) : 0,
      candidatesAssessed: assessedCandidatesCount,
      assessedCoveragePercentage: Math.round((assessedCandidatesCount / totalCandidates) * 100),
    };

    // Practical Performance
    const practicalPerformance: CohortPracticalSummaryDTO = {
      candidatesWithPracticalEvidence: candidatesWithPractical,
      practicalCoveragePercentage: Math.round((candidatesWithPractical / totalCandidates) * 100),
      totalPracticalDrills,
      averagePracticalScore:
        practicalScoreCount > 0 ? Math.round(totalPracticalScoreSum / practicalScoreCount) : 0,
      evidenceSourceCounts,
    };

    // Distributions
    const formatDist = (map: Map<string, number>): CohortDistributionItemDTO[] =>
      Array.from(map.entries())
        .map(([key, count]) => ({
          key,
          count,
          percentage: Math.round((count / totalCandidates) * 100),
        }))
        .sort((a, b) => b.count - a.count);

    return {
      institution: validatedInstitution,
      batch: query.batch || null,
      graduationYear: query.graduationYear || null,
      branch: query.branch || null,
      summary: {
        totalCandidates,
        activeCandidates,
        completedCandidates,
        averageReadiness,
        medianReadiness,
        minReadiness: readinessScores[0] || 0,
        maxReadiness: readinessScores[readinessScores.length - 1] || 0,
      },
      milestoneVelocity,
      readinessDistribution: {
        averageReadiness,
        medianReadiness,
        bands,
      },
      skillsAnalysis: {
        topDemonstratedSkills,
        commonSkillGaps,
        categoryBreakdown,
      },
      assessmentPerformance,
      practicalPerformance,
      distributions: {
        roles: formatDist(roleMap),
        batches: formatDist(batchMap),
        branches: formatDist(branchMap),
      },
      filtersApplied: query,
      generatedAt: new Date().toISOString(),
    };
  }

  /**
   * Returns a lightweight overview of all batches / graduation cohorts within an institution.
   */
  public async getInstitutionalBatches(
    authContext: InstitutionalAuthContext,
    query: InstitutionalCohortQueryDTO = {},
    baseUrl = 'https://ruready.dev'
  ): Promise<InstitutionalBatchListResponseDTO> {
    const validatedInstitution = this.resolveAndValidateInstitution(authContext, query.institution);
    const institutionFilter = validatedInstitution.toLowerCase();

    const userRoadmaps = await prisma.userRoadmap.findMany({
      where: {
        status: { in: ['ACTIVE', 'COMPLETED'] },
        sourceRoadmap: { visibility: 'PUBLIC' },
      },
      include: {
        sourceRoadmap: true,
        sprints: true,
      },
    });

    const batchGroups = new Map<
      string,
      {
        batch: string;
        graduationYear: string | number | null;
        totalLearners: number;
        activeLearners: number;
        completedLearners: number;
        readinessSum: number;
      }
    >();

    let totalLearners = 0;

    for (const ur of userRoadmaps) {
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

      const candidateInst = (
        personalization.institution ||
        personalization.college ||
        personalization.organization ||
        ''
      ).toLowerCase();

      if (!candidateInst.includes(institutionFilter)) {
        continue;
      }

      totalLearners++;
      const summary = deriveRoadmapProfileSummary(ur, baseUrl);
      const batchName =
        personalization.batch ||
        (personalization.graduationYear ? `Class of ${personalization.graduationYear}` : 'General Batch');
      const gradYear = personalization.graduationYear || null;

      const group = batchGroups.get(batchName) || {
        batch: batchName,
        graduationYear: gradYear,
        totalLearners: 0,
        activeLearners: 0,
        completedLearners: 0,
        readinessSum: 0,
      };

      group.totalLearners++;
      group.readinessSum += summary.overallReadiness;
      if (ur.status === 'ACTIVE') group.activeLearners++;
      if (ur.status === 'COMPLETED') group.completedLearners++;

      batchGroups.set(batchName, group);
    }

    const batches: InstitutionalBatchOverviewItemDTO[] = Array.from(batchGroups.values())
      .map((g) => ({
        batch: g.batch,
        graduationYear: g.graduationYear,
        totalLearners: g.totalLearners,
        activeLearners: g.activeLearners,
        completedLearners: g.completedLearners,
        averageReadiness: g.totalLearners > 0 ? Math.round(g.readinessSum / g.totalLearners) : 0,
        completionRate: g.totalLearners > 0 ? Math.round((g.completedLearners / g.totalLearners) * 100) : 0,
      }))
      .sort((a, b) => b.totalLearners - a.totalLearners);

    return {
      institution: validatedInstitution,
      batches,
      totalBatches: batches.length,
      totalLearners,
      generatedAt: new Date().toISOString(),
    };
  }

  /**
   * Helper to construct empty response for unmatched cohort queries.
   */
  private buildEmptyResponse(
    institution: string,
    query: InstitutionalCohortQueryDTO
  ): InstitutionalBatchSummaryDTO {
    return {
      institution,
      batch: query.batch || null,
      graduationYear: query.graduationYear || null,
      branch: query.branch || null,
      summary: {
        totalCandidates: 0,
        activeCandidates: 0,
        completedCandidates: 0,
        averageReadiness: 0,
        medianReadiness: 0,
        minReadiness: 0,
        maxReadiness: 0,
      },
      milestoneVelocity: {
        totalSprintsEnrolled: 0,
        completedSprintsCount: 0,
        averageSprintsCompleted: 0,
        sprintCompletionRate: 0,
        activeSprintVelocity: 0,
        milestonesCompleted: 0,
      },
      readinessDistribution: {
        averageReadiness: 0,
        medianReadiness: 0,
        bands: [
          { band: 'TIER_1_ADVANCED', label: 'Advanced (80-100%)', minScore: 80, maxScore: 100, candidateCount: 0, percentage: 0 },
          { band: 'TIER_2_PROFICIENT', label: 'Proficient (60-79%)', minScore: 60, maxScore: 79, candidateCount: 0, percentage: 0 },
          { band: 'TIER_3_DEVELOPING', label: 'Developing (40-59%)', minScore: 40, maxScore: 59, candidateCount: 0, percentage: 0 },
          { band: 'TIER_4_BEGINNER', label: 'Early Stage (0-39%)', minScore: 0, maxScore: 39, candidateCount: 0, percentage: 0 },
        ],
      },
      skillsAnalysis: {
        topDemonstratedSkills: [],
        commonSkillGaps: [],
        categoryBreakdown: [],
      },
      assessmentPerformance: {
        totalAttempts: 0,
        passedAttempts: 0,
        overallPassRate: 0,
        averageScore: 0,
        candidatesAssessed: 0,
        assessedCoveragePercentage: 0,
      },
      practicalPerformance: {
        candidatesWithPracticalEvidence: 0,
        practicalCoveragePercentage: 0,
        totalPracticalDrills: 0,
        averagePracticalScore: 0,
        evidenceSourceCounts: {},
      },
      distributions: {
        roles: [],
        batches: [],
        branches: [],
      },
      filtersApplied: query,
      generatedAt: new Date().toISOString(),
    };
  }
}

export const institutionalCohortService = new InstitutionalCohortService();
