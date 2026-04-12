import Link from "next/link";
import type { Team } from "@/types";

interface Leader {
  name: string;
  value: string;
}

interface LeagueInsight {
  statLabel: string;           // e.g. "Passing Yards"
  categorySlug: string;        // e.g. "passing-yards"
  homeLeaders: Leader[];
  awayLeaders: Leader[];
}

interface GameInsightWidgetProps {
  homeTeam: Team;
  awayTeam: Team;
  leagueId: string;
}

// ─────────────────────────────────────────────────────────
// Mock per-team top-5 leaders keyed by team slug
// ─────────────────────────────────────────────────────────
type TeamLeaders = Record<string, Leader[]>;

const NFL_PASSING: TeamLeaders = {
  "buffalo-bills":          [{ name:"Josh Allen",       value:"4812 YDS" }, { name:"Khalil Shakir",    value:"1044 YDS" }, { name:"Stefon Diggs",    value:"1321 REC" }, { name:"Dawson Knox",     value:"512 REC"  }, { name:"Devin Singletary",value:"812 RUSH"}],
  "baltimore-ravens":       [{ name:"Lamar Jackson",    value:"4601 YDS" }, { name:"Derrick Henry",    value:"1921 RUSH"}, { name:"Zay Flowers",     value:"1021 REC" }, { name:"Mark Andrews",    value:"889 REC"  }, { name:"Gus Edwards",     value:"712 RUSH"}],
  "kansas-city-chiefs":     [{ name:"Patrick Mahomes",  value:"4089 YDS" }, { name:"Travis Kelce",     value:"1201 REC" }, { name:"Rashee Rice",     value:"938 REC"  }, { name:"Isiah Pacheco",   value:"1098 RUSH"}, { name:"JuJu Smith-Schuster",value:"612 REC"}],
  "philadelphia-eagles":    [{ name:"Jalen Hurts",      value:"4201 YDS" }, { name:"A.J. Brown",       value:"1298 REC" }, { name:"DeVonta Smith",   value:"1089 REC" }, { name:"Saquon Barkley",  value:"1511 RUSH"}, { name:"Dallas Goedert",  value:"812 REC" }],
  "dallas-cowboys":         [{ name:"Dak Prescott",     value:"3921 YDS" }, { name:"CeeDee Lamb",      value:"1389 REC" }, { name:"Brandin Cooks",   value:"788 REC"  }, { name:"Tony Pollard",    value:"912 RUSH" }, { name:"Dalton Schultz",  value:"611 REC" }],
  "san-francisco-49ers":    [{ name:"Brock Purdy",      value:"3501 YDS" }, { name:"Brandon Aiyuk",    value:"1132 REC" }, { name:"Deebo Samuel",    value:"978 REC"  }, { name:"Christian McCaffrey",value:"1122 RUSH"},{ name:"George Kittle",   value:"889 REC" }],
};

const NBA_PPG: TeamLeaders = {
  "los-angeles-lakers":     [{ name:"LeBron James",     value:"25.7 PPG" }, { name:"Anthony Davis",    value:"24.4 PPG" }, { name:"Austin Reaves",   value:"15.9 PPG" }, { name:"D'Angelo Russell", value:"13.2 PPG" }, { name:"Jarred Vanderbilt",value:"6.8 PPG" }],
  "golden-state-warriors":  [{ name:"Stephen Curry",    value:"25.4 PPG" }, { name:"Klay Thompson",    value:"17.2 PPG" }, { name:"Andrew Wiggins",  value:"14.9 PPG" }, { name:"Draymond Green",  value:"8.8 PPG"  }, { name:"Chris Paul",      value:"9.4 PPG" }],
  "boston-celtics":         [{ name:"Jayson Tatum",     value:"28.1 PPG" }, { name:"Jaylen Brown",     value:"22.1 PPG" }, { name:"Kristaps Porzingis",value:"19.8 PPG"},{ name:"Al Horford",      value:"9.1 PPG"  }, { name:"Marcus Smart",    value:"11.4 PPG"}],
  "miami-heat":             [{ name:"Jimmy Butler",     value:"22.9 PPG" }, { name:"Bam Adebayo",      value:"19.4 PPG" }, { name:"Tyler Herro",     value:"18.8 PPG" }, { name:"Kyle Lowry",      value:"8.1 PPG"  }, { name:"Duncan Robinson", value:"10.4 PPG"}],
  "milwaukee-bucks":        [{ name:"Giannis Antetokounmpo",value:"29.8 PPG"},{ name:"Damian Lillard",  value:"26.8 PPG" }, { name:"Brook Lopez",     value:"14.2 PPG" }, { name:"Khris Middleton", value:"15.1 PPG" }, { name:"Bobby Portis",    value:"11.2 PPG"}],
  "denver-nuggets":         [{ name:"Nikola Jokić",     value:"24.5 PPG" }, { name:"Jamal Murray",     value:"21.2 PPG" }, { name:"Michael Porter Jr.",value:"17.8 PPG"},{ name:"Aaron Gordon",    value:"12.4 PPG" }, { name:"Kentavious Pope", value:"9.8 PPG" }],
  "houston-rockets":        [{ name:"Alperen Şengün",   value:"21.1 PPG" }, { name:"Jalen Green",      value:"22.9 PPG" }, { name:"Fred VanVleet",   value:"16.8 PPG" }, { name:"Dillon Brooks",   value:"14.2 PPG" }, { name:"Jabari Smith Jr.",value:"12.1 PPG"}],
};

