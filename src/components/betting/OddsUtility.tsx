"use client";

import { Scale, TrendingUp } from 'lucide-react';

interface OddsUtilityProps {
  spread: string;
  ou: string | number;
  ml: string;
}

export default function OddsUtility({ spread, ou, ml }: OddsUtilityProps) {
  return (
    <div className="border-t border-surface-300 mt-3 pt-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[9px] font-black text-surface-muted uppercase flex items-center gap-1">
          <Scale size={10} /> Analytics &amp; Odds
        </span>
        <span className="text-[9px] font-bold text-green-600 uppercase">Trend: Over</span>
      </div>
      <div className="grid grid-cols-3 gap-2 bg-surface-200 rounded-lg p-2 text-center">
        <div>
          <div className="text-[8px] font-bold text-surface-muted uppercase">Spread</div>
          <div className="text-[11px] font-black text-surface-text">{spread}</div>
        </div>
        <div>
          <div className="text-[8px] font-bold text-surface-muted uppercase">Total</div>
          <div className="text-[11px] font-black text-surface-text">O/U {ou}</div>
        </div>
        <div>
          <div className="text-[8px] font-bold text-surface-muted uppercase">ML</div>
          <div className="text-[11px] font-black text-surface-text">{ml}</div>
        </div>
      </div>
      <p className="mt-2 text-[8px] text-surface-muted italic flex items-center gap-1">
        <TrendingUp size={8} /> 58% of analysts favor home spread.
      </p>
    </div>
  );
}
