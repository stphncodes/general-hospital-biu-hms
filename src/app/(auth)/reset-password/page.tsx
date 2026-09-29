import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthHeader } from "@/components/layout/auth-header";
import { ResetPasswordForm } from "@/features/auth";
import { getCurrentUser } from "@/lib/auth";
import { ROUTES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Set a new password",
};

/**
 * Reached from a recovery (or invitation) email via `/auth/confirm`, which
 * establishes the session this page relies on. Without a session the link
 * was invalid or has expired.
 */
export default async function ResetPasswordPage() {
  const user = await getCurrentUser();
  if (!user) redirect(`${ROUTES.signIn}?error=link_invalid`);

  return (
    <>
      <AuthHeader
        title="Set a new password"
        description={
          user.email ? (
            <>
              Choose a new password for{" "}
              <strong className="font-medium text-foreground">{user.email}</strong>.
            </>
          ) : (
            "Choose a new password for your account."
          )
        }
      />
      <ResetPasswordForm />
    </>
  );
}
