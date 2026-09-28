"use client";

import type { RowData } from "@tanstack/react-table";
import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { DataTableColumn } from "./data-table-features";

interface DataTableColumnHeaderProps<TData extends RowData, TValue> {
  column: DataTableColumn<TData, TValue>;
  title: string;
  className?: string;
}

/**
 * Sortable column header. Sorting is applied by the server; the column id
 * must be on that query's allow-list of sortable columns.
 */
export function DataTableColumnHeader<TData extends RowData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <span className={className}>{title}</span>;
  }

  const sorted = column.getIsSorted();
  const Icon =
    sorted === "asc"
      ? ArrowUpIcon
      : sorted === "desc"
        ? ArrowDownIcon
        : ChevronsUpDownIcon;

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn("-ml-2 h-8", className)}
      onClick={column.getToggleSortingHandler()}
    >
      {title}
      <Icon className="text-muted-foreground" aria-hidden />
    </Button>
  );
}
