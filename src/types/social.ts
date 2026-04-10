// ═══════════════════════════════════════════════════════
// UNDRAFTED — Social Graph Types
// ═══════════════════════════════════════════════════════

export interface Profile {
  id: string;
  handle: string;
  displayName: string;
  avatar: string;
  banner?: string;
  bio: string;
  followersCount: number;
  followingCount: number;
  favoriteTeamIds: string[];
  joinedAt: string;
  isVerified?: boolean;
}

export type PostMediaType = "IMAGE" | "VIDEO" | "GIF";

export interface PostMedia {
  id: string;
  url: string;
  type: PostMediaType;
  /** e.g. "16:9", "1:1", "4:5" */
  aspectRatio: string;
  /** Alt text for accessibility */
  alt?: string;
}

export interface SocialPost {
  id: string;
  authorId: string;
  body: string;
  createdAt: string;

  /** Self-referencing IDs for reply/quote/repost chain */
  replyToId?: string;
  quoteId?: string;
  repostId?: string;

  /** Contextual tagging */
  leagueTag?: string;
  teamId?: string;
  gameId?: string;

  /** Attached media */
  media?: PostMedia[];

  /** Engagement metrics */
  likesCount: number;
  repliesCount: number;
  repostsCount: number;
  quotesCount: number;
  viewsCount: number;
}

export type NotificationType =
  | "follow"
  | "like"
  | "reply"
  | "repost"
  | "quote"
  | "mention"
  | "game_live"
  | "game_score"
  | "game_end";

export interface Notification {
  id: string;
  recipientId: string;
  type: NotificationType;
  actorId?: string;
  postId?: string;
  gameId?: string;
  body: string;
  createdAt: string;
  viewed: boolean;
}
