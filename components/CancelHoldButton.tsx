"use client";

import { cancelHold } from "@/actions/action";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

function CancelHoldButton({ id, styles }: { id: number; styles?: string }) {
  const path = usePathname();

  const handleCancelHold = async () => {
    await cancelHold(id, path);
  };

  return (
    <Button onClick={handleCancelHold} className={cn(styles)}>
      Cancel Hold
    </Button>
  );
}

export default CancelHoldButton;
