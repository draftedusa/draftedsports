"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { Game } from "@/types";

// ─────────────────────────────────────────────────────────
// Hype derivation
// ─────────────────────────────────────────────────────────
function deriveHype(game: Game): number {
  if (game.status === "final")    return 0;
  if (game.status === "upcoming") return 32; // pre-game anticipation

  const scoreDiff = Math.abs(game.homeScore - game.awayScore);

  // Base: close game = high hype
  let hype = Math.max(0, 100 - scoreDiff * 3.5);

  // Quarter / period bonus
  const q = game.quarter?.toLowerCase() ?? "";
  if (q === "4th" || q.startsWith("ot")) hype += 25;
  else if (q === "3rd")                  hype += 10;
  else if (q === "2nd")                  hype += 4;

  // Time-remaining bonus (4th quarter under 5 min)
  if (q === "4th" && game.timeRemaining) {
    const mins = parseInt(game.timeRemaining.split(":")[0], 10);
    if (mins < 2) hype += 18;
    else if (mins < 5) hype += 8;
  }

  return Math.min(100, Math.max(0, Math.round(hype)));
}

// ─────────────────────────────────────────────────────────
// Color along gradient green → amber → red
// ─────────────────────────────────────────────────────────
function hypeColor(pct: number): string {
  if (pct >= 80) return "#ef4444";
  if (pct >= 55) return "#f59e0b";
  return "#22c55e";
}

function hypeLabel(pct: number): string {
  if (pct >= 90) return "🔥 ELECTRIC";
  if (pct >= 75) return "⚡ High";
  if (pct >= 50) return "📈 Rising";
  if (pct >= 25) return "😐 Mild";
  return "💤 Low";
}

// ─────────────────────────────────────────────────────────
// HypeMeter
// ─────────────────────────────────────────────────────────
interface HypeMeterProps {
  game: Game;
  /** Compact mode: shorter bar, inline layout */
  compact?: boolean;
  className?: string;
}

export default function HypeMeter({
  game,
  compact = false,
  className = "",
}: HypeMeterProps) {
  const hype  = useMemo(() => deriveHype(game), [game]);
  const color = hypeColor(hype);
  const label = hypeLabel(hype);
  const isElectric = hype > 90;

  const barH = compact ? "h-16" : "h-28";

  return (
    <motion.div
      className={`flex items-center gap-3 ${className}`}
      // Shake when electric
      animate={isElectric ? { x: [0, -3, 3, -2, 2, -1, 1, 0] } : { x: 0 }}
      transition={
        isElectric
          ? { repeat: Infinity, repeatDelay: 1.2, duration: 0.35 }
          : {}
      }
    >
      {/* Vertical bar */}
      <div
        className={`relative w-2.5 ${barH} rounded-full overflow-hidden shrink-0`}
        style={{ background: "var(--surface-300)" }}
        role="meter"
        aria-valuenow={hype}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Game hype: ${hype}%`}
      >
        {/* Fill — origin bottom */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 rounded-full"
          style={{
            background: `linear-gradient(to top, #22c55e 0%, #f59e0b 55%, #ef4444 100%)`,
          }}
          initial={{ height: "0%" }}
          animate={{ height: `${hype}%` }}
          transition={{ type: "spring", mass: 0.5, stiffness: 120, damping: 22 }}
        />

        {/* Pulse dot at tip when high */}
        {isElectric && (
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
            style={{
              background: color,
              bottom: `calc(${hype}% - 4px)`,
              boxShadow: `0 0 8px ${color}`,
            }}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ repeat: Infinity, duration: 0.7 }}
          />
        )}
      </div>

      {/* Label + value */}
      <div className="min-w-0">
        <p
          className="text-[9px] font-black uppercase tracking-widest"
          style={{ color }}
        >
          {label}
        </p>
        <p className="text-[10px] font-black text-surface-text tabular-nums">
          {hype}
          <span className="text-[8px] font-normal text-surface-muted">%</span>
        </p>
        <p className="text-[8px] text-surface-muted mt-0.5 uppercase tracking-wide">
          Hype Index
        </p>
      </div>
    </motion.div>
  );
}
