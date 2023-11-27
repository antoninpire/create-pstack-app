import { planetscale } from "@lucia-auth/adapter-mysql";
import { github } from "@lucia-auth/oauth/providers";
import { lucia } from "lucia";
import { sveltekit } from "lucia/middleware";

import { dev } from "$app/environment";
import { env } from "$env/dynamic/private";
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

export const githubAuth = github(auth, {
  clientId: env.GITHUB_CLIENT_ID,
  clientSecret: env.GITHUB_CLIENT_SECRET,
  scope: ["user:email"],
});

export type Auth = typeof auth;
