"use client";

import React from 'react';
import { BookOpen, Target, ShieldCheck, Activity } from 'lucide-react';

const METRICS = [
  {
    icon: <Target className="text-red-600" size={16} />,
    term: "NET (NCAA Evaluation Tool)",
    definition: "The primary sorting tool for tournament selection. It calculates 'Team Value' (beating quality teams) and 'Adjusted Efficiency' (points per possession), ignoring points scored after a 10-point lead to discourage running up the score."
  },
  {
    icon: <ShieldCheck className="text-red-600" size={16} />,
    term: "SOS (Strength of Schedule)",
    definition: "A measure of a team's schedule difficulty. In 2026, the CFP updated this to give 'Extra Credit' for playing Top-25 opponents, while significantly reducing the penalty for losing to a 'Power 4' heavyweight."
  },
  {
    icon: <Activity className="text-red-600" size={16} />,
    term: "RPI (Ratings Percentage Index)",
    definition: "A classic metric still used in Baseball and Soccer. It is purely results-based: 25% your win record, 50% your opponents' win record, and 25% your opponents' opponents' record."
  }
];

export default function CollegeGlossary() {
  return (
    <div className="mt-12 border-t border-surface-300 pt-8 pb-12">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen size={18} className="text-surface-muted" />
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-surface-muted">
          Advanced Analytics Key
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {METRICS.map((m) => (
          <div key={m.term} className="group p-4 rounded-xl border border-surface-300 bg-surface-200/30 hover:bg-surface-200 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              {m.icon}
              <span className="text-[10px] font-black uppercase text-surface-text">{m.term}</span>
            </div>
            <p className="text-[11px] leading-relaxed text-surface-muted group-hover:text-surface-text transition-colors">
              {m.definition}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 p-3 bg-surface-200/50 rounded-lg border border-surface-300/50">
        <p className="text-[9px] text-surface-muted italic text-center">
          Data provided by UNDRAFTED Insights. Rankings updated daily at 4:00 AM EST.
        </p>
      </div>
    </div>
  );
}
