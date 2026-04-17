import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const isAdminRoute  = createRouteMatcher(["/admin(.*)"]);
const skipOnboarding = createRouteMatcher([
  "/onboarding",
  "/api(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // Admin protection
  if (isAdminRoute(req)) {
    await auth.protect();
  }

  // Onboarding gate: signed-in users without a username get redirected
  if (userId && !skipOnboarding(req)) {
    // Fast path: check Clerk publicMetadata set after onboarding completes
    const { sessionClaims } = await auth();
    const meta = sessionClaims?.metadata as Record<string, unknown> | undefined;
    if (meta?.onboarding_complete) return NextResponse.next();

    // Slow path: Clerk metadata not yet set — query Supabase
    const url  = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key  = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (url && key) {
      const supabase = createClient(url, key, {
        auth: { persistSession: false },
      });
      const { data } = await supabase
        .from("users")
        .select("username")
        .eq("clerk_id", userId)
        .maybeSingle();
      if (!data?.username) {
        return NextResponse.redirect(new URL("/onboarding", req.url));
      }
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
