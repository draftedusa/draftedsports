"use client";

import { useState, useMemo } from "react";
import { prospects, nbaMockDraft, nflMockDraft } from "@/data/prospects";
import type { ProspectLeague } from "@/data/prospects";
import ProspectCard from "@/components/editorial/ProspectCard";
import MockDraftTable from "@/components/editorial/MockDraftTable";

// ─────────────────────────────────────────────────────────
// Blueprint palette
// ─────────────────────────────────────────────────────────
const BP       = "#38bdf8";
const BP_DIM   = "rgba(56,189,248,0.10)";
const BP_BORDER = "rgba(56,189,248,0.20)";

// ─────────────────────────────────────────────────────────
// Section heading
// ─────────────────────────────────────────────────────────
function BlueprintHeading({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="h-px flex-1" style={{ background: `linear-gradient(to right, ${BP_BORDER}, transparent)` }} />
      <span
        className="text-[10px] font-black uppercase tracking-[0.2em] font-mono px-3 py-1 rounded"
        style={{ color: BP, background: BP_DIM, border: `1px solid ${BP_BORDER}` }}
      >
        {label}
      </span>
      <div className="h-px flex-1" style={{ background: `linear-gradient(to left, ${BP_BORDER}, transparent)` }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// League tab button
// ─────────────────────────────────────────────────────────
function LeagueTab({
  id,
  label,
  icon,
  active,
  onClick,
}: {
  id: ProspectLeague;
  label: string;
  icon: string;
  active: boolean;
  onClick: (id: ProspectLeague) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onClick(id)}
      className="flex items-center gap-2 px-4 py-2.5 text-xs font-black uppercase tracking-widest transition-all rounded-t-xl"
      style={
        active
          ? {
              color: BP,
              background: BP_DIM,
              borderBottom: `2px solid ${BP}`,
            }
          : {
              color: "var(--surface-muted)",
              borderBottom: "2px solid transparent",
            }
      }
    >
      <span>{icon}</span>
      {label}
    </button>
  );
}

// ─────────────────────────────────────────────────────────
// Toggle switch
// ─────────────────────────────────────────────────────────
function RankingToggle({
  value,
  onChange,
}: {
  value: "expert" | "fan";
  onChange: (v: "expert" | "fan") => void;
}) {
  return (
    <div
      className="flex rounded-xl overflow-hidden border"
      style={{ borderColor: BP_BORDER }}
    >
      {(["expert", "fan"] as const).map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className="px-4 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all"
          style={
            value === v
              ? { background: BP, color: "#0c1a2e" }
              : { background: "transparent", color: BP }
          }
        >
          {v === "expert" ? "Expert Board" : "Fan Board"}
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────
export default function PipelinePage() {
  const [activeLeague, setActiveLeague] = useState<ProspectLeague>("nba");
  const [rankMode, setRankMode] = useState<"expert" | "fan">("expert");

  // prospect lookup map (for MockDraftTable)
  const prospectMap = useMemo(
    () => Object.fromEntries(prospects.map((p) => [p.id, p])),
    []
  );

  // Filtered + sorted prospects for Big Board
  const boardProspects = useMemo(() => {
    return prospects
      .filter((p) => p.league === activeLeague)
      .sort((a, b) =>
        rankMode === "expert"
          ? a.expertRank - b.expertRank
          : a.fanRank - b.fanRank
      );
  }, [activeLeague, rankMode]);

  // Mock draft for active league
  const mockDraft = activeLeague === "nba" ? nbaMockDraft : nflMockDraft;
  const draftLabel = activeLeague === "nba" ? "2026 NBA Mock Draft" : "2026 NFL Mock Draft";

  return (
    <div className="space-y-10">

      {/* ══════════════════════════════════════════════
          HERO — Blueprint grid header
          ══════════════════════════════════════════════ */}
      <div
        className="relative rounded-2xl overflow-hidden px-6 py-10 -mx-0"
        style={{
          background: "#0c1a2e",
          border: `1.5px solid ${BP_BORDER}`,
          backgroundImage: [
            "linear-gradient(#0c1a2e, #0c1a2e)",
            `repeating-linear-gradient(0deg, rgba(56,189,248,0.06) 0px, rgba(56,189,248,0.06) 1px, transparent 1px, transparent 32px)`,
            `repeating-linear-gradient(90deg, rgba(56,189,248,0.06) 0px, rgba(56,189,248,0.06) 1px, transparent 1px, transparent 32px)`,
          ].join(", "),
        }}
      >
        {/* Corner brackets (decorative) */}
        <div className="absolute top-3 left-3 w-5 h-5" style={{ borderLeft: `1.5px solid ${BP}`, borderTop: `1.5px solid ${BP}` }} />
        <div className="absolute top-3 right-3 w-5 h-5" style={{ borderRight: `1.5px solid ${BP}`, borderTop: `1.5px solid ${BP}` }} />
        <div className="absolute bottom-3 left-3 w-5 h-5" style={{ borderLeft: `1.5px solid ${BP}`, borderBottom: `1.5px solid ${BP}` }} />
        <div className="absolute bottom-3 right-3 w-5 h-5" style={{ borderRight: `1.5px solid ${BP}`, borderBottom: `1.5px solid ${BP}` }} />

        <div className="relative text-center space-y-3">
          <span
            className="text-[9px] font-black font-mono uppercase tracking-[0.35em] block"
            style={{ color: BP }}
          >
            UNDRAFTED ╱ EVALUATION SYSTEM
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter leading-none text-white">
            THE <span style={{ color: BP }}>PIPELINE</span>
          </h1>
          <p className="text-sm text-slate-400 font-mono max-w-lg mx-auto">
            NBA &amp; NFL draft prospects — scouting reports, stock movement,
            and mock draft projections.
          </p>
          <div className="flex items-center justify-center gap-4 pt-2">
            <div className="text-center">
              <p className="font-mono text-xl font-black text-white">{prospects.filter(p => p.league === "nba").length}</p>
              <p className="text-[9px] font-mono uppercase tracking-widest" style={{ color: BP }}>NBA Prospects</p>
            </div>
            <div className="w-px h-8" style={{ background: BP_BORDER }} />
            <div className="text-center">
              <p className="font-mono text-xl font-black text-white">{prospects.filter(p => p.league === "nfl").length}</p>
              <p className="text-[9px] font-mono uppercase tracking-widest" style={{ color: BP }}>NFL Prospects</p>
            </div>
            <div className="w-px h-8" style={{ background: BP_BORDER }} />
            <div className="text-center">
              <p className="font-mono text-xl font-black text-white">2026</p>
              <p className="text-[9px] font-mono uppercase tracking-widest" style={{ color: BP }}>Draft Class</p>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          LEAGUE TABS
          ══════════════════════════════════════════════ */}
      <div
        className="flex items-end gap-0 border-b -mb-6"
        style={{ borderColor: BP_BORDER }}
      >
        <LeagueTab id="nba" label="NBA" icon="🏀" active={activeLeague === "nba"} onClick={setActiveLeague} />
        <LeagueTab id="nfl" label="NFL" icon="🏈" active={activeLeague === "nfl"} onClick={setActiveLeague} />
      </div>

      {/* ══════════════════════════════════════════════
          BIG BOARD
          ══════════════════════════════════════════════ */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <BlueprintHeading label={`${activeLeague.toUpperCase()} Big Board · ${boardProspects.length} Prospects`} />
        </div>

        {/* Ranking toggle */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-[10px] font-mono text-surface-muted">
            {rankMode === "expert"
              ? "Sorted by consensus media / analyst rankings"
              : "Sorted by UNDRAFTED fan community votes"}
          </p>
          <RankingToggle value={rankMode} onChange={setRankMode} />
        </div>

        {/* Prospect card grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {boardProspects.map((p, i) => (
            <ProspectCard
              key={p.id}
              prospect={p}
              rank={rankMode === "expert" ? p.expertRank : p.fanRank}
            />
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          MOCK DRAFT TABLE
          ══════════════════════════════════════════════ */}
      <section>
        <BlueprintHeading label={draftLabel} />
        <MockDraftTable
          picks={mockDraft}
          prospectMap={prospectMap}
          title={draftLabel}
        />
      </section>

      {/* ══════════════════════════════════════════════
          DISCLAIMER
          ══════════════════════════════════════════════ */}
      <div
        className="rounded-xl px-5 py-4 font-mono text-[9px] text-surface-muted"
        style={{ border: `1px solid ${BP_BORDER}`, background: BP_DIM }}
      >
        <span style={{ color: BP }}>DISCLAIMER</span> — All player evaluations, rankings, and mock drafts on this page are mock/illustrative data for demonstration purposes only. UNDRAFTED has no affiliation with the NBA, NFL, or any team. Prospect information may be outdated or inaccurate.
      </div>

    </div>
  );
}
