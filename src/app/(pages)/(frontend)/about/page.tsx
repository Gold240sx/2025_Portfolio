import { api } from "~/trpc/server";

export default async function AboutPage() {
  const content = await api.siteContent.getAboutMe();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 text-white">
      <div className="container mx-auto max-w-2xl">
        <h1 className="mb-8 text-4xl font-bold">About Me</h1>
        <div
          className="prose prose-invert max-w-none whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </main>
  );
}
