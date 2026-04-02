import Link from "next/link";

const FEATURED_VIDEO = {
  id: "v1",
  title: "Alperen Şengün's 40-Point Masterclass: Every Basket",
  description: "The Houston Rockets center put on an all-time performance Tuesday night. Full highlights, breakdown, and postgame reaction.",
  duration: "12:48",
  views: "1.2M",
  league: "NBA",
  thumbnail: "🏀",
  channel: "UNDRAFTED Highlights",
  publishedAt: "2 hours ago",
};

const VIDEOS = [
  { id: "v2", title: "Patrick Mahomes Film Room: Super Bowl LVIX Drive", duration: "18:22", views: "3.4M", league: "NFL", thumbnail: "🏈", channel: "UNDRAFTED Film Room", publishedAt: "1 day ago" },
  { id: "v3", title: "David Pastrnak Hat Trick — Three Goals, Three Angles", duration: "6:14", views: "890K", league: "NHL", thumbnail: "🏒", channel: "UNDRAFTED Highlights", publishedAt: "2 days ago" },
  { id: "v4", title: "Yankees Rotation Deep Dive: Who Starts Game 1?", duration: "22:05", views: "540K", league: "MLB", thumbnail: "⚾", channel: "UNDRAFTED Analysis", publishedAt: "3 days ago" },
  { id: "v5", title: "Top 10 NBA Plays — Week 18", duration: "5:30", views: "2.1M", league: "NBA", thumbnail: "🏀", channel: "UNDRAFTED Highlights", publishedAt: "3 days ago" },
  { id: "v6", title: "NFL Draft Board: 5 Can't-Miss Prospects", duration: "28:47", views: "720K", league: "NFL", thumbnail: "🏈", channel: "UNDRAFTED Draft Central", publishedAt: "4 days ago" },
  { id: "v7", title: "NHL Playoff Picture: Who's In, Who's Out?", duration: "14:19", views: "430K", league: "NHL", thumbnail: "🏒", channel: "UNDRAFTED Analysis", publishedAt: "5 days ago" },
  { id: "v8", title: "Lakers vs Celtics: Full Game Breakdown", duration: "31:02", views: "1.8M", league: "NBA", thumbnail: "💜", channel: "UNDRAFTED Film Room", publishedAt: "5 days ago" },
];

const CATEGORIES = ["All", "NBA", "NFL", "MLB", "NHL", "Highlights", "Film Room", "Analysis", "Draft Central"];

export default function WatchPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-surface-300 pb-4">
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-surface-text">Watch</h1>
          <p className="text-sm text-surface-muted mt-0.5">Highlights, analysis, film room, and more</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-surface-muted">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse inline-block" />
          Live streams available
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {CATEGORIES.map((cat, i) => (
          <button
            key={cat}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors shrink-0 ${
              i === 0
                ? "bg-brand text-white"
                : "bg-surface-200 border border-surface-300 text-surface-muted hover:text-surface-text hover:border-brand/40"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured Video */}
      <div className="bg-surface-200 border border-surface-300 rounded-2xl overflow-hidden">
        <div className="aspect-video bg-surface-300 flex items-center justify-center relative">
          <span className="text-8xl">{FEATURED_VIDEO.thumbnail}</span>
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="w-16 h-16 rounded-full bg-brand/90 hover:bg-brand text-white flex items-center justify-center transition-colors shadow-lg">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 ml-1">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
          <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs font-bold px-2 py-0.5 rounded">
            {FEATURED_VIDEO.duration}
          </div>
          <div className="absolute top-3 left-3">
            <span className="bg-brand text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
              {FEATURED_VIDEO.league}
            </span>
          </div>
        </div>
        <div className="p-5">
          <h2 className="text-xl font-black tracking-tighter text-surface-text mb-2">{FEATURED_VIDEO.title}</h2>
          <p className="text-sm text-surface-muted leading-relaxed mb-3">{FEATURED_VIDEO.description}</p>
          <div className="flex items-center gap-3 text-xs text-surface-muted">
            <span className="font-semibold text-surface-text">{FEATURED_VIDEO.channel}</span>
            <span>·</span>
            <span>{FEATURED_VIDEO.views} views</span>
            <span>·</span>
            <span>{FEATURED_VIDEO.publishedAt}</span>
          </div>
        </div>
      </div>

      {/* Video Grid */}
      <div>
        <h2 className="text-sm font-black uppercase tracking-wider text-surface-muted mb-4">More Videos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {VIDEOS.map((video) => (
            <div
              key={video.id}
              className="bg-surface-200 border border-surface-300 rounded-xl overflow-hidden hover:border-brand/40 transition-colors cursor-pointer group"
            >
              <div className="aspect-video bg-surface-300 flex items-center justify-center relative">
                <span className="text-5xl">{video.thumbnail}</span>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 rounded-full bg-brand/90 text-white flex items-center justify-center shadow">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-0.5">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  {video.duration}
                </div>
                <div className="absolute top-2 left-2">
                  <span className="bg-brand/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                    {video.league}
                  </span>
                </div>
              </div>
              <div className="p-3">
                <h3 className="text-xs font-bold text-surface-text leading-snug mb-1.5 line-clamp-2">{video.title}</h3>
                <div className="flex items-center gap-1.5 text-[10px] text-surface-muted">
                  <span>{video.views} views</span>
                  <span>·</span>
                  <span>{video.publishedAt}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
