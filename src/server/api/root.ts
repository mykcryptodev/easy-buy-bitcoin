import { coingeckoRouter } from "~/server/api/routers/coingecko";
import { chainlinkRouter } from "~/server/api/routers/chainlink";
import { kyberswapRouter } from "~/server/api/routers/kyberswap";
import { moralisRouter } from "~/server/api/routers/moralis";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  coingecko: coingeckoRouter,
  chainlink: chainlinkRouter,
  kyberswap: kyberswapRouter,
  moralis: moralisRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
