"use client";

import { DataTable } from "@/components/DataTable";
import { Category, columns } from "./Columns";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { deleteCategory } from "@/actions/action";
import { toast } from "sonner";
import AddCategoryDialog from "@/components/AddCategoryDialog";
import ConfirmationDialog from "@/components/ConfirmationDialog";

type props = {
  data: {
    id: number;
    name: string;
  }[];
  total: number;
};

function CategoriesTable({ data }: { data: props }) {
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [itemToAction, setItemToAction] = useState<Category>();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const handleRowDelete = (item: Category) => {
    setOpenConfirmationDialog(true);
    setItemToAction(item);
  };

  const handleRowEdit = (item: Category) => {
    setItemToAction(item);
    setOpen(true);
  };

  const handleConfirm = async () => {
    setOpenConfirmationDialog(false);
    if (itemToAction) {
      await deleteCategory(itemToAction.id, pathname);
    }
    toast("Category Deleted");
  };

  return (
    <>
      <DataTable
        data={data.data}
        columns={columns}
        total={data.total}
        filterColumn="name"
        onRowDelete={handleRowDelete}
        onRowEdit={handleRowEdit}
      />
      <AddCategoryDialog
        open={open}
        setOpen={setOpen}
        category={itemToAction}
      />
      <ConfirmationDialog
        open={openConfirmationDialog}
        onClose={() => setOpenConfirmationDialog(false)}
        onConfirm={handleConfirm}
        message="Are you sure you want to delete this category?"
      />
    </>
  );
}

export default CategoriesTable;
