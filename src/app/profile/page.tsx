"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { articles } from "@/data/articles";
import { teams } from "@/data/teams";

const MOCK_ACTIVITY = [
  { id: "a1", type: "reacted", label: "Reacted 🔥 to \"Sengun is absolutely COOKED tonight\"", time: "2m ago" },
  { id: "a2", type: "posted", label: "Posted in Fan Pulse: \"Lakers trade deadline moves were ELITE\"", time: "1h ago" },
  { id: "a3", type: "saved", label: "Saved \"Mahomes Breaks Another Record\"", time: "3h ago" },
  { id: "a4", type: "reacted", label: "Reacted 😮 to \"Pastrnak hat trick on a Tuesday\"", time: "5h ago" },
  { id: "a5", type: "posted", label: "Posted in Fan Pulse: \"This Yankees rotation is elite\"", time: "1d ago" },
  { id: "a6", type: "comment", label: "Commented on \"Chiefs Dynasty Watch\"", time: "2d ago" },
];

const MOCK_SAVED_IDS = ["art-001", "art-003", "art-006", "art-002"];
const MOCK_TEAM_IDS = ["nba-rockets", "nfl-texans", "nba-lakers"];

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-40 bg-surface-200 rounded-2xl" />
          <div className="h-6 w-48 bg-surface-200 rounded" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-48 bg-surface-200 rounded-xl" />
            <div className="h-48 bg-surface-200 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  const displayName = session?.user?.name ?? "Sports Fan";
  const displayEmail = session?.user?.email ?? null;
  const avatarLetter = displayName.charAt(0).toUpperCase();

  const savedArticles = articles.filter((a) => MOCK_SAVED_IDS.includes(a.id));
  const favoriteTeams = teams.filter((t) => MOCK_TEAM_IDS.includes(t.id));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* ── Profile Header Card ────────────────────────────── */}
      <div className="bg-surface-200 border border-surface-300 rounded-2xl overflow-hidden">
        {/* Cover gradient */}
        <div className="h-24 bg-gradient-to-r from-brand/30 to-brand-light/10" />
        <div className="px-6 pb-6 -mt-10">
          <div className="flex items-end gap-4 mb-4">
            <div className="w-20 h-20 rounded-full bg-brand/20 border-4 border-surface-200 flex items-center justify-center text-3xl font-black text-brand shrink-0 shadow-lg">
              {avatarLetter}
            </div>
            <div className="flex-1 min-w-0 pt-10">
              <h1 className="text-xl font-black tracking-tighter text-surface-text">{displayName}</h1>
              {displayEmail && <p className="text-sm text-surface-muted truncate">{displayEmail}</p>}
            </div>
            <button className="px-4 py-2 bg-surface-300 hover:bg-surface-200 border border-surface-300 text-surface-text text-xs font-bold rounded-lg transition-colors shrink-0">
              Edit Profile
            </button>
          </div>

          {/* Bio */}
          <p className="text-sm text-surface-muted leading-relaxed mb-4">
            Sports enthusiast. Houston forever. Catch me in the Fan Pulse debating hot takes.
          </p>

          {/* Metrics bar */}
          <div className="flex items-center gap-6 text-xs text-surface-muted border-t border-surface-300 pt-4">
            <div>
              <span className="text-lg font-black text-surface-text">{favoriteTeams.length}</span>
              <span className="ml-1">Following</span>
            </div>
            <div>
              <span className="text-lg font-black text-surface-text">{savedArticles.length}</span>
              <span className="ml-1">Saved</span>
            </div>
            <div>
              <span className="text-lg font-black text-surface-text">{MOCK_ACTIVITY.length}</span>
              <span className="ml-1">Actions</span>
            </div>
            <div className="ml-auto text-[10px]">
              Joined March 2025
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left Column: Saved Grid + Followed Teams ──────── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Saved Articles Grid */}
          <div className="bg-surface-200 border border-surface-300 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-black uppercase tracking-wider text-surface-text">Saved Articles</h2>
              <span className="text-xs text-surface-muted">{savedArticles.length} total</span>
            </div>
            {savedArticles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {savedArticles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/article/${article.slug}`}
                    className="flex items-start gap-3 p-3 rounded-lg bg-surface-100 hover:bg-surface-300/50 border border-surface-300 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-brand/10 to-brand-light/5 flex items-center justify-center text-lg shrink-0">
                      🏟️
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-surface-text leading-snug line-clamp-2">{article.title}</p>
                      <p className="text-[10px] text-surface-muted mt-1">{article.byline} · {article.readTime}m read</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-xs text-surface-muted text-center py-4">No saved articles yet.</p>
            )}
          </div>

          {/* Followed Teams */}
          <div className="bg-surface-200 border border-surface-300 rounded-xl p-4">
            <h2 className="text-sm font-black uppercase tracking-wider text-surface-text mb-4">Following</h2>
            {favoriteTeams.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {favoriteTeams.map((team) => (
                  <Link
                    key={team.id}
                    href={`/team/${team.slug}`}
                    className="flex items-center gap-2 px-3 py-2 bg-surface-100 border border-surface-300 rounded-xl text-xs font-bold text-surface-text hover:border-brand/40 transition-colors"
                  >
                    <span className="text-lg">{team.logo}</span>
                    <div>
                      <p className="font-bold">{team.name}</p>
                      <p className="text-[10px] text-surface-muted font-normal">{team.record}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-xs text-surface-muted text-center py-4">Not following any teams yet.</p>
            )}
          </div>
        </div>

        {/* ── Right Column: Activity + Quick Links ──────────── */}
        <div className="space-y-6">
          {/* Activity / Comments History */}
          <div className="bg-surface-200 border border-surface-300 rounded-xl p-4">
            <h2 className="text-sm font-black uppercase tracking-wider text-surface-text mb-4">Activity</h2>
            <div className="space-y-3">
              {MOCK_ACTIVITY.map((item) => (
                <div key={item.id} className="flex items-start gap-2.5">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                    item.type === "reacted" ? "bg-orange-400" :
                    item.type === "posted" ? "bg-brand" :
                    item.type === "saved" ? "bg-emerald-400" :
                    "bg-blue-400"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-surface-text leading-snug">{item.label}</p>
                    <p className="text-[10px] text-surface-muted mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-surface-200 border border-surface-300 rounded-xl p-4">
            <h2 className="text-sm font-black uppercase tracking-wider text-surface-text mb-3">Quick Links</h2>
            <div className="space-y-1">
              {[
                { href: "/feed",      emoji: "💬", label: "Fan Pulse Feed" },
                { href: "/scores",    emoji: "📊", label: "Scores" },
                { href: "/standings", emoji: "🏆", label: "Standings" },
                { href: "/watch",     emoji: "🎬", label: "Watch" },
              ].map(({ href, emoji, label }) => (
                <Link key={href} href={href} className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-surface-muted hover:text-surface-text hover:bg-surface-300/50 transition-colors">
                  <span>{emoji}</span> {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
