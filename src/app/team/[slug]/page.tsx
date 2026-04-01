import { notFound } from "next/navigation";
import Link from "next/link";
import { teams } from "@/data/teams";
import { games } from "@/data/games";
import { articles } from "@/data/articles";
import { players } from "@/data/players";
import { leagues } from "@/data/leagues";
import GameCard from "@/components/cards/GameCard";
import ArticleCard from "@/components/cards/ArticleCard";
import Panel from "@/components/ui/Panel";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function TeamPage({ params }: Props) {
  const { slug } = await params;
  const team = teams.find((t) => t.slug === slug);
  if (!team) notFound();

  const league = leagues.find((l) => l.id === team.leagueId);
  const teamMap = Object.fromEntries(teams.map((t) => [t.id, t]));
  const teamPlayers = players.filter((p) => p.teamId === team.id);
  const teamArticles = articles.filter((a) => a.teamIds.includes(team.id)).slice(0, 6);
  const teamGames = games
    .filter((g) => g.homeTeamId === team.id || g.awayTeamId === team.id)
    .slice(0, 6);
  const recentGames = teamGames.filter((g) => g.status !== "upcoming").slice(0, 4);
  const upcomingGames = teamGames.filter((g) => g.status === "upcoming").slice(0, 2);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Team Header */}
      <div
        className="rounded-xl p-8 flex items-center gap-6"
        style={{ background: `linear-gradient(135deg, ${team.primaryColor}33, #030712)` }}
      >
        <span className="text-7xl">{team.logo}</span>
        <div>
          <div className="flex items-center gap-2 mb-1">
            {league && (
              <Link href={`/league/${league.slug}`} className="text-xs text-gray-400 hover:text-gray-300 font-medium uppercase tracking-wide">
                {league.name}
              </Link>
            )}
            <span className="text-gray-600">·</span>
            <span className="text-xs text-gray-500">#{team.standing} in League</span>
          </div>
          <h1 className="text-4xl font-black text-white">{team.name}</h1>
          <p className="text-xl text-gray-300 mt-1">{team.record}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Games */}
          {recentGames.length > 0 && (
            <section>
              <h2 className="text-base font-bold text-white mb-3">Recent Games</h2>
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
              <h2 className="text-base font-bold text-white mb-3">Upcoming</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {upcomingGames.map((g) => (
                  <GameCard key={g.id} game={g} homeTeam={teamMap[g.homeTeamId]} awayTeam={teamMap[g.awayTeamId]} compact />
                ))}
              </div>
            </section>
          )}

          {/* Articles */}
          {teamArticles.length > 0 && (
            <section>
              <h2 className="text-base font-bold text-white mb-3">{team.name} News</h2>
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
              {teamPlayers.slice(0, 8).map((player) => (
                <div key={player.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ backgroundColor: team.primaryColor }}
                    >
                      {player.number}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">{player.name}</p>
                      <p className="text-xs text-gray-500">{player.position}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {Object.entries(player.stats)
                      .slice(0, 1)
                      .map(([key, val]) => (
                        <p key={key} className="text-sm font-bold text-white">{val}</p>
                      ))}
                    {Object.entries(player.stats)
                      .slice(0, 1)
                      .map(([key]) => (
                        <p key={key} className="text-xs text-gray-500 capitalize">{key}</p>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return teams.map((t) => ({ slug: t.slug }));
}
