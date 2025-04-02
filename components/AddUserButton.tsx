"use client";

import { PlusIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import AddUserDialog from "./AddUserDialog";

function AddUserButton() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col">
      <Button
        variant="outline"
        className="self-end"
        onClick={() => setOpen(true)}
      >
        <PlusIcon />
        Add User
      </Button>
      <AddUserDialog open={open} setOpen={setOpen} />
    </div>
  );
}

export default AddUserButton;
