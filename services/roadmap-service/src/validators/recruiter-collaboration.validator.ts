// ═══════════════════════════════════════════════════════════════
// Recruiter Collaboration & Feedback Rubric Validator — Stage 11.2
// Strict Zod Validation for Multi-Recruiter Rubric & Team Collaboration
// ═══════════════════════════════════════════════════════════════

import { z } from 'zod';
import {
  SubmitCandidateFeedbackInputDTO,
  UpdateCandidateFeedbackInputDTO,
  CandidateFeedbackQueryDTO,
  CandidateFeedbackRubricDTO,
} from '@ru-ready/shared';
import { BadRequestError } from '../lib/errors.js';

export const candidateFeedbackRubricSchema = z.object({
  technicalSkillsScore: z.number().int().min(1, 'Technical skills score must be between 1 and 5').max(5),
  communicationScore: z.number().int().min(1, 'Communication score must be between 1 and 5').max(5),
  problemSolvingScore: z.number().int().min(1, 'Problem solving score must be between 1 and 5').max(5),
  roleFitScore: z.number().int().min(1, 'Role fit score must be between 1 and 5').max(5),
  practicalEvidenceScore: z.number().int().min(1, 'Practical evidence score must be between 1 and 5').max(5),
  overallScore: z.number().min(0).max(100).optional(),
  recommendation: z.enum(['STRONG_HIRE', 'HIRE', 'LEANING_HIRE', 'LEANING_NO_HIRE', 'NO_HIRE']),
  strengths: z.array(z.string().trim().max(200)).optional(),
  areasForGrowth: z.array(z.string().trim().max(200)).optional(),
});

export const submitCandidateFeedbackSchema = z.object({
  candidateId: z.string().trim().min(1, 'candidateId is required').max(100),
  userRoadmapId: z.string().trim().max(100).optional(),
  rubric: candidateFeedbackRubricSchema,
  comments: z.string().trim().max(4000).optional().nullable(),
  stage: z.enum(['SHORTLISTED', 'REVIEWING', 'INTERVIEW', 'SELECTED', 'REJECTED']).optional(),
  isSharedWithTeam: z.boolean().optional(),
});

export const updateCandidateFeedbackSchema = z.object({
  rubric: candidateFeedbackRubricSchema.partial().optional(),
  comments: z.string().trim().max(4000).optional().nullable(),
  stage: z.enum(['SHORTLISTED', 'REVIEWING', 'INTERVIEW', 'SELECTED', 'REJECTED']).optional(),
  isSharedWithTeam: z.boolean().optional(),
});

export const candidateFeedbackQuerySchema = z.object({
  candidateId: z.string().trim().max(100).optional(),
  stage: z.enum(['SHORTLISTED', 'REVIEWING', 'INTERVIEW', 'SELECTED', 'REJECTED', 'ALL']).optional(),
  reviewerId: z.string().trim().max(100).optional(),
  page: z.preprocess((val) => (val !== undefined && val !== '' ? Number(val) : undefined), z.number().int().min(1).optional()),
  limit: z.preprocess((val) => (val !== undefined && val !== '' ? Number(val) : undefined), z.number().int().min(1).max(100).optional()),
});

export function validateSubmitCandidateFeedback(raw: unknown): SubmitCandidateFeedbackInputDTO {
  const result = submitCandidateFeedbackSchema.safeParse(raw);
  if (!result.success) {
    const errorDetails = result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
    throw new BadRequestError(`Invalid candidate feedback submission: ${errorDetails}`);
  }
  return result.data as SubmitCandidateFeedbackInputDTO;
}

export function validateUpdateCandidateFeedback(raw: unknown): UpdateCandidateFeedbackInputDTO {
  const result = updateCandidateFeedbackSchema.safeParse(raw);
  if (!result.success) {
    const errorDetails = result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
    throw new BadRequestError(`Invalid candidate feedback update: ${errorDetails}`);
  }
  return result.data as UpdateCandidateFeedbackInputDTO;
}

export function validateCandidateFeedbackQuery(raw: unknown): CandidateFeedbackQueryDTO {
  const result = candidateFeedbackQuerySchema.safeParse(raw);
  if (!result.success) {
    const errorDetails = result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
    throw new BadRequestError(`Invalid candidate feedback query: ${errorDetails}`);
  }
  return result.data as CandidateFeedbackQueryDTO;
}
