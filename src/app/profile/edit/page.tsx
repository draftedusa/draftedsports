"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser }  from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { nflTeams }              from "@/data/teams/nfl";
import { nbaTeams }              from "@/data/teams/nba";
import { teams as legacyTeams }  from "@/data/teams";
import type { Team } from "@/types";
import TeamPicker from "@/components/profile/TeamPicker";
import { checkUsernameAvailableExcludingSelf, saveProfile } from "./actions";

const MLB_NHL = legacyTeams.filter((t) => t.leagueId === "mlb" || t.leagueId === "nhl");
const ALL_TEAMS: Team[] = [...nflTeams, ...nbaTeams, ...MLB_NHL];
const TEAM_MAP = Object.fromEntries(ALL_TEAMS.map((t) => [t.id, t]));

export default function EditProfilePage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  const clerkId = user?.id ?? "";
  const meta    = user?.publicMetadata as { username?: string; favorite_team_ids?: string[] } | undefined;

  // Form state — pre-filled from Clerk / publicMetadata
  const [displayName,  setDisplayName]  = useState("");
  const [username,     setUsername]     = useState("");
  const [favoriteIds,  setFavoriteIds]  = useState<string[]>([]);
  const [pickerOpen,   setPickerOpen]   = useState(false);
  const [saving,       setSaving]       = useState(false);
  const [saveError,    setSaveError]    = useState("");

  // Username validation state
  const [usernameStatus, setUsernameStatus] = useState<
    "idle" | "checking" | "available" | "taken" | "invalid" | "same"
  >("idle");
  const [usernameError, setUsernameError] = useState("");

  // Pre-fill once user loads
  useEffect(() => {
    if (!isLoaded || !user) return;
    setDisplayName(user.fullName ?? user.firstName ?? "");
    setUsername(meta?.username ?? "");
    setFavoriteIds(meta?.favorite_team_ids ?? []);
  }, [isLoaded, user]); // eslint-disable-line react-hooks/exhaustive-deps

  // Redirect if not signed in
  useEffect(() => {
    if (isLoaded && !isSignedIn) router.replace("/");
  }, [isLoaded, isSignedIn, router]);

  // Debounced username availability check (skips when unchanged)
  useEffect(() => {
    const raw = username.trim().toLowerCase();
    if (!raw)                       { setUsernameStatus("idle"); setUsernameError(""); return; }
    if (raw === meta?.username)     { setUsernameStatus("same"); setUsernameError(""); return; }
    setUsernameStatus("checking");
    const tid = setTimeout(async () => {
      const result = await checkUsernameAvailableExcludingSelf(raw, clerkId);
      if (result.error)      { setUsernameStatus("invalid"); setUsernameError(result.error); }
      else if (result.available) { setUsernameStatus("available"); setUsernameError(""); }
      else                   { setUsernameStatus("taken");   setUsernameError("Username is already taken."); }
    }, 450);
    return () => clearTimeout(tid);
  }, [username, clerkId, meta?.username]);

  const handleSave = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameStatus === "taken" || usernameStatus === "invalid") return;
    if (!username.trim()) { setSaveError("Username is required."); return; }
    setSaving(true);
    setSaveError("");
    const result = await saveProfile({
      display_name:      displayName,
      username:          username.trim().toLowerCase(),
      favorite_team_ids: favoriteIds,
    });
    if (result?.error) {
      setSaveError(result.error);
      setSaving(false);
    }
    // On success, saveProfile redirects server-side
  }, [displayName, username, favoriteIds, usernameStatus]);

  const favoriteTeams = favoriteIds.map((id) => TEAM_MAP[id]).filter(Boolean) as Team[];

  if (!isLoaded) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const usernameStatusIcon = {
    checking:  <span className="text-surface-muted text-xs">…</span>,
    available: <span className="text-green-500 text-xs">✓ available</span>,
    taken:     <span className="text-red-500    text-xs">✗ taken</span>,
    invalid:   <span className="text-red-500    text-xs">✗</span>,
    same:      <span className="text-surface-muted text-xs">current</span>,
    idle:      null,
  }[usernameStatus];

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-black tracking-tighter text-surface-text">Edit Profile</h1>
        <p className="text-sm text-surface-muted mt-1">Changes sync to your Clerk account and Supabase profile.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Identity */}
        <section className="bg-surface-200 border border-surface-300 rounded-2xl p-6 space-y-5">
          <h2 className="text-sm font-black uppercase tracking-widest text-surface-text">Identity</h2>

          <div>
            <label className="block text-xs font-bold text-surface-text mb-1.5">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              maxLength={40}
              className="w-full bg-surface-100 border border-surface-300 rounded-lg px-3 py-2 text-sm text-surface-text placeholder-surface-muted/60 focus:outline-none focus:border-brand transition-colors"
            />
            <p className="text-[10px] text-surface-muted mt-1">Synced to your Clerk first/last name.</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-surface-text mb-1.5">Username</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-surface-muted">@</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                placeholder="yourhandle"
                maxLength={20}
                className="w-full bg-surface-100 border border-surface-300 rounded-lg pl-7 pr-24 py-2 text-sm text-surface-text placeholder-surface-muted/60 focus:outline-none focus:border-brand transition-colors"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                {usernameStatusIcon}
              </span>
            </div>
            {usernameError && <p className="text-xs text-red-500 mt-1">{usernameError}</p>}
          </div>
        </section>

        {/* Favorite Teams */}
        <section className="bg-surface-200 border border-surface-300 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest text-surface-text">Favorite Teams</h2>
              <p className="text-xs text-surface-muted mt-0.5">{favoriteIds.length} selected</p>
            </div>
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="px-3 py-1.5 bg-brand/10 hover:bg-brand/20 border border-brand/20 text-brand text-xs font-bold rounded-full transition-colors"
            >
              Edit Teams
            </button>
          </div>

          {favoriteTeams.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {favoriteTeams.map((t) => (
                <div key={t.id} className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-100 border border-surface-300 rounded-lg text-xs">
                  <span>{t.logo}</span>
                  <span className="font-semibold text-surface-text">{t.name.split(" ").at(-1)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-surface-muted">No teams selected yet.</p>
          )}
        </section>

        {saveError && (
          <p className="text-xs text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            {saveError}
          </p>
        )}

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-2.5 border border-surface-300 text-surface-text text-sm font-bold rounded-xl hover:bg-surface-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || usernameStatus === "taken" || usernameStatus === "invalid"}
            className="flex-1 sm:flex-none px-8 py-2.5 bg-brand hover:bg-brand/90 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-colors"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </form>

      {pickerOpen && (
        <TeamPicker
          currentFavorites={favoriteIds}
          onSave={(ids) => setFavoriteIds(ids)}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  );
}
