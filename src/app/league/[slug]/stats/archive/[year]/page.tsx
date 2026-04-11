import { notFound } from "next/navigation";
import Link from "next/link";
import StatChart from "@/components/stats/StatChart";
import { leagues } from "@/data/leagues";

interface Props {
  params: Promise<{ slug: string; year: string }>;
}

// ─────────────────────────────────────────────────────────
// Supported archive years (swap for DB/API call when ready)
// ─────────────────────────────────────────────────────────
const ARCHIVE_YEARS = ["2025", "2024", "2023", "2022", "2021"];

type StatEntry = { name: string; team: string; value: string };
type ArchiveBoard = { category: string; data: StatEntry[] };

function getMockArchive(slug: string, year: string): ArchiveBoard[] {
  // Seed values shift slightly per year for verisimilitude
  const offset = (Number(year) - 2021) * 2;

  if (slug === "nfl") {
    return [
      {
        category: "Passing Yards",
        data: [
          { name: "Patrick Mahomes",  team: "KC",  value: `${4839 + offset * 10} YDS` },
          { name: "Josh Allen",       team: "BUF", value: `${4612 + offset * 8}  YDS` },
          { name: "Joe Burrow",       team: "CIN", value: `${4401 + offset * 6}  YDS` },
          { name: "Jalen Hurts",      team: "PHI", value: `${3858 + offset * 5}  YDS` },
          { name: "Justin Herbert",   team: "LAC", value: `${3602 + offset * 4}  YDS` },
        ],
      },
      {
        category: "Rushing Yards",
        data: [
          { name: "Derrick Henry",   team: "TEN", value: `${1628 + offset * 12} YDS` },
          { name: "Nick Chubb",      team: "CLE", value: `${1525 + offset * 9}  YDS` },
          { name: "Dalvin Cook",     team: "MIN", value: `${1411 + offset * 7}  YDS` },
          { name: "Jonathan Taylor", team: "IND", value: `${1389 + offset * 6}  YDS` },
          { name: "Joe Mixon",       team: "CIN", value: `${1205 + offset * 5}  YDS` },
        ],
      },
      {
        category: "Receiving Yards",
        data: [
          { name: "Tyreek Hill",    team: "KC",  value: `${1589 + offset * 8}  YDS` },
          { name: "Davante Adams",  team: "GB",  value: `${1498 + offset * 6}  YDS` },
          { name: "Cooper Kupp",    team: "LAR", value: `${1481 + offset * 5}  YDS` },
          { name: "Justin Jefferson", team: "MIN", value: `${1400 + offset * 7} YDS` },
          { name: "Stefon Diggs",   team: "BUF", value: `${1225 + offset * 4}  YDS` },
        ],
      },
    ];
  }

  if (slug === "nba") {
    return [
      {
        category: "Points Per Game",
        data: [
          { name: "Kevin Durant",        team: "BKN", value: `${29.9 + offset * 0.2} PPG` },
          { name: "LeBron James",        team: "LAL", value: `${28.7 + offset * 0.1} PPG` },
          { name: "Stephen Curry",       team: "GSW", value: `${27.3 - offset * 0.1} PPG` },
          { name: "Luka Dončić",         team: "DAL", value: `${26.4 + offset * 0.4} PPG` },
          { name: "Giannis Antetokounmpo", team: "MIL", value: `${25.8 + offset * 0.3} PPG` },
        ],
      },
      {
        category: "Assists Per Game",
        data: [
          { name: "Chris Paul",     team: "PHX", value: `${10.8 - offset * 0.1} APG` },
          { name: "LeBron James",   team: "LAL", value: `${8.9 - offset * 0.1}  APG` },
          { name: "James Harden",   team: "PHI", value: `${8.4 + offset * 0.1}  APG` },
          { name: "Trae Young",     team: "ATL", value: `${8.1 + offset * 0.2}  APG` },
          { name: "Luka Dončić",    team: "DAL", value: `${7.9 + offset * 0.3}  APG` },
        ],
      },
      {
        category: "Rebounds Per Game",
        data: [
          { name: "Nikola Jokić",            team: "DEN", value: `${13.8 - offset * 0.1} RPG` },
          { name: "Giannis Antetokounmpo",   team: "MIL", value: `${11.6 + offset * 0.1} RPG` },
          { name: "Rudy Gobert",             team: "UTA", value: `${14.7 - offset * 0.2} RPG` },
          { name: "Domantas Sabonis",        team: "IND", value: `${12.1 + offset * 0.1} RPG` },
          { name: "Joel Embiid",             team: "PHI", value: `${11.1 + offset * 0.2} RPG` },
        ],
      },
    ];
  }

  // Generic fallback
  return [
    {
      category: `${year} Leaders`,
      data: [
        { name: "Player A", team: "TBD", value: "—" },
        { name: "Player B", team: "TBD", value: "—" },
        { name: "Player C", team: "TBD", value: "—" },
      ],
    },
  ];
}

// ─────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────
export function generateStaticParams() {
  return leagues.flatMap((l) =>
    ARCHIVE_YEARS.map((year) => ({ slug: l.slug, year }))
  );
}

export default async function HistoricalStatsPage({ params }: Props) {
  const { slug, year } = await params;

  if (!leagues.find((l) => l.slug === slug)) notFound();
  if (!ARCHIVE_YEARS.includes(year)) notFound();

  const boards = getMockArchive(slug, year);

  return (
    <main className="container mx-auto pt-8 pb-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-red-600 font-black uppercase text-[10px] tracking-widest">Archive View</span>
          <div className="flex gap-1">
            {ARCHIVE_YEARS.map((y) => (
              <Link
                key={y}
                href={`/league/${slug}/stats/archive/${y}`}
                className={`px-2 py-0.5 rounded text-[9px] font-black uppercase transition-colors ${
                  y === year
                    ? "bg-red-600 text-white"
                    : "border border-surface-300 text-surface-muted hover:text-surface-text hover:border-brand/40"
                }`}
              >
                {y}
              </Link>
            ))}
          </div>
        </div>
        <h1 className="text-2xl font-black italic uppercase text-surface-text">
          {year} {slug.toUpperCase()} Statistical History
        </h1>
        <p className="text-[10px] text-surface-muted font-bold uppercase tracking-widest mt-1">
          Final season totals · Historical archive
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {boards.map((board) => (
          <StatChart
            key={board.category}
            title={board.category}
            data={board.data}
            fullStatsUrl={`/league/${slug}/stats`}
          />
        ))}
      </div>
    </main>
  );
}
