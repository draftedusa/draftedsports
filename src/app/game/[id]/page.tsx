"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { useState, use } from "react";
import { games } from "@/data/games";
import { teams } from "@/data/teams";
import { articles } from "@/data/articles";
import { threads, comments } from "@/data/comments";
import { polls } from "@/data/polls";
import { GameStatusBadge } from "@/components/ui/Badge";
import Panel from "@/components/ui/Panel";
import { formatCount } from "@/lib/utils";

interface Props {
  params: Promise<{ id: string }>;
}

export default function GamePage({ params }: Props) {
  const { id } = use(params);
  const game = games.find((g) => g.id === id);
  if (!game) notFound();

  const homeTeam = teams.find((t) => t.id === game.homeTeamId)!;
  const awayTeam = teams.find((t) => t.id === game.awayTeamId)!;
  const gameThread = threads.find((t) => t.gameId === game.id);
  const gameComments = gameThread ? comments.filter((c) => c.threadId === gameThread.id) : [];
  const gamePoll = polls.find((p) => p.threadId === gameThread?.id);
  const relatedArticles = articles.filter((a) => a.gameId === game.id).slice(0, 3);

  const [reactionCounts, setReactionCounts] = useState<Record<string, Record<string, number>>>({});
  const [newComment, setNewComment] = useState("");
  const [localComments, setLocalComments] = useState<typeof gameComments>([]);
  const [votedOption, setVotedOption] = useState<string | null>(null);

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
        threadId: gameThread?.id ?? "",
        userId: "user-001",
        body: newComment.trim(),
        createdAt: new Date().toISOString(),
        reactions: { fire: 0, wow: 0, facts: 0, lol: 0 },
      },
      ...prev,
    ]);
    setNewComment("");
  }

  const allComments = [...localComments, ...gameComments];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Scoreboard */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <GameStatusBadge status={game.status} />
          {game.status === "live" && (
            <span className="text-gray-400 text-sm font-medium">
              {game.quarter} · {game.timeRemaining}
            </span>
          )}
          {game.status === "final" && (
            <span className="text-gray-500 text-sm">{game.date}</span>
          )}
          {game.status === "upcoming" && (
            <span className="text-gray-400 text-sm">{game.date}</span>
          )}
        </div>

        <div className="grid grid-cols-3 items-center gap-4">
          {/* Away Team */}
          <div className="text-center">
            <Link href={`/team/${awayTeam.slug}`}>
              <span className="text-6xl block mb-2">{awayTeam.logo}</span>
              <p className="text-lg font-bold text-white hover:text-red-400 transition-colors">{awayTeam.name}</p>
              <p className="text-sm text-gray-500">{awayTeam.record}</p>
            </Link>
          </div>

          {/* Score */}
          <div className="text-center">
            {game.status !== "upcoming" ? (
              <div className="flex items-center justify-center gap-4">
                <span className={`text-5xl font-black tabular-nums ${game.awayScore > game.homeScore ? "text-white" : "text-gray-600"}`}>
                  {game.awayScore}
                </span>
                <span className="text-2xl text-gray-700 font-light">—</span>
                <span className={`text-5xl font-black tabular-nums ${game.homeScore > game.awayScore ? "text-white" : "text-gray-600"}`}>
                  {game.homeScore}
                </span>
              </div>
            ) : (
              <p className="text-gray-400 text-lg font-semibold">vs</p>
            )}
          </div>

          {/* Home Team */}
          <div className="text-center">
            <Link href={`/team/${homeTeam.slug}`}>
              <span className="text-6xl block mb-2">{homeTeam.logo}</span>
              <p className="text-lg font-bold text-white hover:text-red-400 transition-colors">{homeTeam.name}</p>
              <p className="text-sm text-gray-500">{homeTeam.record}</p>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Play-by-play */}
        <div className="lg:col-span-2 space-y-6">
          {game.events.length > 0 && (
            <Panel title="Play-by-Play" accent="border-red-600">
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {[...game.events].reverse().map((evt) => (
                  <div key={evt.id} className="flex gap-3 items-start">
                    <span className="text-xs text-gray-500 tabular-nums shrink-0 pt-0.5 w-20">{evt.time}</span>
                    <div className="flex-1">
                      <p className={`text-sm ${evt.isHighlight ? "text-white font-semibold" : "text-gray-300"}`}>
                        {evt.isHighlight && <span className="text-orange-400 mr-1">🔥</span>}
                        {evt.description}
                      </p>
                    </div>
                    <span className="text-xs text-gray-600 uppercase shrink-0">{evt.type}</span>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          {/* Poll */}
          {gamePoll && (
            <Panel title="Fan Poll" accent="border-blue-600">
              <p className="text-sm font-semibold text-white mb-3">{gamePoll.question}</p>
              <div className="space-y-2">
                {gamePoll.options.map((opt) => {
                  const pct = Math.round((opt.votes / gamePoll.votes) * 100);
                  const isVoted = votedOption === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setVotedOption(opt.id)}
                      className="w-full text-left"
                    >
                      <div className={`relative rounded overflow-hidden border transition-colors ${isVoted ? "border-blue-500" : "border-gray-700 hover:border-gray-500"}`}>
                        <div
                          className="absolute inset-y-0 left-0 bg-blue-900/40"
                          style={{ width: `${pct}%` }}
                        />
                        <div className="relative flex items-center justify-between px-3 py-2">
                          <span className="text-sm text-white">{opt.text}</span>
                          <span className="text-sm font-bold text-blue-400">{pct}%</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-gray-500 mt-2">{formatCount(gamePoll.votes)} votes</p>
            </Panel>
          )}

          {/* Comments */}
          {gameThread && (
            <Panel
              title={gameThread.title}
              titleRight={<span className="text-gray-500">{formatCount(gameThread.commentCount + localComments.length)} comments</span>}
              accent="border-yellow-600"
            >
              {/* New comment */}
              <form onSubmit={handleComment} className="flex gap-2 mb-4">
                <input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Join the discussion…"
                  className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded transition-colors"
                >
                  Post
                </button>
              </form>

              <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                {allComments.map((cmt) => (
                  <div key={cmt.id} className="border-b border-gray-800 pb-4 last:border-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-gray-300">@user</span>
                      <span className="text-xs text-gray-600">
                        {new Date(cmt.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
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
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {relatedArticles.length > 0 && (
            <Panel title="Related Articles" accent="border-gray-600">
              <div className="space-y-3">
                {relatedArticles.map((art) => (
                  <Link key={art.id} href={`/article/${art.slug}`} className="block">
                    <p className="text-sm font-semibold text-white hover:text-red-400 transition-colors leading-snug">
                      {art.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{art.byline} · {formatCount(art.views)} views</p>
                  </Link>
                ))}
              </div>
            </Panel>
          )}

          {/* Mock Box Score */}
          {game.status !== "upcoming" && (
            <Panel title="Box Score (Mock)" accent="border-gray-600">
              <table className="w-full text-xs text-gray-300">
                <thead>
                  <tr className="text-gray-500 border-b border-gray-800">
                    <th className="text-left pb-2">Team</th>
                    <th className="text-right pb-2">Score</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-800/50">
                    <td className="py-1.5">{awayTeam.logo} {awayTeam.name}</td>
                    <td className="text-right font-bold text-white">{game.awayScore}</td>
                  </tr>
                  <tr>
                    <td className="py-1.5">{homeTeam.logo} {homeTeam.name}</td>
                    <td className="text-right font-bold text-white">{game.homeScore}</td>
                  </tr>
                </tbody>
              </table>
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}
