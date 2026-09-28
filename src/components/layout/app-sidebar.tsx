import { HospitalIcon } from "lucide-react";
import Link from "next/link";

import { NAV_SECTIONS } from "@/components/navigation/nav-config";
import { NavLink } from "@/components/navigation/nav-link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { siteConfig } from "@/config/site";
import { ROUTES } from "@/lib/constants";
import { hasPermissionInAnyScope, type Principal } from "@/lib/permissions";

/**
 * Primary navigation. A Server Component: items are filtered by permission
 * on the server, so links a user cannot use are never sent to the browser.
 * On small screens the shadcn Sidebar renders as an off-canvas sheet.
 */
export function AppSidebar({ principal }: { principal: Principal }) {
  const sections = NAV_SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter(
      (item) => !item.permission || hasPermissionInAnyScope(principal, item.permission),
    ),
  })).filter((section) => section.items.length > 0);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild tooltip={siteConfig.name}>
              <Link href={ROUTES.dashboard}>
                <span className="flex aspect-square size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <HospitalIcon className="size-4" aria-hidden />
                </span>
                <span className="grid flex-1 text-left leading-tight">
                  <span className="truncate text-sm font-semibold">
                    {siteConfig.name}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {siteConfig.product}
                  </span>
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <nav aria-label="Main">
          {sections.map((section) => (
            <SidebarGroup key={section.label}>
              <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {section.items.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <NavLink
                        href={item.href}
                        title={item.title}
                        icon={<item.icon aria-hidden />}
                      />
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </nav>
      </SidebarContent>

      <SidebarFooter>
        <p className="px-2 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
          Development build · not for clinical use
        </p>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
