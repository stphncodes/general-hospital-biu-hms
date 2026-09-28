"use client";

import { useTable, type RowData } from "@tanstack/react-table";
import type { ReactNode } from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

import {
  dataTableFeatures,
  type DataTableColumnDef,
  type DataTableInstance,
} from "./data-table-features";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableSearch } from "./data-table-search";
import { DataTableViewOptions } from "./data-table-view-options";
import { useTableUrlState } from "./use-table-url-state";

export interface DataTableProps<TData extends RowData> {
  /** Must be referentially stable — define columns at module scope. */
  columns: DataTableColumnDef<TData>[];
  /** One page of rows, already sorted/filtered/paginated by the server. */
  data: TData[];
  /** Total number of matching rows on the server (for page count). */
  rowCount: number;
  /** Stable row identity (e.g. the record UUID). Required for correct selection. */
  getRowId: (row: TData) => string;
  /** Screen-reader description of the table's contents. */
  caption: string;
  /** Placeholder for the search box; omit to hide search. */
  searchPlaceholder?: string;
  enableRowSelection?: boolean;
  /** Extra toolbar content, e.g. bulk actions for selected rows. */
  toolbar?: (table: DataTableInstance<TData>) => ReactNode;
  emptyMessage?: string;
}

/**
 * Server-driven data table. Renders one page supplied by a Server Component
 * and reflects sort / page / search changes into the URL.
 *
 * Typical usage (in a feature's client component):
 *
 *   const columns: DataTableColumnDef<Row>[] = [...]; // module scope
 *   <DataTable columns={columns} data={rows} rowCount={total} getRowId={(r) => r.id} caption="…" />
 */
export function DataTable<TData extends RowData>({
  columns,
  data,
  rowCount,
  getRowId,
  caption,
  searchPlaceholder,
  enableRowSelection = false,
  toolbar,
  emptyMessage = "No results.",
}: DataTableProps<TData>) {
  const url = useTableUrlState();

  const table = useTable({
    features: dataTableFeatures,
    columns,
    data,
    getRowId,
    rowCount,
    manualPagination: true,
    manualSorting: true,
    enableMultiSort: false,
    enableRowSelection,
    state: { sorting: url.sorting, pagination: url.pagination },
    onSortingChange: url.onSortingChange,
    onPaginationChange: url.onPaginationChange,
  });

  const rows = table.getRowModel().rows;
  const visibleColumnCount = table.getVisibleLeafColumns().length;
  const selectedCount = Object.keys(table.state.rowSelection).length;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {searchPlaceholder && (
          <DataTableSearch
            value={url.search}
            onChange={url.setSearch}
            placeholder={searchPlaceholder}
          />
        )}
        {toolbar?.(table)}
        <DataTableViewOptions table={table} />
      </div>

      <div
        className={cn(
          "rounded-md border transition-opacity",
          url.isPending && "opacity-60",
        )}
        aria-busy={url.isPending}
      >
        <Table>
          <TableCaption className="sr-only">{caption}</TableCaption>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const sorted = header.column.getIsSorted();
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      aria-sort={
                        sorted === "asc"
                          ? "ascending"
                          : sorted === "desc"
                            ? "descending"
                            : header.column.getCanSort()
                              ? "none"
                              : undefined
                      }
                    >
                      {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.length > 0 ? (
              rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={visibleColumnCount}
                  className="h-24 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination
        pageIndex={url.pagination.pageIndex}
        pageSize={url.pagination.pageSize}
        pageCount={table.getPageCount()}
        rowCount={rowCount}
        selectedCount={enableRowSelection ? selectedCount : undefined}
        onPageIndexChange={(pageIndex) => table.setPageIndex(pageIndex)}
        onPageSizeChange={(pageSize) => table.setPageSize(pageSize)}
      />
    </div>
  );
}
