// ═══════════════════════════════════════════════════════
// UNDRAFTED — Draft Prospect Data
// Mock data for NBA 2026 and NFL 2026 draft classes.
// All evaluations are illustrative, not real scouting reports.
// ═══════════════════════════════════════════════════════

export type ProspectLeague = "nba" | "nfl";
export type StockDirection = "rising" | "falling" | "stable";
export type ProjectedRange = "Top 5" | "Lottery" | "Mid 1st" | "Late 1st" | "2nd Round";

export interface Prospect {
  id: string;
  name: string;
  /** Abbreviated position (PG, SF, EDGE, QB…) */
  position: string;
  /** Display school/team */
  school: string;
  league: ProspectLeague;
  draftYear: number;
  /** Expert/media consensus rank */
  expertRank: number;
  /** Fan/community vote rank — may diverge */
  fanRank: number;
  height: string;       // monospace: "6'9\""
  weight: string;       // monospace: "215 lbs"
  age: number;
  stockDirection: StockDirection;
  /** Positive = rose N spots. Negative = fell. */
  stockDelta: number;
  potentialStars: number;   // 0–5 (halves OK: 4.5)
  readinessStars: number;   // 0–5
  strengths: string[];
  weaknesses: string[];
  scoutingNote: string;
  avatar: string;           // emoji placeholder
  projectedRange: ProjectedRange;
}

