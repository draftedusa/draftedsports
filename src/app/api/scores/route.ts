import { NextResponse } from "next/server";
import { games } from "@/data/games";
import { teams } from "@/data/teams";

// ISR: revalidate every 30 seconds for live scores
export const revalidate = 30;

export async function GET() {
  const teamMap = Object.fromEntries(teams.map((t) => [t.id, t]));

  const enriched = games.map((g) => ({
    ...g,
    homeTeam: teamMap[g.homeTeamId] ?? null,
    awayTeam: teamMap[g.awayTeamId] ?? null,
  }));

  return NextResponse.json(
    { games: enriched, fetchedAt: new Date().toISOString() },
    {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
        "X-Content-Type-Options": "nosniff",
      },
    }
  );
}
