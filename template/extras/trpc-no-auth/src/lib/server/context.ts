import type { RequestEvent } from "@sveltejs/kit";
import type { inferAsyncReturnType } from "@trpc/server";

import { db } from "$lib/server/db";

export async function createContext(event: RequestEvent) {
  return {
    event,
    db,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
