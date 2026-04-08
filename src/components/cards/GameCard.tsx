"use client";

import Link from "next/link";
import { useState } from "react";
import { Game, Team } from "@/types";
import { GameStatusBadge } from "@/components/ui/Badge";

interface GameCardProps {
  game: Game;
  homeTeam: Team;
  awayTeam: Team;
  compact?: boolean;
}

export default function GameCard({ game, homeTeam, awayTeam, compact = false }: GameCardProps) {
  const isLive = game.status === "live";
  const isUpcoming = game.status === "upcoming";
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/game/${game.id}`}>
        <div className={`bg-surface-200 border rounded-xl hover:border-brand/40 cursor-pointer card-lift ${isLive ? "border-brand/60" : "border-surface-300"} ${compact ? "p-3" : "p-4"}`}>
          <div className="flex items-center justify-between mb-3">
            <GameStatusBadge status={game.status} />
            {isLive && (
              <span className="text-xs text-surface-muted">
                {game.quarter} · {game.timeRemaining}
              </span>
            )}
            {!isLive && (
              <span className="text-xs text-surface-muted">{game.date}</span>
            )}
          </div>

          {/* Teams & scores */}
          <div className="space-y-2">
            <TeamRow
              team={awayTeam}
              score={game.awayScore}
              isUpcoming={isUpcoming}
              isWinning={!isUpcoming && game.awayScore > game.homeScore}
              compact={compact}
            />
            <TeamRow
              team={homeTeam}
              score={game.homeScore}
              isUpcoming={isUpcoming}
              isWinning={!isUpcoming && game.homeScore > game.awayScore}
              compact={compact}
            />
          </div>
        </div>
      </Link>

      {/* Hover overlay — action buttons */}
      {hovered && !compact && (
        <div className="absolute inset-0 rounded-xl bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2.5 transition-opacity pointer-events-auto z-10">
          <Link
            href={`/game/${game.id}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 px-5 py-2 bg-brand hover:bg-brand/90 text-white text-xs font-bold rounded-lg transition-colors"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
              <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Deep Dive
          </Link>
          <Link
            href="/watch"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 px-5 py-2 bg-surface-200/90 hover:bg-surface-200 border border-surface-300 text-surface-text text-xs font-bold rounded-lg transition-colors"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm12.553.106A1 1 0 0014 7v6a1 1 0 00.553.894l2 1A1 1 0 0018 14V6a1 1 0 00-1.447-.894l-2 1z" />
            </svg>
            Watch Reactions
          </Link>
        </div>
      )}
    </div>
  );
}

function TeamRow({
  team,
  score,
  isUpcoming,
  isWinning,
  compact,
}: {
  team: Team;
  score: number;
  isUpcoming: boolean;
  isWinning: boolean;
  compact: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className={compact ? "text-base" : "text-lg"}>{team.logo}</span>
        <div>
          <p className={`font-semibold text-surface-text ${compact ? "text-sm" : "text-base"}`}>{team.name}</p>
          <p className="text-xs text-surface-muted">{team.record}</p>
        </div>
      </div>
      {!isUpcoming && (
        <span className={`font-black tabular-nums ${compact ? "text-lg" : "text-2xl"} ${isWinning ? "text-surface-text" : "text-surface-muted"}`}>
          {score}
        </span>
      )}
    </div>
  );
}
