// ═══════════════════════════════════════════════════════
// UNDRAFTED — Sports Domain Types
// Deep domain model for rosters, stats, schedules,
// standings, transactions, injuries, and draft.
// ═══════════════════════════════════════════════════════

// ── Player & Roster ──────────────────────────────────

export type PlayerStatus = "active" | "injured" | "suspended" | "practice_squad" | "waived";
export type PlayerHand = "L" | "R" | "S"; // Switch for baseball/hockey

export interface RosterPlayer {
  id: string;
  teamId: string;
  leagueId: string;
  name: string;
  firstName: string;
  lastName: string;
  number: number;
  position: string;
  /** Position group for filtering (e.g. "QB", "WR", "OL") */
  positionGroup: string;
  age: number;
  height: string;    // "6'4\""
  weight: number;    // lbs
  college?: string;
  birthdate: string; // ISO date
  birthCity?: string;
  nationality?: string;
  avatar?: string;   // URL or emoji placeholder
  status: PlayerStatus;
  yearsExp: number;
  draftYear?: number;
  draftRound?: number;
  draftPick?: number;
  /** Contract reference */
  contractId?: string;
}

// ── Per-Sport Stat Shapes ─────────────────────────────

export interface NFLPassingStats {
  attempts: number;
  completions: number;
  completionPct: number;
  yards: number;
  touchdowns: number;
  interceptions: number;
  sacks: number;
  rating: number;
  yardsPerAttempt: number;
  longestPass: number;
}

export interface NFLRushingStats {
  carries: number;
  yards: number;
  yardsPerCarry: number;
  touchdowns: number;
  fumbles: number;
  longestRush: number;
  yardsAfterContact: number;
}

export interface NFLReceivingStats {
  targets: number;
  receptions: number;
  yards: number;
  yardsPerReception: number;
  touchdowns: number;
  drops: number;
  longestReception: number;
}

export interface NBAStats {
  gamesPlayed: number;
  minutesPerGame: number;
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  fieldGoalPct: number;
  threePointPct: number;
  freeThrowPct: number;
  plusMinus: number;
  playerEfficiencyRating: number;
  trueShootingPct: number;
}

export interface MLBBattingStats {
  gamesPlayed: number;
  atBats: number;
  hits: number;
  doubles: number;
  triples: number;
  homeRuns: number;
  rbi: number;
  runs: number;
  stolenBases: number;
  avg: number;   // Batting average
  obp: number;   // On-base %
  slg: number;   // Slugging %
  ops: number;   // OBP + SLG
  strikeouts: number;
  walks: number;
}

export interface MLBPitchingStats {
  wins: number;
  losses: number;
  era: number;
  gamesStarted: number;
  inningsPitched: number;
  strikeouts: number;
  walks: number;
  hitsAllowed: number;
  homeRunsAllowed: number;
  whip: number;
  saves: number;
  holds: number;
  strikeoutsPer9: number;
}

export interface NHLSkaterStats {
  gamesPlayed: number;
  goals: number;
  assists: number;
  points: number;
  plusMinus: number;
  penaltyMinutes: number;
  powerPlayGoals: number;
  powerPlayPoints: number;
  shorthandedGoals: number;
  gameWinningGoals: number;
  shots: number;
  shootingPct: number;
  timeOnIcePerGame: string; // "22:14"
}

export interface NHLGoalieStats {
  gamesPlayed: number;
  wins: number;
  losses: number;
  otLosses: number;
  goalsAgainstAvg: number;
  savePercentage: number;
  shutouts: number;
  saves: number;
  shotsAgainst: number;
}

export type PlayerStats =
  | NFLPassingStats
  | NFLRushingStats
  | NFLReceivingStats
  | NBAStats
  | MLBBattingStats
  | MLBPitchingStats
  | NHLSkaterStats
  | NHLGoalieStats;

// ── Stat Leaders ──────────────────────────────────────

export interface StatLeader {
  rank: number;
  playerId: string;
  playerName: string;
  teamId: string;
  teamName: string;
  value: number | string;
  label: string; // "PPG", "HR", "ERA", etc.
  secondaryValue?: number | string;
  secondaryLabel?: string;
}

export interface StatLeaderboard {
  leagueId: string;
  category: string; // "scoring", "passing", "rebounds", etc.
  label: string;    // Display name
  unit: string;     // "PPG", "YDS", etc.
  season: string;
  updatedAt: string;
  leaders: StatLeader[];
}

