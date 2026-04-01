# UNDRAFTED — Mock Sports Media Platform

A full-stack mock sports media web application inspired by ESPN, Bleacher Report, and The Athletic. Built entirely with placeholder/mock data — no real or live sports feeds. Designed to demonstrate a rich editorial platform with a live game control panel and analytics dashboard.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 |
| State | React local state + React Query (installed) |
| Data | In-memory mock data (TypeScript modules in `src/data/`) |
| Testing | Vitest |
| Runtime | Node.js |

---

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Scripts

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
npm run test     # Run Vitest test suite
```

---

## Exploring the App

### Public Site

| Route | Description |
|---|---|
| `/` | Home — hero, live games, trending articles, league strips |
| `/league/nba` | NBA league page — standings, games, articles |
| `/league/nfl` | NFL league page |
| `/league/mlb` | MLB league page |
| `/league/nhl` | NHL league page |
| `/team/houston-rockets` | Team page — roster, games, news |
| `/team/kansas-city-chiefs` | Another team example |
| `/game/game-001` | Live game — Rockets vs Lakers (play-by-play, polls, comments) |
| `/game/game-002` | Live game — Chiefs vs Eagles |
| `/article/rockets-recap-sengun-dominates-lakers` | Article with comments, reactions, poll |
| `/profile/rocketsfan88` | User profile — saved articles, favorite teams, comments |

### Admin / Editorial Tools

| Route | Description |
|---|---|
| `/admin/live-control` | **Live Game Control Panel** — event timeline, moment triggers, highlight queue, thread controls, poll injection, push alerts |
| `/admin/analytics` | **Analytics Dashboard** — KPIs, game impact, content performance, thread intelligence, user funnel, system health |

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Home page
│   ├── layout.tsx                  # Root layout (Header + Footer)
│   ├── globals.css
│   ├── league/[slug]/page.tsx
│   ├── team/[slug]/page.tsx
│   ├── game/[id]/page.tsx          # Live game page
│   ├── article/[slug]/page.tsx
│   ├── profile/[username]/page.tsx
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── live-control/page.tsx   # Live Game Control Panel
│   │   └── analytics/page.tsx      # Analytics Dashboard
│   └── api/                        # Next.js API routes
│       ├── leagues/route.ts
│       ├── teams/route.ts
│       ├── games/route.ts
│       ├── articles/route.ts
│       ├── comments/route.ts
│       ├── highlights/route.ts
│       └── polls/route.ts
├── components/
│   ├── layout/Header.tsx
│   ├── layout/Footer.tsx
│   ├── cards/GameCard.tsx
│   ├── cards/ArticleCard.tsx
│   ├── ui/Badge.tsx
│   └── ui/Panel.tsx
├── data/                           # All mock data
│   ├── leagues.ts / teams.ts / games.ts / players.ts
│   ├── articles.ts / users.ts / comments.ts
│   ├── highlights.ts / polls.ts / tags.ts
├── lib/utils.ts                    # Shared utility functions
├── types/index.ts                  # TypeScript interfaces
└── __tests__/utils.test.ts         # Vitest unit tests
```

---

## Content Model

Core entities (all mock):

- **League** → Teams, Games
- **Team** → belongs to League; has Players, Games, Articles
- **Game** → League + two Teams; has GameEvents, Threads, Highlights, Polls
- **Article** → linked to Teams, Games, Tags; has Comments via Thread
- **Thread** → linked to Game or Article; has Comments
- **Comment** → belongs to Thread + User; has Reactions (fire, wow, facts, lol)
- **User** → favorite Teams, saved Articles, recent Comments
- **Highlight** → belongs to Game, optionally linked to GameEvent
- **Poll** → linked to Thread or Article

---

## Key Features

### Live Game Control Panel (`/admin/live-control`)
- Game header strip with real-time status toggles
- Scrollable event timeline with per-event action buttons (trigger highlight, create thread, send alert, ignore)
- **Moment Trigger Engine** — type a moment, get auto-action suggestions with confidence score, execute or edit actions
- Highlight queue with preview/insert/discard
- Thread & community controls (slow mode, chat toggle, pinning)
- Poll injection builder
- Push alert builder with destination checkboxes and priority selector

### Analytics Dashboard (`/admin/analytics`)
- KPI bar (live users, active threads, engagement rate, retention)
- Live game impact panel (user spike, thread joins, engagement %)
- Content performance table (views, scroll depth, shares, conversions)
- Thread intelligence (velocity indicators, toxicity flags)
- Engagement intelligence (trending tags, AI-style push recommendations)
- User behavior metrics + regional bar chart
- Conversion funnel visualization (Home → Game → Thread → Poll)
- System performance indicators (API latency, error rate, uptime)

---

> All data is 100% mock/fictional. No real sports APIs are used. Admin routes have no real authentication — for demonstration only.
