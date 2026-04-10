import { notFound } from "next/navigation";
import { leagues } from "@/data/leagues";
import { games } from "@/data/games";
import { teams } from "@/data/teams";
import { bettingLines, bettingLineMap } from "@/data/betting";
import OddsCard from "@/components/betting/OddsCard";
import EdgeModule from "@/components/betting/EdgeModule";
import Kicker from "@/components/ui/Kicker";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return leagues.map((l) => ({ slug: l.slug }));
}

// ─────────────────────────────────────────────────────────
// Responsible Gambling Banner
// ─────────────────────────────────────────────────────────
function RespGamBanner() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
      <span className="text-lg shrink-0">⚠️</span>
      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-widest mb-0.5">
          Responsible Gambling
        </p>
        <p className="text-[10px] leading-snug">
          Odds are for illustration only. No real wagers accepted. If you or someone
          you know has a gambling problem, call{" "}
          <strong>1-800-GAMBLER</strong>.
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────
export default async function LeagueBettingPage({ params }: Props) {
  const { slug } = await params;
  const league = leagues.find((l) => l.slug === slug);
  if (!league) notFound();

  const teamMap = Object.fromEntries(teams.map((t) => [t.id, t]));

  // Only games that have betting lines for this league
  const leagueGames = games
    .filter((g) => g.leagueId === league.id && bettingLineMap[g.id])
    .slice(0, 6);

  // All betting lines for featured edge picks (top 2 by edgeRating)
  const allEdgeGames = bettingLines
    .filter((l) => {
      const game = games.find((g) => g.id === l.gameId);
      return game?.leagueId === league.id;
    })
    .sort((a, b) => b.edgeRating - a.edgeRating)
    .slice(0, 2);

  const hasGames = leagueGames.length > 0;

  return (
    <div className="space-y-8">
      {/* ── Page header ─────────────────────────────── */}
      <div className="flex items-center gap-3 pb-4 border-b border-surface-300">
        <span className="text-4xl">{league.logo}</span>
        <div className="flex-1 min-w-0">
          <Kicker label="Betting Lines" />
          <h1 className="text-2xl font-black tracking-tighter leading-none text-surface-text mt-0.5">
            {league.name}{" "}
            <span className="text-brand font-black">Undrafted Edge</span>
          </h1>
        </div>
      </div>

      {/* ── Responsible gambling notice ─────────────── */}
      <RespGamBanner />

      {!hasGames ? (
        <div className="py-16 text-center space-y-2">
          <p className="text-2xl">📋</p>
          <p className="text-sm text-surface-muted">
            No betting lines available for {league.name} right now.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
          {/* ── Left: OddsCard grid ───────────────────── */}
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-black uppercase tracking-widest text-surface-muted">
                Game Lines · {leagueGames.length} matchup{leagueGames.length !== 1 ? "s" : ""}
              </p>
              <span className="text-[9px] text-surface-muted">
                Tap a line to add to slip
              </span>
            </div>

            <div className="space-y-4">
              {leagueGames.map((game) => {
                const home = teamMap[game.homeTeamId];
                const away = teamMap[game.awayTeamId];
                const line = bettingLineMap[game.id];
                if (!home || !away || !line) return null;

                return (
                  <OddsCard
                    key={game.id}
                    game={game}
                    homeTeam={home}
                    awayTeam={away}
                    line={line}
                    expanded
                  />
                );
              })}
            </div>
          </div>

          {/* ── Right: Edge modules ───────────────────── */}
          <div className="space-y-5 lg:sticky lg:top-[88px]">
            <p className="text-[10px] font-black uppercase tracking-widest text-surface-muted">
              Top Edge Picks
            </p>

            {allEdgeGames.map((line) => {
              const game = games.find((g) => g.id === line.gameId);
              const home = game ? teamMap[game.homeTeamId] : null;
              const away = game ? teamMap[game.awayTeamId] : null;

              return (
                <div key={line.gameId} className="space-y-2">
                  {game && home && away && (
                    <p className="text-[10px] font-semibold text-surface-muted px-0.5">
                      {away.name.split(" ").at(-1)} @ {home.name.split(" ").at(-1)}
                    </p>
                  )}
                  <EdgeModule line={line} />
                </div>
              );
            })}

            {allEdgeGames.length === 0 && (
              <div className="py-8 text-center text-xs text-surface-muted border border-dashed border-surface-300 rounded-xl">
                No edge picks for this league.
              </div>
            )}

            {/* Promo block */}
            <div className="rounded-xl overflow-hidden border border-brand/20 bg-gradient-to-br from-brand/10 to-transparent p-5 text-center space-y-2">
              <span className="text-2xl">🎯</span>
              <p className="text-sm font-black text-surface-text tracking-tight">
                Unlock All Edge Picks
              </p>
              <p className="text-[10px] text-surface-muted">
                Full sharp-money tracking, reverse line movement alerts, and
                consensus breakdowns for every game.
              </p>
              <button
                type="button"
                className="mt-2 px-5 py-2 bg-brand hover:bg-brand/90 text-white text-xs font-black rounded-full transition-colors"
              >
                Go Pro — Free Trial
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
