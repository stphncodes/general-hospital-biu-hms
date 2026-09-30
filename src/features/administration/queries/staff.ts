import "server-only";

import { redirect } from "next/navigation";
import { cache } from "react";
import { z } from "zod";

import { getCurrentUser, getPrincipal, type AuthenticatedUser } from "@/lib/auth";
import { ROUTES } from "@/lib/constants";
import { fromPostgrestError } from "@/lib/errors";
import { tenantWithPermission, type Principal } from "@/lib/permissions";
import { createClient } from "@/lib/supabase/server";
import { toRange, type ListParams } from "@/lib/validation";

import type { StaffMember, StaffSummary } from "../types/staff";

export type AdminContext =
  | {
      readonly allowed: true;
      user: AuthenticatedUser;
      principal: Principal;
      tenantId: string;
    }
  | { readonly allowed: false; user: AuthenticatedUser };

/**
 * Resolves the signed-in user's administration context. Redirects to the
 * admin sign-in page when signed out; returns `allowed: false` when the user
 * lacks `admin.access`, so the page can show an access-denied message.
 *
 * Every admin page calls this itself: layouts do not re-run on client
 * navigation, so they are not an access boundary.
 */
export const getAdminContext = cache(async (): Promise<AdminContext> => {
  const user = await getCurrentUser();
  if (!user) redirect(ROUTES.adminLogin);

  const principal = await getPrincipal();
  const tenantId = tenantWithPermission(principal, "admin.access");
  if (!principal || !tenantId) return { allowed: false, user };

  return { allowed: true, user, principal, tenantId };
});

/* ---- Staff directory ------------------------------------------------------ */

/** Columns the directory can be sorted by (allow-list; mirrors the SQL). */
export const STAFF_SORTABLE_COLUMNS = [
  "full_name",
  "email",
  "last_sign_in_at",
  "invited_at",
] as const;
type StaffSortColumn = (typeof STAFF_SORTABLE_COLUMNS)[number];

const staffRowSchema = z.object({
  user_id: z.uuid(),
  full_name: z.string(),
  email: z.string().nullable(),
  job_title: z.string().nullable(),
  status: z.enum(["active", "deactivated"]),
  roles: z.array(z.string()),
  invited_at: z.string().nullable(),
  last_sign_in_at: z.string().nullable(),
  total_count: z.coerce.number(),
});

export async function getStaffDirectory(
  tenantId: string,
  params: ListParams,
): Promise<{ rows: StaffMember[]; total: number }> {
  const sort: StaffSortColumn = (STAFF_SORTABLE_COLUMNS as readonly string[]).includes(
    params.sort ?? "",
  )
    ? (params.sort as StaffSortColumn)
    : "full_name";
  const { from } = toRange(params);

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("staff_directory", {
    p_tenant_id: tenantId,
    p_search: params.q ?? null,
    p_sort: sort,
    p_ascending: params.sort ? params.order === "asc" : true,
    p_limit: params.pageSize,
    p_offset: from,
  });
  if (error) throw fromPostgrestError(error);

  const parsed = z.array(staffRowSchema).parse(data ?? []);
  return {
    total: parsed[0]?.total_count ?? 0,
    rows: parsed.map((row) => ({
      id: row.user_id,
      fullName: row.full_name,
      email: row.email,
      jobTitle: row.job_title,
      status: row.status,
      roles: row.roles,
      invitedAt: row.invited_at,
      lastSignInAt: row.last_sign_in_at,
    })),
  };
}

/* ---- Summary --------------------------------------------------------------- */

const summarySchema = z.object({
  total: z.coerce.number(),
  active: z.coerce.number(),
  pending_invitations: z.coerce.number(),
  administrators: z.coerce.number(),
});

export async function getStaffSummary(tenantId: string): Promise<StaffSummary> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("staff_summary", { p_tenant_id: tenantId });
  if (error) throw fromPostgrestError(error);

  const row = summarySchema.parse(Array.isArray(data) ? data[0] : data);
  return {
    total: row.total,
    active: row.active,
    pendingInvitations: row.pending_invitations,
    administrators: row.administrators,
  };
}

/* ---- Roles ----------------------------------------------------------------- */

const roleSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  description: z.string(),
});

export type AssignableRole = z.infer<typeof roleSchema>;

/** Roles that can be given to a new staff member (RLS: readable when signed in). */
export async function getAssignableRoles(): Promise<AssignableRole[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("roles")
    .select("id, name, description")
    .order("name");
  if (error) throw fromPostgrestError(error);
  return z.array(roleSchema).parse(data ?? []);
}
