import { clerkClient } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "@/db/conn";
import { profileTable } from "@/db/schema";
import type { ClerkMetadata } from "@/lib/utils";
import type {
  UpdateAvatarSchema,
  UpdateHandleSchema,
} from "@/server/schemas/profile.schema";

async function updateClerkMetadata(
  clerkId: string,
  metadata: Partial<ClerkMetadata>,
) {
  const clerk = await clerkClient();
  return clerk.users.updateUser(clerkId, metadata);
}

async function findOrCreateProfile(clerkId: string) {
  const [profile] = await db
    .select()
    .from(profileTable)
    .where(eq(profileTable.id, clerkId));

  if (profile) {
    return profile;
  }

  const [newProfile] = await db
    .insert(profileTable)
    .values({ id: clerkId, onboardingStep: "welcome" })
    .returning();

  await updateClerkMetadata(clerkId, {
    privateMetadata: {
      onboardingStep: "welcome",
    },
  });

  return newProfile;
}

async function updateHandle(input: UpdateHandleSchema) {
  const [updatedProfile] = await db
    .update(profileTable)
    .set({
      handle: input.handle,
      onboardingStep: "avatar",
    })
    .where(eq(profileTable.id, input.clerkId))
    .returning();

  await updateClerkMetadata(input.clerkId, {
    publicMetadata: {
      handle: input.handle,
    },
    privateMetadata: {
      onboardingStep: "avatar",
    },
  });

  return updatedProfile;
}

async function updateAvatar(input: UpdateAvatarSchema) {
  const [updatedProfile] = await db
    .update(profileTable)
    .set({ avatarUrl: input.avatarUrl, onboardingStep: "completed" })
    .where(eq(profileTable.id, input.clerkId))
    .returning();

  await updateClerkMetadata(input.clerkId, {
    privateMetadata: {
      onboardingStep: "completed",
    },
  });

  return updatedProfile;
}

export const profileService = {
  findOrCreateProfile,
  updateHandle,
  updateAvatar,
};
