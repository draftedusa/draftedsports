import { Transaction, TransactionType } from "@/data/transactions";
import { transactions as mockTransactions } from "@/data/transactions";

const RSS_FEEDS: Record<string, string> = {
  nfl: "https://www.espn.com/espn/rss/nfl/news",
  nba: "https://www.espn.com/espn/rss/nba/news",
  mlb: "https://www.espn.com/espn/rss/mlb/news",
  nhl: "https://www.espn.com/espn/rss/nhl/news",
};

/**
 * Heuristically classify a transaction type from headline text.
 */
function classifyType(headline: string): TransactionType {
  const h = headline.toLowerCase();
  if (h.includes("injur") || h.includes("doubtful") || h.includes("out for") || h.includes("day-to-day")) return "injury";
  if (h.includes("sign") || h.includes("contract") || h.includes("deal")) return "signing";
  if (h.includes("trade") || h.includes("acquire") || h.includes("sends")) return "trade";
  if (h.includes("extend") || h.includes("extension") || h.includes("re-sign")) return "extension";
  if (h.includes("release") || h.includes("cut ") || h.includes("waive")) return "release";
  if (h.includes("waiver")) return "waiver";
  return "signing";
}

/**
 * Extract a player name from a headline.
 * Simple heuristic: first capitalized word sequence before a verb.
 */
function extractPlayerName(headline: string): string {
  const match = headline.match(/^([A-Z][a-z]+(?: [A-Z][a-z.']+){1,2})/);
  return match ? match[1] : "Unknown";
}

/**
 * Parse ESPN RSS XML to Transaction array.
 * Returns empty array on any parse failure.
 */
function parseRSSToTransactions(xml: string, leagueId: string): Transaction[] {
  const results: Transaction[] = [];

  // Extract <item> blocks
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match: RegExpExecArray | null;
  let idx = 0;

  while ((match = itemRegex.exec(xml)) !== null && idx < 8) {
    const item = match[1];

    const titleMatch = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) ||
                       item.match(/<title>(.*?)<\/title>/);
    const descMatch  = item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/) ||
                       item.match(/<description>(.*?)<\/description>/);
    const dateMatch  = item.match(/<pubDate>(.*?)<\/pubDate>/);

    if (!titleMatch) continue;

    const headline = titleMatch[1].replace(/<[^>]+>/g, "").trim();
    const detail   = descMatch   ? descMatch[1].replace(/<[^>]+>/g, "").trim() : headline;
    const rawDate  = dateMatch   ? new Date(dateMatch[1]).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);

    results.push({
      id:          `live-${leagueId}-${idx}`,
      type:        classifyType(headline),
      headline,
      detail:      detail.slice(0, 200),
      teamIds:     [],
      playerName:  extractPlayerName(headline),
      date:        rawDate,
      isBreaking:  idx < 2, // top 2 items per league are "breaking"
      leagueId,
    });

    idx++;
  }

  return results;
}

/**
 * Fetch live transactions from ESPN RSS feeds.
 * Falls back to mock data if any fetch fails or returns no items.
 */
export async function fetchLiveTransactions(): Promise<Transaction[]> {
  const results: Transaction[] = [];

  await Promise.allSettled(
    Object.entries(RSS_FEEDS).map(async ([leagueId, url]) => {
      try {
        const res = await fetch(url, {
          next: { revalidate: 300 }, // cache 5 min
          headers: { "User-Agent": "UNDRAFTED/1.0 (sports media platform)" },
          signal: AbortSignal.timeout(4000),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const xml = await res.text();
        const items = parseRSSToTransactions(xml, leagueId);
        results.push(...items);
      } catch {
        // Silently fall through — mockFallback handles this below
      }
    })
  );

  // If live fetch yielded nothing, fall back to mock data
  if (results.length === 0) {
    return mockTransactions;
  }

  // Merge: live data first, then fill remaining slots from mock
  const combined = [...results, ...mockTransactions]
    .filter((t, i, arr) => arr.findIndex((x) => x.headline === t.headline) === i)
    .slice(0, 20);

  return combined;
}

/**
 * Lightweight check — returns true if live feed is reachable.
 */
export async function isLiveFeedReachable(): Promise<boolean> {
  try {
    const res = await fetch(RSS_FEEDS.nfl, {
      method: "HEAD",
      signal: AbortSignal.timeout(2000),
    });
    return res.ok;
  } catch {
    return false;
  }
}
