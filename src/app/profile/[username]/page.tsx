import { notFound } from "next/navigation";
import Link from "next/link";
import { users } from "@/data/users";
import { teams } from "@/data/teams";
import { articles } from "@/data/articles";
import { comments } from "@/data/comments";
import Panel from "@/components/ui/Panel";
import ArticleCard from "@/components/cards/ArticleCard";

interface Props {
  params: Promise<{ username: string }>;
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;
  const user = users.find((u) => u.username === username);
  if (!user) notFound();

  const favoriteTeams = teams.filter((t) => user.favoriteTeamIds.includes(t.id));
  const savedArticles = articles.filter((a) => user.savedArticleIds.includes(a.id));
  const userComments = comments.filter((c) => user.recentComments.includes(c.id));

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Profile Header */}
      <div className="bg-surface-200 border border-surface-300 rounded-xl p-8 flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-surface-300 flex items-center justify-center text-4xl border-2 border-surface-300">
          {user.avatar}
        </div>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-black text-white">@{user.username}</h1>
            {user.role === "admin" && (
              <span className="px-2 py-0.5 bg-yellow-900 text-yellow-400 text-xs font-bold rounded uppercase">
                Admin
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-surface-muted">
            <span>{savedArticles.length} saved articles</span>
            <span>·</span>
            <span>{favoriteTeams.length} favorite teams</span>
            <span>·</span>
            <span>{userComments.length} recent comments</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Saved Articles */}
          {savedArticles.length > 0 && (
            <section>
              <h2 className="text-base font-bold text-surface-text mb-3">Saved Articles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {savedArticles.map((a) => (
                  <ArticleCard key={a.id} article={a} />
                ))}
              </div>
            </section>
          )}

          {/* Recent Comments */}
          {userComments.length > 0 && (
            <section>
              <h2 className="text-base font-bold text-surface-text mb-3">Recent Comments</h2>
              <div className="space-y-3">
                {userComments.map((cmt) => (
                  <div key={cmt.id} className="bg-surface-200 border border-surface-300 rounded-lg p-4">
                    <p className="text-sm text-surface-text mb-2">{cmt.body}</p>
                    <div className="flex items-center gap-3 text-xs text-surface-muted">
                      <span>
                        {new Date(cmt.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                      <span>·</span>
                      <span>🔥 {cmt.reactions.fire}</span>
                      <span>💯 {cmt.reactions.facts}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
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

export function generateStaticParams() {
  return users.map((u) => ({ username: u.username }));
}
