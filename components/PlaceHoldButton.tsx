"use client";

import { placeHold } from "@/actions/action";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";

function PlaceHoldButton({ id }: { id: number }) {
  const path = usePathname();

  const handlePlaceHold = async () => {
    await placeHold(id, path);
  };

  return <Button onClick={handlePlaceHold}>Place Hold</Button>;
}

export default PlaceHoldButton;
