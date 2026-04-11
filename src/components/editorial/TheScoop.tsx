"use client";

import React from 'react';
import { Zap, Clock, ArrowRight } from 'lucide-react';

const SCOOP_ENTRIES = [
  {
    id: 1,
    category: "The Scoop",
    league: "NFL",
    title: "Chiefs and Travis Kelce finalizing 2-year extension",
    detail: "Sources tell UNDRAFTED the deal makes Kelce the highest-paid TE in history.",
    time: "2m ago",
    type: "EXCLUSIVE"
  },
  {
    id: 2,
    category: "Transactions",
    league: "NBA",
    title: "Houston Rockets recall Amen Thompson from G-League",
    detail: "Expected to be active for tonight's matchup vs. Lakers.",
    time: "14m ago",
    type: "NEWS"
  }
];

interface ScoopProps {
  leagueFilter?: string;
}

export default function TheScoop({ leagueFilter }: ScoopProps) {
  const filteredData = leagueFilter
    ? SCOOP_ENTRIES.filter((e) => e.league === leagueFilter)
    : SCOOP_ENTRIES;

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-surface-300 pb-4">
        <div className="flex items-center gap-2">
          <Zap size={20} className="text-red-600 fill-red-600" />
          <h1 className="text-2xl font-black italic uppercase tracking-tighter text-surface-text">
            {leagueFilter ? `${leagueFilter} THE SCOOP` : "THE SCOOP"}
          </h1>
        </div>
        <span className="text-[10px] font-bold text-surface-muted uppercase tracking-widest">Live Updates</span>
      </div>

      <div className="space-y-4">
        {filteredData.length > 0 ? filteredData.map((entry) => (
          <div key={entry.id} className="rounded-xl border border-surface-300 bg-surface-200 p-4 transition-all hover:shadow-md group">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={`text-[9px] font-black px-2 py-0.5 rounded ${entry.type === 'EXCLUSIVE' ? 'bg-red-600 text-white' : 'bg-surface-300 text-surface-muted'}`}>
                  {entry.type}
                </span>
                <span className="text-[9px] font-bold text-red-600 uppercase tracking-tighter">{entry.league}</span>
              </div>
              <div className="flex items-center gap-1 text-[9px] text-surface-muted">
                <Clock size={10} /> {entry.time}
              </div>
            </div>
            <h3 className="text-lg font-black leading-tight mb-1 text-surface-text group-hover:text-brand transition-colors">
              {entry.title}
            </h3>
            <p className="text-sm text-surface-muted leading-relaxed">{entry.detail}</p>
            <div className="mt-4 flex items-center justify-end">
              <button className="text-[10px] font-black uppercase text-brand flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Full Story <ArrowRight size={12} />
              </button>
            </div>
          </div>
        )) : (
          <div className="p-12 text-center border border-dashed border-surface-300 rounded-xl">
            <p className="text-surface-muted italic text-sm">
              No recent {leagueFilter} scoops found. Check back later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
