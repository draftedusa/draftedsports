import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  if (req.nextUrl.pathname.startsWith("/admin")) {
    const role = (req.auth?.user as Record<string, unknown> | undefined)?.role;
    if (!req.auth || role !== "admin") {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }
});

export const config = { matcher: ["/admin/:path*"] };
