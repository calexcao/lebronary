import ColumnHeader from "@/components/ColumnHeader";
import { createRowActions } from "@/components/DataTableActions";
import { formatAmount, getDateWithOffset } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export type Fine = {
  fine_id: number;
  amount: number;
  fine_date: Date;
  paid_date: Date | null;
  users: {
    name: string;
  };
};
export const columns: ColumnDef<Fine>[] = [
  {
    accessorKey: "users.name",
    id: "name",
    header: ({ column }) => <ColumnHeader column={column} title="Name" />,
  },
  {
    accessorKey: "fine_date",
    header: ({ column }) => <ColumnHeader column={column} title="Fine Date" />,
    cell: ({ row }) =>
      format(getDateWithOffset(row.getValue("fine_date")), "MMMM d, yyyy"),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => <ColumnHeader column={column} title="Amount" />,
    cell: ({ row }) => formatAmount(row.getValue("amount"), "CAD"),
  },
  {
    accessorKey: "paid_date",
    header: ({ column }) => <ColumnHeader column={column} title="Date Paid" />,
    cell: ({ row }) =>
      row.getValue("paid_date") ? (
        format(getDateWithOffset(row.getValue("paid_date")), "MMM, dd yyyy")
      ) : (
        <p className="text-red-500 font-bold">Not Paid</p>
      ),
  },
  createRowActions<Fine>(),
];
