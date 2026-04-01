"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { useState, use } from "react";
import { articles } from "@/data/articles";
import { teams } from "@/data/teams";
import { tags } from "@/data/tags";
import { threads, comments } from "@/data/comments";
import { polls } from "@/data/polls";
import Panel from "@/components/ui/Panel";
import ArticleCard from "@/components/cards/ArticleCard";
import Badge from "@/components/ui/Badge";
import { formatCount, timeAgo } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export default function ArticlePage({ params }: Props) {
  const { slug } = use(params);
  const article = articles.find((a) => a.slug === slug);
  if (!article) notFound();

  const articleTags = tags.filter((t) => article.tagIds.includes(t.id));
  const articleTeams = teams.filter((t) => article.teamIds.includes(t.id));
  const related = articles.filter((a) => article.relatedArticleIds.includes(a.id));
  const articleThread = threads.find((t) => t.articleId === article.id);
  const threadComments = articleThread ? comments.filter((c) => c.threadId === articleThread.id) : [];
  const articlePoll = polls.find((p) => p.articleId === article.id);

  const [reactionCounts, setReactionCounts] = useState<Record<string, Record<string, number>>>({});
  const [articleReactions, setArticleReactions] = useState({ fire: 0, wow: 0 });
  const [newComment, setNewComment] = useState("");
  const [localComments, setLocalComments] = useState<typeof threadComments>([]);
  const [votedOption, setVotedOption] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [copyMsg, setCopyMsg] = useState("");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterDone, setNewsletterDone] = useState(false);

  function handleReaction(commentId: string, emoji: string) {
    setReactionCounts((prev) => ({
      ...prev,
      [commentId]: { ...prev[commentId], [emoji]: (prev[commentId]?.[emoji] ?? 0) + 1 },
    }));
  }

  function handleComment(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim()) return;
    setLocalComments((prev) => [
      {
        id: `local-${Date.now()}`,
        threadId: articleThread?.id ?? "",
        userId: "user-001",
        body: newComment.trim(),
        createdAt: new Date().toISOString(),
        reactions: { fire: 0, wow: 0, facts: 0, lol: 0 },
      },
      ...prev,
    ]);
    setNewComment("");
  }

  function handleCopyLink() {
    navigator.clipboard?.writeText(window.location.href).catch(() => {});
    setCopyMsg("Copied!");
    setTimeout(() => setCopyMsg(""), 2000);
  }

  function handleNewsletter(e: React.FormEvent) {
    e.preventDefault();
    setNewsletterDone(true);
  }

  const allComments = [...localComments, ...threadComments];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main article */}
        <div className="lg:col-span-2 space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-surface-muted">
            <Link href="/" className="hover:text-surface-muted">Home</Link>
            <span>/</span>
            {articleTags[0] && (
              <>
                <Link href={`/tag/${articleTags[0].slug}`} className="hover:text-surface-muted">{articleTags[0].name}</Link>
                <span>/</span>
              </>
            )}
            <span className="text-surface-muted truncate">{article.title.slice(0, 40)}…</span>
          </div>

          {/* Header */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {articleTags.map((tag) => (
                <Link key={tag.id} href={`/tag/${tag.slug}`}>
                  <Badge variant="default">{tag.name}</Badge>
                </Link>
              ))}
            </div>
            <h1 className="text-3xl font-black text-surface-text leading-tight mb-4">{article.title}</h1>

            {/* Byline + meta */}
            <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-surface-300">
              <div className="flex items-center gap-3 text-sm text-surface-muted">
                <div className="w-8 h-8 rounded-full bg-surface-300 flex items-center justify-center text-sm font-bold text-white">
                  {article.byline[0]}
                </div>
                <div>
                  <p className="font-semibold text-surface-text text-sm">{article.byline}</p>
                  <p className="text-xs text-surface-muted">
                    {new Date(article.publishDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                    {" · "}{article.readTime} min read{" · "}{formatCount(article.views)} views
                  </p>
                </div>
              </div>

              {/* Action row */}
              <div className="flex items-center gap-2">
                <button onClick={() => setArticleReactions((r) => ({ ...r, fire: r.fire + 1 }))}
                  className="flex items-center gap-1 px-3 py-1.5 bg-surface-300 hover:bg-surface-300 rounded text-sm transition-colors">
                  🔥 {articleReactions.fire > 0 ? articleReactions.fire : ""}
                </button>
                <button onClick={() => setArticleReactions((r) => ({ ...r, wow: r.wow + 1 }))}
                  className="flex items-center gap-1 px-3 py-1.5 bg-surface-300 hover:bg-surface-300 rounded text-sm transition-colors">
                  😮 {articleReactions.wow > 0 ? articleReactions.wow : ""}
                </button>
                <button onClick={() => setSaved(!saved)}
                  className={`px-3 py-1.5 rounded text-sm font-semibold transition-colors ${saved ? "bg-blue-600 text-white" : "bg-surface-300 text-surface-muted hover:text-surface-text hover:bg-surface-300"}`}>
                  {saved ? "✓ Saved" : "🔖 Save"}
                </button>
                <button onClick={handleCopyLink}
                  className="px-3 py-1.5 bg-surface-300 hover:bg-surface-300 text-surface-muted hover:text-surface-text rounded text-sm transition-colors">
                  {copyMsg || "🔗 Share"}
                </button>
              </div>
            </div>

            {/* Team chips */}
            {articleTeams.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {articleTeams.map((team) => (
                  <Link key={team.id} href={`/team/${team.slug}`}>
                    <span className="flex items-center gap-1.5 px-2 py-1 bg-surface-300 rounded text-xs text-surface-text hover:text-surface-text hover:bg-surface-300 transition-colors">
                      {team.logo} {team.name}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Hero placeholder */}
          <div className="w-full h-64 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center text-6xl">
            🏟️
          </div>

          {/* Body */}
          <div className="space-y-4">
            {article.body.split("\n\n").map((para, i) => (
              <p key={i} className="text-surface-text leading-relaxed text-base">{para}</p>
            ))}
          </div>

          {/* Social share row */}
          <div className="flex items-center gap-2 py-4 border-t border-b border-surface-300">
            <span className="text-xs text-surface-muted font-semibold uppercase tracking-wide mr-2">Share:</span>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-300 hover:bg-surface-300 text-surface-text hover:text-surface-text rounded text-xs font-semibold transition-colors"
            >
              𝕏 Post
            </a>
            <button onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-300 hover:bg-surface-300 text-surface-text hover:text-surface-text rounded text-xs font-semibold transition-colors">
              🔗 {copyMsg || "Copy Link"}
            </button>
          </div>

          {/* Poll */}
          {articlePoll && (
            <Panel title="Reader Poll" accent="border-blue-600">
              <p className="text-sm font-semibold text-surface-text mb-3">{articlePoll.question}</p>
              <div className="space-y-2">
                {articlePoll.options.map((opt) => {
                  const pct = Math.round((opt.votes / articlePoll.votes) * 100);
                  const isVoted = votedOption === opt.id;
                  return (
                    <button key={opt.id} onClick={() => setVotedOption(opt.id)} className="w-full text-left">
                      <div className={`relative rounded overflow-hidden border transition-colors ${isVoted ? "border-blue-500" : "border-surface-300 hover:border-gray-500"}`}>
                        <div className="absolute inset-y-0 left-0 bg-blue-900/40" style={{ width: `${pct}%` }} />
                        <div className="relative flex items-center justify-between px-3 py-2">
                          <span className="text-sm text-white">{opt.text}</span>
                          <span className="text-sm font-bold text-blue-400">{pct}%</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-surface-muted mt-2">{formatCount(articlePoll.votes)} votes</p>
            </Panel>
          )}

          {/* Newsletter CTA */}
          <div className="bg-gradient-to-r from-red-950/50 to-gray-900 border border-red-900/40 rounded-xl p-6">
            <h3 className="text-lg font-black text-surface-text mb-1">Never miss a story.</h3>
            <p className="text-sm text-surface-muted mb-4">Get the best of UNDRAFTED delivered to your inbox. No spam, unsubscribe any time.</p>
            {newsletterDone ? (
              <p className="text-green-400 font-semibold text-sm">✅ You're in! Check your inbox.</p>
            ) : (
              <form onSubmit={handleNewsletter} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 bg-surface-300 border border-surface-300 rounded-lg px-4 py-2.5 text-surface-text placeholder-gray-600 text-sm focus:outline-none focus:border-red-600"
                />
                <button type="submit" className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-surface-text font-bold text-sm rounded-lg transition-colors whitespace-nowrap">
                  Subscribe
                </button>
              </form>
            )}
          </div>

          {/* Comments */}
          <Panel
            title="Comments"
            titleRight={<span>{formatCount(allComments.length + (articleThread?.commentCount ?? 0))}</span>}
            accent="border-yellow-600"
          >
            <form onSubmit={handleComment} className="flex gap-2 mb-4">
              <input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts…"
                className="flex-1 bg-surface-300 border border-surface-300 rounded px-3 py-2 text-sm text-surface-text placeholder-gray-500 focus:outline-none focus:border-gray-500"
              />
              <button type="submit" className="px-4 py-2 bg-red-600 hover:bg-red-500 text-surface-text text-sm font-semibold rounded transition-colors">
                Post
              </button>
            </form>
            <div className="space-y-4">
              {allComments.map((cmt) => (
                <div key={cmt.id} className="border-b border-surface-300 pb-4 last:border-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-surface-text">@user</span>
                    <span className="text-xs text-surface-muted">{timeAgo(cmt.createdAt)}</span>
                  </div>
                  <p className="text-sm text-surface-text">{cmt.body}</p>
                  <div className="flex items-center gap-3 mt-2">
                    {(["fire", "wow", "facts", "lol"] as const).map((emoji) => {
                      const icons = { fire: "🔥", wow: "😮", facts: "💯", lol: "😂" };
                      const base = cmt.reactions[emoji] + (reactionCounts[cmt.id]?.[emoji] ?? 0);
                      return (
                        <button key={emoji} onClick={() => handleReaction(cmt.id, emoji)}
                          className="flex items-center gap-1 text-xs text-surface-muted hover:text-surface-text transition-colors">
                          {icons[emoji]} {formatCount(base)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {related.length > 0 && (
            <Panel title="Related Articles" accent="border-gray-600">
              <div className="space-y-4">
                {related.map((a) => (
                  <ArticleCard key={a.id} article={a} variant="compact" />
                ))}
              </div>
            </Panel>
          )}

          {/* Tag cloud */}
          {articleTags.length > 0 && (
            <Panel title="Topics" accent="border-surface-300">
              <div className="flex flex-wrap gap-2">
                {articleTags.map((tag) => (
                  <Link key={tag.id} href={`/tag/${tag.slug}`}>
                    <span className="px-3 py-1 bg-surface-300 hover:bg-surface-300 text-surface-text hover:text-surface-text rounded-full text-xs font-medium transition-colors">
                      {tag.name}
                    </span>
                  </Link>
                ))}
              </div>
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}
