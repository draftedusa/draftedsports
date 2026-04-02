import { notFound } from "next/navigation";
import { tags } from "@/data/tags";
import { articles } from "@/data/articles";
import ArticleCard from "@/components/cards/ArticleCard";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function TagPage({ params }: Props) {
  const { slug } = await params;
  const tag = tags.find((t) => t.slug === slug);
  if (!tag) notFound();

  const tagArticles = articles.filter((a) => a.tagIds.includes(tag.id));

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="border-b border-surface-300 pb-4">
        <p className="text-xs text-surface-muted uppercase tracking-widest mb-1">Topic</p>
        <h1 className="text-3xl font-black text-surface-text">{tag.name}</h1>
        <p className="text-sm text-surface-muted mt-1">{tagArticles.length} articles</p>
      </div>

      {tagArticles.length === 0 ? (
        <p className="text-surface-muted py-12 text-center">No articles for this topic yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tagArticles.map((art) => (
            <ArticleCard key={art.id} article={art} />
          ))}
        </div>
      )}
    </div>
  );
}

export function generateStaticParams() {
  return tags.map((t) => ({ slug: t.slug }));
}
