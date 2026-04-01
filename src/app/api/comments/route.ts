import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { comments, threads } from "@/data/comments";

export function GET(req: NextRequest) {
  const threadId = req.nextUrl.searchParams.get("threadId");
  const gameId = req.nextUrl.searchParams.get("gameId");

  if (threadId) {
    return NextResponse.json(comments.filter((c) => c.threadId === threadId));
  }

  if (gameId) {
    const thread = threads.find((t) => t.gameId === gameId);
    if (!thread) return NextResponse.json([]);
    return NextResponse.json(comments.filter((c) => c.threadId === thread.id));
  }

  return NextResponse.json(comments);
}
