# 0005. Server-driven data tables with URL state

- **Status:** Accepted
- **Date:** 2026-09-28

## Context

Patient, order and billing lists will be large. Loading them fully into the
browser is slow on hospital networks and exposes more data than needed.

## Decision

Use TanStack Table v9 headlessly with manual sorting and pagination. Sort,
page, page size and search live in URL search params; the server parses them
(`parseListParams`), allow-lists sort columns, and queries one page from
PostgreSQL. Column visibility and selection are local UI state.

## Consequences

- Shareable, refresh-safe URLs; bounded payloads.
- Every list query must support sorting, paging and counting in SQL.
- Multi-column sort is not supported by default (deliberately simple).

## Alternatives considered

- **Client-side row models:** fine for small static lists only; may be used
  explicitly for such cases.
- **Commercial data grids:** unnecessary cost and bundle weight.
