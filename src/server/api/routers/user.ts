import z from "zod";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { isAdmin } from "~/utils/admin";

export const userRouter = createTRPCRouter({
  isAdmin: protectedProcedure.query(async ({ ctx }) => {
    return await isAdmin(ctx.session);
  }),
  getAdmins: adminProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.admin.findMany();
  }),
  addAdmin: adminProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.admin.create({
        data: {
          email: input,
        },
      });
    }),
  removeAdmin: adminProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.admin.delete({
        where: {
          email: input,
        },
      });
    }),
});
