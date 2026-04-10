"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import {
  Search, Settings, Moon, Sun, Bell,
  ChevronDown, PlayCircle, Activity, Star, X, User,
} from "lucide-react";
import { leagues } from "@/data/leagues";
import ThemeToggle from "./ThemeToggle";
import SearchModal from "./SearchModal";
import MegaMenu from "./MegaMenu";
import PointsCounter from "@/components/ui/PointsCounter";

// ─────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────

/** Leagues shown in the sub-nav league strip. */
const PRIMARY_IDS = ["nfl", "nba", "mlb", "nhl", "wnba", "mls", "college"];

/** Links shown in the directory drawer. */
const DRAWER_LINKS = [
  { href: "/watch",    label: "Watch"      },
  { href: "/feed",     label: "Fan Pulse"  },
  { href: "/scores",   label: "Live Scores"},
  { href: "/pipeline", label: "Pipeline 📋"},
  { href: "/premium",  label: "Premium ⭐" },
];

// ─────────────────────────────────────────────────────────
// Header
// ─────────────────────────────────────────────────────────
export default function Header() {
  const [isDirOpen,     setIsDirOpen]     = useState(false);
  const [searchOpen,    setSearchOpen]    = useState(false);
  const [hoveredLeague, setHoveredLeague] = useState<string | null>(null);
  const [userMenuOpen,  setUserMenuOpen]  = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const leaveTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: session } = useSession();
  const isAdmin = (session?.user as Record<string, unknown> | undefined)?.role === "admin";

  const primaryLeagues = leagues.filter((l) => PRIMARY_IDS.includes(l.id));

  // ── Effects ──────────────────────────────────────────
  // Lock body scroll while drawer is open
  useEffect(() => {
    document.body.style.overflow = isDirOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isDirOpen]);

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
      if (e.key === "Escape") { setHoveredLeague(null); setIsDirOpen(false); }
    };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, []);

  // ── Mega-menu hover dwell (150 ms grace) ─────────────
  const openMega = useCallback((id: string) => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    setHoveredLeague(id);
  }, []);

  const closeMega = useCallback(() => {
    leaveTimer.current = setTimeout(() => setHoveredLeague(null), 150);
  }, []);

  const keepMega = useCallback(() => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
  }, []);

  return (
    <>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* ── Directory drawer backdrop ─────────────────── */}
      <AnimatePresence>
        {isDirOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsDirOpen(false)}
            className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-md"
          />
        )}
      </AnimatePresence>

      {/* ── Directory drawer ──────────────────────────── */}
      <AnimatePresence>
        {isDirOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 z-[110] h-screen w-[50vw] min-w-[280px] max-w-sm bg-black border-r border-white/10 p-10 shadow-2xl overflow-y-auto"
            aria-label="Site directory"
          >
            <div className="flex items-center justify-between mb-16">
              <h2 className="text-3xl font-black italic tracking-tighter text-white">DIRECTORY</h2>
              <button
                onClick={() => setIsDirOpen(false)}
                aria-label="Close directory"
                className="p-2 hover:bg-white/10 rounded-full text-white transition-colors"
              >
                <X size={32} />
              </button>
            </div>

            {/* Two-column site map */}
            <div className="grid grid-cols-2 gap-12">
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-red-600 mb-6">Quick Links</h3>
                <div className="flex flex-col gap-5 text-2xl font-black text-white">
                  {DRAWER_LINKS.map(({ href, label }) => (
                    <Link key={href} href={href} onClick={() => setIsDirOpen(false)}
                      className="hover:text-white/70 transition-colors">
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-red-600 mb-6">Leagues</h3>
                <div className="flex flex-col gap-4 text-lg font-bold text-white/70">
                  {leagues.map((l) => (
                    <Link key={l.id} href={`/league/${l.slug}`}
                      onClick={() => setIsDirOpen(false)}
                      className="hover:text-white flex items-center gap-3 transition-colors"
                    >
                      <span className="text-2xl">{l.logo}</span>
                      {l.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Drawer footer */}
            <div className="absolute bottom-10 left-10 right-10">
              <div className="flex items-center justify-between border-t border-white/5 pt-6">
                <p className="text-[10px] text-white/20 uppercase font-bold tracking-widest">
                  © 2026 UNDRAFTED MEDIA
                </p>
                <div className="flex gap-4 text-white/20">
                  <Settings size={16} />
                  <User size={16} />
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════════════════ */}
      {/*  HEADER                                          */}
      {/* ════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-[100] w-full border-b border-white/10 bg-black/90 backdrop-blur-xl">

        {/* ── Main row: Hamburger + Logo | Nav | Actions ── */}
        <div className="container mx-auto flex h-16 items-center justify-between px-4">

          {/* Left: directory toggle + logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDirOpen(!isDirOpen)}
              aria-label={isDirOpen ? "Close directory" : "Open directory"}
              aria-expanded={isDirOpen}
              className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-md hover:bg-white/10 transition-colors"
            >
              <motion.div
                animate={isDirOpen ? { rotate: 45, y: 7.5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.2 }}
                className="h-0.5 w-6 bg-white"
              />
              <motion.div
                animate={isDirOpen ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.15 }}
                className="h-0.5 w-6 bg-white"
              />
              <motion.div
                animate={isDirOpen ? { rotate: -45, y: -7.5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.2 }}
                className="h-0.5 w-6 bg-white"
              />
            </button>

            <Link href="/" aria-label="UNDRAFTED – home"
              className="flex items-center text-2xl font-black tracking-tighter text-white select-none">
              <span className="bg-red-600 px-1.5 text-black">U</span>NDRAFTED
            </Link>
          </div>

          {/* Center: primary nav (desktop) */}
          <nav className="hidden items-center gap-10 lg:flex">
            <Link href="/watch"
              className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-white/60 hover:text-white transition-all">
              <PlayCircle size={16} className="text-red-500" />
              Watch
            </Link>
            <Link href="/feed"
              className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-white/60 hover:text-white transition-all">
              <Activity size={16} className="text-green-500" />
              Fan Pulse
            </Link>
            <Link href="/premium"
              className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-white/60 hover:text-white transition-all">
              <Star size={16} className="text-yellow-500" />
              Premium
            </Link>
          </nav>

          {/* Right: utility actions */}
          <div className="flex items-center gap-1">

            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search (⌘K)"
              className="p-2 text-white/60 hover:text-white transition-colors"
            >
              <Search size={20} />
            </button>

            {/* Notifications */}
            <div className="relative hidden lg:block">
              <button aria-label="Notifications" className="p-2 text-white/60 hover:text-white transition-colors">
                <Bell size={20} />
              </button>
              <span aria-hidden className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-600 ring-2 ring-black" />
            </div>

            {/* Settings / Profile */}
            <Link href="/profile" aria-label="Settings & Profile"
              className="hidden p-2 text-white/60 hover:text-white transition-colors md:block">
              <Settings size={20} />
            </Link>

            {/* DraftCoin loyalty counter */}
            <PointsCounter />

            {/* Theme toggle */}
            <ThemeToggle />

            {/* Auth (desktop) */}
            {session ? (
              <div ref={userMenuRef} className="relative hidden lg:block ml-1">
                <button
                  onClick={() => setUserMenuOpen((o) => !o)}
                  aria-expanded={userMenuOpen}
                  className="flex items-center gap-1.5 px-1.5 py-1 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <span className="w-7 h-7 rounded-full bg-brand flex items-center justify-center text-white text-xs font-black">
                    {session.user?.name?.[0]?.toUpperCase() ?? "U"}
                  </span>
                  <motion.div
                    animate={{ rotate: userMenuOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-white/60"
                  >
                    <ChevronDown size={12} />
                  </motion.div>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-52 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-[60]">
                    <div className="px-3 py-2.5 border-b border-white/10">
                      <p className="text-xs font-semibold text-white truncate">{session.user?.name}</p>
                      <p className="text-[10px] text-white/50 truncate">{session.user?.email}</p>
                    </div>
                    <UserMenuItem href="/profile" onClick={() => setUserMenuOpen(false)}>👤 My Profile</UserMenuItem>
                    <UserMenuItem href="/premium" onClick={() => setUserMenuOpen(false)}>⭐ Premium</UserMenuItem>
                    {isAdmin && (
                      <>
                        <div className="border-t border-white/10" />
                        <UserMenuItem href="/admin/live-control" onClick={() => setUserMenuOpen(false)} accent="text-yellow-500">
                          ⚡ Live Control
                        </UserMenuItem>
                        <UserMenuItem href="/admin/analytics" onClick={() => setUserMenuOpen(false)} accent="text-blue-400">
                          📊 Analytics
                        </UserMenuItem>
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
            ) : (
              <div className="ml-2 hidden lg:flex items-center gap-3 border-l border-white/10 pl-4">
                <Link href="/auth/login"
                  className="text-[10px] font-black uppercase text-white/50 hover:text-white transition-colors">
                  Log In
                </Link>
                <Link href="/auth/signup"
                  className="rounded bg-white px-3 py-1.5 text-[10px] font-black uppercase text-black hover:bg-zinc-200 transition-colors">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* ── Sub-nav: League strip + MegaMenu ─────────── */}
        <div className="relative border-t border-white/5 bg-zinc-950/50" onMouseLeave={closeMega}>
          <div className="container mx-auto flex h-10 items-center justify-center gap-6 lg:gap-8 overflow-x-auto no-scrollbar">
            {primaryLeagues.map((league) => (
              <div
                key={league.id}
                onMouseEnter={() => openMega(league.id)}
                className="flex items-center gap-1 cursor-pointer group shrink-0"
              >
                <span className="text-sm leading-none">{league.logo}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 group-hover:text-white transition-colors">
                  {league.name}
                </span>
                <motion.div
                  animate={{ rotate: hoveredLeague === league.id ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-white/40"
                >
                  <ChevronDown size={12} />
                </motion.div>
              </div>
            ))}
          </div>

          {/* MegaMenu — positioned below sub-nav */}
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
        </div>

      </header>
    </>
  );
}

// ─────────────────────────────────────────────────────────
// UserMenuItem — dropdown entry helper
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
      className={`flex items-center gap-2 px-3 py-2 text-xs hover:bg-white/5 transition-colors ${
        accent ?? "text-white/80"
      }`}
    >
      {children}
    </Link>
  );
}
