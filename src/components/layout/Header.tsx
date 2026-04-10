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
import MegaMenu from "./MegaMenu";
import PointsCounter from "@/components/ui/PointsCounter";

// ─────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────

/** Leagues rendered as nav buttons (in order). */
const PRIMARY_IDS = ["nfl", "nba", "mlb", "nhl", "wnba", "mls", "college"];

/** Links shown in the mobile drawer quick-access section. */
const DRAWER_LINKS = [
  { href: "/scores",   label: "Scores"      },
  { href: "/watch",    label: "Watch"       },
  { href: "/feed",     label: "Fan Pulse"   },
  { href: "/pipeline", label: "Pipeline 📋" },
  { href: "/premium",  label: "Premium ⭐"  },
];

// ─────────────────────────────────────────────────────────
// Ticker helper
// ─────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────
// Tiny icon components (inline SVG keeps the bundle tight)
// ─────────────────────────────────────────────────────────
function IcoSearch() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-[18px] h-[18px]">
      <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06L13.24 13.45A7 7 0 0 1 2 9Z" clipRule="evenodd"/>
    </svg>
  );
}

function IcoBell() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-[18px] h-[18px]">
      <path fillRule="evenodd" d="M4 8a6 6 0 1 1 12 0v4l1.707 1.707A1 1 0 0 1 17 15.5H3a1 1 0 0 1-.707-1.707L4 12V8Zm6 10a2 2 0 0 1-2-2h4a2 2 0 0 1-2 2Z" clipRule="evenodd"/>
    </svg>
  );
}

function IcoGear() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-[18px] h-[18px]">
      <path fillRule="evenodd" d="M7.84 1.804A1 1 0 0 1 8.82 1h2.36a1 1 0 0 1 .98.804l.295 1.473c.497.144.971.342 1.416.587l1.25-.834a1 1 0 0 1 1.262.125l1.669 1.67a1 1 0 0 1 .125 1.26l-.834 1.25c.245.445.443.92.587 1.417l1.473.294A1 1 0 0 1 20 10v2.36a1 1 0 0 1-.804.98l-1.473.295a6.95 6.95 0 0 1-.587 1.416l.834 1.25a1 1 0 0 1-.125 1.262l-1.67 1.669a1 1 0 0 1-1.26.125l-1.25-.834a6.953 6.953 0 0 1-1.417.587l-.294 1.473A1 1 0 0 1 11.18 21H8.82a1 1 0 0 1-.98-.804l-.295-1.473a6.957 6.957 0 0 1-1.416-.587l-1.25.834a1 1 0 0 1-1.262-.125l-1.669-1.67a1 1 0 0 1-.125-1.26l.834-1.25a6.957 6.957 0 0 1-.587-1.417l-1.473-.294A1 1 0 0 1 0 13.18V10.82a1 1 0 0 1 .804-.98l1.473-.295c.144-.497.342-.971.587-1.416l-.834-1.25a1 1 0 0 1 .125-1.262l1.67-1.669A1 1 0 0 1 5.086 3.824l1.25.834a6.957 6.957 0 0 1 1.417-.587L8.047 1.804ZM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
    </svg>
  );
}

function IcoChevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="currentColor"
      className={`w-2.5 h-2.5 transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"}`}
    >
      <path d="M1.5 4 6 8.5 10.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────
