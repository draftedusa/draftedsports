"use client";

import { useState, useRef, useCallback } from "react";
import { videoFeed, VideoItem } from "@/data/video-feed";
import VideoCard from "./VideoCard";

const LEAGUE_FILTERS = ["All", "NBA", "NFL", "MLB", "NHL"] as const;

export default function VideoFeed() {
  const [filter, setFilter] = useState<string>("All");
  const [page, setPage]     = useState(1);
  const ITEMS_PER_PAGE = 4;

  const filteredAll: VideoItem[] = filter === "All"
    ? videoFeed
    : videoFeed.filter((v) => v.league === filter);

  const visible = filteredAll.slice(0, page * ITEMS_PER_PAGE);
  const hasMore = visible.length < filteredAll.length;

  // Infinite scroll sentinel
  const sentinelRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const sentinelCallback = useCallback((node: HTMLDivElement | null) => {
    if (observerRef.current) observerRef.current.disconnect();
    if (!node) return;

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((p) => p + 1);
      }
    }, { threshold: 0.1 });

    observerRef.current.observe(node);
  }, [hasMore]);

  return (
    <div className="flex flex-col items-center w-full">
      {/* Filter pills */}
      <div className="flex items-center gap-2 mb-6 sticky top-[110px] z-40 bg-surface-100/80 backdrop-blur-sm py-2 px-4 rounded-full border border-surface-300">
        {LEAGUE_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => { setFilter(f); setPage(1); }}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
              filter === f
                ? "bg-brand text-white"
                : "text-surface-muted hover:text-surface-text"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Vertical snap-scroll feed */}
      <div className="w-full max-w-sm space-y-4 scroll-smooth">
        {visible.map((video, i) => (
          <VideoCard key={video.id} video={video} index={i} />
        ))}

        {/* Infinite scroll sentinel */}
        {hasMore && (
          <div
            ref={sentinelCallback}
            className="h-16 flex items-center justify-center"
          >
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-brand/40 animate-pulse"
                  style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}

        {!hasMore && filteredAll.length > 0 && (
          <div className="h-16 flex items-center justify-center">
            <p className="text-xs text-surface-muted">You&apos;re all caught up · {filteredAll.length} videos</p>
          </div>
        )}

        {filteredAll.length === 0 && (
          <div className="h-48 flex items-center justify-center">
            <p className="text-sm text-surface-muted">No videos for {filter} right now.</p>
          </div>
        )}
      </div>
    </div>
  );
}
