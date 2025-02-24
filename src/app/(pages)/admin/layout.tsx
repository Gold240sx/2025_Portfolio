import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { api } from "~/trpc/server";
import { AppSidebar } from "~/components/AppSidebar";
import { Navbar } from "~/components/Navbar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  const isAdmin = await api.admin.isAdmin();
  if (!isAdmin) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen w-screen text-black dark:text-white">
      <AppSidebar />
      <div className="relative flex w-full flex-col">
        <div className=""></div>
        <main className="flex-1 md:p-6">{children}</main>
      </div>
    </div>
  );
}
