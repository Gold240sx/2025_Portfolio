import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { PageLayout } from "~/components/PageLayout";
import { api } from "~/trpc/server";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  const isAdmin = await api.admin.isAdmin();

  return (
    <PageLayout>
      <div className="mx-auto w-full max-w-4xl py-16">
        <h1 className="mb-8 text-4xl font-bold">Dashboard</h1>

        <div className="mb-6 rounded-lg bg-white/5 p-6">
          <h2 className="mb-4 text-2xl font-semibold">
            Welcome, {session.user.name}!
          </h2>
          <div className="flex items-center gap-4">
            {session.user.image && (
              <img
                src={session.user.image}
                alt={session.user.name ?? "Profile"}
                className="h-16 w-16 rounded-full"
              />
            )}
            <div>
              <p className="text-lg">{session.user.email}</p>
              <p className="text-sm text-gray-400">
                Member since {new Date(session.user.id).toLocaleDateString()}
              </p>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="mt-2 inline-block rounded bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/20"
                >
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Add dashboard widgets/cards here */}
        </div>
      </div>
    </PageLayout>
  );
}
