"use client";

import { PlusIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import AddCategoryDialog from "./AddCategoryDialog";

function AddCategoryButton() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col">
      <Button
        variant="outline"
        className="self-end"
        onClick={() => setOpen(true)}
      >
        <PlusIcon />
        Add Category
      </Button>
      <AddCategoryDialog open={open} setOpen={setOpen} />
    </div>
  );
}

export default AddCategoryButton;