// Primary insight config per league
const LEAGUE_INSIGHT: Record<string, { statLabel: string; categorySlug: string; teamLeaders: TeamLeaders }> = {
  nfl: { statLabel: "Passing Leaders", categorySlug: "passing-yards", teamLeaders: NFL_PASSING },
  nba: { statLabel: "Points Per Game", categorySlug: "points-per-game", teamLeaders: NBA_PPG   },
};

const FALLBACK_LEADERS: Leader[] = [
  { name: "Data unavailable", value: "—" },
  { name: "Check back later", value: "—" },
];

// ─────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────
export default function GameInsightWidget({ homeTeam, awayTeam, leagueId }: GameInsightWidgetProps) {
  const insight = LEAGUE_INSIGHT[leagueId];
  if (!insight) return null;

  const homeLeaders = insight.teamLeaders[homeTeam.slug] ?? FALLBACK_LEADERS;
  const awayLeaders = insight.teamLeaders[awayTeam.slug] ?? FALLBACK_LEADERS;

  return (
    <div className="rounded-xl border border-surface-300 bg-surface-200 overflow-hidden">

      {/* Header */}
      <div className="px-4 py-3 border-b border-surface-300 flex items-center justify-between">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-surface-muted">
          Game Insights
        </h3>
        <span className="text-[9px] font-bold text-surface-muted uppercase">
          {insight.statLabel}
        </span>
      </div>

      {/* Side-by-side columns */}
      <div className="grid grid-cols-2 divide-x divide-surface-300">
        {/* Away */}
        <div className="p-3 space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-surface-300">
            <span className="text-lg">{awayTeam.logo}</span>
            <span className="text-[10px] font-black uppercase text-surface-text truncate">{awayTeam.name}</span>
          </div>
          {awayLeaders.slice(0, 5).map((leader, i) => (
            <div key={i} className="flex items-start justify-between gap-1">
              <div className="flex items-start gap-1.5 min-w-0">
                <span className="text-[9px] font-black text-red-600 tabular-nums shrink-0 mt-px">{i + 1}</span>
                <span className="text-[10px] font-bold text-surface-text leading-tight truncate">{leader.name}</span>
              </div>
              <span className="text-[9px] font-mono font-black text-surface-muted whitespace-nowrap shrink-0">{leader.value}</span>
            </div>
          ))}
        </div>

        {/* Home */}
        <div className="p-3 space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-surface-300">
            <span className="text-lg">{homeTeam.logo}</span>
            <span className="text-[10px] font-black uppercase text-surface-text truncate">{homeTeam.name}</span>
          </div>
          {homeLeaders.slice(0, 5).map((leader, i) => (
            <div key={i} className="flex items-start justify-between gap-1">
              <div className="flex items-start gap-1.5 min-w-0">
                <span className="text-[9px] font-black text-red-600 tabular-nums shrink-0 mt-px">{i + 1}</span>
                <span className="text-[10px] font-bold text-surface-text leading-tight truncate">{leader.name}</span>
              </div>
              <span className="text-[9px] font-mono font-black text-surface-muted whitespace-nowrap shrink-0">{leader.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <Link
        href={`/league/${leagueId}/stats/${insight.categorySlug}`}
        className="flex items-center justify-center gap-2 px-4 py-3 border-t border-surface-300 bg-surface-300/30 text-[10px] font-black uppercase tracking-widest text-surface-muted hover:bg-red-600 hover:text-white transition-all"
      >
        Compare Full Team Stats →
      </Link>

    </div>
  );
}
