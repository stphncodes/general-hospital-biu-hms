import "server-only";

import { NextResponse } from "next/server";

import { HTTP_STATUS_BY_CODE, isAppError, toPublicError } from "@/lib/errors";
import { logger } from "@/lib/logger";

type RouteHandler<TContext> = (request: Request, context: TContext) => Promise<Response>;

/**
 * Wraps a Route Handler so that failures produce a consistent JSON error body
 * `{ error: { code, message, fieldErrors? } }` without leaking internals.
 *
 * Only create Route Handlers for genuine HTTP endpoints (webhooks, health
 * checks, integrations). UI mutations should use Server Actions.
 */
export function withErrorHandling<TContext>(
  name: string,
  handler: RouteHandler<TContext>,
): RouteHandler<TContext> {
  return async (request, context) => {
    try {
      return await handler(request, context);
    } catch (error) {
      if (isAppError(error)) {
        logger.info(`${name}.rejected`, { code: error.code });
      } else {
        logger.error(`${name}.failed`, { error });
      }
      const publicError = toPublicError(error);
      return NextResponse.json(
        { error: publicError },
        { status: HTTP_STATUS_BY_CODE[publicError.code] },
      );
    }
  };
}
