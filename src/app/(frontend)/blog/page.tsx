import { api } from "~/trpc/server";

export default async function BlogPage() {
  const posts = await api.posts.getAll();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-4xl font-bold">Blog Posts</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.docs.map((post) => (
          <article
            key={post.id}
            className="rounded-lg border border-gray-200 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
          >
            {post.featuredImage && (
              <img
                src={post.featuredImage.url}
                alt={post.title}
                className="mb-4 h-48 w-full rounded object-cover"
              />
            )}
            <h2 className="mb-2 text-2xl font-semibold">{post.title}</h2>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              By {post.author?.name || "Unknown"} •{" "}
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
            <a
              href={`/blog/${post.slug}`}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Read more →
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}
