import Link from "next/link";
import { Article } from "@/types";
import { formatCount, timeAgo } from "@/lib/utils";

interface Props {
  article: Article;
}

export default function ArticleHero({ article }: Props) {
  return (
    <Link href={`/article/${article.slug}`} className="block group">
      {/* Hero image placeholder */}
      <div className="aspect-video w-full bg-gradient-to-br from-brand/20 to-brand-light/10 rounded-xl flex items-center justify-center text-7xl mb-4 overflow-hidden relative">
        🏟️
        {article.isTrending && (
          <span className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 bg-brand text-white text-xs font-bold rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Trending
          </span>
        )}
      </div>

      {/* Category tag */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-bold uppercase tracking-widest text-brand">
          {article.category ?? "Featured"}
        </span>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-black tracking-tighter leading-none text-surface-text group-hover:text-brand transition-colors mb-3">
        {article.title}
      </h1>

      {/* Excerpt */}
      {article.excerpt && (
        <p className="text-surface-muted text-sm leading-relaxed mb-3 line-clamp-2">
          {article.excerpt}
        </p>
      )}

      {/* Meta */}
      <div className="flex items-center gap-2 text-xs text-surface-muted">
        <div className="w-6 h-6 rounded-full bg-brand flex items-center justify-center text-white text-xs font-bold shrink-0">
          {article.byline[0]}
        </div>
        <span className="font-semibold">{article.byline}</span>
        <span>·</span>
        <span>{timeAgo(article.publishDate)}</span>
        <span>·</span>
        <span>{formatCount(article.views)} views</span>
      </div>
    </Link>
  );
}
