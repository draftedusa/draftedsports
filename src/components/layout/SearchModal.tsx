"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { articles } from "@/data/articles";
import { teams } from "@/data/teams";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SearchModal({ open, onClose }: Props) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const q = query.toLowerCase().trim();

  const matchedArticles = q.length >= 2
    ? articles.filter((a) => a.title.toLowerCase().includes(q) || a.byline.toLowerCase().includes(q)).slice(0, 4)
    : [];
  const matchedTeams = q.length >= 2
    ? teams.filter((t) => t.name.toLowerCase().includes(q)).slice(0, 3)
    : [];

  const hasResults = matchedArticles.length > 0 || matchedTeams.length > 0;

  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [open]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] backdrop-blur-overlay bg-black/40 flex items-start justify-center pt-[10vh] px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-surface-100 border border-surface-300 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-surface-300">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-surface-muted shrink-0">
            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles, teams, players…"
            className="flex-1 bg-transparent text-surface-text placeholder-surface-muted text-sm outline-none"
          />
          <kbd className="hidden sm:block text-[10px] text-surface-muted border border-surface-300 rounded px-1.5 py-0.5 font-mono">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {!hasResults && q.length >= 2 && (
            <p className="px-4 py-8 text-center text-sm text-surface-muted">No results for &ldquo;{query}&rdquo;</p>
          )}
          {!hasResults && q.length < 2 && (
            <div className="px-4 py-6">
              <p className="text-xs font-bold uppercase tracking-widest text-surface-muted mb-3">Quick Links</p>
              <div className="grid grid-cols-2 gap-2">
                {["/scores", "/standings", "/transactions", "/watch"].map((href) => (
                  <Link key={href} href={href} onClick={onClose}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-200 hover:bg-surface-300 text-sm text-surface-text transition-colors capitalize">
                    {href.replace("/", "")}
                  </Link>
                ))}
              </div>
            </div>
          )}
          {matchedTeams.length > 0 && (
            <div className="px-4 pt-4 pb-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-surface-muted mb-2">Teams</p>
              <div className="space-y-1">
                {matchedTeams.map((t) => (
                  <Link key={t.id} href={`/team/${t.slug}`} onClick={onClose}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-200 transition-colors">
                    <span className="text-lg">{t.logo}</span>
                    <span className="text-sm font-semibold text-surface-text">{t.name}</span>
                    <span className="text-xs text-surface-muted ml-auto">{t.record}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
          {matchedArticles.length > 0 && (
            <div className="px-4 pt-4 pb-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-surface-muted mb-2">Articles</p>
              <div className="space-y-1">
                {matchedArticles.map((a) => (
                  <Link key={a.id} href={`/article/${a.slug}`} onClick={onClose}
                    className="flex items-start gap-3 px-3 py-2 rounded-lg hover:bg-surface-200 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-surface-text line-clamp-2 leading-snug">{a.title}</p>
                      <p className="text-xs text-surface-muted mt-0.5">{a.byline}</p>
                    </div>
                  </Link>
                ))}
              </div>
              {q.length >= 2 && (
                <Link href={`/search?q=${encodeURIComponent(query)}`} onClick={onClose}
                  className="block mt-3 text-xs text-brand font-semibold hover:underline">
                  See all results for &ldquo;{query}&rdquo; →
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
