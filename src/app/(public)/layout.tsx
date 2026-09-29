import Link from "next/link";
import type { ReactNode } from "react";

import { HMSLogo } from "@/components/brand";
import { SiteHeader } from "@/components/marketing/site-header";
import { SkipLink } from "@/components/shared/skip-link";
import { siteConfig } from "@/config/site";
import { ROUTES } from "@/lib/constants";

const REPO = siteConfig.repositoryUrl;

const FOOTER_LINKS = [
  { href: REPO, label: "Source code" },
  { href: `${REPO}/blob/main/SECURITY.md`, label: "Report a security issue" },
  { href: `${REPO}/blob/main/CONTRIBUTING.md`, label: "Contributing" },
  { href: `${REPO}/blob/main/LICENSE`, label: "Licence (Apache-2.0)" },
] as const;

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <SkipLink />
      <SiteHeader />

      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>

      <footer className="border-t-4 border-t-primary bg-card">
        <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <Link href={ROUTES.home} className="inline-block rounded-md">
              <HMSLogo size="sm" />
              <span className="sr-only"> — home</span>
            </Link>
            <nav aria-label="Project">
              <ul className="flex flex-col gap-3 text-sm sm:flex-row sm:flex-wrap sm:gap-x-6">
                {FOOTER_LINKS.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <p className="max-w-3xl border-t pt-6 text-sm leading-relaxed text-muted-foreground">
            An independent open-source project inspired by the work of {siteConfig.name},
            Borno State, Nigeria. It is not affiliated with, endorsed by or operated by
            the hospital.
          </p>
        </div>
      </footer>
    </div>
  );
}
