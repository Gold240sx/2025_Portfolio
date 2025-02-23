import { notFound } from "next/navigation";
import { api } from "~/trpc/server";
import type { PayloadPost, PayloadResponse } from "~/types/payload";
import { serializeRichText } from "~/lib/richText";

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const posts = (await api.posts.getBySlug({
    slug: params.slug,
  })) as PayloadResponse<PayloadPost>;
  const post = posts.docs[0];

  console.log("Post", post);

  if (!post) {
    notFound();
  }

  const content = serializeRichText(post.content);

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="prose prose-lg dark:prose-invert mx-auto">
        {post.featuredImage && (
          <img
            src={post.featuredImage.url}
            alt={post.title}
            className="mb-8 h-64 w-full rounded-lg object-cover"
          />
        )}
        <h1 className="mb-4 text-4xl font-bold">{post.title}</h1>
        <div className="mb-8 text-gray-600 dark:text-gray-400">
          By {post.author?.name || "Unknown"} •{" "}
          {new Date(post.createdAt).toLocaleDateString()}
        </div>
        <div className="mt-4" dangerouslySetInnerHTML={{ __html: content }} />
      </article>
    </div>
  );
}
