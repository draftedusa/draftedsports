import { notFound } from "next/navigation";
import Link from "next/link";
import { players } from "@/data/players";
import { teams } from "@/data/teams";
import { articles } from "@/data/articles";
import { games } from "@/data/games";
import { transactions } from "@/data/transactions";
import Panel from "@/components/ui/Panel";
import ArticleCard from "@/components/cards/ArticleCard";

interface Props {
  params: Promise<{ id: string }>;
}

// Stat label maps by sport
const STAT_LABELS: Record<string, string> = {
  ppg: "PPG", rpg: "RPG", apg: "APG", fg: "FG%",
  touchdowns: "TD", yards: "Yards", completions: "Comp%", rating: "QBR",
  receptions: "REC", rushYards: "Rush Yds", carries: "CAR",
  avg: "AVG", hr: "HR", rbi: "RBI", ops: "OPS",
  goals: "Goals", assists: "Assists", points: "Points", plusMinus: "+/-",
};

export default async function PlayerPage({ params }: Props) {
  const { id } = await params;
  const player = players.find((p) => p.id === id);
  if (!player) notFound();

  const team = teams.find((t) => t.id === player.teamId)!;
  const playerArticles = articles.filter((a) => a.teamIds.includes(player.teamId)).slice(0, 4);
  const playerTx = transactions.filter((t) => t.playerName === player.name);
  const recentGames = games
    .filter((g) => (g.homeTeamId === player.teamId || g.awayTeamId === player.teamId) && g.status !== "upcoming")
    .slice(0, 5);
  const teamMap = Object.fromEntries(teams.map((t) => [t.id, t]));

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Player header */}
      <div
        className="rounded-xl p-8 flex items-center gap-6"
        style={{ background: `linear-gradient(135deg, ${team.primaryColor}44, #030712)` }}
      >
        {/* Jersey number avatar */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black text-surface-text border-4 shrink-0"
          style={{ borderColor: team.primaryColor, background: team.primaryColor + "33" }}
        >
          {player.number}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href={`/team/${team.slug}`} className="text-xs text-surface-muted hover:text-surface-text font-semibold">
              {team.logo} {team.name}
            </Link>
            <span className="text-gray-700">·</span>
            <span className="text-xs text-surface-muted font-mono">{player.position}</span>
          </div>
          <h1 className="text-4xl font-black text-surface-text">{player.name}</h1>
          <p className="text-surface-muted mt-1">#{player.number} · {player.position}</p>
        </div>
      </div>

      {/* Stats */}
      <Panel title="Season Stats" accent="border-red-600">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Object.entries(player.stats).map(([key, val]) => (
            <div key={key} className="text-center bg-surface-300 rounded-lg p-4">
              <p className="text-2xl font-black text-white">{val}</p>
              <p className="text-xs text-surface-muted mt-1 uppercase tracking-wide">
                {STAT_LABELS[key] ?? key}
              </p>
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Recent game log */}
          {recentGames.length > 0 && (
            <Panel title="Recent Games" accent="border-gray-600">
              <div className="space-y-2">
                {recentGames.map((g) => {
                  const home = teamMap[g.homeTeamId];
                  const away = teamMap[g.awayTeamId];
                  const isHome = g.homeTeamId === player.teamId;
                  const opponent = isHome ? away : home;
                  const teamScore = isHome ? g.homeScore : g.awayScore;
                  const oppScore = isHome ? g.awayScore : g.homeScore;
                  const won = teamScore > oppScore;
                  return (
                    <Link key={g.id} href={`/game/${g.id}`}>
                      <div className="flex items-center justify-between p-3 rounded bg-surface-300 hover:bg-surface-300 transition-colors">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold w-6 ${won ? "text-green-400" : "text-brand"}`}>{won ? "W" : "L"}</span>
                          <span className="text-sm text-white">{isHome ? "vs" : "@"} {opponent.name}</span>
                        </div>
                        <span className="text-sm font-bold text-surface-text tabular-nums">{teamScore}–{oppScore}</span>
                        <span className="text-xs text-surface-muted">{g.date}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </Panel>
          )}

          {/* Related articles */}
          {playerArticles.length > 0 && (
            <section>
              <h2 className="text-base font-bold text-surface-text mb-3">Related Articles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {playerArticles.map((a) => (
                  <ArticleCard key={a.id} article={a} />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Panel title="Player Info" accent="border-gray-600">
            <div className="space-y-2 text-sm">
              <InfoRow label="Team" value={<Link href={`/team/${team.slug}`} className="text-brand hover:text-brand/80">{team.name}</Link>} />
              <InfoRow label="Position" value={player.position} />
              <InfoRow label="Jersey" value={`#${player.number}`} />
              <InfoRow label="League" value={team.leagueId.toUpperCase()} />
            </div>
          </Panel>

          {playerTx.length > 0 && (
            <Panel title="News" accent="border-yellow-600">
              <div className="space-y-3">
                {playerTx.map((tx) => (
                  <div key={tx.id}>
                    <p className="text-xs font-bold text-yellow-400 capitalize">{tx.type}</p>
                    <p className="text-sm text-surface-text mt-0.5">{tx.headline}</p>
                    <p className="text-xs text-surface-muted mt-0.5">{tx.date}</p>
                  </div>
                ))}
              </div>
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-surface-300 pb-2 last:border-0">
      <span className="text-surface-muted">{label}</span>
      <span className="text-white font-medium">{value}</span>
    </div>
  );
}

export function generateStaticParams() {
  return players.map((p) => ({ id: p.id }));
}
