"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { leagues } from "@/data/leagues";
import { games } from "@/data/games";
import { teams } from "@/data/teams";
import { transactions } from "@/data/transactions";
import ThemeToggle from "./ThemeToggle";

const teamMap = Object.fromEntries(teams.map((t) => [t.id, t]));

function buildTickerItems(): string[] {
  const live = games.filter((g) => g.status === "live").map((g) => {
    const home = teamMap[g.homeTeamId];
    const away = teamMap[g.awayTeamId];
    return `🔴 ${away.name} ${g.awayScore} — ${home.name} ${g.homeScore} · ${g.quarter} ${g.timeRemaining}`;
  });
  const breaking = transactions
    .filter((t) => t.isBreaking)
    .slice(0, 3)
    .map((t) => `⚡ ${t.headline}`);
  return [...live, ...breaking];
}

const STATIC_NAV = [
  { href: "/",             label: "Home" },
  { href: "/scores",       label: "Scores" },
  { href: "/standings",    label: "Standings" },
  { href: "/transactions", label: "Transactions" },
  { href: "/search",       label: "Watch" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [dropOpen, setDropOpen]       = useState(false);
  const dropRef                        = useRef<HTMLDivElement>(null);
  const { data: session }             = useSession();
  const tickerItems                   = buildTickerItems();
  const isAdmin = (session?.user as Record<string, unknown> | undefined)?.role === "admin";

  // Close dropdown on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <header className="bg-surface-100 border-b border-surface-300 sticky top-0 z-50">

      {/* ── Ticker ──────────────────────────────────────────────── */}
      <div className="bg-brand overflow-hidden h-7 flex items-center">
        <span className="shrink-0 px-3 text-xs font-black text-white tracking-widest border-r border-white/20 h-full flex items-center">
          LIVE
        </span>
        <div className="flex-1 overflow-hidden">
          <div className="flex gap-12 whitespace-nowrap animate-ticker text-xs text-white font-medium">
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <span key={i} className="shrink-0">{item}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Top Tier ────────────────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-4 flex items-center h-14 gap-4">

        {/* Left: Logo + Search */}
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/">
            <span className="text-2xl font-black italic tracking-tighter text-surface-text">
              UN<span className="text-brand">DRAFTED</span>
            </span>
          </Link>
          <Link
            href="/search"
            className="hidden sm:flex w-8 h-8 items-center justify-center rounded-lg text-surface-muted hover:text-brand hover:bg-surface-200 transition-colors"
            aria-label="Search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd"/>
            </svg>
          </Link>
        </div>

        {/* Center: League Toolbar — icons only, no text */}
        <nav className="hidden lg:flex flex-1 items-center justify-center gap-2">
          {leagues.map((l) => (
            <Link
              key={l.id}
              href={`/league/${l.slug}`}
              title={l.name}
              className="relative flex flex-col items-center gap-0.5 px-1 py-0.5 group"
            >
              <span className="w-9 h-9 rounded-full bg-surface-200 flex items-center justify-center text-lg group-hover:ring-2 ring-brand ring-offset-1 ring-offset-surface-100 transition-all duration-150">
                {l.logo}
              </span>
              <span className="text-[9px] font-bold text-surface-muted group-hover:text-brand transition-colors uppercase tracking-wider leading-none">
                {l.name}
              </span>
              {/* Dropdown chevron hint */}
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-brand leading-none">
                ▾
              </span>
            </Link>
          ))}
        </nav>

        {/* Right: Settings + Theme + Auth */}
        <div className="flex items-center gap-1 ml-auto shrink-0">
          {/* Settings */}
          <Link
            href="/profile/rocketsfan88"
            className="hidden lg:flex w-8 h-8 items-center justify-center rounded-lg text-surface-muted hover:text-brand hover:bg-surface-200 transition-colors"
            aria-label="Profile settings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M8.34 1.804A1 1 0 0 1 9.32 1h1.36a1 1 0 0 1 .98.804l.295 1.473c.497.144.971.342 1.416.587l1.25-.834a1 1 0 0 1 1.262.125l.962.962a1 1 0 0 1 .125 1.261l-.834 1.25c.245.445.443.92.587 1.417l1.473.294a1 1 0 0 1 .804.98v1.361a1 1 0 0 1-.804.98l-1.473.295a6.95 6.95 0 0 1-.587 1.416l.834 1.25a1 1 0 0 1-.125 1.262l-.962.962a1 1 0 0 1-1.261.125l-1.25-.834a6.953 6.953 0 0 1-1.417.587l-.294 1.473a1 1 0 0 1-.98.804H9.32a1 1 0 0 1-.98-.804l-.295-1.473a6.957 6.957 0 0 1-1.416-.587l-1.25.834a1 1 0 0 1-1.262-.125l-.962-.962a1 1 0 0 1-.125-1.261l.834-1.25a6.957 6.957 0 0 1-.587-1.417l-1.473-.294A1 1 0 0 1 1 10.68V9.32a1 1 0 0 1 .804-.98l1.473-.295c.144-.497.342-.971.587-1.416l-.834-1.25a1 1 0 0 1 .125-1.262l.962-.962A1 1 0 0 1 5.378 3.03l1.25.834a6.957 6.957 0 0 1 1.417-.587L8.34 1.804ZM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd"/>
            </svg>
          </Link>

          <ThemeToggle />

          {/* Auth: avatar dropdown or LOG IN */}
          {session ? (
            <div ref={dropRef} className="relative hidden lg:block">
              <button
                onClick={() => setDropOpen(!dropOpen)}
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-surface-200 transition-colors"
                aria-label="Account menu"
              >
                <span className="w-7 h-7 rounded-full bg-brand flex items-center justify-center text-white text-xs font-bold">
                  {session.user?.name?.[0] ?? "U"}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className={`w-3 h-3 text-surface-muted transition-transform ${dropOpen ? "rotate-180" : ""}`}>
                  <path fillRule="evenodd" d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd"/>
                </svg>
              </button>

              {dropOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-surface-200 border border-surface-300 rounded-xl shadow-xl overflow-hidden">
                  <div className="px-3 py-2.5 border-b border-surface-300">
                    <p className="text-xs font-semibold text-surface-text truncate">{session.user?.name}</p>
                    <p className="text-[10px] text-surface-muted truncate">{session.user?.email}</p>
                  </div>
                  {isAdmin && (
                    <>
                      <Link href="/admin/live-control" onClick={() => setDropOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-yellow-500 hover:bg-surface-300 transition-colors">
                        ⚡ Live Control
                      </Link>
                      <Link href="/admin/analytics" onClick={() => setDropOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-blue-400 hover:bg-surface-300 transition-colors">
                        📊 Analytics
                      </Link>
                    </>
                  )}
                  <button
                    onClick={() => { signOut(); setDropOpen(false); }}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs text-surface-muted hover:bg-surface-300 transition-colors border-t border-surface-300"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden lg:inline-flex px-4 py-1.5 bg-brand hover:bg-brand/90 text-white text-xs font-bold rounded-lg transition-colors"
            >
              LOG IN
            </Link>
          )}

          {/* Hamburger */}
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

      {/* ── Bottom Tier — Static nav ─────────────────────────────── */}
      <div className="hidden lg:block border-t border-surface-300 bg-surface-200/60">
        <div className="max-w-[1400px] mx-auto px-4 h-9 flex items-center gap-0.5">
          {STATIC_NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="px-4 h-full flex items-center text-xs font-semibold text-surface-muted hover:text-brand hover:border-b-2 hover:border-brand transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Mobile Drawer ────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="lg:hidden bg-surface-200 border-t border-surface-300 px-4 py-4 space-y-1">
          {STATIC_NAV.map(({ href, label }) => (
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
                Sign Out ({session.user?.email})
              </button>
            </div>
          ) : (
            <div className="border-t border-surface-300 pt-2 mt-2">
              <MobileLink href="/login" onClick={() => setMobileOpen(false)}>👤 LOG IN</MobileLink>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

function MobileLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link href={href} onClick={onClick} className="flex items-center gap-2 px-3 py-2.5 rounded text-surface-text hover:bg-surface-300 transition-colors text-sm font-medium">
      {children}
    </Link>
  );
}
