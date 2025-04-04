"use client";

import BackButton from "@/components/BackButton";
import { useSearchParams } from "next/navigation";
import React from "react";

function SigninErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <>
      <p className="mt-4">An error occurred while signing in</p>
      <p className="text-red-400">{error}</p>
      <BackButton />
    </>
  );
}

export default SigninErrorPage;
