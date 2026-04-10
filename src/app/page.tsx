"use client";

import Link from "next/link";
import { useRef } from "react";
import { games } from "@/data/games";
import { teams } from "@/data/teams";
import { articles } from "@/data/articles";
import { leagues } from "@/data/leagues";
import { transactions } from "@/data/transactions";
import GameCard from "@/components/cards/GameCard";
import ArticleCard from "@/components/cards/ArticleCard";
import ContentCard from "@/components/cards/ContentCard";
import LayoutAlpha from "@/components/layout/LayoutAlpha";
import NewsletterForm from "@/components/ui/NewsletterForm";
import FanPulse from "@/components/community/FanPulse";
import WatchMiniWidget from "@/components/video/WatchMiniWidget";
import FanPulseMiniWidget from "@/components/community/FanPulseMiniWidget";
import NativeAdPlacement from "@/components/monetization/NativeAdPlacement";
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

      {/* ── 1. EDITORIAL HERO — LayoutAlpha ──────────────────── */}
      {live.length > 0 && (
        <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
          <span className="text-xs font-black uppercase tracking-widest text-red-500">Live</span>
          <span className="text-sm font-bold text-surface-text">
            {teamMap[live[0].awayTeamId]?.name} {live[0].awayScore}
            <span className="text-surface-muted mx-1">–</span>
            {live[0].homeScore} {teamMap[live[0].homeTeamId]?.name}
          </span>
          <span className="text-xs text-surface-muted ml-auto">{live[0].quarter} {live[0].timeRemaining}</span>
          <Link href={`/game/${live[0].id}`} className="text-xs font-bold text-brand hover:underline ml-2 shrink-0">
            Track →
          </Link>
        </div>
      )}

      <LayoutAlpha
        left={
          <>
            {sorted.slice(1, 3).map((a) => (
              <ContentCard key={a.id} article={a} />
            ))}
          </>
        }
        center={<ContentCard article={featured} />}
        right={
          <div className="divide-y divide-surface-300">
            {sorted.slice(3, 10).map((a) => (
              <ContentCard key={a.id} article={a} />
            ))}
          </div>
        }
      />

      {/* ── 2. PERSONALIZED RAIL — Your Teams / Continue ────── */}
      <PersonalizedRail />

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

      {/* ── NATIVE AD — after analysis row ──────────────────── */}
      <NativeAdPlacement variant="feed" />

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

      {/* ── 5. WATCH / STUDIO CLIPS + MINI WIDGETS ROW ─────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <section className="xl:col-span-2">
          <SectionHeader title="Watch & Studio" href="/watch" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {watchArticles.map((a) => (
              <Link key={a.id} href={`/article/${a.slug}`}
                className="bg-surface-200 border border-surface-300 rounded-xl overflow-hidden hover:border-brand/40 transition-colors group">
                <div className="aspect-video bg-gradient-to-br from-surface-300/80 to-surface-200 flex items-center justify-center text-3xl relative">
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

        {/* Right rail: WatchMiniWidget + FanPulseMiniWidget */}
        <aside className="space-y-4">
          <WatchMiniWidget limit={3} title="Top Videos" />
          <FanPulseMiniWidget limit={2} />
        </aside>
      </div>

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

      {/* ── NATIVE AD — after trending ───────────────────────── */}
      <NativeAdPlacement variant="feed" />

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

function PersonalizedRail() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const allTeams = leagues.flatMap((league) =>
    teams.filter((t) => t.leagueId === league.id).slice(0, 3)
  );

  function scroll(dir: "left" | "right") {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-4 border-b border-surface-300 pb-2">
        <h2 className="text-lg font-bold text-surface-text flex items-center gap-2">
          Your Teams
          <span className="text-sm text-surface-muted font-normal">Personalized</span>
        </h2>
        <div className="flex items-center gap-1">
          <button
            onClick={() => scroll("left")}
            className="w-7 h-7 rounded-lg bg-surface-200 border border-surface-300 hover:border-brand/40 flex items-center justify-center transition-colors"
            aria-label="Scroll left"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-surface-text">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-7 h-7 rounded-lg bg-surface-200 border border-surface-300 hover:border-brand/40 flex items-center justify-center transition-colors"
            aria-label="Scroll right"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-surface-text">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      <div ref={scrollRef} className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {allTeams.map((team) => (
          <Link key={team.id} href={`/team/${team.slug}`}
            className="shrink-0 flex items-center gap-2.5 px-4 py-3 bg-surface-200 border border-surface-300 hover:border-brand/40 rounded-xl transition-colors min-w-[160px] card-lift">
            <span className="text-2xl">{team.logo}</span>
            <div>
              <p className="text-xs font-bold text-surface-text">{team.name}</p>
              <p className="text-[10px] text-surface-muted">{team.record}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
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
