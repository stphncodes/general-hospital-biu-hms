import { cookies } from "next/headers";
import type { ReactNode } from "react";

import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { QueryProvider } from "@/components/providers/query-provider";
import { SkipLink } from "@/components/shared/skip-link";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { UserMenu } from "@/features/auth";
import { getPrincipal, requireUser } from "@/lib/auth";

/** Cookie written by the shadcn Sidebar to remember its expanded state. */
const SIDEBAR_STATE_COOKIE = "sidebar_state";

/**
 * Authenticated application shell.
 *
 * `requireUser()` here gives a correct first render, but it is NOT the access
 * control for child pages: layouts do not re-run on client navigation, so
 * every page and data function performs its own check.
 */
export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const [user, principal, cookieStore] = await Promise.all([
    requireUser(),
    getPrincipal(),
    cookies(),
  ]);
  const defaultOpen = cookieStore.get(SIDEBAR_STATE_COOKIE)?.value !== "false";

  return (
    <QueryProvider>
      <SkipLink />
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar principal={principal ?? { userId: user.id, grants: [] }} />
        <SidebarInset>
          <AppHeader userMenu={<UserMenu email={user.email} />} />
          <main
            id="main-content"
            tabIndex={-1}
            className="flex flex-1 flex-col p-4 outline-none md:p-6"
          >
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </QueryProvider>
  );
}
