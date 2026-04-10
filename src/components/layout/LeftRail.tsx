"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { leagues } from "@/data/leagues";

const BASE_QUICK_LINKS = [
  { href: "/league/nba",  label: "NBA",           icon: "🏀" },
  { href: "/league/nfl",  label: "NFL",           icon: "🏈" },
  { href: "/league/mlb",  label: "MLB",           icon: "⚾" },
  { href: "/league/nhl",  label: "NHL",           icon: "🏒" },
  { href: "/pipeline",    label: "Pipeline",      icon: "📋" },
  { href: "/pipeline",    label: "Mock Draft",    icon: "🎯" },
];

const LEAGUE_TOOLS: Record<string, { label: string; icon: string; href: string }[]> = {
  nfl: [
    { label: "Mock Draft Board",  icon: "📋", href: "/pipeline" },
    { label: "Free Agency",       icon: "✍️", href: "/transactions" },
    { label: "Injury Report",     icon: "🩹", href: "/transactions" },
    { label: "Power Rankings",    icon: "🏆", href: "/standings" },
    { label: "Schedule",          icon: "📅", href: "/scores" },
    { label: "Stats Leaders",     icon: "📊", href: "/league/nfl" },
  ],
  nba: [
    { label: "Trade Tracker",     icon: "🔄", href: "/transactions" },
    { label: "Draft Prospects",   icon: "📋", href: "/pipeline" },
    { label: "Pipeline Board",    icon: "🎯", href: "/pipeline" },
    { label: "Injury Report",     icon: "🩹", href: "/transactions" },
    { label: "Schedule",          icon: "📅", href: "/scores" },
    { label: "Stats Leaders",     icon: "📊", href: "/league/nba" },
  ],
  mlb: [
    { label: "Transactions",      icon: "🔄", href: "/transactions" },
    { label: "Standings",         icon: "🏆", href: "/standings" },
    { label: "Schedule",          icon: "📅", href: "/scores" },
    { label: "Injury Report",     icon: "🩹", href: "/transactions" },
    { label: "Stats Leaders",     icon: "📊", href: "/league/mlb" },
  ],
  nhl: [
    { label: "Trade Deadline",    icon: "🔄", href: "/transactions" },
    { label: "Standings",         icon: "🏆", href: "/standings" },
    { label: "Schedule",          icon: "📅", href: "/scores" },
    { label: "Injury Report",     icon: "🩹", href: "/transactions" },
    { label: "Stats Leaders",     icon: "📊", href: "/league/nhl" },
  ],
};

const SOCIAL_LINKS = [
  {
    href: "https://youtube.com", label: "YouTube",
    color: "hover:text-red-500 hover:border-red-500/40",
    icon: (<svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>),
  },
  {
    href: "https://instagram.com", label: "Instagram",
    color: "hover:text-pink-500 hover:border-pink-500/40",
    icon: (<svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>),
  },
  {
    href: "https://x.com", label: "X",
    color: "hover:text-surface-text hover:border-surface-300",
    icon: (<svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>),
  },
  {
    href: "https://facebook.com", label: "Facebook",
    color: "hover:text-blue-500 hover:border-blue-500/40",
    icon: (<svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>),
  },
];

export default function LeftRail() {
  const pathname = usePathname();

  // Detect active league context
  const leagueMatch = pathname.match(/^\/league\/([^/]+)/);
  const activeLeagueSlug = leagueMatch ? leagueMatch[1] : null;
  const activeLeague = activeLeagueSlug ? leagues.find((l) => l.slug === activeLeagueSlug) : null;
  const leagueTools = activeLeagueSlug ? LEAGUE_TOOLS[activeLeagueSlug] : null;

  return (
    <aside className="hidden lg:flex flex-col w-56 shrink-0 py-6 sticky top-[96px] self-start h-[calc(100vh-96px)] overflow-y-auto no-scrollbar">

      {/* League-specific tools (contextual) */}
      {activeLeague && leagueTools ? (
        <div className="mb-6">
          <div className="flex items-center gap-2 px-3 mb-2">
            <span className="text-base">{activeLeague.logo}</span>
            <p className="text-[10px] font-bold uppercase tracking-widest text-surface-muted">
              {activeLeague.name} Tools
            </p>
          </div>
          <div className="space-y-0.5">
            {leagueTools.map(({ label, icon, href }) => (
              <Link
                key={label}
                href={href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-surface-muted hover:text-surface-text hover:bg-surface-200 transition-colors"
              >
                <span className="w-6 h-6 rounded-full bg-surface-200 flex items-center justify-center text-xs">{icon}</span>
                <span className="truncate">{label}</span>
              </Link>
            ))}
          </div>
          <div className="border-t border-surface-300 my-4" />
        </div>
      ) : null}

      {/* Default: QUICK LINKS */}
      <div className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-surface-muted px-3 mb-2">Quick Links</p>
        <div className="space-y-0.5">
          {BASE_QUICK_LINKS.map(({ href, label, icon }) => {
            const active = pathname === href && !label.includes("G League") && !label.includes("Draft");
            return (
              <Link
                key={label}
                href={href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors group ${
                  active ? "bg-brand/10 text-brand" : "text-surface-muted hover:text-surface-text hover:bg-surface-200"
                }`}
              >
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm bg-surface-200 group-hover:ring-2 ring-brand transition-all ${active ? "ring-2 ring-brand" : ""}`}>
                  {icon}
                </span>
                <span className="truncate">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* FOLLOW UNDRAFTED */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-surface-muted px-3 mb-2">Follow Undrafted</p>
        <div className="space-y-0.5 px-1">
          {SOCIAL_LINKS.map(({ href, label, icon, color }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-surface-muted border border-transparent transition-all ${color}`}
            >
              {icon}
              <span>{label}</span>
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}
