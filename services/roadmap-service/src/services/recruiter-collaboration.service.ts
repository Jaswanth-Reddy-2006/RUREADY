// ═══════════════════════════════════════════════════════════════
// Recruiter Collaboration & Feedback Rubrics Service — Stage 11.2
// Multi-Recruiter Team Collaboration, Shared Rubrics & Audit Trail Engine
// ═══════════════════════════════════════════════════════════════

import { createHash } from 'node:crypto';
import { prisma } from '../lib/prisma.js';
import {
  SubmitCandidateFeedbackInputDTO,
  UpdateCandidateFeedbackInputDTO,
  CandidateCollaborativeFeedbackDTO,
  CandidateCollaborationThreadDTO,
  CandidateCollaborationActivityItemDTO,
  CandidateFeedbackQueryDTO,
  CandidateFeedbackRubricDTO,
  RubricRecommendation,
  RecruiterPipelineStatus,
} from '@ru-ready/shared';
import { recruiterShortlistService } from './recruiter-shortlist.service.js';
import { NotFoundError, ForbiddenError, UnauthorizedError, BadRequestError } from '../lib/errors.js';

export interface RecruiterCollaborationAuthContext {
  recruiterId: string;
  organizationId: string;
  recruiterName?: string;
  role?: string;
}

export interface InternalFeedbackRecord {
  id: string;
  candidateId: string;
  userRoadmapId?: string;
  organizationId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerRole?: string;
  rubric: CandidateFeedbackRubricDTO;
  comments?: string | null;
  stage: RecruiterPipelineStatus;
  isSharedWithTeam: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface InternalActivityRecord {
  id: string;
  candidateId: string;
  organizationId: string;
  actorId: string;
  actorName: string;
  activityType: 'STATUS_CHANGED' | 'FEEDBACK_SUBMITTED' | 'FEEDBACK_UPDATED' | 'CANDIDATE_SHORTLISTED';
  details: string;
  timestamp: Date;
}

// In-Memory Multi-Tenant Stores for Collaborative Feedback & Activity Logs
const FEEDBACK_STORE = new Map<string, InternalFeedbackRecord>();
const ACTIVITY_STORE: InternalActivityRecord[] = [];

export class RecruiterCollaborationService {
  /**
   * Resets in-memory collaboration storage (used for test isolation).
   */
  public clearStore(): void {
    FEEDBACK_STORE.clear();
    ACTIVITY_STORE.length = 0;
  }

  /**
   * Generates a deterministic unique ID for a feedback record.
   */
  private generateFeedbackId(organizationId: string, candidateId: string, reviewerId: string): string {
    const hash = createHash('sha256')
      .update(`${organizationId}:${candidateId}:${reviewerId}:${Date.now()}`)
      .digest('hex')
      .slice(0, 12);
    return `fb_${hash}`;
  }

  /**
   * Calculates the overall 0-100 score from 5-dimension 1-5 rubric scores.
   */
  public calculateOverallRubricScore(rubric: CandidateFeedbackRubricDTO): number {
    const sum =
      rubric.technicalSkillsScore +
      rubric.communicationScore +
      rubric.problemSolvingScore +
      rubric.roleFitScore +
      rubric.practicalEvidenceScore;

    // 5 dimensions max score 25 -> scale to 100
    return Math.round((sum / 25) * 100);
  }

