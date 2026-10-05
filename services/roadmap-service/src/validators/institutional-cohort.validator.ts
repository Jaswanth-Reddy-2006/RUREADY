// ═══════════════════════════════════════════════════════════════
// Institutional Cohort & Batch Tracking Validator — Stage 11.1
// Strict Zod Validation for Institutional Cohort Analytics
// ═══════════════════════════════════════════════════════════════

import { z } from 'zod';
import { InstitutionalCohortQueryDTO } from '@ru-ready/shared';
import { BadRequestError } from '../lib/errors.js';

export const institutionalCohortQuerySchema = z
  .object({
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
  })
  .refine(
    (data) => {
      if (data.minReadiness !== undefined && data.maxReadiness !== undefined) {
        return data.minReadiness <= data.maxReadiness;
      }
      return true;
    },
    {
      message: 'minReadiness cannot be greater than maxReadiness',
    }
  );

export function validateInstitutionalCohortQuery(raw: unknown): InstitutionalCohortQueryDTO {
  const result = institutionalCohortQuerySchema.safeParse(raw);
  if (!result.success) {
    const errorDetails = result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
    throw new BadRequestError(`Invalid institutional cohort query: ${errorDetails}`);
  }
  return result.data as InstitutionalCohortQueryDTO;
}
