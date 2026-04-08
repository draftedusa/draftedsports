import Link from "next/link";

interface NativeAdPlacementProps {
  variant?: "feed" | "rail";
}

const FEED_ADS = [
  {
    sponsor: "ESPN+",
    headline: "Watch Every Game Live",
    body: "Stream NFL, NBA, MLB, NHL and more — all in one place.",
    cta: "Start Watching",
    ctaHref: "#",
    emoji: "📺",
    badge: "Sponsored",
  },
  {
    sponsor: "DraftKings",
    headline: "Get in the Action",
    body: "Build your lineup and compete for real cash. New user bonus available.",
    cta: "Play Now",
    ctaHref: "#",
    emoji: "🏆",
    badge: "Sponsored",
  },
  {
    sponsor: "Fanatics",
    headline: "Gear Up for Game Day",
    body: "Official jerseys, hats, and merch from every team. Ships fast.",
    cta: "Shop Now",
    ctaHref: "#",
    emoji: "👕",
    badge: "Sponsored",
  },
];

let adIndex = 0;

export default function NativeAdPlacement({ variant = "feed" }: NativeAdPlacementProps) {
  const ad = FEED_ADS[adIndex++ % FEED_ADS.length];

  if (variant === "rail") {
    return (
      <div className="bg-surface-200 border border-surface-300 rounded-xl p-4">
        <p className="text-[9px] font-bold uppercase tracking-widest text-surface-muted mb-2">{ad.badge}</p>
        <div className="flex items-start gap-3">
          <span className="text-2xl shrink-0">{ad.emoji}</span>
          <div>
            <p className="text-[10px] font-black text-brand uppercase tracking-wider mb-0.5">{ad.sponsor}</p>
            <p className="text-xs font-bold text-surface-text leading-snug mb-2">{ad.headline}</p>
            <p className="text-[10px] text-surface-muted leading-relaxed mb-3">{ad.body}</p>
            <Link
              href={ad.ctaHref}
              className="inline-block px-3 py-1.5 bg-brand hover:bg-brand/90 text-white text-[10px] font-bold rounded-lg transition-colors"
            >
              {ad.cta} →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Feed variant — full-width card
  return (
    <div className="relative bg-surface-200 border border-surface-300 rounded-xl p-4 overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none select-none flex items-center justify-end pr-4">
        <span className="text-8xl">{ad.emoji}</span>
      </div>

      <div className="relative flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-3">
          <span className="text-3xl shrink-0">{ad.emoji}</span>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <p className="text-[9px] font-bold uppercase tracking-widest text-surface-muted">{ad.badge}</p>
              <span className="text-surface-muted">·</span>
              <p className="text-[10px] font-black text-brand uppercase tracking-wider">{ad.sponsor}</p>
            </div>
            <p className="text-sm font-bold text-surface-text leading-snug">{ad.headline}</p>
            <p className="text-xs text-surface-muted mt-0.5 max-w-sm leading-relaxed">{ad.body}</p>
          </div>
        </div>
        <Link
          href={ad.ctaHref}
          className="shrink-0 px-4 py-2 bg-brand hover:bg-brand/90 text-white text-xs font-bold rounded-lg transition-colors"
        >
          {ad.cta} →
        </Link>
      </div>
    </div>
  );
}
