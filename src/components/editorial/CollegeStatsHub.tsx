"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import StatLeaderCard from "@/components/cards/StatLeaderCard";
import StatsFilter from "@/components/stats/StatsFilter";

const SPORTS = ["Football", "Basketball", "Baseball", "Soccer"] as const;
type Sport = typeof SPORTS[number];

type Leader = { rank: number; name: string; team: string; value: string };

const STAT_DATA: Record<Sport, { category: string; leaders: Leader[] }[]> = {
  Football: [
    {
      category: "Heisman Watch — Passing",
      leaders: [
        { rank: 1, name: "Dillon Gabriel",    team: "ORE", value: "4313 YDS" },
        { rank: 2, name: "Quinn Ewers",       team: "TEX", value: "4011 YDS" },
        { rank: 3, name: "DJ Uiagalelei",     team: "FSU", value: "3877 YDS" },
        { rank: 4, name: "Shedeur Sanders",   team: "COL", value: "3612 YDS" },
        { rank: 5, name: "Carson Beck",       team: "UGA", value: "3441 YDS" },
      ],
    },
    {
      category: "Rushing Leaders",
      leaders: [
        { rank: 1, name: "Ollie Gordon",        team: "OSU", value: "1732 YDS" },
        { rank: 2, name: "TreVeyon Henderson",  team: "OSU", value: "1501 YDS" },
        { rank: 3, name: "Quinshon Judkins",    team: "OSU", value: "1390 YDS" },
        { rank: 4, name: "Dylan Sampson",       team: "TEN", value: "1301 YDS" },
        { rank: 5, name: "Tahj Brooks",         team: "TTU", value: "1244 YDS" },
      ],
    },
    {
      category: "Receiving Leaders",
      leaders: [
        { rank: 1, name: "Tetairoa McMillan",  team: "ARI", value: "1319 YDS" },
        { rank: 2, name: "Luther Burden III",  team: "MIZ", value: "1201 YDS" },
        { rank: 3, name: "Isaiah Bond",        team: "TEX", value: "1088 YDS" },
        { rank: 4, name: "Evan Stewart",       team: "ORE", value: "1044 YDS" },
        { rank: 5, name: "Tre Harris",         team: "OLE", value: "1012 YDS" },
      ],
    },
  ],
  Basketball: [
    {
      category: "Scoring Leaders",
      leaders: [
        { rank: 1, name: "Hunter Dickinson",   team: "KAN", value: "22.1 PPG" },
        { rank: 2, name: "RJ Davis",           team: "UNC", value: "21.4 PPG" },
        { rank: 3, name: "Zach Edey",          team: "PUR", value: "20.8 PPG" },
        { rank: 4, name: "Johni Broome",       team: "AUB", value: "19.6 PPG" },
        { rank: 5, name: "Marcus Sasser",      team: "HOU", value: "18.9 PPG" },
      ],
    },
    {
      category: "Assists Leaders",
      leaders: [
        { rank: 1, name: "Ty Ty Washington",   team: "HOU", value: "8.1 APG" },
        { rank: 2, name: "Markquis Nowell",    team: "KAN", value: "7.8 APG" },
        { rank: 3, name: "Pablo Bertone",      team: "UVA", value: "7.1 APG" },
        { rank: 4, name: "Isaiah Wong",        team: "MIA", value: "6.8 APG" },
        { rank: 5, name: "Darius McGhee",      team: "LIB", value: "6.4 APG" },
      ],
    },
    {
      category: "Rebound Leaders",
      leaders: [
        { rank: 1, name: "Zach Edey",         team: "PUR", value: "12.2 RPG" },
        { rank: 2, name: "Hunter Dickinson",  team: "KAN", value: "10.4 RPG" },
        { rank: 3, name: "Armando Bacot",     team: "UNC", value: "9.9 RPG"  },
        { rank: 4, name: "Johni Broome",      team: "AUB", value: "9.6 RPG"  },
        { rank: 5, name: "Brandon Miller",    team: "ALA", value: "8.8 RPG"  },
      ],
    },
  ],
  Baseball: [
    {
      category: "Batting Average",
      leaders: [
        { rank: 1, name: "Enrique Bradfield",  team: "VAN", value: ".412" },
        { rank: 2, name: "Chase Davis",        team: "ARI", value: ".391" },
        { rank: 3, name: "Tommy White",        team: "LSU", value: ".378" },
        { rank: 4, name: "Jac Caglianone",     team: "FLA", value: ".364" },
        { rank: 5, name: "Dylan Crews",        team: "LSU", value: ".358" },
      ],
    },
    {
      category: "Home Runs",
      leaders: [
        { rank: 1, name: "Jac Caglianone",   team: "FLA", value: "28 HR" },
        { rank: 2, name: "Tommy White",      team: "LSU", value: "24 HR" },
        { rank: 3, name: "Chase Davis",      team: "ARI", value: "21 HR" },
        { rank: 4, name: "Jacob Berry",      team: "LSU", value: "19 HR" },
        { rank: 5, name: "Nolan Schanuel",   team: "FAU", value: "18 HR" },
      ],
    },
    {
      category: "Strikeouts (Pitching)",
      leaders: [
        { rank: 1, name: "Paul Skenes",      team: "LSU", value: "209 K"  },
        { rank: 2, name: "Hurston Waldrep",  team: "FLA", value: "188 K"  },
        { rank: 3, name: "Ty Floyd",         team: "CLE", value: "171 K"  },
        { rank: 4, name: "Ben Joyce",        team: "TEN", value: "162 K"  },
        { rank: 5, name: "Chase Burns",      team: "CIN", value: "158 K"  },
      ],
    },
  ],
  Soccer: [
    {
      category: "Goals",
      leaders: [
        { rank: 1, name: "Gianluca Rossi",    team: "STF", value: "18 G" },
        { rank: 2, name: "Dante Sealy",       team: "BCU", value: "16 G" },
        { rank: 3, name: "Patrick Bohui",     team: "UCL", value: "14 G" },
        { rank: 4, name: "Caden Clark",       team: "STF", value: "13 G" },
        { rank: 5, name: "Obi Sfab",          team: "VIR", value: "12 G" },
      ],
    },
    {
      category: "Assists",
      leaders: [
        { rank: 1, name: "Nico Benalcazar",   team: "CLE", value: "14 A" },
        { rank: 2, name: "Dante Sealy",       team: "BCU", value: "12 A" },
        { rank: 3, name: "Patrick Bohui",     team: "UCL", value: "11 A" },
        { rank: 4, name: "Caden Clark",       team: "STF", value: "10 A" },
        { rank: 5, name: "Obi Sab",           team: "VIR", value: "9 A"  },
      ],
    },
    {
      category: "Save Percentage",
      leaders: [
        { rank: 1, name: "Carlos Joaquim",   team: "MET", value: ".891" },
        { rank: 2, name: "Will Pulisic",     team: "IND", value: ".876" },
        { rank: 3, name: "Alex Budnik",      team: "AKR", value: ".861" },
        { rank: 4, name: "Patrick Schulte",  team: "STL", value: ".854" },
        { rank: 5, name: "Isaiah Marcq",     team: "WKU", value: ".842" },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────
// Pro league destinations keyed by college sport
// ─────────────────────────────────────────────────────────
const PRO_LINKS: Record<Sport, { label: string; href: string; league: string; blurb: string }> = {
  Football:   { label: "NFL Stats",     href: "/league/nfl/stats", league: "NFL 🏈", blurb: "Compare passing yards, rushing totals, and receiving numbers to the top pros." },
  Basketball: { label: "NBA Stats",     href: "/league/nba/stats", league: "NBA 🏀", blurb: "See how college scoring and assist averages stack up against NBA leaders."    },
  Baseball:   { label: "MLB Stats",     href: "/league/mlb/stats", league: "MLB ⚾", blurb: "Track how college batting averages and K-rates translate at the major-league level." },
  Soccer:     { label: "Futbol Tables", href: "/league/mls/stats", league: "MLS ⚽", blurb: "Benchmark college goals and assists against MLS professional tables."         },
};

export default function CollegeStatsHub() {
  const [activeSport, setActiveSport] = useState<Sport>("Football");
  const boards = STAT_DATA[activeSport];

  return (
    <div className="container mx-auto pt-8 pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-surface-text">
          College Stats Hub
        </h1>
        <p className="text-surface-muted text-[10px] font-bold uppercase tracking-widest mt-1">
          Season: 2025–2026
        </p>
      </div>

      <StatsFilter />

      {/* Sport picker */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {SPORTS.map((sport) => (
          <button
            key={sport}
            onClick={() => setActiveSport(sport)}
            className={`p-6 rounded-xl border text-left transition-all group ${
              activeSport === sport
                ? "border-red-600 bg-surface-200"
                : "border-surface-300 bg-surface-200 hover:border-red-600/50"
            }`}
          >
            <h3 className="font-black uppercase text-sm mb-1 text-surface-text">{sport}</h3>
            <p className="text-[10px] text-surface-muted uppercase">
              {STAT_DATA[sport].length} categories
            </p>
          </button>
        ))}
      </div>

      {/* ProspectDiscovery — bridges college stats to the matching pro league */}
      <div className="mb-10 border border-dashed border-surface-300 rounded-xl p-5">
        <h2 className="text-sm font-black italic uppercase tracking-tighter text-surface-text mb-1">
          Pro Prospect Comparison
        </h2>
        <p className="text-[10px] text-surface-muted font-bold uppercase tracking-widest mb-3">
          {PRO_LINKS[activeSport].league} · Active Season
        </p>
        <p className="text-xs text-surface-muted leading-relaxed mb-4">
          {PRO_LINKS[activeSport].blurb}
        </p>
        <Link
          href={PRO_LINKS[activeSport].href}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-200 border border-surface-300 hover:border-brand hover:text-brand text-[10px] font-black uppercase tracking-widest text-surface-text transition-colors"
        >
          {PRO_LINKS[activeSport].label} <ArrowRight size={12} />
        </Link>
      </div>

      {/* Stat boards for selected sport */}
      <div>
        <h2 className="text-xl font-black uppercase border-l-4 border-red-600 pl-4 mb-6 text-surface-text">
          {activeSport} Rankings &amp; Stats
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {boards.map((board) => (
            <StatLeaderCard
              key={board.category}
              category={board.category}
              leaders={board.leaders}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
