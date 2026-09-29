"use server";

import { redirect } from "next/navigation";

import type { ActionResult } from "@/lib/api";
import { runAction } from "@/lib/api/run-action";
import { getCurrentUser } from "@/lib/auth";
import { ROUTES } from "@/lib/constants";
import {
  AppError,
  AuthenticationError,
  RateLimitError,
  ValidationError,
} from "@/lib/errors";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";
import { parseInput } from "@/lib/validation";

import {
  updatePasswordSchema,
  type UpdatePasswordInput,
} from "../schemas/password-reset";

/**
 * Sets a new password for the current session — the session created by
 * following a recovery link through `/auth/confirm`. Redirects to the
 * dashboard on success.
 */
export async function updatePassword(
  input: UpdatePasswordInput,
): Promise<ActionResult<never>> {
  return runAction("auth.update_password", async () => {
    const { password } = parseInput(updatePasswordSchema, input);

    const user = await getCurrentUser();
    if (!user) {
      throw new AuthenticationError(
        "Your reset link has expired. Request a new one to continue.",
      );
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      switch (error.code) {
        case "weak_password":
          throw new ValidationError(
            { password: ["This password is too weak. Choose a stronger one."] },
            "Choose a stronger password.",
          );
        case "same_password":
          throw new ValidationError(
            { password: ["Choose a password you have not used before."] },
            "Choose a different password.",
          );
        case "reauthentication_needed":
        case "session_not_found":
        case "session_expired":
          throw new AuthenticationError(
            "Your reset link has expired. Request a new one to continue.",
          );
        case "over_request_rate_limit":
          throw new RateLimitError();
        default:
          throw new AppError(
            "INTERNAL_ERROR",
            "Password update is temporarily unavailable.",
            { cause: error },
          );
      }
    }

    logger.info("auth.update_password.succeeded", { userId: user.id });
    redirect(ROUTES.dashboard);
  });
}
