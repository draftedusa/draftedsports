"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { articles } from "@/data/articles";
import { nflTeams } from "@/data/teams/nfl";
import { nbaTeams } from "@/data/teams/nba";
import { collegeTeams } from "@/data/teams/college";
import { teams as legacyTeams } from "@/data/teams";
import { profiles } from "@/data/profiles";
import { socialPosts } from "@/data/social-posts";
import type { Team } from "@/types";
import DynamicFeed from "@/components/social/DynamicFeed";
import TeamPicker from "@/components/profile/TeamPicker";

// ─────────────────────────────────────────────────────────
// Team lookup (expanded + legacy extras)
// ─────────────────────────────────────────────────────────
const expandedIds = new Set([...nflTeams, ...nbaTeams, ...collegeTeams].map((t) => t.id));
const legacyExtras = legacyTeams.filter((t) => !expandedIds.has(t.id));
const ALL_TEAMS: Team[] = [...nflTeams, ...nbaTeams, ...collegeTeams, ...legacyExtras];
const ALL_TEAMS_MAP = Object.fromEntries(ALL_TEAMS.map((t) => [t.id, t]));

// Default demo favorites (rockets + lakers + chiefs)
const DEFAULT_FAVORITES = ["nba-rockets", "nba-lakers", "nfl-chiefs"];
const LS_KEY = "undrafted-favorites";

// ─────────────────────────────────────────────────────────
// Mock activity feed
// ─────────────────────────────────────────────────────────
const MOCK_ACTIVITY = [
  { id: "a1", color: "bg-orange-400", label: "Reacted 🔥 to: Sengun is absolutely COOKED tonight" },
  { id: "a2", color: "bg-brand",      label: "Posted: Lakers trade deadline moves were ELITE" },
  { id: "a3", color: "bg-emerald-400",label: "Saved: Mahomes Breaks Another Record" },
  { id: "a4", color: "bg-orange-400", label: "Reacted 😮 to: Pastrnak hat trick on a Tuesday" },
  { id: "a5", color: "bg-brand",      label: "Posted in Fan Pulse about the NFL Draft" },
  { id: "a6", color: "bg-blue-400",   label: "Commented on: Chiefs Dynasty Watch" },
];

const MOCK_SAVED_IDS = ["art-001", "art-003", "art-006", "art-002"];

// ─────────────────────────────────────────────────────────
// Jersey Wall card
// ─────────────────────────────────────────────────────────
function JerseyCard({ team }: { team: Team }) {
  const c = team.primaryColor ?? "#8b5cf6";
  return (
    <Link
      href={`/team/${team.slug}`}
      className="relative flex flex-col items-center gap-1.5 p-3 rounded-xl overflow-hidden card-lift"
      style={{
        background: `linear-gradient(145deg, ${c}28, ${c}0d)`,
        border: `1px solid ${c}40`,
      }}
    >
      {/* Gloss sheen */}
      <div
        className="absolute inset-0 pointer-events-none rounded-xl"
        style={{ background: "linear-gradient(160deg, rgba(255,255,255,0.1) 0%, transparent 50%)" }}
        aria-hidden
      />
      <span className="relative text-3xl leading-none">{team.logo}</span>
      <span
        className="relative text-[9px] font-bold text-center leading-tight line-clamp-2 max-w-full"
        style={{ color: c }}
      >
        {team.name.split(" ").slice(-1)[0]}
      </span>
      {team.record && (
        <span className="relative text-[8px] text-surface-muted tabular-nums">
          {team.record}
        </span>
      )}
    </Link>
  );
}

