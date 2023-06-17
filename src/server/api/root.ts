import { ctfRouter } from "~/server/api/routers/ctfs";
import { createTRPCRouter } from "~/server/api/trpc";
import { participantRouter } from "./routers/participants";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  ctfs: ctfRouter,
  participants: participantRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
