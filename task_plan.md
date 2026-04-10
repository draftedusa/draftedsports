# UNDRAFTED — Omni-Platform Build
**Goal:** Massive structural overhaul — league taxonomy, scraping pipeline, social graph, editorial staging, monetization.
**Branch:** `claude/mock-sports-media-app-dqvDs`
**Roadmap:** `undrafted_omni_roadmap.md`

---

## Current Phase: 1 — Data Pipeline, Scraping, & Schema
**Status:** `in_progress`

### Active Sub-tasks
- [ ] 1A — Scraping engine (lib/scraper with Cheerio, API routes, cron scaffold)
- [ ] 1B — League expansion (NFL 32, NBA 30, WNBA 13, MLB 30, NHL 32, 10 soccer leagues, NCAA 13 sports)
- [ ] 1C — Social graph types + mock data (profiles, posts, notifications)

### Key Constraints
- Never break the build — all new data must integrate with existing types + generateStaticParams
- Mock data first, scraper scaffold ready for real URLs via env vars
- "Tables" for soccer, "Rankings" for NCAA, "Standings" for US pro leagues
- Self-referencing post IDs for reply/quote/repost chain

---

## Remaining Phases
- Phase 2: Global Navigation & Interception (The Gateway)
- Phase 3: Editorial Staging & Live Ticker (The Magazine)
- Phase 4: Fan Pulse Social Ecosystem (The Engine)
- Phase 5: Monetization & Polish

---

## Errors Encountered
| Error | Phase | Attempt | Resolution |
|-------|-------|---------|------------|

## Decisions Log
| Decision | Rationale |
|----------|-----------|
| Cheerio over Playwright | Lighter weight, no browser, sufficient for HTML/RSS |
| Expand League type with conference/division | Required for mega-menu sub-navigation |
| Conference/Division as separate data files | Normalized, easier to filter teams in mega-menu |
| NCAA uses Rankings not Standings | Matches AP/Coaches poll terminology |
| Soccer uses Tables not Standings | Matches Premier League/La Liga convention |
