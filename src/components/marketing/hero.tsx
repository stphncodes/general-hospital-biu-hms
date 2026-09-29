import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

import { HealthcareIllustration } from "@/components/brand";
import { Float, Reveal, WordReveal } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { ROUTES } from "@/lib/constants";

/**
 * Landing hero: what the system is, who it is for and how to get in, beside
 * the ward illustration. Solid surfaces only (see docs/design/README.md).
 */
export function Hero() {
  return (
    <section className="border-b bg-card">
      <div className="mx-auto grid min-h-[calc(100svh-7rem)] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div className="max-w-xl">
          <h1 className="text-4xl leading-tight font-bold tracking-tight sm:text-5xl lg:text-[3.5rem]">
            <WordReveal
              immediate
              lines={[{ text: "One patient record for the whole hospital" }]}
            />
          </h1>

          <Reveal immediate delay={0.35} className="mt-6 space-y-4">
            <p className="text-lg leading-relaxed text-foreground">
              {siteConfig.mark} is an open-source hospital management system being built
              for general hospitals like {siteConfig.name}. It brings registration, wards,
              pharmacy, laboratory and billing together around a single record for each
              patient.
            </p>
            <p className="text-base leading-relaxed text-muted-foreground">
              Staff accounts are issued by the hospital&apos;s system administrator.
            </p>
          </Reveal>

          <Reveal immediate delay={0.5} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild className="h-11 px-5 text-base font-semibold">
              <Link href={ROUTES.signIn}>
                Staff sign in
                <ArrowRightIcon aria-hidden data-icon="inline-end" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-11 px-5 text-base font-semibold"
            >
              <Link href={ROUTES.register}>How to get an account</Link>
            </Button>
          </Reveal>
        </div>

        <Reveal immediate delay={0.2} className="mx-auto w-full max-w-xl lg:max-w-none">
          <Float>
            <HealthcareIllustration scene="ward" />
          </Float>
        </Reveal>
      </div>
    </section>
  );
}
