import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { env } from "~/env";
import { TRPCError } from "@trpc/server";

export const adminRouter = createTRPCRouter({
  isAdmin: protectedProcedure.query(({ ctx }) => {
    return ctx.session.user.email === env.ADMIN_EMAIL;
  }),

  getStats: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.session.user.email !== env.ADMIN_EMAIL) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    // Add your admin stats logic here
    return {
      totalUsers: 10,
      totalPosts: 5,
      recentActivity: [],
    };
  }),
});
