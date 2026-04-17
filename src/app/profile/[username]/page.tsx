import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { supabaseService } from "@/lib/supabase";
import { teams } from "@/data/teams";
import Panel from "@/components/ui/Panel";

interface Props {
  params: Promise<{ username: string }>;
}

type DbUser = {
  clerk_id: string;
  email: string | null;
  display_name: string | null;
  username: string;
  avatar_url: string | null;
  subscription_tier: string | null;
  created_at: string;
  favorite_team_ids: string[] | null;
};

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;

  // Load the profile being viewed
  const { data: profile } = await supabaseService
    .from("users")
    .select("*")
    .eq("username", username)
    .maybeSingle<DbUser>();

  if (!profile) notFound();

  // Determine ownership
  let isOwner = false;
  const clerkUser = await currentUser();

  if (clerkUser) {
    // If the signed-in user has no Supabase profile yet, send to onboarding
    const { data: myProfile } = await supabaseService
      .from("users")
      .select("username")
      .eq("clerk_id", clerkUser.id)
      .maybeSingle<{ username: string | null }>();

    if (!myProfile?.username) redirect("/onboarding");

    isOwner = myProfile.username === username;
  }

  const favoriteTeams = teams.filter((t) =>
    (profile.favorite_team_ids ?? []).includes(t.id)
  );

  const joinedDate = new Date(profile.created_at).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const avatarInitial = (profile.display_name ?? profile.username)
    .charAt(0)
    .toUpperCase();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

      {/* Profile Header */}
      <div className="bg-surface-200 border border-surface-300 rounded-2xl overflow-hidden">
        {/* Banner */}
        <div
          className="h-32 relative"
          style={{
            background: `linear-gradient(135deg, #8b5cf655 0%, #d946ef30 100%)`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-surface-200/80 to-transparent" />
        </div>

        <div className="px-6 pb-6 -mt-10 flex items-end gap-4">
          {/* Avatar */}
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.display_name ?? profile.username}
              className="w-20 h-20 rounded-full ring-4 ring-surface-200 shadow-lg object-cover shrink-0"
            />
          ) : (
            <div className="w-20 h-20 rounded-full ring-4 ring-surface-200 shadow-lg bg-brand flex items-center justify-center text-white text-3xl font-black shrink-0">
              {avatarInitial}
            </div>
          )}

          <div className="flex-1 min-w-0 pb-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-black tracking-tighter text-surface-text">
                {profile.display_name ?? `@${profile.username}`}
              </h1>
              {profile.subscription_tier === "premium" && (
                <span className="px-2 py-0.5 bg-yellow-900/50 text-yellow-400 text-xs font-bold rounded uppercase tracking-wider">
                  Premium
                </span>
              )}
            </div>
            <p className="text-sm text-surface-muted mt-0.5">@{profile.username}</p>
            <p className="text-[11px] text-surface-muted mt-1">Joined {joinedDate}</p>
          </div>

          {isOwner && (
            <Link
              href="/onboarding"
              className="shrink-0 px-4 py-2 bg-surface-300 hover:bg-surface-300/80 border border-surface-300 text-surface-text text-xs font-bold rounded-full transition-colors"
            >
              Edit Profile
            </Link>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-6 px-2 text-sm">
        <div className="text-center">
          <p className="font-black text-surface-text">{favoriteTeams.length}</p>
          <p className="text-[11px] text-surface-muted uppercase tracking-wide">Teams</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Empty state for content not yet wired */}
          <div className="bg-surface-200 border border-surface-300 rounded-2xl p-8 text-center">
            <p className="text-surface-muted text-sm">
              {isOwner
                ? "Your activity (saved articles, comments) will appear here soon."
                : `${profile.display_name ?? profile.username}'s activity will appear here soon.`}
            </p>
          </div>
        </div>

        {/* Sidebar: Favorite Teams */}
        <div>
          <Panel title="Favorite Teams" accent="border-red-600">
            {favoriteTeams.length > 0 ? (
              <div className="space-y-3">
                {favoriteTeams.map((team) => (
                  <Link key={team.id} href={`/team/${team.slug}`}>
                    <div className="flex items-center gap-3 p-2 rounded hover:bg-surface-300 transition-colors">
                      <span className="text-2xl">{team.logo}</span>
                      <div>
                        <p className="text-sm font-semibold text-white">{team.name}</p>
                        <p className="text-xs text-surface-muted">{team.record}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-surface-muted">No favorite teams yet.</p>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}
