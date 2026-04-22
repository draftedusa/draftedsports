"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { ImageIcon, Film, BarChart2, Smile, CalendarClock } from "lucide-react";
import AuthGate from "@/components/auth/AuthGate";
import { ReplyThread } from "./ReplyThread";
import { ReplyModal } from "@/components/fan-pulse/ReplyModal";
import { MediaGrid } from "@/components/fan-pulse/MediaGrid";
import { ReplyIcon, FireIcon, RepostIcon, ViewsIcon, ActionBtn } from "@/components/icons/PulseIcons";
import { useCreateReply, useCreatePost, useFanPulsePosts, type FeedPost } from "@/lib/hooks/useFanPulse";
import { uploadMediaFiles } from "@/lib/uploadMedia";
import { useQueryClient } from "@tanstack/react-query";

// ── Types ──────────────────────────────────────────────────
type Post = FeedPost

const LEAGUES = ["ALL", "NFL", "NBA", "MLB", "NHL", "COLLEGE", "SOCCER"] as const;

function relTime(iso: string): string {
  try {
    const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
    if (s < 60) return `${s}s`
    if (s < 3600) return `${Math.floor(s / 60)}m`
    if (s < 86400) return `${Math.floor(s / 3600)}h`
    return `${Math.floor(s / 86400)}d`
  } catch {
    return 'now'
  }
}

interface FanPulseProps {
  compact?: boolean;
  lockedLeague?: string;
}

