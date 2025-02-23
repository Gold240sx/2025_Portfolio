import { auth } from "~/server/auth";
import Link from "next/link";
import { SignInButton } from "~/components/auth/SignInButton";

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col items-center justify-center">
        <h1 className="mb-8 text-4xl font-bold">Welcome to My Blog</h1>

        {session ? (
          <div className="text-center">
            <p className="mb-4">Welcome back, {session.user.name}!</p>
            <Link
              href="/blog"
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              View Blog Posts
            </Link>
          </div>
        ) : (
          <div className="text-center">
            <p className="mb-4">Sign in to get started</p>
            <SignInButton />
          </div>
        )}
      </div>
    </div>
  );
}
