"use server";

import { redirect } from "next/navigation";

import type { ActionResult } from "@/lib/api";
import { runAction } from "@/lib/api/run-action";
import { ROUTES } from "@/lib/constants";
import { AppError, AuthenticationError, RateLimitError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";
import { safeRedirectPath } from "@/lib/utils";
import { parseInput } from "@/lib/validation";

import { signInSchema, type SignInInput } from "../schemas/sign-in";

/**
 * Email/password sign-in. Redirects on success; returns an error otherwise.
 *
 * Unknown email and wrong password produce the same message so the form
 * cannot be used to discover which staff accounts exist.
 */
export async function signIn(input: SignInInput): Promise<ActionResult<never>> {
  return runAction("auth.sign_in", async () => {
    const { email, password, next } = parseInput(signInSchema, input);

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      switch (error.code) {
        case "invalid_credentials":
          throw new AuthenticationError("Invalid email or password.");
        case "email_not_confirmed":
          throw new AuthenticationError(
            "Please verify your email address before signing in.",
          );
        case "over_request_rate_limit":
        case "over_email_send_rate_limit":
          throw new RateLimitError();
        default:
          // Unexpected (e.g. Auth service unavailable): logged in full by
          // runAction, reported generically to the user.
          throw new AppError("INTERNAL_ERROR", "Sign-in is temporarily unavailable.", {
            cause: error,
          });
      }
    }

    logger.info("auth.sign_in.succeeded", { userId: data.user.id });
    redirect(safeRedirectPath(next, ROUTES.dashboard));
  });
}
