"use server";

import type { ActionResult } from "@/lib/api";
import { runAction } from "@/lib/api/run-action";
import { RateLimitError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";
import { parseInput } from "@/lib/validation";

import {
  passwordResetRequestSchema,
  type PasswordResetRequestInput,
} from "../schemas/password-reset";

/**
 * Sends a password-recovery email.
 *
 * Always reports success (except when rate limited) so the form cannot be
 * used to discover which staff accounts exist. The email links to
 * `/auth/confirm?type=recovery&next=/reset-password` — see the recovery
 * template in `supabase/templates/recovery.html`.
 */
export async function requestPasswordReset(
  input: PasswordResetRequestInput,
): Promise<ActionResult<void>> {
  return runAction("auth.password_reset_request", async () => {
    const { email } = parseInput(passwordResetRequestSchema, input);

    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      if (
        error.code === "over_request_rate_limit" ||
        error.code === "over_email_send_rate_limit"
      ) {
        throw new RateLimitError();
      }
      // Anything else is logged but not surfaced: revealing it could leak
      // whether the account exists.
      logger.warn("auth.password_reset_request.provider_error", { code: error.code });
    }
  });
}
