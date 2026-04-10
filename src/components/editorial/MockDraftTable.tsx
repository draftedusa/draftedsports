"use client";

import { useState, useCallback } from "react";
import type { MockDraftPick, Prospect } from "@/data/prospects";

// ─────────────────────────────────────────────────────────
// Blueprint palette
// ─────────────────────────────────────────────────────────
const BP       = "#38bdf8";
const BP_DIM   = "rgba(56,189,248,0.10)";
const BP_BORDER = "rgba(56,189,248,0.20)";

// ─────────────────────────────────────────────────────────
// Star row (compact)
// ─────────────────────────────────────────────────────────
function Stars({ value }: { value: number }) {
  return (
    <span className="inline-flex gap-px text-[10px] leading-none">
      {Array.from({ length: 5 }, (_, i) => {
        const fill = Math.min(1, Math.max(0, value - i));
        return (
          <span key={i} className="relative inline-block">
            <span style={{ color: "rgba(56,189,248,0.2)" }}>★</span>
            {fill > 0 && (
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%`, color: BP }}>★</span>
            )}
          </span>
        );
      })}
    </span>
  );
}

// ─────────────────────────────────────────────────────────
// Stock chip (inline)
// ─────────────────────────────────────────────────────────
function StockChip({ dir, delta }: { dir: Prospect["stockDirection"]; delta: number }) {
  if (dir === "stable") return <span className="text-[9px] font-mono text-surface-muted">─</span>;
  const up = dir === "rising";
  return (
    <span className="font-mono text-[9px] font-black" style={{ color: up ? "#4ade80" : "#f87171" }}>
      {up ? "▲" : "▼"}{Math.abs(delta)}
    </span>
  );
}

// ─────────────────────────────────────────────────────────
// Compare modal — full side-by-side
// ─────────────────────────────────────────────────────────
function CompareModal({
  prospects,
  onClose,
}: {
  prospects: [Prospect, Prospect];
  onClose: () => void;
}) {
  const [a, b] = prospects;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} aria-hidden />

      {/* Panel */}
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
        style={{
          background: "#0c1a2e",
          border: `1.5px solid ${BP_BORDER}`,
          backgroundImage: [
            "linear-gradient(#0c1a2e, #0c1a2e)",
            "repeating-linear-gradient(0deg, rgba(56,189,248,0.04) 0px, rgba(56,189,248,0.04) 1px, transparent 1px, transparent 24px)",
            "repeating-linear-gradient(90deg, rgba(56,189,248,0.04) 0px, rgba(56,189,248,0.04) 1px, transparent 1px, transparent 24px)",
          ].join(", "),
        }}
      >
        {/* Header */}
        <div
          className="sticky top-0 flex items-center justify-between px-5 py-3.5 border-b z-10"
          style={{ borderColor: BP_BORDER, background: "rgba(12,26,46,0.95)" }}
        >
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: BP }}>
              Scout Compare
            </span>
            <span className="text-[9px] text-surface-muted font-mono">
              {a.name} vs {b.name}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-surface-muted hover:text-white transition-colors"
            style={{ background: BP_DIM }}
            aria-label="Close comparison"
          >
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
              <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 0 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z" />
            </svg>
          </button>
        </div>

        {/* Comparison grid */}
        <div className="grid grid-cols-[1fr_40px_1fr] gap-0">
          {/* Prospect A header */}
          <ProspectCompareHeader prospect={a} />
          {/* Divider header */}
          <div className="flex items-center justify-center border-l border-r" style={{ borderColor: BP_BORDER }}>
            <span className="text-[9px] font-black" style={{ color: BP }}>vs</span>
          </div>
          {/* Prospect B header */}
          <ProspectCompareHeader prospect={b} />

          {/* Rows */}
          {COMPARE_ROWS.map((row, i) => {
            const aVal = row.value(a);
            const bVal = row.value(b);
            const aWins = row.compare ? row.compare(a, b) > 0 : false;
            const bWins = row.compare ? row.compare(a, b) < 0 : false;
            return (
              <>
                <CompareCell key={`a-${i}`} label={i === 0 ? row.label : undefined} wins={aWins} index={i}>
                  {aVal}
                </CompareCell>
                <div
                  key={`mid-${i}`}
                  className="flex items-center justify-center border-l border-r py-2.5"
                  style={{ borderColor: BP_BORDER, background: i % 2 === 0 ? "rgba(56,189,248,0.03)" : "transparent" }}
                >
                  <span className="text-[8px] font-mono text-surface-muted uppercase tracking-widest text-center px-1 leading-tight">
                    {row.label}
                  </span>
                </div>
                <CompareCell key={`b-${i}`} wins={bWins} index={i} flipAlign>
                  {bVal}
                </CompareCell>
              </>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ProspectCompareHeader({ prospect: p }: { prospect: Prospect }) {
  return (
    <div
      className="flex flex-col items-center gap-1.5 px-4 py-4 border-b"
      style={{ borderColor: BP_BORDER }}
    >
      <span className="text-3xl">{p.avatar}</span>
      <p className="text-sm font-black text-white text-center leading-tight">{p.name}</p>
      <p className="text-[10px] text-surface-muted">{p.position} · {p.school}</p>
    </div>
  );
}

function CompareCell({
  children,
  wins,
  index,
  flipAlign = false,
}: {
  children: React.ReactNode;
  wins: boolean;
  index: number;
  label?: string;
  flipAlign?: boolean;
}) {
  return (
    <div
      className={`flex items-center px-4 py-2.5 ${flipAlign ? "justify-end" : "justify-start"}`}
      style={{
        background: wins
          ? `rgba(56,189,248,0.08)`
          : index % 2 === 0
          ? "rgba(56,189,248,0.02)"
          : "transparent",
        borderLeft: wins && !flipAlign ? `2px solid ${BP}` : undefined,
        borderRight: wins && flipAlign ? `2px solid ${BP}` : undefined,
      }}
    >
      {children}
    </div>
  );
}

interface CompareRow {
  label: string;
  value: (p: Prospect) => React.ReactNode;
  compare?: (a: Prospect, b: Prospect) => number;
}

const COMPARE_ROWS: CompareRow[] = [
  {
    label: "Expert Rank",
    value: (p) => <span className="font-mono text-sm font-black" style={{ color: BP }}>#{p.expertRank}</span>,
    compare: (a, b) => b.expertRank - a.expertRank, // lower = better
  },
  {
    label: "Height",
    value: (p) => <span className="font-mono text-xs font-bold text-white">{p.height}</span>,
  },
  {
    label: "Weight",
    value: (p) => <span className="font-mono text-xs font-bold text-white">{p.weight}</span>,
  },
  {
    label: "Age",
    value: (p) => <span className="font-mono text-xs text-white">{p.age} yrs</span>,
    compare: (a, b) => b.age - a.age, // younger = better (more upside)
  },
  {
    label: "Potential",
    value: (p) => <Stars value={p.potentialStars} />,
    compare: (a, b) => a.potentialStars - b.potentialStars,
  },
  {
    label: "Readiness",
    value: (p) => <Stars value={p.readinessStars} />,
    compare: (a, b) => a.readinessStars - b.readinessStars,
  },
  {
    label: "Stock",
    value: (p) => (
      <div className="flex items-center gap-1">
        <StockChip dir={p.stockDirection} delta={p.stockDelta} />
        <span className="text-[9px] text-surface-muted capitalize">{p.stockDirection}</span>
      </div>
    ),
  },
  {
    label: "Projection",
    value: (p) => (
      <span
        className="text-[9px] font-black uppercase tracking-wide px-1.5 py-0.5 rounded"
        style={{ color: BP, background: BP_DIM }}
      >
        {p.projectedRange}
      </span>
    ),
  },
  {
    label: "Strengths",
    value: (p) => (
      <ul className="space-y-0.5">
        {p.strengths.map((s) => (
          <li key={s} className="flex items-center gap-1 text-[9px] text-surface-muted">
            <span style={{ color: "#4ade80" }}>+</span> {s}
          </li>
        ))}
      </ul>
    ),
  },
  {
    label: "Weaknesses",
    value: (p) => (
      <ul className="space-y-0.5">
        {p.weaknesses.map((w) => (
          <li key={w} className="flex items-center gap-1 text-[9px] text-surface-muted">
            <span style={{ color: "#f87171" }}>−</span> {w}
          </li>
        ))}
      </ul>
    ),
  },
  {
    label: "Scout Note",
    value: (p) => (
      <p
        className="text-[9px] leading-snug italic"
        style={{ color: "rgba(148,163,184,0.8)" }}
      >
        {p.scoutingNote}
      </p>
    ),
  },
];

// ─────────────────────────────────────────────────────────
// MockDraftTable
// ─────────────────────────────────────────────────────────
interface MockDraftTableProps {
  picks: MockDraftPick[];
  prospectMap: Record<string, Prospect>;
  title?: string;
}

export default function MockDraftTable({
  picks,
  prospectMap,
  title = "Mock Draft Board",
}: MockDraftTableProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [comparing, setComparing] = useState(false);

  const toggleSelect = useCallback((id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return [prev[1], id]; // replace oldest
      return [...prev, id];
    });
  }, []);

  const canCompare = selected.length === 2;

  const compareProspects =
    canCompare
      ? ([prospectMap[selected[0]], prospectMap[selected[1]]] as [Prospect, Prospect])
      : null;

  return (
    <>
      {comparing && compareProspects && (
        <CompareModal prospects={compareProspects} onClose={() => setComparing(false)} />
      )}

      <div
        className="rounded-xl overflow-hidden border"
        style={{
          borderColor: BP_BORDER,
          background: "var(--surface-200)",
          backgroundImage: [
            "linear-gradient(var(--surface-200), var(--surface-200))",
            "repeating-linear-gradient(0deg, rgba(56,189,248,0.04) 0px, rgba(56,189,248,0.04) 1px, transparent 1px, transparent 28px)",
            "repeating-linear-gradient(90deg, rgba(56,189,248,0.04) 0px, rgba(56,189,248,0.04) 1px, transparent 1px, transparent 28px)",
          ].join(", "),
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3 border-b"
          style={{ borderColor: BP_BORDER }}
        >
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: BP }}>
              {title}
            </span>
            <span className="text-[9px] font-mono text-surface-muted">{picks.length} picks</span>
          </div>

          {/* Compare CTA */}
          <div className="flex items-center gap-2">
            {selected.length > 0 && (
              <span className="text-[9px] text-surface-muted font-mono">
                {selected.length}/2 selected
              </span>
            )}
            <button
              type="button"
              onClick={() => canCompare && setComparing(true)}
              disabled={!canCompare}
              className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all disabled:opacity-30"
              style={
                canCompare
                  ? { background: BP, color: "#0c1a2e" }
                  : { background: BP_DIM, color: BP, border: `1px solid ${BP_BORDER}` }
              }
            >
              Compare
            </button>
          </div>
        </div>

        {/* Column headers */}
        <div
          className="grid grid-cols-[32px_32px_1fr_80px_80px_60px] items-center px-3 py-1.5 border-b"
          style={{ borderColor: BP_BORDER }}
        >
          {["#", "⬡", "Prospect", "Potential", "Ready", "Stock"].map((h) => (
            <span key={h} className="text-[8px] font-black uppercase tracking-widest" style={{ color: BP }}>
              {h}
            </span>
          ))}
        </div>

        {/* Rows */}
        <div className="divide-y" style={{ borderColor: BP_BORDER }}>
          {picks.map((pick, i) => {
            const p = prospectMap[pick.prospectId];
            if (!p) return null;
            const isSelected = selected.includes(p.id);

            return (
              <div
                key={pick.pick}
                className="grid grid-cols-[32px_32px_1fr_80px_80px_60px] items-center px-3 py-2.5 transition-colors group cursor-pointer"
                style={{
                  background: isSelected
                    ? BP_DIM
                    : i % 2 === 0
                    ? "transparent"
                    : "rgba(56,189,248,0.02)",
                  borderLeft: isSelected ? `2px solid ${BP}` : "2px solid transparent",
                }}
                onClick={() => toggleSelect(p.id)}
              >
                {/* Pick # */}
                <span className="font-mono text-[11px] font-black" style={{ color: BP }}>
                  {pick.pick}
                </span>

                {/* Team logo */}
                <span className="text-lg leading-none">{pick.teamLogo}</span>

                {/* Prospect info */}
                <div className="min-w-0 pr-2">
                  <p className="text-xs font-bold text-surface-text truncate group-hover:text-white transition-colors">
                    {p.name}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className="text-[8px] font-black px-1 rounded font-mono"
                      style={{ background: BP_DIM, color: BP }}
                    >
                      {p.position}
                    </span>
                    <span className="text-[8px] text-surface-muted truncate">
                      {pick.teamName}
                    </span>
                  </div>
                  {pick.needNote && (
                    <p className="text-[8px] text-surface-muted mt-0.5 truncate italic hidden sm:block">
                      {pick.needNote}
                    </p>
                  )}
                </div>

                {/* Potential stars */}
                <Stars value={p.potentialStars} />

                {/* Readiness stars */}
                <Stars value={p.readinessStars} />

                {/* Stock */}
                <div className="flex items-center gap-1">
                  <StockChip dir={p.stockDirection} delta={p.stockDelta} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <div className="px-4 py-2.5 border-t" style={{ borderColor: BP_BORDER }}>
          <p className="text-[8px] font-mono text-surface-muted">
            Mock data only. Click any two rows to compare. No affiliation with any league or team.
          </p>
        </div>
      </div>
    </>
  );
}
