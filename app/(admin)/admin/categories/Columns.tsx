import ColumnHeader from "@/components/ColumnHeader";
import { createRowActions } from "@/components/DataTableActions";
import { ColumnDef } from "@tanstack/react-table";

export type Category = {
  id: number;
  name: string;
};
export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <ColumnHeader column={column} title="Name" />,
  },
  createRowActions<Category>(),
];
