import { ArrowLeftIcon, LayoutDashboardIcon, UsersRoundIcon } from "lucide-react";
import Link from "next/link";

import { HMSMark } from "@/components/brand";
import { NavLink } from "@/components/navigation/nav-link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { ROUTES } from "@/lib/constants";

/** Navigation for the administration console. */
export function AdminSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild tooltip="Administration">
              <Link href={ROUTES.admin}>
                <HMSMark className="size-8" />
                <span className="grid flex-1 text-left leading-tight">
                  <span className="truncate text-sm font-semibold">HMS</span>
                  <span className="truncate text-xs text-muted-foreground">
                    Administration
                  </span>
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <nav aria-label="Administration">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <NavLink
                    href={ROUTES.admin}
                    title="Overview"
                    icon={<LayoutDashboardIcon aria-hidden />}
                    exact
                  />
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <NavLink
                    href={ROUTES.adminStaff}
                    title="Staff"
                    icon={<UsersRoundIcon aria-hidden />}
                  />
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </nav>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Staff workspace">
              <Link href={ROUTES.dashboard}>
                <ArrowLeftIcon aria-hidden />
                <span>Staff workspace</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
