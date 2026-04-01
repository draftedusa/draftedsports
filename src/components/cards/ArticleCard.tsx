import Link from "next/link";
import { Article } from "@/types";
import { formatCount, truncate } from "@/lib/utils";

interface ArticleCardProps {
  article: Article;
  variant?: "default" | "featured" | "compact";
  isTrending?: boolean;
}

export default function ArticleCard({ article, variant = "default", isTrending }: ArticleCardProps) {
  const trending = isTrending ?? article.isTrending;

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
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-brand uppercase tracking-wide">Featured</span>
              <span className="text-xs text-surface-muted">· {article.readTime} min read</span>
            </div>
            <h2 className="text-lg font-black tracking-tighter leading-tight text-white mb-2">{article.title}</h2>
            <div className="flex items-center gap-3 text-xs text-white/80">
              <span>{article.byline}</span>
              <span>·</span>
              <span>{formatCount(article.views)} views</span>
            </div>
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
            <p className="text-xs text-surface-muted mt-1">{article.byline} · {formatCount(article.views)} views</p>
          </div>
        </div>
      </Link>
    );
  }

  // default
  return (
    <Link href={`/article/${article.slug}`}>
      <div className="bg-surface-200 border border-surface-300 rounded-xl overflow-hidden hover:border-brand/40 transition-colors cursor-pointer group">
        <div className="h-36 bg-gradient-to-br from-brand/10 to-brand-light/5 flex items-center justify-center text-4xl relative">
          🏟️
          {trending && (
            <span className="absolute top-2 left-2 w-2 h-2 rounded-full bg-brand animate-pulse" />
          )}
        </div>
        <div className="p-4">
          <h3 className="font-bold text-surface-text text-sm leading-snug mb-2 group-hover:text-brand transition-colors">{article.title}</h3>
          <p className="text-xs text-surface-muted mb-3 line-clamp-2">{truncate(article.body, 110)}</p>
          <div className="flex items-center justify-between text-xs text-surface-muted">
            <span>{article.byline}</span>
            <span>{formatCount(article.views)} views · {article.readTime} min</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
