import { headers } from "next/headers";
import { Webhook } from "svix";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { supabaseService } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!CLERK_WEBHOOK_SECRET) {
    return new Response("Missing CLERK_WEBHOOK_SECRET", { status: 500 });
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(CLERK_WEBHOOK_SECRET);
  let event: WebhookEvent;

  try {
    event = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch {
    return new Response("Invalid webhook signature", { status: 400 });
  }

  const { type: eventType, data } = event;

  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name, image_url } = data as {
      id: string;
      email_addresses: { email_address: string }[];
      first_name: string | null;
      last_name: string | null;
      image_url: string | null;
    };
    const email = email_addresses[0]?.email_address ?? null;
    const display_name = [first_name, last_name].filter(Boolean).join(" ") || null;

    await supabaseService.from("users").insert({
      clerk_id: id,
      email,
      display_name,
      avatar_url: image_url,
    });
  }

  if (eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name, image_url } = data as {
      id: string;
      email_addresses: { email_address: string }[];
      first_name: string | null;
      last_name: string | null;
      image_url: string | null;
    };
    const email = email_addresses[0]?.email_address ?? null;
    const display_name = [first_name, last_name].filter(Boolean).join(" ") || null;

    const { data: updated } = await supabaseService
      .from("users")
      .update({ email, display_name, avatar_url: image_url })
      .eq("clerk_id", id)
      .select("username")
      .maybeSingle();

    if (updated?.username) {
      revalidatePath(`/profile/${updated.username}`);
    }
  }

  if (eventType === "user.deleted") {
    const { id } = data as { id: string };
    await supabaseService.from("users").delete().eq("clerk_id", id);
  }

  return new Response("OK", { status: 200 });
}
