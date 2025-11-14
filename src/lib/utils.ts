import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import z from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility for simple ID validation
export const idSchema = z.object({
  id: z.cuid(),
});
export const remarkSchema = z.string().min(1).max(280);
