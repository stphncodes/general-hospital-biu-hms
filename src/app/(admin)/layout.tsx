import { cookies } from "next/headers";
import type { ReactNode } from "react";

import { AppHeader } from "@/components/layout/app-header";
import { SkipLink } from "@/components/shared/skip-link";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar, getAdminContext } from "@/features/administration";
import { UserMenu } from "@/features/auth";

/** Cookie written by the shadcn Sidebar to remember its expanded state. */
const SIDEBAR_STATE_COOKIE = "sidebar_state";

/**
 * Administration console shell. Signed-out visitors are redirected to
 * /admin/login by `getAdminContext`. Users without `admin.access` get a plain
 * shell (no admin navigation); each page renders its own access-denied state
 * because layouts are not an access boundary.
 */
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const [context, cookieStore] = await Promise.all([getAdminContext(), cookies()]);

  if (!context.allowed) {
    return (
      <main id="main-content" tabIndex={-1} className="min-h-svh px-4 outline-none">
        {children}
      </main>
    );
  }

  const defaultOpen = cookieStore.get(SIDEBAR_STATE_COOKIE)?.value !== "false";

  return (
    <>
      <SkipLink />
      <SidebarProvider defaultOpen={defaultOpen}>
        <AdminSidebar />
        <SidebarInset>
          <AppHeader userMenu={<UserMenu email={context.user.email} />} />
          <main
            id="main-content"
            tabIndex={-1}
            className="flex flex-1 flex-col p-4 outline-none md:p-6"
          >
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
