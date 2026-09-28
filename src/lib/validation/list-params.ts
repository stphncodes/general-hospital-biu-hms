import { z } from "zod";

/**
 * List/table query parameters parsed from URL search params.
 *
 * Tables are server-driven: page, sort and filters live in the URL, the
 * server parses them with this schema, and the database does the filtering
 * and pagination. Never fetch a whole table and paginate in the browser.
 */
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;
export const DEFAULT_PAGE_SIZE = 25;
export const MAX_PAGE_SIZE = 100;

export const listParamsSchema = z.object({
  page: z.coerce.number().int().min(1).catch(1),
  pageSize: z.coerce.number().int().min(1).max(MAX_PAGE_SIZE).catch(DEFAULT_PAGE_SIZE),
  q: z.string().trim().max(200).optional().catch(undefined),
  sort: z
    .string()
    .regex(/^[a-zA-Z0-9_]+$/)
    .optional()
    .catch(undefined),
  order: z.enum(["asc", "desc"]).catch("asc"),
});

export type ListParams = z.infer<typeof listParamsSchema>;

type SearchParamsInput = Record<string, string | string[] | undefined>;

/**
 * Parses list params leniently: malformed values fall back to defaults rather
 * than erroring, because they come from user-editable URLs. Callers must
 * still check `sort` against an allow-list of sortable columns.
 */
export function parseListParams(searchParams: SearchParamsInput): ListParams {
  const first = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value;

  return listParamsSchema.parse({
    page: first(searchParams.page),
    pageSize: first(searchParams.pageSize),
    q: first(searchParams.q),
    sort: first(searchParams.sort),
    order: first(searchParams.order),
  });
}

/** Inclusive row range for Supabase `.range(from, to)`. */
export function toRange({ page, pageSize }: Pick<ListParams, "page" | "pageSize">) {
  const from = (page - 1) * pageSize;
  return { from, to: from + pageSize - 1 };
}
