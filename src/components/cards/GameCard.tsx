import Link from "next/link";
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

  return (
    <Link href={`/game/${game.id}`}>
      <div className={`bg-gray-900 border rounded-lg hover:border-gray-600 transition-colors cursor-pointer ${isLive ? "border-red-800" : "border-gray-800"} ${compact ? "p-3" : "p-4"}`}>
        <div className="flex items-center justify-between mb-3">
          <GameStatusBadge status={game.status} />
          {isLive && (
            <span className="text-xs text-gray-400">
              {game.quarter} · {game.timeRemaining}
            </span>
          )}
          {!isLive && !isUpcoming && (
            <span className="text-xs text-gray-500">{game.date}</span>
          )}
          {isUpcoming && (
            <span className="text-xs text-gray-400">{game.date}</span>
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
          <p className={`font-semibold text-white ${compact ? "text-sm" : "text-base"}`}>{team.name}</p>
          <p className="text-xs text-gray-500">{team.record}</p>
        </div>
      </div>
      {!isUpcoming && (
        <span className={`font-black tabular-nums ${compact ? "text-lg" : "text-2xl"} ${isWinning ? "text-white" : "text-gray-500"}`}>
          {score}
        </span>
      )}
    </div>
  );
}
