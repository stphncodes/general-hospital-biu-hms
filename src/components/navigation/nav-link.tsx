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
  /** Highlight only on this exact path, not its children (e.g. an overview). */
  exact?: boolean;
}

/** Sidebar link that highlights itself for the current route and its children. */
export function NavLink({ href, title, icon, exact = false }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || (!exact && pathname.startsWith(`${href}/`));

  return (
    <SidebarMenuButton
      asChild
      isActive={isActive}
      tooltip={title}
      className="transition-colors data-active:bg-primary-soft data-active:font-semibold data-active:text-primary-soft-foreground"
    >
      <Link href={href} aria-current={isActive ? "page" : undefined}>
        {icon}
        <span>{title}</span>
      </Link>
    </SidebarMenuButton>
  );
}
