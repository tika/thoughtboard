import { os } from "@orpc/server";
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
  updateHandle: os.input(updateHandleSchema).handler(async ({ input }) => {
    return await profileService.updateHandle(input);
  }),
  createAvatarUploadUrl: os
    .input(updateAvatarSchema)
    .handler(async ({ input }) => {
      return await profileService.updateAvatar(input);
    }),
};

export type ProfileRouter = typeof profileRouter;
