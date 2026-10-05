// ═══════════════════════════════════════════════════════════════
// ATS Export Validator — Stage 11.3
// Strict Zod Validation for ATS Standardized Export Queries
// ═══════════════════════════════════════════════════════════════

import { z } from 'zod';
import { AtsExportQueryDTO } from '@ru-ready/shared';
import { BadRequestError } from '../lib/errors.js';

export const atsAdapterEnum = z.enum(['GENERIC_ATS', 'GREENHOUSE', 'WORKDAY', 'LEVER']).default('GENERIC_ATS');
export const exportFormatEnum = z.enum(['json', 'csv']).default('json');
export const pipelineStatusFilterEnum = z
  .enum(['SHORTLISTED', 'REVIEWING', 'INTERVIEW', 'SELECTED', 'REJECTED', 'ALL'])
  .default('ALL');

export const atsExportQuerySchema = z
  .object({
    format: exportFormatEnum.optional().default('json'),
    adapter: atsAdapterEnum.optional().default('GENERIC_ATS'),
    status: pipelineStatusFilterEnum.optional().default('ALL'),
    targetRole: z.string().trim().max(100).optional(),
    targetCompanyTier: z.string().trim().max(50).optional(),
    minReadiness: z
      .preprocess((val) => (val !== undefined && val !== '' ? Number(val) : undefined), z.number().min(0).max(100).optional())
      .optional(),
    maxReadiness: z
      .preprocess((val) => (val !== undefined && val !== '' ? Number(val) : undefined), z.number().min(0).max(100).optional())
      .optional(),
    institution: z.string().trim().max(100).optional(),
    college: z.string().trim().max(100).optional(),
    batch: z.string().trim().max(50).optional(),
    graduationYear: z
      .union([z.string().trim().max(10), z.number().int().min(1900).max(2100)])
      .optional(),
    branch: z.string().trim().max(100).optional(),
    search: z.string().trim().max(200).optional(),
    limit: z
      .preprocess((val) => (val !== undefined && val !== '' ? Number(val) : 100), z.number().int().min(1).max(500))
      .optional()
      .default(100),
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

export function validateAtsExportQuery(raw: unknown): AtsExportQueryDTO {
  const result = atsExportQuerySchema.safeParse(raw);
  if (!result.success) {
    const errorDetails = result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
    throw new BadRequestError(`Invalid ATS export query: ${errorDetails}`);
  }
  return result.data as AtsExportQueryDTO;
}
