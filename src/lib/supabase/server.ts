import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { getPublicEnv } from "@/config/env";

/**
 * Supabase client for Server Components, Server Actions and Route Handlers.
 *
 * Acts as the signed-in user (RLS applies). Create a new client per request —
 * never share one across requests or store it in a module-level variable.
 */
export async function createClient() {
  // Read cookies first: it marks the route as dynamic before any env
  // validation can run during build-time prerendering.
  const cookieStore = await cookies();
  const env = getPublicEnv();

  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Server Components cannot set cookies. This is safe to ignore
            // because `src/proxy.ts` refreshes the session on every request.
          }
        },
      },
    },
  );
}
