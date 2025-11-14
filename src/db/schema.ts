import { createId } from "@paralleldrive/cuid2";
import {
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

// A small comment, tweet
export const remarkTable = pgTable("remark", {
  id: text()
    .$defaultFn(() => createId())
    .primaryKey(),
  createdTs: timestamp("created_ts").defaultNow(),
  updatedTs: timestamp("updated_ts").$onUpdate(() => new Date()),
  userId: text("user_id").notNull(),
  content: varchar("content", { length: 280 }).notNull(),
});

// A blog post stemming from that tweet, optionally
export const reflectionTable = pgTable("reflection", {
  id: text()
    .$defaultFn(() => createId())
    .primaryKey(),
  createdTs: timestamp("created_ts").defaultNow(),
  updatedTs: timestamp("updated_ts").$onUpdate(() => new Date()),
  content: text("content").notNull(),
  remarkId: integer("remark_id").references(() => remarkTable.id),
});

export type Remark = typeof remarkTable.$inferSelect;
export type RemarkCreate = typeof remarkTable.$inferInsert;

export type Reflection = typeof reflectionTable.$inferSelect;
export type ReflectionCreate = typeof reflectionTable.$inferInsert;
