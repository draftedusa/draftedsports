import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { supabaseService } from "@/lib/supabase";
import { runMigrations } from "@/lib/migrations";
import { teams as allTeams } from "@/data/teams";
import { articles } from "@/data/articles";

interface Props { params: Promise<{ username: string }> }

type DbUser = {
  clerk_id: string; email: string | null; display_name: string | null;
  username: string; avatar_url: string | null;
  subscription_tier: string | null; created_at: string;
  favorite_team_ids: string[] | null;
};

// ── Stat pill ─────────────────────────────────────────────
function StatPill({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="flex flex-col items-center px-4 py-3 bg-surface-200 border border-surface-300 rounded-xl min-w-[72px]">
      <span className="text-lg font-black text-surface-text tabular-nums">{value}</span>
      <span className="text-[10px] text-surface-muted uppercase tracking-wider mt-0.5">{label}</span>
    </div>
  );
}

// ── Achievement badge ─────────────────────────────────────
const ACHIEVEMENT_META: Record<string, { emoji: string; label: string; desc: string }> = {
  early_bird: { emoji: "🐦", label: "Early Bird",  desc: "Joined UNDRAFTED" },
  sharp_eye:  { emoji: "👁",  label: "Sharp Eye",   desc: "Saved first article" },
  super_fan:  { emoji: "🏆", label: "Super Fan",   desc: "Followed first team" },
};

