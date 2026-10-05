// ═══════════════════════════════════════════════════════════════
// Export & Verification Validator — Stage 10.5
// Strict Zod Validation for Export Formats & Query Bounding
// ═══════════════════════════════════════════════════════════════

import { z } from 'zod';
import { RecruiterExportQueryDTO, CohortExportQueryDTO } from '@ru-ready/shared';
import { BadRequestError } from '../lib/errors.js';

export const exportFormatEnum = z.enum(['json', 'csv']).default('json');

export const recruiterExportQuerySchema = z.object({
  format: exportFormatEnum.optional().default('json'),
  status: z
    .enum(['SHORTLISTED', 'REVIEWING', 'INTERVIEW', 'SELECTED', 'REJECTED', 'ALL'])
    .optional()
    .default('ALL'),
  targetRole: z.string().trim().max(100).optional(),
  search: z.string().trim().max(200).optional(),
  limit: z
    .preprocess((val) => (val !== undefined && val !== '' ? Number(val) : 100), z.number().int().min(1).max(500))
    .optional()
    .default(100),
});

export const cohortExportQuerySchema = z.object({
  format: exportFormatEnum.optional().default('json'),
  institution: z.string().trim().max(100).optional(),
  college: z.string().trim().max(100).optional(),
  batch: z.string().trim().max(50).optional(),
  graduationYear: z
    .union([z.string().trim().max(10), z.number().int().min(1900).max(2100)])
    .optional(),
  branch: z.string().trim().max(100).optional(),
  targetRole: z.string().trim().max(100).optional(),
  targetCompanyTier: z.string().trim().max(50).optional(),
  roadmapId: z.string().trim().max(100).optional(),
  minReadiness: z
    .preprocess((val) => (val !== undefined && val !== '' ? Number(val) : undefined), z.number().min(0).max(100).optional())
    .optional(),
  maxReadiness: z
    .preprocess((val) => (val !== undefined && val !== '' ? Number(val) : undefined), z.number().min(0).max(100).optional())
    .optional(),
});

export function validateRecruiterExportQuery(raw: unknown): RecruiterExportQueryDTO {
  const result = recruiterExportQuerySchema.safeParse(raw);
  if (!result.success) {
    const errorDetails = result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
    throw new BadRequestError(`Invalid recruiter export query: ${errorDetails}`);
  }
  return result.data as RecruiterExportQueryDTO;
}

export function validateCohortExportQuery(raw: unknown): CohortExportQueryDTO {
  const result = cohortExportQuerySchema.safeParse(raw);
  if (!result.success) {
    const errorDetails = result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
    throw new BadRequestError(`Invalid cohort export query: ${errorDetails}`);
  }
  return result.data as CohortExportQueryDTO;
}
