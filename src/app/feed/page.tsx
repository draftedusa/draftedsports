import FanPulse from "@/components/community/FanPulse";

export const metadata = {
  title: "Fan Pulse Feed — UNDRAFTED",
  description: "Join the conversation. React, debate, and connect with sports fans.",
};

export default function FeedPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-tighter text-surface-text mb-1">Fan Pulse</h1>
        <p className="text-sm text-surface-muted">Real fans. Real takes. No filter.</p>
      </div>
      <FanPulse />
    </div>
  );
}
