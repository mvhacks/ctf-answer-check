import { type Participant } from "@prisma/client";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const participantRouter = createTRPCRouter({
  getData: protectedProcedure.query(async ({ ctx }) => {
    const email = ctx.session.user.email;

    if (!email) return null;

    const data = await prisma.participant.findFirst({
      where: {
        email,
      },
    });

    if (!data) {
      const data = {
        email,
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
});
