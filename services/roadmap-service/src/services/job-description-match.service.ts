// ═══════════════════════════════════════════════════════════════
// Job Description Matching Service — Stage 10.2
// Deterministic & Explainable Candidate-to-Job Matching Engine
// ═══════════════════════════════════════════════════════════════

import { prisma } from '../lib/prisma.js';
import {
  JobDescriptionMatchInputDTO,
  JobDescriptionMatchResponseDTO,
  CandidateMatchCardDTO,
  deriveRoadmapProfileSummary,
  normalizeSkillName,
  normalizeSkillList,
} from '@ru-ready/shared';
import { aiProviderManager } from '../lib/ai-provider-manager.js';

// Common technical keyword dictionary for fast, deterministic skill extraction from JD text
const COMMON_TECH_KEYWORDS = [
  'react', 'react.js', 'reactjs', 'node', 'node.js', 'nodejs', 'express', 'express.js',
  'nestjs', 'typescript', 'javascript', 'python', 'fastapi', 'django', 'postgresql',
  'postgres', 'mysql', 'mongodb', 'redis', 'kafka', 'docker', 'kubernetes', 'k8s',
  'aws', 'gcp', 'azure', 'system design', 'graphql', 'rest', 'rest apis', 'ci/cd',
  'dsa', 'data structures', 'algorithms', 'vue', 'vue.js', 'angular', 'go', 'golang',
  'java', 'spring', 'spring boot', 'c++', 'rust', 'linux', 'bash', 'sql', 'nosql',
];

