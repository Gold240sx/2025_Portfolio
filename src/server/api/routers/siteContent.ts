import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { siteContent } from "~/server/db/schema";

export const siteContentRouter = createTRPCRouter({
  getAboutMe: protectedProcedure.query(async ({ ctx }) => {
    const aboutMe = await ctx.db.query.siteContent.findFirst({
      where: (siteContent, { eq }) => eq(siteContent.key, "aboutMe"),
    });
    return aboutMe?.content ?? "";
  }),

  updateAboutMe: protectedProcedure
    .input(z.object({ content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .insert(siteContent)
        .values({
          key: "aboutMe",
          content: input.content,
        })
        .onConflictDoUpdate({
          target: siteContent.key,
          set: { content: input.content },
        });
    }),
});
