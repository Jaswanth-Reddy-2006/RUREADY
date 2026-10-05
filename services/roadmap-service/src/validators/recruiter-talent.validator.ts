// ═══════════════════════════════════════════════════════════════
// Recruiter Talent Search & Skill Filtering Validator — Stage 10.1
// Strict Zod Validation & Schema for Recruiter Candidate Search
// ═══════════════════════════════════════════════════════════════

import { z } from 'zod';
import { RecruiterTalentQueryDTO } from '@ru-ready/shared';
import { BadRequestError } from '../lib/errors.js';

export const recruiterTalentQuerySchema = z
  .object({
    role: z.string().trim().max(100).optional(),
    targetCompanyTier: z.enum(['FAANG', 'TIER_1', 'STARTUP', 'ALL']).optional().default('ALL'),
    minReadiness: z
      .preprocess((val) => (val !== undefined && val !== '' ? Number(val) : 0), z.number().int().min(0).max(100))
      .optional()
      .default(0),
    maxReadiness: z
      .preprocess((val) => (val !== undefined && val !== '' ? Number(val) : 100), z.number().int().min(0).max(100))
      .optional()
      .default(100),
    skills: z
      .union([
        z.array(z.string().trim().min(1).max(100)),
        z.string().trim().transform((val) => (val ? val.split(',').map((s) => s.trim()).filter(Boolean) : [])),
      ])
      .optional()
      .default([]),
    evidenceSource: z
      .enum(['SELF_REPORTED', 'ASSESSMENT', 'CODING_INTERVIEW', 'ORAL_INTERVIEW', 'PROJECT', 'ROADMAP_SPRINT'])
      .optional(),
    hasAssessmentProof: z
      .preprocess((val) => {
        if (typeof val === 'boolean') return val;
        if (typeof val === 'string') return val.toLowerCase() === 'true' || val === '1';
        return false;
      }, z.boolean())
      .optional()
      .default(false),
    search: z.string().trim().max(200).optional(),
    sortBy: z.enum(['readiness', 'updatedAt', 'masteredSkillsCount', 'evidenceCount']).optional().default('readiness'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
    page: z
      .preprocess((val) => (val !== undefined && val !== '' ? Number(val) : 1), z.number().int().min(1))
      .optional()
      .default(1),
    limit: z
      .preprocess((val) => (val !== undefined && val !== '' ? Number(val) : 10), z.number().int().min(1).max(100))
      .optional()
      .default(10),
  })
  .refine((data) => data.minReadiness <= data.maxReadiness, {
    message: 'minReadiness cannot be greater than maxReadiness',
    path: ['minReadiness'],
  });

export function validateRecruiterTalentQuery(rawQuery: unknown): RecruiterTalentQueryDTO {
  const result = recruiterTalentQuerySchema.safeParse(rawQuery);
  if (!result.success) {
    const errorDetails = result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
    throw new BadRequestError(`Invalid recruiter search parameters: ${errorDetails}`);
  }
  return result.data as RecruiterTalentQueryDTO;
}
