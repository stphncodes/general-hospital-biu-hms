"use client";

import {
  DataTable,
  DataTableColumnHeader,
  type DataTableColumnDef,
} from "@/components/tables";
import { formatDate, formatDateTime } from "@/lib/utils";

import type { StaffMember as StaffTableRow } from "../types/staff";

function StatusCell({ row }: { row: StaffTableRow }) {
  if (row.status === "deactivated") {
    return <span className="text-sm text-muted-foreground">Deactivated</span>;
  }
  if (!row.lastSignInAt) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm">
        <span aria-hidden className="size-2 rounded-full bg-warning" />
        Invitation pending
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-sm">
      <span aria-hidden className="size-2 rounded-full bg-success" />
      Active
    </span>
  );
}

// Column ids match the server's sortable allow-list (STAFF_SORTABLE_COLUMNS).
const columns: DataTableColumnDef<StaffTableRow>[] = [
  {
    id: "full_name",
    accessorFn: (row) => row.fullName,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => (
      <div className="min-w-40">
        <p className="font-medium text-heading">{row.original.fullName}</p>
        {row.original.jobTitle && (
          <p className="text-xs text-muted-foreground">{row.original.jobTitle}</p>
        )}
      </div>
    ),
  },
  {
    id: "email",
    accessorFn: (row) => row.email,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    cell: ({ row }) => <span className="text-sm">{row.original.email ?? "—"}</span>,
  },
  {
    id: "roles",
    accessorFn: (row) => row.roles.join(", "),
    header: "Role",
    enableSorting: false,
    cell: ({ row }) => (
      <span className="text-sm">{row.original.roles.join(", ") || "No role"}</span>
    ),
  },
  {
    id: "status",
    accessorFn: (row) => row.status,
    header: "Status",
    enableSorting: false,
    cell: ({ row }) => <StatusCell row={row.original} />,
  },
  {
    id: "last_sign_in_at",
    accessorFn: (row) => row.lastSignInAt,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last sign-in" />
    ),
    cell: ({ row }) => (
      <span className="text-sm whitespace-nowrap tabular-nums">
        {formatDateTime(row.original.lastSignInAt, "Never")}
      </span>
    ),
  },
  {
    id: "invited_at",
    accessorFn: (row) => row.invitedAt,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Added" />,
    cell: ({ row }) => (
      <span className="text-sm whitespace-nowrap tabular-nums">
        {formatDate(row.original.invitedAt)}
      </span>
    ),
  },
];

export function StaffTable({ rows, total }: { rows: StaffTableRow[]; total: number }) {
  return (
    <DataTable
      columns={columns}
      data={rows}
      rowCount={total}
      getRowId={(row) => row.id}
      caption="Staff accounts in this facility"
      searchPlaceholder="Search by name or email"
      emptyMessage="No staff accounts match."
    />
  );
}
