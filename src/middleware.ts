import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server";

// Edge-safe auth — uses JWT-only config with no Prisma/pg imports.
const { auth } = NextAuth(authConfig);

/**
 * Security headers applied to every response.
 */
function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "media-src 'self' https://commondatastorage.googleapis.com",
      "connect-src 'self' https://www.espn.com",
      "frame-ancestors 'none'",
    ].join("; ")
  );
  return response;
}

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // ── Admin route protection ────────────────────────────────
  if (pathname.startsWith("/admin")) {
    const role = (req.auth?.user as Record<string, unknown> | undefined)?.role;
    if (!req.auth || role !== "admin") {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("next", pathname);
      return addSecurityHeaders(NextResponse.redirect(loginUrl));
    }
  }

  // ── Admin API protection ──────────────────────────────────
  if (pathname.startsWith("/api/admin")) {
    const role = (req.auth?.user as Record<string, unknown> | undefined)?.role;
    if (!req.auth || role !== "admin") {
      return addSecurityHeaders(
        NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      );
    }
  }

  // ── Security headers on all responses ────────────────────
  return addSecurityHeaders(NextResponse.next());
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
