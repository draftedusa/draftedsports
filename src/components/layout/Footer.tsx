import Link from "next/link";
import { leagues } from "@/data/leagues";

export default function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-gray-800 mt-16 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <span className="text-xl font-black text-white">
            UN<span className="text-red-500">DRAFTED</span>
          </span>
          <p className="mt-2 text-sm leading-relaxed">
            Your home for sports news, live game coverage, and community debate. All mock data — built for demonstration.
          </p>
        </div>

        {/* Leagues */}
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Leagues</h4>
          <ul className="space-y-2 text-sm">
            {leagues.map((l) => (
              <li key={l.id}>
                <Link href={`/league/${l.slug}`} className="hover:text-white transition-colors">
                  {l.logo} {l.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Tools */}
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Editorial</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/admin/live-control" className="hover:text-white transition-colors">
                ⚡ Live Control Panel
              </Link>
            </li>
            <li>
              <Link href="/admin/analytics" className="hover:text-white transition-colors">
                📊 Analytics Dashboard
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">About</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <span className="text-gray-500">Mock prototype — no real sports data</span>
            </li>
            <li>
              <span className="text-gray-500">Built with Next.js + Tailwind CSS</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 px-4 py-4 text-center text-xs text-gray-600">
        © 2026 UNDRAFTED — Mock Sports Media Platform. All data is fictional.
      </div>
    </footer>
  );
}
