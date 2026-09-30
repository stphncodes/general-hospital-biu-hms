"use server";

import type { Route } from "next";
import { redirect } from "next/navigation";

import { signInSchema, toSignInError, type SignInInput } from "@/features/auth";
import type { ActionResult } from "@/lib/api";
import { runAction } from "@/lib/api/run-action";
import { toGrants } from "@/lib/auth/grants";
import { ROUTES } from "@/lib/constants";
import { AuthorizationError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { hasPermissionInAnyScope } from "@/lib/permissions";
import { createClient } from "@/lib/supabase/server";
import { safeRedirectPath } from "@/lib/utils";
import { parseInput } from "@/lib/validation";

/** Post-sign-in destination, limited to the admin console. */
function adminDestination(next: string | undefined): Route {
  const path = safeRedirectPath(next, ROUTES.admin);
  return path === ROUTES.admin || path.startsWith(`${ROUTES.admin}/`)
    ? path
    : ROUTES.admin;
}

/**
 * Sign-in for the administration console. Same credentials as staff sign-in,
 * but the account must hold `admin.access`; otherwise the new session is
 * ended immediately and the attempt is refused.
 */
export async function adminSignIn(input: SignInInput): Promise<ActionResult<never>> {
  return runAction("admin.sign_in", async () => {
    const { email, password, next } = parseInput(signInSchema, input);

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw toSignInError(error);

    // The client now carries the new session, so this returns the new
    // user's grants.
    const { data: rows, error: grantsError } = await supabase.rpc("current_user_grants");
    const principal = {
      userId: data.user.id,
      grants: grantsError ? [] : toGrants(rows),
    };

    if (!hasPermissionInAnyScope(principal, "admin.access")) {
      await supabase.auth.signOut({ scope: "local" });
      logger.warn("admin.sign_in.denied", { userId: data.user.id });
      throw new AuthorizationError("This account does not have administrator access.");
    }

    logger.info("admin.sign_in.succeeded", { userId: data.user.id });
    redirect(adminDestination(next));
  });
}
