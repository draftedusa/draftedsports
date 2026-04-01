import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { highlights } from "@/data/highlights";

export function GET(req: NextRequest) {
  const gameId = req.nextUrl.searchParams.get("gameId");
  const status = req.nextUrl.searchParams.get("status");
  let result = highlights;
  if (gameId) result = result.filter((h) => h.gameId === gameId);
  if (status) result = result.filter((h) => h.status === status);
  return NextResponse.json(result);
}
