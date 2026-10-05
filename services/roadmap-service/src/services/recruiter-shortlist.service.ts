// ═══════════════════════════════════════════════════════════════
// Recruiter Shortlist & Talent Pipeline Service — Stage 10.3
// Multi-Tenant, Private Recruiter Shortlist & Workflow State Machine
// ═══════════════════════════════════════════════════════════════

import { createHash } from 'node:crypto';
import { prisma } from '../lib/prisma.js';
import {
  AddToShortlistInputDTO,
  UpdateShortlistStatusInputDTO,
  RecruiterShortlistQueryDTO,
  RecruiterShortlistEntryDTO,
  RecruiterShortlistResponseDTO,
  RecruiterPipelineStatus,
  deriveRoadmapProfileSummary,
} from '@ru-ready/shared';
import { NotFoundError, ForbiddenError, BadRequestError, UnauthorizedError } from '../lib/errors.js';

// Internal In-Memory Structured Store for Recruiter Shortlist Records (Multi-Tenant, keyed by entryId)
export interface InternalShortlistRecord {
  id: string;
  recruiterId: string;
  candidateId: string;
  userRoadmapId?: string;
  status: RecruiterPipelineStatus;
  notes?: string | null;
  matchContext?: {
    jobTitle?: string;
    matchScore?: number;
    matchedSkills?: string[];
    missingSkills?: string[];
    matchedAt?: string;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}

const SHORTLIST_STORE = new Map<string, InternalShortlistRecord>();

// Allowed state machine transitions
const VALID_TRANSITIONS: Record<RecruiterPipelineStatus, RecruiterPipelineStatus[]> = {
  SHORTLISTED: ['REVIEWING', 'REJECTED', 'SHORTLISTED'],
  REVIEWING: ['INTERVIEW', 'SHORTLISTED', 'REJECTED', 'REVIEWING'],
  INTERVIEW: ['SELECTED', 'REVIEWING', 'REJECTED', 'INTERVIEW'],
  SELECTED: ['REJECTED', 'INTERVIEW', 'SELECTED'],
  REJECTED: ['SHORTLISTED', 'REVIEWING', 'REJECTED'],
};

export class RecruiterShortlistService {
  /**
   * Resets in-memory shortlist storage (used for test isolation).
   */
  public clearStore(): void {
    SHORTLIST_STORE.clear();
  }

  /**
   * Generates a deterministic unique ID for a shortlist entry.
   */
  private generateEntryId(recruiterId: string, candidateId: string): string {
    const hash = createHash('sha256')
      .update(`${recruiterId}:${candidateId}`)
      .digest('hex')
      .slice(0, 12);
    return `shl_${hash}`;
  }

