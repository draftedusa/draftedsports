"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { VideoItem, formatViews, formatDuration } from "@/data/video-feed";

const CREATOR_COLORS: Record<string, string> = {
  "Film Room":     "text-brand",
  "Big Board":     "text-emerald-500",
  "Dynasty Watch": "text-amber-500",
  "Inside Track":  "text-blue-400",
  "Power Rankings": "text-pink-500",
  "Top 10":        "text-red-400",
};

interface VideoCardProps {
  video: VideoItem;
  /** Index in feed — used to stagger intersection threshold */
  index: number;
}

export default function VideoCard({ video, index }: VideoCardProps) {
  const videoRef   = useRef<HTMLVideoElement>(null);
  const cardRef    = useRef<HTMLDivElement>(null);
  const [playing, setPlaying]   = useState(false);
  const [muted, setMuted]       = useState(true);
  const [progress, setProgress] = useState(0);
  const [liked, setLiked]         = useState(false);
  const [likeCount, setLikeCount] = useState(video.likes);
  const [reposted, setReposted]   = useState(false);
  const [repostCount, setRepostCount] = useState(Math.floor(video.likes * 0.12));
  const [commentCount] = useState(Math.floor(video.likes * 0.08));

  // IntersectionObserver: auto-play when ≥ 60% visible
  useEffect(() => {
    const card = cardRef.current;
    const vid  = videoRef.current;
    if (!card || !vid) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            vid.play().catch(() => {}); // catch AbortError on rapid scroll
            setPlaying(true);
          } else {
            vid.pause();
            setPlaying(false);
          }
        });
      },
      { threshold: 0.6 }
    );

    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  // Progress bar
  const handleTimeUpdate = useCallback(() => {
    const vid = videoRef.current;
    if (!vid || !vid.duration) return;
    setProgress((vid.currentTime / vid.duration) * 100);
  }, []);

  function togglePlay() {
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.paused) { vid.play().catch(() => {}); setPlaying(true); }
    else            { vid.pause(); setPlaying(false); }
  }

  function toggleMute() {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = !vid.muted;
    setMuted(vid.muted);
  }

  function handleLike() {
    setLiked((prev) => {
      setLikeCount((c) => prev ? c - 1 : c + 1);
      return !prev;
    });
  }

  function handleRepost() {
    setReposted((prev) => {
      setRepostCount((c) => prev ? c - 1 : c + 1);
      return !prev;
    });
  }

  const franchiseColor = CREATOR_COLORS[video.franchise] ?? "text-brand";
  // Alternate card height for visual variety
  const cardHeight = index % 3 === 0 ? "h-[85vh]" : index % 3 === 1 ? "h-[80vh]" : "h-[75vh]";

  return (
    <div
      ref={cardRef}
      className={`relative w-full ${cardHeight} max-h-[700px] bg-black rounded-2xl overflow-hidden snap-start flex-shrink-0 group`}
    >
      {/* Video element */}
      <video
        ref={videoRef}
        src={video.videoUrl}
        className="absolute inset-0 w-full h-full object-cover"
        loop
        muted={muted}
        playsInline
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />

      {/* Tap to play/pause */}
      <button
        className="absolute inset-0 w-full h-full z-10 cursor-pointer"
        onClick={togglePlay}
        aria-label={playing ? "Pause" : "Play"}
      />

      {/* Center play indicator (flashes on tap) */}
      {!playing && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white ml-1">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
      )}

      {/* Top bar: league + mute */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
        <span className="bg-black/60 backdrop-blur-sm text-white text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider">
          {video.league}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); toggleMute(); }}
          className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white transition-opacity hover:opacity-80 z-30"
          aria-label={muted ? "Unmute" : "Mute"}
        >
          {muted ? (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M16.5 12A4.5 4.5 0 0014 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0014 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
          )}
        </button>
      </div>

      {/* Bottom: creator info + actions */}
      <div className="absolute bottom-0 left-0 right-0 z-20 flex items-end gap-3 p-4">
        {/* Left: title + creator */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span className={`text-[10px] font-black uppercase tracking-widest ${franchiseColor}`}>
              {video.franchise}
            </span>
            <span className="text-white/40 text-[10px]">·</span>
            <span className="text-white/70 text-[10px] font-semibold">{video.creator}</span>
          </div>
          <h3 className="text-white font-black text-sm leading-tight line-clamp-2 mb-1">
            {video.title}
          </h3>
          <p className="text-white/60 text-xs line-clamp-1">{video.description}</p>
          <div className="flex items-center gap-3 mt-2 text-[10px] text-white/50">
            <span>{formatViews(video.views)} views</span>
            <span>·</span>
            <span>{formatDuration(video.duration)}</span>
          </div>
        </div>

        {/* Right: action buttons */}
        <div className="flex flex-col items-center gap-4 shrink-0 pb-2">
          {/* Like */}
          <button
            onClick={(e) => { e.stopPropagation(); handleLike(); }}
            className="flex flex-col items-center gap-1 z-30"
            aria-label="Like"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              liked ? "bg-red-500" : "bg-black/60 backdrop-blur-sm"
            }`}>
              <svg viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </div>
            <span className="text-[9px] text-white/70 font-bold">{formatViews(likeCount)}</span>
          </button>

          {/* Comment */}
          <button
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col items-center gap-1 z-30"
            aria-label="Comment"
          >
            <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
            </div>
            <span className="text-[9px] text-white/70 font-bold">{formatViews(commentCount)}</span>
          </button>

          {/* Repost */}
          <button
            onClick={(e) => { e.stopPropagation(); handleRepost(); }}
            className="flex flex-col items-center gap-1 z-30"
            aria-label="Repost"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${reposted ? "bg-emerald-500" : "bg-black/60 backdrop-blur-sm"}`}>
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-[9px] text-white/70 font-bold">{formatViews(repostCount)}</span>
          </button>

          {/* Share */}
          <button
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col items-center gap-1 z-30"
            aria-label="Share"
          >
            <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
              </svg>
            </div>
            <span className="text-[9px] text-white/70 font-bold">Share</span>
          </button>

          {/* Link to full article */}
          <Link
            href="/watch"
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col items-center gap-1 z-30"
            aria-label="More"
          >
            <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
            </div>
            <span className="text-[9px] text-white/70 font-bold">More</span>
          </Link>
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20 z-30">
        <div
          className="h-full bg-brand transition-none"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
