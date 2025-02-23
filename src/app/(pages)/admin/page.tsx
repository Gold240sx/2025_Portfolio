import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { api } from "~/trpc/server";
import { PageLayout } from "~/components/PageLayout";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  const isAdmin = await api.admin.isAdmin();
  if (!isAdmin) {
    redirect("/dashboard");
  }

  const stats = await api.admin.getStats();

  return (
    <PageLayout>
      <div className="mx-auto w-full max-w-4xl py-16">
        <h1 className="mb-8 text-4xl font-bold">Admin Dashboard</h1>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-white/5 p-6">
            <h3 className="mb-2 text-lg font-medium text-gray-400">
              Total Users
            </h3>
            <p className="text-3xl font-bold">{stats.totalUsers}</p>
          </div>
          <div className="rounded-lg bg-white/5 p-6">
            <h3 className="mb-2 text-lg font-medium text-gray-400">
              Total Posts
            </h3>
            <p className="text-3xl font-bold">{stats.totalPosts}</p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