  /**
   * Adds a candidate to the recruiter's shortlist or updates an existing entry idempotently.
   */
  public async addToShortlist(
    recruiterId: string,
    input: AddToShortlistInputDTO,
    baseUrl = 'https://ruready.dev'
  ): Promise<RecruiterShortlistEntryDTO> {
    if (!recruiterId || typeof recruiterId !== 'string' || !recruiterId.trim()) {
      throw new UnauthorizedError('Authenticated recruiter identity required');
    }

    const candidateId = input.candidateId.trim();
    const entryId = this.generateEntryId(recruiterId, candidateId);
    const existing = SHORTLIST_STORE.get(entryId);

    const targetStatus: RecruiterPipelineStatus = input.status || 'SHORTLISTED';

    if (existing) {
      // Idempotent update: update notes, status, and match context if provided
      existing.status = targetStatus;
      if (input.notes !== undefined) existing.notes = input.notes.trim() || null;
      if (input.matchContext) {
        existing.matchContext = {
          ...input.matchContext,
          matchedAt: input.matchContext.matchedAt || new Date().toISOString(),
        };
      }
      existing.updatedAt = new Date();
      SHORTLIST_STORE.set(entryId, existing);
      return this.enrichShortlistEntry(existing, baseUrl);
    }

    const newRecord: InternalShortlistRecord = {
      id: entryId,
      recruiterId,
      candidateId,
      userRoadmapId: input.userRoadmapId?.trim(),
      status: targetStatus,
      notes: input.notes?.trim() || null,
      matchContext: input.matchContext
        ? {
            ...input.matchContext,
            matchedAt: input.matchContext.matchedAt || new Date().toISOString(),
          }
        : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    SHORTLIST_STORE.set(entryId, newRecord);
    return this.enrichShortlistEntry(newRecord, baseUrl);
  }

  /**
   * Retrieves recruiter's shortlisted candidates with filtering, sorting, and pagination.
   */
  public async getShortlist(
    recruiterId: string,
    query: RecruiterShortlistQueryDTO,
    baseUrl = 'https://ruready.dev'
  ): Promise<RecruiterShortlistResponseDTO> {
    if (!recruiterId || typeof recruiterId !== 'string' || !recruiterId.trim()) {
      throw new UnauthorizedError('Authenticated recruiter identity required');
    }

    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, Math.min(100, query.limit || 10));
    const statusFilter = query.status || 'ALL';
    const roleFilter = query.targetRole ? query.targetRole.trim().toLowerCase() : null;
    const searchFilter = query.search ? query.search.trim().toLowerCase() : null;
    const sortBy = query.sortBy || 'updatedAt';
    const sortOrder = query.sortOrder || 'desc';

    // 1. Fetch only records owned by this recruiter
    const recruiterRecords = Array.from(SHORTLIST_STORE.values()).filter(
      (r) => r.recruiterId === recruiterId
    );

    // Compute status counts
    const statusCounts: Record<RecruiterPipelineStatus, number> = {
      SHORTLISTED: 0,
      REVIEWING: 0,
      INTERVIEW: 0,
      SELECTED: 0,
      REJECTED: 0,
    };
    for (const r of recruiterRecords) {
      if (statusCounts[r.status] !== undefined) {
        statusCounts[r.status]++;
      }
    }

    // 2. Enrich entries with verified candidate metrics
    const enrichedEntries: RecruiterShortlistEntryDTO[] = [];
    for (const record of recruiterRecords) {
      const enriched = await this.enrichShortlistEntry(record, baseUrl);
      enrichedEntries.push(enriched);
    }

    // 3. Filter entries
    const filtered = enrichedEntries.filter((entry) => {
      if (statusFilter !== 'ALL' && entry.status !== statusFilter) {
        return false;
      }
      if (roleFilter && !entry.targetRole.toLowerCase().includes(roleFilter)) {
        return false;
      }
      if (searchFilter) {
        const nameMatch = entry.candidateName.toLowerCase().includes(searchFilter);
        const roleMatch = entry.targetRole.toLowerCase().includes(searchFilter);
        const notesMatch = entry.notes ? entry.notes.toLowerCase().includes(searchFilter) : false;
        const skillMatch = entry.demonstratedSkills.some((s) => s.toLowerCase().includes(searchFilter));
        if (!nameMatch && !roleMatch && !notesMatch && !skillMatch) {
          return false;
        }
      }
      return true;
    });

    // 4. Deterministic Sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'updatedAt') {
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      } else if (sortBy === 'readiness') {
        comparison = a.overallReadiness - b.overallReadiness;
      } else if (sortBy === 'candidateName') {
        comparison = a.candidateName.localeCompare(b.candidateName);
      } else if (sortBy === 'status') {
        comparison = a.status.localeCompare(b.status);
      }

      if (comparison !== 0) {
        return sortOrder === 'desc' ? -comparison : comparison;
      }

