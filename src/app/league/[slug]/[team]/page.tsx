import { notFound } from "next/navigation";
import Link from "next/link";
import { leagues } from "@/data/leagues";
import { teams } from "@/data/teams";
import { players } from "@/data/players";
import { articles } from "@/data/articles";
import { games } from "@/data/games";
import { transactions } from "@/data/transactions";
import ArticleCard from "@/components/cards/ArticleCard";
import GameCard from "@/components/cards/GameCard";

interface Props {
  params: Promise<{ slug: string; team: string }>;
}

export default async function LeagueTeamPage({ params }: Props) {
  const { slug, team: teamSlug } = await params;

  const league = leagues.find((l) => l.slug === slug);
  if (!league) notFound();

  const team = teams.find((t) => t.slug === teamSlug && t.leagueId === league.id);
  if (!team) notFound();

  const leagueTeams   = teams.filter((t) => t.leagueId === league.id).sort((a, b) => a.standing - b.standing);
  const teamMap       = Object.fromEntries(teams.map((t) => [t.id, t]));
  const teamPlayers   = players.filter((p) => p.teamId === team.id);
  const teamArticles  = articles.filter((a) => a.teamIds.includes(team.id)).slice(0, 6);
  const teamGames     = games.filter((g) => g.homeTeamId === team.id || g.awayTeamId === team.id);
  const recentGames   = teamGames.filter((g) => g.status !== "upcoming").slice(0, 4);
  const upcomingGames = teamGames.filter((g) => g.status === "upcoming").slice(0, 2);
  const injuryNews    = transactions.filter((t) => t.teamIds.includes(team.id) && t.type === "injury");

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-surface-muted">
        <Link href="/" className="hover:text-surface-text transition-colors">Home</Link>
        <span>/</span>
        <Link href={`/league/${league.slug}`} className="hover:text-surface-text transition-colors">{league.name}</Link>
        <span>/</span>
        <span className="text-surface-text font-semibold">{team.name}</span>
      </nav>

      {/* Team hero */}
      <div
        className="rounded-xl p-6 flex items-center justify-between gap-4 flex-wrap"
        style={{ background: `linear-gradient(135deg, ${team.primaryColor}33, #030712)` }}
      >
        <div className="flex items-center gap-5">
          <span className="text-6xl">{team.logo}</span>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-surface-muted mb-0.5">{league.name} · #{team.standing}</p>
            <h1 className="text-3xl font-black text-surface-text leading-none">{team.name}</h1>
            <p className="text-lg text-surface-muted mt-1 tabular-nums">{team.record}</p>
          </div>
        </div>
        <Link
          href={`/team/${team.slug}`}
          className="text-xs font-semibold text-brand hover:text-brand/80 transition-colors border border-brand/30 rounded-lg px-3 py-1.5"
        >
          Full Team Page →
        </Link>
      </div>

      {/* 3-column layout: Left sidebar / Main feed / Right sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-[220px_1fr_220px] gap-6">

        {/* ── LEFT SIDEBAR: League standings ── */}
        <aside className="space-y-4">
          <div className="bg-surface-200 border border-surface-300 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-surface-300">
              <p className="text-xs font-black uppercase tracking-wider text-surface-text">{league.name} Standings</p>
            </div>
            <div className="divide-y divide-surface-300">
              {leagueTeams.map((t) => (
                <Link
                  key={t.id}
                  href={`/league/${league.slug}/${t.slug}`}
                  className={`flex items-center gap-2 px-4 py-2.5 hover:bg-surface-300/50 transition-colors ${t.id === team.id ? "bg-brand/10" : ""}`}
                >
                  <span className="text-xs text-surface-muted w-4 tabular-nums shrink-0">{t.standing}</span>
                  <span className="text-base leading-none shrink-0">{t.logo}</span>
                  <span className={`text-xs font-semibold truncate flex-1 ${t.id === team.id ? "text-brand" : "text-surface-text"}`}>{t.name}</span>
                  <span className="text-[10px] text-surface-muted tabular-nums shrink-0">{t.record}</span>
                </Link>
              ))}
            </div>
          </div>
        </aside>

        {/* ── MAIN FEED ── */}
        <main className="space-y-8 min-w-0">
          {/* Injury report */}
          {injuryNews.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-surface-text mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                Injury Report
              </h2>
              <div className="space-y-2">
                {injuryNews.map((tx) => (
                  <div key={tx.id} className="flex items-start gap-3 p-3 bg-red-950/20 border border-red-900/40 rounded-lg">
                    <span className="text-lg shrink-0">🩹</span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-surface-text">{tx.playerName}</p>
                      <p className="text-xs text-surface-muted leading-relaxed">{tx.headline}</p>
                    </div>
                    {tx.isBreaking && (
                      <span className="ml-auto text-[10px] font-bold text-white bg-red-600 px-2 py-0.5 rounded shrink-0">BREAKING</span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Recent games */}
          {recentGames.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-surface-text mb-3">Recent Games</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {recentGames.map((g) => (
                  <GameCard key={g.id} game={g} homeTeam={teamMap[g.homeTeamId]} awayTeam={teamMap[g.awayTeamId]} compact />
                ))}
              </div>
            </section>
          )}

          {/* Upcoming games */}
          {upcomingGames.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-surface-text mb-3">Upcoming</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {upcomingGames.map((g) => (
                  <GameCard key={g.id} game={g} homeTeam={teamMap[g.homeTeamId]} awayTeam={teamMap[g.awayTeamId]} compact />
                ))}
              </div>
            </section>
          )}

          {/* Team articles */}
          {teamArticles.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-surface-text mb-3">{team.name} News</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {teamArticles.map((a) => (
                  <ArticleCard key={a.id} article={a} />
                ))}
              </div>
            </section>
          )}
        </main>

        {/* ── RIGHT SIDEBAR: Roster ── */}
        <aside className="space-y-4">
          <div className="bg-surface-200 border border-surface-300 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-surface-300">
              <p className="text-xs font-black uppercase tracking-wider text-surface-text">Roster</p>
            </div>
            <div className="divide-y divide-surface-300">
              {teamPlayers.map((p) => {
                const [topKey, topVal] = Object.entries(p.stats)[0] ?? [];
                return (
                  <Link
                    key={p.id}
                    href={`/league/${league.slug}/${team.slug}/${p.id}`}
                    className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-surface-300/50 transition-colors group"
                  >
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white shrink-0"
                      style={{ backgroundColor: team.primaryColor }}
                    >
                      {p.number}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-surface-text group-hover:text-brand transition-colors truncate">{p.name}</p>
                      <p className="text-[10px] text-surface-muted">{p.position}</p>
                    </div>
                    {topVal !== undefined && (
                      <span className="text-[10px] font-bold text-surface-text tabular-nums shrink-0">{topVal}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return teams.map((t) => ({
    slug: t.leagueId,
    team: t.slug,
  }));
}
