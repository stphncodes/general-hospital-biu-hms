"use server";

import { revalidatePath } from "next/cache";

import type { ActionResult } from "@/lib/api";
import { runAction } from "@/lib/api/run-action";
import { getPrincipal } from "@/lib/auth";
import { ROUTES } from "@/lib/constants";
import {
  AppError,
  AuthenticationError,
  AuthorizationError,
  ConflictError,
  fromPostgrestError,
  RateLimitError,
} from "@/lib/errors";
import { logger } from "@/lib/logger";
import { authorize, tenantWithPermission } from "@/lib/permissions";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { parseInput } from "@/lib/validation";

import { inviteStaffSchema, type InviteStaffInput } from "../schemas/invite-staff";

/**
 * Invites a new staff member and gives them their first role.
 *
 *  1. Validate input.
 *  2. Authorize: `staff.invite` and `roles.assign` in the admin's facility.
 *  3. Send the Supabase invitation (Auth admin API: needs the secret key).
 *  4. Create the profile and role assignment with the admin's own session,
 *     so row-level security enforces the same permissions again. If that
 *     fails, the invited auth user is removed so nothing is left half-made.
 *
 * The invitation email links to /auth/confirm → /reset-password, where the
 * new user chooses a password (see supabase/templates/invite.html).
 */
export async function inviteStaff(
  input: InviteStaffInput,
): Promise<ActionResult<{ email: string }>> {
  return runAction("admin.staff_invite", async () => {
    const { fullName, email, jobTitle, roleId } = parseInput(inviteStaffSchema, input);

    const principal = await getPrincipal();
    if (!principal) throw new AuthenticationError();
    const tenantId = tenantWithPermission(principal, "staff.invite");
    if (!tenantId) throw new AuthorizationError();
    authorize(principal, "roles.assign", { tenantId });

    let admin: ReturnType<typeof createAdminClient>;
    try {
      admin = createAdminClient();
    } catch (cause) {
      throw new AppError(
        "INTERNAL_ERROR",
        "Inviting staff is not configured on this server. Ask your system administrator to set SUPABASE_SECRET_KEY.",
        { cause },
      );
    }

    const { data: invited, error: inviteError } =
      await admin.auth.admin.inviteUserByEmail(email, { data: { full_name: fullName } });
    if (inviteError) {
      switch (inviteError.code) {
        case "email_exists":
        case "user_already_exists":
          throw new ConflictError("An account with this email address already exists.");
        case "over_email_send_rate_limit":
        case "over_request_rate_limit":
          throw new RateLimitError();
        default:
          throw new AppError("INTERNAL_ERROR", "The invitation could not be sent.", {
            cause: inviteError,
          });
      }
    }
    const userId = invited.user.id;

    const supabase = await createClient();
    const { error: provisionError } = await supabase.rpc("provision_staff", {
      p_user_id: userId,
      p_tenant_id: tenantId,
      p_full_name: fullName,
      p_job_title: jobTitle,
      p_role_id: roleId,
    });
    if (provisionError) {
      const { error: cleanupError } = await admin.auth.admin.deleteUser(userId);
      if (cleanupError) {
        logger.error("admin.staff_invite.cleanup_failed", {
          userId,
          error: cleanupError,
        });
      }
      throw fromPostgrestError(provisionError);
    }

    // Audit trail placeholder until the audit table exists (docs/security).
    logger.info("admin.staff_invite.succeeded", {
      actorId: principal.userId,
      userId,
      roleId,
      tenantId,
    });

    revalidatePath(ROUTES.admin);
    revalidatePath(ROUTES.adminStaff);
    return { email };
  });
}
