import { CircleCheckIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { HealthcareIllustration, HMSLogo } from "@/components/brand";
import { Float, Reveal, RevealGroup, RevealItem } from "@/components/motion";
import { SkipLink } from "@/components/shared/skip-link";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { siteConfig } from "@/config/site";
import { ROUTES } from "@/lib/constants";

// Describe design intent, not shipped features: most modules are in development.
const HIGHLIGHTS = [
  "Designed around one record per patient, from admission to discharge",
  "Access scoped to each staff member's role and department",
  "Built on row-level security in the database",
] as const;

/**
 * Two-column auth shell: form on the left, brand panel on the right. The
 * panel is hidden below `lg` so the form stays first and uncluttered on
 * phones and tablets.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col bg-card">
      <SkipLink />
      <div className="grid flex-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="flex min-w-0 flex-col px-4 py-6 sm:px-8 lg:px-12 xl:px-20">
          <header className="flex items-center justify-between gap-4">
            <Link href={ROUTES.home} className="rounded-md">
              <HMSLogo />
              <span className="sr-only"> — home</span>
            </Link>
            <ThemeToggle />
          </header>

          <main
            id="main-content"
            tabIndex={-1}
            className="flex flex-1 items-center py-10 outline-none sm:py-14"
          >
            {/* Spacing between page blocks lives in ./template.tsx. */}
            <div className="mx-auto w-full max-w-sm">{children}</div>
          </main>

          <footer className="text-xs text-muted-foreground">
            {siteConfig.name} · Independent open-source project · Not for clinical use
          </footer>
        </div>

        <aside
          aria-label={`About ${siteConfig.mark}`}
          className="hidden p-4 lg:block lg:py-4 lg:pr-4 lg:pl-0"
        >
          {/* Solid soft-blue brand panel; follows the active theme. */}
          <div className="flex h-full flex-col gap-10 overflow-hidden rounded-lg border bg-primary-soft px-10 pt-14 xl:px-14">
            <RevealGroup immediate delay={0.15} className="max-w-md space-y-5">
              <RevealItem>
                <p className="text-2xl leading-snug font-bold tracking-tight text-heading xl:text-3xl">
                  Hospital management software for clinical and administrative staff
                </p>
              </RevealItem>
              <RevealGroup
                as="ul"
                immediate
                delay={0.3}
                className="space-y-3 text-sm text-foreground"
              >
                {HIGHLIGHTS.map((item) => (
                  <RevealItem as="li" key={item} className="flex items-start gap-2.5">
                    <CircleCheckIcon
                      aria-hidden
                      className="mt-0.5 size-4 shrink-0 text-primary"
                    />
                    <span>{item}</span>
                  </RevealItem>
                ))}
              </RevealGroup>
            </RevealGroup>
            <Reveal immediate delay={0.35} className="relative mt-auto">
              <Float>
                <HealthcareIllustration
                  scene="clinician"
                  className="mx-auto max-h-[58svh] max-w-xl"
                />
              </Float>
            </Reveal>
          </div>
        </aside>
      </div>
    </div>
  );
}
