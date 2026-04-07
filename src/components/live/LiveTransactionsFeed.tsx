"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Transaction } from "@/data/transactions";
import { teams } from "@/data/teams";

const TYPE_ICON: Record<string, string> = {
  injury:    "🩹",
  signing:   "✍️",
  trade:     "🔄",
  extension: "📝",
  release:   "🚪",
  waiver:    "📋",
};

const TYPE_COLOR: Record<string, string> = {
  injury:    "text-red-400",
  signing:   "text-emerald-400",
  trade:     "text-blue-400",
  extension: "text-brand",
  release:   "text-orange-400",
  waiver:    "text-surface-muted",
};

interface LiveTransactionsFeedProps {
  limit?: number;
  showLeague?: boolean;
}

export default function LiveTransactionsFeed({ limit = 8, showLeague = true }: LiveTransactionsFeedProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<"live" | "cached">("cached");
  const [error, setError] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/transactions", { next: { revalidate: 300 } });
        if (!res.ok) throw new Error("fetch failed");
        const data = await res.json();
        setTransactions(data.transactions.slice(0, limit));
        setSource(data.source === "live" ? "live" : "cached");
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [limit]);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: Math.min(limit, 4) }).map((_, i) => (
          <div key={i} className="flex items-start gap-3 p-3 bg-surface-200 border border-surface-300 rounded-xl">
            <div className="w-8 h-8 rounded-full skeleton shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-3/4 skeleton rounded" />
              <div className="h-2.5 w-1/2 skeleton rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error || transactions.length === 0) {
    return (
      <p className="text-xs text-surface-muted text-center py-4">
        No transactions available right now.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {source === "live" && (
        <div className="flex items-center gap-1.5 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Live Feed</span>
        </div>
      )}
      {transactions.map((tx) => {
        const txTeams = teams.filter((t) => tx.teamIds.includes(t.id));
        return (
          <Link key={tx.id} href="/scores">
            <div className="flex items-start gap-3 p-3 bg-surface-200 border border-surface-300 hover:border-brand/40 rounded-xl transition-colors cursor-pointer">
              <span className="text-xl shrink-0 mt-0.5">{TYPE_ICON[tx.type] ?? "📋"}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-surface-text leading-snug line-clamp-2">{tx.headline}</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  {showLeague && (
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${TYPE_COLOR[tx.type]}`}>
                      {tx.leagueId?.toUpperCase()}
                    </span>
                  )}
                  {txTeams.map((t) => (
                    <span key={t.id} className="text-[10px] text-surface-muted">{t.logo}</span>
                  ))}
                  {tx.isBreaking && (
                    <span className="text-[10px] font-bold text-red-400 uppercase">Breaking</span>
                  )}
                  <span className="text-[10px] text-surface-muted ml-auto">{tx.date}</span>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
