"use client";

import { Info } from "lucide-react";

interface GlossaryItem {
  term: string;
  definition: string;
}

const GLOSSARY_DATA: Record<string, GlossaryItem[]> = {
  nfl: [
    { term: "REC",  definition: "Overall win-loss-tie record." },
    { term: "PCT",  definition: "Winning percentage." },
    { term: "PF/PA", definition: "Points For vs. Points Against." },
    { term: "STRK", definition: "Current winning or losing streak." },
  ],
  college: [
    { term: "SOS", definition: "Strength of Schedule: Based on the combined record of all opponents." },
    { term: "AP/AF", definition: "Ranking in the AP Poll or AFCA Coaches Poll." },
    { term: "NET", definition: "NCAA Evaluation Tool: The primary sorting tool for tournament selection." },
    { term: "RPI", definition: "Ratings Percentage Index: Based on a team's wins and losses and its strength of schedule." },
  ],
  soccer: [
    { term: "GP",   definition: "Games Played." },
    { term: "GD",   definition: "Goal Difference: Goals scored minus goals conceded." },
    { term: "PTS",  definition: "Points: 3 for a win, 1 for a draw, 0 for a loss." },
    { term: "FORM", definition: "Results of the last five matches (W/D/L)." },
  ],
};

export default function LeagueGlossary({ type }: { type: string }) {
  const items = GLOSSARY_DATA[type.toLowerCase()] ?? GLOSSARY_DATA.nfl;

  return (
    <div className="mt-12 rounded-lg border border-surface-300 bg-surface-200 p-6">
      <div className="mb-4 flex items-center gap-2">
        <Info size={16} className="text-red-600" />
        <h3 className="text-xs font-black uppercase tracking-widest text-surface-text">Glossary &amp; Key</h3>
      </div>
      <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.term}>
            <span className="text-[10px] font-black text-surface-text">{item.term}</span>
            <p className="text-[10px] leading-relaxed text-surface-muted">{item.definition}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
