"use client";

import { LogOutIcon, UserIcon } from "lucide-react";
import { useTransition } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { signOut } from "../actions/sign-out";

/**
 * Account menu. Staff profile details (name, role, department) will be shown
 * here once the staff domain model exists; for now only the verified sign-in
 * email is available.
 */
export function UserMenu({ email }: { email: string | null }) {
  const [isPending, startTransition] = useTransition();
  const initial = email?.charAt(0).toUpperCase() ?? "?";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          aria-label="Account menu"
        >
          <Avatar className="size-7">
            <AvatarFallback className="text-xs">{initial}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex items-center gap-2 font-normal">
          <UserIcon className="size-4 text-muted-foreground" aria-hidden />
          <span className="truncate">{email ?? "Signed in"}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={isPending}
          onSelect={(event) => {
            event.preventDefault();
            startTransition(() => signOut());
          }}
        >
          <LogOutIcon aria-hidden />
          {isPending ? "Signing out…" : "Sign out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
