import type { ScrapedScore } from "./types";
import { ScraperBase } from "./base";

const scraper = new ScraperBase();

const CACHE_KEY_PREFIX = "scores";
const CACHE_TTL_MS = 30_000; // 30 seconds

const MOCK_SCORES: ScrapedScore[] = [
  {
    gameId: "nfl-2026-041001",
    homeTeam: "Kansas City Chiefs",
    awayTeam: "Baltimore Ravens",
    homeScore: 27,
    awayScore: 24,
    status: "in_progress",
    quarter: "Q4",
    timeRemaining: "2:47",
    league: "NFL",
    network: "NBC",
  },
  {
    gameId: "nba-2026-041002",
    homeTeam: "Boston Celtics",
    awayTeam: "Denver Nuggets",
    homeScore: 108,
    awayScore: 102,
    status: "in_progress",
    quarter: "Q3",
    timeRemaining: "5:12",
    league: "NBA",
    network: "ESPN",
  },
  {
    gameId: "mlb-2026-041003",
    homeTeam: "Los Angeles Dodgers",
    awayTeam: "Atlanta Braves",
    homeScore: 4,
    awayScore: 3,
    status: "in_progress",
    quarter: "B7",
    timeRemaining: "1 Out",
    league: "MLB",
    network: "FOX",
  },
  {
    gameId: "nhl-2026-041004",
    homeTeam: "Edmonton Oilers",
    awayTeam: "Florida Panthers",
    homeScore: 3,
    awayScore: 2,
    status: "in_progress",
    quarter: "P3",
    timeRemaining: "8:33",
    league: "NHL",
    network: "TNT",
  },
];

/**
 * Scrape live scores. Uses mock data when SCRAPER_SCORES_URL is not set.
 * Optionally filter by league (e.g. "NFL", "NBA").
 */
export async function scrapeScores(
  league?: string
): Promise<ScrapedScore[]> {
  const cacheKey = scraper.getCacheKey(CACHE_KEY_PREFIX, league ?? "all");
  const cached = scraper.getFromCache<ScrapedScore[]>(cacheKey);
  if (cached) return cached;

  const url = process.env.SCRAPER_SCORES_URL;

  let scores: ScrapedScore[];

  if (!url) {
    // Return mock data when no scraper URL is configured
    scores = MOCK_SCORES;
  } else {
    const targetUrl = league ? `${url}?league=${league}` : url;
    const response = await scraper.fetchWithRetry(targetUrl);

    if (!response) {
      // Fall back to mock data on fetch failure
      scores = MOCK_SCORES;
    } else {
      const html = await response.text();
      const _parsed = scraper.parseHtml(html);

      // In production, parse the HTML into ScrapedScore objects here.
      // For now, fall back to mock data as the parser is a stub.
      scores = MOCK_SCORES;
    }
  }

  if (league) {
    scores = scores.filter(
      (s) => s.league.toUpperCase() === league.toUpperCase()
    );
  }

  scraper.setInCache(cacheKey, scores, CACHE_TTL_MS);
  return scores;
}
