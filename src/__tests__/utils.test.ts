import { describe, it, expect } from "vitest";
import {
  formatCount,
  truncate,
  slugify,
  gameStatusLabel,
  liveGames,
  topArticles,
  formatGameScore,
} from "@/lib/utils";
import type { Game, Team, Article } from "@/types";

// ── formatCount ─────────────────────────────────────────────────
describe("formatCount", () => {
  it("returns raw number for < 1000", () => {
    expect(formatCount(0)).toBe("0");
    expect(formatCount(999)).toBe("999");
  });

  it("formats thousands as K", () => {
    expect(formatCount(1000)).toBe("1.0K");
    expect(formatCount(45200)).toBe("45.2K");
    expect(formatCount(999999)).toBe("1000.0K");
  });

  it("formats millions as M", () => {
    expect(formatCount(1_000_000)).toBe("1.0M");
    expect(formatCount(2_500_000)).toBe("2.5M");
  });
});

// ── truncate ────────────────────────────────────────────────────
describe("truncate", () => {
  it("returns string unchanged when under limit", () => {
    expect(truncate("hello", 10)).toBe("hello");
  });

  it("truncates and appends ellipsis at limit", () => {
    const result = truncate("hello world", 5);
    expect(result.endsWith("…")).toBe(true);
    expect(result.length).toBeLessThanOrEqual(6); // 5 chars + ellipsis
  });

  it("uses default limit of 120", () => {
    const long = "a".repeat(200);
    const result = truncate(long);
    expect(result.length).toBeLessThanOrEqual(121);
  });
});

// ── slugify ─────────────────────────────────────────────────────
describe("slugify", () => {
  it("lowercases and replaces spaces with dashes", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("removes leading and trailing dashes", () => {
    expect(slugify("  test  ")).toBe("test");
  });

  it("collapses multiple special chars into one dash", () => {
    expect(slugify("NBA & NFL")).toBe("nba-nfl");
  });
});

// ── gameStatusLabel ─────────────────────────────────────────────
describe("gameStatusLabel", () => {
  const base = { homeTeamId: "", awayTeamId: "", leagueId: "", homeScore: 0, awayScore: 0, quarter: "", timeRemaining: "", events: [] } as Omit<Game, "id" | "status" | "date">;

  it("returns LIVE for live games", () => {
    const g = { ...base, id: "g1", status: "live", date: "2026-04-01" } as Game;
    expect(gameStatusLabel(g)).toBe("LIVE");
  });

  it("returns Final for finished games", () => {
    const g = { ...base, id: "g2", status: "final", date: "2026-03-31" } as Game;
    expect(gameStatusLabel(g)).toBe("Final");
  });

  it("returns formatted date for upcoming games", () => {
    const g = { ...base, id: "g3", status: "upcoming", date: "2026-04-05" } as Game;
    const label = gameStatusLabel(g);
    expect(label).toContain("Apr");
  });
});

// ── liveGames ───────────────────────────────────────────────────
describe("liveGames", () => {
  const games = [
    { id: "g1", status: "live" },
    { id: "g2", status: "final" },
    { id: "g3", status: "live" },
    { id: "g4", status: "upcoming" },
  ] as Game[];

  it("returns only live games", () => {
    const result = liveGames(games);
    expect(result).toHaveLength(2);
    expect(result.every((g) => g.status === "live")).toBe(true);
  });
});

// ── topArticles ─────────────────────────────────────────────────
describe("topArticles", () => {
  const arts = [
    { id: "a1", views: 100 },
    { id: "a2", views: 500 },
    { id: "a3", views: 250 },
    { id: "a4", views: 750 },
    { id: "a5", views: 50 },
    { id: "a6", views: 300 },
  ] as Article[];

  it("returns articles sorted by views descending", () => {
    const result = topArticles(arts, 3);
    expect(result[0].id).toBe("a4");
    expect(result[1].id).toBe("a2");
    expect(result[2].id).toBe("a6");
  });

  it("respects the limit", () => {
    expect(topArticles(arts, 2)).toHaveLength(2);
  });

  it("does not mutate the original array", () => {
    const copy = [...arts];
    topArticles(arts, 3);
    expect(arts).toEqual(copy);
  });
});

// ── formatGameScore ─────────────────────────────────────────────
describe("formatGameScore", () => {
  const home = { id: "t1", name: "Rockets", slug: "rockets", leagueId: "nba", logo: "🚀", record: "40-29", standing: 5, primaryColor: "#CE1141" } as Team;
  const away = { id: "t2", name: "Lakers", slug: "lakers", leagueId: "nba", logo: "👑", record: "43-26", standing: 4, primaryColor: "#552583" } as Team;

  it("shows vs for upcoming games", () => {
    const g = { id: "g", homeTeamId: "t1", awayTeamId: "t2", leagueId: "nba", status: "upcoming", homeScore: 0, awayScore: 0, quarter: "", timeRemaining: "", date: "2026-04-05", events: [] } as Game;
    expect(formatGameScore(g, home, away)).toContain("@");
  });

  it("shows Final for completed games", () => {
    const g = { id: "g", homeTeamId: "t1", awayTeamId: "t2", leagueId: "nba", status: "final", homeScore: 118, awayScore: 107, quarter: "Final", timeRemaining: "0:00", date: "2026-04-01", events: [] } as Game;
    expect(formatGameScore(g, home, away)).toContain("Final");
  });

  it("shows quarter and time for live games", () => {
    const g = { id: "g", homeTeamId: "t1", awayTeamId: "t2", leagueId: "nba", status: "live", homeScore: 118, awayScore: 107, quarter: "4th", timeRemaining: "1:45", date: "2026-04-01", events: [] } as Game;
    const result = formatGameScore(g, home, away);
    expect(result).toContain("4th");
    expect(result).toContain("1:45");
  });
});
