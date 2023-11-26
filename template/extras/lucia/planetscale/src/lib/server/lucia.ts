import { planetscale } from "@lucia-auth/adapter-mysql";
import { lucia } from "lucia";
import { sveltekit } from "lucia/middleware";

import { dev } from "$app/environment";
import { connection } from "$lib/server/db";

export const auth = lucia({
  adapter: planetscale(connection, {
    key: "project_auth_keys",
    session: "project_auth_sessions",
    user: "project_users",
  }),
  env: dev ? "DEV" : "PROD",
  middleware: sveltekit(),
  getUserAttributes: (data) => {
    return {
      email: data.email,
      username: data.username,
    };
  },
  getSessionAttributes: (data) => {
    return {
      defaultType: data.defaultType,
    };
  },
});

export type Auth = typeof auth;
