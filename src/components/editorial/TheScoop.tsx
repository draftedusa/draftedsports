"use client";

import React from 'react';
import Link from 'next/link';
import { Zap, Clock, ArrowRight, TrendingUp } from 'lucide-react';

const SCOOP_ENTRIES = [
  {
    id: 1,
    league: "NFL",
    category: "The Scoop",
    title: "Chiefs trade for veteran WR",
    detail: "Sources tell UNDRAFTED the deal makes Kelce the highest-paid TE in history.",
    time: "2m ago",
    type: "EXCLUSIVE"
  },
  {
    id: 2,
    league: "NBA",
    category: "The Scoop",
    title: "Rockets star clears injury report",
    detail: "Expected to be active for tonight's matchup vs. Lakers.",
    time: "14m ago",
    type: "NEWS"
  }
];

// ─────────────────────────────────────────────────────────
// Trending leaders per league (keyed by uppercase filter value)
// ─────────────────────────────────────────────────────────
interface TrendingLeader {
  rank: number;
  name: string;
  value: string;
}

interface TrendingCategory {
  label: string;
  categorySlug: string;
  leaders: TrendingLeader[];
}

const TRENDING: Record<string, { leagueSlug: string; categories: TrendingCategory[] }> = {
  NBA: {
    leagueSlug: "nba",
    categories: [
      {
        label: "Points Per Game",
        categorySlug: "points-per-game",
        leaders: [
          { rank: 1, name: "Luka Dončić",             value: "32.4" },
          { rank: 2, name: "Shai Gilgeous-Alexander",  value: "30.1" },
          { rank: 3, name: "Giannis Antetokounmpo",    value: "29.8" },
        ],
      },
      {
        label: "Assists Per Game",
        categorySlug: "assists-per-game",
        leaders: [
          { rank: 1, name: "Tyrese Haliburton", value: "11.0" },
          { rank: 2, name: "LeBron James",       value: "8.3"  },
          { rank: 3, name: "Trae Young",         value: "7.9"  },
        ],
      },
    ],
  },
  NFL: {
    leagueSlug: "nfl",
    categories: [
      {
        label: "Passing Yards",
        categorySlug: "passing-yards",
        leaders: [
          { rank: 1, name: "Josh Allen",    value: "4,812" },
          { rank: 2, name: "Lamar Jackson", value: "4,601" },
          { rank: 3, name: "C.J. Stroud",   value: "4,388" },
        ],
      },
      {
        label: "Rushing Yards",
        categorySlug: "rushing-yards",
        leaders: [
          { rank: 1, name: "Derrick Henry",   value: "1,921" },
          { rank: 2, name: "Bijan Robinson",  value: "1,744" },
          { rank: 3, name: "Jahmyr Gibbs",    value: "1,589" },
        ],
      },
    ],
  },
  MLB: {
    leagueSlug: "mlb",
    categories: [
      {
        label: "Batting Average",
        categorySlug: "batting-average",
        leaders: [
          { rank: 1, name: "Luis Arraez",     value: ".364" },
          { rank: 2, name: "Freddie Freeman", value: ".346" },
          { rank: 3, name: "Steven Kwan",     value: ".337" },
        ],
      },
      {
        label: "ERA",
        categorySlug: "earned-run-average",
        leaders: [
          { rank: 1, name: "Zack Wheeler",    value: "2.44" },
          { rank: 2, name: "Spencer Strider", value: "2.67" },
          { rank: 3, name: "Gerrit Cole",     value: "2.90" },
        ],
      },
    ],
  },
  NHL: {
    leagueSlug: "nhl",
    categories: [
      {
        label: "Points Leaders",
        categorySlug: "points",
        leaders: [
          { rank: 1, name: "Nathan MacKinnon", value: "109" },
          { rank: 2, name: "Connor McDavid",   value: "107" },
          { rank: 3, name: "David Pastrnak",   value: "103" },
        ],
      },
    ],
  },
};

// ─────────────────────────────────────────────────────────
// Sidebar
// ─────────────────────────────────────────────────────────
function TrendingSidebar({ leagueFilter }: { leagueFilter: string }) {
  const data = TRENDING[leagueFilter];
  if (!data) return null;

  return (
    <aside className="space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-surface-300">
        <TrendingUp size={14} className="text-red-600" />
        <h2 className="text-[10px] font-black uppercase tracking-widest text-surface-muted">
          Trending Leaders
        </h2>
      </div>

      {data.categories.map((cat) => (
        <div key={cat.categorySlug} className="rounded-xl border border-surface-300 bg-surface-200 overflow-hidden">
          {/* Category header */}
          <div className="px-3 py-2 border-b border-surface-300 bg-surface-300/20">
            <span className="text-[9px] font-black uppercase tracking-widest text-surface-muted">
              {cat.label}
            </span>
          </div>

          {/* Leaders */}
          <div className="divide-y divide-surface-300">
            {cat.leaders.map((leader) => (
              <div key={leader.name} className="flex items-center justify-between px-3 py-2.5 hover:bg-surface-300/30 transition-colors">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[9px] font-black text-red-600 tabular-nums shrink-0 w-3">
                    {leader.rank}
                  </span>
                  <Link
                    href={`/league/${data.leagueSlug}/stats/${cat.categorySlug}`}
                    className="text-[10px] font-black text-surface-text hover:text-brand transition-colors truncate"
                  >
                    {leader.name}
                  </Link>
                </div>
                <span className="text-[10px] font-mono font-black text-surface-muted shrink-0 ml-2">
                  {leader.value}
                </span>
              </div>
            ))}
          </div>

          {/* View full link */}
          <Link
            href={`/league/${data.leagueSlug}/stats/${cat.categorySlug}`}
            className="flex items-center justify-center gap-1 px-3 py-2 border-t border-surface-300 text-[9px] font-black uppercase text-surface-muted hover:text-brand hover:bg-surface-300/20 transition-colors"
          >
            View Full Table <ArrowRight size={10} />
          </Link>
        </div>
      ))}
    </aside>
  );
}

// ─────────────────────────────────────────────────────────
// TheScoop
// ─────────────────────────────────────────────────────────
interface ScoopProps {
  leagueFilter?: string;
}

export default function TheScoop({ leagueFilter }: ScoopProps) {
  const filteredData = leagueFilter
    ? SCOOP_ENTRIES.filter((e) => e.league === leagueFilter)
    : SCOOP_ENTRIES;

  const feed = (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-surface-300 pb-4">
        <div className="flex items-center gap-2">
          <Zap size={20} className="text-red-600 fill-red-600" />
          <h1 className="text-2xl font-black italic uppercase tracking-tighter text-surface-text">
            {leagueFilter ? `${leagueFilter} THE SCOOP` : "THE SCOOP"}
          </h1>
        </div>
        <span className="text-[10px] font-bold text-surface-muted uppercase tracking-widest">
          Live Updates
        </span>
      </div>

      {/* Entries */}
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
  );

  if (leagueFilter) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6">
        <div className="lg:col-span-2">{feed}</div>
        <TrendingSidebar leagueFilter={leagueFilter} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {feed}
    </div>
  );
}
