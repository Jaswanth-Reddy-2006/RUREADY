// ═══════════════════════════════════════════════════════════════
// Verified Career Readiness Profile Service — Stage 5.7 & 7.3
// Server-Authoritative, Shareable & Exportable Roadmap Credential
// ═══════════════════════════════════════════════════════════════

import { createHash } from 'node:crypto';
import { prisma } from '../lib/prisma.js';
import {
  VerifiedCareerProfileDTO,
  PublicVerifiedProfileDTO,
  AssessmentPerformanceSummaryDTO,
  PracticalPerformanceSummaryDTO,
  PublicSprintArchiveDTO,
  PublicEvidenceItemDTO,
  PublicAssessmentItemDTO,
  PublicTimelineItemDTO,
  RoadmapProfileSummaryDTO,
  deriveRoadmapLearningHistory,
  deriveRoadmapProfileSummary,
} from '@ru-ready/shared';
import { skillReadinessService } from './skill-readiness.service.js';
import { NotFoundError, ForbiddenError, BadRequestError } from '../lib/errors.js';

export class VerifiedProfileService {
  /**
   * Deterministically generates a verification identifier for a user roadmap and readiness state.
   */
  public generateVerificationId(
    userRoadmapId: string,
    userId: string,
    overallReadiness: number,
    masteredCount: number
  ): string {
    const hash = createHash('sha256')
      .update(`${userRoadmapId}:${userId}:${overallReadiness}:${masteredCount}`)
      .digest('hex')
      .slice(0, 16)
      .toUpperCase();

    return `VRF-${userRoadmapId}-${hash}`;
  }

