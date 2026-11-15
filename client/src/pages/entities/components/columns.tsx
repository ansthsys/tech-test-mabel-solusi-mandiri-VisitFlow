import { DataTableColumnHeader } from "@components/data-table/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";
import { Entity } from "src/types/api";

export const columns: ColumnDef<Entity>[] = [
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
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return <div>{row.getValue("name")}</div>;
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      return <div>{row.getValue("type")}</div>;
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
    accessorKey: "region",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Region" />
    ),
    cell: ({ row }) => {
      return <div>{row.getValue("region")}</div>;
    },
  },
];
