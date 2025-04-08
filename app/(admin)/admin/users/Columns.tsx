import ColumnHeader from "@/components/ColumnHeader";
import { createRowActions } from "@/components/DataTableActions";
import { ColumnDef } from "@tanstack/react-table";
import { Check, CircleOff } from "lucide-react";

export type User = {
  id: string;
  name: string;
  email: string;
  card: string;
  role: string;
  is_active: boolean | number;
};
export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <ColumnHeader column={column} title="Name" />,
  },
  {
    accessorKey: "email",
    header: ({ column }) => <ColumnHeader column={column} title="Email" />,
  },
  {
    accessorKey: "role",
    enableSorting: false,
    header: ({ column }) => <ColumnHeader column={column} title="Role" />,
    cell: ({ row }) => <p className="capitalize">{row.getValue("role")}</p>,
  },
  {
    accessorKey: "card",
    enableSorting: false,
    header: ({ column }) => <ColumnHeader column={column} title="Card No." />,
  },
  {
    accessorKey: "is_active",
    header: ({ column }) => <ColumnHeader column={column} title="Active" />,
    cell: ({ row }) =>
      row.getValue("is_active") ? (
        <Check size={16} className="text-green-500" />
      ) : (
        <CircleOff size={16} className="text-red-500" />
      ),
  },
  createRowActions<User>(),
];
