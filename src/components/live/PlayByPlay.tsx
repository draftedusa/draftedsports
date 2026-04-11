"use client";

import React from 'react';
import { Zap } from 'lucide-react';

const MOCK_PLAYS = [
  { id: 1, time: "2:14 4Q", team: "LAL", description: "LeBron James makes 27-foot three point jumper (Austin Reaves assists).", score: "112-108", type: "SCORE" },
  { id: 2, time: "2:30 4Q", team: "HOU", description: "Fred VanVleet misses 14-foot pullup jumper.", score: "109-108", type: "MISS" },
  { id: 3, time: "2:45 4Q", team: "LAL", description: "Anthony Davis defensive rebound.", score: "109-108", type: "PLAY" },
  { id: 4, time: "3:02 4Q", team: "HOU", description: "Alperen Sengun makes layup. Foul by Anthony Davis.", score: "109-108", type: "SCORE" },
];

export default function PlayByPlay() {
  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-6">

      {/* 1. Momentum Tracker */}
      <div className="rounded-xl border border-surface-300 bg-surface-200 p-4">
        <div className="flex justify-between items-end h-16 gap-1">
          {[40, 60, 30, 80, 20, 90, 45, 70, 10, 50].map((h, i) => (
            <div
              key={i}
              style={{ height: `${h}%` }}
              className={`flex-1 rounded-t-sm ${h > 50 ? 'bg-red-600' : 'bg-surface-muted/30'}`}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2 text-[9px] font-black uppercase text-surface-muted tracking-widest">
          <span>HOU</span>
          <span>Momentum</span>
          <span>LAL</span>
        </div>
      </div>

      {/* 2. Play Feed */}
      <div className="relative space-y-4">
        {/* Timeline line */}
        <div className="absolute left-3 top-0 bottom-0 w-px bg-surface-300" />

        {MOCK_PLAYS.map((play) => (
          <div key={play.id} className="relative pl-10 group">
            {/* Timeline dot */}
            <div className={`absolute left-[9px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-surface-100 z-10
              ${play.type === 'SCORE' ? 'bg-red-600' : 'bg-surface-muted'}`}
            />

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-surface-muted whitespace-nowrap">{play.time}</span>
                <span className="text-[10px] font-black uppercase text-red-600">{play.team}</span>
              </div>

              <div className={`rounded-lg border p-3 transition-all ${
                play.type === 'SCORE'
                  ? 'bg-red-600/5 border-red-600/20'
                  : 'bg-surface-200 border-surface-300'
              }`}>
                <p className="text-sm font-medium leading-tight text-surface-text">{play.description}</p>
                <div className="mt-2 flex items-center justify-between text-[10px] font-bold text-surface-muted italic">
                  <span>Score: {play.score}</span>
                  {play.type === 'SCORE' && <Zap size={10} className="text-red-600 fill-red-600" />}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
