"use client";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react";
import { useId } from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PAGE_SIZE_OPTIONS } from "@/lib/validation";

interface DataTablePaginationProps {
  pageIndex: number;
  pageSize: number;
  pageCount: number;
  rowCount: number;
  /** Omit when row selection is disabled. */
  selectedCount?: number;
  onPageIndexChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function DataTablePagination({
  pageIndex,
  pageSize,
  pageCount,
  rowCount,
  selectedCount,
  onPageIndexChange,
  onPageSizeChange,
}: DataTablePaginationProps) {
  const pageSizeId = useId();
  const lastPageIndex = Math.max(pageCount - 1, 0);
  const canPrevious = pageIndex > 0;
  const canNext = pageIndex < lastPageIndex;
  const firstRow = rowCount === 0 ? 0 : pageIndex * pageSize + 1;
  const lastRow = Math.min((pageIndex + 1) * pageSize, rowCount);

  return (
    <nav
      aria-label="Table pagination"
      className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between"
    >
      <p aria-live="polite">
        {selectedCount !== undefined && selectedCount > 0
          ? `${selectedCount} selected · `
          : ""}
        {rowCount === 0
          ? "No rows"
          : `Showing ${firstRow}–${lastRow} of ${rowCount.toLocaleString()}`}
      </p>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor={pageSizeId} className="whitespace-nowrap">
            Rows per page
          </label>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger id={pageSizeId} size="sm" className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <span className="whitespace-nowrap">
          Page {Math.min(pageIndex + 1, Math.max(pageCount, 1))} of{" "}
          {Math.max(pageCount, 1)}
        </span>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="First page"
            disabled={!canPrevious}
            onClick={() => onPageIndexChange(0)}
          >
            <ChevronsLeftIcon />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Previous page"
            disabled={!canPrevious}
            onClick={() => onPageIndexChange(pageIndex - 1)}
          >
            <ChevronLeftIcon />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Next page"
            disabled={!canNext}
            onClick={() => onPageIndexChange(pageIndex + 1)}
          >
            <ChevronRightIcon />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Last page"
            disabled={!canNext}
            onClick={() => onPageIndexChange(lastPageIndex)}
          >
            <ChevronsRightIcon />
          </Button>
        </div>
      </div>
    </nav>
  );
}
