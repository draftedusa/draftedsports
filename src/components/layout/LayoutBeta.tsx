import type { ReactNode } from "react";

/**
 * LayoutBeta — 2-column feature split
 *
 * Desktop: [Left 3fr large feature] [Right 2fr 2×2 supporting grid]
 * Mobile:  stacked — left first
 *
 * Each slot is wrapped in @container so ContentCard auto-adapts.
 */
interface Props {
  left:   ReactNode;
  right:  ReactNode;
  className?: string;
}

export default function LayoutBeta({ left, right, className = "" }: Props) {
  return (
    <div
      className={`grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6 items-start ${className}`}
    >
      {/* Left: large feature — hero ContentCard at this width */}
      <div className="@container">
        {left}
      </div>

      {/* Right: 2×2 supporting grid of teaser cards */}
      <div className="@container grid grid-cols-2 gap-4 content-start">
        {right}
      </div>
    </div>
  );
}
