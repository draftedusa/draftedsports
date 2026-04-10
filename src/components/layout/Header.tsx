"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import {
  Search, Bell, PlayCircle, Activity, Star, X, ClipboardList, ChevronDown,
} from "lucide-react";
import { leagues } from "@/data/leagues";
import ThemeToggle from "./ThemeToggle";
import SearchModal from "./SearchModal";
import PointsCounter from "@/components/ui/PointsCounter";

// ─────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────
const LEAGUES = [
  { name: "NFL",     href: "/league/nfl",     icon: "🏈" },
  { name: "NBA",     href: "/league/nba",     icon: "🏀" },
  { name: "MLB",     href: "/league/mlb",     icon: "⚾" },
  { name: "NHL",     href: "/league/nhl",     icon: "🏒" },
  { name: "Soccer",  href: "/league/soccer",  icon: "⚽" },
  { name: "College", href: "/league/college", icon: "🎓" },
  { name: "WNBA",    href: "/league/wnba",    icon: "🏀" },
];

// ─────────────────────────────────────────────────────────
// Header
// ─────────────────────────────────────────────────────────
export default function Header() {
  const [isDirOpen,   setIsDirOpen]   = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const isAdmin = (session?.user as Record<string, unknown> | undefined)?.role === "admin";

  // ── Effects ──────────────────────────────────────────
  // Body scroll lock while directory is open
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
      if (e.key === "Escape") setIsDirOpen(false);
    };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, []);

  return (
    <>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* ════════════════════════════════════════════════ */}
      {/*  HEADER                                          */}
      {/* ════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-[100] w-full border-b border-white/10 bg-black">

        {/* ── 1. Main taskbar ──────────────────────────── */}
        <div className="container mx-auto flex h-16 items-center justify-between px-4">

          {/* Left: hamburger + logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDirOpen(!isDirOpen)}
              aria-label={isDirOpen ? "Close directory" : "Open directory"}
              aria-expanded={isDirOpen}
              className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-md hover:bg-white/10 transition-colors"
            >
              <motion.div animate={isDirOpen ? { rotate: 45, y: 7.5 } : { rotate: 0, y: 0 }} className="h-0.5 w-6 bg-white" />
              <motion.div animate={isDirOpen ? { opacity: 0 } : { opacity: 1 }} className="h-0.5 w-6 bg-white" />
              <motion.div animate={isDirOpen ? { rotate: -45, y: -7.5 } : { rotate: 0, y: 0 }} className="h-0.5 w-6 bg-white" />
            </button>

            <Link href="/" aria-label="UNDRAFTED – home"
              className="text-2xl font-black tracking-tighter text-white select-none">
              UNDRAFTED
            </Link>
          </div>

          {/* Center: primary nav (desktop) */}
          <nav className="hidden items-center gap-10 lg:flex">
            <Link href="/watch"
              className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-white/60 hover:text-white transition-all">
              <PlayCircle size={16} className="text-red-500" /> Watch
            </Link>
            <Link href="/feed"
              className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-white/60 hover:text-white transition-all">
              <Activity size={16} className="text-green-500" /> Fan Pulse
            </Link>
            <Link href="/premium"
              className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-white/60 hover:text-white transition-all">
              <Star size={16} className="text-yellow-500" /> Premium
            </Link>
          </nav>

          {/* Right: utility + auth */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search (⌘K)"
              className="p-2 text-white/60 hover:text-white transition-colors"
            >
              <Search size={20} />
            </button>

            <div className="relative hidden lg:block">
              <button aria-label="Notifications" className="p-2 text-white/60 hover:text-white transition-colors">
                <Bell size={20} />
              </button>
              <span aria-hidden className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-600 ring-2 ring-black" />
            </div>

            <PointsCounter />
            <ThemeToggle />

            {/* Auth */}
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
                  <motion.div animate={{ rotate: userMenuOpen ? 180 : 0 }} transition={{ duration: 0.2 }}
                    className="text-white/60">
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
              <div className="flex items-center gap-3 border-l border-white/10 pl-4 ml-1">
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

        {/* ── 2. Mega-drop directory ────────────────────── */}
        <AnimatePresence>
          {isDirOpen && (
            <>
              {/* Backdrop — starts below the taskbar */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setIsDirOpen(false)}
                className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-sm top-16"
              />

              {/* Horizontal dropdown panel */}
              <motion.div
                initial={{ y: "-100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-100%" }}
                transition={{ type: "tween", duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className="absolute left-0 top-16 z-[90] w-full h-[50vh] bg-black border-b border-white/10 shadow-2xl overflow-hidden"
              >
                <div className="container mx-auto grid grid-cols-4 gap-12 p-12 h-full">

                  {/* Column 1: Quick Links */}
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-red-600 mb-6">Quick Links</h3>
                    <div className="flex flex-col gap-4 text-2xl font-black text-white">
                      <Link href="/watch" onClick={() => setIsDirOpen(false)}>Watch</Link>
                      <Link href="/feed" onClick={() => setIsDirOpen(false)}>Fan Pulse</Link>
                      <Link href="/scores" onClick={() => setIsDirOpen(false)}>Live Scores</Link>
                      <Link href="/pipeline" onClick={() => setIsDirOpen(false)}
                        className="flex items-center gap-2">
                        Pipeline <ClipboardList size={20} />
                      </Link>
                      <Link href="/premium" onClick={() => setIsDirOpen(false)}
                        className="flex items-center gap-2">
                        Premium <Star size={20} className="text-yellow-500" />
                      </Link>
                    </div>
                  </div>

                  {/* Columns 2 & 3: Leagues grid */}
                  <div className="col-span-2">
                    <h3 className="text-xs font-black uppercase tracking-widest text-red-600 mb-6">Leagues</h3>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                      {LEAGUES.map((l) => (
                        <Link key={l.name} href={l.href} onClick={() => setIsDirOpen(false)}
                          className="text-lg font-bold text-white/70 hover:text-white flex items-center gap-3 transition-colors">
                          <span className="text-2xl">{l.icon}</span> {l.name}
                        </Link>
                      ))}
                      {/* Additional leagues from data */}
                      {leagues
                        .filter((l) => !LEAGUES.some((s) => s.href === `/league/${l.slug}`))
                        .slice(0, 2)
                        .map((l) => (
                          <Link key={l.id} href={`/league/${l.slug}`} onClick={() => setIsDirOpen(false)}
                            className="text-lg font-bold text-white/70 hover:text-white flex items-center gap-3 transition-colors">
                            <span className="text-2xl">{l.logo}</span> {l.name}
                          </Link>
                        ))}
                    </div>
                  </div>

                  {/* Column 4: Trending / branding */}
                  <div className="border-l border-white/5 pl-12 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-widest text-white/30 mb-2">
                        Currently Trending
                      </h3>
                      <p className="text-sm text-white/60 leading-relaxed italic">
                        "The 2026 NFL Mock Draft is live. Check the Pipeline tab for updates."
                      </p>
                    </div>
                    <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">
                      © 2026 UNDRAFTED MEDIA
                    </p>
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
