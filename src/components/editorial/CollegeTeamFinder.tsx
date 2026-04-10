"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Filter, ChevronRight, GraduationCap } from "lucide-react";
import { collegeTeams } from "@/data/teams/college";

// ─────────────────────────────────────────────────────────
// Conference ID → short label
// ─────────────────────────────────────────────────────────
const CONF_LABELS: Record<string, string> = {
  "conf-college-sec":     "SEC",
  "conf-college-big-ten": "Big Ten",
  "conf-college-big-12":  "Big 12",
  "conf-college-acc":     "ACC",
  "conf-college-pac-12":  "Pac-12",
};

// ─────────────────────────────────────────────────────────
// Supplemental entries — demo coverage for FCS / HBCU
// ─────────────────────────────────────────────────────────
const AUG_TEAMS = [
  { id: "aug-jackson-state", name: "Jackson State Tigers", slug: "jackson-state", logo: "🐯", conf: "SWAC",    sub: "HBCU" },
  { id: "aug-howard",        name: "Howard Bison",         slug: "howard",        logo: "🦬", conf: "MEAC",    sub: "HBCU" },
  { id: "aug-grambling",     name: "Grambling Tigers",     slug: "grambling",     logo: "🐅", conf: "SWAC",    sub: "HBCU" },
  { id: "aug-montana",       name: "Montana Grizzlies",    slug: "montana",       logo: "🐻", conf: "Big Sky", sub: "FCS"  },
  { id: "aug-ndsu",          name: "NDSU Bison",           slug: "ndsu",          logo: "🦬", conf: "MVFC",    sub: "FCS"  },
  { id: "aug-yal",           name: "Yale Bulldogs",        slug: "yale",          logo: "🐶", conf: "Ivy",     sub: "FCS"  },
];

// ─────────────────────────────────────────────────────────
// Merged directory
// ─────────────────────────────────────────────────────────
type DirectoryTeam = { id: string; name: string; slug: string; logo: string; conf: string; sub: string };

const ALL_TEAMS: DirectoryTeam[] = [
  ...collegeTeams.map((t) => ({
    id:   t.id,
    name: t.name,
    slug: t.slug,
    logo: t.logo,
    conf: CONF_LABELS[t.conferenceId ?? ""] ?? "Ind",
    sub:  "FBS",
  })),
  ...AUG_TEAMS,
];

const SUB_LEAGUES  = ["All", "FBS", "FCS", "HBCU"];
const CONFERENCES  = ["All", "SEC", "Big Ten", "ACC", "Big 12", "Pac-12", "SWAC", "MEAC", "Big Sky", "Ivy"];

// ─────────────────────────────────────────────────────────
// CollegeTeamFinder
// ─────────────────────────────────────────────────────────
export default function CollegeTeamFinder() {
  const [activeSub,    setActiveSub]    = useState("All");
  const [activeConf,   setActiveConf]   = useState("All");
  const [searchQuery,  setSearchQuery]  = useState("");
  const [confOpen,     setConfOpen]     = useState(false);

  const filtered = ALL_TEAMS.filter((team) => {
    const matchesSub    = activeSub   === "All" || team.sub  === activeSub;
    const matchesConf   = activeConf  === "All" || team.conf === activeConf;
    const matchesSearch = team.name.toLowerCase().includes(searchQuery.toLowerCase())
                       || team.conf.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSub && matchesConf && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-black p-8">

      {/* ── Header ───────────────────────────────────── */}
      <div className="mb-12 flex flex-col justify-between gap-6 border-b border-white/10 pb-8 md:flex-row md:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2 text-red-600">
            <GraduationCap size={20} />
            <span className="text-xs font-black uppercase tracking-[0.2em]">College Football</span>
          </div>
          <h1 className="text-5xl font-black italic uppercase text-white tracking-tighter">Team Directory</h1>
          <p className="mt-1 text-xs text-white/30">{ALL_TEAMS.length} programs · FBS, FCS &amp; HBCU</p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
          <input
            type="text"
            placeholder="Search teams or conferences…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-white/10 bg-zinc-900 py-3 pl-12 pr-4 text-sm text-white placeholder:text-white/30 focus:border-red-600 focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* ── Filters ──────────────────────────────────── */}
      <div className="mb-8 flex flex-wrap items-center gap-3">
        {/* Sub-league pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {SUB_LEAGUES.map((sub) => (
            <button
              key={sub}
              onClick={() => setActiveSub(sub)}
              className={`whitespace-nowrap rounded-full px-5 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                activeSub === sub
                  ? "bg-white text-black"
                  : "border border-white/10 text-white/40 hover:text-white"
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        {/* Conference picker */}
        <div className="relative ml-auto">
          <button
            onClick={() => setConfOpen((o) => !o)}
            className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors"
          >
            <Filter size={12} />
            {activeConf === "All" ? "Conference" : activeConf}
          </button>

          {confOpen && (
            <div className="absolute right-0 top-10 z-30 w-44 rounded-xl border border-white/10 bg-zinc-950 p-2 shadow-2xl">
              {CONFERENCES.map((conf) => (
                <button
                  key={conf}
                  onClick={() => { setActiveConf(conf); setConfOpen(false); }}
                  className={`w-full rounded-lg px-3 py-2 text-left text-[10px] font-bold uppercase tracking-tight transition-colors ${
                    activeConf === conf ? "bg-white/10 text-white" : "text-white/40 hover:text-white"
                  }`}
                >
                  {conf}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Results count ────────────────────────────── */}
      <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-white/20">
        {filtered.length} {filtered.length === 1 ? "team" : "teams"}
      </p>

      {/* ── Team grid ────────────────────────────────── */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((team) => (
            <div
              key={team.id}
              className="group relative overflow-hidden rounded-xl border border-white/5 bg-zinc-900/50 p-6 transition-all hover:border-white/20 hover:bg-zinc-900"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-black text-3xl shadow-inner group-hover:scale-110 transition-transform shrink-0">
                  {team.logo}
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-black text-white leading-tight truncate">{team.name}</h3>
                  <p className="text-[10px] font-bold uppercase text-white/40">{team.conf}</p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                <span className="rounded bg-white/5 px-2 py-1 text-[9px] font-black text-white/60 uppercase shrink-0">
                  {team.sub}
                </span>
                <Link
                  href={`/team/${team.slug}`}
                  className="flex items-center gap-1 text-[10px] font-black text-red-600 uppercase tracking-tighter group-hover:gap-2 transition-all"
                >
                  Team Page <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-24 text-center">
          <p className="text-2xl font-black italic text-white/10 uppercase">No teams found</p>
          <p className="mt-2 text-xs text-white/20">Try adjusting your search or filters.</p>
        </div>
      )}

    </div>
  );
}
