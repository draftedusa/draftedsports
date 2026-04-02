"use client";

import { useState } from "react";
import Link from "next/link";

const MOCK_POSTS = [
  { id: "1", user: "RocketsNation",  avatar: "🚀", time: "2m ago",  body: "Sengun is absolutely COOKED tonight. MVP watch activated 👀", reactions: { fire: 42, wow: 11 }, league: "NBA" },
  { id: "2", user: "ChiefsKingdom",  avatar: "🏈", time: "5m ago",  body: "Patrick Mahomes is just built different. There is no other explanation.", reactions: { fire: 88, wow: 33 }, league: "NFL" },
  { id: "3", user: "LakersNation",   avatar: "💜", time: "8m ago",  body: "The Lakers trade deadline moves were ELITE. Banner season incoming.", reactions: { fire: 19, wow: 7  }, league: "NBA" },
  { id: "4", user: "PuckHead99",     avatar: "🏒", time: "12m ago", body: "Pastrnak hat trick? On a Tuesday? That man is unreal.", reactions: { fire: 31, wow: 14 }, league: "NHL" },
  { id: "5", user: "MLBScout",       avatar: "⚾", time: "15m ago", body: "This Yankees squad has the deepest rotation I've seen in a decade.", reactions: { fire: 22, wow: 9  }, league: "MLB" },
];

export default function FanPulse({ compact = false }: { compact?: boolean }) {
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [input, setInput]  = useState("");
  const [reacted, setReacted] = useState<Set<string>>(new Set());

  function handlePost(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    setPosts((prev) => [{
      id: `local-${Date.now()}`,
      user: "You",
      avatar: "👤",
      time: "just now",
      body: input.trim(),
      reactions: { fire: 0, wow: 0 },
      league: "ALL",
    }, ...prev]);
    setInput("");
  }

  function handleReact(postId: string, type: "fire" | "wow") {
    if (reacted.has(`${postId}-${type}`)) return;
    setReacted((prev) => new Set([...prev, `${postId}-${type}`]));
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, reactions: { ...p.reactions, [type]: p.reactions[type] + 1 } } : p
      )
    );
  }

  const displayPosts = compact ? posts.slice(0, 3) : posts;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
            <h2 className="text-sm font-black tracking-tight text-surface-text uppercase">Fan Pulse</h2>
          </div>
          <p className="text-xs text-surface-muted">Live community reactions</p>
        </div>
        {compact && (
          <Link href="/feed" className="text-xs font-bold text-brand hover:underline">
            Open Feed →
          </Link>
        )}
      </div>

      {/* Compose */}
      <form onSubmit={handlePost} className="flex gap-2">
        <div className="w-7 h-7 rounded-full bg-brand/20 flex items-center justify-center text-xs shrink-0">👤</div>
        <div className="flex-1 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What's your take?"
            className="flex-1 bg-surface-200 border border-surface-300 rounded-lg px-3 py-1.5 text-xs text-surface-text placeholder-surface-muted focus:outline-none focus:border-brand transition-colors"
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-brand hover:bg-brand/90 text-white text-xs font-bold rounded-lg transition-colors shrink-0"
          >
            Post
          </button>
        </div>
      </form>

      {/* Posts */}
      <div className="space-y-3">
        {displayPosts.map((post) => (
          <div key={post.id} className="bg-surface-200 border border-surface-300 rounded-xl p-3">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-full bg-brand/10 flex items-center justify-center text-sm shrink-0">
                {post.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-surface-text">{post.user}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-300 text-surface-muted font-medium">{post.league}</span>
                  <span className="text-[10px] text-surface-muted ml-auto">{post.time}</span>
                </div>
                <p className="text-xs text-surface-text leading-relaxed">{post.body}</p>
                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() => handleReact(post.id, "fire")}
                    className={`flex items-center gap-1 text-xs transition-colors ${
                      reacted.has(`${post.id}-fire`) ? "text-orange-500" : "text-surface-muted hover:text-orange-500"
                    }`}
                  >
                    🔥 {post.reactions.fire}
                  </button>
                  <button
                    onClick={() => handleReact(post.id, "wow")}
                    className={`flex items-center gap-1 text-xs transition-colors ${
                      reacted.has(`${post.id}-wow`) ? "text-brand" : "text-surface-muted hover:text-brand"
                    }`}
                  >
                    😮 {post.reactions.wow}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
