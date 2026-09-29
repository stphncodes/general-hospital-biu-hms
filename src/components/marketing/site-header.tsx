import Link from "next/link";

import { HMSLogo } from "@/components/brand";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";

const SECTION_LINKS = [
  { href: "/#journey", label: "How it works" },
  { href: "/#modules", label: "Modules" },
  { href: "/#security", label: "Data protection" },
] as const;

/** Public site header: solid surface, follows the active theme. */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-card">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href={ROUTES.home} className="min-w-0 rounded-md">
          <HMSLogo compactOnMobile />
          <span className="sr-only"> — home</span>
        </Link>

        <nav aria-label="Sections" className="hidden items-center gap-1 lg:flex">
          {SECTION_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground underline-offset-4 hover:text-primary hover:underline"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <nav aria-label="Account" className="flex items-center gap-1.5 sm:gap-2">
          <Button asChild variant="ghost" className="h-9 px-3 font-semibold text-heading">
            <Link href={ROUTES.signIn}>Login</Link>
          </Button>
          <Button asChild className="h-9 px-4 font-semibold">
            <Link href={ROUTES.register}>Register</Link>
          </Button>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
