import { LayoutDashboardIcon, ShieldCheckIcon, type LucideIcon } from "lucide-react";
import type { Route } from "next";

import type { Permission } from "@/lib/permissions";

export interface NavItem {
  readonly title: string;
  readonly href: Route;
  readonly icon: LucideIcon;
  /**
   * Permission required to SEE this item. Hiding a link is presentation only;
   * the destination page must enforce access itself.
   */
  readonly permission?: Permission;
}

export interface NavSection {
  readonly label: string;
  readonly items: readonly NavItem[];
}

/**
 * Sidebar navigation. Add an entry only when the module's page actually
 * exists. Never link to placeholder pages.
 */
export const NAV_SECTIONS: readonly NavSection[] = [
  {
    label: "Overview",
    items: [{ title: "Dashboard", href: "/dashboard", icon: LayoutDashboardIcon }],
  },
  {
    label: "Administration",
    items: [
      {
        title: "Admin console",
        href: "/admin",
        icon: ShieldCheckIcon,
        permission: "admin.access",
      },
    ],
  },
];

/** Breadcrumb labels for known path segments; others are title-cased. */
export const SEGMENT_LABELS: Readonly<Record<string, string>> = {
  dashboard: "Dashboard",
  admin: "Administration",
  staff: "Staff",
};
