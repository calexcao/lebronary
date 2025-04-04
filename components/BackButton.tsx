"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

function BackButton({ styles }: { styles?: string }) {
  const router = useRouter();

  return (
    <Button onClick={() => router.back()} variant="link" className={cn(styles)}>
      <ArrowLeft />
    </Button>
  );
}

export default BackButton;
