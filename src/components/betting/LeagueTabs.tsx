"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { label: "Home",    href: (slug: string) => `/league/${slug}` },
  { label: "Pulse",   href: (slug: string) => `/league/${slug}/pulse` },
  { label: "Odds", href: (slug: string) => `/league/${slug}/odds` },
] as const;

export default function LeagueTabs({
  slug,
  leagueName,
}: {
  slug: string;
  leagueName: string;
}) {
  const pathname = usePathname();

  return (
    <nav
      className="flex items-center gap-0 border-b border-surface-300 dark:border-white/5 -mx-4 px-4 mb-6 sm:-mx-6 sm:px-6 overflow-x-auto"
      aria-label={`${leagueName} navigation`}
    >
      {TABS.map((tab) => {
        const href = tab.href(slug);
        // "Home" tab is active only on the exact league route
        const isActive =
          tab.label === "Home"
            ? pathname === href
            : pathname.startsWith(href);

        return (
          <Link
            key={tab.label}
            href={href}
            className={`relative shrink-0 px-4 py-3 text-xs font-black uppercase tracking-widest transition-colors ${
              isActive
                ? "text-brand"
                : "text-surface-muted hover:text-surface-text"
            }`}
          >
            {tab.label}
            {tab.label === "Odds" && (
              <span className="ml-1.5 inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-brand/20 text-brand text-[8px] font-black leading-none">
                $
              </span>
            )}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand rounded-t-full" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