      return a.id.localeCompare(b.id);
    });

    // 5. Pagination
    const total = filtered.length;
    const totalPages = total > 0 ? Math.ceil(total / limit) : 1;
    const startIndex = (page - 1) * limit;
    const paged = filtered.slice(startIndex, startIndex + limit);

    return {
      entries: paged,
      total,
      page,
      limit,
      totalPages,
      statusCounts,
      filtersApplied: {
        status: statusFilter !== 'ALL' ? statusFilter : null,
        targetRole: query.targetRole || null,
        search: query.search || null,
        sortBy,
        sortOrder,
      },
    };
  }

  /**
   * Retrieves a single shortlist item by ID verifying recruiter ownership.
   */
  public async getShortlistEntryById(
    recruiterId: string,
    entryId: string,
    baseUrl = 'https://ruready.dev'
  ): Promise<RecruiterShortlistEntryDTO> {
    if (!recruiterId) throw new UnauthorizedError();
    const record = SHORTLIST_STORE.get(entryId);
    if (!record) {
      throw new NotFoundError('Shortlist entry not found');
    }
    if (record.recruiterId !== recruiterId) {
      throw new ForbiddenError('You do not have permission to view this shortlist record');
    }
    return this.enrichShortlistEntry(record, baseUrl);
  }

  /**
   * Updates pipeline status and/or notes with state machine validation.
   */
  public async updateShortlistEntry(
    recruiterId: string,
    entryId: string,
    input: UpdateShortlistStatusInputDTO,
    baseUrl = 'https://ruready.dev'
  ): Promise<RecruiterShortlistEntryDTO> {
    if (!recruiterId) throw new UnauthorizedError();
    const record = SHORTLIST_STORE.get(entryId);
    if (!record) {
      throw new NotFoundError('Shortlist entry not found');
    }
    if (record.recruiterId !== recruiterId) {
      throw new ForbiddenError('You do not have permission to modify this shortlist record');
    }

    if (input.status) {
      const allowed = VALID_TRANSITIONS[record.status] || [];
      if (!allowed.includes(input.status)) {
        throw new BadRequestError(
          `Invalid pipeline transition from ${record.status} to ${input.status}. Allowed transitions: ${allowed.join(', ')}`
        );
      }
      record.status = input.status;
    }

    if (input.notes !== undefined) {
      record.notes = input.notes.trim() || null;
    }

    record.updatedAt = new Date();
    SHORTLIST_STORE.set(entryId, record);

    return this.enrichShortlistEntry(record, baseUrl);
  }

  /**
   * Removes a candidate entry from the recruiter's shortlist.
   */
  public async removeFromShortlist(recruiterId: string, entryId: string): Promise<{ success: boolean; id: string }> {
    if (!recruiterId) throw new UnauthorizedError();
    const record = SHORTLIST_STORE.get(entryId);
    if (!record) {
      throw new NotFoundError('Shortlist entry not found');
    }
    if (record.recruiterId !== recruiterId) {
      throw new ForbiddenError('You do not have permission to delete this shortlist record');
    }

    SHORTLIST_STORE.delete(entryId);
    return { success: true, id: entryId };
  }

  /**
   * Enriches an internal record with public candidate profile metrics.
   */
  private async enrichShortlistEntry(
    record: InternalShortlistRecord,
    baseUrl: string
  ): Promise<RecruiterShortlistEntryDTO> {
    // Attempt database lookup of candidate's public UserRoadmap
    let userRoadmap = null;
    if (record.userRoadmapId) {
      userRoadmap = await prisma.userRoadmap.findUnique({
        where: { id: record.userRoadmapId },
        include: {
          sourceRoadmap: { include: { goal: true } },
          sprints: { include: { performance: true } },
          skillEvidence: { include: { skill: true } },
          assessmentAttempts: { include: { assessment: true, skill: true } },
        },
      });
    }

    if (!userRoadmap) {
      userRoadmap = await prisma.userRoadmap.findFirst({
        where: {
          userId: record.candidateId,
          sourceRoadmap: { visibility: 'PUBLIC' },
        },
        include: {
          sourceRoadmap: { include: { goal: true } },
          sprints: { include: { performance: true } },
          skillEvidence: { include: { skill: true } },
          assessmentAttempts: { include: { assessment: true, skill: true } },
        },
        orderBy: { updatedAt: 'desc' },
      });
    }

    if (userRoadmap) {
      const summary = deriveRoadmapProfileSummary(userRoadmap, baseUrl);
      const evidenceSources = Array.from(
        new Set((userRoadmap.skillEvidence || []).map((e) => e.source).filter(Boolean))
      );

      const masteredSkills = summary.verifiedSkills
        .filter((s) => s.status === 'MASTERED')
        .map((s) => s.name);

      const demonstratedSkills = summary.verifiedSkills
        .filter((s) => s.status === 'DEMONSTRATED' || s.status === 'MASTERED')
        .map((s) => s.name);

      return {
        id: record.id,
        recruiterId: record.recruiterId,
        candidateId: record.candidateId,
        candidateName: summary.candidateName || 'Verified Candidate',
        userRoadmapId: userRoadmap.id,
        roadmapId: userRoadmap.sourceRoadmapId,
        targetRole: summary.targetRole,
        targetCompanyTier: summary.targetCompanyTier,
        overallReadiness: summary.overallReadiness,
        status: record.status,
        notes: record.notes || null,
        matchContext: record.matchContext || null,
        verifiedSkillsCount: summary.verifiedSkillCount,
        masteredSkills,
        demonstratedSkills,
        evidenceSources,
        assessmentSummary: summary.assessmentSummary,
        practicalSummary: summary.practicalSummary,
        verificationId: summary.verificationId,
        verificationUrl: summary.verificationUrl,
        createdAt: record.createdAt.toISOString(),
        updatedAt: record.updatedAt.toISOString(),
      };
    }

    // Default fallback if candidate roadmap not found
    return {
      id: record.id,
      recruiterId: record.recruiterId,
      candidateId: record.candidateId,
      candidateName: 'Verified Candidate',
      userRoadmapId: record.userRoadmapId || '',
      roadmapId: '',
      targetRole: 'Software Engineer',
      targetCompanyTier: 'FAANG',
      overallReadiness: 0,
      status: record.status,
      notes: record.notes || null,
      matchContext: record.matchContext || null,
      verifiedSkillsCount: 0,
      masteredSkills: [],
      demonstratedSkills: [],
      evidenceSources: [],
      assessmentSummary: { totalAttempts: 0, passedAttempts: 0, averageScore: null },
      practicalSummary: { totalDrills: 0, passedDrills: 0, averageScore: null },
      verificationId: '',
      verificationUrl: `${baseUrl}/verify/`,
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
    };
  }
}

export const recruiterShortlistService = new RecruiterShortlistService();
