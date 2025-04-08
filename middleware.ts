import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export { auth } from "@/auth";

export default auth(async (request: NextRequest) => {
  const session = await auth();

  if (session?.user.role === "staff" && session.user.status === "pending") {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  if (isProtectedRoute(request.nextUrl.pathname)) {
    if (!session || session.user.role !== "staff") {
      return NextResponse.redirect(new URL("/401", request.url));
    }
  }

  return NextResponse.next();
});

const isProtectedRoute = (path: string) => {
  return /^\/admin(\/|$)/.test(path);
};

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|profile|auth/signin|401|search|programs).*)",
  ],
};