  /**
   * Generates a complete, server-authoritative verified career readiness profile
   * for an authenticated learner enrolled in a UserRoadmap.
   */
  public async getVerifiedProfile(
    userId: string,
    userRoadmapId: string,
    baseUrl = 'https://ruready.dev'
  ): Promise<VerifiedCareerProfileDTO> {
    const userRoadmap = await prisma.userRoadmap.findUnique({
      where: { id: userRoadmapId },
      include: {
        sourceRoadmap: { include: { goal: true } },
        sprints: {
          include: {
            tasks: {
              orderBy: { orderIndex: 'asc' },
              include: {
                roadmapNode: {
                  include: {
                    skills: {
                      include: { skill: true },
                    },
                  },
                },
              },
            },
            performance: true,
          },
          orderBy: { sprintNumber: 'asc' },
        },
        adaptations: { orderBy: { createdAt: 'desc' } },
        skillEvidence: {
          include: { skill: true },
          orderBy: { assessedAt: 'desc' },
        },
        assessmentAttempts: {
          include: { assessment: true, skill: true },
          orderBy: { completedAt: 'desc' },
        },
      },
    });

    if (!userRoadmap) {
      throw new NotFoundError('User roadmap not found');
    }

    if (userRoadmap.userId !== userId) {
      throw new ForbiddenError('You are not authorized to view the verified profile for this roadmap');
    }

    // 1. Authoritative readiness & calibrated skills
    const readiness = await skillReadinessService.calculateRoadmapReadiness(userId, userRoadmapId);

    // 2. Derive skill classification lists
    const masteredSkills = readiness.skills
      .filter((s) => s.status === 'MASTERED')
      .map((s) => s.skillName);

    const demonstratedSkills = readiness.skills
      .filter((s) => s.status === 'DEMONSTRATED')
      .map((s) => s.skillName);

    const skillsInProgress = readiness.skills
      .filter((s) => s.status === 'IN_PROGRESS')
      .map((s) => s.skillName);

    const missingPrerequisitesSet = new Set<string>();
    for (const skill of readiness.skills) {
      for (const prereq of (skill.missingPrerequisites || [])) {
        missingPrerequisitesSet.add(prereq);
      }
    }
    const missingPrerequisites = Array.from(missingPrerequisitesSet);

    // 3. Fetch authoritative micro-assessment attempts for verification summary & proof
    const assessmentAttempts = await prisma.microAssessmentAttempt.findMany({
      where: { userId },
      include: {
        assessment: true,
        skill: true,
      },
      orderBy: { completedAt: 'desc' },
    });

    // 4. Derive canonical learning history & proof of work (Stage 7.1)
    const learningHistory = deriveRoadmapLearningHistory({
      ...userRoadmap,
      assessmentAttempts:
        (userRoadmap as any).assessmentAttempts ||
        (userRoadmap as any).microAssessmentAttempts ||
        assessmentAttempts,
    });

    // 5. Map public-safe verified proof collections (Stage 7.3)
    const publicSprintArchives: PublicSprintArchiveDTO[] = learningHistory.sprintArchives.map((s) => ({
      sprintNumber: s.sprintNumber,
      objective: s.objective,
      status: s.status,
      completedAt: s.completedAt,
      totalTasks: s.totalTasks,
      completedTasks: s.completedTasks,
      completionPercentage: s.completionPercentage,
      skillsAddressed: s.skillsAddressed,
      decision: s.decision,
    }));

    const publicEvidence: PublicEvidenceItemDTO[] = learningHistory.evidence.map((e) => {
      const extUrl =
        (e.metadata && typeof e.metadata === 'object' && (e.metadata as any).externalUrl) ||
        e.externalReference ||
        null;
      return {
        id: e.id,
        skillName: e.skillName,
        skillCategory: e.skillCategory,
        source: e.source,
        verificationSource: e.source === 'SELF_REPORTED' ? 'LEARNER_PROVIDED' : 'PLATFORM_VERIFIED',
        demonstratedScore: e.demonstratedScore,
        confidence: e.confidence,
        externalReference: e.externalReference || extUrl,
        externalUrl: extUrl,
        assessedAt: e.assessedAt,
        isPractical:
          e.source === 'PROJECT' ||
          Boolean(e.metadata && typeof e.metadata === 'object' && (e.metadata as any).practicalDrill),
      };
    });

    const publicAssessments: PublicAssessmentItemDTO[] = learningHistory.assessments.map((a) => ({
      id: a.id,
      title: a.title || 'Micro-Assessment',
      skillName: a.skillName,
      score: a.score,
      passed: a.passed,
      totalQuestions: a.totalQuestions,
      correctAnswers: a.correctAnswers,
      completedAt: a.completedAt,
    }));

    const publicTimeline: PublicTimelineItemDTO[] = learningHistory.timeline
      .filter((t) => t.type !== 'ROADMAP_ADAPTATION')
      .map((t) => ({
        id: t.id,
        type: t.type as any,
        title: t.title,
        date: t.date,
        verificationSource: t.source === 'SELF_REPORTED' ? 'LEARNER_PROVIDED' : 'PLATFORM_VERIFIED',
        skillName: t.skillName,
        score: t.score,
        externalReference:
          t.metadata && typeof (t.metadata as any).notes === 'string' ? (t.metadata as any).notes : null,
      }));

    // 6. Server-derived Sprint telemetry counts
    const totalSprintCount = learningHistory.totalSprintsCount;
    const completedSprintCount = learningHistory.completedSprintsCount;
    const verifiedEvidenceCount = learningHistory.totalEvidenceCount;

    // 7. Server-derived Assessment summary
    const totalAttempts = assessmentAttempts.length;
    const passedAttempts = assessmentAttempts.filter((a) => a.passed || a.score >= 70).length;
    const assessmentAverageScore =
      totalAttempts > 0
        ? Math.round(assessmentAttempts.reduce((sum, a) => sum + a.score, 0) / totalAttempts)
        : null;

    const assessmentSummary: AssessmentPerformanceSummaryDTO = {
      totalAttempts,
      passedAttempts,
      averageScore: assessmentAverageScore,
    };

    // 7. Server-derived Practical / Coding summary
    const practicals = userRoadmap.skillEvidence.filter(
      (e) =>
        e.source === 'PROJECT' ||
        (e.metadata && typeof e.metadata === 'object' && (e.metadata as any).practicalDrill)
    );
    const totalDrills = practicals.length;
    const passedDrills = practicals.filter((p) => (p.demonstratedScore ?? 0) >= 70).length;
    const practicalAverageScore =
      totalDrills > 0
        ? Math.round(
            practicals.reduce((sum: number, p) => sum + (p.demonstratedScore ?? 100), 0) / totalDrills
          )
        : null;

    const practicalSummary: PracticalPerformanceSummaryDTO = {
      totalDrills,
      passedDrills,
      averageScore: practicalAverageScore,
    };

    // 8. Stable Verification ID
    const verificationId = this.generateVerificationId(
      userRoadmap.id,
      userRoadmap.userId,
      readiness.overallReadiness,
      readiness.masteredSkillsCount
    );

    const personalization =
      typeof userRoadmap.personalization === 'string'
        ? (() => {
            try {
              return JSON.parse(userRoadmap.personalization);
            } catch {
              return {};
            }
          })()
        : (userRoadmap.personalization as any) || {};
    const candidateName = personalization.candidateName || 'Verified Candidate';

    return {
      verificationId,
      userRoadmapId: userRoadmap.id,
      roadmapId: userRoadmap.sourceRoadmapId,
      candidateName,
      targetRole: readiness.targetRole,
      targetCompanyTier: readiness.targetCompanyTier,
      overallReadiness: readiness.overallReadiness,
      baselineReadiness: readiness.baselineReadiness,
      masteredSkillsCount: readiness.masteredSkillsCount,
      totalRequiredSkills: readiness.totalRequiredSkills,
      inProgressSkillsCount: readiness.inProgressSkillsCount,
      skillsWithMissingPrerequisitesCount: readiness.skillsWithMissingPrerequisitesCount,
      masteredSkills,
      demonstratedSkills,
      skillsInProgress,
      missingPrerequisites,
      completedSprintCount,
      totalSprintCount,
      verifiedEvidenceCount,
      assessmentSummary,
      practicalSummary,
      sprintArchives: publicSprintArchives,
      evidence: publicEvidence,
      assessments: publicAssessments,
      timeline: publicTimeline,
      skills: readiness.skills,
      domains: readiness.domains,
      estimatedWeeksRemaining: readiness.estimatedWeeksRemaining,
      issuedAt: new Date().toISOString(),
      verificationUrl: `${baseUrl}/verify/${verificationId}`,
    };
  }

