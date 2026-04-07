import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const COOKIE_NAME = "undrafted_gate_v2";
const FREE_LIMIT  = 3;
// 24-hour session window
const MAX_AGE_SECONDS = 60 * 60 * 24;

/**
 * GET /api/gate
 * Returns the current article view count from the HttpOnly cookie.
 * Safe to call on page load to sync UI state.
 */
export async function GET() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value ?? "0";
  const count = Math.max(0, parseInt(raw, 10) || 0);

  return NextResponse.json({
    count,
    limit: FREE_LIMIT,
    paywalled: count > FREE_LIMIT,
  });
}

/**
 * POST /api/gate  { slug: string }
 * Increments the article view counter server-side using an HttpOnly cookie.
 * - Cannot be read or modified by JavaScript (JS-bypass proof)
 * - SameSite=Strict prevents CSRF
 * - Returns new count + whether paywall should trigger
 */
export async function POST(request: Request) {
  let slug: string;

  try {
    const body = await request.json();
    slug = String(body?.slug ?? "").slice(0, 200);
    if (!slug) throw new Error("no slug");
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value ?? "";

  // Cookie stores a JSON array of visited slugs — deduplicates by slug
  let visited: string[] = [];
  try {
    visited = JSON.parse(raw);
    if (!Array.isArray(visited)) visited = [];
  } catch {
    visited = [];
  }

  const alreadyVisited = visited.includes(slug);
  if (!alreadyVisited) {
    visited.push(slug);
  }

  const count = visited.length;
  const paywalled = count > FREE_LIMIT;

  // Build response with updated HttpOnly cookie
  const response = NextResponse.json({ count, limit: FREE_LIMIT, paywalled });

  response.cookies.set(COOKIE_NAME, JSON.stringify(visited), {
    httpOnly: true,       // JS cannot read
    sameSite: "strict",   // CSRF protection
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });

  return response;
}
