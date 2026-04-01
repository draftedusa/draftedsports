"use client";

import { useState } from "react";
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

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();
  const tickerItems = buildTickerItems();
  const isAdmin = (session?.user as Record<string, unknown> | undefined)?.role === "admin";

  return (
    <header className="bg-surface-100 border-b border-surface-300 sticky top-0 z-50">
      {/* Ticker */}
      <div className="bg-brand overflow-hidden h-7 flex items-center">
        <span className="shrink-0 px-3 text-xs font-black text-white tracking-widest border-r border-brand-light/40 h-full flex items-center">
          LIVE
        </span>
        <div className="flex-1 overflow-hidden relative">
          <div className="flex gap-12 whitespace-nowrap animate-ticker text-xs text-white font-medium">
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <span key={i} className="shrink-0">{item}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Main nav row */}
      <div className="max-w-[1400px] mx-auto px-4 flex items-center justify-between h-14 gap-4">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <span className="text-2xl font-black italic tracking-tighter text-surface-text">
            UN<span className="text-brand">DRAFTED</span>
          </span>
        </Link>

        {/* Desktop league toolbar */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-semibold">
          {leagues.map((l) => (
            <Link
              key={l.id}
              href={`/league/${l.slug}`}
              className="flex items-center gap-1.5 px-3 py-1.5 text-surface-muted hover:text-brand hover:bg-brand/10 rounded-lg transition-colors group"
            >
              <span className="w-6 h-6 rounded-full bg-surface-200 flex items-center justify-center text-sm group-hover:ring-2 ring-brand transition-all">
                {l.logo}
              </span>
              {l.name}
            </Link>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/search"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-surface-200 hover:bg-surface-300 rounded-lg text-sm text-surface-muted hover:text-surface-text transition-colors"
          >
            <span>🔍</span>
            <span className="hidden md:inline text-xs font-medium">Search</span>
          </Link>

          <ThemeToggle />

          {/* Auth */}
          {session ? (
            <div className="hidden lg:flex items-center gap-2">
              {isAdmin && (
                <>
                  <Link href="/admin/live-control" className="px-2 py-1 text-xs font-bold text-yellow-500 hover:text-yellow-300 border border-yellow-800 hover:border-yellow-600 rounded transition-colors">
                    ⚡
                  </Link>
                  <Link href="/admin/analytics" className="px-2 py-1 text-xs font-bold text-blue-500 hover:text-blue-300 border border-blue-800 hover:border-blue-600 rounded transition-colors">
                    📊
                  </Link>
                </>
              )}
              <button
                onClick={() => signOut()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-200 hover:bg-surface-300 rounded-lg text-xs font-semibold text-surface-muted hover:text-surface-text transition-colors"
              >
                <span className="w-6 h-6 rounded-full bg-brand flex items-center justify-center text-white text-xs font-bold">
                  {session.user?.name?.[0] ?? "U"}
                </span>
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden lg:inline-flex px-4 py-1.5 bg-brand hover:bg-brand/90 text-white text-xs font-bold rounded-lg transition-colors"
            >
              Sign In
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

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-surface-200 border-t border-surface-300 px-4 py-4 space-y-1">
          <MobileLink href="/scores" onClick={() => setMobileOpen(false)}>📊 Scores</MobileLink>
          <MobileLink href="/standings" onClick={() => setMobileOpen(false)}>🏆 Standings</MobileLink>
          <MobileLink href="/transactions" onClick={() => setMobileOpen(false)}>🔄 Transactions</MobileLink>
          <MobileLink href="/search" onClick={() => setMobileOpen(false)}>🔍 Search</MobileLink>
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
                  <MobileLink href="/admin/analytics" onClick={() => setMobileOpen(false)}>📈 Analytics</MobileLink>
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
              <MobileLink href="/login" onClick={() => setMobileOpen(false)}>👤 Sign In</MobileLink>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="px-3 py-1.5 text-surface-muted hover:text-surface-text hover:bg-surface-200 rounded-lg transition-colors">
      {children}
    </Link>
  );
}

function MobileLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link href={href} onClick={onClick} className="flex items-center gap-2 px-3 py-2.5 rounded text-surface-text hover:bg-surface-300 transition-colors text-sm font-medium">
      {children}
    </Link>
  );
}
