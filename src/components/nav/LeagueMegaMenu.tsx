"use client";

import Link from "next/link";
import type { League, Team } from "@/types";
import { conferences } from "@/data/conferences";
import { divisions } from "@/data/divisions";
import { nflTeams } from "@/data/teams/nfl";
import { nbaTeams } from "@/data/teams/nba";
import { collegeTeams } from "@/data/teams/college";
import { teams as legacyTeams } from "@/data/teams";

// ── Team registry ──────────────────────────────────────
// Use the fully-typed division/conference-aware arrays for
// NFL, NBA, College. Fall back to the flat legacy array for
// any league not yet expanded (MLB, NHL, MLS, WNBA).
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

// ── Sub-page nav ───────────────────────────────────────
function buildSubPages(league: League) {
  return [
    { label: "Home",                                href: `/league/${league.slug}` },
    { label: "News",                                href: `/league/${league.slug}/news` },
    { label: "Scores",                              href: `/league/${league.slug}/scores` },
    { label: "Schedule",                            href: `/league/${league.slug}/schedule` },
    { label: league.standingsLabel ?? "Standings",  href: `/league/${league.slug}/standings` },
    { label: "Stats",                               href: `/league/${league.slug}/stats` },
    { label: "Teams",                               href: `/league/${league.slug}/teams` },
    { label: "Players",                             href: `/league/${league.slug}/players` },
  ];
}

// ── Types ──────────────────────────────────────────────
interface Props {
  league: League;
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

// ── Helpers ────────────────────────────────────────────
function gridClass(n: number) {
  if (n >= 4) return "grid-cols-4";
  if (n === 3) return "grid-cols-3";
  if (n === 2) return "grid-cols-2";
  return "grid-cols-1";
}

function menuWidth(league: League, numConfs: number): number {
  if (league.id === "college") return 780;
  if (numConfs >= 2 && league.hasDivisions) return 700;
  if (numConfs >= 2) return 560;
  return 460;
}

// ── Component ──────────────────────────────────────────
export default function LeagueMegaMenu({
  league,
  onClose,
  onMouseEnter,
  onMouseLeave,
}: Props) {
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

    return { conf, confDivisions, flatTeams, hasDivisions: confDivisions.length > 0 };
  });

  const numConfs    = tree.length;
  const hasTree     = tree.some((g) => g.confDivisions.length > 0 || g.flatTeams.length > 0);
  const width       = menuWidth(league, numConfs);
  const subPages    = buildSubPages(league);

  return (
    <div
      className="bg-surface-100 border border-surface-300 rounded-2xl shadow-2xl overflow-hidden"
      style={{ width }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* ── Sub-page nav ──────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-x-1 gap-y-0.5 px-4 py-2.5 bg-surface-200 border-b border-surface-300">
        <span className="text-xl mr-1.5 shrink-0">{league.logo}</span>
        <span className="text-sm font-black text-surface-text mr-3 shrink-0">{league.name}</span>
        {subPages.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            className="px-2.5 py-1 rounded-md text-[10px] font-semibold text-surface-muted hover:text-brand hover:bg-surface-300 transition-colors whitespace-nowrap"
          >
            {label}
          </Link>
        ))}
      </div>

      {/* ── Team grid ─────────────────────────────────── */}
      <div className="p-4 max-h-[72vh] overflow-y-auto">
        {hasTree ? (
          <div className={`grid gap-5 ${gridClass(numConfs)}`}>
            {tree.map(({ conf, confDivisions, flatTeams, hasDivisions }) => (
              <div key={conf.id}>
                {/* Conference header */}
                <p className="text-[9px] font-black uppercase tracking-widest text-brand mb-2.5 pb-1.5 border-b border-surface-300">
                  {conf.shortName}
                </p>

                {hasDivisions ? (
                  /* Grouped by division */
                  <div className="space-y-3">
                    {confDivisions.map(({ div, teams }) => (
                      <div key={div.id}>
                        <p className="text-[9px] font-semibold uppercase tracking-wider text-surface-muted mb-1">
                          {div.shortName}
                        </p>
                        <ul className="space-y-px">
                          {teams.map((team) => (
                            <li key={team.id}>
                              <Link
                                href={`/team/${team.slug}`}
                                onClick={onClose}
                                className="flex items-center gap-2 px-1.5 py-1 rounded-lg hover:bg-surface-200 group transition-colors"
                              >
                                <span className="text-base leading-none shrink-0">
                                  {team.logo}
                                </span>
                                <span className="text-[11px] font-medium text-surface-text group-hover:text-brand transition-colors truncate">
                                  {team.name}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Flat conference list (no divisions) */
                  <ul className="space-y-px">
                    {flatTeams.map((team) => (
                      <li key={team.id}>
                        <Link
                          href={`/team/${team.slug}`}
                          onClick={onClose}
                          className="flex items-center gap-2 px-1.5 py-1 rounded-lg hover:bg-surface-200 group transition-colors"
                        >
                          <span className="text-base leading-none shrink-0">{team.logo}</span>
                          <span className="text-[11px] font-medium text-surface-text group-hover:text-brand transition-colors truncate">
                            {team.name}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ) : allTeams.length > 0 ? (
          /* No conference data — plain 3-col grid */
          <div className="grid grid-cols-3 gap-1">
            {allTeams.slice(0, 18).map((team) => (
              <Link
                key={team.id}
                href={`/team/${team.slug}`}
                onClick={onClose}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-surface-200 group transition-colors"
              >
                <span className="text-sm leading-none">{team.logo}</span>
                <span className="text-[11px] font-medium text-surface-text group-hover:text-brand transition-colors truncate">
                  {team.name}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-xs text-surface-muted text-center py-6">
            Teams coming soon.
          </p>
        )}
      </div>
    </div>
  );
}
