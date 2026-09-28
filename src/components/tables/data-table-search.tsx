"use client";

import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";

const DEBOUNCE_MS = 350;

interface DataTableSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

/**
 * Debounced search box. Writes `q` to the URL; the server performs the
 * search in the database. Never filters the current page client-side.
 */
export function DataTableSearch({ value, onChange, placeholder }: DataTableSearchProps) {
  const [draft, setDraft] = useState(value);
  const [syncedValue, setSyncedValue] = useState(value);

  // Keep the box in sync when the URL changes elsewhere (e.g. back button).
  // Adjusting state during render avoids a second render pass from an effect.
  if (value !== syncedValue) {
    setSyncedValue(value);
    setDraft(value);
  }

  useEffect(() => {
    if (draft === value) return;
    const timeout = setTimeout(() => onChange(draft), DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [draft, value, onChange]);

  return (
    <div className="relative w-full sm:max-w-xs">
      <SearchIcon
        className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        type="search"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="pl-8"
      />
    </div>
  );
}
