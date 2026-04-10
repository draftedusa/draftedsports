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
import LeagueMegaMenu from "@/components/nav/LeagueMegaMenu";

// ── Constants ─────────────────────────────────────────
// Primary leagues shown in the top nav bar
const PRIMARY_LEAGUE_IDS = ["nfl", "nba", "mlb", "nhl", "wnba", "mls", "college"];

const MOBILE_LINKS = [
  { href: "/scores",  label: "Scores" },
  { href: "/watch",   label: "Watch" },
  { href: "/feed",    label: "Fan Pulse" },
  { href: "/premium", label: "Premium ⭐" },
  { href: "/search",  label: "Search" },
];

// ── Ticker builder ─────────────────────────────────────
const teamMap = Object.fromEntries(teams.map((t) => [t.id, t]));

function buildTicker() {
  const live = games
    .filter((g) => g.status === "live")
    .map((g) => ({ away: teamMap[g.awayTeamId], home: teamMap[g.homeTeamId], game: g }))
    .filter((x) => x.away && x.home);

  const breaking = transactions
    .filter((t) => t.isBreaking)
    .slice(0, 4)
    .map((t) => ({ headline: t.headline }));

  return { live, breaking };
}

// ── Icon helpers ───────────────────────────────────────
const IconSearch = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
    <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
  </svg>
);

const IconBell = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
    <path fillRule="evenodd" d="M4 8a6 6 0 1 1 12 0v4l1.707 1.707A1 1 0 0 1 17 15.5H3a1 1 0 0 1-.707-1.707L4 12V8Zm6 10a2 2 0 0 1-2-2h4a2 2 0 0 1-2 2Z" clipRule="evenodd" />
  </svg>
);

const IconGear = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
    <path fillRule="evenodd" d="M8.34 1.804A1 1 0 0 1 9.32 1h1.36a1 1 0 0 1 .98.804l.295 1.473c.497.144.971.342 1.416.587l1.25-.834a1 1 0 0 1 1.262.125l.962.962a1 1 0 0 1 .125 1.261l-.834 1.25c.245.445.443.92.587 1.417l1.473.294a1 1 0 0 1 .804.98v1.361a1 1 0 0 1-.804.98l-1.473.295a6.95 6.95 0 0 1-.587 1.416l.834 1.25a1 1 0 0 1-.125 1.262l-.962.962a1 1 0 0 1-1.261.125l-1.25-.834a6.953 6.953 0 0 1-1.417.587l-.294 1.473a1 1 0 0 1-.98.804H9.32a1 1 0 0 1-.98-.804l-.295-1.473a6.957 6.957 0 0 1-1.416-.587l-1.25.834a1 1 0 0 1-1.262-.125l-.962-.962a1 1 0 0 1-.125-1.261l.834-1.25a6.957 6.957 0 0 1-.587-1.417l-1.473-.294A1 1 0 0 1 1 10.68V9.32a1 1 0 0 1 .804-.98l1.473-.295c.144-.497.342-.971.587-1.416l-.834-1.25a1 1 0 0 1 .125-1.262l.962-.962A1 1 0 0 1 5.378 3.03l1.25.834a6.957 6.957 0 0 1 1.417-.587L8.34 1.804ZM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
  </svg>
);

const IconChevronDown = ({ open }: { open: boolean }) => (
  <svg
    viewBox="0 0 16 16"
    fill="currentColor"
    className={`w-3 h-3 transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"}`}
  >
    <path
      fillRule="evenodd"
      d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
      clipRule="evenodd"
    />
  </svg>
);

