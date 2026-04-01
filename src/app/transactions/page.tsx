import Link from "next/link";
import { transactions } from "@/data/transactions";
import { teams } from "@/data/teams";
import { leagues } from "@/data/leagues";

const teamMap = Object.fromEntries(teams.map((t) => [t.id, t]));

const TYPE_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  trade:     { label: "Trade",     color: "text-purple-400 bg-purple-950 border-purple-800",  icon: "🔄" },
  signing:   { label: "Signing",   color: "text-green-400  bg-green-950  border-green-800",   icon: "✍️" },
  extension: { label: "Extension", color: "text-blue-400   bg-blue-950   border-blue-800",    icon: "📝" },
  release:   { label: "Release",   color: "text-gray-400   bg-gray-800   border-gray-700",    icon: "🚪" },
  waiver:    { label: "Waiver",    color: "text-yellow-400 bg-yellow-950 border-yellow-800",  icon: "📋" },
  injury:    { label: "Injury",    color: "text-red-400    bg-red-950    border-red-800",      icon: "🩹" },
};

export default function TransactionsPage() {
  const breaking = transactions.filter((t) => t.isBreaking);
  const byLeague = leagues.map((l) => ({
    league: l,
    txs: transactions.filter((t) => t.leagueId === l.id),
  })).filter((g) => g.txs.length > 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      <h1 className="text-2xl font-black text-white border-b border-gray-800 pb-4">
        Transactions &amp; News
      </h1>

      {/* Breaking */}
      {breaking.length > 0 && (
        <section>
          <h2 className="flex items-center gap-2 text-sm font-bold text-red-400 uppercase tracking-widest mb-3">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Breaking
          </h2>
          <div className="space-y-3">
            {breaking.map((tx) => (
              <TransactionCard key={tx.id} tx={tx} />
            ))}
          </div>
        </section>
      )}

      {/* By League */}
      {byLeague.map(({ league, txs }) => (
        <section key={league.id}>
          <h2 className="flex items-center gap-2 text-base font-bold text-white mb-3 border-b border-gray-800 pb-2">
            {league.logo} {league.name}
          </h2>
          <div className="space-y-3">
            {txs.map((tx) => (
              <TransactionCard key={tx.id} tx={tx} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function TransactionCard({ tx }: { tx: (typeof transactions)[number] }) {
  const cfg = TYPE_CONFIG[tx.type];
  const involvedTeams = teams.filter((t) => tx.teamIds.includes(t.id));

  return (
    <div className={`border rounded-lg p-4 ${tx.isBreaking ? "border-red-900 bg-red-950/10" : "border-gray-800 bg-gray-900"}`}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold rounded border ${cfg.color}`}>
            {cfg.icon} {cfg.label}
          </span>
          {tx.isBreaking && (
            <span className="px-2 py-0.5 text-xs font-bold text-white bg-red-600 rounded">BREAKING</span>
          )}
        </div>
        <span className="text-xs text-gray-600 shrink-0">{tx.date}</span>
      </div>

      <h3 className="text-sm font-bold text-white mb-1 leading-snug">{tx.headline}</h3>
      <p className="text-sm text-gray-400 leading-relaxed mb-3">{tx.detail}</p>

      {involvedTeams.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {involvedTeams.map((team) => (
            <Link key={team.id} href={`/team/${team.slug}`}>
              <span className="flex items-center gap-1 px-2 py-0.5 bg-gray-800 hover:bg-gray-700 rounded text-xs text-gray-300 transition-colors">
                {team.logo} {team.name}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
