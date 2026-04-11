import Link from "next/link";

interface StatEntry {
  name: string;
  team: string;
  value: string | number;
}

interface StatChartProps {
  title: string;
  data: StatEntry[];
  fullStatsUrl: string;
}

export default function StatChart({ title, data, fullStatsUrl }: StatChartProps) {
  return (
    <div className="flex flex-col h-full rounded-xl border border-surface-300 bg-surface-200">
      <div className="p-4 border-b border-surface-300">
        <h3 className="text-xs font-black uppercase text-surface-muted">{title}</h3>
      </div>

      <div className="p-4 flex-grow space-y-4">
        {data.slice(0, 5).map((entry, i) => (
          <div key={i} className="flex justify-between items-center text-sm">
            <span className="font-bold text-surface-text">
              {i + 1}. {entry.name}{" "}
              <span className="text-[10px] text-surface-muted uppercase">{entry.team}</span>
            </span>
            <span className="font-mono font-black text-surface-text">{entry.value}</span>
          </div>
        ))}
      </div>

      <Link
        href={fullStatsUrl}
        className="p-3 bg-surface-300/50 text-center text-[10px] font-black uppercase text-surface-muted hover:bg-red-600 hover:text-white transition-all rounded-b-xl"
      >
        View Full {title} Page
      </Link>
    </div>
  );
}
