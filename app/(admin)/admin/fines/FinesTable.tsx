"use client";

import { DataTable } from "@/components/DataTable";
import { columns, Fine } from "./Columns";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { deleteFine, markAsPaid } from "@/actions/action";
import { toast } from "sonner";
import ConfirmationDialog from "@/components/ConfirmationDialog";

type props = {
  data: Fine[];
  total: number;
};

function FinesTable({ data }: { data: props }) {
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [itemToAction, setItemToAction] = useState<Fine>();
  const [dialogReason, setDialogReason] = useState("");
  const [dialogMessage, setDialogMessage] = useState("");
  const pathname = usePathname();

  const handleRowDelete = (item: Fine) => {
    setDialogReason("Delete");
    setDialogMessage("Are you sure you want to delete this fine?");
    setOpenConfirmationDialog(true);
    setItemToAction(item);
  };

  const handleMarkAsPaid = (item: Fine) => {
    setDialogReason("Paid");
    setDialogMessage("Are you sure you want to mark this fine as paid?");
    setOpenConfirmationDialog(true);
    setItemToAction(item);
  };

  const handleConfirm = async () => {
    setOpenConfirmationDialog(false);
    if (itemToAction) {
      if (dialogReason === "Delete") {
        await deleteFine(itemToAction.fine_id, pathname);
        toast("Fine Deleted");
      } else if (dialogReason === "Paid") {
        await markAsPaid(itemToAction.fine_id, pathname);
        toast("Fine Marked as Paid");
      }
    }
  };

  return (
    <>
      <DataTable
        data={data.data}
        columns={columns}
        total={data.total}
        filterColumn="name"
        onRowDelete={handleRowDelete}
        onRowEdit={handleMarkAsPaid}
      />
      <ConfirmationDialog
        open={openConfirmationDialog}
        onClose={() => setOpenConfirmationDialog(false)}
        onConfirm={handleConfirm}
        message={dialogMessage}
      />
    </>
  );
}

export default FinesTable;
