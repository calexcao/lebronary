import ColumnHeader from "@/components/ColumnHeader";
import { createRowActions } from "@/components/DataTableActions";
import { formatISBN } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { Check, CircleOff } from "lucide-react";

type Photo = {
  photo_id: number;
  url: string;
};

export type Book = {
  id: number;
  name: string;
  isbn: string;
  author: string;
  copies: number;
  is_active: boolean | number;
  publish_year: number;
  book_photos?: Photo[];
  category_links?: { id: number }[];
};

export const columns: ColumnDef<Book>[] = [
  {
    accessorKey: "book_photos",
    enableSorting: false,
    header: ({ column }) => <ColumnHeader column={column} title="Image" />,
  },
  {
    accessorKey: "name",
    header: ({ column }) => <ColumnHeader column={column} title="Name" />,
  },
  {
    accessorKey: "isbn",
    enableSorting: false,
    header: ({ column }) => <ColumnHeader column={column} title="ISBN" />,
    cell: ({ row }) => formatISBN(row.getValue("isbn")),
  },
  {
    accessorKey: "publish_year",
    enableSorting: false,
    header: ({ column }) => (
      <ColumnHeader column={column} title="Publish Year" />
    ),
  },
  {
    accessorKey: "copies",
    enableSorting: false,
    header: ({ column }) => (
      <ColumnHeader column={column} title="# of Copies" />
    ),
  },
  {
    accessorKey: "is_active",
    enableSorting: false,
    header: ({ column }) => <ColumnHeader column={column} title="Active" />,
    cell: ({ row }) =>
      row.getValue("is_active") ? (
        <Check size={16} className="text-green-500" />
      ) : (
        <CircleOff size={16} className="text-red-500" />
      ),
  },
  createRowActions<Book>(),
];
