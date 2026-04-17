"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import AuthGate from "@/components/auth/AuthGate";

// ── Types ──────────────────────────────────────────────────
interface Post {
  id: string;
  user: string;
  handle: string;
  avatar: string;
  time: string;
  body: string;
  media?: { type: "image" | "gif" | "video"; label: string };
  reactions: { fire: number; wow: number; repost: number };
  comments: number;
  league: string;
}

// ── League selector options ────────────────────────────────
const LEAGUES = ["ALL", "NFL", "NBA", "MLB", "NHL", "COLLEGE", "SOCCER"] as const;
type LeagueOption = (typeof LEAGUES)[number];

const MEDIA_OPTIONS = [
  { type: "image" as const, label: "📷 Photo",  icon: "📷" },
  { type: "gif"   as const, label: "🎞️ GIF",   icon: "🎞️" },
  { type: "video" as const, label: "🎬 Clip",   icon: "🎬" },
];

// ── Fallback mock posts (shown until API loads) ────────────
const MOCK_POSTS: Post[] = [
  { id: "1", user: "RocketsNation",  handle: "@rocketsnation",   avatar: "🚀", time: "2m ago",  body: "Sengun is absolutely COOKED tonight. MVP watch activated 👀",                   reactions: { fire: 42, wow: 11, repost: 7  }, comments: 14, league: "NBA" },
  { id: "2", user: "ChiefsKingdom",  handle: "@chiefskingdom",   avatar: "🏈", time: "5m ago",  body: "Patrick Mahomes is just built different. There is no other explanation.",     reactions: { fire: 88, wow: 33, repost: 21 }, comments: 31, league: "NFL" },
  { id: "3", user: "LakersNation",   handle: "@lakersnation",    avatar: "💜", time: "8m ago",  body: "The Lakers trade deadline moves were ELITE. Banner season incoming.",          reactions: { fire: 19, wow: 7,  repost: 3  }, comments: 6,  league: "NBA" },
  { id: "4", user: "PuckHead99",     handle: "@puckhead99",      avatar: "🏒", time: "12m ago", body: "Pastrnak hat trick? On a Tuesday? That man is unreal.",                       reactions: { fire: 31, wow: 14, repost: 8  }, comments: 9,  league: "NHL" },
  { id: "5", user: "MLBScout",       handle: "@mlbscout",        avatar: "⚾", time: "15m ago", body: "This Yankees squad has the deepest rotation I've seen in a decade.",          reactions: { fire: 22, wow: 9,  repost: 4  }, comments: 5,  league: "MLB" },
];

// ── Props ──────────────────────────────────────────────────
interface FanPulseProps {
  compact?: boolean;
  /**
   * When provided, locks the league tag to this value and hides the selector.
   * Should be the league slug (e.g. "nfl", "nba").
   */
  lockedLeague?: string;
}

