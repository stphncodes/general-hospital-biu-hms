import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="mx-auto flex min-h-svh max-w-md flex-col items-center justify-center gap-4 px-4 text-center"
    >
      <p className="font-mono text-sm text-muted-foreground">404</p>
      <h1 className="text-2xl font-semibold tracking-tight">Page not found</h1>
      <p className="text-sm text-muted-foreground">
        The page you requested does not exist or is not available.
      </p>
      <Button asChild variant="outline">
        <Link href={ROUTES.home}>Return to the start page</Link>
      </Button>
    </main>
  );
}
