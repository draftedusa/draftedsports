import type { ReactNode } from "react";

/**
 * LayoutGamma — 3-panel multimedia layout
 *
 * Desktop: [Left 240px scores/odds rail] [Center 1fr main video/story] [Right 280px fan pulse]
 * Mobile:  stacked — center first
 *
 * Left and right panels are narrow auxiliary rails (custom content, not ContentCard).
 * Center panel expands to hero width for ContentCard auto-variant.
 */
interface Props {
  left:   ReactNode;  // Scores / odds sidebar
  center: ReactNode;  // Main video or featured story
  right:  ReactNode;  // Fan Pulse or social feed
  className?: string;
}

export default function LayoutGamma({ left, center, right, className = "" }: Props) {
  return (
    <div
      className={`grid grid-cols-1 lg:grid-cols-[240px_1fr_280px] gap-5 items-start ${className}`}
    >
      {/* Left: Scores / Odds rail — sticky on desktop */}
      <div className="order-2 lg:order-1 @container lg:sticky lg:top-[88px]">
        {left}
      </div>

      {/* Center: Main content — shown first on mobile */}
      <div className="order-1 lg:order-2 @container">
        {center}
      </div>

      {/* Right: Fan Pulse feed — sticky on desktop */}
      <div className="order-3 @container lg:sticky lg:top-[88px]">
        {right}
      </div>
    </div>
  );
}