// ── Compact widget (homepage / right-rail) ───────────────
function FanPulseCompact({ lockedLeague }: { lockedLeague?: string }) {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const league = lockedLeague ? lockedLeague.toUpperCase() : '';
    const url = league ? `/api/fan-pulse/posts?league=${league}` : '/api/fan-pulse/posts';
    fetch(url)
      .then((r) => r.json())
      .then((data: Post[]) => {
        if (Array.isArray(data) && data.length > 0) setPosts(data.slice(0, 3));
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
              <div className="w-7 h-7 rounded-full bg-brand/10 flex items-center justify-center text-sm shrink-0 overflow-hidden">
                {post.user.avatar_url ? (
                  <img src={post.user.avatar_url} alt={post.user.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{post.user.name?.[0]?.toUpperCase() ?? "?"}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-xs font-bold text-surface-text">{post.user.name}</span>
                  <span className="text-[10px] text-surface-muted">@{post.user.handle}</span>
                </div>
                <p className="text-xs text-surface-text leading-relaxed">{post.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Full X-style feed ─────────────────────────────────────
export default function FanPulse({ compact = false, lockedLeague }: FanPulseProps) {
  if (compact) return <FanPulseCompact lockedLeague={lockedLeague} />;
  return <FanPulseFeed lockedLeague={lockedLeague} />;
}

// ── Circular char counter ─────────────────────────────────
function CharCounter({ length, max }: { length: number; max: number }) {
  if (length === 0) return null;
  const r = 14;
  const circumference = 2 * Math.PI * r; // ≈ 87.96
  const filled = (length / max) * circumference;
  const color = length > max * 0.96 ? '#f4212e' : length > max * 0.93 ? '#ffd400' : '#1d9bf0';
  return (
    <div className="relative w-8 h-8 flex items-center justify-center">
      <svg className="w-8 h-8 -rotate-90" viewBox="0 0 32 32">
        <circle cx="16" cy="16" r={r} fill="none" stroke="#2f3336" strokeWidth="2" />
        <circle
          cx="16" cy="16" r={r} fill="none"
          stroke={color}
          strokeWidth="2"
          strokeDasharray={`${filled} ${circumference}`}
          strokeLinecap="round"
        />
      </svg>
      {length > max * 0.93 && (
        <span className="absolute text-[11px] text-gray-500 dark:text-[#71767b]">{max - length}</span>
      )}
    </div>
  );
}

// ── Who-can-reply dropdown ─────────────────────────────────
const REPLY_OPTIONS = [
  { value: 'everyone',  label: 'Everyone',                icon: '🌐' },
  { value: 'following', label: 'Accounts you follow',     icon: '👤' },
  { value: 'mentioned', label: 'Only mentioned accounts', icon: '@'  },
  { value: 'verified',  label: 'Verified accounts',       icon: '✓'  },
] as const;
type ReplyPermission = (typeof REPLY_OPTIONS)[number]['value'];

// ── Main feed ─────────────────────────────────────────────
function FanPulseFeed({ lockedLeague }: { lockedLeague?: string }) {
  const { isSignedIn, user } = useUser();
  const queryClient = useQueryClient();
  const avatarUrl = user?.imageUrl ?? null;
  const clerkUsername = user?.username ?? user?.firstName ?? null;

  // Feed state
  const [reacted, setReacted]       = useState<Set<string>>(new Set());
  const [reposted, setReposted]     = useState<Set<string>>(new Set());
  const [sortMode, setSortMode]     = useState<"hot" | "new">("hot");
  const [openReplies, setOpenReplies] = useState<Set<string>>(new Set());
  const [selectedLeague, setSelectedLeague] = useState<string>(
    lockedLeague ? lockedLeague.toUpperCase() : "ALL"
  );

  // Composer state
  const [composerOpen, setComposerOpen]       = useState(false);
  const [composerLeague, setComposerLeague]   = useState("ALL");
  const [postContent, setPostContent]         = useState("");
  const [mediaFiles, setMediaFiles]           = useState<File[]>([]);
  const [mediaPreviewUrls, setMediaPreviewUrls] = useState<string[]>([]);
  const [replyPermission, setReplyPermission] = useState<ReplyPermission>('everyone');
  const [showReplySelector, setShowReplySelector] = useState(false);

  // Reply modal state
  const [replyModalPost, setReplyModalPost] = useState<Post | null>(null);

  const createPost  = useCreatePost();
  const createReply = useCreateReply();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Fetch from DB via React Query — re-fetches whenever selectedLeague changes
  const effectiveLeague = lockedLeague ? lockedLeague.toUpperCase() : selectedLeague;
  const { data: postsData, isLoading } = useFanPulsePosts(effectiveLeague);

  // Sort
  const sortedPosts = useMemo(() => {
    const list = postsData ?? [];
    if (sortMode === "hot") {
      return [...list].sort((a, b) => {
        const s = (p: Post) => p.fire_count * 1.0 + p.comment_count * 2.0 + p.repost_count * 1.5;
        return s(b) - s(a);
      });
    }
    return list;
  }, [postsData, sortMode]);

  // External composer trigger (e.g. from sidebar Post button)
  useEffect(() => {
    const handler = () => {
      setComposerLeague(selectedLeague);
      setComposerOpen(true);
    };
    document.addEventListener('open-fan-pulse-composer', handler);
    return () => document.removeEventListener('open-fan-pulse-composer', handler);
  }, [selectedLeague]);

  // Cleanup preview object URLs
  useEffect(() => {
    return () => { mediaPreviewUrls.forEach(URL.revokeObjectURL); };
  }, [mediaPreviewUrls]);

  function openComposer() {
    setComposerLeague(selectedLeague);
    setComposerOpen(true);
  }

  function handleMediaUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    const next = [...mediaFiles, ...files].slice(0, 4);
    setMediaFiles(next);
    setMediaPreviewUrls(next.map(f => URL.createObjectURL(f)));
    e.target.value = '';
  }

  function removeMedia(index: number) {
    URL.revokeObjectURL(mediaPreviewUrls[index]);
    const nextFiles = mediaFiles.filter((_, i) => i !== index);
    setMediaFiles(nextFiles);
    setMediaPreviewUrls(nextFiles.map(f => URL.createObjectURL(f)));
  }

  const [isPosting, setIsPosting] = useState(false);

  async function handlePost() {
    if ((!postContent.trim() && mediaFiles.length === 0) || !isSignedIn) return;
    setIsPosting(true);
    try {
      // Step 1: upload media first and get permanent URLs
      let uploadedUrls: string[] = [];
      if (mediaFiles.length > 0) {
        uploadedUrls = await uploadMediaFiles(mediaFiles);
        if (uploadedUrls.length === 0 && mediaFiles.length > 0) {
          console.error('[handlePost] media upload failed — posting without media');
        }
      }

      // Step 2: create post with permanent URLs (await for error handling)
      await createPost.mutateAsync({
        content: postContent,
        leagueTag: composerLeague,
        mediaUrls: uploadedUrls,
      });

      // Step 3: reset state only after success
      setPostContent("");
      setMediaFiles([]);
      setMediaPreviewUrls([]);
      setComposerOpen(false);
    } catch (err) {
      console.error('[handlePost] failed:', err);
    } finally {
      setIsPosting(false);
    }
  }

  function handleFire(postId: string) {
    const key = `${postId}-fire`;
    if (reacted.has(key)) return;
    setReacted(prev => new Set([...prev, key]));
    queryClient.setQueriesData<Post[]>({ queryKey: ['fan-pulse-posts'] }, old =>
      old?.map(p => p.id === postId ? { ...p, fire_count: p.fire_count + 1 } : p)
    );
    fetch('/api/fan-pulse/fire', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId }),
    }).catch(() => {});
  }

  function handleRepost(postId: string) {
    if (reposted.has(postId)) return;
    setReposted(prev => new Set([...prev, postId]));
    queryClient.setQueriesData<Post[]>({ queryKey: ['fan-pulse-posts'] }, old =>
      old?.map(p => p.id === postId ? { ...p, repost_count: p.repost_count + 1 } : p)
    );
  }

  function toggleThread(postId: string) {
    setOpenReplies(prev => {
      const next = new Set(prev);
      next.has(postId) ? next.delete(postId) : next.add(postId);
      return next;
    });
  }

  const replySelectorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!showReplySelector) return;
    const handler = (e: MouseEvent) => {
      if (replySelectorRef.current && !replySelectorRef.current.contains(e.target as Node)) {
        setShowReplySelector(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showReplySelector]);

  const replyPermissionLabel = REPLY_OPTIONS.find(o => o.value === replyPermission)?.label ?? 'Everyone can reply';

  return (
    <>
      {/* ── Sticky header ───────────────────────────────── */}
      <div className="sticky top-0 z-10 bg-white/90 dark:bg-black/80 backdrop-blur-md px-4 py-3 border-b border-gray-200 dark:border-[#2f3336]">
        <h1 className="text-[20px] font-bold text-gray-900 dark:text-[#e7e9ea]">
          {lockedLeague ? `${lockedLeague.toUpperCase()} Pulse` : "Fan Pulse"}
        </h1>
      </div>

      {/* ── Sort tabs ───────────────────────────────────── */}
      <div className="flex border-b border-gray-200 dark:border-[#2f3336]">
        {(["Hot", "New"] as const).map((tab) => {
          const mode = tab.toLowerCase() as "hot" | "new";
          return (
            <button
              key={tab}
              onClick={() => setSortMode(mode)}
              className="flex-1 py-4 text-[15px] font-medium text-gray-500 dark:text-[#71767b] hover:bg-black/[0.03] dark:hover:bg-white/[0.03] relative transition-colors"
            >
              {sortMode === mode && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-[#1d9bf0] rounded-full" />
              )}
              <span className={sortMode === mode ? "text-gray-900 dark:text-[#e7e9ea]" : ""}>
                {tab === "Hot" ? "🔥 Hot" : "✨ New"}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── League filter ────────────────────────────────── */}
      {!lockedLeague && (
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar px-4 py-2 border-b border-gray-200 dark:border-[#2f3336]">
          {LEAGUES.map((lg) => (
            <button
              key={lg}
              onClick={() => setSelectedLeague(lg)}
              className={`px-4 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors ${
                selectedLeague === lg
                  ? "bg-[#007CB0] text-white"
                  : "text-gray-500 dark:text-[#71767b] border border-gray-200 dark:border-[#2f3336] hover:border-[#e7e9ea] hover:text-gray-900 dark:hover:text-[#e7e9ea]"
              }`}
            >
              {lg}
            </button>
          ))}
        </div>
      )}

      {/* ── Composer trigger ────────────────────────────── */}
      {isSignedIn ? (
        <div
          onClick={openComposer}
          className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-[#2f3336] cursor-text hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-[#333639] flex items-center justify-center text-gray-500 dark:text-[#71767b] flex-shrink-0">
              {clerkUsername?.[0]?.toUpperCase() ?? "?"}
            </div>
          )}
          <span className="text-[20px] text-gray-400 dark:text-[#71767b] select-none flex-1">
            {lockedLeague ? `What's happening in ${lockedLeague.toUpperCase()}?` : "What's your take?"}
          </span>
          <button className="ml-auto px-4 py-1.5 bg-[#1d9bf0] text-white font-bold rounded-full text-[14px]">
            Post
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-[#2f3336]">
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-[#333639] flex-shrink-0" />
          <span className="text-[20px] text-gray-400 dark:text-[#71767b] flex-1">What's your take?</span>
          <AuthGate tooltip="Sign in to post">
            <button className="ml-auto px-4 py-1.5 bg-[#1d9bf0] text-white font-bold rounded-full text-[14px]">
              Post
            </button>
          </AuthGate>
        </div>
      )}

      {/* ── Loading state ────────────────────────────────── */}
      {isLoading && (
        <div className="py-8 text-center text-[15px] text-gray-400 dark:text-[#71767b]">
          Loading posts…
        </div>
      )}

      {/* ── Post feed ───────────────────────────────────── */}
      {sortedPosts.map((post) => (
        <article
          key={post.id}
          className="flex gap-3 px-4 py-3 border-b border-gray-200 dark:border-[#2f3336] hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
        >
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-[#333639] overflow-hidden flex items-center justify-center text-lg">
              {post.user.avatar_url ? (
                <img src={post.user.avatar_url} alt={post.user.name} className="w-full h-full object-cover" />
              ) : (
                <span>{post.user.name?.[0]?.toUpperCase() ?? "?"}</span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-1.5 flex-wrap mb-0.5">
              <Link
                href={`/profile/${post.user.handle}`}
                onClick={(e) => e.stopPropagation()}
                className="font-bold text-[15px] text-gray-900 dark:text-[#e7e9ea] hover:underline"
              >
                {post.user.name}
              </Link>
              <Link
                href={`/profile/${post.user.handle}`}
                onClick={(e) => e.stopPropagation()}
                className="text-[15px] text-gray-500 dark:text-[#71767b] hover:underline"
              >
                @{post.user.handle}
              </Link>
              <span className="text-gray-400 dark:text-[#71767b]">·</span>
              <span className="text-[13px] text-gray-500 dark:text-[#71767b]">{relTime(post.created_at)}</span>
              <span className="ml-auto">
                <span className="text-[13px] px-2 py-0.5 rounded-full border border-gray-200 dark:border-[#2f3336] text-gray-500 dark:text-[#71767b]">
                  {post.league_tag}
                </span>
              </span>
            </div>

            <p className="text-[15px] leading-5 text-gray-900 dark:text-[#e7e9ea]">{post.content}</p>

            {post.media_urls && post.media_urls.length > 0 && (
              <MediaGrid files={post.media_urls} />
            )}

            {/* Action bar */}
            <div className="flex items-center justify-between max-w-[425px] -ml-2 mt-3">
              <ActionBtn
                icon={<ReplyIcon />}
                count={post.comment_count}
                hoverColor="blue"
                active={false}
                onClick={() => isSignedIn ? setReplyModalPost(post) : null}
              />
              <ActionBtn
                icon={<RepostIcon />}
                count={post.repost_count}
                hoverColor="green"
                active={reposted.has(post.id)}
                activeColor="text-emerald-400"
                onClick={() => handleRepost(post.id)}
              />
              <ActionBtn
                icon={<FireIcon />}
                count={post.fire_count}
                hoverColor="orange"
                active={reacted.has(`${post.id}-fire`)}
                activeColor="text-orange-500"
                onClick={() => handleFire(post.id)}
              />
              <ActionBtn
                icon={<ViewsIcon />}
                count={post.reactions?.wow ?? 0}
                hoverColor="blue"
                active={false}
                onClick={() => {}}
              />
            </div>

            {/* Show/hide inline thread */}
            {post.comment_count > 0 && (
              <button
                onClick={() => toggleThread(post.id)}
                className="mt-1 text-[13px] text-[#1d9bf0] hover:underline"
              >
                {openReplies.has(post.id)
                  ? "Hide replies"
                  : `View ${post.comment_count} ${post.comment_count === 1 ? "reply" : "replies"}`}
              </button>
            )}

            <ReplyThread postId={post.id} isOpen={openReplies.has(post.id)} />
          </div>
        </article>
      ))}

      {/* ── Empty state ──────────────────────────────────── */}
      {!isLoading && sortedPosts.length === 0 && (
        <div className="py-12 text-center text-[15px] text-gray-400 dark:text-[#71767b]">
          No posts yet — be the first to post!
        </div>
      )}

      {/* ── Reply modal ──────────────────────────────────── */}
      {replyModalPost && (
        <ReplyModal
          post={{
            id: replyModalPost.id,
            content: replyModalPost.content,
            authorName: replyModalPost.user.name,
            authorHandle: replyModalPost.user.handle,
            authorAvatar: replyModalPost.user.avatar_url,
          }}
          onClose={() => setReplyModalPost(null)}
          onSubmit={async (content, mediaUrls) => {
            await createReply.mutateAsync({ postId: replyModalPost.id, content, mediaUrls, depth: 0 });
            queryClient.setQueriesData<Post[]>({ queryKey: ['fan-pulse-posts'] }, old =>
              old?.map(p => p.id === replyModalPost.id ? { ...p, comment_count: p.comment_count + 1 } : p)
            );
            setOpenReplies(prev => new Set([...prev, replyModalPost.id]));
          }}
        />
      )}

      {/* ── Composer modal ───────────────────────────────── */}
      {composerOpen && (
        <div
          className="fixed inset-0 z-[100] flex flex-col items-center pt-8 sm:pt-14"
          style={{ background: "rgba(91,112,131,0.4)" }}
          onClick={(e) => e.target === e.currentTarget && setComposerOpen(false)}
        >
          <div className="bg-[#000000] w-full max-w-[600px] rounded-2xl overflow-hidden shadow-2xl mx-4">
            {/* Modal header */}
            <div className="flex items-center justify-between px-4 py-3">
              <button
                onClick={() => setComposerOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#e7e9ea]">
                  <path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z" />
                </svg>
              </button>
              <span className="text-[#1d9bf0] text-[15px] font-bold cursor-pointer hover:underline">
                Drafts
              </span>
            </div>

            {/* Composer body */}
            <div className="flex gap-3 px-4 pb-4">
              {avatarUrl ? (
                <img src={avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#333639] flex items-center justify-center text-[#71767b] flex-shrink-0">
                  {clerkUsername?.[0]?.toUpperCase() ?? "?"}
                </div>
              )}

              <div className="flex-1 min-w-0">
                {/* League selector synced with composerLeague */}
                {!lockedLeague && (
                  <div className="mb-2">
                    <select
                      value={composerLeague}
                      onChange={(e) => setComposerLeague(e.target.value)}
                      className="text-[13px] text-[#1d9bf0] bg-[#000000] border border-[#1d9bf0]/40 rounded-full px-3 py-1 outline-none cursor-pointer"
                    >
                      {LEAGUES.map((l) => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                  </div>
                )}

                <textarea
                  ref={textareaRef}
                  autoFocus
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handlePost(); }}
                  placeholder={lockedLeague ? `What's happening in ${lockedLeague.toUpperCase()}?` : "What's your take?"}
                  maxLength={280}
                  rows={3}
                  className="w-full bg-transparent text-[20px] text-[#e7e9ea] placeholder:text-[#71767b] resize-none outline-none leading-7 min-h-[80px]"
                />

                <MediaGrid files={mediaPreviewUrls} onRemove={removeMedia} />

                {/* Who can reply */}
                <div className="relative mt-2" ref={replySelectorRef}>
                  <button
                    onClick={() => setShowReplySelector(!showReplySelector)}
                    className="flex items-center gap-1 text-[#1d9bf0] text-[13px] font-medium hover:underline"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#1d9bf0]">
                      <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0-3a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                    </svg>
                    {replyPermissionLabel}
                  </button>

                  {showReplySelector && (
                    <div className="absolute z-10 top-full mt-1 bg-[#000000] border border-[#2f3336] rounded-2xl shadow-xl overflow-hidden w-[280px]">
                      <p className="px-4 pt-3 pb-1 text-[17px] font-bold text-[#e7e9ea]">Who can reply?</p>
                      {REPLY_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => { setReplyPermission(opt.value); setShowReplySelector(false); }}
                          className="flex items-center justify-between w-full px-4 py-3 hover:bg-white/[0.03] transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-[#1d9bf0] text-lg">{opt.icon}</span>
                            <span className="text-[15px] text-[#e7e9ea]">{opt.label}</span>
                          </div>
                          {replyPermission === opt.value && (
                            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#1d9bf0]">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom toolbar */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#2f3336]">
                  <div className="flex items-center gap-0.5 text-[#1d9bf0]">
                    <label className="p-2 hover:bg-[#1d9bf0]/10 rounded-full cursor-pointer transition-colors">
                      <input type="file" accept="image/*,video/*" multiple className="hidden" onChange={handleMediaUpload} />
                      <ImageIcon className="w-[18px] h-[18px]" />
                    </label>
                    <button className="p-2 hover:bg-[#1d9bf0]/10 rounded-full transition-colors">
                      <Film className="w-[18px] h-[18px]" />
                    </button>
                    <button className="p-2 hover:bg-[#1d9bf0]/10 rounded-full transition-colors">
                      <BarChart2 className="w-[18px] h-[18px]" />
                    </button>
                    <button className="p-2 hover:bg-[#1d9bf0]/10 rounded-full transition-colors">
                      <Smile className="w-[18px] h-[18px]" />
                    </button>
                    <button className="p-2 hover:bg-[#1d9bf0]/10 rounded-full transition-colors">
                      <CalendarClock className="w-[18px] h-[18px]" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <CharCounter length={postContent.length} max={280} />
                    <button
                      onClick={handlePost}
                      disabled={!postContent.trim() || isPosting || createPost.isPending}
                      className="px-5 py-2 bg-[#1d9bf0] text-white text-[15px] font-bold rounded-full disabled:opacity-50 hover:bg-[#1a8cd8] transition-colors"
                    >
                      {isPosting || createPost.isPending ? "Posting…" : "Post"}
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