function AchievementBadge({ type }: { type: string }) {
  const meta = ACHIEVEMENT_META[type] ?? { emoji: "⭐", label: type, desc: "" };
  return (
    <div className="flex flex-col items-center gap-1 p-3 bg-surface-200 border border-surface-300 rounded-xl min-w-[80px] text-center">
      <span className="text-2xl">{meta.emoji}</span>
      <span className="text-[10px] font-black text-surface-text leading-tight">{meta.label}</span>
      <span className="text-[9px] text-surface-muted leading-tight">{meta.desc}</span>
    </div>
  );
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;
  await runMigrations();

  // ── Load profile ─────────────────────────────────────────
  const { data: profile } = await supabaseService
    .from("users").select("*").eq("username", username).maybeSingle<DbUser>();
  if (!profile) notFound();

  // ── Current viewer ────────────────────────────────────────
  let isOwner = false;
  const clerkUser = await currentUser();
  if (clerkUser) {
    const { data: me } = await supabaseService
      .from("users").select("username").eq("clerk_id", clerkUser.id).maybeSingle<{ username: string | null }>();
    if (!me?.username) redirect("/onboarding");
    isOwner = me.username === username;
  }

  // ── Parallel stats queries ────────────────────────────────
  const [
    { count: followerCount },
    { count: followingCount },
    { count: postCount },
    { count: savedCount },
    { data: achievements },
    { data: recentPosts },
    { data: savedSlugs },
  ] = await Promise.all([
    supabaseService.from("followers").select("*", { count: "exact", head: true }).eq("following_clerk_id", profile.clerk_id),
    supabaseService.from("followers").select("*", { count: "exact", head: true }).eq("follower_clerk_id",  profile.clerk_id),
    supabaseService.from("fan_pulse_posts").select("*", { count: "exact", head: true }).eq("author_clerk_id", profile.clerk_id),
    supabaseService.from("saved_articles").select("*",  { count: "exact", head: true }).eq("clerk_id", profile.clerk_id),
    supabaseService.from("achievements").select("achievement_type").eq("clerk_id", profile.clerk_id),
    supabaseService.from("fan_pulse_posts").select("content, created_at").eq("author_clerk_id", profile.clerk_id).order("created_at", { ascending: false }).limit(6),
    supabaseService.from("saved_articles").select("article_slug").eq("clerk_id", profile.clerk_id).order("saved_at", { ascending: false }).limit(6),
  ]);

  const favoriteTeams = allTeams.filter((t) => (profile.favorite_team_ids ?? []).includes(t.id));
  const savedArticles = articles.filter((a) => (savedSlugs ?? []).some((r: { article_slug: string }) => r.article_slug === a.slug)).slice(0, 4);

  const joinedDate = new Date(profile.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const avatarInitial = (profile.display_name ?? profile.username).charAt(0).toUpperCase();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

      {/* ── PROFILE HEADER ─────────────────────────────────── */}
      <div className="bg-surface-200 border border-surface-300 rounded-2xl overflow-hidden">
        <div className="h-32 relative" style={{ background: "linear-gradient(135deg,#8b5cf655 0%,#d946ef30 100%)" }}>
          <div className="absolute inset-0 bg-gradient-to-t from-surface-200/80 to-transparent" />
        </div>
        <div className="px-6 pb-6 -mt-10 flex items-end gap-4">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt={profile.display_name ?? username}
              className="w-20 h-20 rounded-full ring-4 ring-surface-200 shadow-lg object-cover shrink-0" />
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
                <span className="px-2 py-0.5 bg-yellow-900/50 text-yellow-400 text-xs font-bold rounded uppercase tracking-wider">Premium</span>
              )}
            </div>
            <p className="text-sm text-surface-muted mt-0.5">@{profile.username}</p>
            <p className="text-[11px] text-surface-muted mt-1">Joined {joinedDate}</p>
          </div>
          {isOwner && (
            <Link href="/profile/edit"
              className="shrink-0 px-4 py-2 bg-surface-300 hover:bg-surface-300/80 border border-surface-300 text-surface-text text-xs font-bold rounded-full transition-colors">
              Edit Profile
            </Link>
          )}
        </div>
      </div>

      {/* ── STATS BAR ──────────────────────────────────────── */}
      <div className="flex items-stretch gap-3 overflow-x-auto no-scrollbar">
        <StatPill value={followerCount ?? 0}  label="Followers"  />
        <StatPill value={followingCount ?? 0} label="Following"  />
        <StatPill value={postCount ?? 0}      label="Posts"      />
        <StatPill value={favoriteTeams.length} label="Teams"     />
        <StatPill value={savedCount ?? 0}     label="Saved"      />
      </div>

      {/* ── ACHIEVEMENTS ───────────────────────────────────── */}
      {(achievements ?? []).length > 0 && (
        <section>
          <h2 className="text-sm font-black uppercase tracking-wider text-surface-text mb-3">Achievements</h2>
          <div className="flex gap-3 flex-wrap">
            {(achievements ?? []).map((a: { achievement_type: string }) => (
              <AchievementBadge key={a.achievement_type} type={a.achievement_type} />
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">

          {/* ── JERSEY WALL ──────────────────────────────── */}
          {favoriteTeams.length > 0 && (
            <section className="bg-surface-200 border border-surface-300 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-black uppercase tracking-wider text-surface-text">Jersey Wall</h2>
                  <p className="text-[10px] text-surface-muted mt-0.5">{favoriteTeams.length} team{favoriteTeams.length !== 1 ? "s" : ""}</p>
                </div>
                {isOwner && (
                  <Link href="/profile/edit"
                    className="text-[11px] font-bold text-brand hover:text-brand/80 transition-colors">Edit →</Link>
                )}
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
                {favoriteTeams.map((team) => {
                  const c = team.primaryColor ?? "#8b5cf6";
                  return (
                    <Link key={team.id} href={`/team/${team.slug}`}
                      className="relative flex flex-col items-center gap-1.5 p-3 rounded-xl overflow-hidden"
                      style={{ background: `linear-gradient(145deg,${c}28,${c}0d)`, border: `1px solid ${c}40` }}>
                      <span className="text-3xl leading-none">{team.logo}</span>
                      <span className="text-[9px] font-bold text-center leading-tight" style={{ color: c }}>
                        {team.name.split(" ").at(-1)}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* ── RECENT ACTIVITY (fan pulse posts) ────────── */}
          {(recentPosts ?? []).length > 0 && (
            <section className="bg-surface-200 border border-surface-300 rounded-2xl p-5">
              <h2 className="text-sm font-black uppercase tracking-wider text-surface-text mb-4">Recent Posts</h2>
              <div className="space-y-3">
                {(recentPosts ?? []).map((p: { content: string; created_at: string }, i: number) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 bg-brand" />
                    <div>
                      <p className="text-xs text-surface-text leading-snug">{p.content}</p>
                      <p className="text-[10px] text-surface-muted mt-0.5">
                        {new Date(p.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── SAVED ARTICLES ───────────────────────────── */}
          {savedArticles.length > 0 && (
            <section className="bg-surface-200 border border-surface-300 rounded-2xl p-5">
              <h2 className="text-sm font-black uppercase tracking-wider text-surface-text mb-4">Saved Articles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {savedArticles.map((a) => (
                  <Link key={a.id} href={`/article/${a.slug}`}
                    className="flex items-start gap-3 p-3 rounded-xl bg-surface-100 border border-surface-300 hover:border-brand/30 transition-colors group">
                    <div className="w-12 h-12 rounded-lg bg-brand/10 flex items-center justify-center text-xl shrink-0">🏟️</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-surface-text group-hover:text-brand transition-colors leading-snug line-clamp-2">{a.title}</p>
                      <p className="text-[10px] text-surface-muted mt-1">{a.byline} · {a.readTime}m</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Empty state when no content */}
          {(recentPosts ?? []).length === 0 && savedArticles.length === 0 && favoriteTeams.length === 0 && (
            <div className="bg-surface-200 border border-surface-300 rounded-2xl p-8 text-center">
              <p className="text-surface-muted text-sm">
                {isOwner ? "Post in Fan Pulse and save articles to see activity here." : `${profile.display_name ?? profile.username} hasn't posted yet.`}
              </p>
              {isOwner && <Link href="/feed" className="mt-3 inline-block text-xs font-bold text-brand hover:underline">Go to Fan Pulse →</Link>}
            </div>
          )}
        </div>

        {/* ── SIDEBAR ──────────────────────────────────────── */}
        <aside className="space-y-4">
          {/* Favorite Teams list */}
          <div className="bg-surface-200 border border-surface-300 rounded-2xl p-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-surface-text mb-3 border-l-2 border-red-600 pl-2">
              Favorite Teams
            </h3>
            {favoriteTeams.length > 0 ? (
              <div className="space-y-2">
                {favoriteTeams.slice(0, 5).map((team) => (
                  <Link key={team.id} href={`/team/${team.slug}`}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-300 transition-colors">
                    <span className="text-xl">{team.logo}</span>
                    <div>
                      <p className="text-xs font-semibold text-surface-text">{team.name}</p>
                      <p className="text-[10px] text-surface-muted">{team.record}</p>
                    </div>
                  </Link>
                ))}
                {favoriteTeams.length > 5 && (
                  <p className="text-[10px] text-surface-muted pl-2">+{favoriteTeams.length - 5} more</p>
                )}
              </div>
            ) : (
              <p className="text-xs text-surface-muted">
                {isOwner ? <><Link href="/profile/edit" className="text-brand hover:underline">Add teams</Link> to your wall.</> : "No favorite teams yet."}
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
