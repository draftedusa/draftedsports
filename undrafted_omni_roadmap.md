# UNDRAFTED — Omni-Platform Build Roadmap
**Initiated:** 2026-04-10
**Branch:** `claude/mock-sports-media-app-dqvDs`
**Stack:** Next.js 16.2.2, React 19, Tailwind v4, TypeScript, TanStack Query
**Goal:** Transform UNDRAFTED from a 7-league mock prototype into a fully-structured omni-platform with massive league taxonomy, scraping pipeline, social graph, editorial staging, and monetization.

---

## Phase 1: Data Pipeline, Scraping, & Schema (The Brain)
**Status:** `in_progress`

### 1A — Web Scraping & Ingestion Engine
- [ ] 1A.1 — Create `src/lib/scraper/` directory with base scraper utilities (Cheerio-based HTML parser, rate-limiter, retry logic)
- [ ] 1A.2 — `src/lib/scraper/scores.ts` — Live scores & play-by-play scraper (mock-ready, real-URL scaffold)
- [ ] 1A.3 — `src/lib/scraper/stats.ts` — Player/Team analytics & league leaders
- [ ] 1A.4 — `src/lib/scraper/salaries.ts` — Cap space, contracts, transaction history
- [ ] 1A.5 — `src/lib/scraper/news.ts` — Aggregated breaking news & rumors
- [ ] 1A.6 — API routes: `api/scraper/scores`, `api/scraper/stats`, `api/scraper/news` with ISR + cron headers
- [ ] 1A.7 — Unified `src/lib/scraper/index.ts` barrel export + types

### 1B — Massive League Expansion & Taxonomy
- [ ] 1B.1 — Expand `src/types/index.ts` with Conference, Division, Roster interfaces + league hierarchy
- [ ] 1B.2 — NCAA: 13 sports, Men's/Women's designations, Top 25 Rankings (not Standings), FBS/FCS/HBCU tiers
- [ ] 1B.3 — NFL: 32 teams across 8 divisions (AFC/NFC × North/South/East/West)
- [ ] 1B.4 — NBA: 30 teams across 6 divisions (Atlantic/Central/Southeast/Northwest/Pacific/Southwest)
- [ ] 1B.5 — WNBA: expand to 13 teams (current 3 → all active franchises)
- [ ] 1B.6 — MLB: 30 teams across 6 divisions (AL/NL × East/Central/West)
- [ ] 1B.7 — NHL: 32 teams across 4 divisions (Atlantic/Metropolitan/Central/Pacific)
- [ ] 1B.8 — Soccer/Futbol: Premier League, Champions League, La Liga, Bundesliga, MLS, NWSL, Liga MX, Serie A, Ligue 1, Saudi Pro League (top 5 teams each). Use "Tables" not Standings
- [ ] 1B.9 — `src/data/conferences.ts` + `src/data/divisions.ts` — relational hierarchy
- [ ] 1B.10 — Update `generateStaticParams` across all league/team pages

### 1C — Social Graph Schema
- [ ] 1C.1 — `src/types/social.ts` — Profile, Post (with reply_to_id, quote_id, repost_id), PostMedia, Notification interfaces
- [ ] 1C.2 — `src/data/profiles.ts` — Mock @handle profiles with avatars, bios, banners
- [ ] 1C.3 — `src/data/social-posts.ts` — Mock posts with league_tag, team_id, game_id, media attachments
- [ ] 1C.4 — `src/data/notifications.ts` — Mock notification feed with viewed boolean

### Key Decisions
| Decision | Rationale |
|----------|-----------|
| Cheerio over Playwright | Lighter, no browser needed, sufficient for RSS/HTML parsing |
| Mock data first, scraper scaffold ready | Never break UI; scrapers activate when env vars set |
| "Tables" for soccer, "Rankings" for NCAA | Match real-world terminology per sport |
| Self-referencing post IDs | Enables replies, quotes, reposts without separate tables |

---

## Phase 2: Global Navigation & Interception (The Gateway)
**Status:** `pending`

### Tasks
- [ ] 2.1 — Header consolidation: Logo → Leagues Nav → Utility Bar (Watch, Fan Pulse, Premium, Search, Bell, Gear, Toggle, Auth)
- [ ] 2.2 — Mega-Menu: multi-column dropdown with deep-nested teams + sub-pages (Home, News, Scores, Schedule, Standings/Rankings/Tables, Stats, Teams, Players). Caret v↔^ animation
- [ ] 2.3 — Mobile nav: hamburger → X morph, half-screen animated directory
- [ ] 2.4 — TakeoverProvider (Zustand/Context): ONBOARDING | PREMIUM | NONE states
- [ ] 2.5 — Flow A (Preference Scout): Auth → Team Selector grid → Notification prefs
- [ ] 2.6 — Flow B (Premium Access): Hero + value prop → Tier selection → Checkout scaffold

---

## Phase 3: Editorial Staging & Live Ticker (The Magazine)
**Status:** `pending`

### Tasks
- [ ] 3.1 — Live Ticker power-up: enlarged game cards with logo, score, time, record, network; hover overlay (Game Cast / Boxscore + Watch Live)
- [ ] 3.2 — Layout_Alpha: 3-col asymmetric (2 stacked teasers | Hero | Headline Rail)
- [ ] 3.3 — Layout_Beta: 2-col split (Large Feature | 2×2 grid)
- [ ] 3.4 — Layout_Gamma: 3-panel (Scores/Odds | Main Video/Story | Fan Pulse)
- [ ] 3.5 — ContentCard variant system with @container queries (hero, teaser, rail, video)
- [ ] 3.6 — Editorial badges on homepage; image covers inside league tabs

---

## Phase 4: Fan Pulse Social Ecosystem (The Engine)
**Status:** `pending`

### Tasks
- [ ] 4.1 — UnifiedPostCard: conditional repost banner, quote mini-card, media grid
- [ ] 4.2 — Optimistic UI for like/repost with rollback
- [ ] 4.3 — Engagement overlay on hero editorial cards (live Like/Comment counts)
- [ ] 4.4 — Post Composer: text (char count), image preview (URL.createObjectURL), upload scaffold
- [ ] 4.5 — DynamicFeed: league-filtered infinite scroll with < > navigation
- [ ] 4.6 — User profile tabs: Posts | Replies | Media

---

## Phase 5: Monetization & Polish
**Status:** `pending`

### Tasks
- [ ] 5.1 — NativeAdPlacement redesign: highly visual mock ads with modern graphics
- [ ] 5.2 — Responsive reflow: 3-col desktop → 2-col tablet → 1-col mobile
- [ ] 5.3 — Touch targets: all interactive elements ≥ 44px on mobile
- [ ] 5.4 — Final build verification + push

---

## Errors Log
| Error | Phase | Attempt | Resolution |
|-------|-------|---------|------------|

## Files Created This Sprint
*(updated as we go)*
