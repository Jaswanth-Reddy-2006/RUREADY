// ═══════════════════════════════════════════════════════════════
// Bulk Credential Verification Validator — Stage 11.4
// Strict Zod Validation for Bulk Verification Batches
// ═══════════════════════════════════════════════════════════════

import { z } from 'zod';
import { BulkCredentialVerificationQueryDTO } from '@ru-ready/shared';
import { BadRequestError } from '../lib/errors.js';

export const bulkCredentialVerificationSchema = z.object({
  credentialIds: z
    .array(z.string().trim().min(1, 'Credential ID cannot be empty').max(200))
    .min(1, 'At least one credential ID is required for verification')
    .max(100, 'Maximum batch size for bulk credential verification is 100'),
  institution: z.string().trim().max(100).optional(),
  organizationId: z.string().trim().max(100).optional(),
  allowPartial: z.boolean().optional().default(true),
});

export function validateBulkCredentialVerificationInput(raw: unknown): BulkCredentialVerificationQueryDTO {
  const result = bulkCredentialVerificationSchema.safeParse(raw);
  if (!result.success) {
    const errorDetails = result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
    throw new BadRequestError(`Invalid bulk credential verification input: ${errorDetails}`);
  }
  return result.data as BulkCredentialVerificationQueryDTO;
}
