import { CircleAlertIcon } from "lucide-react";
import type { Metadata } from "next";

import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

export default async function SignInPage({ searchParams }: PageProps<"/sign-in">) {
  const { next, error } = await searchParams;
  const safeNext =
    typeof next === "string" ? safeRedirectPath(next, ROUTES.dashboard) : undefined;
  const errorMessage = typeof error === "string" ? ERROR_MESSAGES[error] : undefined;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h1 className="text-lg">Sign in</h1>
        </CardTitle>
        <CardDescription>
          Staff accounts are created by an administrator. There is no public registration.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {errorMessage && (
          <Alert variant="destructive">
            <CircleAlertIcon aria-hidden />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        <SignInForm next={safeNext} />
      </CardContent>
    </Card>
  );
}
