import Link from "next/link";
import { games } from "@/data/games";
import { teams } from "@/data/teams";
import { articles } from "@/data/articles";
import { leagues } from "@/data/leagues";
import GameCard from "@/components/cards/GameCard";
import ArticleCard from "@/components/cards/ArticleCard";
import { liveGames, topArticles, formatCount } from "@/lib/utils";

export default function HomePage() {
  const live = liveGames(games);
  const upcoming = games.filter((g) => g.status === "upcoming").slice(0, 4);
  const recent = games.filter((g) => g.status === "final").slice(0, 4);
  const featured = articles[0];
  const trending = topArticles(articles, 8);
  const teamMap = Object.fromEntries(teams.map((t) => [t.id, t]));

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-10">
      {/* Hero + Featured Article */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ArticleCard article={featured} variant="featured" />
        </div>
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Trending Now</h2>
          {trending.slice(1, 6).map((art) => (
            <ArticleCard key={art.id} article={art} variant="compact" />
          ))}
        </div>
      </section>

      {/* Live Now */}
      {live.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <h2 className="text-lg font-bold text-white">Live Now</h2>
            <span className="text-sm text-gray-500">{live.length} games in progress</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {live.map((g) => (
              <GameCard
                key={g.id}
                game={g}
                homeTeam={teamMap[g.homeTeamId]}
                awayTeam={teamMap[g.awayTeamId]}
              />
            ))}
          </div>
        </section>
      )}

      {/* League strips */}
      {leagues.map((league) => {
        const leagueGames = games.filter((g) => g.leagueId === league.id).slice(0, 3);
        const leagueArticles = articles.filter((a) => a.tagIds.includes(`tag-${league.id}`)).slice(0, 3);
        if (!leagueGames.length && !leagueArticles.length) return null;
        return (
          <section key={league.id}>
            <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-2">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>{league.logo}</span> {league.name}
              </h2>
              <Link href={`/league/${league.slug}`} className="text-sm text-red-400 hover:text-red-300 font-semibold">
                See All →
              </Link>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Games column */}
              <div className="space-y-3">
                {leagueGames.map((g) => (
                  <GameCard
                    key={g.id}
                    game={g}
                    homeTeam={teamMap[g.homeTeamId]}
                    awayTeam={teamMap[g.awayTeamId]}
                    compact
                  />
                ))}
              </div>
              {/* Articles */}
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {leagueArticles.map((a) => (
                  <ArticleCard key={a.id} article={a} />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* Upcoming Games */}
      <section>
        <h2 className="text-lg font-bold text-white mb-4">Upcoming Games</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {upcoming.map((g) => (
            <GameCard
              key={g.id}
              game={g}
              homeTeam={teamMap[g.homeTeamId]}
              awayTeam={teamMap[g.awayTeamId]}
              compact
            />
          ))}
        </div>
      </section>

      {/* Recent Results */}
      <section>
        <h2 className="text-lg font-bold text-white mb-4">Recent Results</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recent.map((g) => (
            <GameCard
              key={g.id}
              game={g}
              homeTeam={teamMap[g.homeTeamId]}
              awayTeam={teamMap[g.awayTeamId]}
              compact
            />
          ))}
        </div>
      </section>

      {/* Top Articles grid */}
      <section>
        <h2 className="text-lg font-bold text-white mb-4">Top Stories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {trending.slice(0, 8).map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      </section>
    </div>
  );
}
