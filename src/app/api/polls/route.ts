import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { polls } from "@/data/polls";

export function GET(req: NextRequest) {
  const threadId = req.nextUrl.searchParams.get("threadId");
  const articleId = req.nextUrl.searchParams.get("articleId");
  let result = polls;
  if (threadId) result = result.filter((p) => p.threadId === threadId);
  if (articleId) result = result.filter((p) => p.articleId === articleId);
  return NextResponse.json(result);
}
