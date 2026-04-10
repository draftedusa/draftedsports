"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
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
// Inline SVG icons (no extra dep)
// ─────────────────────────────────────────────────────────
const IcoReply = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 10.5a7.5 7.5 0 1 0 1.438 4.377L2.5 17.5" />
  </svg>
);
const IcoRepost = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M3 10V6a2 2 0 0 1 2-2h10M17 10v4a2 2 0 0 1-2 2H5M13 3l3 3-3 3M7 17l-3-3 3-3" />
  </svg>
);
const IcoHeart = ({ filled }: { filled: boolean }) => (
  <svg viewBox="0 0 20 20" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M3.172 5.172a4 4 0 0 1 5.656 0L10 6.343l1.172-1.171a4 4 0 1 1 5.656 5.656L10 17.657l-6.828-6.829a4 4 0 0 1 0-5.656Z" />
  </svg>
);
const IcoEye = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M2.458 10C3.732 6.943 6.67 5 10 5s6.268 1.943 7.542 5c-1.274 3.057-4.212 5-7.542 5s-6.268-1.943-7.542-5Z" />
    <circle cx="10" cy="10" r="2" />
  </svg>
);

// ─────────────────────────────────────────────────────────
// MediaGrid — responsive layout for 1-4 attachments
// ─────────────────────────────────────────────────────────
function MediaGrid({ items }: { items: PostMedia[] }) {
  const n = items.length;

  function MediaTile({ item, tall }: { item: PostMedia; tall?: boolean }) {
    const isVideo = item.type === "VIDEO" || item.type === "GIF";
    return (
      <div
        className={`relative bg-surface-300/50 rounded-lg overflow-hidden flex items-center justify-center ${
          tall ? "row-span-2" : ""
        }`}
        style={{ aspectRatio: n === 1 ? "16/9" : "1/1" }}
      >
        {/* Placeholder stand-in for real media */}
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
        {item.alt && (
          <span className="sr-only">{item.alt}</span>
        )}
      </div>
    );
  }

  if (n === 1) {
    return <div className="mt-3 rounded-xl overflow-hidden"><MediaTile item={items[0]} /></div>;
  }
  if (n === 2) {
    return (
      <div className="mt-3 grid grid-cols-2 gap-1 rounded-xl overflow-hidden">
        {items.map((m) => <MediaTile key={m.id} item={m} />)}
      </div>
    );
  }
  if (n === 3) {
    return (
      <div className="mt-3 grid grid-cols-2 gap-1 rounded-xl overflow-hidden">
        <MediaTile item={items[0]} tall />
        <MediaTile item={items[1]} />
        <MediaTile item={items[2]} />
      </div>
    );
  }
  // 4+
  return (
    <div className="mt-3 grid grid-cols-2 gap-1 rounded-xl overflow-hidden">
      {items.slice(0, 4).map((m) => <MediaTile key={m.id} item={m} />)}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// QuotedPost — mini card embedded in a quote-post
// ─────────────────────────────────────────────────────────
function QuotedPost({ postId }: { postId: string }) {
  const post    = postMap[postId];
  const author  = post ? profileMap[post.authorId] : null;
  if (!post || !author) return null;

  return (
    <div className="mt-3 px-3 py-2.5 rounded-xl border border-surface-300 dark:border-white/8 bg-surface-200/50">
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="text-sm leading-none">{author.avatar}</span>
        <span className="text-xs font-bold text-surface-text">{author.displayName}</span>
        {author.isVerified && (
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-brand shrink-0">
            <path fillRule="evenodd" d="M16.403 12.652a3 3 0 0 0 0-5.304 3 3 0 0 0-3.75-3.751 3 3 0 0 0-5.305 0 3 3 0 0 0-3.751 3.75 3 3 0 0 0 0 5.305 3 3 0 0 0 3.75 3.751 3 3 0 0 0 5.305 0 3 3 0 0 0 3.751-3.75Zm-2.546-4.46a.75.75 0 0 0-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
          </svg>
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
  /** Hide league tag badge (e.g. when already in a filtered feed) */
  hideLeagueTag?: boolean;
  /** Compact rail mode — reduces padding */
  compact?: boolean;
}

export default function PostCard({ post, hideLeagueTag = false, compact = false }: PostCardProps) {
  // ── Optimistic UI state ─────────────────────────────
  const [liked,     setLiked]     = useState(false);
  const [reposted,  setReposted]  = useState(false);
  const [likes,     setLikes]     = useState(post.likesCount);
  const [reposts,   setReposts]   = useState(post.repostsCount);

  const toggleLike = useCallback(() => {
    setLiked((v) => {
      setLikes((c) => c + (v ? -1 : 1));
      return !v;
    });
  }, []);

  const toggleRepost = useCallback(() => {
    setReposted((v) => {
      setReposts((c) => c + (v ? -1 : 1));
      return !v;
    });
  }, []);

  // ── Resolve repost → render original post ───────────
  if (post.repostId) {
    const original = postMap[post.repostId];
    const reposter = profileMap[post.authorId];
    if (!original) return null;
    return (
      <article className={`border-b border-surface-300 dark:border-white/5 ${compact ? "px-3 py-3" : "px-4 py-4"}`}>
        {/* Repost banner */}
        {reposter && (
          <div className="flex items-center gap-1.5 mb-2.5 ml-8">
            <IcoRepost />
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
        {/* Avatar */}
        <Link
          href={`/profile/${author.handle.replace("@", "")}`}
          className="shrink-0 w-9 h-9 rounded-full bg-surface-300/60 flex items-center justify-center text-xl hover:opacity-80 transition-opacity"
          aria-label={author.displayName}
        >
          {author.avatar}
        </Link>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-sm font-bold text-surface-text truncate">{author.displayName}</span>
            {author.isVerified && (
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-brand shrink-0">
                <path fillRule="evenodd" d="M16.403 12.652a3 3 0 0 0 0-5.304 3 3 0 0 0-3.75-3.751 3 3 0 0 0-5.305 0 3 3 0 0 0-3.751 3.75 3 3 0 0 0 0 5.305 3 3 0 0 0 3.75 3.751 3 3 0 0 0 5.305 0 3 3 0 0 0 3.751-3.75Zm-2.546-4.46a.75.75 0 0 0-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
              </svg>
            )}
            <span className="text-[11px] text-surface-muted">{author.handle}</span>
            <span className="text-surface-muted text-[11px]">·</span>
            <span className="text-[11px] text-surface-muted">{timeAgo(post.createdAt)}</span>

            {/* League tag badge */}
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
            <p className="mt-1.5 text-sm text-surface-text leading-relaxed whitespace-pre-line">
              {post.body}
            </p>
          )}

          {/* Media grid */}
          {post.media && post.media.length > 0 && (
            <MediaGrid items={post.media} />
          )}

          {/* Quoted post */}
          {post.quoteId && <QuotedPost postId={post.quoteId} />}

          {/* Engagement bar */}
          <div className="flex items-center gap-5 mt-3 text-surface-muted">
            {/* Replies */}
            <button
              className="flex items-center gap-1.5 group hover:text-brand transition-colors"
              aria-label={`${post.repliesCount} replies`}
            >
              <span className="group-hover:bg-brand/10 rounded-full p-1 transition-colors">
                <IcoReply />
              </span>
              <span className="text-[11px] tabular-nums">{formatCount(post.repliesCount)}</span>
            </button>

            {/* Reposts */}
            <button
              onClick={toggleRepost}
              className={`flex items-center gap-1.5 group transition-colors ${
                reposted ? "text-green-500" : "hover:text-green-500"
              }`}
              aria-label={`${reposts} reposts`}
              aria-pressed={reposted}
            >
              <span className="group-hover:bg-green-500/10 rounded-full p-1 transition-colors">
                <IcoRepost />
              </span>
              <span className="text-[11px] tabular-nums">{formatCount(reposts)}</span>
            </button>

            {/* Likes */}
            <button
              onClick={toggleLike}
              className={`flex items-center gap-1.5 group transition-colors ${
                liked ? "text-red-500" : "hover:text-red-500"
              }`}
              aria-label={`${likes} likes`}
              aria-pressed={liked}
            >
              <span className="group-hover:bg-red-500/10 rounded-full p-1 transition-colors">
                <IcoHeart filled={liked} />
              </span>
              <span className="text-[11px] tabular-nums">{formatCount(likes)}</span>
            </button>

            {/* Views */}
            <span
              className="flex items-center gap-1.5 ml-auto"
              aria-label={`${post.viewsCount} views`}
            >
              <IcoEye />
              <span className="text-[11px] tabular-nums">{formatCount(post.viewsCount)}</span>
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
