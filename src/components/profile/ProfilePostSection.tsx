"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import AuthGate from "@/components/auth/AuthGate";

interface Post { id: string; content: string; created_at: string }

interface Props {
  username: string;
  initialPosts: Post[];
  avatarUrl: string | null;
  displayName: string;
}

function relativeDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function ProfilePostSection({ username, initialPosts, avatarUrl, displayName }: Props) {
  const { isSignedIn, user } = useUser();
  const clerkUsername = (user?.publicMetadata as { username?: string } | undefined)?.username;
  const isOwner = clerkUsername === username;

  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [input, setInput]   = useState("");
  const [posting, setPosting] = useState(false);

  async function handlePost(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !isSignedIn || posting) return;
    const body = input.trim();
    setPosting(true);
    try {
      const res = await fetch("/api/fan-pulse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: body }),
      });
      if (res.ok) {
        setPosts((prev) => [{ id: `local-${Date.now()}`, content: body, created_at: new Date().toISOString() }, ...prev]);
        setInput("");
      }
    } finally {
      setPosting(false);
    }
  }

  const composerAvatar = avatarUrl
    ? <img src={avatarUrl} alt={displayName} className="w-8 h-8 rounded-full object-cover" />
    : <span className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center text-sm font-bold text-brand">{displayName[0]?.toUpperCase()}</span>;

  return (
    <section className="bg-surface-200 border border-surface-300 rounded-2xl overflow-hidden">
      <div className="px-5 pt-5 pb-2">
        <h2 className="text-sm font-black uppercase tracking-wider text-surface-text">My Feed</h2>
      </div>

      {/* Composer */}
      {isOwner && (
        <form onSubmit={handlePost} className="px-5 pb-4 border-b border-surface-300">
          <div className="flex gap-3">
            <div className="shrink-0 overflow-hidden rounded-full mt-0.5">{composerAvatar}</div>
            <div className="flex-1">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="What's happening in sports?"
                rows={2}
                className="w-full bg-transparent text-sm text-surface-text placeholder-surface-muted focus:outline-none resize-none leading-relaxed"
              />
              <div className="flex justify-end mt-2">
                <AuthGate tooltip="Sign in to post">
                  <button
                    type="submit"
                    disabled={posting || !input.trim()}
                    className="px-4 py-1.5 bg-brand hover:bg-brand/90 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-full transition-colors"
                  >
                    {posting ? "…" : "Post"}
                  </button>
                </AuthGate>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Posts */}
      <div className="divide-y divide-surface-300">
        {posts.length > 0 ? (
          posts.map((p) => (
            <div key={p.id} className="flex items-start gap-2.5 px-5 py-3">
              <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 bg-brand" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-surface-text leading-snug">{p.content}</p>
                <p className="text-[10px] text-surface-muted mt-0.5">{relativeDate(p.created_at)}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-3xl mb-2">📢</p>
            <p className="text-xs text-surface-muted">No posts yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}
