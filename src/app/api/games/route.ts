import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { games } from "@/data/games";

export function GET(req: NextRequest) {
  const leagueId = req.nextUrl.searchParams.get("leagueId");
  const status = req.nextUrl.searchParams.get("status");
  let result = games;
  if (leagueId) result = result.filter((g) => g.leagueId === leagueId);
  if (status) result = result.filter((g) => g.status === status);
  return NextResponse.json(result);
}
