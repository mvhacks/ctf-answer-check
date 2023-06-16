import { flagRouter } from "~/server/api/routers/flag";
import { createTRPCRouter } from "~/server/api/trpc";
import { participantRouter } from "./routers/participants";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  flag: flagRouter,
  participants: participantRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