// ── Main component ─────────────────────────────────────
export default function Header() {
  const [mobileOpen,    setMobileOpen]    = useState(false);
  const [searchOpen,    setSearchOpen]    = useState(false);
  const [scrolled,      setScrolled]      = useState(false);
  const [hoveredLeague, setHoveredLeague] = useState<string | null>(null);
  const [dropOpen,      setDropOpen]      = useState(false);

  const dropRef    = useRef<HTMLDivElement>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: session } = useSession();
  const isAdmin = (session?.user as Record<string, unknown> | undefined)?.role === "admin";

  const ticker         = buildTicker();
  const primaryLeagues = leagues.filter((l) => PRIMARY_LEAGUE_IDS.includes(l.id));
  const activeLeague   = hoveredLeague ? leagues.find((l) => l.id === hoveredLeague) : null;

  // ── Effects ────────────────────────────────────────
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node))
        setDropOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") {
        setHoveredLeague(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // ── Hover dwell (120 ms grace before closing mega-menu)
  const openMega  = useCallback((id: string) => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    setHoveredLeague(id);
  }, []);

  const closeMega = useCallback(() => {
    leaveTimer.current = setTimeout(() => setHoveredLeague(null), 120);
  }, []);

  const keepMega = useCallback(() => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
  }, []);

  return (
    <>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* ── Mobile backdrop ──────────────────────────────── */}
      <div
        className={`fixed inset-0 z-[55] bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)}
        aria-hidden
      />

      {/* ════════════════════════════════════════════════
          HEADER
      ════════════════════════════════════════════════ */}
      <header
        className={`sticky top-0 z-50 bg-surface-100 border-b border-surface-300 transition-shadow duration-200 ${
          scrolled ? "shadow-[0_2px_16px_rgba(0,0,0,0.15)]" : ""
        }`}
      >
        {/* ── Live ticker ──────────────────────────────── */}
        <div className="bg-brand h-8 flex items-center overflow-hidden">
          <span className="shrink-0 px-3 text-[10px] font-black text-white tracking-widest border-r border-white/20 h-full flex items-center">
            LIVE
          </span>
          <div className="flex-1 overflow-hidden">
            <div className="flex gap-2 whitespace-nowrap animate-ticker py-1 px-2">
              {/* Duplicate the items for seamless loop */}
              {[...ticker.live, ...ticker.live].map((item, i) => (
                <div
                  key={`live-${i}`}
                  className="inline-flex items-center gap-1.5 bg-white/15 rounded-lg px-2.5 py-0.5 shrink-0"
                >
                  <span className="text-sm leading-none">{item.away.logo}</span>
                  <span className="text-white text-[11px] font-black tabular-nums">{item.game.awayScore}</span>
                  <span className="text-white/50 text-[10px]">–</span>
                  <span className="text-white text-[11px] font-black tabular-nums">{item.game.homeScore}</span>
                  <span className="text-sm leading-none">{item.home.logo}</span>
                  <span className="text-white/60 text-[10px] ml-1">{item.game.quarter}</span>
                </div>
              ))}
              {[...ticker.breaking, ...ticker.breaking].map((item, i) => (
                <div
                  key={`break-${i}`}
                  className="inline-flex items-center gap-1.5 bg-red-500/30 rounded-lg px-2.5 py-0.5 shrink-0"
                >
                  <span className="text-white text-[10px] font-bold max-w-[240px] truncate">
                    ⚡ {item.headline}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Single main nav row ───────────────────────── */}
        <div className="max-w-[1400px] mx-auto px-4 h-14 flex items-center gap-3">

          {/* Logo → Home */}
          <Link href="/" className="shrink-0 mr-2" aria-label="UNDRAFTED Home">
            <span className="text-2xl font-black italic tracking-tighter text-surface-text select-none">
              UN<span className="text-brand">DRAFTED</span>
            </span>
          </Link>

          {/* ── League nav (desktop) ─────────────────────
              Each button has:
              - League emoji + name (xl+) + caret
              - Caret rotates 180° when hovered (v → ^)
          ─────────────────────────────────────────────── */}
          <nav
            className="hidden lg:flex flex-1 items-center gap-0.5 relative"
            onMouseLeave={closeMega}
          >
            {primaryLeagues.map((league) => {
              const isOpen = hoveredLeague === league.id;
              return (
                <div
                  key={league.id}
                  onMouseEnter={() => openMega(league.id)}
                >
                  <Link
                    href={`/league/${league.slug}`}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      isOpen
                        ? "text-brand bg-surface-200"
                        : "text-surface-muted hover:text-surface-text hover:bg-surface-200"
                    }`}
                  >
                    <span className="text-base leading-none">{league.logo}</span>
                    <span className="hidden xl:inline whitespace-nowrap">{league.name}</span>
                    <IconChevronDown open={isOpen} />
                  </Link>
                </div>
              );
            })}

            {/* Mega-menu — centred under the full nav bar */}
            {activeLeague && (
              <div className="absolute top-full left-0 right-0 mt-0.5 flex justify-center pointer-events-none">
                <div className="pointer-events-auto">
                  <LeagueMegaMenu
                    league={activeLeague}
                    onClose={() => setHoveredLeague(null)}
                    onMouseEnter={keepMega}
                    onMouseLeave={closeMega}
                  />
                </div>
              </div>
            )}
          </nav>

          {/* ── Utility bar ──────────────────────────────── */}
          <div className="flex items-center gap-0.5 ml-auto shrink-0">

            {/* Watch */}
            <Link
              href="/watch"
              className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-surface-muted hover:text-brand hover:bg-surface-200 transition-colors"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M3.25 4A2.25 2.25 0 0 0 1 6.25v7.5A2.25 2.25 0 0 0 3.25 16h7.5A2.25 2.25 0 0 0 13 13.75v-7.5A2.25 2.25 0 0 0 10.75 4h-7.5ZM19 4.75a.75.75 0 0 0-1.28-.53l-3 3a.75.75 0 0 0-.22.53v4.5c0 .199.079.39.22.53l3 3a.75.75 0 0 0 1.28-.53V4.75Z" />
              </svg>
              Watch
            </Link>

            {/* Fan Pulse */}
            <Link
              href="/feed"
              className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-surface-muted hover:text-brand hover:bg-surface-200 transition-colors"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 0 1-1.162-.682 22.045 22.045 0 0 1-2.582-2.09c-1.256-1.246-2.17-2.57-2.17-4.136C3.714 7.566 5.14 6 7 6c.87 0 1.69.318 2.32.842a.75.75 0 0 0 .96 0C10.91 6.318 11.73 6 12.6 6c1.86 0 3.286 1.566 3.286 3.593 0 1.566-.913 2.89-2.17 4.136a22.045 22.045 0 0 1-2.582 2.09 20.923 20.923 0 0 1-1.181.692l-.018.01-.006.003-.001.001a.75.75 0 0 1-.698 0l-.001-.001Z" />
              </svg>
              Fan Pulse
            </Link>

            {/* Premium */}
            <Link
              href="/premium"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-amber-400 hover:text-amber-300 hover:bg-amber-400/10 transition-colors"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
              </svg>
              Premium
            </Link>

            {/* Divider */}
            <span className="hidden lg:block w-px h-5 bg-surface-300 mx-1" />

            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex w-9 h-9 items-center justify-center rounded-lg text-surface-muted hover:text-brand hover:bg-surface-200 transition-colors"
              aria-label="Search (⌘K)"
            >
              <IconSearch />
            </button>

            {/* Notification Bell */}
            <button
              className="hidden lg:flex relative w-9 h-9 items-center justify-center rounded-lg text-surface-muted hover:text-brand hover:bg-surface-200 transition-colors"
              aria-label="Notifications"
            >
              <IconBell />
              {/* Unread indicator */}
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand rounded-full ring-2 ring-surface-100" />
            </button>

            {/* Settings */}
            <Link
              href="/profile"
              className="hidden lg:flex w-9 h-9 items-center justify-center rounded-lg text-surface-muted hover:text-brand hover:bg-surface-200 transition-colors"
              aria-label="Settings"
            >
              <IconGear />
            </Link>

            <ThemeToggle />

            {/* Auth — logged in */}
            {session ? (
              <div ref={dropRef} className="relative hidden lg:block ml-1">
                <button
                  onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-surface-200 transition-colors"
                  aria-expanded={dropOpen}
                >
                  <span className="w-7 h-7 rounded-full bg-brand flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {session.user?.name?.[0]?.toUpperCase() ?? "U"}
                  </span>
                  <IconChevronDown open={dropOpen} />
                </button>

                {dropOpen && (
                  <div className="absolute right-0 top-full mt-1 w-52 bg-surface-100 border border-surface-300 rounded-xl shadow-xl overflow-hidden z-[60]">
                    <div className="px-3 py-2.5 border-b border-surface-300">
                      <p className="text-xs font-semibold text-surface-text truncate">
                        {session.user?.name}
                      </p>
                      <p className="text-[10px] text-surface-muted truncate">
                        {session.user?.email}
                      </p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setDropOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-surface-text hover:bg-surface-200 transition-colors"
                    >
                      👤 My Profile
                    </Link>
                    {isAdmin && (
                      <>
                        <div className="border-t border-surface-300" />
                        <Link
                          href="/admin/live-control"
                          onClick={() => setDropOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-yellow-500 hover:bg-surface-200 transition-colors"
                        >
                          ⚡ Live Control
                        </Link>
                        <Link
                          href="/admin/analytics"
                          onClick={() => setDropOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-blue-400 hover:bg-surface-200 transition-colors"
                        >
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
              /* Auth — logged out */
              <div className="hidden lg:flex items-center gap-2 ml-1">
                <Link
                  href="/auth/login"
                  className="px-3 py-1.5 text-xs font-semibold text-surface-muted hover:text-brand transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/auth/login"
                  className="px-3 py-1.5 bg-brand hover:bg-brand/90 text-white text-xs font-bold rounded-lg transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* ── Hamburger → X (mobile only) ──────────── */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="lg:hidden flex flex-col items-center justify-center w-10 h-10 gap-[5px] rounded-lg hover:bg-surface-200 transition-colors ml-1"
              aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={mobileOpen}
            >
              {/* Bar 1 — rotates to top arm of X */}
              <span
                className={`block w-5 h-[2px] bg-current rounded-full transition-all duration-300 origin-center ${
                  mobileOpen ? "rotate-45 translate-y-[7px]" : ""
                }`}
              />
              {/* Bar 2 — fades out to form X gap */}
              <span
                className={`block w-5 h-[2px] bg-current rounded-full transition-all duration-300 ${
                  mobileOpen ? "opacity-0 scale-x-0" : ""
                }`}
              />
              {/* Bar 3 — rotates to bottom arm of X */}
              <span
                className={`block w-5 h-[2px] bg-current rounded-full transition-all duration-300 origin-center ${
                  mobileOpen ? "-rotate-45 -translate-y-[7px]" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* ════════════════════════════════════════════════
          MOBILE DRAWER — half-screen right-side panel
      ════════════════════════════════════════════════ */}
      <aside
        className={`fixed top-0 right-0 bottom-0 z-[60] w-4/5 max-w-sm bg-surface-100 border-l border-surface-300 shadow-2xl flex flex-col transition-transform duration-300 ease-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Navigation drawer"
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-surface-300 shrink-0">
          <span className="text-xl font-black italic tracking-tighter text-surface-text">
            UN<span className="text-brand">DRAFTED</span>
          </span>
          <button
            onClick={() => setMobileOpen(false)}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-surface-muted hover:bg-surface-200 transition-colors"
            aria-label="Close navigation"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">

          {/* Quick links */}
          <nav className="p-3 space-y-0.5 border-b border-surface-300">
            {MOBILE_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center px-3 py-2.5 rounded-lg text-sm font-semibold text-surface-text hover:bg-surface-200 transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Leagues directory */}
          <div className="p-3">
            <p className="px-3 py-2 text-[9px] font-black uppercase tracking-widest text-brand">
              Leagues
            </p>
            <div className="space-y-0.5">
              {leagues.map((l) => (
                <Link
                  key={l.id}
                  href={`/league/${l.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-surface-text hover:bg-surface-200 transition-colors"
                >
                  <span className="text-lg shrink-0">{l.logo}</span>
                  <span className="truncate">{l.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Auth footer */}
        <div className="border-t border-surface-300 p-4 shrink-0">
          {session ? (
            <>
              <Link
                href="/profile"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-200 transition-colors mb-1"
              >
                <span className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {session.user?.name?.[0]?.toUpperCase() ?? "U"}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-surface-text truncate">
                    {session.user?.name}
                  </p>
                  <p className="text-[10px] text-surface-muted truncate">
                    {session.user?.email}
                  </p>
                </div>
              </Link>
              <button
                onClick={() => { signOut(); setMobileOpen(false); }}
                className="w-full text-left px-3 py-2 text-sm text-surface-muted hover:text-brand transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="flex gap-2">
              <Link
                href="/auth/login"
                onClick={() => setMobileOpen(false)}
                className="flex-1 text-center px-3 py-2.5 border border-surface-300 rounded-lg text-sm font-semibold text-surface-text hover:bg-surface-200 transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/auth/login"
                onClick={() => setMobileOpen(false)}
                className="flex-1 text-center px-3 py-2.5 bg-brand hover:bg-brand/90 text-white rounded-lg text-sm font-bold transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
