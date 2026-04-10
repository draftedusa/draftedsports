"use client";

import Link from "next/link";
import { games } from "@/data/games";
import { teams } from "@/data/teams";
import { transactions } from "@/data/transactions";

// ─────────────────────────────────────────────────────────
// Ticker item builder
// ─────────────────────────────────────────────────────────
type TickerItem = { key: string; label: string; href: string; live: boolean };

function buildItems(): TickerItem[] {
  const teamMap = Object.fromEntries(teams.map((t) => [t.id, t]));
  const out: TickerItem[] = [];

  // ── Live games (top priority) ─────────────────────────
  for (const g of games.filter((g) => g.status === "live")) {
    const home = teamMap[g.homeTeamId];
    const away = teamMap[g.awayTeamId];
    if (!home || !away) continue;
    const homeName = home.name.split(" ").at(-1)!;
    const awayName = away.name.split(" ").at(-1)!;
    out.push({
      key: g.id,
      label: `${away.logo} ${awayName} ${g.awayScore}–${g.homeScore} ${homeName} ${home.logo}  ${g.quarter} ${g.timeRemaining}`,
      href: `/game/${g.id}`,
      live: true,
    });
  }

  // ── Final games ───────────────────────────────────────
  for (const g of games.filter((g) => g.status === "final").slice(0, 5)) {
    const home = teamMap[g.homeTeamId];
    const away = teamMap[g.awayTeamId];
    if (!home || !away) continue;
    out.push({
      key: `f-${g.id}`,
      label: `FINAL  ${away.logo} ${away.name.split(" ").at(-1)} ${g.awayScore}–${g.homeScore} ${home.name.split(" ").at(-1)} ${home.logo}`,
      href: `/game/${g.id}`,
      live: false,
    });
  }

  // ── Breaking transactions ─────────────────────────────
  for (const tx of transactions.filter((t) => t.isBreaking).slice(0, 4)) {
    out.push({
      key: tx.id,
      label: `⚡ ${tx.headline}`,
      href: "/scores",
      live: false,
    });
  }

  // ── Upcoming games ────────────────────────────────────
  for (const g of games.filter((g) => g.status === "upcoming").slice(0, 4)) {
    const home = teamMap[g.homeTeamId];
    const away = teamMap[g.awayTeamId];
    if (!home || !away) continue;
    out.push({
      key: `u-${g.id}`,
      label: `${away.logo} ${away.name.split(" ").at(-1)} vs ${home.name.split(" ").at(-1)} ${home.logo}  ${g.date}`,
      href: `/game/${g.id}`,
      live: false,
    });
  }

  return out;
}

// ─────────────────────────────────────────────────────────
// Separator dot between items
// ─────────────────────────────────────────────────────────
const DOT = (
  <span
    className="mx-5 w-1 h-1 rounded-full bg-surface-muted/40 shrink-0 self-center"
    aria-hidden
  />
);

// ─────────────────────────────────────────────────────────
// LiveTicker
// ─────────────────────────────────────────────────────────
export default function LiveTicker() {
  const items = buildItems();
  if (items.length === 0) return null;

  // Interleave separator dots
  const strip = items.flatMap((item, i) => [
    <Link
      key={item.key}
      href={item.href}
      className="flex items-center gap-1.5 shrink-0 group"
    >
      {item.live && (
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
      )}
      <span className="text-[11px] font-medium text-surface-text group-hover:text-brand transition-colors whitespace-nowrap">
        {item.label}
      </span>
    </Link>,
    i < items.length - 1 ? <span key={`dot-${i}`} className="mx-5 w-1 h-1 rounded-full bg-surface-muted/40 shrink-0 self-center" aria-hidden /> : null,
  ]);

  return (
    <div className="w-full bg-surface-200 border-b border-surface-300 h-8 flex items-center overflow-hidden select-none">
      {/* Sticky "SCORES" badge */}
      <div className="shrink-0 flex items-center gap-2 px-3 h-full bg-brand z-10">
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-widest text-white">
          Scores
        </span>
      </div>

      {/* Scrolling strip — duplicated for seamless loop */}
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center animate-ticker animate-ticker:hover">
          <div className="flex items-center gap-0 px-4">
            {strip}
            {/* Duplicate for seamless loop */}
            {DOT}
            {strip}
          </div>
        </div>
      </div>
    </div>
  );
}
