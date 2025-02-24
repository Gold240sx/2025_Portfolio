import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { siteContent } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export const siteContentRouter = createTRPCRouter({
  getAboutMe: protectedProcedure.query(async ({ ctx }) => {
    const aboutMe = await ctx.db.query.siteContent.findFirst({
      where: (siteContent, { eq }) => eq(siteContent.key, "aboutMe"),
    });
    return aboutMe?.content ?? "";
  }),

  updateAboutMe: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .insert(siteContent)
        .values({
          key: "aboutMe",
          content: input.content,
          title: input.title,
          updatedAt: new Date(),
          updatedBy: ctx.session.user.name ?? "Unknown",
        })
        .onConflictDoUpdate({
          target: siteContent.key,
          set: {
            content: input.content,
            title: input.title,
            updatedAt: new Date(),
            updatedBy: ctx.session.user.name ?? "Unknown",
          },
        });
    }),

  getAboutMeTitle: publicProcedure.query(async ({ ctx }) => {
    const content = await ctx.db.query.siteContent.findFirst({
      where: (siteContent, { eq }) => eq(siteContent.key, "aboutMeTitle"),
    });
    return content?.title ?? "";
  }),

  updateAboutMeTitle: protectedProcedure
    .input(z.object({ title: z.string().min(2) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .insert(siteContent)
        .values({
          key: "aboutMeTitle",
          title: input.title,
        })
        .onConflictDoUpdate({
          target: siteContent.key,
          set: { title: input.title },
        });
    }),

  getAboutMeContent: publicProcedure.query(async ({ ctx }) => {
    const content = await ctx.db.query.siteContent.findFirst({
      where: (siteContent, { eq }) => eq(siteContent.key, "aboutMe"),
    });
    return {
      title: content?.title ?? "",
      content: content?.content ?? "",
      updatedAt: content?.updatedAt,
      updatedBy: content?.updatedBy,
    };
  }),
});