// Header
// ─────────────────────────────────────────────────────────
export default function Header() {
  const [mobileOpen,    setMobileOpen]    = useState(false);
  const [searchOpen,    setSearchOpen]    = useState(false);
  const [scrolled,      setScrolled]      = useState(false);
  const [hoveredLeague, setHoveredLeague] = useState<string | null>(null);
  const [userMenuOpen,  setUserMenuOpen]  = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const leaveTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: session } = useSession();
  const isAdmin = (session?.user as Record<string, unknown> | undefined)?.role === "admin";

  const ticker         = buildTicker();
  const primaryLeagues = leagues.filter((l) => PRIMARY_IDS.includes(l.id));

  // ── Effects ──────────────────────────────────────────
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Close user dropdown on outside click
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node))
        setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setSearchOpen(true); }
      if (e.key === "Escape") { setHoveredLeague(null); setMobileOpen(false); }
    };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, []);

  // Lock body scroll while drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // ── Mega-menu hover dwell (150 ms grace) ─────────────
  const openMega  = useCallback((id: string) => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    setHoveredLeague(id);
  }, []);

  const closeMega = useCallback(() => {
    leaveTimer.current = setTimeout(() => setHoveredLeague(null), 150);
  }, []);

  const keepMega  = useCallback(() => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
  }, []);

  return (
    <>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* ── Mobile backdrop ──────────────────────────── */}
      <div
        aria-hidden
        onClick={() => setMobileOpen(false)}
        className={`fixed inset-0 z-[55] bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* ════════════════════════════════════════════ */}
      {/*  HEADER                                      */}
      {/* ════════════════════════════════════════════ */}
      <header
        className={`sticky top-0 z-50 bg-surface-100 border-b border-surface-300 transition-shadow duration-200 ${
          scrolled ? "shadow-[0_2px_20px_rgba(0,0,0,0.18)]" : ""
        }`}
      >
        {/* ── Live ticker ───────────────────────────── */}
        <div className="bg-brand h-7 flex items-center overflow-hidden select-none">
          <span className="shrink-0 px-3 text-[9px] font-black text-white tracking-[0.15em] uppercase border-r border-white/20 h-full flex items-center">
            Live
          </span>
          <div className="flex-1 overflow-hidden">
            <div className="flex gap-2 whitespace-nowrap animate-ticker px-2">
              {[...ticker.live, ...ticker.live].map((item, i) => (
                <span
                  key={`live-${i}`}
                  className="inline-flex items-center gap-1 bg-white/15 rounded-md px-2 py-0.5 text-[10px]"
                >
                  <span>{item.away.logo}</span>
                  <span className="text-white font-black tabular-nums">{item.game.awayScore}</span>
                  <span className="text-white/40">–</span>
                  <span className="text-white font-black tabular-nums">{item.game.homeScore}</span>
                  <span>{item.home.logo}</span>
                  <span className="text-white/60 ml-0.5">{item.game.quarter}</span>
                </span>
              ))}
              {[...ticker.breaking, ...ticker.breaking].map((item, i) => (
                <span
                  key={`brk-${i}`}
                  className="inline-flex items-center gap-1 bg-red-600/30 rounded-md px-2 py-0.5 text-[10px] text-white max-w-[200px] truncate"
                >
                  ⚡ {item.headline}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Main row: Logo | Leagues | Actions ──── */}
        <div className="max-w-[1400px] mx-auto px-4 h-[52px] flex items-center gap-2">

          {/* ── Logo ─────────────────────────────── */}
          <Link href="/" className="shrink-0 mr-3" aria-label="UNDRAFTED – home">
            <span className="text-[22px] font-black italic tracking-tight text-surface-text select-none leading-none">
              UN<span className="text-brand">DRAFTED</span>
            </span>
          </Link>

          {/* ── League nav + mega-menu (desktop) ─── */}
          <nav
            className="hidden lg:flex flex-1 items-center gap-0.5 relative h-full"
            onMouseLeave={closeMega}
          >
            {/* Pipeline link (before league buttons) */}
            <Link
              href="/pipeline"
              className="inline-flex items-center gap-1.5 px-2.5 h-8 rounded-lg text-[11px] font-semibold text-surface-muted hover:text-brand hover:bg-surface-200 transition-colors shrink-0 mr-1"
            >
              <span className="text-[13px] leading-none">📋</span>
              <span className="hidden xl:inline whitespace-nowrap">Pipeline</span>
            </Link>
            {primaryLeagues.map((league) => {
              const isOpen = hoveredLeague === league.id;
              return (
                <div
                  key={league.id}
                  className="relative h-full flex items-center"
                  onMouseEnter={() => openMega(league.id)}
                >
                  <Link
                    href={`/league/${league.slug}`}
                    className={`inline-flex items-center gap-1.5 px-2.5 h-8 rounded-lg text-[11px] font-semibold transition-colors ${
                      isOpen
                        ? "bg-surface-200 text-brand"
                        : "text-surface-muted hover:text-surface-text hover:bg-surface-200"
                    }`}
                  >
                    <span className="text-[15px] leading-none">{league.logo}</span>
                    {/* Name visible at xl+ */}
                    <span className="hidden xl:inline whitespace-nowrap">{league.name}</span>
                    {/* Caret: v (closed) → ^ (open) */}
                    <IcoChevron open={isOpen} />
                  </Link>
                </div>
              );
            })}

            {/* Mega-menu — centred under the nav rail */}
            <div
              className="absolute top-full left-0 right-0 flex justify-center pointer-events-none"
              style={{ marginTop: "2px" }}
            >
              <div className="pointer-events-auto">
                <MegaMenu
                  leagueId={hoveredLeague}
                  onClose={() => setHoveredLeague(null)}
                  onMouseEnter={keepMega}
                  onMouseLeave={closeMega}
                />
              </div>
            </div>
          </nav>

          {/* ── Action bar ───────────────────────── */}
          <div className="flex items-center gap-0.5 ml-auto shrink-0">

            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search (⌘K)"
              className="flex w-9 h-9 items-center justify-center rounded-lg text-surface-muted hover:text-brand hover:bg-surface-200 transition-colors"
            >
              <IcoSearch />
            </button>

            {/* Notifications bell */}
            <button
              aria-label="Notifications"
              className="hidden lg:flex relative w-9 h-9 items-center justify-center rounded-lg text-surface-muted hover:text-brand hover:bg-surface-200 transition-colors"
            >
              <IcoBell />
              {/* Unread dot */}
              <span
                aria-hidden
                className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-brand ring-[1.5px] ring-surface-100"
              />
            </button>

            {/* Settings / Fan Cave */}
            <Link
              href="/profile"
              aria-label="Settings & Profile"
              className="hidden lg:flex w-9 h-9 items-center justify-center rounded-lg text-surface-muted hover:text-brand hover:bg-surface-200 transition-colors"
            >
              <IcoGear />
            </Link>

            {/* DraftCoin loyalty counter */}
            <PointsCounter />

            <ThemeToggle />

            {/* Auth */}
            {session ? (
              <div ref={userMenuRef} className="relative hidden lg:block ml-1">
                <button
                  onClick={() => setUserMenuOpen((o) => !o)}
                  aria-expanded={userMenuOpen}
                  className="flex items-center gap-1.5 px-1.5 py-1 rounded-lg hover:bg-surface-200 transition-colors"
                >
                  <span className="w-7 h-7 rounded-full bg-brand flex items-center justify-center text-white text-xs font-black">
                    {session.user?.name?.[0]?.toUpperCase() ?? "U"}
                  </span>
                  <IcoChevron open={userMenuOpen} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-52 bg-surface-100 border border-surface-300 rounded-xl shadow-2xl overflow-hidden z-[60]">
                    <div className="px-3 py-2.5 border-b border-surface-300">
                      <p className="text-xs font-semibold text-surface-text truncate">{session.user?.name}</p>
                      <p className="text-[10px] text-surface-muted truncate">{session.user?.email}</p>
                    </div>
                    <UserMenuItem href="/profile" onClick={() => setUserMenuOpen(false)}>
                      👤 My Profile
                    </UserMenuItem>
                    <UserMenuItem href="/premium" onClick={() => setUserMenuOpen(false)}>
                      ⭐ Premium
                    </UserMenuItem>
                    {isAdmin && (
                      <>
                        <div className="border-t border-surface-300" />
                        <UserMenuItem href="/admin/live-control" onClick={() => setUserMenuOpen(false)} accent="text-yellow-500">
                          ⚡ Live Control
                        </UserMenuItem>
                        <UserMenuItem href="/admin/analytics" onClick={() => setUserMenuOpen(false)} accent="text-blue-400">
                          📊 Analytics
                        </UserMenuItem>
                      </>
                    )}
                    <div className="border-t border-surface-300" />
                    <button
                      onClick={() => { signOut(); setUserMenuOpen(false); }}
                      className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs text-surface-muted hover:bg-surface-200 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-2 ml-1">
                <Link
                  href="/auth/login"
                  className="px-3 h-8 flex items-center text-xs font-semibold text-surface-muted hover:text-brand transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/auth/login"
                  className="px-4 h-8 flex items-center bg-brand hover:bg-brand/90 text-white text-xs font-bold rounded-lg transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* ── Hamburger → X (mobile) ─────────── */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={mobileOpen}
              className="lg:hidden flex flex-col items-center justify-center w-10 h-10 gap-[5px] ml-1 rounded-lg hover:bg-surface-200 transition-colors text-surface-text"
            >
              {/* Bar 1 */}
              <span className={`block w-5 h-[2px] bg-current rounded-full transition-all duration-300 origin-center ${
                mobileOpen ? "rotate-45 translate-y-[7px]" : ""
              }`} />
              {/* Bar 2 */}
              <span className={`block w-5 h-[2px] bg-current rounded-full transition-all duration-300 ${
                mobileOpen ? "opacity-0 scale-x-0" : ""
              }`} />
              {/* Bar 3 */}
              <span className={`block w-5 h-[2px] bg-current rounded-full transition-all duration-300 origin-center ${
                mobileOpen ? "-rotate-45 -translate-y-[7px]" : ""
              }`} />
            </button>
          </div>
        </div>
      </header>

      {/* ════════════════════════════════════════════ */}
      {/*  MOBILE DRAWER — half-screen right panel     */}
      {/* ════════════════════════════════════════════ */}
      <aside
        className={`fixed top-0 right-0 bottom-0 z-[60] w-4/5 max-w-sm bg-surface-100 border-l border-surface-300 shadow-2xl flex flex-col transition-transform duration-300 ease-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Navigation drawer"
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-surface-300 shrink-0">
          <span className="text-[20px] font-black italic tracking-tight text-surface-text">
            UN<span className="text-brand">DRAFTED</span>
          </span>
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
            className="w-9 h-9 flex items-center justify-center rounded-lg text-surface-muted hover:bg-surface-200 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto overscroll-contain">

          {/* Quick links */}
          <nav className="p-3 space-y-0.5 border-b border-surface-300">
            {DRAWER_LINKS.map(({ href, label }) => (
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

          {/* All leagues — every league, not just primary */}
          <div className="p-3">
            <p className="px-3 pt-1 pb-2 text-[9px] font-black uppercase tracking-[0.14em] text-brand">
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
                  <span className="text-[18px] leading-none shrink-0">{l.logo}</span>
                  <span className="flex-1 truncate">{l.name}</span>
                  {/* Terminology badge (Tables / Rankings) */}
                  {l.standingsLabel && l.standingsLabel !== "Standings" && (
                    <span className="text-[8px] font-bold uppercase tracking-wide text-surface-muted border border-surface-300 rounded px-1 py-0.5 shrink-0">
                      {l.standingsLabel}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Auth footer */}
        <div className="border-t border-surface-300 p-4 shrink-0">
          {session ? (
            <div className="space-y-1">
              <Link
                href="/profile"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-200 transition-colors"
              >
                <span className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-white text-sm font-black shrink-0">
                  {session.user?.name?.[0]?.toUpperCase() ?? "U"}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-surface-text truncate">{session.user?.name}</p>
                  <p className="text-[10px] text-surface-muted truncate">{session.user?.email}</p>
                </div>
              </Link>
              <button
                onClick={() => { signOut(); setMobileOpen(false); }}
                className="w-full text-left px-3 py-2 text-sm text-surface-muted hover:text-brand transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link
                href="/auth/login"
                onClick={() => setMobileOpen(false)}
                className="flex-1 text-center py-2.5 border border-surface-300 rounded-lg text-sm font-semibold text-surface-text hover:bg-surface-200 transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/auth/login"
                onClick={() => setMobileOpen(false)}
                className="flex-1 text-center py-2.5 bg-brand hover:bg-brand/90 text-white rounded-lg text-sm font-bold transition-colors"
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

// ─────────────────────────────────────────────────────────
// UserMenuItem — small helper for the user dropdown
// ─────────────────────────────────────────────────────────
function UserMenuItem({
  href,
  onClick,
  accent,
  children,
}: {
  href: string;
  onClick: () => void;
  accent?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 text-xs hover:bg-surface-200 transition-colors ${
        accent ?? "text-surface-text"
      }`}
    >
      {children}
    </Link>
  );
}
