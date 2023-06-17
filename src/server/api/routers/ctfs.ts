import { type CtfChallenge } from "@prisma/client";
import { z } from "zod";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

const ctfSchema = z.object({
  id: z.string(),
  name: z.string(),
  link: z.string(),
  flag: z.string(),
  points: z.number(),
});

export const ctfRouter = createTRPCRouter({
  getNames: protectedProcedure.query(async ({ ctx }) => {
    const challenges = await ctx.prisma.ctfChallenge.findMany();
    return challenges.map((item) => item.name);
  }),
  checkFlag: protectedProcedure
    .input(z.object({ name: z.string(), value: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const challenges = await ctx.prisma.ctfChallenge.findMany();

      let correctChallenge: CtfChallenge | null = null;
      for (let i = 0; i < challenges.length; i++) {
        const challenge = challenges[i];
        if (!challenge) continue;
        if (challenge.name === input.name) {
          correctChallenge = challenge;
          break;
        }
      }

      if (correctChallenge !== null) {
        const email = ctx.session.user.email;

        if (!email) return [false, 0] as const;

        const participantData = await ctx.prisma.participant.findFirst({
          where: {
            email,
          },
        });

        if (!participantData) return [false, 0] as const;

        const completed = participantData.completed.split(",");
        if (completed.includes(correctChallenge.name))
          return [false, 0] as const;

        const newPoints = participantData.points + correctChallenge.points;
        const newCompleted =
          participantData.completed +
          `${completed.length > 0 ? "," : ""}${correctChallenge.name}`;

        await ctx.prisma.participant.update({
          where: {
            email,
          },
          data: {
            points: newPoints,
            completed: newCompleted,
          },
        });
        return [true, correctChallenge.points] as const;
      }
      return [false, 0] as const;
    }),
  getAll: adminProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.ctfChallenge.findMany();
  }),
  deleteCtf: adminProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.ctfChallenge.delete({
        where: {
          id: input,
        },
      });
    }),
  updateCtf: adminProcedure
    .input(ctfSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.ctfChallenge.update({
        where: {
          id: input.id,
        },
        data: input,
      });
    }),
  getLinks: protectedProcedure.query(async ({ ctx }) => {
    const challenges = await ctx.prisma.ctfChallenge.findMany();
    return challenges.map((item) => {
      const { flag, ...others } = item;
      return others;
    });
  }),
  addCtf: adminProcedure.input(ctfSchema).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.ctfChallenge.create({
      data: input,
    });
  }),
});
