"use server";

import { currentUser } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { supabaseService } from "@/lib/supabase";
import { redirect } from "next/navigation";

const USERNAME_RE = /^[a-z0-9_]{3,20}$/;

export async function checkUsernameAvailable(
  username: string
): Promise<{ available: boolean; error?: string }> {
  if (!USERNAME_RE.test(username)) {
    return {
      available: false,
      error: "3–20 characters: lowercase letters, numbers, underscores only.",
    };
  }
  const { data } = await supabaseService
    .from("users")
    .select("username")
    .eq("username", username)
    .maybeSingle();
  return { available: !data };
}

export async function completeOnboarding(formData: {
  display_name: string;
  username: string;
  favorite_team_ids: string[];
}): Promise<{ error?: string }> {
  const user = await currentUser();
  if (!user) return { error: "Not signed in." };

  // Final uniqueness check before writing
  const { data: existing } = await supabaseService
    .from("users")
    .select("username")
    .eq("username", formData.username)
    .maybeSingle();
  if (existing) return { error: "Username was just taken. Please choose another." };

  // Upsert into Supabase (handles webhook-not-yet-fired edge case)
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
  if (dbError) return { error: "Failed to save profile. Please try again." };

  // Mark onboarding complete in Clerk publicMetadata so middleware
  // can skip the Supabase check on subsequent requests
  const client = await clerkClient();
  await client.users.updateUserMetadata(user.id, {
    publicMetadata: {
      username: formData.username,
      onboarding_complete: true,
    },
  });

  redirect(`/profile/${formData.username}`);
}
