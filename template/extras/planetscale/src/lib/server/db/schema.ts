import type { InferSelectModel } from "drizzle-orm";
import { sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  datetime,
  index,
  mysqlTableCreator,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

export const mysqlTable = mysqlTableCreator((name) => `project_${name}`);

export const users = mysqlTable(
  "users",
  {
    id: varchar("id", {
      length: 25,
    }).primaryKey(),
    email: varchar("email", { length: 128 }).unique(),
    username: varchar("username", { length: 75 }).unique(),
    active: boolean("active").notNull().default(false),
    createdAt: datetime("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    usernameIdx: uniqueIndex("username_idx").on(table.username),
    emailIdx: uniqueIndex("email_idx").on(table.email),
  })
);

export type User = InferSelectModel<typeof users>;

export const authKeys = mysqlTable(
  "auth_keys",
  {
    id: varchar("id", {
      length: 255,
    }).primaryKey(),
    userId: varchar("user_id", {
      length: 25,
    }).notNull(),
    hashedPassword: varchar("hashed_password", {
      length: 255,
    }),
  },

  (table) => ({
    userIdx: index("user_idx").on(table.userId),
  })
);

export const authSessions = mysqlTable(
  "auth_sessions",
  {
    id: varchar("id", {
      length: 128,
    }).primaryKey(),
    userId: varchar("user_id", {
      length: 25,
    }).notNull(),
    activeExpires: bigint("active_expires", {
      mode: "number",
    }).notNull(),
    idleExpires: bigint("idle_expires", {
      mode: "number",
    }).notNull(),
    username: varchar("username", { length: 75 }),
  },
  (table) => ({
    userIdx: index("user_idx").on(table.userId),
  })
);
