import z from "zod";

export const createRemarkSchema = z.object({
  content: z.string().min(1).max(280),
  userId: z.string(),
  reflectionId: z.string().optional(),
});
export type CreateRemarkSchema = z.infer<typeof createRemarkSchema>;

export const deleteRemarkSchema = z.object({
  userId: z.string(),
  remarkId: z.cuid2(),
});
export type DeleteRemarkSchema = z.infer<typeof deleteRemarkSchema>;

export const getReadyForReflectionSchema = z.object({
  userId: z.string(),
});
export type GetReadyForReflectionSchema = z.infer<
  typeof getReadyForReflectionSchema
>;
