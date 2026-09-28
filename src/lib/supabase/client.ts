import { createBrowserClient } from "@supabase/ssr";

import { getPublicEnv } from "@/config/env";

/**
 * Supabase client for Client Components.
 *
 * Runs with the signed-in user's session (from cookies) and the publishable
 * key, so every query is constrained by Row Level Security. It cannot bypass
 * RLS. `createBrowserClient` returns a singleton in the browser.
 */
export function createClient() {
  const env = getPublicEnv();
  return createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}
