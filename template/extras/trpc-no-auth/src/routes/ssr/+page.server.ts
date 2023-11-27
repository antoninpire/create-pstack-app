import type { ServerLoad } from "@sveltejs/kit";

import { createContext } from "$lib/server/context";
import { appRouter } from "$lib/server/routers/root";

export const load: ServerLoad = async (event) => {
  const trpcCaller = appRouter.createCaller(await createContext(event));

  return {
    example: await trpcCaller.example({ message: "Hello World!" }),
  };
};
