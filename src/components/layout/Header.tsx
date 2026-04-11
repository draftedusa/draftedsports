"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import {
  Search, Bell, ChevronDown, PlayCircle, Activity,
  Star, User, Zap, Newspaper, BarChart2, Tv,
} from "lucide-react";
import { leagues as leaguesData } from "@/data/leagues";
import { games } from "@/data/games";
import { teams } from "@/data/teams";
import { transactions } from "@/data/transactions";
import ThemeToggle from "./ThemeToggle";
import SearchModal from "./SearchModal";
import PointsCounter from "@/components/ui/PointsCounter";

// ─────────────────────────────────────────────────────────
// League strip config
// ─────────────────────────────────────────────────────────
const LEAGUES = [
  { name: "NFL",     slug: "nfl",     standingsLabel: "Standings" },
  { name: "NBA",     slug: "nba",     standingsLabel: "Standings" },
  { name: "MLB",     slug: "mlb",     standingsLabel: "Standings" },
  { name: "NHL",     slug: "nhl",     standingsLabel: "Standings" },
  { name: "Soccer",  slug: "soccer",  standingsLabel: "Tables"    },
  { name: "College", slug: "college", standingsLabel: "Rankings"  },
];

const LEAGUE_PAGES = [
  "Home", "The Scoop", "Scores", "Schedule",
  "Standings", "Stats", "Teams", "Players",
];

function pageHref(slug: string, page: string): string {
  if (page === "Home")      return `/league/${slug}`;
  if (page === "The Scoop") return `/scoop`;
  return `/league/${slug}/${page.toLowerCase()}`;
}

// ─────────────────────────────────────────────────────────
// Ticker data — real games + breaking news
// ─────────────────────────────────────────────────────────
const teamMap = Object.fromEntries(teams.map((t) => [t.id, t]));

function teamCode(id: string) {
  const t = teamMap[id];
  return t ? (t.name.split(" ").at(-1) ?? t.name).slice(0, 3).toUpperCase() : "---";
}

type GameTick = {
  id: string; type: "GAME"; gameId: string;
  league: string; home: string; away: string; score: string; status: string;
};
type NewsTick = {
  id: string; type: "NEWS";
  category: string; title: string; newsKind: "zap" | "paper";
};
type TickerItem = GameTick | NewsTick;

function buildTicker(): TickerItem[] {
  const items: TickerItem[] = [];
  for (const g of games.filter((g) => g.status !== "upcoming").slice(0, 6)) {
    items.push({
      id: g.id, type: "GAME", gameId: g.id,
      league: g.leagueId.toUpperCase(),
      home: teamCode(g.homeTeamId),
      away: teamCode(g.awayTeamId),
      score: `${g.awayScore} – ${g.homeScore}`,
      status: g.status === "final" ? "FINAL" : `${g.quarter} ${g.timeRemaining}`.trim(),
    });
  }
  for (const tx of transactions.filter((t) => t.isBreaking).slice(0, 4)) {
    items.push({
      id: tx.id, type: "NEWS",
      category: tx.type === "trade" ? "TRANSACTION" : "BREAKING",
      title: tx.headline,
      newsKind: tx.type === "trade" ? "zap" : "paper",
    });
  }
  return items;
}

const TICKER_ITEMS = buildTicker();

