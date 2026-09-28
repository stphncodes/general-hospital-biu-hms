"use client";

import {
  functionalUpdate,
  type PaginationState,
  type SortingState,
  type Updater,
} from "@tanstack/react-table";
import type { Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useTransition } from "react";

import { parseListParams } from "@/lib/validation";

/**
 * Two-way binding between table state and URL search params
 * (`page`, `pageSize`, `sort`, `order`, `q`).
 *
 * The URL is the single source of truth: changing a page or sort navigates,
 * the Server Component re-renders with `parseListParams(searchParams)`, and
 * the database returns the requested page. URLs are therefore shareable and
 * survive refreshes. Only single-column sorting is supported by design.
 */
export function useTableUrlState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const params = useMemo(
    () => parseListParams(Object.fromEntries(searchParams.entries())),
    [searchParams],
  );

  const sorting: SortingState = useMemo(
    () => (params.sort ? [{ id: params.sort, desc: params.order === "desc" }] : []),
    [params.sort, params.order],
  );

  const pagination: PaginationState = useMemo(
    () => ({ pageIndex: params.page - 1, pageSize: params.pageSize }),
    [params.page, params.pageSize],
  );

  const navigate = useCallback(
    (changes: Record<string, string | number | undefined>) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(changes)) {
        if (value === undefined || value === "") next.delete(key);
        else next.set(key, String(value));
      }
      const query = next.toString();
      startTransition(() => {
        router.replace((query ? `${pathname}?${query}` : pathname) as Route, {
          scroll: false,
        });
      });
    },
    [pathname, router, searchParams],
  );

  const onSortingChange = useCallback(
    (updater: Updater<SortingState>) => {
      const [first] = functionalUpdate(updater, sorting);
      navigate({
        sort: first?.id,
        order: first ? (first.desc ? "desc" : "asc") : undefined,
        page: undefined, // a new sort order starts from the first page
      });
    },
    [navigate, sorting],
  );

  const onPaginationChange = useCallback(
    (updater: Updater<PaginationState>) => {
      const next = functionalUpdate(updater, pagination);
      const pageSizeChanged = next.pageSize !== pagination.pageSize;
      navigate({
        page: pageSizeChanged || next.pageIndex === 0 ? undefined : next.pageIndex + 1,
        pageSize: next.pageSize,
      });
    },
    [navigate, pagination],
  );

  const setSearch = useCallback(
    (q: string) => navigate({ q: q.trim() || undefined, page: undefined }),
    [navigate],
  );

  return {
    search: params.q ?? "",
    sorting,
    pagination,
    onSortingChange,
    onPaginationChange,
    setSearch,
    /** True while the server is rendering the next page/sort/search. */
    isPending,
  };
}
