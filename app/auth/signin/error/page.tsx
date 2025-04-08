"use client";

import BackButton from "@/components/BackButton";
import { useSearchParams } from "next/navigation";
import React, { Suspense } from "react";

// Create a separate component that uses useSearchParams
function ErrorContent() {
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

// Fallback component to show while loading
function ErrorLoading() {
  return (
    <>
      <p className="mt-4">Loading error details...</p>
      <BackButton />
    </>
  );
}

// Main page component with Suspense
function SigninErrorPage() {
  return (
    <Suspense fallback={<ErrorLoading />}>
      <ErrorContent />
    </Suspense>
  );
}

export default SigninErrorPage;
