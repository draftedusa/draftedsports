"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { use, useState } from "react";
import { teams } from "@/data/teams";
import { games } from "@/data/games";
import { articles } from "@/data/articles";
import { players } from "@/data/players";
import { leagues } from "@/data/leagues";
import { transactions } from "@/data/transactions";
import GameCard from "@/components/cards/GameCard";
import ArticleCard from "@/components/cards/ArticleCard";
import Panel from "@/components/ui/Panel";

interface Props {
  params: Promise<{ slug: string }>;
}

export default function TeamPage({ params }: Props) {
  const { slug } = use(params);
  const team = teams.find((t) => t.slug === slug);
  if (!team) notFound();

  const [following, setFollowing] = useState(false);

  const league = leagues.find((l) => l.id === team.leagueId);
  const teamMap = Object.fromEntries(teams.map((t) => [t.id, t]));
  const teamPlayers = players.filter((p) => p.teamId === team.id);
  const teamArticles = articles.filter((a) => a.teamIds.includes(team.id)).slice(0, 6);
  const teamGames = games.filter((g) => g.homeTeamId === team.id || g.awayTeamId === team.id);
  const recentGames = teamGames.filter((g) => g.status !== "upcoming").slice(0, 4);
  const upcomingGames = teamGames.filter((g) => g.status === "upcoming").slice(0, 2);
  const teamTransactions = transactions.filter((t) => t.teamIds.includes(team.id));
  const injuryNews = teamTransactions.filter((t) => t.type === "injury");
  const otherNews = teamTransactions.filter((t) => t.type !== "injury");

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Team Header */}
      <div
        className="rounded-xl p-8 flex items-center justify-between gap-6 flex-wrap"
        style={{ background: `linear-gradient(135deg, ${team.primaryColor}33, #030712)` }}
      >
        <div className="flex items-center gap-6">
          <span className="text-7xl">{team.logo}</span>
          <div>
            <div className="flex items-center gap-2 mb-1">
              {league && (
                <Link href={`/league/${league.slug}`} className="text-xs text-surface-muted hover:text-surface-text font-semibold uppercase tracking-wide">
                  {league.name}
                </Link>
              )}
              <span className="text-surface-muted">·</span>
              <span className="text-xs text-surface-muted">#{team.standing} in League</span>
            </div>
            <h1 className="text-4xl font-black text-surface-text">{team.name}</h1>
            <p className="text-xl text-surface-text mt-1">{team.record}</p>
          </div>
        </div>
        <button
          onClick={() => setFollowing(!following)}
          className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-colors ${following ? "bg-red-600 text-surface-text hover:bg-red-500" : "bg-surface-300 text-surface-text hover:bg-surface-300 hover:text-surface-text border border-surface-300"}`}
        >
          {following ? "✓ Following" : "+ Follow"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Injury Report */}
          {injuryNews.length > 0 && (
            <section>
              <h2 className="text-base font-bold text-surface-text mb-3 flex items-center gap-2">
                🩹 Injury Report
              </h2>
              <div className="space-y-2">
                {injuryNews.map((tx) => (
                  <div key={tx.id} className="flex items-start gap-3 p-3 bg-red-950/20 border border-red-900/40 rounded-lg">
                    <span className="text-brand text-lg shrink-0">🩹</span>
                    <div>
                      <p className="text-sm font-bold text-white">{tx.playerName}</p>
                      <p className="text-sm text-surface-text">{tx.headline}</p>
                      <p className="text-xs text-surface-muted mt-0.5">{tx.date}</p>
                    </div>
                    {tx.isBreaking && (
                      <span className="ml-auto text-xs font-bold text-surface-text bg-red-600 px-2 py-0.5 rounded shrink-0">Breaking</span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Recent Games */}
          {recentGames.length > 0 && (
            <section>
              <h2 className="text-base font-bold text-surface-text mb-3">Recent Games</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {recentGames.map((g) => (
                  <GameCard key={g.id} game={g} homeTeam={teamMap[g.homeTeamId]} awayTeam={teamMap[g.awayTeamId]} compact />
                ))}
              </div>
            </section>
          )}

          {/* Upcoming */}
          {upcomingGames.length > 0 && (
            <section>
              <h2 className="text-base font-bold text-surface-text mb-3">Upcoming</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {upcomingGames.map((g) => (
                  <GameCard key={g.id} game={g} homeTeam={teamMap[g.homeTeamId]} awayTeam={teamMap[g.awayTeamId]} compact />
                ))}
              </div>
            </section>
          )}

          {/* News & Transactions */}
          {otherNews.length > 0 && (
            <section>
              <h2 className="text-base font-bold text-surface-text mb-3">Team News</h2>
              <div className="space-y-3">
                {otherNews.map((tx) => (
                  <div key={tx.id} className="p-3 bg-surface-200 border border-surface-300 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-surface-muted uppercase">{tx.type}</span>
                      <span className="text-xs text-surface-muted">{tx.date}</span>
                    </div>
                    <p className="text-sm font-semibold text-white">{tx.headline}</p>
                    <p className="text-sm text-surface-muted mt-0.5">{tx.detail}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Articles */}
          {teamArticles.length > 0 && (
            <section>
              <h2 className="text-base font-bold text-surface-text mb-3">{team.name} News</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {teamArticles.map((a) => (
                  <ArticleCard key={a.id} article={a} />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar: Roster */}
        <div className="space-y-4">
          <Panel title="Key Players" accent="border-red-600">
            <div className="space-y-3">
              {teamPlayers.slice(0, 8).map((player) => {
                const statEntries = Object.entries(player.stats);
                const [topKey, topVal] = statEntries[0] ?? [];
                return (
                  <Link key={player.id} href={`/player/${player.id}`}>
                    <div className="flex items-center justify-between p-2 rounded hover:bg-surface-300 transition-colors">
                      <div className="flex items-center gap-3">
                        <span
                          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-surface-text shrink-0"
                          style={{ backgroundColor: team.primaryColor }}
                        >
                          {player.number}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-surface-text hover:text-brand transition-colors">{player.name}</p>
                          <p className="text-xs text-surface-muted">{player.position}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-white">{topVal}</p>
                        <p className="text-xs text-surface-muted uppercase">{topKey}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
