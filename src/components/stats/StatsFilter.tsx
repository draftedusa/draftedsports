"use client";

export default function StatsFilter() {
  return (
    <div className="flex flex-wrap gap-4 mb-8 border-b border-surface-300 pb-4">
      <button className="text-[10px] font-black uppercase px-4 py-2 bg-red-600 text-white rounded-md">2025-26 Season</button>
      <button className="text-[10px] font-black uppercase px-4 py-2 border border-surface-300 text-surface-muted hover:bg-surface-200 hover:text-surface-text transition-colors rounded-md">Playoffs</button>
      <button className="text-[10px] font-black uppercase px-4 py-2 border border-surface-300 text-surface-muted hover:bg-surface-200 hover:text-surface-text transition-colors rounded-md">Historical Data</button>
    </div>
  );
}
