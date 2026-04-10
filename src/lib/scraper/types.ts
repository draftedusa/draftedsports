export interface ScrapedScore {
  gameId: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: string;
  quarter: string;
  timeRemaining: string;
  league: string;
  network?: string;
}

export interface ScrapedStat {
  playerId: string;
  playerName: string;
  teamName: string;
  league: string;
  category: string;
  value: number | string;
  rank: number;
}

export interface ScrapedTransaction {
  id: string;
  headline: string;
  type: "trade" | "signing" | "injury" | "extension" | "release" | "rumor";
  teams: string[];
  date: string;
  source: string;
  isBreaking: boolean;
}

export interface ScrapedNewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  league: string;
  imageUrl?: string;
}

export interface ScraperConfig {
  baseUrl: string;
  enabled: boolean;
  cacheTtlMs: number;
  retries: number;
}
