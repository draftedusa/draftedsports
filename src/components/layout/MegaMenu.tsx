"use client";

import { useRef } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { League, Team } from "@/types";
import { conferences } from "@/data/conferences";
import { divisions } from "@/data/divisions";
import { nflTeams } from "@/data/teams/nfl";
import { nbaTeams } from "@/data/teams/nba";
import { collegeTeams } from "@/data/teams/college";
import { teams as legacyTeams } from "@/data/teams";
import { leagues } from "@/data/leagues";

// ─────────────────────────────────────────────────────────
// Team registry — fully typed arrays for expanded leagues;
// flat legacy fallback for everything else.
// ─────────────────────────────────────────────────────────
const TEAM_REGISTRY: Record<string, Team[]> = {
  nfl: nflTeams,
  nba: nbaTeams,
  college: collegeTeams,
};

function teamsFor(leagueId: string): Team[] {
  return (
    TEAM_REGISTRY[leagueId] ??
    legacyTeams.filter((t) => t.leagueId === leagueId)
  );
}

// ─────────────────────────────────────────────────────────
// Sub-page links — "Standings" label swapped per league
// ─────────────────────────────────────────────────────────
function subPages(league: League) {
  return [
    { label: "Home",                                 suffix: "" },
    { label: "News",                                 suffix: "/news" },
    { label: "Scores",                               suffix: "/scores" },
    { label: "Schedule",                             suffix: "/schedule" },
    { label: league.standingsLabel ?? "Standings",   suffix: "/standings" },
    { label: "Stats",                                suffix: "/stats" },
    { label: "Teams",                                suffix: "/teams" },
    { label: "Players",                              suffix: "/players" },
  ];
}

// ─────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────
function menuWidth(league: League, numConfs: number): number {
  if (league.id === "college") return 820;
  if (numConfs >= 2 && league.hasDivisions) return 720;
  if (numConfs >= 2) return 560;
  return 460;
}

function colsClass(n: number): string {
  if (n >= 4) return "grid-cols-4";
  if (n === 3) return "grid-cols-3";
  if (n === 2) return "grid-cols-2";
  return "grid-cols-1";
}

// Lighten a hex color for CSS background — returns rgba string
function colorAccent(hex: string, alpha = 0.08): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// ─────────────────────────────────────────────────────────
// TeamRow — inline hover accent from primaryColor
// ─────────────────────────────────────────────────────────
function TeamRow({
  team,
  onClose,
}: {
  team: Team;
  onClose: () => void;
}) {
  const accentBg = team.primaryColor ? colorAccent(team.primaryColor) : undefined;
  const accentText = team.primaryColor ?? undefined;

  return (
    <li>
      <Link
        href={`/team/${team.slug}`}
        onClick={onClose}
        className="group flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors"
        style={{ ["--accent-bg" as string]: accentBg, ["--accent-text" as string]: accentText }}
      >
        {/* Custom hover via inline style on the wrapping span */}
        <span
          className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: accentBg }}
          aria-hidden
        />
        <span className="relative text-base leading-none shrink-0">{team.logo}</span>
        <span className="relative text-[11px] font-medium text-surface-text group-hover:font-semibold transition-all truncate"
          style={{ "--tw-text-opacity": "1" } as React.CSSProperties}
        >
          {team.name}
        </span>
      </Link>
    </li>
  );
}

