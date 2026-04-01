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
  const [localReactions, setLocalReactions] = useState({ fire: 0, wow: 0 });
  const [newComment, setNewComment] = useState("");
  const [localComments, setLocalComments] = useState<typeof threadComments>([]);
  const [votedOption, setVotedOption] = useState<string | null>(null);

  function handleReaction(commentId: string, emoji: string) {
    setReactionCounts((prev) => ({
      ...prev,
      [commentId]: { ...prev[commentId], [emoji]: (prev[commentId]?.[emoji] ?? 0) + 1 },
    }));
  }

  function handleArticleReaction(emoji: "fire" | "wow") {
    setLocalReactions((prev) => ({ ...prev, [emoji]: prev[emoji] + 1 }));
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

  const allComments = [...localComments, ...threadComments];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main article */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {articleTags.map((tag) => (
                <Badge key={tag.id} variant="default">{tag.name}</Badge>
              ))}
            </div>
            <h1 className="text-3xl font-black text-white leading-tight mb-4">{article.title}</h1>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <span className="font-semibold text-gray-200">{article.byline}</span>
                <span>·</span>
                <span>{new Date(article.publishDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                <span>·</span>
                <span>{article.readTime} min read</span>
                <span>·</span>
                <span>{formatCount(article.views)} views</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleArticleReaction("fire")}
                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded text-sm transition-colors"
                >
                  🔥 {localReactions.fire > 0 ? localReactions.fire : "Fire"}
                </button>
                <button
                  onClick={() => handleArticleReaction("wow")}
                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded text-sm transition-colors"
                >
                  😮 {localReactions.wow > 0 ? localReactions.wow : "Wow"}
                </button>
              </div>
            </div>

            {/* Team badges */}
            {articleTeams.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {articleTeams.map((team) => (
                  <Link key={team.id} href={`/team/${team.slug}`}>
                    <span className="flex items-center gap-1.5 px-2 py-1 bg-gray-800 rounded text-xs text-gray-300 hover:text-white hover:bg-gray-700 transition-colors">
                      {team.logo} {team.name}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Placeholder hero image */}
          <div className="w-full h-64 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center text-6xl">
            🏟️
          </div>

          {/* Article body */}
          <div className="prose prose-invert max-w-none">
            {article.body.split("\n\n").map((para, i) => (
              <p key={i} className="text-gray-200 leading-relaxed mb-4 text-base">{para}</p>
            ))}
          </div>

          {/* Poll */}
          {articlePoll && (
            <Panel title="Reader Poll" accent="border-blue-600">
              <p className="text-sm font-semibold text-white mb-3">{articlePoll.question}</p>
              <div className="space-y-2">
                {articlePoll.options.map((opt) => {
                  const pct = Math.round((opt.votes / articlePoll.votes) * 100);
                  const isVoted = votedOption === opt.id;
                  return (
                    <button key={opt.id} onClick={() => setVotedOption(opt.id)} className="w-full text-left">
                      <div className={`relative rounded overflow-hidden border transition-colors ${isVoted ? "border-blue-500" : "border-gray-700 hover:border-gray-500"}`}>
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
              <p className="text-xs text-gray-500 mt-2">{formatCount(articlePoll.votes)} votes</p>
            </Panel>
          )}

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
                className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded transition-colors"
              >
                Post
              </button>
            </form>
            <div className="space-y-4">
              {allComments.map((cmt) => (
                <div key={cmt.id} className="border-b border-gray-800 pb-4 last:border-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-gray-300">@user</span>
                    <span className="text-xs text-gray-600">{timeAgo(cmt.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-200">{cmt.body}</p>
                  <div className="flex items-center gap-3 mt-2">
                    {(["fire", "wow", "facts", "lol"] as const).map((emoji) => {
                      const icons = { fire: "🔥", wow: "😮", facts: "💯", lol: "😂" };
                      const base = cmt.reactions[emoji] + (reactionCounts[cmt.id]?.[emoji] ?? 0);
                      return (
                        <button
                          key={emoji}
                          onClick={() => handleReaction(cmt.id, emoji)}
                          className="flex items-center gap-1 text-xs text-gray-500 hover:text-white transition-colors"
                        >
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
        </div>
      </div>
    </div>
  );
}
