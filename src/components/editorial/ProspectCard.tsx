"use client";

import type { Prospect } from "@/data/prospects";

// ─────────────────────────────────────────────────────────
// Blueprint palette (constant — not a CSS var)
// ─────────────────────────────────────────────────────────
const BP  = "#38bdf8";   // sky-400
const BP2 = "#0ea5e9";   // sky-500
const BP_DIM = "rgba(56,189,248,0.12)";
const BP_BORDER = "rgba(56,189,248,0.25)";

// ─────────────────────────────────────────────────────────
// Star rating row
// ─────────────────────────────────────────────────────────
function StarRating({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${value} out of ${max} stars`}>
      {Array.from({ length: max }, (_, i) => {
        const fill = Math.min(1, Math.max(0, value - i));
        return (
          <span key={i} className="relative inline-block text-[11px] leading-none">
            {/* Track star */}
            <span style={{ color: "rgba(56,189,248,0.2)" }}>★</span>
            {/* Filled overlay */}
            {fill > 0 && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fill * 100}%`, color: BP }}
              >
                ★
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Stock indicator
// ─────────────────────────────────────────────────────────
function StockBadge({ direction, delta }: { direction: Prospect["stockDirection"]; delta: number }) {
  if (direction === "stable") {
    return (
      <span className="text-[9px] font-mono text-surface-muted px-1.5 py-0.5 rounded border"
        style={{ borderColor: "rgba(107,114,128,0.3)", background: "rgba(107,114,128,0.08)" }}>
        ─ STABLE
      </span>
    );
  }
  const up = direction === "rising";
  return (
    <span
      className="flex items-center gap-0.5 text-[9px] font-black px-1.5 py-0.5 rounded"
      style={{
        color: up ? "#4ade80" : "#f87171",
        background: up ? "rgba(74,222,128,0.12)" : "rgba(248,113,113,0.12)",
        border: `1px solid ${up ? "rgba(74,222,128,0.25)" : "rgba(248,113,113,0.25)"}`,
      }}
    >
      {up ? "▲" : "▼"} {Math.abs(delta)}
    </span>
  );
}

// ─────────────────────────────────────────────────────────
// Range badge
// ─────────────────────────────────────────────────────────
function RangeBadge({ range }: { range: Prospect["projectedRange"] }) {
  const intensity = range === "Top 5" ? 1 : range === "Lottery" ? 0.7 : 0.4;
  return (
    <span
      className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
      style={{
        color: BP,
        background: `rgba(56,189,248,${intensity * 0.15})`,
        border: `1px solid rgba(56,189,248,${intensity * 0.35})`,
      }}
    >
      {range}
    </span>
  );
}

// ─────────────────────────────────────────────────────────
// ProspectCard
// ─────────────────────────────────────────────────────────
interface ProspectCardProps {
  prospect: Prospect;
  rank: number;
  /** Highlight as selected for compare */
  selected?: boolean;
  onSelect?: (id: string) => void;
  className?: string;
}

