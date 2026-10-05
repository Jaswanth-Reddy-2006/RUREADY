// ═══════════════════════════════════════════════════════════════
// Recruiter Shortlist & Talent Pipeline Validator — Stage 10.3
// Strict Zod Validation for Recruiter Shortlist & Pipeline Ingress
// ═══════════════════════════════════════════════════════════════

import { z } from 'zod';
import {
  AddToShortlistInputDTO,
  UpdateShortlistStatusInputDTO,
  RecruiterShortlistQueryDTO,
  RecruiterPipelineStatus,
} from '@ru-ready/shared';
import { BadRequestError } from '../lib/errors.js';

export const pipelineStatusEnum = z.enum([
  'SHORTLISTED',
  'REVIEWING',
  'INTERVIEW',
  'SELECTED',
  'REJECTED',
]);

export const addToShortlistSchema = z.object({
  candidateId: z.string().trim().min(1, { message: 'Candidate ID is required' }).max(100),
  userRoadmapId: z.string().trim().max(100).optional(),
  status: pipelineStatusEnum.optional().default('SHORTLISTED'),
  notes: z.string().trim().max(2000, { message: 'Recruiter notes cannot exceed 2,000 characters' }).optional(),
  matchContext: z
    .object({
      jobTitle: z.string().trim().max(200).optional(),
      matchScore: z.number().min(0).max(100).optional(),
      matchedSkills: z.array(z.string().trim().max(100)).max(50).optional(),
      missingSkills: z.array(z.string().trim().max(100)).max(50).optional(),
    })
    .optional(),
});

export const updateShortlistStatusSchema = z
  .object({
    status: pipelineStatusEnum.optional(),
    notes: z.string().trim().max(2000, { message: 'Recruiter notes cannot exceed 2,000 characters' }).optional(),
  })
  .refine((data) => data.status !== undefined || data.notes !== undefined, {
    message: 'Either status or notes must be provided for update',
  });

export const recruiterShortlistQuerySchema = z.object({
  status: z.enum(['SHORTLISTED', 'REVIEWING', 'INTERVIEW', 'SELECTED', 'REJECTED', 'ALL']).optional().default('ALL'),
  targetRole: z.string().trim().max(100).optional(),
  search: z.string().trim().max(200).optional(),
  sortBy: z.enum(['updatedAt', 'readiness', 'status', 'candidateName']).optional().default('updatedAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  page: z
    .preprocess((val) => (val !== undefined && val !== '' ? Number(val) : 1), z.number().int().min(1))
    .optional()
    .default(1),
  limit: z
    .preprocess((val) => (val !== undefined && val !== '' ? Number(val) : 10), z.number().int().min(1).max(100))
    .optional()
    .default(10),
});

export function validateAddToShortlistInput(raw: unknown): AddToShortlistInputDTO {
  const result = addToShortlistSchema.safeParse(raw);
  if (!result.success) {
    const errorDetails = result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
    throw new BadRequestError(`Invalid shortlist input: ${errorDetails}`);
  }
  return result.data as AddToShortlistInputDTO;
}

export function validateUpdateShortlistStatusInput(raw: unknown): UpdateShortlistStatusInputDTO {
  const result = updateShortlistStatusSchema.safeParse(raw);
  if (!result.success) {
    const errorDetails = result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
    throw new BadRequestError(`Invalid shortlist update input: ${errorDetails}`);
  }
  return result.data as UpdateShortlistStatusInputDTO;
}

export function validateRecruiterShortlistQuery(raw: unknown): RecruiterShortlistQueryDTO {
  const result = recruiterShortlistQuerySchema.safeParse(raw);
  if (!result.success) {
    const errorDetails = result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
    throw new BadRequestError(`Invalid shortlist query parameters: ${errorDetails}`);
  }
  return result.data as RecruiterShortlistQueryDTO;
}
