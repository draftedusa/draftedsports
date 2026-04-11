"use client";

import React from 'react';
import { ChevronRight } from 'lucide-react';

interface LeaderProps {
  category: string;
  leaders: { name: string; team: string; value: string | number; rank: number }[];
}

export default function StatLeaderCard({ category, leaders }: LeaderProps) {
  return (
    <div className="rounded-xl border border-surface-300 bg-surface-200 p-4 transition-all hover:border-red-600/30">
      <div className="flex justify-between items-center mb-4 border-b border-surface-300 pb-2">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-surface-muted">{category}</h3>
        <ChevronRight size={12} className="text-surface-muted" />
      </div>

      <div className="space-y-3">
        {leaders.map((player) => (
          <div key={player.name} className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-red-600 w-3">{player.rank}</span>
              <div className="flex flex-col">
                <span className="text-xs font-bold leading-none text-surface-text group-hover:text-red-600 transition-colors">
                  {player.name}
                </span>
                <span className="text-[9px] font-bold text-surface-muted uppercase">{player.team}</span>
              </div>
            </div>
            <span className="text-sm font-mono font-black text-surface-text">{player.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
