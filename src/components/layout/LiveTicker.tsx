"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart2, Tv, BellRing } from "lucide-react";
import { games } from "@/data/games";
import { teams } from "@/data/teams";

// ─────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────
const teamMap = Object.fromEntries(teams.map((t) => [t.id, t]));

/** 3-char ticker code: last word of team name, first 3 chars, uppercased. */
function teamCode(teamId: string): string {
  const team = teamMap[teamId];
  if (!team) return "---";
  const words = team.name.split(" ");
  return (words.at(-1) ?? words[0]).slice(0, 3).toUpperCase();
}

function statusText(game: (typeof games)[number]): string {
  if (game.status === "final")    return "FINAL";
  if (game.status === "live")     return `${game.quarter} ${game.timeRemaining}`.trim();
  return game.date;                // upcoming
}

// Build tiles from real game data (live first, then final, then upcoming)
const ORDER: Record<string, number> = { live: 0, final: 1, upcoming: 2 };
const TICKER_GAMES = [...games]
  .sort((a, b) => (ORDER[a.status] ?? 3) - (ORDER[b.status] ?? 3))
  .slice(0, 12)
  .map((g) => ({
    id:      g.id,
    league:  g.leagueId.toUpperCase(),
    home:    teamCode(g.homeTeamId),
    away:    teamCode(g.awayTeamId),
    score:   `${g.awayScore} – ${g.homeScore}`,
    status:  statusText(g),
    isLive:  g.status === "live",
  }));

// ─────────────────────────────────────────────────────────
// LiveTicker
// ─────────────────────────────────────────────────────────
export default function LiveTicker() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (TICKER_GAMES.length === 0) return null;

  return (
    <div className="relative h-10 w-full border-b border-white/5 bg-zinc-950 flex items-center overflow-hidden">

      {/* Left "Scores" badge */}
      <div className="z-10 flex h-full shrink-0 items-center bg-red-600 px-4 text-[10px] font-black uppercase tracking-widest text-white shadow-[10px_0_15px_rgba(0,0,0,0.5)]">
        Scores
        <span className="ml-2 animate-pulse rounded-full bg-white w-1.5 h-1.5 shrink-0" />
      </div>

      {/* Scrollable game tiles */}
      <div className="flex flex-1 items-center overflow-x-auto no-scrollbar">
        {TICKER_GAMES.map((game) => (
          <div
            key={game.id}
            onMouseEnter={() => setHoveredId(game.id)}
            onMouseLeave={() => setHoveredId(null)}
            className="relative flex h-10 min-w-[180px] cursor-pointer items-center justify-center border-r border-white/5 px-6 transition-colors hover:bg-white/5"
          >
            {/* Standard score view */}
            <div className={`flex items-center gap-3 transition-opacity duration-200 ${hoveredId === game.id ? "opacity-0" : "opacity-100"}`}>
              <span className="text-[10px] font-bold text-white/40">{game.league}</span>
              <span className="text-xs font-black text-white whitespace-nowrap">
                {game.away} {game.score} {game.home}
              </span>
              <span className={`text-[9px] font-bold whitespace-nowrap ${game.status === "FINAL" ? "text-white/30" : game.isLive ? "text-red-500" : "text-white/50"}`}>
                {game.status}
              </span>
            </div>

            {/* Hover "portal" — Boxscore / Gamecast / Alert */}
            <AnimatePresence>
              {hoveredId === game.id && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute inset-0 z-20 flex items-center justify-center gap-4 bg-zinc-900"
                >
                  <Link
                    href={`/game/${game.id}`}
                    className="flex items-center gap-1 text-[9px] font-black uppercase tracking-tighter text-white hover:text-red-500 transition-colors"
                  >
                    <BarChart2 size={12} /> Boxscore
                  </Link>
                  <Link
                    href={`/game/${game.id}`}
                    className="flex items-center gap-1 text-[9px] font-black uppercase tracking-tighter text-white hover:text-red-500 transition-colors"
                  >
                    <Tv size={12} /> Gamecast
                  </Link>
                  <button
                    aria-label="Set game alert"
                    className="text-white/40 hover:text-white transition-colors"
                  >
                    <BellRing size={12} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

    </div>
  );
}
