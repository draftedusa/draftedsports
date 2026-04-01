import Link from "next/link";
import { Article } from "@/types";
import { formatCount, truncate } from "@/lib/utils";

interface ArticleCardProps {
  article: Article;
  variant?: "default" | "featured" | "compact";
}

export default function ArticleCard({ article, variant = "default" }: ArticleCardProps) {
  if (variant === "featured") {
    return (
      <Link href={`/article/${article.slug}`}>
        <div className="relative bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-gray-600 transition-colors cursor-pointer h-64 flex flex-col justify-end">
          {/* Mock gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-950" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          <div className="relative p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-red-400 uppercase tracking-wide">Featured</span>
              <span className="text-xs text-gray-500">· {article.readTime} min read</span>
            </div>
            <h2 className="text-lg font-bold text-white leading-snug mb-2">{article.title}</h2>
            <div className="flex items-center gap-3 text-xs text-gray-400">
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
        <div className="flex items-start gap-3 py-3 border-b border-gray-800 hover:bg-gray-900/50 rounded px-2 transition-colors cursor-pointer">
          <div className="w-16 h-16 rounded bg-gray-800 shrink-0 flex items-center justify-center text-2xl">
            🏟️
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white leading-snug line-clamp-2">{article.title}</p>
            <p className="text-xs text-gray-500 mt-1">{article.byline} · {formatCount(article.views)} views</p>
          </div>
        </div>
      </Link>
    );
  }

  // default
  return (
    <Link href={`/article/${article.slug}`}>
      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-gray-600 transition-colors cursor-pointer">
        {/* Placeholder image area */}
        <div className="h-40 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-4xl">
          🏟️
        </div>
        <div className="p-4">
          <h3 className="font-bold text-white text-sm leading-snug mb-2">{article.title}</h3>
          <p className="text-xs text-gray-400 mb-3 line-clamp-2">{truncate(article.body, 110)}</p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{article.byline}</span>
            <span>{formatCount(article.views)} views · {article.readTime} min</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
