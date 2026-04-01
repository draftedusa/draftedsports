import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { teams } from "@/data/teams";

export function GET(req: NextRequest) {
  const leagueId = req.nextUrl.searchParams.get("leagueId");
  const result = leagueId ? teams.filter((t) => t.leagueId === leagueId) : teams;
  return NextResponse.json(result);
}
