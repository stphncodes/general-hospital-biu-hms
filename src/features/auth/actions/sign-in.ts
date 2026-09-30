"use server";

import { redirect } from "next/navigation";

import type { ActionResult } from "@/lib/api";
import { runAction } from "@/lib/api/run-action";
import { ROUTES } from "@/lib/constants";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";
import { safeRedirectPath } from "@/lib/utils";
import { parseInput } from "@/lib/validation";

import { toSignInError } from "../lib/sign-in-errors";
import { signInSchema, type SignInInput } from "../schemas/sign-in";

/**
 * Email/password sign-in. Redirects on success; returns an error otherwise.
 * Errors never reveal whether an account exists (see `toSignInError`).
 */
export async function signIn(input: SignInInput): Promise<ActionResult<never>> {
  return runAction("auth.sign_in", async () => {
    const { email, password, next } = parseInput(signInSchema, input);

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw toSignInError(error);

    logger.info("auth.sign_in.succeeded", { userId: data.user.id });
    redirect(safeRedirectPath(next, ROUTES.dashboard));
  });
}