// ─────────────────────────────────────────────────────────
// Stat pill
// ─────────────────────────────────────────────────────────
function StatPill({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="flex flex-col items-center px-5 py-3 bg-surface-200 border border-surface-300 rounded-xl">
      <span className="text-xl font-black text-surface-text tabular-nums">{value}</span>
      <span className="text-[10px] text-surface-muted uppercase tracking-wider mt-0.5">{label}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Profile page
// ─────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { data: session, status } = useSession();

  // ── Favorite teams (persisted to localStorage) ───────
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return DEFAULT_FAVORITES;
    try {
      const stored = localStorage.getItem(LS_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_FAVORITES;
    } catch {
      return DEFAULT_FAVORITES;
    }
  });

  const [pickerOpen, setPickerOpen] = useState(false);

  // Persist on change
  useEffect(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(favoriteIds)); } catch { /* ignore */ }
  }, [favoriteIds]);

  const saveFavorites = useCallback((ids: string[]) => {
    setFavoriteIds(ids);
  }, []);

  // ── Derived data ─────────────────────────────────────
  const favoriteTeams = useMemo(
    () => favoriteIds.map((id) => ALL_TEAMS_MAP[id]).filter(Boolean) as Team[],
    [favoriteIds]
  );

  const savedArticles = useMemo(
    () => articles.filter((a) => MOCK_SAVED_IDS.includes(a.id)),
    []
  );

  // Post count (mock: posts authored by prof-001)
  const postCount = socialPosts.filter((p) => p.authorId === "prof-001").length;

  // Mock profile for stats (use prof-001 as demo "me")
  const myProfile = profiles.find((p) => p.id === "prof-001");

  // Banner gradient from first 2 team colors
  const c1 = favoriteTeams[0]?.primaryColor ?? "#8b5cf6";
  const c2 = favoriteTeams[1]?.primaryColor ?? "#d946ef";
  const bannerStyle = {
    background: `linear-gradient(135deg, ${c1}55 0%, ${c2}30 55%, transparent 100%)`,
  };

  // Display name
  const displayName = session?.user?.name ?? myProfile?.displayName ?? "Sports Fan";
  const handle = myProfile?.handle ?? "@sportsfan";
  const avatarChar = displayName.charAt(0).toUpperCase();

  // ── Loading ───────────────────────────────────────────
  if (status === "loading") {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-4">
        <div className="skeleton skeleton-card h-52 w-full" />
        <div className="grid grid-cols-3 gap-3">
          <div className="skeleton skeleton-card h-20" />
          <div className="skeleton skeleton-card h-20" />
          <div className="skeleton skeleton-card h-20" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

      {/* ══════════════════════════════════════════════
          PROFILE HEADER CARD
          ══════════════════════════════════════════════ */}
      <div className="bg-surface-200 border border-surface-300 rounded-2xl overflow-hidden">
        {/* Banner */}
        <div className="h-36 relative" style={bannerStyle}>
          <div className="absolute inset-0 bg-gradient-to-t from-surface-200/80 to-transparent" />
        </div>

        {/* Avatar overlap + identity */}
        <div className="px-6 pb-5 -mt-10">
          <div className="flex items-end gap-4 mb-4">
            {/* Avatar */}
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black shrink-0 ring-4 ring-surface-200 shadow-lg"
              style={{ background: `linear-gradient(135deg, ${c1}50, ${c2}30)`, color: c1 }}
            >
              {avatarChar}
            </div>

            {/* Name block */}
            <div className="flex-1 min-w-0 pb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-black tracking-tighter text-surface-text leading-none">
                  {displayName}
                </h1>
                {/* Verified badge */}
                {myProfile?.isVerified && (
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-brand shrink-0">
                    <path fillRule="evenodd" d="M16.403 12.652a3 3 0 0 0 0-5.304 3 3 0 0 0-3.75-3.751 3 3 0 0 0-5.305 0 3 3 0 0 0-3.751 3.75 3 3 0 0 0 0 5.305 3 3 0 0 0 3.75 3.751 3 3 0 0 0 5.305 0 3 3 0 0 0 3.751-3.75Zm-2.546-4.46a.75.75 0 0 0-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <p className="text-sm text-surface-muted mt-0.5">{handle}</p>
              <p className="text-[11px] text-surface-muted mt-1 flex items-center gap-1">
                <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3 shrink-0">
                  <path d="M4 .75a.75.75 0 0 1 1.5 0V2h5V.75a.75.75 0 0 1 1.5 0V2h.25A2.75 2.75 0 0 1 15 4.75v8.5A2.75 2.75 0 0 1 12.25 16H3.75A2.75 2.75 0 0 1 1 13.25v-8.5A2.75 2.75 0 0 1 3.75 2H4V.75Z" />
                </svg>
                Joined {myProfile?.joinedAt
                  ? new Date(myProfile.joinedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
                  : "March 2025"}
              </p>
            </div>

            {/* Edit button */}
            <button className="px-4 py-2 bg-surface-300 hover:bg-surface-300/80 border border-surface-300 text-surface-text text-xs font-bold rounded-full transition-colors shrink-0">
              Edit Profile
            </button>
          </div>

          {/* Bio */}
          {myProfile?.bio && (
            <p className="text-sm text-surface-muted leading-relaxed mb-4 max-w-lg">
              {myProfile.bio}
            </p>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          STATS BAR
          ══════════════════════════════════════════════ */}
      <div className="flex items-stretch gap-3 overflow-x-auto no-scrollbar">
        <StatPill value={myProfile?.followersCount.toLocaleString() ?? "0"} label="Followers" />
        <StatPill value={myProfile?.followingCount.toLocaleString() ?? "0"} label="Following" />
        <StatPill value={postCount}                                           label="Posts" />
        <StatPill value={favoriteIds.length}                                  label="Teams" />
        <StatPill value={savedArticles.length}                                label="Saved" />
      </div>

      {/* ══════════════════════════════════════════════
          MAIN GRID
          ══════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">

        {/* ── LEFT COLUMN ─────────────────────────── */}
        <div className="space-y-8 order-2 lg:order-1">

          {/* Jersey Wall */}
          <section className="bg-surface-200 border border-surface-300 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-black uppercase tracking-wider text-surface-text">
                  Jersey Wall
                </h2>
                <p className="text-[10px] text-surface-muted mt-0.5">
                  {favoriteIds.length} team{favoriteIds.length !== 1 ? "s" : ""} in your collection
                </p>
              </div>
              <button
                onClick={() => setPickerOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-brand/10 hover:bg-brand/20 border border-brand/20 text-brand text-[11px] font-bold rounded-full transition-colors"
              >
                <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                  <path d="M8 2a.75.75 0 0 1 .75.75v4.5h4.5a.75.75 0 0 1 0 1.5h-4.5v4.5a.75.75 0 0 1-1.5 0v-4.5h-4.5a.75.75 0 0 1 0-1.5h4.5v-4.5A.75.75 0 0 1 8 2Z" />
                </svg>
                Edit Teams
              </button>
            </div>

            {favoriteTeams.length > 0 ? (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
                {favoriteTeams.map((team) => (
                  <JerseyCard key={team.id} team={team} />
                ))}
                {/* Add more tile */}
                <button
                  onClick={() => setPickerOpen(true)}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-dashed border-surface-300 hover:border-brand/40 hover:bg-brand/5 transition-colors group"
                >
                  <span className="text-2xl text-surface-muted group-hover:text-brand transition-colors">+</span>
                  <span className="text-[9px] font-bold text-surface-muted group-hover:text-brand transition-colors text-center">Add</span>
                </button>
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-sm text-surface-muted mb-3">Your Jersey Wall is empty.</p>
                <button
                  onClick={() => setPickerOpen(true)}
                  className="px-5 py-2 bg-brand hover:bg-brand/90 text-white text-xs font-bold rounded-full transition-colors"
                >
                  Pick Your Teams
                </button>
              </div>
            )}
          </section>

          {/* Saved Articles */}
          <section className="bg-surface-200 border border-surface-300 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-black uppercase tracking-wider text-surface-text">
                Saved Articles
              </h2>
              <span className="text-[10px] text-surface-muted">{savedArticles.length} saved</span>
            </div>
            {savedArticles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {savedArticles.map((a) => (
                  <Link
                    key={a.id}
                    href={`/article/${a.slug}`}
                    className="flex items-start gap-3 p-3 rounded-xl bg-surface-100 border border-surface-300 hover:border-brand/30 transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-brand/10 to-brand-light/5 flex items-center justify-center text-xl shrink-0">
                      🏟️
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-surface-text group-hover:text-brand transition-colors leading-snug line-clamp-2">
                        {a.title}
                      </p>
                      <p className="text-[10px] text-surface-muted mt-1">
                        {a.byline} · {a.readTime}m
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-xs text-surface-muted text-center py-6">
                No saved articles.{" "}
                <Link href="/" className="text-brand hover:underline">Browse stories →</Link>
              </p>
            )}
          </section>

          {/* Activity */}
          <section className="bg-surface-200 border border-surface-300 rounded-2xl p-5">
            <h2 className="text-sm font-black uppercase tracking-wider text-surface-text mb-4">
              Recent Activity
            </h2>
            <div className="space-y-3">
              {MOCK_ACTIVITY.map((item) => (
                <div key={item.id} className="flex items-start gap-2.5">
                  <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${item.color}`} />
                  <p className="text-xs text-surface-text leading-snug">{item.label}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ── RIGHT COLUMN — My Feed ─────────────── */}
        <aside className="order-1 lg:order-2 lg:sticky lg:top-[88px]">
          <div className="bg-surface-200 border border-surface-300 rounded-2xl overflow-hidden">
            {/* Feed header */}
            <div className="px-5 py-3.5 border-b border-surface-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
              <h2 className="text-sm font-black uppercase tracking-wider text-surface-text">
                My Feed
              </h2>
              <span className="ml-auto text-[10px] text-surface-muted">
                {favoriteIds.length} teams
              </span>
            </div>

            {favoriteIds.length > 0 ? (
              <DynamicFeed
                favoriteTeamIds={favoriteIds}
                hideComposer={false}
                compact
              />
            ) : (
              <div className="px-5 py-10 text-center">
                <p className="text-sm text-surface-muted mb-3">
                  Add teams to populate your feed.
                </p>
                <button
                  onClick={() => setPickerOpen(true)}
                  className="px-4 py-2 bg-brand hover:bg-brand/90 text-white text-xs font-bold rounded-full transition-colors"
                >
                  Pick Teams
                </button>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* ══════════════════════════════════════════════
          TEAM PICKER MODAL
          ══════════════════════════════════════════════ */}
      {pickerOpen && (
        <TeamPicker
          currentFavorites={favoriteIds}
          onSave={saveFavorites}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  );
}
