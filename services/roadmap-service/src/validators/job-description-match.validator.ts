// ═══════════════════════════════════════════════════════════════
// Job Description Matching Validator — Stage 10.2
// Strict Zod Validation for Job Description Candidate Matching
// ═══════════════════════════════════════════════════════════════

import { z } from 'zod';
import { JobDescriptionMatchInputDTO, normalizeSkillList } from '@ru-ready/shared';
import { BadRequestError } from '../lib/errors.js';

export const jobDescriptionMatchInputSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, { message: 'Job title must be at least 2 characters long' })
    .max(200, { message: 'Job title cannot exceed 200 characters' }),
  description: z
    .string()
    .trim()
    .max(25000, { message: 'Job description text cannot exceed 25,000 characters' })
    .optional()
    .default(''),
  targetCompanyTier: z.enum(['FAANG', 'TIER_1', 'STARTUP', 'ALL']).optional().default('ALL'),
  requiredSkills: z
    .union([
      z.array(z.string().trim().min(1).max(100)),
      z.string().trim().transform((val) => (val ? val.split(',').map((s) => s.trim()).filter(Boolean) : [])),
    ])
    .optional()
    .default([])
    .transform((skills) => normalizeSkillList(skills)),
  preferredSkills: z
    .union([
      z.array(z.string().trim().min(1).max(100)),
      z.string().trim().transform((val) => (val ? val.split(',').map((s) => s.trim()).filter(Boolean) : [])),
    ])
    .optional()
    .default([])
    .transform((skills) => normalizeSkillList(skills)),
  minMatchScore: z
    .preprocess((val) => (val !== undefined && val !== '' ? Number(val) : 0), z.number().min(0).max(100))
    .optional()
    .default(0),
  page: z
    .preprocess((val) => (val !== undefined && val !== '' ? Number(val) : 1), z.number().int().min(1))
    .optional()
    .default(1),
  limit: z
    .preprocess((val) => (val !== undefined && val !== '' ? Number(val) : 10), z.number().int().min(1).max(100))
    .optional()
    .default(10),
});

export function validateJobDescriptionMatchInput(raw: unknown): JobDescriptionMatchInputDTO {
  const result = jobDescriptionMatchInputSchema.safeParse(raw);
  if (!result.success) {
    const errorDetails = result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
    throw new BadRequestError(`Invalid job description parameters: ${errorDetails}`);
  }
  return result.data as JobDescriptionMatchInputDTO;
}
