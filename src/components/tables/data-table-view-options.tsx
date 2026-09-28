"use client";

import type { RowData } from "@tanstack/react-table";
import { Settings2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { DataTableInstance } from "./data-table-features";

/** Column show/hide menu. Useful on narrow screens and for dense clinical lists. */
export function DataTableViewOptions<TData extends RowData>({
  table,
}: {
  table: DataTableInstance<TData>;
}) {
  const hideableColumns = table
    .getAllLeafColumns()
    .filter((column) => column.getCanHide());
  if (hideableColumns.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto">
          <Settings2Icon aria-hidden /> Columns
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Visible columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {hideableColumns.map((column) => {
          const header = column.columnDef.header;
          const label =
            column.columnDef.meta?.label ??
            (typeof header === "string" ? header : column.id);
          return (
            <DropdownMenuCheckboxItem
              key={column.id}
              checked={column.getIsVisible()}
              onCheckedChange={(checked) => column.toggleVisibility(checked)}
              onSelect={(event) => event.preventDefault()}
            >
              {label}
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
