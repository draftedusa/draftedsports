"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { leagues } from "@/data/leagues";

const navLinks = [
  { href: "/scores",       label: "Scores",       icon: "📊" },
  { href: "/standings",    label: "Standings",     icon: "🏆" },
  { href: "/transactions", label: "Transactions",  icon: "🔄" },
  { href: "/search",       label: "Search",        icon: "🔍" },
];

export default function LeftRail() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-56 shrink-0 py-6 sticky top-16 self-start max-h-[calc(100vh-4rem)] overflow-y-auto no-scrollbar">
      {/* Main nav */}
      <nav className="space-y-0.5 mb-6">
        {navLinks.map(({ href, label, icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-brand/10 text-brand"
                  : "text-surface-muted hover:text-surface-text hover:bg-surface-200"
              }`}
            >
              <span className="text-base">{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* League nav */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-surface-muted px-3 mb-2">Leagues</p>
        <div className="space-y-0.5">
          {leagues.map((league) => {
            const href = `/league/${league.slug}`;
            const active = pathname === href;
            return (
              <Link
                key={league.id}
                href={href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors group ${
                  active
                    ? "bg-brand/10 text-brand"
                    : "text-surface-muted hover:text-surface-text hover:bg-surface-200"
                }`}
              >
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-base bg-surface-200 group-hover:ring-2 ring-brand transition-all ${
                    active ? "ring-2 ring-brand" : ""
                  }`}
                >
                  {league.logo}
                </span>
                {league.name}
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
