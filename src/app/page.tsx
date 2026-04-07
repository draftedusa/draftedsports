import Link from "next/link";
import { games } from "@/data/games";
import { teams } from "@/data/teams";
import { articles } from "@/data/articles";
import { leagues } from "@/data/leagues";
import { transactions } from "@/data/transactions";
import GameCard from "@/components/cards/GameCard";
import ArticleCard from "@/components/cards/ArticleCard";
import NewsletterForm from "@/components/ui/NewsletterForm";
import FanPulse from "@/components/community/FanPulse";
import { liveGames, topArticles, formatCount, timeAgo } from "@/lib/utils";

export default function HomePage() {
  const live = liveGames(games);
  const upcoming = games.filter((g) => g.status === "upcoming").slice(0, 6);
  const sorted = topArticles(articles, 20);
  const featured = sorted[0];
  const teamMap = Object.fromEntries(teams.map((t) => [t.id, t]));
  const breakingTx = transactions.filter((t) => t.isBreaking).slice(0, 3);

  // Content buckets
  const analysisArticles = sorted.filter((a) => a.category === "analysis" || a.tagIds.includes("tag-analysis")).slice(0, 4);
  const opinionArticles = sorted.filter((a) => a.byline).slice(2, 6);
  const premiumArticles = sorted.slice(6, 10);
  const watchArticles = sorted.slice(10, 14);
  const trending = sorted.slice(1, 5);

  return (
    <div className="space-y-10">

      {/* ── 1. HERO MODULE — Massive Live Story ──────────────── */}
      <section className="relative bg-gradient-to-br from-brand/20 via-brand-light/5 to-surface-200 rounded-2xl overflow-hidden border border-surface-300">
        <div className="absolute inset-0 bg-gradient-to-t from-surface-100 via-transparent to-transparent" />
        <div className="relative p-6 sm:p-10">
          {live.length > 0 ? (
            <>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-black tracking-widest uppercase text-red-500">Live Now</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tighter leading-none text-surface-text mb-3">
                {teamMap[live[0].awayTeamId]?.name} vs {teamMap[live[0].homeTeamId]?.name}
              </h1>
              <p className="text-lg sm:text-xl font-bold text-surface-muted mb-1 tabular-nums">
                {live[0].awayScore} – {live[0].homeScore} · {live[0].quarter} {live[0].timeRemaining}
              </p>
              <p className="text-sm text-surface-muted mb-6 max-w-lg">
                {featured.title}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href={`/game/${live[0].id}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand hover:bg-brand/90 text-white text-sm font-bold rounded-xl transition-colors">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/></svg>
                  Watch Live Reactions
                </Link>
                <Link href="/scores"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-surface-200 hover:bg-surface-300 border border-surface-300 text-surface-text text-sm font-bold rounded-xl transition-colors">
                  Track Game
                </Link>
                <Link href="/feed"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-surface-200 hover:bg-surface-300 border border-surface-300 text-surface-text text-sm font-bold rounded-xl transition-colors">
                  Join Fan Pulse
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-black tracking-widest uppercase text-brand">Featured</span>
              </div>
              <Link href={`/article/${featured.slug}`} className="group">
                <h1 className="text-3xl sm:text-5xl font-black tracking-tighter leading-none text-surface-text group-hover:text-brand transition-colors mb-3">
                  {featured.title}
                </h1>
                {featured.excerpt && (
                  <p className="text-sm text-surface-muted mb-4 max-w-lg leading-relaxed">{featured.excerpt}</p>
                )}
                <div className="flex items-center gap-2 text-xs text-surface-muted">
                  <div className="w-6 h-6 rounded-full bg-brand flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {featured.byline[0]}
                  </div>
                  <span className="font-semibold">{featured.byline}</span>
                  <span>·</span>
                  <span>{timeAgo(featured.publishDate)}</span>
                  <span>·</span>
                  <span>{formatCount(featured.views)} views</span>
                </div>
              </Link>
            </>
          )}
        </div>
      </section>

      {/* ── 2. PERSONALIZED RAIL — Your Teams / Continue ────── */}
      <section>
        <SectionHeader title="Your Teams" badge="Personalized" />
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {leagues.map((league) => {
            const leagueTeams = teams.filter((t) => t.leagueId === league.id).slice(0, 3);
            return leagueTeams.map((team) => (
              <Link key={team.id} href={`/team/${team.slug}`}
                className="shrink-0 flex items-center gap-2.5 px-4 py-3 bg-surface-200 border border-surface-300 hover:border-brand/40 rounded-xl transition-colors min-w-[160px]">
                <span className="text-2xl">{team.logo}</span>
                <div>
                  <p className="text-xs font-bold text-surface-text">{team.name}</p>
                  <p className="text-[10px] text-surface-muted">{team.record}</p>
                </div>
              </Link>
            ));
          })}
        </div>
      </section>

      {/* ── 3. LIVE + BREAKING ROW ──────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live games */}
        <div className="lg:col-span-2">
          {live.length > 0 && (
            <>
              <SectionHeader title="Live Now" badge={`${live.length} games`} href="/scores" live />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {live.map((g) => (
                  <GameCard key={g.id} game={g} homeTeam={teamMap[g.homeTeamId]} awayTeam={teamMap[g.awayTeamId]} />
                ))}
              </div>
            </>
          )}
          {live.length === 0 && upcoming.length > 0 && (
            <>
              <SectionHeader title="Upcoming Games" href="/scores" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {upcoming.slice(0, 4).map((g) => (
                  <GameCard key={g.id} game={g} homeTeam={teamMap[g.homeTeamId]} awayTeam={teamMap[g.awayTeamId]} compact />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Breaking news */}
        <div>
          <SectionHeader title="Breaking" />
          <div className="space-y-3">
            {breakingTx.map((tx) => {
              const txTeams = teams.filter((t) => tx.teamIds.includes(t.id));
              return (
                <Link key={tx.id} href="/scores">
                  <div className="flex items-start gap-3 p-3 bg-surface-200 border border-surface-300 hover:border-brand/40 rounded-xl transition-colors cursor-pointer">
                    <span className="text-xl shrink-0">
                      {tx.type === "injury" ? "🩹" : tx.type === "signing" ? "✍️" : tx.type === "trade" ? "🔄" : "📋"}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-surface-text leading-snug">{tx.headline}</p>
                      <div className="flex items-center gap-1 mt-1 flex-wrap">
                        {txTeams.map((t) => (
                          <span key={t.id} className="text-[10px] text-surface-muted">{t.logo}</span>
                        ))}
                        <span className="text-[10px] text-surface-muted">· {tx.date}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 4. OPINION + ANALYSIS ROW (Creator-led) ─────────── */}
      <section>
        <SectionHeader title="Analysis & Opinion" badge="Creator-led" href="/search" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {opinionArticles.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      </section>

      {/* ── PATTERN INTERRUPTER — Newsletter CTA ────────────── */}
      <section className="bg-gradient-to-r from-brand/10 to-brand-light/5 border border-brand/20 rounded-xl p-6 sm:p-8 text-center">
        <h2 className="text-xl sm:text-2xl font-black tracking-tighter text-surface-text mb-2">
          Get UNDRAFTED in your inbox.
        </h2>
        <p className="text-surface-muted mb-5 max-w-md mx-auto text-sm">
          Breaking news, game recaps, and the takes you can&apos;t miss — delivered every morning.
        </p>
        <NewsletterForm />
      </section>

      {/* ── 5. WATCH / STUDIO CLIPS ROW ─────────────────────── */}
      <section>
        <SectionHeader title="Watch & Studio" href="/watch" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {watchArticles.map((a) => (
            <Link key={a.id} href={`/article/${a.slug}`}
              className="bg-surface-200 border border-surface-300 rounded-xl overflow-hidden hover:border-brand/40 transition-colors group">
              <div className="aspect-video bg-gradient-to-br from-brand/10 to-brand-light/5 flex items-center justify-center text-3xl relative">
                🎬
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-9 h-9 rounded-full bg-brand/90 text-white flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 ml-0.5"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs font-bold text-surface-text leading-snug line-clamp-2">{a.title}</p>
                <p className="text-[10px] text-surface-muted mt-1">{a.byline} · {a.readTime}m</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 6. COMMUNITY ROW ────────────────────────────────── */}
      <section>
        <SectionHeader title="Fan Pulse" badge="Community" href="/feed" />
        <FanPulse compact />
      </section>

      {/* ── PATTERN INTERRUPTER — Top 5 ─────────────────────── */}
      <section className="bg-surface-200 border border-surface-300 rounded-xl p-6">
        <h3 className="text-sm font-black uppercase tracking-wider text-surface-text mb-4">Top 5 Trending Stories</h3>
        <div className="space-y-3">
          {trending.map((a, i) => (
            <Link key={a.id} href={`/article/${a.slug}`}
              className="flex items-start gap-3 group">
              <span className="text-2xl font-black text-brand/30 tabular-nums shrink-0 w-8 text-right">{i + 1}</span>
              <div>
                <p className="text-sm font-bold text-surface-text group-hover:text-brand transition-colors leading-snug">{a.title}</p>
                <p className="text-[10px] text-surface-muted mt-0.5">{a.byline} · {formatCount(a.views)} views</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 7. PREMIUM / SUBSCRIBER-ONLY ROW ────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4 border-b border-surface-300 pb-2">
          <h2 className="text-lg font-bold text-surface-text flex items-center gap-2">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-brand">
              <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
            </svg>
            UNDRAFTED+ Exclusives
          </h2>
          <Link href="/standings" className="text-sm text-brand hover:text-brand/80 font-semibold">Unlock All →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {premiumArticles.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      </section>

      {/* ── 8. LEAGUE STRIPS ─────────────────────────────────── */}
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
