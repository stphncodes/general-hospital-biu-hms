import type { ReactNode } from "react";

import { PageTransition } from "@/components/motion";

/** Remounts on navigation, so moving between auth pages eases in. */
export default function AuthTemplate({ children }: { children: ReactNode }) {
  return <PageTransition className="space-y-6">{children}</PageTransition>;
}
