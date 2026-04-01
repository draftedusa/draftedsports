import { notFound } from "next/navigation";
import Link from "next/link";
import { leagues } from "@/data/leagues";
import { teams } from "@/data/teams";
import { games } from "@/data/games";
import { articles } from "@/data/articles";
import GameCard from "@/components/cards/GameCard";
import ArticleCard from "@/components/cards/ArticleCard";
import Panel from "@/components/ui/Panel";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function LeaguePage({ params }: Props) {
  const { slug } = await params;
  const league = leagues.find((l) => l.slug === slug);
  if (!league) notFound();

  const leagueTeams = teams.filter((t) => t.leagueId === league.id).sort((a, b) => a.standing - b.standing);
  const teamMap = Object.fromEntries(teams.map((t) => [t.id, t]));
  const leagueGames = games.filter((g) => g.leagueId === league.id);
  const liveGames = leagueGames.filter((g) => g.status === "live");
  const recentGames = leagueGames.filter((g) => g.status === "final").slice(0, 6);
  const upcomingGames = leagueGames.filter((g) => g.status === "upcoming").slice(0, 4);
  const leagueArticles = articles.filter((a) => a.tagIds.includes(`tag-${league.id}`));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* League Header */}
      <div className="flex items-center gap-4 border-b border-gray-800 pb-6">
        <span className="text-5xl">{league.logo}</span>
        <div>
          <h1 className="text-3xl font-black text-white">{league.name}</h1>
          <p className="text-gray-400">{league.sport}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Live games */}
          {liveGames.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 text-base font-bold text-white mb-3">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Live Now
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {liveGames.map((g) => (
                  <GameCard key={g.id} game={g} homeTeam={teamMap[g.homeTeamId]} awayTeam={teamMap[g.awayTeamId]} />
                ))}
              </div>
            </section>
          )}

          {/* Recent Results */}
          {recentGames.length > 0 && (
            <section>
              <h2 className="text-base font-bold text-white mb-3">Recent Results</h2>
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
              <h2 className="text-base font-bold text-white mb-3">Upcoming Games</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {upcomingGames.map((g) => (
                  <GameCard key={g.id} game={g} homeTeam={teamMap[g.homeTeamId]} awayTeam={teamMap[g.awayTeamId]} compact />
                ))}
              </div>
            </section>
          )}

          {/* Articles */}
          <section>
            <h2 className="text-base font-bold text-white mb-3">{league.name} News</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {leagueArticles.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar: Standings */}
        <div>
          <Panel title="Standings" accent="border-red-600">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-500 uppercase">
                  <th className="text-left pb-2">#</th>
                  <th className="text-left pb-2">Team</th>
                  <th className="text-right pb-2">Record</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {leagueTeams.map((team) => (
                  <tr key={team.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="py-2 text-gray-500 text-xs">{team.standing}</td>
                    <td className="py-2">
                      <Link href={`/team/${team.slug}`} className="flex items-center gap-2 hover:text-red-400 transition-colors">
                        <span>{team.logo}</span>
                        <span className="text-white font-medium text-sm">{team.name}</span>
                      </Link>
                    </td>
                    <td className="py-2 text-right text-gray-400 tabular-nums">{team.record}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>
        </div>
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return leagues.map((l) => ({ slug: l.slug }));
}