// ── Standings ─────────────────────────────────────────

export interface StandingsRow {
  teamId: string;
  teamName: string;
  teamSlug: string;
  divisionId?: string;
  conferenceId?: string;
  wins: number;
  losses: number;
  /** Ties (NFL) or OT losses (NHL) */
  ties?: number;
  pct: number;
  gamesBack?: number;
  homeRecord: string;
  awayRecord: string;
  /** Last 10 games */
  last10: string;
  streak: string;   // "W3", "L2"
  /** Conference record */
  confRecord?: string;
  /** Division record */
  divRecord?: string;
  /** Points For (NFL/NHL) */
  pointsFor?: number;
  /** Points Against (NFL/NHL) */
  pointsAgainst?: number;
  /** Run Differential (MLB) */
  runDiff?: number;
  /** Magic number to clinch */
  magicNumber?: number | null;
  clinched?: "division" | "wildcard" | "playoff" | null;
}

export interface Standings {
  leagueId: string;
  season: string;
  label: "Standings" | "Rankings" | "Tables";
  updatedAt: string;
  divisions?: { divisionId: string; name: string; rows: StandingsRow[] }[];
  conferences?: { conferenceId: string; name: string; rows: StandingsRow[] }[];
  /** Flat (no division/conference grouping) */
  rows?: StandingsRow[];
}

// ── Schedule & Games ─────────────────────────────────

export type BroadcastNetwork =
  | "ESPN" | "ESPN2" | "ABC" | "Fox" | "FS1" | "CBS" | "NBC"
  | "TNT" | "TBS" | "Max" | "Peacock" | "Paramount+" | "Apple TV+"
  | "Amazon Prime" | "DAZN" | "NFL Network" | "NBA TV" | "MLB Network"
  | "NHL Network" | "ACC Network" | "SEC Network" | "Big Ten Network";

export interface ScheduleGame {
  id: string;
  leagueId: string;
  homeTeamId: string;
  awayTeamId: string;
  homeTeamName: string;
  awayTeamName: string;
  homeTeamLogo: string;
  awayTeamLogo: string;
  homeScore?: number;
  awayScore?: number;
  status: "upcoming" | "live" | "final" | "postponed" | "cancelled";
  /** ISO datetime */
  startTime: string;
  /** Timezone abbreviation */
  timezone: string;
  /** Clock or period info */
  clock?: string;
  /** "4th Quarter", "3rd Period", "Top 7th" */
  period?: string;
  network?: BroadcastNetwork;
  venue?: string;
  city?: string;
  /** For NFL: week number; MLB: game number */
  weekOrGame?: number;
  /** Playoff round label */
  seriesInfo?: string;
  isNeutralSite?: boolean;
  /** Pre-game odds */
  spread?: string;
  overUnder?: number;
  moneylineHome?: number;
  moneylineAway?: number;
}

// ── Boxscore ──────────────────────────────────────────

export interface BoxscoreTeamStats {
  teamId: string;
  teamName: string;
  score: number;
  /** Line score per period/inning */
  lineScore: number[];
  stats: Record<string, number | string>;
}

export interface BoxscorePlayerLine {
  playerId: string;
  playerName: string;
  position: string;
  number: number;
  starter: boolean;
  stats: Record<string, number | string>;
  didNotPlay?: boolean;
  dnpReason?: string;
}

export interface Boxscore {
  gameId: string;
  leagueId: string;
  status: "live" | "final" | "upcoming";
  clock?: string;
  period?: string;
  home: BoxscoreTeamStats;
  away: BoxscoreTeamStats;
  homePlayers: BoxscorePlayerLine[];
  awayPlayers: BoxscorePlayerLine[];
  officials?: string[];
  attendance?: number;
  updatedAt: string;
}

// ── Play-by-Play ──────────────────────────────────────

export type PlayType =
  | "score" | "turnover" | "timeout" | "penalty" | "injury"
  | "challenge" | "replay" | "highlight" | "substitution"
  | "pitching_change" | "end_of_period" | "kickoff" | "other";

export interface PlayByPlayEvent {
  id: string;
  gameId: string;
  sequence: number;
  /** ISO datetime */
  timestamp: string;
  /** Game clock */
  clock: string;
  period: string;
  type: PlayType;
  teamId?: string;
  playerId?: string;
  description: string;
  /** Score after this play */
  homeScore?: number;
  awayScore?: number;
  /** Field position or court zone */
  fieldPosition?: string;
  isHighlight: boolean;
  videoUrl?: string;
}

