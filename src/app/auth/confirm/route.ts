import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { z } from "zod";

import { ROUTES } from "@/lib/constants";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";
import { safeRedirectPath } from "@/lib/utils";

/**
 * Verifies links sent by Supabase Auth emails (email confirmation, staff
 * invitation, password recovery, email change) using the token-hash flow,
 * which works across devices and browsers.
 *
 * Configure the Supabase email templates to link to:
 *   {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=<type>&next=<path>
 */
const confirmParamsSchema = z.object({
  token_hash: z.string().min(1).max(512),
  type: z.enum(["signup", "invite", "magiclink", "recovery", "email_change", "email"]),
});

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const parsed = confirmParamsSchema.safeParse({
    token_hash: searchParams.get("token_hash"),
    type: searchParams.get("type"),
  });

  if (parsed.success) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp(parsed.data);
    if (!error) {
      redirect(safeRedirectPath(searchParams.get("next"), ROUTES.dashboard));
    }
    logger.info("auth.confirm.rejected", { type: parsed.data.type, code: error.code });
  }

  redirect(`${ROUTES.signIn}?error=link_invalid`);
}
