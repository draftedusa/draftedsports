"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { leagues } from "@/data/leagues";
import { games } from "@/data/games";
import { teams } from "@/data/teams";
import { transactions } from "@/data/transactions";
import ThemeToggle from "./ThemeToggle";
import SearchModal from "./SearchModal";

const teamMap = Object.fromEntries(teams.map((t) => [t.id, t]));

function buildTickerItems() {
  const live = games.filter((g) => g.status === "live").map((g) => {
    const home = teamMap[g.homeTeamId];
    const away = teamMap[g.awayTeamId];
    return { type: "live" as const, away, home, game: g };
  });
  const breaking = transactions
    .filter((t) => t.isBreaking)
    .slice(0, 3)
    .map((t) => ({ type: "breaking" as const, headline: t.headline }));
  return { live, breaking };
}

const PRIMARY_NAV = [
  { href: "/",          label: "Home" },
  { href: "/scores",    label: "Scores" },
  { href: "/watch",     label: "Watch" },
  { href: "/analysis",  label: "Analysis" },
  { href: "/feed",      label: "Feed" },
  { href: "/premium",   label: "Premium", premium: true },
];

const MOBILE_NAV = [
  { href: "/",        label: "Home",    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { href: "/scores",  label: "Scores",  icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  { href: "/watch",   label: "Watch",   icon: "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { href: "/feed",    label: "Feed",    icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" },
  { href: "/profile", label: "Profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
];

const LEAGUE_QUICK_LINKS = [
  { label: "Home",   suffix: "" },
  { label: "Scores", suffix: "/scores" },
  { label: "Rumors", suffix: "/transactions" },
  { label: "Standings", suffix: "/standings" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen]       = useState(false);
  const [dirOpen, setDirOpen]             = useState(false);
  const [dropOpen, setDropOpen]           = useState(false);
  const [searchOpen, setSearchOpen]       = useState(false);
  const [scrolled, setScrolled]           = useState(false);
  const [hoveredLeague, setHoveredLeague] = useState<string | null>(null);
  const megaRef    = useRef<HTMLDivElement>(null);
  const dropRef    = useRef<HTMLDivElement>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { data: session } = useSession();
  const ticker = buildTickerItems();
  const isAdmin = (session?.user as Record<string, unknown> | undefined)?.role === "admin";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setSearchOpen(true); }
      if (e.key === "Escape") { setDirOpen(false); setHoveredLeague(null); }
    };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, []);

  const openMega  = useCallback((id: string) => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    setHoveredLeague(id);
  }, []);

  const closeMega = useCallback(() => {
    leaveTimer.current = setTimeout(() => setHoveredLeague(null), 120);
  }, []);

  const keepMega  = useCallback(() => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
  }, []);

  const activeLeagueTeams = hoveredLeague
    ? teams.filter((t) => t.leagueId === hoveredLeague).slice(0, 12)
    : [];

  return (
    <>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* ── Full-Screen Site Directory ───────────────────────── */}
      {dirOpen && (
        <div className="fixed inset-0 z-[100] bg-surface-100/95 backdrop-blur-sm overflow-y-auto">
          <div className="max-w-5xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between mb-8">
              <span className="text-2xl font-black italic tracking-tighter text-surface-text">
                UN<span className="text-brand">DRAFTED</span>
              </span>
              <button
                onClick={() => setDirOpen(false)}
                className="w-10 h-10 rounded-full bg-surface-200 hover:bg-surface-300 flex items-center justify-center text-surface-muted transition-colors"
                aria-label="Close directory"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
              {/* Primary nav */}
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-brand mb-3">Navigate</h3>
                <ul className="space-y-1.5">
                  {PRIMARY_NAV.map(({ href, label }) => (
                    <li key={href}>
                      <Link href={href} onClick={() => setDirOpen(false)}
                        className="text-sm font-semibold text-surface-text hover:text-brand transition-colors">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Each league */}
              {leagues.map((l) => {
                const leagueTeams = teams.filter((t) => t.leagueId === l.id).slice(0, 8);
                return (
                  <div key={l.id}>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-brand mb-3">
                      {l.logo} {l.name}
                    </h3>
                    <ul className="space-y-1.5">
                      <li>
                        <Link href={`/league/${l.slug}`} onClick={() => setDirOpen(false)}
                          className="text-xs font-semibold text-surface-text hover:text-brand transition-colors">
                          League Home
                        </Link>
                      </li>
                      {leagueTeams.map((t) => (
                        <li key={t.id}>
                          <Link href={`/team/${t.slug}`} onClick={() => setDirOpen(false)}
                            className="text-xs text-surface-muted hover:text-surface-text transition-colors">
                            {t.logo} {t.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}

              {/* Compliance */}
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-brand mb-3">Company</h3>
                <ul className="space-y-1.5">
                  {["/about","/contact","/privacy-policy","/terms","/accessibility"].map((href) => (
                    <li key={href}>
                      <Link href={href} onClick={() => setDirOpen(false)}
                        className="text-xs text-surface-muted hover:text-surface-text transition-colors capitalize">
                        {href.replace("/","")}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <header
        className={`bg-surface-100 border-b border-surface-300 sticky top-0 z-50 transition-shadow duration-200 ${
          scrolled ? "header-scrolled" : ""
        }`}
      >
        {/* ── Ticker: mini-cards ──────────────────────────────── */}
        <div className="bg-brand overflow-hidden h-8 flex items-center">
          <span className="shrink-0 px-3 text-xs font-black text-white tracking-widest border-r border-white/20 h-full flex items-center">
            LIVE
          </span>
          <div className="flex-1 overflow-hidden">
            <div className="flex gap-2 whitespace-nowrap animate-ticker py-1 px-2">
              {[...ticker.live, ...ticker.live].map((item, i) => (
                <div key={`lc${i}`}
                  className="inline-flex items-center gap-1.5 bg-white/15 rounded-lg px-2.5 py-0.5 shrink-0">
                  <span className="text-sm leading-none">{item.away.logo}</span>
                  <span className="text-white text-[11px] font-black tabular-nums">
                    {item.game.awayScore}
                  </span>
                  <span className="text-white/50 text-[10px]">–</span>
                  <span className="text-white text-[11px] font-black tabular-nums">
                    {item.game.homeScore}
                  </span>
                  <span className="text-sm leading-none">{item.home.logo}</span>
                  <span className="text-white/60 text-[10px] ml-1">{item.game.quarter}</span>
                </div>
              ))}
              {[...ticker.breaking, ...ticker.breaking].map((item, i) => (
                <div key={`bc${i}`}
                  className="inline-flex items-center gap-1.5 bg-red-500/30 rounded-lg px-2.5 py-0.5 shrink-0">
                  <span className="text-white text-[10px] font-bold max-w-[200px] truncate">
                    ⚡ {item.headline}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Top Tier: Dir + Logo | League Mega-Menu | Actions ── */}
        <div className="max-w-[1400px] mx-auto px-4 flex items-center h-14 gap-3">

          {/* Site Directory hamburger */}
          <button
            onClick={() => setDirOpen(true)}
            className="shrink-0 w-9 h-9 flex flex-col items-center justify-center gap-1 rounded-lg text-surface-muted hover:text-brand hover:bg-surface-200 transition-colors"
            aria-label="Site directory"
          >
            <span className="block w-4 h-0.5 bg-current rounded-full" />
            <span className="block w-4 h-0.5 bg-current rounded-full" />
            <span className="block w-4 h-0.5 bg-current rounded-full" />
          </button>

          <Link href="/" className="shrink-0">
            <span className="text-2xl font-black italic tracking-tighter text-surface-text">
              UN<span className="text-brand">DRAFTED</span>
            </span>
          </Link>

          {/* Center: League icons with Mega-Menu */}
          <div
            ref={megaRef}
            className="hidden lg:flex flex-1 items-center justify-center gap-3 relative"
            onMouseLeave={closeMega}
          >
            {leagues.map((l) => (
              <div
                key={l.id}
                className="relative"
                onMouseEnter={() => openMega(l.id)}
              >
                <Link
                  href={`/league/${l.slug}`}
                  className="relative flex flex-col items-center gap-0.5 group"
                >
                  <span className={`w-9 h-9 rounded-full bg-surface-200 flex items-center justify-center text-lg transition-all duration-150 ${
                    hoveredLeague === l.id
                      ? "ring-2 ring-brand ring-offset-1 ring-offset-surface-100"
                      : "group-hover:ring-2 ring-brand ring-offset-1 ring-offset-surface-100"
                  }`}>
                    {l.logo}
                  </span>
                  <span className={`text-[9px] font-bold uppercase tracking-wider leading-none transition-colors ${
                    hoveredLeague === l.id ? "text-brand" : "text-surface-muted group-hover:text-brand"
                  }`}>
                    {l.name}
                  </span>
                </Link>
              </div>
            ))}

            {/* Mega-Menu Dropdown */}
            {hoveredLeague && (
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[480px] bg-surface-100 border border-surface-300 rounded-2xl shadow-2xl overflow-hidden z-50"
                onMouseEnter={keepMega}
                onMouseLeave={closeMega}
              >
                {(() => {
                  const league = leagues.find((l) => l.id === hoveredLeague);
                  if (!league) return null;
                  return (
                    <>
                      {/* Mega-header */}
                      <div className="flex items-center gap-3 px-4 py-3 bg-surface-200 border-b border-surface-300">
                        <span className="text-2xl">{league.logo}</span>
                        <div>
                          <p className="text-sm font-black text-surface-text">{league.name}</p>
                          <p className="text-[10px] text-surface-muted">{league.sport}</p>
                        </div>
                        <div className="ml-auto flex items-center gap-1">
                          {LEAGUE_QUICK_LINKS.map(({ label, suffix }) => (
                            <Link
                              key={label}
                              href={suffix ? `/league/${league.slug}${suffix}` : `/league/${league.slug}`}
                              className="px-2.5 py-1 text-[10px] font-bold text-surface-muted hover:text-brand hover:bg-surface-300 rounded-lg transition-colors"
                              onClick={() => setHoveredLeague(null)}
                            >
                              {label}
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* Team grid */}
                      <div className="p-4">
                        <p className="text-[9px] font-black uppercase tracking-widest text-surface-muted mb-3">Teams</p>
                        {activeLeagueTeams.length > 0 ? (
                          <div className="grid grid-cols-3 gap-2">
                            {activeLeagueTeams.map((t) => (
                              <Link
                                key={t.id}
                                href={`/team/${t.slug}`}
                                className="flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-surface-200 transition-colors group"
                                onClick={() => setHoveredLeague(null)}
                              >
                                <span className="text-lg shrink-0">{t.logo}</span>
                                <div className="min-w-0">
                                  <p className="text-xs font-semibold text-surface-text group-hover:text-brand transition-colors truncate leading-tight">
                                    {t.name}
                                  </p>
                                  <p className="text-[9px] text-surface-muted">{t.record}</p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-surface-muted text-center py-4">
                            Coming soon — teams being added.
                          </p>
                        )}
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </div>

          {/* Far-right: Search + Settings + Theme + Auth */}
          <div className="flex items-center gap-1 ml-auto shrink-0">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex w-8 h-8 items-center justify-center rounded-lg text-surface-muted hover:text-brand hover:bg-surface-200 transition-colors"
              aria-label="Search (Ctrl+K)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
              </svg>
            </button>

            <Link
              href="/profile"
              className="hidden lg:flex w-8 h-8 items-center justify-center rounded-lg text-surface-muted hover:text-brand hover:bg-surface-200 transition-colors"
              aria-label="Profile"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M8.34 1.804A1 1 0 0 1 9.32 1h1.36a1 1 0 0 1 .98.804l.295 1.473c.497.144.971.342 1.416.587l1.25-.834a1 1 0 0 1 1.262.125l.962.962a1 1 0 0 1 .125 1.261l-.834 1.25c.245.445.443.92.587 1.417l1.473.294a1 1 0 0 1 .804.98v1.361a1 1 0 0 1-.804.98l-1.473.295a6.95 6.95 0 0 1-.587 1.416l.834 1.25a1 1 0 0 1-.125 1.262l-.962.962a1 1 0 0 1-1.261.125l-1.25-.834a6.953 6.953 0 0 1-1.417.587l-.294 1.473a1 1 0 0 1-.98.804H9.32a1 1 0 0 1-.98-.804l-.295-1.473a6.957 6.957 0 0 1-1.416-.587l-1.25.834a1 1 0 0 1-1.262-.125l-.962-.962a1 1 0 0 1-.125-1.261l.834-1.25a6.957 6.957 0 0 1-.587-1.417l-1.473-.294A1 1 0 0 1 1 10.68V9.32a1 1 0 0 1 .804-.98l1.473-.295c.144-.497.342-.971.587-1.416l-.834-1.25a1 1 0 0 1 .125-1.262l.962-.962A1 1 0 0 1 5.378 3.03l1.25.834a6.957 6.957 0 0 1 1.417-.587L8.34 1.804ZM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
              </svg>
            </Link>

            <ThemeToggle />

            {session ? (
              <div ref={dropRef} className="relative hidden lg:block">
                <button
                  onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-surface-200 transition-colors"
                >
                  <span className="w-7 h-7 rounded-full bg-brand flex items-center justify-center text-white text-xs font-bold">
                    {session.user?.name?.[0] ?? "U"}
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                    className={`w-3 h-3 text-surface-muted transition-transform ${dropOpen ? "rotate-180" : ""}`}>
                    <path fillRule="evenodd" d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                  </svg>
                </button>
                {dropOpen && (
                  <div className="absolute right-0 top-full mt-1 w-52 bg-surface-100 border border-surface-300 rounded-xl shadow-xl overflow-hidden">
                    <div className="px-3 py-2.5 border-b border-surface-300">
                      <p className="text-xs font-semibold text-surface-text truncate">{session.user?.name}</p>
                      <p className="text-[10px] text-surface-muted truncate">{session.user?.email}</p>
                    </div>
                    <Link href="/profile" onClick={() => setDropOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-surface-text hover:bg-surface-200 transition-colors">
                      👤 My Profile
                    </Link>
                    {isAdmin && (
                      <>
                        <div className="border-t border-surface-300 my-0.5" />
                        <Link href="/admin/live-control" onClick={() => setDropOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-yellow-500 hover:bg-surface-200 transition-colors">
                          ⚡ Live Control
                        </Link>
                        <Link href="/admin/analytics" onClick={() => setDropOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-blue-400 hover:bg-surface-200 transition-colors">
                          📊 Analytics
                        </Link>
                      </>
                    )}
                    <div className="border-t border-surface-300" />
                    <button
                      onClick={() => { signOut(); setDropOpen(false); }}
                      className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs text-surface-muted hover:bg-surface-200 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="hidden lg:inline-flex px-4 py-1.5 bg-brand hover:bg-brand/90 text-white text-xs font-bold rounded-lg transition-colors"
              >
                LOG IN
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 text-surface-muted hover:text-surface-text"
              aria-label="Toggle menu"
            >
              <span className={`block w-5 h-0.5 bg-current transition-transform ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block w-5 h-0.5 bg-current transition-opacity ${mobileOpen ? "opacity-0" : ""}`} />
              <span className={`block w-5 h-0.5 bg-current transition-transform ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>
        </div>

        {/* ── Bottom Tier — Primary nav (desktop) ─────────────── */}
        <div className="hidden lg:block border-t border-surface-300 bg-surface-200/60">
          <div className="max-w-[1400px] mx-auto px-4 h-9 flex items-center gap-0.5">
            {PRIMARY_NAV.map(({ href, label, premium }) => (
              <Link
                key={href}
                href={href}
                className={`px-4 h-full flex items-center text-xs font-semibold transition-colors ${
                  premium ? "text-brand hover:text-brand/80" : "text-surface-muted hover:text-brand"
                }`}
              >
                {premium && (
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 mr-1 text-brand">
                    <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
                  </svg>
                )}
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* ── Mobile Drawer ────────────────────────────────────── */}
        {mobileOpen && (
          <div className="lg:hidden bg-surface-200 border-t border-surface-300 px-4 py-4 space-y-1">
            {PRIMARY_NAV.map(({ href, label }) => (
              <MobileLink key={href} href={href} onClick={() => setMobileOpen(false)}>{label}</MobileLink>
            ))}
            <div className="border-t border-surface-300 pt-2 mt-2">
              {leagues.map((l) => (
                <MobileLink key={l.id} href={`/league/${l.slug}`} onClick={() => setMobileOpen(false)}>
                  {l.logo} {l.name}
                </MobileLink>
              ))}
            </div>
            {session ? (
              <div className="border-t border-surface-300 pt-2 mt-2">
                <MobileLink href="/profile" onClick={() => setMobileOpen(false)}>👤 My Profile</MobileLink>
                {isAdmin && (
                  <>
                    <MobileLink href="/admin/live-control" onClick={() => setMobileOpen(false)}>⚡ Live Control</MobileLink>
                    <MobileLink href="/admin/analytics" onClick={() => setMobileOpen(false)}>📊 Analytics</MobileLink>
                  </>
                )}
                <button
                  onClick={() => { signOut(); setMobileOpen(false); }}
                  className="w-full text-left flex items-center gap-2 px-3 py-2.5 rounded text-surface-muted hover:bg-surface-300 transition-colors text-sm font-medium"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="border-t border-surface-300 pt-2 mt-2">
                <MobileLink href="/auth/login" onClick={() => setMobileOpen(false)}>👤 LOG IN</MobileLink>
              </div>
            )}
          </div>
        )}
      </header>

      {/* ── Mobile Bottom Nav ─────────────────────────────────── */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface-100 border-t border-surface-300 safe-area-bottom">
        <div className="flex items-center justify-around h-14">
          {MOBILE_NAV.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center gap-0.5 text-surface-muted hover:text-brand transition-colors py-1 px-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
              </svg>
              <span className="text-[9px] font-bold">{label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}

function MobileLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link href={href} onClick={onClick} className="flex items-center gap-2 px-3 py-2.5 rounded text-surface-text hover:bg-surface-300 transition-colors text-sm font-medium">
      {children}
    </Link>
  );
}
