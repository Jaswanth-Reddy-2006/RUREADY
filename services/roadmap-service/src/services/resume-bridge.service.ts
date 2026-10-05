// ═══════════════════════════════════════════════════════════════
// Resume-to-Roadmap AI Skill Bridge Service — Stage 8.1
// Connects parsed resume data & ATS gaps into Roadmap Generation
// ═══════════════════════════════════════════════════════════════

import { prisma } from '../lib/prisma.js';
import {
  ResumeRoadmapPrefillDTO,
  ResumeRoadmapPrefillInput,
  normalizeSkillList,
} from '@ru-ready/shared';
import { NotFoundError, ForbiddenError, UnauthorizedError, BadRequestError } from '../lib/errors.js';

export interface RawResumeRecord {
  id: string;
  userId: string;
  fileName: string;
  skills: string[];
  uploadedAt: Date | string;
}

export interface RawUserProfileRecord {
  id: string;
  userId: string;
  name: string;
  title?: string | null;
  experienceYears?: number | null;
  targetRoles?: string[] | null;
}

export interface RawAtsMatchRecord {
  id: string;
  userId: string;
  jobTitle: string;
  companyName?: string | null;
  matchScore: number;
  summary: string;
  matchedSkills: string[];
  missingSkills: string[];
  experienceMatch?: string | null;
  createdAt: Date | string;
}

// In-memory fallback and test store
const inMemoryResumes = new Map<string, RawResumeRecord>();
const inMemoryProfiles = new Map<string, RawUserProfileRecord>();
const inMemoryAtsMatches = new Map<string, RawAtsMatchRecord>();

export class ResumeBridgeService {
  /**
   * Clears in-memory test stores (used during testing).
   */
  public clearMemoryStore(): void {
    inMemoryResumes.clear();
    inMemoryProfiles.clear();
    inMemoryAtsMatches.clear();
  }

  /**
   * Registers a mock resume for testing or standalone memory mode.
   */
  public setMockResume(resume: RawResumeRecord): void {
    inMemoryResumes.set(resume.id, resume);
  }

  /**
   * Registers a mock user profile for testing or standalone memory mode.
   */
  public setMockProfile(profile: RawUserProfileRecord): void {
    inMemoryProfiles.set(profile.userId, profile);
  }

  /**
   * Registers a mock ATS match report for testing or standalone memory mode.
   */
  public setMockAtsMatch(match: RawAtsMatchRecord): void {
    inMemoryAtsMatches.set(match.id, match);
  }

