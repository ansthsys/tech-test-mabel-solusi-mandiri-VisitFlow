import { DataTableColumnHeader } from "@components/data-table/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";
import { Activity } from "src/types/api";
import RowActions from "./row-actions";

export const columns: ColumnDef<Activity>[] = [
  {
    accessorKey: "no",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="No"
        className="text-center"
      />
    ),
    cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
    enableSorting: false,
  },
  {
    accessorKey: "entityName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return <div>{row.getValue("entityName")}</div>;
    },
  },
  {
    accessorKey: "entityType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Entity type" />
    ),
    cell: ({ row }) => {
      return <div>{row.getValue("entityType")}</div>;
    },
  },
  {
    accessorKey: "segment",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Segment"
        className="justify-center"
      />
    ),
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("segment")}</div>;
    },
  },
  {
    accessorKey: "entityRegion",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Entity region" />
    ),
    cell: ({ row }) => {
      return <div>{row.getValue("entityRegion")}</div>;
    },
  },
  {
    accessorKey: "visitDate",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Visit date"
        className="justify-center"
      />
    ),
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("visitDate")}</div>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Status"
        className="justify-center"
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="text-center">
          {row.getValue("status") === "NOT_VISITED" ? "Not visited" : "Visited"}
        </div>
      );
    },
  },
  {
    accessorKey: "salesName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sales name" />
    ),
    cell: ({ row }) => {
      return <div>{row.getValue("salesName") ?? "-"}</div>;
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center">Action</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <RowActions activity={row.original} />
      </div>
    ),
    enableSorting: false,
  },
];