export default function FanPulse({ compact = false, lockedLeague }: FanPulseProps) {
  const { isSignedIn, user } = useUser();
  const clerkUsername  = (user?.publicMetadata as { username?: string } | undefined)?.username;
  const avatarUrl      = user?.imageUrl ?? null;

  // Selected league for filtering / tagging (locked if prop provided)
  const [selectedLeague, setSelectedLeague] = useState<LeagueOption>(
    lockedLeague ? (lockedLeague.toUpperCase() as LeagueOption) : "ALL"
  );

  const [posts, setPosts]               = useState<Post[]>(MOCK_POSTS);
  const [input, setInput]               = useState("");
  const [reacted, setReacted]           = useState<Set<string>>(new Set());
  const [reposted, setReposted]         = useState<Set<string>>(new Set());
  const [pendingMedia, setPendingMedia] = useState<Post["media"] | null>(null);
  const [posting, setPosting]           = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ── Fetch posts from API ─────────────────────────────────
  useEffect(() => {
    const leagueParam = lockedLeague
      ? `?league=${lockedLeague.toUpperCase()}`
      : selectedLeague !== "ALL"
      ? `?league=${selectedLeague}`
      : "";

    fetch(`/api/fan-pulse${leagueParam}`)
      .then((r) => r.json())
      .then(({ posts: fetched }: { posts: Post[] }) => {
        if (Array.isArray(fetched) && fetched.length > 0) setPosts(fetched);
      })
      .catch(() => {});
  }, [selectedLeague, lockedLeague]);

  // ── Post submission ──────────────────────────────────────
  async function handlePost(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() && !pendingMedia) return;
    if (!isSignedIn) return;

    const body = input.trim();
    setPosting(true);

    try {
      const res = await fetch("/api/fan-pulse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: body,
          league:  lockedLeague ?? selectedLeague,
          media:   pendingMedia,
        }),
      });

      if (res.ok) {
        const { post: newPost } = await res.json();
        setPosts((prev) => [newPost, ...prev]);
      } else {
        // Optimistic fallback
        setPosts((prev) => [{
          id:        `local-${Date.now()}`,
          user:      clerkUsername ?? "You",
          handle:    clerkUsername ? `@${clerkUsername}` : "@you",
          avatar:    avatarUrl ?? "👤",
          time:      "just now",
          body,
          media:     pendingMedia ?? undefined,
          reactions: { fire: 0, wow: 0, repost: 0 },
          comments:  0,
          league:    (lockedLeague ?? selectedLeague).toUpperCase(),
        }, ...prev]);
      }
    } catch {
      setPosts((prev) => [{
        id:        `local-${Date.now()}`,
        user:      clerkUsername ?? "You",
        handle:    clerkUsername ? `@${clerkUsername}` : "@you",
        avatar:    avatarUrl ?? "👤",
        time:      "just now",
        body,
        media:     pendingMedia ?? undefined,
        reactions: { fire: 0, wow: 0, repost: 0 },
        comments:  0,
        league:    (lockedLeague ?? selectedLeague).toUpperCase(),
      }, ...prev]);
    }

    setInput("");
    setPendingMedia(null);
    setPosting(false);
  }

  // ── Reactions ────────────────────────────────────────────
  function handleReact(postId: string, type: "fire" | "wow") {
    const key = `${postId}-${type}`;
    if (reacted.has(key)) return;
    setReacted((prev) => new Set([...prev, key]));
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, reactions: { ...p.reactions, [type]: p.reactions[type] + 1 } }
          : p
      )
    );
  }

  function handleRepost(postId: string) {
    if (reposted.has(postId)) return;
    setReposted((prev) => new Set([...prev, postId]));
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, reactions: { ...p.reactions, repost: p.reactions.repost + 1 } }
          : p
      )
    );
  }

  const displayPosts = compact ? posts.slice(0, 3) : posts;

  // Avatar to show in composer
  const composerAvatar = avatarUrl
    ? <img src={avatarUrl} alt={clerkUsername ?? "You"} className="w-8 h-8 rounded-full object-cover" />
    : <span className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center text-sm">{clerkUsername ? clerkUsername[0].toUpperCase() : "👤"}</span>;

  return (
    <div className="space-y-4">
      {/* ── Header ──────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
            <h2 className="text-sm font-black tracking-tight text-surface-text uppercase">
              {lockedLeague ? `${lockedLeague.toUpperCase()} Pulse` : "Fan Pulse"}
            </h2>
          </div>
          <p className="text-xs text-surface-muted">Live community reactions</p>
        </div>
        {compact && (
          <Link href="/feed" className="text-xs font-bold text-brand hover:underline">
            Open Feed →
          </Link>
        )}
      </div>

      {/* ── League selector (hidden when locked) ────────── */}
      {!lockedLeague && !compact && (
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
          {LEAGUES.map((lg) => (
            <button
              key={lg}
              onClick={() => setSelectedLeague(lg)}
              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase whitespace-nowrap transition-colors ${
                selectedLeague === lg
                  ? "bg-brand text-white"
                  : "bg-surface-300 text-surface-muted hover:text-surface-text"
              }`}
            >
              {lg}
            </button>
          ))}
        </div>
      )}

      {/* ── Compose box ─────────────────────────────────── */}
      <div className="bg-surface-200 border border-surface-300 rounded-xl overflow-hidden">
        <form onSubmit={handlePost}>
          <div className="flex gap-3 p-3">
            <div className="shrink-0 mt-0.5">{composerAvatar}</div>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                lockedLeague
                  ? `What's happening in ${lockedLeague.toUpperCase()}?`
                  : "What's your take?"
              }
              rows={2}
              className="flex-1 bg-transparent text-sm text-surface-text placeholder-surface-muted focus:outline-none resize-none leading-relaxed"
            />
          </div>

          {pendingMedia && (
            <div className="mx-3 mb-2 flex items-center gap-2 px-3 py-2 bg-brand/10 border border-brand/30 rounded-lg">
              <span className="text-sm">{pendingMedia.label}</span>
              <button type="button" onClick={() => setPendingMedia(null)} className="ml-auto text-[10px] text-surface-muted hover:text-surface-text">
                ✕ Remove
              </button>
            </div>
          )}

          <div className="flex items-center justify-between px-3 pb-3">
            <div className="flex items-center gap-1">
              {MEDIA_OPTIONS.map((opt) => (
                <button
                  key={opt.type}
                  type="button"
                  onClick={() => setPendingMedia(pendingMedia?.type === opt.type ? null : { type: opt.type, label: opt.label })}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                    pendingMedia?.type === opt.type
                      ? "bg-brand/20 text-brand border border-brand/40"
                      : "text-surface-muted hover:text-surface-text hover:bg-surface-300"
                  }`}
                >
                  <span>{opt.icon}</span>
                  <span className="hidden sm:inline">{opt.type.toUpperCase()}</span>
                </button>
              ))}
            </div>

            {/* Post button — auth-gated */}
            <AuthGate tooltip="Sign in to post">
              <button
                type="submit"
                disabled={posting || (!input.trim() && !pendingMedia)}
                className="px-4 py-1.5 bg-brand hover:bg-brand/90 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg transition-colors"
              >
                {posting ? "…" : "Post"}
              </button>
            </AuthGate>
          </div>
        </form>
      </div>

      {/* ── Posts ───────────────────────────────────────── */}
      <div className="space-y-3">
        {displayPosts.map((post) => (
          <div key={post.id} className="bg-surface-200 border border-surface-300 rounded-xl p-3">
            <div className="flex items-start gap-2.5">
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-brand/10 border border-surface-300 flex items-center justify-center text-base shrink-0 overflow-hidden">
                {post.avatar.startsWith("http") ? (
                  <img src={post.avatar} alt={post.user} className="w-full h-full object-cover" />
                ) : (
                  post.avatar
                )}
              </div>

              <div className="flex-1 min-w-0">
                {/* User row */}
                <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                  <span className="text-xs font-bold text-surface-text">{post.user}</span>
                  <span className="text-[10px] text-surface-muted">{post.handle}</span>
                  <span className="text-[10px] text-surface-muted ml-auto shrink-0">{post.time}</span>
                </div>

                <span className="inline-block text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-surface-300 text-surface-muted mb-1.5">
                  {post.league}
                </span>

                <p className="text-xs text-surface-text leading-relaxed">{post.body}</p>

                {post.media && (
                  <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-surface-300/60 border border-surface-300 rounded-lg">
                    <span className="text-sm">{post.media.label}</span>
                    <span className="text-[10px] text-surface-muted ml-auto capitalize">{post.media.type}</span>
                  </div>
                )}

                {/* Interactions — auth-gated */}
                <div className="flex items-center gap-4 mt-2.5">
                  <AuthGate tooltip="Sign in to react">
                    <button
                      onClick={() => handleReact(post.id, "fire")}
                      className={`flex items-center gap-1 text-xs font-semibold transition-colors ${
                        reacted.has(`${post.id}-fire`) ? "text-orange-400" : "text-surface-muted hover:text-orange-400"
                      }`}
                    >
                      🔥 <span>{post.reactions.fire}</span>
                    </button>
                  </AuthGate>

                  <AuthGate tooltip="Sign in to react">
                    <button
                      onClick={() => handleReact(post.id, "wow")}
                      className={`flex items-center gap-1 text-xs font-semibold transition-colors ${
                        reacted.has(`${post.id}-wow`) ? "text-brand" : "text-surface-muted hover:text-brand"
                      }`}
                    >
                      😮 <span>{post.reactions.wow}</span>
                    </button>
                  </AuthGate>

                  <AuthGate tooltip="Sign in to comment">
                    <button className="flex items-center gap-1 text-xs text-surface-muted hover:text-surface-text transition-colors font-semibold">
                      <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                        <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                      </svg>
                      <span>{post.comments}</span>
                    </button>
                  </AuthGate>

                  <AuthGate tooltip="Sign in to repost">
                    <button
                      onClick={() => handleRepost(post.id)}
                      className={`flex items-center gap-1 text-xs font-semibold ml-auto transition-colors ${
                        reposted.has(post.id) ? "text-emerald-400" : "text-surface-muted hover:text-emerald-400"
                      }`}
                    >
                      <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                        <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>{post.reactions.repost}</span>
                    </button>
                  </AuthGate>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
