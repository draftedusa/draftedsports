# Sprint V4 — UNDRAFTED Platform Upgrade
**Session Start:** 2026-04-08
**Branch:** `claude/mock-sports-media-app-dqvDs`
**Goal:** Routing integrity, media-rich components, social engine, UI polish.

---

## Phase 1: Routing Integrity & Deep Architecture
**Status:** `in_progress`

### Tasks
- [x] 1.1 — Fix `/analysis` nav item: route to `/analysis` page (not search modal)
- [x] 1.2 — Fix `/premium` nav item: route to `/premium` conversion page (not Standings)
- [x] 1.3 — Create `src/app/analysis/page.tsx` — premium data-heavy UI
- [x] 1.4 — Create `src/app/premium/page.tsx` — conversion landing page
- [x] 1.5 — Add College, W-Sports, Soccer leagues to `src/data/leagues.ts`
- [x] 1.6 — Add sample teams for new leagues to `src/data/teams.ts`
- [x] 1.7 — Mega-menu: hover over league icon → dropdown with quick links + team grid
- [ ] 1.8 — Nested dynamic route: `/[league]/[team]/[player]` layout structure
- [x] 1.9 — Site Directory hamburger (full-screen slide-out)

### Key Decisions
- Analysis page: data-heavy tables, film room links, premium content grid
- Premium page: pricing cards, feature matrix, CTA to /auth/onboarding
- Mega-menu: CSS hover with JS fallback for touch, `position:absolute` dropdown
- New leagues use same League interface — just add to leagues.ts + teams.ts

---

## Phase 2: Component Overhauls & Media Integration
**Status:** `pending`

### Tasks
- [ ] 2.1 — Rebuild ticker: mini-cards with logos, score, clock (replace text spans)
- [ ] 2.2 — Thumbnail mandate: add emoji-based thumbnails to Hero, Side Rail, article lists
- [ ] 2.3 — `<WatchMiniWidget />` — inject into Home, League pages, Article rails
- [ ] 2.4 — `<FanPulseMiniWidget />` — inject into Home, League pages, Article rails
- [ ] 2.5 — Hamburger/Directory: slide-out full-screen site directory component

---

## Phase 3: Social Engine & Monetization
**Status:** `pending`

### Tasks
- [ ] 3.1 — Interactive GameCard hover: overlay + "Deep Dive" + "Watch Reactions" buttons
- [ ] 3.2 — FanPulse: multi-media compose UI (image/GIF/video scaffold)
- [ ] 3.3 — FanPulse: user avatars, @handles, interaction metrics on posts
- [ ] 3.4 — VideoCard: Comment, Share, Repost buttons
- [ ] 3.5 — `<NativeAdPlacement />` component — every 6th feed item + right rail

---

## Phase 4: UI Polish & Micro-Interactions
**Status:** `pending`

### Tasks
- [ ] 4.1 — Hover states: `hover:scale-[1.02]` + cubic-bezier on cards
- [ ] 4.2 — Carousel controls: `<` `>` arrows on Personalized Rail + Watch widgets
- [ ] 4.3 — Theme toggle: pill slide-switch (replace sun/moon icon)
- [ ] 4.4 — `<TutorialModal />` — fires 5s after first visit, highlights 3 features
- [ ] 4.5 — `<RecommendedForYou />` sidebar — simulated algo sorting by favorite teams

---

## Errors Log
| Error | Phase | Attempt | Resolution |
|-------|-------|---------|------------|
| — | — | — | — |

## Files Created This Sprint
- `src/app/analysis/page.tsx`
- `src/app/premium/page.tsx`
- `v4_sprint_plan.md`

## Files Modified This Sprint
- `src/components/layout/Header.tsx` — routing fix, mega-menu, site directory, ticker mini-cards
- `src/data/leagues.ts` — added MLS, WNBA, College
- `src/data/teams.ts` — added teams for MLS/WNBA/College
