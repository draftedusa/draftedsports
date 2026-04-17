"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { nflTeams } from "@/data/teams/nfl";
import { nbaTeams } from "@/data/teams/nba";
import { teams as legacyTeams } from "@/data/teams";
import type { Team } from "@/types";
import { checkUsernameAvailable, completeOnboarding } from "./actions";

// ── Team data (NFL + NBA + MLB + NHL from legacy) ───────
const MLB_NHL = legacyTeams.filter(
  (t) => t.leagueId === "mlb" || t.leagueId === "nhl"
);
const ONBOARDING_TEAMS: Team[] = [...nflTeams, ...nbaTeams, ...MLB_NHL];

const LEAGUE_LABELS: Record<string, string> = {
  nfl: "NFL",
  nba: "NBA",
  mlb: "MLB",
  nhl: "NHL",
};

// ── Team tile ────────────────────────────────────────────
function TeamTile({
  team,
  selected,
  onToggle,
}: {
  team: Team;
  selected: boolean;
  onToggle: (id: string) => void;
}) {
  const color = team.primaryColor ?? "#8b5cf6";
  return (
    <button
      type="button"
      onClick={() => onToggle(team.id)}
      aria-pressed={selected}
      className="relative flex flex-col items-center gap-1 p-2.5 rounded-xl text-center transition-all"
      style={
        selected
          ? {
              background: `linear-gradient(135deg, ${color}28, ${color}0e)`,
              border: `1.5px solid ${color}`,
              boxShadow: `0 0 0 1px ${color}60`,
            }
          : {
              background: "var(--surface-200)",
              border: "1px solid var(--surface-300)",
            }
      }
    >
      <span className="text-2xl leading-none">{team.logo}</span>
      <span
        className="text-[9px] font-bold leading-tight line-clamp-1 max-w-full"
        style={{ color: selected ? color : "var(--surface-muted)" }}
      >
        {team.name.split(" ").at(-1)}
      </span>
      {selected && (
        <span
          className="absolute top-1 right-1 w-3 h-3 rounded-full flex items-center justify-center"
          style={{ background: color }}
        >
          <svg viewBox="0 0 8 8" fill="none" className="w-2 h-2">
            <path d="M1 4l2 2 4-4" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      )}
    </button>
  );
}

