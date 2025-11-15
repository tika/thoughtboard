import { createId } from "@paralleldrive/cuid2";
import { pgEnum, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const onboardingStepEnum = pgEnum("onboarding_step", [
  "welcome",
  "handle",
  "avatar",
  "completed",
]);

// A small comment, tweet
export const remarkTable = pgTable("remark", {
  id: text()
    .$defaultFn(() => createId())
    .primaryKey(),
  createdTs: timestamp("created_ts").notNull().defaultNow(),
  updatedTs: timestamp("updated_ts")
    .notNull()
    .$onUpdate(() => new Date()),
  userId: text("user_id")
    .notNull()
    .references(() => profileTable.id, { onDelete: "cascade" }),
  content: varchar("content", { length: 280 }).notNull(),
});

// A blog post stemming from that tweet, optionally
export const reflectionTable = pgTable("reflection", {
  id: text()
    .$defaultFn(() => createId())
    .primaryKey(),
  createdTs: timestamp("created_ts").notNull().defaultNow(),
  updatedTs: timestamp("updated_ts")
    .notNull()
    .$onUpdate(() => new Date()),
  content: text("content").notNull(),
  remarkId: text("remark_id")
    .references(() => remarkTable.id)
    .unique(),
});

export const profileTable = pgTable("profile", {
  id: text("id") // Clerk userId
    .primaryKey(),
  handle: varchar("handle", { length: 50 }).unique(),
  avatarUrl: text("avatar_url"),
  onboardingStep: onboardingStepEnum("onboarding_step")
    .default("welcome")
    .notNull(),
  createdTs: timestamp("created_ts").defaultNow(),
  updatedTs: timestamp("updated_ts").$onUpdate(() => new Date()),
});

export type Remark = typeof remarkTable.$inferSelect;
export type RemarkCreate = typeof remarkTable.$inferInsert;

export type Reflection = typeof reflectionTable.$inferSelect;
export type ReflectionCreate = typeof reflectionTable.$inferInsert;

export type Profile = typeof profileTable.$inferSelect;
export type ProfileCreate = typeof profileTable.$inferInsert;
