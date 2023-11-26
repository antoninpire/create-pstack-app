import { type Config } from "drizzle-kit";

export default {
  schema: "./src/lib/server/db/schema",
  driver: "mysql2",
  dbCredentials: {
    uri: process.env.DATABASE_URL!,
  },
  tablesFilter: ["project_*"],
  out: "./src/lib/server/db/migrations",
  breakpoints: false,
} satisfies Config;
