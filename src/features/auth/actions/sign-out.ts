"use server";

import { redirect } from "next/navigation";

import { ROUTES } from "@/lib/constants";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";

/** Ends the current session (this device) and returns to the sign-in page. */
export async function signOut(): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut({ scope: "local" });
  if (error) {
    // Cookies are cleared regardless; log so failed server-side revocation is visible.
    logger.warn("auth.sign_out.failed", { error });
  }
  redirect(ROUTES.signIn);
}
