import { HospitalIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { SkipLink } from "@/components/shared/skip-link";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { siteConfig } from "@/config/site";
import { ROUTES } from "@/lib/constants";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <SkipLink />
      <header className="border-b">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link href={ROUTES.home} className="flex items-center gap-2 font-semibold">
            <HospitalIcon className="size-5 text-primary" aria-hidden />
            <span>{siteConfig.name}</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
      <footer className="border-t py-6 text-xs text-muted-foreground">
        <div className="mx-auto max-w-5xl space-y-1 px-4">
          <p>
            Independent open-source project. Not affiliated with, endorsed by or operated
            by General Hospital Biu. Not approved for clinical use.
          </p>
          <p>
            <a href={siteConfig.repositoryUrl} className="underline underline-offset-4">
              Source code
            </a>{" "}
            · Licensed under Apache-2.0
          </p>
        </div>
      </footer>
    </div>
  );
}