  /**
   * Public verification lookup that verifies whether a given verificationId is authentic.
   * Does not require authentication and never leaks sensitive answers or internal identifiers.
   */
  public async verifyPublicProfile(
    verificationId: string
  ): Promise<PublicVerifiedProfileDTO> {
    if (!verificationId || typeof verificationId !== 'string') {
      throw new BadRequestError('Invalid verification identifier format');
    }

    // Pattern: VRF-<userRoadmapId>-<16-char-hash>
    const match = verificationId.match(/^VRF-(.+)-([A-F0-9]{16})$/);
    if (!match) {
      return {
        verificationId,
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
      };
    }

    const [, userRoadmapId] = match;

    const userRoadmap = await prisma.userRoadmap.findUnique({
      where: { id: userRoadmapId },
      include: {
        sourceRoadmap: true,
        sprints: true,
        skillEvidence: true,
      },
    });

    if (!userRoadmap) {
      return {
        verificationId,
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
      };
    }

    const profile = await this.getVerifiedProfile(userRoadmap.userId, userRoadmap.id);
    const expectedVerificationId = profile.verificationId;

    if (expectedVerificationId !== verificationId) {
      return {
        verificationId,
        targetRole: profile.targetRole,
        targetCompanyTier: profile.targetCompanyTier,
        overallReadiness: profile.overallReadiness,
        masteredSkills: profile.masteredSkills,
        demonstratedSkills: profile.demonstratedSkills,
        completedSprintCount: profile.completedSprintCount,
        verifiedEvidenceCount: profile.verifiedEvidenceCount,
        assessmentSummary: profile.assessmentSummary,
        practicalSummary: profile.practicalSummary,
        sprintArchives: [],
        evidence: [],
        assessments: [],
        timeline: [],
        issuedAt: profile.issuedAt,
        isValid: false,
      };
    }

    return {
      verificationId: profile.verificationId,
      candidateName: profile.candidateName,
      targetRole: profile.targetRole,
      targetCompanyTier: profile.targetCompanyTier,
      overallReadiness: profile.overallReadiness,
      masteredSkills: profile.masteredSkills,
      demonstratedSkills: profile.demonstratedSkills,
      completedSprintCount: profile.completedSprintCount,
      verifiedEvidenceCount: profile.verifiedEvidenceCount,
      assessmentSummary: profile.assessmentSummary,
      practicalSummary: profile.practicalSummary,
      sprintArchives: profile.sprintArchives || [],
      evidence: profile.evidence || [],
      assessments: profile.assessments || [],
      timeline: profile.timeline || [],
      issuedAt: profile.issuedAt,
      isValid: true,
    };
  }

  /**
   * Generates a concise verified career profile summary for the learner's profile page (Stage 7.4).
   */
  public async getProfileSummary(
    userId: string,
    userRoadmapId?: string,
    baseUrl = 'https://ruready.dev'
  ): Promise<RoadmapProfileSummaryDTO | null> {
    let targetRoadmapId = userRoadmapId;

    if (!targetRoadmapId) {
      // Find the user's primary/most recent UserRoadmap
      const latest = await prisma.userRoadmap.findFirst({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
        select: { id: true },
      });
      if (!latest) {
        return null;
      }
      targetRoadmapId = latest.id;
    }

    const userRoadmap = await prisma.userRoadmap.findUnique({
      where: { id: targetRoadmapId },
      include: {
        sourceRoadmap: { include: { goal: true } },
        sprints: {
          include: {
            tasks: {
              orderBy: { orderIndex: 'asc' },
              include: {
                roadmapNode: {
                  include: {
                    skills: {
                      include: { skill: true },
                    },
                  },
                },
              },
            },
            performance: true,
          },
          orderBy: { sprintNumber: 'asc' },
        },
        adaptations: { orderBy: { createdAt: 'desc' } },
        skillEvidence: {
          include: { skill: true },
          orderBy: { assessedAt: 'desc' },
        },
      },
    });

    if (!userRoadmap) {
      return null;
    }

    if (userRoadmap.userId !== userId) {
      throw new ForbiddenError('You are not authorized to view this roadmap profile summary');
    }

    const assessmentAttempts = await prisma.microAssessmentAttempt.findMany({
      where: { userId },
      include: {
        assessment: true,
        skill: true,
      },
      orderBy: { completedAt: 'desc' },
    });

    const readiness = await skillReadinessService.calculateRoadmapReadiness(userId, targetRoadmapId);

    const fullRoadmapData = {
      ...userRoadmap,
      overallReadiness: readiness.overallReadiness,
      assessmentAttempts,
      verificationId: this.generateVerificationId(
        userRoadmap.id,
        userRoadmap.userId,
        readiness.overallReadiness,
        readiness.masteredSkillsCount
      ),
    };

    return deriveRoadmapProfileSummary(fullRoadmapData, baseUrl);
  }
}

export const verifiedProfileService = new VerifiedProfileService();
