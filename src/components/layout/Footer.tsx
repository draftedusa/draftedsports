import Link from "next/link";
import { leagues } from "@/data/leagues";

export default function Footer() {
  return (
    <footer className="bg-surface-200 border-t border-surface-300 mt-16 text-surface-muted">
      <div className="max-w-[1400px] mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <span className="text-xl font-black italic tracking-tighter text-surface-text">
            UN<span className="text-brand">DRAFTED</span>
          </span>
          <p className="mt-2 text-sm leading-relaxed">
            Your home for sports news, live game coverage, and community debate. All mock data — built for demonstration.
          </p>
        </div>

        {/* Leagues */}
        <div>
          <h4 className="text-surface-text font-semibold mb-3 text-sm uppercase tracking-wide">Leagues</h4>
          <ul className="space-y-2 text-sm">
            {leagues.map((l) => (
              <li key={l.id}>
                <Link href={`/league/${l.slug}`} className="hover:text-brand transition-colors">
                  {l.logo} {l.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Tools */}
        <div>
          <h4 className="text-surface-text font-semibold mb-3 text-sm uppercase tracking-wide">Editorial</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/admin/live-control" className="hover:text-brand transition-colors">
                ⚡ Live Control Panel
              </Link>
            </li>
            <li>
              <Link href="/admin/analytics" className="hover:text-brand transition-colors">
                📊 Analytics Dashboard
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-brand transition-colors">
                🔐 Sign In
              </Link>
            </li>
          </ul>
        </div>

        {/* About */}
        <div>
          <h4 className="text-surface-text font-semibold mb-3 text-sm uppercase tracking-wide">About</h4>
          <ul className="space-y-2 text-sm">
            <li>Mock prototype — no real sports data</li>
            <li>Built with Next.js + Tailwind CSS</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-surface-300 px-4 py-4 text-center text-xs text-surface-muted">
        © 2026 UNDRAFTED — Mock Sports Media Platform. All data is fictional.
      </div>
    </footer>
  );
}
