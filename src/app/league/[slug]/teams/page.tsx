import { notFound } from "next/navigation";
import Link from "next/link";
import { leagues } from "@/data/leagues";
import { teams as legacyTeams } from "@/data/teams";
import { nflTeams } from "@/data/teams/nfl";
import { nbaTeams } from "@/data/teams/nba";
import { collegeTeams } from "@/data/teams/college";
import CollegeTeamFinder from "@/components/editorial/CollegeTeamFinder";
import type { Team } from "@/types";

// ─────────────────────────────────────────────────────────
// Static params
// ─────────────────────────────────────────────────────────
export function generateStaticParams() {
  return leagues.map((l) => ({ slug: l.slug }));
}

// ─────────────────────────────────────────────────────────
// Team registry
// ─────────────────────────────────────────────────────────
const TEAM_REGISTRY: Record<string, Team[]> = {
  nfl:     nflTeams,
  nba:     nbaTeams,
  college: collegeTeams,
};

function teamsFor(leagueId: string): Team[] {
  return TEAM_REGISTRY[leagueId] ?? legacyTeams.filter((t) => t.leagueId === leagueId);
}

// ─────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────
interface Props {
  params: Promise<{ slug: string }>;
}

export default async function LeagueTeamsPage({ params }: Props) {
  const { slug } = await params;
  const league = leagues.find((l) => l.slug === slug);
  if (!league) notFound();

  // College gets the full interactive finder
  if (slug === "college") {
    return <CollegeTeamFinder />;
  }

  const leagueTeams = teamsFor(league.id);

  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="text-3xl">{league.logo}</span>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-surface-text">
            {league.name} <span className="text-brand">Teams</span>
          </h1>
          <p className="text-xs text-surface-muted">{leagueTeams.length} teams</p>
        </div>
      </div>

      {/* Team grid */}
      {leagueTeams.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {leagueTeams.map((team) => (
            <Link
              key={team.id}
              href={`/team/${team.slug}`}
              className="group flex flex-col items-center gap-3 rounded-xl border border-surface-300 bg-surface-200 p-5 text-center hover:border-brand/40 hover:bg-surface-200 transition-all"
            >
              <span className="text-4xl group-hover:scale-110 transition-transform">
                {team.logo}
              </span>
              <div>
                <p className="text-sm font-bold text-surface-text leading-tight">{team.name}</p>
                {team.record && (
                  <p className="text-[10px] text-surface-muted mt-0.5 tabular-nums">{team.record}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="py-16 text-center text-sm text-surface-muted">Teams coming soon.</p>
      )}
    </div>
  );
}
