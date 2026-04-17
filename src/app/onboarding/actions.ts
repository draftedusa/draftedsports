"use server";

import { currentUser } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { supabaseService } from "@/lib/supabase";
import { redirect } from "next/navigation";
import postgres from "postgres";

const USERNAME_RE = /^[a-z0-9_]{3,20}$/;

// ── Ensure favorite_team_ids column exists ───────────────
// The users table was originally created with only the webhook columns
// (clerk_id, email, display_name, avatar_url). Run a one-time migration
// to add favorite_team_ids if it's missing.
async function ensureFavoriteTeamIdsColumn() {
  if (!process.env.DATABASE_URL) {
    console.warn("[onboarding] DATABASE_URL not set — skipping column migration");
    return;
  }
  try {
    const sql = postgres(process.env.DATABASE_URL, { max: 1 });
    await sql`
      ALTER TABLE public.users
      ADD COLUMN IF NOT EXISTS favorite_team_ids jsonb DEFAULT '[]'::jsonb
    `;
    await sql.end();
  } catch (err) {
    // Non-fatal: the column may already exist or the DB may not be reachable
    console.error("[onboarding] ensureFavoriteTeamIdsColumn failed:", err);
  }
}

export async function checkUsernameAvailable(
  username: string
): Promise<{ available: boolean; error?: string }> {
  if (!USERNAME_RE.test(username)) {
    return {
      available: false,
      error: "3–20 characters: lowercase letters, numbers, underscores only.",
    };
  }
  const { data, error } = await supabaseService
    .from("users")
    .select("username")
    .eq("username", username)
    .maybeSingle();
  if (error) console.error("[onboarding] checkUsernameAvailable error:", error);
  return { available: !data };
}

export async function completeOnboarding(formData: {
  display_name: string;
  username: string;
  favorite_team_ids: string[];
}): Promise<{ error?: string }> {
  const user = await currentUser();
  if (!user) return { error: "Not signed in." };

  // Final uniqueness check
  const { data: existing } = await supabaseService
    .from("users")
    .select("username")
    .eq("username", formData.username)
    .maybeSingle();
  if (existing) return { error: "Username was just taken. Please choose another." };

  // Ensure the column exists before writing
  await ensureFavoriteTeamIdsColumn();

  // Upsert the full row
  const { error: dbError } = await supabaseService.from("users").upsert(
    {
      clerk_id: user.id,
      email: user.emailAddresses[0]?.emailAddress ?? null,
      display_name: formData.display_name,
      username: formData.username,
      avatar_url: user.imageUrl ?? null,
      favorite_team_ids: formData.favorite_team_ids,
    },
    { onConflict: "clerk_id" }
  );

  if (dbError) {
    console.error("[onboarding] Supabase upsert error:", JSON.stringify(dbError, null, 2));
    return { error: `Failed to save profile: ${dbError.message}` };
  }

  // Persist to Clerk publicMetadata so middleware can skip future DB checks
  const client = await clerkClient();
  await client.users.updateUserMetadata(user.id, {
    publicMetadata: {
      username: formData.username,
      onboarding_complete: true,
      favorite_team_ids: formData.favorite_team_ids,
    },
  });

  redirect(`/profile/${formData.username}`);
}
