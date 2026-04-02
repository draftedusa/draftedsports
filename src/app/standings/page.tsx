import Link from "next/link";
import { leagues } from "@/data/leagues";
import { teams } from "@/data/teams";
import { games } from "@/data/games";

export default function StandingsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <h1 className="text-2xl font-black text-surface-text border-b border-surface-300 pb-4">Standings</h1>

      {leagues.map((league) => {
        const leagueTeams = teams
          .filter((t) => t.leagueId === league.id)
          .sort((a, b) => a.standing - b.standing);

        return (
          <section key={league.id}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-surface-text flex items-center gap-2">
                {league.logo} {league.name}
              </h2>
              <Link href={`/league/${league.slug}`} className="text-sm text-brand hover:text-brand/80 font-semibold">
                Full League →
              </Link>
            </div>

            <div className="bg-surface-200 border border-surface-300 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface-300 text-xs text-surface-muted uppercase tracking-wide">
                    <th className="text-left px-4 py-2.5 w-8">#</th>
                    <th className="text-left px-4 py-2.5">Team</th>
                    <th className="text-center px-3 py-2.5">Record</th>
                    <th className="text-center px-3 py-2.5 hidden sm:table-cell">W</th>
                    <th className="text-center px-3 py-2.5 hidden sm:table-cell">L</th>
                    <th className="text-center px-3 py-2.5 hidden md:table-cell">Streak</th>
                    <th className="text-center px-3 py-2.5 hidden md:table-cell">Last 5</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-300">
                  {leagueTeams.map((team, i) => {
                    // Derive wins/losses from record string
                    const [w, l] = team.record.split("-").map(Number);
                    const streak = i % 3 === 0 ? "W3" : i % 3 === 1 ? "W1" : "L2";
                    const last5 = i % 2 === 0 ? "4-1" : "3-2";
                    const isTop4 = team.standing <= 4;

                    return (
                      <tr
                        key={team.id}
                        className={`hover:bg-surface-300 transition-colors ${isTop4 ? "border-l-2 border-l-green-600" : ""}`}
                      >
                        <td className="px-4 py-3 text-surface-muted text-xs font-mono">{team.standing}</td>
                        <td className="px-4 py-3">
                          <Link href={`/team/${team.slug}`} className="flex items-center gap-2 hover:text-brand transition-colors">
                            <span className="text-lg">{team.logo}</span>
                            <span className="font-semibold text-surface-text">{team.name}</span>
                          </Link>
                        </td>
                        <td className="px-3 py-3 text-center font-bold text-surface-text tabular-nums">{team.record}</td>
                        <td className="px-3 py-3 text-center text-surface-text tabular-nums hidden sm:table-cell">{w}</td>
                        <td className="px-3 py-3 text-center text-surface-muted tabular-nums hidden sm:table-cell">{l}</td>
                        <td className={`px-3 py-3 text-center text-xs font-bold hidden md:table-cell ${streak.startsWith("W") ? "text-green-400" : "text-brand"}`}>
                          {streak}
                        </td>
                        <td className="px-3 py-3 text-center text-xs text-surface-muted hidden md:table-cell">{last5}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="px-4 py-2 border-t border-surface-300 flex items-center gap-4 text-xs text-surface-muted">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-green-600 inline-block" /> Playoff position</span>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
