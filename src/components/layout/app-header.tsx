import type { ReactNode } from "react";

import { AppBreadcrumbs } from "@/components/navigation/app-breadcrumbs";
import { NotificationsMenu } from "@/components/shared/notifications-menu";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

/**
 * Top bar of the authenticated shell. `userMenu` is a slot so this generic
 * layout component does not depend on the auth feature.
 */
export function AppHeader({ userMenu }: { userMenu: ReactNode }) {
  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b bg-card px-4">
      <SidebarTrigger className="-ml-1" aria-label="Toggle navigation" />
      <Separator
        orientation="vertical"
        className="mr-1 data-[orientation=vertical]:h-5"
      />
      <AppBreadcrumbs />
      <div className="ml-auto flex items-center gap-1">
        <NotificationsMenu />
        <ThemeToggle />
        {userMenu}
      </div>
    </header>
  );
}
