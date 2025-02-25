import { Navbar } from "~/components/Navbar";
import { PageLayout } from "~/components/PageLayout";

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-screen flex-col dark:text-white">
      <Navbar />
      <PageLayout>{children}</PageLayout>
    </div>
  );
}
