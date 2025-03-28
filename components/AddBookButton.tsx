"use client";

import { PlusIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import AddBookDialog from "./AddBookDialog";

function AddBookButton() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col">
      <Button
        variant="outline"
        className="self-end"
        onClick={() => setOpen(true)}
      >
        <PlusIcon />
        Add Book
      </Button>
      <AddBookDialog open={open} setOpen={setOpen} />
    </div>
  );
}

export default AddBookButton;
