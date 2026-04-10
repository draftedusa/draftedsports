"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { SocialPost } from "@/types/social";
import { socialPosts } from "@/data/social-posts";
import { teams as legacyTeams } from "@/data/teams";
import PostCard from "./PostCard";
import Composer from "./Composer";

// ─────────────────────────────────────────────────────────
// Filter + sort helpers
// ─────────────────────────────────────────────────────────
const PAGE_SIZE = 6;

// Team id → leagueId lookup (used for favorites-mode league expansion)
const TEAM_LEAGUE_MAP = Object.fromEntries(legacyTeams.map((t) => [t.id, t.leagueId]));

function filterPosts(
  posts: SocialPost[],
  leagueId?: string,
  favoriteTeamIds?: string[]
): SocialPost[] {
  let filtered = [...posts];

  // ── League filter ────────────────────────────────────
  if (leagueId) {
    filtered = filtered.filter((p) => p.leagueTag === leagueId || p.repostId != null);
    // Exclude reposts whose original doesn't belong to this league
    filtered = filtered.filter((p) => {
      if (!p.repostId) return true;
      const original = posts.find((o) => o.id === p.repostId);
      return original?.leagueTag === leagueId;
    });
  }

  // ── Favorites filter ─────────────────────────────────
  if (favoriteTeamIds?.length) {
    // Derive which leagues are represented in the favorites list
    const favLeagues = new Set(
      favoriteTeamIds
        .map((id) => TEAM_LEAGUE_MAP[id])
        .filter((l): l is string => Boolean(l))
    );
    filtered = filtered.filter(
      (p) =>
        (p.teamId && favoriteTeamIds.includes(p.teamId)) ||
        (p.leagueTag && favLeagues.has(p.leagueTag))
    );
  }

  return filtered.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

// ─────────────────────────────────────────────────────────
// Loading skeleton — one faux post
// ─────────────────────────────────────────────────────────
function PostSkeleton() {
  return (
    <div className="px-4 py-4 border-b border-surface-300 dark:border-white/5">
      <div className="flex gap-3">
        <div className="skeleton skeleton-avatar w-9 h-9 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="skeleton skeleton-text w-32" />
          <div className="skeleton skeleton-text w-full" />
          <div className="skeleton skeleton-text w-4/5" />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// DynamicFeed
// ─────────────────────────────────────────────────────────
interface DynamicFeedProps {
  /** Filter to a single league (e.g. "nfl"). Omit for all-sport feed. */
  leagueId?: string;
  /** Show only posts from these team IDs (and their leagues). Personalized feed. */
  favoriteTeamIds?: string[];
  /** Hides the Composer at the top */
  hideComposer?: boolean;
  /** Compact post cards (less padding) */
  compact?: boolean;
  className?: string;
}

export default function DynamicFeed({
  leagueId,
  favoriteTeamIds,
  hideComposer = false,
  compact = false,
  className = "",
}: DynamicFeedProps) {
  const allPosts      = filterPosts(socialPosts, leagueId, favoriteTeamIds);
  const [posts, setPosts]         = useState<SocialPost[]>(allPosts.slice(0, PAGE_SIZE));
  const [page,  setPage]          = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [allLoaded, setAllLoaded] = useState(allPosts.length <= PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // ── Infinite scroll via IntersectionObserver ─────────
  useEffect(() => {
    if (allLoaded) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allLoaded, isLoading, page]);

  const loadMore = useCallback(() => {
    if (isLoading || allLoaded) return;
    setIsLoading(true);
    // Simulate network latency (mock)
    setTimeout(() => {
      const next = page + 1;
      const slice = allPosts.slice(0, next * PAGE_SIZE);
      setPosts(slice);
      setPage(next);
      setAllLoaded(slice.length >= allPosts.length);
      setIsLoading(false);
    }, 1200);
  }, [allPosts, isLoading, allLoaded, page]);

  // ── Optimistic post prepend from Composer ────────────
  const handleNewPost = useCallback(
    (draft: Pick<SocialPost, "body" | "media">) => {
      const newPost: SocialPost = {
        id: `local-${Date.now()}`,
        authorId: "prof-001", // current user placeholder
        body: draft.body,
        media: draft.media,
        createdAt: new Date().toISOString(),
        leagueTag: leagueId,
        likesCount: 0,
        repliesCount: 0,
        repostsCount: 0,
        quotesCount: 0,
        viewsCount: 0,
      };
      setPosts((prev) => [newPost, ...prev]);
    },
    [leagueId]
  );

  return (
    <div className={`flex flex-col ${className}`}>
      {/* ── Composer ──────────────────────────────────── */}
      {!hideComposer && (
        <Composer
          onPost={handleNewPost}
          placeholder={leagueId ? `What's happening in ${leagueId.toUpperCase()}?` : undefined}
        />
      )}

      {/* ── Feed header ───────────────────────────────── */}
      <div className="px-4 py-2.5 border-b border-surface-300 dark:border-white/5 flex items-center justify-between">
        <span className="text-xs font-black uppercase tracking-widest text-surface-muted">
          {favoriteTeamIds?.length
            ? "My Feed"
            : leagueId
            ? `${leagueId.toUpperCase()} Pulse`
            : "Fan Pulse"}
        </span>
        <span className="text-[10px] text-surface-muted">{allPosts.length} posts</span>
      </div>

      {/* ── Post list ─────────────────────────────────── */}
      {posts.length === 0 ? (
        <div className="px-4 py-10 text-center">
          <p className="text-sm text-surface-muted">No posts yet. Be the first!</p>
        </div>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            hideLeagueTag={!!leagueId}
            compact={compact}
          />
        ))
      )}

      {/* ── Infinite scroll sentinel + loading state ──── */}
      {!allLoaded && (
        <div ref={sentinelRef}>
          {isLoading ? (
            <>
              <PostSkeleton />
              <PostSkeleton />
            </>
          ) : (
            /* Invisible sentinel trigger */
            <div className="h-4" aria-hidden />
          )}
        </div>
      )}

      {allLoaded && posts.length > 0 && (
        <div className="px-4 py-6 text-center">
          <p className="text-xs text-surface-muted">You're all caught up ·{" "}
            <button
              onClick={() => { setPosts(allPosts.slice(0, PAGE_SIZE)); setPage(1); setAllLoaded(allPosts.length <= PAGE_SIZE); }}
              className="text-brand hover:underline"
            >
              Refresh
            </button>
          </p>
        </div>
      )}
    </div>
  );
}
