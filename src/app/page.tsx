import Link from "next/link";
import { games } from "@/data/games";
import { teams } from "@/data/teams";
import { articles } from "@/data/articles";
import { leagues } from "@/data/leagues";
import { transactions } from "@/data/transactions";
import GameCard from "@/components/cards/GameCard";
import ArticleCard from "@/components/cards/ArticleCard";
import ArticleHero from "@/components/editorial/ArticleHero";
import NewsletterForm from "@/components/ui/NewsletterForm";
import { liveGames, topArticles, formatCount } from "@/lib/utils";

export default function HomePage() {
  const live = liveGames(games);
  const upcoming = games.filter((g) => g.status === "upcoming").slice(0, 4);
  const recent = games.filter((g) => g.status === "final").slice(0, 4);
  const sorted = topArticles(articles, 20);
  const featured = sorted[0];
  const trending = sorted.slice(1, 7);
  const editorPicks = sorted.slice(7, 11);
  const teamMap = Object.fromEntries(teams.map((t) => [t.id, t]));
  const breakingTx = transactions.filter((t) => t.isBreaking).slice(0, 4);

  return (
    <div className="space-y-10">

      {/* ── 1. HERO — ArticleHero component ──────────────────── */}
      <section>
        <ArticleHero article={featured} />
      </section>

      {/* ── 2. TRENDING — 2-column article grid ──────────────── */}
      <section>
        <SectionHeader title="Trending Now" badge={`${trending.length} stories`} href="/search" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {trending.map((art) => (
            <ArticleCard key={art.id} article={art} isTrending={art.isTrending} />
          ))}
        </div>
      </section>

      {/* ── 3. LIVE SCORES — visual break after trending ─────── */}
      {live.length > 0 && (
        <section>
          <SectionHeader title="Live Now" badge={`${live.length} games`} href="/scores" live />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {live.map((g) => (
              <GameCard key={g.id} game={g} homeTeam={teamMap[g.homeTeamId]} awayTeam={teamMap[g.awayTeamId]} />
            ))}
          </div>
        </section>
      )}

      {/* ── 4. BREAKING TRANSACTIONS ─────────────────────────── */}
      {breakingTx.length > 0 && (
        <section>
          <SectionHeader title="Breaking News" href="/transactions" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {breakingTx.map((tx) => {
              const txTeams = teams.filter((t) => tx.teamIds.includes(t.id));
              return (
                <Link key={tx.id} href="/transactions">
                  <div className="flex items-start gap-3 p-4 bg-surface-200 border border-surface-300 hover:border-brand/40 rounded-xl transition-colors cursor-pointer">
                    <span className="text-2xl shrink-0">
                      {tx.type === "injury" ? "🩹" : tx.type === "signing" ? "✍️" : tx.type === "extension" ? "📝" : tx.type === "trade" ? "🔄" : "📋"}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-surface-text leading-snug">{tx.headline}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {txTeams.map((t) => (
                          <span key={t.id} className="text-xs text-surface-muted">{t.logo} {t.name}</span>
                        ))}
                        <span className="text-xs text-surface-muted">· {tx.date}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ── 5. LEAGUE STRIPS ─────────────────────────────────── */}
      {leagues.map((league) => {
        const leagueGames = games.filter((g) => g.leagueId === league.id).slice(0, 3);
        const leagueArticles = articles.filter((a) => a.tagIds.includes(`tag-${league.id}`)).slice(0, 3);
        if (!leagueGames.length && !leagueArticles.length) return null;
        return (
          <section key={league.id}>
            <SectionHeader title={`${league.logo} ${league.name}`} href={`/league/${league.slug}`} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                {leagueGames.map((g) => (
                  <GameCard key={g.id} game={g} homeTeam={teamMap[g.homeTeamId]} awayTeam={teamMap[g.awayTeamId]} compact />
                ))}
              </div>
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {leagueArticles.map((a) => (
                  <ArticleCard key={a.id} article={a} />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* ── 6. EDITOR'S PICKS ────────────────────────────────── */}
      <section>
        <SectionHeader title="Editor's Picks" href="/search" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {editorPicks.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      </section>

      {/* ── 7. UPCOMING + RECENT ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section>
          <SectionHeader title="Upcoming Games" href="/scores" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {upcoming.map((g) => (
              <GameCard key={g.id} game={g} homeTeam={teamMap[g.homeTeamId]} awayTeam={teamMap[g.awayTeamId]} compact />
            ))}
          </div>
        </section>
        <section>
          <SectionHeader title="Recent Results" href="/scores" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recent.map((g) => (
              <GameCard key={g.id} game={g} homeTeam={teamMap[g.homeTeamId]} awayTeam={teamMap[g.awayTeamId]} compact />
            ))}
          </div>
        </section>
      </div>

      {/* ── 8. NEWSLETTER CTA ────────────────────────────────── */}
      <section className="bg-gradient-to-r from-brand/10 to-brand-light/5 border border-brand/20 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-black tracking-tighter text-surface-text mb-2">
          Get UNDRAFTED in your inbox.
        </h2>
        <p className="text-surface-muted mb-6 max-w-md mx-auto text-sm">
          Breaking news, game recaps, and the takes you can&apos;t miss — delivered every morning.
        </p>
        <NewsletterForm />
      </section>

    </div>
  );
}

function SectionHeader({
  title, badge, href, live,
}: {
  title: string;
  badge?: string;
  href?: string;
  live?: boolean;
}) {
  return (
    <div className="flex items-center justify-between mb-4 border-b border-surface-300 pb-2">
      <h2 className="text-lg font-bold text-surface-text flex items-center gap-2">
        {live && <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />}
        {title}
        {badge && <span className="text-sm text-surface-muted font-normal">{badge}</span>}
      </h2>
      {href && (
        <Link href={href} className="text-sm text-brand hover:text-brand/80 font-semibold">
          See All →
        </Link>
      )}
    </div>
  );
}
