import { httpBatchLink } from "@trpc/client";
import { createTRPCSvelte } from "trpc-svelte-query";

import type { AppRouter } from "$lib/server/routers/root";
import { transformer } from "./transformer";

export const trpc = createTRPCSvelte<AppRouter>({
  links: [
    httpBatchLink({
      url: "/api/trpc",
    }),
  ],
  transformer,
  queryClientConfig: {
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 60 * 5 * 1000, // 5 minutes
      },
    },
  },
});
