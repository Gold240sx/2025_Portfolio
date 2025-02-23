import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { getPayloadClient } from "~/lib/payload";

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async () => {
    const payload = await getPayloadClient();
    const posts = await payload.find({
      collection: "posts",
      where: {
        status: {
          equals: "published",
        },
      },
      populate: ["author", "featuredImage"],
    });
    return posts;
  }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const payload = await getPayloadClient();
      const post = await payload.find({
        collection: "posts",
        where: {
          slug: {
            equals: input.slug,
          },
        },
        populate: ["author", "featuredImage"],
      });
      return post;
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.any(),
        status: z.enum(["draft", "published"]),
        slug: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const payload = await getPayloadClient();
      const post = await payload.create({
        collection: "posts",
        data: {
          ...input,
          // @ts-ignore
          author: ctx.session.user.id,
        },
      });
      return post;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        content: z.any(),
        status: z.enum(["draft", "published"]),
        slug: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const payload = await getPayloadClient();
      const post = await payload.update({
        collection: "posts",
        id: input.id,
        // @ts-ignore
        data: input,
      });
      return post;
    }),

  getLatest: publicProcedure.query(async () => {
    const payload = await getPayloadClient();
    const posts = await payload.find({
      collection: "posts",
      sort: "-createdAt",
      limit: 1,
    });
    return posts.docs[0];
  }),
});