  /**
   * Fetches and normalizes a candidate's resume and ATS analysis data into a canonical
   * ResumeRoadmapPrefillDTO for the AI Roadmap Builder.
   *
   * Enforces strict user authorization:
   * - Unauthenticated requests are rejected.
   * - Requesting a resume or ATS report owned by another user throws ForbiddenError (403).
   * - Private contact information (email, phone, address, raw text) is completely excluded.
   */
  public async getResumePrefill(
    userId: string,
    options?: ResumeRoadmapPrefillInput
  ): Promise<ResumeRoadmapPrefillDTO> {
    if (!userId || typeof userId !== 'string' || !userId.trim()) {
      throw new UnauthorizedError('Valid authenticated user identity is required');
    }

    const targetResumeId = options?.resumeId?.trim();
    const targetAtsMatchId = options?.atsMatchId?.trim();

    let resume: RawResumeRecord | null = null;
    let userProfile: RawUserProfileRecord | null = null;
    let atsMatch: RawAtsMatchRecord | null = null;

    // ── 1. Fetch Candidate Profile ──────────────────────────────
    try {
      const dbProfiles = await prisma.$queryRaw<Array<{
        id: string;
        userId: string;
        name: string;
        title: string | null;
        experienceYears: number | null;
        targetRoles: string[] | null;
      }>>`
        SELECT id, "userId", name, title, "experienceYears", "targetRoles"
        FROM user_profiles
        WHERE "userId" = ${userId}
        LIMIT 1
      `;
      if (dbProfiles && dbProfiles.length > 0) {
        const p = dbProfiles[0];
        userProfile = {
          id: p.id,
          userId: p.userId,
          name: p.name,
          title: p.title,
          experienceYears: p.experienceYears,
          targetRoles: p.targetRoles || [],
        };
      }
    } catch {
      // In-memory fallback
      if (inMemoryProfiles.has(userId)) {
        userProfile = inMemoryProfiles.get(userId)!;
      }
    }

    // ── 2. Fetch Resume Record ──────────────────────────────────
    if (targetResumeId) {
      // Specific resume requested: verify ownership
      try {
        const dbResumes = await prisma.$queryRaw<Array<{
          id: string;
          profileId: string;
          userId: string;
          fileName: string;
          skills: string[];
          uploadedAt: Date;
        }>>`
          SELECT r.id, r."profileId", p."userId", r."fileName", r.skills, r."uploadedAt"
          FROM resumes r
          JOIN user_profiles p ON r."profileId" = p.id
          WHERE r.id = ${targetResumeId}
          LIMIT 1
        `;

        if (dbResumes && dbResumes.length > 0) {
          const r = dbResumes[0];
          if (r.userId !== userId) {
            throw new ForbiddenError('You are not authorized to access this resume');
          }
          resume = {
            id: r.id,
            userId: r.userId,
            fileName: r.fileName,
            skills: r.skills || [],
            uploadedAt: r.uploadedAt,
          };
        } else {
          // Check in-memory store
          const memResume = inMemoryResumes.get(targetResumeId);
          if (memResume) {
            if (memResume.userId !== userId) {
              throw new ForbiddenError('You are not authorized to access this resume');
            }
            resume = memResume;
          } else {
            throw new NotFoundError(`Resume with ID "${targetResumeId}" was not found`);
          }
        }
      } catch (err) {
        if (err instanceof ForbiddenError || err instanceof NotFoundError) {
          throw err;
        }
        // Check in-memory fallback
        const memResume = inMemoryResumes.get(targetResumeId);
        if (memResume) {
          if (memResume.userId !== userId) {
            throw new ForbiddenError('You are not authorized to access this resume');
          }
          resume = memResume;
        } else {
          throw new NotFoundError(`Resume with ID "${targetResumeId}" was not found`);
        }
      }
    } else {
      // Fetch latest uploaded resume for this candidate
      try {
        const dbResumes = await prisma.$queryRaw<Array<{
          id: string;
          profileId: string;
          userId: string;
          fileName: string;
          skills: string[];
          uploadedAt: Date;
        }>>`
          SELECT r.id, r."profileId", p."userId", r."fileName", r.skills, r."uploadedAt"
          FROM resumes r
          JOIN user_profiles p ON r."profileId" = p.id
          WHERE p."userId" = ${userId}
          ORDER BY r."uploadedAt" DESC
          LIMIT 1
        `;
        if (dbResumes && dbResumes.length > 0) {
          const r = dbResumes[0];
          resume = {
            id: r.id,
            userId: r.userId,
            fileName: r.fileName,
            skills: r.skills || [],
            uploadedAt: r.uploadedAt,
          };
        }
      } catch {
        // In-memory fallback: latest resume for userId
        const userResumes = Array.from(inMemoryResumes.values())
          .filter((r) => r.userId === userId)
          .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
        if (userResumes.length > 0) {
          resume = userResumes[0];
        }
      }
    }

    // ── 3. Fetch ATS Match Analysis ─────────────────────────────
    if (targetAtsMatchId) {
      try {
        const dbMatches = await prisma.$queryRaw<Array<{
          id: string;
          userId: string;
          jobTitle: string;
          companyName: string | null;
          matchScore: number;
          summary: string;
          matchedSkills: string[];
          missingSkills: string[];
          experienceMatch: string | null;
          createdAt: Date;
        }>>`
          SELECT id, "userId", "jobTitle", "companyName", "matchScore", summary, "matchedSkills", "missingSkills", "experienceMatch", "createdAt"
          FROM ats_matches
          WHERE id = ${targetAtsMatchId}
          LIMIT 1
        `;
        if (dbMatches && dbMatches.length > 0) {
          const m = dbMatches[0];
          if (m.userId !== userId) {
            throw new ForbiddenError('You are not authorized to access this ATS analysis report');
          }
          atsMatch = {
            id: m.id,
            userId: m.userId,
            jobTitle: m.jobTitle,
            companyName: m.companyName,
            matchScore: m.matchScore,
            summary: m.summary,
            matchedSkills: m.matchedSkills || [],
            missingSkills: m.missingSkills || [],
            experienceMatch: m.experienceMatch,
            createdAt: m.createdAt,
          };
        } else {
          const memMatch = inMemoryAtsMatches.get(targetAtsMatchId);
          if (memMatch) {
            if (memMatch.userId !== userId) {
              throw new ForbiddenError('You are not authorized to access this ATS analysis report');
            }
            atsMatch = memMatch;
          } else {
            throw new NotFoundError(`ATS match with ID "${targetAtsMatchId}" was not found`);
          }
        }
      } catch (err) {
        if (err instanceof ForbiddenError || err instanceof NotFoundError) {
          throw err;
        }
        const memMatch = inMemoryAtsMatches.get(targetAtsMatchId);
        if (memMatch) {
          if (memMatch.userId !== userId) {
            throw new ForbiddenError('You are not authorized to access this ATS analysis report');
          }
          atsMatch = memMatch;
        }
      }
    } else {
      // Fetch latest ATS match if available to enrich gaps & role
      try {
        const dbMatches = await prisma.$queryRaw<Array<{
          id: string;
          userId: string;
          jobTitle: string;
          companyName: string | null;
          matchScore: number;
          summary: string;
          matchedSkills: string[];
          missingSkills: string[];
          experienceMatch: string | null;
          createdAt: Date;
        }>>`
          SELECT id, "userId", "jobTitle", "companyName", "matchScore", summary, "matchedSkills", "missingSkills", "experienceMatch", "createdAt"
          FROM ats_matches
          WHERE "userId" = ${userId}
          ORDER BY "createdAt" DESC
          LIMIT 1
        `;
        if (dbMatches && dbMatches.length > 0) {
          const m = dbMatches[0];
          atsMatch = {
            id: m.id,
            userId: m.userId,
            jobTitle: m.jobTitle,
            companyName: m.companyName,
            matchScore: m.matchScore,
            summary: m.summary,
            matchedSkills: m.matchedSkills || [],
            missingSkills: m.missingSkills || [],
            experienceMatch: m.experienceMatch,
            createdAt: m.createdAt,
          };
        }
      } catch {
        const userMatches = Array.from(inMemoryAtsMatches.values())
          .filter((m) => m.userId === userId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        if (userMatches.length > 0) {
          atsMatch = userMatches[0];
        }
      }
    }

    // ── 4. Synthesize Canonical Prefill DTO ──────────────────────
    const rawSkills = [
      ...(resume?.skills || []),
      ...(atsMatch?.matchedSkills || []),
    ];

    const normalizedKnownSkills = normalizeSkillList(rawSkills);

    // Only populate identifiedBlindspots if ATS analysis provided genuine missingSkills (never fabricate)
    const rawGaps = atsMatch?.missingSkills || [];
    const normalizedBlindspots = normalizeSkillList(rawGaps);

    // Target Role suggestion prioritization:
    // 1. ATS target job title (most specific job candidate is targeting)
    // 2. Profile targetRoles[0]
    // 3. Profile current title
    // 4. Default "Full Stack Software Engineer"
    const suggestedTargetRole =
      atsMatch?.jobTitle ||
      (userProfile?.targetRoles && userProfile.targetRoles.length > 0 ? userProfile.targetRoles[0] : null) ||
      userProfile?.title ||
      'Full Stack Software Engineer';

    // Experience Level suggestion:
    // 0-1 years: BEGINNER, 2-4 years: INTERMEDIATE, 5+ years: ADVANCED
    let suggestedLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'STAFF' = 'INTERMEDIATE';
    const years = userProfile?.experienceYears ?? null;
    if (years !== null) {
      if (years <= 1) suggestedLevel = 'BEGINNER';
      else if (years >= 8) suggestedLevel = 'STAFF';
      else if (years >= 5) suggestedLevel = 'ADVANCED';
      else suggestedLevel = 'INTERMEDIATE';
    }

    // Suggested Company Tier
    let suggestedCompanyTier: 'FAANG' | 'Unicorn' | 'Tier-1 FinTech' | 'High-Growth Startup' | 'Enterprise' = 'FAANG';
    if (atsMatch?.companyName) {
      const comp = atsMatch.companyName.toLowerCase();
      if (comp.includes('startup') || comp.includes('seed') || comp.includes('y combinator')) {
        suggestedCompanyTier = 'High-Growth Startup';
      } else if (comp.includes('bank') || comp.includes('citadel') || comp.includes('fintech') || comp.includes('stripe')) {
        suggestedCompanyTier = 'Tier-1 FinTech';
      } else if (comp.includes('uber') || comp.includes('airbnb') || comp.includes('bytedance') || comp.includes('unicorn')) {
        suggestedCompanyTier = 'Unicorn';
      } else if (comp.includes('ibm') || comp.includes('oracle') || comp.includes('sap') || comp.includes('cisco')) {
        suggestedCompanyTier = 'Enterprise';
      }
    }

    // Determine source provenance
    let source: 'RESUME_PROFILE' | 'ATS_ANALYSIS' | 'USER_PROFILE' | 'MANUAL' = 'MANUAL';
    if (atsMatch) {
      source = 'ATS_ANALYSIS';
    } else if (resume) {
      source = 'RESUME_PROFILE';
    } else if (userProfile && normalizedKnownSkills.length > 0) {
      source = 'USER_PROFILE';
    }

    const candidateName = userProfile?.name || 'Candidate';
    const extractedAt = resume?.uploadedAt
      ? new Date(resume.uploadedAt).toISOString()
      : atsMatch?.createdAt
      ? new Date(atsMatch.createdAt).toISOString()
      : new Date().toISOString();

    return {
      resumeId: resume?.id,
      fileName: resume?.fileName,
      candidateName,
      suggestedTargetRole,
      suggestedCompanyTier,
      suggestedLevel,
      knownSkills: normalizedKnownSkills,
      identifiedBlindspots: normalizedBlindspots,
      source,
      extractedAt,
      atsMatchId: atsMatch?.id,
      atsMatchScore: atsMatch?.matchScore,
      rawSkillCount: rawSkills.length,
      normalizedSkillCount: normalizedKnownSkills.length,
      experienceYears: years ?? undefined,
      summary: atsMatch?.summary,
    };
  }
}

export const resumeBridgeService = new ResumeBridgeService();
