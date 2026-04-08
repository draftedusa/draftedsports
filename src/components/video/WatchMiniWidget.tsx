"use client";

import Link from "next/link";
import { videoFeed, formatViews, formatDuration } from "@/data/video-feed";

interface WatchMiniWidgetProps {
  /** Max videos to show */
  limit?: number;
  /** League filter — if provided, only show videos matching that league */
  league?: "NBA" | "NFL" | "MLB" | "NHL" | "ALL";
  /** Heading to display */
  title?: string;
}

export default function WatchMiniWidget({
  limit = 4,
  league,
  title = "Watch & Studio",
}: WatchMiniWidgetProps) {
  const videos = (
    league
      ? videoFeed.filter((v) => v.league === league || v.league === "ALL")
      : videoFeed
  ).slice(0, limit);

  return (
    <div className="bg-surface-200 border border-surface-300 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-surface-300">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-brand">
            <path d="M4 4l16 8-16 8V4z" />
          </svg>
          <span className="text-xs font-black uppercase tracking-wider text-surface-text">{title}</span>
        </div>
        <Link href="/watch" className="text-[10px] font-bold text-brand hover:text-brand/80 transition-colors">
          See All →
        </Link>
      </div>

      {/* Video list */}
      <div className="divide-y divide-surface-300">
        {videos.map((video) => (
          <Link key={video.id} href="/watch">
            <div className="flex items-center gap-3 px-4 py-3 hover:bg-surface-300/40 transition-colors group">
              {/* Thumbnail */}
              <div className="w-16 h-12 rounded-lg bg-surface-300/60 shrink-0 flex items-center justify-center text-2xl relative">
                {video.thumbnailEmoji}
                {/* Play overlay */}
                <div className="absolute inset-0 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                {/* Duration badge */}
                <span className="absolute bottom-0.5 right-0.5 text-[9px] font-bold text-white bg-black/70 px-1 rounded">
                  {formatDuration(video.duration)}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-surface-text leading-snug line-clamp-2 group-hover:text-brand transition-colors">
                  {video.title}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[10px] text-brand font-semibold">{video.franchise}</span>
                  <span className="text-surface-muted text-[10px]">·</span>
                  <span className="text-[10px] text-surface-muted">{formatViews(video.views)}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
