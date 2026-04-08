import Link from "next/link";
import { Article } from "@/types";
import { formatCount, truncate } from "@/lib/utils";
import CreatorTag from "@/components/ui/CreatorTag";
import Kicker from "@/components/ui/Kicker";

interface ArticleCardProps {
  article: Article;
  variant?: "default" | "featured" | "compact" | "premium" | "side-by-side";
  isTrending?: boolean;
}

/** Pick a sport-appropriate thumbnail emoji from article tags/teams */
function getThumbnailEmoji(article: Article, isPremium: boolean): string {
  if (isPremium) return "✨";
  const tags = article.tagIds.join(" ");
  if (tags.includes("nfl") || tags.includes("football")) return "🏈";
  if (tags.includes("nba") || tags.includes("basketball")) return "🏀";
  if (tags.includes("mlb") || tags.includes("baseball")) return "⚾";
  if (tags.includes("nhl") || tags.includes("hockey")) return "🏒";
  if (tags.includes("mls") || tags.includes("soccer")) return "⚽";
  if (tags.includes("wnba")) return "🏀";
  if (tags.includes("college")) return "🎓";
  if (tags.includes("analysis") || tags.includes("film")) return "🎬";
  if (tags.includes("draft") || tags.includes("prospect")) return "📋";
  return "🏟️";
}

export default function ArticleCard({ article, variant = "default", isTrending }: ArticleCardProps) {
  const trending = isTrending ?? article.isTrending;
  const isPremium = variant === "premium" || article.category === "analysis";
  const thumbEmoji = getThumbnailEmoji(article, isPremium);

  if (variant === "featured") {
    return (
      <Link href={`/article/${article.slug}`}>
        <div className="relative bg-surface-200 border border-surface-300 rounded-xl overflow-hidden hover:border-brand/40 cursor-pointer h-64 flex flex-col justify-end card-lift">
          <div className="absolute inset-0 bg-gradient-to-br from-brand/10 to-brand-light/5" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-20 select-none">
            {thumbEmoji}
          </div>
          {trending && (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 bg-brand text-white text-xs font-bold rounded-full z-10">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Trending
            </div>
          )}
          <div className="relative p-5">
            <Kicker label={article.category ?? "Featured"} variant="brand" className="mb-2" />
            <h2 className="text-lg font-black tracking-tighter leading-tight text-white mb-2">{article.title}</h2>
            <CreatorTag byline={article.byline} className="text-white/80" />
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link href={`/article/${article.slug}`}>
        <div className="flex items-start gap-3 py-3 border-b border-surface-300 hover:bg-surface-200 rounded px-2 transition-colors cursor-pointer">
          <div className="w-14 h-14 rounded-lg bg-surface-300/50 shrink-0 flex items-center justify-center text-xl">
            {thumbEmoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              {trending && (
                <span className="w-2 h-2 rounded-full bg-brand animate-pulse shrink-0" />
              )}
              <p className="text-sm font-semibold text-surface-text leading-snug line-clamp-2">{article.title}</p>
            </div>
            <CreatorTag byline={article.byline} className="mt-1" />
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "side-by-side") {
    return (
      <Link href={`/article/${article.slug}`}>
        <div className="flex gap-3 p-3 bg-surface-200 border border-surface-300 rounded-xl hover:border-brand/40 transition-colors cursor-pointer group">
          <div className="w-20 h-20 rounded-lg bg-surface-300/50 shrink-0 flex items-center justify-center text-3xl">
            {thumbEmoji}
          </div>
          <div className="flex-1 min-w-0">
            {trending && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-brand mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                Trending
              </span>
            )}
            <h3 className="text-sm font-bold text-surface-text leading-snug line-clamp-2 group-hover:text-brand transition-colors">{article.title}</h3>
            <div className="flex items-center justify-between mt-2">
              <CreatorTag byline={article.byline} />
              <span className="text-[10px] text-surface-muted tabular-nums">{article.readTime}m</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Default + Premium cards
  return (
    <Link href={`/article/${article.slug}`}>
      <div className={`bg-surface-200 border rounded-xl overflow-hidden hover:border-brand/40 cursor-pointer group card-lift ${
        isPremium ? "border-brand/20" : "border-surface-300"
      }`}>
        <div className="h-36 bg-gradient-to-br from-surface-300/80 to-surface-200 flex items-center justify-center text-4xl relative">
          {thumbEmoji}
          {trending && (
            <span className="absolute top-2 left-2 w-2 h-2 rounded-full bg-brand animate-pulse" />
          )}
          {isPremium && (
            <span className="absolute top-2 right-2 bg-brand/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
              Premium
            </span>
          )}
        </div>
        <div className="p-4">
          {isPremium && <Kicker label="Exclusive Analysis" variant="brand" className="mb-1.5" />}
          <h3 className={`font-bold text-surface-text text-sm leading-snug mb-2 group-hover:text-brand transition-colors ${
            isPremium ? "font-serif" : ""
          }`}>{article.title}</h3>
          <p className="text-xs text-surface-muted mb-3 line-clamp-2">{truncate(article.body, 110)}</p>
          <div className="flex items-center justify-between">
            <CreatorTag byline={article.byline} showAvatar />
            <span className="text-[10px] text-surface-muted">{formatCount(article.views)} · {article.readTime}m</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
