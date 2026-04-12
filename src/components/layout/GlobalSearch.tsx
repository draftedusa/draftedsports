"use client";

import { Search, User, Trophy, FileText } from 'lucide-react';

const MOCK_RESULTS = [
  { type: "player", icon: User,     label: "LeBron James",      meta: "NBA · LAL" },
  { type: "player", icon: User,     label: "Patrick Mahomes",   meta: "NFL · KC"  },
  { type: "team",   icon: Trophy,   label: "Dallas Cowboys",    meta: "NFL"       },
  { type: "team",   icon: Trophy,   label: "Golden State Warriors", meta: "NBA"   },
  { type: "scoop",  icon: FileText, label: "Chiefs trade for veteran WR", meta: "The Scoop · 2m ago" },
];

export default function GlobalSearch() {
  return (
    <div className="relative group w-full max-w-md">

      {/* Input bar */}
      <div className="flex items-center bg-surface-200 border border-surface-300 rounded-full px-4 py-2 focus-within:border-red-600 transition-all">
        <Search size={16} className="text-surface-muted mr-3 shrink-0" />
        <input
          placeholder="Search Players, Teams, or The Scoop…"
          className="bg-transparent border-none outline-none text-xs font-bold uppercase w-full text-surface-text placeholder:text-surface-muted placeholder:normal-case placeholder:tracking-normal"
        />
        <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-surface-300 bg-surface-300/50 px-1.5 font-mono text-[10px] font-medium text-surface-muted shrink-0">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>

      {/* Results dropdown */}
      <div className="absolute top-full left-0 right-0 mt-2 bg-surface-200 border border-surface-300 rounded-xl shadow-2xl z-50 overflow-hidden hidden group-focus-within:block">
        <div className="px-3 py-2 border-b border-surface-300 bg-surface-300/20 text-[9px] font-black uppercase tracking-widest text-surface-muted">
          Top Results
        </div>
        <div className="max-h-64 overflow-y-auto">
          {MOCK_RESULTS.map((result) => {
            const Icon = result.icon;
            return (
              <div
                key={result.label}
                className="flex items-center justify-between gap-3 px-3 py-2.5 hover:bg-red-600/10 cursor-pointer border-b border-surface-300 last:border-none transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon size={14} className="text-red-600 shrink-0" />
                  <span className="text-xs font-black uppercase text-surface-text truncate">
                    {result.label}
                  </span>
                </div>
                <span className="text-[9px] font-bold text-surface-muted whitespace-nowrap shrink-0">
                  {result.meta}
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
