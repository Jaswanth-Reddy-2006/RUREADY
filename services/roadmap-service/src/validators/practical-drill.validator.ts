// ═══════════════════════════════════════════════════════════════
// Practical Drill Submission Validator — Zod Contracts
// ═══════════════════════════════════════════════════════════════

import { z } from 'zod';

export const submitPracticalDrillSchema = z.object({
  roadmapId: z.string().trim().max(100).optional(),
  nodeId: z.string().trim().max(100).optional(),
  userRoadmapId: z.string().trim().max(100).optional(),
  sprintTaskId: z.string().trim().max(100).optional(),
  skillId: z.string().trim().max(100).optional(),
  code: z
    .string({ required_error: 'Code submission is required' })
    .min(1, 'Code submission cannot be empty')
    .max(65536, 'Code submission exceeds 64KB size limit'),
  language: z
    .string({ required_error: 'Language is required' })
    .transform((val) => val.toLowerCase().trim())
    .pipe(
      z.enum(['javascript', 'typescript', 'js', 'ts', 'python', 'py'], {
        errorMap: () => ({
          message: 'Unsupported programming language. Supported languages: javascript, typescript, python',
        }),
      })
    ),
  entryPoint: z.string().trim().max(100).optional(),
});

export type SubmitPracticalDrillInput = z.infer<typeof submitPracticalDrillSchema>;