// ─────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────
interface MegaMenuProps {
  leagueId: string | null;
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

// ─────────────────────────────────────────────────────────
// MegaMenu
// ─────────────────────────────────────────────────────────
export default function MegaMenu({
  leagueId,
  onClose,
  onMouseEnter,
  onMouseLeave,
}: MegaMenuProps) {
  const league = leagueId ? leagues.find((l) => l.id === leagueId) ?? null : null;

  return (
    <AnimatePresence>
      {league && (
        <MegaMenuPanel
          key={league.id}
          league={league}
          onClose={onClose}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        />
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────
// Inner panel — separated so AnimatePresence can unmount it
// ─────────────────────────────────────────────────────────
function MegaMenuPanel({
  league,
  onClose,
  onMouseEnter,
  onMouseLeave,
}: {
  league: League;
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const allTeams    = teamsFor(league.id);
  const leagueConfs = conferences.filter((c) => c.leagueId === league.id);

  // Build conf → division → teams tree
  const tree = leagueConfs.map((conf) => {
    const confDivisions = divisions
      .filter((d) => d.conferenceId === conf.id)
      .map((div) => ({
        div,
        teams: allTeams.filter((t) => t.divisionId === div.id),
      }))
      .filter((d) => d.teams.length > 0);

    const flatTeams = allTeams.filter(
      (t) => t.conferenceId === conf.id && !t.divisionId
    );

    return {
      conf,
      confDivisions,
      flatTeams,
      hasDivisions: confDivisions.length > 0,
    };
  });

  const hasTree  = tree.some((g) => g.confDivisions.length > 0 || g.flatTeams.length > 0);
  const numConfs = tree.length;
  const width    = menuWidth(league, numConfs);
  const pages    = subPages(league);

  return (
    <motion.div
      initial={{ opacity: 0, y: -6, scaleY: 0.97 }}
      animate={{ opacity: 1, y: 0, scaleY: 1 }}
      exit={{ opacity: 0, y: -4, scaleY: 0.98 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      style={{ width, originY: 0 }}
      className="absolute top-full left-0 right-0 mx-auto bg-surface-100 border border-surface-300 rounded-2xl shadow-2xl overflow-hidden z-50"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* ── Sub-page nav ──────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-x-0.5 gap-y-0.5 px-4 py-2.5 bg-surface-200 border-b border-surface-300">
        <span className="text-xl mr-2 shrink-0">{league.logo}</span>
        <span className="text-sm font-black text-surface-text mr-3 shrink-0 tracking-tight">
          {league.name}
        </span>
        <div className="flex flex-wrap gap-0.5">
          {pages.map(({ label, suffix }) => (
            <Link
              key={suffix}
              href={`/league/${league.slug}${suffix}`}
              onClick={onClose}
              className="px-2.5 py-1 rounded-md text-[10px] font-semibold text-surface-muted hover:text-brand hover:bg-surface-300 transition-colors whitespace-nowrap"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Pipeline quick-link ───────────────────────── */}
      <div className="flex items-center gap-2 px-4 py-2 bg-brand/5 border-b border-surface-300">
        <span className="text-xs">📋</span>
        <Link
          href="/pipeline"
          onClick={onClose}
          className="text-[10px] font-black text-brand hover:text-brand/80 uppercase tracking-widest transition-colors"
        >
          The Pipeline — Draft Prospects &amp; Mock Boards →
        </Link>
      </div>

      {/* ── Team grid ─────────────────────────────────── */}
      <div className="p-4 max-h-[72vh] overflow-y-auto">
        {hasTree ? (
          /* Division / Conference layout */
          <div className={`grid gap-6 ${colsClass(numConfs)}`}>
            {tree.map(({ conf, confDivisions, flatTeams, hasDivisions }) => (
              <div key={conf.id}>
                {/* Conference label */}
                <p className="text-[9px] font-black uppercase tracking-widest text-brand mb-3 pb-1.5 border-b border-surface-300">
                  {conf.shortName}
                </p>

                {hasDivisions ? (
                  /* Division groups */
                  <div className="space-y-4">
                    {confDivisions.map(({ div, teams }) => (
                      <div key={div.id}>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-surface-muted mb-1.5">
                          {div.shortName}
                        </p>
                        <ul className="space-y-px relative">
                          {teams.map((team) => (
                            <TeamRow key={team.id} team={team} onClose={onClose} />
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Flat conference list */
                  <ul className="space-y-px relative">
                    {flatTeams.map((team) => (
                      <TeamRow key={team.id} team={team} onClose={onClose} />
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ) : allTeams.length > 0 ? (
          /* No conference data — plain grid */
          <div className="grid grid-cols-3 gap-1">
            {allTeams.slice(0, 18).map((team) => (
              <Link
                key={team.id}
                href={`/team/${team.slug}`}
                onClick={onClose}
                className="group relative flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors overflow-hidden"
              >
                <span
                  className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: team.primaryColor ? colorAccent(team.primaryColor) : undefined }}
                  aria-hidden
                />
                <span className="relative text-sm leading-none">{team.logo}</span>
                <span className="relative text-[11px] font-medium text-surface-text group-hover:font-semibold truncate">
                  {team.name}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-xs text-surface-muted text-center py-6">
            Teams expanding soon.
          </p>
        )}
      </div>
    </motion.div>
  );
}
