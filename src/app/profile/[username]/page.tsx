import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { supabaseService } from "@/lib/supabase";
import { runMigrations } from "@/lib/migrations";
import { teams as allTeams } from "@/data/teams";
import { articles } from "@/data/articles";
import ProfilePostSection from "@/components/profile/ProfilePostSection";

interface Props { params: Promise<{ username: string }> }

type DbUser = {
  clerk_id: string; email: string | null; display_name: string | null;
  username: string; avatar_url: string | null;
  subscription_tier: string | null; created_at: string;
  favorite_team_ids: string[] | null;
};

// ── All 20 achievements ────────────────────────────────────
const ALL_ACHIEVEMENTS = [
  { type: "early_bird",        emoji: "🐦", label: "Early Bird",       criteria: "Sign up for UNDRAFTED" },
  { type: "sharp_eye",         emoji: "👁",  label: "Sharp Eye",        criteria: "Save your first article" },
  { type: "super_fan",         emoji: "🏆",  label: "Super Fan",        criteria: "Follow at least one team" },
  { type: "first_post",        emoji: "📢",  label: "First Take",       criteria: "Post your first take" },
  { type: "hot_take",          emoji: "🔥",  label: "Hot Take",         criteria: "Earn 10+ fire reactions on a post" },
  { type: "social_butterfly",  emoji: "🦋",  label: "Social Butterfly", criteria: "Follow 5 users" },
  { type: "headline_reader",   emoji: "📰",  label: "Headline Reader",  criteria: "Save 5 articles" },
  { type: "bookworm",          emoji: "📚",  label: "Bookworm",         criteria: "Save 25 articles" },
  { type: "die_hard",          emoji: "💪",  label: "Die Hard",         criteria: "Follow 3+ teams" },
  { type: "influencer",        emoji: "⭐",  label: "Influencer",       criteria: "Reach 50 followers" },
  { type: "trendsetter",       emoji: "📈",  label: "Trendsetter",      criteria: "Earn 100+ fire reactions on a post" },
  { type: "streak_7",          emoji: "🗓️", label: "Week Streak",      criteria: "Visit 7 days in a row" },
  { type: "night_owl",         emoji: "🦉",  label: "Night Owl",        criteria: "Post after midnight" },
  { type: "mvp",               emoji: "🏅",  label: "MVP",              criteria: "Top contributor in a week" },
  { type: "analyst",           emoji: "🔍",  label: "Analyst",          criteria: "Read 20+ articles" },
  { type: "global_fan",        emoji: "🌍",  label: "Global Fan",       criteria: "Follow teams from 3+ leagues" },
  { type: "trash_talker",      emoji: "🗣️", label: "Trash Talker",     criteria: "Post 25 takes" },
  { type: "founding_fan",      emoji: "🎖️", label: "Founding Fan",     criteria: "Joined in the first month" },
  { type: "verified_fan",      emoji: "✅",  label: "Verified Fan",     criteria: "Verify your account" },
  { type: "legend",            emoji: "👑",  label: "Legend",           criteria: "Earn all other achievements" },
];

// ── Activity type meta ────────────────────────────────────
const ACTIVITY_META: Record<string, { emoji: string; color: string }> = {
  comment_posted:    { emoji: "📢", color: "bg-brand/20 text-brand" },
  article_saved:     { emoji: "📰", color: "bg-green-500/20 text-green-400" },
  reaction_added:    { emoji: "🔥", color: "bg-orange-500/20 text-orange-400" },
  user_followed:     { emoji: "👥", color: "bg-purple-500/20 text-purple-400" },
  achievement_earned:{ emoji: "🏆", color: "bg-yellow-500/20 text-yellow-400" },
};