// ── Main onboarding page ─────────────────────────────────
export default function OnboardingPage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  const [step, setStep] = useState(1);

  // Step 1 fields
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername]       = useState("");
  const [usernameStatus, setUsernameStatus] = useState<
    "idle" | "checking" | "available" | "taken" | "invalid"
  >("idle");
  const [usernameError, setUsernameError] = useState("");
  const [step1Error, setStep1Error] = useState("");

  // Step 2 fields
  const [selectedTeams, setSelectedTeams] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting]       = useState(false);
  const [submitError, setSubmitError]     = useState("");

  // Redirect unsigned-in visitors to home
  useEffect(() => {
    if (isLoaded && !isSignedIn) router.replace("/");
  }, [isLoaded, isSignedIn, router]);

  // Debounced username check
  useEffect(() => {
    const raw = username.trim().toLowerCase();
    if (!raw) { setUsernameStatus("idle"); setUsernameError(""); return; }
    setUsernameStatus("checking");
    const tid = setTimeout(async () => {
      const result = await checkUsernameAvailable(raw);
      if (result.error) {
        setUsernameStatus("invalid");
        setUsernameError(result.error);
      } else if (result.available) {
        setUsernameStatus("available");
        setUsernameError("");
      } else {
        setUsernameStatus("taken");
        setUsernameError("That username is already taken.");
      }
    }, 450);
    return () => clearTimeout(tid);
  }, [username]);

  const toggleTeam = useCallback((id: string) => {
    setSelectedTeams((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  function handleStep1(e: React.FormEvent) {
    e.preventDefault();
    if (!displayName.trim()) { setStep1Error("Display name is required."); return; }
    if (usernameStatus !== "available") { setStep1Error("Please choose a valid, available username."); return; }
    setStep1Error("");
    setStep(2);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (selectedTeams.size === 0) { setSubmitError("Pick at least 1 team."); return; }
    setSubmitting(true);
    setSubmitError("");
    const result = await completeOnboarding({
      display_name: displayName.trim(),
      username: username.trim().toLowerCase(),
      favorite_team_ids: Array.from(selectedTeams),
    });
    if (result?.error) {
      setSubmitError(result.error);
      setSubmitting(false);
    }
    // On success, `completeOnboarding` redirects server-side
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const leagueGroups = ["nfl", "nba", "mlb", "nhl"].map((lid) => ({
    id: lid,
    label: LEAGUE_LABELS[lid],
    teams: ONBOARDING_TEAMS.filter((t) => t.leagueId === lid),
  })).filter((g) => g.teams.length > 0);

  return (
    <div className="w-full max-w-lg">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand" />
            <span className="text-xl font-black tracking-tighter text-surface-text">UNDRAFTED</span>
          </div>
          <p className="text-sm text-surface-muted">
            {step === 1 ? "Set up your profile" : "Pick your teams"}
          </p>
        </div>

        {/* Step dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2].map((s) => (
            <div
              key={s}
              className="h-1 w-12 rounded-full transition-colors"
              style={{ background: s <= step ? "var(--brand)" : "var(--surface-300)" }}
            />
          ))}
        </div>

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <form onSubmit={handleStep1} className="bg-surface-200 border border-surface-300 rounded-2xl p-6 space-y-5">
            <h2 className="text-base font-black text-surface-text">Who are you?</h2>

            <div>
              <label className="block text-xs font-bold text-surface-text mb-1.5">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name or nickname"
                maxLength={40}
                required
                className="w-full bg-surface-100 border border-surface-300 rounded-lg px-3 py-2 text-sm text-surface-text placeholder-surface-muted/60 focus:outline-none focus:border-brand transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-surface-text mb-1.5">
                Username
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-surface-muted">@</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase())}
                  placeholder="yourhandle"
                  maxLength={20}
                  required
                  className="w-full bg-surface-100 border border-surface-300 rounded-lg pl-7 pr-9 py-2 text-sm text-surface-text placeholder-surface-muted/60 focus:outline-none focus:border-brand transition-colors"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs">
                  {usernameStatus === "checking"  && <span className="text-surface-muted">…</span>}
                  {usernameStatus === "available" && <span className="text-green-500">✓</span>}
                  {(usernameStatus === "taken" || usernameStatus === "invalid") && (
                    <span className="text-red-500">✗</span>
                  )}
                </span>
              </div>
              {usernameError && (
                <p className="text-xs text-red-500 mt-1">{usernameError}</p>
              )}
            </div>

            {step1Error && (
              <p className="text-xs text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {step1Error}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-brand hover:bg-brand/90 text-white font-bold rounded-xl text-sm transition-colors"
            >
              Continue →
            </button>
          </form>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="bg-surface-200 border border-surface-300 rounded-2xl overflow-hidden">
            <div className="px-6 pt-6 pb-4">
              <h2 className="text-base font-black text-surface-text mb-1">
                Pick your teams
              </h2>
              <p className="text-xs text-surface-muted">
                {selectedTeams.size} selected · choose at least 1
              </p>
            </div>

            <div className="px-6 pb-4 space-y-6 max-h-[55vh] overflow-y-auto">
              {leagueGroups.map(({ id, label, teams: leagueTeams }) => (
                <section key={id}>
                  <p className="text-[10px] font-black uppercase tracking-widest text-surface-muted mb-2">
                    {label}
                  </p>
                  <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
                    {leagueTeams.map((team) => (
                      <TeamTile
                        key={team.id}
                        team={team}
                        selected={selectedTeams.has(team.id)}
                        onToggle={toggleTeam}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>

            {submitError && (
              <div className="mx-6 mb-3">
                <p className="text-xs text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {submitError}
                </p>
              </div>
            )}

            <div className="px-6 py-4 border-t border-surface-300 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-surface-muted hover:text-surface-text transition-colors"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={submitting || selectedTeams.size === 0}
                className="flex-1 py-2.5 bg-brand hover:bg-brand/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm transition-colors"
              >
                {submitting ? "Saving…" : "Finish Setup"}
              </button>
            </div>
          </form>
        )}
    </div>
  );
}