// ─────────────────────────────────────────────────────────
// NBA 2026 Class
// ─────────────────────────────────────────────────────────
const nbaProspects: Prospect[] = [
  {
    id: "p-flagg",
    name: "Cooper Flagg",
    position: "SF",
    school: "Duke",
    league: "nba",
    draftYear: 2026,
    expertRank: 1,
    fanRank: 1,
    height: "6'9\"",
    weight: "215 lbs",
    age: 18,
    stockDirection: "rising",
    stockDelta: 2,
    potentialStars: 5,
    readinessStars: 4,
    strengths: ["Elite IQ", "Two-way engine", "Shot-creation"],
    weaknesses: ["Free-throw consistency", "Frame still filling out"],
    scoutingNote:
      "Generational two-way forward. Reads the game at a veteran level. Ceiling is a perennial All-Star.",
    avatar: "🦅",
    projectedRange: "Top 5",
  },
  {
    id: "p-bailey",
    name: "Ace Bailey",
    position: "SF",
    school: "Rutgers",
    league: "nba",
    draftYear: 2026,
    expertRank: 2,
    fanRank: 3,
    height: "6'10\"",
    weight: "200 lbs",
    age: 18,
    stockDirection: "rising",
    stockDelta: 1,
    potentialStars: 5,
    readinessStars: 3,
    strengths: ["Perimeter shooting", "Wingspan", "Upside"],
    weaknesses: ["Defensive engagement", "Handle under pressure"],
    scoutingNote:
      "Elite scorer with the frame to guard 3s and 4s. Raw but loaded with upside — a high-risk, high-reward pick.",
    avatar: "🏹",
    projectedRange: "Top 5",
  },
  {
    id: "p-harper",
    name: "Dylan Harper",
    position: "PG",
    school: "Rutgers",
    league: "nba",
    draftYear: 2026,
    expertRank: 3,
    fanRank: 2,
    height: "6'6\"",
    weight: "205 lbs",
    age: 18,
    stockDirection: "stable",
    stockDelta: 0,
    potentialStars: 4.5,
    readinessStars: 4,
    strengths: ["Playmaking", "Size for position", "Mid-range pull-up"],
    weaknesses: ["Three-point consistency", "On-ball defense"],
    scoutingNote:
      "Physically imposing lead guard who can score from all three levels. Reminiscent of a young Luka — pace and IQ.",
    avatar: "🎯",
    projectedRange: "Top 5",
  },
  {
    id: "p-edgecombe",
    name: "VJ Edgecombe",
    position: "SG",
    school: "Baylor",
    league: "nba",
    draftYear: 2026,
    expertRank: 4,
    fanRank: 6,
    height: "6'5\"",
    weight: "195 lbs",
    age: 19,
    stockDirection: "rising",
    stockDelta: 3,
    potentialStars: 4.5,
    readinessStars: 3.5,
    strengths: ["Athleticism", "Perimeter D", "Get-to-the-rim"],
    weaknesses: ["Shooting mechanics", "Off-ball movement"],
    scoutingNote:
      "Elite athleticism with a defensive motor. Shot mechanics are a work in progress but the tools are NBA-ready.",
    avatar: "⚡",
    projectedRange: "Lottery",
  },
  {
    id: "p-maluach",
    name: "Khaman Maluach",
    position: "C",
    school: "Duke",
    league: "nba",
    draftYear: 2026,
    expertRank: 5,
    fanRank: 5,
    height: "7'2\"",
    weight: "235 lbs",
    age: 18,
    stockDirection: "rising",
    stockDelta: 2,
    potentialStars: 4.5,
    readinessStars: 3,
    strengths: ["Rim protection", "Lob target", "Length"],
    weaknesses: ["Conditioning", "Post moves"],
    scoutingNote:
      "Freakish size with light feet. Can alter shots from the weakside. Needs weight-room time but the ceiling is All-NBA.",
    avatar: "🏔️",
    projectedRange: "Lottery",
  },
  {
    id: "p-queen",
    name: "Derik Queen",
    position: "C",
    school: "Maryland",
    league: "nba",
    draftYear: 2026,
    expertRank: 6,
    fanRank: 4,
    height: "6'10\"",
    weight: "245 lbs",
    age: 19,
    stockDirection: "stable",
    stockDelta: 0,
    potentialStars: 4,
    readinessStars: 4,
    strengths: ["Post touch", "Screen-and-roll", "Ball skills for size"],
    weaknesses: ["Three-point range", "Lateral mobility"],
    scoutingNote:
      "The most NBA-ready big in this class. Projects as a reliable 20-10 big who can stretch to 15 feet.",
    avatar: "👑",
    projectedRange: "Lottery",
  },
  {
    id: "p-johnson",
    name: "Tre Johnson",
    position: "SG",
    school: "Texas",
    league: "nba",
    draftYear: 2026,
    expertRank: 7,
    fanRank: 9,
    height: "6'5\"",
    weight: "185 lbs",
    age: 18,
    stockDirection: "falling",
    stockDelta: -2,
    potentialStars: 4,
    readinessStars: 3,
    strengths: ["Shot creation", "Pull-up three", "Quick release"],
    weaknesses: ["Frame (needs mass)", "On-ball defense"],
    scoutingNote:
      "Pure scorer — his shot-making ability is elite but his body needs to mature to handle NBA physicality.",
    avatar: "🔫",
    projectedRange: "Lottery",
  },
  {
    id: "p-jakucionis",
    name: "Kasparas Jakucionis",
    position: "PG",
    school: "Illinois",
    league: "nba",
    draftYear: 2026,
    expertRank: 8,
    fanRank: 7,
    height: "6'6\"",
    weight: "190 lbs",
    age: 19,
    stockDirection: "rising",
    stockDelta: 1,
    potentialStars: 4,
    readinessStars: 3.5,
    strengths: ["Court vision", "Euro step", "Floater package"],
    weaknesses: ["Athleticism", "Shot volume"],
    scoutingNote:
      "Creative playmaker with European flair. Crafty with the ball and understands spacing at an elite level.",
    avatar: "🎪",
    projectedRange: "Lottery",
  },
];

