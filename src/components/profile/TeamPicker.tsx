"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import type { Team } from "@/types";
import { leagues } from "@/data/leagues";
import { nflTeams } from "@/data/teams/nfl";
import { nbaTeams } from "@/data/teams/nba";
import { collegeTeams } from "@/data/teams/college";
import { teams as legacyTeams } from "@/data/teams";

// ─────────────────────────────────────────────────────────
// Build the full picker team list (expanded + legacy extras)
// ─────────────────────────────────────────────────────────
const expandedIds = new Set([...nflTeams, ...nbaTeams, ...collegeTeams].map((t) => t.id));
const legacyExtras = legacyTeams.filter((t) => !expandedIds.has(t.id));
const ALL_PICKER_TEAMS: Team[] = [...nflTeams, ...nbaTeams, ...collegeTeams, ...legacyExtras];

// ─────────────────────────────────────────────────────────
// Team tile — glow ring when selected
// ─────────────────────────────────────────────────────────
function TeamTile({
  team,
  selected,
  onToggle,
}: {
  team: Team;
  selected: boolean;
  onToggle: (id: string) => void;
}) {
  const color = team.primaryColor ?? "#8b5cf6";

  return (
    <button
      type="button"
      onClick={() => onToggle(team.id)}
      aria-pressed={selected}
      className="relative flex flex-col items-center gap-1.5 p-2.5 rounded-xl text-center transition-all"
      style={
        selected
          ? {
              background: `linear-gradient(135deg, ${color}28, ${color}0e)`,
              border: `1.5px solid ${color}`,
              boxShadow: `0 0 0 1px ${color}60, 0 0 14px ${color}28`,
            }
          : {
              background: "var(--surface-200)",
              border: "1px solid var(--surface-300)",
            }
      }
    >
      {/* Gloss overlay */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          background:
            "linear-gradient(160deg, rgba(255,255,255,0.08) 0%, transparent 55%)",
        }}
        aria-hidden
      />

      <span className="relative text-2xl leading-none">{team.logo}</span>
      <span
        className="relative text-[9px] font-bold text-surface-text leading-tight line-clamp-2 max-w-full"
        style={{ color: selected ? color : undefined }}
      >
        {team.name.split(" ").slice(-1)[0]}
      </span>

      {selected && (
        <span
          className="absolute top-1 right-1 w-3 h-3 rounded-full flex items-center justify-center"
          style={{ background: color }}
          aria-hidden
        >
          <svg viewBox="0 0 8 8" fill="white" className="w-2 h-2">
            <path d="M1 4l2 2 4-4" stroke="white" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      )}
    </button>
  );
}

// ─────────────────────────────────────────────────────────
// TeamPicker modal
// ─────────────────────────────────────────────────────────
interface TeamPickerProps {
  currentFavorites: string[];
  onSave: (ids: string[]) => void;
  onClose: () => void;
}

export default function TeamPicker({
  currentFavorites,
  onSave,
  onClose,
}: TeamPickerProps) {
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(currentFavorites)
  );
  const [query, setQuery] = useState("");

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const toggle = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const handleSave = useCallback(() => {
    onSave(Array.from(selected));
    onClose();
  }, [selected, onSave, onClose]);

  // Build league → teams map (filtered by query)
  const leagueGroups = useMemo(() => {
    const q = query.toLowerCase().trim();
    return leagues
      .map((league) => {
        const leagueTeams = ALL_PICKER_TEAMS.filter(
          (t) =>
            t.leagueId === league.id &&
            (!q || t.name.toLowerCase().includes(q))
        );
        return { league, teams: leagueTeams };
      })
      .filter((g) => g.teams.length > 0);
  }, [query]);

  const totalCount = ALL_PICKER_TEAMS.length;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Modal */}
      <div className="relative w-full sm:max-w-2xl max-h-[92vh] sm:max-h-[85vh] bg-surface-100 sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col">
        {/* ── Header ──────────────────────────────── */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-surface-300 shrink-0">
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-black text-surface-text">Pick Your Teams</h2>
            <p className="text-[10px] text-surface-muted mt-0.5">
              {selected.size} selected · {totalCount} available
            </p>
          </div>

          {/* Search */}
          <div className="relative">
            <input
              type="search"
              placeholder="Search teams…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-36 sm:w-48 bg-surface-200 border border-surface-300 rounded-lg px-3 py-1.5 text-xs text-surface-text placeholder:text-surface-muted/60 outline-none focus:border-brand transition-colors"
              aria-label="Search teams"
            />
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-surface-muted hover:text-surface-text hover:bg-surface-200 transition-colors shrink-0"
            aria-label="Close"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>

        {/* ── Scrollable team grid ─────────────────── */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
          {leagueGroups.length === 0 ? (
            <div className="text-center py-10 text-sm text-surface-muted">
              No teams match &ldquo;{query}&rdquo;
            </div>
          ) : (
            leagueGroups.map(({ league, teams: leagueTeams }) => (
              <section key={league.id}>
                {/* League header */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-base">{league.logo}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-surface-muted">
                    {league.name}
                  </span>
                  <span className="text-[9px] text-surface-muted ml-1">
                    ({leagueTeams.filter((t) => selected.has(t.id)).length}/{leagueTeams.length})
                  </span>
                </div>

                {/* Team grid */}
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {leagueTeams.map((team) => (
                    <TeamTile
                      key={team.id}
                      team={team}
                      selected={selected.has(team.id)}
                      onToggle={toggle}
                    />
                  ))}
                </div>
              </section>
            ))
          )}
        </div>

        {/* ── Footer ──────────────────────────────── */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-surface-300 shrink-0">
          <button
            type="button"
            onClick={() => setSelected(new Set())}
            className="text-xs text-surface-muted hover:text-surface-text transition-colors"
          >
            Clear all
          </button>

          <div className="flex items-center gap-3">
            <span className="text-xs text-surface-muted hidden sm:inline">
              {selected.size} team{selected.size !== 1 ? "s" : ""} selected
            </span>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 bg-brand hover:bg-brand/90 text-white text-xs font-black rounded-full transition-colors"
            >
              Save My Teams
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
