import ColumnHeader from "@/components/ColumnHeader";
import { createRowActions } from "@/components/DataTableActions";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export type Activity = {
  activity_id: number;
  title: string;
  description?: string | null;
  date: Date;
  start_time: string;
  end_time: string;
  age_group: string | null;
  capacity?: number | null;
  activity_photos?: { photo_id: number; url: string }[];
};
export const columns: ColumnDef<Activity>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => <ColumnHeader column={column} title="Title" />,
  },
  {
    accessorKey: "date",
    header: ({ column }) => <ColumnHeader column={column} title="Date" />,
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      return format(date, "MMMM d, yyyy");
    },
  },
  {
    accessorKey: "start_time",
    header: ({ column }) => <ColumnHeader column={column} title="Start Time" />,
  },
  {
    accessorKey: "end_time",
    header: ({ column }) => <ColumnHeader column={column} title="End Time" />,
  },
  createRowActions<Activity>(),
];
