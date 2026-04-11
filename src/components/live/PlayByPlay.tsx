"use client";

import React from 'react';
import { Zap } from 'lucide-react';
import type { GameEvent } from '@/types';

const MOCK_PLAYS: GameEvent[] = [
  { id: "m1", gameId: "mock", time: "2:14 4Q", teamId: "LAL", description: "LeBron James makes 27-foot three point jumper (Austin Reaves assists).", isHighlight: true,  type: "score"   },
  { id: "m2", gameId: "mock", time: "2:30 4Q", teamId: "HOU", description: "Fred VanVleet misses 14-foot pullup jumper.",                              isHighlight: false, type: "turnover" },
  { id: "m3", gameId: "mock", time: "2:45 4Q", teamId: "LAL", description: "Anthony Davis defensive rebound.",                                          isHighlight: false, type: "highlight"},
  { id: "m4", gameId: "mock", time: "3:02 4Q", teamId: "HOU", description: "Alperen Sengun makes layup. Foul by Anthony Davis.",                        isHighlight: true,  type: "score"   },
];

// Momentum: fraction of score-type events in each bucket of 10
function buildMomentum(events: GameEvent[]): number[] {
  if (events.length === 0) return [40, 60, 30, 80, 20, 90, 45, 70, 10, 50];
  const buckets = 10;
  const size = Math.max(1, Math.ceil(events.length / buckets));
  return Array.from({ length: buckets }, (_, i) => {
    const slice = events.slice(i * size, (i + 1) * size);
    const scores = slice.filter((e) => e.type === "score").length;
    return slice.length ? Math.round((scores / slice.length) * 100) : 0;
  });
}

interface PlayByPlayProps {
  events?: GameEvent[];
}

export default function PlayByPlay({ events }: PlayByPlayProps) {
  const plays = events && events.length > 0 ? [...events].reverse() : MOCK_PLAYS;
  const momentum = buildMomentum(events ?? []);

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-6">

      {/* Momentum Tracker */}
      <div className="rounded-xl border border-surface-300 bg-surface-200 p-4">
        <div className="flex justify-between items-end h-16 gap-1">
          {momentum.map((h, i) => (
            <div
              key={i}
              style={{ height: `${Math.max(h, 4)}%` }}
              className={`flex-1 rounded-t-sm ${h > 50 ? 'bg-red-600' : 'bg-surface-muted/30'}`}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2 text-[9px] font-black uppercase text-surface-muted tracking-widest">
          <span>Away</span>
          <span>Momentum</span>
          <span>Home</span>
        </div>
      </div>

      {/* Play Feed */}
      <div className="relative space-y-4">
        <div className="absolute left-3 top-0 bottom-0 w-px bg-surface-300" />

        {plays.map((play) => {
          const isScore = play.type === "score";
          return (
            <div key={play.id} className="relative pl-10 group">
              <div className={`absolute left-[9px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-surface-100 z-10
                ${isScore ? 'bg-red-600' : 'bg-surface-muted'}`}
              />
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-surface-muted whitespace-nowrap">{play.time}</span>
                  {play.teamId && (
                    <span className="text-[10px] font-black uppercase text-red-600">{play.teamId}</span>
                  )}
                </div>
                <div className={`rounded-lg border p-3 transition-all ${
                  isScore
                    ? 'bg-red-600/5 border-red-600/20'
                    : 'bg-surface-200 border-surface-300'
                }`}>
                  <p className="text-sm font-medium leading-tight text-surface-text">{play.description}</p>
                  {isScore && (
                    <div className="mt-2 flex items-center justify-end">
                      <Zap size={10} className="text-red-600 fill-red-600" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
