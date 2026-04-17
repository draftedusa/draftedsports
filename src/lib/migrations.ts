"use server";

import postgres from "postgres";

let ran = false;

export async function runMigrations() {
  // In serverless, `ran` resets per invocation — but IF NOT EXISTS makes
  // every statement idempotent so extra runs are safe.
  if (ran) return;
  if (!process.env.DATABASE_URL) {
    console.warn("[migrations] DATABASE_URL not set — skipping");
    return;
  }

  const sql = postgres(process.env.DATABASE_URL, { max: 1 });
  try {
    // ── users table columns ─────────────────────────────────
    await sql`ALTER TABLE public.users ADD COLUMN IF NOT EXISTS username text`;
    await sql`ALTER TABLE public.users ADD COLUMN IF NOT EXISTS favorite_team_ids jsonb DEFAULT '[]'::jsonb`;
    await sql`ALTER TABLE public.users ADD COLUMN IF NOT EXISTS subscription_tier text DEFAULT 'free'`;
    await sql`CREATE UNIQUE INDEX IF NOT EXISTS users_username_idx ON public.users(username) WHERE username IS NOT NULL`;

    // ── followers ───────────────────────────────────────────
    await sql`
      CREATE TABLE IF NOT EXISTS public.followers (
        follower_clerk_id  text NOT NULL,
        following_clerk_id text NOT NULL,
        created_at         timestamptz DEFAULT now(),
        PRIMARY KEY (follower_clerk_id, following_clerk_id)
      )
    `;

    // ── saved_articles ──────────────────────────────────────
    await sql`
      CREATE TABLE IF NOT EXISTS public.saved_articles (
        id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        clerk_id     text NOT NULL,
        article_slug text NOT NULL,
        saved_at     timestamptz DEFAULT now(),
        UNIQUE (clerk_id, article_slug)
      )
    `;

    // ── achievements ────────────────────────────────────────
    await sql`
      CREATE TABLE IF NOT EXISTS public.achievements (
        id               uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        clerk_id         text NOT NULL,
        achievement_type text NOT NULL,   -- 'early_bird' | 'sharp_eye' | 'super_fan'
        awarded_at       timestamptz DEFAULT now(),
        UNIQUE (clerk_id, achievement_type)
      )
    `;

    // ── fan_pulse_posts ─────────────────────────────────────
    await sql`
      CREATE TABLE IF NOT EXISTS public.fan_pulse_posts (
        id                  uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        author_clerk_id     text NOT NULL,
        author_username     text NOT NULL,
        author_display_name text,
        author_avatar_url   text,
        content             text NOT NULL,
        league_tag          text DEFAULT 'ALL',
        reactions           jsonb DEFAULT '{"fire":0,"wow":0,"repost":0}'::jsonb,
        reply_count         integer DEFAULT 0,
        created_at          timestamptz DEFAULT now()
      )
    `;
    await sql`CREATE INDEX IF NOT EXISTS fan_pulse_created_idx ON public.fan_pulse_posts(created_at DESC)`;
    await sql`CREATE INDEX IF NOT EXISTS fan_pulse_author_idx  ON public.fan_pulse_posts(author_clerk_id)`;

    ran = true;
  } catch (err) {
    console.error("[migrations] error:", err);
  } finally {
    await sql.end();
  }
}
