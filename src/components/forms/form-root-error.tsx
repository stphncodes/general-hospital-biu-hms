import { CircleAlertIcon } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";

/** Form-level error summary (e.g. "Invalid email or password."). */
export function FormRootError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <Alert variant="destructive" role="alert">
      <CircleAlertIcon aria-hidden />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
