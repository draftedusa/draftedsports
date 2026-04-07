import VideoFeed from "@/components/video/VideoFeed";

export const metadata = {
  title: "Watch — UNDRAFTED",
  description: "Highlights, film rooms, analysis clips, and creator content. Auto-plays as you scroll.",
};

export default function WatchPage() {
  return (
    <div className="py-6">
      <div className="max-w-sm mx-auto px-4 mb-6 text-center">
        <h1 className="text-2xl font-black tracking-tighter text-surface-text mb-1">Watch</h1>
        <p className="text-xs text-surface-muted">Scroll to play. Tap to pause.</p>
      </div>
      <VideoFeed />
    </div>
  );
}
