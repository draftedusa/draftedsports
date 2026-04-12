"use client";

import Image from "next/image";
import { MessageCircle, Repeat2, Flame, Share } from "lucide-react";
import { leagues } from "@/data/leagues";

// ─────────────────────────────────────────────────────────
// League icon — emoji keyed by uppercase tag (NBA, NFL…)
// ─────────────────────────────────────────────────────────
const LEAGUE_EMOJI = Object.fromEntries(
  leagues.map((l) => [l.id.toUpperCase(), l.logo])
);

function LeagueIcon({ id }: { id: string }) {
  return (
    <span className="text-xs leading-none" aria-hidden>
      {LEAGUE_EMOJI[id.toUpperCase()] ?? "🏟️"}
    </span>
  );
}

// ─────────────────────────────────────────────────────────
// Verified badge — rendered only for PROPHET reputation
// ─────────────────────────────────────────────────────────
function VerifiedBadge({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
      aria-label="Verified"
    >
      <path
        fillRule="evenodd"
        d="M16.403 12.652a3 3 0 0 0 0-5.304 3 3 0 0 0-3.75-3.751 3 3 0 0 0-5.305 0 3 3 0 0 0-3.751 3.75 3 3 0 0 0 0 5.305 3 3 0 0 0 3.75 3.751 3 3 0 0 0 5.305 0 3 3 0 0 0 3.751-3.75Zm-2.546-4.46a.75.75 0 0 0-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────
// Avatar — falls back to initial when image is null
// ─────────────────────────────────────────────────────────
function Avatar({ image, name }: { image: string | null; name: string | null }) {
  if (image) {
    return (
      <Image
        src={image}
        alt={name ?? "user"}
        width={48}
        height={48}
        className="h-full w-full object-cover"
        // unoptimized: OAuth avatar hosts aren't in next.config remotePatterns
        unoptimized
      />
    );
  }
  return (
    <span className="flex h-full w-full items-center justify-center text-sm font-bold text-surface-muted">
      {name ? name.charAt(0).toUpperCase() : "?"}
    </span>
  );
}

// ─────────────────────────────────────────────────────────
// MediaAttachment — rounded-2xl container with overflow-hidden
// ─────────────────────────────────────────────────────────
interface MediaAttachmentProps {
  src?: string;
  alt?: string;
  type?: "image" | "video" | "gif";
}

function MediaAttachment({ type = "image", alt }: MediaAttachmentProps) {
  const isVideo = type === "video" || type === "gif";
  return (
    <div className="mt-3 rounded-2xl overflow-hidden bg-surface-300/50 aspect-video flex items-center justify-center">
      <span className="text-5xl opacity-40 select-none">
        {type === "video" ? "🎬" : type === "gif" ? "🎞️" : "🖼️"}
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
      {type === "gif" && (
        <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 bg-black/70 text-white text-[9px] font-bold rounded">
          GIF
        </span>
      )}
      {alt && <span className="sr-only">{alt}</span>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────
export interface PulseItemProps {
  author: {
    image: string | null;
    name: string | null;
    username?: string;
    reputation: string;
  };
  content: string;
  leagueId?: string;
  isThread?: boolean;
  timestamp: string;
  replyCount?: number;
  repostCount?: number;
  hypeCount?: number;
  media?: MediaAttachmentProps[];
  onReply?: () => void;
  onRepost?: () => void;
  onHype?: () => void;
  onShare?: () => void;
}

// ─────────────────────────────────────────────────────────
// PulseItem
// ─────────────────────────────────────────────────────────
export default function PulseItem({
  author,
  content,
  leagueId,
  isThread = false,
  timestamp,
  replyCount = 0,
  repostCount = 0,
  hypeCount = 0,
  media,
  onReply,
  onRepost,
  onHype,
  onShare,
}: PulseItemProps) {
  const handle = author.username ?? author.name ?? "user";

  return (
    // Flat post — no shadow, no rounded corners on the container itself
    <div className="flex w-full flex-col !border-b !border-surface-300 bg-transparent px-4 py-3 hover:bg-surface-200/30 transition-colors">

      {/* League context header */}
      {leagueId && (
        <div className="mb-1 flex items-center gap-2 pl-[60px] text-[11px] font-bold text-surface-muted uppercase tracking-widest">
          <LeagueIcon id={leagueId} />
          <span>{leagueId} Pulse</span>
        </div>
      )}

      <div className="flex gap-3">

        {/* ── Fixed-width left column ──────────────────── */}
        <div className="shrink-0 w-12 flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-surface-300 overflow-hidden">
            <Avatar image={author.image} name={author.name} />
          </div>
          {isThread && <div className="mt-2 w-0.5 grow bg-surface-300" />}
        </div>

        {/* ── Right column ─────────────────────────────── */}
        <div className="flex min-w-0 flex-1 flex-col">

          {/* Author line */}
          <div className="flex flex-wrap items-center gap-x-1 gap-y-0.5">
            <span className="font-bold text-surface-text">{author.name}</span>
            {author.reputation === "PROPHET" && (
              <VerifiedBadge className="h-4 w-4 shrink-0 text-blue-500" />
            )}
            <span className="truncate text-[11px] text-surface-muted">
              @{handle} · {timestamp}
            </span>
          </div>

          {/* Post body */}
          <p className="mt-1 text-[15px] leading-snug text-surface-text">
            {content}
          </p>

          {/* Media — rounded-2xl containment */}
          {media?.map((m, i) => (
            <MediaAttachment key={i} {...m} />
          ))}

          {/* ── Interaction bar ────────────────────────── */}
          <div className="mt-3 flex max-w-xs justify-between text-surface-muted">

            {/* Reply — blue */}
            <button
              onClick={onReply}
              className="group flex items-center gap-1.5 transition-colors hover:text-blue-500"
            >
              <span className="rounded-full p-1.5 group-hover:bg-blue-500/10 transition-colors">
                <MessageCircle size={18} />
              </span>
              <span className="text-xs tabular-nums">{replyCount}</span>
            </button>

            {/* Repost — green */}
            <button
              onClick={onRepost}
              className="group flex items-center gap-1.5 transition-colors hover:text-green-500"
            >
              <span className="rounded-full p-1.5 group-hover:bg-green-500/10 transition-colors">
                <Repeat2 size={18} />
              </span>
              <span className="text-xs tabular-nums">{repostCount}</span>
            </button>

            {/* Hype — orange */}
            <button
              onClick={onHype}
              className="group flex items-center gap-1.5 transition-colors hover:text-orange-500"
            >
              <span className="rounded-full p-1.5 group-hover:bg-orange-500/10 transition-colors">
                <Flame size={18} />
              </span>
              <span className="text-xs tabular-nums">{hypeCount}</span>
            </button>

            {/* Share — blue */}
            <button
              onClick={onShare}
              className="group flex items-center transition-colors hover:text-blue-500"
            >
              <span className="rounded-full p-1.5 group-hover:bg-blue-500/10 transition-colors">
                <Share size={18} />
              </span>
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