// ─────────────────────────────────────────────────────────
// NFL 2026 Class
// ─────────────────────────────────────────────────────────
const nflProspects: Prospect[] = [
  {
    id: "p-carter-nfl",
    name: "Abdul Carter",
    position: "EDGE",
    school: "Penn State",
    league: "nfl",
    draftYear: 2026,
    expertRank: 1,
    fanRank: 2,
    height: "6'3\"",
    weight: "253 lbs",
    age: 20,
    stockDirection: "rising",
    stockDelta: 1,
    potentialStars: 5,
    readinessStars: 4.5,
    strengths: ["First-step burst", "Counter moves", "Motor"],
    weaknesses: ["Run defense (learning)", "Hand technique vs. longer OTs"],
    scoutingNote:
      "Generational pass rusher. His burst off the snap is top-10 all-time at the position. Rare blend of speed and power.",
    avatar: "🦁",
    projectedRange: "Top 5",
  },
  {
    id: "p-hunter",
    name: "Travis Hunter",
    position: "WR/CB",
    school: "Colorado",
    league: "nfl",
    draftYear: 2026,
    expertRank: 2,
    fanRank: 1,
    height: "6'1\"",
    weight: "185 lbs",
    age: 21,
    stockDirection: "rising",
    stockDelta: 2,
    potentialStars: 5,
    readinessStars: 4.5,
    strengths: ["Two-way elite", "Ball skills", "Route IQ"],
    weaknesses: ["Weight (can't play both long-term)", "Position depth concern"],
    scoutingNote:
      "Once-in-a-generation two-way player. Wherever he lines up, he'll be Pro Bowl-caliber in year 2. Rare.",
    avatar: "🦋",
    projectedRange: "Top 5",
  },
  {
    id: "p-campbell",
    name: "Will Campbell",
    position: "OT",
    school: "LSU",
    league: "nfl",
    draftYear: 2026,
    expertRank: 3,
    fanRank: 5,
    height: "6'6\"",
    weight: "316 lbs",
    age: 22,
    stockDirection: "stable",
    stockDelta: 0,
    potentialStars: 4.5,
    readinessStars: 5,
    strengths: ["Pass pro technique", "Anchor strength", "Footwork"],
    weaknesses: ["Injury history (knee)", "Athleticism tests"],
    scoutingNote:
      "The safest pick in the class. NFL-ready right tackle with pro technique. Could start from Week 1.",
    avatar: "🧱",
    projectedRange: "Top 5",
  },
  {
    id: "p-graham",
    name: "Mason Graham",
    position: "DT",
    school: "Michigan",
    league: "nfl",
    draftYear: 2026,
    expertRank: 4,
    fanRank: 4,
    height: "6'3\"",
    weight: "312 lbs",
    age: 21,
    stockDirection: "rising",
    stockDelta: 1,
    potentialStars: 4.5,
    readinessStars: 4.5,
    strengths: ["Explosion off snap", "Leverage", "Gap discipline"],
    weaknesses: ["Pass rush repertoire", "Top-end burst"],
    scoutingNote:
      "The best interior DL in the class. Consistent two-gapper who can also collapse the pocket. Franchise building block.",
    avatar: "🛡️",
    projectedRange: "Top 5",
  },
  {
    id: "p-sanders",
    name: "Shedeur Sanders",
    position: "QB",
    school: "Colorado",
    league: "nfl",
    draftYear: 2026,
    expertRank: 5,
    fanRank: 3,
    height: "6'2\"",
    weight: "215 lbs",
    age: 22,
    stockDirection: "falling",
    stockDelta: -3,
    potentialStars: 4,
    readinessStars: 3.5,
    strengths: ["Arm talent", "Touch on intermediate", "Poise"],
    weaknesses: ["Mobility", "Pocket awareness vs. NFL pressure"],
    scoutingNote:
      "Elite arm talent with a quick release. Stock slipped after poor combine showing but the tape is undeniable.",
    avatar: "🏈",
    projectedRange: "Lottery",
  },
  {
    id: "p-ward",
    name: "Cameron Ward",
    position: "QB",
    school: "Miami",
    league: "nfl",
    draftYear: 2026,
    expertRank: 6,
    fanRank: 8,
    height: "6'2\"",
    weight: "221 lbs",
    age: 23,
    stockDirection: "rising",
    stockDelta: 4,
    potentialStars: 4,
    readinessStars: 4,
    strengths: ["Big-play arm", "Improvisation", "Leadership"],
    weaknesses: ["Footwork in clean pocket", "Decision speed"],
    scoutingNote:
      "Big-armed gunslinger with the ability to extend plays. His NFL Combine showing skyrocketed his stock.",
    avatar: "🌀",
    projectedRange: "Lottery",
  },
  {
    id: "p-egbuka",
    name: "Emeka Egbuka",
    position: "WR",
    school: "Ohio State",
    league: "nfl",
    draftYear: 2026,
    expertRank: 7,
    fanRank: 6,
    height: "6'1\"",
    weight: "205 lbs",
    age: 22,
    stockDirection: "stable",
    stockDelta: 0,
    potentialStars: 4,
    readinessStars: 4.5,
    strengths: ["Route tree mastery", "YAC ability", "Contested catches"],
    weaknesses: ["Deep speed", "Injury durability"],
    scoutingNote:
      "Complete receiver with every route in the book. Legitimate WR1 who can separate at every level of the field.",
    avatar: "🎯",
    projectedRange: "Mid 1st",
  },
  {
    id: "p-banks",
    name: "Kelvin Banks Jr.",
    position: "OT",
    school: "Texas",
    league: "nfl",
    draftYear: 2026,
    expertRank: 8,
    fanRank: 10,
    height: "6'4\"",
    weight: "320 lbs",
    age: 21,
    stockDirection: "falling",
    stockDelta: -1,
    potentialStars: 4,
    readinessStars: 3.5,
    strengths: ["Pass block anchor", "Wingspan", "Physical strength"],
    weaknesses: ["Lateral quickness", "Initial set"],
    scoutingNote:
      "Road-grading left tackle with an NFL frame already. Pass protection technique needs refining but the upside is enormous.",
    avatar: "⚓",
    projectedRange: "Mid 1st",
  },
];

