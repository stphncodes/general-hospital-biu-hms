import { ShieldAlertIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";

/**
 * Shown to signed-in users who lack `admin.access`. Deliberately says nothing
 * about how access is granted beyond "ask an administrator".
 */
export function AccessDenied({ email }: { email: string | null }) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-start gap-4 py-16">
      <ShieldAlertIcon aria-hidden className="size-8 text-destructive" />
      <h1 className="text-2xl font-bold tracking-tight">
        You do not have access to this page
      </h1>
      <p className="text-muted-foreground">
        {email ? (
          <>
            You are signed in as <strong className="text-foreground">{email}</strong>,
            which does not have administrator access.
          </>
        ) : (
          "Your account does not have administrator access."
        )}{" "}
        If you need it, ask an existing administrator.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild>
          <Link href={ROUTES.dashboard}>Go to the staff workspace</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={ROUTES.adminLogin}>Sign in with a different account</Link>
        </Button>
      </div>
    </div>
  );
}
