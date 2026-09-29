import { ArrowRightIcon, ShieldCheckIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { AuthHeader } from "@/components/layout/auth-header";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Request access",
};

const STEPS = [
  {
    title: "Contact your administrator",
    body: "Ask your head of department or the hospital ICT unit to create an account with your work email and role.",
  },
  {
    title: "Accept your invitation",
    body: "You will receive an invitation email. Follow the link to confirm your address.",
  },
  {
    title: "Set your password",
    body: "Choose a password, then sign in to reach the areas your role allows.",
  },
] as const;

/**
 * Staff accounts are provisioned by an administrator (see
 * src/features/auth/README.md), so "Register" explains how to get access
 * instead of offering public sign-up.
 */
export default function RegisterPage() {
  return (
    <>
      <AuthHeader
        title="Request staff access"
        description="Accounts are issued by the hospital's system administrator, not through self-registration. This keeps patient information limited to verified staff."
      />

      <ol className="space-y-5 rounded-lg border bg-background p-5">
        {STEPS.map((step, index) => (
          <li key={step.title} className="flex gap-3.5">
            <span
              aria-hidden
              className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary-soft text-sm font-semibold text-primary-soft-foreground"
            >
              {index + 1}
            </span>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-heading">{step.title}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
        <ShieldCheckIcon aria-hidden className="mt-px size-4 shrink-0 text-primary" />
        We never ask for your password by email or phone.
      </p>

      <div className="space-y-4">
        <Button asChild className="h-10 w-full">
          <Link href={ROUTES.signIn}>
            I have an account — sign in
            <ArrowRightIcon aria-hidden data-icon="inline-end" />
          </Link>
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Forgotten your password?{" "}
          <Link
            href={ROUTES.forgotPassword}
            className="font-medium text-primary hover:text-primary-hover hover:underline hover:underline-offset-4"
          >
            Reset it
          </Link>
        </p>
      </div>
    </>
  );
}
