import { ArrowLeftIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { AuthHeader } from "@/components/layout/auth-header";
import { ForgotPasswordForm } from "@/features/auth";
import { ROUTES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Reset password",
};

export default function ForgotPasswordPage() {
  return (
    <>
      <AuthHeader
        title="Reset your password"
        description="Enter the email address on your staff account and we'll send you a link to choose a new password."
      />
      <ForgotPasswordForm />
      <p className="text-center text-sm">
        <Link
          href={ROUTES.signIn}
          className="inline-flex items-center gap-1.5 font-medium text-primary hover:text-primary-hover hover:underline hover:underline-offset-4"
        >
          <ArrowLeftIcon aria-hidden className="size-4" />
          Back to sign in
        </Link>
      </p>
    </>
  );
}
