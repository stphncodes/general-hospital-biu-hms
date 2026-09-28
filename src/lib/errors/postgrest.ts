import { type AppError, ConflictError, DatabaseError, NotFoundError } from "./app-error";

/** Minimal structural type for errors returned by supabase-js / PostgREST. */
export interface PostgrestLikeError {
  code?: string;
  message: string;
  details?: string | null;
  hint?: string | null;
}

/**
 * Maps a PostgREST/PostgreSQL error to an `AppError`.
 *
 * Only well-understood codes are mapped to specific user-facing errors. The
 * raw error is always attached as `cause` for server-side logging and is
 * never exposed to the client.
 *
 * Reference: https://www.postgresql.org/docs/current/errcodes-appendix.html
 */
export function fromPostgrestError(error: PostgrestLikeError): AppError {
  switch (error.code) {
    // PostgREST: `.single()` matched no rows
    case "PGRST116":
      return new NotFoundError();
    // unique_violation
    case "23505":
      return new ConflictError("A record with these details already exists.");
    // foreign_key_violation
    case "23503":
      return new ConflictError(
        "This record is referenced by, or references, other records.",
      );
    // insufficient_privilege — typically a Row Level Security denial. Reported
    // as a generic data error so that RLS policies are not disclosed.
    case "42501":
    default:
      return new DatabaseError(error);
  }
}
