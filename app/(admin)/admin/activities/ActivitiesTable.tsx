"use client";

import { DataTable } from "@/components/DataTable";
import { Activity, columns } from "./Columns";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { deleteActivity } from "@/actions/action";
import { toast } from "sonner";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import AddAcitvityDialog from "@/components/AddActivityDialog";

type props = {
  data: Activity[];
  total: number;
};

function ActivitiesTable({ data }: { data: props }) {
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [itemToAction, setItemToAction] = useState<Activity>();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const handleRowDelete = (item: Activity) => {
    setOpenConfirmationDialog(true);
    setItemToAction(item);
  };

  const handleRowEdit = (item: Activity) => {
    setItemToAction(item);
    setOpen(true);
  };

  const handleConfirm = async () => {
    setOpenConfirmationDialog(false);
    if (itemToAction) {
      await deleteActivity(itemToAction.activity_id, pathname);
    }
    toast("Activity Deleted");
  };

  return (
    <>
      <DataTable
        data={data.data}
        columns={columns}
        total={data.total}
        filterColumn="title"
        onRowDelete={handleRowDelete}
        onRowEdit={handleRowEdit}
      />
      <AddAcitvityDialog
        open={open}
        setOpen={setOpen}
        activity={itemToAction}
      />
      <ConfirmationDialog
        open={openConfirmationDialog}
        onClose={() => setOpenConfirmationDialog(false)}
        onConfirm={handleConfirm}
        message="Are you sure you want to delete this activity?"
      />
    </>
  );
}

export default ActivitiesTable;
