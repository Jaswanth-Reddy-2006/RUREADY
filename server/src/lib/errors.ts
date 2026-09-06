// ═══════════════════════════════════════════════════════════════
// R U Ready? — Custom Error Classes
// Structured errors with HTTP status codes for the global handler
// ═══════════════════════════════════════════════════════════════

/**
 * Base application error. All custom errors extend this.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_ERROR',
    isOperational: boolean = true,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;

    // Maintain proper stack trace in V8 engines
    Error.captureStackTrace(this, this.constructor);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * 400 — General Bad Request errors
 */
export class BadRequestError extends AppError {
  constructor(message: string = 'Bad request') {
    super(message, 400, 'BAD_REQUEST');
  }
}

/**
 * 400 — Validation errors
 */
export class ValidationError extends AppError {
  public readonly details?: Record<string, string[]>;

  constructor(
    message: string = 'Validation failed',
    details?: Record<string, string[]>,
  ) {
    super(message, 400, 'VALIDATION_ERROR');
    this.details = details;
  }
}

/**
 * 401 — Authentication errors (missing/invalid token, bad credentials)
 */
export class AuthError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, 'AUTH_ERROR');
  }
}

/**
 * 401 — Token expired errors
 */
export class TokenExpiredError extends AuthError {
  constructor(message: string = 'Access token has expired') {
    super(message);
    // Explicitly set custom operational error code for client-side routing
    (this as any).code = 'TOKEN_EXPIRED';
  }
}

/**
 * 403 — Authorization / forbidden errors
 */
export class ForbiddenError extends AppError {
  constructor(message: string = 'Access denied') {
    super(message, 403, 'FORBIDDEN');
  }
}

/**
 * 404 — Resource not found
 */
export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND');
  }
}

/**
 * 409 — Conflict (e.g., duplicate email)
 */
export class ConflictError extends AppError {
  constructor(message: string = 'Resource already exists') {
    super(message, 409, 'CONFLICT');
  }
}

/**
 * 429 — Too many requests
 */
export class RateLimitError extends AppError {
  public readonly retryAfterSecs: number;

  constructor(retryAfterSecs: number = 60) {
    super('Too many requests. Please try again later.', 429, 'RATE_LIMITED');
    this.retryAfterSecs = retryAfterSecs;
  }
}
