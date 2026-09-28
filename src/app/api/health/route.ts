import { NextResponse } from "next/server";

/**
 * Liveness probe for uptime monitoring and load balancers.
 *
 * Intentionally dependency-free (no database or auth call) and excluded from
 * the auth proxy, so it reports whether the web process is serving requests.
 * It returns no version, environment or configuration detail.
 */
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(
    { status: "ok" },
    { headers: { "Cache-Control": "no-store" } },
  );
}
