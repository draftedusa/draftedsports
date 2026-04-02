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
];

const MOCK_SAVED_IDS = ["art-001", "art-003", "art-006"];
const MOCK_TEAM_IDS = ["nba-rockets", "nfl-texans"];

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-surface-200 rounded-xl" />
          <div className="h-6 w-48 bg-surface-200 rounded" />
          <div className="h-48 bg-surface-200 rounded-xl" />
        </div>
      </div>
    );
  }

  // Mock profile data — in production this would come from the session/DB
  const displayName = session?.user?.name ?? "Sports Fan";
  const displayEmail = session?.user?.email ?? null;
  const avatarLetter = displayName.charAt(0).toUpperCase();

  const savedArticles = articles.filter((a) => MOCK_SAVED_IDS.includes(a.id)).slice(0, 4);
  const favoriteTeams = teams.filter((t) => MOCK_TEAM_IDS.includes(t.id));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Profile Header */}
      <div className="bg-surface-200 border border-surface-300 rounded-2xl p-6 flex items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-brand/20 border-2 border-brand/30 flex items-center justify-center text-3xl font-black text-brand shrink-0">
          {avatarLetter}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-black tracking-tighter text-surface-text mb-0.5">{displayName}</h1>
          {displayEmail && <p className="text-sm text-surface-muted truncate">{displayEmail}</p>}
          <div className="flex items-center gap-3 mt-2 text-xs text-surface-muted">
            <span>{savedArticles.length} saved</span>
            <span>·</span>
            <span>{favoriteTeams.length} teams followed</span>
            <span>·</span>
            <span>{MOCK_ACTIVITY.length} recent actions</span>
          </div>
        </div>
        <button className="px-4 py-2 bg-surface-300 hover:bg-surface-200 border border-surface-300 text-surface-text text-xs font-bold rounded-lg transition-colors shrink-0">
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Saved Articles + Followed Teams */}
        <div className="lg:col-span-2 space-y-6">
          {/* Saved Articles */}
          <div className="bg-surface-200 border border-surface-300 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-black uppercase tracking-wider text-surface-text">Saved Articles</h2>
              <span className="text-xs text-surface-muted">{savedArticles.length} total</span>
            </div>
            {savedArticles.length > 0 ? (
              <div className="space-y-3">
                {savedArticles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/article/${article.slug}`}
                    className="flex items-start gap-3 p-3 rounded-lg bg-surface-100 hover:bg-surface-300/50 border border-surface-300 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-surface-text leading-snug line-clamp-2">{article.title}</p>
                      <p className="text-[10px] text-surface-muted mt-1">{article.byline} · {article.publishDate}</p>
                    </div>
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-brand shrink-0 mt-0.5">
                      <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
                    </svg>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-xs text-surface-muted text-center py-4">No saved articles yet.</p>
            )}
          </div>

          {/* Followed Teams */}
          <div className="bg-surface-200 border border-surface-300 rounded-xl p-4">
            <h2 className="text-sm font-black uppercase tracking-wider text-surface-text mb-4">Followed Teams</h2>
            {favoriteTeams.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {favoriteTeams.map((team) => (
                  <Link
                    key={team.id}
                    href={`/team/${team.slug}`}
                    className="flex items-center gap-2 px-3 py-1.5 bg-surface-100 border border-surface-300 rounded-full text-xs font-bold text-surface-text hover:border-brand/40 transition-colors"
                  >
                    <span>{team.logo}</span>
                    <span>{team.name}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-xs text-surface-muted text-center py-4">Not following any teams yet.</p>
            )}
          </div>
        </div>

        {/* Right column: Activity Feed */}
        <div className="space-y-6">
          <div className="bg-surface-200 border border-surface-300 rounded-xl p-4">
            <h2 className="text-sm font-black uppercase tracking-wider text-surface-text mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {MOCK_ACTIVITY.map((item) => (
                <div key={item.id} className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand mt-1.5 shrink-0" />
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
              <Link href="/feed" className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-surface-muted hover:text-surface-text hover:bg-surface-300/50 transition-colors">
                <span>💬</span> Fan Pulse Feed
              </Link>
              <Link href="/scores" className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-surface-muted hover:text-surface-text hover:bg-surface-300/50 transition-colors">
                <span>📊</span> Scores
              </Link>
              <Link href="/standings" className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-surface-muted hover:text-surface-text hover:bg-surface-300/50 transition-colors">
                <span>🏆</span> Standings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
