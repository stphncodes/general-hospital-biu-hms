import type { ReactNode } from "react";

import { PageTransition } from "@/components/motion";

/** Remounts on navigation, so each admin page eases in. */
export default function AdminTemplate({ children }: { children: ReactNode }) {
  return <PageTransition className="flex flex-1 flex-col">{children}</PageTransition>;
}
