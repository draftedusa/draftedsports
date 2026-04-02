import Link from "next/link";
import { leagues } from "@/data/leagues";
import { teams } from "@/data/teams";

export default function LeagueStandingsSidebar({ leagueSlug }: { leagueSlug: string }) {
  const league = leagues.find((l) => l.slug === leagueSlug);
  const leagueTeams = teams
    .filter((t) => t.leagueId === leagueSlug)
    .sort((a, b) => a.standing - b.standing)
    .slice(0, 8);

  if (!league || leagueTeams.length === 0) return null;

  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-surface-muted mb-3">
        {league.logo} {league.name} Standings
      </p>
      <div className="bg-surface-200 border border-surface-300 rounded-xl overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-[9px] text-surface-muted uppercase tracking-wider bg-surface-300/50">
              <th className="text-left px-3 py-2">#</th>
              <th className="text-left px-3 py-2">Team</th>
              <th className="text-right px-3 py-2">Rec</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-300">
            {leagueTeams.map((team) => (
              <tr
                key={team.id}
                className={`hover:bg-surface-300/40 transition-colors ${team.standing <= 4 ? "border-l-2 border-l-brand" : ""}`}
              >
                <td className="px-3 py-2 text-surface-muted">{team.standing}</td>
                <td className="px-3 py-2">
                  <Link href={`/team/${team.slug}`} className="flex items-center gap-1.5 hover:text-brand transition-colors">
                    <span>{team.logo}</span>
                    <span className="font-semibold text-surface-text truncate max-w-[90px]">{team.name}</span>
                  </Link>
                </td>
                <td className="px-3 py-2 text-right text-surface-muted tabular-nums">{team.record}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-3 py-2 border-t border-surface-300">
          <Link href="/standings" className="text-[10px] font-bold text-brand hover:underline">
            Full Standings →
          </Link>
        </div>
      </div>
    </div>
  );
}
