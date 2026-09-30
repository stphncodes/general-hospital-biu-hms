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
  "One record per patient, from registration to discharge",
  "Each person sees only what their role allows",
  "Access is checked again in the database itself",
] as const;

/**
 * Staff and admin sign-in shell.
 *
 * Left: one narrow column (logo, form card, footer) so the form stays
 * anchored however wide the screen is. Right: a green brand panel capped in
 * width, hidden below `lg` so phones and tablets get the form first.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-svh bg-background lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,40rem)]">
      <SkipLink />

      <div className="mx-auto flex min-h-svh w-full max-w-md flex-col px-5 py-6 sm:py-10">
        <header className="flex items-center justify-between gap-4">
          <Link href={ROUTES.home} className="rounded-md">
            <HMSLogo />
            <span className="sr-only"> — sign in</span>
          </Link>
          <ThemeToggle />
        </header>

        <main
          id="main-content"
          tabIndex={-1}
          className="flex flex-1 items-center py-10 outline-none"
        >
          <div className="w-full rounded-lg border border-t-4 border-t-primary bg-card p-6 shadow-sm sm:p-8">
            {/* Spacing between page blocks lives in ./template.tsx. */}
            {children}
          </div>
        </main>

        <footer className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <p>{siteConfig.name} · Not for clinical use</p>
          <a
            href={siteConfig.repositoryUrl}
            className="font-medium text-foreground underline-offset-4 hover:text-primary hover:underline"
          >
            Source code
          </a>
        </footer>
      </div>

      <aside aria-label={`About ${siteConfig.mark}`} className="hidden p-3 lg:block">
        {/* Solid brand panel. In dark mode the bright primary would glare, so it
            uses the deep soft green instead. */}
        <div className="sticky top-3 flex h-[calc(100svh-1.5rem)] flex-col gap-8 overflow-hidden rounded-lg bg-primary p-10 text-primary-foreground dark:bg-primary-soft dark:text-foreground">
          <RevealGroup immediate delay={0.15} className="space-y-5">
            <RevealItem>
              <p className="text-3xl leading-tight font-bold tracking-tight text-balance">
                Patient care and hospital administration in one system
              </p>
            </RevealItem>
            <RevealGroup as="ul" immediate delay={0.3} className="space-y-2.5">
              {HIGHLIGHTS.map((item) => (
                <RevealItem as="li" key={item} className="flex items-start gap-3">
                  <CircleCheckIcon aria-hidden className="mt-0.5 size-5 shrink-0" />
                  <span>{item}</span>
                </RevealItem>
              ))}
            </RevealGroup>
          </RevealGroup>

          <Reveal
            immediate
            delay={0.35}
            className="flex min-h-0 flex-1 items-center justify-center rounded-lg bg-card p-6"
          >
            <Float className="flex h-full w-full items-center justify-center">
              <HealthcareIllustration scene="ward" className="h-full max-h-full w-full" />
            </Float>
          </Reveal>
        </div>
      </aside>
    </div>
  );
}
