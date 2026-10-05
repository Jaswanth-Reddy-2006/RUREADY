// ═══════════════════════════════════════════════════════════════
// Cohort & Campus Analytics Service — Stage 10.4
// Production-Grade, Deterministic Institutional Talent Aggregation Engine
// ═══════════════════════════════════════════════════════════════

import { prisma } from '../lib/prisma.js';
import {
  CohortAnalyticsQueryDTO,
  CohortAnalyticsResponseDTO,
  ReadinessBandDTO,
  CohortSkillMetricDTO,
  CohortSkillGapDTO,
  CohortDistributionItemDTO,
  deriveRoadmapProfileSummary,
} from '@ru-ready/shared';

export class CohortAnalyticsService {
  /**
   * Computes deterministic, privacy-preserving cohort & campus analytics.
   * Strictly aggregate-first: Never exposes individual candidate transcripts,
   * private quiz answers, or internal adaptation logs.
   */
  public async getCohortAnalytics(
    query: CohortAnalyticsQueryDTO = {},
    baseUrl = 'https://ruready.dev'
  ): Promise<CohortAnalyticsResponseDTO> {
    const minReadiness = query.minReadiness ?? 0;
    const maxReadiness = query.maxReadiness ?? 100;
    const institutionFilter = query.institution?.trim().toLowerCase() || null;
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
          include: { performance: true },
        },
        skillEvidence: {
          include: { skill: true },
        },
        assessmentAttempts: {
          include: { assessment: true, skill: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    // 2. Filter cohort candidates based on multi-dimensional criteria
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

      if (institutionFilter && !candidateInstitution.includes(institutionFilter)) {
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

    // Handle Empty Cohort Edge Case
    if (totalCandidates === 0) {
      return this.buildEmptyResponse(query);
    }

    // 3. Compute Candidate & Readiness Aggregations
    let verifiedCandidates = 0;
    let activeCandidates = 0;
    let completedCandidates = 0;
    const readinessScores: number[] = [];

    const bandCounts: Record<string, number> = {
      TIER_1_ADVANCED: 0,
      TIER_2_PROFICIENT: 0,
      TIER_3_DEVELOPING: 0,
      TIER_4_BEGINNER: 0,
    };

    const roleMap = new Map<string, number>();
    const tierMap = new Map<string, number>();
    const institutionMap = new Map<string, number>();

    // Skill Aggregation Map
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

    // Assessment & Practical Aggregations
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

      if (readiness > 0 || summary.verifiedSkillCount > 0) {
        verifiedCandidates++;
      }

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

      // Distributions
      const role = summary.targetRole || 'Software Engineer';
      roleMap.set(role, (roleMap.get(role) || 0) + 1);

      const tier = summary.targetCompanyTier || 'FAANG';
      tierMap.set(tier, (tierMap.get(tier) || 0) + 1);

      const institution =
        personalization.institution ||
        personalization.college ||
        personalization.organization ||
        'Unspecified Institution';
      institutionMap.set(institution, (institutionMap.get(institution) || 0) + 1);

      // Skills Processing
      const candidateSkillNames = new Set<string>();
      for (const skill of summary.verifiedSkills) {
        candidateSkillNames.add(skill.name);
        const existing = skillAggregateMap.get(skill.name) || {
          skillId: skill.skillId,
          skillName: skill.name,
          category: skill.category || 'General',
          candidateCount: 0,
          totalScore: 0,
          masteredCount: 0,
        };

        existing.candidateCount++;
        existing.totalScore += skill.score || 0;
        if (skill.status === 'MASTERED') {
          existing.masteredCount++;
        }
        skillAggregateMap.set(skill.name, existing);

        const category = skill.category || 'General';
        skillCategoryMap.set(category, (skillCategoryMap.get(category) || 0) + 1);
      }

      // Skill Gaps (e.g. low scores or identified blindspots in userRoadmap)
      for (const ev of userRoadmap.skillEvidence || []) {
        if (ev.demonstratedScore !== null && ev.demonstratedScore < 50 && ev.skill?.name) {
          const sName = ev.skill.name;
          const sCat = ev.skill.category || 'General';
          const gap = skillGapMap.get(sName) || { skillName: sName, category: sCat, gapCount: 0 };
          gap.gapCount++;
          skillGapMap.set(sName, gap);
        }
      }

      // Assessment Aggregations
      const attempts = userRoadmap.assessmentAttempts || [];
      if (attempts.length > 0) {
        assessedCandidatesCount++;
        for (const att of attempts) {
          totalAssessmentAttempts++;
          totalAssessmentScoreSum += att.score || 0;
          if (att.passed) {
            passedAssessmentAttempts++;
          }
        }
      }

      // Practical Evidence Aggregations
      const evidences = userRoadmap.skillEvidence || [];
      let hasPractical = false;
      for (const ev of evidences) {
        const src = ev.source || 'SELF_REPORTED';
        evidenceSourceCounts[src] = (evidenceSourceCounts[src] || 0) + 1;

        if (
          src === 'PRACTICAL_DRILL' ||
          src === 'PROJECT' ||
          src === 'CODING_INTERVIEW' ||
          src === 'ORAL_INTERVIEW'
        ) {
          hasPractical = true;
          totalPracticalDrills++;
          if (typeof ev.demonstratedScore === 'number') {
            totalPracticalScoreSum += ev.demonstratedScore;
            practicalScoreCount++;
          }
        }
      }
      if (hasPractical) {
        candidatesWithPractical++;
      }
    }

    // 4. Compute Statistical Readiness Metrics
    readinessScores.sort((a, b) => a - b);
    const sumReadiness = readinessScores.reduce((acc, val) => acc + val, 0);
    const averageReadiness = Number((sumReadiness / totalCandidates).toFixed(1));
    const medianReadiness =
      totalCandidates % 2 === 1
        ? readinessScores[Math.floor(totalCandidates / 2)]
        : Number(
            (
              (readinessScores[totalCandidates / 2 - 1] + readinessScores[totalCandidates / 2]) /
              2
            ).toFixed(1)
          );
    const minCalculatedReadiness = readinessScores[0];
    const maxCalculatedReadiness = readinessScores[totalCandidates - 1];

    // Readiness Bands
    const bands: ReadinessBandDTO[] = [
      {
        band: 'TIER_1_ADVANCED',
        label: 'Advanced (80-100%)',
        minScore: 80,
        maxScore: 100,
        candidateCount: bandCounts.TIER_1_ADVANCED,
        percentage: Number(((bandCounts.TIER_1_ADVANCED / totalCandidates) * 100).toFixed(1)),
      },
      {
        band: 'TIER_2_PROFICIENT',
        label: 'Proficient (60-79%)',
        minScore: 60,
        maxScore: 79,
        candidateCount: bandCounts.TIER_2_PROFICIENT,
        percentage: Number(((bandCounts.TIER_2_PROFICIENT / totalCandidates) * 100).toFixed(1)),
      },
      {
        band: 'TIER_3_DEVELOPING',
        label: 'Developing (40-59%)',
        minScore: 40,
        maxScore: 59,
        candidateCount: bandCounts.TIER_3_DEVELOPING,
        percentage: Number(((bandCounts.TIER_3_DEVELOPING / totalCandidates) * 100).toFixed(1)),
      },
      {
        band: 'TIER_4_BEGINNER',
        label: 'Beginner (0-39%)',
        minScore: 0,
        maxScore: 39,
        candidateCount: bandCounts.TIER_4_BEGINNER,
        percentage: Number(((bandCounts.TIER_4_BEGINNER / totalCandidates) * 100).toFixed(1)),
      },
    ];

    // 5. Build Top Demonstrated Skills
    const topDemonstratedSkills: CohortSkillMetricDTO[] = Array.from(skillAggregateMap.values())
      .map((item) => ({
        skillId: item.skillId,
        skillName: item.skillName,
        category: item.category,
        candidateCount: item.candidateCount,
        coveragePercentage: Number(((item.candidateCount / totalCandidates) * 100).toFixed(1)),
        averageScore:
          item.candidateCount > 0
            ? Number((item.totalScore / item.candidateCount).toFixed(1))
            : 0,
        masteredCount: item.masteredCount,
      }))
      .sort((a, b) => {
        if (b.candidateCount !== a.candidateCount) return b.candidateCount - a.candidateCount;
        if (b.averageScore !== a.averageScore) return b.averageScore - a.averageScore;
        return a.skillName.localeCompare(b.skillName);
      })
      .slice(0, 20);

    // 6. Build Common Skill Gaps
    const commonSkillGaps: CohortSkillGapDTO[] = Array.from(skillGapMap.values())
      .map((item) => ({
        skillName: item.skillName,
        category: item.category,
        gapCount: item.gapCount,
        gapPercentage: Number(((item.gapCount / totalCandidates) * 100).toFixed(1)),
      }))
      .sort((a, b) => b.gapCount - a.gapCount || a.skillName.localeCompare(b.skillName))
      .slice(0, 15);

    // 7. Category Breakdown
    const totalSkillOccurrences = Array.from(skillCategoryMap.values()).reduce(
      (acc, v) => acc + v,
      0
    );
    const categoryBreakdown: CohortDistributionItemDTO[] = Array.from(skillCategoryMap.entries())
      .map(([key, count]) => ({
        key,
        count,
        percentage:
          totalSkillOccurrences > 0
            ? Number(((count / totalSkillOccurrences) * 100).toFixed(1))
            : 0,
      }))
      .sort((a, b) => b.count - a.count || a.key.localeCompare(b.key));

    // 8. Assessment Performance Summary
    const overallPassRate =
      totalAssessmentAttempts > 0
        ? Number(((passedAssessmentAttempts / totalAssessmentAttempts) * 100).toFixed(1))
        : 0;
    const avgAssessmentScore =
      totalAssessmentAttempts > 0
        ? Number((totalAssessmentScoreSum / totalAssessmentAttempts).toFixed(1))
        : 0;
    const assessedCoveragePercentage = Number(
      ((assessedCandidatesCount / totalCandidates) * 100).toFixed(1)
    );

    // 9. Practical Evidence Summary
    const practicalCoveragePercentage = Number(
      ((candidatesWithPractical / totalCandidates) * 100).toFixed(1)
    );
    const avgPracticalScore =
      practicalScoreCount > 0
        ? Number((totalPracticalScoreSum / practicalScoreCount).toFixed(1))
        : 0;

    // 10. Demographic Distributions (Roles, Tiers, Institutions)
    const roles: CohortDistributionItemDTO[] = Array.from(roleMap.entries())
      .map(([key, count]) => ({
        key,
        count,
        percentage: Number(((count / totalCandidates) * 100).toFixed(1)),
      }))
      .sort((a, b) => b.count - a.count || a.key.localeCompare(b.key));

    const companyTiers: CohortDistributionItemDTO[] = Array.from(tierMap.entries())
      .map(([key, count]) => ({
        key,
        count,
        percentage: Number(((count / totalCandidates) * 100).toFixed(1)),
      }))
      .sort((a, b) => b.count - a.count || a.key.localeCompare(b.key));

    const institutions: CohortDistributionItemDTO[] = Array.from(institutionMap.entries())
      .map(([key, count]) => ({
        key,
        count,
        percentage: Number(((count / totalCandidates) * 100).toFixed(1)),
      }))
      .sort((a, b) => b.count - a.count || a.key.localeCompare(b.key));

    return {
      summary: {
        totalCandidates,
        verifiedCandidates,
        activeCandidates,
        completedCandidates,
        averageReadiness,
        medianReadiness,
        minReadiness: minCalculatedReadiness,
        maxReadiness: maxCalculatedReadiness,
      },
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
      assessmentPerformance: {
        totalAttempts: totalAssessmentAttempts,
        passedAttempts: passedAssessmentAttempts,
        overallPassRate,
        averageScore: avgAssessmentScore,
        candidatesAssessed: assessedCandidatesCount,
        assessedCoveragePercentage,
      },
      practicalEvidence: {
        candidatesWithPracticalEvidence: candidatesWithPractical,
        practicalCoveragePercentage,
        totalPracticalDrills,
        averagePracticalScore: avgPracticalScore,
        evidenceSourceCounts,
      },
      distributions: {
        roles,
        companyTiers,
        institutions,
      },
      filtersApplied: query,
      calculatedAt: new Date().toISOString(),
    };
  }

  /**
   * Builds an empty analytics response structure gracefully without NaN or division by zero.
   */
  private buildEmptyResponse(query: CohortAnalyticsQueryDTO): CohortAnalyticsResponseDTO {
    return {
      summary: {
        totalCandidates: 0,
        verifiedCandidates: 0,
        activeCandidates: 0,
        completedCandidates: 0,
        averageReadiness: 0,
        medianReadiness: 0,
        minReadiness: 0,
        maxReadiness: 0,
      },
      readinessDistribution: {
        averageReadiness: 0,
        medianReadiness: 0,
        bands: [
          { band: 'TIER_1_ADVANCED', label: 'Advanced (80-100%)', minScore: 80, maxScore: 100, candidateCount: 0, percentage: 0 },
          { band: 'TIER_2_PROFICIENT', label: 'Proficient (60-79%)', minScore: 60, maxScore: 79, candidateCount: 0, percentage: 0 },
          { band: 'TIER_3_DEVELOPING', label: 'Developing (40-59%)', minScore: 40, maxScore: 59, candidateCount: 0, percentage: 0 },
          { band: 'TIER_4_BEGINNER', label: 'Beginner (0-39%)', minScore: 0, maxScore: 39, candidateCount: 0, percentage: 0 },
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
      practicalEvidence: {
        candidatesWithPracticalEvidence: 0,
        practicalCoveragePercentage: 0,
        totalPracticalDrills: 0,
        averagePracticalScore: 0,
        evidenceSourceCounts: {},
      },
      distributions: {
        roles: [],
        companyTiers: [],
        institutions: [],
      },
      filtersApplied: query,
      calculatedAt: new Date().toISOString(),
    };
  }
}

export const cohortAnalyticsService = new CohortAnalyticsService();
