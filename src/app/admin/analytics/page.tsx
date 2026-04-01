"use client";

import { useState } from "react";
import Panel from "@/components/ui/Panel";
import { formatCount } from "@/lib/utils";

// All analytics data is mock/static — structured to feel like a real observability dashboard.

const KPI_DATA = [
  { label: "Live Users", value: "12,539", change: "+6.3%", up: true },
  { label: "Active Threads", value: "84", change: "+12", up: true },
  { label: "Engagement Rate", value: "72%", change: "+3.1%", up: true },
  { label: "Content Velocity", value: "High", change: "↑", up: true },
  { label: "Retention", value: "68%", change: "-1.2%", up: false },
];

const TOP_ARTICLES = [
  { title: "Rockets Recap: Sengun Dominates", views: 45200, readTime: "3m 42s", scrollDepth: "74%", shares: 2103, conversions: 312 },
  { title: "Chiefs Dynasty Watch", views: 31400, readTime: "3m 15s", scrollDepth: "68%", shares: 1544, conversions: 241 },
  { title: "Lakers Debate: LeBron's Future", views: 28100, readTime: "4m 01s", scrollDepth: "71%", shares: 1209, conversions: 198 },
  { title: "Celtics-Thunder Finals Preview", views: 18700, readTime: "3m 58s", scrollDepth: "65%", shares: 987, conversions: 155 },
  { title: "Sengun: Next Great NBA Big?", views: 16800, readTime: "4m 22s", scrollDepth: "79%", shares: 834, conversions: 143 },
];

const TOP_THREADS = [
  { tag: "#RocketsRefs", comments: 4812, velocity: "Very High" },
  { tag: "#LakersDebate", comments: 3207, velocity: "High" },
  { tag: "#ChiefsEagles", comments: 2891, velocity: "High" },
  { tag: "#SengunMVP", comments: 2104, velocity: "High" },
  { tag: "#AvsBruins", comments: 1544, velocity: "Medium" },
];

const TRENDING_TAGS = ["#Sengun", "#Lakers", "#Refs", "#Chiefs", "#Mahomes", "#MacKinnon", "#NBA", "#Playoffs"];

const REGIONS = [
  { name: "United States", pct: 50, color: "bg-blue-500" },
  { name: "United Kingdom", pct: 20, color: "bg-green-500" },
  { name: "Canada", pct: 10, color: "bg-yellow-500" },
  { name: "Australia", pct: 8, color: "bg-orange-500" },
  { name: "Other", pct: 12, color: "bg-gray-500" },
];

