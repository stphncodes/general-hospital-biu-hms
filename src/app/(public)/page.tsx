import { TriangleAlertIcon } from "lucide-react";
import Link from "next/link";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { ROUTES } from "@/lib/constants";

export default function HomePage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-16">
      <div className="space-y-3">
        <p className="text-sm font-medium text-primary">{siteConfig.product}</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {siteConfig.name}
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          An open-source Hospital Information System designed as an independent software
          project inspired by the operational context of General Hospital Biu, Borno
          State, Nigeria.
        </p>
      </div>

      <Alert>
        <TriangleAlertIcon aria-hidden />
        <AlertTitle>Development software</AlertTitle>
        <AlertDescription>
          This system is under active development. It is not officially affiliated with
          General Hospital Biu, is not approved for clinical use, and must not be used
          with real patient data.
        </AlertDescription>
      </Alert>

      <div>
        <Button asChild>
          <Link href={ROUTES.signIn}>Staff sign in</Link>
        </Button>
      </div>
    </div>
  );
}