// ─────────────────────────────────────────────────────────
// Header
// ─────────────────────────────────────────────────────────
export default function Header() {
  const [isDirOpen,       setIsDirOpen]       = useState(false);
  const [searchOpen,      setSearchOpen]      = useState(false);
  const [hoveredLeague,   setHoveredLeague]   = useState<string | null>(null);
  const [hoveredTickerId, setHoveredTickerId] = useState<string | null>(null);
  const [userMenuOpen,    setUserMenuOpen]    = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const leaveTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { data: session } = useSession();
  const isAdmin = (session?.user as Record<string, unknown> | undefined)?.role === "admin";

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = isDirOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isDirOpen]);

  // Outside click closes user menu
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
      if (e.key === "Escape") setIsDirOpen(false);
    };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, []);

  // League dropdown hover with grace period
  const openLeague  = (name: string) => { if (leaveTimer.current) clearTimeout(leaveTimer.current); setHoveredLeague(name); };
  const closeLeague = ()              => { leaveTimer.current = setTimeout(() => setHoveredLeague(null), 120); };
  const keepLeague  = ()              => { if (leaveTimer.current) clearTimeout(leaveTimer.current); };

  return (
    <>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* ════════════════════════════════════════════════ */}
      {/*  HEADER                                          */}
      {/* ════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-[100] w-full bg-black">

        {/* ── 1. Primary taskbar ───────────────────────── */}
        <div className="container mx-auto flex h-16 items-center justify-between px-4 border-b border-white/10">

          {/* Left: hamburger + logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDirOpen(!isDirOpen)}
              aria-label={isDirOpen ? "Close directory" : "Open directory"}
              aria-expanded={isDirOpen}
              className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 hover:bg-white/5 transition-colors"
            >
              <motion.div animate={isDirOpen ? { rotate: 45, y: 7.5 } : { rotate: 0, y: 0 }} transition={{ duration: 0.2 }} className="h-0.5 w-6 bg-white" />
              <motion.div animate={isDirOpen ? { opacity: 0 } : { opacity: 1 }} transition={{ duration: 0.15 }} className="h-0.5 w-6 bg-white" />
              <motion.div animate={isDirOpen ? { rotate: -45, y: -7.5 } : { rotate: 0, y: 0 }} transition={{ duration: 0.2 }} className="h-0.5 w-6 bg-white" />
            </button>

            <Link href="/" aria-label="Undrafted – home"
              className="text-2xl font-black tracking-tighter text-white italic uppercase select-none">
              Undrafted
            </Link>
          </div>

          {/* Center: primary nav */}
          <nav className="hidden items-center gap-8 lg:flex">
            <Link href="/watch"
              className="flex items-center gap-2 text-[10px] font-black uppercase text-white/60 hover:text-white transition-colors">
              <PlayCircle size={14} className="text-red-500" /> Watch
            </Link>
            <Link href="/feed"
              className="flex items-center gap-2 text-[10px] font-black uppercase text-white/60 hover:text-white transition-colors">
              <Activity size={14} className="text-green-500" /> Fan Pulse
            </Link>
            <Link href="/league/nfl/odds"
              className="flex items-center gap-2 text-[10px] font-black uppercase text-white/60 hover:text-white transition-colors">
              <Star size={14} className="text-yellow-500" /> Odds
            </Link>
          </nav>

          {/* Right: utility + auth */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search (⌘K)"
              className="p-2 text-white/60 hover:text-white transition-colors"
            >
              <Search size={18} />
            </button>

            <div className="relative hidden lg:block">
              <button aria-label="Notifications" className="p-2 text-white/60 hover:text-white transition-colors">
                <Bell size={18} />
              </button>
              <span aria-hidden className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-600 ring-1 ring-black" />
            </div>

            <PointsCounter />
            <ThemeToggle />

            {/* Profile avatar */}
            <Link href="/profile" aria-label="Profile"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 border border-white/10 text-white/60 hover:border-white/40 hover:text-white ml-1 transition-colors">
              <User size={16} />
            </Link>

            {/* Auth dropdown (session-aware) */}
            {session && (
              <div ref={userMenuRef} className="relative hidden lg:block ml-1">
                <button
                  onClick={() => setUserMenuOpen((o) => !o)}
                  aria-expanded={userMenuOpen}
                  className="flex items-center gap-1.5 px-1.5 py-1 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <span className="w-6 h-6 rounded-full bg-brand flex items-center justify-center text-white text-[10px] font-black">
                    {session.user?.name?.[0]?.toUpperCase() ?? "U"}
                  </span>
                  <motion.div animate={{ rotate: userMenuOpen ? 180 : 0 }} transition={{ duration: 0.2 }} className="text-white/60">
                    <ChevronDown size={11} />
                  </motion.div>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-52 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-[60]">
                    <div className="px-3 py-2.5 border-b border-white/10">
                      <p className="text-xs font-semibold text-white truncate">{session.user?.name}</p>
                      <p className="text-[10px] text-white/50 truncate">{session.user?.email}</p>
                    </div>
                    <DropItem href="/profile" onClick={() => setUserMenuOpen(false)}>👤 My Profile</DropItem>
                    <DropItem href="/premium" onClick={() => setUserMenuOpen(false)}>⭐ Premium</DropItem>
                    {isAdmin && (
                      <>
                        <div className="border-t border-white/10" />
                        <DropItem href="/admin/live-control" onClick={() => setUserMenuOpen(false)} accent="text-yellow-500">⚡ Live Control</DropItem>
                        <DropItem href="/admin/analytics" onClick={() => setUserMenuOpen(false)} accent="text-blue-400">📊 Analytics</DropItem>
                      </>
                    )}
                    <div className="border-t border-white/10" />
                    <button
                      onClick={() => { signOut(); setUserMenuOpen(false); }}
                      className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs text-white/50 hover:bg-white/5 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}

            {!session && (
              <div className="ml-2 hidden lg:flex items-center gap-3 border-l border-white/10 pl-4">
                <Link href="/auth/login" className="text-[10px] font-black uppercase text-white/40 hover:text-white transition-colors">Log In</Link>
                <Link href="/auth/signup" className="rounded bg-white px-3 py-1.5 text-[10px] font-black uppercase text-black hover:bg-zinc-200 transition-colors">Sign Up</Link>
              </div>
            )}
          </div>
        </div>

        {/* ── 2. Scores / News ticker ───────────────────── */}
        <div className="flex h-10 w-full border-b border-white/10 bg-zinc-950 overflow-hidden">
          <div className="z-20 shrink-0 bg-red-600 px-4 flex items-center text-[10px] font-black uppercase text-white italic shadow-[10px_0_15px_rgba(0,0,0,0.5)]">
            Scores / News
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="flex animate-ticker h-full whitespace-nowrap">
              {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                <div
                  key={`${item.id}-${i}`}
                  onMouseEnter={() => setHoveredTickerId(item.id)}
                  onMouseLeave={() => setHoveredTickerId(null)}
                  className="relative flex h-10 shrink-0 min-w-[220px] items-center border-r border-white/5 px-6 transition-colors hover:bg-white/5 cursor-pointer"
                >
                  {/* Score / news view */}
                  <div className={`flex items-center gap-3 transition-opacity duration-200 ${
                    hoveredTickerId === item.id && item.type === "GAME" ? "opacity-0" : "opacity-100"
                  }`}>
                    {item.type === "GAME" ? (
                      <>
                        <span className="text-[9px] font-bold text-white/30 uppercase">{item.league}</span>
                        <span className="text-[11px] font-black text-white">{item.away} {item.score} {item.home}</span>
                        <span className={`text-[9px] font-bold uppercase ${item.status === "FINAL" ? "text-white/30" : "text-red-500"}`}>
                          {item.status}
                        </span>
                      </>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="rounded-full bg-yellow-500/10 p-1 shrink-0">
                          {item.newsKind === "zap"
                            ? <Zap size={12} className="text-yellow-400" />
                            : <Newspaper size={12} className="text-blue-400" />}
                        </div>
                        <span className="text-[11px] font-medium text-white/90 truncate">{item.title}</span>
                      </div>
                    )}
                  </div>

                  {/* Hover portal — GAME only */}
                  <AnimatePresence>
                    {item.type === "GAME" && hoveredTickerId === item.id && (
                      <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="absolute inset-0 z-30 flex items-center justify-center gap-5 bg-zinc-900 px-2"
                      >
                        <Link href={`/game/${item.gameId}`}
                          className="flex items-center gap-1 text-[9px] font-black uppercase text-white hover:text-red-500 transition-colors tracking-tighter">
                          <BarChart2 size={12} /> Boxscore
                        </Link>
                        <Link href={`/game/${item.gameId}`}
                          className="flex items-center gap-1 text-[9px] font-black uppercase text-white hover:text-red-500 transition-colors tracking-tighter">
                          <Tv size={12} /> Gamecast
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 3. League strip with full-page dropdowns ─────── */}
        <div className="hidden lg:flex h-10 w-full items-center justify-center gap-8 bg-black/50 border-b border-white/5">
          {LEAGUES.map((league) => (
            <div
              key={league.name}
              onMouseEnter={() => openLeague(league.name)}
              onMouseLeave={closeLeague}
              className="relative flex h-full items-center cursor-pointer group"
            >
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">
                {league.name}
              </span>
              <motion.div
                animate={{ rotate: hoveredLeague === league.name ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="ml-1 text-white/40"
              >
                <ChevronDown size={12} />
              </motion.div>

              <AnimatePresence>
                {hoveredLeague === league.name && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    onMouseEnter={keepLeague}
                    onMouseLeave={closeLeague}
                    className="absolute top-10 left-1/2 -translate-x-1/2 w-64 bg-zinc-950 border border-white/10 p-4 shadow-2xl grid grid-cols-2 gap-x-6 gap-y-2 z-[110]"
                  >
                    {LEAGUE_PAGES.map((page) => {
                      const label = page === "Standings" ? league.standingsLabel : page;
                      return (
                        <Link
                          key={page}
                          href={pageHref(league.slug, page)}
                          onClick={() => setHoveredLeague(null)}
                          className="text-[10px] font-bold text-white/50 hover:text-white uppercase tracking-tighter py-1 border-b border-white/5 transition-colors"
                        >
                          {label}
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* ── 4. Master directory dropdown ─────────────────── */}
        <AnimatePresence>
          {isDirOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setIsDirOpen(false)}
                className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-sm top-16"
              />
              <motion.div
                initial={{ y: "-100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-100%" }}
                transition={{ type: "tween", duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                className="absolute left-0 top-16 z-[90] w-full h-[50vh] bg-zinc-950 border-b border-white/10 overflow-hidden"
              >
                <div className="container mx-auto grid grid-cols-4 gap-12 p-12 h-full">

                  <div>
                    <h3 className="text-[10px] font-black text-red-600 uppercase mb-6 tracking-widest">Master Map</h3>
                    <div className="flex flex-col gap-4 text-2xl font-black text-white italic uppercase">
                      <Link href="/pipeline" onClick={() => setIsDirOpen(false)}>The Pipeline</Link>
                      <Link href="/scores"   onClick={() => setIsDirOpen(false)}>Live Scores</Link>
                      <Link href="/feed"     onClick={() => setIsDirOpen(false)}>Fan Pulse</Link>
                      <Link href="/watch"    onClick={() => setIsDirOpen(false)}>Watch</Link>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[10px] font-black text-red-600 uppercase mb-6 tracking-widest">Leagues</h3>
                    <div className="flex flex-col gap-3 text-lg font-bold text-white/70">
                      {LEAGUES.map((l) => (
                        <Link key={l.name} href={`/league/${l.slug}`} onClick={() => setIsDirOpen(false)}
                          className="hover:text-white transition-colors">
                          {l.name}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[10px] font-black text-red-600 uppercase mb-6 tracking-widest">Tools</h3>
                    <div className="flex flex-col gap-3 text-lg font-bold text-white/70">
                      <Link href="/pipeline"     onClick={() => setIsDirOpen(false)} className="hover:text-white transition-colors">Draft Board</Link>
                      <Link href="/standings"    onClick={() => setIsDirOpen(false)} className="hover:text-white transition-colors">Standings</Link>
                      <Link href="/transactions" onClick={() => setIsDirOpen(false)} className="hover:text-white transition-colors">Transactions</Link>
                      <Link href="/premium"      onClick={() => setIsDirOpen(false)} className="hover:text-white transition-colors">Premium ⭐</Link>
                    </div>
                  </div>

                  <div className="border-l border-white/5 pl-12 flex flex-col justify-between">
                    <div>
                      <h3 className="text-[10px] font-black text-white/30 uppercase mb-2 tracking-widest">Currently Trending</h3>
                      <p className="text-sm text-white/60 leading-relaxed italic">
                        "The 2026 NFL Mock Draft is live. Check the Pipeline for updates."
                      </p>
                    </div>
                    <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">© 2026 UNDRAFTED MEDIA</p>
                  </div>

                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

      </header>
    </>
  );
}

// ─────────────────────────────────────────────────────────
// DropItem helper
// ─────────────────────────────────────────────────────────
function DropItem({
  href, onClick, accent, children,
}: {
  href: string; onClick: () => void; accent?: string; children: React.ReactNode;
}) {
  return (
    <Link href={href} onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 text-xs hover:bg-white/5 transition-colors ${accent ?? "text-white/80"}`}>
      {children}
    </Link>
  );
}
