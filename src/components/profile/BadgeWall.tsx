"use client";

import { useMemo } from "react";

// ─────────────────────────────────────────────────────────
// Badge definitions
// ─────────────────────────────────────────────────────────
interface BadgeDef {
  id: string;
  emoji: string;
  name: string;
  description: string;
  rarity: "common" | "rare" | "legendary";
}

const BADGE_DEFS: BadgeDef[] = [
  {
    id: "early-bird",
    emoji: "🐦",
    name: "Early Bird",
    description: "Joined UNDRAFTED in 2026 — the founding season.",
    rarity: "rare",
  },
  {
    id: "sharp-eye",
    emoji: "👁️",
    name: "Sharp Eye",
    description: "Placed your first mock bet using Undrafted Edge.",
    rarity: "common",
  },
  {
    id: "super-fan",
    emoji: "⭐",
    name: "Super Fan",
    description: "Favorited 5 or more teams. True multi-sport devotion.",
    rarity: "legendary",
  },
];

const RARITY_STYLE: Record<BadgeDef["rarity"], { ring: string; glow: string; label: string }> = {
  common:    { ring: "#94a3b8", glow: "rgba(148,163,184,0.25)", label: "Common"    },
  rare:      { ring: "#8b5cf6", glow: "rgba(139,92,246,0.30)",  label: "Rare"      },
  legendary: { ring: "#f59e0b", glow: "rgba(245,158,11,0.35)",  label: "Legendary" },
};

// ─────────────────────────────────────────────────────────
// Badge tile
// ─────────────────────────────────────────────────────────
function BadgeTile({ def, earned }: { def: BadgeDef; earned: boolean }) {
  const r = RARITY_STYLE[def.rarity];

  return (
    <div
      className="relative flex flex-col items-center gap-2 p-3 rounded-xl text-center transition-all"
      style={
        earned
          ? {
              background: `linear-gradient(145deg, ${r.glow}, transparent)`,
              border: `1.5px solid ${r.ring}`,
              boxShadow: `0 0 16px ${r.glow}`,
            }
          : {
              background: "var(--surface-300)",
              border: "1px solid var(--surface-300)",
              opacity: 0.45,
              filter: "grayscale(1)",
            }
      }
      title={earned ? def.description : `Locked · ${def.description}`}
    >
      {/* Rarity pip */}
      {earned && (
        <span
          className="absolute top-1.5 right-1.5 text-[7px] font-black uppercase tracking-widest px-1 py-0.5 rounded"
          style={{ background: r.ring, color: "#fff" }}
        >
          {r.label}
        </span>
      )}

      {/* Lock icon overlay */}
      {!earned && (
        <span className="absolute top-1.5 right-1.5 text-[10px]">🔒</span>
      )}

      {/* Emoji icon */}
      <span className="text-2xl leading-none">{def.emoji}</span>

      {/* Name */}
      <span
        className="text-[10px] font-black leading-tight"
        style={{ color: earned ? r.ring : "var(--surface-muted)" }}
      >
        {def.name}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// BadgeWall
// ─────────────────────────────────────────────────────────
interface BadgeWallProps {
  /** ISO date string of when the user joined */
  joinedAt: string;
  /** Number of favorited teams */
  favoriteCount: number;
  className?: string;
}

export default function BadgeWall({
  joinedAt,
  favoriteCount,
  className = "",
}: BadgeWallProps) {
  const earnedIds = useMemo(() => {
    const set = new Set<string>();

    // Early Bird: joined in 2026
    if (joinedAt && new Date(joinedAt).getFullYear() >= 2026) {
      set.add("early-bird");
    }

    // Sharp Eye: user placed a mock bet (persisted in localStorage)
    if (
      typeof window !== "undefined" &&
      localStorage.getItem("undrafted-bets-placed") === "true"
    ) {
      set.add("sharp-eye");
    }

    // Super Fan: 5+ favorite teams
    if (favoriteCount >= 5) {
      set.add("super-fan");
    }

    return set;
  }, [joinedAt, favoriteCount]);

  const earnedCount = earnedIds.size;

  return (
    <section className={`bg-surface-200 border border-surface-300 rounded-2xl p-5 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-black uppercase tracking-wider text-surface-text">
            Achievements
          </h2>
          <p className="text-[10px] text-surface-muted mt-0.5">
            {earnedCount}/{BADGE_DEFS.length} unlocked
          </p>
        </div>
        {/* Mini progress bar */}
        <div className="w-24 h-1.5 rounded-full overflow-hidden bg-surface-300">
          <div
            className="h-full rounded-full bg-brand transition-all duration-700"
            style={{ width: `${(earnedCount / BADGE_DEFS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Badge grid */}
      <div className="grid grid-cols-3 gap-3">
        {BADGE_DEFS.map((def) => (
          <BadgeTile key={def.id} def={def} earned={earnedIds.has(def.id)} />
        ))}
      </div>

      {earnedCount === BADGE_DEFS.length && (
        <p className="text-center text-[10px] text-brand font-black mt-3 tracking-widest uppercase">
          All badges unlocked 🏆
        </p>
      )}
    </section>
  );
}
