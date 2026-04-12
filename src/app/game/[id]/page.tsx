"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { useState, use } from "react";
import { games } from "@/data/games";
import { teams } from "@/data/teams";
import { articles } from "@/data/articles";
import { threads, comments } from "@/data/comments";
import { polls } from "@/data/polls";
import { odds } from "@/data/odds";
import { transactions } from "@/data/transactions";
import PlayByPlay from "@/components/live/PlayByPlay";
import GameInsightWidget from "@/components/live/GameInsightWidget";
import { GameStatusBadge } from "@/components/ui/Badge";
import Panel from "@/components/ui/Panel";
import { formatCount } from "@/lib/utils";

interface Props {
  params: Promise<{ id: string }>;
}

// Mock quarter-by-quarter scores derived from final scores
function buildQtrScores(home: number, away: number, status: string) {
  if (status === "upcoming") return null;
  const quarters = [
    { label: "Q1", home: Math.round(home * 0.22), away: Math.round(away * 0.24) },
    { label: "Q2", home: Math.round(home * 0.26), away: Math.round(away * 0.25) },
    { label: "Q3", home: Math.round(home * 0.28), away: Math.round(away * 0.23) },
    { label: "Q4", home: home - Math.round(home * 0.76), away: away - Math.round(away * 0.72) },
  ];
  return quarters;
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
  const gameOdds = odds.find((o) => o.gameId === game.id);
  const relatedArticles = articles.filter((a) => a.gameId === game.id).slice(0, 3);
  const gameTransactions = transactions.filter((t) =>
    t.teamIds.some((tid) => tid === game.homeTeamId || tid === game.awayTeamId)
  );
  const qtrScores = buildQtrScores(game.homeScore, game.awayScore, game.status);

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
      <div className="bg-surface-200 border border-surface-300 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <GameStatusBadge status={game.status} />
          {game.status === "live" && (
            <span className="text-surface-muted text-sm font-medium">{game.quarter} · {game.timeRemaining}</span>
          )}
          {game.status === "final" && <span className="text-surface-muted text-sm">{game.date}</span>}
          {game.status === "upcoming" && <span className="text-surface-muted text-sm">{game.date}</span>}
          <span className="ml-auto text-xs text-surface-muted uppercase">{game.leagueId}</span>
        </div>

        {/* Main score display */}
        <div className="grid grid-cols-3 items-center gap-4 mb-6">
          <div className="text-center">
            <Link href={`/team/${awayTeam.slug}`}>
              <span className="text-6xl block mb-2">{awayTeam.logo}</span>
              <p className="text-lg font-bold text-surface-text hover:text-brand transition-colors">{awayTeam.name}</p>
              <p className="text-sm text-surface-muted">{awayTeam.record}</p>
            </Link>
          </div>
          <div className="text-center">
            {game.status !== "upcoming" ? (
              <div className="flex items-center justify-center gap-4">
                <span className={`text-5xl font-black tabular-nums ${game.awayScore > game.homeScore ? "text-surface-text" : "text-surface-muted"}`}>
                  {game.awayScore}
                </span>
                <span className="text-2xl text-surface-muted">—</span>
                <span className={`text-5xl font-black tabular-nums ${game.homeScore > game.awayScore ? "text-surface-text" : "text-surface-muted"}`}>
                  {game.homeScore}
                </span>
              </div>
            ) : (
              <p className="text-surface-muted text-xl font-semibold">vs</p>
            )}
          </div>
          <div className="text-center">
            <Link href={`/team/${homeTeam.slug}`}>
              <span className="text-6xl block mb-2">{homeTeam.logo}</span>
              <p className="text-lg font-bold text-surface-text hover:text-brand transition-colors">{homeTeam.name}</p>
              <p className="text-sm text-surface-muted">{homeTeam.record}</p>
            </Link>
          </div>
        </div>

        {/* Quarter-by-quarter box score */}
        {qtrScores && (
          <div className="border-t border-surface-300 pt-4">
            <p className="text-xs text-surface-muted uppercase tracking-wide mb-2">Box Score</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-center">
                <thead>
                  <tr className="text-xs text-surface-muted">
                    <th className="text-left pb-1 pr-4">Team</th>
                    {qtrScores.map((q) => <th key={q.label} className="pb-1 w-10">{q.label}</th>)}
                    <th className="pb-1 w-12 font-bold">T</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-surface-300">
                    <td className="text-left py-2 pr-4 font-semibold text-surface-text">{awayTeam.name}</td>
                    {qtrScores.map((q) => <td key={q.label} className="py-2 text-surface-muted">{q.away}</td>)}
                    <td className="py-2 font-black text-white">{game.awayScore}</td>
                  </tr>
                  <tr className="border-t border-surface-300">
                    <td className="text-left py-2 pr-4 font-semibold text-surface-text">{homeTeam.name}</td>
                    {qtrScores.map((q) => <td key={q.label} className="py-2 text-surface-muted">{q.home}</td>)}
                    <td className="py-2 font-black text-white">{game.homeScore}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Betting odds */}
        {gameOdds && (
          <div className="border-t border-surface-300 pt-4 mt-2">
            <p className="text-xs text-surface-muted uppercase tracking-wide mb-2">Odds — {gameOdds.provider}</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div><span className="text-surface-muted text-xs">Spread </span><span className="text-white font-semibold">{gameOdds.spread}</span></div>
              <div><span className="text-surface-muted text-xs">O/U </span><span className="text-white font-semibold">{gameOdds.overUnder}</span></div>
              <div><span className="text-surface-muted text-xs">ML Home </span><span className="text-white font-semibold">{gameOdds.moneylineHome}</span></div>
              <div><span className="text-surface-muted text-xs">ML Away </span><span className="text-white font-semibold">{gameOdds.moneylineAway}</span></div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Play-by-play */}
          <PlayByPlay events={game.events} />

          {/* Poll */}
          {gamePoll && (
            <Panel title="Fan Poll" accent="border-blue-600">
              <p className="text-sm font-semibold text-surface-text mb-3">{gamePoll.question}</p>
              <div className="space-y-2">
                {gamePoll.options.map((opt) => {
                  const pct = Math.round((opt.votes / gamePoll.votes) * 100);
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
              <p className="text-xs text-surface-muted mt-2">{formatCount(gamePoll.votes)} votes</p>
            </Panel>
          )}

          {/* Comments */}
          {gameThread && (
            <Panel
              title={gameThread.title}
              titleRight={<span className="text-surface-muted">{formatCount(gameThread.commentCount + localComments.length)} comments</span>}
              accent="border-yellow-600"
            >
              <form onSubmit={handleComment} className="flex gap-2 mb-4">
                <input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Join the discussion…"
                  className="flex-1 bg-surface-300 border border-surface-300 rounded px-3 py-2 text-sm text-surface-text placeholder-gray-500 focus:outline-none focus:border-gray-500"
                />
                <button type="submit" className="px-4 py-2 bg-red-600 hover:bg-red-500 text-surface-text text-sm font-semibold rounded transition-colors">
                  Post
                </button>
              </form>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                {allComments.map((cmt) => (
                  <div key={cmt.id} className="border-b border-surface-300 pb-4 last:border-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-surface-text">@user</span>
                      <span className="text-xs text-surface-muted">
                        {new Date(cmt.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
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
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {relatedArticles.length > 0 && (
            <Panel title="Related Articles" accent="border-gray-600">
              <div className="space-y-3">
                {relatedArticles.map((art) => (
                  <Link key={art.id} href={`/article/${art.slug}`} className="block group">
                    <p className="text-sm font-semibold text-surface-text group-hover:text-brand transition-colors leading-snug">
                      {art.title}
                    </p>
                    <p className="text-xs text-surface-muted mt-0.5">{art.byline} · {formatCount(art.views)} views</p>
                  </Link>
                ))}
              </div>
            </Panel>
          )}

          {/* Stat leaders for these teams */}
          <GameInsightWidget
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            leagueId={game.leagueId}
          />

          {/* Injury / transaction news for these teams */}
          {gameTransactions.length > 0 && (
            <Panel title="Injury & News" accent="border-red-700">
              <div className="space-y-3">
                {gameTransactions.slice(0, 4).map((tx) => (
                  <div key={tx.id} className="border-b border-surface-300 pb-3 last:border-0">
                    <p className="text-xs font-bold text-brand capitalize">{tx.type}</p>
                    <p className="text-sm text-surface-text mt-0.5 leading-snug">{tx.headline}</p>
                    <p className="text-xs text-surface-muted mt-0.5">{tx.date}</p>
                  </div>
                ))}
              </div>
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}
