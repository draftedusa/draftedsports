"use client";

import type { BettingLine } from "@/data/betting";

// ─────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────
const SIGNAL_CONFIG: Record<
  BettingLine["edgeSignal"],
  { label: string; color: string; icon: string }
> = {
  sharp_home:  { label: "Sharp", color: "#8b5cf6", icon: "⚡" },
  sharp_away:  { label: "Sharp", color: "#8b5cf6", icon: "⚡" },
  sharp_over:  { label: "Sharp Over",  color: "#06b6d4", icon: "📈" },
  sharp_under: { label: "Sharp Under", color: "#06b6d4", icon: "📉" },
  square:      { label: "Square",      color: "#f59e0b", icon: "👥" },
  split:       { label: "Split",       color: "#6b7280", icon: "⚖️" },
};

const RATING_DOTS = [1, 2, 3] as const;

// ─────────────────────────────────────────────────────────
// Consensus bar row
// ─────────────────────────────────────────────────────────
function ConsensusBar({
  label,
  leftLabel,
  leftPct,
  rightLabel,
  accentLeft,
}: {
  label: string;
  leftLabel: string;
  leftPct: number;
  rightLabel: string;
  accentLeft?: boolean;
}) {
  const rightPct = 100 - leftPct;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[9px] text-surface-muted font-semibold uppercase tracking-wide">
        <span>{leftLabel}</span>
        <span className="text-[10px] font-black text-surface-muted">{label}</span>
        <span>{rightLabel}</span>
      </div>
      {/* Bar */}
      <div className="relative flex h-2 rounded-full overflow-hidden bg-surface-300 dark:bg-white/5">
        {/* Left segment */}
        <div
          className="h-full rounded-l-full transition-all duration-700"
          style={{
            width: `${leftPct}%`,
            background: accentLeft
              ? "linear-gradient(90deg, #8b5cf6, #a78bfa)"
              : "rgba(139,92,246,0.25)",
          }}
        />
      </div>
      {/* Pct labels */}
      <div className="flex justify-between text-[9px] tabular-nums">
        <span className={accentLeft ? "text-brand font-black" : "text-surface-muted"}>
          {leftPct}%
        </span>
        <span className={!accentLeft ? "text-brand font-black" : "text-surface-muted"}>
          {rightPct}%
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// EdgeModule
// ─────────────────────────────────────────────────────────
interface EdgeModuleProps {
  line: BettingLine;
  className?: string;
}

export default function EdgeModule({ line, className = "" }: EdgeModuleProps) {
  const sig = SIGNAL_CONFIG[line.edgeSignal];
  const sharpVsPublicDiverge =
    Math.abs(line.sharpSpreadHomePct - line.publicSpreadHomePct) >= 20;

  // Determine which side sharps favor for spread
  const sharpOnHome = line.sharpSpreadHomePct >= 50;
  const sharpOnOver  = line.sharpOverPct >= 50;

  return (
    <div
      className={`rounded-xl border border-surface-300 dark:border-white/5 overflow-hidden ${className}`}
      style={{ background: "var(--surface-200)" }}
    >
      {/* ── Header ──────────────────────────────────── */}
      <div className="px-4 py-3 border-b border-surface-300 dark:border-white/5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest text-surface-muted">
            Undrafted Edge
          </span>
          {/* Rating dots */}
          <div className="flex items-center gap-1">
            {RATING_DOTS.map((d) => (
              <span
                key={d}
                className="w-2 h-2 rounded-full transition-colors"
                style={{
                  background:
                    d <= line.edgeRating ? sig.color : "var(--surface-300)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Signal badge */}
        <div className="mt-2 flex items-center gap-2">
          <span
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black"
            style={{
              background: `${sig.color}20`,
              color: sig.color,
              border: `1px solid ${sig.color}40`,
            }}
          >
            {sig.icon} {sig.label}
          </span>
          <span className="text-xs font-semibold text-surface-text">
            {line.edgeLabel}
          </span>
        </div>
      </div>

      {/* ── Consensus bars ───────────────────────────── */}
      <div className="px-4 py-4 space-y-4">
        {/* Spread consensus */}
        <div className="space-y-3">
          <p className="text-[9px] font-black uppercase tracking-widest text-surface-muted">
            Spread Consensus
          </p>

          <ConsensusBar
            label="Public Tickets"
            leftLabel="Home"
            leftPct={line.publicSpreadHomePct}
            rightLabel="Away"
            accentLeft={line.publicSpreadHomePct >= 50}
          />
          <ConsensusBar
            label="Sharp Money"
            leftLabel="Home"
            leftPct={line.sharpSpreadHomePct}
            rightLabel="Away"
            accentLeft={sharpOnHome}
          />

          {/* Divergence callout */}
          {sharpVsPublicDiverge && (
            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-brand/10 border border-brand/20">
              <span className="text-sm shrink-0">⚠️</span>
              <p className="text-[10px] text-brand font-semibold leading-tight">
                Sharps and public diverge by{" "}
                {Math.abs(line.sharpSpreadHomePct - line.publicSpreadHomePct)}%.{" "}
                Consider fading the public.
              </p>
            </div>
          )}
        </div>

        {/* Total consensus */}
        <div className="space-y-3">
          <p className="text-[9px] font-black uppercase tracking-widest text-surface-muted">
            Total Consensus
          </p>

          <ConsensusBar
            label="Public Tickets"
            leftLabel="Over"
            leftPct={line.publicOverPct}
            rightLabel="Under"
            accentLeft={line.publicOverPct >= 50}
          />
          <ConsensusBar
            label="Sharp Money"
            leftLabel="Over"
            leftPct={line.sharpOverPct}
            rightLabel="Under"
            accentLeft={sharpOnOver}
          />
        </div>
      </div>

      {/* ── Footer disclaimer ──────────────────────── */}
      <div className="px-4 py-2.5 border-t border-surface-300 dark:border-white/5">
        <p className="text-[9px] text-surface-muted text-center">
          Mock data only · Not financial advice · 21+ Gamble responsibly
        </p>
      </div>
    </div>
  );
}
