import { CircleCheckIcon, CircleDashedIcon } from "lucide-react";
import type { Metadata } from "next";

import { HMSMark } from "@/components/brand";
import { RevealGroup, RevealItem } from "@/components/motion";
import { HMS_MODULES } from "@/config/modules";
import { siteConfig } from "@/config/site";
import { requireUser } from "@/lib/auth";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Dashboard",
};

const FOUNDATION: ReadonlyArray<{ label: string; done: boolean }> = [
  { label: "Secure sign-in and password reset", done: true },
  { label: "Permission-based access model (deny by default)", done: true },
  { label: "Application shell and navigation", done: true },
  { label: "Clinical and administrative modules", done: false },
];

/**
 * Landing page of the authenticated application.
 *
 * Deliberately shows no statistics: there is no clinical data model yet, and
 * a hospital dashboard must never display invented figures.
 */
export default async function DashboardPage() {
  const user = await requireUser();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6">
      <section className="rounded-lg border border-l-4 border-l-primary bg-card px-6 py-8 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {siteConfig.name} · {siteConfig.product}
            </p>
            <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
            {user.email && (
              <p className="text-sm text-muted-foreground">
                Signed in as{" "}
                <span className="font-medium text-foreground">{user.email}</span>
              </p>
            )}
          </div>
          <HMSMark className="hidden size-12 sm:block" />
        </div>
      </section>

      <div className="grid flex-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <section
          aria-labelledby="foundation-heading"
          className="rounded-lg border bg-card p-6"
        >
          <h2 id="foundation-heading" className="text-base font-semibold">
            System status
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            What is in place in this development build.
          </p>
          <RevealGroup as="ul" immediate delay={0.15} className="mt-5 space-y-3">
            {FOUNDATION.map(({ label, done }) => (
              <RevealItem
                as="li"
                key={label}
                className="flex items-start gap-2.5 text-sm"
              >
                {done ? (
                  <CircleCheckIcon
                    aria-hidden
                    className="mt-0.5 size-4 shrink-0 text-primary"
                  />
                ) : (
                  <CircleDashedIcon
                    aria-hidden
                    className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                  />
                )}
                <span className={cn(!done && "text-muted-foreground")}>
                  {label}
                  <span className="sr-only">
                    {done ? " (complete)" : " (in progress)"}
                  </span>
                </span>
              </RevealItem>
            ))}
          </RevealGroup>
        </section>

        <section
          aria-labelledby="roadmap-heading"
          className="rounded-lg border bg-card p-6"
        >
          <h2 id="roadmap-heading" className="text-base font-semibold">
            Module roadmap
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Modules appear in the navigation as they are built and as your account is
            granted permission to use them.
          </p>
          <RevealGroup
            as="ul"
            immediate
            delay={0.2}
            stagger={0.05}
            className="mt-5 grid gap-3 sm:grid-cols-2"
          >
            {HMS_MODULES.map(({ icon: Icon, title, summary }) => (
              <RevealItem
                as="li"
                key={title}
                className="flex gap-3 rounded-lg border bg-background p-3.5"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary-soft text-primary-soft-foreground">
                  <Icon aria-hidden className="size-4" />
                </span>
                <span className="min-w-0 space-y-0.5">
                  <span className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-heading">{title}</span>
                    <span className="rounded-full border px-1.5 py-px text-[10px] font-medium text-muted-foreground">
                      Planned
                    </span>
                  </span>
                  <span className="block text-xs leading-relaxed text-muted-foreground">
                    {summary}
                  </span>
                </span>
              </RevealItem>
            ))}
          </RevealGroup>
        </section>
      </div>
    </div>
  );
}
