import { League } from "@/types";

export const leagues: League[] = [
  {
    id: "nfl",
    name: "NFL",
    slug: "nfl",
    sport: "Football",
    logo: "🏈",
  },
  {
    id: "nba",
    name: "NBA",
    slug: "nba",
    sport: "Basketball",
    logo: "🏀",
  },
  {
    id: "mlb",
    name: "MLB",
    slug: "mlb",
    sport: "Baseball",
    logo: "⚾",
  },
  {
    id: "nhl",
    name: "NHL",
    slug: "nhl",
    sport: "Hockey",
    logo: "🏒",
  },
  {
    id: "mls",
    name: "MLS",
    slug: "mls",
    sport: "Soccer",
    logo: "⚽",
  },
  {
    id: "wnba",
    name: "WNBA",
    slug: "wnba",
    sport: "Basketball",
    logo: "🏀",
  },
  {
    id: "college",
    name: "College",
    slug: "college",
    sport: "Multi",
    logo: "🎓",
  },
];

/** Leagues shown in the primary header icon row (core 4 + new 3) */
export const primaryLeagues = leagues;
