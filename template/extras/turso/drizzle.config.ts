import { type Config } from "drizzle-kit";

export default {
  schema: "./src/lib/server/db/schema.ts",
  driver: "turso",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN!,
  },
  out: "./src/lib/server/db/migrations",
  breakpoints: false,
} satisfies Config;
