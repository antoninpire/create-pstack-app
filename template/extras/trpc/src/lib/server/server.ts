import { createTRPCSvelteServer } from "trpc-svelte-query/server";

import { env } from "$env/dynamic/private";
import { createContext } from "./context";
import { appRouter } from "./routers/root";

export const trpcServer = createTRPCSvelteServer({
  endpoint: "/api/trpc",
  router: appRouter,
  createContext,
  onError:
    env.NODE_ENV !== "production"
      ? ({ path, error }) => {
          /* eslint-disable no-console */
          console.error(`❌ tRPC failed on ${path}: ${error}`);
        }
      : undefined,
});
