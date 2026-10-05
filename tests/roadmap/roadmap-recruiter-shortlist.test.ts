// ═══════════════════════════════════════════════════════════════
// Stage 10.3: Recruiter Shortlist & Talent Pipeline Tests
// Comprehensive Unit, Integration, Multi-Tenant, State Machine & Privacy Suite
// ═══════════════════════════════════════════════════════════════

import { describe, expect, it, vi, beforeEach } from 'vitest';
import { recruiterShortlistService } from '../../services/roadmap-service/src/services/recruiter-shortlist.service.js';
import {
  validateAddToShortlistInput,
  validateUpdateShortlistStatusInput,
  validateRecruiterShortlistQuery,
} from '../../services/roadmap-service/src/validators/recruiter-shortlist.validator.js';
import { roadmapController } from '../../services/roadmap-service/src/controllers/roadmap.controller.js';
import { prisma } from '../../services/roadmap-service/src/lib/prisma.js';
import { BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError } from '../../services/roadmap-service/src/lib/errors.js';

describe('Stage 10.3: Recruiter Shortlist & Talent Pipeline', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    recruiterShortlistService.clearStore();
  });

  function createMockReqRes(options: {
    headers?: Record<string, string | string[] | undefined>;
    params?: Record<string, string>;
    query?: Record<string, any>;
    body?: any;
    protocol?: string;
  }) {
    const req: any = {
      headers: options.headers || {},
      params: options.params || {},
      query: options.query || {},
      body: options.body || {},
      protocol: options.protocol || 'https',
      get: (headerName: string) => options.headers?.[headerName.toLowerCase()] || 'ruready.dev',
    };

    let statusCode = 200;
    let jsonResponse: any = null;

    const res: any = {
      status: vi.fn((code: number) => {
        statusCode = code;
        return res;
      }),
      json: vi.fn((data: any) => {
        jsonResponse = data;
        return res;
      }),
    };

    const next = vi.fn();

    return {
      req,
      res,
      next,
      getStatusCode: () => statusCode,
      getJsonResponse: () => jsonResponse,
    };
  }

  const mockUserRoadmap = {
    id: 'urm_candidate_1',
    userId: 'user_cand_1',
    sourceRoadmapId: 'rm_backend_1',
    sourceRoadmap: {
      id: 'rm_backend_1',
      title: 'Senior Backend Engineer',
      role: 'Backend Engineer',
      targetRole: 'Senior Backend Engineer',
      tier: 'FAANG',
      visibility: 'PUBLIC',
      goal: { id: 'g1', title: 'Target Backend' },
    },
    sprints: [
      {
        id: 'sp_1',
        title: 'Sprint 1: Distributed Systems',
        status: 'COMPLETED',
        performance: { id: 'perf_1', score: 92, velocity: 1.2 },
      },
    ],
    skillEvidence: [
      {
        id: 'ev_1',
        skillId: 'sk_node',
        source: 'PRACTICAL_DRILL',
        score: 95,
        confidence: 'HIGH',
        skill: { id: 'sk_node', name: 'Node.js', category: 'Backend' },
      },
      {
        id: 'ev_2',
        skillId: 'sk_postgres',
        source: 'MICRO_ASSESSMENT',
        score: 88,
        confidence: 'HIGH',
        skill: { id: 'sk_postgres', name: 'PostgreSQL', category: 'Database' },
      },
    ],
    assessmentAttempts: [
      {
        id: 'att_1',
        score: 90,
        passed: true,
        assessment: { id: 'as_1', title: 'Backend Core' },
        skill: { id: 'sk_node', name: 'Node.js' },
      },
    ],
    updatedAt: new Date(),
  };

  describe('1. Zod Validation & Input Sanitization', () => {
    it('validates correct AddToShortlistInputDTO payload', () => {
      const parsed = validateAddToShortlistInput({
        candidateId: 'cand_123',
        status: 'SHORTLISTED',
        notes: 'Top tier candidate with great distributed systems knowledge',
        matchContext: {
          jobTitle: 'Senior Backend Engineer',
          matchScore: 88,
          matchedSkills: ['Node.js', 'PostgreSQL'],
          missingSkills: ['Redis'],
        },
      });

      expect(parsed.candidateId).toBe('cand_123');
      expect(parsed.status).toBe('SHORTLISTED');
      expect(parsed.notes).toContain('Top tier');
      expect(parsed.matchContext?.matchScore).toBe(88);
    });

    it('rejects missing or empty candidateId', () => {
      expect(() => validateAddToShortlistInput({ candidateId: '   ' })).toThrow(BadRequestError);
      expect(() => validateAddToShortlistInput({})).toThrow(BadRequestError);
    });

    it('rejects notes exceeding 2000 characters', () => {
      expect(() =>
        validateAddToShortlistInput({
          candidateId: 'cand_123',
          notes: 'a'.repeat(2001),
        })
      ).toThrow(BadRequestError);
    });

    it('validates UpdateShortlistStatusInputDTO with partial notes or status', () => {
      const parsedStatus = validateUpdateShortlistStatusInput({ status: 'INTERVIEW' });
      expect(parsedStatus.status).toBe('INTERVIEW');

      const parsedNotes = validateUpdateShortlistStatusInput({ notes: 'Interview scheduled for Tuesday' });
      expect(parsedNotes.notes).toBe('Interview scheduled for Tuesday');

      expect(() => validateUpdateShortlistStatusInput({})).toThrow(BadRequestError);
    });

    it('validates and applies defaults for RecruiterShortlistQueryDTO', () => {
      const query = validateRecruiterShortlistQuery({
        status: 'REVIEWING',
        page: '2',
        limit: '15',
        sortBy: 'readiness',
        sortOrder: 'asc',
      });

      expect(query.status).toBe('REVIEWING');
      expect(query.page).toBe(2);
      expect(query.limit).toBe(15);
      expect(query.sortBy).toBe('readiness');
      expect(query.sortOrder).toBe('asc');
    });
  });

  describe('2. Pipeline State Machine Transitions', () => {
    it('allows valid state transitions', async () => {
      vi.spyOn(prisma.userRoadmap, 'findFirst').mockResolvedValue(mockUserRoadmap as any);

      // SHORTLISTED -> REVIEWING
      await recruiterShortlistService.addToShortlist('recruiter_1', {
        candidateId: 'user_cand_1',
        status: 'SHORTLISTED',
      });

      const entryId = recruiterShortlistService['generateEntryId']('recruiter_1', 'user_cand_1');

      let updated = await recruiterShortlistService.updateShortlistEntry('recruiter_1', entryId, {
        status: 'REVIEWING',
      });
      expect(updated.status).toBe('REVIEWING');

      // REVIEWING -> INTERVIEW
      updated = await recruiterShortlistService.updateShortlistEntry('recruiter_1', entryId, {
        status: 'INTERVIEW',
      });
      expect(updated.status).toBe('INTERVIEW');

      // INTERVIEW -> SELECTED
      updated = await recruiterShortlistService.updateShortlistEntry('recruiter_1', entryId, {
        status: 'SELECTED',
      });
      expect(updated.status).toBe('SELECTED');

      // SELECTED -> REJECTED
      updated = await recruiterShortlistService.updateShortlistEntry('recruiter_1', entryId, {
        status: 'REJECTED',
      });
      expect(updated.status).toBe('REJECTED');

      // REJECTED -> SHORTLISTED
      updated = await recruiterShortlistService.updateShortlistEntry('recruiter_1', entryId, {
        status: 'SHORTLISTED',
      });
      expect(updated.status).toBe('SHORTLISTED');
    });

    it('rejects invalid state machine transitions with BadRequestError', async () => {
      vi.spyOn(prisma.userRoadmap, 'findFirst').mockResolvedValue(mockUserRoadmap as any);

      await recruiterShortlistService.addToShortlist('recruiter_1', {
        candidateId: 'user_cand_1',
        status: 'SHORTLISTED',
      });

      const entryId = recruiterShortlistService['generateEntryId']('recruiter_1', 'user_cand_1');

      // Direct jump from SHORTLISTED -> SELECTED is forbidden
      await expect(
        recruiterShortlistService.updateShortlistEntry('recruiter_1', entryId, {
          status: 'SELECTED',
        })
      ).rejects.toThrow(BadRequestError);
    });
  });

  describe('3. Multi-Tenant Recruiter Isolation & Data Ownership', () => {
    it('ensures Recruiter A cannot see or access Recruiter B shortlist or private notes', async () => {
      vi.spyOn(prisma.userRoadmap, 'findFirst').mockResolvedValue(mockUserRoadmap as any);

      // Recruiter A shortlists candidate with private notes
      const entryA = await recruiterShortlistService.addToShortlist('recruiter_A', {
        candidateId: 'user_cand_1',
        notes: 'Secret evaluation for Recruiter A',
        status: 'SHORTLISTED',
      });

      // Recruiter B shortlists candidate with different notes and status
      const entryB = await recruiterShortlistService.addToShortlist('recruiter_B', {
        candidateId: 'user_cand_1',
        notes: 'Different evaluation for Recruiter B',
        status: 'REVIEWING',
      });

      expect(entryA.id).not.toBe(entryB.id);

      // Recruiter A's list only contains Recruiter A's entry
      const listA = await recruiterShortlistService.getShortlist('recruiter_A', {});
      expect(listA.total).toBe(1);
      expect(listA.entries[0].notes).toBe('Secret evaluation for Recruiter A');
      expect(listA.entries[0].status).toBe('SHORTLISTED');

      // Recruiter B's list only contains Recruiter B's entry
      const listB = await recruiterShortlistService.getShortlist('recruiter_B', {});
      expect(listB.total).toBe(1);
      expect(listB.entries[0].notes).toBe('Different evaluation for Recruiter B');
      expect(listB.entries[0].status).toBe('REVIEWING');

      // Recruiter B cannot read Recruiter A's entry by ID (Forbidden)
      await expect(
        recruiterShortlistService.getShortlistEntryById('recruiter_B', entryA.id)
      ).rejects.toThrow(ForbiddenError);

      // Recruiter B cannot update Recruiter A's entry (Forbidden)
      await expect(
        recruiterShortlistService.updateShortlistEntry('recruiter_B', entryA.id, {
          status: 'SELECTED',
        })
      ).rejects.toThrow(ForbiddenError);

      // Recruiter B cannot delete Recruiter A's entry (Forbidden)
      await expect(
        recruiterShortlistService.removeFromShortlist('recruiter_B', entryA.id)
      ).rejects.toThrow(ForbiddenError);
    });
  });

  describe('4. Idempotency & Duplicate Handling', () => {
    it('handles adding the same candidate twice idempotently without creating duplicate records', async () => {
      vi.spyOn(prisma.userRoadmap, 'findFirst').mockResolvedValue(mockUserRoadmap as any);

      const firstAdd = await recruiterShortlistService.addToShortlist('recruiter_1', {
        candidateId: 'user_cand_1',
        notes: 'Initial note',
        status: 'SHORTLISTED',
      });

      const secondAdd = await recruiterShortlistService.addToShortlist('recruiter_1', {
        candidateId: 'user_cand_1',
        notes: 'Updated note on re-shortlist',
        status: 'REVIEWING',
      });

      expect(firstAdd.id).toBe(secondAdd.id);
      expect(secondAdd.notes).toBe('Updated note on re-shortlist');
      expect(secondAdd.status).toBe('REVIEWING');

      const list = await recruiterShortlistService.getShortlist('recruiter_1', {});
      expect(list.total).toBe(1);
      expect(list.entries.length).toBe(1);
    });
  });

  describe('5. Privacy Protection & Safe Candidate Projection', () => {
    it('returns recruiter-safe candidate metrics without exposing private transcripts or answers', async () => {
      vi.spyOn(prisma.userRoadmap, 'findFirst').mockResolvedValue(mockUserRoadmap as any);

      const entry = await recruiterShortlistService.addToShortlist('recruiter_1', {
        candidateId: 'user_cand_1',
        status: 'SHORTLISTED',
      });

      expect(entry.candidateId).toBe('user_cand_1');
      expect(entry.overallReadiness).toBeGreaterThanOrEqual(0);
      expect(entry.verifiedSkillsCount).toBeGreaterThanOrEqual(0);
      expect(entry.demonstratedSkills).toBeInstanceOf(Array);
      expect(entry.verificationUrl).toContain('/verify/');

      // Ensure no internal / raw assessment question content or internal tokens exist
      expect((entry as any).answers).toBeUndefined();
      expect((entry as any).transcript).toBeUndefined();
      expect((entry as any).prompts).toBeUndefined();
    });
  });

  describe('6. Controller & API Route Integration', () => {
    it('POST /recruiter/shortlist creates shortlist entry (201)', async () => {
      vi.spyOn(prisma.userRoadmap, 'findFirst').mockResolvedValue(mockUserRoadmap as any);

      const { req, res, next, getStatusCode, getJsonResponse } = createMockReqRes({
        headers: { 'x-user-id': 'recruiter_xyz' },
        body: {
          candidateId: 'user_cand_1',
          status: 'SHORTLISTED',
          notes: 'Promising candidate',
        },
      });

      await roadmapController.addToShortlist(req, res, next);
      expect(getStatusCode()).toBe(201);
      expect(getJsonResponse().success).toBe(true);
      expect(getJsonResponse().data.candidateId).toBe('user_cand_1');
    });

    it('GET /recruiter/shortlist returns list and status aggregations (200)', async () => {
      vi.spyOn(prisma.userRoadmap, 'findFirst').mockResolvedValue(mockUserRoadmap as any);

      await recruiterShortlistService.addToShortlist('recruiter_xyz', {
        candidateId: 'user_cand_1',
        status: 'SHORTLISTED',
      });

      const { req, res, next, getStatusCode, getJsonResponse } = createMockReqRes({
        headers: { 'x-user-id': 'recruiter_xyz' },
        query: { status: 'ALL' },
      });

      await roadmapController.getRecruiterShortlist(req, res, next);
      expect(getStatusCode()).toBe(200);
      expect(getJsonResponse().success).toBe(true);
      expect(getJsonResponse().data.total).toBe(1);
      expect(getJsonResponse().data.statusCounts.SHORTLISTED).toBe(1);
    });

    it('PATCH /recruiter/shortlist/:id updates status and notes (200)', async () => {
      vi.spyOn(prisma.userRoadmap, 'findFirst').mockResolvedValue(mockUserRoadmap as any);

      const created = await recruiterShortlistService.addToShortlist('recruiter_xyz', {
        candidateId: 'user_cand_1',
        status: 'SHORTLISTED',
      });

      const { req, res, next, getStatusCode, getJsonResponse } = createMockReqRes({
        headers: { 'x-user-id': 'recruiter_xyz' },
        params: { id: created.id },
        body: { status: 'REVIEWING', notes: 'Advancing to review stage' },
      });

      await roadmapController.updateShortlistEntry(req, res, next);
      expect(getStatusCode()).toBe(200);
      expect(getJsonResponse().success).toBe(true);
      expect(getJsonResponse().data.status).toBe('REVIEWING');
      expect(getJsonResponse().data.notes).toBe('Advancing to review stage');
    });

    it('DELETE /recruiter/shortlist/:id removes shortlist entry (200)', async () => {
      vi.spyOn(prisma.userRoadmap, 'findFirst').mockResolvedValue(mockUserRoadmap as any);

      const created = await recruiterShortlistService.addToShortlist('recruiter_xyz', {
        candidateId: 'user_cand_1',
        status: 'SHORTLISTED',
      });

      const { req, res, next, getStatusCode, getJsonResponse } = createMockReqRes({
        headers: { 'x-user-id': 'recruiter_xyz' },
        params: { id: created.id },
      });

      await roadmapController.removeFromShortlist(req, res, next);
      expect(getStatusCode()).toBe(200);
      expect(getJsonResponse().success).toBe(true);

      // Verify it's gone
      const list = await recruiterShortlistService.getShortlist('recruiter_xyz', {});
      expect(list.total).toBe(0);
    });

    it('enforces authentication via x-user-id header', async () => {
      const { req, res, next } = createMockReqRes({
        headers: {}, // No x-user-id
        body: { candidateId: 'user_cand_1' },
      });

      await roadmapController.addToShortlist(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });
  });
});
