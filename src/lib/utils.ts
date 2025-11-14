import { type ClassValue, clsx } from "clsx";
import { differenceInSeconds, formatDistanceToNow } from "date-fns";
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

/**
 * Formats a timestamp for display
 * * - Shows relative time (e.g., "5 minutes ago").
 * - Adds an "(updated)" tag if it was updated more than 60 seconds
 * after being created.
 */
export function formatRemarkTimestamp(
  createdTs: Date,
  updatedTs: Date,
): string {
  // Drizzle's $onUpdate can make timestamps slightly different
  // even on creation. We'll set a threshold (e.g., 60 seconds)
  // to decide if an "updated" tag is warranted.
  const wasMeaningfullyUpdated = differenceInSeconds(updatedTs, createdTs) > 60;

  // Get the base time string, e.g., "5 minutes ago"
  const timeString = formatDistanceToNow(createdTs, { addSuffix: true });

  // Add the (updated) tag if it was.
  return wasMeaningfullyUpdated ? `${timeString} (updated)` : timeString;
}
