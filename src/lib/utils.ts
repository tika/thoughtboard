import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import z from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility for simple ID validation. Do not use with user ids
export const cuidSchema = z.object({
  id: z.cuid(),
});
export type IdSchema = z.infer<typeof cuidSchema>;
export const userIdSchema = z.object({
  id: z.string(),
});
export type UserIdSchema = z.infer<typeof userIdSchema>;
export const remarkSchema = z.string().min(1).max(280);
