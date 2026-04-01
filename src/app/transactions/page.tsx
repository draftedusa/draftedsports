import Link from "next/link";
import { transactions } from "@/data/transactions";
import { teams } from "@/data/teams";
import { leagues } from "@/data/leagues";

const teamMap = Object.fromEntries(teams.map((t) => [t.id, t]));

const TYPE_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  trade:     { label: "Trade",     color: "text-purple-500 bg-purple-500/10 border-purple-500/30", icon: "🔄" },
  signing:   { label: "Signing",   color: "text-green-500  bg-green-500/10  border-green-500/30",  icon: "✍️" },
  extension: { label: "Extension", color: "text-blue-500   bg-blue-500/10   border-blue-500/30",   icon: "📝" },
  release:   { label: "Release",   color: "text-surface-muted bg-surface-300 border-surface-300",  icon: "🚪" },
  waiver:    { label: "Waiver",    color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/30", icon: "📋" },
  injury:    { label: "Injury",    color: "text-red-500    bg-red-500/10    border-red-500/30",     icon: "🩹" },
};

export default function TransactionsPage() {
  const breaking = transactions.filter((t) => t.isBreaking);
  const byLeague = leagues.map((l) => ({
    league: l,
    txs: transactions.filter((t) => t.leagueId === l.id),
  })).filter((g) => g.txs.length > 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      <h1 className="text-2xl font-black text-surface-text border-b border-surface-300 pb-4">
        Transactions &amp; News
      </h1>

      {/* Breaking */}
      {breaking.length > 0 && (
        <section>
          <h2 className="flex items-center gap-2 text-sm font-bold text-brand uppercase tracking-widest mb-3">
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
          <h2 className="flex items-center gap-2 text-base font-bold text-surface-text mb-3 border-b border-surface-300 pb-2">
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
    <div className={`border rounded-xl p-4 ${tx.isBreaking ? "border-brand/40 bg-brand/5" : "border-surface-300 bg-surface-200"}`}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold rounded border ${cfg.color}`}>
            {cfg.icon} {cfg.label}
          </span>
          {tx.isBreaking && (
            <span className="px-2 py-0.5 text-xs font-bold text-surface-text bg-red-600 rounded">BREAKING</span>
          )}
        </div>
        <span className="text-xs text-surface-muted shrink-0">{tx.date}</span>
      </div>

      <h3 className="text-sm font-bold text-surface-text mb-1 leading-snug">{tx.headline}</h3>
      <p className="text-sm text-surface-muted leading-relaxed mb-3">{tx.detail}</p>

      {involvedTeams.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {involvedTeams.map((team) => (
            <Link key={team.id} href={`/team/${team.slug}`}>
              <span className="flex items-center gap-1 px-2 py-0.5 bg-surface-300 hover:bg-surface-300 rounded text-xs text-surface-text transition-colors">
                {team.logo} {team.name}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
