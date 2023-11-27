import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { z } from "zod";

import { publicProcedure, router } from "../trpc";

export const appRouter = router({
  example: publicProcedure
    .input(
      z.object({
        message: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return {
        message: input.message,
      };
    }),
});

export type AppRouter = typeof appRouter;

/**
 * Inference helper for inputs
 * @example type HelloInput = RouterInputs['example']['hello']
 **/
export type RouterInputs = inferRouterInputs<AppRouter>;
/**
 * Inference helper for outputs
 * @example type HelloOutput = RouterOutputs['example']['hello']
 **/
export type RouterOutputs = inferRouterOutputs<AppRouter>;
