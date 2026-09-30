import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import {
  AccessDenied,
  getAdminContext,
  getAssignableRoles,
  getStaffDirectory,
  InviteStaffSheet,
  StaffTable,
} from "@/features/administration";
import { parseListParams } from "@/lib/validation";

export const metadata: Metadata = {
  title: "Staff accounts",
};

export default async function AdminStaffPage({
  searchParams,
}: PageProps<"/admin/staff">) {
  const context = await getAdminContext();
  if (!context.allowed) return <AccessDenied email={context.user.email} />;

  const params = parseListParams(await searchParams);
  const [directory, roles] = await Promise.all([
    getStaffDirectory(context.tenantId, params),
    getAssignableRoles(),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6">
      <PageHeader
        title="Staff accounts"
        description="Everyone with an account in your facility."
        actions={
          <InviteStaffSheet roles={roles.map((r) => ({ value: r.id, label: r.name }))} />
        }
      />
      <StaffTable rows={directory.rows} total={directory.total} />
    </div>
  );
}
