import {
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  tableFeatures,
  type ColumnDef,
  type CellData,
  type Column,
  type Row,
  type RowData,
  type Table,
  type TableFeatures,
} from "@tanstack/react-table";

/**
 * Feature set shared by all application data tables (TanStack Table v9
 * registers features explicitly).
 *
 * No client-side row models (sorted / filtered / paginated) are registered:
 * application tables are SERVER-DRIVEN. Sorting, filtering and pagination
 * state lives in the URL, the server queries exactly one page from the
 * database, and the table only renders it. This keeps large clinical
 * datasets out of the browser. See docs/architecture/README.md#tables.
 */
export const dataTableFeatures = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
  columnVisibilityFeature,
  rowSelectionFeature,
});

export type DataTableFeatures = typeof dataTableFeatures;

export type DataTableColumnDef<TData extends RowData, TValue = unknown> = ColumnDef<
  DataTableFeatures,
  TData,
  TValue
>;
export type DataTableInstance<TData extends RowData> = Table<DataTableFeatures, TData>;
export type DataTableColumn<TData extends RowData, TValue = unknown> = Column<
  DataTableFeatures,
  TData,
  TValue
>;
export type DataTableRow<TData extends RowData> = Row<DataTableFeatures, TData>;

/* eslint-disable @typescript-eslint/no-unused-vars -- a module augmentation must
   repeat the upstream generic signature exactly, even where unused. */
declare module "@tanstack/table-core" {
  interface ColumnMeta<
    in out TFeatures extends TableFeatures,
    in out TData extends RowData,
    TValue extends CellData = CellData,
  > {
    /** Human-readable column name, used where the header is not plain text (e.g. the column-visibility menu). */
    label?: string;
  }
}
/* eslint-enable @typescript-eslint/no-unused-vars */
