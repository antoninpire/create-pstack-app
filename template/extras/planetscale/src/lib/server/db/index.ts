import { connect } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";

import { env } from "$env/dynamic/private";
import * as schema from "./schema";

export const connection = connect({
  host: env.DATABASE_HOST,
  username: env.DATABASE_USERNAME,
  password: env.DATABASE_PASSWORD,
  fetch: (url, init) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (init as any)["cache"]; // Remove cache header
    return fetch(url, init);
  },
});

export const db = drizzle(connection, { schema });

export type Database = typeof db;
