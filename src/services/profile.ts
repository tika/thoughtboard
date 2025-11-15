import { clerkClient } from "@clerk/nextjs/server";
import { and, eq, ne } from "drizzle-orm";
import { db } from "@/db/conn";
import { type OnboardingStep, profileTable } from "@/db/schema";
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

async function advanceOnboardingStep(clerkId: string) {
  const steps = ["welcome", "handle", "avatar", "completed"]; // in order

  // Get current profile to find the current step
  const [profile] = await db
    .select()
    .from(profileTable)
    .where(eq(profileTable.id, clerkId));

  if (!profile) {
    throw new Error("Profile not found");
  }

  const currentStep = profile.onboardingStep;
  const currentIndex = steps.indexOf(currentStep);

  // If already at the last step or step not found, don't advance
  if (currentIndex === -1 || currentIndex === steps.length - 1) {
    return profile;
  }

  const nextStep = steps[currentIndex + 1] as OnboardingStep;

  // Update database
  const [updatedProfile] = await db
    .update(profileTable)
    .set({ onboardingStep: nextStep })
    .where(eq(profileTable.id, clerkId))
    .returning();

  // Update Clerk metadata
  await updateClerkMetadata(clerkId, {
    privateMetadata: {
      onboardingStep: nextStep,
    },
  });

  return updatedProfile;
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

async function checkHandleAvailability(
  handle: string,
  excludeUserId?: string,
): Promise<boolean> {
  let query = db.select().from(profileTable);

  // Exclude the current user's handle if provided
  if (excludeUserId) {
    query = query.where(
      and(eq(profileTable.handle, handle), ne(profileTable.id, excludeUserId)),
    ) as typeof query;
  } else {
    query = query.where(eq(profileTable.handle, handle)) as typeof query;
  }

  const [existing] = await query.limit(1);

  return !existing;
}

async function updateHandle(input: UpdateHandleSchema) {
  // If already completed, don't update onboarding

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
    .set({
      avatarUrl: input.avatarUrl || null,
      onboardingStep: "completed",
    })
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
  checkHandleAvailability,
  updateHandle,
  updateAvatar,
};
