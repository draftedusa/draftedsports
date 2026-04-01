"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { articles } from "@/data/articles";
import { teams } from "@/data/teams";
import { players } from "@/data/players";
import { games } from "@/data/games";
import { formatCount } from "@/lib/utils";

type ResultType = "all" | "articles" | "teams" | "players" | "games";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ResultType>("all");
  const q = query.toLowerCase().trim();

  const teamMap = Object.fromEntries(teams.map((t) => [t.id, t]));

  const matchedArticles = useMemo(() =>
    q.length < 2 ? [] : articles.filter((a) =>
      a.title.toLowerCase().includes(q) ||
      a.byline.toLowerCase().includes(q) ||
      a.body.toLowerCase().includes(q)
    ), [q]);

  const matchedTeams = useMemo(() =>
    q.length < 2 ? [] : teams.filter((t) =>
      t.name.toLowerCase().includes(q) ||
      t.leagueId.toLowerCase().includes(q)
    ), [q]);

  const matchedPlayers = useMemo(() =>
    q.length < 2 ? [] : players.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.position.toLowerCase().includes(q)
    ), [q]);

  const matchedGames = useMemo(() =>
    q.length < 2 ? [] : games.filter((g) => {
      const home = teamMap[g.homeTeamId];
      const away = teamMap[g.awayTeamId];
      return (
        home?.name.toLowerCase().includes(q) ||
        away?.name.toLowerCase().includes(q) ||
        g.leagueId.toLowerCase().includes(q)
      );
    }), [q]);

  const totalResults = matchedArticles.length + matchedTeams.length + matchedPlayers.length + matchedGames.length;

  const FILTERS: { label: string; value: ResultType; count: number }[] = [
    { label: "All", value: "all", count: totalResults },
    { label: "Articles", value: "articles", count: matchedArticles.length },
    { label: "Teams", value: "teams", count: matchedTeams.length },
    { label: "Players", value: "players", count: matchedPlayers.length },
    { label: "Games", value: "games", count: matchedGames.length },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-black text-white">Search</h1>

      {/* Search input */}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-muted text-lg">🔍</span>
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search articles, teams, players…"
          className="w-full bg-surface-200 border border-surface-300 rounded-xl px-12 py-4 text-surface-text text-lg placeholder-gray-600 focus:outline-none focus:border-gray-500"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-muted hover:text-surface-text text-xl"
          >
            ×
          </button>
        )}
      </div>

      {/* Filter tabs */}
      {q.length >= 2 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${filter === f.value ? "bg-red-600 text-white" : "bg-surface-300 text-surface-muted hover:bg-surface-300 hover:text-surface-text"}`}
            >
              {f.label} {f.count > 0 && <span className="ml-1 opacity-70">({f.count})</span>}
            </button>
          ))}
        </div>
      )}

      {/* Results */}
      {q.length < 2 ? (
        <div className="text-center py-20 text-surface-muted">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-lg">Type at least 2 characters to search</p>
        </div>
      ) : totalResults === 0 ? (
        <div className="text-center py-20 text-surface-muted">
          <p className="text-5xl mb-4">😕</p>
          <p className="text-lg">No results for "<span className="text-surface-muted">{query}</span>"</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Teams */}
          {(filter === "all" || filter === "teams") && matchedTeams.length > 0 && (
            <section>
              <h2 className="text-xs font-bold text-surface-muted uppercase tracking-widest mb-3">Teams</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {matchedTeams.map((team) => (
                  <Link key={team.id} href={`/team/${team.slug}`}>
                    <div className="flex items-center gap-3 p-3 bg-surface-200 border border-surface-300 rounded-lg hover:border-brand/40 transition-colors">
                      <span className="text-2xl">{team.logo}</span>
                      <div>
                        <p className="text-sm font-bold text-white">{team.name}</p>
                        <p className="text-xs text-surface-muted">{team.leagueId.toUpperCase()} · {team.record}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Players */}
          {(filter === "all" || filter === "players") && matchedPlayers.length > 0 && (
            <section>
              <h2 className="text-xs font-bold text-surface-muted uppercase tracking-widest mb-3">Players</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {matchedPlayers.map((player) => {
                  const team = teamMap[player.teamId];
                  return (
                    <Link key={player.id} href={`/player/${player.id}`}>
                      <div className="flex items-center gap-3 p-3 bg-surface-200 border border-surface-300 rounded-lg hover:border-brand/40 transition-colors">
                        <span className="w-9 h-9 rounded-full bg-surface-300 flex items-center justify-center text-sm font-bold text-white">
                          {player.number}
                        </span>
                        <div>
                          <p className="text-sm font-bold text-white">{player.name}</p>
                          <p className="text-xs text-surface-muted">{player.position} · {team?.name}</p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* Games */}
          {(filter === "all" || filter === "games") && matchedGames.length > 0 && (
            <section>
              <h2 className="text-xs font-bold text-surface-muted uppercase tracking-widest mb-3">Games</h2>
              <div className="space-y-2">
                {matchedGames.map((g) => {
                  const home = teamMap[g.homeTeamId];
                  const away = teamMap[g.awayTeamId];
                  return (
                    <Link key={g.id} href={`/game/${g.id}`}>
                      <div className="flex items-center gap-3 p-3 bg-surface-200 border border-surface-300 rounded-lg hover:border-brand/40 transition-colors">
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-surface-300 text-surface-muted uppercase">{g.status}</span>
                        <p className="text-sm text-surface-text font-medium">
                          {away.name} {g.status !== "upcoming" ? `${g.awayScore} – ${g.homeScore}` : "vs"} {home.name}
                        </p>
                        <span className="text-xs text-surface-muted ml-auto">{g.leagueId.toUpperCase()}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* Articles */}
          {(filter === "all" || filter === "articles") && matchedArticles.length > 0 && (
            <section>
              <h2 className="text-xs font-bold text-surface-muted uppercase tracking-widest mb-3">Articles</h2>
              <div className="space-y-2">
                {matchedArticles.map((art) => (
                  <Link key={art.id} href={`/article/${art.slug}`}>
                    <div className="p-4 bg-surface-200 border border-surface-300 rounded-lg hover:border-brand/40 transition-colors">
                      <p className="text-sm font-bold text-surface-text mb-1 leading-snug">{art.title}</p>
                      <div className="flex items-center gap-3 text-xs text-surface-muted">
                        <span>{art.byline}</span>
                        <span>·</span>
                        <span>{formatCount(art.views)} views</span>
                        <span>·</span>
                        <span>{art.readTime} min read</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
