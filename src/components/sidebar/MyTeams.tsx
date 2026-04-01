"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { teams } from "@/data/teams";

// Show the first 5 teams as "followed" for demo purposes when logged in
const DEMO_TEAM_IDS = ["team-lakers", "team-chiefs", "team-yankees", "team-bruins", "team-warriors"];

export default function MyTeams() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-surface-muted mb-3">My Teams</p>
        <div className="bg-surface-200 border border-surface-300 rounded-xl p-4 text-center">
          <p className="text-sm text-surface-muted mb-3">Sign in to follow your teams and get personalized updates.</p>
          <Link
            href="/login"
            className="inline-block px-4 py-2 bg-brand text-white text-xs font-bold rounded-lg hover:bg-brand/90 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const myTeams = teams.filter((t) => DEMO_TEAM_IDS.includes(t.id));

  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-surface-muted mb-3">My Teams</p>
      <div className="space-y-2">
        {myTeams.map((team) => (
          <Link key={team.id} href={`/team/${team.slug}`} className="flex items-center gap-3 group">
            <span
              className="w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0"
              style={{
                backgroundColor: team.primaryColor + "33",
                boxShadow: `0 0 8px var(--brand)`,
              }}
            >
              {team.logo}
            </span>
            <span className="text-sm text-surface-text group-hover:text-brand transition-colors font-medium">
              {team.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
