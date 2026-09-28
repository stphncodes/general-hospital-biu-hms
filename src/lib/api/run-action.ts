import "server-only";

import { unstable_rethrow } from "next/navigation";

import { isAppError, toPublicError } from "@/lib/errors";
import { logger } from "@/lib/logger";

import { actionError, actionOk, type ActionResult } from "./action-result";

/**
 * Executes Server Action logic with consistent error handling:
 *
 *  - Next.js control-flow errors (`redirect()`, `notFound()`) are rethrown.
 *  - `AppError`s become their public representation.
 *  - Anything else is logged (redacted) and reported generically.
 *
 * `name` is a stable event name such as "auth.sign_in".
 */
export async function runAction<TData>(
  name: string,
  handler: () => Promise<TData>,
): Promise<ActionResult<TData>> {
  try {
    return actionOk(await handler());
  } catch (error) {
    unstable_rethrow(error);

    if (isAppError(error)) {
      logger.info(`${name}.rejected`, { code: error.code });
    } else {
      logger.error(`${name}.failed`, { error });
    }
    return actionError(toPublicError(error));
  }
}
