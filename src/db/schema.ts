import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const remarkTable = pgTable("remark", {
  id: serial("id").primaryKey(),
  createdTs: timestamp("created_ts").defaultNow(),
  updatedTs: timestamp("updated_ts").$onUpdate(() => new Date()),
  userId: text("user_id"),
  content: varchar("content", { length: 280 }),
});

export const reflectionTable = pgTable("reflection", {
  id: serial("id").primaryKey(),
  createdTs: timestamp("created_ts").defaultNow(),
  updatedTs: timestamp("updated_ts").$onUpdate(() => new Date()),
  content: text("content"),
  remarkId: integer("remark_id")
    .references(() => remarkTable.id, { onDelete: "cascade" })
    .notNull(),
});
