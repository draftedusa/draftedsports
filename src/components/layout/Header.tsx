import Link from "next/link";
import { leagues } from "@/data/leagues";

export default function Header() {
  return (
    <header className="bg-gray-950 border-b border-gray-800 sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-red-700 text-white text-xs py-1 px-4 flex items-center gap-4 overflow-x-auto">
        <span className="font-bold tracking-widest shrink-0">BREAKING</span>
        <span className="shrink-0">Sengun drops 34 on the Lakers — Rockets win 118-107</span>
        <span className="text-red-300 shrink-0">|</span>
        <span className="shrink-0">Mahomes TD run puts Chiefs up 21-17</span>
        <span className="text-red-300 shrink-0">|</span>
        <span className="shrink-0">MacKinnon goal — Avs lead 3-2 in 3rd</span>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-black text-white tracking-tight">
            UN<span className="text-red-500">DRAFTED</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {leagues.map((league) => (
            <Link
              key={league.id}
              href={`/league/${league.slug}`}
              className="px-3 py-1.5 text-sm font-semibold text-gray-300 hover:text-white hover:bg-gray-800 rounded transition-colors"
            >
              {league.name}
            </Link>
          ))}
          <Link
            href="/admin/live-control"
            className="ml-4 px-3 py-1.5 text-sm font-semibold text-yellow-400 hover:text-yellow-300 border border-yellow-600 hover:border-yellow-400 rounded transition-colors"
          >
            ⚡ Live Control
          </Link>
          <Link
            href="/admin/analytics"
            className="px-3 py-1.5 text-sm font-semibold text-blue-400 hover:text-blue-300 border border-blue-600 hover:border-blue-400 rounded transition-colors"
          >
            📊 Analytics
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/profile/rocketsfan88"
            className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm hover:bg-gray-600 transition-colors"
            title="Profile"
          >
            👤
          </Link>
        </div>
      </div>

      {/* Mobile league nav */}
      <div className="md:hidden flex overflow-x-auto gap-1 px-4 pb-2">
        {leagues.map((league) => (
          <Link
            key={league.id}
            href={`/league/${league.slug}`}
            className="shrink-0 px-3 py-1 text-xs font-semibold text-gray-300 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
          >
            {league.logo} {league.name}
          </Link>
        ))}
      </div>
    </header>
  );
}
