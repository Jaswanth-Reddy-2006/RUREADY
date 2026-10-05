// ═══════════════════════════════════════════════════════════════
// Cohort & Campus Analytics Validator — Stage 10.4
// Strict Zod Validation for Institutional & Cohort Analytics
// ═══════════════════════════════════════════════════════════════

import { z } from 'zod';
import { CohortAnalyticsQueryDTO } from '@ru-ready/shared';
import { BadRequestError } from '../lib/errors.js';

export const cohortAnalyticsQuerySchema = z
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

export function validateCohortAnalyticsQuery(raw: unknown): CohortAnalyticsQueryDTO {
  const result = cohortAnalyticsQuerySchema.safeParse(raw);
  if (!result.success) {
    const errorDetails = result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
    throw new BadRequestError(`Invalid cohort analytics query: ${errorDetails}`);
  }
  return result.data as CohortAnalyticsQueryDTO;
}
