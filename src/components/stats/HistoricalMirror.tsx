"use client";

import Link from "next/link";
import { useState } from "react";
import { Clock } from "lucide-react";

// ─────────────────────────────────────────────────────────
// Which current-season category slugs have a matching section
// in the archive's getMockArchive output (keyed by league slug).
// Categories NOT listed here get the dashed "not found" style.
// ─────────────────────────────────────────────────────────
const ARCHIVE_COVERAGE: Partial<Record<string, string[]>> = {
  nfl: ["passing-yards", "rushing-yards", "receiving-yards"],
  nba: ["points-per-game", "assists-per-game", "rebounds-per-game"],
};

interface HistoricalMirrorProps {
  slug: string;
  category: string;     // current URL slug, e.g. "passing-yards"
  categoryTitle: string; // display name,  e.g. "Passing Yards"
  year?: string;
}

export default function HistoricalMirror({
  slug,
  category,
  categoryTitle,
  year = "2024",
}: HistoricalMirrorProps) {
  const [open, setOpen] = useState(false);

  // Does the archive page have a dedicated section for this category?
  const hasData = ARCHIVE_COVERAGE[slug]?.includes(category) ?? false;

  // When data exists, the anchor scrolls directly to the matching board.
  // When missing, we land on the year page without an anchor — still useful.
  const href = hasData
    ? `/league/${slug}/stats/archive/${year}#${category}`
    : `/league/${slug}/stats/archive/${year}`;

  return (
    <div className="relative shrink-0">
      {/* Toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-colors ${
          open
            ? "border-brand text-brand bg-brand/5"
            : "border-surface-300 text-surface-muted hover:border-brand/50 hover:text-surface-text"
        }`}
      >
        <Clock size={11} />
        Historical
      </button>

      {/* Flyout card */}
      {open && (
        <div className="absolute right-0 top-full mt-2 z-20 w-56">
          <Link
            href={href}
            onClick={() => setOpen(false)}
            className={`flex flex-col gap-1.5 p-3 rounded-xl bg-surface-200 shadow-lg text-surface-text hover:text-brand transition-colors ${
              hasData
                ? "border border-surface-300"
                : "border-2 border-dashed border-surface-300"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Clock size={10} className="text-red-600 shrink-0" />
              <span className="text-[9px] font-black uppercase tracking-widest text-red-600">
                {year} Archive
              </span>
            </div>

            <span className="text-xs font-black leading-snug">
              Who led {categoryTitle} in {year}?
            </span>

            {!hasData && (
              <span className="text-[9px] text-surface-muted leading-tight mt-0.5">
                No archived data for this category — viewing full {year} stats
              </span>
            )}
          </Link>
        </div>
      )}
    </div>
  );
}
