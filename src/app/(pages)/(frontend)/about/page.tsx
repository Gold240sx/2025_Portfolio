"use client";

import { api } from "~/trpc/react";

export default function AboutPage() {
  const { data, isLoading } = api.siteContent.getAboutMeContent.useQuery();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-4xl font-bold">{data?.title || "About Me"}</h1>
      <div
        className="prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: data?.content ?? "" }}
      />
    </div>
  );
}