const FUNNEL_STEPS = [
  { label: "Home", users: 12539, dropoff: null },
  { label: "Game Page", users: 8801, dropoff: "30%" },
  { label: "Thread", users: 5921, dropoff: "33%" },
  { label: "Poll", users: 3991, dropoff: "32%" },
];

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("live");

  return (
    <div className="bg-gray-950 min-h-screen pb-16">
      {/* Dashboard Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-lg font-black text-white">📊 Analytics Dashboard</h1>
            <p className="text-xs text-gray-500 mt-0.5">All data is mock/simulated — updated on page load</p>
          </div>
          <div className="flex gap-1">
            {["live", "1h", "24h", "7d"].map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${timeRange === r ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}
              >
                {r === "live" ? "🔴 Live" : r}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-6 space-y-6">
        {/* ── 1. KPI Bar ─────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {KPI_DATA.map((kpi) => (
            <div key={kpi.label} className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{kpi.label}</p>
              <p className="text-2xl font-black text-white">{kpi.value}</p>
              <p className={`text-xs font-semibold mt-1 ${kpi.up ? "text-green-400" : "text-red-400"}`}>
                {kpi.change}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* ── 2. Live Game Impact ─────────────────────────────── */}
          <div className="lg:col-span-2">
            <Panel title="Live Game Impact" accent="border-red-600"
              titleRight={<span className="text-red-400 text-xs animate-pulse">● LIVE</span>}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Rockets vs Lakers */}
                <div className="bg-gray-800 rounded-lg p-4 border border-red-900/50">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-bold text-white">🚀 Rockets vs Lakers 👑</p>
                    <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded font-bold">LIVE</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <Metric label="Users Added" value="+4,200" up />
                    <Metric label="Thread Joins" value="+1,800" up />
                    <Metric label="Engagement" value="+320%" up />
                    <Metric label="Highlights" value="3 queued" up />
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <p className="text-xs text-gray-400">Top Trigger:</p>
                    <p className="text-xs font-bold text-orange-400 mt-0.5">🔥 "Sengun dunk" — 96% confidence</p>
                  </div>
                </div>

                {/* Chiefs vs Eagles */}
                <div className="bg-gray-800 rounded-lg p-4 border border-yellow-900/50">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-bold text-white">🏈 Chiefs vs Eagles 🦅</p>
                    <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded font-bold">LIVE</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <Metric label="Users Added" value="+2,910" up />
                    <Metric label="Thread Joins" value="+1,100" up />
                    <Metric label="Engagement" value="+198%" up />
                    <Metric label="Alerts Sent" value="2" up />
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <p className="text-xs text-gray-400">Top Trigger:</p>
                    <p className="text-xs font-bold text-orange-400 mt-0.5">🔥 "Mahomes TD scramble"</p>
                  </div>
                </div>
              </div>
            </Panel>
          </div>

          {/* ── 5. Engagement Intelligence ──────────────────────── */}
          <div>
            <Panel title="Engagement Intelligence" accent="border-purple-600">
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Trending Tags</p>
                  <div className="flex flex-wrap gap-1.5">
                    {TRENDING_TAGS.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 bg-purple-900/50 border border-purple-800 text-purple-300 text-xs rounded-full font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Predicted Growth</p>
                  <p className="text-sm font-bold text-green-400">📈 High — Next 2 hours</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Recommended Push</p>
                  <p className="text-sm font-semibold text-yellow-400">"Rockets Contenders Debate"</p>
                  <p className="text-xs text-gray-500 mt-0.5">Estimated reach: 8,200 users</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">AI Signal</p>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-300">📝 Editorial: Push Sengun MVP piece</p>
                    <p className="text-xs text-gray-300">🔔 Push: Kelce injury update</p>
                    <p className="text-xs text-gray-300">📊 Poll: Rockets playoff seed?</p>
                  </div>
                </div>
              </div>
            </Panel>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* ── 3. Content Performance ─────────────────────────── */}
          <div className="lg:col-span-2">
            <Panel title="Content Performance" accent="border-blue-600"
              titleRight={<span className="text-gray-400">Avg read: 3m 42s</span>}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-gray-500 uppercase border-b border-gray-800">
                      <th className="text-left pb-2">Article</th>
                      <th className="text-right pb-2">Views</th>
                      <th className="text-right pb-2 hidden sm:table-cell">Scroll</th>
                      <th className="text-right pb-2 hidden md:table-cell">Shares</th>
                      <th className="text-right pb-2">Conv.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {TOP_ARTICLES.map((art, i) => (
                      <tr key={i} className="hover:bg-gray-800/30 transition-colors">
                        <td className="py-2 pr-4">
                          <p className="text-gray-200 text-xs leading-snug line-clamp-2">{art.title}</p>
                          <p className="text-gray-600 text-xs">{art.readTime} avg</p>
                        </td>
                        <td className="py-2 text-right text-white font-semibold tabular-nums whitespace-nowrap">
                          {formatCount(art.views)}
                        </td>
                        <td className="py-2 text-right text-gray-400 hidden sm:table-cell">{art.scrollDepth}</td>
                        <td className="py-2 text-right text-gray-400 hidden md:table-cell">{formatCount(art.shares)}</td>
                        <td className="py-2 text-right text-green-400 font-semibold">{art.conversions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>

          {/* ── 4. Thread Intelligence ──────────────────────────── */}
          <div>
            <Panel title="Thread Intelligence" accent="border-yellow-600"
              titleRight={<span className="text-red-400 text-xs font-bold">12 flagged ⚠️</span>}>
              <div className="space-y-3">
                {TOP_THREADS.map((t) => (
                  <div key={t.tag} className="flex items-center justify-between border-b border-gray-800 pb-2 last:border-0">
                    <div>
                      <p className="text-sm font-bold text-white">{t.tag}</p>
                      <p className="text-xs text-gray-500">{formatCount(t.comments)} comments</p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      t.velocity === "Very High" ? "bg-orange-900 text-orange-400" :
                      t.velocity === "High" ? "bg-yellow-900 text-yellow-400" :
                      "bg-gray-800 text-gray-400"
                    }`}>
                      {t.velocity === "Very High" ? "🔥 " : ""}{t.velocity}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-800">
                <p className="text-xs text-gray-400 mb-1">Toxicity Alerts</p>
                <p className="text-sm font-bold text-red-400">⚠️ 12 threads flagged</p>
                <p className="text-xs text-gray-500 mt-0.5">Awaiting moderator review</p>
              </div>
            </Panel>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* ── 6. User Behavior ─────────────────────────────────── */}
          <div>
            <Panel title="User Behavior" accent="border-green-600">
              <div className="space-y-3">
                <BehaviorStat label="Session Time" value="2m 24s" />
                <BehaviorStat label="Pages / Session" value="3.6" />
                <BehaviorStat label="Return Rate" value="42%" />
                <BehaviorStat label="Mobile Share" value="64%" />
                <div className="mt-4 pt-3 border-t border-gray-800">
                  <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Top Regions</p>
                  <div className="space-y-2">
                    {REGIONS.map((r) => (
                      <div key={r.name}>
                        <div className="flex justify-between text-xs mb-0.5">
                          <span className="text-gray-300">{r.name}</span>
                          <span className="text-gray-400">{r.pct}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div className={`h-full ${r.color} rounded-full`} style={{ width: `${r.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Panel>
          </div>

          {/* ── 7. Funnel + Conversion ───────────────────────────── */}
          <div>
            <Panel title="User Funnel" accent="border-orange-600">
              <div className="space-y-2">
                {FUNNEL_STEPS.map((step, i) => {
                  const widthPct = Math.round((step.users / FUNNEL_STEPS[0].users) * 100);
                  return (
                    <div key={step.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-300 font-medium">{step.label}</span>
                        <span className="text-white font-bold">{formatCount(step.users)}</span>
                      </div>
                      <div className="h-7 bg-gray-800 rounded overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-700 to-orange-500 rounded flex items-center px-2 transition-all"
                          style={{ width: `${widthPct}%` }}
                        >
                          <span className="text-xs text-white font-bold whitespace-nowrap">{widthPct}%</span>
                        </div>
                      </div>
                      {step.dropoff && (
                        <p className="text-xs text-red-400 mt-0.5 text-right">↓ {step.dropoff} drop-off</p>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 pt-3 border-t border-gray-800 text-xs text-gray-500">
                <p>Biggest drop-off: Thread → Poll (32%)</p>
              </div>
            </Panel>
          </div>

          {/* ── 8. System Performance ───────────────────────────── */}
          <div>
            <Panel title="System Performance" accent="border-gray-600">
              <div className="space-y-3">
                <SysStat label="API Latency" value="120ms" status="good" />
                <SysStat label="Realtime Sync" value="Stable" status="good" />
                <SysStat label="Error Rate" value="0.2%" status="good" />
                <SysStat label="CDN Cache Hit" value="94.1%" status="good" />
                <SysStat label="DB Query Time" value="38ms" status="good" />
                <SysStat label="Memory Usage" value="62%" status="warn" />
                <SysStat label="Push Queue" value="14 pending" status="good" />
                <SysStat label="Uptime (30d)" value="99.97%" status="good" />
              </div>
              <div className="mt-4 pt-3 border-t border-gray-800">
                <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Incident Log</p>
                <p className="text-xs text-green-400">✅ No active incidents</p>
                <p className="text-xs text-gray-600 mt-1">Last incident: 14 days ago</p>
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Helper components ───────────────────────────────────────────

function Metric({ label, value, up }: { label: string; value: string; up: boolean }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`text-sm font-bold ${up ? "text-green-400" : "text-red-400"}`}>{value}</p>
    </div>
  );
}

function BehaviorStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-800 pb-2 last:border-0">
      <span className="text-sm text-gray-400">{label}</span>
      <span className="text-sm font-bold text-white">{value}</span>
    </div>
  );
}

function SysStat({ label, value, status }: { label: string; value: string; status: "good" | "warn" | "bad" }) {
  const colors = { good: "text-green-400", warn: "text-yellow-400", bad: "text-red-400" };
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-gray-400">{label}</span>
      <span className={`text-xs font-bold tabular-nums ${colors[status]}`}>{value}</span>
    </div>
  );
}
