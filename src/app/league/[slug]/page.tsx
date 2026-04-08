import { notFound } from "next/navigation";
import Link from "next/link";
import { leagues } from "@/data/leagues";
import { teams } from "@/data/teams";
import { games } from "@/data/games";
import { articles } from "@/data/articles";
import GameCard from "@/components/cards/GameCard";
import ArticleCard from "@/components/cards/ArticleCard";
import ArticleHero from "@/components/editorial/ArticleHero";
import Kicker from "@/components/ui/Kicker";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function LeaguePage({ params }: Props) {
  const { slug } = await params;
  const league = leagues.find((l) => l.slug === slug);
  if (!league) notFound();

  const leagueTeams   = teams.filter((t) => t.leagueId === league.id).sort((a, b) => a.standing - b.standing);
  const teamMap       = Object.fromEntries(teams.map((t) => [t.id, t]));
  const leagueGames   = games.filter((g) => g.leagueId === league.id);
  const liveGames     = leagueGames.filter((g) => g.status === "live");
  const upcomingGames = leagueGames.filter((g) => g.status === "upcoming").slice(0, 4);
  const leagueArticles= articles.filter((a) => a.tagIds.includes(`tag-${league.id}`));
  const heroArticle   = leagueArticles[0];
  const restArticles  = leagueArticles.slice(1);

  return (
    <div className="space-y-10">
      {/* League identity bar */}
      <div className="flex items-center gap-4 pb-5 border-b border-surface-300">
        <span className="text-5xl">{league.logo}</span>
        <div>
          <Kicker label={league.sport} />
          <h1 className="text-3xl font-black tracking-tighter leading-none text-surface-text mt-1">{league.name}</h1>
        </div>
        {liveGames.length > 0 && (
          <span className="ml-auto flex items-center gap-1.5 px-3 py-1 bg-brand/10 border border-brand/30 rounded-full text-xs font-bold text-brand">
            <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />{liveGames.length} Live
          </span>
        )}
      </div>

      {/* HERO ARTICLE — leads the page */}
      {heroArticle && <ArticleHero article={heroArticle} />}

      {/* Live Games */}
      {liveGames.length > 0 && (
        <section>
          <SectionHeader live title="Live Now" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {liveGames.map((g) => (
              <GameCard key={g.id} game={g} homeTeam={teamMap[g.homeTeamId]} awayTeam={teamMap[g.awayTeamId]} />
            ))}
          </div>
        </section>
      )}

      {/* Articles with pattern interrupters */}
      {restArticles.length > 0 && (
        <section>
          <SectionHeader title={`${league.name} News`} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {restArticles.map((a, i) => (
              <div key={a.id} className="contents">
                <ArticleCard article={a} />
                {(i + 1) % 4 === 0 && i < restArticles.length - 1 && (
                  <div className="col-span-full">
                    <NewsletterInterrupter leagueName={league.name} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Upcoming Games */}
      {upcomingGames.length > 0 && (
        <section>
          <SectionHeader title="Upcoming Games" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {upcomingGames.map((g) => (
              <GameCard key={g.id} game={g} homeTeam={teamMap[g.homeTeamId]} awayTeam={teamMap[g.awayTeamId]} compact />
            ))}
          </div>
        </section>
      )}

      {/* Standings — mobile only; desktop uses RightRail */}
      <section className="xl:hidden">
        <SectionHeader title="Standings" />
        <div className="bg-surface-200 border border-surface-300 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] text-surface-muted uppercase tracking-widest bg-surface-300/50">
                <th className="text-left px-4 py-2.5">#</th>
                <th className="text-left px-4 py-2.5">Team</th>
                <th className="text-right px-4 py-2.5">Record</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-300">
              {leagueTeams.map((team) => (
                <tr key={team.id} className="hover:bg-surface-300/40 transition-colors">
                  <td className="px-4 py-2.5 text-xs text-surface-muted">{team.standing}</td>
                  <td className="px-4 py-2.5">
                    <Link href={`/league/${league.slug}/${team.slug}`} className="flex items-center gap-2 hover:text-brand transition-colors">
                      <span>{team.logo}</span>
                      <span className="font-semibold text-surface-text text-sm">{team.name}</span>
                    </Link>
                  </td>
                  <td className="px-4 py-2.5 text-right text-surface-muted tabular-nums">{team.record}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function SectionHeader({ title, live }: { title: string; live?: boolean }) {
  return (
    <div className="flex items-center gap-2 mb-4 border-b border-surface-300 pb-2">
      {live && <span className="w-2 h-2 rounded-full bg-brand animate-pulse shrink-0" />}
      <h2 className="text-base font-bold text-surface-text">{title}</h2>
    </div>
  );
}

function NewsletterInterrupter({ leagueName }: { leagueName: string }) {
  return (
    <div className="my-2 p-6 bg-gradient-to-r from-brand/10 to-brand-light/5 border border-brand/20 rounded-xl text-center">
      <Kicker label="Stay Informed" className="mb-2" />
      <h3 className="font-black tracking-tighter text-lg text-surface-text mb-1">
        Get {leagueName} updates first.
      </h3>
      <p className="text-sm text-surface-muted mb-4">Breaking moves, scores, and analysis — in your inbox.</p>
      <Link href="/#newsletter" className="inline-flex px-5 py-2 bg-brand hover:bg-brand/90 text-white text-xs font-bold rounded-lg transition-colors">
        Subscribe Free
      </Link>
    </div>
  );
}

export function generateStaticParams() {
  return leagues.map((l) => ({ slug: l.slug }));
}
