import Link from "next/link";
import React from "react";

function UnauthorizedPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold">401</h1>
        <p className="mt-4 text-xl">Unauthorized Access</p>
        <p className="mt-2 muted-foreground">
          You do not have permission to view this page.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded border px-6 py-2 text-white hover:bg-accent"
        >
          Take me home
        </Link>
      </div>
    </div>
  );
}

export default UnauthorizedPage;
