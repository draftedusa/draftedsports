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
        // unoptimized: OAuth avatar hosts (Google, Twitter) aren't in
        // next.config remotePatterns and we don't want to proxy them
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
  onReply,
  onRepost,
  onHype,
  onShare,
}: PulseItemProps) {
  const handle = author.username ?? author.name ?? "user";

  return (
    <div className="flex w-full flex-col border-b border-surface-300 bg-transparent px-4 py-3 hover:bg-surface-100/50 transition-colors">

      {/* Context header */}
      {leagueId && (
        <div className="mb-1 flex items-center gap-2 pl-12 text-[12px] font-bold text-surface-muted uppercase tracking-tight">
          <LeagueIcon id={leagueId} />
          <span>{leagueId} Pulse</span>
        </div>
      )}

      <div className="flex gap-3">

        {/* Left column: avatar + optional thread line */}
        <div className="flex shrink-0 flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-surface-300 overflow-hidden">
            <Avatar image={author.image} name={author.name} />
          </div>
          {isThread && <div className="mt-2 w-[2px] grow bg-surface-300" />}
        </div>

        {/* Right column: meta + body + actions */}
        <div className="flex min-w-0 grow flex-col">

          {/* Author line */}
          <div className="flex flex-wrap items-center gap-x-1 gap-y-0.5">
            <span className="font-bold text-surface-text">{author.name}</span>
            {author.reputation === "PROPHET" && (
              <VerifiedBadge className="h-4 w-4 shrink-0 text-blue-500" />
            )}
            <span className="truncate text-sm text-surface-muted">
              @{handle} · {timestamp}
            </span>
          </div>

          {/* Post body */}
          <p className="mt-1 text-[15px] leading-snug text-surface-text">
            {content}
          </p>

          {/* Action bar */}
          <div className="mt-3 flex max-w-md justify-between text-surface-muted">
            <button
              onClick={onReply}
              className="group flex items-center gap-2 transition-colors hover:text-blue-500"
            >
              <div className="rounded-full p-2 group-hover:bg-blue-500/10">
                <MessageCircle size={18} />
              </div>
              <span className="text-xs">{replyCount}</span>
            </button>

            <button
              onClick={onRepost}
              className="group flex items-center gap-2 transition-colors hover:text-green-500"
            >
              <div className="rounded-full p-2 group-hover:bg-green-500/10">
                <Repeat2 size={18} />
              </div>
              <span className="text-xs">{repostCount}</span>
            </button>

            <button
              onClick={onHype}
              className="group flex items-center gap-2 transition-colors hover:text-orange-500"
            >
              <div className="rounded-full p-2 group-hover:bg-orange-500/10">
                <Flame size={18} />
              </div>
              <span className="text-xs">{hypeCount}</span>
            </button>

            <button
              onClick={onShare}
              className="group flex items-center transition-colors hover:text-blue-500"
            >
              <div className="rounded-full p-2 group-hover:bg-blue-500/10">
                <Share size={18} />
              </div>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
