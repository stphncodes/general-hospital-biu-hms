import { CircleAlertIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { AuthHeader } from "@/components/layout/auth-header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SignInForm } from "@/features/auth";
import { ROUTES } from "@/lib/constants";
import { safeRedirectPath } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Sign in",
};

/** Allow-listed messages for `?error=` codes; unknown codes are ignored. */
const ERROR_MESSAGES: Readonly<Record<string, string>> = {
  link_invalid: "This link is invalid or has expired. Please request a new one.",
};

export default async function SignInPage({ searchParams }: PageProps<"/">) {
  const { next, error } = await searchParams;
  const safeNext =
    typeof next === "string" ? safeRedirectPath(next, ROUTES.dashboard) : undefined;
  const errorMessage = typeof error === "string" ? ERROR_MESSAGES[error] : undefined;

  return (
    <>
      <AuthHeader
        title="Sign in"
        description="Welcome back. Use your staff account to continue."
      />
      {errorMessage && (
        <Alert variant="destructive">
          <CircleAlertIcon aria-hidden />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      <SignInForm next={safeNext} />
      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href={ROUTES.register}
          className="font-medium text-primary hover:text-primary-hover hover:underline hover:underline-offset-4"
        >
          Register
        </Link>
      </p>
    </>
  );
}
