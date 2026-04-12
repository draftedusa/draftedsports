"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { MessageCircle, Repeat2, Flame, Share } from "lucide-react";
import type { SocialPost, PostMedia } from "@/types/social";
import { profiles } from "@/data/profiles";
import { socialPosts } from "@/data/social-posts";
import { timeAgo, formatCount } from "@/lib/utils";

// ─────────────────────────────────────────────────────────
// Profile lookup map (module-level, computed once)
// ─────────────────────────────────────────────────────────
const profileMap = Object.fromEntries(profiles.map((p) => [p.id, p]));
const postMap    = Object.fromEntries(socialPosts.map((p) => [p.id, p]));

// ─────────────────────────────────────────────────────────
// Verified badge SVG
// ─────────────────────────────────────────────────────────
function VerifiedBadge({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-label="Verified">
      <path
        fillRule="evenodd"
        d="M16.403 12.652a3 3 0 0 0 0-5.304 3 3 0 0 0-3.75-3.751 3 3 0 0 0-5.305 0 3 3 0 0 0-3.751 3.75 3 3 0 0 0 0 5.305 3 3 0 0 0 3.75 3.751 3 3 0 0 0 5.305 0 3 3 0 0 0 3.751-3.75Zm-2.546-4.46a.75.75 0 0 0-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────
// MediaGrid — rounded-2xl containment, responsive 1-4 tiles
// ─────────────────────────────────────────────────────────
function MediaGrid({ items }: { items: PostMedia[] }) {
  const n = items.length;

  function MediaTile({ item, tall }: { item: PostMedia; tall?: boolean }) {
    const isVideo = item.type === "VIDEO" || item.type === "GIF";
    return (
      <div
        className={`relative bg-surface-300/50 overflow-hidden flex items-center justify-center ${
          tall ? "row-span-2" : ""
        }`}
        style={{ aspectRatio: n === 1 ? "16/9" : "1/1" }}
      >
        <span className="text-4xl opacity-40 select-none">
          {item.type === "VIDEO" ? "🎬" : item.type === "GIF" ? "🎞️" : "🖼️"}
        </span>
        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-black/60 flex items-center justify-center">
              <svg viewBox="0 0 20 20" fill="white" className="w-5 h-5 ml-0.5">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </div>
          </div>
        )}
        {item.type === "GIF" && (
          <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 bg-black/70 text-white text-[9px] font-bold rounded">
            GIF
          </span>
        )}
        {item.alt && <span className="sr-only">{item.alt}</span>}
      </div>
    );
  }

  // All grid wrappers get rounded-2xl + overflow-hidden for crisp containment
  if (n === 1) {
    return (
      <div className="mt-3 rounded-2xl overflow-hidden">
        <MediaTile item={items[0]} />
      </div>
    );
  }
  if (n === 2) {
    return (
      <div className="mt-3 grid grid-cols-2 gap-0.5 rounded-2xl overflow-hidden">
        {items.map((m) => <MediaTile key={m.id} item={m} />)}
      </div>
    );
  }
  if (n === 3) {
    return (
      <div className="mt-3 grid grid-cols-2 gap-0.5 rounded-2xl overflow-hidden">
        <MediaTile item={items[0]} tall />
        <MediaTile item={items[1]} />
        <MediaTile item={items[2]} />
      </div>
    );
  }
  return (
    <div className="mt-3 grid grid-cols-2 gap-0.5 rounded-2xl overflow-hidden">
      {items.slice(0, 4).map((m) => <MediaTile key={m.id} item={m} />)}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// QuotedPost — rounded-2xl border card
// ─────────────────────────────────────────────────────────
function QuotedPost({ postId }: { postId: string }) {
  const post   = postMap[postId];
  const author = post ? profileMap[post.authorId] : null;
  if (!post || !author) return null;

  return (
    <div className="mt-3 px-3 py-2.5 rounded-2xl border border-surface-300 dark:border-white/8 bg-surface-200/50 overflow-hidden">
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="text-sm leading-none">{author.avatar}</span>
        <span className="text-xs font-bold text-surface-text">{author.displayName}</span>
        {author.isVerified && (
          <VerifiedBadge className="w-3 h-3 text-brand shrink-0" />
        )}
        <span className="text-[10px] text-surface-muted">{author.handle}</span>
        <span className="text-[10px] text-surface-muted ml-auto">{timeAgo(post.createdAt)}</span>
      </div>
      <p className="text-xs text-surface-text leading-relaxed line-clamp-3">{post.body}</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// PostCard — main export
// ─────────────────────────────────────────────────────────
interface PostCardProps {
  post: SocialPost;
  hideLeagueTag?: boolean;
  compact?: boolean;
}

export default function PostCard({ post, hideLeagueTag = false, compact = false }: PostCardProps) {
  const [hyped,    setHyped]    = useState(false);
  const [reposted, setReposted] = useState(false);
  const [hypes,    setHypes]    = useState(post.likesCount);
  const [reposts,  setReposts]  = useState(post.repostsCount);

  const toggleHype = useCallback(() => {
    setHyped((v) => {
      setHypes((c) => c + (v ? -1 : 1));
      return !v;
    });
  }, []);

  const toggleRepost = useCallback(() => {
    setReposted((v) => {
      setReposts((c) => c + (v ? -1 : 1));
      return !v;
    });
  }, []);

  // Repost passthrough — render original with reposter banner
  if (post.repostId) {
    const original = postMap[post.repostId];
    const reposter = profileMap[post.authorId];
    if (!original) return null;
    return (
      <article className={`border-b border-surface-300 dark:border-white/5 ${compact ? "px-3 py-3" : "px-4 py-4"}`}>
        {reposter && (
          <div className="flex items-center gap-1.5 mb-2.5 ml-[60px]">
            <Repeat2 size={14} className="text-surface-muted" />
            <span className="text-[11px] text-surface-muted font-medium">
              {reposter.displayName} reposted
            </span>
          </div>
        )}
        <PostCard post={original} hideLeagueTag={hideLeagueTag} compact={compact} />
      </article>
    );
  }

  const author = profileMap[post.authorId];
  if (!author) return null;

  const replyingTo = post.replyToId ? profileMap[postMap[post.replyToId]?.authorId] : null;

  return (
    <article
      className={`border-b border-surface-300 dark:border-white/5 hover:bg-surface-200/30 transition-colors ${
        compact ? "px-3 py-3" : "px-4 py-4"
      }`}
    >
      <div className="flex gap-3">

        {/* ── Fixed-width left column: avatar ─────────── */}
        <div className="shrink-0 w-12">
          <Link
            href={`/profile/${author.handle.replace("@", "")}`}
            className="block w-12 h-12 rounded-full bg-surface-300/60 flex items-center justify-center text-2xl hover:opacity-80 transition-opacity overflow-hidden"
            aria-label={author.displayName}
          >
            {author.avatar}
          </Link>
        </div>

        {/* ── Right column: content ────────────────────── */}
        <div className="flex-1 min-w-0">

          {/* Header row */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-sm font-bold text-surface-text truncate">{author.displayName}</span>
            {author.isVerified && (
              <VerifiedBadge className="w-3.5 h-3.5 text-brand shrink-0" />
            )}
            <span className="text-[11px] text-surface-muted">{author.handle}</span>
            <span className="text-surface-muted text-[11px]">·</span>
            <span className="text-[11px] text-surface-muted">{timeAgo(post.createdAt)}</span>

            {!hideLeagueTag && post.leagueTag && (
              <span className="ml-auto text-[9px] font-bold uppercase tracking-wider text-surface-muted border border-surface-300 dark:border-white/8 rounded px-1.5 py-0.5 shrink-0">
                {post.leagueTag}
              </span>
            )}
          </div>

          {/* Reply context */}
          {replyingTo && (
            <p className="text-[11px] text-surface-muted mt-0.5">
              Replying to{" "}
              <Link href={`/profile/${replyingTo.handle.replace("@", "")}`} className="text-brand hover:underline">
                {replyingTo.handle}
              </Link>
            </p>
          )}

          {/* Body */}
          {post.body && (
            <p className="mt-1.5 text-[15px] leading-snug text-surface-text whitespace-pre-line">
              {post.body}
            </p>
          )}

          {/* Media — rounded-2xl containment */}
          {post.media && post.media.length > 0 && (
            <MediaGrid items={post.media} />
          )}

          {/* Quoted post — rounded-2xl containment */}
          {post.quoteId && <QuotedPost postId={post.quoteId} />}

          {/* ── Interaction bar ────────────────────────── */}
          <div className="flex items-center gap-5 mt-3 text-surface-muted">

            {/* Reply — blue */}
            <button
              className="flex items-center gap-1.5 group hover:text-blue-500 transition-colors"
              aria-label={`${post.repliesCount} replies`}
            >
              <span className="rounded-full p-1.5 group-hover:bg-blue-500/10 transition-colors">
                <MessageCircle size={18} />
              </span>
              <span className="text-xs tabular-nums">{formatCount(post.repliesCount)}</span>
            </button>

            {/* Repost — green */}
            <button
              onClick={toggleRepost}
              className={`flex items-center gap-1.5 group transition-colors ${
                reposted ? "text-green-500" : "hover:text-green-500"
              }`}
              aria-label={`${reposts} reposts`}
              aria-pressed={reposted}
            >
              <span className="rounded-full p-1.5 group-hover:bg-green-500/10 transition-colors">
                <Repeat2 size={18} />
              </span>
              <span className="text-xs tabular-nums">{formatCount(reposts)}</span>
            </button>

            {/* Hype — orange */}
            <button
              onClick={toggleHype}
              className={`flex items-center gap-1.5 group transition-colors ${
                hyped ? "text-orange-500" : "hover:text-orange-500"
              }`}
              aria-label={`${hypes} hypes`}
              aria-pressed={hyped}
            >
              <span className="rounded-full p-1.5 group-hover:bg-orange-500/10 transition-colors">
                <Flame size={18} />
              </span>
              <span className="text-xs tabular-nums">{formatCount(hypes)}</span>
            </button>

            {/* Share — blue */}
            <button
              className="flex items-center group hover:text-blue-500 transition-colors ml-auto"
              aria-label="Share"
            >
              <span className="rounded-full p-1.5 group-hover:bg-blue-500/10 transition-colors">
                <Share size={18} />
              </span>
            </button>

          </div>
        </div>
      </div>
    </article>
  );
}
