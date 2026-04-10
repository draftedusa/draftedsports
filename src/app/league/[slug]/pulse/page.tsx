import { notFound } from "next/navigation";
import Link from "next/link";
import { leagues } from "@/data/leagues";
import { games } from "@/data/games";
import { teams } from "@/data/teams";
import { articles } from "@/data/articles";
import { bettingLineMap } from "@/data/betting";
import LayoutGamma from "@/components/layout/LayoutGamma";
import ContentCard from "@/components/cards/ContentCard";
import DynamicFeed from "@/components/social/DynamicFeed";
import Kicker from "@/components/ui/Kicker";
import OddsCard from "@/components/betting/OddsCard";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return leagues.map((l) => ({ slug: l.slug }));
}

// ─────────────────────────────────────────────────────────
// Scores + Odds rail (left panel)
// ─────────────────────────────────────────────────────────
function ScoresRail({
  leagueId,
  teamMap,
  leagueSlug,
}: {
  leagueId: string;
  teamMap: Record<string, (typeof teams)[number]>;
  leagueSlug: string;
}) {
  const leagueGames = games
    .filter((g) => g.leagueId === leagueId)
    .slice(0, 6);

  if (leagueGames.length === 0) {
    return (
      <div className="px-3 py-4 text-center">
        <p className="text-xs text-surface-muted">No games scheduled.</p>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {/* Header */}
      <div className="px-3 py-2 border-b border-surface-300 dark:border-white/5 flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-widest text-surface-muted">
          Scores &amp; Lines
        </span>
        <Link
          href={`/league/${leagueSlug}/betting`}
          className="text-[9px] font-bold text-brand hover:text-brand/80 transition-colors"
        >
          Full Lines →
        </Link>
      </div>

      {leagueGames.map((g) => {
        const home = teamMap[g.homeTeamId];
        const away = teamMap[g.awayTeamId];
        if (!home || !away) return null;

        const line = bettingLineMap[g.id];

        // Games with betting lines → interactive OddsCard
        if (line) {
          return (
            <div key={g.id} className="border-b border-surface-300 dark:border-white/5">
              <OddsCard
                game={g}
                homeTeam={home}
                awayTeam={away}
                line={line}
                className="rounded-none border-0 border-none bg-transparent"
              />
            </div>
          );
        }

        // Fallback: score-only row with link to game page
        return (
          <Link
            key={g.id}
            href={`/game/${g.id}`}
            className="block px-3 py-3 border-b border-surface-300 dark:border-white/5 hover:bg-surface-200/50 transition-colors"
          >
            <div className="flex items-center gap-1.5 mb-1.5">
              {g.status === "live" ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-red-500">
                    {g.quarter} {g.timeRemaining}
                  </span>
                </>
              ) : g.status === "final" ? (
                <span className="text-[9px] font-bold uppercase text-surface-muted">Final</span>
              ) : (
                <span className="text-[9px] text-surface-muted">{g.date}</span>
              )}
            </div>
            <div className="space-y-1">
              {[away, home].map((team, i) => (
                <div key={team.id} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-sm shrink-0">{team.logo}</span>
                    <span className="text-xs font-semibold text-surface-text truncate">
                      {team.name.split(" ").at(-1)}
                    </span>
                  </div>
                  {g.status !== "upcoming" && (
                    <span className="text-xs font-bold text-surface-text tabular-nums shrink-0">
                      {i === 0 ? g.awayScore : g.homeScore}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Link>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────
export default async function LeaguePulsePage({ params }: Props) {
  const { slug } = await params;
  const league   = leagues.find((l) => l.slug === slug);
  if (!league) notFound();

  const teamMap       = Object.fromEntries(teams.map((t) => [t.id, t]));
  const leagueArticles = articles
    .filter((a) => a.tagIds.includes(`tag-${league.id}`))
    .sort((a, b) => b.views - a.views);
  const featured   = leagueArticles[0];
  const secondary  = leagueArticles.slice(1, 4);

  return (
    <div className="space-y-6">
      {/* ── League identity bar ─────────────────────── */}
      <div className="flex items-center gap-3 pb-4 border-b border-surface-300">
        <span className="text-4xl">{league.logo}</span>
        <div className="flex-1 min-w-0">
          <Kicker label={league.sport} />
          <h1 className="text-2xl font-black tracking-tighter leading-none text-surface-text mt-0.5">
            {league.name} <span className="text-brand font-black">Pulse</span>
          </h1>
        </div>
        <Link
          href={`/league/${league.slug}`}
          className="text-xs font-semibold text-brand hover:text-brand/80 transition-colors shrink-0"
        >
          ← League Home
        </Link>
      </div>

      {/* ── LayoutGamma ─────────────────────────────── */}
      <LayoutGamma
        left={
          <ScoresRail leagueId={league.id} teamMap={teamMap} leagueSlug={league.slug} />
        }
        center={
          <div className="space-y-5">
            {featured && <ContentCard article={featured} />}
            {secondary.length > 0 && (
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-surface-muted px-0.5">
                  More from {league.name}
                </p>
                {secondary.map((a) => (
                  <ContentCard key={a.id} article={a} />
                ))}
              </div>
            )}
            {!featured && (
              <div className="py-12 text-center text-surface-muted text-sm">
                No articles yet for {league.name}.
              </div>
            )}
          </div>
        }
        right={
          <div className="border border-surface-300 dark:border-white/5 rounded-xl overflow-hidden">
            <DynamicFeed leagueId={league.id} compact />
          </div>
        }
      />
    </div>
  );
}
