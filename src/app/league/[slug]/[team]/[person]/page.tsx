import { notFound } from "next/navigation";
import Link from "next/link";
import { leagues } from "@/data/leagues";
import { teams } from "@/data/teams";
import { players } from "@/data/players";
import { articles } from "@/data/articles";
import { games } from "@/data/games";
import { transactions } from "@/data/transactions";
import ArticleCard from "@/components/cards/ArticleCard";

interface Props {
  params: Promise<{ slug: string; team: string; person: string }>;
}

const STAT_LABELS: Record<string, string> = {
  ppg: "PPG", rpg: "RPG", apg: "APG", fg: "FG%",
  touchdowns: "TD", yards: "Yds", completions: "Comp%", rating: "QBR",
  receptions: "REC", rushYards: "Rush", carries: "CAR",
  avg: "AVG", hr: "HR", rbi: "RBI", ops: "OPS",
  goals: "G", assists: "A", points: "PTS", plusMinus: "+/-",
};

export default async function LeagueTeamPersonPage({ params }: Props) {
  const { slug, team: teamSlug, person: personId } = await params;

  const league = leagues.find((l) => l.slug === slug);
  if (!league) notFound();

  const team = teams.find((t) => t.slug === teamSlug && t.leagueId === league.id);
  if (!team) notFound();

  const player = players.find((p) => p.id === personId && p.teamId === team.id);
  if (!player) notFound();

  const teamPlayers   = players.filter((p) => p.teamId === team.id);
  const teamMap       = Object.fromEntries(teams.map((t) => [t.id, t]));
  const playerArticles = articles.filter((a) => a.teamIds.includes(team.id)).slice(0, 4);
  const playerTx      = transactions.filter((t) => t.playerName === player.name);
  const recentGames   = games
    .filter((g) => (g.homeTeamId === team.id || g.awayTeamId === team.id) && g.status !== "upcoming")
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-surface-muted flex-wrap">
        <Link href="/" className="hover:text-surface-text transition-colors">Home</Link>
        <span>/</span>
        <Link href={`/league/${league.slug}`} className="hover:text-surface-text transition-colors">{league.name}</Link>
        <span>/</span>
        <Link href={`/league/${league.slug}/${team.slug}`} className="hover:text-surface-text transition-colors">{team.name}</Link>
        <span>/</span>
        <span className="text-surface-text font-semibold">{player.name}</span>
      </nav>

      {/* Player hero */}
      <div
        className="rounded-xl p-6 flex items-center gap-5"
        style={{ background: `linear-gradient(135deg, ${team.primaryColor}44, #030712)` }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black text-white border-4 shrink-0"
          style={{ borderColor: team.primaryColor, background: team.primaryColor + "33" }}
        >
          {player.number}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <span className="text-xs font-bold text-surface-muted uppercase tracking-widest">{league.name}</span>
            <span className="text-surface-muted">·</span>
            <span className="text-xs font-bold text-surface-muted">{team.logo} {team.name}</span>
            <span className="text-surface-muted">·</span>
            <span className="text-xs font-mono text-surface-muted">{player.position}</span>
          </div>
          <h1 className="text-3xl font-black text-surface-text leading-none">{player.name}</h1>
          <p className="text-sm text-surface-muted mt-1">#{player.number} · {player.position}</p>
        </div>
        <Link
          href={`/player/${player.id}`}
          className="text-xs font-semibold text-brand hover:text-brand/80 transition-colors border border-brand/30 rounded-lg px-3 py-1.5 shrink-0"
        >
          Full Profile →
        </Link>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Object.entries(player.stats).map(([key, val]) => (
          <div key={key} className="bg-surface-200 border border-surface-300 rounded-xl p-4 text-center">
            <p className="text-2xl font-black text-surface-text tabular-nums">{val}</p>
            <p className="text-[10px] text-surface-muted mt-0.5 uppercase tracking-wide">{STAT_LABELS[key] ?? key}</p>
          </div>
        ))}
      </div>

      {/* 3-column layout: Left sidebar / Main feed / Right sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-[220px_1fr_220px] gap-6">

        {/* ── LEFT SIDEBAR: Team roster ── */}
        <aside className="space-y-4">
          <div className="bg-surface-200 border border-surface-300 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-surface-300 flex items-center justify-between">
              <p className="text-xs font-black uppercase tracking-wider text-surface-text">Teammates</p>
              <Link href={`/league/${league.slug}/${team.slug}`} className="text-[10px] text-brand hover:text-brand/80 font-semibold">
                Back
              </Link>
            </div>
            <div className="divide-y divide-surface-300">
              {teamPlayers.map((p) => (
                <Link
                  key={p.id}
                  href={`/league/${league.slug}/${team.slug}/${p.id}`}
                  className={`flex items-center gap-2.5 px-4 py-2.5 hover:bg-surface-300/50 transition-colors group ${p.id === player.id ? "bg-brand/10" : ""}`}
                >
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white shrink-0"
                    style={{ backgroundColor: team.primaryColor }}
                  >
                    {p.number}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-semibold truncate ${p.id === player.id ? "text-brand" : "text-surface-text group-hover:text-brand"} transition-colors`}>
                      {p.name}
                    </p>
                    <p className="text-[10px] text-surface-muted">{p.position}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </aside>

        {/* ── MAIN FEED ── */}
        <main className="space-y-8 min-w-0">
          {/* Game log */}
          {recentGames.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-surface-text mb-3">Recent Games</h2>
              <div className="space-y-2">
                {recentGames.map((g) => {
                  const home = teamMap[g.homeTeamId];
                  const away = teamMap[g.awayTeamId];
                  const isHome = g.homeTeamId === team.id;
                  const opponent = isHome ? away : home;
                  const teamScore = isHome ? g.homeScore : g.awayScore;
                  const oppScore = isHome ? g.awayScore : g.homeScore;
                  const won = teamScore > oppScore;
                  return (
                    <Link key={g.id} href={`/game/${g.id}`}>
                      <div className="flex items-center justify-between p-3 bg-surface-200 border border-surface-300 rounded-lg hover:border-brand/40 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className={`text-xs font-black w-5 ${won ? "text-emerald-400" : "text-red-400"}`}>{won ? "W" : "L"}</span>
                          <span className="text-sm text-surface-text">{isHome ? "vs" : "@"} {opponent?.name ?? "—"}</span>
                        </div>
                        <span className="text-sm font-bold text-surface-text tabular-nums">{teamScore}–{oppScore}</span>
                        <span className="text-xs text-surface-muted">{g.date}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* Related articles */}
          {playerArticles.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-surface-text mb-3">Related Articles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {playerArticles.map((a) => (
                  <ArticleCard key={a.id} article={a} />
                ))}
              </div>
            </section>
          )}
        </main>

        {/* ── RIGHT SIDEBAR: Player info & news ── */}
        <aside className="space-y-4">
          <div className="bg-surface-200 border border-surface-300 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-surface-300">
              <p className="text-xs font-black uppercase tracking-wider text-surface-text">Player Info</p>
            </div>
            <div className="divide-y divide-surface-300 text-xs">
              {[
                { label: "Team",     value: team.name },
                { label: "Position", value: player.position },
                { label: "Jersey",   value: `#${player.number}` },
                { label: "League",   value: league.name },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-surface-muted">{label}</span>
                  <span className="font-semibold text-surface-text">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {playerTx.length > 0 && (
            <div className="bg-surface-200 border border-surface-300 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-surface-300">
                <p className="text-xs font-black uppercase tracking-wider text-surface-text">News</p>
              </div>
              <div className="divide-y divide-surface-300">
                {playerTx.map((tx) => (
                  <div key={tx.id} className="px-4 py-3">
                    <p className="text-[10px] font-bold text-yellow-400 uppercase mb-0.5">{tx.type}</p>
                    <p className="text-xs text-surface-text leading-snug">{tx.headline}</p>
                    <p className="text-[10px] text-surface-muted mt-1">{tx.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return players.map((p) => {
    const team = teams.find((t) => t.id === p.teamId)!;
    return {
      slug: team.leagueId,
      team: team.slug,
      person: p.id,
    };
  });
}
