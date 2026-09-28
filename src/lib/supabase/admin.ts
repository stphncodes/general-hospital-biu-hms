import "server-only";

import { createClient } from "@supabase/supabase-js";

import { getPublicEnv } from "@/config/env";
import { getServerEnv } from "@/config/env.server";

/**
 * PRIVILEGED Supabase client using the secret key. It BYPASSES Row Level
 * Security.
 *
 * Rules:
 *  - Only for operations that have no end-user context and cannot be
 *    expressed under RLS (e.g. provisioning staff accounts via the Auth
 *    admin API, scheduled maintenance).
 *  - The caller must perform its own authorization check first, and the
 *    operation must be audit-logged.
 *  - Never use it to read or write data on behalf of a signed-in user —
 *    use `@/lib/supabase/server` so RLS applies.
 *
 * `server-only` makes importing this from client code a build error.
 */
export function createAdminClient() {
  const { NEXT_PUBLIC_SUPABASE_URL } = getPublicEnv();
  const { SUPABASE_SECRET_KEY } = getServerEnv();

  if (!SUPABASE_SECRET_KEY) {
    throw new Error("SUPABASE_SECRET_KEY is not configured. See .env.example.");
  }

  return createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
  });
}
