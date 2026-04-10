// ═══════════════════════════════════════════════════════
// UNDRAFTED — Drizzle ORM Schema (PostgreSQL / Supabase)
//
// Install: npm install drizzle-orm postgres
//          npm install -D drizzle-kit
//
// Config:  drizzle.config.ts at project root
// ═══════════════════════════════════════════════════════

import {
  pgTable,
  text,
  integer,
  smallint,
  boolean,
  real,
  numeric,
  timestamp,
  jsonb,
  uuid,
  pgEnum,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─────────────────────────────────────────────────────
// ENUMS
// ─────────────────────────────────────────────────────

export const gameStatusEnum = pgEnum("game_status", [
  "upcoming",
  "live",
  "final",
  "postponed",
  "cancelled",
]);

export const playerStatusEnum = pgEnum("player_status", [
  "active",
  "injured",
  "suspended",
  "practice_squad",
  "waived",
]);

export const injuryStatusEnum = pgEnum("injury_status", [
  "Out",
  "Doubtful",
  "Questionable",
  "Probable",
  "Day-to-Day",
  "IR",
  "PUP",
]);

export const transactionTypeEnum = pgEnum("transaction_type", [
  "signing",
  "trade",
  "release",
  "waiver_claim",
  "extension",
  "restructure",
  "cut",
  "practice_squad",
  "ir_designation",
  "draft_pick",
  "retirement",
  "suspension",
]);

export const mediaTypeEnum = pgEnum("media_type", ["IMAGE", "VIDEO", "GIF"]);

export const notificationTypeEnum = pgEnum("notification_type", [
  "follow",
  "like",
  "reply",
  "repost",
  "quote",
  "mention",
  "game_live",
  "game_score",
  "game_end",
]);

export const standingsLabelEnum = pgEnum("standings_label", [
  "Standings",
  "Rankings",
  "Tables",
]);

export const newsCategoryEnum = pgEnum("news_category", [
  "breaking",
  "trade_rumor",
  "injury",
  "game_recap",
  "analysis",
  "ranking",
  "contract",
  "draft",
  "general",
]);

export const draftStatusEnum = pgEnum("draft_status", [
  "upcoming",
  "live",
  "complete",
]);

// ─────────────────────────────────────────────────────
// LEAGUE TAXONOMY
// ─────────────────────────────────────────────────────

export const leagues = pgTable("leagues", {
  id: text("id").primaryKey(),                        // "nfl", "nba", etc.
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  sport: text("sport").notNull(),
  logo: text("logo"),
  standingsLabel: standingsLabelEnum("standings_label").default("Standings"),
  region: text("region"),                             // "US" | "Europe" | "Global"
  hasConferences: boolean("has_conferences").default(false),
  hasDivisions: boolean("has_divisions").default(false),
  isActive: boolean("is_active").default(true),
  sortOrder: smallint("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const conferences = pgTable(
  "conferences",
  {
    id: text("id").primaryKey(),                      // "conf-nfl-afc"
    leagueId: text("league_id")
      .notNull()
      .references(() => leagues.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    shortName: text("short_name").notNull(),
  },
  (t) => [index("conf_league_idx").on(t.leagueId)]
);

export const divisions = pgTable(
  "divisions",
  {
    id: text("id").primaryKey(),                      // "div-nfl-afc-north"
    conferenceId: text("conference_id")
      .notNull()
      .references(() => conferences.id, { onDelete: "cascade" }),
    leagueId: text("league_id")
      .notNull()
      .references(() => leagues.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    shortName: text("short_name").notNull(),
  },
  (t) => [index("div_league_idx").on(t.leagueId)]
);

export const teams = pgTable(
  "teams",
  {
    id: text("id").primaryKey(),                      // "nfl-chiefs"
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    leagueId: text("league_id")
      .notNull()
      .references(() => leagues.id, { onDelete: "cascade" }),
    conferenceId: text("conference_id").references(() => conferences.id),
    divisionId: text("division_id").references(() => divisions.id),
    logo: text("logo"),
    primaryColor: text("primary_color"),
    secondaryColor: text("secondary_color"),
    city: text("city"),
    venue: text("venue"),
    /** W-L, W-L-T, W-D-L */
    record: text("record"),
    standing: smallint("standing"),
    abbreviation: text("abbreviation"),
    /** External IDs for scraper cross-reference */
    espnId: text("espn_id"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [
    uniqueIndex("team_slug_league_idx").on(t.slug, t.leagueId),
    index("team_league_idx").on(t.leagueId),
    index("team_division_idx").on(t.divisionId),
  ]
);

// ─────────────────────────────────────────────────────
// PLAYERS & ROSTERS
// ─────────────────────────────────────────────────────

export const players = pgTable(
  "players",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    externalId: text("external_id"),                  // Scraper cross-ref ID
    teamId: text("team_id").references(() => teams.id),
    leagueId: text("league_id")
      .notNull()
      .references(() => leagues.id),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    number: smallint("number"),
    position: text("position"),
    positionGroup: text("position_group"),
    age: smallint("age"),
    height: text("height"),
    weight: smallint("weight"),
    college: text("college"),
    birthdate: text("birthdate"),
    birthCity: text("birth_city"),
    nationality: text("nationality"),
    avatar: text("avatar"),
    status: playerStatusEnum("status").default("active"),
    yearsExp: smallint("years_exp").default(0),
    draftYear: smallint("draft_year"),
    draftRound: smallint("draft_round"),
    draftPick: smallint("draft_pick"),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [
    index("player_team_idx").on(t.teamId),
    index("player_league_idx").on(t.leagueId),
    index("player_name_idx").on(t.lastName, t.firstName),
  ]
);

/** Season stats snapshot — JSONB for flexibility across sports */
export const playerStats = pgTable(
  "player_stats",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    playerId: uuid("player_id")
      .notNull()
      .references(() => players.id, { onDelete: "cascade" }),
    teamId: text("team_id").references(() => teams.id),
    leagueId: text("league_id").notNull(),
    season: text("season").notNull(),                 // "2025-26"
    /** "regular", "playoffs", "preseason" */
    seasonType: text("season_type").default("regular"),
    /** "passing", "rushing", "batting", "pitching", etc. */
    statType: text("stat_type").notNull(),
    stats: jsonb("stats").notNull(),                  // Typed in application layer
    gamesPlayed: smallint("games_played").default(0),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [
    index("pstats_player_idx").on(t.playerId),
    index("pstats_league_season_idx").on(t.leagueId, t.season),
  ]
);

// ─────────────────────────────────────────────────────
// GAMES & SCHEDULE
// ─────────────────────────────────────────────────────

export const games = pgTable(
  "games",
  {
    id: text("id").primaryKey(),
    leagueId: text("league_id")
      .notNull()
      .references(() => leagues.id),
    homeTeamId: text("home_team_id")
      .notNull()
      .references(() => teams.id),
    awayTeamId: text("away_team_id")
      .notNull()
      .references(() => teams.id),
    status: gameStatusEnum("status").default("upcoming"),
    homeScore: smallint("home_score").default(0),
    awayScore: smallint("away_score").default(0),
    /** "Q4", "3rd Period", "Top 7th", etc. */
    period: text("period"),
    clock: text("clock"),
    /** ISO 8601 */
    startTime: timestamp("start_time").notNull(),
    timezone: text("timezone").default("ET"),
    network: text("network"),
    venue: text("venue"),
    city: text("city"),
    isNeutralSite: boolean("is_neutral_site").default(false),
    /** NFL week, MLB game number */
    weekOrGame: smallint("week_or_game"),
    seriesInfo: text("series_info"),
    /** Betting line at open */
    spread: text("spread"),
    overUnder: real("over_under"),
    externalId: text("external_id"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [
    index("game_league_idx").on(t.leagueId),
    index("game_start_idx").on(t.startTime),
    index("game_home_idx").on(t.homeTeamId),
    index("game_away_idx").on(t.awayTeamId),
  ]
);

export const gameEvents = pgTable(
  "game_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    gameId: text("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "cascade" }),
    sequence: integer("sequence").notNull(),
    /** Wall-clock timestamp of the event */
    occurredAt: timestamp("occurred_at"),
    clock: text("clock"),
    period: text("period"),
    type: text("type").notNull(),
    teamId: text("team_id"),
    playerId: uuid("player_id"),
    description: text("description").notNull(),
    homeScore: smallint("home_score"),
    awayScore: smallint("away_score"),
    fieldPosition: text("field_position"),
    isHighlight: boolean("is_highlight").default(false),
    videoUrl: text("video_url"),
  },
  (t) => [index("gevents_game_idx").on(t.gameId)]
);

// ─────────────────────────────────────────────────────
// INJURIES & TRANSACTIONS
// ─────────────────────────────────────────────────────

export const injuries = pgTable(
  "injuries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    playerId: uuid("player_id")
      .notNull()
      .references(() => players.id, { onDelete: "cascade" }),
    teamId: text("team_id").references(() => teams.id),
    injuryType: text("injury_type").notNull(),
    status: injuryStatusEnum("status").notNull(),
    practice: text("practice"),
    returnEstimate: text("return_estimate"),
    notes: text("notes"),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [index("injury_team_idx").on(t.teamId)]
);

export const contracts = pgTable(
  "contracts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    playerId: uuid("player_id")
      .notNull()
      .references(() => players.id, { onDelete: "cascade" }),
    teamId: text("team_id")
      .notNull()
      .references(() => teams.id),
    leagueId: text("league_id").notNull(),
    years: smallint("years").notNull(),
    totalValue: integer("total_value").notNull(),      // in thousands USD
    avgPerYear: integer("avg_per_year").notNull(),
    guaranteed: integer("guaranteed").notNull(),
    signingBonus: integer("signing_bonus"),
    signedDate: text("signed_date"),
    expiryYear: smallint("expiry_year"),
    noTradeClause: boolean("no_trade_clause").default(false),
    yearlyBreakdown: jsonb("yearly_breakdown"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [index("contract_player_idx").on(t.playerId)]
);

export const transactions = pgTable(
  "transactions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    type: transactionTypeEnum("type").notNull(),
    leagueId: text("league_id").notNull(),
    playerId: uuid("player_id").references(() => players.id),
    playerName: text("player_name").notNull(),
    playerPosition: text("player_position"),
    fromTeamId: text("from_team_id").references(() => teams.id),
    toTeamId: text("to_team_id").references(() => teams.id),
    date: timestamp("date").notNull(),
    details: text("details"),
    contractId: uuid("contract_id").references(() => contracts.id),
    assets: jsonb("assets"),                          // string[]
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [
    index("txn_league_idx").on(t.leagueId),
    index("txn_date_idx").on(t.date),
  ]
);

// ─────────────────────────────────────────────────────
// CONTENT (Articles / News)
// ─────────────────────────────────────────────────────

export const articles = pgTable(
  "articles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    byline: text("byline"),
    excerpt: text("excerpt"),
    body: text("body"),
    coverImageUrl: text("cover_image_url"),
    coverEmoji: text("cover_emoji"),
    category: newsCategoryEnum("category").default("general"),
    leagueId: text("league_id").references(() => leagues.id),
    teamIds: jsonb("team_ids").default([]),            // string[]
    playerIds: jsonb("player_ids").default([]),        // uuid[]
    gameId: text("game_id").references(() => games.id),
    tags: jsonb("tags").default([]),
    relatedArticleIds: jsonb("related_article_ids").default([]),
    isTrending: boolean("is_trending").default(false),
    isBreaking: boolean("is_breaking").default(false),
    isPublished: boolean("is_published").default(false),
    views: integer("views").default(0),
    readTimeMinutes: smallint("read_time_minutes"),
    publishedAt: timestamp("published_at"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [
    index("article_league_idx").on(t.leagueId),
    index("article_published_idx").on(t.publishedAt),
  ]
);

// ─────────────────────────────────────────────────────
// SOCIAL GRAPH
// ─────────────────────────────────────────────────────

export const profiles = pgTable(
  "profiles",
  {
    id: text("id").primaryKey(),                      // Matches Supabase auth.users.id
    handle: text("handle").notNull().unique(),
    displayName: text("display_name").notNull(),
    bio: text("bio"),
    avatar: text("avatar"),
    banner: text("banner"),
    followersCount: integer("followers_count").default(0),
    followingCount: integer("following_count").default(0),
    favoriteTeamIds: jsonb("favorite_team_ids").default([]),
    isVerified: boolean("is_verified").default(false),
    isPremium: boolean("is_premium").default(false),
    notifPrefs: jsonb("notif_prefs").default({}),
    joinedAt: timestamp("joined_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [uniqueIndex("profile_handle_idx").on(t.handle)]
);

export const follows = pgTable(
  "follows",
  {
    followerId: text("follower_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    followingId: text("following_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [
    index("follows_follower_idx").on(t.followerId),
    index("follows_following_idx").on(t.followingId),
  ]
);

export const posts = pgTable(
  "posts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    authorId: text("author_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    body: text("body").notNull().default(""),
    /** Self-referencing: reply thread */
    replyToId: uuid("reply_to_id"),
    /** Self-referencing: quote post */
    quoteId: uuid("quote_id"),
    /** Self-referencing: repost */
    repostId: uuid("repost_id"),
    leagueTag: text("league_tag").references(() => leagues.id),
    teamId: text("team_id").references(() => teams.id),
    gameId: text("game_id").references(() => games.id),
    likesCount: integer("likes_count").default(0),
    repliesCount: integer("replies_count").default(0),
    repostsCount: integer("reposts_count").default(0),
    quotesCount: integer("quotes_count").default(0),
    viewsCount: integer("views_count").default(0),
    isDeleted: boolean("is_deleted").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [
    index("post_author_idx").on(t.authorId),
    index("post_reply_idx").on(t.replyToId),
    index("post_league_idx").on(t.leagueTag),
    index("post_created_idx").on(t.createdAt),
  ]
);

export const postMedia = pgTable(
  "post_media",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    type: mediaTypeEnum("type").notNull(),
    aspectRatio: text("aspect_ratio").default("16:9"),
    alt: text("alt"),
    sortOrder: smallint("sort_order").default(0),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [index("media_post_idx").on(t.postId)]
);

export const postLikes = pgTable(
  "post_likes",
  {
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    profileId: text("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [
    uniqueIndex("like_unique_idx").on(t.postId, t.profileId),
    index("like_profile_idx").on(t.profileId),
  ]
);

export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    recipientId: text("recipient_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    type: notificationTypeEnum("type").notNull(),
    actorId: text("actor_id").references(() => profiles.id),
    postId: uuid("post_id").references(() => posts.id),
    gameId: text("game_id").references(() => games.id),
    body: text("body").notNull(),
    viewed: boolean("viewed").default(false),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [
    index("notif_recipient_idx").on(t.recipientId),
    index("notif_viewed_idx").on(t.recipientId, t.viewed),
  ]
);

// ─────────────────────────────────────────────────────
// RELATIONS (Drizzle query API)
// ─────────────────────────────────────────────────────

export const leaguesRelations = relations(leagues, ({ many }) => ({
  conferences: many(conferences),
  divisions: many(divisions),
  teams: many(teams),
  games: many(games),
}));

export const conferencesRelations = relations(conferences, ({ one, many }) => ({
  league: one(leagues, { fields: [conferences.leagueId], references: [leagues.id] }),
  divisions: many(divisions),
}));

export const divisionsRelations = relations(divisions, ({ one, many }) => ({
  league: one(leagues, { fields: [divisions.leagueId], references: [leagues.id] }),
  conference: one(conferences, { fields: [divisions.conferenceId], references: [conferences.id] }),
  teams: many(teams),
}));

export const teamsRelations = relations(teams, ({ one, many }) => ({
  league: one(leagues, { fields: [teams.leagueId], references: [leagues.id] }),
  conference: one(conferences, { fields: [teams.conferenceId], references: [conferences.id] }),
  division: one(divisions, { fields: [teams.divisionId], references: [divisions.id] }),
  players: many(players),
  homeGames: many(games, { relationName: "homeTeam" }),
  awayGames: many(games, { relationName: "awayTeam" }),
}));

export const playersRelations = relations(players, ({ one, many }) => ({
  team: one(teams, { fields: [players.teamId], references: [teams.id] }),
  stats: many(playerStats),
  contract: many(contracts),
  injuries: many(injuries),
}));

export const gamesRelations = relations(games, ({ one, many }) => ({
  league: one(leagues, { fields: [games.leagueId], references: [leagues.id] }),
  homeTeam: one(teams, { fields: [games.homeTeamId], references: [teams.id], relationName: "homeTeam" }),
  awayTeam: one(teams, { fields: [games.awayTeamId], references: [teams.id], relationName: "awayTeam" }),
  events: many(gameEvents),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(profiles, { fields: [posts.authorId], references: [profiles.id] }),
  replyTo: one(posts, { fields: [posts.replyToId], references: [posts.id], relationName: "replies" }),
  replies: many(posts, { relationName: "replies" }),
  quote: one(posts, { fields: [posts.quoteId], references: [posts.id], relationName: "quotes" }),
  repost: one(posts, { fields: [posts.repostId], references: [posts.id], relationName: "reposts" }),
  media: many(postMedia),
  likes: many(postLikes),
}));

export const profilesRelations = relations(profiles, ({ many }) => ({
  posts: many(posts),
  sentNotifications: many(notifications, { relationName: "actor" }),
  receivedNotifications: many(notifications, { relationName: "recipient" }),
  following: many(follows, { relationName: "follower" }),
  followers: many(follows, { relationName: "following" }),
}));

// ─────────────────────────────────────────────────────
// TYPE EXPORTS (inferred from schema)
// ─────────────────────────────────────────────────────

export type League = typeof leagues.$inferSelect;
export type NewLeague = typeof leagues.$inferInsert;
export type Conference = typeof conferences.$inferSelect;
export type Division = typeof divisions.$inferSelect;
export type Team = typeof teams.$inferSelect;
export type NewTeam = typeof teams.$inferInsert;
export type Player = typeof players.$inferSelect;
export type NewPlayer = typeof players.$inferInsert;
export type PlayerStat = typeof playerStats.$inferSelect;
export type Game = typeof games.$inferSelect;
export type NewGame = typeof games.$inferInsert;
export type GameEvent = typeof gameEvents.$inferSelect;
export type Article = typeof articles.$inferSelect;
export type Profile = typeof profiles.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type PostMedia = typeof postMedia.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type Contract = typeof contracts.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type Injury = typeof injuries.$inferSelect;
