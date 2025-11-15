import { put } from "@vercel/blob";
import { eq } from "drizzle-orm";
import mime from "mime/lite";
import { db } from "@/db/conn";
import { profileTable } from "@/db/schema";
import type {
  UpdateHandleSchema,
  UploadAvatarSchema,
} from "@/server/schemas/profile.schema"; // Schema names are fine

// Finds a profile by its Clerk ID or creates a new one.
async function findOrCreateProfile(clerkId: string) {
  const [profile] = await db
    .select()
    .from(profileTable)
    .where(eq(profileTable.id, clerkId));

  if (profile) {
    return profile;
  }

  // Profile doesn't exist, create one
  const [newProfile] = await db
    .insert(profileTable)
    .values({ id: clerkId, onboardingStep: "welcome" })
    .returning();

  return newProfile;
}

async function updateHandle(clerkId: string, input: UpdateHandleSchema) {
  const [updatedProfile] = await db
    .update(profileTable)
    .set({
      handle: input.handle,
      onboardingStep: "avatar", // Advance to next step
    })
    .where(eq(profileTable.id, clerkId))
    .returning();
  return updatedProfile;
}

// Generates a secure URL for the client to upload a blob.
async function createAvatarUploadUrl(input: UploadAvatarSchema) {
  const extension = mime.getExtension(input.mimeType);
  const timestamp = new Date().toISOString();
  const blob = await put(
    `avatars/${input.userId}/${timestamp}.${extension}`,
    "",
    {
      access: "public",
      addRandomSuffix: true,
      contentType: input.contentType,
    },
  );

  return blob;
}

export const profileService = {
  findOrCreateProfile,
  updateHandle,
  createAvatarUploadUrl,
};
