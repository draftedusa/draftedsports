import Link from "next/link";
import { articles } from "@/data/articles";
import { teams } from "@/data/teams";

/**
 * Simulates an algorithmic "Recommended for You" feed.
 * Sorts by: views (popularity signal) + trending flag + recency bonus.
 */
function algoScore(article: (typeof articles)[0]): number {
  const viewScore     = Math.log10(article.views + 1) * 10;
  const trendingBonus = article.isTrending ? 15 : 0;
  // Prefer articles with many related articles (engagement proxy)
  const engageBonus   = article.relatedArticleIds.length * 3;
  return viewScore + trendingBonus + engageBonus;
}

export default function RecommendedForYou({ limit = 5 }: { limit?: number }) {
  const recommended = [...articles]
    .sort((a, b) => algoScore(b) - algoScore(a))
    .slice(0, limit);

  const teamMap = Object.fromEntries(teams.map((t) => [t.id, t]));

  return (
    <div className="bg-surface-200 border border-surface-300 rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-surface-300 flex items-center gap-2">
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-brand">
          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
        </svg>
        <p className="text-xs font-black uppercase tracking-wider text-surface-text">Recommended</p>
        <span className="ml-auto text-[9px] text-surface-muted font-semibold uppercase tracking-wide">For You</span>
      </div>

      <div className="divide-y divide-surface-300">
        {recommended.map((article, i) => {
          const primaryTeam = teamMap[article.teamIds[0]];
          return (
            <Link key={article.id} href={`/article/${article.slug}`}>
              <div className="flex items-start gap-3 px-4 py-3 hover:bg-surface-300/40 transition-colors group">
                {/* Rank */}
                <span className="text-lg font-black text-brand/30 tabular-nums w-5 shrink-0 text-right mt-0.5">
                  {i + 1}
                </span>

                {/* Thumbnail */}
                <div className="w-12 h-10 rounded-lg bg-surface-300/60 flex items-center justify-center text-lg shrink-0">
                  {primaryTeam?.logo ?? "🏟️"}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-surface-text leading-snug line-clamp-2 group-hover:text-brand transition-colors">
                    {article.title}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    {article.isTrending && (
                      <span className="text-[9px] font-bold text-brand uppercase">Trending</span>
                    )}
                    <span className="text-[9px] text-surface-muted">{article.readTime}m read</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
