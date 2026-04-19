"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { X, ImageIcon, Film, BarChart2 } from "lucide-react";
import AuthGate from "@/components/auth/AuthGate";
import { ReplyThread } from "./ReplyThread";
import { ReplyIcon, FireIcon, RepostIcon, ViewsIcon, ActionBtn } from "@/components/icons/PulseIcons";

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

const LEAGUES = ["ALL", "NFL", "NBA", "MLB", "NHL", "COLLEGE", "SOCCER"] as const;
type LeagueOption = (typeof LEAGUES)[number];

const MOCK_POSTS: Post[] = [
  { id: "1", user: "RocketsNation",  handle: "rocketsnation",   avatar: "🚀", time: "2m",  body: "Sengun is absolutely COOKED tonight. MVP watch activated 👀",                   reactions: { fire: 42, wow: 11, repost: 7  }, comments: 14, league: "NBA" },
  { id: "2", user: "ChiefsKingdom",  handle: "chiefskingdom",   avatar: "🏈", time: "5m",  body: "Patrick Mahomes is just built different. There is no other explanation.",     reactions: { fire: 88, wow: 33, repost: 21 }, comments: 31, league: "NFL" },
  { id: "3", user: "LakersNation",   handle: "lakersnation",    avatar: "💜", time: "8m",  body: "The Lakers trade deadline moves were ELITE. Banner season incoming.",          reactions: { fire: 19, wow: 7,  repost: 3  }, comments: 6,  league: "NBA" },
  { id: "4", user: "PuckHead99",     handle: "puckhead99",      avatar: "🏒", time: "12m", body: "Pastrnak hat trick? On a Tuesday? That man is unreal.",                       reactions: { fire: 31, wow: 14, repost: 8  }, comments: 9,  league: "NHL" },
  { id: "5", user: "MLBScout",       handle: "mlbscout",        avatar: "⚾", time: "15m", body: "This Yankees squad has the deepest rotation I've seen in a decade.",          reactions: { fire: 22, wow: 9,  repost: 4  }, comments: 5,  league: "MLB" },
];

interface FanPulseProps {
  compact?: boolean;
  lockedLeague?: string;
}

