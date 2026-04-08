import Link from "next/link";
import { articles } from "@/data/articles";
import { teams } from "@/data/teams";
import Kicker from "@/components/ui/Kicker";
import CreatorTag from "@/components/ui/CreatorTag";
import { formatCount } from "@/lib/utils";

export const metadata = {
  title: "Analysis — UNDRAFTED",
  description: "Premium sports analytics, film room breakdowns, and data-driven insights.",
};

const STAT_LEADERS = [
  { name: "Alperen Şengün", team: "HOU", stat: "28.4 PPG", trend: "+3.2", league: "NBA" },
  { name: "Patrick Mahomes", team: "KC",  stat: "118.2 QBR", trend: "+5.1", league: "NFL" },
  { name: "Shohei Ohtani",   team: "LAD", stat: ".342 AVG", trend: "+.018", league: "MLB" },
  { name: "David Pastrnak",  team: "BOS", stat: "48 G",     trend: "+8",   league: "NHL" },
];

const POWER_RANKINGS = [
  { rank: 1, prev: 2, name: "Kansas City Chiefs",   logo: "🏈", record: "14-3", delta: "▲1" },
  { rank: 2, prev: 1, name: "Philadelphia Eagles",  logo: "🦅", record: "13-4", delta: "▼1" },
  { rank: 3, prev: 3, name: "Houston Rockets",      logo: "🚀", record: "48-28", delta: "—" },
  { rank: 4, prev: 5, name: "Boston Celtics",       logo: "☘️", record: "52-24", delta: "▲1" },
  { rank: 5, prev: 4, name: "Oklahoma City Thunder",logo: "⚡", record: "55-21", delta: "▼1" },
];

// Analysis/Film Room articles
const analysisArticles = articles.filter((a) => a.byline === "Marcus Webb" || a.readTime > 5).slice(0, 6);

export default function AnalysisPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">

      {/* Page header */}
      <div className="border-b border-surface-300 pb-6">
        <Kicker label="Data & Intelligence" variant="brand" className="mb-2" />
        <h1 className="text-4xl font-black tracking-tighter text-surface-text mb-2">
          Analysis Hub
        </h1>
        <p className="text-surface-muted text-sm max-w-2xl">
          Film rooms, advanced metrics, power rankings, and data-driven journalism from our creator franchises.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main column */}
        <div className="xl:col-span-2 space-y-10">

          {/* Stat Leaders */}
          <section>
            <h2 className="text-lg font-bold text-surface-text mb-4 flex items-center gap-2">
              📊 Stat Leaders
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {STAT_LEADERS.map((s) => (
                <div key={s.name} className="bg-surface-200 border border-surface-300 rounded-xl p-4 hover:border-brand/40 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand">{s.league}</span>
                    <span className="text-[10px] font-bold text-emerald-400">{s.trend}</span>
                  </div>
                  <p className="text-xl font-black text-surface-text tabular-nums">{s.stat}</p>
                  <p className="text-xs font-semibold text-surface-text mt-0.5">{s.name}</p>
                  <p className="text-[10px] text-surface-muted">{s.team}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Film Room articles */}
          <section>
            <div className="flex items-center justify-between mb-4 border-b border-surface-300 pb-2">
              <h2 className="text-lg font-bold text-surface-text">Film Room</h2>
              <Link href="/" className="text-sm text-brand hover:text-brand/80 font-semibold">See All →</Link>
            </div>
            <div className="space-y-4">
              {analysisArticles.map((a) => (
                <Link key={a.id} href={`/article/${a.slug}`}>
                  <div className="flex gap-4 p-4 bg-surface-200 border border-surface-300 rounded-xl hover:border-brand/40 transition-colors group">
                    <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-brand/10 to-brand-light/5 flex items-center justify-center text-3xl shrink-0">🎬</div>
                    <div className="flex-1 min-w-0">
                      <Kicker label="Premium Analysis" variant="brand" className="mb-1" />
                      <h3 className="text-sm font-bold text-surface-text leading-snug group-hover:text-brand transition-colors line-clamp-2">{a.title}</h3>
                      <div className="flex items-center justify-between mt-2">
                        <CreatorTag byline={a.byline} showAvatar />
                        <span className="text-[10px] text-surface-muted">{formatCount(a.views)} views</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Power Rankings */}
          <div className="bg-surface-200 border border-surface-300 rounded-xl p-4">
            <h2 className="text-sm font-black uppercase tracking-wider text-surface-text mb-4">Power Rankings</h2>
            <div className="space-y-2">
              {POWER_RANKINGS.map((t) => (
                <div key={t.rank} className="flex items-center gap-3">
                  <span className="text-xl font-black text-brand/30 tabular-nums w-6 text-right shrink-0">{t.rank}</span>
                  <span className="text-lg shrink-0">{t.logo}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-surface-text leading-none truncate">{t.name}</p>
                    <p className="text-[10px] text-surface-muted">{t.record}</p>
                  </div>
                  <span className={`text-[10px] font-bold shrink-0 ${
                    t.delta.startsWith("▲") ? "text-emerald-400" :
                    t.delta.startsWith("▼") ? "text-red-400" : "text-surface-muted"
                  }`}>{t.delta}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Unlock Premium CTA */}
          <div className="bg-gradient-to-br from-brand/15 to-brand-light/5 border border-brand/30 rounded-xl p-5 text-center">
            <span className="text-2xl">⭐</span>
            <h3 className="text-sm font-black text-surface-text mt-2 mb-1">Unlock UNDRAFTED+</h3>
            <p className="text-xs text-surface-muted mb-4">Full film rooms, advanced metrics, and draft boards.</p>
            <Link href="/premium" className="block px-4 py-2 bg-brand hover:bg-brand/90 text-white text-xs font-bold rounded-lg transition-colors">
              See Plans →
            </Link>
          </div>

          {/* Advanced Metrics placeholder */}
          <div className="bg-surface-200 border border-surface-300 rounded-xl p-4">
            <h2 className="text-sm font-black uppercase tracking-wider text-surface-text mb-3">Advanced Metrics</h2>
            {[
              { label: "EPA/Play (Chiefs)", value: "+0.31", bar: 85 },
              { label: "DVOA Rank (Eagles)", value: "#2", bar: 78 },
              { label: "True Shooting %", value: "61.2%", bar: 70 },
            ].map((m) => (
              <div key={m.label} className="mb-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-surface-muted">{m.label}</span>
                  <span className="font-bold text-surface-text">{m.value}</span>
                </div>
                <div className="h-1.5 bg-surface-300 rounded-full overflow-hidden">
                  <div className="h-full bg-brand rounded-full" style={{ width: `${m.bar}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
