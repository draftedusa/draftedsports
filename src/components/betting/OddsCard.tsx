"use client";

import { useState, useCallback } from "react";
import type { Game, Team } from "@/types";
import type { BettingLine } from "@/data/betting";
import { useBetSlip } from "./BetSlipContext";

// ─────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────
function formatOdds(n: number): string {
  return n > 0 ? `+${n}` : `${n}`;
}

/** Returns the direction and magnitude a line moved */
function lineMovement(open: number, current: number): { dir: "up" | "down" | "none"; delta: string } {
  const diff = current - open;
  if (Math.abs(diff) < 0.1) return { dir: "none", delta: "" };
  return {
    dir: diff > 0 ? "up" : "down",
    delta: `${diff > 0 ? "+" : ""}${diff.toFixed(1)}`,
  };
}

// ─────────────────────────────────────────────────────────
// Market tab type
// ─────────────────────────────────────────────────────────
type Market = "spread" | "total" | "moneyline";

// ─────────────────────────────────────────────────────────
// Sub-component: add-to-slip button
// ─────────────────────────────────────────────────────────
function AddButton({
  id,
  label,
  odds,
  oddsNum,
  gameId,
  gameLabel,
  market,
}: {
  id: string;
  label: string;
  odds: string;
  oddsNum: number;
  gameId: string;
  gameLabel: string;
  market: Market;
}) {
  const { addBet, removeBet, hasBet } = useBetSlip();
  const active = hasBet(id);

  function toggle() {
    if (active) {
      removeBet(id);
    } else {
      addBet({ id, gameId, gameLabel, market, pick: label, odds, oddsNum });
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all text-center min-w-[72px] ${
        active
          ? "bg-brand text-white shadow-[0_0_12px_rgba(139,92,246,0.4)]"
          : "bg-surface-200 hover:bg-surface-300 text-surface-text"
      }`}
    >
      <span className={`text-[10px] font-semibold truncate max-w-full ${active ? "text-white/80" : "text-surface-muted"}`}>
        {label}
      </span>
      <span className={`text-sm font-black tabular-nums leading-tight ${active ? "text-white" : oddsNum > 0 ? "text-green-500" : "text-surface-text"}`}>
        {odds}
      </span>
    </button>
  );
}

// ─────────────────────────────────────────────────────────
// Movement badge
// ─────────────────────────────────────────────────────────
function MoveBadge({ open, current, label }: { open: number; current: number; label: string }) {
  const { dir, delta } = lineMovement(open, current);
  if (dir === "none") {
    return (
      <span className="text-[9px] text-surface-muted">
        opened {label}{open > 0 ? `+${open}` : open}
      </span>
    );
  }
  return (
    <span className={`flex items-center gap-0.5 text-[9px] font-bold ${dir === "up" ? "text-red-400" : "text-green-400"}`}>
      {dir === "up" ? "▲" : "▼"} {delta} from {open > 0 ? `+${open}` : open}
    </span>
  );
}

// ─────────────────────────────────────────────────────────
// OddsCard
// ─────────────────────────────────────────────────────────
interface OddsCardProps {
  game: Game;
  homeTeam: Team;
  awayTeam: Team;
  line: BettingLine;
  /** When true, hides the market tab switcher and shows all markets stacked */
  expanded?: boolean;
  className?: string;
}

export default function OddsCard({
  game,
  homeTeam,
  awayTeam,
  line,
  expanded = false,
  className = "",
}: OddsCardProps) {
  const [market, setMarket] = useState<Market>("spread");

  const gameLabel = `${awayTeam.name.split(" ").at(-1)} @ ${homeTeam.name.split(" ").at(-1)}`;

  const spreadMovement = lineMovement(line.spreadOpen, line.spreadCurrent);
  const totalMovement = lineMovement(line.totalOpen, line.totalCurrent);

  const TABS: { id: Market; label: string }[] = [
    { id: "spread", label: "Spread" },
    { id: "total", label: "Total" },
    { id: "moneyline", label: "ML" },
  ];

  // ── Status chip ────────────────────────────────────────
  const statusChip =
    game.status === "live" ? (
      <span className="flex items-center gap-1 text-[9px] font-black uppercase text-red-500">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
        {game.quarter} {game.timeRemaining}
      </span>
    ) : game.status === "final" ? (
      <span className="text-[9px] font-bold text-surface-muted uppercase">Final</span>
    ) : (
      <span className="text-[9px] text-surface-muted">{game.date}</span>
    );

  // ── Market content ────────────────────────────────────
  const renderMarket = useCallback(
    (m: Market) => {
      switch (m) {
        case "spread":
          return (
            <div className="space-y-2">
              <div className="flex gap-2">
                <AddButton
                  id={`${game.id}-spread-away`}
                  label={`${awayTeam.name.split(" ").at(-1)} +${Math.abs(line.spreadCurrent)}`}
                  odds={line.spreadJuice}
                  oddsNum={parseInt(line.spreadJuice, 10)}
                  gameId={game.id}
                  gameLabel={gameLabel}
                  market="spread"
                />
                <AddButton
                  id={`${game.id}-spread-home`}
                  label={`${line.spreadFavorite} ${line.spreadCurrent}`}
                  odds={line.spreadJuice}
                  oddsNum={parseInt(line.spreadJuice, 10)}
                  gameId={game.id}
                  gameLabel={gameLabel}
                  market="spread"
                />
              </div>
              <MoveBadge open={line.spreadOpen} current={line.spreadCurrent} label="spread " />
            </div>
          );
        case "total":
          return (
            <div className="space-y-2">
              <div className="flex gap-2">
                <AddButton
                  id={`${game.id}-total-over`}
                  label={`Over ${line.totalCurrent}`}
                  odds={line.totalJuiceOver}
                  oddsNum={parseInt(line.totalJuiceOver, 10)}
                  gameId={game.id}
                  gameLabel={gameLabel}
                  market="total"
                />
                <AddButton
                  id={`${game.id}-total-under`}
                  label={`Under ${line.totalCurrent}`}
                  odds={line.totalJuiceUnder}
                  oddsNum={parseInt(line.totalJuiceUnder, 10)}
                  gameId={game.id}
                  gameLabel={gameLabel}
                  market="total"
                />
              </div>
              <MoveBadge open={line.totalOpen} current={line.totalCurrent} label="total " />
            </div>
          );
        case "moneyline":
          return (
            <div className="flex gap-2">
              <AddButton
                id={`${game.id}-ml-away`}
                label={`${awayTeam.name.split(" ").at(-1)} ML`}
                odds={formatOdds(line.moneylineAway)}
                oddsNum={line.moneylineAway}
                gameId={game.id}
                gameLabel={gameLabel}
                market="moneyline"
              />
              <AddButton
                id={`${game.id}-ml-home`}
                label={`${homeTeam.name.split(" ").at(-1)} ML`}
                odds={formatOdds(line.moneylineHome)}
                oddsNum={line.moneylineHome}
                gameId={game.id}
                gameLabel={gameLabel}
                market="moneyline"
              />
            </div>
          );
      }
    },
    [game.id, awayTeam, homeTeam, line, gameLabel]
  );

  return (
    <div
      className={`bg-surface-200 border border-surface-300 dark:border-white/5 rounded-xl overflow-hidden ${className}`}
    >
      {/* ── Game header ──────────────────────────────── */}
      <div className="px-4 py-3 border-b border-surface-300 dark:border-white/5">
        <div className="flex items-center justify-between mb-2">
          {statusChip}
          <span className="text-[9px] text-surface-muted">{line.provider}</span>
        </div>

        {/* Teams */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-lg shrink-0">{awayTeam.logo}</span>
            <div className="min-w-0">
              <p className="text-xs font-bold text-surface-text truncate">
                {awayTeam.name.split(" ").at(-1)}
              </p>
              {game.status !== "upcoming" && (
                <p className="text-lg font-black text-surface-text leading-none tabular-nums">
                  {game.awayScore}
                </p>
              )}
            </div>
          </div>

          <span className="text-[10px] font-black text-surface-muted shrink-0">@</span>

          <div className="flex items-center gap-1.5 min-w-0 justify-end">
            <div className="min-w-0 text-right">
              <p className="text-xs font-bold text-surface-text truncate">
                {homeTeam.name.split(" ").at(-1)}
              </p>
              {game.status !== "upcoming" && (
                <p className="text-lg font-black text-surface-text leading-none tabular-nums">
                  {game.homeScore}
                </p>
              )}
            </div>
            <span className="text-lg shrink-0">{homeTeam.logo}</span>
          </div>
        </div>
      </div>

      {/* ── Market tabs ──────────────────────────────── */}
      {!expanded && (
        <div className="flex border-b border-surface-300 dark:border-white/5">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setMarket(t.id)}
              className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest transition-colors ${
                market === t.id
                  ? "text-brand border-b-2 border-brand -mb-px"
                  : "text-surface-muted hover:text-surface-text"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {/* ── Market content ───────────────────────────── */}
      <div className="px-4 py-3">
        {expanded ? (
          <div className="space-y-4">
            {(["spread", "total", "moneyline"] as Market[]).map((m) => (
              <div key={m}>
                <p className="text-[9px] font-black uppercase tracking-widest text-surface-muted mb-1.5">
                  {m === "total" ? "Over / Under" : m}
                </p>
                {renderMarket(m)}
              </div>
            ))}
          </div>
        ) : (
          renderMarket(market)
        )}
      </div>
    </div>
  );
}
