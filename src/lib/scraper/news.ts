import type { ScrapedNewsItem } from "./types";
import { ScraperBase } from "./base";

const scraper = new ScraperBase();

const CACHE_KEY_PREFIX = "news";
const CACHE_TTL_MS = 120_000; // 2 minutes

const MOCK_NEWS: ScrapedNewsItem[] = [
  {
    id: "news-001",
    title: "Chiefs rally past Ravens in overtime thriller to remain undefeated",
    description:
      "Patrick Mahomes threw for 347 yards and three touchdowns as Kansas City edged Baltimore 34-31 in a Sunday Night Football classic.",
    url: "https://example.com/nfl/chiefs-ravens-recap",
    source: "ESPN",
    publishedAt: "2026-04-10T02:15:00Z",
    league: "NFL",
    imageUrl: "https://example.com/images/chiefs-ravens.jpg",
  },
  {
    id: "news-002",
    title: "Celtics clinch top seed in Eastern Conference with dominant win over Bucks",
    description:
      "Boston secured home-court advantage throughout the NBA playoffs after a 118-94 victory behind Jayson Tatum's 34 points.",
    url: "https://example.com/nba/celtics-clinch-top-seed",
    source: "The Athletic",
    publishedAt: "2026-04-09T23:45:00Z",
    league: "NBA",
    imageUrl: "https://example.com/images/celtics-clinch.jpg",
  },
  {
    id: "news-003",
    title: "Ohtani launches two home runs as Dodgers extend win streak to nine games",
    description:
      "Shohei Ohtani went 3-for-4 with two homers and five RBI, powering Los Angeles past the Braves 8-3 at Dodger Stadium.",
    url: "https://example.com/mlb/ohtani-two-homers",
    source: "MLB.com",
    publishedAt: "2026-04-09T21:30:00Z",
    league: "MLB",
  },
  {
    id: "news-004",
    title: "McDavid records five-point night in Oilers' rout of Panthers",
    description:
      "Connor McDavid tallied two goals and three assists as Edmonton dismantled Florida 7-2 in a Stanley Cup Finals rematch.",
    url: "https://example.com/nhl/mcdavid-five-points",
    source: "TSN",
    publishedAt: "2026-04-09T22:00:00Z",
    league: "NHL",
    imageUrl: "https://example.com/images/mcdavid-oilers.jpg",
  },
  {
    id: "news-005",
    title: "NBA Draft lottery odds set: Wizards hold best chance at No. 1 pick",
    description:
      "Washington finished with the league's worst record and will enter the draft lottery with a 14% chance of landing the top selection.",
    url: "https://example.com/nba/draft-lottery-odds",
    source: "Bleacher Report",
    publishedAt: "2026-04-09T18:00:00Z",
    league: "NBA",
  },
  {
    id: "news-006",
    title: "NFL announces 2026 international series schedule with five London games",
    description:
      "The league will stage five regular-season games at Tottenham Hotspur Stadium and Wembley, plus two in Germany and one in Brazil.",
    url: "https://example.com/nfl/international-schedule-2026",
    source: "NFL Network",
    publishedAt: "2026-04-09T16:00:00Z",
    league: "NFL",
    imageUrl: "https://example.com/images/nfl-london.jpg",
  },
];

/**
 * Scrape news headlines. Uses mock data when SCRAPER_NEWS_URL is not set.
 * Optionally filter by league (e.g. "NFL", "NBA").
 */
export async function scrapeNews(
  league?: string
): Promise<ScrapedNewsItem[]> {
  const cacheKey = scraper.getCacheKey(CACHE_KEY_PREFIX, league ?? "all");
  const cached = scraper.getFromCache<ScrapedNewsItem[]>(cacheKey);
  if (cached) return cached;

  const url = process.env.SCRAPER_NEWS_URL;

  let news: ScrapedNewsItem[];

  if (!url) {
    // Return mock data when no scraper URL is configured
    news = MOCK_NEWS;
  } else {
    const targetUrl = league ? `${url}?league=${league}` : url;
    const response = await scraper.fetchWithRetry(targetUrl);

    if (!response) {
      // Fall back to mock data on fetch failure
      news = MOCK_NEWS;
    } else {
      const html = await response.text();
      const _parsed = scraper.parseHtml(html);

      // In production, parse the HTML into ScrapedNewsItem objects here.
      // For now, fall back to mock data as the parser is a stub.
      news = MOCK_NEWS;
    }
  }

  if (league) {
    news = news.filter(
      (n) => n.league.toUpperCase() === league.toUpperCase()
    );
  }

  scraper.setInCache(cacheKey, news, CACHE_TTL_MS);
  return news;
}
