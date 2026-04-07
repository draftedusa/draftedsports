import { NextResponse } from "next/server";
import { fetchLiveTransactions } from "@/lib/fetchers/sports-rss";

// ISR: revalidate every 5 minutes
export const revalidate = 300;

// Rate limit: track request counts in memory (resets on cold start)
const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 60;
const ipCounters = new Map<string, { count: number; windowStart: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipCounters.get(ip);

  if (!entry || now - entry.windowStart > RATE_WINDOW_MS) {
    ipCounters.set(ip, { count: 1, windowStart: now });
    return true;
  }

  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

export async function GET(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Rate limit exceeded" },
      {
        status: 429,
        headers: {
          "Retry-After": "60",
          "X-RateLimit-Limit": String(RATE_LIMIT),
        },
      }
    );
  }

  try {
    const transactions = await fetchLiveTransactions();

    return NextResponse.json(
      { transactions, source: "live", fetchedAt: new Date().toISOString() },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
          "X-Content-Type-Options": "nosniff",
          "X-Frame-Options": "DENY",
        },
      }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
