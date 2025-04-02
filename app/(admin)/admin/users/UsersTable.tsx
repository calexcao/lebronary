"use client";

import { DataTable } from "@/components/DataTable";
import { columns, User } from "./Columns";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import AddUserDialog from "@/components/AddUserDialog";
import { deleteUser } from "@/actions/action";

type props = {
  data: User[];
  total: number;
};

function UsersTable({ data }: { data: props }) {
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [itemToAction, setItemToAction] = useState<User>();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const handleRowDelete = (item: User) => {
    setOpenConfirmationDialog(true);
    setItemToAction(item);
  };

  const handleRowEdit = (item: User) => {
    setItemToAction(item);
    setOpen(true);
  };

  const handleConfirm = async () => {
    setOpenConfirmationDialog(false);
    if (itemToAction) {
      await deleteUser(itemToAction.id, pathname);
    }
    toast("User Deleted");
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
      <AddUserDialog open={open} setOpen={setOpen} user={itemToAction} />
      <ConfirmationDialog
        open={openConfirmationDialog}
        onClose={() => setOpenConfirmationDialog(false)}
        onConfirm={handleConfirm}
        message="Are you sure you want to delete this user?"
      />
    </>
  );
}

export default UsersTable;