// ── Injuries ──────────────────────────────────────────

export type InjuryStatus = "Out" | "Doubtful" | "Questionable" | "Probable" | "Day-to-Day" | "IR" | "PUP";

export interface InjuryReport {
  id: string;
  playerId: string;
  playerName: string;
  teamId: string;
  position: string;
  injuryType: string; // "Hamstring", "Knee", "Concussion", etc.
  status: InjuryStatus;
  /** Practice participation */
  practice?: "Full" | "Limited" | "DNP";
  updatedAt: string;
  /** Estimated return */
  returnEstimate?: string;
}

// ── Contracts & Transactions ──────────────────────────

export type TransactionType =
  | "signing" | "trade" | "release" | "waiver_claim" | "extension"
  | "restructure" | "cut" | "practice_squad" | "ir_designation"
  | "draft_pick" | "retirement" | "suspension";

export interface Contract {
  id: string;
  playerId: string;
  playerName: string;
  teamId: string;
  leagueId: string;
  years: number;
  totalValue: number;
  avgPerYear: number;
  guaranteed: number;
  signedDate: string;
  expiryYear: number;
  /** Signing bonus */
  signingBonus?: number;
  /** No-trade clause */
  noTradeClause?: boolean;
  /** Yearly breakdown */
  yearlyBreakdown?: { year: number; base: number; bonus: number; cap: number }[];
}

export interface Transaction {
  id: string;
  type: TransactionType;
  leagueId: string;
  playerId: string;
  playerName: string;
  playerPosition: string;
  fromTeamId?: string;
  fromTeamName?: string;
  toTeamId?: string;
  toTeamName?: string;
  date: string;
  details?: string;
  contractId?: string;
  /** For trades: assets included */
  assets?: string[];
}

// ── Draft ─────────────────────────────────────────────

export type DraftStatus = "upcoming" | "live" | "complete";

export interface DraftPick {
  overall: number;
  round: number;
  pick: number;
  teamId: string;
  teamName: string;
  /** Player selected, null if not yet picked */
  playerId?: string;
  playerName?: string;
  position?: string;
  college?: string;
  /** Original team if traded pick */
  originalTeamId?: string;
}

export interface Draft {
  id: string;
  leagueId: string;
  year: number;
  status: DraftStatus;
  currentPick?: number;
  totalPicks: number;
  rounds: number;
  picks: DraftPick[];
  updatedAt: string;
}

// ── Rankings (NCAA) ───────────────────────────────────

export type RankingPoll = "AP" | "Coaches" | "CFP" | "NET" | "RPI" | "KenPom";

export interface RankingEntry {
  rank: number;
  previousRank?: number;
  teamId: string;
  teamName: string;
  conferenceId?: string;
  record: string;
  points?: number;
  firstPlaceVotes?: number;
  /** Points difference from #1 */
  pointsBehind?: number;
}

export interface RankingsBoard {
  leagueId: string;
  sport: string;
  poll: RankingPoll;
  gender: "Men's" | "Women's";
  season: string;
  week?: number;
  updatedAt: string;
  entries: RankingEntry[];
}

// ── Soccer / Futbol Tables ─────────────────────────────

export interface TableRow {
  position: number;
  teamId: string;
  teamName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: ("W" | "D" | "L")[];
  homeRecord: string;
  awayRecord: string;
  /** UCL / Europa / Relegation zone indicator */
  qualifier?: "ucl" | "uel" | "uecl" | "relegation" | "promotion";
}

export interface LeagueTable {
  leagueId: string;
  season: string;
  updatedAt: string;
  rows: TableRow[];
}

// ── News & Rumors ─────────────────────────────────────

export type NewsCategory =
  | "breaking" | "trade_rumor" | "injury" | "game_recap"
  | "analysis" | "ranking" | "contract" | "draft" | "general";

export interface NewsItem {
  id: string;
  headline: string;
  summary: string;
  body?: string;
  source: string;
  sourceUrl?: string;
  author?: string;
  publishedAt: string;
  leagueId?: string;
  teamIds?: string[];
  playerIds?: string[];
  category: NewsCategory;
  isBreaking: boolean;
  imageUrl?: string;
}
