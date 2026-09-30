import { CircleAlertIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AuthHeader } from "@/components/layout/auth-header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { adminSignIn } from "@/features/administration";
import { SignInForm } from "@/features/auth";
import { getPrincipal } from "@/lib/auth";
import { ROUTES } from "@/lib/constants";
import { hasPermissionInAnyScope } from "@/lib/permissions";
import { safeRedirectPath } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Administrator sign in",
};

export default async function AdminLoginPage({
  searchParams,
}: PageProps<"/admin/login">) {
  // Administrators who are already signed in go straight to the console.
  const principal = await getPrincipal();
  if (hasPermissionInAnyScope(principal, "admin.access")) redirect(ROUTES.admin);

  const { next } = await searchParams;
  const safeNext =
    typeof next === "string" ? safeRedirectPath(next, ROUTES.admin) : undefined;

  return (
    <>
      <AuthHeader
        title="Administrator sign in"
        description="For system administrators managing staff accounts and access."
      />
      {principal && (
        <Alert>
          <CircleAlertIcon aria-hidden />
          <AlertDescription>
            You are signed in with an account that does not have administrator access.
            Signing in here will switch accounts.
          </AlertDescription>
        </Alert>
      )}
      <SignInForm next={safeNext} action={adminSignIn} showForgotPassword={false} />
      <p className="text-sm text-muted-foreground">
        Not an administrator? Use the{" "}
        <Link
          href={ROUTES.signIn}
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          staff sign-in page
        </Link>
        .
      </p>
    </>
  );
}
