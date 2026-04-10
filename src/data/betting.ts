// ═══════════════════════════════════════════════════════
// UNDRAFTED — Mock Betting Data
// Purely illustrative. No real odds provider.
// ═══════════════════════════════════════════════════════

export interface BettingLine {
  gameId: string;

  // ── Spread ────────────────────────────────────────────
  spreadFavorite: string;   // Short team name, e.g. "HOU"
  spreadCurrent: number;    // Current number, e.g. -4.5
  spreadOpen: number;       // Opening line, e.g. -3.0
  spreadJuice: string;      // "-110" (both sides assumed equal unless noted)

  // ── Total ─────────────────────────────────────────────
  totalCurrent: number;     // Current O/U, e.g. 224.5
  totalOpen: number;        // Opening total
  totalJuiceOver: string;
  totalJuiceUnder: string;

  // ── Moneyline ─────────────────────────────────────────
  moneylineHome: number;    // e.g. -185
  moneylineAway: number;    // e.g. +155

  // ── Public betting % (recreational bettors) ───────────
  publicSpreadHomePct: number;  // % of tickets on home spread
  publicOverPct: number;        // % of tickets on Over
  publicMLHomePct: number;      // % of tickets on home ML

  // ── Sharp handle % (professional bettors) ─────────────
  sharpSpreadHomePct: number;   // % of sharp $ on home spread
  sharpOverPct: number;         // % of sharp $ on Over

  // ── Edge signal ───────────────────────────────────────
  /** Primary sharp signal this game */
  edgeSignal: "sharp_home" | "sharp_away" | "sharp_over" | "sharp_under" | "square" | "split";
  edgeLabel: string;   // Human-readable, e.g. "Sharp Lean: Houston"
  edgeRating: 1 | 2 | 3;  // 1 = mild, 3 = strong

  provider: string;
}

export const bettingLines: BettingLine[] = [
  {
    gameId: "game-001",
    // NBA Rockets (home) vs Lakers (away)
    spreadFavorite: "HOU",
    spreadCurrent: -4.5,
    spreadOpen: -3.0,
    spreadJuice: "-110",
    totalCurrent: 224.5,
    totalOpen: 222.0,
    totalJuiceOver: "-112",
    totalJuiceUnder: "-108",
    moneylineHome: -185,
    moneylineAway: 155,
    publicSpreadHomePct: 38,   // Public fading Houston (sharps love HOU)
    publicOverPct: 64,
    publicMLHomePct: 52,
    sharpSpreadHomePct: 71,    // Sharps hammering HOU
    sharpOverPct: 44,
    edgeSignal: "sharp_home",
    edgeLabel: "Sharp Lean: Houston",
    edgeRating: 3,
    provider: "DraftKings (mock)",
  },
  {
    gameId: "game-002",
    // NFL KC (home) vs opponent
    spreadFavorite: "KC",
    spreadCurrent: -3.0,
    spreadOpen: -2.5,
    spreadJuice: "-115",
    totalCurrent: 46.5,
    totalOpen: 47.5,
    totalJuiceOver: "-108",
    totalJuiceUnder: "-112",
    moneylineHome: -155,
    moneylineAway: 130,
    publicSpreadHomePct: 72,
    publicOverPct: 58,
    publicMLHomePct: 74,
    sharpSpreadHomePct: 68,
    sharpOverPct: 31,          // Sharps betting Under
    edgeSignal: "sharp_under",
    edgeLabel: "Sharp Lean: Under 46.5",
    edgeRating: 2,
    provider: "DraftKings (mock)",
  },
  {
    gameId: "game-003",
    // MLB BOS (home) vs opponent
    spreadFavorite: "BOS",
    spreadCurrent: -1.5,
    spreadOpen: -1.5,
    spreadJuice: "-120",
    totalCurrent: 6.0,
    totalOpen: 6.5,
    totalJuiceOver: "-110",
    totalJuiceUnder: "-110",
    moneylineHome: -125,
    moneylineAway: 105,
    publicSpreadHomePct: 61,
    publicOverPct: 55,
    publicMLHomePct: 63,
    sharpSpreadHomePct: 59,
    sharpOverPct: 52,
    edgeSignal: "split",
    edgeLabel: "No Edge (Line Sharp vs. Square)",
    edgeRating: 1,
    provider: "DraftKings (mock)",
  },
  {
    gameId: "game-011",
    // NBA DEN (home) vs opponent
    spreadFavorite: "DEN",
    spreadCurrent: -2.0,
    spreadOpen: -3.5,
    spreadJuice: "-110",
    totalCurrent: 228.0,
    totalOpen: 225.5,
    totalJuiceOver: "-115",
    totalJuiceUnder: "-105",
    moneylineHome: -130,
    moneylineAway: 110,
    publicSpreadHomePct: 55,
    publicOverPct: 71,
    publicMLHomePct: 58,
    sharpSpreadHomePct: 36,    // Sharps fading Denver (line dropped)
    sharpOverPct: 74,          // Sharp money on Over
    edgeSignal: "sharp_over",
    edgeLabel: "Sharp Steam: Over 228",
    edgeRating: 3,
    provider: "DraftKings (mock)",
  },
  {
    gameId: "game-012",
    // NFL SF (home) vs opponent
    spreadFavorite: "SF",
    spreadCurrent: -6.5,
    spreadOpen: -4.5,
    spreadJuice: "-110",
    totalCurrent: 49.0,
    totalOpen: 50.5,
    totalJuiceOver: "-108",
    totalJuiceUnder: "-112",
    moneylineHome: -260,
    moneylineAway: 215,
    publicSpreadHomePct: 81,   // Public loves SF
    publicOverPct: 62,
    publicMLHomePct: 79,
    sharpSpreadHomePct: 83,    // Sharps agree — both sides
    sharpOverPct: 40,
    edgeSignal: "square",
    edgeLabel: "Public + Sharp on SF",
    edgeRating: 2,
    provider: "DraftKings (mock)",
  },
  {
    gameId: "game-015",
    // NBA BOS (home) vs opponent
    spreadFavorite: "BOS",
    spreadCurrent: -7.0,
    spreadOpen: -5.5,
    spreadJuice: "-110",
    totalCurrent: 222.0,
    totalOpen: 224.0,
    totalJuiceOver: "-110",
    totalJuiceUnder: "-110",
    moneylineHome: -290,
    moneylineAway: 240,
    publicSpreadHomePct: 73,
    publicOverPct: 60,
    publicMLHomePct: 76,
    sharpSpreadHomePct: 78,
    sharpOverPct: 33,
    edgeSignal: "sharp_under",
    edgeLabel: "Sharp Lean: Under 222",
    edgeRating: 2,
    provider: "DraftKings (mock)",
  },
];

/** Lookup by gameId */
export const bettingLineMap = Object.fromEntries(
  bettingLines.map((l) => [l.gameId, l])
);
