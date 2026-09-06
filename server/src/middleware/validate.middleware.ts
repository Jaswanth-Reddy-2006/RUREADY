// ═══════════════════════════════════════════════════════════════
// R U Ready? — Validation Middleware
// Zod-based request validation for body, query, and params
// ═══════════════════════════════════════════════════════════════

import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ValidationError } from '../lib/errors.js';

interface ValidationSchemas {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

/**
 * Creates Express middleware that validates request body, query params,
 * and/or route params against Zod schemas.
 *
 * On validation failure, throws a ValidationError with field-level details.
 * On success, replaces req.body / req.query / req.params with the
 * parsed (and transformed) values from Zod.
 *
 * @example
 * ```ts
 * router.post('/register', validate({ body: registerSchema }), controller);
 * ```
 */
export function validate(schemas: ValidationSchemas) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }

      if (schemas.query) {
        req.query = schemas.query.parse(req.query) as typeof req.query;
      }

      if (schemas.params) {
        req.params = schemas.params.parse(req.params) as typeof req.params;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Transform Zod errors into a field → messages map
        const details: Record<string, string[]> = {};

        for (const issue of error.issues) {
          const field = issue.path.join('.');
          const key = field || '_root';

          if (!details[key]) {
            details[key] = [];
          }

          details[key].push(issue.message);
        }

        next(new ValidationError('Validation failed', details));
        return;
      }

      next(error);
    }
  };
}
