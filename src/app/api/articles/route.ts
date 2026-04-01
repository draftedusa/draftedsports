import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { articles } from "@/data/articles";

export function GET(req: NextRequest) {
  const teamId = req.nextUrl.searchParams.get("teamId");
  const tagId = req.nextUrl.searchParams.get("tagId");
  const limit = parseInt(req.nextUrl.searchParams.get("limit") ?? "20", 10);

  let result = articles;
  if (teamId) result = result.filter((a) => a.teamIds.includes(teamId));
  if (tagId) result = result.filter((a) => a.tagIds.includes(tagId));
  result = result.slice(0, limit);

  return NextResponse.json(result);
}
