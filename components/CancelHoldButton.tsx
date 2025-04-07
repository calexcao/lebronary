"use client";

import { cancelHold } from "@/actions/action";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";

function CancelHoldButton({ id }: { id: number }) {
  const path = usePathname();

  const handleCancelHold = async () => {
    await cancelHold(id, path);
  };

  return <Button onClick={handleCancelHold}>Cancel Hold</Button>;
}

export default CancelHoldButton;
