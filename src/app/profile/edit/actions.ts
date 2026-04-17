"use server";

import { currentUser } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { supabaseService } from "@/lib/supabase";
import { runMigrations } from "@/lib/migrations";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const USERNAME_RE = /^[a-z0-9_]{3,20}$/;

export async function checkUsernameAvailableExcludingSelf(
  username: string,
  currentClerkId: string
): Promise<{ available: boolean; error?: string }> {
  if (!USERNAME_RE.test(username)) {
    return { available: false, error: "3–20 characters: lowercase, numbers, underscores only." };
  }
  const { data } = await supabaseService
    .from("users")
    .select("clerk_id")
    .eq("username", username)
    .neq("clerk_id", currentClerkId)
    .maybeSingle();
  return { available: !data };
}

export async function saveProfile(formData: {
  display_name: string;
  username: string;
  favorite_team_ids: string[];
}): Promise<{ error?: string }> {
  const user = await currentUser();
  if (!user) return { error: "Not signed in." };

  await runMigrations();

  // If username changed, check uniqueness
  const { data: existing } = await supabaseService
    .from("users")
    .select("clerk_id")
    .eq("username", formData.username)
    .neq("clerk_id", user.id)
    .maybeSingle();
  if (existing) return { error: "Username is already taken." };

  // Sync display_name split into Clerk first/last name
  const nameParts = formData.display_name.trim().split(/\s+/);
  const firstName = nameParts[0] ?? "";
  const lastName  = nameParts.slice(1).join(" ") || undefined;

  const client = await clerkClient();

  await Promise.all([
    // Update Clerk name
    client.users.updateUser(user.id, { firstName, lastName }),
    // Update Supabase
    supabaseService.from("users").update({
      display_name:      formData.display_name.trim(),
      username:          formData.username,
      favorite_team_ids: formData.favorite_team_ids,
    }).eq("clerk_id", user.id),
  ]);

  // Update publicMetadata so header link is current
  await client.users.updateUserMetadata(user.id, {
    publicMetadata: {
      username:              formData.username,
      onboarding_complete:   true,
      favorite_team_ids:     formData.favorite_team_ids,
    },
  });

  revalidatePath(`/profile/${formData.username}`);
  redirect(`/profile/${formData.username}`);
}
