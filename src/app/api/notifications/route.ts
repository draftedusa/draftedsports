import { auth } from "@clerk/nextjs/server";
import { supabaseService } from "@/lib/supabase";
import { runMigrations } from "@/lib/migrations";
import { NextResponse } from "next/server";

let migrated = false;
async function ensureMigrated() {
  if (!migrated) { await runMigrations(); migrated = true; }
}

// GET /api/notifications[?unread=1]
export async function GET(req: Request) {
  await ensureMigrated();
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const onlyUnread = new URL(req.url).searchParams.get("unread") === "1";

  let query = supabaseService
    .from("notifications")
    .select("*")
    .eq("recipient_clerk_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (onlyUnread) query = (query as typeof query).eq("read", false);

  const { data } = await query;
  const notifications = data ?? [];
  const unreadCount = onlyUnread
    ? notifications.length
    : notifications.filter((n) => !n.read).length;

  return NextResponse.json({ notifications, unreadCount });
}

// PATCH /api/notifications — mark as read
export async function PATCH(req: Request) {
  await ensureMigrated();
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { ids, all } = await req.json().catch(() => ({}));

  if (all) {
    await supabaseService
      .from("notifications")
      .update({ read: true })
      .eq("recipient_clerk_id", userId);
  } else if (Array.isArray(ids) && ids.length) {
    await supabaseService
      .from("notifications")
      .update({ read: true })
      .in("id", ids)
      .eq("recipient_clerk_id", userId);
  }

  return NextResponse.json({ ok: true });
}
