import type { ScrapedStat } from "./types";
import { ScraperBase } from "./base";

const scraper = new ScraperBase();

const CACHE_KEY_PREFIX = "stats";
const CACHE_TTL_MS = 300_000; // 5 minutes

const MOCK_STATS: Record<string, ScrapedStat[]> = {
  NBA: [
    { playerId: "nba-001", playerName: "Luka Doncic", teamName: "Dallas Mavericks", league: "NBA", category: "PPG", value: 33.9, rank: 1 },
    { playerId: "nba-002", playerName: "Shai Gilgeous-Alexander", teamName: "Oklahoma City Thunder", league: "NBA", category: "PPG", value: 31.4, rank: 2 },
    { playerId: "nba-003", playerName: "Jayson Tatum", teamName: "Boston Celtics", league: "NBA", category: "PPG", value: 28.7, rank: 3 },
    { playerId: "nba-004", playerName: "Giannis Antetokounmpo", teamName: "Milwaukee Bucks", league: "NBA", category: "PPG", value: 27.8, rank: 4 },
    { playerId: "nba-005", playerName: "Anthony Edwards", teamName: "Minnesota Timberwolves", league: "NBA", category: "PPG", value: 26.5, rank: 5 },
  ],
  NFL: [
    { playerId: "nfl-001", playerName: "Josh Allen", teamName: "Buffalo Bills", league: "NFL", category: "Passing TD", value: 42, rank: 1 },
    { playerId: "nfl-002", playerName: "Lamar Jackson", teamName: "Baltimore Ravens", league: "NFL", category: "Passing TD", value: 39, rank: 2 },
    { playerId: "nfl-003", playerName: "Patrick Mahomes", teamName: "Kansas City Chiefs", league: "NFL", category: "Passing TD", value: 36, rank: 3 },
    { playerId: "nfl-004", playerName: "Joe Burrow", teamName: "Cincinnati Bengals", league: "NFL", category: "Passing TD", value: 34, rank: 4 },
    { playerId: "nfl-005", playerName: "C.J. Stroud", teamName: "Houston Texans", league: "NFL", category: "Passing TD", value: 31, rank: 5 },
  ],
  MLB: [
    { playerId: "mlb-001", playerName: "Aaron Judge", teamName: "New York Yankees", league: "MLB", category: "HR", value: 54, rank: 1 },
    { playerId: "mlb-002", playerName: "Shohei Ohtani", teamName: "Los Angeles Dodgers", league: "MLB", category: "HR", value: 48, rank: 2 },
    { playerId: "mlb-003", playerName: "Pete Alonso", teamName: "New York Mets", league: "MLB", category: "HR", value: 42, rank: 3 },
    { playerId: "mlb-004", playerName: "Kyle Schwarber", teamName: "Philadelphia Phillies", league: "MLB", category: "HR", value: 39, rank: 4 },
    { playerId: "mlb-005", playerName: "Matt Olson", teamName: "Atlanta Braves", league: "MLB", category: "HR", value: 37, rank: 5 },
  ],
  NHL: [
    { playerId: "nhl-001", playerName: "Connor McDavid", teamName: "Edmonton Oilers", league: "NHL", category: "Points", value: 132, rank: 1 },
    { playerId: "nhl-002", playerName: "Nathan MacKinnon", teamName: "Colorado Avalanche", league: "NHL", category: "Points", value: 118, rank: 2 },
    { playerId: "nhl-003", playerName: "Nikita Kucherov", teamName: "Tampa Bay Lightning", league: "NHL", category: "Points", value: 114, rank: 3 },
    { playerId: "nhl-004", playerName: "Auston Matthews", teamName: "Toronto Maple Leafs", league: "NHL", category: "Points", value: 106, rank: 4 },
    { playerId: "nhl-005", playerName: "Leon Draisaitl", teamName: "Edmonton Oilers", league: "NHL", category: "Points", value: 104, rank: 5 },
  ],
};

/**
 * Scrape league leaders for a given league.
 * Uses mock data when SCRAPER_STATS_URL is not set.
 */
export async function scrapeLeagueLeaders(
  league: string
): Promise<ScrapedStat[]> {
  const upperLeague = league.toUpperCase();
  const cacheKey = scraper.getCacheKey(CACHE_KEY_PREFIX, upperLeague);
  const cached = scraper.getFromCache<ScrapedStat[]>(cacheKey);
  if (cached) return cached;

  const url = process.env.SCRAPER_STATS_URL;

  let stats: ScrapedStat[];

  if (!url) {
    stats = MOCK_STATS[upperLeague] ?? [];
  } else {
    const targetUrl = `${url}?league=${upperLeague}`;
    const response = await scraper.fetchWithRetry(targetUrl);

    if (!response) {
      stats = MOCK_STATS[upperLeague] ?? [];
    } else {
      const html = await response.text();
      const _parsed = scraper.parseHtml(html);

      // In production, parse the HTML into ScrapedStat objects here.
      // For now, fall back to mock data as the parser is a stub.
      stats = MOCK_STATS[upperLeague] ?? [];
    }
  }

  scraper.setInCache(cacheKey, stats, CACHE_TTL_MS);
  return stats;
}