function relativeTime(iso: string) {
  const secs = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (secs < 60)    return `${secs}s ago`;
  if (secs < 3600)  return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

function StatPill({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="flex flex-col items-center px-4 py-3 bg-surface-200 border border-surface-300 rounded-xl min-w-[72px]">
      <span className="text-lg font-black text-surface-text tabular-nums">{value}</span>
      <span className="text-[10px] text-surface-muted uppercase tracking-wider mt-0.5">{label}</span>
    </div>
  );
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;
  await runMigrations();

  // Load profile
  const { data: profile } = await supabaseService
    .from("users").select("*").eq("username", username).maybeSingle<DbUser>();
  if (!profile) notFound();

  // Current viewer
  let isOwner = false;
  const clerkUser = await currentUser();
  if (clerkUser) {
    const { data: me } = await supabaseService
      .from("users").select("username").eq("clerk_id", clerkUser.id).maybeSingle<{ username: string | null }>();
    if (!me?.username) redirect("/onboarding");
    isOwner = me.username === username;
  }

  // Parallel stats queries
  const [
    { count: followerCount },
    { count: followingCount },
    { count: postCount },
    { count: savedCount },
    { data: achievements },
    { data: recentPosts },
    { data: savedSlugs },
    { data: recentActivity },
  ] = await Promise.all([
    supabaseService.from("followers").select("*", { count: "exact", head: true }).eq("following_clerk_id", profile.clerk_id),
    supabaseService.from("followers").select("*", { count: "exact", head: true }).eq("follower_clerk_id",  profile.clerk_id),
    supabaseService.from("fan_pulse_posts").select("*", { count: "exact", head: true }).eq("user_id", profile.clerk_id),
    supabaseService.from("saved_articles").select("*",  { count: "exact", head: true }).eq("clerk_id", profile.clerk_id),
    supabaseService.from("achievements").select("achievement_type, awarded_at").eq("clerk_id", profile.clerk_id),
    supabaseService.from("fan_pulse_posts").select("id, content, created_at").eq("user_id", profile.clerk_id).order("created_at", { ascending: false }).limit(12),
    supabaseService.from("saved_articles").select("article_slug").eq("clerk_id", profile.clerk_id).order("saved_at", { ascending: false }).limit(6),
    supabaseService.from("user_activity").select("*").eq("clerk_id", profile.clerk_id).order("created_at", { ascending: false }).limit(6),
  ]);

  const earnedMap = Object.fromEntries(
    (achievements ?? []).map((a: { achievement_type: string; awarded_at: string }) => [a.achievement_type, a.awarded_at])
  );
  const earnedCount = Object.keys(earnedMap).length;

  const favoriteTeams = allTeams.filter((t) => (profile.favorite_team_ids ?? []).includes(t.id));
  const savedArticles = articles.filter((a) => (savedSlugs ?? []).some((r: { article_slug: string }) => r.article_slug === a.slug)).slice(0, 4);

  const joinedDate = new Date(profile.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const avatarInitial = (profile.display_name ?? profile.username).charAt(0).toUpperCase();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

      {/* ── PROFILE HEADER ──────────────────────────────── */}
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

      {/* ── STATS BAR ───────────────────────────────────── */}
      <div className="flex items-stretch gap-3 overflow-x-auto no-scrollbar">
        <StatPill value={followerCount ?? 0}  label="Followers"  />
        <StatPill value={followingCount ?? 0} label="Following"  />
        <StatPill value={postCount ?? 0}      label="Posts"      />
        <StatPill value={favoriteTeams.length} label="Teams"     />
        <StatPill value={savedCount ?? 0}     label="Saved"      />
      </div>

      {/* ── ACHIEVEMENTS (all 20) ───────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-black uppercase tracking-wider text-surface-text">Achievements</h2>
          <span className="text-xs text-surface-muted">{earnedCount}/{ALL_ACHIEVEMENTS.length} unlocked</span>
        </div>
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
          {ALL_ACHIEVEMENTS.map((a) => {
            const earned = !!earnedMap[a.type];
            const awardedAt = earnedMap[a.type];
            return (
              <div
                key={a.type}
                title={earned ? `Earned${awardedAt ? " · " + new Date(awardedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}` : a.criteria}
                className={`relative flex flex-col items-center gap-1 p-3 rounded-xl min-w-[72px] max-w-[72px] text-center transition-all cursor-default select-none ${
                  earned
                    ? "bg-surface-200 border border-brand/40 shadow-sm shadow-brand/20"
                    : "bg-surface-200/50 border border-surface-300 opacity-40 grayscale"
                }`}
              >
                <span className="text-2xl leading-none">{a.emoji}</span>
                <span className={`text-[9px] font-black leading-tight ${earned ? "text-surface-text" : "text-surface-muted"}`}>
                  {a.label}
                </span>
                {!earned && (
                  <span className="absolute top-1 right-1 text-[10px]">🔒</span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">

          {/* ── JERSEY WALL ─────────────────────────────── */}
          <section className="bg-surface-200 border border-surface-300 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-black uppercase tracking-wider text-surface-text">Jersey Wall</h2>
                <p className="text-[10px] text-surface-muted mt-0.5">{favoriteTeams.length} team{favoriteTeams.length !== 1 ? "s" : ""}</p>
              </div>
              {isOwner && (
                <Link href="/profile/edit"
                  className="text-[11px] font-bold text-brand hover:text-brand/80 transition-colors">
                  {favoriteTeams.length > 0 ? "Edit →" : "+ Add teams"}
                </Link>
              )}
            </div>
            {favoriteTeams.length > 0 ? (
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
            ) : (
              <p className="text-xs text-surface-muted py-4 text-center">
                {isOwner
                  ? <Link href="/profile/edit" className="text-brand hover:underline">Add teams to your wall →</Link>
                  : "No favorite teams yet."}
              </p>
            )}
          </section>

          {/* ── MY FEED (owner only) — client component ── */}
          {isOwner && (
            <ProfilePostSection
              username={username}
              clerkId={profile.clerk_id}
              avatarUrl={profile.avatar_url}
              displayName={profile.display_name ?? profile.username}
            />
          )}

          {/* ── RECENT POSTS (non-owner view) ────────────── */}
          {!isOwner && (
            <section className="bg-surface-200 border border-surface-300 rounded-2xl p-5">
              <h2 className="text-sm font-black uppercase tracking-wider text-surface-text mb-4">Recent Posts</h2>
              {(recentPosts ?? []).length > 0 ? (
                <div className="space-y-3">
                  {(recentPosts ?? []).map((p: { id: string; content: string; created_at: string }) => (
                    <div key={p.id} className="flex items-start gap-2.5">
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
              ) : (
                <p className="text-xs text-surface-muted text-center py-4">{profile.display_name ?? profile.username} hasn&apos;t posted yet.</p>
              )}
            </section>
          )}

          {/* ── SAVED ARTICLES ──────────────────────────── */}
          <section className="bg-surface-200 border border-surface-300 rounded-2xl p-5">
            <h2 className="text-sm font-black uppercase tracking-wider text-surface-text mb-4">Saved Articles</h2>
            {savedArticles.length > 0 ? (
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
            ) : (
              <div className="text-center py-6">
                <p className="text-3xl mb-2">📰</p>
                <p className="text-xs text-surface-muted">No saved articles yet.</p>
                {isOwner && <Link href="/" className="mt-2 inline-block text-xs font-bold text-brand hover:underline">Browse articles →</Link>}
              </div>
            )}
          </section>

          {/* ── RECENT ACTIVITY ─────────────────────────── */}
          <section className="bg-surface-200 border border-surface-300 rounded-2xl p-5">
            <h2 className="text-sm font-black uppercase tracking-wider text-surface-text mb-4">Recent Activity</h2>
            {(recentActivity ?? []).length > 0 ? (
              <div className="space-y-3">
                {(recentActivity ?? []).map((act: { id: string; type: string; description: string; created_at: string }) => {
                  const meta = ACTIVITY_META[act.type] ?? { emoji: "📌", color: "bg-surface-300 text-surface-muted" };
                  return (
                    <div key={act.id} className="flex items-start gap-3">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0 ${meta.color}`}>
                        {meta.emoji}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-surface-text leading-snug">{act.description}</p>
                        <p className="text-[10px] text-surface-muted mt-0.5">{relativeTime(act.created_at)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-3xl mb-2">📋</p>
                <p className="text-xs text-surface-muted">No recent activity yet.</p>
              </div>
            )}
          </section>

        </div>

        {/* ── SIDEBAR ───────────────────────────────────── */}
        <aside className="space-y-4">
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
                {isOwner ? <Link href="/profile/edit" className="text-brand hover:underline">Add teams →</Link> : "No favorite teams yet."}
              </p>
            )}
          </div>

          {/* Achievements summary */}
          <div className="bg-surface-200 border border-surface-300 rounded-2xl p-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-surface-text mb-3 border-l-2 border-yellow-500 pl-2">
              Achievements
            </h3>
            <p className="text-2xl font-black text-surface-text">{earnedCount}<span className="text-base font-normal text-surface-muted">/{ALL_ACHIEVEMENTS.length}</span></p>
            <p className="text-[10px] text-surface-muted mt-0.5">unlocked</p>
            <div className="mt-3 flex flex-wrap gap-1">
              {ALL_ACHIEVEMENTS.filter((a) => earnedMap[a.type]).map((a) => (
                <span key={a.type} title={a.label} className="text-lg cursor-default">{a.emoji}</span>
              ))}
              {earnedCount === 0 && <p className="text-[10px] text-surface-muted">None yet — keep going!</p>}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
