// ═══════════════════════════════════════════════════════════════
// AI Roadmap Response Parser & Zod Validator Bridge
// ═══════════════════════════════════════════════════════════════

import {
  generatedRoadmapOutputSchema,
  GeneratedRoadmapOutput,
} from '../validators/roadmap-generation.validator.js';
import {
  generatedAssessmentOutputSchema,
  GeneratedAssessmentOutput,
} from '../validators/assessment-generation.validator.js';

export type ParserErrorCode = 'EMPTY_RESPONSE' | 'INVALID_JSON' | 'SCHEMA_VALIDATION_ERROR';

export class RoadmapParserError extends Error {
  public readonly code: ParserErrorCode;
  public readonly rawText?: string;
  public readonly zodErrors?: Array<{ path: string; message: string }>;

  constructor(
    message: string,
    code: ParserErrorCode,
    rawText?: string,
    zodErrors?: Array<{ path: string; message: string }>
  ) {
    super(message);
    this.name = 'RoadmapParserError';
    this.code = code;
    this.rawText = rawText;
    this.zodErrors = zodErrors;
  }
}

/**
 * Strips markdown code block wrappers (e.g. ```json ... ``` or ``` ... ```)
 * from LLM raw text output.
 */
export function stripMarkdownFences(text: string): string {
  let cleaned = text.trim();

  // Strip leading ```json or ```
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.slice(3);
  }

  // Strip trailing ```
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3);
  }

  return cleaned.trim();
}

/**
 * Extracts a candidate JSON substring from raw text using bracket boundaries.
 */
export function extractJsonCandidate(text: string): string {
  const stripped = stripMarkdownFences(text);
  const firstBrace = stripped.indexOf('{');
  const lastBrace = stripped.lastIndexOf('}');

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return stripped.slice(firstBrace, lastBrace + 1);
  }

  return stripped;
}

/**
 * Parses and strictly validates raw AI text against generatedRoadmapOutputSchema.
 *
 * @throws RoadmapParserError on empty response, JSON parse failure, or schema invalidation.
 */
export function parseAndValidateRoadmapAIResponse(rawText: string | undefined | null): GeneratedRoadmapOutput {
  if (!rawText || typeof rawText !== 'string' || !rawText.trim()) {
    throw new RoadmapParserError('AI response was empty or whitespace-only.', 'EMPTY_RESPONSE', rawText ?? undefined);
  }

  const jsonCandidate = extractJsonCandidate(rawText);
  let parsedObj: unknown;

  try {
    parsedObj = JSON.parse(jsonCandidate);
  } catch (err) {
    throw new RoadmapParserError(
      `AI response failed JSON parsing: ${(err as Error).message}`,
      'INVALID_JSON',
      rawText
    );
  }

  const validationResult = generatedRoadmapOutputSchema.safeParse(parsedObj);

  if (!validationResult.success) {
    const formattedErrors = validationResult.error.errors.map((e) => ({
      path: e.path.join('.'),
      message: e.message,
    }));

    const summary = formattedErrors.map((e) => `[${e.path || 'root'}]: ${e.message}`).join(', ');

    throw new RoadmapParserError(
      `AI response failed Roadmap schema validation: ${summary}`,
      'SCHEMA_VALIDATION_ERROR',
      rawText,
      formattedErrors
    );
  }

  return validationResult.data;
}

/**
 * Parses and strictly validates raw AI text against generatedAssessmentOutputSchema.
 *
 * @throws RoadmapParserError on empty response, JSON parse failure, or schema invalidation.
 */
export function parseAndValidateAssessmentAIResponse(rawText: string | undefined | null): GeneratedAssessmentOutput {
  if (!rawText || typeof rawText !== 'string' || !rawText.trim()) {
    throw new RoadmapParserError('AI response was empty or whitespace-only.', 'EMPTY_RESPONSE', rawText ?? undefined);
  }

  const jsonCandidate = extractJsonCandidate(rawText);
  let parsedObj: unknown;

  try {
    parsedObj = JSON.parse(jsonCandidate);
  } catch (err) {
    throw new RoadmapParserError(
      `AI response failed JSON parsing: ${(err as Error).message}`,
      'INVALID_JSON',
      rawText
    );
  }

  const validationResult = generatedAssessmentOutputSchema.safeParse(parsedObj);

  if (!validationResult.success) {
    const formattedErrors = validationResult.error.errors.map((e) => ({
      path: e.path.join('.'),
      message: e.message,
    }));

    const summary = formattedErrors.map((e) => `[${e.path || 'root'}]: ${e.message}`).join(', ');

    throw new RoadmapParserError(
      `AI assessment response failed schema validation: ${summary}`,
      'SCHEMA_VALIDATION_ERROR',
      rawText,
      formattedErrors
    );
  }

  return validationResult.data;
}

