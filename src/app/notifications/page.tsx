import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { supabaseService } from "@/lib/supabase";
import { runMigrations } from "@/lib/migrations";
import MarkReadButton from "./MarkReadButton";

export const metadata = { title: "Notifications — UNDRAFTED" };

const TYPE_META: Record<string, { emoji: string; color: string }> = {
  achievement_earned:       { emoji: "🏆", color: "text-yellow-400" },
  new_follower:             { emoji: "👤", color: "text-brand" },
  post_liked:               { emoji: "🔥", color: "text-orange-400" },
  post_replied:             { emoji: "💬", color: "text-blue-400" },
  team_game_live:           { emoji: "🏟️", color: "text-red-400" },
  article_saved_milestone:  { emoji: "📚", color: "text-green-400" },
  teammate_formed:          { emoji: "🤝", color: "text-purple-400" },
  live_game_alert:          { emoji: "⚡", color: "text-yellow-500" },
};

function relativeTime(iso: string) {
  const secs = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (secs < 60)    return `${secs}s ago`;
  if (secs < 3600)  return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

export default async function NotificationsPage() {
  const user = await currentUser();
  if (!user) redirect("/");

  await runMigrations();

  const { data: notifications } = await supabaseService
    .from("notifications")
    .select("*")
    .eq("recipient_clerk_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  const items = notifications ?? [];
  const unreadCount = items.filter((n) => !n.read).length;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-surface-text">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-xs text-surface-muted mt-0.5">{unreadCount} unread</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && <MarkReadButton />}
          <Link href="/notifications/settings"
            className="text-xs font-bold text-surface-muted hover:text-surface-text transition-colors">
            Settings →
          </Link>
        </div>
      </div>

      {/* Notification list */}
      {items.length === 0 ? (
        <div className="bg-surface-200 border border-surface-300 rounded-2xl p-10 text-center">
          <p className="text-4xl mb-3">🔔</p>
          <p className="text-sm font-bold text-surface-text mb-1">All caught up</p>
          <p className="text-xs text-surface-muted">You have no notifications yet.</p>
        </div>
      ) : (
        <div className="bg-surface-200 border border-surface-300 rounded-2xl overflow-hidden divide-y divide-surface-300">
          {items.map((n) => {
            const meta = TYPE_META[n.type] ?? { emoji: "🔔", color: "text-surface-muted" };
            return (
              <div
                key={n.id}
                className={`flex items-start gap-3 px-4 py-4 transition-colors ${
                  !n.read ? "bg-brand/5" : "hover:bg-surface-300/30"
                }`}
              >
                {!n.read && (
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand shrink-0" />
                )}
                <div className={`text-2xl shrink-0 ${n.read ? "ml-4" : ""}`}>{meta.emoji}</div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold ${meta.color}`}>{n.title}</p>
                  {n.body && <p className="text-xs text-surface-muted mt-0.5">{n.body}</p>}
                  <p className="text-[10px] text-surface-muted mt-1">{relativeTime(n.created_at)}</p>
                </div>
                {n.action_url && (
                  <Link href={n.action_url}
                    className="shrink-0 text-[10px] font-bold text-brand hover:underline mt-0.5">
                    View →
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
