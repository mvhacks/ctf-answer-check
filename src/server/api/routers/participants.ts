import { type Participant } from "@prisma/client";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const participantRouter = createTRPCRouter({
  getData: protectedProcedure.query(async ({ ctx }) => {
    const email = ctx.session.user.email;
    const name = ctx.session.user.name;

    if (!email || !name) return null;

    const data = await prisma.participant.findFirst({
      where: {
        email,
      },
    });

    if (!data) {
      const data = {
        email,
        name,
        completed: "",
        points: 0,
      };
      await prisma.participant.create({
        data,
      });
      return data as Participant;
    }

    return data;
  }),
  getParticipants: adminProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.participant.findMany({
      orderBy: {
        points: "desc",
      },
    });
  }),
});
