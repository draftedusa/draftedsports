import { notFound } from "next/navigation";
import StatLeaderCard from "@/components/cards/StatLeaderCard";
import CollegeStatsHub from "@/components/editorial/CollegeStatsHub";
import { leagues } from "@/data/leagues";

interface Props {
  params: Promise<{ slug: string }>;
}

// ─────────────────────────────────────────────────────────
// Mock stat leaders keyed by league slug
// ─────────────────────────────────────────────────────────
type Leader = { rank: number; name: string; team: string; value: string | number };
type StatBoard = { category: string; leaders: Leader[] }[];

const STAT_BOARDS: Record<string, StatBoard> = {
  nba: [
    {
      category: "Points Per Game",
      leaders: [
        { rank: 1, name: "Luka Dončić",              team: "DAL", value: "32.4" },
        { rank: 2, name: "Shai Gilgeous-Alexander",  team: "OKC", value: "30.1" },
        { rank: 3, name: "Giannis Antetokounmpo",    team: "MIL", value: "29.8" },
      ],
    },
    {
      category: "Assists Per Game",
      leaders: [
        { rank: 1, name: "Tyrese Haliburton", team: "IND", value: "11.0" },
        { rank: 2, name: "LeBron James",      team: "LAL", value: "8.3"  },
        { rank: 3, name: "Trae Young",        team: "ATL", value: "7.9"  },
      ],
    },
    {
      category: "Rebounds Per Game",
      leaders: [
        { rank: 1, name: "Nikola Jokić",             team: "DEN", value: "13.2" },
        { rank: 2, name: "Giannis Antetokounmpo",    team: "MIL", value: "12.1" },
        { rank: 3, name: "Alperen Şengün",           team: "HOU", value: "11.3" },
      ],
    },
  ],
  nfl: [
    {
      category: "Passing Yards",
      leaders: [
        { rank: 1, name: "Josh Allen",    team: "BUF", value: "4812" },
        { rank: 2, name: "Lamar Jackson", team: "BAL", value: "4601" },
        { rank: 3, name: "C.J. Stroud",   team: "HOU", value: "4388" },
      ],
    },
    {
      category: "Rushing Yards",
      leaders: [
        { rank: 1, name: "Derrick Henry",   team: "BAL", value: "1921" },
        { rank: 2, name: "Bijan Robinson",  team: "ATL", value: "1744" },
        { rank: 3, name: "Jahmyr Gibbs",    team: "DET", value: "1589" },
      ],
    },
    {
      category: "Receiving Yards",
      leaders: [
        { rank: 1, name: "Ja'Marr Chase",    team: "CIN", value: "1654" },
        { rank: 2, name: "Tyreek Hill",      team: "MIA", value: "1601" },
        { rank: 3, name: "Davante Adams",    team: "LVR", value: "1422" },
      ],
    },
  ],
  college: [
    {
      category: "Passing Yards",
      leaders: [
        { rank: 1, name: "Dillon Gabriel",   team: "ORE", value: "4313" },
        { rank: 2, name: "Quinn Ewers",      team: "TEX", value: "4011" },
        { rank: 3, name: "DJ Uiagalelei",    team: "FSU", value: "3877" },
      ],
    },
    {
      category: "Rushing Yards",
      leaders: [
        { rank: 1, name: "Ollie Gordon",   team: "OSU", value: "1732" },
        { rank: 2, name: "TreVeyon Henderson", team: "OSU", value: "1501" },
        { rank: 3, name: "Quinshon Judkins", team: "OSU", value: "1390" },
      ],
    },
    {
      category: "Receiving Yards",
      leaders: [
        { rank: 1, name: "Tetairoa McMillan", team: "ARI", value: "1319" },
        { rank: 2, name: "Luther Burden III", team: "MIZ", value: "1201" },
        { rank: 3, name: "Isaiah Bond",       team: "TEX", value: "1088" },
      ],
    },
  ],
};

const FALLBACK_BOARD: StatBoard = [
  {
    category: "Leaders",
    leaders: [
      { rank: 1, name: "Player A", team: "TBD", value: "—" },
      { rank: 2, name: "Player B", team: "TBD", value: "—" },
      { rank: 3, name: "Player C", team: "TBD", value: "—" },
    ],
  },
];

// ─────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────
export default async function LeagueStatsPage({ params }: Props) {
  const { slug } = await params;
  const league = leagues.find((l) => l.slug === slug);
  if (!league) notFound();

  if (slug === "college") return <CollegeStatsHub />;

  const boards = STAT_BOARDS[slug] ?? FALLBACK_BOARD;

  return (
    <main className="container mx-auto pt-24 pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-surface-text">
          {slug.toUpperCase()} STATS LEADERS
        </h1>
        <p className="text-surface-muted text-[10px] font-bold uppercase tracking-widest mt-1">
          Season: 2025–2026 Regular Season
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {boards.map((board) => (
          <StatLeaderCard
            key={board.category}
            category={board.category}
            leaders={board.leaders}
          />
        ))}
      </div>
    </main>
  );
}
