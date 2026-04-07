import Link from "next/link";
import { Article } from "@/types";
import { formatCount, truncate } from "@/lib/utils";
import CreatorTag from "@/components/ui/CreatorTag";
import Kicker from "@/components/ui/Kicker";

interface ArticleCardProps {
  article: Article;
  variant?: "default" | "featured" | "compact" | "premium";
  isTrending?: boolean;
}

export default function ArticleCard({ article, variant = "default", isTrending }: ArticleCardProps) {
  const trending = isTrending ?? article.isTrending;
  const isPremium = variant === "premium" || article.category === "analysis";

  if (variant === "featured") {
    return (
      <Link href={`/article/${article.slug}`}>
        <div className="relative bg-surface-200 border border-surface-300 rounded-xl overflow-hidden hover:border-brand/40 transition-colors cursor-pointer h-64 flex flex-col justify-end">
          <div className="absolute inset-0 bg-gradient-to-br from-brand/10 to-brand-light/5" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
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
          <div className="w-14 h-14 rounded-lg bg-surface-200 shrink-0 flex items-center justify-center text-xl">
            🏟️
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

  // Default + Premium cards
  return (
    <Link href={`/article/${article.slug}`}>
      <div className={`bg-surface-200 border rounded-xl overflow-hidden hover:border-brand/40 transition-colors cursor-pointer group ${
        isPremium ? "border-brand/20" : "border-surface-300"
      }`}>
        <div className="h-36 bg-gradient-to-br from-brand/10 to-brand-light/5 flex items-center justify-center text-4xl relative">
          {isPremium ? "✨" : "🏟️"}
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
