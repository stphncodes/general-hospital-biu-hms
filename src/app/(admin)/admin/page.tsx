import { ArrowRightIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import {
  AccessDenied,
  getAdminContext,
  getAssignableRoles,
  getStaffSummary,
  InviteStaffSheet,
} from "@/features/administration";
import { ROUTES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Administration",
};

export default async function AdminOverviewPage() {
  const context = await getAdminContext();
  if (!context.allowed) return <AccessDenied email={context.user.email} />;

  const [summary, roles] = await Promise.all([
    getStaffSummary(context.tenantId),
    getAssignableRoles(),
  ]);

  const figures = [
    { label: "Staff accounts", value: summary.total },
    { label: "Active", value: summary.active },
    { label: "Invitations not yet accepted", value: summary.pendingInvitations },
    { label: "Administrators", value: summary.administrators },
  ];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8">
      <PageHeader
        title="Administration"
        description="Manage staff accounts and access for your facility."
        actions={
          <InviteStaffSheet roles={roles.map((r) => ({ value: r.id, label: r.name }))} />
        }
      />

      <section aria-labelledby="summary-heading">
        <h2 id="summary-heading" className="sr-only">
          Staff summary
        </h2>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {figures.map((figure) => (
            <div key={figure.label} className="rounded-lg border bg-card p-5">
              <dt className="text-sm text-muted-foreground">{figure.label}</dt>
              <dd className="mt-2 text-3xl font-bold text-heading tabular-nums">
                {figure.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section
        aria-labelledby="next-heading"
        className="rounded-lg border border-l-4 border-l-primary bg-card p-6"
      >
        <h2 id="next-heading" className="text-lg font-bold tracking-tight">
          Staff accounts
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          See everyone with an account, check who has not accepted their invitation yet,
          and invite new staff. Changing roles and deactivating accounts will be added
          next.
        </p>
        <Link
          href={ROUTES.adminStaff}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 hover:underline"
        >
          View staff accounts
          <ArrowRightIcon aria-hidden className="size-4" />
        </Link>
      </section>
    </div>
  );
}