export const prospects: Prospect[] = [...nbaProspects, ...nflProspects];

// ─────────────────────────────────────────────────────────
// Mock Draft Picks
// ─────────────────────────────────────────────────────────
export interface MockDraftPick {
  pick: number;
  teamName: string;
  teamLogo: string;
  league: ProspectLeague;
  prospectId: string;
  needNote: string;
}

export const nbaMockDraft: MockDraftPick[] = [
  { pick: 1,  teamName: "Washington Wizards",      teamLogo: "🧙",  league: "nba", prospectId: "p-flagg",      needNote: "Cornerstone franchise piece" },
  { pick: 2,  teamName: "Charlotte Hornets",        teamLogo: "🐝",  league: "nba", prospectId: "p-bailey",     needNote: "Wing scorer to pair with Bridges" },
  { pick: 3,  teamName: "San Antonio Spurs",        teamLogo: "⚔️",  league: "nba", prospectId: "p-harper",     needNote: "Wembanyama's future co-star" },
  { pick: 4,  teamName: "Portland Trail Blazers",   teamLogo: "🌲",  league: "nba", prospectId: "p-edgecombe",  needNote: "Athletic perimeter defender" },
  { pick: 5,  teamName: "Utah Jazz",                teamLogo: "🎷",  league: "nba", prospectId: "p-maluach",    needNote: "Rim protector for next era" },
  { pick: 6,  teamName: "Brooklyn Nets",            teamLogo: "🕸️",  league: "nba", prospectId: "p-queen",      needNote: "Interior anchor in rebuild" },
  { pick: 7,  teamName: "Toronto Raptors",          teamLogo: "🦖",  league: "nba", prospectId: "p-johnson",    needNote: "Shot creation off the bench" },
  { pick: 8,  teamName: "Chicago Bulls",            teamLogo: "🐂",  league: "nba", prospectId: "p-jakucionis", needNote: "Playmaking upgrade at PG" },
];

export const nflMockDraft: MockDraftPick[] = [
  { pick: 1,  teamName: "New England Patriots",    teamLogo: "🏛️",  league: "nfl", prospectId: "p-carter-nfl", needNote: "Elite edge opposite of Uche" },
  { pick: 2,  teamName: "Jacksonville Jaguars",    teamLogo: "🐆",  league: "nfl", prospectId: "p-hunter",     needNote: "Franchise WR1 immediately" },
  { pick: 3,  teamName: "Las Vegas Raiders",       teamLogo: "☠️",  league: "nfl", prospectId: "p-campbell",   needNote: "Protect QB blindside" },
  { pick: 4,  teamName: "New York Giants",         teamLogo: "🗽",  league: "nfl", prospectId: "p-sanders",    needNote: "Franchise QB of the future" },
  { pick: 5,  teamName: "Carolina Panthers",       teamLogo: "🐾",  league: "nfl", prospectId: "p-graham",     needNote: "Defensive line anchor" },
  { pick: 6,  teamName: "Tennessee Titans",        teamLogo: "⚡",  league: "nfl", prospectId: "p-ward",       needNote: "Big-arm QB to replace Levis" },
  { pick: 7,  teamName: "Cleveland Browns",        teamLogo: "🐶",  league: "nfl", prospectId: "p-egbuka",     needNote: "WR1 upgrade in struggling offense" },
  { pick: 8,  teamName: "New Orleans Saints",      teamLogo: "⚜️",  league: "nfl", prospectId: "p-banks",      needNote: "Protect the franchise QB" },
];
