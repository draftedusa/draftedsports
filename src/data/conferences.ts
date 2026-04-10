import { Conference } from "@/types";

export const conferences: Conference[] = [
  // ── NFL ────────────────────────────────────────────────
  {
    id: "conf-nfl-afc",
    leagueId: "nfl",
    name: "American Football Conference",
    shortName: "AFC",
  },
  {
    id: "conf-nfl-nfc",
    leagueId: "nfl",
    name: "National Football Conference",
    shortName: "NFC",
  },

  // ── NBA ────────────────────────────────────────────────
  {
    id: "conf-nba-eastern",
    leagueId: "nba",
    name: "Eastern Conference",
    shortName: "Eastern",
  },
  {
    id: "conf-nba-western",
    leagueId: "nba",
    name: "Western Conference",
    shortName: "Western",
  },

  // ── MLB ────────────────────────────────────────────────
  {
    id: "conf-mlb-al",
    leagueId: "mlb",
    name: "American League",
    shortName: "AL",
  },
  {
    id: "conf-mlb-nl",
    leagueId: "mlb",
    name: "National League",
    shortName: "NL",
  },

  // ── NHL ────────────────────────────────────────────────
  {
    id: "conf-nhl-eastern",
    leagueId: "nhl",
    name: "Eastern Conference",
    shortName: "Eastern",
  },
  {
    id: "conf-nhl-western",
    leagueId: "nhl",
    name: "Western Conference",
    shortName: "Western",
  },

  // ── WNBA ──────────────────────────────────────────────
  {
    id: "conf-wnba-eastern",
    leagueId: "wnba",
    name: "Eastern Conference",
    shortName: "Eastern",
  },
  {
    id: "conf-wnba-western",
    leagueId: "wnba",
    name: "Western Conference",
    shortName: "Western",
  },

  // ── MLS ───────────────────────────────────────────────
  {
    id: "conf-mls-eastern",
    leagueId: "mls",
    name: "Eastern Conference",
    shortName: "Eastern",
  },
  {
    id: "conf-mls-western",
    leagueId: "mls",
    name: "Western Conference",
    shortName: "Western",
  },

  // ── College (NCAA) ────────────────────────────────────
  {
    id: "conf-college-sec",
    leagueId: "college",
    name: "Southeastern Conference",
    shortName: "SEC",
  },
  {
    id: "conf-college-big-ten",
    leagueId: "college",
    name: "Big Ten Conference",
    shortName: "Big Ten",
  },
  {
    id: "conf-college-big-12",
    leagueId: "college",
    name: "Big 12 Conference",
    shortName: "Big 12",
  },
  {
    id: "conf-college-acc",
    leagueId: "college",
    name: "Atlantic Coast Conference",
    shortName: "ACC",
  },
  {
    id: "conf-college-pac-12",
    leagueId: "college",
    name: "Pac-12 Conference",
    shortName: "Pac-12",
  },

  // ── Liga MX ───────────────────────────────────────────
  {
    id: "conf-liga-mx-apertura",
    leagueId: "liga-mx",
    name: "Apertura",
    shortName: "Apertura",
  },
  {
    id: "conf-liga-mx-clausura",
    leagueId: "liga-mx",
    name: "Clausura",
    shortName: "Clausura",
  },
];
