"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useUser, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import {
  Search, ChevronDown, PlayCircle, Activity,
  Star, Zap, Newspaper, BarChart2, Tv,
} from "lucide-react";
import { games } from "@/data/games";
import { teams } from "@/data/teams";
import { transactions } from "@/data/transactions";
import ThemeToggle from "./ThemeToggle";
import SearchModal from "./SearchModal";
import PointsCounter from "@/components/ui/PointsCounter";
import NotificationBell from "./NotificationBell";

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
  if (page === "The Scoop") return `/league/${slug}/scoop`;
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

  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { isSignedIn, user } = useUser();
  const clerkUsername = (user?.publicMetadata as { username?: string } | undefined)?.username;

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = isDirOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isDirOpen]);

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
  const openLeague  = (name: string) => { if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current); setHoveredLeague(name); };
  const closeLeague = ()              => { leaveTimerRef.current = setTimeout(() => setHoveredLeague(null), 120); };
  const keepLeague  = ()              => { if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current); };

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

            <div className="hidden lg:block">
              <NotificationBell />
            </div>

            <PointsCounter />
            <ThemeToggle />

            {/* Auth section */}
            {isSignedIn ? (
              <div className="ml-1 hidden lg:flex items-center gap-3 border-l border-white/10 pl-4">
                {clerkUsername ? (
                  <Link
                    href={`/profile/${clerkUsername}`}
                    className="text-[10px] font-black uppercase text-white/40 hover:text-white transition-colors"
                  >
                    My Profile
                  </Link>
                ) : (
                  <Link
                    href="/onboarding"
                    className="text-[10px] font-black uppercase text-yellow-500/80 hover:text-yellow-400 transition-colors"
                  >
                    Complete Profile
                  </Link>
                )}
                <UserButton />
              </div>
            ) : (
              <div className="ml-2 hidden lg:flex items-center gap-3 border-l border-white/10 pl-4">
                <SignInButton mode="modal">
                  <button className="text-[10px] font-black uppercase text-white/40 hover:text-white transition-colors">
                    Log In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="rounded bg-white px-3 py-1.5 text-[10px] font-black uppercase text-black hover:bg-zinc-200 transition-colors">
                    Sign Up
                  </button>
                </SignUpButton>
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