// ── Compact variant (used on homepage / widgets) ─────────
function FanPulseCompact({ lockedLeague }: { lockedLeague?: string }) {
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS.slice(0, 3));

  useEffect(() => {
    const param = lockedLeague ? `?league=${lockedLeague.toUpperCase()}` : "";
    fetch(`/api/fan-pulse${param}`)
      .then((r) => r.json())
      .then(({ posts: f }: { posts: Post[] }) => {
        if (Array.isArray(f) && f.length > 0) setPosts(f.slice(0, 3));
      })
      .catch(() => {});
  }, [lockedLeague]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
          <h2 className="text-sm font-black tracking-tight text-surface-text uppercase">
            {lockedLeague ? `${lockedLeague.toUpperCase()} Pulse` : "Fan Pulse"}
          </h2>
        </div>
        <Link href="/feed" className="text-xs font-bold text-brand hover:underline">
          Open Feed →
        </Link>
      </div>
      <div className="space-y-2">
        {posts.map((post) => (
          <div key={post.id} className="bg-surface-200 border border-surface-300 rounded-xl p-3">
            <div className="flex gap-2.5">
              <div className="w-7 h-7 rounded-full bg-brand/10 flex items-center justify-center text-sm shrink-0">
                {post.avatar.startsWith("http") ? (
                  <img src={post.avatar} alt={post.user} className="w-full h-full rounded-full object-cover" />
                ) : post.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-xs font-bold text-surface-text">{post.user}</span>
                  <span className="text-[10px] text-surface-muted">@{post.handle}</span>
                </div>
                <p className="text-xs text-surface-text leading-relaxed">{post.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Full X-style feed ────────────────────────────────────
export default function FanPulse({ compact = false, lockedLeague }: FanPulseProps) {
  if (compact) return <FanPulseCompact lockedLeague={lockedLeague} />;

  return <FanPulseFeed lockedLeague={lockedLeague} />;
}

function FanPulseFeed({ lockedLeague }: { lockedLeague?: string }) {
  const { isSignedIn, user } = useUser();
  const clerkUsername = (user?.publicMetadata as { username?: string } | undefined)?.username;
  const avatarUrl = user?.imageUrl ?? null;

  const [selectedLeague, setSelectedLeague] = useState<LeagueOption>(
    lockedLeague ? (lockedLeague.toUpperCase() as LeagueOption) : "ALL"
  );
  const [posts, setPosts]             = useState<Post[]>(MOCK_POSTS);
  const [postContent, setPostContent] = useState("");
  const [composerOpen, setComposerOpen] = useState(false);
  const [reacted, setReacted]         = useState<Set<string>>(new Set());
  const [reposted, setReposted]       = useState<Set<string>>(new Set());
  const [posting, setPosting]         = useState(false);
  const [sortMode, setSortMode]       = useState<"hot" | "new">("hot");
  const [openReplies, setOpenReplies] = useState<Set<string>>(new Set());
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const sortedPosts = useMemo(() => {
    if (sortMode === "hot") {
      return [...posts].sort((a, b) => {
        const s = (p: Post) => p.reactions.fire + p.reactions.wow * 1.5 + p.reactions.repost * 1.2 + p.comments * 2;
        return s(b) - s(a);
      });
    }
    return posts;
  }, [posts, sortMode]);

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

  async function submitPost() {
    if (!postContent.trim() || !isSignedIn) return;
    setPosting(true);
    const body = postContent.trim();
    setPostContent("");
    setComposerOpen(false);

    try {
      const res = await fetch("/api/fan-pulse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: body, league: lockedLeague ?? selectedLeague }),
      });
      if (res.ok) {
        const { post: newPost } = await res.json();
        setPosts((prev) => [newPost, ...prev]);
      } else {
        optimisticPost(body);
      }
    } catch {
      optimisticPost(body);
    }
    setPosting(false);
  }

  function optimisticPost(body: string) {
    setPosts((prev) => [{
      id: `local-${Date.now()}`,
      user: clerkUsername ?? "You",
      handle: clerkUsername ?? "you",
      avatar: avatarUrl ?? "👤",
      time: "now",
      body,
      reactions: { fire: 0, wow: 0, repost: 0 },
      comments: 0,
      league: (lockedLeague ?? selectedLeague).toUpperCase(),
    }, ...prev]);
  }

  function handleReact(postId: string, type: "fire" | "wow") {
    const key = `${postId}-${type}`;
    if (reacted.has(key)) return;
    setReacted((prev) => new Set([...prev, key]));
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, reactions: { ...p.reactions, [type]: p.reactions[type] + 1 } } : p
      )
    );
  }

  function handleRepost(postId: string) {
    if (reposted.has(postId)) return;
    setReposted((prev) => new Set([...prev, postId]));
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, reactions: { ...p.reactions, repost: p.reactions.repost + 1 } } : p
      )
    );
  }

  function toggleReplies(postId: string) {
    setOpenReplies((prev) => {
      const next = new Set(prev);
      next.has(postId) ? next.delete(postId) : next.add(postId);
      return next;
    });
  }

  return (
    <>
      {/* ── Sticky header ───────────────────────────────── */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md px-4 py-3 border-b border-[#2f3336]">
        <h1 className="text-[20px] font-bold text-[#e7e9ea]">
          {lockedLeague ? `${lockedLeague.toUpperCase()} Pulse` : "Fan Pulse"}
        </h1>
      </div>

      {/* ── Sort tabs ───────────────────────────────────── */}
      <div className="flex border-b border-[#2f3336]">
        {(["Hot", "New"] as const).map((tab) => {
          const mode = tab.toLowerCase() as "hot" | "new";
          return (
            <button
              key={tab}
              onClick={() => setSortMode(mode)}
              className="flex-1 py-4 text-[15px] font-medium text-[#71767b] hover:bg-white/[0.03] relative transition-colors"
            >
              {sortMode === mode && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-[#1d9bf0] rounded-full" />
              )}
              <span className={sortMode === mode ? "text-[#e7e9ea]" : ""}>
                {tab === "Hot" ? "🔥 Hot" : "✨ New"}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── League filter (full feed only) ──────────────── */}
      {!lockedLeague && (
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar px-4 py-2 border-b border-[#2f3336]">
          {LEAGUES.map((lg) => (
            <button
              key={lg}
              onClick={() => setSelectedLeague(lg)}
              className={`px-3 py-1 rounded-full text-[13px] font-bold whitespace-nowrap transition-colors ${
                selectedLeague === lg
                  ? "bg-[#1d9bf0] text-white"
                  : "text-[#71767b] border border-[#2f3336] hover:border-[#71767b]"
              }`}
            >
              {lg}
            </button>
          ))}
        </div>
      )}

      {/* ── Collapsed composer trigger ───────────────────── */}
      <div
        onClick={() => (isSignedIn ? setComposerOpen(true) : null)}
        className="flex items-center gap-3 px-4 py-3 border-b border-[#2f3336] cursor-text hover:bg-white/[0.02] transition-colors"
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-[#333639] flex items-center justify-center text-[#71767b] flex-shrink-0">
            {clerkUsername?.[0]?.toUpperCase() ?? "?"}
          </div>
        )}
        <span className="text-[20px] text-[#71767b]">
          {lockedLeague
            ? `What's happening in ${lockedLeague.toUpperCase()}?`
            : "What's your take?"}
        </span>
        {!isSignedIn && (
          <AuthGate tooltip="Sign in to post">
            <button className="ml-auto px-5 py-2 bg-[#1d9bf0] text-white font-bold rounded-full text-[15px]">
              Post
            </button>
          </AuthGate>
        )}
      </div>

      {/* ── Posts ───────────────────────────────────────── */}
      {sortedPosts.map((post) => (
        <article key={post.id} className="flex gap-3 px-4 py-3 border-b border-[#2f3336] hover:bg-white/[0.02] transition-colors">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-[#333639] overflow-hidden flex items-center justify-center text-lg">
              {post.avatar.startsWith("http") ? (
                <img src={post.avatar} alt={post.user} className="w-full h-full object-cover" />
              ) : (
                <span>{post.avatar}</span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Name row */}
            <div className="flex items-baseline gap-1.5 flex-wrap mb-0.5">
              <span className="font-bold text-[15px] text-[#e7e9ea]">{post.user}</span>
              <span className="text-[15px] text-[#71767b]">@{post.handle}</span>
              <span className="text-[#71767b]">·</span>
              <span className="text-[13px] text-[#71767b]">{post.time}</span>
              <span className="ml-auto">
                <span className="text-[13px] px-2 py-0.5 rounded-full border border-[#2f3336] text-[#71767b]">
                  {post.league}
                </span>
              </span>
            </div>

            {/* Body */}
            <p className="text-[15px] leading-5 text-[#e7e9ea] mb-3">{post.body}</p>

            {/* Media placeholder */}
            {post.media && (
              <div className="mb-3 flex items-center gap-2 px-3 py-2 rounded-xl border border-[#2f3336] text-[#71767b] text-[13px]">
                <span>{post.media.label}</span>
              </div>
            )}

            {/* Action bar */}
            <div className="flex items-center justify-between max-w-[425px] -ml-2">
              <ActionBtn
                icon={<ReplyIcon />}
                count={post.comments}
                hoverColor="blue"
                active={openReplies.has(post.id)}
                onClick={() => toggleReplies(post.id)}
              />
              <ActionBtn
                icon={<RepostIcon />}
                count={post.reactions.repost}
                hoverColor="green"
                active={reposted.has(post.id)}
                activeColor="text-emerald-400"
                onClick={() => handleRepost(post.id)}
              />
              <ActionBtn
                icon={<FireIcon />}
                count={post.reactions.fire}
                hoverColor="orange"
                active={reacted.has(`${post.id}-fire`)}
                activeColor="text-orange-500"
                onClick={() => handleReact(post.id, "fire")}
              />
              <ActionBtn
                icon={<ViewsIcon />}
                count={post.reactions.wow}
                hoverColor="blue"
                active={reacted.has(`${post.id}-wow`)}
                onClick={() => handleReact(post.id, "wow")}
              />
            </div>

            <ReplyThread postId={post.id} isOpen={openReplies.has(post.id)} />
          </div>
        </article>
      ))}

      {/* ── Composer modal ───────────────────────────────── */}
      {composerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-12"
          style={{ background: "rgba(91,112,131,0.4)" }}
          onClick={(e) => e.target === e.currentTarget && setComposerOpen(false)}
        >
          <div className="bg-black rounded-2xl w-[600px] max-w-[calc(100vw-32px)] p-4 shadow-2xl">
            <button
              onClick={() => setComposerOpen(false)}
              className="mb-4 p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-[#e7e9ea]" />
            </button>

            <div className="flex gap-3">
              {avatarUrl ? (
                <img src={avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#333639] flex items-center justify-center text-[#71767b] flex-shrink-0">
                  {clerkUsername?.[0]?.toUpperCase() ?? "?"}
                </div>
              )}

              <div className="flex-1">
                <textarea
                  ref={textareaRef}
                  autoFocus
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submitPost();
                  }}
                  placeholder={
                    lockedLeague
                      ? `What's happening in ${lockedLeague.toUpperCase()}?`
                      : "What's your take?"
                  }
                  maxLength={500}
                  className="w-full bg-transparent text-[20px] text-[#e7e9ea] placeholder:text-[#71767b] resize-none outline-none min-h-[120px] leading-7"
                />

                <div className="flex items-center justify-between pt-3 border-t border-[#2f3336]">
                  <div className="flex items-center gap-1 text-[#1d9bf0]">
                    <button className="p-2 rounded-full hover:bg-[#1d9bf0]/10 transition-colors">
                      <ImageIcon className="w-[18px] h-[18px]" />
                    </button>
                    <button className="p-2 rounded-full hover:bg-[#1d9bf0]/10 transition-colors">
                      <Film className="w-[18px] h-[18px]" />
                    </button>
                    <button className="p-2 rounded-full hover:bg-[#1d9bf0]/10 transition-colors">
                      <BarChart2 className="w-[18px] h-[18px]" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    {postContent.length > 400 && (
                      <span className={`text-[13px] ${postContent.length > 480 ? "text-red-500" : "text-[#71767b]"}`}>
                        {500 - postContent.length}
                      </span>
                    )}
                    <button
                      onClick={submitPost}
                      disabled={!postContent.trim() || posting}
                      className="px-5 py-2 bg-[#1d9bf0] text-white font-bold rounded-full text-[15px] disabled:opacity-50 hover:bg-[#1a8cd8] transition-colors"
                    >
                      {posting ? "Posting…" : "Post"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
