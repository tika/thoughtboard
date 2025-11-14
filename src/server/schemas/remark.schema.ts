import z from "zod";

export const createRemarkSchema = z.object({
  content: z.string().min(1).max(280),
  userId: z.string(),
});
export type CreateRemarkSchema = z.infer<typeof createRemarkSchema>;

export const deleteRemarkSchema = z.object({
  userId: z.string(),
  remarkId: z.cuid(),
});
export type DeleteRemarkSchema = z.infer<typeof deleteRemarkSchema>;
