import Link from "next/link";
import { games } from "@/data/games";
import { teams } from "@/data/teams";
import { leagues } from "@/data/leagues";

export default function LeagueScheduleSidebar({ leagueSlug }: { leagueSlug: string }) {
  const league = leagues.find((l) => l.slug === leagueSlug);
  const teamMap = Object.fromEntries(teams.map((t) => [t.id, t]));
  const upcoming = games
    .filter((g) => g.leagueId === leagueSlug && g.status === "upcoming")
    .slice(0, 4);
  const live = games
    .filter((g) => g.leagueId === leagueSlug && g.status === "live")
    .slice(0, 2);

  if (!league || (upcoming.length === 0 && live.length === 0)) return null;

  const displayGames = [...live, ...upcoming].slice(0, 5);

  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-surface-muted mb-3">
        {league.logo} Schedule
      </p>
      <div className="space-y-2">
        {displayGames.map((g) => {
          const home = teamMap[g.homeTeamId];
          const away = teamMap[g.awayTeamId];
          const isLive = g.status === "live";
          return (
            <Link key={g.id} href={`/game/${g.id}`}
              className="block bg-surface-200 border border-surface-300 hover:border-brand/40 rounded-lg p-2.5 transition-colors">
              <div className="flex items-center justify-between mb-1">
                {isLive ? (
                  <span className="flex items-center gap-1 text-[9px] font-bold text-brand uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                    Live · {g.quarter} {g.timeRemaining}
                  </span>
                ) : (
                  <span className="text-[9px] text-surface-muted">{g.date}</span>
                )}
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-surface-text font-medium">{away?.logo} {away?.name}</span>
                  {isLive && <span className="text-xs font-bold tabular-nums text-surface-text">{g.awayScore}</span>}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-surface-text font-medium">{home?.logo} {home?.name}</span>
                  {isLive && <span className="text-xs font-bold tabular-nums text-surface-text">{g.homeScore}</span>}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      <Link href="/scores" className="block mt-2 text-[10px] font-bold text-brand hover:underline">
        Full Schedule →
      </Link>
    </div>
  );
}
