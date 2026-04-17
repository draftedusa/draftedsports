"use server";

import { currentUser } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { supabaseService } from "@/lib/supabase";
import { runMigrations } from "@/lib/migrations";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const USERNAME_RE = /^[a-z0-9_]{3,20}$/;

export async function checkUsernameAvailable(
  username: string
): Promise<{ available: boolean; error?: string }> {
  if (!USERNAME_RE.test(username)) {
    return { available: false, error: "3–20 characters: lowercase letters, numbers, underscores only." };
  }
  const { data, error } = await supabaseService
    .from("users")
    .select("username")
    .eq("username", username)
    .maybeSingle();
  if (error) console.error("[onboarding] checkUsernameAvailable:", error);
  return { available: !data };
}

export async function completeOnboarding(formData: {
  username: string;
  favorite_team_ids: string[];
}): Promise<{ error?: string }> {
  const user = await currentUser();
  if (!user) return { error: "Not signed in." };

  await runMigrations();

  // Final uniqueness check
  const { data: existing } = await supabaseService
    .from("users")
    .select("username")
    .eq("username", formData.username)
    .maybeSingle();
  if (existing) return { error: "Username was just taken. Please choose another." };

  // Use Clerk's name as the single source of truth for display_name
  const display_name = user.fullName ?? user.firstName ?? null;

  const { error: dbError } = await supabaseService.from("users").upsert(
    {
      clerk_id:          user.id,
      email:             user.emailAddresses[0]?.emailAddress ?? null,
      display_name,
      username:          formData.username,
      avatar_url:        user.imageUrl ?? null,
      favorite_team_ids: formData.favorite_team_ids,
    },
    { onConflict: "clerk_id" }
  );

  if (dbError) {
    console.error("[onboarding] Supabase upsert error:", JSON.stringify(dbError, null, 2));
    return { error: `Failed to save profile: ${dbError.message}` };
  }

  // Award "Early Bird" achievement (first signup)
  const { data: existingEarlyBird } = await supabaseService
    .from("achievements")
    .select("id")
    .eq("clerk_id", user.id)
    .eq("achievement_type", "early_bird")
    .maybeSingle();

  await supabaseService
    .from("achievements")
    .upsert({ clerk_id: user.id, achievement_type: "early_bird" }, { onConflict: "clerk_id,achievement_type" });

  // Create notification for Early Bird if first time
  if (!existingEarlyBird) {
    await supabaseService.from("notifications").insert({
      recipient_clerk_id: user.id,
      type:       "achievement_earned",
      title:      "You earned the Early Bird achievement 🐦",
      body:       "Welcome to UNDRAFTED! You joined early.",
      action_url: formData.username ? `/profile/${formData.username}` : null,
    });
    await supabaseService.from("user_activity").insert({
      clerk_id:    user.id,
      type:        "achievement_earned",
      description: "Earned the Early Bird achievement 🐦",
    });
  }

  // Award "Super Fan" if they picked at least 1 team
  if (formData.favorite_team_ids.length > 0) {
    await supabaseService
      .from("achievements")
      .upsert({ clerk_id: user.id, achievement_type: "super_fan" }, { onConflict: "clerk_id,achievement_type" });
  }

  const client = await clerkClient();
  await client.users.updateUserMetadata(user.id, {
    publicMetadata: {
      username:            formData.username,
      onboarding_complete: true,
      favorite_team_ids:   formData.favorite_team_ids,
    },
  });

  revalidatePath(`/profile/${formData.username}`);
  redirect(`/profile/${formData.username}`);
}
