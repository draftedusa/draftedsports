import FanPulse from "@/components/community/FanPulse";
import { FanPulseSidebar } from "@/components/fan-pulse/FanPulseSidebar";

export const metadata = {
  title: "Fan Pulse — UNDRAFTED",
  description: "Join the conversation. React, debate, and connect with sports fans.",
};

export default function FeedPage() {
  return (
    <div className="flex justify-center min-h-screen bg-white dark:bg-black">
      {/* Center feed — 600px, bordered */}
      <main className="w-full max-w-[600px] border-x border-[#2f3336] min-h-screen">
        <FanPulse />
      </main>

      {/* Right sidebar — 350px, hidden below xl */}
      <aside className="w-[350px] pl-8 hidden xl:block pt-2">
        <FanPulseSidebar />
      </aside>
    </div>
  );
}
