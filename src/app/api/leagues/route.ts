import { NextResponse } from "next/server";
import { leagues } from "@/data/leagues";

export function GET() {
  return NextResponse.json(leagues);
}
