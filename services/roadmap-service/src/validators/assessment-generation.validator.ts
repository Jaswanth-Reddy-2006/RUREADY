// ═══════════════════════════════════════════════════════════════
// AI Assessment Generation Zod Validators & Semantic Checks
// ═══════════════════════════════════════════════════════════════

import { z } from 'zod';

export const generatedAssessmentQuestionSchema = z.object({
  questionText: z
    .string({ required_error: 'Question text is required' })
    .trim()
    .min(8, 'Question text must be at least 8 characters')
    .max(500, 'Question text cannot exceed 500 characters'),
  questionType: z.enum(['MULTIPLE_CHOICE', 'SINGLE_CHOICE']).default('MULTIPLE_CHOICE'),
  options: z
    .array(
      z.string().trim().min(1, 'Option text cannot be empty').max(300, 'Option text cannot exceed 300 characters')
    )
    .min(2, 'Question must have at least 2 options')
    .max(6, 'Question cannot have more than 6 options'),
  correctOptionIndex: z
    .number({ required_error: 'Correct option index is required' })
    .int('Correct option index must be an integer')
    .min(0, 'Correct option index cannot be negative'),
  explanation: z
    .string({ required_error: 'Explanation is required' })
    .trim()
    .min(5, 'Explanation must be at least 5 characters')
    .max(1000, 'Explanation cannot exceed 1000 characters'),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).default('MEDIUM').optional(),
})
.refine((q) => q.correctOptionIndex < q.options.length, {
  message: 'correctOptionIndex must be a valid index within the options array',
  path: ['correctOptionIndex'],
})
.refine((q) => {
  const unique = new Set(q.options.map((opt) => opt.toLowerCase().trim()));
  return unique.size === q.options.length;
}, {
  message: 'Question options must not contain duplicate entries',
  path: ['options'],
});

export const generatedAssessmentOutputSchema = z.object({
  title: z
    .string({ required_error: 'Assessment title is required' })
    .trim()
    .min(3, 'Assessment title must be at least 3 characters')
    .max(180, 'Assessment title cannot exceed 180 characters'),
  description: z.string().trim().max(1000).optional(),
  questions: z
    .array(generatedAssessmentQuestionSchema)
    .min(1, 'Assessment must contain at least 1 question')
    .max(10, 'Assessment cannot contain more than 10 questions'),
})
.refine((output) => {
  const uniqueQuestions = new Set(output.questions.map((q) => q.questionText.toLowerCase().trim()));
  return uniqueQuestions.size === output.questions.length;
}, {
  message: 'Assessment must not contain duplicate questions',
  path: ['questions'],
});

export type GeneratedAssessmentQuestion = z.infer<typeof generatedAssessmentQuestionSchema>;
export type GeneratedAssessmentOutput = z.infer<typeof generatedAssessmentOutputSchema>;
