"use client";

import { useState, useRef, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import type { SocialPost } from "@/types/social";
import AuthGate from "@/components/auth/AuthGate";

const MAX_CHARS = 280;

// ─────────────────────────────────────────────────────────
// Tiny ring progress indicator for character count
// ─────────────────────────────────────────────────────────
function CharRing({ used, max }: { used: number; max: number }) {
  const pct  = Math.min(used / max, 1);
  const r    = 10;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;
  const remaining = max - used;
  const overLimit = used > max;
  const nearLimit = remaining <= 20;

  return (
    <div className="relative w-8 h-8 shrink-0 flex items-center justify-center">
      <svg viewBox="0 0 24 24" className="absolute inset-0 w-full h-full -rotate-90">
        {/* Track */}
        <circle
          cx="12" cy="12" r={r}
          fill="none"
          strokeWidth="2"
          className="stroke-surface-300"
        />
        {/* Progress */}
        <circle
          cx="12" cy="12" r={r}
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          className={
            overLimit  ? "stroke-red-500"    :
            nearLimit  ? "stroke-amber-400"  :
            "stroke-brand"
          }
          style={{ transition: "stroke-dasharray 0.1s ease" }}
        />
      </svg>
      {nearLimit && (
        <span
          className={`text-[10px] font-bold tabular-nums relative z-10 ${
            overLimit ? "text-red-500" : "text-amber-400"
          }`}
        >
          {overLimit ? `-${used - max}` : remaining}
        </span>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Pending media pill
// ─────────────────────────────────────────────────────────
function MediaPill({
  name,
  type,
  onRemove,
}: {
  name: string;
  type: string;
  onRemove: () => void;
}) {
  const icon =
    type.startsWith("video") ? "🎬" :
    type === "image/gif"     ? "🎞️" :
    "🖼️";

  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-brand/10 border border-brand/20 rounded-full text-[11px] font-medium text-brand">
      <span>{icon}</span>
      <span className="max-w-[120px] truncate">{name}</span>
      <button
        onClick={onRemove}
        className="ml-0.5 text-brand/60 hover:text-brand transition-colors"
        aria-label="Remove media"
      >
        ×
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Composer
// ─────────────────────────────────────────────────────────
interface ComposerProps {
  /** Called when user submits a post */
  onPost?: (draft: Pick<SocialPost, "body" | "media">) => void;
  placeholder?: string;
}

export default function Composer({
  onPost,
  placeholder = "What's happening in sports?",
}: ComposerProps) {
  const { user } = useUser();
  const avatarUrl = user?.imageUrl ?? null;
  const clerkUsername = (user?.publicMetadata as { username?: string } | undefined)?.username;

  const [body,   setBody]   = useState("");
  const [media,  setMedia]  = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const charCount = body.length;
  const canPost   = (body.trim().length > 0 || media !== null) && charCount <= MAX_CHARS;

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const el = e.currentTarget;
      setBody(el.value);
      // Auto-grow
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    },
    []
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] ?? null;
      setMedia(file);
      // Reset so same file can be re-selected
      e.target.value = "";
    },
    []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!canPost) return;
      onPost?.({
        body: body.trim(),
        media: media
          ? [{ id: `m-${Date.now()}`, url: URL.createObjectURL(media), type: "IMAGE", aspectRatio: "16:9", alt: media.name }]
          : undefined,
      });
      setBody("");
      setMedia(null);
      // Reset textarea height
      const ta = document.querySelector<HTMLTextAreaElement>("[data-composer-textarea]");
      if (ta) ta.style.height = "auto";
    },
    [canPost, body, media, onPost]
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="px-4 py-3.5 border-b border-surface-300 dark:border-white/5"
    >
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="shrink-0 w-9 h-9 rounded-full overflow-hidden bg-brand/20 flex items-center justify-center text-base">
          {avatarUrl
            ? <img src={avatarUrl} alt={clerkUsername ?? "You"} className="w-full h-full object-cover" />
            : <span>{clerkUsername ? clerkUsername[0].toUpperCase() : "👤"}</span>
          }
        </div>

        <div className="flex-1 min-w-0">
          {/* Textarea */}
          <textarea
            data-composer-textarea
            value={body}
            onChange={handleTextChange}
            placeholder={placeholder}
            rows={2}
            className="w-full resize-none bg-transparent text-sm text-surface-text placeholder:text-surface-muted/60 outline-none leading-relaxed py-1 min-h-[44px]"
            style={{ overflow: "hidden" }}
            aria-label="Compose post"
          />

          {/* Pending media pill */}
          {media && (
            <div className="mt-1.5 mb-2">
              <MediaPill
                name={media.name}
                type={media.type}
                onRemove={() => setMedia(null)}
              />
            </div>
          )}

          {/* Action bar */}
          <div className="flex items-center gap-2 mt-1.5 pt-2.5 border-t border-surface-300/60 dark:border-white/5">
            {/* Media upload button */}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="p-1.5 rounded-none text-brand hover:bg-brand/10 transition-colors"
              aria-label="Attach media"
              title="Photo / Video"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M1 5.25A2.25 2.25 0 0 1 3.25 3h13.5A2.25 2.25 0 0 1 19 5.25v9.5A2.25 2.25 0 0 1 16.75 17H3.25A2.25 2.25 0 0 1 1 14.75v-9.5Zm1.5 5.81v3.69c0 .414.336.75.75.75h13.5a.75.75 0 0 0 .75-.75v-2.69l-2.22-2.219a.75.75 0 0 0-1.06 0l-1.91 1.909-.48-.48a.75.75 0 0 0-1.06 0L6.5 13.062 4 10.562l-1.5 1.5Zm7-7.06a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" clipRule="evenodd" />
              </svg>
            </button>

            {/* GIF button */}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="px-2 py-1 rounded-none text-[10px] font-black text-brand border border-brand/30 hover:bg-brand/10 transition-colors leading-none"
              aria-label="Add GIF"
            >
              GIF
            </button>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Character ring + Post button */}
            {charCount > 0 && (
              <CharRing used={charCount} max={MAX_CHARS} />
            )}

            <AuthGate tooltip="Sign in to post">
              <button
                type="submit"
                disabled={!canPost}
                className="px-4 py-1.5 bg-brand hover:bg-brand/90 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-black rounded-full transition-colors"
              >
                Post
              </button>
            </AuthGate>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={handleFileChange}
        aria-hidden
      />
    </form>
  );
}
