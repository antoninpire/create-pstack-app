import type { RequestEvent } from "@sveltejs/kit";
import type { inferAsyncReturnType } from "@trpc/server";

import { db } from "$lib/server/db";

export async function createContext(event: RequestEvent) {
  return {
    event,
    db,
    session: event.locals.session ?? (await event.locals.auth.validate()),
    auth: event.locals.auth,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
