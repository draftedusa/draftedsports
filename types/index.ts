export interface League {
  id: string;
  name: string;
  slug: string;
  sport: string;
  logo: string;
}

export interface Team {
  id: string;
  name: string;
  slug: string;
  leagueId: string;
  logo: string;
  record: string;
  standing: number;
  primaryColor: string;
}

export interface Player {
  id: string;
  name: string;
  teamId: string;
  position: string;
  number: number;
  stats: Record<string, number | string>;
}

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
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  byline: string;
  publishDate: string;
  body: string;
  teamIds: string[];
  gameId?: string;
  tagIds: string[];
  relatedArticleIds: string[];
  views: number;
  readTime: number;
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

export interface User {
  id: string;
  username: string;
  avatar: string;
  favoriteTeamIds: string[];
  savedArticleIds: string[];
  recentComments: string[];
  role?: "admin" | "user";
  password?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

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