export default function ProspectCard({
  prospect: p,
  rank,
  selected = false,
  onSelect,
  className = "",
}: ProspectCardProps) {
  return (
    <div
      className={`relative flex flex-col rounded-xl overflow-hidden transition-all ${className}`}
      style={{
        background: selected
          ? `linear-gradient(160deg, ${BP_DIM}, rgba(56,189,248,0.06))`
          : "var(--surface-200)",
        border: `1.5px solid ${selected ? BP : BP_BORDER}`,
        boxShadow: selected ? `0 0 18px rgba(56,189,248,0.18)` : "none",
        // Blueprint grid lines as subtle texture
        backgroundImage: [
          selected
            ? `linear-gradient(160deg, ${BP_DIM}, rgba(56,189,248,0.06))`
            : "linear-gradient(var(--surface-200), var(--surface-200))",
          `repeating-linear-gradient(0deg, rgba(56,189,248,0.04) 0px, rgba(56,189,248,0.04) 1px, transparent 1px, transparent 20px)`,
          `repeating-linear-gradient(90deg, rgba(56,189,248,0.04) 0px, rgba(56,189,248,0.04) 1px, transparent 1px, transparent 20px)`,
        ].join(", "),
      }}
    >
      {/* ── Header: rank + stock ────────────────────── */}
      <div
        className="flex items-center justify-between px-3 py-2 border-b"
        style={{ borderColor: BP_BORDER }}
      >
        <span
          className="font-mono text-[11px] font-black"
          style={{ color: BP }}
        >
          #{String(rank).padStart(2, "0")}
        </span>
        <StockBadge direction={p.stockDirection} delta={p.stockDelta} />
      </div>

      {/* ── Avatar + identity ───────────────────────── */}
      <div className="flex flex-col items-center pt-4 pb-3 px-3 gap-1.5">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center text-3xl"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${BP_DIM}, rgba(56,189,248,0.04))`,
            border: `1px solid ${BP_BORDER}`,
          }}
        >
          {p.avatar}
        </div>

        <div className="text-center">
          <p className="text-sm font-black text-surface-text tracking-tight leading-tight">
            {p.name}
          </p>
          <p className="text-[10px] text-surface-muted mt-0.5">
            {p.position} · {p.school}
          </p>
        </div>

        <RangeBadge range={p.projectedRange} />
      </div>

      {/* ── Measurements ────────────────────────────── */}
      <div
        className="flex justify-around py-2 border-y mx-3"
        style={{ borderColor: BP_BORDER }}
      >
        <div className="text-center">
          <p className="font-mono text-[11px] font-bold text-surface-text">{p.height}</p>
          <p className="text-[8px] uppercase tracking-widest text-surface-muted">HT</p>
        </div>
        <div
          className="w-px self-stretch"
          style={{ background: BP_BORDER }}
        />
        <div className="text-center">
          <p className="font-mono text-[11px] font-bold text-surface-text">{p.weight}</p>
          <p className="text-[8px] uppercase tracking-widest text-surface-muted">WT</p>
        </div>
        <div
          className="w-px self-stretch"
          style={{ background: BP_BORDER }}
        />
        <div className="text-center">
          <p className="font-mono text-[11px] font-bold text-surface-text">{p.age}</p>
          <p className="text-[8px] uppercase tracking-widest text-surface-muted">AGE</p>
        </div>
      </div>

      {/* ── Ratings ─────────────────────────────────── */}
      <div className="px-3 py-3 space-y-2">
        <div className="flex items-center justify-between">
          <span
            className="text-[8px] font-black uppercase tracking-widest"
            style={{ color: BP }}
          >
            Potential
          </span>
          <StarRating value={p.potentialStars} />
        </div>
        <div className="flex items-center justify-between">
          <span
            className="text-[8px] font-black uppercase tracking-widest"
            style={{ color: BP }}
          >
            Readiness
          </span>
          <StarRating value={p.readinessStars} />
        </div>
      </div>

      {/* ── Scouting note ───────────────────────────── */}
      <div
        className="mx-3 mb-3 px-2.5 py-2 rounded-lg text-[9px] text-surface-muted leading-snug italic line-clamp-3"
        style={{ background: BP_DIM, borderLeft: `2px solid ${BP2}` }}
      >
        {p.scoutingNote}
      </div>

      {/* ── Compare button ──────────────────────────── */}
      {onSelect && (
        <button
          type="button"
          onClick={() => onSelect(p.id)}
          className="mx-3 mb-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
          style={
            selected
              ? { background: BP, color: "#0c1a2e" }
              : {
                  background: BP_DIM,
                  color: BP,
                  border: `1px solid ${BP_BORDER}`,
                }
          }
        >
          {selected ? "✓ Selected" : "Compare"}
        </button>
      )}
    </div>
  );
}
