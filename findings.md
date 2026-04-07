# Findings & Research

## Codebase State (pre-upgrade)
- **Framework:** Next.js 16.2.2 App Router, TypeScript
- **Auth:** next-auth v5 beta — `useSession()`, role-based (`admin`/`user`)
- **Styling:** Tailwind v4 with `@theme` tokens, CSS custom properties
- **Data:** All mock — `src/data/*.ts` static arrays
- **Key types:** `Transaction`, `Article`, `Game`, `Team` in `src/types/index.ts`

## Transaction Interface (existing)
```ts
// From src/data/transactions.ts (inferred)
interface Transaction {
  id: string
  headline: string
  type: "trade" | "signing" | "injury" | "extension" | "release"
  teamIds: string[]
  date: string
  isBreaking: boolean
}
```

## ESPN RSS Feed URLs (public, no auth)
- NFL News: `https://www.espn.com/espn/rss/nfl/news`
- NBA News: `https://www.espn.com/espn/rss/nba/news`
- MLB News: `https://www.espn.com/espn/rss/mlb/news`
- NHL News: `https://www.espn.com/espn/rss/nhl/news`
- Format: XML/RSS 2.0 with `<item>` elements containing `<title>`, `<description>`, `<pubDate>`, `<link>`

## Next.js ISR Pattern (v16)
```ts
// Route-level ISR
export const revalidate = 60 // seconds

// Or fetch-level
fetch(url, { next: { revalidate: 60 } })
```

## IntersectionObserver for Video Autoplay
```ts
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) videoRef.current?.play()
      else videoRef.current?.pause()
    })
  },
  { threshold: 0.6 } // 60% visible triggers play
)
```

## Cookie-Based Gate (HTTP-only)
- Set via API route using `cookies()` from `next/headers`
- `Set-Cookie: undrafted_gate=3; HttpOnly; SameSite=Strict; Path=/`
- JS cannot read/modify HttpOnly cookies
- Checked server-side in API route before serving premium content

## CSS Type Scale (targeting)
```
h1: text-4xl / tracking-tighter / leading-tight / font-black
h2: text-2xl / tracking-tighter / leading-tight / font-bold  
h3: text-xl  / tracking-tight  / leading-snug  / font-bold
h4: text-lg  / tracking-tight  / leading-snug  / font-semibold
body: text-sm / leading-relaxed (1.6)
```

## New CSS Variables (Phase 4)
```css
--radius-main: 0.75rem;   /* 12px — cards, modals */
--radius-sm:   0.5rem;    /* 8px — pills, badges */
--radius-xl:   1rem;      /* 16px — hero, large cards */
--surface-elevated: color-mix(in srgb, var(--surface-200) 95%, var(--brand) 5%);
```

## Security Findings
- Current middleware: checks `req.auth?.user.role === "admin"` — correct pattern
- Weakness: `useArticleGate` uses `sessionStorage` — clearable by user in DevTools
- Fix: server-side HttpOnly cookie counter via `/api/gate/increment` route
- CSRF: NextAuth v5 handles CSRF natively via `csrf` token in session
