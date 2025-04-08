"use client";

import { createCheckoutSession } from "@/actions/action";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

function PayFineButton({
  fine_id,
  styles,
}: {
  fine_id: number;
  styles?: string;
}) {
  const handlePay = async () => {
    const fd = new FormData();
    fd.set("fine_id", `${fine_id}`);
    await createCheckoutSession(fd);
  };

  return (
    <Button onClick={handlePay} className={cn(styles)}>
      Pay Fine
    </Button>
  );
}

export default PayFineButton;
