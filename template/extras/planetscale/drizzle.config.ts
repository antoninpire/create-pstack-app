import { type Config } from "drizzle-kit";

export default {
  schema: "./src/lib/server/db/schema",
  driver: "mysql2",
  dbCredentials: {
    host: process.env.DATABASE_HOST!,
    user: process.env.DATABASE_USERNAME!,
    password: process.env.DATABASE_PASSWORD!,
  },
  tablesFilter: ["project_*"],
  out: "./src/lib/server/db/migrations",
  breakpoints: false,
} satisfies Config;
