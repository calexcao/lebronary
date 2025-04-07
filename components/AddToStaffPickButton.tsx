"use client";

import { addToStaffPicks } from "@/actions/action";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";

function AddToStaffPickButton({ id }: { id: number }) {
  const path = usePathname();

  const handleAdd = async () => {
    await addToStaffPicks(id, path);
  };

  return <Button onClick={handleAdd}>Add to Staff Picks</Button>;
}

export default AddToStaffPickButton;
