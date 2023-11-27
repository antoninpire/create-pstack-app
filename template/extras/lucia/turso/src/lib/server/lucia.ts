import { libsql } from "@lucia-auth/adapter-sqlite";
import { github } from "@lucia-auth/oauth/providers";
import { lucia } from "lucia";
import { sveltekit } from "lucia/middleware";

import { dev } from "$app/environment";
import { env } from "$env/dynamic/private";
import { client } from "$lib/server/db";

export const auth = lucia({
  adapter: libsql(client, {
    key: "auth_keys",
    session: "auth_sessions",
    user: "users",
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
