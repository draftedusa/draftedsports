import { Game, Team, Article } from "@/types";

/** Format a game score/status string for display (e.g. "118–107 | 4th Q 1:45"). */
export function formatGameScore(game: Game, homeTeam: Team, awayTeam: Team): string {
  if (game.status === "upcoming") {
    return `${awayTeam.name} @ ${homeTeam.name}`;
  }
  const score = `${game.awayScore}–${game.homeScore}`;
  if (game.status === "final") return `${score} | Final`;
  return `${score} | ${game.quarter} ${game.timeRemaining}`;
}

/** Return a human-readable relative time string (e.g. "2h ago", "just now"). */
export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

/** Format a large number with K/M abbreviations (e.g. 45200 → "45.2K"). */
export function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

/** Return a CSS color string or Tailwind-compatible hex for a team's primary color. */
export function teamColor(team: Team): string {
  return team.primaryColor;
}

/** Slugify an arbitrary string (used for dynamic routing helpers). */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Return the status badge label for a game. */
export function gameStatusLabel(game: Game): string {
  if (game.status === "live") return "LIVE";
  if (game.status === "final") return "Final";
  return `${new Date(game.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
}

/** Truncate body text to a given character limit and append ellipsis. */
export function truncate(text: string, limit = 120): string {
  if (text.length <= limit) return text;
  return text.slice(0, limit).trimEnd() + "…";
}

/** Sort articles by views descending. */
export function topArticles(articles: Article[], limit = 5): Article[] {
  return [...articles].sort((a, b) => b.views - a.views).slice(0, limit);
}

/** Filter games to only live ones. */
export function liveGames(games: Game[]): Game[] {
  return games.filter((g) => g.status === "live");
}
