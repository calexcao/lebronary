import ColumnHeader from "@/components/ColumnHeader";
import { createRowActions } from "@/components/DataTableActions";
import { formatISBN } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { Check, CircleOff } from "lucide-react";
import Image from "next/image";

type Photo = {
  photo_id: number;
  url: string;
};

export type Book = {
  id: number;
  name: string;
  isbn: string;
  author: string;
  description: string;
  copies: number;
  is_active: boolean | number;
  publish_year: number;
  book_photos?: Photo[];
  category_links?: { category_id: number }[];
};

export const columns: ColumnDef<Book>[] = [
  {
    accessorKey: "book_photos",
    enableSorting: false,
    header: ({ column }) => <ColumnHeader column={column} title="Cover" />,
    cell: ({ row }) =>
      (row.getValue("book_photos") as unknown as Photo[]).length > 0 && (
        <Image
          width={40}
          height={0}
          alt=""
          src={
            (row.getValue("book_photos") as unknown as Photo[])
              .map((p) => p.url)
              .pop()!
          }
        />
      ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => <ColumnHeader column={column} title="Name" />,
  },
  {
    accessorKey: "author",
    header: ({ column }) => <ColumnHeader column={column} title="Author" />,
  },
  {
    accessorKey: "isbn",
    enableSorting: false,
    header: ({ column }) => <ColumnHeader column={column} title="ISBN" />,
    cell: ({ row }) => formatISBN(row.getValue("isbn")),
  },
  {
    accessorKey: "publish_year",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Publish Year" />
    ),
  },
  {
    accessorKey: "copies",
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
