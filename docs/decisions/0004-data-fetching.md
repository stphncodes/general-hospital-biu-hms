# 0004. Server-first data fetching; TanStack Query only where needed

- **Status:** Accepted
- **Date:** 2026-09-28

## Context

Client-side caching libraries are often applied everywhere by habit, which
moves data access into the browser and duplicates what Server Components do.

## Decision

Server Components fetch data by default. TanStack Query is used only for
client-side data that benefits from caching, background refetching,
polling or optimistic mutations (e.g. live bed boards, typeahead lookups).
`QueryProvider` is mounted only in the authenticated shell, and a new
`QueryClient` is created per server request. No global state library.

## Consequences

- Smaller bundles and simpler data flow for most pages.
- Contributors must justify Query usage in review.

## Alternatives considered

- **Query for everything:** more client JS, more client-side data exposure.
- **Redux/Zustand:** no demonstrated need.
