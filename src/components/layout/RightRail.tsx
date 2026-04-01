import TrendingList from "@/components/sidebar/TrendingList";
import MyTeams from "@/components/sidebar/MyTeams";

export default function RightRail() {
  return (
    <aside className="hidden xl:flex flex-col w-72 shrink-0 py-6 sticky top-[120px] self-start h-[calc(100vh-120px)] overflow-y-auto no-scrollbar gap-8">
      <TrendingList />
      <MyTeams />
    </aside>
  );
}
