import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { requireUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Dashboard",
};

/**
 * Landing page of the authenticated application.
 *
 * Deliberately shows no statistics: there is no clinical data model yet, and
 * a hospital dashboard must never display invented figures.
 */
export default async function DashboardPage() {
  await requireUser();

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <PageHeader title={siteConfig.name} description={siteConfig.product} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Application foundation</CardTitle>
          <CardDescription>
            Authentication, the application shell and the engineering foundation are in
            place. Clinical and administrative modules have not been implemented yet; they
            will be added after requirements analysis and domain modelling.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Modules will appear in the navigation as they are built and as your account is
          granted the permissions to use them.
        </CardContent>
      </Card>
    </div>
  );
}
