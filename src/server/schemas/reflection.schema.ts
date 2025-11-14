import { z } from "zod";

export const createReflectionSchema = z.object({
  content: z.string().min(140),
  remarkId: z.string(),
  userId: z.string(),
});
export type CreateReflectionSchema = z.infer<typeof createReflectionSchema>;

export const updateReflectionSchema = z.object({
  content: z.string().min(140),
  remarkId: z.string(),
  userId: z.string(),
});
export type UpdateReflectionSchema = z.infer<typeof updateReflectionSchema>;

// No deleting reflections
