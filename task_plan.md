# UNDRAFTED — System-Driven Platform Upgrade
**Goal:** Upgrade from static Next.js/Tailwind v4 prototype to system-driven, production-ready application across 5 phases.
**Branch:** `claude/mock-sports-media-app-dqvDs`
**Stack:** Next.js 16.2.2, Tailwind v4, NextAuth v5 beta, TypeScript

---

## Phase 1: Project Memory & Initialization
**Status:** `complete`
- [x] planning-with-files skill initialized
- [x] task_plan.md, findings.md, progress.md created
- [x] Phases 2–5 mapped

---

## Phase 2: The Live Data Bridge (Native Fetch & Cron)
**Status:** `complete`
**Goal:** Replace hardcoded mock data with automated sports data pipelines.

### Tasks:
- [ ] 2a — Create `app/api/transactions/route.ts` — server-side API route
- [ ] 2b — Write Node.js fetch utility for ESPN RSS / public sports JSON feeds
- [ ] 2c — Map fetched data → existing `Transaction` TypeScript interfaces
- [ ] 2d — Update `/scores` and Trending components to consume new API with ISR `revalidate`
- [ ] 2e — Add skeleton loading states for async components

### Key Constraints:
- Must match existing `Transaction` interface in `src/types/index.ts`
- Use Next.js `export const revalidate = 60` pattern for ISR
- ESPN RSS: `https://www.espn.com/espn/rss/nfl/news` (public, no auth)
- Fallback to mock data if fetch fails (never break the UI)

### Files to Touch:
- `src/app/api/transactions/route.ts` (create)
- `src/app/api/scores/route.ts` (create)
- `src/lib/fetchers/sports-rss.ts` (create)
- `src/app/scores/page.tsx` (update to use ISR)
- `src/app/transactions/page.tsx` (update to consume API)

---

## Phase 3: The Video Feed Architecture
**Status:** `complete`
**Goal:** `/watch` route as scalable infinite-scroll vertical video hub.

### Tasks:
- [ ] 3a — Create `src/data/video-feed.ts` — CMS-style JSON config
- [ ] 3b — Build `<VideoCard />` component with HTML5 `<video>` + IntersectionObserver
- [ ] 3c — Build `<VideoFeed />` container with infinite-scroll logic
- [ ] 3d — Replace static `/watch/page.tsx` with live VideoFeed component
- [ ] 3e — Auto-play on enter viewport, pause on exit

### Files to Touch:
- `src/data/video-feed.ts` (create)
- `src/components/video/VideoCard.tsx` (create)
- `src/components/video/VideoFeed.tsx` (create)
- `src/app/watch/page.tsx` (rewrite)

---

## Phase 4: Native System-First Design Enforcement
**Status:** `complete`
**Goal:** Mathematical type scale, centralized design tokens, perceived performance.

### Tasks:
- [ ] 4a — Audit `/components` for inconsistent typography (h1–h6)
- [ ] 4b — Enforce `tracking-tighter` / `leading-tight` type scale in globals.css
- [ ] 4c — Add `--radius-main`, `--radius-card`, `--surface-elevated` CSS vars
- [ ] 4d — Add skeleton loading states to all async/live components
- [ ] 4e — Sweep hardcoded hex colors → CSS variables

### Files to Touch:
- `src/app/globals.css` (major update)
- `src/components/ui/Skeleton.tsx` (enhance)
- Various component files (typography cleanup)

---

## Phase 5: Security & Pen-Test Audit
**Status:** `complete`
**Goal:** Harden for public production deployment.

### Tasks:
- [ ] 5a — Audit `src/middleware.ts` — verify zero bypass vectors for /admin
- [ ] 5b — Test paywall bypass scenarios (JS disabled, sessionStorage cleared)
- [ ] 5c — Shift metered paywall tracking to HTTP-only cookies
- [ ] 5d — Verify NextAuth session handling + CSRF protection
- [ ] 5e — Add rate limiting headers to API routes

### Files to Touch:
- `src/middleware.ts` (harden)
- `src/lib/hooks/useArticleGate.ts` (migrate to cookie-based)
- `src/app/api/gate/route.ts` (create — server-side gate check)
- `src/app/api/transactions/route.ts` (add rate limiting)

---

## Errors Encountered
| Error | Phase | Attempt | Resolution |
|-------|-------|---------|------------|
| — | — | — | — |

---

## Decisions Log
| Decision | Rationale |
|----------|-----------|
| ESPN RSS as data source | Public, no auth, structured XML, covers NFL/NBA/MLB/NHL |
| Fallback to mock data | Never break UI if external fetch fails |
| Cookie-based gate vs sessionStorage | Server-side, JS-bypass proof, HttpOnly |
| HTML5 video + IntersectionObserver | No third-party deps, native performance |
