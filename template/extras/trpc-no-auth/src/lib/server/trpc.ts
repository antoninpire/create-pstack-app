import { initTRPC } from "@trpc/server";
import { ZodError } from "zod";

import { transformer } from "$lib/trpc/transformer";
import type { Context } from "./context";

const t = initTRPC.context<Context>().create({
  transformer,
  errorFormatter: ({ shape, error }) => {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === "BAD_REQUEST" && error.cause instanceof ZodError
            ? error.cause.flatten()
            : null,
      },
    };
  },
});

export const router = t.router;

export const publicProcedure = t.procedure;
