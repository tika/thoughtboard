import { os } from "@orpc/server";
import { z } from "zod";
import { userIdSchema } from "@/lib/utils";
import {
  updateAvatarSchema,
  updateHandleSchema,
} from "@/server/schemas/profile.schema";
import { profileService } from "@/services/profile";

export const profileRouter = {
  findOrCreate: os.input(userIdSchema).handler(async ({ input }) => {
    return await profileService.findOrCreateProfile(input.id);
  }),
  checkHandleAvailability: os
    .input(
      z.object({
        handle: z.string(),
        excludeUserId: z.string().optional(),
      }),
    )
    .handler(async ({ input }) => {
      return await profileService.checkHandleAvailability(
        input.handle,
        input.excludeUserId,
      );
    }),
  updateHandle: os.input(updateHandleSchema).handler(async ({ input }) => {
    return await profileService.updateHandle(input);
  }),
  updateAvatar: os.input(updateAvatarSchema).handler(async ({ input }) => {
    return await profileService.updateAvatar(input);
  }),
  getByHandle: os
    .input(z.object({ handle: z.string() }))
    .handler(async ({ input }) => {
      return await profileService.getProfileByHandle(input.handle);
    }),
};

export type ProfileRouter = typeof profileRouter;
