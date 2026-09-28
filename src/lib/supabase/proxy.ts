import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { getPublicEnv } from "@/config/env";

/**
 * Refreshes the Supabase auth session for an incoming request and returns
 * the verified user id (or `null`), plus the response that carries any
 * refreshed auth cookies.
 *
 * Called from `src/proxy.ts`. Callers that redirect MUST copy cookies from
 * `response` onto the redirect, or the refreshed session is lost.
 */
export async function updateSession(request: NextRequest) {
  const env = getPublicEnv();
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          for (const { name, value } of cookiesToSet) request.cookies.set(name, value);
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
          // Cache-control headers that stop CDNs caching auth responses.
          for (const [key, value] of Object.entries(headers ?? {})) {
            response.headers.set(key, value);
          }
        },
      },
    },
  );

  // Do not run code between client creation and this call: it performs the
  // token refresh. `getClaims()` verifies the JWT signature, unlike
  // `getSession()`, whose contents must never be trusted on the server.
  const { data } = await supabase.auth.getClaims();
  const userId = typeof data?.claims.sub === "string" ? data.claims.sub : null;

  return { response, userId };
}
