// Mock betting lines — no real odds provider, purely illustrative.
export interface GameOdds {
  gameId: string;
  spread: string;      // e.g. "HOU -4.5"
  overUnder: string;   // e.g. "224.5"
  moneylineHome: string; // e.g. "-185"
  moneylineAway: string; // e.g. "+155"
  provider: string;
}

export const odds: GameOdds[] = [
  {
    gameId: "game-001",
    spread: "HOU -4.5",
    overUnder: "224.5",
    moneylineHome: "-185",
    moneylineAway: "+155",
    provider: "DraftKings (mock)",
  },
  {
    gameId: "game-002",
    spread: "KC -3",
    overUnder: "46.5",
    moneylineHome: "-155",
    moneylineAway: "+130",
    provider: "DraftKings (mock)",
  },
  {
    gameId: "game-003",
    spread: "BOS -1.5",
    overUnder: "6",
    moneylineHome: "-125",
    moneylineAway: "+105",
    provider: "DraftKings (mock)",
  },
  {
    gameId: "game-011",
    spread: "DEN -2",
    overUnder: "228",
    moneylineHome: "-130",
    moneylineAway: "+110",
    provider: "DraftKings (mock)",
  },
  {
    gameId: "game-012",
    spread: "SF -6.5",
    overUnder: "49",
    moneylineHome: "-260",
    moneylineAway: "+215",
    provider: "DraftKings (mock)",
  },
  {
    gameId: "game-015",
    spread: "BOS -7",
    overUnder: "222",
    moneylineHome: "-290",
    moneylineAway: "+240",
    provider: "DraftKings (mock)",
  },
];
