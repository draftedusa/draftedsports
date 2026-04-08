"use client";

import { useState } from "react";
import Link from "next/link";

const MINI_POSTS = [
  { id: "1", user: "RocketsNation",  handle: "@rocketsnation",  avatar: "🚀", time: "2m",   body: "Sengun is absolutely COOKED tonight. MVP watch activated 👀", fire: 42, league: "NBA" },
  { id: "2", user: "ChiefsKingdom",  handle: "@chiefskingdom",  avatar: "🏈", time: "5m",   body: "Patrick Mahomes is just built different. There is no other explanation.", fire: 88, league: "NFL" },
  { id: "3", user: "LakersNation",   handle: "@lakersnation",   avatar: "💜", time: "8m",   body: "The Lakers trade deadline moves were ELITE. Banner season incoming.", fire: 19, league: "NBA" },
  { id: "4", user: "PuckHead99",     handle: "@puckhead99",     avatar: "🏒", time: "12m",  body: "Pastrnak hat trick? On a Tuesday? That man is unreal.", fire: 31, league: "NHL" },
];

interface FanPulseMiniWidgetProps {
  /** Number of posts to display */
  limit?: number;
}

export default function FanPulseMiniWidget({ limit = 3 }: FanPulseMiniWidgetProps) {
  const [input, setInput] = useState("");
  const [posts, setPosts] = useState(MINI_POSTS.slice(0, limit));
  const [fired, setFired] = useState<Set<string>>(new Set());

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    const newPost = {
      id: `local-${Date.now()}`,
      user: "You",
      handle: "@you",
      avatar: "👤",
      time: "now",
      body: input.trim(),
      fire: 0,
      league: "ALL",
    };
    setPosts((p) => [newPost, ...p].slice(0, limit + 1));
    setInput("");
  }

  function handleFire(id: string) {
    if (fired.has(id)) return;
    setFired((f) => new Set([...f, id]));
    setPosts((p) => p.map((post) => post.id === id ? { ...post, fire: post.fire + 1 } : post));
  }

  return (
    <div className="bg-surface-200 border border-surface-300 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-surface-300">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
          <span className="text-xs font-black uppercase tracking-wider text-surface-text">Fan Pulse</span>
        </div>
        <Link href="/feed" className="text-[10px] font-bold text-brand hover:text-brand/80 transition-colors">
          Open Feed →
        </Link>
      </div>

      {/* Quick compose */}
      <form onSubmit={handleSubmit} className="flex gap-2 px-4 py-2.5 border-b border-surface-300">
        <div className="w-6 h-6 rounded-full bg-brand/20 flex items-center justify-center text-xs shrink-0 mt-0.5">👤</div>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What's your take?"
          className="flex-1 bg-surface-300/50 border border-surface-300 rounded-lg px-3 py-1.5 text-xs text-surface-text placeholder-surface-muted focus:outline-none focus:border-brand transition-colors min-w-0"
        />
        <button
          type="submit"
          className="px-2.5 py-1.5 bg-brand hover:bg-brand/90 text-white text-[10px] font-bold rounded-lg transition-colors shrink-0"
        >
          Post
        </button>
      </form>

      {/* Posts */}
      <div className="divide-y divide-surface-300">
        {posts.map((post) => (
          <div key={post.id} className="px-4 py-3">
            <div className="flex items-start gap-2.5">
              <span className="text-xl shrink-0 leading-none mt-0.5">{post.avatar}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                  <span className="text-xs font-bold text-surface-text">{post.user}</span>
                  <span className="text-[10px] text-surface-muted">{post.handle}</span>
                  <span className="text-surface-muted text-[10px]">·</span>
                  <span className="text-[10px] text-surface-muted">{post.time}</span>
                  <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-surface-300 text-surface-muted">
                    {post.league}
                  </span>
                </div>
                <p className="text-xs text-surface-text leading-relaxed">{post.body}</p>
                <button
                  onClick={() => handleFire(post.id)}
                  className={`flex items-center gap-1 mt-2 text-[10px] font-bold transition-colors ${
                    fired.has(post.id) ? "text-orange-400" : "text-surface-muted hover:text-orange-400"
                  }`}
                >
                  🔥 <span>{post.fire}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
