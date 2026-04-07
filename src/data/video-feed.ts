export interface VideoItem {
  id: string;
  title: string;
  creator: string;
  franchise: string;
  league: "NBA" | "NFL" | "MLB" | "NHL" | "ALL";
  /** Duration in seconds */
  duration: number;
  views: number;
  likes: number;
  publishedAt: string;
  /**
   * Real video URL (HLS/mp4). Using royalty-free Big Buck Bunny clips
   * as stand-ins. In production, replace with signed CDN URLs.
   */
  videoUrl: string;
  /** Emoji or placeholder shown while video loads */
  thumbnailEmoji: string;
  description: string;
  tags: string[];
}

export const videoFeed: VideoItem[] = [
  {
    id: "vid-001",
    title: "Sengun's 40-Point Masterclass: Every Touch Broken Down",
    creator: "Marcus Webb",
    franchise: "Film Room",
    league: "NBA",
    duration: 142,
    views: 1_240_000,
    likes: 84_200,
    publishedAt: "2026-04-01",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    thumbnailEmoji: "🏀",
    description: "Alperen Sengun carved up the Lakers defense with footwork that belongs in a museum. Let's go play-by-play.",
    tags: ["nba", "rockets", "film-room"],
  },
  {
    id: "vid-002",
    title: "Mahomes Film Room: The Drive That Won Super Bowl LIX",
    creator: "Marcus Webb",
    franchise: "Film Room",
    league: "NFL",
    duration: 318,
    views: 3_400_000,
    likes: 210_500,
    publishedAt: "2026-03-30",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    thumbnailEmoji: "🏈",
    description: "Four minutes left. Down by 4. This is how Patrick Mahomes operates under maximum pressure.",
    tags: ["nfl", "chiefs", "film-room"],
  },
  {
    id: "vid-003",
    title: "NHL Top 10: Pastrnak's Hat Trick Leads the Week",
    creator: "UNDRAFTED Studio",
    franchise: "Top 10",
    league: "NHL",
    duration: 95,
    views: 890_000,
    likes: 45_600,
    publishedAt: "2026-03-29",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumbnailEmoji: "🏒",
    description: "David Pastrnak does it again. Three goals, three completely different situations. Absolute art.",
    tags: ["nhl", "bruins"],
  },
  {
    id: "vid-004",
    title: "NBA Big Board: Priya's Top 5 Draft Prospects Right Now",
    creator: "Priya Nair",
    franchise: "Big Board",
    league: "NBA",
    duration: 228,
    views: 720_000,
    likes: 38_900,
    publishedAt: "2026-03-28",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    thumbnailEmoji: "📋",
    description: "With the lottery approaching, Priya ranks who she'd take first — and the answer might surprise you.",
    tags: ["nba", "draft", "big-board"],
  },
  {
    id: "vid-005",
    title: "Dodgers Rotation Deep Dive: Who Starts Game 1?",
    creator: "Dana Howell",
    franchise: "Dynasty Watch",
    league: "MLB",
    duration: 275,
    views: 540_000,
    likes: 22_100,
    publishedAt: "2026-03-27",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    thumbnailEmoji: "⚾",
    description: "The Dodgers have options — too many options. Dana breaks down who gets the nod and why it matters.",
    tags: ["mlb", "dodgers", "dynasty-watch"],
  },
  {
    id: "vid-006",
    title: "Thunder vs Nuggets: OKC's New Identity Explained",
    creator: "Jamal Carter",
    franchise: "Inside Track",
    league: "NBA",
    duration: 190,
    views: 1_100_000,
    likes: 67_400,
    publishedAt: "2026-03-26",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    thumbnailEmoji: "⚡",
    description: "The Thunder are no longer a rebuild. They're a title contender. Jamal breaks down how it happened.",
    tags: ["nba", "thunder", "inside-track"],
  },
  {
    id: "vid-007",
    title: "NFL Draft: 5 Prospects That Will Shock Everyone",
    creator: "Priya Nair",
    franchise: "Big Board",
    league: "NFL",
    duration: 312,
    views: 2_800_000,
    likes: 156_000,
    publishedAt: "2026-03-25",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    thumbnailEmoji: "🏈",
    description: "Everyone's talking about the top 10. Priya's watching picks 15-35 — and that's where the value is.",
    tags: ["nfl", "draft", "big-board"],
  },
  {
    id: "vid-008",
    title: "Celtics vs Heat: Boston's Path to the Finals",
    creator: "Sarah Chen",
    franchise: "Power Rankings",
    league: "NBA",
    duration: 185,
    views: 1_600_000,
    likes: 94_300,
    publishedAt: "2026-03-24",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
    thumbnailEmoji: "☘️",
    description: "Sarah ranks the East contenders. Spoiler: the Celtics aren't where you think they are.",
    tags: ["nba", "celtics", "power-rankings"],
  },
];

export function formatViews(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}