export class JobDescriptionMatchService {
  /**
   * Deterministically extracts skills from JD text using regex keyword taxonomy.
   */
  public extractSkillsFromText(text: string): string[] {
    if (!text || typeof text !== 'string') return [];
    const lowerText = text.toLowerCase();
    const extractedSet = new Set<string>();

    for (const keyword of COMMON_TECH_KEYWORDS) {
      // Escape special characters in keyword (like '.', '+', '/')
      const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(?:^|\\b|\\s)${escaped}(?:\\b|\\s|$)`, 'i');
      if (regex.test(lowerText)) {
        const canonical = normalizeSkillName(keyword);
        if (canonical) {
          extractedSet.add(canonical);
        }
      }
    }

    return Array.from(extractedSet);
  }

  /**
   * Attempts LLM-assisted skill extraction if text is provided, with safe fallback to regex extractor.
   */
  public async extractSkillsHybrid(
    title: string,
    description?: string,
    explicitRequired: string[] = [],
    explicitPreferred: string[] = []
  ): Promise<{ requiredSkills: string[]; preferredSkills: string[] }> {
    const requiredSet = new Set<string>(explicitRequired);
    const preferredSet = new Set<string>(explicitPreferred);

    // If description is empty, rely entirely on explicit lists and title extraction
    if (!description || description.trim().length === 0) {
      const titleSkills = this.extractSkillsFromText(title);
      for (const s of titleSkills) {
        if (!preferredSet.has(s)) requiredSet.add(s);
      }
      return {
        requiredSkills: normalizeSkillList(Array.from(requiredSet)),
        preferredSkills: normalizeSkillList(Array.from(preferredSet)),
      };
    }

    // Attempt AI extraction with timeout/fallback
    if (aiProviderManager.getConfig().provider !== 'mock' && process.env.NODE_ENV !== 'test') {
      try {
        const systemPrompt = 'You are an expert technical recruiter and skill taxonomy extractor. Output valid JSON only.';
        const userPrompt = `Extract required and preferred technical skills from this Job Description as JSON.\nTitle: ${title}\nDescription: ${description.slice(0, 4000)}\n\nRespond ONLY with JSON matching: { "requiredSkills": string[], "preferredSkills": string[] }`;
        const content = await aiProviderManager.callChatCompletion(
          systemPrompt,
          userPrompt,
          { responseFormatJson: true, temperature: 0.1, timeoutMs: 3000 }
        );

        if (content) {
          const parsed = JSON.parse(content);
          if (Array.isArray(parsed.requiredSkills)) {
            for (const s of parsed.requiredSkills) {
              const norm = normalizeSkillName(String(s));
              if (norm) requiredSet.add(norm);
            }
          }
          if (Array.isArray(parsed.preferredSkills)) {
            for (const s of parsed.preferredSkills) {
              const norm = normalizeSkillName(String(s));
              if (norm && !requiredSet.has(norm)) preferredSet.add(norm);
            }
          }
        }
      } catch {
        // Fallback gracefully on any LLM parsing or network error
      }
    }

    // Deterministic keyword pass over description to guarantee completeness
    const textSkills = this.extractSkillsFromText(`${title} ${description}`);
    for (const s of textSkills) {
      if (!preferredSet.has(s) && requiredSet.size < 8) {
        requiredSet.add(s);
      }
    }

    return {
      requiredSkills: normalizeSkillList(Array.from(requiredSet)),
      preferredSkills: normalizeSkillList(Array.from(preferredSet)),
    };
  }

  /**
   * Matches eligible public candidate profiles against a target Job Description.
   */
  public async matchJobDescription(
    input: JobDescriptionMatchInputDTO,
    baseUrl = 'https://ruready.dev'
  ): Promise<JobDescriptionMatchResponseDTO> {
    const targetCompanyTier = input.targetCompanyTier || 'ALL';
    const minMatchScore = input.minMatchScore ?? 0;
    const page = Math.max(1, input.page || 1);
    const limit = Math.max(1, Math.min(100, input.limit || 10));

    // 1. Extract and normalize skills from input & description
    const explicitRequired = Array.isArray(input.requiredSkills)
      ? input.requiredSkills
      : typeof input.requiredSkills === 'string'
      ? input.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const explicitPreferred = Array.isArray(input.preferredSkills)
      ? input.preferredSkills
      : typeof input.preferredSkills === 'string'
      ? input.preferredSkills.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const { requiredSkills, preferredSkills } = await this.extractSkillsHybrid(
      input.title,
      input.description,
      explicitRequired,
      explicitPreferred
    );

    // 2. Query eligible candidates from database (PUBLIC visibility only)
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

    const candidateMatches: CandidateMatchCardDTO[] = [];

    // 3. Score every candidate deterministically
    for (const ur of userRoadmaps) {
      // Respect company tier filter if provided and not 'ALL'
      const roadmapTier = ur.sourceRoadmap?.targetCompanyTier || 'FAANG';
      if (targetCompanyTier !== 'ALL' && roadmapTier.toUpperCase() !== targetCompanyTier.toUpperCase()) {
        continue;
      }

      const summary = deriveRoadmapProfileSummary(ur, baseUrl);

      // Collect candidate skills
      const candidateSkillsSet = new Set<string>();
      const candidateMasteredSet = new Set<string>();

      for (const vs of summary.verifiedSkills) {
        const norm = normalizeSkillName(vs.name).toLowerCase();
        if (norm) {
          candidateSkillsSet.add(norm);
          if (vs.status === 'MASTERED') {
            candidateMasteredSet.add(norm);
          }
        }
      }

      // Evidence sources
      const evidenceSourcesSet = new Set<string>();
      if (Array.isArray(ur.skillEvidence)) {
        for (const ev of ur.skillEvidence) {
          if (ev.source) evidenceSourcesSet.add(ev.source);
        }
      }
      const evidenceSources = Array.from(evidenceSourcesSet);

      // ─── Component 1: Required Skills (40 pts) ───
      let requiredSkillsScore = 40;
      const requiredSkillsMatched: string[] = [];
      const requiredSkillsMissing: string[] = [];

      if (requiredSkills.length > 0) {
        for (const reqSkill of requiredSkills) {
          const lowerReq = reqSkill.toLowerCase();
          const hasSkill = Array.from(candidateSkillsSet).some(
            (candSkill) => candSkill.includes(lowerReq) || lowerReq.includes(candSkill)
          );
          if (hasSkill) {
            requiredSkillsMatched.push(reqSkill);
          } else {
            requiredSkillsMissing.push(reqSkill);
          }
        }
        requiredSkillsScore = Math.round((requiredSkillsMatched.length / requiredSkills.length) * 40);
      }

      // ─── Component 2: Preferred Skills (15 pts) ───
      let preferredSkillsScore = 15;
      const preferredSkillsMatched: string[] = [];
      const preferredSkillsMissing: string[] = [];

      if (preferredSkills.length > 0) {
        for (const prefSkill of preferredSkills) {
          const lowerPref = prefSkill.toLowerCase();
          const hasSkill = Array.from(candidateSkillsSet).some(
            (candSkill) => candSkill.includes(lowerPref) || lowerPref.includes(candSkill)
          );
          if (hasSkill) {
            preferredSkillsMatched.push(prefSkill);
          } else {
            preferredSkillsMissing.push(prefSkill);
          }
        }
        preferredSkillsScore = Math.round((preferredSkillsMatched.length / preferredSkills.length) * 15);
      }

      // ─── Component 3: Role & Tier Alignment (15 pts) ───
      let roleScore = 8;
      const targetRoleLower = summary.targetRole.toLowerCase();
      const jdTitleLower = (input.title || '').toLowerCase();

      if (
        (jdTitleLower.includes('backend') && targetRoleLower.includes('backend')) ||
        (jdTitleLower.includes('frontend') && targetRoleLower.includes('frontend')) ||
        (jdTitleLower.includes('fullstack') && targetRoleLower.includes('fullstack')) ||
        (jdTitleLower.includes('data') && targetRoleLower.includes('data'))
      ) {
        roleScore = 12;
      } else if (targetRoleLower.includes('software') || jdTitleLower.includes('engineer')) {
        roleScore = 9;
      } else {
        roleScore = 5;
      }

      const tierScore = targetCompanyTier === 'ALL' || roadmapTier === targetCompanyTier ? 3 : 1;
      const roleAlignmentScore = Math.min(15, roleScore + tierScore);

      // ─── Component 4: Evidence Strength (15 pts) ───
      let evidenceScore = 4;
      if (evidenceSources.includes('CODING_INTERVIEW') || evidenceSources.includes('PROJECT')) {
        evidenceScore += 6;
      }
      if (evidenceSources.includes('ORAL_INTERVIEW') || evidenceSources.includes('ASSESSMENT')) {
        evidenceScore += 3;
      }
      if (ur.skillEvidence.length >= 3) {
        evidenceScore += 2;
      }
      const evidenceStrengthScore = Math.min(15, evidenceScore);

      // ─── Component 5: Readiness & Proof (15 pts) ───
      const readinessBase = Math.round((summary.overallReadiness / 100) * 10);
      const proofBonus = summary.assessmentSummary.passedAttempts > 0 || summary.practicalSummary.passedDrills > 0 ? 5 : 2;
      const readinessScore = Math.min(15, readinessBase + proofBonus);

      // Total Match Score
      const totalMatchScore = Math.min(
        100,
        Math.max(0, requiredSkillsScore + preferredSkillsScore + roleAlignmentScore + evidenceStrengthScore + readinessScore)
      );

      // Build concise human-readable explanation
      const parts: string[] = [];
      if (requiredSkills.length > 0) {
        parts.push(`Matched ${requiredSkillsMatched.length}/${requiredSkills.length} required skills`);
      }
      if (preferredSkills.length > 0 && preferredSkillsMatched.length > 0) {
        parts.push(`+${preferredSkillsMatched.length} preferred skill(s)`);
      }
      if (evidenceSources.length > 0) {
        parts.push(`Verified via ${evidenceSources.slice(0, 2).join(' & ')}`);
      }
      parts.push(`${summary.overallReadiness}% calibrated readiness`);

      const explanation = parts.join(' • ');

      const matchCard: CandidateMatchCardDTO = {
        candidateId: ur.userId,
        candidateName: summary.candidateName || 'Verified Candidate',
        userRoadmapId: ur.id,
        roadmapId: ur.sourceRoadmapId,
        targetRole: summary.targetRole,
        targetCompanyTier: roadmapTier,
        overallReadiness: summary.overallReadiness,
        matchScore: totalMatchScore,
        scoreBreakdown: {
          requiredSkillsScore: Math.round((requiredSkillsScore / 40) * 100),
          preferredSkillsScore: Math.round((preferredSkillsScore / 15) * 100),
          roleAlignmentScore: Math.round((roleAlignmentScore / 15) * 100),
          evidenceStrengthScore: Math.round((evidenceStrengthScore / 15) * 100),
          readinessScore: Math.round((readinessScore / 15) * 100),
        },
        requiredSkillsMatched,
        requiredSkillsMissing,
        preferredSkillsMatched,
        preferredSkillsMissing,
        evidenceSources,
        assessmentSummary: summary.assessmentSummary,
        practicalSummary: summary.practicalSummary,
        verificationId: summary.verificationId,
        verificationUrl: summary.verificationUrl,
        explanation,
        lastActiveAt: summary.lastActiveAt || ur.updatedAt.toISOString(),
      };

      if (totalMatchScore >= minMatchScore) {
        candidateMatches.push(matchCard);
      }
    }

    // 4. Deterministic Sorting: matchScore DESC, overallReadiness DESC, userRoadmapId ASC
    candidateMatches.sort((a, b) => {
      const matchDiff = b.matchScore - a.matchScore;
      if (matchDiff !== 0) return matchDiff;

      const readinessDiff = b.overallReadiness - a.overallReadiness;
      if (readinessDiff !== 0) return readinessDiff;

      return a.userRoadmapId.localeCompare(b.userRoadmapId);
    });

    // 5. Bounded Pagination
    const totalMatches = candidateMatches.length;
    const totalPages = totalMatches > 0 ? Math.ceil(totalMatches / limit) : 1;
    const startIndex = (page - 1) * limit;
    const pagedMatches = candidateMatches.slice(startIndex, startIndex + limit);

    return {
      jobProfile: {
        title: input.title,
        targetCompanyTier,
        extractedRequiredSkills: requiredSkills,
        extractedPreferredSkills: preferredSkills,
      },
      matches: pagedMatches,
      totalMatches,
      page,
      limit,
      totalPages,
      generatedAt: new Date().toISOString(),
    };
  }
}

export const jobDescriptionMatchService = new JobDescriptionMatchService();
