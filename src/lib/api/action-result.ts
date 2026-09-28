import type { PublicError } from "@/lib/errors";

/**
 * Discriminated union returned by every Server Action.
 *
 * Server Actions return errors as values instead of throwing, because thrown
 * errors are replaced by a generic message in production and cannot carry
 * field-level validation feedback back to a form.
 */
export type ActionResult<TData = void> =
  | { readonly ok: true; readonly data: TData }
  | { readonly ok: false; readonly error: PublicError };

export function actionOk(): ActionResult<void>;
export function actionOk<TData>(data: TData): ActionResult<TData>;
export function actionOk<TData>(data?: TData): ActionResult<TData | undefined> {
  return { ok: true, data };
}

export function actionError(error: PublicError): ActionResult<never> {
  return { ok: false, error };
}
