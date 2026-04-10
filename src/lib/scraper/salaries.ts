import type { ScrapedTransaction } from "./types";
import { ScraperBase } from "./base";

const scraper = new ScraperBase();

const CACHE_KEY_PREFIX = "contracts";
const CACHE_TTL_MS = 600_000; // 10 minutes

const MOCK_TRANSACTIONS: Record<string, ScrapedTransaction[]> = {
  NBA: [
    {
      id: "txn-nba-001",
      headline: "Trae Young signs 5-year, $215M supermax extension with Hawks",
      type: "extension",
      teams: ["Atlanta Hawks"],
      date: "2026-04-08",
      source: "ESPN",
      isBreaking: false,
    },
    {
      id: "txn-nba-002",
      headline: "Lakers acquire Zach LaVine from Bulls in blockbuster trade",
      type: "trade",
      teams: ["Los Angeles Lakers", "Chicago Bulls"],
      date: "2026-04-09",
      source: "The Athletic",
      isBreaking: true,
    },
  ],
  NFL: [
    {
      id: "txn-nfl-001",
      headline: "Bengals place franchise tag on Tee Higgins for second consecutive year",
      type: "signing",
      teams: ["Cincinnati Bengals"],
      date: "2026-04-07",
      source: "NFL Network",
      isBreaking: false,
    },
    {
      id: "txn-nfl-002",
      headline: "Derrick Henry agrees to 2-year, $28M deal with Ravens",
      type: "signing",
      teams: ["Baltimore Ravens"],
      date: "2026-04-10",
      source: "Adam Schefter",
      isBreaking: true,
    },
  ],
  MLB: [
    {
      id: "txn-mlb-001",
      headline: "Juan Soto opts out, signs record 15-year, $765M contract with Mets",
      type: "signing",
      teams: ["New York Mets"],
      date: "2026-04-05",
      source: "MLB.com",
      isBreaking: false,
    },
    {
      id: "txn-mlb-002",
      headline: "Dodgers trade prospect package to Marlins for starting pitching help",
      type: "trade",
      teams: ["Los Angeles Dodgers", "Miami Marlins"],
      date: "2026-04-09",
      source: "Ken Rosenthal",
      isBreaking: false,
    },
  ],
  NHL: [
    {
      id: "txn-nhl-001",
      headline: "Oilers extend Connor McDavid on 8-year, $112M deal",
      type: "extension",
      teams: ["Edmonton Oilers"],
      date: "2026-04-06",
      source: "TSN",
      isBreaking: false,
    },
    {
      id: "txn-nhl-002",
      headline: "Bruins acquire winger from Senators ahead of trade deadline",
      type: "trade",
      teams: ["Boston Bruins", "Ottawa Senators"],
      date: "2026-04-10",
      source: "Sportsnet",
      isBreaking: true,
    },
  ],
};

/**
 * Scrape contract and transaction data for a given league.
 * Uses mock data when SCRAPER_CONTRACTS_URL is not set.
 */
export async function scrapeContracts(
  league: string
): Promise<ScrapedTransaction[]> {
  const upperLeague = league.toUpperCase();
  const cacheKey = scraper.getCacheKey(CACHE_KEY_PREFIX, upperLeague);
  const cached = scraper.getFromCache<ScrapedTransaction[]>(cacheKey);
  if (cached) return cached;

  const url = process.env.SCRAPER_CONTRACTS_URL;

  let transactions: ScrapedTransaction[];

  if (!url) {
    transactions = MOCK_TRANSACTIONS[upperLeague] ?? [];
  } else {
    const targetUrl = `${url}?league=${upperLeague}`;
    const response = await scraper.fetchWithRetry(targetUrl);

    if (!response) {
      transactions = MOCK_TRANSACTIONS[upperLeague] ?? [];
    } else {
      const html = await response.text();
      const _parsed = scraper.parseHtml(html);

      // In production, parse the HTML into ScrapedTransaction objects here.
      // For now, fall back to mock data as the parser is a stub.
      transactions = MOCK_TRANSACTIONS[upperLeague] ?? [];
    }
  }

  scraper.setInCache(cacheKey, transactions, CACHE_TTL_MS);
  return transactions;
}
