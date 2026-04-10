// ═══════════════════════════════════════════════════════
// UNDRAFTED — Core Type System
// ═══════════════════════════════════════════════════════

// ── League Hierarchy ─────────────────────────────────

export interface League {
  id: string;
  name: string;
  slug: string;
  sport: string;
  logo: string;
  /** "Standings" (US pro), "Rankings" (NCAA), "Tables" (soccer) */
  standingsLabel?: "Standings" | "Rankings" | "Tables";
  /** Country or region */
  region?: "US" | "Europe" | "Global";
  /** Whether this league uses conferences */
  hasConferences?: boolean;
  /** Whether this league uses divisions */
  hasDivisions?: boolean;
}

export interface Conference {
  id: string;
  leagueId: string;
  name: string;
  shortName: string;
}

export interface Division {
  id: string;
  conferenceId: string;
  leagueId: string;
  name: string;
  shortName: string;
}

export interface Team {
  id: string;
  name: string;
  slug: string;
  leagueId: string;
  conferenceId?: string;
  divisionId?: string;
  logo: string;
  record: string;
  standing: number;
  primaryColor: string;
  /** Secondary/accent color for gradients */
  secondaryColor?: string;
  /** City or school name */
  city?: string;
  /** Stadium or arena name */
  venue?: string;
}

export interface Player {
  id: string;
  name: string;
  teamId: string;
  position: string;
  number: number;
  stats: Record<string, number | string>;
  /** Optional: headshot emoji placeholder */
  avatar?: string;
}

// ── Games & Events ───────────────────────────────────

export type GameStatus = "live" | "final" | "upcoming";

export interface GameEvent {
  id: string;
  gameId: string;
  time: string;
  type: "score" | "foul" | "timeout" | "injury" | "highlight" | "turnover";
  description: string;
  playerId?: string;
  teamId?: string;
  isHighlight: boolean;
}

export interface Game {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  leagueId: string;
  status: GameStatus;
  homeScore: number;
  awayScore: number;
  quarter: string;
  timeRemaining: string;
  date: string;
  events: GameEvent[];
  /** Broadcast network (ESPN, TNT, etc.) */
  network?: string;
}

// ── Content ──────────────────────────────────────────

export interface Article {
  id: string;
  title: string;
  slug: string;
  byline: string;
  publishDate: string;
  body: string;
  excerpt?: string;
  category?: string;
  isTrending?: boolean;
  teamIds: string[];
  gameId?: string;
  tagIds: string[];
  relatedArticleIds: string[];
  views: number;
  readTime: number;
  /** Cover image placeholder emoji */
  coverEmoji?: string;
}

export interface Thread {
  id: string;
  title: string;
  gameId?: string;
  articleId?: string;
  commentCount: number;
  isLive: boolean;
  isPinned: boolean;
}

export interface Comment {
  id: string;
  threadId: string;
  userId: string;
  body: string;
  createdAt: string;
  reactions: {
    fire: number;
    wow: number;
    facts: number;
    lol: number;
  };
}

// ── Users & Auth ─────────────────────────────────────

export interface User {
  id: string;
  username: string;
  avatar: string;
  favoriteTeamIds: string[];
  savedArticleIds: string[];
  recentComments: string[];
  role?: "admin" | "user";
  password?: string;
  /** Loyalty points — "DraftCoin" */
  draftCoins?: number;
}

// ── Tags ─────────────────────────────────────────────

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

// ── Highlights ───────────────────────────────────────

export type HighlightStatus = "pending" | "live" | "archived";

export interface Highlight {
  id: string;
  gameId: string;
  eventId?: string;
  title: string;
  thumbnailUrl: string;
  source: string;
  timestamp: string;
  status: HighlightStatus;
}

// ── Polls ────────────────────────────────────────────

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  threadId?: string;
  articleId?: string;
  votes: number;
}
