// ═══════════════════════════════════════════════════════════════
// Recruiter Talent Search & Skill Filtering Service — Stage 10.1
// Deterministic, Privacy-Preserving Talent Query & Search Engine
// ═══════════════════════════════════════════════════════════════

import { prisma } from '../lib/prisma.js';
import {
  RecruiterTalentQueryDTO,
  RecruiterCandidateCardDTO,
  RecruiterTalentSearchResponseDTO,
  deriveRoadmapProfileSummary,
} from '@ru-ready/shared';

export class RecruiterTalentService {
  /**
   * Deterministically searches and filters verified candidate profiles for recruiters.
   * Never leaks private learner transcripts, sensitive internal telemetry, or draft roadmaps.
   */
  public async searchCandidates(
    query: RecruiterTalentQueryDTO = {},
    baseUrl = 'https://ruready.dev'
  ): Promise<RecruiterTalentSearchResponseDTO> {
    const minReadiness = query?.minReadiness ?? 0;
    const maxReadiness = query?.maxReadiness ?? 100;
    const requestedSkills = Array.isArray(query.skills)
      ? query.skills.map((s) => s.trim().toLowerCase()).filter(Boolean)
      : typeof query.skills === 'string' && query.skills.trim()
      ? query.skills.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean)
      : [];
    const searchKeyword = query.search ? query.search.trim().toLowerCase() : null;
    const sortBy = query.sortBy || 'readiness';
    const sortOrder = query.sortOrder || 'desc';
    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, Math.min(100, query.limit || 10));

    // 1. Fetch all eligible candidate roadmaps (PUBLIC visibility and active/completed only)
    const userRoadmaps = await prisma.userRoadmap.findMany({
      where: {
        status: { in: ['ACTIVE', 'COMPLETED'] },
        sourceRoadmap: {
          visibility: 'PUBLIC',
        },
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
      orderBy: { updatedAt: 'desc' },
    });

    // 2. Map candidate roadmaps to recruiter-safe candidate cards
    const allCandidateCards: (RecruiterCandidateCardDTO & { updatedAtTimestamp: number })[] = [];

    for (const ur of userRoadmaps) {
      // Derive canonical safe summary without sensitive telemetry
      const summary = deriveRoadmapProfileSummary(ur, baseUrl);

      // Extract distinct evidence sources
      const evidenceSourcesSet = new Set<string>();
      if (Array.isArray(ur.skillEvidence)) {
        for (const ev of ur.skillEvidence) {
          if (ev.source) {
            evidenceSourcesSet.add(ev.source);
          }
        }
      }

      // Extract mastered & demonstrated skills
      const masteredSkills = summary.verifiedSkills
        .filter((s) => s.status === 'MASTERED')
        .map((s) => s.name);

      const demonstratedSkills = summary.verifiedSkills
        .filter((s) => s.status === 'DEMONSTRATED' || s.status === 'MASTERED')
        .map((s) => s.name);

      const allVerifiedSkillNames = summary.verifiedSkills.map((s) => s.name);

      const card: RecruiterCandidateCardDTO & { updatedAtTimestamp: number } = {
        candidateId: ur.userId,
        candidateName: summary.candidateName || 'Verified Candidate',
        userRoadmapId: ur.id,
        roadmapId: ur.sourceRoadmapId,
        targetRole: summary.targetRole,
        targetCompanyTier: summary.targetCompanyTier,
        overallReadiness: summary.overallReadiness,
        masteredSkills,
        demonstratedSkills,
        verifiedSkillsCount: summary.verifiedSkillCount,
        completedSprintCount: summary.completedSprintCount,
        totalSprintCount: summary.totalSprintCount,
        assessmentSummary: {
          totalAttempts: summary.assessmentSummary.totalAttempts,
          passedAttempts: summary.assessmentSummary.passedAttempts,
          averageScore: summary.assessmentSummary.averageScore,
        },
        practicalSummary: {
          totalDrills: summary.practicalSummary.totalDrills,
          passedDrills: summary.practicalSummary.passedDrills,
          averageScore: summary.practicalSummary.averageScore,
        },
        verifiedEvidenceCount: ur.skillEvidence.length,
        evidenceSources: Array.from(evidenceSourcesSet),
        verificationId: summary.verificationId,
        verificationUrl: summary.verificationUrl,
        lastActiveAt: summary.lastActiveAt || ur.updatedAt.toISOString(),
        updatedAtTimestamp: new Date(ur.updatedAt).getTime(),
      };

      allCandidateCards.push(card);
    }

    // 3. Multi-dimensional deterministic filtering
    const filteredCandidates = allCandidateCards.filter((candidate) => {
      // A. Target Role Filter
      if (query.role && query.role.trim()) {
        const reqRole = query.role.trim().toLowerCase();
        if (!candidate.targetRole.toLowerCase().includes(reqRole)) {
          return false;
        }
      }

      // B. Company Tier Filter
      if (query.targetCompanyTier && query.targetCompanyTier !== 'ALL') {
        if (candidate.targetCompanyTier.toUpperCase() !== query.targetCompanyTier.toUpperCase()) {
          return false;
        }
      }

      // C. Readiness Score Range Filter
      if (candidate.overallReadiness < minReadiness || candidate.overallReadiness > maxReadiness) {
        return false;
      }

      // D. Verified Skills Filter (AND intersection: candidate must possess all requested skills)
      if (requestedSkills.length > 0) {
        const candidateSkillSet = new Set(
          [...candidate.masteredSkills, ...candidate.demonstratedSkills].map((s) => s.toLowerCase())
        );
        const hasAllSkills = requestedSkills.every((reqSkill) =>
          Array.from(candidateSkillSet).some((candSkill) => candSkill.includes(reqSkill) || reqSkill.includes(candSkill))
        );
        if (!hasAllSkills) {
          return false;
        }
      }

      // E. Evidence Source Filter
      if (query.evidenceSource) {
        if (!candidate.evidenceSources.includes(query.evidenceSource)) {
          return false;
        }
      }

      // F. Assessment Proof Filter
      if (query.hasAssessmentProof) {
        const hasPassedAssessment = candidate.assessmentSummary.passedAttempts > 0;
        const hasPassedPractical = candidate.practicalSummary.passedDrills > 0;
        if (!hasPassedAssessment && !hasPassedPractical) {
          return false;
        }
      }

      // G. Search Keyword Filter
      if (searchKeyword) {
        const nameMatch = candidate.candidateName.toLowerCase().includes(searchKeyword);
        const roleMatch = candidate.targetRole.toLowerCase().includes(searchKeyword);
        const skillMatch = candidate.demonstratedSkills.some((s) => s.toLowerCase().includes(searchKeyword));
        if (!nameMatch && !roleMatch && !skillMatch) {
          return false;
        }
      }

      return true;
    });

    // 4. Deterministic Multi-Field Sorting with userRoadmapId tiebreaker
    filteredCandidates.sort((a, b) => {
      let comparison = 0;

      if (sortBy === 'readiness') {
        comparison = a.overallReadiness - b.overallReadiness;
      } else if (sortBy === 'updatedAt') {
        comparison = a.updatedAtTimestamp - b.updatedAtTimestamp;
      } else if (sortBy === 'masteredSkillsCount') {
        comparison = a.masteredSkills.length - b.masteredSkills.length;
      } else if (sortBy === 'evidenceCount') {
        comparison = a.verifiedEvidenceCount - b.verifiedEvidenceCount;
      }

      if (comparison !== 0) {
        return sortOrder === 'desc' ? -comparison : comparison;
      }

      // Secondary tiebreaker: overallReadiness desc
      const readinessDiff = b.overallReadiness - a.overallReadiness;
      if (readinessDiff !== 0) {
        return readinessDiff;
      }

      // Final deterministic tiebreaker: userRoadmapId asc
      return a.userRoadmapId.localeCompare(b.userRoadmapId);
    });

    // 5. Bounded Pagination
    const total = filteredCandidates.length;
    const totalPages = total > 0 ? Math.ceil(total / limit) : 1;
    const startIndex = (page - 1) * limit;
    const pagedCandidates = filteredCandidates.slice(startIndex, startIndex + limit).map((c) => {
      // Clean up helper sorting timestamp
      const { updatedAtTimestamp, ...card } = c;
      return card;
    });

    return {
      candidates: pagedCandidates,
      total,
      page,
      limit,
      totalPages,
      filtersApplied: {
        role: query.role || null,
        targetCompanyTier: query.targetCompanyTier !== 'ALL' ? query.targetCompanyTier || null : null,
        minReadiness,
        maxReadiness,
        skills: requestedSkills,
        evidenceSource: query.evidenceSource || null,
        hasAssessmentProof: Boolean(query.hasAssessmentProof),
        search: query.search || null,
        sortBy,
        sortOrder,
      },
    };
  }
}

export const recruiterTalentService = new RecruiterTalentService();
