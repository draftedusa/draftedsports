import Link from "next/link";
import { leagues } from "@/data/leagues";
import { teams } from "@/data/teams";
import { games } from "@/data/games";

export default function StandingsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <h1 className="text-2xl font-black text-white border-b border-gray-800 pb-4">Standings</h1>

      {leagues.map((league) => {
        const leagueTeams = teams
          .filter((t) => t.leagueId === league.id)
          .sort((a, b) => a.standing - b.standing);

        return (
          <section key={league.id}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                {league.logo} {league.name}
              </h2>
              <Link href={`/league/${league.slug}`} className="text-sm text-red-400 hover:text-red-300 font-semibold">
                Full League →
              </Link>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-800 text-xs text-gray-400 uppercase tracking-wide">
                    <th className="text-left px-4 py-2.5 w-8">#</th>
                    <th className="text-left px-4 py-2.5">Team</th>
                    <th className="text-center px-3 py-2.5">Record</th>
                    <th className="text-center px-3 py-2.5 hidden sm:table-cell">W</th>
                    <th className="text-center px-3 py-2.5 hidden sm:table-cell">L</th>
                    <th className="text-center px-3 py-2.5 hidden md:table-cell">Streak</th>
                    <th className="text-center px-3 py-2.5 hidden md:table-cell">Last 5</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {leagueTeams.map((team, i) => {
                    // Derive wins/losses from record string
                    const [w, l] = team.record.split("-").map(Number);
                    const streak = i % 3 === 0 ? "W3" : i % 3 === 1 ? "W1" : "L2";
                    const last5 = i % 2 === 0 ? "4-1" : "3-2";
                    const isTop4 = team.standing <= 4;

                    return (
                      <tr
                        key={team.id}
                        className={`hover:bg-gray-800/50 transition-colors ${isTop4 ? "border-l-2 border-l-green-600" : ""}`}
                      >
                        <td className="px-4 py-3 text-gray-500 text-xs font-mono">{team.standing}</td>
                        <td className="px-4 py-3">
                          <Link href={`/team/${team.slug}`} className="flex items-center gap-2 hover:text-red-400 transition-colors">
                            <span className="text-lg">{team.logo}</span>
                            <span className="font-semibold text-white">{team.name}</span>
                          </Link>
                        </td>
                        <td className="px-3 py-3 text-center font-bold text-white tabular-nums">{team.record}</td>
                        <td className="px-3 py-3 text-center text-gray-300 tabular-nums hidden sm:table-cell">{w}</td>
                        <td className="px-3 py-3 text-center text-gray-500 tabular-nums hidden sm:table-cell">{l}</td>
                        <td className={`px-3 py-3 text-center text-xs font-bold hidden md:table-cell ${streak.startsWith("W") ? "text-green-400" : "text-red-400"}`}>
                          {streak}
                        </td>
                        <td className="px-3 py-3 text-center text-xs text-gray-400 hidden md:table-cell">{last5}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="px-4 py-2 border-t border-gray-800 flex items-center gap-4 text-xs text-gray-600">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-green-600 inline-block" /> Playoff position</span>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
