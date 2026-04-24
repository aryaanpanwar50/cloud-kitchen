import { NextResponse } from "next/server";
import type { NextAuthRequest } from "next-auth";
import { auth } from "@/auth";

const protectedRoutes = ["/kitchen", "/admin"];

export default auth((req: NextAuthRequest) => {
  const pathname = req.nextUrl.pathname;

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!req.auth?.user) {
      return NextResponse.redirect(new URL("/auth/signin", req.nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
