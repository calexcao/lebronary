"use client";

import { DataTable } from "@/components/DataTable";
import { Book, columns } from "./Columns";
import { deleteBook } from "@/actions/action";
import { usePathname } from "next/navigation";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { useState } from "react";
import { toast } from "sonner";
import AddBookDialog from "@/components/AddBookDialog";

type props = {
  data: Book[];
  total: number;
};

function CatalogTable({ data }: { data: props }) {
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [itemToAction, setItemToAction] = useState<Book>();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const handleRowDelete = (item: Book) => {
    setOpenConfirmationDialog(true);
    setItemToAction(item);
  };

  const handleRowEdit = (item: Book) => {
    setItemToAction(item);
    setOpen(true);
  };

  const handleConfirm = async () => {
    setOpenConfirmationDialog(false);
    if (itemToAction) {
      await deleteBook(itemToAction.id, pathname);
    }
    toast("Book Deleted");
  };

  return (
    <>
      <DataTable
        columns={columns}
        data={data.data}
        total={data.total}
        filterColumn="name"
        onRowDelete={handleRowDelete}
        onRowEdit={handleRowEdit}
      />
      <AddBookDialog open={open} setOpen={setOpen} book={itemToAction} />
      <ConfirmationDialog
        open={openConfirmationDialog}
        onClose={() => setOpenConfirmationDialog(false)}
        onConfirm={handleConfirm}
        message="Are you sure you want to delete this book?"
      />
    </>
  );
}

export default CatalogTable;
