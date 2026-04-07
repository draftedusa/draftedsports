import Link from "next/link";
import { games } from "@/data/games";
import { teams } from "@/data/teams";
import { leagues } from "@/data/leagues";
import { odds } from "@/data/odds";
import { GameStatusBadge } from "@/components/ui/Badge";

const teamMap = Object.fromEntries(teams.map((t) => [t.id, t]));
const oddsMap = Object.fromEntries(odds.map((o) => [o.gameId, o]));

export default function ScoresPage() {
  const liveGames = games.filter((g) => g.status === "live");
  const finalGames = games.filter((g) => g.status === "final");
  const upcomingGames = games.filter((g) => g.status === "upcoming");

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Page header */}
      <div className="flex items-center justify-between border-b border-surface-300 pb-4">
        <h1 className="text-2xl font-black text-surface-text">Scores & Results</h1>
        <div className="flex items-center gap-2 text-xs text-surface-muted">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse inline-block" />
          April 1, 2026
        </div>
      </div>

      {/* LIVE */}
      {liveGames.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <h2 className="text-base font-bold text-surface-text uppercase tracking-wide">Live Now</h2>
          </div>
          <div className="space-y-2">
            {liveGames.map((g) => (
              <ScoreRow key={g.id} gameId={g.id} />
            ))}
          </div>
        </section>
      )}

      {/* TODAY'S FINAL — per league */}
      {leagues.map((league) => {
        const leagueFinal = finalGames.filter((g) => g.leagueId === league.id);
        if (!leagueFinal.length) return null;
        return (
          <section key={league.id}>
            <h2 className="flex items-center gap-2 text-base font-bold text-surface-text uppercase tracking-wide mb-3 border-b border-surface-300 pb-2">
              {league.logo} {league.name} — Final
            </h2>
            <div className="space-y-2">
              {leagueFinal.map((g) => (
                <ScoreRow key={g.id} gameId={g.id} />
              ))}
            </div>
          </section>
        );
      })}

      {/* UPCOMING */}
      <section>
        <h2 className="text-base font-bold text-surface-text uppercase tracking-wide mb-3 border-b border-surface-300 pb-2">
          Upcoming
        </h2>
        <div className="space-y-2">
          {upcomingGames.map((g) => (
            <ScoreRow key={g.id} gameId={g.id} />
          ))}
        </div>
      </section>
    </div>
  );
}

function ScoreRow({ gameId }: { gameId: string }) {
  const game = games.find((g) => g.id === gameId)!;
  const home = teamMap[game.homeTeamId];
  const away = teamMap[game.awayTeamId];
  const gameOdds = oddsMap[gameId];
  const isLive = game.status === "live";
  const isUpcoming = game.status === "upcoming";
  const league = game.leagueId.toUpperCase();

  return (
    <Link href={`/game/${game.id}`}>
      <div className={`grid grid-cols-12 items-center gap-3 px-4 py-3 rounded-lg border transition-colors cursor-pointer ${isLive ? "bg-red-950/20 border-red-900/50 hover:border-red-700" : "bg-surface-200 border-surface-300 hover:border-brand/40"}`}>
        {/* Status */}
        <div className="col-span-2 sm:col-span-1">
          <GameStatusBadge status={game.status} />
          {isLive && (
            <p className="text-xs text-surface-muted mt-0.5 whitespace-nowrap">
              {game.quarter} · {game.timeRemaining}
            </p>
          )}
          {isUpcoming && (
            <p className="text-xs text-surface-muted mt-0.5 whitespace-nowrap">{game.date}</p>
          )}
        </div>

        {/* Away team */}
        <div className="col-span-4 sm:col-span-4 flex items-center gap-2">
          <span className="text-xl">{away.logo}</span>
          <div>
            <p className={`text-sm font-bold ${!isUpcoming && game.awayScore > game.homeScore ? "text-surface-text" : "text-surface-muted"}`}>
              {away.name}
            </p>
            <p className="text-xs text-surface-muted">{away.record}</p>
          </div>
        </div>

        {/* Score */}
        <div className="col-span-2 text-center">
          {!isUpcoming ? (
            <div className="flex items-center justify-center gap-2">
              <span className={`text-xl font-black tabular-nums ${game.awayScore > game.homeScore ? "text-surface-text" : "text-surface-muted"}`}>
                {game.awayScore}
              </span>
              <span className="text-surface-muted">–</span>
              <span className={`text-xl font-black tabular-nums ${game.homeScore > game.awayScore ? "text-surface-text" : "text-surface-muted"}`}>
                {game.homeScore}
              </span>
            </div>
          ) : (
            <span className="text-surface-muted text-sm">vs</span>
          )}
        </div>

        {/* Home team */}
        <div className="col-span-4 sm:col-span-3 flex items-center justify-end gap-2">
          <div className="text-right">
            <p className={`text-sm font-bold ${!isUpcoming && game.homeScore > game.awayScore ? "text-surface-text" : "text-surface-muted"}`}>
              {home.name}
            </p>
            <p className="text-xs text-surface-muted">{home.record}</p>
          </div>
          <span className="text-xl">{home.logo}</span>
        </div>

        {/* Odds (desktop) */}
        {gameOdds && (
          <div className="hidden sm:col-span-2 sm:flex flex-col items-end gap-0.5">
            <p className="text-xs text-surface-muted">{gameOdds.spread}</p>
            <p className="text-xs text-surface-muted">O/U {gameOdds.overUnder}</p>
            <p className="text-xs text-surface-muted">{gameOdds.provider}</p>
          </div>
        )}
      </div>
    </Link>
  );
}
