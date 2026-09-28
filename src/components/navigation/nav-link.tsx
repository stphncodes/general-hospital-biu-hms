"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { SidebarMenuButton } from "@/components/ui/sidebar";

interface NavLinkProps {
  href: Route;
  title: string;
  icon: ReactNode;
}

/** Sidebar link that highlights itself for the current route and its children. */
export function NavLink({ href, title, icon }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <SidebarMenuButton asChild isActive={isActive} tooltip={title}>
      <Link href={href} aria-current={isActive ? "page" : undefined}>
        {icon}
        <span>{title}</span>
      </Link>
    </SidebarMenuButton>
  );
}
