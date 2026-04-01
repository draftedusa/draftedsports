import Link from "next/link";
import { articles } from "@/data/articles";
import { topArticles } from "@/lib/utils";

export default function TrendingList() {
  const trending = topArticles(articles, 8).slice(0, 8);

  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-surface-muted mb-3">Trending</p>
      <ol className="space-y-3">
        {trending.map((article, i) => (
          <li key={article.id} className="flex items-start gap-3">
            <span
              className="text-3xl font-black leading-none shrink-0 text-surface-300"
              style={{ WebkitTextStroke: "1px var(--brand)", color: "transparent" }}
            >
              {i + 1}
            </span>
            <Link href={`/article/${article.slug}`} className="group">
              <p className="text-sm font-semibold text-surface-text group-hover:text-brand transition-colors leading-snug line-clamp-2">
                {article.title}
              </p>
              <p className="text-xs text-surface-muted mt-0.5">{article.byline}</p>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
