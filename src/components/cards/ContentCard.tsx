import Link from "next/link";
import type { Article } from "@/types";
import { formatCount } from "@/lib/utils";

// ─────────────────────────────────────────────────────────
// Container query breakpoints (respond to @container ancestor)
//   Rail   → container  <  162px  (default styles, no prefix)
//   Teaser → container  ≥  162px  (@[162px]:)
//   Hero   → container  ≥  320px  (@[320px]:)
// ─────────────────────────────────────────────────────────

function sportEmoji(article: Article): string {
  const tags = article.tagIds.join(" ");
  if (tags.includes("nfl") || tags.includes("football"))  return "🏈";
  if (tags.includes("nba") || tags.includes("basketball")) return "🏀";
  if (tags.includes("mlb") || tags.includes("baseball"))  return "⚾";
  if (tags.includes("nhl") || tags.includes("hockey"))    return "🏒";
  if (tags.includes("mls") || tags.includes("soccer"))    return "⚽";
  if (tags.includes("wnba"))                               return "🏀";
  if (tags.includes("college"))                            return "🎓";
  if (tags.includes("analysis") || tags.includes("film")) return "🎬";
  return "🏟️";
}

// ─────────────────────────────────────────────────────────
// ContentCard — drops into any @container slot and adapts
// ─────────────────────────────────────────────────────────
export default function ContentCard({ article }: { article: Article }) {
  const emoji   = sportEmoji(article);
  const isPremium = article.category === "analysis";

  return (
    <Link
      href={`/article/${article.slug}`}
      className={`group block bg-surface-200 border rounded-xl overflow-hidden transition-colors card-lift ${
        isPremium ? "border-brand/20" : "border-surface-300 hover:border-brand/40"
      }`}
    >
      {/* ── Thumbnail image — hidden on Rail, shown on Teaser+ ── */}
      <div
        className={[
          // Rail: hidden
          "hidden",
          // Teaser: visible at fixed height
          "@[162px]:flex @[162px]:items-center @[162px]:justify-center",
          "@[162px]:h-24 @[162px]:bg-gradient-to-br @[162px]:from-surface-300/80 @[162px]:to-surface-200",
          // Hero: taller image
          "@[320px]:h-48",
          "relative",
        ].join(" ")}
      >
        <span
          className={[
            "select-none opacity-50 text-5xl",
            "@[320px]:text-7xl",
          ].join(" ")}
        >
          {emoji}
        </span>

        {article.isTrending && (
          <span className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 bg-brand text-white text-[9px] font-bold rounded-full z-10">
            <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
            Trending
          </span>
        )}

        {isPremium && (
          <span className="absolute top-2 right-2 bg-brand/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
            Premium
          </span>
        )}
      </div>

      {/* ── Body ─────────────────────────────────────────────── */}
      <div
        className={[
          // Rail: horizontal flex row
          "flex items-center gap-2 px-2.5 py-2",
          // Teaser+: block padding
          "@[162px]:block @[162px]:px-3 @[162px]:py-3",
        ].join(" ")}
      >
        {/* Rail-only emoji thumbnail (hidden in Teaser+) */}
        <div
          className={[
            "w-8 h-8 shrink-0 rounded-md bg-surface-300/60 flex items-center justify-center text-base",
            "@[162px]:hidden",
          ].join(" ")}
        >
          {emoji}
        </div>

        <div className="flex-1 min-w-0">
          {/* Category kicker — Teaser+ only */}
          {article.category && (
            <p
              className={[
                "hidden",
                "@[162px]:block text-[9px] font-black uppercase tracking-widest text-brand mb-1",
              ].join(" ")}
            >
              {article.category}
            </p>
          )}

          {/* Title — size scales with variant */}
          <h3
            className={[
              // Rail
              "text-[10px] font-semibold text-surface-text leading-snug line-clamp-2",
              "group-hover:text-brand transition-colors",
              // Teaser
              "@[162px]:text-xs @[162px]:font-bold @[162px]:line-clamp-3",
              // Hero
              "@[320px]:text-base @[320px]:font-black @[320px]:tracking-tight",
              "@[320px]:leading-tight @[320px]:line-clamp-4",
            ].join(" ")}
          >
            {article.title}
          </h3>

          {/* Excerpt — Hero only */}
          {article.excerpt && (
            <p
              className={[
                "hidden",
                "@[320px]:block text-xs text-surface-muted mt-1.5 line-clamp-2 leading-relaxed",
              ].join(" ")}
            >
              {article.excerpt}
            </p>
          )}

          {/* Meta row */}
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[9px] text-surface-muted truncate">
              {article.byline}
            </span>
            <span
              className={[
                "hidden",
                "@[162px]:inline text-[9px] text-surface-muted",
              ].join(" ")}
            >
              · {formatCount(article.views)}
            </span>
            <span
              className={[
                "hidden",
                "@[320px]:inline text-[9px] text-surface-muted",
              ].join(" ")}
            >
              · {article.readTime}m
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
