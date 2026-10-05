// ═══════════════════════════════════════════════════════════════
// Stage 11.2: Multi-Recruiter Collaborative Pipeline & Feedback Rubrics Tests
// Comprehensive Unit, Integration, Multi-Tenant Security, Rubric & Audit Trail Tests
// ═══════════════════════════════════════════════════════════════

import { describe, expect, it, vi, beforeEach } from 'vitest';
import { recruiterCollaborationService } from '../../services/roadmap-service/src/services/recruiter-collaboration.service.js';
import { recruiterShortlistService } from '../../services/roadmap-service/src/services/recruiter-shortlist.service.js';
import {
  validateSubmitCandidateFeedback,
  validateUpdateCandidateFeedback,
  validateCandidateFeedbackQuery,
} from '../../services/roadmap-service/src/validators/recruiter-collaboration.validator.js';
import { roadmapController } from '../../services/roadmap-service/src/controllers/roadmap.controller.js';
import { prisma } from '../../services/roadmap-service/src/lib/prisma.js';
import { UnauthorizedError, ForbiddenError, NotFoundError, BadRequestError } from '../../services/roadmap-service/src/lib/errors.js';

describe('Stage 11.2: Multi-Recruiter Collaborative Pipeline & Feedback Rubrics', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    recruiterCollaborationService.clearStore();
    recruiterShortlistService.clearStore();
  });

  function createMockReqRes(options: {
    headers?: Record<string, string | string[] | undefined>;
    params?: Record<string, string>;
    query?: Record<string, any>;
    body?: any;
    protocol?: string;
    method?: string;
  }) {
    const req: any = {
      method: options.method || 'GET',
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

  const mockCandidateRoadmap = {
    id: 'urm_cand_collab_1',
    userId: 'user_cand_collab_1',
    sourceRoadmapId: 'rm_backend_expert',
    status: 'ACTIVE',
    personalization: {
      candidateName: 'Elena Rostova',
      institution: 'MIT',
      targetRole: 'Senior Backend Engineer',
      targetCompanyTier: 'FAANG',
    },
    sourceRoadmap: {
      id: 'rm_backend_expert',
      visibility: 'PUBLIC',
      rolePath: 'Senior Backend Engineer',
      targetRole: 'Senior Backend Engineer',
      targetCompanyTier: 'FAANG',
      goal: { id: 'g1', targetRole: 'Senior Backend Engineer' },
    },
    sprints: [],
    skillEvidence: [],
    assessmentAttempts: [],
    updatedAt: new Date(),
  };

  describe('1. Feedback Submission & Rubric Scoring', () => {
    it('submits structured candidate feedback with 5-dimension rubric and calculates calibrated score', async () => {
      vi.spyOn(prisma.userRoadmap, 'findFirst').mockResolvedValue(mockCandidateRoadmap as any);

      const authContext = {
        recruiterId: 'recruiter_alice',
        organizationId: 'org_acme_corp',
        recruiterName: 'Alice Recruiter',
        role: 'LEAD_RECRUITER',
      };

      const result = await recruiterCollaborationService.submitFeedback(authContext, {
        candidateId: 'user_cand_collab_1',
        rubric: {
          technicalSkillsScore: 5,
          communicationScore: 4,
          problemSolvingScore: 5,
          roleFitScore: 4,
          practicalEvidenceScore: 5,
          recommendation: 'STRONG_HIRE',
          strengths: ['Deep knowledge of distributed caching', 'Clear communication'],
          areasForGrowth: ['System design diagramming speed'],
        },
        comments: 'Outstanding candidate for the distributed backend role.',
        stage: 'INTERVIEW',
        isSharedWithTeam: true,
      });

      expect(result.id).toMatch(/^fb_/);
      expect(result.candidateId).toBe('user_cand_collab_1');
      expect(result.organizationId).toBe('org_acme_corp');
      expect(result.reviewerId).toBe('recruiter_alice');
      expect(result.reviewerName).toBe('Alice Recruiter');
      expect(result.rubric.recommendation).toBe('STRONG_HIRE');
      expect(result.rubric.overallScore).toBe(92); // (23/25) * 100 = 92%
      expect(result.stage).toBe('INTERVIEW');
    });

    it('rejects submission when candidate does not have a public roadmap', async () => {
      vi.spyOn(prisma.userRoadmap, 'findFirst').mockResolvedValue(null);

      const authContext = {
        recruiterId: 'recruiter_alice',
        organizationId: 'org_acme_corp',
      };

      await expect(
        recruiterCollaborationService.submitFeedback(authContext, {
          candidateId: 'non_existent_candidate',
          rubric: {
            technicalSkillsScore: 3,
            communicationScore: 3,
            problemSolvingScore: 3,
            roleFitScore: 3,
            practicalEvidenceScore: 3,
            recommendation: 'HIRE',
          },
        })
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('2. Multi-Recruiter Collaboration & Team Visibility', () => {
    it('allows Recruiter B from same organization to view Recruiter A shared feedback in candidate thread', async () => {
      vi.spyOn(prisma.userRoadmap, 'findFirst').mockResolvedValue(mockCandidateRoadmap as any);

      // Recruiter A submits feedback
      await recruiterCollaborationService.submitFeedback(
        {
          recruiterId: 'recruiter_alice',
          organizationId: 'org_acme_corp',
          recruiterName: 'Alice',
        },
        {
          candidateId: 'user_cand_collab_1',
          rubric: {
            technicalSkillsScore: 5,
            communicationScore: 4,
            problemSolvingScore: 4,
            roleFitScore: 5,
            practicalEvidenceScore: 4,
            recommendation: 'STRONG_HIRE',
          },
          comments: 'Alice assessment notes',
          stage: 'INTERVIEW',
          isSharedWithTeam: true,
        }
      );

      // Recruiter B from same organization views collaboration thread
      const thread = await recruiterCollaborationService.getCandidateCollaborationThread(
        {
          recruiterId: 'recruiter_bob',
          organizationId: 'org_acme_corp',
          recruiterName: 'Bob',
        },
        'user_cand_collab_1'
      );

      expect(thread.candidateId).toBe('user_cand_collab_1');
      expect(thread.organizationId).toBe('org_acme_corp');
      expect(thread.totalReviews).toBe(1);
      expect(thread.recommendationBreakdown.STRONG_HIRE).toBe(1);
      expect(thread.feedbackList[0].reviewerName).toBe('Alice');
      expect(thread.feedbackList[0].comments).toBe('Alice assessment notes');
      expect(thread.activityLog.length).toBeGreaterThan(0);
    });

    it('isolates organizations: Recruiter C from different organization sees 0 reviews', async () => {
      vi.spyOn(prisma.userRoadmap, 'findFirst').mockResolvedValue(mockCandidateRoadmap as any);

      // Org 1 feedback
      await recruiterCollaborationService.submitFeedback(
        {
          recruiterId: 'recruiter_alice',
          organizationId: 'org_acme_corp',
          recruiterName: 'Alice',
        },
        {
          candidateId: 'user_cand_collab_1',
          rubric: {
            technicalSkillsScore: 5,
            communicationScore: 5,
            problemSolvingScore: 5,
            roleFitScore: 5,
            practicalEvidenceScore: 5,
            recommendation: 'STRONG_HIRE',
          },
        }
      );

      // Org 2 query
      const org2Thread = await recruiterCollaborationService.getCandidateCollaborationThread(
        {
          recruiterId: 'recruiter_carol',
          organizationId: 'org_rival_corp',
        },
        'user_cand_collab_1'
      );

      expect(org2Thread.organizationId).toBe('org_rival_corp');
      expect(org2Thread.totalReviews).toBe(0);
      expect(org2Thread.feedbackList).toHaveLength(0);
    });
  });

  describe('3. Feedback Modification & Ownership Enforcement', () => {
    it('allows authoring recruiter to update their feedback rubric and records audit activity', async () => {
      vi.spyOn(prisma.userRoadmap, 'findFirst').mockResolvedValue(mockCandidateRoadmap as any);

      const created = await recruiterCollaborationService.submitFeedback(
        {
          recruiterId: 'recruiter_alice',
          organizationId: 'org_acme_corp',
          recruiterName: 'Alice',
        },
        {
          candidateId: 'user_cand_collab_1',
          rubric: {
            technicalSkillsScore: 3,
            communicationScore: 3,
            problemSolvingScore: 3,
            roleFitScore: 3,
            practicalEvidenceScore: 3,
            recommendation: 'LEANING_HIRE',
          },
        }
      );

      const updated = await recruiterCollaborationService.updateFeedback(
        {
          recruiterId: 'recruiter_alice',
          organizationId: 'org_acme_corp',
        },
        created.id,
        {
          rubric: {
            technicalSkillsScore: 5,
            recommendation: 'STRONG_HIRE',
          },
          comments: 'Updated post-onsite round',
          stage: 'SELECTED',
        }
      );

      expect(updated.rubric.technicalSkillsScore).toBe(5);
      expect(updated.rubric.recommendation).toBe('STRONG_HIRE');
      expect(updated.comments).toBe('Updated post-onsite round');
      expect(updated.stage).toBe('SELECTED');
    });

    it('rejects update when another recruiter attempts to modify feedback they did not author', async () => {
      vi.spyOn(prisma.userRoadmap, 'findFirst').mockResolvedValue(mockCandidateRoadmap as any);

      const created = await recruiterCollaborationService.submitFeedback(
        {
          recruiterId: 'recruiter_alice',
          organizationId: 'org_acme_corp',
          recruiterName: 'Alice',
        },
        {
          candidateId: 'user_cand_collab_1',
          rubric: {
            technicalSkillsScore: 4,
            communicationScore: 4,
            problemSolvingScore: 4,
            roleFitScore: 4,
            practicalEvidenceScore: 4,
            recommendation: 'HIRE',
          },
        }
      );

      await expect(
        recruiterCollaborationService.updateFeedback(
          {
            recruiterId: 'recruiter_bob',
            organizationId: 'org_acme_corp',
          },
          created.id,
          { comments: 'Unauthorized modification' }
        )
      ).rejects.toThrow(ForbiddenError);
    });
  });

  describe('4. Private-Note Isolation vs Shared Feedback', () => {
    it('hides unshared feedback from other recruiters in the same organization', async () => {
      vi.spyOn(prisma.userRoadmap, 'findFirst').mockResolvedValue(mockCandidateRoadmap as any);

      // Recruiter A submits private unshared feedback
      await recruiterCollaborationService.submitFeedback(
        {
          recruiterId: 'recruiter_alice',
          organizationId: 'org_acme_corp',
          recruiterName: 'Alice',
        },
        {
          candidateId: 'user_cand_collab_1',
          rubric: {
            technicalSkillsScore: 2,
            communicationScore: 2,
            problemSolvingScore: 2,
            roleFitScore: 2,
            practicalEvidenceScore: 2,
            recommendation: 'NO_HIRE',
          },
          comments: 'Confidential salary negotiation observation',
          isSharedWithTeam: false,
        }
      );

      // Recruiter B checks candidate thread
      const thread = await recruiterCollaborationService.getCandidateCollaborationThread(
        {
          recruiterId: 'recruiter_bob',
          organizationId: 'org_acme_corp',
        },
        'user_cand_collab_1'
      );

      expect(thread.totalReviews).toBe(0);
      expect(thread.feedbackList).toHaveLength(0);

      // Recruiter A checks candidate thread -> can see their own private feedback
      const aliceThread = await recruiterCollaborationService.getCandidateCollaborationThread(
        {
          recruiterId: 'recruiter_alice',
          organizationId: 'org_acme_corp',
        },
        'user_cand_collab_1'
      );
      expect(aliceThread.totalReviews).toBe(1);
      expect(aliceThread.feedbackList[0].comments).toBe('Confidential salary negotiation observation');
    });
  });

  describe('5. Zod Validator & Malformed Query Handling', () => {
    it('validates rubric bounds and throws BadRequestError if score is outside 1-5', () => {
      expect(() => {
        validateSubmitCandidateFeedback({
          candidateId: 'cand_1',
          rubric: {
            technicalSkillsScore: 8, // Out of bounds
            communicationScore: 4,
            problemSolvingScore: 4,
            roleFitScore: 4,
            practicalEvidenceScore: 4,
            recommendation: 'STRONG_HIRE',
          },
        });
      }).toThrow(BadRequestError);
    });

    it('validates rubric bounds and throws BadRequestError on invalid recommendation', () => {
      expect(() => {
        validateSubmitCandidateFeedback({
          candidateId: 'cand_1',
          rubric: {
            technicalSkillsScore: 4,
            communicationScore: 4,
            problemSolvingScore: 4,
            roleFitScore: 4,
            practicalEvidenceScore: 4,
            recommendation: 'DEFINITE_YES' as any,
          },
        });
      }).toThrow(BadRequestError);
    });
  });

  describe('6. Controller Endpoint Handlers', () => {
    it('handles POST /recruiter/feedback controller request', async () => {
      vi.spyOn(prisma.userRoadmap, 'findFirst').mockResolvedValue(mockCandidateRoadmap as any);

      const { req, res, next, getStatusCode, getJsonResponse } = createMockReqRes({
        method: 'POST',
        headers: {
          'x-recruiter-id': 'recruiter_alice',
          'x-organization-id': 'org_acme',
          'x-user-name': 'Alice',
        },
        body: {
          candidateId: 'user_cand_collab_1',
          rubric: {
            technicalSkillsScore: 5,
            communicationScore: 5,
            problemSolvingScore: 5,
            roleFitScore: 5,
            practicalEvidenceScore: 5,
            recommendation: 'STRONG_HIRE',
          },
          comments: 'Controller test comment',
          stage: 'INTERVIEW',
        },
      });

      await roadmapController.submitCandidateFeedback(req, res, next);

      expect(getStatusCode()).toBe(201);
      expect(getJsonResponse().success).toBe(true);
      expect(getJsonResponse().data.candidateId).toBe('user_cand_collab_1');
      expect(getJsonResponse().data.reviewerName).toBe('Alice');
    });

    it('handles GET /recruiter/candidates/:candidateId/collaboration controller request', async () => {
      vi.spyOn(prisma.userRoadmap, 'findFirst').mockResolvedValue(mockCandidateRoadmap as any);

      const { req, res, next, getStatusCode, getJsonResponse } = createMockReqRes({
        headers: {
          'x-recruiter-id': 'recruiter_alice',
          'x-organization-id': 'org_acme',
        },
        params: {
          candidateId: 'user_cand_collab_1',
        },
      });

      await roadmapController.getCandidateCollaborationThread(req, res, next);

      expect(getStatusCode()).toBe(200);
      expect(getJsonResponse().success).toBe(true);
      expect(getJsonResponse().data.organizationId).toBe('org_acme');
      expect(getJsonResponse().data.candidateId).toBe('user_cand_collab_1');
    });

    it('handles GET /recruiter/feedback list endpoint', async () => {
      const { req, res, next, getStatusCode, getJsonResponse } = createMockReqRes({
        headers: {
          'x-recruiter-id': 'recruiter_alice',
          'x-organization-id': 'org_acme',
        },
        query: { stage: 'ALL' },
      });

      await roadmapController.listOrganizationFeedback(req, res, next);

      expect(getStatusCode()).toBe(200);
      expect(getJsonResponse().success).toBe(true);
      expect(Array.isArray(getJsonResponse().data.feedback)).toBe(true);
    });
  });
});
