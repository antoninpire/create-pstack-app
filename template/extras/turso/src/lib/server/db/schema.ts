import { sql, type InferSelectModel } from "drizzle-orm";
import {
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const users = sqliteTable(
  "users",
  {
    id: text("id", {
      length: 25,
    }).primaryKey(),
    email: text("email", { length: 128 }).unique(),
    username: text("username", { length: 75 }).unique(),
    active: integer("active", { mode: "boolean" }).notNull().default(false),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    usernameIdx: uniqueIndex("username_idx").on(table.username),
    emailIdx: uniqueIndex("email_idx").on(table.email),
  })
);

export type User = InferSelectModel<typeof users>;

export const authKeys = sqliteTable(
  "auth_keys",
  {
    id: text("id", {
      length: 255,
    }).primaryKey(),
    userId: text("user_id", {
      length: 25,
    }).notNull(),
    hashedPassword: text("hashed_password", {
      length: 255,
    }),
  },

  (table) => ({
    userIdx: index("keys_user_idx").on(table.userId),
  })
);

export const authSessions = sqliteTable(
  "auth_sessions",
  {
    id: text("id", {
      length: 128,
    }).primaryKey(),
    userId: text("user_id", {
      length: 25,
    }).notNull(),
    activeExpires: integer("active_expires").notNull(),
    idleExpires: integer("idle_expires").notNull(),
    username: text("username", { length: 75 }),
  },
  (table) => ({
    userIdx: index("sessions_user_idx").on(table.userId),
  })
);
