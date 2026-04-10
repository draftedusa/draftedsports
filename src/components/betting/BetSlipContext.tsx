"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────
export type BetMarket = "spread" | "total" | "moneyline";

export interface BetSelection {
  id: string;          // e.g. "game-001-spread-home"
  gameId: string;
  gameLabel: string;   // "HOU vs LAL"
  market: BetMarket;
  pick: string;        // "HOU -4.5", "Over 224.5", "HOU ML"
  odds: string;        // "-110", "+155"
  oddsNum: number;     // -110 as a number for payout math
}

interface BetSlipContextValue {
  bets: BetSelection[];
  addBet: (bet: BetSelection) => void;
  removeBet: (id: string) => void;
  hasBet: (id: string) => boolean;
  clearAll: () => void;
}

const BetSlipContext = createContext<BetSlipContextValue | null>(null);

export function useBetSlip() {
  const ctx = useContext(BetSlipContext);
  if (!ctx) throw new Error("useBetSlip must be used inside BetSlipProvider");
  return ctx;
}

// ─────────────────────────────────────────────────────────
// Payout helpers
// ─────────────────────────────────────────────────────────
function americanToPayout(odds: number, wager: number): number {
  if (odds >= 0) return wager + (wager * odds) / 100;
  return wager + (wager * 100) / Math.abs(odds);
}

function formatOdds(n: number): string {
  return n > 0 ? `+${n}` : `${n}`;
}

// ─────────────────────────────────────────────────────────
// Floating BetSlip panel
// ─────────────────────────────────────────────────────────
function BetSlipPanel() {
  const { bets, removeBet, clearAll } = useBetSlip();
  const [open, setOpen] = useState(true);
  const [wager, setWager] = useState("10");
  const [placed, setPlaced] = useState(false);

  const wagerNum = Math.max(0, parseFloat(wager) || 0);
  const totalPayout = bets.reduce((acc, b) => {
    // Parlay-style cumulative multiply not implemented; show single-leg sum
    return acc + americanToPayout(b.oddsNum, wagerNum);
  }, 0);

  function handlePlace() {
    setPlaced(true);
    setTimeout(() => {
      setPlaced(false);
      clearAll();
    }, 2400);
  }

  if (bets.length === 0 && !placed) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-[200] w-72 shadow-2xl rounded-2xl overflow-hidden border border-surface-300 dark:border-white/10"
      style={{ background: "var(--surface-100)" }}
    >
      {/* ── Header ────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-brand text-white text-xs font-black uppercase tracking-widest"
      >
        <span className="flex items-center gap-2">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
            <path d="M10 2a1 1 0 0 1 .894.553l1.618 3.278 3.618.526a1 1 0 0 1 .554 1.706l-2.618 2.55.618 3.604A1 1 0 0 1 13.236 15.1L10 13.4l-3.236 1.7a1 1 0 0 1-1.448-1.053l.618-3.604-2.618-2.55a1 1 0 0 1 .554-1.706l3.618-.526 1.618-3.278A1 1 0 0 1 10 2Z" />
          </svg>
          Bet Slip
          {bets.length > 0 && (
            <span className="bg-white/25 text-white rounded-full px-1.5 py-0.5 text-[10px] font-black leading-none">
              {bets.length}
            </span>
          )}
        </span>
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`w-4 h-4 transition-transform ${open ? "" : "rotate-180"}`}
        >
          <path
            fillRule="evenodd"
            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <div className="px-3 py-3 space-y-2.5">
          {placed ? (
            <div className="py-6 text-center space-y-2">
              <div className="text-2xl">🎯</div>
              <p className="text-sm font-black text-brand">Bets Placed!</p>
              <p className="text-[10px] text-surface-muted">
                (This is a mock — no real money.)
              </p>
            </div>
          ) : (
            <>
              {/* ── Bet list ──────────────────────────── */}
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {bets.map((bet) => (
                  <div
                    key={bet.id}
                    className="flex items-start justify-between gap-2 bg-surface-200 rounded-xl px-3 py-2.5"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold text-surface-text truncate">
                        {bet.pick}
                      </p>
                      <p className="text-[9px] text-surface-muted mt-0.5 truncate">
                        {bet.gameLabel} ·{" "}
                        <span
                          className={
                            bet.oddsNum > 0 ? "text-green-500" : "text-surface-muted"
                          }
                        >
                          {formatOdds(bet.oddsNum)}
                        </span>
                      </p>
                    </div>
                    <button
                      onClick={() => removeBet(bet.id)}
                      className="shrink-0 text-surface-muted hover:text-red-400 transition-colors"
                      aria-label="Remove bet"
                    >
                      <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                        <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              {/* ── Wager input ───────────────────────── */}
              <div className="flex items-center gap-2 bg-surface-200 rounded-xl px-3 py-2.5">
                <span className="text-xs font-black text-surface-muted">$</span>
                <input
                  type="number"
                  min="1"
                  step="5"
                  value={wager}
                  onChange={(e) => setWager(e.target.value)}
                  className="flex-1 bg-transparent text-sm font-bold text-surface-text outline-none tabular-nums"
                  placeholder="10"
                />
                <span className="text-[10px] text-surface-muted">wager</span>
              </div>

              {/* ── Payout ────────────────────────────── */}
              <div className="flex justify-between items-center px-0.5">
                <span className="text-[10px] text-surface-muted uppercase tracking-widest">
                  Est. Payout
                </span>
                <span className="text-sm font-black text-brand tabular-nums">
                  ${totalPayout.toFixed(2)}
                </span>
              </div>

              {/* ── CTA row ───────────────────────────── */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-[10px] text-surface-muted hover:text-surface-text transition-colors px-2 py-1"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={handlePlace}
                  disabled={bets.length === 0}
                  className="flex-1 py-2 bg-brand hover:bg-brand/90 disabled:opacity-40 text-white text-xs font-black rounded-full transition-colors"
                >
                  Place {bets.length} Bet{bets.length !== 1 ? "s" : ""}
                </button>
              </div>

              <p className="text-[9px] text-surface-muted text-center pb-1">
                Mock only · No real wagers accepted
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Provider + Shell (wraps layout children)
// ─────────────────────────────────────────────────────────
export function BetSlipProvider({ children }: { children: ReactNode }) {
  const [bets, setBets] = useState<BetSelection[]>([]);

  const addBet = useCallback((bet: BetSelection) => {
    setBets((prev) => {
      // Replace if same selection id exists
      const filtered = prev.filter((b) => b.id !== bet.id);
      return [...filtered, bet];
    });
  }, []);

  const removeBet = useCallback((id: string) => {
    setBets((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const hasBet = useCallback(
    (id: string) => bets.some((b) => b.id === id),
    [bets]
  );

  const clearAll = useCallback(() => setBets([]), []);

  return (
    <BetSlipContext.Provider value={{ bets, addBet, removeBet, hasBet, clearAll }}>
      {children}
      <BetSlipPanel />
    </BetSlipContext.Provider>
  );
}
