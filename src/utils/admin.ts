import { type Session } from "next-auth";
import { prisma } from "~/server/db";

export const isAdmin = async (session: Session) => {
  if (!session.user.email) return false;

  const admin = await prisma.admin.findFirst({
    where: {
      email: session.user.email,
    },
  });

  return !!admin;
};
