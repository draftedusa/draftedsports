import type { ReactNode } from "react";

/**
 * LayoutAlpha — 3-column editorial grid
 *
 * Desktop: [Left 200px stacked teasers] [Center 1fr hero] [Right 160px headline rail]
 * Mobile:  stacked — center first, then left, then right
 *
 * Each slot is wrapped in an @container so ContentCard auto-selects
 * its Hero / Teaser / Rail variant based on the slot's actual width.
 */
interface Props {
  left:   ReactNode;
  center: ReactNode;
  right:  ReactNode;
  className?: string;
}

export default function LayoutAlpha({ left, center, right, className = "" }: Props) {
  return (
    <div
      className={`grid grid-cols-1 lg:grid-cols-[200px_1fr_160px] gap-5 items-start ${className}`}
    >
      {/* Left: 2 stacked teaser cards — order-2 so center leads on mobile */}
      <div className="order-2 lg:order-1 @container space-y-4">
        {left}
      </div>

      {/* Center: Large Hero */}
      <div className="order-1 lg:order-2 @container">
        {center}
      </div>

      {/* Right: Narrow Headline Rail */}
      <div className="order-3 @container">
        {right}
      </div>
    </div>
  );
}
