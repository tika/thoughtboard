import { eq } from "drizzle-orm";
import { db } from "@/db/conn";
import { profileTable } from "@/db/schema";
import type {
  UpdateAvatarSchema,
  UpdateHandleSchema,
} from "@/server/schemas/profile.schema";

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
  return updatedProfile;
}

async function updateAvatar(input: UpdateAvatarSchema) {
  const [updatedProfile] = await db
    .update(profileTable)
    .set({ avatarUrl: input.avatarUrl, onboardingStep: "completed" })
    .where(eq(profileTable.id, input.clerkId))
    .returning();

  
  return updatedProfile;
}

export const profileService = {
  findOrCreateProfile,
  updateHandle,
  updateAvatar,
};
