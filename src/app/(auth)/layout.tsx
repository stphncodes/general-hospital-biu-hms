import { HospitalIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { DevelopmentNotice } from "@/components/shared/development-notice";
import { siteConfig } from "@/config/site";
import { ROUTES } from "@/lib/constants";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <DevelopmentNotice />
      <main
        id="main-content"
        className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-12"
      >
        <Link href={ROUTES.home} className="flex items-center gap-2 font-semibold">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <HospitalIcon className="size-4" aria-hidden />
          </span>
          <span>{siteConfig.name}</span>
        </Link>
        <div className="w-full max-w-sm">{children}</div>
      </main>
    </div>
  );
}
