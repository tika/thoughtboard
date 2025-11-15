import { clerkClient, type WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix";
import type { ClerkMetadata } from "@/lib/utils";
import { profileService } from "@/services/profile";

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

export async function POST(req: Request) {
  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add CLERK_WEBHOOK_SIGNING_SECRET from Clerk Dashboard to .env",
    );
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: no svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error: verification failed", { status: 400 });
  }

  // Handle the 'user.created' event
  if (evt.type === "user.created") {
    const { id } = evt.data;

    if (!id) {
      return new Response("Error: missing user ID", { status: 400 });
    }

    try {
      // Create profile in database, this will also set the default metadata
      await profileService.findOrCreateProfile(id);
      console.log(`Created profile & set default metadata for user ${id}`);
    } catch (err) {
      console.error("Error creating profile or updating metadata:", err);
      return new Response(
        "Error: failed to create profile or update metadata",
        { status: 500 },
      );
    }
  }

  return new Response("", { status: 200 });
}
