import { z } from "zod";

export const updateHandleSchema = z.object({
  handle: z
    .string()
    .min(3, "Handle must be at least 3 characters")
    .max(50)
    .regex(
      /^[a-z0-9_]+$/,
      "Handle can only contain lowercase letters, numbers, and underscores",
    ),
  clerkId: z.string(),
});

export const updateAvatarSchema = z.object({
  avatarUrl: z.url(),
  clerkId: z.string(),
});

export type UpdateHandleSchema = z.infer<typeof updateHandleSchema>;
export type UpdateAvatarSchema = z.infer<typeof updateAvatarSchema>;