  /**
   * Submits structured candidate feedback with evaluation rubric.
   */
  public async submitFeedback(
    authContext: RecruiterCollaborationAuthContext,
    input: SubmitCandidateFeedbackInputDTO
  ): Promise<CandidateCollaborativeFeedbackDTO> {
    const recruiterId = authContext.recruiterId?.trim();
    const organizationId = authContext.organizationId?.trim();
    const reviewerName = authContext.recruiterName?.trim() || 'Recruiter Reviewer';
    const reviewerRole = authContext.role?.trim() || 'RECRUITER';

    if (!recruiterId || !organizationId) {
      throw new UnauthorizedError('Authenticated recruiter and organization required');
    }

    const candidateId = input.candidateId.trim();

    // Verify candidate exists and is public
    const candidateRoadmap = await prisma.userRoadmap.findFirst({
      where: {
        userId: candidateId,
        sourceRoadmap: { visibility: 'PUBLIC' },
      },
    });

    if (!candidateRoadmap) {
      throw new NotFoundError('Candidate public roadmap not found');
    }

    const overallScore = input.rubric.overallScore ?? this.calculateOverallRubricScore(input.rubric);
    const calibratedRubric: CandidateFeedbackRubricDTO = {
      ...input.rubric,
      overallScore,
      strengths: input.rubric.strengths || [],
      areasForGrowth: input.rubric.areasForGrowth || [],
    };

    const feedbackId = this.generateFeedbackId(organizationId, candidateId, recruiterId);
    const targetStage: RecruiterPipelineStatus = input.stage || 'REVIEWING';
    const isSharedWithTeam = input.isSharedWithTeam !== false;

    const record: InternalFeedbackRecord = {
      id: feedbackId,
      candidateId,
      userRoadmapId: input.userRoadmapId || candidateRoadmap.id,
      organizationId,
      reviewerId: recruiterId,
      reviewerName,
      reviewerRole,
      rubric: calibratedRubric,
      comments: input.comments?.trim() || null,
      stage: targetStage,
      isSharedWithTeam,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    FEEDBACK_STORE.set(feedbackId, record);

    // Record auditable activity
    ACTIVITY_STORE.push({
      id: `act_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      candidateId,
      organizationId,
      actorId: recruiterId,
      actorName: reviewerName,
      activityType: 'FEEDBACK_SUBMITTED',
      details: `${reviewerName} submitted ${calibratedRubric.recommendation} evaluation (${overallScore}/100) at ${targetStage} stage`,
      timestamp: new Date(),
    });

    return this.mapToDTO(record);
  }

  /**
   * Updates existing feedback submitted by the same reviewer.
   */
  public async updateFeedback(
    authContext: RecruiterCollaborationAuthContext,
    feedbackId: string,
    input: UpdateCandidateFeedbackInputDTO
  ): Promise<CandidateCollaborativeFeedbackDTO> {
    const recruiterId = authContext.recruiterId?.trim();
    const organizationId = authContext.organizationId?.trim();

    if (!recruiterId || !organizationId) {
      throw new UnauthorizedError('Authenticated recruiter and organization required');
    }

    const existing = FEEDBACK_STORE.get(feedbackId);
    if (!existing) {
      throw new NotFoundError('Feedback record not found');
    }

    if (existing.organizationId !== organizationId) {
      throw new NotFoundError('Feedback record not found in this organization');
    }

    if (existing.reviewerId !== recruiterId) {
      throw new ForbiddenError('You are not authorized to modify another reviewer feedback');
    }

    if (input.rubric) {
      const merged: CandidateFeedbackRubricDTO = {
        ...existing.rubric,
        ...input.rubric,
      };
      merged.overallScore = this.calculateOverallRubricScore(merged);
      existing.rubric = merged;
    }

    if (input.comments !== undefined) {
      existing.comments = input.comments?.trim() || null;
    }

    if (input.stage) {
      existing.stage = input.stage;
    }

    if (input.isSharedWithTeam !== undefined) {
      existing.isSharedWithTeam = input.isSharedWithTeam;
    }

    existing.updatedAt = new Date();
    FEEDBACK_STORE.set(feedbackId, existing);

    // Record activity
    ACTIVITY_STORE.push({
      id: `act_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      candidateId: existing.candidateId,
      organizationId,
      actorId: recruiterId,
      actorName: existing.reviewerName,
      activityType: 'FEEDBACK_UPDATED',
      details: `${existing.reviewerName} updated candidate rubric evaluation`,
      timestamp: new Date(),
    });

    return this.mapToDTO(existing);
  }

  /**
   * Retrieves the comprehensive candidate collaboration thread and team feedback for an organization.
   */
  public async getCandidateCollaborationThread(
    authContext: RecruiterCollaborationAuthContext,
    candidateId: string
  ): Promise<CandidateCollaborationThreadDTO> {
    const organizationId = authContext.organizationId?.trim();
    const recruiterId = authContext.recruiterId?.trim();

    if (!organizationId) {
      throw new UnauthorizedError('Authenticated organization context required');
    }

    // Filter feedback belonging to this organization and candidate
    const orgFeedback = Array.from(FEEDBACK_STORE.values()).filter(
      (f) =>
        f.organizationId === organizationId &&
        f.candidateId === candidateId &&
        (f.isSharedWithTeam || f.reviewerId === recruiterId)
    );

    // Filter activity belonging to this organization and candidate
    const orgActivity = ACTIVITY_STORE.filter(
      (a) => a.organizationId === organizationId && a.candidateId === candidateId
    ).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    const totalReviews = orgFeedback.length;
    const recommendationBreakdown: Record<RubricRecommendation, number> = {
      STRONG_HIRE: 0,
      HIRE: 0,
      LEANING_HIRE: 0,
      LEANING_NO_HIRE: 0,
      NO_HIRE: 0,
    };

    let totalScoreSum = 0;
    for (const f of orgFeedback) {
      if (recommendationBreakdown[f.rubric.recommendation] !== undefined) {
        recommendationBreakdown[f.rubric.recommendation]++;
      }
      totalScoreSum += f.rubric.overallScore ?? 0;
    }

    const averageRubricScore = totalReviews > 0 ? Math.round(totalScoreSum / totalReviews) : 0;

    // Query candidate pipeline status if in recruiter shortlist
    let currentPipelineStatus: RecruiterPipelineStatus = 'SHORTLISTED';
    if (recruiterId) {
      try {
        const shortlistResult = await recruiterShortlistService.getShortlist(recruiterId, {
          search: candidateId,
        });
        const matched = shortlistResult.entries.find((c) => c.candidateId === candidateId);
        if (matched) {
          currentPipelineStatus = matched.status;
        }
      } catch {
        // Fallback default
      }
    }

    return {
      candidateId,
      userRoadmapId: orgFeedback[0]?.userRoadmapId,
      organizationId,
      pipelineStatus: currentPipelineStatus,
      totalReviews,
      averageRubricScore,
      recommendationBreakdown,
      feedbackList: orgFeedback.map((f) => this.mapToDTO(f)),
      activityLog: orgActivity.map((a) => ({
        id: a.id,
        candidateId: a.candidateId,
        organizationId: a.organizationId,
        actorId: a.actorId,
        actorName: a.actorName,
        activityType: a.activityType,
        details: a.details,
        timestamp: a.timestamp.toISOString(),
      })),
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Lists all feedback submitted across the organization with filtering and pagination.
   */
  public async listOrganizationFeedback(
    authContext: RecruiterCollaborationAuthContext,
    query: CandidateFeedbackQueryDTO = {}
  ): Promise<{ feedback: CandidateCollaborativeFeedbackDTO[]; total: number }> {
    const organizationId = authContext.organizationId?.trim();
    const recruiterId = authContext.recruiterId?.trim();

    if (!organizationId) {
      throw new UnauthorizedError('Authenticated organization context required');
    }

    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, Math.min(100, query.limit || 20));

    let records = Array.from(FEEDBACK_STORE.values()).filter(
      (f) =>
        f.organizationId === organizationId &&
        (f.isSharedWithTeam || f.reviewerId === recruiterId)
    );

    if (query.candidateId) {
      records = records.filter((r) => r.candidateId === query.candidateId);
    }

    if (query.stage && query.stage !== 'ALL') {
      records = records.filter((r) => r.stage === query.stage);
    }

    if (query.reviewerId) {
      records = records.filter((r) => r.reviewerId === query.reviewerId);
    }

    records.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

    const total = records.length;
    const paginated = records.slice((page - 1) * limit, page * limit);

    return {
      feedback: paginated.map((r) => this.mapToDTO(r)),
      total,
    };
  }

  /**
   * Helper to map internal record to canonical DTO.
   */
  private mapToDTO(record: InternalFeedbackRecord): CandidateCollaborativeFeedbackDTO {
    return {
      id: record.id,
      candidateId: record.candidateId,
      userRoadmapId: record.userRoadmapId,
      organizationId: record.organizationId,
      reviewerId: record.reviewerId,
      reviewerName: record.reviewerName,
      reviewerRole: record.reviewerRole,
      rubric: record.rubric,
      comments: record.comments,
      stage: record.stage,
      isSharedWithTeam: record.isSharedWithTeam,
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
    };
  }
}

export const recruiterCollaborationService = new RecruiterCollaborationService();
