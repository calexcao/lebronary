"use client";

import { removeFromStaffPicks } from "@/actions/action";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";

function RemoveFromStaffPicksButton({ id }: { id: number }) {
  const path = usePathname();

  const handleRemove = async () => {
    await removeFromStaffPicks(id, path);
  };

  return <Button onClick={handleRemove}>Remove from Staff Picks</Button>;
}

export default RemoveFromStaffPicksButton;
