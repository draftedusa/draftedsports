import { auth } from "@clerk/nextjs/server";
import { supabaseService } from "@/lib/supabase";
import { runMigrations } from "@/lib/migrations";
import { NextResponse } from "next/server";

let migrated = false;
async function ensureMigrated() {
  if (!migrated) { await runMigrations(); migrated = true; }
}

function relativeTime(iso: string): string {
  const secs = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (secs < 60)    return `${secs}s ago`;
  if (secs < 3600)  return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

function rowToPost(row: Record<string, unknown>) {
  return {
    id:         row.id as string,
    user:       (row.author_display_name as string | null) ?? (row.author_username as string),
    handle:     `@${row.author_username as string}`,
    avatar:     (row.author_avatar_url as string | null) ?? "👤",
    time:       relativeTime(row.created_at as string),
    body:       row.content as string,
    reactions:  (row.reactions as Record<string, number>) ?? { fire: 0, wow: 0, repost: 0 },
    comments:   (row.reply_count as number) ?? 0,
    league:     (row.league_tag as string) ?? "ALL",
    media_urls: (row.media_urls as string[] | null) ?? [],
  };
}

// GET /api/fan-pulse[?league=nfl]
export async function GET(req: Request) {
  await ensureMigrated();

  const leagueFilter = new URL(req.url).searchParams.get("league");

  let query = supabaseService
    .from("fan_pulse_posts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(60);

  if (leagueFilter && leagueFilter !== "ALL") {
    query = (query as typeof query).eq("league_tag", leagueFilter.toUpperCase());
  }

  const { data, error } = await query;
  if (error) {
    console.error("[fan-pulse GET]", error);
    return NextResponse.json({ posts: [] });
  }

  return NextResponse.json({ posts: (data ?? []).map(rowToPost) });
}

// POST /api/fan-pulse
export async function POST(req: Request) {
  await ensureMigrated();

  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const content: string = (body.content ?? "").trim();
  if (!content) return NextResponse.json({ error: "Content required" }, { status: 400 });

  const leagueTag = ((body.league ?? "ALL") as string).toUpperCase();
  const mediaUrls: string[] = Array.isArray(body.media_urls) ? body.media_urls : [];

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
      league_tag:  leagueTag,
      media_urls:  mediaUrls,
    })
    .select()
    .single();

  if (error) {
    console.error("[fan-pulse POST]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Award "Early Bird" achievement (fire-and-forget)
  supabaseService
    .from("achievements")
    .upsert({ clerk_id: userId, achievement_type: "early_bird" }, { onConflict: "clerk_id,achievement_type" })
    .then(() => {});

  // Insert activity row (fire-and-forget)
  supabaseService
    .from("user_activity")
    .insert({ clerk_id: userId, type: "comment_posted", description: `Posted: "${content.slice(0, 60)}${content.length > 60 ? "…" : ""}"` })
    .then(() => {});

  return NextResponse.json({ post: rowToPost(inserted as Record<string, unknown>) });
}
