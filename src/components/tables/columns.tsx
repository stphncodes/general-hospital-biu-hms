"use client";

import type { RowData } from "@tanstack/react-table";
import { MoreHorizontalIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { DataTableColumnDef } from "./data-table-features";

/** Checkbox column for row selection (current page). Place first in `columns`. */
export function createSelectionColumn<
  TData extends RowData,
>(): DataTableColumnDef<TData> {
  return {
    id: "select",
    enableSorting: false,
    enableHiding: false,
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() ? "indeterminate" : false)
        }
        onCheckedChange={(checked) => table.toggleAllPageRowsSelected(checked === true)}
        aria-label="Select all rows on this page"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onCheckedChange={(checked) => row.toggleSelected(checked === true)}
        aria-label="Select row"
      />
    ),
  };
}

interface RowActionsProps {
  /** Describes the row for screen readers, e.g. a record number. */
  rowLabel: string;
  /** `DropdownMenuItem`s. Each action must be permission-checked on the server. */
  children: ReactNode;
}

/** Per-row "…" actions menu. */
export function DataTableRowActions({ rowLabel, children }: RowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${rowLabel}`}>
          <MoreHorizontalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">{children}</DropdownMenuContent>
    </DropdownMenu>
  );
}
