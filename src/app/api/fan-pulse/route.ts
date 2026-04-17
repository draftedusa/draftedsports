import { auth } from "@clerk/nextjs/server";
import { supabaseService } from "@/lib/supabase";
import { runMigrations } from "@/lib/migrations";
import { NextResponse } from "next/server";

// Run migrations lazily on first API hit
let migrated = false;
async function ensureMigrated() {
  if (!migrated) { await runMigrations(); migrated = true; }
}

// ── Relative time helper ──────────────────────────────────
function relativeTime(iso: string): string {
  const secs = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (secs < 60)   return `${secs}s ago`;
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400)return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

// ── GET /api/fan-pulse ────────────────────────────────────
export async function GET() {
  await ensureMigrated();
  const { data, error } = await supabaseService
    .from("fan_pulse_posts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(60);

  if (error) {
    console.error("[fan-pulse GET]", error);
    return NextResponse.json({ posts: [] });
  }

  const posts = (data ?? []).map((row) => ({
    id:        row.id,
    user:      row.author_display_name ?? row.author_username,
    handle:    `@${row.author_username}`,
    avatar:    row.author_avatar_url ?? "👤",
    time:      relativeTime(row.created_at),
    body:      row.content,
    reactions: row.reactions ?? { fire: 0, wow: 0, repost: 0 },
    comments:  row.reply_count ?? 0,
    league:    row.league_tag ?? "ALL",
  }));

  return NextResponse.json({ posts });
}

// ── POST /api/fan-pulse ───────────────────────────────────
export async function POST(req: Request) {
  await ensureMigrated();

  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const content: string = (body.content ?? "").trim();
  if (!content) return NextResponse.json({ error: "Content required" }, { status: 400 });

  // Look up author profile
  const { data: profile } = await supabaseService
    .from("users")
    .select("username, display_name, avatar_url")
    .eq("clerk_id", userId)
    .maybeSingle();

  const username = profile?.username ?? userId.slice(0, 8);

  const { data: inserted, error } = await supabaseService
    .from("fan_pulse_posts")
    .insert({
      author_clerk_id:     userId,
      author_username:     username,
      author_display_name: profile?.display_name ?? null,
      author_avatar_url:   profile?.avatar_url ?? null,
      content,
      league_tag: body.league ?? "ALL",
    })
    .select()
    .single();

  if (error) {
    console.error("[fan-pulse POST]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Award "Early Bird" achievement if first post (fire-and-forget)
  supabaseService
    .from("achievements")
    .upsert({ clerk_id: userId, achievement_type: "early_bird" }, { onConflict: "clerk_id,achievement_type" })
    .then(() => {});

  return NextResponse.json({
    post: {
      id:        inserted.id,
      user:      inserted.author_display_name ?? inserted.author_username,
      handle:    `@${inserted.author_username}`,
      avatar:    inserted.author_avatar_url ?? "👤",
      time:      "just now",
      body:      inserted.content,
      reactions: { fire: 0, wow: 0, repost: 0 },
      comments:  0,
      league:    inserted.league_tag ?? "ALL",
    },
  });
}
