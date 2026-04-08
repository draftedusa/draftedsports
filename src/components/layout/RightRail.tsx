"use client";

import { usePathname } from "next/navigation";
import TrendingList from "@/components/sidebar/TrendingList";
import MyTeams from "@/components/sidebar/MyTeams";
import LeagueStandingsSidebar from "@/components/sidebar/LeagueStandingsSidebar";
import LeagueScheduleSidebar from "@/components/sidebar/LeagueScheduleSidebar";
import WatchMiniWidget from "@/components/video/WatchMiniWidget";
import FanPulseMiniWidget from "@/components/community/FanPulseMiniWidget";

export default function RightRail() {
  const pathname = usePathname();
  const leagueMatch = pathname.match(/^\/league\/([^/]+)/);
  const leagueSlug = leagueMatch ? leagueMatch[1] : null;

  return (
    <aside className="hidden xl:flex flex-col w-72 shrink-0 py-6 sticky top-[120px] self-start h-[calc(100vh-120px)] overflow-y-auto no-scrollbar gap-8">
      {leagueSlug ? (
        <>
          <LeagueStandingsSidebar leagueSlug={leagueSlug} />
          <LeagueScheduleSidebar leagueSlug={leagueSlug} />
          <WatchMiniWidget limit={3} />
          <FanPulseMiniWidget limit={2} />
        </>
      ) : (
        <>
          <TrendingList />
          <MyTeams />
          <WatchMiniWidget limit={3} />
          <FanPulseMiniWidget limit={2} />
        </>
      )}
    </aside>
  );
}
