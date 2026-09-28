/**
 * Application error model.
 *
 * Every *expected* failure is represented by an `AppError` subclass with a
 * stable machine-readable `code` and a `publicMessage` that is safe to show
 * to end users. Internal detail (SQL errors, stack traces, identifiers) goes
 * in `cause` and is only ever logged server-side, never returned to clients.
 *
 * Anything that is not an `AppError` is treated as an unexpected fault and is
 * reported to users with a generic message. See docs/architecture/README.md.
 */

export const ERROR_CODES = [
  "VALIDATION_FAILED",
  "UNAUTHENTICATED",
  "FORBIDDEN",
  "NOT_FOUND",
  "CONFLICT",
  "RATE_LIMITED",
  "DATABASE_ERROR",
  "INTERNAL_ERROR",
] as const;

export type ErrorCode = (typeof ERROR_CODES)[number];

/** Field path → messages, shaped for mapping onto form fields. */
export type FieldErrors = Record<string, string[]>;

export const HTTP_STATUS_BY_CODE: Record<ErrorCode, number> = {
  VALIDATION_FAILED: 422,
  UNAUTHENTICATED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  RATE_LIMITED: 429,
  DATABASE_ERROR: 500,
  INTERNAL_ERROR: 500,
};

interface AppErrorOptions {
  cause?: unknown;
  fieldErrors?: FieldErrors;
}

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly publicMessage: string;
  readonly fieldErrors?: FieldErrors;

  constructor(code: ErrorCode, publicMessage: string, options: AppErrorOptions = {}) {
    super(publicMessage, { cause: options.cause });
    this.name = new.target.name;
    this.code = code;
    this.publicMessage = publicMessage;
    this.fieldErrors = options.fieldErrors;
  }

  get status(): number {
    return HTTP_STATUS_BY_CODE[this.code];
  }
}

export class ValidationError extends AppError {
  constructor(fieldErrors: FieldErrors, message = "Some fields are invalid.") {
    super("VALIDATION_FAILED", message, { fieldErrors });
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "You need to sign in to continue.") {
    super("UNAUTHENTICATED", message);
  }
}

export class AuthorizationError extends AppError {
  constructor(message = "You do not have permission to perform this action.") {
    super("FORBIDDEN", message);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "The requested record was not found.") {
    super("NOT_FOUND", message);
  }
}

export class ConflictError extends AppError {
  constructor(message = "This change conflicts with the current state of the record.") {
    super("CONFLICT", message);
  }
}

export class RateLimitError extends AppError {
  constructor(message = "Too many requests. Please wait and try again.") {
    super("RATE_LIMITED", message);
  }
}

/**
 * Wraps a database failure. The original error is kept as `cause` for
 * server-side logging; users only ever see the generic message.
 */
export class DatabaseError extends AppError {
  constructor(cause: unknown, message = "A data error occurred. Please try again.") {
    super("DATABASE_ERROR", message, { cause });
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

/** Shape that may safely cross the server → client boundary. */
export interface PublicError {
  code: ErrorCode;
  message: string;
  fieldErrors?: FieldErrors;
}

const GENERIC_MESSAGE = "Something went wrong. Please try again.";

/** Converts any thrown value into a client-safe error. Never leaks internals. */
export function toPublicError(error: unknown): PublicError {
  if (isAppError(error)) {
    return {
      code: error.code,
      message: error.publicMessage,
      ...(error.fieldErrors ? { fieldErrors: error.fieldErrors } : {}),
    };
  }
  return { code: "INTERNAL_ERROR", message: GENERIC_MESSAGE };
}
