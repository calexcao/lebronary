"use client";

import { PlusIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import AddAcitvityDialog from "./AddActivityDialog";

function AddActivityButton() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col">
      <Button
        variant="outline"
        className="self-end"
        onClick={() => setOpen(true)}
      >
        <PlusIcon />
        Add Activity
      </Button>
      <AddAcitvityDialog open={open} setOpen={setOpen} />
    </div>
  );
}

export default AddActivityButton;
