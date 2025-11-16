import { createId } from "@paralleldrive/cuid2";
import { pgEnum, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const onboardingStepEnum = pgEnum("onboarding_step", [
  "welcome",
  "handle",
  "avatar",
  "completed",
]);

export const reflectionTypeEnum = pgEnum("reflection_type", [
  "written",
  "media",
]);

export const reflectionThemeEnum = pgEnum("reflection_theme", [
  "work",
  "personal",
  "creative",
  "learning",
  "health",
  "relationships",
  "other",
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
  reflectionId: text("reflection_id"),
  expiresAt: timestamp("expires_at"),
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
  type: reflectionTypeEnum("type").notNull().default("written"),
  theme: reflectionThemeEnum("theme"),
  mediaUrl: text("media_url"),
  mediaType: varchar("media_type", { length: 50 }), // e.g., "image", "video", "audio"
});

export const profileTable = pgTable("profile", {
  id: text("id") // Clerk userId
    .primaryKey(),
  handle: varchar("handle", { length: 50 }).unique(),
  avatarUrl: text("avatar_url"),
  onboardingStep: onboardingStepEnum("onboarding_step")
    .default("welcome")
    .notNull(),
  createdTs: timestamp("created_ts").notNull().defaultNow(),
  updatedTs: timestamp("updated_ts")
    .notNull()
    .$onUpdate(() => new Date()),
});

// Follow relationships between users
export const followsTable = pgTable("follows", {
  id: text()
    .$defaultFn(() => createId())
    .primaryKey(),
  followerId: text("follower_id")
    .notNull()
    .references(() => profileTable.id, { onDelete: "cascade" }),
  followingId: text("following_id")
    .notNull()
    .references(() => profileTable.id, { onDelete: "cascade" }),
  createdTs: timestamp("created_ts").notNull().defaultNow(),
});

// Likes on reflections
export const likesTable = pgTable("likes", {
  id: text()
    .$defaultFn(() => createId())
    .primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => profileTable.id, { onDelete: "cascade" }),
  reflectionId: text("reflection_id")
    .notNull()
    .references(() => reflectionTable.id, { onDelete: "cascade" }),
  createdTs: timestamp("created_ts").notNull().defaultNow(),
});

// Comments on reflections
export const commentsTable = pgTable("comments", {
  id: text()
    .$defaultFn(() => createId())
    .primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => profileTable.id, { onDelete: "cascade" }),
  reflectionId: text("reflection_id")
    .notNull()
    .references(() => reflectionTable.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  createdTs: timestamp("created_ts").notNull().defaultNow(),
  updatedTs: timestamp("updated_ts")
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Remark = typeof remarkTable.$inferSelect;
export type RemarkCreate = typeof remarkTable.$inferInsert;

export type Reflection = typeof reflectionTable.$inferSelect;
export type ReflectionCreate = typeof reflectionTable.$inferInsert;

export type ReflectionType = (typeof reflectionTypeEnum.enumValues)[number];
export type ReflectionTheme = (typeof reflectionThemeEnum.enumValues)[number];
export type OnboardingStep = (typeof onboardingStepEnum.enumValues)[number];

export type Follow = typeof followsTable.$inferSelect;
export type FollowCreate = typeof followsTable.$inferInsert;

export type Like = typeof likesTable.$inferSelect;
export type LikeCreate = typeof likesTable.$inferInsert;

export type Comment = typeof commentsTable.$inferSelect;
export type CommentCreate = typeof commentsTable.$inferInsert;

type DbProfile = typeof profileTable.$inferSelect;
export type ProfileCreate = typeof profileTable.$inferInsert;

type IncompleteProfile = DbProfile & {
  onboardingStep: Omit<OnboardingStep, "completed">;
};

// Use this when you know the profile is complete
export type CompletedProfile = DbProfile & {
  onboardingStep: "completed";
  handle: string;
};

export type Profile = IncompleteProfile | CompletedProfile;
